import cron, { type ScheduledTask } from "node-cron";
import { loadSettings } from "./settingsStore.js";
import { runDigestOnce } from "./digestService.js";

let scheduledTask: ScheduledTask | null = null;

function toCronExpression(time: string): string {
  const [hourText, minuteText] = time.split(":");
  const hour = Number(hourText);
  const minute = Number(minuteText);
  return `${minute} ${hour} * * *`;
}

export async function refreshSchedule(): Promise<void> {
  const settings = await loadSettings();
  const expression = toCronExpression(settings.schedule.time);

  if (scheduledTask) {
    scheduledTask.stop();
  }

  scheduledTask = cron.schedule(
    expression,
    async () => {
      try {
        await runDigestOnce();
      } catch (error) {
        console.error("Scheduled digest failed:", error);
      }
    },
    {
      timezone: settings.schedule.timezone
    }
  );
}
