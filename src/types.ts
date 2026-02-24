export type SummaryModel = "concise" | "detailed" | "bullets";

export interface SourceSettings {
  xEnabled: boolean;
  threadsEnabled: boolean;
}

export interface ScheduleSettings {
  time: string; // HH:mm
  timezone: string;
}

export interface SmtpSettings {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
}

export interface AppSettings {
  source: SourceSettings;
  summaryModel: SummaryModel;
  schedule: ScheduleSettings;
  recipients: string[];
  smtp: SmtpSettings;
}

export interface PersistedSettings extends Omit<AppSettings, "smtp"> {
  smtp: Omit<SmtpSettings, "pass"> & {
    passEncrypted: string;
  };
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  url: string;
  source: "x" | "threads";
  createdAt: string;
}

export interface DigestResult {
  sent: boolean;
  reason?: string;
  collectedCount: number;
}
