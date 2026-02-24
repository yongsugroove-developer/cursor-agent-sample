import type { NewsItem } from "./types.js";

const DEFAULT_QUERY = "AI OR artificial intelligence OR LLM OR generative AI";

function toNewsItem(
  id: string,
  title: string,
  content: string,
  url: string,
  source: "x" | "threads",
  createdAt: string
): NewsItem {
  return { id, title, content, url, source, createdAt };
}

async function fetchXNews(): Promise<NewsItem[]> {
  const bearer = process.env.X_BEARER_TOKEN;
  if (!bearer) {
    return [];
  }

  const endpoint =
    "https://api.twitter.com/2/tweets/search/recent" +
    `?query=${encodeURIComponent(DEFAULT_QUERY)}&max_results=10&tweet.fields=created_at,text`;
  const response = await fetch(endpoint, {
    headers: {
      Authorization: `Bearer ${bearer}`
    }
  });
  if (!response.ok) {
    return [];
  }
  const payload = (await response.json()) as {
    data?: Array<{ id: string; text: string; created_at?: string }>;
  };
  const rows = payload.data ?? [];
  return rows.map((row) =>
    toNewsItem(
      row.id,
      row.text.slice(0, 80),
      row.text,
      `https://x.com/i/web/status/${row.id}`,
      "x",
      row.created_at ?? new Date().toISOString()
    )
  );
}

async function fetchThreadsNews(): Promise<NewsItem[]> {
  const userId = process.env.THREADS_USER_ID;
  const accessToken = process.env.THREADS_ACCESS_TOKEN;
  if (!userId || !accessToken) {
    return [];
  }

  const endpoint =
    `https://graph.threads.net/v1.0/${encodeURIComponent(userId)}/threads` +
    `?fields=id,text,timestamp,permalink&access_token=${encodeURIComponent(accessToken)}`;
  const response = await fetch(endpoint);
  if (!response.ok) {
    return [];
  }
  const payload = (await response.json()) as {
    data?: Array<{ id: string; text?: string; timestamp?: string; permalink?: string }>;
  };
  const rows = payload.data ?? [];
  return rows
    .filter((row) => row.text)
    .slice(0, 10)
    .map((row) =>
      toNewsItem(
        row.id,
        (row.text ?? "").slice(0, 80),
        row.text ?? "",
        row.permalink ?? `https://www.threads.net/t/${row.id}`,
        "threads",
        row.timestamp ?? new Date().toISOString()
      )
    );
}

export async function collectNews(options: { xEnabled: boolean; threadsEnabled: boolean }): Promise<NewsItem[]> {
  const [xItems, threadItems] = await Promise.all([
    options.xEnabled ? fetchXNews() : Promise.resolve([]),
    options.threadsEnabled ? fetchThreadsNews() : Promise.resolve([])
  ]);

  const dedup = new Map<string, NewsItem>();
  [...xItems, ...threadItems].forEach((item) => {
    dedup.set(item.url, item);
  });

  return Array.from(dedup.values()).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}
