import { NextResponse } from "next/server";
import { KI_MODUS, kiBeschreibung } from "@/lib/ki/client";
import { kiFuerAnfrageErlaubt } from "@/lib/sicherheit";
import type { KiStatus } from "@/lib/typen";

// Meldet dem Kurs, ob und welche KI gerade aktiv ist – für die Kennzeichnung der KI-Stellen.
// Liefert nur Modus und Modellnamen, keine Zugangsdaten.

export const dynamic = "force-dynamic";

export function GET(request: Request) {
  const beschreibung = kiBeschreibung();
  let status: KiStatus;
  if (KI_MODUS === "skript" || !beschreibung) {
    status = { aktiv: false, modell: null, weg: null, grund: "nicht-eingerichtet" };
  } else if (!kiFuerAnfrageErlaubt(request)) {
    status = { aktiv: false, modell: null, weg: null, grund: "nur-lokal" };
  } else {
    status = { aktiv: true, ...beschreibung };
  }
  return NextResponse.json(status);
}
