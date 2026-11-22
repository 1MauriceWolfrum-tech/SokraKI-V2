import "server-only";
import { NextResponse } from "next/server";

// Schutzschicht für die API-Routen. Die Schnittstellen sollen nur von dieser Seite aus und nur in
// sinnvoller Größe aufgerufen werden – sonst könnten fremde Webseiten im Hintergrund Anfragen schicken
// und das KI-Guthaben verbrauchen.

const MAX_BYTES = 128 * 1024;
const LOKALER_HOST = /^(localhost|127\.0\.0\.1|\[::1\])(:\d{1,5})?$/i;

function fehler(status: number, text: string) {
  return { antwort: NextResponse.json({ fehler: text }, { status }) };
}

// Liest eine JSON-Anfrage nur, wenn sie von dieser Seite kommt und klein genug ist.
export async function liesJsonAnfrage(request: Request): Promise<{ daten: unknown } | { antwort: NextResponse }> {
  // Nur JSON: Fremde Webseiten können JSON nicht ohne Vorabprüfung (CORS) senden – und die beantwortet der Server nicht.
  const typ = request.headers.get("content-type") ?? "";
  if (!typ.toLowerCase().startsWith("application/json")) return fehler(415, "Nur JSON-Anfragen sind erlaubt.");

  // Browser senden bei solchen Anfragen ihre Herkunft mit. Sie muss zur eigenen Adresse passen.
  const host = request.headers.get("host") ?? "";
  const herkunft = request.headers.get("origin");
  if (herkunft !== null && herkunft !== `http://${host}` && herkunft !== `https://${host}`) {
    return fehler(403, "Anfragen von fremden Seiten sind nicht erlaubt.");
  }

  const laenge = Number(request.headers.get("content-length"));
  if (!Number.isFinite(laenge) || laenge <= 0) return fehler(411, "Die Anfrage braucht eine Längenangabe.");
  if (laenge > MAX_BYTES) return fehler(413, "Die Anfrage ist zu groß.");

  const roh = await request.text();
  if (roh.length > MAX_BYTES) return fehler(413, "Die Anfrage ist zu groß.");
  try {
    return { daten: JSON.parse(roh) };
  } catch {
    return fehler(400, "Ungültige Anfrage.");
  }
}

// Die KI wird nur für Aufrufe vom eigenen Rechner genutzt. Das schützt vor Geräten im WLAN
// (npm run dev:netzwerk) und vor fremden Seiten, die per DNS-Rebinding auf localhost zeigen.
export function kiFuerAnfrageErlaubt(request: Request): boolean {
  return LOKALER_HOST.test(request.headers.get("host") ?? "");
}

export const HINWEIS_NUR_LOKAL = "Die KI ist nur auf dem eigenen Rechner verfügbar.";
