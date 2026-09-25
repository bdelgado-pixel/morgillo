import { cmsOrigin } from "@/lib/content";
export const dynamic = "force-dynamic";
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
  )
    return new Response("No encontrado", { status: 404 });
  try {
    const upstream = await fetch(`${cmsOrigin()}/api/media/${id}/`, {
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(15000),
    });
    if (!upstream.ok)
      return new Response("Archivo no disponible", {
        status: upstream.status === 404 ? 404 : 502,
      });
    const type = upstream.headers.get("content-type") || "";
    if (
      !["image/jpeg", "image/png", "image/webp", "application/pdf"].includes(
        type,
      )
    )
      return new Response("Formato no permitido", { status: 415 });
    const headers = new Headers({
      "Content-Type": type,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "public, max-age=60",
      "Content-Security-Policy": "default-src 'none'; sandbox",
    });
    if (type === "application/pdf")
      headers.set("Content-Disposition", `attachment; filename="${id}.pdf"`);
    return new Response(upstream.body, { headers });
  } catch {
    return new Response("Biblioteca temporalmente no disponible", {
      status: 502,
    });
  }
}
