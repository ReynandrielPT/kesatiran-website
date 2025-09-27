"use client";

import { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Maximize2,
  ExternalLink,
  Music,
  Image,
  Video,
  Sparkles,
} from "lucide-react";
import worksData from "@/data/works.json";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import RevealOnScroll from "@/components/RevealOnScroll";

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
  const progressRef = useRef<HTMLDivElement>(null);
  const volumeRef = useRef<HTMLDivElement>(null);
  const [volume, setVolume] = useState(0.9);

  const works = worksData as Work[];
  const [discoveredAudio, setDiscoveredAudio] = useState<Work[]>([]);
  const manualAudio = works.filter((work) => work.type === "audio");
  // prefer manual entries; drop discovered ones that point to the same media
  const normalizeMedia = (m?: string) => (m || "").trim().toLowerCase();
  const manualMediaSet = new Set(
    manualAudio.map((w) => normalizeMedia(w.media))
  );
  const discoveredUnique = discoveredAudio.filter(
    (w) => !manualMediaSet.has(normalizeMedia(w.media))
  );
  const audioWorks = [...manualAudio, ...discoveredUnique]
    // still dedupe by id just in case
    .filter((w, i, arr) => arr.findIndex((x) => x.id === w.id) === i);
  const imageWorks = works.filter((work) => work.type === "image");
  const visualWorks = works.filter((work) => work.type === "visual");

  const tabs = [
    {
      id: "audio" as const,
      label: "songs",
      count: audioWorks.length,
      icon: Music,
    },
    {
      id: "image" as const,
      label: "gallery",
      count: imageWorks.length,
      icon: Image,
    },
    {
      id: "visual" as const,
      label: "video",
      count: visualWorks.length,
      icon: Video,
    },
  ];

  // Discover audio files under public/media/audio via API (no DB needed)
  useEffect(() => {
    let cancelled = false;
    fetch("/api/audio")
      .then((r) =>
        r.ok ? r.json() : Promise.reject(new Error("Failed to load /api/audio"))
      )
      .then((data) => {
        if (cancelled) return;
        const items = (data?.items || []) as Array<Partial<Work>>;
        const mapped: Work[] = items.map((it) => ({
          id: String(it.id),
          type: "audio",
          title: String(it.title ?? it.id),
          thumb: String(it.thumb ?? ""),
          media: String(it.media ?? ""),
          description: "Imported from /public/media/audio",
          tags: ["imported"],
          contributors: [],
          collaboration_type: "solo",
          duration: "",
          artist: "",
        }));
        setDiscoveredAudio(mapped);
      })
      .catch((e) => console.warn("Discover audio error:", e))
      .finally(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  // Audio player functions
  const sanitizeMediaSrc = (raw: string) => {
    if (!raw) return "";
    // Keep slashes, encode spaces and special chars
    try {
      return encodeURI(raw);
    } catch {
      return raw;
    }
  };

  const headCheck = async (url: string, timeoutMs = 4000) => {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, {
        method: "HEAD",
        signal: controller.signal,
      });
      return res.ok;
    } catch (e) {
      console.warn("HEAD check failed:", e);
      return false;
    } finally {
      clearTimeout(t);
    }
  };

  const playTrack = async (track: Work) => {
    console.log("playTrack called for:", track.title, "Media:", track.media);
    if (audioRef.current) {
      if (audioPlayer.currentTrack?.id === track.id) {
        if (audioPlayer.isPlaying) {
          audioRef.current.pause();
          setAudioPlayer((prev) => ({ ...prev, isPlaying: false }));
          console.log("Paused current track");
        } else {
          audioRef.current.play().catch((error) => {
            console.error("Audio playback failed:", error);
            setAudioPlayer((prev) => ({ ...prev, isPlaying: false }));
          });
          setAudioPlayer((prev) => ({ ...prev, isPlaying: true }));
          console.log("Resumed current track");
        }
      } else {
        console.log("Loading new track:", track.media);
        // Ensure spaces and special characters in filenames don't break playback
        const src = sanitizeMediaSrc(track.media);
        const reachable = await headCheck(src);
        if (!reachable) {
          console.error("Audio file not reachable via HEAD:", src);
          if (process.env.NODE_ENV !== "production") {
            console.warn(
              "Open this in a new tab to check:",
              window.location.origin + src
            );
          }
          setAudioPlayer((prev) => ({ ...prev, isPlaying: false }));
          return;
        }

        audioRef.current.src = src;
        // Some browsers behave better if we call load() before play
        audioRef.current.load();
        audioRef.current.muted = false;
        audioRef.current.volume = 0.9;
        try {
          await audioRef.current.play();
          console.log("Playback started for", src);
        } catch (error) {
          console.error("Audio playback failed:", error);
          setAudioPlayer((prev) => ({ ...prev, isPlaying: false }));
          return;
        }
        setAudioPlayer((prev) => ({
          ...prev,
          currentTrack: track,
          isPlaying: true,
        }));
      }
    } else {
      console.error("Audio ref is null");
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

  const seekFromClientX = (clientX: number) => {
    const el = progressRef.current;
    if (!el || !audioRef.current) return;
    const rect = el.getBoundingClientRect();
    const ratio = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
    const dur = audioPlayer.duration || audioRef.current.duration || 0;
    if (dur > 0) {
      const newTime = ratio * dur;
      audioRef.current.currentTime = newTime;
      setAudioPlayer((prev) => ({
        ...prev,
        currentTime: newTime,
        duration: dur,
      }));
    }
  };

  const startSeekDrag = (downEvent: any) => {
    // Initialize with initial click
    if (typeof downEvent.clientX === "number") {
      seekFromClientX(downEvent.clientX);
    }
    const onMove = (e: any) => {
      const clientX = e.touches ? e.touches[0]?.clientX : e.clientX;
      if (typeof clientX === "number") seekFromClientX(clientX);
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp, { once: true });
    window.addEventListener("touchmove", onMove);
    window.addEventListener("touchend", onUp, { once: true });
  };

  const setVolumeFromClientX = (clientX: number) => {
    const el = volumeRef.current;
    if (!el || !audioRef.current) return;
    const rect = el.getBoundingClientRect();
    const ratio = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
    audioRef.current.volume = ratio;
    audioRef.current.muted = false;
    setVolume(ratio);
  };

  const startVolumeDrag = (downEvent: any) => {
    if (typeof downEvent.clientX === "number") {
      setVolumeFromClientX(downEvent.clientX);
    }
    const onMove = (e: any) => {
      const clientX = e.touches ? e.touches[0]?.clientX : e.clientX;
      if (typeof clientX === "number") setVolumeFromClientX(clientX);
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp, { once: true });
    window.addEventListener("touchmove", onMove);
    window.addEventListener("touchend", onUp, { once: true });
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

    const newIndex =
      direction === "next"
        ? (lightboxIndex + 1) % lightboxGallery.length
        : (lightboxIndex - 1 + lightboxGallery.length) % lightboxGallery.length;

    setLightboxIndex(newIndex);
    setLightboxImage(lightboxGallery[newIndex]);
  };

  return (
    <div className="pt-40 min-h-screen">
      {/* Page Header */}
      <RevealOnScroll delay={0.1}>
        <div className="border-b border-border">
          <div className="container mx-auto app-container py-8">
            <div className="flex items-center gap-2 text-sm font-medium text-accent uppercase tracking-wider mb-4">
              <Sparkles size={16} /> SOME FUN PROJECTS
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4">
              <h1 className="text-4xl font-bold text-heading lowercase tracking-tight">
                our art projects
              </h1>
            </div>
            <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
              a mix of songs we made for fun (or focus), photographs & renders
              we liked enough to keep, posters & random design experiments, plus
              little motion / video things. just stuff we enjoyed creating.
            </p>
          </div>
        </div>
      </RevealOnScroll>

      {/* Tabbed Navigation */}
      <RevealOnScroll delay={0.2}>
        <div className="bg-card/30 backdrop-blur-sm">
          <div className="container mx-auto app-container">
            <nav className="flex space-x-8" aria-label="Works sections">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-all duration-300 ${
                    activeTab === tab.id
                      ? "border-accent text-accent bg-accent/5"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-accent/50 hover:bg-accent/5"
                  }`}
                >
                  <span className="flex items-center gap-2 capitalize">
                    <tab.icon className="h-4 w-4" />
                    {tab.label} ({tab.count})
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </RevealOnScroll>

      {/* Content Sections */}
      <div className="container mx-auto app-container py-8">
        {/* Audio Section */}
        {activeTab === "audio" && (
          <div className="space-y-4">
            <div className="space-y-3 enter-fade">
              {audioWorks.map((work, index) => {
                const active = audioPlayer.currentTrack?.id === work.id;
                return (
                  <RevealOnScroll key={work.id} delay={index * 0.1}>
                    <div
                      className={`group panel flex items-center gap-4 px-5 py-4 transition-all duration-300 hover:-translate-y-0.5 ${
                        active
                          ? "ring-1 ring-accent/30 shadow-md border-accent/50"
                          : "hover:border-accent/30"
                      }`}
                    >
                      {/* Thumbnail & play */}
                      <button
                        onClick={() => playTrack(work)}
                        className={`relative h-14 w-14 flex-shrink-0 rounded-lg overflow-hidden ring-1 ring-border hover:ring-accent/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent hover:scale-105 ${
                          active ? "ring-accent/50 scale-105" : ""
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
                        <div className="absolute inset-0 bg-background/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                          {active && audioPlayer.isPlaying ? (
                            <Pause className="w-5 h-5 text-foreground" />
                          ) : (
                            <Play className="w-5 h-5 text-foreground" />
                          )}
                        </div>
                        {/* THEME FIX: Replaced hardcoded white with theme-aware colors */}
                        {active && (
                          <div className="absolute bottom-1 left-1 right-1 h-1 bg-foreground/20 rounded overflow-hidden">
                            <div
                              className="h-full bg-foreground"
                              style={{
                                width: `${
                                  (audioPlayer.currentTime /
                                    (audioPlayer.duration || 1)) *
                                  100
                                }%`,
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
                          <p className="text-[11px] text-muted-foreground truncate max-w-[240px]">
                            {work.artist}
                          </p>
                        )}
                        <p className="text-[11px] text-muted-foreground/80 line-clamp-2 pr-4">
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
                        className={`p-3 rounded-full transition-all duration-300 text-accent hover:bg-accent/15 focus:outline-none focus:ring-2 focus:ring-accent hover:scale-110 ${
                          active ? "bg-accent/15 scale-110" : ""
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
                  </RevealOnScroll>
                );
              })}
            </div>
          </div>
        )}

        {/* Image Section */}
        {activeTab === "image" && (
          <div className="space-y-8">
            {imageWorks.map((work, index) => (
              <RevealOnScroll key={work.id} delay={index * 0.1}>
                <div className="panel p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                  <div className="mb-6">
                    <h3 className="font-semibold text-xl text-foreground mb-2">
                      {work.title}
                    </h3>
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {work.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {work.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-accent/10 text-accent text-xs rounded-full border border-accent/20"
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
                          className="relative aspect-square overflow-hidden rounded-lg cursor-pointer hover:scale-105 transition-all duration-300 ring-1 ring-border/50 hover:ring-accent/50 group"
                          onClick={() => openLightbox(imageSrc, work.gallery)}
                        >
                          <img
                            src={imageSrc}
                            alt={`${work.title} - ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-background/0 group-hover:bg-background/20 backdrop-blur-[1px] transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <Maximize2 className="w-8 h-8 text-foreground" />
                          </div>
                        </div>
                      ))
                    ) : (
                      <div
                        className="relative aspect-square overflow-hidden rounded-lg cursor-pointer hover:scale-105 transition-all duration-300 ring-1 ring-border/50 hover:ring-accent/50 group"
                        onClick={() => openLightbox(work.media)}
                      >
                        <img
                          src={work.media}
                          alt={work.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-background/0 group-hover:bg-background/20 backdrop-blur-[1px] transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <Maximize2 className="w-8 h-8 text-foreground" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        )}

        {/* Visual Section */}
        {activeTab === "visual" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {visualWorks.map((work, index) => (
              <RevealOnScroll key={work.id} delay={index * 0.1}>
                <div className="panel p-6 transition-shadow hover:shadow-md">
                  <div className="relative mb-6">
                    <img
                      src={work.thumb}
                      alt={work.title}
                      className="w-full aspect-video object-cover rounded-md"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-md rounded-lg opacity-0 hover:opacity-100 transition-all duration-300 cursor-pointer group">
                      <Play className="w-16 h-16 text-foreground group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="absolute bottom-3 right-3 bg-card/80 text-foreground px-3 py-1.5 rounded-lg text-sm backdrop-blur-sm border border-border/50 shadow-lg">
                      Video Demo
                    </div>
                  </div>

                  <h3 className="font-semibold text-xl text-foreground mb-2">
                    {work.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {work.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {work.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Button variant="ghost" size="sm">
                      <a
                        href={work.media}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center"
                      >
                        Watch <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                    </Button>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        )}
      </div>

      {/* Audio Player Bar */}
      {audioPlayer.currentTrack && (
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <div className="bg-secondary/80 backdrop-blur-lg border-t border-border p-4">
            <div className="container mx-auto app-container flex items-center gap-4">
              <img
                src={audioPlayer.currentTrack.thumb}
                alt={audioPlayer.currentTrack.title}
                className="w-12 h-12 rounded-md object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-foreground truncate">
                  {audioPlayer.currentTrack.title}
                </p>
                {audioPlayer.currentTrack.artist && (
                  <p className="text-xs text-muted-foreground truncate">
                    {audioPlayer.currentTrack.artist}
                  </p>
                )}
              </div>

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
                <div
                  ref={progressRef}
                  className="flex-1 bg-muted rounded-full h-1 cursor-pointer"
                  onMouseDown={(e) => startSeekDrag(e)}
                  onTouchStart={(e) => startSeekDrag(e)}
                  onClick={(e) => seekFromClientX(e.clientX)}
                  role="slider"
                  aria-label="Seek"
                  aria-valuemin={0}
                  aria-valuemax={Math.max(1, Math.floor(audioPlayer.duration))}
                  aria-valuenow={Math.floor(audioPlayer.currentTime)}
                >
                  <div
                    className="bg-accent h-full rounded-full transition-all"
                    style={{
                      width: `${
                        (audioPlayer.currentTime /
                          (audioPlayer.duration || 1)) *
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
                <div
                  ref={volumeRef}
                  className="w-24 bg-muted rounded-full h-1 cursor-pointer"
                  onMouseDown={(e) => startVolumeDrag(e)}
                  onTouchStart={(e) => startVolumeDrag(e)}
                  onClick={(e) => setVolumeFromClientX(e.clientX)}
                  role="slider"
                  aria-label="Volume"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(volume * 100)}
                >
                  <div
                    className="bg-accent h-full rounded-full"
                    style={{ width: `${Math.round(volume * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 bg-background/95 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <div
            className="relative max-w-7xl max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightboxImage}
              alt="Lightbox"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />

            {/* Navigation */}
            {lightboxGallery.length > 1 && (
              <>
                <button
                  onClick={() => navigateLightbox("prev")}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-card/80 hover:bg-card border border-border backdrop-blur-sm rounded-full text-foreground hover:text-accent transition-all shadow-lg"
                >
                  <SkipBack className="w-6 h-6" />
                </button>
                <button
                  onClick={() => navigateLightbox("next")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-card/80 hover:bg-card border border-border backdrop-blur-sm rounded-full text-foreground hover:text-accent transition-all shadow-lg"
                >
                  <SkipForward className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 p-3 bg-card/80 hover:bg-card border border-border backdrop-blur-sm rounded-full text-foreground hover:text-accent transition-all shadow-lg"
            >
              ×
            </button>

            {/* Image Counter */}
            {lightboxGallery.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-card/80 backdrop-blur-sm border border-border/50 px-3 py-1 rounded-full text-foreground text-sm shadow">
                {lightboxIndex + 1} / {lightboxGallery.length}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        preload="metadata"
        controls={false}
        aria-hidden="true"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            audioRef.current.volume = 0.7;
          }
          handleTimeUpdate();
        }}
        onLoadedData={() => {
          console.log("Audio data loaded:", audioRef.current?.src);
        }}
        onEnded={() =>
          setAudioPlayer((prev) => ({ ...prev, isPlaying: false }))
        }
        onError={(e) => {
          const el = e.currentTarget as HTMLAudioElement;
          const err = el?.error as MediaError | null;
          const code = err?.code;
          const codeMap: Record<number, string> = {
            1: "MEDIA_ERR_ABORTED",
            2: "MEDIA_ERR_NETWORK",
            3: "MEDIA_ERR_DECODE",
            4: "MEDIA_ERR_SRC_NOT_SUPPORTED",
          };
          console.error("Audio loading error:", {
            src: el?.src,
            networkState: el?.networkState,
            readyState: el?.readyState,
            code,
            codeText: code ? codeMap[code] : undefined,
          });
          setAudioPlayer((prev) => ({ ...prev, isPlaying: false }));
        }}
        onCanPlayThrough={() => {
          console.log("Audio can play through:", audioRef.current?.src);
        }}
        onLoadStart={() => {
          console.log("Audio load started:", audioRef.current?.src);
        }}
        className="hidden"
      />
    </div>
  );
}
