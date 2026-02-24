import request from "supertest";
import { beforeAll, describe, expect, it } from "vitest";
import { createApp } from "../../src/server.js";

describe("settings api", () => {
  const app = createApp();

  beforeAll(() => {
    process.env.NODE_ENV = "test";
  });

  it("returns default settings", async () => {
    const response = await request(app).get("/api/settings");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("source");
    expect(response.body).toHaveProperty("summaryModel");
  });

  it("saves settings and returns masked smtp password", async () => {
    const payload = {
      source: { xEnabled: true, threadsEnabled: true },
      summaryModel: "concise",
      schedule: { time: "09:30", timezone: "Asia/Seoul" },
      recipients: ["test@example.com"],
      smtp: {
        host: "smtp.example.com",
        port: 587,
        secure: false,
        user: "user",
        pass: "secret-value",
        from: "from@example.com"
      }
    };

    const saveResponse = await request(app).put("/api/settings").send(payload);
    expect(saveResponse.status).toBe(200);
    expect(saveResponse.body.smtp.pass).toBe("********");
  });
});
