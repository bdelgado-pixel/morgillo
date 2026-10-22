
"use client";

import { useState, type FormEvent } from "react";

/* =========================================================
   MORGILLO - ASISTENTE DE VENTAS
========================================================= */

const TELEFONO_MORGILLO = "51994974243";

const OPCIONES = [
  { id: "Tractor", texto: "🚜 Un tractor para mi chacra" },
  { id: "Excavadora", texto: "🚧 Una excavadora" },
  { id: "Construcción", texto: "🏗️ Máquina para construcción" },
  { id: "Repuestos", texto: "🔧 Repuestos o reparación" },
  { id: "Otro", texto: "💬 Otra consulta" },
];

export default function WhatsAppButton() {
  const [abierto, setAbierto] = useState(false);
  const [paso, setPaso] = useState(1);

  const [maquina, setMaquina] = useState("");
  const [modelo, setModelo] = useState("");
  const [nombre, setNombre] = useState("");
  const [celular, setCelular] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [acepta, setAcepta] = useState(false);

  const [guardando, setGuardando] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [error, setError] = useState("");

  const numeroLimpio = celular.replace(/\D/g, "");
  const celularValido = /^9\d{8}$/.test(numeroLimpio);

  const mensaje = [
    "Hola, soy " + nombre + ".",
    "Estoy interesado en: " + maquina + ".",
    modelo ? "Máquina o modelo: " + modelo + "." : "",
    "Soy de: " + ciudad + ".",
    "Mi celular es: " + numeroLimpio + ".",
    "Quiero hablar con un asesor de Morgillo.",
  ]
    .filter(Boolean)
    .join("\n");

  const enlaceWhatsApp =
    `https://wa.me/${TELEFONO_MORGILLO}?text=${
      encodeURIComponent(mensaje)
    }`;

  function cerrar() {
    setAbierto(false);
  }

  function reiniciar() {
    setPaso(1);
    setMaquina("");
    setModelo("");
    setNombre("");
    setCelular("");
    setCiudad("");
    setAcepta(false);
    setGuardado(false);
    setError("");
  }

  async function enviarDatos(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!nombre.trim() || !ciudad.trim() || !celularValido) {
      setError("Revisa tu nombre, ciudad y número de celular.");
      return;
    }

    if (!acepta) {
      setError("Necesitamos tu permiso para contactarte.");
      return;
    }

    setGuardando(true);

    try {
      const respuesta = await fetch("/api/interesados", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: nombre.trim(),
          celular: numeroLimpio,
          ciudad: ciudad.trim(),
          maquina,
          modelo: modelo.trim(),
          consentimiento: true,
          origen: window.location.pathname,
        }),
      });

      if (!respuesta.ok) {
        throw new Error("No se pudo registrar la consulta.");
      }

      setGuardado(true);
    } catch {
      setError(
        "Todavía no pudimos guardar tus datos. " +
        "Puedes intentar nuevamente o escribirnos por WhatsApp."
      );
    } finally {
      setGuardando(false);
    }
  }

  const campo: React.CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid #d9dfe1",
    borderRadius: "10px",
    padding: "12px",
    fontSize: "16px",
    color: "#202624",
    background: "#ffffff",
    outlineColor: "#25D366",
  };

  const botonVerde: React.CSSProperties = {
    width: "100%",
    border: "none",
    borderRadius: "10px",
    background: "#168a48",
    color: "#ffffff",
    padding: "14px",
    fontWeight: 800,
    fontSize: "15px",
    cursor: "pointer",
  };

  return (
    <>
      {/* =============================================
          BOTÓN FLOTANTE ORIGINAL
      ============================================= */}

      <button
        type="button"
        onClick={() => setAbierto(!abierto)}
        aria-label="Abrir asistente de Morgillo"
        aria-expanded={abierto}
        title="¡Te ayudamos a encontrar tu máquina!"
        style={{
          position: "fixed",
          bottom: "28px",
          right: "28px",
          width: "60px",
          height: "60px",
          backgroundColor: "#25D366",
          borderRadius: "50%",
          border: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0,0,0,0.18)",
          transition: "transform 0.2s ease",
        }}
      >
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
      </button>

      {/* =============================================
          VENTANA DEL ASISTENTE
      ============================================= */}

      {abierto && (
        <section
          role="dialog"
          aria-modal="false"
          aria-label="Asistente de ventas Morgillo"
          style={{
            position: "fixed",
            right: "12px",
            bottom: "100px",
            width: "365px",
            maxWidth: "calc(100vw - 24px)",
            maxHeight: "min(75vh, 650px)",
            overflowY: "auto",
            background: "#ffffff",
            borderRadius: "16px",
            boxShadow: "0 8px 35px rgba(0,0,0,0.25)",
            zIndex: 9999,
            fontFamily: "Arial, sans-serif",
            color: "#202624",
          }}
        >
          {/* ENCABEZADO */}

          <div
            style={{
              background: "#168a48",
              color: "#ffffff",
              padding: "18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
            }}
          >
            <div>
              <strong style={{ fontSize: "17px" }}>
                🚜 Morgillo
              </strong>

              <p
                style={{
                  margin: "5px 0 0",
                  fontSize: "12px",
                }}
              >
                Estamos aquí para ayudarte
              </p>
            </div>

            <button
              type="button"
              onClick={cerrar}
              aria-label="Cerrar asistente"
              style={{
                background: "transparent",
                border: "none",
                color: "white",
                fontSize: "26px",
                cursor: "pointer",
              }}
            >
              ×
            </button>
          </div>

          <div style={{ padding: "18px" }}>

            {/* PASO 1 - MAQUINARIA */}

            {paso === 1 && (
              <div>
                <p>
                  ¡Hola, amigo! 👋
                </p>

                <p>
                  Bienvenido a <strong>Morgillo.</strong>
                </p>

                <p>
                  Te ayudamos a encontrar la máquina
                  que necesitas.
                </p>

                <strong>
                  ¿Qué estás buscando?
                </strong>

                <div
                  style={{
                    display: "grid",
                    gap: "9px",
                    marginTop: "15px",
                  }}
                >
                  {OPCIONES.map((opcion) => (
                    <button
                      key={opcion.id}
                      type="button"
                      onClick={() => {
                        setMaquina(opcion.id);
                        setPaso(2);
                      }}
                      style={{
                        padding: "14px",
                        textAlign: "left",
                        border: "1px solid #dce4df",
                        borderRadius: "10px",
                        background: "#f6faf7",
                        fontSize: "15px",
                        color: "#202624",
                        cursor: "pointer",
                      }}
                    >
                      {opcion.texto}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* PASO 2 - DATOS DEL CLIENTE */}

            {paso === 2 && (
              <form onSubmit={enviarDatos}>
                <p>
                  ¡Muy bien! 👍
                </p>

                <p>
                  Cuéntanos unos datos para que
                  un asesor de Morgillo pueda
                  ayudarte.
                </p>

                <div
                  style={{
                    display: "grid",
                    gap: "14px",
                  }}
                >
                  <label>
                    <strong>¿Qué máquina o modelo buscas?</strong>

                    <input
                      type="text"
                      value={modelo}
                      onChange={(e) => setModelo(e.target.value)}
                      placeholder="Ej. Tractor Kubota"
                      maxLength={100}
                      style={{
                        ...campo,
                        marginTop: "7px",
                      }}
                    />
                  </label>

                  <label>
                    <strong>¿Cómo te llamas?</strong>

                    <input
                      type="text"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      placeholder="Escribe tu nombre"
                      maxLength={100}
                      required
                      style={{
                        ...campo,
                        marginTop: "7px",
                      }}
                    />
                  </label>

                  <label>
                    <strong>¿Cuál es tu celular?</strong>

                    <input
                      type="tel"
                      inputMode="numeric"
                      value={celular}
                      onChange={(e) => setCelular(e.target.value)}
                      placeholder="Ej. 999 999 999"
                      maxLength={15}
                      required
                      style={{
                        ...campo,
                        marginTop: "7px",
                      }}
                    />
                  </label>

                  <label>
                    <strong>¿De qué ciudad nos escribes?</strong>

                    <input
                      type="text"
                      value={ciudad}
                      onChange={(e) => setCiudad(e.target.value)}
                      placeholder="Ej. Tarapoto, Rioja, Moyobamba"
                      maxLength={100}
                      required
                      style={{
                        ...campo,
                        marginTop: "7px",
                      }}
                    />
                  </label>

                  <label
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "flex-start",
                      fontSize: "13px",
                      lineHeight: 1.5,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={acepta}
                      onChange={(e) =>
                        setAcepta(e.target.checked)
                      }
                      required
                      style={{
                        width: "18px",
                        height: "18px",
                        flexShrink: 0,
                      }}
                    />

                    <span>
                      Sí, quiero que Morgillo me contacte
                      por llamada o WhatsApp sobre
                      mi consulta.
                    </span>
                  </label>

                  {error && (
                    <p
                      role="alert"
                      style={{
                        color: "#b42318",
                        fontSize: "13px",
                        margin: 0,
                      }}
                    >
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={guardando}
                    style={{
                      ...botonVerde,
                      opacity: guardando ? 0.65 : 1,
                    }}
                  >
                    {guardando
                      ? "Guardando tus datos..."
                      : "Quiero que me contacten"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaso(1)}
                    style={{
                      background: "transparent",
                      border: "none",
                      padding: "8px",
                      color: "#555555",
                      cursor: "pointer",
                    }}
                  >
                    ← Volver
                  </button>
                </div>
              </form>
            )}

            {/* PASO 3 - CONTACTO REGISTRADO */}

            {guardado && (
              <div>
                <h3>
                  ¡Listo, {nombre}! ✅
                </h3>

                <p>
                  Recibimos tus datos.
                </p>

                <p>
                  Un asesor de Morgillo podrá
                  contactarte para ayudarte
                  con tu consulta.
                </p>

                <a
                  href={enlaceWhatsApp}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    ...botonVerde,
                    display: "block",
                    textAlign: "center",
                    textDecoration: "none",
                    boxSizing: "border-box",
                    marginTop: "15px",
                  }}
                >
                  💬 Hablar por WhatsApp
                </a>

                <button
                  type="button"
                  onClick={reiniciar}
                  style={{
                    marginTop: "15px",
                    background: "transparent",
                    border: "none",
                    color: "#168a48",
                    cursor: "pointer",
                  }}
                >
                  Hacer otra consulta
                </button>
              </div>
            )}

            {/* WHATSAPP DIRECTO COMO ALTERNATIVA */}

            {!guardado && (
              <p
                style={{
                  textAlign: "center",
                  marginTop: "18px",
                  fontSize: "12px",
                }}
              >
                ¿Prefieres escribir directamente?{" "}
                <a
                  href={`https://wa.me/${TELEFONO_MORGILLO}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#168a48",
                    fontWeight: 700,
                  }}
                >
                  Abrir WhatsApp
                </a>
              </p>
            )}
          </div>
        </section>
      )}
    </>
  );
}
