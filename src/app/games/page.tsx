import games from "@/data/games.json";
import Link from "next/link";
import { ChapterTitle, EditorialImage } from "@/components/Editorial";
export default function GamesPage() {
  return (
    <div id="top" className="editorial-page">
      <ChapterTitle
        title="AFTER HOURS."
        label="The playground / Kesatiran"
        description="Competitive streaks, late-night lobbies, and one more round. These are the worlds we spend time in together."
      />
      <div className="game-stories">
        {games.map((g, i) => (
          <Link key={g.id} href={`/games/${g.id}`} className="game-story">
            <EditorialImage src={g.cover} alt={g.title} priority={i === 0} />
            <div className="game-story-copy">
              <span className="eyebrow">
                {g.genre} / {g.platforms.join(" + ")}
              </span>
              <h2>{g.title}</h2>
              <p>{g.description}</p>
              <span className="editorial-link">
                Inside the game <span>↗</span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
