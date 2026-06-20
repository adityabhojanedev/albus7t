/**
 * lib/youtube.ts
 *
 * YOUTUBE_CHANNEL_ID supports multiple comma-separated channel IDs.
 * Example: "UCxxxx1,UCxxxx2,UCxxxx3"
 * Each channel is queried in parallel; results are merged and sorted by date.
 */

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  channelId: string;
  channelTitle: string;
}

/**
 * Fetch the latest videos from one or more YouTube channels.
 *
 * @param maxResults - Total number of videos to return (across all channels)
 * @returns Array of videos sorted by publishedAt descending
 */
export async function getLatestVideos(maxResults: number = 9): Promise<YouTubeVideo[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const rawChannelIds = process.env.YOUTUBE_CHANNEL_ID ?? "";

  if (!apiKey) {
    throw new Error("YOUTUBE_API_KEY is not set in environment variables.");
  }

  // Split comma-separated channel IDs and trim whitespace / surrounding quotes
  const channelIds = rawChannelIds
    .replace(/^["']|["']$/g, "") // strip surrounding quotes if any
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  if (channelIds.length === 0) {
    throw new Error("YOUTUBE_CHANNEL_ID is not set or contains no valid IDs.");
  }

  // Request enough videos per channel so the final merged+sliced list has maxResults
  const perChannel = Math.max(maxResults, 10);

  // Fetch each channel in parallel
  const fetchChannel = async (channelId: string): Promise<YouTubeVideo[]> => {
    const url = new URL("https://www.googleapis.com/youtube/v3/search");
    url.searchParams.set("part", "snippet");
    url.searchParams.set("channelId", channelId);
    url.searchParams.set("order", "date");
    url.searchParams.set("type", "video");
    url.searchParams.set("maxResults", String(perChannel));
    url.searchParams.set("key", apiKey);

    const res = await fetch(url.toString(), {
      // ISR: revalidate cached data every hour without a manual rebuild
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      const body = await res.text();
      console.error(`YouTube API error for channel ${channelId}: ${res.status} ${body}`);
      return [];
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = await res.json();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data.items ?? []).map((item: any): YouTubeVideo => ({
      id: item.id?.videoId ?? "",
      title: item.snippet?.title ?? "",
      description: item.snippet?.description ?? "",
      thumbnail:
        item.snippet?.thumbnails?.maxres?.url ??
        item.snippet?.thumbnails?.high?.url ??
        item.snippet?.thumbnails?.medium?.url ??
        `https://img.youtube.com/vi/${item.id?.videoId}/hqdefault.jpg`,
      publishedAt: item.snippet?.publishedAt ?? "",
      channelId: item.snippet?.channelId ?? channelId,
      channelTitle: item.snippet?.channelTitle ?? "",
    }));
  };

  const results = await Promise.all(channelIds.map(fetchChannel));

  // Merge, sort newest-first, and return top maxResults
  const merged = results.flat();
  merged.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return merged.slice(0, maxResults);
}
