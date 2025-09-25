"use client";

import { useState } from "react";
import {
  ExternalLink,
  Play,
  Calendar,
  Monitor,
  Smartphone,
  Gamepad2,
  X,
} from "lucide-react";
import gamesData from "@/data/games.json";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

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
  video: string; // can be embed URL or local mp4
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

interface GameModalProps {
  game: Game;
  isOpen: boolean;
  onClose: () => void;
}

const platformIcons = {
  PC: Monitor,
  Mac: Monitor,
  Mobile: Smartphone,
  Steam: Gamepad2,
  Switch: Gamepad2,
};

function GameModal({ game, isOpen, onClose }: GameModalProps) {
  const [currentScreenshot, setCurrentScreenshot] = useState(0);

  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-lg max-w-4xl max-h-[90vh] overflow-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">{game.title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="p-6">
          {/* Screenshot Gallery */}
          <div className="mb-8">
            <div className="relative aspect-video mb-4">
              <img
                src={game.screenshots[currentScreenshot]}
                alt={`${game.title} screenshot ${currentScreenshot + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />

              {/* Trailer Play Button */}
              {game.links.trailer && currentScreenshot === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <a
                    href={game.links.trailer}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-black/75 hover:bg-black/90 text-white px-6 py-3 rounded-lg transition-colors"
                  >
                    <Play className="w-5 h-5" />
                    Watch Trailer
                  </a>
                </div>
              )}
            </div>

            {/* Screenshot Thumbnails */}
            {game.screenshots.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {game.screenshots.map((screenshot, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentScreenshot(index)}
                    className={`flex-shrink-0 w-20 h-12 rounded overflow-hidden border-2 transition-colors ${
                      currentScreenshot === index
                        ? "border-accent"
                        : "border-transparent hover:border-muted"
                    }`}
                  >
                    <img
                      src={screenshot}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  About This Game
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {game.description}
                </p>
              </div>

              {/* Tags */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {game.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-accent/10 text-accent text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Links */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  Get the Game
                </h3>
                <div className="space-y-2">
                  {game.links.steam && (
                    <a
                      href={game.links.steam}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Steam Store
                    </a>
                  )}
                  {game.links.playstore && (
                    <a
                      href={game.links.playstore}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Google Play Store
                    </a>
                  )}
                  {game.links.appstore && (
                    <a
                      href={game.links.appstore}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      App Store
                    </a>
                  )}
                  {game.links.gog && (
                    <a
                      href={game.links.gog}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      GOG
                    </a>
                  )}
                  {game.links.website && (
                    <a
                      href={game.links.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Official Website
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
              {/* Game Details */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  Game Details
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Released:</span>
                    <span className="text-foreground">
                      {formatDate(game.releaseDate)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Gamepad2 className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Genre:</span>
                    <span className="text-foreground">{game.genre}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Monitor className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Developer:</span>
                    <span className="text-foreground">{game.developer}</span>
                  </div>
                </div>
              </div>

              {/* Platforms */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  Platforms
                </h3>
                <div className="flex flex-wrap gap-2">
                  {game.platforms.map((platform) => {
                    const Icon =
                      platformIcons[platform as keyof typeof platformIcons] ||
                      Monitor;
                    return (
                      <div
                        key={platform}
                        className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg text-sm"
                      >
                        <Icon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground">{platform}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GamesPage() {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null); // legacy modal (may be removed)
  const [filter, setFilter] = useState<"all" | string>("all");

  const games = gamesData as Game[];

  // Get unique genres for filtering
  const genres = [
    "all",
    ...Array.from(new Set(games.map((game) => game.genre))),
  ];

  // Filter games based on selected genre
  const filteredGames =
    filter === "all" ? games : games.filter((game) => game.genre === filter);

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="border-b border-border">
        <div className="container mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold text-foreground mb-4 lowercase">
            games we play together
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
            just the stuff we squad up on. click a game to see who plays, ranks,
            settings (sens, dpi, layout) and a couple clips.
          </p>
        </div>
      </div>

      {/* Gaming Theme Decoration */}
      <div className="h-1 rgb-strip opacity-50" />

      {/* Filter Controls */}
      <div className="container mx-auto px-6 py-6">
        <div className="flex flex-wrap gap-2">
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => setFilter(genre)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === genre
                  ? "bg-accent text-accent-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted-hover hover:text-foreground"
              }`}
            >
              {genre === "all" ? "All Games" : genre}
            </button>
          ))}
        </div>
      </div>

      {/* Games Grid */}
      <div className="container mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGames.map((game) => (
            <Link
              href={`/games/${game.id}`}
              key={game.id}
              className="bg-card rounded-lg overflow-hidden shadow-sm border border-border hover:shadow-md hover:border-accent/20 transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-accent"
            >
              {/* Game Cover */}
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={game.cover}
                  alt={game.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-center">
                    <Play className="w-12 h-12 text-white mx-auto mb-2" />
                    <p className="text-white text-sm font-medium">
                      View Details
                    </p>
                  </div>
                </div>

                {/* Genre Badge */}
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-1 bg-black/75 text-white text-xs rounded">
                    {game.genre}
                  </span>
                </div>
              </div>

              {/* Game Info */}
              <div className="p-4">
                <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-accent transition-colors">
                  {game.title}
                </h3>

                <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                  {game.description}
                </p>

                {/* Platforms */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {game.platforms.slice(0, 3).map((platform) => (
                    <span
                      key={platform}
                      className="px-2 py-1 bg-accent/10 text-accent text-xs rounded"
                    >
                      {platform}
                    </span>
                  ))}
                  {game.platforms.length > 3 && (
                    <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                      +{game.platforms.length - 3} more
                    </span>
                  )}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {game.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                  {game.tags.length > 2 && (
                    <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                      +{game.tags.length - 2}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredGames.length === 0 && (
          <div className="text-center py-12">
            <Gamepad2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No games found
            </h3>
            <p className="text-muted-foreground">
              Try selecting a different genre or check back later for new
              releases.
            </p>
          </div>
        )}
      </div>

      {/* Legacy modal left temporarily for reference (unused once dynamic page fully replaces) */}
      {false && (
        <GameModal
          game={selectedGame!}
          isOpen={!!selectedGame}
          onClose={() => setSelectedGame(null)}
        />
      )}
    </div>
  );
}
