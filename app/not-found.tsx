import Link from "next/link";
export default function NotFound() {
  return (
    <div className="morgillo-container section-space empty-state">
      <p className="eyebrow">404</p>
      <h1 className="text-4xl font-bold">No encontramos esta página.</h1>
      <p className="muted my-6">
        Puedes volver al inicio o explorar nuestro catálogo.
      </p>
      <Link className="button button-red" href="/maquinaria">
        Ver maquinaria →
      </Link>
    </div>
  );
}
