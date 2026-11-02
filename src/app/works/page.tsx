"use client";
import { useState, useEffect, useRef } from "react";
import works from "@/data/works.json";
import { ChapterTitle, EditorialImage } from "@/components/Editorial";
type Work = (typeof works)[number];
export default function WorksPage() {
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<Work | null>(null);
  const [index, setIndex] = useState(0);
  const close = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    if (!selected) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    close.current?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
      if (e.key === "Tab") {
        const nodes = Array.from(
          document.querySelectorAll<HTMLElement>(
            ".work-dialog button,.work-dialog video,.work-dialog audio",
          ),
        );
        const i = nodes.indexOf(document.activeElement as HTMLElement);
        e.preventDefault();
        nodes[
          (i + (e.shiftKey ? -1 : 1) + nodes.length) % nodes.length
        ]?.focus();
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", key);
      opener.current?.focus();
    };
  }, [selected]);
  const gallery = selected?.gallery?.length
    ? selected.gallery
    : [selected?.thumb || ""];
  return (
    <div id="top" className="editorial-page">
      <ChapterTitle
        title="SELECTED WORKS."
        label="The archive / Kesatiran"
        description="A collection of experiments in image, sound, and motion. Made out of curiosity. Shared because we can."
      />
      <div className="archive-filters" aria-label="Filter works">
        {["all", "visual", "image", "audio"].map((f) => (
          <button
            key={f}
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
          >
            {f === "all"
              ? "Everything"
              : f === "visual"
                ? "Motion"
                : f === "image"
                  ? "Images"
                  : "Sound"}
            <sup>
              {f === "all"
                ? works.length
                : works.filter((w) => w.type === f).length}
            </sup>
          </button>
        ))}
      </div>
      <div className="archive-grid">
        {works
          .filter((w) => filter === "all" || w.type === filter)
          .map((w, i) => (
            <button
              className="archive-work"
              key={w.id}
              onClick={(e) => {
                opener.current = e.currentTarget;
                setSelected(w);
                setIndex(0);
              }}
            >
              <EditorialImage src={w.thumb} alt={w.title} priority={i < 2} />
              <div className="work-caption">
                <h2>{w.title}</h2>
                <span>{w.type} ↗</span>
              </div>
              <p>{w.description}</p>
            </button>
          ))}
      </div>
      {selected && (
        <div
          className="work-dialog"
          role="dialog"
          aria-modal="true"
          aria-label={selected.title}
        >
          <button
            ref={close}
            className="dialog-close"
            onClick={() => setSelected(null)}
          >
            Close ×
          </button>
          <div className="dialog-content">
            <h2>{selected.title}</h2>
            {selected.type === "visual" ? (
              <video src={selected.media} controls autoPlay playsInline />
            ) : selected.type === "audio" ? (
              <>
                <EditorialImage src={selected.thumb} alt={selected.title} />
                <audio src={selected.media} controls autoPlay />
              </>
            ) : (
              <>
                <EditorialImage
                  src={gallery[index]}
                  alt={`${selected.title}, image ${index + 1}`}
                />
                {gallery.length > 1 && (
                  <div className="gallery-controls">
                    <button
                      onClick={() =>
                        setIndex((index - 1 + gallery.length) % gallery.length)
                      }
                    >
                      ← Previous
                    </button>
                    <span>
                      {index + 1} / {gallery.length}
                    </span>
                    <button
                      onClick={() => setIndex((index + 1) % gallery.length)}
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
            <p>{selected.description}</p>
          </div>
        </div>
      )}
    </div>
  );
}
