"use client";

import { Hinweis, Quiz, Skala, Textantwort, quizErgebnis } from "@/components/Bausteine";
import { Gesehen } from "@/components/module/Gesehen";
import { gesehenSchluessel, type SchrittDef } from "@/components/module/typen";
import { hatText, useFortschritt, zahl } from "@/lib/fortschritt";
import { SKALA, THESE, WISSENSDIAGNOSE } from "@/lib/inhalte/modul1";

export function TheseZitat() {
  return (
    <blockquote className="these">
      <span aria-hidden="true">„</span>
      {THESE}
      <span aria-hidden="true">“</span>
    </blockquote>
  );
}

function Einstieg() {
  return (
    <>
      <p>Bevor es losgeht: Wie siehst du das? Es gibt hier kein Richtig oder Falsch.</p>
      <TheseZitat />
      <Skala schluessel="m1:these" legende="Wie stark stimmst du der Aussage zu?" optionen={SKALA} />
      <Textantwort
        schluessel="m1:begruendung"
        label="Begründe deine Einschätzung in zwei bis drei Sätzen."
        hilfe="Deine Antwort wird gespeichert und am Ende des Kurses wieder aufgegriffen."
        mindestens={60}
      />
    </>
  );
}

function Diagnose() {
  return (
    <>
      <p>
        Vier kurze Fragen zeigen dir, wo du stehst. Sie dienen nicht der Benotung, sondern bereiten die nächsten Module
        vor. Nach jeder Antwort erhältst du direkt eine Rückmeldung.
      </p>
      <Quiz fragen={WISSENSDIAGNOSE} praefix="m1:quiz" />
    </>
  );
}

function Standort() {
  const { werte } = useFortschritt();
  const { richtig } = quizErgebnis(werte, WISSENSDIAGNOSE, "m1:quiz");
  const these = zahl(werte, "m1:these");
  return (
    <>
      <Gesehen schluessel={gesehenSchluessel("m1", "standort")} />
      <div className="kennzahlen">
        <div className="kennzahl">
          <span className="kennzahl-wert">
            {richtig}/{WISSENSDIAGNOSE.length}
          </span>
          <span className="kennzahl-text">Fragen richtig beantwortet</span>
        </div>
        <div className="kennzahl">
          <span className="kennzahl-wert">{these ?? "–"}/5</span>
          <span className="kennzahl-text">deine Zustimmung zur Ausgangsthese</span>
        </div>
      </div>
      <p>
        {richtig >= 3
          ? "Du bringst bereits solides Vorwissen mit. Modul 2 vertieft die Begriffe und verbindet sie mit KI."
          : "In Modul 2 klärst du die zentralen Begriffe – danach fallen dir die Fragen leichter."}
      </p>
      <Hinweis art="info">
        Deine Position zur These greifen wir in Modul 5 wieder auf. Dann siehst du, ob und wie sich deine Einschätzung
        verändert hat.
      </Hinweis>
    </>
  );
}

export const MODUL1: SchrittDef[] = [
  {
    id: "einstieg",
    titel: "Ausgangsthese",
    Inhalt: Einstieg,
    fertig: (w) => zahl(w, "m1:these") !== null && hatText(w, "m1:begruendung", 60),
  },
  {
    id: "diagnose",
    titel: "Wissensdiagnose",
    Inhalt: Diagnose,
    fertig: (w) => quizErgebnis(w, WISSENSDIAGNOSE, "m1:quiz").alle,
  },
  {
    id: "standort",
    titel: "Dein Ausgangspunkt",
    Inhalt: Standort,
    fertig: (w) => w[gesehenSchluessel("m1", "standort")] === true,
  },
];
