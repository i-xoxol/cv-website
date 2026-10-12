import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { google } from "googleapis";

// Use environment variable for secrets path, fallback to local for dev
const GOOGLE_SCRIPTS_DIR = process.env.GOOGLE_AUTH_PATH || "./auth";
const RECIPIENT = "igor.khokhlov@gmail.com";

const LIMITS = { name: 120, email: 254, message: 5000 };
const EMAIL_PATTERN = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]+$/;

// Simple per-address rate limit kept in memory: 5 messages per 10 minutes.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const recent = new Map<string, number[]>();

function rateLimited(key: string) {
  const now = Date.now();
  const hits = (recent.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  hits.push(now);
  recent.set(key, hits);
  if (recent.size > 5000) {
    for (const [k, v] of recent) if (v.every((t) => now - t >= WINDOW_MS)) recent.delete(k);
  }
  return hits.length > MAX_PER_WINDOW;
}

async function getAuthClient() {
  const credentials = JSON.parse(await readFile(path.join(GOOGLE_SCRIPTS_DIR, "credentials.json"), "utf8"));
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  const tokens = JSON.parse(await readFile(path.join(GOOGLE_SCRIPTS_DIR, "token.json"), "utf8"));
  oAuth2Client.setCredentials(tokens);
  return oAuth2Client;
}

/** Removes line breaks so user input cannot add mail headers. */
const oneLine = (s: string) => s.replace(/[\r\n\u2028\u2029]+/g, " ").trim();

/** RFC 2047 encoding so non-ASCII names (for example Ukrainian) survive in the subject. */
const encodeHeader = (s: string) => `=?UTF-8?B?${Buffer.from(s, "utf8").toString("base64")}?=`;

const text = (v: unknown) => (typeof v === "string" ? v : "");

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    const parsed = await req.json();
    body = parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : {};
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const name = oneLine(text(body.name));
  const email = oneLine(text(body.email));
  const message = text(body.message).trim();
  const trap = text(body.website);

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  if (name.length > LIMITS.name || email.length > LIMITS.email || message.length > LIMITS.message || !EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: "Invalid fields" }, { status: 400 });
  }

  // Bots that fill the hidden field get a normal-looking response and no email is sent.
  if (trap) {
    return NextResponse.json({ success: true });
  }

  const client = (req.headers.get("cf-connecting-ip") || req.headers.get("x-forwarded-for") || "unknown").split(",")[0].trim();
  if (rateLimited(client)) {
    return NextResponse.json({ error: "Too many messages. Please try again later." }, { status: 429 });
  }

  try {
    const auth = await getAuthClient();
    const gmail = google.gmail({ version: "v1", auth });

    const rawMessage = [
      `To: ${RECIPIENT}`,
      `Reply-To: ${email}`,
      `Subject: ${encodeHeader(`[CV Website] New message from ${name}`)}`,
      "MIME-Version: 1.0",
      "Content-Type: text/plain; charset=utf-8",
      "Content-Transfer-Encoding: base64",
      "",
      Buffer.from(
        [`Name: ${name}`, `Email: ${email}`, "", "Message:", message, "", "---", "Sent from the contact form on igor.khokhlov.org"].join("\n"),
        "utf8",
      ).toString("base64"),
    ].join("\r\n");

    const encodedMessage = Buffer.from(rawMessage).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

    await gmail.users.messages.send({
      userId: "me",
      requestBody: { raw: encodedMessage },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form delivery failed:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Message could not be sent" }, { status: 500 });
  }
}
