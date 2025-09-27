import { NextResponse } from "next/server";
import { readdir, access } from "fs/promises";
import path from "path";

// Force Node runtime so we can use fs
export const runtime = "nodejs";

// Returns a simple list of audio files found in public/media/audio
export async function GET() {
  try {
    // Resolve audio directory robustly even if Next inferred a different workspace root
    const candidates = [
      path.join(process.cwd(), "public", "media", "audio"),
      path.join(process.cwd(), "kesatiran", "public", "media", "audio"),
    ];
    let audioDir = candidates[0];
    try {
      await access(audioDir);
    } catch {
      audioDir = candidates[1];
    }

    const files = await readdir(audioDir, { withFileTypes: true });
    const items = files
      .filter((f) => f.isFile())
      .filter((f) => /(\.mp3|\.wav|\.ogg)$/i.test(f.name))
      .map((f) => {
        const name = f.name.replace(/\.(mp3|wav|ogg)$/i, "");
        return {
          id: name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, ""),
          title: name,
          // Return raw filename; the client will encode when assigning to the audio element
          media: "/media/audio/" + f.name,
          type: "audio",
          thumb:
            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTAwJyBoZWlnaHQ9JzEwMCcgdmlld0JveD0nMCAwIDEwMCAxMDAnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc+PHJlY3Qgd2lkdGg9JzEwMCUnIGhlaWdodD0nMTAwJScgZmlsbD0nI0M5RURCNScvPjx0ZXh0IHg9JzUwJScgeT0nNTAlJyBmb250LXNpemU9JzEyJyBmaWxsPScjMTExJyB0ZXh0LWFuY2hvcj0nbWlkZGxlJz5BVURJTw==",
        };
      });

    return NextResponse.json({ items });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to read audio dir" },
      { status: 500 }
    );
  }
}
