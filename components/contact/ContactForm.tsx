"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowUpRight, MessageCircle, Send, TriangleAlert } from "lucide-react";
import { whatsapp } from "@/data/site";
import { contactMessage, formatContactPhone, getContactDestination, isContactPhoneValid, type ContactNumbers } from "@/lib/contact";
import styles from "./ContactForm.module.css";

export default function ContactForm({ numbers }: { numbers: ContactNumbers }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("Maquinaria");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState("");
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const destination = getContactDestination(topic, numbers);
  const fallbackWhatsapp = whatsapp("Hola, quisiera realizar una consulta a Morgillo.", destination.number);

  // Browsers may restore fields when returning from WhatsApp without firing change events.
  useEffect(() => {
    let frame = 0;
    const restore = () => {
      frame = requestAnimationFrame(() => {
        if (!formRef.current) return;
        const values = new FormData(formRef.current);
        setName(String(values.get("name") || ""));
        setPhone(String(values.get("phone") || ""));
        setEmail(String(values.get("email") || ""));
        setTopic(String(values.get("topic") || "Maquinaria"));
        setMessage(String(values.get("message") || ""));
        setCompany(String(values.get("company") || ""));
      });
    };
    restore();
    window.addEventListener("pageshow", restore);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("pageshow", restore); };
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const submitted = {
      name: String(values.get("name") || ""), phone: String(values.get("phone") || ""),
      email: String(values.get("email") || ""), topic: String(values.get("topic") || "Maquinaria"),
      message: String(values.get("message") || ""),
    };
    const target = getContactDestination(submitted.topic, numbers);
    if (values.get("company")) return;
    if (submitted.name.trim().length < 2 || !isContactPhoneValid(submitted.phone) || submitted.message.trim().length < 3) {
      setError("Escribe tu nombre, un teléfono válido y una breve consulta de al menos 3 caracteres.");
      return;
    }
    if (!target.number) {
      setError("El WhatsApp de esta área no está disponible. Utiliza los canales de atención.");
      return;
    }
    setError("");
    window.location.assign(whatsapp(contactMessage(submitted), target.number));
  }

  return <div className={styles.wrapper}>
    <div className={styles.top}><div><span /><strong>WhatsApp directo</strong></div><span>Atención por área</span></div>
    <div className={styles.heading}>
      <div className={styles.icon}><MessageCircle size={26} strokeWidth={1.7} /></div>
      <p>Escríbenos</p>
      <h2>Envía tu consulta<span> a Morgillo.</span></h2>
      <p className={styles.description}>Déjanos tu teléfono y cuéntanos qué necesitas. Te conectamos con el área indicada.</p>
    </div>
    <form ref={formRef} onSubmit={handleSubmit} className={styles.form}>
      <p className={styles.formHint}>Los campos con * son obligatorios. El correo es opcional.</p>
      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor="contact-company">Empresa</label>
        <input id="contact-company" name="company" value={company} onChange={e => setCompany(e.target.value)} tabIndex={-1} autoComplete="off" />
      </div>
      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="contact-phone">Teléfono / celular<span aria-hidden="true">*</span></label>
          <input id="contact-phone" name="phone" type="tel" inputMode="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Ej. 999 999 999" autoComplete="tel" maxLength={25} required aria-describedby="contact-phone-hint" />
          <small id="contact-phone-hint" className={styles.fieldHint}>Para responder a tu consulta.</small>
        </div>
        <div className={styles.field}>
          <label htmlFor="contact-name">Nombre<span aria-hidden="true">*</span></label>
          <input id="contact-name" name="name" value={name} onChange={e => setName(e.target.value)} placeholder="Tu nombre" autoComplete="name" minLength={2} maxLength={80} required />
        </div>
      </div>
      <div className={styles.field}>
        <label htmlFor="contact-topic">Quiero consultar sobre<span aria-hidden="true">*</span></label>
        <select id="contact-topic" name="topic" value={topic} onChange={e => setTopic(e.target.value)} required aria-describedby="contact-destination">
          <option value="Maquinaria">Maquinaria</option>
          <option value="Servicio">Servicio técnico y mantenimiento</option>
          <option value="Repuestos">Repuestos</option>
          <option value="Implementos">Implementos</option>
          <option value="Otra consulta">Otra consulta</option>
        </select>
      </div>
      <div className={styles.destination} id="contact-destination" role="status">
        <MessageCircle size={19} aria-hidden="true" /><div><span>Tu consulta irá a</span><strong>{destination.label} · {formatContactPhone(destination.number)}</strong></div>
      </div>
      <div className={styles.field}>
        <label htmlFor="contact-message">¿En qué podemos ayudarte?<span aria-hidden="true">*</span></label>
        <textarea id="contact-message" name="message" value={message} onChange={e => setMessage(e.target.value)} placeholder="Ej. Necesito un filtro para mi Kubota M108S." rows={4} minLength={3} maxLength={1200} required />
        <div className={styles.counter}>{message.length}/1200</div>
      </div>
      <div className={styles.field}>
        <label htmlFor="contact-email">Correo <small className={styles.optional}>(opcional)</small></label>
        <input id="contact-email" name="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@correo.com" autoComplete="email" maxLength={254} />
      </div>
      {error && <div className={styles.error} role="alert"><TriangleAlert size={20} /><p>{error}</p></div>}
      <button type="submit" className={styles.submit}><span><Send size={19} />Enviar por WhatsApp</span><span className={styles.submitArrow}><ArrowUpRight size={20} /></span></button>
      <p className={styles.formHint}>Se abrirá WhatsApp con tus datos preparados. Revisa el mensaje y pulsa Enviar allí.</p>
    </form>
    <div className={styles.fallback}><div><span>¿Prefieres escribir directamente?</span><p>Habla con {destination.label} por WhatsApp.</p></div><a href={fallbackWhatsapp} target="_blank" rel="noopener noreferrer"><MessageCircle size={18} />WhatsApp<ArrowUpRight size={17} /></a></div>
  </div>;
}
