import type { Campaign } from "@/types/content";
export function isCampaignActive(c: Campaign, now: number) {
  const start = Date.parse(c.start),
    end = Date.parse(c.end);
  return (
    c.active &&
    Number.isFinite(start) &&
    Number.isFinite(end) &&
    start <= end &&
    now >= start &&
    now <= end
  );
}
export function campaignKey(c: Campaign) {
  return `morgillo-campaign:${c.id}:${c.start}`;
}
