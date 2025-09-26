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
  Sparkles,
} from "lucide-react";
import gamesData from "@/data/games.json";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import RevealOnScroll from "@/components/RevealOnScroll";

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
      className="fixed inset-0 bg-background/95 backdrop-blur-md z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-xl max-w-4xl max-h-[90vh] overflow-auto shadow-2xl border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border p-6 flex items-center justify-between rounded-t-xl">
          <h2 className="text-2xl font-bold text-foreground">{game.title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-full transition-colors text-muted-foreground hover:text-foreground"
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
                    className="flex items-center gap-2 bg-accent hover:bg-accent/80 text-accent-foreground px-6 py-3 rounded-lg transition-colors"
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
    <div className="min-h-screen pt-40">
      {" "}
      {/* Removed bg-background as it's handled by layout.tsx, adjusted pt for navbar */}
      <div className="border-b border-border">
        <div className="app-container mx-auto py-8">
          <RevealOnScroll delay={0}>
            <div className="flex items-center gap-2 text-sm font-medium text-accent uppercase tracking-wider mb-4">
              <Sparkles size={16} /> SOMETIMES WE ALSO PLAY GAMES
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4 lowercase">
              games we play together
            </h1>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
              just the stuff we squad up on. click a game to see who plays,
              ranks, settings (sens, dpi, layout) and a couple clips.
            </p>
          </RevealOnScroll>
        </div>
      </div>
      {/* Gaming Theme Decoration */}
      <div className="h-0.5 rgb-strip opacity-50" />
      {/* Filter Controls */}
      <RevealOnScroll delay={0.2}>
        <div className="app-container mx-auto py-6">
          <div className="flex flex-wrap gap-3">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setFilter(genre)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border ${
                  filter === genre
                    ? "bg-accent text-accent-foreground border-accent shadow-lg shadow-accent/20"
                    : "bg-card/80 backdrop-blur-sm text-muted-foreground border-border hover:bg-card hover:text-foreground hover:border-accent/30 hover:shadow-md"
                }`}
              >
                {genre === "all" ? "All Games" : genre}
              </button>
            ))}
          </div>
        </div>
      </RevealOnScroll>
      {/* Games Grid */}
      <div className="app-container mx-auto pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGames.map((game, index) => (
            <RevealOnScroll key={game.id} delay={index * 0.1}>
              <Link
                href={`/games/${game.id}`}
                className="panel overflow-hidden transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-accent hover:-translate-y-1 hover:shadow-md"
              >
                {/* Game Cover */}
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={game.cover}
                    alt={game.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-background/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="text-center">
                      <Play className="w-10 h-10 text-foreground mx-auto mb-2" />
                      <p className="text-foreground text-xs font-medium">
                        View Details
                      </p>
                    </div>
                  </div>

                  {/* Genre Badge */}
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-1 bg-background/75 text-foreground text-xs rounded backdrop-blur-sm border border-border/50">
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
                  <div className="flex flex-wrap gap-2 mb-3">
                    {game.platforms.map((platform) => {
                      const Icon =
                        platformIcons[platform as keyof typeof platformIcons] ||
                        Monitor;
                      return (
                        <div
                          key={platform}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary/80 backdrop-blur-sm rounded-full text-xs border border-border/50"
                        >
                          <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="text-foreground font-medium">
                            {platform}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Link>
            </RevealOnScroll>
          ))}
        </div>
      </div>
      {selectedGame &&
        false && ( // disabled modal for now
          <GameModal
            game={selectedGame!}
            isOpen={!!selectedGame}
            onClose={() => setSelectedGame(null)}
          />
        )}
    </div>
  );
}
