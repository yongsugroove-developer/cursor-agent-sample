import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { AppSettings, PersistedSettings, SmtpSettings } from "./types.js";

const PASSWORD_MASK = "********";

const DEFAULT_SETTINGS: AppSettings = {
  source: {
    xEnabled: true,
    threadsEnabled: true
  },
  summaryModel: "concise",
  schedule: {
    time: "09:00",
    timezone: "Asia/Seoul"
  },
  recipients: [],
  smtp: {
    host: "",
    port: 587,
    secure: false,
    user: "",
    pass: "",
    from: ""
  }
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, "../data");
const SETTINGS_PATH = path.resolve(DATA_DIR, "settings.json");

function getEncryptionKey(): Buffer {
  const secret = process.env.APP_MASTER_KEY ?? "local-dev-master-key";
  return scryptSync(secret, "sns-ai-news-collector", 32);
}

function encrypt(plainText: string): string {
  if (!plainText) {
    return "";
  }
  const iv = randomBytes(12);
  const key = getEncryptionKey();
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(plainText, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString("base64")}.${tag.toString("base64")}.${encrypted.toString("base64")}`;
}

function decrypt(encryptedText: string): string {
  if (!encryptedText) {
    return "";
  }
  const [ivBase64, tagBase64, payloadBase64] = encryptedText.split(".");
  if (!ivBase64 || !tagBase64 || !payloadBase64) {
    return "";
  }
  const key = getEncryptionKey();
  const decipher = createDecipheriv("aes-256-gcm", key, Buffer.from(ivBase64, "base64"));
  decipher.setAuthTag(Buffer.from(tagBase64, "base64"));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(payloadBase64, "base64")),
    decipher.final()
  ]);
  return decrypted.toString("utf8");
}

function toPublicSettings(data: PersistedSettings): AppSettings {
  return {
    ...data,
    smtp: {
      ...data.smtp,
      pass: data.smtp.passEncrypted ? PASSWORD_MASK : ""
    }
  };
}

function toPersistedSettings(input: AppSettings, previous?: PersistedSettings): PersistedSettings {
  let nextPassEncrypted = "";
  if (input.smtp.pass && input.smtp.pass !== PASSWORD_MASK) {
    nextPassEncrypted = encrypt(input.smtp.pass);
  } else if (input.smtp.pass === PASSWORD_MASK && previous) {
    nextPassEncrypted = previous.smtp.passEncrypted;
  }

  return {
    source: input.source,
    summaryModel: input.summaryModel,
    schedule: input.schedule,
    recipients: input.recipients,
    smtp: {
      host: input.smtp.host,
      port: input.smtp.port,
      secure: input.smtp.secure,
      user: input.smtp.user,
      from: input.smtp.from,
      passEncrypted: nextPassEncrypted
    }
  };
}

async function ensureDataDir(): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
}

export async function loadPersistedSettings(): Promise<PersistedSettings | null> {
  try {
    const raw = await readFile(SETTINGS_PATH, "utf8");
    return JSON.parse(raw) as PersistedSettings;
  } catch {
    return null;
  }
}

export async function loadSettings(): Promise<AppSettings> {
  const existing = await loadPersistedSettings();
  if (!existing) {
    return DEFAULT_SETTINGS;
  }
  return toPublicSettings(existing);
}

export async function saveSettings(input: AppSettings): Promise<AppSettings> {
  await ensureDataDir();
  const previous = await loadPersistedSettings();
  const persisted = toPersistedSettings(input, previous ?? undefined);
  await writeFile(SETTINGS_PATH, JSON.stringify(persisted, null, 2), "utf8");
  return toPublicSettings(persisted);
}

export async function getSmtpForSend(): Promise<SmtpSettings | null> {
  const persisted = await loadPersistedSettings();
  if (!persisted) {
    return null;
  }
  return {
    host: persisted.smtp.host,
    port: persisted.smtp.port,
    secure: persisted.smtp.secure,
    user: persisted.smtp.user,
    pass: decrypt(persisted.smtp.passEncrypted),
    from: persisted.smtp.from
  };
}
