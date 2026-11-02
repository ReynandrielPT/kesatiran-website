import members from "@/data/members.json";
import Link from "next/link";
import { ChapterTitle, EditorialImage } from "@/components/Editorial";
export default function TeamPage() {
  return (
    <div id="top" className="editorial-page">
      <ChapterTitle
        title="THE CIRCLE."
        label="People / Kesatiran"
        description="Different backgrounds, shared curiosity. Meet the people making this little corner of the internet their own."
      />
      <div className="people-grid">
        {members.map((m, i) => (
          <Link
            href={`/profile/${m.slug}`}
            className="person-feature"
            key={m.id}
          >
            <EditorialImage
              src={m.photo || m.avatar}
              alt={m.name}
              priority={i < 2}
            />
            <div className="person-info">
              <h2>{m.name}</h2>
              <span>↗</span>
            </div>
            <p>{m.role}</p>
            <p className="person-institute">{m.institute}</p>
          </Link>
        ))}
      </div>
      <div className="circle-note">
        <span>✳</span>
        <p>
          No single discipline.
          <br />
          Just a shared desire to make something.
        </p>
      </div>
    </div>
  );
}
