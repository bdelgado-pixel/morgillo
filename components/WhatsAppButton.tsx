
/* =========================================================
   MORGILLO - BOTÓN FLOTANTE DE WHATSAPP
========================================================= */

export default function WhatsAppButton() {

  // Número oficial de contacto
  const telefono = "51994974243";

  // Mensaje automático
  const mensaje =
    "¡Hola! 👋 Vengo desde la página web de Morgillo. Me gustaría recibir información y una cotización sobre sus maquinarias. 🚜";

  // Enlace de WhatsApp
  const whatsappURL =
    `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;

  return (
    <a
      href={whatsappURL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar a Morgillo por WhatsApp"
      title="¡Contáctanos por WhatsApp!"
      style={{
        position: "fixed",
        bottom: "28px",
        right: "28px",

        width: "60px",
        height: "60px",

        backgroundColor: "#25D366",
        borderRadius: "50%",

        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        textDecoration: "none",

        zIndex: 9999,

        cursor: "pointer",

        boxShadow: "0 4px 12px rgba(0,0,0,0.18)",

        transition: "transform 0.2s ease",
      }}
    >

      {/* LOGO ORIGINAL DE WHATSAPP */}

      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        width="37"
        height="37"
        fill="#FFFFFF"
        aria-hidden="true"
      >
        <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.365 2.765 1.057 3.969L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93a7.9 7.9 0 0 0-2.327-5.607M7.994 14.52a6.59 6.59 0 0 1-3.36-.92l-.24-.144-2.494.654.666-2.43-.156-.249a6.57 6.57 0 0 1-1.007-3.505c0-3.626 2.95-6.576 6.58-6.576a6.54 6.54 0 0 1 4.655 1.931 6.54 6.54 0 0 1 1.927 4.658c-.003 3.628-2.951 6.578-6.571 6.578m3.61-4.932c-.198-.099-1.17-.577-1.353-.642-.181-.066-.314-.099-.445.099-.132.197-.511.643-.626.775-.116.132-.231.148-.43.05-.197-.1-.833-.307-1.588-.98-.587-.523-.983-1.169-1.099-1.367-.115-.198-.012-.305.087-.404.089-.088.198-.231.297-.347.099-.116.132-.198.198-.33.066-.132.033-.247-.016-.347-.05-.099-.446-1.073-.611-1.47-.16-.388-.323-.335-.445-.341l-.379-.007a.73.73 0 0 0-.528.248c-.181.198-.692.676-.692 1.648s.709 1.912.808 2.044c.099.132 1.396 2.133 3.383 2.992.473.205.843.327 1.132.418.475.151.907.13 1.249.079.381-.057 1.17-.478 1.335-.94.165-.462.165-.858.116-.94-.05-.082-.182-.132-.38-.23"/>
      </svg>

    </a>
  );
}
