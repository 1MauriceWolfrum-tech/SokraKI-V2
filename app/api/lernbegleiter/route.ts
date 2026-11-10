import { NextResponse } from "next/server";
import { KI_MODUS, fehlerHinweis } from "@/lib/ki/client";
import { claudeFrage } from "@/lib/ki/lernbegleiter";
import { naechsterSchritt, skriptFrage, skriptText, startZustand } from "@/lib/lernbegleiter/phasen";
import { MAX_BEITRAEGE, MAX_ZEICHEN, type BegleiterAnfrage, type BegleiterAntwort, type KiModus } from "@/lib/typen";

// Einzige Stelle, an der der Lernbegleiter mit dem Sprachmodell spricht.

function istGueltig(daten: unknown): daten is BegleiterAnfrage {
  if (typeof daten !== "object" || daten === null) return false;
  const a = daten as Record<string, unknown>;
  if (a.szenario !== "a" && a.szenario !== "b") return false;
  if (typeof a.entscheidung !== "string" || a.entscheidung.length > MAX_ZEICHEN * 3) return false;
  if (!Array.isArray(a.verlauf) || a.verlauf.length > MAX_BEITRAEGE) return false;
  const ok = a.verlauf.every((b: unknown) => {
    if (typeof b !== "object" || b === null) return false;
    const { rolle, text } = b as Record<string, unknown>;
    return (rolle === "begleiter" || rolle === "teilnehmer") && typeof text === "string" && text.length <= MAX_ZEICHEN;
  });
  if (!ok) return false;
  if (a.verlauf.length > 0 && (a.verlauf.at(-1) as { rolle: string }).rolle !== "teilnehmer") return false;
  if (typeof a.zustand !== "object" || a.zustand === null) return false;
  const z = a.zustand as Record<string, unknown>;
  return (
    Number.isInteger(z.phase) &&
    (z.phase as number) >= 1 &&
    (z.phase as number) <= 5 &&
    Number.isInteger(z.zuege) &&
    (z.zuege as number) >= 0 &&
    (z.zuege as number) <= MAX_BEITRAEGE &&
    typeof z.nachgehakt === "boolean" &&
    typeof z.abgeschlossen === "boolean"
  );
}

export async function POST(request: Request) {
  let daten: unknown;
  try {
    daten = await request.json();
  } catch {
    return NextResponse.json({ fehler: "Ungültige Anfrage." }, { status: 400 });
  }
  if (!istGueltig(daten)) return NextResponse.json({ fehler: "Ungültige Anfrage." }, { status: 400 });
  const { szenario, entscheidung, verlauf, zustand } = daten;

  // Der Gesprächseinstieg ist immer die feste Frage aus dem Leitfaden.
  if (verlauf.length === 0) {
    const antwort: BegleiterAntwort = {
      antwort: skriptFrage(szenario, 1, entscheidung),
      zustand: startZustand(),
      modus: KI_MODUS,
    };
    return NextResponse.json(antwort);
  }
  if (zustand.abgeschlossen) return NextResponse.json({ fehler: "Gespräch bereits abgeschlossen." }, { status: 400 });

  const schritt = naechsterSchritt(zustand, verlauf.at(-1)?.text ?? "");
  let modus: KiModus = KI_MODUS;
  let hinweis: string | undefined;
  let text: string | null = null;

  if (modus === "claude" && schritt.art !== "abschluss") {
    try {
      const ergebnis = await claudeFrage(szenario, entscheidung, verlauf, schritt);
      text = ergebnis.text;
      if (ergebnis.korrigiert) {
        hinweis = text
          ? "Der Lernbegleiter hielt die Regeln nicht ein und wurde automatisch korrigiert."
          : "Die KI-Antwort hielt die Regeln nicht ein; der Gesprächsleitfaden hat übernommen.";
      }
    } catch (fehler) {
      console.error("Lernbegleiter fehlgeschlagen:", fehler);
      hinweis = `${fehlerHinweis(fehler)} Der Lernbegleiter folgt für diese Frage dem Leitfaden.`;
    }
  }
  if (!text) {
    text = skriptText(szenario, schritt, entscheidung);
    if (schritt.art !== "abschluss") modus = "skript";
  }

  const antwort: BegleiterAntwort = { antwort: text, zustand: schritt.zustand, modus, hinweis };
  return NextResponse.json(antwort);
}
