"use client";

import { useState, useRef } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Maximize2,
  ExternalLink,
} from "lucide-react";
import worksData from "@/data/works.json";
import { Button } from "@/components/ui/Button";

interface Work {
  id: string;
  type: "audio" | "image" | "visual";
  title: string;
  thumb: string;
  media: string;
  description: string;
  tags: string[];
  contributors: string[];
  collaboration_type: string;
  gallery?: string[];
  duration?: string;
  artist?: string;
}

interface AudioPlayerState {
  currentTrack: Work | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
}

export default function WorksPage() {
  const [activeTab, setActiveTab] = useState<"audio" | "image" | "visual">(
    "audio"
  );
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [lightboxGallery, setLightboxGallery] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [audioPlayer, setAudioPlayer] = useState<AudioPlayerState>({
    currentTrack: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
  });

  const audioRef = useRef<HTMLAudioElement>(null);

  const works = worksData as Work[];
  const audioWorks = works.filter((work) => work.type === "audio");
  const imageWorks = works.filter((work) => work.type === "image");
  const visualWorks = works.filter((work) => work.type === "visual");

  const tabs = [
    { id: "audio" as const, label: "songs", count: audioWorks.length },
    { id: "image" as const, label: "gallery", count: imageWorks.length },
    { id: "visual" as const, label: "video", count: visualWorks.length },
  ];

  // Audio player functions
  const playTrack = (track: Work) => {
    if (audioRef.current) {
      if (audioPlayer.currentTrack?.id === track.id) {
        if (audioPlayer.isPlaying) {
          audioRef.current.pause();
          setAudioPlayer((prev) => ({ ...prev, isPlaying: false }));
        } else {
          audioRef.current.play().catch((error) => {
            console.warn("Audio playback failed:", error);
            setAudioPlayer((prev) => ({ ...prev, isPlaying: false }));
          });
          setAudioPlayer((prev) => ({ ...prev, isPlaying: true }));
        }
      } else {
        audioRef.current.src = track.media;
        audioRef.current.play().catch((error) => {
          console.warn("Audio playback failed:", error);
          setAudioPlayer((prev) => ({ ...prev, isPlaying: false }));
        });
        setAudioPlayer((prev) => ({
          ...prev,
          currentTrack: track,
          isPlaying: true,
        }));
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setAudioPlayer((prev) => ({
        ...prev,
        currentTime: audioRef.current!.currentTime,
        duration: audioRef.current!.duration || 0,
      }));
    }
  };

  const handleSeek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Lightbox functions
  const openLightbox = (imageSrc: string, gallery?: string[]) => {
    if (gallery) {
      setLightboxGallery(gallery);
      setLightboxIndex(gallery.indexOf(imageSrc));
    } else {
      setLightboxGallery([imageSrc]);
      setLightboxIndex(0);
    }
    setLightboxImage(imageSrc);
  };

  const closeLightbox = () => {
    setLightboxImage(null);
    setLightboxGallery([]);
    setLightboxIndex(0);
  };

  const navigateLightbox = (direction: "prev" | "next") => {
    if (lightboxGallery.length === 0) return;

    let newIndex =
      direction === "next"
        ? (lightboxIndex + 1) % lightboxGallery.length
        : (lightboxIndex - 1 + lightboxGallery.length) % lightboxGallery.length;

    setLightboxIndex(newIndex);
    setLightboxImage(lightboxGallery[newIndex]);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="border-b border-border">
        <div className="container mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold text-foreground mb-4 lowercase tracking-tight">
            our art projects
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
            a mix of songs we made for fun (or focus), photographs & renders we
            liked enough to keep, posters & random design experiments, plus
            little motion / video things. just stuff we enjoyed creating.
          </p>
        </div>
      </div>

      {/* Tabbed Navigation */}
      <div className="border-b border-border">
        <div className="container mx-auto px-6">
          <nav className="flex space-x-8" aria-label="Works sections">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-accent text-accent"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content Sections */}
      <div className="container mx-auto px-6 py-8">
        {/* Audio Section */}
        {activeTab === "audio" && (
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground px-1">
              small loops & ambient bits we use while hanging out or coding.
            </p>
            <div className="space-y-3">
              {audioWorks.map((work) => {
                const active = audioPlayer.currentTrack?.id === work.id;
                return (
                  <div
                    key={work.id}
                    className={`group flex items-center gap-4 rounded-xl border px-4 py-3 bg-card/70 backdrop-blur-sm transition hover:bg-card ${
                      active ? "border-accent/60 shadow-sm" : "border-border"
                    }`}
                  >
                    {/* Thumbnail & play */}
                    <button
                      onClick={() => playTrack(work)}
                      className={`relative h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden ring-1 ring-border hover:ring-accent/50 transition focus:outline-none focus:ring-2 focus:ring-accent ${
                        active ? "ring-accent/50" : ""
                      }`}
                      aria-label={
                        active && audioPlayer.isPlaying
                          ? `Pause ${work.title}`
                          : `Play ${work.title}`
                      }
                    >
                      <img
                        src={work.thumb}
                        alt={work.title}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                        {active && audioPlayer.isPlaying ? (
                          <Pause className="w-6 h-6 text-white" />
                        ) : (
                          <Play className="w-6 h-6 text-white" />
                        )}
                      </div>
                      {active && (
                        <div className="absolute bottom-1 left-1 right-1 h-1 bg-white/30 rounded overflow-hidden">
                          <div
                            className="h-full bg-white/90"
                            style={{
                              width: `$${`{
                                (audioPlayer.currentTime /
                                  (audioPlayer.duration || 1)) * 100
                              }`}%`,
                            }}
                          />
                        </div>
                      )}
                    </button>

                    {/* Meta */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-medium truncate max-w-[220px]">
                          {work.title}
                        </h3>
                        {work.duration && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent/10 text-accent tabular-nums">
                            {work.duration}
                          </span>
                        )}
                      </div>
                      {work.artist && (
                        <p className="text-[11px] opacity-70 truncate max-w-[240px]">
                          {work.artist}
                        </p>
                      )}
                      <p className="text-[11px] opacity-60 line-clamp-2 pr-4">
                        {work.description}
                      </p>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {work.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-1.5 py-0.5 bg-accent/10 text-accent text-[10px] rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                        {work.tags.length > 3 && (
                          <span className="px-1.5 py-0.5 bg-border text-[10px] rounded-full">
                            +{work.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Play/Pause standalone for accessibility */}
                    <button
                      onClick={() => playTrack(work)}
                      className={`p-2 rounded-full transition text-accent hover:bg-accent/10 focus:outline-none focus:ring-2 focus:ring-accent ${
                        active ? "bg-accent/10" : ""
                      }`}
                      aria-label={
                        active && audioPlayer.isPlaying
                          ? `Pause ${work.title}`
                          : `Play ${work.title}`
                      }
                    >
                      {active && audioPlayer.isPlaying ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Image Section */}
        {activeTab === "image" && (
          <div className="space-y-8">
            <p className="text-xs text-muted-foreground px-1">
              photos, portrait series, rough design frames, 3d renders & static
              ideas.
            </p>
            {imageWorks.map((work) => (
              <div
                key={work.id}
                className="bg-card rounded-lg p-6 shadow-sm border border-border"
              >
                <div className="mb-6">
                  <h3 className="font-semibold text-2xl text-foreground mb-2">
                    {work.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {work.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {work.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Image Gallery */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {work.gallery ? (
                    work.gallery.map((imageSrc, index) => (
                      <div
                        key={index}
                        className="relative aspect-square overflow-hidden rounded-lg cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => openLightbox(imageSrc, work.gallery)}
                      >
                        <img
                          src={imageSrc}
                          alt={`${work.title} - ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                          <Maximize2 className="w-8 h-8 text-white" />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div
                      className="relative aspect-square overflow-hidden rounded-lg cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => openLightbox(work.media)}
                    >
                      <img
                        src={work.media}
                        alt={work.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                        <Maximize2 className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Visual Section */}
        {activeTab === "visual" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <p className="text-xs text-muted-foreground col-span-full px-1 -mt-2">
              motion pieces, prototypes & little narrated demo clips.
            </p>
            {visualWorks.map((work) => (
              <div
                key={work.id}
                className="bg-card rounded-lg p-6 shadow-sm border border-border hover:shadow-md transition-shadow"
              >
                <div className="relative mb-6">
                  <img
                    src={work.thumb}
                    alt={work.title}
                    className="w-full aspect-video object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                    <Play className="w-16 h-16 text-white" />
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/75 text-white px-2 py-1 rounded text-sm">
                    Video Demo
                  </div>
                </div>

                <h3 className="font-semibold text-xl text-foreground mb-2">
                  {work.title}
                </h3>
                <p className="text-muted-foreground mb-4">{work.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {work.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {work.gallery && (
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {work.gallery.slice(0, 3).map((imageSrc, index) => (
                      <img
                        key={index}
                        src={imageSrc}
                        alt={`${work.title} - ${index + 1}`}
                        className="w-full aspect-square object-cover rounded cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => openLightbox(imageSrc, work.gallery)}
                      />
                    ))}
                  </div>
                )}

                <Button variant="outline" size="sm" className="w-full">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Project Details
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Audio Player (Sticky Bottom) */}
      {audioPlayer.currentTrack && (
        <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border p-4 shadow-lg">
          <div className="container mx-auto">
            <div className="flex items-center gap-4">
              {/* Track Info */}
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <img
                  src={audioPlayer.currentTrack.thumb}
                  alt={audioPlayer.currentTrack.title}
                  className="w-12 h-12 rounded object-cover flex-shrink-0"
                />
                <div className="min-w-0">
                  <p className="font-medium text-sm text-foreground truncate">
                    {audioPlayer.currentTrack.title}
                  </p>
                  {audioPlayer.currentTrack.artist && (
                    <p className="text-xs text-muted-foreground truncate">
                      {audioPlayer.currentTrack.artist}
                    </p>
                  )}
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-accent/10 rounded-full transition-colors">
                  <SkipBack className="w-5 h-5 text-muted-foreground" />
                </button>

                <button
                  onClick={() =>
                    audioPlayer.currentTrack &&
                    playTrack(audioPlayer.currentTrack)
                  }
                  className="p-2 bg-accent text-accent-foreground hover:bg-accent/90 rounded-full transition-colors"
                >
                  {audioPlayer.isPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                </button>

                <button className="p-2 hover:bg-accent/10 rounded-full transition-colors">
                  <SkipForward className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Progress */}
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="text-xs text-muted-foreground tabular-nums">
                  {formatTime(audioPlayer.currentTime)}
                </span>
                <div className="flex-1 bg-muted rounded-full h-1 cursor-pointer">
                  <div
                    className="bg-accent h-full rounded-full transition-all"
                    style={{
                      width: `${
                        (audioPlayer.currentTime / audioPlayer.duration) *
                          100 || 0
                      }%`,
                    }}
                  />
                </div>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {formatTime(audioPlayer.duration)}
                </span>
              </div>

              {/* Volume */}
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-muted-foreground" />
                <div className="w-20 bg-muted rounded-full h-1">
                  <div className="bg-accent h-full rounded-full w-3/4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <div
            className="relative max-w-7xl max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightboxImage}
              alt="Lightbox"
              className="max-w-full max-h-full object-contain"
            />

            {/* Navigation */}
            {lightboxGallery.length > 1 && (
              <>
                <button
                  onClick={() => navigateLightbox("prev")}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/75 rounded-full text-white transition-colors"
                >
                  <SkipBack className="w-6 h-6" />
                </button>
                <button
                  onClick={() => navigateLightbox("next")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/75 rounded-full text-white transition-colors"
                >
                  <SkipForward className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/75 rounded-full text-white transition-colors"
            >
              ×
            </button>

            {/* Image Counter */}
            {lightboxGallery.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 px-3 py-1 rounded-full text-white text-sm">
                {lightboxIndex + 1} / {lightboxGallery.length}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onEnded={() =>
          setAudioPlayer((prev) => ({ ...prev, isPlaying: false }))
        }
        onError={(e) => {
          console.warn("Audio loading error:", e);
          setAudioPlayer((prev) => ({ ...prev, isPlaying: false }));
        }}
        className="hidden"
      />
    </div>
  );
}
