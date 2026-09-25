"use client";
import { useEffect, useState } from "react";
import type { Campaign } from "@/types/content";
import Campaigns from "./Campaigns";
export default function CampaignFeed({
  initial,
  serverNow,
  placement,
}: {
  initial: Campaign[];
  serverNow: string;
  placement: "home" | "popup";
}) {
  const [data, setData] = useState({ campaigns: initial, serverNow });
  useEffect(() => {
    const controller = new AbortController();
    let busy = false;
    async function refresh() {
      if (busy) return;
      busy = true;
      try {
        const response = await fetch("/api/campaigns", {
          cache: "no-store",
          signal: controller.signal,
        });
        if (response.ok) {
          const next = await response.json();
          if (
            Array.isArray(next.campaigns) &&
            typeof next.serverNow === "string"
          )
            setData(next);
        }
      } catch {
      } finally {
        busy = false;
      }
    }
    void refresh();
    const timer = setInterval(refresh, 30000);
    return () => {
      controller.abort();
      clearInterval(timer);
    };
  }, []);
  return (
    <Campaigns
      campaigns={data.campaigns}
      serverNow={data.serverNow}
      placement={placement}
    />
  );
}
