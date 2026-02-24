import nodemailer from "nodemailer";
import type { SmtpSettings } from "./types.js";

export async function sendDigestEmail(input: {
  smtp: SmtpSettings;
  to: string[];
  subject: string;
  body: string;
}): Promise<void> {
  if (input.to.length === 0) {
    throw new Error("Recipient list is empty.");
  }
  if (!input.smtp.host || !input.smtp.user || !input.smtp.pass || !input.smtp.from) {
    throw new Error("SMTP settings are incomplete.");
  }

  const transporter = nodemailer.createTransport({
    host: input.smtp.host,
    port: input.smtp.port,
    secure: input.smtp.secure,
    auth: {
      user: input.smtp.user,
      pass: input.smtp.pass
    }
  });

  await transporter.sendMail({
    from: input.smtp.from,
    to: input.to.join(","),
    subject: input.subject,
    text: input.body
  });
}
