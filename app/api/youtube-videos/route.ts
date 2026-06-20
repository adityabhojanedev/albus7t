import { NextResponse } from "next/server";
import { getLatestVideos } from "@/lib/youtube";

// Revalidate at the route level: cache the API response for 1 hour
export const revalidate = 3600;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const maxResults = Math.min(
    parseInt(searchParams.get("maxResults") ?? "9", 10),
    50 // hard cap — YouTube API won't return more than 50 per search
  );

  try {
    const videos = await getLatestVideos(maxResults);
    return NextResponse.json({ videos });
  } catch (error) {
    console.error("[youtube-videos] API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch videos from YouTube." },
      { status: 500 }
    );
  }
}
