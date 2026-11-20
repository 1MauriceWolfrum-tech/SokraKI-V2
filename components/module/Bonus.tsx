"use client";

import Link from "next/link";
import { useState } from "react";
import { Hinweis, Impuls, Kopierfeld, Textantwort } from "@/components/Bausteine";
import { IconDownload } from "@/components/Icons";
import type { SchrittDef } from "@/components/module/typen";
import { hatText, text, useFortschritt, useWert } from "@/lib/fortschritt";
import {
  CHECKLISTE,
  PLANUNG,
  SCHWACHSTELLEN,
  THEMEN,
  VERANTWORTUNGSFRAGE,
  VERANTWORTUNGS_IMPULS,
  arbeitsblattPrompt,
  planBausteine,
  planBeantwortet,
  planText,
  planungsPromptExtern,
  type PlanAntwort,
} from "@/lib/inhalte/bonus";
import {
  MAX_PROMPT_ZEICHEN,
  MAX_ZEICHEN,
  type ArbeitsblattAntwort,
  type KiModus,
  type ThemaId,
  type Werte,
} from "@/lib/typen";

type Bewertung = { wert: "ja" | "teilweise" | "nein" | ""; notiz: string };
type Schwachstelle = { problem: string; vorschlag: string };

function Entwurf() {
  const { werte } = useFortschritt();
  const entwurf = text(werte, "bonus:entwurf");
  if (!entwurf) return <Hinweis art="warnung">Erzeuge zuerst im ersten Schritt einen Entwurf.</Hinweis>;
  return (
    <figure className="entwurf">
      <figcaption>
        KI-Entwurf {werte["bonus:quelle"] === "skript" ? "(vorbereiteter Beispielentwurf)" : "(von Claude erzeugt)"}
      </figcaption>
      <pre>{entwurf}</pre>
    </figure>
  );
}

function planAntworten(w: Werte): (PlanAntwort | undefined)[] {
  return PLANUNG.map((p) => w[`bonus:plan:${p.id}`] as PlanAntwort | undefined);
}

function planungFertig(w: Werte): boolean {
  return typeof w["bonus:thema"] === "string" && planAntworten(w).every(planBeantwortet);
}

function Planen() {
  const [thema, setThema] = useWert<ThemaId | null>("bonus:thema", null);
  const { werte, setze } = useFortschritt();
  const antworten = planAntworten(werte);
  // Die nächste Frage erscheint erst, wenn die vorherige beantwortet ist.
  const sichtbar = thema ? Math.min(PLANUNG.length, antworten.findIndex((a) => !planBeantwortet(a)) + 1 || PLANUNG.length) : 0;

  function waehle(t: ThemaId) {
    if (t === thema) return;
    setThema(t);
    for (const p of PLANUNG) setze(`bonus:plan:${p.id}`, { wahl: [], eigen: "" });
    setze("bonus:prompt", "");
  }

  function aendere(i: number, neu: Partial<PlanAntwort>) {
    const alt = antworten[i] ?? { wahl: [], eigen: "" };
    setze(`bonus:plan:${PLANUNG[i].id}`, { ...alt, ...neu });
    setze("bonus:prompt", "");
  }

  return (
    <>
      <p>
        Bevor eine KI ein Arbeitsblatt schreibt, planst du es selbst – im sokratischen Dialog. Der Coach stellt dir vier
        Fragen, du entscheidest. Aus deinen Antworten entsteht ein strukturierter Prompt.
      </p>
      <div className="optionen" role="radiogroup" aria-label="Thema wählen">
        {(Object.keys(THEMEN) as ThemaId[]).map((t) => (
          <button
            key={t}
            type="button"
            role="radio"
            aria-checked={thema === t}
            className="option-karte"
            onClick={() => waehle(t)}
          >
            <span className="option-buchstabe">{t === "bwl" ? "€" : "f(x)"}</span>
            <span>
              <strong>{THEMEN[t].titel}</strong>
              <br />
              <span className="hilfe">für {THEMEN[t].zielgruppe}</span>
            </span>
          </button>
        ))}
      </div>

      {thema && (
        <div className="planung" aria-live="polite">
          {PLANUNG.slice(0, sichtbar).map((p, i) => {
            const a = antworten[i] ?? { wahl: [], eigen: "" };
            const vorher = i > 0 ? planText(i - 1, thema, antworten[i - 1]).split("; ")[0] : "";
            return (
              <div key={p.id} className="planung-frage">
                <div className="nachricht nachricht-begleiter">
                  <span className="nachricht-wer">Coach · Frage {i + 1} von {PLANUNG.length}</span>
                  <p>
                    {vorher && <>Du hast notiert: „{vorher}“. </>}
                    {p.frage}
                  </p>
                </div>
                <div className="bausteine">
                  <p className="hilfe">Wähle passende Bausteine (mehrere möglich) und ergänze bei Bedarf:</p>
                  <div className="bausteine-liste">
                    {planBausteine(i, thema).map((b, j) => {
                      const aktiv = a.wahl.includes(j);
                      return (
                        <button
                          key={b}
                          type="button"
                          className="baustein"
                          aria-pressed={aktiv}
                          onClick={() => aendere(i, { wahl: aktiv ? a.wahl.filter((k) => k !== j) : [...a.wahl, j] })}
                        >
                          {aktiv ? "✓ " : ""}
                          {b}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <label className="sr-only" htmlFor={`plan-${p.id}`}>
                  Eigene Ergänzung zu Frage {i + 1}
                </label>
                <input
                  id={`plan-${p.id}`}
                  type="text"
                  maxLength={200}
                  placeholder="Eigene Ergänzung (optional)"
                  value={a.eigen}
                  onChange={(e) => aendere(i, { eigen: e.target.value })}
                />
              </div>
            );
          })}
          {planungFertig(werte) && (
            <Hinweis art="erfolg">
              Deine Planung steht. Im nächsten Schritt wird daraus ein strukturierter Prompt mit vorgegebenem Denkweg
              (Chain of Thought).
            </Hinweis>
          )}
        </div>
      )}
    </>
  );
}

function Generieren() {
  const { werte, setze } = useFortschritt();
  const thema = werte["bonus:thema"] as ThemaId | undefined;
  const geplant = thema ? arbeitsblattPrompt(thema, planAntworten(werte)) : "";
  const gespeichert = text(werte, "bonus:prompt");
  const prompt = gespeichert || geplant;
  const setPrompt = (p: string) => setze("bonus:prompt", p);
  const [laedt, setLaedt] = useState(false);
  const [hinweis, setHinweis] = useState<string | null>(null);

  if (!thema) return <Hinweis art="warnung">Plane zuerst im vorherigen Schritt dein Arbeitsblatt.</Hinweis>;

  async function erzeugen() {
    if (!thema) return;
    setLaedt(true);
    setHinweis(null);
    try {
      const res = await fetch("/api/arbeitsblatt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ thema, prompt }),
      });
      if (!res.ok) throw new Error(String(res.status));
      const daten = (await res.json()) as ArbeitsblattAntwort;
      setze("bonus:entwurf", daten.entwurf);
      setze("bonus:quelle", daten.modus satisfies KiModus);
      setze("bonus:ueberarbeitung", daten.entwurf);
      setHinweis(daten.hinweis ?? null);
    } catch {
      setHinweis("Der Entwurf konnte nicht erzeugt werden. Versuche es noch einmal.");
    } finally {
      setLaedt(false);
    }
  }

  return (
    <>
      <p>
        Aus deiner Planung ist ein strukturierter Prompt entstanden: Rolle, Auftrag, Lerngruppe und ein vorgegebener
        Denkweg in fünf Schritten (<strong>Chain of Thought</strong>). So arbeitet die KI nachvollziehbarer, statt
        sprunghaft zu antworten. Du kannst den Prompt anpassen.
      </p>
      <div className="feld">
        <label htmlFor="bonus-prompt">Dein Arbeitsauftrag an die KI</label>
        <textarea
          id="bonus-prompt"
          rows={16}
          maxLength={MAX_PROMPT_ZEICHEN}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      </div>
      <div className="impuls-start">
        <button
          type="button"
          className="knopf knopf-primaer"
          disabled={laedt || prompt.trim().length < 20}
          onClick={erzeugen}
        >
          {laedt ? "Entwurf wird erzeugt …" : "Entwurf erzeugen"}
        </button>
        {gespeichert && gespeichert !== geplant && (
          <button type="button" className="knopf-text" onClick={() => setPrompt("")}>
            Auf den Prompt aus der Planung zurücksetzen
          </button>
        )}
      </div>
      {werte["bonus:quelle"] !== "claude" && (
        <p className="hilfe">
          Ohne KI-Zugang zeigt der Kurs einen vorbereiteten Beispielentwurf mit typischen Schwachstellen – genau die
          Art Fehler, die auch ein guter Prompt nicht ausschließt.
        </p>
      )}
      <details className="aufklapp">
        <summary>Prompts für deine eigene KI zum Kopieren</summary>
        <Kopierfeld titel="Arbeitsblatt-Prompt (Chain of Thought)" text={prompt} />
        <Kopierfeld titel="Sokratischer Planungs-Prompt: Die KI fragt, du planst" text={planungsPromptExtern(thema)} />
        <p className="hilfe">
          Gib in externe KI-Dienste keine personenbezogenen Daten ein. Mehr dazu unter{" "}
          <Link href="/nachschlagen#anleitung">Nachschlagen</Link>.
        </p>
      </details>
      {hinweis && <Hinweis art="warnung">{hinweis}</Hinweis>}
      {text(werte, "bonus:entwurf") && (
        <div className="abstand-gross">
          <Entwurf />
        </div>
      )}
    </>
  );
}

function Pruefen() {
  const { werte, setze } = useFortschritt();
  return (
    <>
      <p>Prüfe den Entwurf mit der Checkliste. Notiere bei „teilweise“ oder „nein“ kurz, was dir auffällt.</p>
      <details className="aufklapp" open>
        <summary>Entwurf anzeigen</summary>
        <Entwurf />
      </details>
      <div className="checkliste-tabelle">
        {CHECKLISTE.map((c) => {
          const b = (werte[`bonus:check:${c.id}`] as Bewertung | undefined) ?? { wert: "", notiz: "" };
          const setzeB = (neu: Partial<Bewertung>) => setze(`bonus:check:${c.id}`, { ...b, ...neu });
          return (
            <fieldset key={c.id} className="pruef-zeile">
              <legend>
                <strong>{c.kriterium}</strong>
                <span className="hilfe">{c.frage}</span>
              </legend>
              <div className="zuordnung-wahl" role="radiogroup" aria-label={c.kriterium}>
                {(["ja", "teilweise", "nein"] as const).map((w) => (
                  <button
                    key={w}
                    type="button"
                    role="radio"
                    aria-checked={b.wert === w}
                    className={`pille pille-${w}`}
                    onClick={() => setzeB({ wert: w })}
                  >
                    {w === "ja" ? "Ja" : w === "teilweise" ? "Teilweise" : "Nein"}
                  </button>
                ))}
              </div>
              {(b.wert === "teilweise" || b.wert === "nein") && (
                <input
                  type="text"
                  aria-label={`Notiz zu ${c.kriterium}`}
                  placeholder="Was fällt dir auf?"
                  maxLength={300}
                  value={b.notiz}
                  onChange={(e) => setzeB({ notiz: e.target.value })}
                />
              )}
            </fieldset>
          );
        })}
      </div>
    </>
  );
}

function vollstaendigeSchwachstellen(w: Werte): number {
  const liste = (w["bonus:schwachstellen"] as Schwachstelle[] | undefined) ?? [];
  return liste.filter((s) => s.problem.trim().length >= 10 && s.vorschlag.trim().length >= 10).length;
}

function Verbessern() {
  const { werte } = useFortschritt();
  const [liste, setListe] = useWert<Schwachstelle[]>("bonus:schwachstellen", [
    { problem: "", vorschlag: "" },
    { problem: "", vorschlag: "" },
  ]);
  const [ueberarbeitung, setUeberarbeitung] = useWert<string>("bonus:ueberarbeitung", text(werte, "bonus:entwurf"));
  const thema = werte["bonus:thema"] as ThemaId | undefined;
  const anzahl = vollstaendigeSchwachstellen(werte);

  function aendere(i: number, neu: Partial<Schwachstelle>) {
    setListe(liste.map((s, j) => (j === i ? { ...s, ...neu } : s)));
  }

  function speichern() {
    const blob = new Blob([ueberarbeitung], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "arbeitsblatt-ueberarbeitet.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <p>Benenne mindestens zwei Schwachstellen und formuliere jeweils einen konkreten Verbesserungsvorschlag.</p>
      <ol className="schwachstellen">
        {liste.map((s, i) => (
          <li key={i}>
            <label>
              Schwachstelle {i + 1}
              <input
                type="text"
                maxLength={300}
                value={s.problem}
                onChange={(e) => aendere(i, { problem: e.target.value })}
                placeholder="Was ist problematisch?"
              />
            </label>
            <label>
              Verbesserungsvorschlag
              <input
                type="text"
                maxLength={300}
                value={s.vorschlag}
                onChange={(e) => aendere(i, { vorschlag: e.target.value })}
                placeholder="Wie würdest du es ändern?"
              />
            </label>
          </li>
        ))}
      </ol>
      <button type="button" className="knopf-text" onClick={() => setListe([...liste, { problem: "", vorschlag: "" }])}>
        + Weitere Schwachstelle
      </button>

      {anzahl >= 2 && werte["bonus:quelle"] === "skript" && thema && (
        <Impuls freigabe titel="Mit den eingebauten Schwachstellen vergleichen">
          <p>In diesen Beispielentwurf wurden absichtlich Schwachstellen eingebaut:</p>
          <ul>
            {SCHWACHSTELLEN[thema].map((s) => (
              <li key={s.kriterium}>
                <strong>{s.kriterium}:</strong> {s.text}
              </li>
            ))}
          </ul>
        </Impuls>
      )}

      <div className="feld abstand-gross">
        <label htmlFor="bonus-ueberarbeitung">Überarbeitetes Arbeitsblatt (optional)</label>
        <textarea
          id="bonus-ueberarbeitung"
          rows={12}
          maxLength={MAX_ZEICHEN * 3}
          value={ueberarbeitung}
          onChange={(e) => setUeberarbeitung(e.target.value)}
        />
      </div>
      <button type="button" className="knopf knopf-zweit" disabled={!ueberarbeitung.trim()} onClick={speichern}>
        <IconDownload groesse={18} /> Als Textdatei speichern
      </button>
    </>
  );
}

function Reflexion() {
  const { werte } = useFortschritt();
  return (
    <>
      <Textantwort schluessel="bonus:verantwortung" label={VERANTWORTUNGSFRAGE} mindestens={60} />
      <Impuls freigabe={hatText(werte, "bonus:verantwortung", 60)}>
        <p>{VERANTWORTUNGS_IMPULS}</p>
      </Impuls>
    </>
  );
}

export const BONUS: SchrittDef[] = [
  { id: "planen", titel: "Arbeitsblatt sokratisch planen", Inhalt: Planen, fertig: planungFertig },
  { id: "generieren", titel: "Arbeitsblatt generieren", Inhalt: Generieren, fertig: (w) => hatText(w, "bonus:entwurf", 1) },
  {
    id: "pruefen",
    titel: "Arbeitsblatt prüfen",
    Inhalt: Pruefen,
    fertig: (w) =>
      CHECKLISTE.every((c) => {
        const b = w[`bonus:check:${c.id}`] as Bewertung | undefined;
        return Boolean(b?.wert);
      }),
  },
  { id: "verbessern", titel: "Arbeitsblatt verbessern", Inhalt: Verbessern, fertig: (w) => vollstaendigeSchwachstellen(w) >= 2 },
  { id: "reflexion", titel: "Abschließende Reflexion", Inhalt: Reflexion, fertig: (w) => hatText(w, "bonus:verantwortung", 60) },
];
