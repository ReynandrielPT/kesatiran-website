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
  X,
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

  const [isPlayerClosing, setIsPlayerClosing] = useState(false);
  // ADDED: State to manage the player's entrance animation
  const [playerMounted, setPlayerMounted] = useState(false);
  // Inline video in-card playback state
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const volumeRef = useRef<HTMLDivElement>(null);
  const [volume, setVolume] = useState(0.9);

  const works = worksData as Work[];
  const [discoveredAudio, setDiscoveredAudio] = useState<Work[]>([]);
  const manualAudio = works.filter((work) => work.type === "audio");
  const normalizeMedia = (m?: string) => (m || "").trim().toLowerCase();
  const manualMediaSet = new Set(
    manualAudio.map((w) => normalizeMedia(w.media))
  );
  const discoveredUnique = discoveredAudio.filter(
    (w) => !manualMediaSet.has(normalizeMedia(w.media))
  );
  const audioWorks = [...manualAudio, ...discoveredUnique].filter(
    (w, i, arr) => arr.findIndex((x) => x.id === w.id) === i
  );
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

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // ADDED: useEffect to handle the entrance animation logic
  useEffect(() => {
    if (audioPlayer.currentTrack && !playerMounted) {
      // Use a timeout to allow the element to mount in its initial (hidden) state first
      const timer = setTimeout(() => setPlayerMounted(true), 10);
      return () => clearTimeout(timer);
    } else if (!audioPlayer.currentTrack && playerMounted) {
      // Reset the mounted state when the player is closed
      setPlayerMounted(false);
    }
  }, [audioPlayer.currentTrack, playerMounted]);

  const sanitizeMediaSrc = (raw: string) => {
    if (!raw) return "";
    try {
      return encodeURI(raw);
    } catch {
      return raw;
    }
  };

  const openVideoInline = (work: Work) => {
    // Pause previously active video if any
    if (activeVideoId && activeVideoId !== work.id) {
      const prev = videoRefs.current[activeVideoId];
      try {
        prev?.pause();
      } catch {}
    }
    setActiveVideoId(work.id);
  };

  const closeVideoInline = () => {
    if (activeVideoId) {
      const el = videoRefs.current[activeVideoId];
      try {
        el?.pause();
      } catch {}
    }
    setActiveVideoId(null);
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
    if (audioRef.current) {
      if (audioPlayer.currentTrack?.id === track.id) {
        if (audioPlayer.isPlaying) {
          audioRef.current.pause();
          setAudioPlayer((prev) => ({ ...prev, isPlaying: false }));
        } else {
          audioRef.current.play().catch((error) => {
            console.error("Audio playback failed:", error);
            setAudioPlayer((prev) => ({ ...prev, isPlaying: false }));
          });
          setAudioPlayer((prev) => ({ ...prev, isPlaying: true }));
        }
      } else {
        setIsPlayerClosing(false);
        const src = sanitizeMediaSrc(track.media);
        const reachable = await headCheck(src);
        if (!reachable) {
          console.error("Audio file not reachable via HEAD:", src);
          setAudioPlayer((prev) => ({ ...prev, isPlaying: false }));
          return;
        }

        audioRef.current.src = src;
        audioRef.current.load();
        audioRef.current.muted = false;
        audioRef.current.volume = volume;
        try {
          await audioRef.current.play();
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

  const findCurrentTrackIndex = () => {
    if (!audioPlayer.currentTrack) return -1;
    return audioWorks.findIndex(
      (work) => work.id === audioPlayer.currentTrack!.id
    );
  };

  const playNext = () => {
    const currentIndex = findCurrentTrackIndex();
    if (currentIndex === -1) return;
    const nextIndex = (currentIndex + 1) % audioWorks.length;
    playTrack(audioWorks[nextIndex]);
  };

  const playPrevious = () => {
    const currentIndex = findCurrentTrackIndex();
    if (currentIndex === -1) return;
    const prevIndex =
      (currentIndex - 1 + audioWorks.length) % audioWorks.length;
    playTrack(audioWorks[prevIndex]);
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

  const closePlayer = () => {
    setIsPlayerClosing(true);

    setTimeout(() => {
      if (audioRef.current) {
        try {
          audioRef.current.pause();
        } catch {}
        audioRef.current.currentTime = 0;
        audioRef.current.src = "";
      }
      setAudioPlayer({
        currentTrack: null,
        isPlaying: false,
        currentTime: 0,
        duration: 0,
      });
      setIsPlayerClosing(false);
    }, 300);
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
    if (isNaN(time) || time === 0) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const openLightbox = (imageSrc: string, gallery?: string[]) => {
    if (gallery && gallery.length > 0) {
      // Normalize potential encoded/space differences when finding index
      const norm = (s: string) => {
        try {
          return decodeURI(s);
        } catch {
          return s;
        }
      };
      const idx = gallery.findIndex((g) => norm(g) === norm(imageSrc));
      setLightboxGallery(gallery);
      setLightboxIndex(idx >= 0 ? idx : 0);
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
      <RevealOnScroll delay={0.3}>
        <div className="container mx-auto app-container py-8">
          {/* Audio Section */}
          {activeTab === "audio" && (
            <div className="space-y-4">
              <div className="space-y-3">
                {audioWorks.map((work, index) => {
                  const active = audioPlayer.currentTrack?.id === work.id;
                  return (
                    <RevealOnScroll key={work.id} delay={index * 0.05}>
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
                <RevealOnScroll key={work.id} delay={index * 0.05}>
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
              {visualWorks.map((work, index) => {
                const mediaHref = sanitizeMediaSrc(work.media);
                return (
                  <RevealOnScroll key={work.id} delay={index * 0.05}>
                    <div className="panel p-6 transition-shadow hover:shadow-md">
                      <div className="relative mb-6">
                        {activeVideoId === work.id ? (
                          <div className="relative">
                            <video
                              ref={(el) => {
                                videoRefs.current[work.id] = el;
                              }}
                              src={mediaHref}
                              poster={work.thumb}
                              className="w-full aspect-video rounded-md bg-black"
                              controls
                              autoPlay
                              playsInline
                            />
                            <button
                              onClick={closeVideoInline}
                              className="absolute top-2 right-2 p-2 bg-card/80 hover:bg-card border border-border rounded-full text-foreground hover:text-accent transition-all shadow"
                              aria-label="Close video"
                              title="Close video"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <img
                              src={work.thumb}
                              alt={work.title}
                              className="w-full aspect-video object-cover rounded-md"
                            />
                            <button
                              onClick={() => openVideoInline(work)}
                              className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-md rounded-lg opacity-0 hover:opacity-100 transition-all duration-300 cursor-pointer group"
                              aria-label={`Play ${work.title}`}
                            >
                              <Play className="w-16 h-16 text-foreground group-hover:scale-110 transition-transform" />
                            </button>
                            <div className="absolute bottom-3 right-3 bg-card/80 text-foreground px-3 py-1.5 rounded-lg text-sm backdrop-blur-sm border border-border/50 shadow-lg">
                              Video Demo
                            </div>
                          </>
                        )}
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
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openVideoInline(work)}
                        >
                          <span className="flex items-center">
                            Watch <ExternalLink className="w-4 h-4 ml-2" />
                          </span>
                        </Button>
                      </div>
                    </div>
                  </RevealOnScroll>
                );
              })}
            </div>
          )}
        </div>
      </RevealOnScroll>

      {/* Audio Player Bar */}
      {audioPlayer.currentTrack && (
        <div
          className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out ${
            playerMounted && !isPlayerClosing
              ? "translate-y-0"
              : "translate-y-full"
          }`}
        >
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
                <button
                  onClick={playPrevious}
                  className="p-2 hover:bg-accent/10 rounded-full transition-colors"
                  aria-label="Previous track"
                >
                  <SkipBack className="w-5 h-5 text-muted-foreground" />
                </button>
                <button
                  onClick={() =>
                    audioPlayer.currentTrack &&
                    playTrack(audioPlayer.currentTrack)
                  }
                  className="p-2 bg-accent text-accent-foreground hover:bg-accent/90 rounded-full transition-colors"
                  aria-label={audioPlayer.isPlaying ? "Pause" : "Play"}
                >
                  {audioPlayer.isPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                </button>
                <button
                  onClick={playNext}
                  className="p-2 hover:bg-accent/10 rounded-full transition-colors"
                  aria-label="Next track"
                >
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
                  onMouseDown={startSeekDrag}
                  onTouchStart={startSeekDrag}
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
                  onMouseDown={startVolumeDrag}
                  onTouchStart={startVolumeDrag}
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

              {/* Close player button */}
              <button
                onClick={closePlayer}
                className="p-2 hover:bg-accent/10 rounded-full transition-colors"
                aria-label="Close player"
                title="Close player"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 bg-background/95 backdrop-blur-md z-[60] flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <div
            className="relative max-w-7xl max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightboxImage}
              alt="Lightbox"
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            />
            {lightboxGallery.length > 1 && (
              <>
                <button
                  onClick={() => navigateLightbox("prev")}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-card/80 hover:bg-card border border-border backdrop-blur-sm rounded-full text-foreground hover:text-accent transition-all shadow-lg"
                  aria-label="Previous image"
                >
                  <SkipBack className="w-6 h-6" />
                </button>
                <button
                  onClick={() => navigateLightbox("next")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-card/80 hover:bg-card border border-border backdrop-blur-sm rounded-full text-foreground hover:text-accent transition-all shadow-lg"
                  aria-label="Next image"
                >
                  <SkipForward className="w-6 h-6" />
                </button>
              </>
            )}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 p-3 bg-card/80 hover:bg-card border border-border backdrop-blur-sm rounded-full text-foreground hover:text-accent transition-all shadow-lg"
              aria-label="Close lightbox"
            >
              <X className="w-6 h-6" />
            </button>
            {lightboxGallery.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-card/80 backdrop-blur-sm border border-border/50 px-3 py-1 rounded-full text-foreground text-sm shadow">
                {lightboxIndex + 1} / {lightboxGallery.length}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Inline video playback: no modal */}

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            audioRef.current.volume = volume;
          }
          handleTimeUpdate();
        }}
        onEnded={playNext}
        onError={(e) => {
          console.error("Audio loading error:", e);
          setAudioPlayer((prev) => ({ ...prev, isPlaying: false }));
        }}
        className="hidden"
      />
    </div>
  );
}
