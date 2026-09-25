"use client";
export default function GlobalError({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <html lang="es">
      <body
        style={{
          fontFamily: "Arial, sans-serif",
          padding: "10vh 8vw",
          background: "#111",
          color: "#fff",
        }}
      >
        <p style={{ color: "#ff767c", fontWeight: 800 }}>MORGILLO</p>
        <h1>El contenido no está disponible en este momento.</h1>
        <p>Vuelve a intentarlo en unos instantes.</p>
        <button
          onClick={reset}
          style={{
            padding: "14px 24px",
            background: "#d71920",
            color: "white",
            border: 0,
            cursor: "pointer",
          }}
        >
          Volver a intentar
        </button>
      </body>
    </html>
  );
}
