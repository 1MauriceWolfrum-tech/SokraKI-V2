import { NextResponse } from "next/server";
import { KI_MODUS, fehlerHinweis, frageClaude } from "@/lib/ki/client";
import { ENTWUERFE, THEMEN } from "@/lib/inhalte/bonus";
import { MAX_ZEICHEN, type ArbeitsblattAnfrage, type ArbeitsblattAntwort } from "@/lib/typen";

// Erzeugt einen Arbeitsblatt-Entwurf: ohne KI-Zugang ein vorbereiteter Entwurf, sonst über Claude.

const SYSTEM = `Du erstellst Entwürfe für Arbeitsblätter für den Unterricht an beruflichen Schulen in Deutschland.
Halte dich an den Auftrag der Lehrkraft. Schreibe reinen Text ohne Markdown-Zeichen und ohne Tabellen, höchstens etwa 350 Wörter.
Setze Überschriften in eigene Zeilen. Füge am Ende einen Abschnitt „Lösungen für die Lehrkraft“ an.
Verwende keine echten Personen und keine personenbezogenen Daten.`;

function istGueltig(daten: unknown): daten is ArbeitsblattAnfrage {
  if (typeof daten !== "object" || daten === null) return false;
  const a = daten as Record<string, unknown>;
  return (
    (a.thema === "bwl" || a.thema === "mathe") &&
    typeof a.prompt === "string" &&
    a.prompt.trim().length >= 20 &&
    a.prompt.length <= MAX_ZEICHEN
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
  const { thema, prompt } = daten;

  if (KI_MODUS === "claude") {
    try {
      const entwurf = await frageClaude(SYSTEM, [
        { role: "user", content: `Thema: ${THEMEN[thema].titel}\nZielgruppe: ${THEMEN[thema].zielgruppe}\n\nAuftrag:\n${prompt}` },
      ]);
      const antwort: ArbeitsblattAntwort = { entwurf, modus: "claude" };
      return NextResponse.json(antwort);
    } catch (fehler) {
      console.error("Arbeitsblatt fehlgeschlagen:", fehler);
      const antwort: ArbeitsblattAntwort = {
        entwurf: ENTWUERFE[thema],
        modus: "skript",
        hinweis: `${fehlerHinweis(fehler)} Stattdessen wird ein vorbereiteter Entwurf angezeigt.`,
      };
      return NextResponse.json(antwort);
    }
  }

  const antwort: ArbeitsblattAntwort = { entwurf: ENTWUERFE[thema], modus: "skript" };
  return NextResponse.json(antwort);
}
