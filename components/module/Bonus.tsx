"use client";

import Link from "next/link";
import { useState } from "react";
import { ArbeitsblattEditor, EntwurfAnsicht } from "@/components/Arbeitsblatt";
import { Hinweis, Impuls, Kopierfeld, Textantwort } from "@/components/Bausteine";
import { IconDrucker } from "@/components/Icons";
import { KiHinweis, KiMarke } from "@/components/KiHinweis";
import type { SchrittDef } from "@/components/module/typen";
import { istArbeitsblatt, vollstaendig } from "@/lib/arbeitsblatt";
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
  type Arbeitsblatt,
  type ArbeitsblattAntwort,
  type KiModus,
  type Schwachstelle,
  type ThemaId,
  type Werte,
} from "@/lib/typen";

type Bewertung = { wert: "ja" | "teilweise" | "nein" | ""; notiz: string };

function schwachstellenListe(w: Werte): Schwachstelle[] {
  return (w["bonus:schwachstellen"] as Schwachstelle[] | undefined) ?? [];
}

async function frageArbeitsblatt(anfrage: object): Promise<ArbeitsblattAntwort> {
  const res = await fetch("/api/arbeitsblatt", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(anfrage),
  });
  if (!res.ok) throw new Error(String(res.status));
  return (await res.json()) as ArbeitsblattAntwort;
}

function Entwurf() {
  const { werte } = useFortschritt();
  const blatt = werte["bonus:blatt"];
  if (!istArbeitsblatt(blatt)) {
    return <Hinweis art="warnung">Erzeuge zuerst im Schritt „Arbeitsblatt generieren“ einen Entwurf.</Hinweis>;
  }
  return <EntwurfAnsicht blatt={blatt} quelle={String(werte["bonus:quelle"] ?? "skript")} />;
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
  const vorhanden = istArbeitsblatt(werte["bonus:blatt"]);

  if (!thema) return <Hinweis art="warnung">Plane zuerst im vorherigen Schritt dein Arbeitsblatt.</Hinweis>;

  async function erzeugen() {
    if (!thema) return;
    if (vorhanden && !window.confirm("Ein neuer Entwurf ersetzt den bisherigen und deine Überarbeitung. Fortfahren?")) return;
    setLaedt(true);
    setHinweis(null);
    try {
      const daten = await frageArbeitsblatt({ aktion: "entwurf", thema, prompt });
      setze("bonus:blatt", daten.blatt);
      setze("bonus:quelle", daten.modus satisfies KiModus);
      setze("bonus:fassung", daten.blatt);
      setze("bonus:geprueft", false);
      setze("bonus:ki-ueberarbeitet", false);
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
      <KiHinweis stelle="entwurf" />
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
      {werte["bonus:quelle"] !== "claude" && werte["bonus:quelle"] !== "openrouter" && (
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
      {vorhanden && (
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

function Verbessern() {
  const { werte } = useFortschritt();
  const [liste, setListe] = useWert<Schwachstelle[]>("bonus:schwachstellen", [
    { problem: "", vorschlag: "" },
    { problem: "", vorschlag: "" },
  ]);
  const thema = werte["bonus:thema"] as ThemaId | undefined;
  const anzahl = vollstaendig(schwachstellenListe(werte)).length;

  function aendere(i: number, neu: Partial<Schwachstelle>) {
    setListe(liste.map((s, j) => (j === i ? { ...s, ...neu } : s)));
  }

  return (
    <>
      <p>
        Benenne mindestens zwei Schwachstellen und formuliere jeweils einen konkreten Verbesserungsvorschlag. Im nächsten
        Schritt setzt du die Vorschläge um.
      </p>
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
      <button
        type="button"
        className="knopf-text"
        disabled={liste.length >= 10}
        onClick={() => setListe([...liste, { problem: "", vorschlag: "" }])}
      >
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
    </>
  );
}

function Fertigstellen() {
  const { werte } = useFortschritt();
  const [fassung, setFassung] = useWert<Arbeitsblatt | null>("bonus:fassung", null);
  const [geprueft, setGeprueft] = useWert<boolean>("bonus:geprueft", false);
  const [kiUeberarbeitet, setKiUeberarbeitet] = useWert<boolean>("bonus:ki-ueberarbeitet", false);
  const [laedt, setLaedt] = useState(false);
  const [meldung, setMeldung] = useState<{ art: "erfolg" | "warnung"; text: string } | null>(null);

  const entwurf = werte["bonus:blatt"];
  const thema = werte["bonus:thema"] as ThemaId | undefined;
  if (!istArbeitsblatt(entwurf) || !thema) {
    return <Hinweis art="warnung">Erzeuge zuerst im Schritt „Arbeitsblatt generieren“ einen Entwurf.</Hinweis>;
  }
  const blatt = istArbeitsblatt(fassung) ? fassung : entwurf;
  const vorschlaege = vollstaendig(schwachstellenListe(werte));
  const mitKi = werte["bonus:quelle"] !== "skript";

  // Jede Änderung nach der Prüfung verlangt eine neue Prüfung.
  function aendern(neu: Arbeitsblatt) {
    setFassung(neu);
    if (geprueft) setGeprueft(false);
  }

  async function einarbeiten() {
    setLaedt(true);
    setMeldung(null);
    try {
      const daten = await frageArbeitsblatt({ aktion: "ueberarbeiten", thema, blatt, schwachstellen: vorschlaege });
      if (daten.modus === "skript") {
        setMeldung({ art: "warnung", text: daten.hinweis ?? "Die KI ist gerade nicht verfügbar. Ändere die Felder selbst." });
        return;
      }
      aendern(daten.blatt);
      setKiUeberarbeitet(true);
      setMeldung({
        art: "erfolg",
        text: "Die KI hat deine Vorschläge eingearbeitet. Prüfe jede Änderung – besonders Zahlen und Lösungen.",
      });
    } catch {
      setMeldung({ art: "warnung", text: "Die Überarbeitung hat nicht geklappt. Versuche es noch einmal oder ändere die Felder selbst." });
    } finally {
      setLaedt(false);
    }
  }

  function zuruecksetzen() {
    if (!window.confirm("Alle Änderungen verwerfen und zum ursprünglichen Entwurf zurückkehren?")) return;
    aendern(entwurf as Arbeitsblatt);
    setKiUeberarbeitet(false);
    setMeldung(null);
  }

  return (
    <>
      <p>
        Setze jetzt deine Verbesserungsvorschläge um.{" "}
        {mitKi
          ? "Du kannst sie von der KI einarbeiten lassen und das Ergebnis danach in den Feldern anpassen."
          : "Ändere dazu die Felder direkt."}{" "}
        Was hier steht, kommt so auf das Arbeitsblatt.
      </p>
      {mitKi && <KiHinweis stelle="ueberarbeitung" />}
      {mitKi && (
        <div className="knopfreihe">
          <button
            type="button"
            className="knopf knopf-primaer"
            disabled={laedt || vorschlaege.length === 0}
            onClick={einarbeiten}
          >
            {laedt
              ? "KI arbeitet deine Vorschläge ein …"
              : `${vorschlaege.length} ${vorschlaege.length === 1 ? "Vorschlag" : "Vorschläge"} von der KI einarbeiten lassen`}
          </button>
        </div>
      )}
      {meldung && <Hinweis art={meldung.art}>{meldung.text}</Hinweis>}

      <div className="abstand-gross">
        {kiUeberarbeitet && (
          <p className="ki-vermerk">
            <KiMarke text="KI-überarbeitet" /> Diese Fassung enthält Änderungen der KI. Prüfe sie, bevor du das
            Arbeitsblatt verwendest.
          </p>
        )}
        <ArbeitsblattEditor blatt={blatt} aendern={aendern} />
      </div>
      <button type="button" className="knopf-text" onClick={zuruecksetzen}>
        Zum ursprünglichen Entwurf zurückkehren
      </button>

      <div className="fertig-pruefung">
        <label className="checkliste-zeile">
          <input type="checkbox" checked={geprueft} onChange={(e) => setGeprueft(e.target.checked)} />
          Ich habe das Arbeitsblatt geprüft – auch alle Zahlen und Lösungen.
        </label>
        {geprueft ? (
          <Link href="/arbeitsblatt" className="knopf knopf-primaer">
            <IconDrucker groesse={18} /> Arbeitsblatt als PDF
          </Link>
        ) : (
          <p className="hilfe">Bestätige deine Prüfung, dann kannst du das Arbeitsblatt drucken oder als PDF speichern.</p>
        )}
      </div>
    </>
  );
}

function Reflexion() {
  const { werte } = useFortschritt();
  return (
    <>
      <Textantwort schluessel="bonus:verantwortung" label={VERANTWORTUNGSFRAGE} mindestens={30} />
      <Impuls freigabe={hatText(werte, "bonus:verantwortung", 30)}>
        <p>{VERANTWORTUNGS_IMPULS}</p>
      </Impuls>
    </>
  );
}

export const BONUS: SchrittDef[] = [
  { id: "planen", titel: "Arbeitsblatt sokratisch planen", Inhalt: Planen, fertig: planungFertig },
  {
    id: "generieren",
    titel: "Arbeitsblatt generieren",
    Inhalt: Generieren,
    fertig: (w) => istArbeitsblatt(w["bonus:blatt"]),
  },
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
  {
    id: "verbessern",
    titel: "Schwachstellen benennen",
    Inhalt: Verbessern,
    fertig: (w) => vollstaendig(schwachstellenListe(w)).length >= 2,
  },
  {
    id: "fertigstellen",
    titel: "Arbeitsblatt fertigstellen",
    Inhalt: Fertigstellen,
    fertig: (w) => istArbeitsblatt(w["bonus:fassung"]) && w["bonus:geprueft"] === true,
  },
  { id: "reflexion", titel: "Abschließende Reflexion", Inhalt: Reflexion, fertig: (w) => hatText(w, "bonus:verantwortung", 30) },
];
