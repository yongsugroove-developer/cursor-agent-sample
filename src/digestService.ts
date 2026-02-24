import { sendDigestEmail } from "./mailer.js";
import { collectNews } from "./newsProviders.js";
import { loadSettings, getSmtpForSend } from "./settingsStore.js";
import { buildDigestBody } from "./summarizer.js";
import type { DigestResult } from "./types.js";

export async function runDigestOnce(): Promise<DigestResult> {
  const settings = await loadSettings();
  const smtp = await getSmtpForSend();

  if (!smtp) {
    return { sent: false, reason: "저장된 SMTP 설정이 없습니다.", collectedCount: 0 };
  }

  const newsItems = await collectNews({
    xEnabled: settings.source.xEnabled,
    threadsEnabled: settings.source.threadsEnabled
  });

  const digestBody = buildDigestBody(newsItems, settings.summaryModel);

  await sendDigestEmail({
    smtp,
    to: settings.recipients,
    subject: `[AI Digest] ${new Date().toISOString()}`,
    body: digestBody
  });

  return { sent: true, collectedCount: newsItems.length };
}
