"use client";

import { useEffect } from "react";

export function AnalyticsTracker() {
  useEffect(() => {
    if (window.location.pathname.startsWith("/admin")) return;

    const payload = JSON.stringify({
      type: "visit",
      path: window.location.pathname + window.location.search,
      referrer: document.referrer || null,
    });

    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/analytics", new Blob([payload], { type: "application/json" }));
      return;
    }

    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => undefined);
  }, []);

  return null;
}

