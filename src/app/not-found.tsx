import Link from "next/link";
export default function NotFound() {
  return (
    <section className="spatial-detail spatial-not-found">
      <p className="eyebrow">Outside the orbit</p>
      <h1>This corner is still unexplored.</h1>
      <p className="detail-lead">
        The page may have moved. There is plenty more to discover back in our
        world.
      </p>
      <Link href="/" className="editorial-link">
        Return home <span>↗</span>
      </Link>
    </section>
  );
}
