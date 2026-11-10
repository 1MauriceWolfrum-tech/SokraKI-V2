import type { GespraechsZustand, SzenarioId } from "@/lib/typen";
import { ABSCHLUSS, NACHHAKEN, SKRIPT } from "@/lib/inhalte/modul4";
import type { OptionId } from "@/lib/inhalte/modul3";

// Gesprächssteuerung nach dem 5-Phasen-Leitfaden. Die App legt die Phase fest, nicht das Sprachmodell.

export const PHASEN_ANZAHL = 5;

export function startZustand(): GespraechsZustand {
  return { phase: 1, nachgehakt: false, zuege: 0, abgeschlossen: false };
}

// Eine Antwort gilt als knapp, wenn sie kurz ist oder keine Begründung erkennen lässt.
export function istKnapp(text: string): boolean {
  const t = text.trim();
  if (t.length < 60) return true;
  return t.length < 120 && !/\b(weil|da|denn|dadurch|deshalb|damit|sodass|daher|zum Beispiel|z\. ?B\.)\b/i.test(t);
}

export type Schritt = { zustand: GespraechsZustand; art: "frage" | "nachhaken" | "abschluss" };

export function naechsterSchritt(z: GespraechsZustand, antwort: string): Schritt {
  const zuege = z.zuege + 1;
  if (!z.nachgehakt && istKnapp(antwort)) {
    return { zustand: { ...z, zuege, nachgehakt: true }, art: "nachhaken" };
  }
  if (z.phase >= PHASEN_ANZAHL) {
    return { zustand: { ...z, zuege, abgeschlossen: true }, art: "abschluss" };
  }
  return { zustand: { phase: z.phase + 1, nachgehakt: false, zuege, abgeschlossen: false }, art: "frage" };
}

export function optionAus(entscheidung: string): OptionId {
  const m = entscheidung.match(/Option ([ABC])/);
  return (m?.[1] as OptionId) ?? "A";
}

export function skriptFrage(szenario: SzenarioId, phase: number, entscheidung: string): string {
  const s = SKRIPT[szenario];
  const option = optionAus(entscheidung);
  if (szenario === "a" && phase === 2 && s.annahmen) return s.annahmen[option];
  return s.phasen[phase - 1].replace("{option}", option);
}

export function skriptText(szenario: SzenarioId, schritt: Schritt, entscheidung: string): string {
  if (schritt.art === "nachhaken") return NACHHAKEN;
  if (schritt.art === "abschluss") return ABSCHLUSS;
  return skriptFrage(szenario, schritt.zustand.phase, entscheidung);
}
