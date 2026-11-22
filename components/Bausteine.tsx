"use client";

import { useState } from "react";
import { useWert } from "@/lib/fortschritt";
import { MAX_ZEICHEN, type Auswahlaussage, type QuizFrage, type Werte } from "@/lib/typen";
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
  mindestens = 20,
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
      {mindestens > 0 && (
        <p className={`zaehler ${laenge >= mindestens ? "zaehler-ok" : ""}`}>
          {laenge >= mindestens ? <IconHaken groesse={14} /> : null}
          {laenge >= mindestens ? "Ausreichend ausführlich" : `Noch ${mindestens - laenge} Zeichen bis zur Mindestlänge`}
        </p>
      )}
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

// Feste, je Frage gemischte Reihenfolge der Antworten: Die richtige Antwort steht nicht immer an derselben Stelle,
// bleibt beim Neuladen aber gleich. In den Kursinhalten darf sie daher an beliebiger Stelle stehen; gespeichert wird
// weiterhin ihr Index aus den Kursinhalten. Bei nur zwei Antworten (z. B. „sokratisch / nicht sokratisch“) bleibt die Reihenfolge.
export function antwortReihenfolge(id: string, anzahl: number): number[] {
  const reihe = Array.from({ length: anzahl }, (_, i) => i);
  if (anzahl < 3) return reihe;
  let s = 2166136261;
  for (const zeichen of `${id}·sokraki-6`) s = Math.imul(s ^ zeichen.charCodeAt(0), 16777619) >>> 0;
  for (let i = anzahl - 1; i > 0; i--) {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    const j = s % (i + 1);
    [reihe[i], reihe[j]] = [reihe[j], reihe[i]];
  }
  return reihe;
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
        {antwortReihenfolge(frage.id, frage.optionen.length).map((i, position) => {
          const o = frage.optionen[i];
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
              <span className="quiz-buchstabe">{String.fromCharCode(65 + position)}</span>
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

// Mehrfachauswahl mit Selbstkontrolle: auswählen, prüfen, Rückmeldung zu jeder Aussage lesen.
const BEWERTUNG_TEXT: Record<Auswahlaussage["bewertung"], string> = {
  tragfaehig: "Tragfähig",
  eingeschraenkt: "Mit Einschränkung",
  kurz: "Greift zu kurz",
};

export function auswahlGeprueft(w: Werte, schluessel: string): boolean {
  return w[`${schluessel}:geprueft`] === true;
}

export function Mehrfachauswahl({
  schluessel,
  frage,
  hilfe,
  aussagen,
  mindestens = 2,
}: {
  schluessel: string;
  frage: string;
  hilfe?: string;
  aussagen: Auswahlaussage[];
  mindestens?: number;
}) {
  const [wahl, setWahl] = useWert<number[]>(schluessel, []);
  const [geprueft, setGeprueft] = useWert<boolean>(`${schluessel}:geprueft`, false);
  const tragfaehig = wahl.filter((i) => aussagen[i]?.bewertung === "tragfaehig").length;

  function umschalten(i: number) {
    setWahl(wahl.includes(i) ? wahl.filter((j) => j !== i) : [...wahl, i]);
  }

  return (
    <fieldset className="quiz-frage">
      <legend>
        {frage}
        {hilfe && <span className="hilfe hilfe-block">{hilfe}</span>}
      </legend>
      <div className="quiz-optionen">
        {aussagen.map((a, i) => {
          const gewaehlt = wahl.includes(i);
          const status = !geprueft ? "" : a.bewertung === "tragfaehig" ? "richtig" : gewaehlt ? "falsch" : "";
          return (
            <div key={a.text}>
              <button
                type="button"
                role="checkbox"
                aria-checked={gewaehlt}
                disabled={geprueft}
                className={`quiz-option ${status}`}
                onClick={() => umschalten(i)}
              >
                <span className="quiz-buchstabe" aria-hidden="true">
                  {gewaehlt ? "✓" : ""}
                </span>
                <span>{a.text}</span>
              </button>
              {geprueft && (gewaehlt || a.bewertung === "tragfaehig") && (
                <p className={`rueckmeldung ${a.bewertung === "tragfaehig" ? "rueckmeldung-gut" : "rueckmeldung-hinweis"}`}>
                  <strong>{BEWERTUNG_TEXT[a.bewertung]}. </strong>
                  {a.feedback}
                </p>
              )}
            </div>
          );
        })}
      </div>
      {!geprueft ? (
        <div className="impuls-start">
          <button
            type="button"
            className="knopf knopf-primaer"
            disabled={wahl.length < mindestens}
            onClick={() => setGeprueft(true)}
          >
            Auswahl prüfen
          </button>
          {wahl.length < mindestens && (
            <span className="hilfe">
              Wähle mindestens {mindestens} Aussage{mindestens === 1 ? "" : "n"}.
            </span>
          )}
        </div>
      ) : (
        <div className="impuls-start">
          <p className="hilfe" aria-live="polite">
            {tragfaehig} deiner {wahl.length} Begründungen {tragfaehig === 1 ? "ist" : "sind"} tragfähig. Grün markiert
            sind alle tragfähigen Begründungen.
          </p>
          <button
            type="button"
            className="knopf-text"
            onClick={() => {
              setGeprueft(false);
              setWahl([]);
            }}
          >
            Neu auswählen
          </button>
        </div>
      )}
    </fieldset>
  );
}

// Ein Text (z. B. ein Prompt) mit Knopf zum Kopieren in die Zwischenablage.
export function Kopierfeld({ titel, text }: { titel: string; text: string }) {
  const [kopiert, setKopiert] = useState(false);
  async function kopieren() {
    try {
      await navigator.clipboard.writeText(text);
      setKopiert(true);
      window.setTimeout(() => setKopiert(false), 2500);
    } catch {
      setKopiert(false);
      window.alert("Kopieren ist in diesem Browser nicht möglich. Markiere den Text und kopiere ihn mit Strg + C.");
    }
  }
  return (
    <figure className="kopierfeld">
      <figcaption>
        <span>{titel}</span>
        <button type="button" className="knopf knopf-zweit knopf-klein" onClick={kopieren}>
          {kopiert ? "Kopiert ✓" : "Kopieren"}
        </button>
      </figcaption>
      <pre>{text}</pre>
    </figure>
  );
}

// Antwortbausteine: Ein Klick übernimmt den Text in ein Eingabefeld.
export function Bausteine({ bausteine, onWahl, label }: { bausteine: string[]; onWahl: (t: string) => void; label: string }) {
  if (bausteine.length === 0) return null;
  return (
    <div className="bausteine">
      <p className="hilfe">{label}</p>
      <div className="bausteine-liste">
        {bausteine.map((b) => (
          <button key={b} type="button" className="baustein" onClick={() => onWahl(b)}>
            {b}
          </button>
        ))}
      </div>
    </div>
  );
}
