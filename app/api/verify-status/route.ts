import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");

  if (!email) {
    return new Response("Missing email", { status: 400 });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      // Connect to DB once at start
      await connectDB();

      // We'll check the DB every 3 seconds to see if the user is verified
      const interval = setInterval(async () => {
        try {
          const user = await User.findOne({ email });
          
          if (user && user.verified) {
            // Send SSE event
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ verified: true })}\n\n`)
            );
            // Close connection
            clearInterval(interval);
            controller.close();
          } else {
            // Send a keep-alive comment so the connection doesn't drop
            controller.enqueue(encoder.encode(`: keep-alive\n\n`));
          }
        } catch (error) {
          console.error("[SSE verify-status] Error checking user:", error);
          clearInterval(interval);
          controller.close();
        }
      }, 3000);

      // Clean up when the client disconnects
      req.signal.addEventListener("abort", () => {
        clearInterval(interval);
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
