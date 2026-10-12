"use client";

import { useState, type FormEvent } from "react";
import type { Locale } from "../data/types";
import { ui } from "../data/ui";

type State = "idle" | "sending" | "sent" | "failed" | "invalid";

export default function ContactForm({ locale }: { locale: Locale }) {
  const t = ui[locale].contact;
  const [state, setState] = useState<State>("idle");
  const [invalid, setInvalid] = useState<Record<string, boolean>>({});

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      message: String(data.get("message") ?? "").trim(),
      website: String(data.get("website") ?? ""),
    };
    const bad = {
      name: !payload.name,
      email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email),
      message: payload.message.length < 2,
    };
    setInvalid(bad);
    if (bad.name || bad.email || bad.message) {
      setState("invalid");
      return;
    }
    setState("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setState("sent");
        form.reset();
      } else if (res.status === 400) {
        setState("invalid");
      } else {
        setState("failed");
      }
    } catch {
      setState("failed");
    }
  }

  const message =
    state === "sent" ? t.sent : state === "failed" ? t.failed : state === "invalid" ? t.invalid : state === "sending" ? t.sending : "";

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      <div className="field">
        <label htmlFor="contact-name">{t.name}</label>
        <input id="contact-name" name="name" type="text" autoComplete="name" maxLength={120} required aria-invalid={invalid.name || undefined} />
      </div>
      <div className="field">
        <label htmlFor="contact-email">{t.email}</label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          maxLength={254}
          required
          aria-invalid={invalid.email || undefined}
        />
      </div>
      <div className="field">
        <label htmlFor="contact-message">{t.message}</label>
        <textarea id="contact-message" name="message" maxLength={5000} required aria-invalid={invalid.message || undefined} />
      </div>
      <div className="form__trap" aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <button className="button button--primary" type="submit" disabled={state === "sending"}>
        {state === "sending" ? t.sending : t.send}
      </button>
      <p className="form__status" role="status" aria-live="polite" data-state={state === "failed" || state === "invalid" ? "error" : state}>
        {message}
      </p>
    </form>
  );
}
