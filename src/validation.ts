import type { AppSettings, SummaryModel } from "./types.js";

const VALID_MODELS: SummaryModel[] = ["concise", "detailed", "bullets"];
const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function normalizeRecipients(value: string[]): string[] {
  return value
    .map((item) => item.trim())
    .filter(Boolean)
    .filter((item, index, arr) => arr.indexOf(item) === index);
}

function isEmailLike(value: string): boolean {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value);
}

export function validateSettings(input: unknown): { ok: true; value: AppSettings } | { ok: false; error: string } {
  if (!isRecord(input)) {
    return { ok: false, error: "Payload must be an object." };
  }

  const source = input.source;
  const summaryModel = input.summaryModel;
  const schedule = input.schedule;
  const recipients = input.recipients;
  const smtp = input.smtp;

  if (!isRecord(source) || !isBoolean(source.xEnabled) || !isBoolean(source.threadsEnabled)) {
    return { ok: false, error: "source.xEnabled and source.threadsEnabled are required booleans." };
  }
  if (!isString(summaryModel) || !VALID_MODELS.includes(summaryModel as SummaryModel)) {
    return { ok: false, error: "summaryModel must be one of concise, detailed, bullets." };
  }
  if (!isRecord(schedule) || !isString(schedule.time) || !isString(schedule.timezone)) {
    return { ok: false, error: "schedule.time and schedule.timezone are required strings." };
  }
  if (!TIME_PATTERN.test(schedule.time)) {
    return { ok: false, error: "schedule.time must be HH:mm format." };
  }
  if (!Array.isArray(recipients) || recipients.some((v) => !isString(v))) {
    return { ok: false, error: "recipients must be an array of strings." };
  }
  const normalizedRecipients = normalizeRecipients(recipients);
  if (normalizedRecipients.some((email) => !isEmailLike(email))) {
    return { ok: false, error: "recipients contains invalid email format." };
  }
  if (
    !isRecord(smtp) ||
    !isString(smtp.host) ||
    typeof smtp.port !== "number" ||
    !isBoolean(smtp.secure) ||
    !isString(smtp.user) ||
    !isString(smtp.pass) ||
    !isString(smtp.from)
  ) {
    return { ok: false, error: "smtp fields are invalid." };
  }
  if (smtp.port <= 0 || smtp.port > 65535) {
    return { ok: false, error: "smtp.port must be between 1 and 65535." };
  }
  if (smtp.from && !isEmailLike(smtp.from)) {
    return { ok: false, error: "smtp.from must be a valid email format." };
  }

  return {
    ok: true,
    value: {
      source: {
        xEnabled: source.xEnabled,
        threadsEnabled: source.threadsEnabled
      },
      summaryModel: summaryModel as SummaryModel,
      schedule: {
        time: schedule.time,
        timezone: schedule.timezone
      },
      recipients: normalizedRecipients,
      smtp: {
        host: smtp.host.trim(),
        port: smtp.port,
        secure: smtp.secure,
        user: smtp.user.trim(),
        pass: smtp.pass,
        from: smtp.from.trim()
      }
    }
  };
}
