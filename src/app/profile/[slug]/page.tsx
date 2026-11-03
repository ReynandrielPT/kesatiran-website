import Link from "next/link";
import { notFound } from "next/navigation";
import membersData from "@/data/members.json";
import works from "@/data/works.json";
import { EditorialImage } from "@/components/Editorial";
import { DepthSurface } from "@/components/spatial/DepthSurface";

type Member = {
  id: string;
  slug: string;
  name: string;
  photo: string;
  role: string;
  department: string;
  institute: string;
  location?: string;
  bio_short?: string;
  bio_long?: string;
  personal_quote?: string;
  skills?: { name: string; category: string; level: string }[];
  tools?: { name: string; category: string }[];
  social_links?: Record<string, string | undefined>;
  contact_email?: string;
  resume_url?: string;
  member_since?: string;
  availability_status?: string;
  career_highlights?: { year: string; title: string; description: string }[];
  testimonials?: {
    text: string;
    author: string;
    role?: string;
    company?: string;
  }[];
  fav_songs?: string[];
  fav_media?: string[];
  website?: string;
};
export default async function ProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const members = membersData as Member[];
  const m = members.find((x) => x.slug === slug);
  if (!m) notFound();
  const projects = works.filter((w) => w.contributors.includes(m.id));
  return (
    <div className="spatial-detail" id="top">
      <Link href="/team" className="back-link">
        ← The circle
      </Link>
      <header className="profile-intro">
        <div>
          <p className="eyebrow">{m.role}</p>
          <h1>{m.name}</h1>
          <p className="detail-lead">{m.bio_short}</p>
          <div className="detail-meta">
            <span>{m.institute}</span>
            <span>{m.location}</span>
            <span>{m.availability_status}</span>
          </div>
        </div>
        <div className="profile-portrait">
          <EditorialImage
            src={m.photo}
            alt={m.name}
            priority
            sizes="(max-width:700px) 70vw, 300px"
          />
        </div>
      </header>
      <div className="detail-columns">
        <section className="spatial-panel">
          <h2>Behind the name.</h2>
          <p>{m.bio_long || m.bio_short}</p>
          {m.personal_quote && <blockquote>{m.personal_quote}</blockquote>}
          <div className="detail-socials">
            {Object.entries(m.social_links || {})
              .filter(([, url]) => url)
              .map(([label, url]) => (
                <a key={label} href={url} target="_blank" rel="noreferrer">
                  {label} ↗
                </a>
              ))}
            {m.website && <a href={m.website}>Website ↗</a>}
            {m.contact_email && (
              <a href={`mailto:${m.contact_email}`}>Email ↗</a>
            )}
            {m.resume_url && <a href={m.resume_url}>Resume ↗</a>}
          </div>
        </section>
        <DepthSurface className="spatial-panel">
          <h2>In the toolkit.</h2>
          <div className="skill-cloud">
            {m.skills?.map((s) => (
              <span key={s.name}>
                {s.name}
                <small>{s.level}</small>
              </span>
            ))}
          </div>
          <div className="tool-list">
            {m.tools?.map((t) => (
              <span key={t.name}>{t.name}</span>
            ))}
          </div>
        </DepthSurface>
      </div>
      {!!m.career_highlights?.length && (
        <section className="detail-section">
          <h2>The journey.</h2>
          <div className="journey-list">
            {m.career_highlights.map((h, i) => (
              <DepthSurface className="spatial-panel" key={i}>
                <span>{h.year}</span>
                <h3>{h.title}</h3>
                <p>{h.description}</p>
              </DepthSurface>
            ))}
          </div>
        </section>
      )}
      {!!projects.length && (
        <section className="detail-section">
          <h2>Made by {m.name.split(" ")[0]}.</h2>
          <div className="archive-grid">
            {projects.map((w) => (
              <Link href="/works" key={w.id}>
                <EditorialImage src={w.thumb} alt={w.title} />
                <h3>{w.title}</h3>
              </Link>
            ))}
          </div>
        </section>
      )}
      {!!m.testimonials?.length && (
        <section className="detail-section">
          <h2>From the circle.</h2>
          <div className="detail-columns">
            {m.testimonials.map((t, i) => (
              <blockquote className="spatial-panel" key={i}>
                <p>{t.text}</p>
                <cite>
                  {t.author} {t.role && `/ ${t.role}`}
                </cite>
              </blockquote>
            ))}
          </div>
        </section>
      )}
      {!!m.fav_songs?.length && (
        <section className="detail-section">
          <h2>On repeat.</h2>
          <div className="music-grid">
            {m.fav_songs.map((id) => (
              <iframe
                key={id}
                title={`Spotify track ${id}`}
                loading="lazy"
                src={`https://open.spotify.com/embed/track/${id}?theme=0`}
                height="152"
                allow="encrypted-media"
              />
            ))}
          </div>
        </section>
      )}
      {!!m.fav_media?.length && (
        <section className="detail-section">
          <h2>Off the clock.</h2>
          <div className="detail-socials">
            {m.fav_media.map((id) => (
              <a
                href={`https://www.imdb.com/title/${id}/`}
                key={id}
                target="_blank"
                rel="noreferrer"
              >
                View film on IMDb ↗
              </a>
            ))}
          </div>
        </section>
      )}
      <nav className="profile-next">
        <Link
          href={`/profile/${members[(members.indexOf(m) + 1) % members.length].slug}`}
        >
          Meet {members[(members.indexOf(m) + 1) % members.length].name}{" "}
          <span>↗</span>
        </Link>
      </nav>
    </div>
  );
}
