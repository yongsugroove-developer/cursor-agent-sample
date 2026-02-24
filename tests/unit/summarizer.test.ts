import { describe, expect, it } from "vitest";
import { buildDigestBody, summarizeItem } from "../../src/summarizer.js";
import type { NewsItem } from "../../src/types.js";

const item: NewsItem = {
  id: "1",
  title: "AI release update",
  content:
    "A major AI lab announced a new multimodal model with better reasoning quality and lower latency for production workloads.",
  source: "x",
  url: "https://example.com/news/1",
  createdAt: new Date().toISOString()
};

describe("summarizer", () => {
  it("returns concise text for concise model", () => {
    const result = summarizeItem(item, "concise");
    expect(result.length).toBeLessThanOrEqual(120);
  });

  it("builds digest body for multiple items", () => {
    const body = buildDigestBody([item, { ...item, id: "2", title: "Second news" }], "bullets");
    expect(body).toContain("1. AI release update");
    expect(body).toContain("2. Second news");
  });
});
