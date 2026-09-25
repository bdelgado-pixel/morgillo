import { cmsOrigin, getCampaigns } from "@/lib/content";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    if (process.env.CONTENT_SOURCE === "mock")
      return Response.json({
        campaigns: await getCampaigns(),
        serverNow: new Date().toISOString(),
      });
    const response = await fetch(`${cmsOrigin()}/api/campaigns/`, {
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new Error("CMS unavailable");
    return Response.json(await response.json(), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return Response.json(
      { error: "Campañas no disponibles" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
