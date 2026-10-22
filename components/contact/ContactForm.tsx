"use client";

import {
  FormEvent,
  useState,
} from "react";

import {
  ArrowUpRight,
  CheckCircle2,
  MessageCircle,
  Send,
  TriangleAlert,
} from "lucide-react";

import {
  whatsapp,
} from "@/data/site";

import styles from "./ContactForm.module.css";


type ContactFormProps = {
  whatsappNumber: string;
};


type FormStatus =
  | "idle"
  | "sending"
  | "success"
  | "error";


export default function ContactForm({
  whatsappNumber,
}: ContactFormProps) {
  const [
    name,
    setName,
  ] =
    useState("");


  const [
    phone,
    setPhone,
  ] =
    useState("");


  const [
    email,
    setEmail,
  ] =
    useState("");


  const [
    topic,
    setTopic,
  ] =
    useState(
      "Maquinaria",
    );


  const [
    message,
    setMessage,
  ] =
    useState("");


  /*
   * Honeypot.
   *
   * Un usuario real nunca
   * debería escribir aquí.
   */
  const [
    company,
    setCompany,
  ] =
    useState("");


  const [
    status,
    setStatus,
  ] =
    useState<FormStatus>(
      "idle",
    );


  const [
    feedback,
    setFeedback,
  ] =
    useState("");


  const fallbackWhatsapp =
    whatsapp(
      "Hola, quisiera realizar una consulta a Morgillo.",
      whatsappNumber,
    );


  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (company) return;

    if (!name.trim() || message.trim().length < 10) {
      setStatus("error");
      setFeedback("Escribe tu nombre y un mensaje de al menos 10 caracteres.");
      return;
    }

    const text = [
      "Hola Morgillo, quisiera realizar una consulta.",
      "",
      `Nombre: ${name.trim()}`,
      ...(phone.trim() ? [`Teléfono: ${phone.trim()}`] : []),
      `Correo: ${email.trim()}`,
      `Consulta sobre: ${topic}`,
      "",
      "Mensaje:",
      message.trim(),
    ].join("\n");

    const number = whatsappNumber.replace(/\D/g, "");
    const destination = number.length === 9 ? `51${number}` : number;
    if (!destination) {
      setStatus("error");
      setFeedback("El número de WhatsApp no está disponible. Utiliza los canales de atención.");
      return;
    }

    window.location.assign(whatsapp(text, destination));
  }
  return (
    <div
      className={
        styles.wrapper
      }
    >
      {/* =================================================
          TOP
      ================================================== */}

      <div
        className={
          styles.top
        }
      >
        <div>
          <span />

          <strong>
            WhatsApp directo
          </strong>
        </div>


        <span>
          MRG / WHATSAPP
        </span>
      </div>


      {/* =================================================
          HEADING
      ================================================== */}

      <div
        className={
          styles.heading
        }
      >
        <div
          className={
            styles.icon
          }
        >
          <MessageCircle
            size={26}
            strokeWidth={1.7}
          />
        </div>


        <p>
          Escríbenos
        </p>


        <h2>
          Envía tu consulta
          <span>
            {" "}
            a Morgillo.
          </span>
        </h2>


        <p
          className={
            styles.description
          }
        >
          Al continuar, se abrirá WhatsApp con los datos de tu consulta. Revisa el mensaje y pulsa enviar allí.
        </p>
      </div>


      {/* =================================================
          FORM
      ================================================== */}

      <form
        onSubmit={
          handleSubmit
        }
        className={
          styles.form
        }
      >
        {/* HONEYPOT */}

        <div
          className={
            styles.honeypot
          }
          aria-hidden="true"
        >
          <label
            htmlFor="contact-company"
          >
            Empresa
          </label>

          <input
            id="contact-company"
            name="company"
            type="text"
            value={
              company
            }
            onChange={(
              event,
            ) =>
              setCompany(
                event.target
                  .value,
              )
            }
            tabIndex={-1}
            autoComplete="off"
          />
        </div>


        {/* NAME + PHONE */}

        <div
          className={
            styles.row
          }
        >
          <div
            className={
              styles.field
            }
          >
            <label
              htmlFor="contact-name"
            >
              Nombre
              <span>
                *
              </span>
            </label>

            <input
              id="contact-name"
              name="name"
              type="text"
              value={
                name
              }
              onChange={(
                event,
              ) =>
                setName(
                  event.target
                    .value,
                )
              }
              placeholder="Tu nombre"
              autoComplete="name"
              maxLength={80}
              required
              disabled={
                status ===
                "sending"
              }
            />
          </div>


          <div
            className={
              styles.field
            }
          >
            <label
              htmlFor="contact-phone"
            >
              Teléfono
            </label>

            <input
              id="contact-phone"
              name="phone"
              type="tel"
              value={
                phone
              }
              onChange={(
                event,
              ) =>
                setPhone(
                  event.target
                    .value,
                )
              }
              placeholder="Tu número"
              autoComplete="tel"
              maxLength={40}
              disabled={
                status ===
                "sending"
              }
            />
          </div>
        </div>


        {/* EMAIL */}

        <div
          className={
            styles.field
          }
        >
          <label
            htmlFor="contact-email"
          >
            Correo
            <span>
              *
            </span>
          </label>

          <input
            id="contact-email"
            name="email"
            type="email"
            value={
              email
            }
            onChange={(
              event,
            ) =>
              setEmail(
                event.target
                  .value,
              )
            }
            placeholder="tu@correo.com"
            autoComplete="email"
            maxLength={254}
            required
            disabled={
              status ===
              "sending"
            }
          />
        </div>


        {/* TOPIC */}

        <div
          className={
            styles.field
          }
        >
          <label
            htmlFor="contact-topic"
          >
            Quiero consultar sobre
            <span>
              *
            </span>
          </label>

          <select
            id="contact-topic"
            name="topic"
            value={
              topic
            }
            onChange={(
              event,
            ) =>
              setTopic(
                event.target
                  .value,
              )
            }
            required
            disabled={
              status ===
              "sending"
            }
          >
            <option value="Maquinaria">
              Maquinaria
            </option>

            <option value="Servicio">
              Servicio
            </option>

            <option value="Repuestos">
              Repuestos
            </option>

            <option value="Implementos">
              Implementos
            </option>

            <option value="Otra consulta">
              Otra consulta
            </option>
          </select>
        </div>


        {/* MESSAGE */}

        <div
          className={
            styles.field
          }
        >
          <label
            htmlFor="contact-message"
          >
            Mensaje
            <span>
              *
            </span>
          </label>

          <textarea
            id="contact-message"
            name="message"
            value={
              message
            }
            onChange={(
              event,
            ) =>
              setMessage(
                event.target
                  .value,
              )
            }
            placeholder="Cuéntanos qué equipo, servicio o información necesitas."
            rows={6}
            minLength={10}
            maxLength={1200}
            required
            disabled={
              status ===
              "sending"
            }
          />


          <div
            className={
              styles.counter
            }
          >
            {
              message.length
            }
            /1200
          </div>
        </div>


        {/* FEEDBACK */}

        {status ===
          "success" && (
          <div
            className={
              styles.success
            }
            role="status"
            aria-live="polite"
          >
            <CheckCircle2
              size={20}
              strokeWidth={1.8}
            />

            <p>
              {
                feedback
              }
            </p>
          </div>
        )}


        {status ===
          "error" && (
          <div
            className={
              styles.error
            }
            role="alert"
          >
            <TriangleAlert
              size={20}
              strokeWidth={1.8}
            />

            <p>
              {
                feedback
              }
            </p>
          </div>
        )}


        {/* SUBMIT */}

        <button
          type="submit"
          className={
            styles.submit
          }
          disabled={
            status ===
            "sending"
          }
        >
          <span>
            <Send
              size={19}
              strokeWidth={1.8}
            />

            {status ===
            "sending"
              ? "Abriendo WhatsApp…"
              : "Enviar por WhatsApp"}
          </span>


          <span
            className={
              styles.submitArrow
            }
          >
            <ArrowUpRight
              size={20}
              strokeWidth={1.8}
            />
          </span>
        </button>
      </form>


      {/* =================================================
          WHATSAPP FALLBACK
      ================================================== */}

      <div
        className={
          styles.fallback
        }
      >
        <div>
          <span>
            ¿Prefieres atención
            inmediata?
          </span>

          <p>
            También puedes continuar
            por WhatsApp.
          </p>
        </div>


        <a
          href={
            fallbackWhatsapp
          }
          target="_blank"
          rel="noopener noreferrer"
        >
          <MessageCircle
            size={18}
            strokeWidth={1.8}
          />

          WhatsApp

          <ArrowUpRight
            size={17}
            strokeWidth={1.8}
          />
        </a>
      </div>
    </div>
  );
}