import Link from "next/link";

export function Footer() {
  return (
    <footer className="footer" id="footer" style={{ borderTop: 'none', background: 'transparent' }}>
      <div className="footer__container" style={{ justifyContent: 'center', padding: '1.5rem 1.25rem', display: 'flex', width: '100%' }}>
        <p className="footer__powered-by" style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', textAlign: 'center', margin: 0 }}>
          Powered by <strong>vroomdealer.pl</strong>
        </p>
      </div>
    </footer>
  );
}
