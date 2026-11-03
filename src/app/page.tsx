import Link from "next/link";
import works from "@/data/works.json";
import { MemberStories } from "@/components/MemberStories";
import { ScrollText } from "@/components/motion/ScrollText";
import games from "@/data/games.json";
import { EditorialImage, TextLink } from "@/components/Editorial";
import { SplitTitle } from "@/components/motion/SplitTitle";
import { Reveal } from "@/components/motion/Reveal";
export default function Home() {
  return (
    <div className="editorial-home" id="top">
      <section className="cinema-hero">
        <EditorialImage
          src="/media/works/circle-hero-hq.webp"
          mobileSrc="/media/works/circle-portrait-hq.webp"
          sizes="100vw"
          quality={95}
          alt="The Kesatiran circle together"
          priority
          className="hero-media"
        />
        <div className="hero-shade" />
        <div className="hero-topline">
          <span>A circle of friends. A world of ideas.</span>
          <span>Indonesia · Online everywhere</span>
        </div>
        <div className="hero-title">
          <h1 aria-label="Beyond ordinary">
            <SplitTitle
              as="span"
              text="BEYOND"
              className="hero-line"
              delay={0.05}
            />
            <SplitTitle
              as="span"
              text="ORDINARY."
              className="hero-line"
              delay={0.12}
            />
          </h1>
          <div className="hero-caption">
            <p>
              We create, play, and figure it out together.
              <br />
              Welcome to our corner of the internet.
            </p>
            <Link href="#our-world" className="skew-button">
              Explore our world <span>↓</span>
            </Link>
          </div>
        </div>
        <div className="hero-bottom">
          <span>SCROLL TO EXPLORE</span>
          <span className="scroll-rule" />
          <span>EST. IN FRIENDSHIP</span>
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
