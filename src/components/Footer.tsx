import Link from "next/link";
export function Footer() {
  return (
    <footer className="editorial-footer">
      <div className="footer-top">
        <p>
          Good things happen
          <br />
          when we make things together.
        </p>
        <Link href="/team" className="editorial-link">
          Meet the circle <span>↗</span>
        </Link>
      </div>
      <Link href="/" className="footer-wordmark">
        KESATIRAN<span>®</span>
      </Link>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Kesatiran</span>
        <div>
          <Link href="/works">Works</Link>
          <Link href="/games">Games</Link>
          <a href="https://github.com/kesatiran">Github ↗</a>
        </div>
        <a href="#top">Back to top ↑</a>
      </div>
    </footer>
  );
}
