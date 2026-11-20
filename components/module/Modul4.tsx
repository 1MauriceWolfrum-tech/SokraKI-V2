"use client";

import Link from "next/link";
import { Hinweis, Impuls, Quiz, Textantwort, quizErgebnis } from "@/components/Bausteine";
import { Lernbegleiter } from "@/components/Lernbegleiter";
import { Gesehen } from "@/components/module/Gesehen";
import { gesehenSchluessel, type SchrittDef } from "@/components/module/typen";
import { hatText, text, useFortschritt, useWert, zahl } from "@/lib/fortschritt";
import { FALL_A, FALL_B } from "@/lib/inhalte/modul3";
import {
  EMPFEHLUNG_FRAGE,
  MUSTER_EMPFEHLUNG,
  PHASEN,
  REGELN,
  SOKRATIK,
  SOKRATISCH_ODER_NICHT,
} from "@/lib/inhalte/modul4";
import type { Beitrag, GespraechsZustand, SzenarioId, Werte } from "@/lib/typen";

// Fasst die Entscheidung aus Modul 3 für den Lernbegleiter zusammen.
export function entscheidungstext(w: Werte, szenario: SzenarioId): string {
  if (szenario === "a") {
    const option = FALL_A.optionen.find((o) => o.id === w["m3:a:option"]);
    if (!option) return "Noch keine Entscheidung getroffen.";
    const gruende = ((w["m3:a:gruende"] as number[] | undefined) ?? [])
      .map((i) => FALL_A.begruendungen[i]?.text)
      .filter(Boolean);
    const ergaenzung = text(w, "m3:a:begruendung").trim();
    return [
      `Option ${option.id} (${option.titel}): ${option.text}`,
      `Gewählte Begründungen: ${gruende.length ? gruende.join(" | ") : "–"}`,
      ergaenzung ? `Eigene Ergänzung: ${ergaenzung}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  }
  const bewertung = zahl(w, "m3:b:bewertung");
  return [
    `Handlungsempfehlung: ${text(w, "m3:b:empfehlung")}`,
    `Bewertung der Aussage „${FALL_B.aussage}“: ${bewertung !== null ? FALL_B.bewertungsSkala[bewertung] : "–"}`,
  ].join("\n");
}

function Sokratik() {
  return (
    <>
      <Gesehen schluessel={gesehenSchluessel("m4", "sokratik")} />
      <p>{SOKRATIK.einleitung}</p>
      <h3>So läuft ein sokratischer Dialog ab</h3>
      <ol className="prozess">
        {SOKRATIK.prozess.map((p) => (
          <li key={p.titel}>
            <strong>{p.titel}</strong>
            {p.text}
          </li>
        ))}
      </ol>
      <h3 className="abstand-gross">Woran du ihn erkennst</h3>
      <div className="tabelle-rahmen">
        <table>
          <caption>Merkmale eines sokratischen Dialogs</caption>
          <thead>
            <tr>
              <th scope="col">Sokratisch</th>
              <th scope="col">Nicht sokratisch</th>
            </tr>
          </thead>
          <tbody>
            {SOKRATIK.merkmale.map((m) => (
              <tr key={m.ist}>
                <td>{m.ist}</td>
                <td>{m.nicht}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Hinweis art="info">
        <strong>Sokratischer Dialog mit KI:</strong> {SOKRATIK.mitKi}{" "}
        <Link href="/nachschlagen#anleitung">Zur Anleitung</Link>
      </Hinweis>
      <p className="hilfe">Quelle: in Anlehnung an Horster, D. (1994). Das sokratische Gespräch in Theorie und Praxis.</p>
    </>
  );
}

function SokratischOderNicht() {
  const { werte } = useFortschritt();
  const ergebnis = quizErgebnis(werte, SOKRATISCH_ODER_NICHT, "m4:sokr");
  return (
    <>
      <p>Sechs kurze Gesprächsausschnitte – ist das jeweils ein sokratischer Dialog oder nicht?</p>
      <Quiz fragen={SOKRATISCH_ODER_NICHT} praefix="m4:sokr" />
      {ergebnis.alle && (
        <Hinweis art={ergebnis.richtig >= 5 ? "erfolg" : "info"}>
          {ergebnis.richtig} von {SOKRATISCH_ODER_NICHT.length} richtig eingeschätzt. Merke: Eine Frage, Anknüpfen an die
          letzte Antwort, keine Lösungen – genau so arbeitet gleich auch der Lernbegleiter.
        </Hinweis>
      )}
    </>
  );
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
      <Hinweis art="info">
        <strong>Schneller antworten:</strong> Zu jeder Frage bietet der Lernbegleiter drei Antwortbausteine an. Ein Klick
        übernimmt den Text in dein Antwortfeld – ergänze ihn, wenn du magst. Eigene Antworten sind natürlich jederzeit
        möglich.
      </Hinweis>
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
      deine: hatText(werte, "m3:b:empfehlung", 1)
        ? `Deine Empfehlung: ${kuerzen(text(werte, "m3:b:empfehlung"), 110)}`
        : "Noch keine Handlungsempfehlung",
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
      <Textantwort schluessel="m4:empfehlung" label={EMPFEHLUNG_FRAGE} hilfe="Zwei bis drei Sätze genügen." mindestens={60} />
      {szenario && (
        <Impuls freigabe={hatText(werte, "m4:empfehlung", 60)} titel="Mit der Musterlösung vergleichen">
          <p>
            <strong>Musterlösung:</strong> {MUSTER_EMPFEHLUNG[szenario]}
          </p>
          <p className="hilfe">
            Deine Empfehlung muss nicht genauso lauten. Prüfe: Nennst du eine konkrete Maßnahme, berücksichtigst du
            Lernende mit unterschiedlichen Voraussetzungen und begründest du, warum das gerecht ist?
          </p>
        </Impuls>
      )}
    </>
  );
}

function kuerzen(t: string, max: number): string {
  return t.length > max ? `${t.slice(0, max).trimEnd()} …` : t;
}

function gespraechFertig(w: Werte): boolean {
  const szenario = w["m4:szenario"] as SzenarioId | undefined;
  if (!szenario) return false;
  const z = w[`m4:zustand:${szenario}`] as GespraechsZustand | null | undefined;
  return Boolean(z?.abgeschlossen);
}

export const MODUL4: SchrittDef[] = [
  {
    id: "sokratik",
    titel: "Was einen sokratischen Dialog ausmacht",
    Inhalt: Sokratik,
    fertig: (w) => w[gesehenSchluessel("m4", "sokratik")] === true,
  },
  {
    id: "sokratisch-oder-nicht",
    titel: "Quiz: Sokratisch oder nicht?",
    Inhalt: SokratischOderNicht,
    fertig: (w) => quizErgebnis(w, SOKRATISCH_ODER_NICHT, "m4:sokr").alle,
  },
  {
    id: "einfuehrung",
    titel: "So funktioniert das Gespräch",
    Inhalt: Einfuehrung,
    fertig: (w) => w[gesehenSchluessel("m4", "einfuehrung")] === true,
  },
  { id: "szenario", titel: "Fall auswählen", Inhalt: SzenarioWahl, fertig: (w) => typeof w["m4:szenario"] === "string" },
  { id: "gespraech", titel: "Gespräch", Inhalt: Gespraech, fertig: gespraechFertig },
  { id: "empfehlung", titel: "Handlungsempfehlung", Inhalt: Empfehlung, fertig: (w) => hatText(w, "m4:empfehlung", 60) },
];
