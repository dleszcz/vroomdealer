import Link from "next/link";

export default function NotFound() {
  return (
    <div className="not-found" id="not-found">
      <div className="not-found__code">404</div>
      <h1 className="not-found__title">Strona nie znaleziona</h1>
      <p className="not-found__text">
        Nie mogliśmy znaleźć strony, której szukasz.
      </p>
      <Link href="/" className="not-found__link">
        Wróć na stronę główną
      </Link>
    </div>
  );
}
