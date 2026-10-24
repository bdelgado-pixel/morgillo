export type ContactArea = "ventas" | "servicio" | "repuestos";
export type ContactNumbers = Record<ContactArea, string>;

export const contactLabels: Record<ContactArea, string> = {
  ventas: "Ventas",
  servicio: "Servicio técnico",
  repuestos: "Repuestos",
};

// Número de Repuestos proporcionado por Morgillo; aún no existe como campo del CMS.
export const partsPhone = "942 012 195";

export function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length === 9 ? `51${digits}` : digits;
}

export function getContactNumbers(site: { whatsapp: string; phone: string; service: string }): ContactNumbers {
  return {
    ventas: normalizePhone(site.whatsapp || site.phone),
    servicio: normalizePhone(site.service),
    repuestos: normalizePhone(partsPhone),
  };
}

export function getContactArea(topic: string): ContactArea {
  const value = topic.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  if (value === "repuestos") return "repuestos";
  if (["servicio", "servicio tecnico", "servicio-tecnico", "mantenimiento"].includes(value)) return "servicio";
  return "ventas";
}

export function formatContactPhone(value: string) {
  const digits = normalizePhone(value);
  if (/^51\d{9}$/.test(digits)) return digits.slice(2).replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3");
  return digits ? `+${digits}` : "No disponible";
}

export function getContactDestination(topic: string, numbers: ContactNumbers) {
  const area = getContactArea(topic);
  return { area, label: contactLabels[area], number: normalizePhone(numbers[area]) };
}

export function isContactPhoneValid(value: string) {
  const digits = value.replace(/\D/g, "");
  return /^[+\d\s().-]+$/.test(value.trim()) && digits.length >= 7 && digits.length <= 15;
}

export function contactMessage(data: { name: string; phone: string; email: string; topic: string; message: string }) {
  return [
    "Hola Morgillo, quisiera realizar una consulta.",
    "",
    `Área: ${contactLabels[getContactArea(data.topic)]}`,
    `Nombre: ${data.name.trim()}`,
    `Teléfono: ${data.phone.trim()}`,
    ...(data.email.trim() ? [`Correo: ${data.email.trim()}`] : []),
    `Consulta sobre: ${data.topic}`,
    "",
    "Mensaje:",
    data.message.trim(),
  ].join("\n");
}
