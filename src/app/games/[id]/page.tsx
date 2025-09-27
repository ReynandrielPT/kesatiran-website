import gamesData from "@/data/games.json";
import members from "@/data/members.json";
import { notFound } from "next/navigation";
import Link from "next/link";
import MontageGrid from "@/components/games/MontageGrid";

interface GamePlayer {
  memberId: string;
  nickname: string;
  rank?: string;
  role?: string;
  settings?: Record<string, string | number>;
}
interface GameMontage {
  id: string;
  title: string;
  thumb: string;
  video: string;
  createdAt: string;
}
interface Game {
  id: string;
  title: string;
  cover: string;
  description: string;
  tags: string[];
  platforms: string[];
  genre: string;
  releaseDate: string;
  developer: string;
  links: Record<string, string | undefined>;
  screenshots: string[];
  players?: GamePlayer[];
  montages?: GameMontage[];
}

export default function GameDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = (params as any).id ? (params as any) : ({} as any); // React 19 promise pattern fallback
  const gameList = gamesData as Game[];
  const game = gameList.find((g) => g.id === id);
  if (!game) return notFound();

  const memberMap = (members as any[]).reduce<Record<string, any>>((acc, m) => {
    acc[m.id] = m;
    return acc;
  }, {});

  return (
    <div className="min-h-screen">
      <div className="border-b border-border">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/games"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              ← back
            </Link>
          </div>
          <h1 className="text-4xl font-bold text-heading mb-2 lowercase">
            {game.title}
          </h1>
          <p className="text-muted-foreground max-w-2xl leading-relaxed text-sm">
            {game.description}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10 space-y-16">
        {/* Roster */}
        {game.players && game.players.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-4 lowercase text-heading">
              who plays
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {game.players.map((p) => {
                const m = memberMap[p.memberId];
                return (
                  <div
                    key={p.memberId + p.nickname}
                    className="rounded-lg border border-border bg-card/70 backdrop-blur-sm p-4 flex gap-4 items-start hover:bg-card transition"
                  >
                    <img
                      src={
                        m?.avatar || m?.photo || "/media/team/placeholder.jpg"
                      }
                      alt={m?.name || p.nickname}
                      className="w-14 h-14 rounded object-cover"
                    />
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Link
                          href={`/profile/${m?.slug || "#"}`}
                          className="text-sm font-medium hover:text-accent truncate max-w-[140px] text-heading"
                        >
                          {m?.name || p.nickname}
                        </Link>
                        {p.rank && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent/10 text-accent">
                            {p.rank}
                          </span>
                        )}
                      </div>
                      {p.role && (
                        <p className="text-[11px] opacity-70">{p.role}</p>
                      )}
                      <div className="text-[11px] opacity-60 flex flex-wrap gap-2">
                        {p.settings &&
                          Object.entries(p.settings)
                            .slice(0, 4)
                            .map(([k, v]) => (
                              <span
                                key={k}
                                className="px-1.5 py-0.5 rounded bg-border text-foreground/70"
                              >
                                {k}:{String(v)}
                              </span>
                            ))}
                        {p.settings && Object.keys(p.settings).length > 4 && (
                          <span className="px-1.5 py-0.5 rounded bg-border text-foreground/70">
                            +{Object.keys(p.settings).length - 4}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Settings Table */}
        {game.players && game.players.some((p) => p.settings) && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold lowercase text-heading">
              detailed settings
            </h2>
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-left">
                  <tr>
                    <th className="p-3 font-medium text-heading">player</th>
                    {Array.from(
                      new Set(
                        game.players.flatMap((p) =>
                          Object.keys(p.settings || {})
                        )
                      )
                    ).map((key) => (
                      <th
                        key={key}
                        className="p-3 font-medium whitespace-nowrap text-heading"
                      >
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {game.players.map((p) => (
                    <tr
                      key={p.memberId}
                      className="border-t border-border/60 hover:bg-muted/30"
                    >
                      <td className="p-3 font-medium text-heading whitespace-nowrap">
                        {memberMap[p.memberId]?.name || p.nickname}
                      </td>
                      {Array.from(
                        new Set(
                          (game.players || []).flatMap((pl) =>
                            Object.keys(pl.settings || {})
                          )
                        )
                      ).map((key) => (
                        <td
                          key={key}
                          className="p-3 text-muted-foreground whitespace-nowrap"
                        >
                          {p.settings && p.settings[key] !== undefined ? (
                            String(p.settings[key])
                          ) : (
                            <span className="opacity-30">—</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Montages */}
        {game.montages && game.montages.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold lowercase text-heading">
              clips & montages
            </h2>
            <MontageGrid montages={game.montages} />
          </section>
        )}
      </div>
    </div>
  );
}
