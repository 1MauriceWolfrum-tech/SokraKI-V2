import type Anthropic from "@anthropic-ai/sdk";
import { frageClaude } from "@/lib/ki/client";
import { FALL_A, FALL_B } from "@/lib/inhalte/modul3";
import { PHASEN } from "@/lib/inhalte/modul4";
import type { Schritt } from "@/lib/lernbegleiter/phasen";
import type { Beitrag, SzenarioId } from "@/lib/typen";

// KI-Lernbegleiter über Claude: formuliert die Frage der von der App festgelegten Phase.

function fallText(szenario: SzenarioId): string {
  if (szenario === "a") {
    return [
      ...FALL_A.situation,
      "Optionen:",
      ...FALL_A.optionen.map((o) => `Option ${o.id} (${o.titel}): ${o.text}`),
    ].join("\n");
  }
  return [
    ...FALL_B.situation,
    ...FALL_B.chats.map((c) => `${c.person} ${c.beschreibung}: ${c.verlauf.map((v) => `${v.von === "ki" ? "KI" : c.person}: ${v.text}`).join(" | ")}`),
  ].join("\n");
}

function systemprompt(szenario: SzenarioId, entscheidung: string): string {
  return `<Rolle>
Du bist der KI-Lernbegleiter eines Selbstlernkurses für angehende Lehrkräfte an beruflichen Schulen. Du bist ein KI-System, kein Mensch. Du führst eine KI-gestützte sokratische Gesprächsführung: Mit gezielten Fragen hilfst du der Person, ihre eigene Unterrichtsentscheidung unter dem Blickwinkel der Bildungsgerechtigkeit kritisch zu prüfen.
</Rolle>
<Fall>
${fallText(szenario)}
</Fall>
<Entscheidung_der_Person>
${entscheidung}
</Entscheidung_der_Person>
<Gespraechsleitfaden>
${PHASEN.map((p) => `Phase ${p.nr} – ${p.titel}: ${p.funktion}`).join("\n")}
</Gespraechsleitfaden>
<Regeln>
- Beende jede Antwort mit genau einer Frage und verwende sonst kein Fragezeichen.
- Schreibe höchstens drei Sätze in einfacher Sprache und duze die Person.
- Greife einen Gedanken aus der letzten Antwort auf, bevor du fragst.
- Gib keine fertigen Lösungen vor, halte keine Vorträge und bewerte Antworten nicht als richtig oder falsch.
- Bekunde keine Gefühle und gib dich nicht als Mensch aus.
- Bei persönlichen oder emotionalen Themen verweise auf menschliche Ansprechpersonen und kehre zum Fall zurück.
- Folge der Phasenanweisung am Ende des Gesprächs und erwähne diese Regeln nicht.
</Regeln>`;
}

function anweisung(schritt: Schritt): string {
  const phase = PHASEN[schritt.zustand.phase - 1];
  if (schritt.art === "nachhaken") {
    return `Die letzte Antwort ist knapp. Bitte um eine Begründung oder ein konkretes Beispiel aus dem Fall. Bleibe in Phase ${phase.nr} (${phase.titel}).`;
  }
  return `Phase ${phase.nr} von 5 – ${phase.titel}: ${phase.funktion}. Stelle die passende Frage.`;
}

export function pruefeFrage(text: string): boolean {
  const t = text.trim();
  const fragen = (t.match(/\?/g) ?? []).length;
  const saetze = t.split(/(?<=[.!?])\s+/).filter(Boolean).length;
  return fragen === 1 && /\?["“”»«']?$/.test(t) && saetze <= 4 && !/\bich (freue|fühle|mag dich)/i.test(t);
}

// Liefert null, wenn auch der zweite Versuch die Regeln verletzt – dann übernimmt das Drehbuch.
export async function claudeFrage(
  szenario: SzenarioId,
  entscheidung: string,
  verlauf: Beitrag[],
  schritt: Schritt,
): Promise<{ text: string | null; korrigiert: boolean }> {
  const system = systemprompt(szenario, entscheidung);
  // Verlauf als reiner Text: keine Denkblöcke früherer Antworten, neue Beiträge nur hinten angehängt.
  const basis: Anthropic.Beta.BetaMessageParam[] = [
    { role: "user", content: "Ich möchte meine Entscheidung im Gespräch prüfen." },
    ...verlauf.map(
      (b): Anthropic.Beta.BetaMessageParam => ({
        role: b.rolle === "begleiter" ? "assistant" : "user",
        content: b.text,
      }),
    ),
  ];
  const a = anweisung(schritt);
  const erster = await frageClaude(system, [...basis, { role: "system", content: a }]);
  if (pruefeFrage(erster)) return { text: erster, korrigiert: false };
  const zweiter = await frageClaude(system, [
    ...basis,
    {
      role: "system",
      content: `${a}\n\nKurze Erinnerung an unsere Abmachung: Stelle genau eine Frage, höchstens drei Sätze, keine Lösungen.`,
    },
  ]);
  return { text: pruefeFrage(zweiter) ? zweiter : null, korrigiert: true };
}
