import gamesData from "@/data/games.json";
import members from "@/data/members.json";
import { notFound } from "next/navigation";
import Link from "next/link";
import MontageGrid from "@/components/games/MontageGrid";
import { EditorialImage } from "@/components/Editorial";
import { DepthSurface } from "@/components/spatial/DepthSurface";

type Game = {
  id: string;
  title: string;
  cover: string;
  description: string;
  genre: string;
  platforms: string[];
  developer: string;
  releaseDate: string;
  links: Record<string, string | undefined>;
  screenshots: string[];
  players?: {
    memberId: string;
    nickname: string;
    rank?: string;
    role?: string;
    settings?: Record<string, string | number | undefined>;
  }[];
  montages?: {
    id: string;
    title: string;
    thumb: string;
    video: string;
    createdAt: string;
  }[];
};
export default async function GameDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const game = (gamesData as Game[]).find((g) => g.id === id);
  if (!game) notFound();
  const keys = [
    ...new Set(game.players?.flatMap((p) => Object.keys(p.settings || {}))),
  ];
  return (
    <div className="spatial-detail game-detail" id="top">
      <Link href="/games" className="back-link">
        ← After hours
      </Link>
      <header className="game-detail-intro">
        <div>
          <p className="eyebrow">
            {game.genre} / {game.platforms.join(" + ")}
          </p>
          <h1>{game.title}</h1>
          <p className="detail-lead">{game.description}</p>
          <div className="detail-meta">
            <span>{game.developer}</span>
            <span>{game.releaseDate}</span>
          </div>
          <div className="detail-socials">
            {Object.entries(game.links)
              .filter(([, url]) => url)
              .map(([label, url]) => (
                <a key={label} href={url} target="_blank" rel="noreferrer">
                  {label} ↗
                </a>
              ))}
          </div>
        </div>
        <div className="game-detail-cover">
          <EditorialImage
            src={game.cover}
            alt={game.title}
            priority
            sizes="(max-width:700px) 90vw, 45vw"
          />
        </div>
      </header>
      {!!game.players?.length && (
        <section className="detail-section">
          <h2>In the lobby.</h2>
          <div className="roster-grid">
            {game.players.map((p) => {
              const m = members.find((m) => m.id === p.memberId);
              return (
                <DepthSurface
                  className="spatial-panel roster-player"
                  key={p.memberId + p.nickname}
                >
                  {m && (
                    <Link href={`/profile/${m.slug}`}>
                      <EditorialImage src={m.photo} alt={m.name} sizes="90px" />
                    </Link>
                  )}
                  <div>
                    <h3>{p.nickname}</h3>
                    <p>{m?.name || p.memberId}</p>
                    <span>{[p.rank, p.role].filter(Boolean).join(" / ")}</span>
                    {m && (
                      <Link href={`/profile/${m.slug}`}>View profile ↗</Link>
                    )}
                  </div>
                </DepthSurface>
              );
            })}
          </div>
        </section>
      )}
      {!!keys.length && (
        <section className="detail-section">
          <h2>The setup.</h2>
          <div className="spatial-panel settings-table">
            <table>
              <thead>
                <tr>
                  <th>Player</th>
                  {keys.map((k) => (
                    <th key={k}>{k}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {game.players?.map((p) => (
                  <tr key={p.memberId}>
                    <td>
                      {members.find((m) => m.id === p.memberId)?.name ||
                        p.nickname}
                    </td>
                    {keys.map((k) => (
                      <td key={k}>{p.settings?.[k] ?? "—"}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
      {!!game.montages?.length && (
        <section className="detail-section">
          <h2>Worth replaying.</h2>
          <MontageGrid montages={game.montages} />
        </section>
      )}
      {!!game.screenshots.length && (
        <section className="detail-section">
          <h2>Inside the world.</h2>
          <div className="detail-gallery">
            {game.screenshots.map((src, i) => (
              <EditorialImage
                key={src}
                src={src}
                alt={`${game.title} screenshot ${i + 1}`}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
