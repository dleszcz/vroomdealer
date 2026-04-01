import Link from "next/link";

export function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="footer__container">
        <Link href="/" className="footer__brand">
          <span className="footer__logo">V</span>
          <span className="footer__brand-text">VroomDealer</span>
        </Link>
        <p className="footer__copy">
          © {new Date().getFullYear()} VroomDealer.pl — Platforma sprzedażowa
          dla komisów samochodowych.
        </p>
      </div>
    </footer>
  );
}
