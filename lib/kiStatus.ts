"use client";

import { useEffect, useState } from "react";
import type { KiStatus } from "@/lib/typen";

// Fragt einmal pro Seitenaufruf beim Server nach, ob die KI aktiv ist (für die Kennzeichnung der KI-Stellen).

const AUS: KiStatus = { aktiv: false, modell: null, weg: null, grund: "nicht-eingerichtet" };
let anfrage: Promise<KiStatus> | null = null;

export function useKiStatus(): KiStatus | null {
  const [status, setStatus] = useState<KiStatus | null>(null);
  useEffect(() => {
    anfrage ??= fetch("/api/ki-status", { cache: "no-store" })
      .then((r) => (r.ok ? (r.json() as Promise<KiStatus>) : AUS))
      .catch(() => AUS);
    let aktuell = true;
    void anfrage.then((s) => {
      if (aktuell) setStatus(s);
    });
    return () => {
      aktuell = false;
    };
  }, []);
  return status;
}
