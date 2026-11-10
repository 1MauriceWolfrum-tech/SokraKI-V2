"use client";

import { Hinweis, Textantwort } from "@/components/Bausteine";
import { Lernbegleiter } from "@/components/Lernbegleiter";
import { Gesehen } from "@/components/module/Gesehen";
import { gesehenSchluessel, type SchrittDef } from "@/components/module/typen";
import { hatText, text, useFortschritt, useWert, zahl } from "@/lib/fortschritt";
import { FALL_A, FALL_B } from "@/lib/inhalte/modul3";
import { EMPFEHLUNG_FRAGE, PHASEN, REGELN } from "@/lib/inhalte/modul4";
import type { Beitrag, GespraechsZustand, SzenarioId, Werte } from "@/lib/typen";

// Fasst die Entscheidung aus Modul 3 für den Lernbegleiter zusammen.
export function entscheidungstext(w: Werte, szenario: SzenarioId): string {
  if (szenario === "a") {
    const option = FALL_A.optionen.find((o) => o.id === w["m3:a:option"]);
    return option
      ? `Option ${option.id} (${option.titel}): ${option.text}\nBegründung: ${text(w, "m3:a:begruendung")}`
      : "Noch keine Entscheidung getroffen.";
  }
  const bewertung = zahl(w, "m3:b:bewertung");
  return [
    `Maßnahme 1: ${text(w, "m3:b:massnahme1")}`,
    `Maßnahme 2: ${text(w, "m3:b:massnahme2")}`,
    `Bewertung der Aussage „${FALL_B.aussage}“: ${bewertung !== null ? FALL_B.bewertungsSkala[bewertung] : "–"}`,
    `Begründung: ${text(w, "m3:b:bewertung-text")}`,
  ].join("\n");
}

function Einfuehrung() {
  return (
    <>
      <Gesehen schluessel={gesehenSchluessel("m4", "einfuehrung")} />
      <p>
        Du hast in Modul 3 Entscheidungen getroffen. Jetzt prüfst du eine davon im Gespräch mit einem KI-Lernbegleiter.
        Er erklärt nichts und bewertet dich nicht – er stellt Fragen, damit du deine eigene Begründung schärfst. Diese
        Methode nennen wir <strong>KI-gestützte sokratische Gesprächsführung</strong>.
      </p>
      <h3>Das Gespräch hat fünf Phasen</h3>
      <ol className="phasen-liste">
        {PHASEN.map((p) => (
          <li key={p.nr}>
            <strong>{p.titel}</strong> – {p.funktion}
          </li>
        ))}
      </ol>
      <h3>Spielregeln</h3>
      <ul>
        {REGELN.map((r) => (
          <li key={r}>{r}</li>
        ))}
      </ul>
      <Hinweis art="info">
        Bitte gib keine personenbezogenen Daten ein, etwa Namen echter Schülerinnen und Schüler. Das Gespräch wird nur
        in deinem Browser gespeichert.
      </Hinweis>
    </>
  );
}

function SzenarioWahl() {
  const [szenario, setSzenario] = useWert<SzenarioId | null>("m4:szenario", null);
  const { werte } = useFortschritt();
  const optionA = FALL_A.optionen.find((o) => o.id === werte["m3:a:option"]);
  const karten: { id: SzenarioId; titel: string; thema: string; deine: string }[] = [
    {
      id: "a",
      titel: FALL_A.titel,
      thema: FALL_A.thema,
      deine: optionA ? `Deine Wahl: Option ${optionA.id} – ${optionA.titel}` : "Noch keine Entscheidung",
    },
    {
      id: "b",
      titel: FALL_B.titel,
      thema: FALL_B.thema,
      deine: hatText(werte, "m3:b:massnahme1", 1) ? `Deine Maßnahme: ${text(werte, "m3:b:massnahme1")}` : "Noch keine Maßnahme",
    },
  ];
  return (
    <>
      <p>Welche deiner Entscheidungen möchtest du im Gespräch prüfen?</p>
      <div className="optionen" role="radiogroup" aria-label="Fall auswählen">
        {karten.map((k) => (
          <button
            key={k.id}
            type="button"
            role="radio"
            aria-checked={szenario === k.id}
            className="option-karte"
            onClick={() => setSzenario(k.id)}
          >
            <span className="option-buchstabe">{k.id.toUpperCase()}</span>
            <span>
              <strong>{k.titel}</strong>
              <br />
              <span className="hilfe">{k.deine}</span>
            </span>
          </button>
        ))}
      </div>
    </>
  );
}

function Gespraech() {
  const { werte } = useFortschritt();
  const szenario = werte["m4:szenario"] as SzenarioId | undefined;
  if (!szenario) return <Hinweis art="warnung">Wähle im vorherigen Schritt zuerst einen Fall aus.</Hinweis>;
  return <Lernbegleiter key={szenario} szenario={szenario} entscheidung={entscheidungstext(werte, szenario)} />;
}

function Empfehlung() {
  const { werte } = useFortschritt();
  const szenario = werte["m4:szenario"] as SzenarioId | undefined;
  const verlauf = (szenario ? werte[`m4:verlauf:${szenario}`] : undefined) as Beitrag[] | undefined;
  const eigene = (verlauf ?? []).filter((b) => b.rolle === "teilnehmer");
  return (
    <>
      <p>
        Fasse zusammen, was du aus dem Gespräch mitnimmst: Wie sollte die Lehrkraft vorgehen – und warum ist das
        bildungsgerecht?
      </p>
      {eigene.length > 0 && (
        <details className="aufklapp">
          <summary>Deine Antworten im Gespräch ({eigene.length})</summary>
          <ol>
            {eigene.map((b, i) => (
              <li key={i}>{b.text}</li>
            ))}
          </ol>
        </details>
      )}
      <Textantwort schluessel="m4:empfehlung" label={EMPFEHLUNG_FRAGE} hilfe="Zwei bis drei Sätze genügen." mindestens={80} />
    </>
  );
}

function gespraechFertig(w: Werte): boolean {
  const szenario = w["m4:szenario"] as SzenarioId | undefined;
  if (!szenario) return false;
  const z = w[`m4:zustand:${szenario}`] as GespraechsZustand | null | undefined;
  return Boolean(z?.abgeschlossen);
}

export const MODUL4: SchrittDef[] = [
  {
    id: "einfuehrung",
    titel: "So funktioniert das Gespräch",
    Inhalt: Einfuehrung,
    fertig: (w) => w[gesehenSchluessel("m4", "einfuehrung")] === true,
  },
  { id: "szenario", titel: "Fall auswählen", Inhalt: SzenarioWahl, fertig: (w) => typeof w["m4:szenario"] === "string" },
  { id: "gespraech", titel: "Gespräch", Inhalt: Gespraech, fertig: gespraechFertig },
  { id: "empfehlung", titel: "Handlungsempfehlung", Inhalt: Empfehlung, fertig: (w) => hatText(w, "m4:empfehlung", 80) },
];
