import { NextResponse } from "next/server";
const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

// Use environment variable for secrets path, fallback to local for dev
const GOOGLE_SCRIPTS_DIR = process.env.GOOGLE_AUTH_PATH || './auth';

async function getAuthClient() {
  const credentials = JSON.parse(fs.readFileSync(path.join(GOOGLE_SCRIPTS_DIR, 'credentials.json')));
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
  
  const tokens = JSON.parse(fs.readFileSync(path.join(GOOGLE_SCRIPTS_DIR, 'token.json')));
  oAuth2Client.setCredentials(tokens);
  return oAuth2Client;
}

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const auth = await getAuthClient();
    const gmail = google.gmail({ version: 'v1', auth });

    const rawMessage = [
      'To: igor.khokhlov@gmail.com',
      `Subject: [CV Website] New Message from ${name}`,
      'Content-Type: text/plain; charset=utf-8',
      '',
      `Name: ${name}`,
      `Email: ${email}`,
      '',
      `Message:`,
      message,
      '',
      '---',
      'Sent via your DIgor CV Website'
    ].join('\n');

    const encodedMessage = Buffer.from(rawMessage).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    await gmail.users.messages.send({
      userId: 'me',
      requestBody: { raw: encodedMessage }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error sending email:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
