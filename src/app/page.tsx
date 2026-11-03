import Link from "next/link";
import works from "@/data/works.json";
import { MemberStories } from "@/components/MemberStories";
import { ScrollText } from "@/components/motion/ScrollText";
import games from "@/data/games.json";
import { EditorialImage, TextLink } from "@/components/Editorial";
import { Reveal } from "@/components/motion/Reveal";
export default function Home() {
  return (
    <div className="editorial-home" id="top">
      <section className="cinema-hero spatial-hero">
        <div className="spatial-hero-copy">
          <p className="eyebrow">A shared creative universe</p>
          <h1>
            <span>Different minds.</span>
            <span>Infinite possibilities.</span>
          </h1>
          <p>
            Friends, makers, and late-night explorers. Step into the things we
            create and the worlds we share.
          </p>
          <div className="spatial-hero-links">
            <Link href="#our-world" className="skew-button">
              Enter our world ↓
            </Link>
            <Link href="/works">Explore the archive ↗</Link>
          </div>
        </div>
        <div className="spatial-hero-photo">
          <EditorialImage
            src="/media/works/circle-hero-hq.webp"
            mobileSrc="/media/works/circle-portrait-hq.webp"
            alt="The Kesatiran circle together"
            priority
            sizes="(max-width:700px) 90vw, 44vw"
            quality={90}
          />
          <span>Our own little universe.</span>
        </div>
        <div className="hero-bottom">
          <span>SCROLL TO EXPLORE</span>
          <span className="scroll-rule" />
          <span>INDONESIA / CONNECTED EVERYWHERE</span>
        </div>
      </section>
      <section className="manifesto editorial-section" id="our-world">
        <div className="section-meta">
          <span className="eyebrow">The circle</span>
          <span>People before projects</span>
        </div>
        <ScrollText
          as="h2"
          className="statement"
          text="Different minds. Same wavelength."
        />
        <div className="manifesto-copy">
          <ScrollText
            className="large-copy"
            text="A small circle making room for big ideas. Art, code, music, and everything in between."
          />
          <p>
            Some days we build. Some days we play. Most days, we learn something
            along the way. This is a collection of the things we make and the
            people behind them.
          </p>
        </div>
      </section>
      <MemberStories />
      <section className="selected-section editorial-section">
        <div className="section-meta">
          <span className="eyebrow">Selected works</span>
          <span>Ideas made real</span>
        </div>
        <Reveal>
          <h2 className="section-display">
            IN THE
            <br />
            MAKING.
          </h2>
        </Reveal>
        <div className="home-work-grid">
          {works.slice(0, 3).map((work, i) => (
            <Link
              className={`work-feature work-feature-${i}`}
              href="/works"
              key={work.id}
            >
              <EditorialImage src={work.thumb} alt={work.title} />
              <div className="work-caption">
                <span>{work.title}</span>
                <span>{work.type} ↗</span>
              </div>
            </Link>
          ))}
        </div>
        <TextLink href="/works">Explore all works</TextLink>
      </section>
      <section className="after-hours">
        <EditorialImage src={games[0].cover} alt={games[0].title} />
        <div className="after-hours-copy">
          <span className="eyebrow">When the work stops</span>
          <h2>
            AFTER
            <br />
            HOURS.
          </h2>
          <p>
            One more round. A familiar voice in the lobby.
            <br />
            The games that bring us back together.
          </p>
          <Link href="/games" className="skew-button">
            Enter the playground ↗
          </Link>
        </div>
      </section>
    </div>
  );
}
