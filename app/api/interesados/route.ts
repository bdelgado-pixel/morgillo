
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const backend = process.env.MORGILLO_DJANGO_URL;
  const token = process.env.MORGILLO_LEADS_TOKEN;

  if (!backend || !token) {
    return NextResponse.json(
      { error: "Servicio no configurado" },
      { status: 503 }
    );
  }

  try {
    const data: unknown = await request.json();

    if (
      !data ||
      typeof data !== "object" ||
      Array.isArray(data)
    ) {
      return NextResponse.json(
        { error: "Datos inválidos" },
        { status: 400 }
      );
    }

    const body = data as Record<string, unknown>;

    const campos = [
      "nombre",
      "celular",
      "ciudad",
      "maquina",
      "modelo",
      "origen",
    ];

    if (
      campos.some(
        (campo) =>
          typeof body[campo] !== "string"
      ) ||
      body.consentimiento !== true
    ) {
      return NextResponse.json(
        { error: "Revisa tus datos" },
        { status: 400 }
      );
    }

    const respuesta = await fetch(
      `${backend.replace(/\/+$/, "")}/api/interesados/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Morgillo-Token": token,
        },
        body: JSON.stringify({
          nombre: body.nombre,
          celular: body.celular,
          ciudad: body.ciudad,
          maquina: body.maquina,
          modelo: body.modelo,
          origen: body.origen,
          consentimiento: true,
        }),
        cache: "no-store",
        signal: AbortSignal.timeout(10000),
      }
    );

    if (!respuesta.ok) {
      return NextResponse.json(
        { error: "No se pudo guardar la consulta" },
        {
          status:
            respuesta.status === 400 ? 400 : 502,
        }
      );
    }

    return NextResponse.json(
      { ok: true },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "No se pudo conectar con Morgillo" },
      { status: 503 }
    );
  }
}
