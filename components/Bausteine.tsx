"use client";

import { useState } from "react";
import { useWert } from "@/lib/fortschritt";
import { MAX_ZEICHEN, type QuizFrage, type Werte } from "@/lib/typen";
import { IconHaken } from "@/components/Icons";

// Wiederverwendbare Lernbausteine: Skala, Textantwort, Quiz, Impuls und Hinweis.

export function Skala({
  schluessel,
  legende,
  optionen,
}: {
  schluessel: string;
  legende: string;
  optionen: { wert: number; text: string }[];
}) {
  const [wert, setWert] = useWert<number | null>(schluessel, null);
  return (
    <fieldset className="skala">
      <legend>{legende}</legend>
      <div className="skala-reihe" role="radiogroup" aria-label={legende}>
        {optionen.map((o) => (
          <button
            key={o.wert}
            type="button"
            role="radio"
            aria-checked={wert === o.wert}
            className="skala-punkt"
            onClick={() => setWert(o.wert)}
          >
            <span className="skala-zahl">{o.wert}</span>
            <span className="skala-text">{o.text}</span>
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export function Textantwort({
  schluessel,
  label,
  hilfe,
  mindestens = 40,
  zeilen = 4,
}: {
  schluessel: string;
  label: string;
  hilfe?: string;
  mindestens?: number;
  zeilen?: number;
}) {
  const [wert, setWert] = useWert<string>(schluessel, "");
  const laenge = wert.trim().length;
  const id = `feld-${schluessel.replace(/[^a-z0-9]/gi, "-")}`;
  return (
    <div className="feld">
      <label htmlFor={id}>{label}</label>
      {hilfe && <p className="hilfe">{hilfe}</p>}
      <textarea
        id={id}
        rows={zeilen}
        maxLength={MAX_ZEICHEN}
        value={wert}
        onChange={(e) => setWert(e.target.value)}
      />
      <p className={`zaehler ${laenge >= mindestens ? "zaehler-ok" : ""}`}>
        {laenge >= mindestens ? <IconHaken groesse={14} /> : null}
        {laenge >= mindestens ? "Ausreichend ausführlich" : `Noch ${mindestens - laenge} Zeichen bis zur Mindestlänge`}
      </p>
    </div>
  );
}

export function Quiz({ fragen, praefix }: { fragen: QuizFrage[]; praefix: string }) {
  return (
    <div className="quiz">
      {fragen.map((f, i) => (
        <QuizEinzelfrage key={f.id} frage={f} nummer={i + 1} schluessel={`${praefix}:${f.id}`} />
      ))}
    </div>
  );
}

function QuizEinzelfrage({ frage, nummer, schluessel }: { frage: QuizFrage; nummer: number; schluessel: string }) {
  const [wahl, setWahl] = useWert<number | null>(schluessel, null);
  const beantwortet = wahl !== null;
  const gewaehlt = beantwortet ? frage.optionen[wahl] : null;
  return (
    <fieldset className="quiz-frage">
      <legend>
        <span className="quiz-nummer">Frage {nummer}</span>
        {frage.frage}
      </legend>
      <div role="radiogroup" aria-label={frage.frage} className="quiz-optionen">
        {frage.optionen.map((o, i) => {
          const status = !beantwortet ? "" : o.richtig ? "richtig" : i === wahl ? "falsch" : "";
          return (
            <button
              key={o.text}
              type="button"
              role="radio"
              aria-checked={wahl === i}
              disabled={beantwortet}
              className={`quiz-option ${status}`}
              onClick={() => setWahl(i)}
            >
              <span className="quiz-buchstabe">{String.fromCharCode(65 + i)}</span>
              <span>{o.text}</span>
            </button>
          );
        })}
      </div>
      {gewaehlt && (
        <p className={`rueckmeldung ${gewaehlt.richtig ? "rueckmeldung-gut" : "rueckmeldung-hinweis"}`} aria-live="polite">
          <strong>{gewaehlt.richtig ? "Richtig. " : "Nicht ganz. "}</strong>
          {gewaehlt.feedback}
        </p>
      )}
    </fieldset>
  );
}

export function quizErgebnis(w: Werte, fragen: QuizFrage[], praefix: string) {
  let beantwortet = 0;
  let richtig = 0;
  for (const f of fragen) {
    const wahl = w[`${praefix}:${f.id}`];
    if (typeof wahl === "number") {
      beantwortet += 1;
      if (f.optionen[wahl]?.richtig) richtig += 1;
    }
  }
  return { beantwortet, richtig, alle: beantwortet === fragen.length };
}

// Ein Vergleichsimpuls wird erst nach der eigenen Antwort freigegeben.
export function Impuls({
  freigabe,
  titel = "Mit einer möglichen Antwort vergleichen",
  children,
}: {
  freigabe: boolean;
  titel?: string;
  children: React.ReactNode;
}) {
  const [offen, setOffen] = useState(false);
  if (!offen) {
    return (
      <div className="impuls-start">
        <button type="button" className="knopf knopf-zweit" disabled={!freigabe} onClick={() => setOffen(true)}>
          {titel}
        </button>
        {!freigabe && <span className="hilfe">Schreibe zuerst deine eigene Antwort.</span>}
      </div>
    );
  }
  return (
    <aside className="impuls" aria-label="Impuls zum Vergleich">
      <p className="impuls-titel">Impuls zum Vergleich</p>
      {children}
    </aside>
  );
}

export function Hinweis({ art = "info", children }: { art?: "info" | "erfolg" | "warnung"; children: React.ReactNode }) {
  return <div className={`hinweis hinweis-${art}`}>{children}</div>;
}
