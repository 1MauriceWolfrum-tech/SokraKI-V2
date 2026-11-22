import { NextResponse } from "next/server";
import { ARBEITSBLATT_SCHEMA, istArbeitsblatt, sindSchwachstellen } from "@/lib/arbeitsblatt";
import { ENTWUERFE, THEMEN } from "@/lib/inhalte/bonus";
import { KI_MODUS, KiFormatFehler, fehlerHinweis, frageKi, type KiAnfrage } from "@/lib/ki/client";
import { HINWEIS_NUR_LOKAL, kiFuerAnfrageErlaubt, liesJsonAnfrage } from "@/lib/sicherheit";
import { MAX_PROMPT_ZEICHEN, type ArbeitsblattAnfrage, type ArbeitsblattAntwort, type ThemaId } from "@/lib/typen";

// Arbeitsblatt im Bonusmodul: Entwurf erzeugen und Verbesserungsvorschläge der Lernenden einarbeiten.
// Ohne KI-Zugang gibt es einen vorbereiteten Entwurf; die Überarbeitung machen die Lernenden dann selbst.

const REGELN = `- Die Form der Antwort gibt das JSON-Schema vor. Angaben zum Format im Auftrag (Überschriften, Lösungen am Ende) setzt du in diesen Feldern um; die Lösungen gehören in das Feld „loesung“ der jeweiligen Aufgabe.
- Verwende keine echten Personen und keine personenbezogenen Daten.
- Schreibe in klarer, einfacher Sprache und ohne Markdown-Zeichen.
- Die Ausgangssituation enthält alle Angaben, die für die Aufgaben nötig sind.
- Ordne jede Aufgabe einem Niveau zu: basis, standard oder erweiterung.
- Schreibe zu jeder Aufgabe eine vollständige Lösung mit Rechenweg für die Lehrkraft und rechne jedes Ergebnis nach.
- Das Arbeitsblatt soll auf eine bis zwei DIN-A4-Seiten passen.`;

const SYSTEM_ENTWURF = `Du erstellst Entwürfe für Arbeitsblätter für den Unterricht an beruflichen Schulen in Deutschland. Halte dich an den Auftrag der Lehrkraft.
${REGELN}`;

const SYSTEM_UEBERARBEITUNG = `Du überarbeitest ein Arbeitsblatt für den Unterricht an beruflichen Schulen in Deutschland. Die Lehrkraft hat Schwachstellen benannt und Verbesserungsvorschläge formuliert.
- Setze genau diese Vorschläge um. Ändere andere Teile nur, wenn eine Änderung es erfordert – zum Beispiel die Lösung, wenn sich eine Aufgabe oder eine Zahl ändert.
- Gib das vollständige überarbeitete Arbeitsblatt zurück.
${REGELN}`;

function pruefeAnfrage(daten: unknown): ArbeitsblattAnfrage | null {
  if (typeof daten !== "object" || daten === null) return null;
  const a = daten as Record<string, unknown>;
  const thema = (["bwl", "mathe"] as ThemaId[]).find((t) => t === a.thema);
  if (!thema) return null;
  if (a.aktion === "ueberarbeiten") {
    if (!istArbeitsblatt(a.blatt) || !sindSchwachstellen(a.schwachstellen)) return null;
    return { aktion: "ueberarbeiten", thema, blatt: a.blatt, schwachstellen: a.schwachstellen };
  }
  if (a.aktion !== "entwurf" || typeof a.prompt !== "string") return null;
  if (a.prompt.trim().length < 20 || a.prompt.length > MAX_PROMPT_ZEICHEN) return null;
  return { aktion: "entwurf", thema, prompt: a.prompt };
}

function kiAnfrage(anfrage: ArbeitsblattAnfrage): KiAnfrage {
  const { titel, zielgruppe } = THEMEN[anfrage.thema];
  const kopf = `Thema: ${titel}\nZielgruppe: ${zielgruppe}`;
  if (anfrage.aktion === "entwurf") {
    return {
      system: SYSTEM_ENTWURF,
      nachrichten: [{ role: "user", content: `${kopf}\n\nAuftrag:\n${anfrage.prompt}` }],
      schema: ARBEITSBLATT_SCHEMA,
      maxTokens: 12000,
    };
  }
  const vorschlaege = anfrage.schwachstellen
    .map((s, i) => `${i + 1}. Schwachstelle: ${s.problem}\n   Vorschlag: ${s.vorschlag}`)
    .join("\n");
  return {
    system: SYSTEM_UEBERARBEITUNG,
    nachrichten: [
      {
        role: "user",
        content: `${kopf}\n\n<Arbeitsblatt>\n${JSON.stringify(anfrage.blatt, null, 2)}\n</Arbeitsblatt>\n\n<Verbesserungsvorschlaege>\n${vorschlaege}\n</Verbesserungsvorschlaege>`,
      },
    ],
    schema: ARBEITSBLATT_SCHEMA,
    maxTokens: 12000,
  };
}

export async function POST(request: Request) {
  const gelesen = await liesJsonAnfrage(request);
  if ("antwort" in gelesen) return gelesen.antwort;
  const anfrage = pruefeAnfrage(gelesen.daten);
  if (!anfrage) return NextResponse.json({ fehler: "Ungültige Anfrage." }, { status: 400 });

  // Ohne KI: vorbereiteter Entwurf bzw. das Arbeitsblatt unverändert zurück.
  const ohneKi = (hinweis?: string): ArbeitsblattAntwort => ({
    blatt: anfrage.aktion === "entwurf" ? ENTWUERFE[anfrage.thema] : anfrage.blatt,
    modus: "skript",
    hinweis,
  });
  const weiter =
    anfrage.aktion === "entwurf"
      ? "Stattdessen wird ein vorbereiteter Entwurf angezeigt."
      : "Setze deine Vorschläge selbst in den Feldern um.";

  if (KI_MODUS === "skript") {
    return NextResponse.json(
      ohneKi(anfrage.aktion === "ueberarbeiten" ? "Ohne KI-Zugang setzt du deine Vorschläge selbst in den Feldern um." : undefined),
    );
  }
  if (!kiFuerAnfrageErlaubt(request)) return NextResponse.json(ohneKi(`${HINWEIS_NUR_LOKAL} ${weiter}`));

  try {
    const blatt: unknown = JSON.parse(await frageKi(kiAnfrage(anfrage)));
    if (!istArbeitsblatt(blatt)) throw new KiFormatFehler("Antwort passt nicht zum Arbeitsblatt-Format.");
    const antwort: ArbeitsblattAntwort = { blatt, modus: KI_MODUS };
    return NextResponse.json(antwort);
  } catch (fehler) {
    console.error("Arbeitsblatt fehlgeschlagen:", fehler instanceof Error ? fehler.message : fehler);
    return NextResponse.json(ohneKi(`${fehlerHinweis(fehler)} ${weiter}`));
  }
}
