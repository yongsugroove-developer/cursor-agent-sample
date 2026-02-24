import type { NewsItem, SummaryModel } from "./types.js";

function limitText(text: string, maxLength: number): string {
  return text.length <= maxLength ? text : `${text.slice(0, maxLength - 3)}...`;
}

export function summarizeItem(item: NewsItem, model: SummaryModel): string {
  const base = item.content.replace(/\s+/g, " ").trim();
  if (!base) {
    return item.title;
  }

  if (model === "concise") {
    return limitText(base, 120);
  }
  if (model === "detailed") {
    return limitText(base, 260);
  }

  const sentence = limitText(base, 180);
  return `- 핵심: ${sentence}\n- 출처: ${item.source.toUpperCase()}\n- 링크: ${item.url}`;
}

export function buildDigestBody(items: NewsItem[], model: SummaryModel): string {
  if (items.length === 0) {
    return "수집된 AI 뉴스가 없습니다.";
  }

  const lines = items.map((item, index) => {
    const summary = summarizeItem(item, model);
    return `${index + 1}. ${item.title}\n${summary}\n`;
  });

  return lines.join("\n");
}
