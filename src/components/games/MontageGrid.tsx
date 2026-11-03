"use client";

import { useState } from "react";
import { Play, X } from "lucide-react";

export interface GameMontage {
  id: string;
  title: string;
  thumb: string;
  video: string; // YouTube embed or local mp4 path
  createdAt: string;
}

export default function MontageGrid({ montages }: { montages: GameMontage[] }) {
  const [activeMontageId, setActiveMontageId] = useState<string | null>(null);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {montages.map((m) => {
        const isActive = activeMontageId === m.id;
        const isYouTube = /youtube\.com|youtu\.be/.test(m.video);
        const safeSrc = (() => {
          try {
            return encodeURI(m.video);
          } catch {
            return m.video;
          }
        })();
        return (
          <div
            key={m.id}
            className="group rounded-lg border border-border bg-card/70 hover:bg-card transition overflow-hidden"
          >
            <div className="relative aspect-video w-full bg-muted/40">
              {isActive ? (
                <>
                  {isYouTube ? (
                    <iframe
                      src={safeSrc}
                      title={m.title}
                      className="absolute inset-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      src={safeSrc}
                      controls
                      autoPlay
                      playsInline
                      poster={m.thumb}
                      className="absolute inset-0 w-full h-full object-cover bg-background"
                    />
                  )}
                  <button
                    onClick={() => setActiveMontageId(null)}
                    className="absolute top-2 right-2 p-2 bg-card hover:bg-card/80 border border-border rounded-full text-card-foreground hover:text-accent transition"
                    aria-label="Close clip"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setActiveMontageId(m.id)}
                  className="absolute inset-0 flex items-center justify-center"
                  aria-label={`Play ${m.title}`}
                >
                  <img
                    src={m.thumb}
                    alt={m.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-card/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <Play className="w-10 h-10 text-card-foreground" />
                  </div>
                </button>
              )}
            </div>
            <div className="p-3 space-y-1">
              <p className="text-sm font-medium truncate text-heading">
                {m.title}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {new Date(m.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
