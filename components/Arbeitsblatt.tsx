"use client";

import { GRENZEN, NIVEAUS, niveau } from "@/lib/arbeitsblatt";
import type { Arbeitsblatt, Aufgabe } from "@/lib/typen";

// Anzeige, Bearbeitung und Druckfassung eines Arbeitsblatts.

// Der Entwurf so, wie die KI ihn geliefert hat – Lösungen stehen direkt unter den Aufgaben.
export function EntwurfAnsicht({ blatt, quelle }: { blatt: Arbeitsblatt; quelle: string }) {
  return (
    <figure className="entwurf">
      <figcaption>KI-Entwurf {quelle === "skript" ? "(vorbereiteter Beispielentwurf)" : "(von der KI erzeugt)"}</figcaption>
      <div className="entwurf-inhalt">
        <h3>{blatt.titel}</h3>
        {blatt.lernziel && (
          <p>
            <strong>Lernziel:</strong> {blatt.lernziel}
          </p>
        )}
        <p className="vorformatiert">{blatt.situation}</p>
        {blatt.glossar.length > 0 && (
          <dl className="entwurf-glossar">
            {blatt.glossar.map((g, i) => (
              <div key={i}>
                <dt>{g.begriff}</dt>
                <dd>{g.erklaerung}</dd>
              </div>
            ))}
          </dl>
        )}
        <ol className="entwurf-aufgaben">
          {blatt.aufgaben.map((a, i) => (
            <li key={i}>
              <span className="niveau-marke">{niveau(a.niveau).titel}</span>
              <p className="vorformatiert">{a.text}</p>
              {a.hilfe && <p className="hilfe vorformatiert">Hilfe: {a.hilfe}</p>}
              {a.loesung && (
                <p className="entwurf-loesung vorformatiert">
                  <strong>Lösung:</strong> {a.loesung}
                </p>
              )}
            </li>
          ))}
        </ol>
      </div>
    </figure>
  );
}

const LEERE_AUFGABE: Aufgabe = { niveau: "standard", text: "", hilfe: "", loesung: "" };

export function ArbeitsblattEditor({ blatt, aendern }: { blatt: Arbeitsblatt; aendern: (b: Arbeitsblatt) => void }) {
  const setze = (neu: Partial<Arbeitsblatt>) => aendern({ ...blatt, ...neu });
  const setzeAufgabe = (i: number, neu: Partial<Aufgabe>) =>
    setze({ aufgaben: blatt.aufgaben.map((a, j) => (j === i ? { ...a, ...neu } : a)) });
  const setzeBegriff = (i: number, neu: Partial<Arbeitsblatt["glossar"][number]>) =>
    setze({ glossar: blatt.glossar.map((g, j) => (j === i ? { ...g, ...neu } : g)) });

  return (
    <div className="editor">
      <div className="feld">
        <label htmlFor="ab-titel">Titel</label>
        <input
          id="ab-titel"
          type="text"
          maxLength={GRENZEN.kurz}
          value={blatt.titel}
          onChange={(e) => setze({ titel: e.target.value })}
        />
      </div>
      <div className="feld">
        <label htmlFor="ab-lernziel">Lernziel</label>
        <textarea
          id="ab-lernziel"
          rows={2}
          maxLength={GRENZEN.text}
          value={blatt.lernziel}
          onChange={(e) => setze({ lernziel: e.target.value })}
        />
      </div>
      <div className="feld">
        <label htmlFor="ab-situation">Ausgangssituation</label>
        <textarea
          id="ab-situation"
          rows={6}
          maxLength={GRENZEN.text}
          value={blatt.situation}
          onChange={(e) => setze({ situation: e.target.value })}
        />
      </div>

      <fieldset className="editor-block">
        <legend>Wichtige Begriffe (Glossar)</legend>
        {blatt.glossar.length === 0 && <p className="hilfe">Noch keine Begriffe. Sie erscheinen auf dem Blatt in einem Kasten.</p>}
        {blatt.glossar.map((g, i) => (
          <div key={i} className="editor-glossar-zeile">
            <input
              type="text"
              aria-label={`Begriff ${i + 1}`}
              placeholder="Begriff"
              maxLength={GRENZEN.kurz}
              value={g.begriff}
              onChange={(e) => setzeBegriff(i, { begriff: e.target.value })}
            />
            <input
              type="text"
              aria-label={`Erklärung zu Begriff ${i + 1}`}
              placeholder="Kurze Erklärung"
              maxLength={GRENZEN.text}
              value={g.erklaerung}
              onChange={(e) => setzeBegriff(i, { erklaerung: e.target.value })}
            />
            <button
              type="button"
              className="knopf-text"
              aria-label={`Begriff ${i + 1} entfernen`}
              onClick={() => setze({ glossar: blatt.glossar.filter((_, j) => j !== i) })}
            >
              Entfernen
            </button>
          </div>
        ))}
        <button
          type="button"
          className="knopf-text"
          disabled={blatt.glossar.length >= GRENZEN.glossar}
          onClick={() => setze({ glossar: [...blatt.glossar, { begriff: "", erklaerung: "" }] })}
        >
          + Begriff hinzufügen
        </button>
      </fieldset>

      {blatt.aufgaben.map((a, i) => (
        <fieldset key={i} className="editor-block">
          <legend className="editor-kopf">
            <span>Aufgabe {i + 1}</span>
            <button
              type="button"
              className="knopf-text"
              disabled={blatt.aufgaben.length <= 1}
              onClick={() => setze({ aufgaben: blatt.aufgaben.filter((_, j) => j !== i) })}
            >
              Aufgabe entfernen
            </button>
          </legend>
          <div className="feld">
            <label htmlFor={`ab-niveau-${i}`}>Niveau</label>
            <select
              id={`ab-niveau-${i}`}
              value={a.niveau}
              onChange={(e) => setzeAufgabe(i, { niveau: e.target.value as Aufgabe["niveau"] })}
            >
              {NIVEAUS.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.titel}
                </option>
              ))}
            </select>
          </div>
          <div className="feld">
            <label htmlFor={`ab-text-${i}`}>Aufgabenstellung</label>
            <textarea
              id={`ab-text-${i}`}
              rows={3}
              maxLength={GRENZEN.text}
              value={a.text}
              onChange={(e) => setzeAufgabe(i, { text: e.target.value })}
            />
          </div>
          <div className="feld">
            <label htmlFor={`ab-hilfe-${i}`}>Hilfe (optional)</label>
            <textarea
              id={`ab-hilfe-${i}`}
              rows={2}
              maxLength={GRENZEN.text}
              value={a.hilfe}
              onChange={(e) => setzeAufgabe(i, { hilfe: e.target.value })}
            />
          </div>
          <div className="feld">
            <label htmlFor={`ab-loesung-${i}`}>Lösung für die Lehrkraft</label>
            <textarea
              id={`ab-loesung-${i}`}
              rows={3}
              maxLength={GRENZEN.text}
              value={a.loesung}
              onChange={(e) => setzeAufgabe(i, { loesung: e.target.value })}
            />
          </div>
        </fieldset>
      ))}
      <button
        type="button"
        className="knopf knopf-zweit"
        disabled={blatt.aufgaben.length >= GRENZEN.aufgaben}
        onClick={() => setze({ aufgaben: [...blatt.aufgaben, LEERE_AUFGABE] })}
      >
        + Aufgabe hinzufügen
      </button>
    </div>
  );
}

// Druckfassung im A4-Layout. Die Lösungen stehen auf einer eigenen Seite für die Lehrkraft.
export function DruckBlatt({
  blatt,
  fach,
  zielgruppe,
  mitLoesungen,
}: {
  blatt: Arbeitsblatt;
  fach: string;
  zielgruppe: string;
  mitLoesungen: boolean;
}) {
  return (
    <article className="druckblatt" aria-label="Arbeitsblatt">
      <header className="druck-kopf">
        <div>
          <p className="druck-fach">{fach}</p>
          <p className="druck-zielgruppe">für {zielgruppe}</p>
        </div>
        <dl className="druck-felder">
          {["Name", "Klasse", "Datum"].map((f) => (
            <div key={f}>
              <dt>{f}</dt>
              <dd />
            </div>
          ))}
        </dl>
      </header>

      <h1 className="druck-titel">{blatt.titel}</h1>
      {blatt.lernziel && (
        <p className="druck-lernziel">
          <strong>Lernziel:</strong> {blatt.lernziel}
        </p>
      )}

      <section>
        <h2>Ausgangssituation</h2>
        <p className="vorformatiert">{blatt.situation}</p>
      </section>

      {blatt.glossar.some((g) => g.begriff.trim()) && (
        <aside className="druck-glossar">
          <h2>Wichtige Begriffe</h2>
          <dl>
            {blatt.glossar
              .filter((g) => g.begriff.trim())
              .map((g, i) => (
                <div key={i}>
                  <dt>{g.begriff}</dt>
                  <dd>{g.erklaerung}</dd>
                </div>
              ))}
          </dl>
        </aside>
      )}

      <section>
        <h2>Aufgaben</h2>
        <ol className="druck-aufgaben">
          {blatt.aufgaben.map((a, i) => (
            <li key={i} className="druck-aufgabe">
              <p className="druck-aufgabe-kopf">
                <span>Aufgabe {i + 1}</span>
                <span className="druck-niveau">
                  {niveau(a.niveau).marke} {niveau(a.niveau).titel}
                </span>
              </p>
              <p className="vorformatiert">{a.text}</p>
              {a.hilfe && (
                <p className="druck-hilfe vorformatiert">
                  <strong>Tipp:</strong> {a.hilfe}
                </p>
              )}
              <div className="druck-linien" aria-hidden="true">
                <div />
                <div />
                <div />
                <div />
              </div>
            </li>
          ))}
        </ol>
      </section>

      <footer className="druck-fuss">KI-gestützt erstellt, fachlich geprüft und überarbeitet · SokraKI</footer>

      {mitLoesungen && (
        <section className="druck-loesungen">
          <h2>Lösungen für die Lehrkraft – {blatt.titel}</h2>
          <ol>
            {blatt.aufgaben.map((a, i) => (
              <li key={i}>
                <span className="druck-niveau">{niveau(a.niveau).titel}</span>
                <p className="vorformatiert">{a.loesung.trim() || "–"}</p>
              </li>
            ))}
          </ol>
        </section>
      )}
    </article>
  );
}
