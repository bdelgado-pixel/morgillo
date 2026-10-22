"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, Check, ChevronRight, HardHat, Headset, MessageSquare, Package, Send, Tractor, Truck, X } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import styles from "./WhatsAppButton.module.css";

const options = [
  { id: "Tractor", label: "Tractores agrícolas", description: "Equipos para el trabajo en campo", icon: Tractor },
  { id: "Excavadora", label: "Excavadoras", description: "Movimiento de tierra y excavación", icon: Truck },
  { id: "Construcción", label: "Maquinaria de construcción", description: "Soluciones para tu próxima obra", icon: HardHat },
  { id: "Repuestos", label: "Repuestos y servicio", description: "Piezas, mantenimiento y soporte", icon: Package },
  { id: "Otro", label: "Otra consulta", description: "Cuéntanos cómo podemos ayudarte", icon: MessageSquare },
];

export default function WhatsAppButton() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState("");
  const [model, setModel] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const launcher = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLElement>(null);

  useEffect(() => {
    if (open) panel.current?.focus();
  }, [open, step]);

  function close() { setOpen(false); launcher.current?.focus(); }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const digits = phone.replace(/\D/g, "").replace(/^51(?=9\d{8}$)/, "");
    if (name.trim().length < 2 || city.trim().length < 2 || !/^9\d{8}$/.test(digits) || !consent) {
      setError("Revisa tu nombre, ciudad, celular y autorización de contacto.");
      return;
    }
    setError("");
    const message = [
      "Hola Morgillo, quisiera recibir asesoría.",
      "",
      `Consulta: ${options.find(option => option.id === category)?.label || category}`,
      `Equipo, modelo o detalle: ${model.trim() || "Sin especificar"}`,
      `Nombre: ${name.trim()}`,
      `Celular: ${digits}`,
      `Ciudad: ${city.trim()}`,
      "Autorizo a Morgillo a contactarme sobre esta consulta.",
    ].join("\n");
    window.location.assign(`https://wa.me/51994974243?text=${encodeURIComponent(message)}`);
  }
  return <>
    <button ref={launcher} className={styles.launcher} type="button" aria-label={open ? "Cerrar asistente Morgillo" : "Abrir asistente Morgillo"} aria-expanded={open} aria-controls="morgillo-assistant" onClick={() => open ? close() : setOpen(true)}>
      {open ? <X size={28} /> : <FaWhatsapp size={34} />}
    </button>
    {open && <section ref={panel} tabIndex={-1} id="morgillo-assistant" role="dialog" aria-label="Asistente Morgillo" className={styles.panel} onKeyDown={event => { if (event.key === "Escape") close(); }}>
      <header className={styles.header}>
        <span className={styles.avatar}><Headset size={25} /></span>
        <div><strong>Morgillo</strong><p>Asistente comercial</p></div>
        <button type="button" onClick={close} aria-label="Cerrar asistente"><X size={21} /></button>
      </header>
      <div className={styles.body}>
        <div className={styles.eyebrow}>ATENCIÓN PERSONALIZADA</div>
        {step === 1 && <>
          <div className={styles.bubble}><strong>Bienvenido a Morgillo.</strong><p>Te ayudamos a encontrar maquinaria, repuestos o soporte para tu equipo.</p><p>¿En qué podemos ayudarte?</p></div>
          <div className={styles.options} aria-label="Tipo de consulta">
            {options.map(({ id, label, description, icon: Icon }) => <button type="button" key={id} onClick={() => { setCategory(id); setStep(2); }}>
              <span className={styles.optionIcon}><Icon size={21} strokeWidth={1.7} /></span>
              <span><strong>{label}</strong><small>{description}</small></span><ChevronRight size={17} />
            </button>)}
          </div>
        </>}
        {step === 2 && <>
          <div className={styles.reply}>{options.find(option => option.id === category)?.label}<Check size={15} /></div>
          <div className={styles.bubble}><strong>Cuéntanos un poco más.</strong><p>Completa tus datos. Al continuar se abrirá WhatsApp con tu consulta preparada; solo tendrás que pulsar Enviar allí.</p></div>
          <form className={styles.form} onSubmit={submit}>
            <fieldset>
              <label>Equipo, modelo o consulta <small>(opcional)</small><input value={model} onChange={e => setModel(e.target.value)} maxLength={100} placeholder="Ej. Kubota M108S o repuesto necesario" /></label>
              <label>Nombre<input value={name} onChange={e => setName(e.target.value)} autoComplete="name" minLength={2} maxLength={100} required placeholder="Tu nombre" /></label>
              <div className={styles.row}>
                <label>Celular<input type="tel" inputMode="tel" value={phone} onChange={e => setPhone(e.target.value)} autoComplete="tel" maxLength={18} required placeholder="999 999 999" /></label>
                <label>Ciudad<input value={city} onChange={e => setCity(e.target.value)} autoComplete="address-level2" minLength={2} maxLength={100} required placeholder="Tu ciudad" /></label>
              </div>
              <label className={styles.consent}><input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} required /><span>Autorizo a Morgillo a contactarme por llamada o WhatsApp sobre esta consulta.</span></label>
            </fieldset>
            {error && <p role="alert" className={styles.error}>{error}</p>}
            <button type="submit" className={styles.submit}><Send size={18} />Enviar por WhatsApp<ArrowRight size={18} /></button>
            <button type="button" className={styles.back} onClick={() => { setStep(1); setError(""); }}><ArrowLeft size={15} /> Cambiar tipo de consulta</button>
          </form>
        </>}
      </div>
      <footer className={styles.footer}><Headset size={15} /><span>Maquinaria, repuestos y respaldo Morgillo</span></footer>
    </section>}
  </>;
}
