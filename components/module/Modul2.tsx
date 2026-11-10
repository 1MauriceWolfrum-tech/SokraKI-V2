"use client";

import { useState } from "react";
import { Hinweis, Impuls, Textantwort } from "@/components/Bausteine";
import { IconBuch, IconHaken } from "@/components/Icons";
import { Gesehen } from "@/components/module/Gesehen";
import { gesehenSchluessel, type SchrittDef } from "@/components/module/typen";
import { hatText, useFortschritt, useWert } from "@/lib/fortschritt";
import {
  BEGRIFFE,
  CHANCEN,
  GERECHTIGKEITSFRAGE,
  GERECHTIGKEITS_IMPULS,
  KATEGORIEN,
  LERNENDE,
  RISIKEN,
  WEITERLESEN,
  ZUORDNUNG,
  type Kategorie,
} from "@/lib/inhalte/modul2";
import type { Werte } from "@/lib/typen";

function Begriffe() {
  const [offen, setOffen] = useState<string | null>(null);
  const [gesehen, setGesehen] = useWert<string[]>("m2:lernende", []);
  const [aktiv, setAktiv] = useState<string | null>(null);
  const { werte } = useFortschritt();
  const person = LERNENDE.find((l) => l.id === aktiv);

  return (
    <>
      <p>
        Bildungsgerechtigkeit umfasst mehr als die identische Behandlung aller Lernenden. Vier Begriffe helfen, genauer
        hinzusehen – wähle einen Begriff aus, um ihn zu öffnen.
      </p>
      <div className="begriffe">
        {BEGRIFFE.map((b) => (
          <div key={b.id} className={`begriff ${offen === b.id ? "offen" : ""}`}>
            <button
              type="button"
              className="begriff-kopf"
              aria-expanded={offen === b.id}
              onClick={() => setOffen(offen === b.id ? null : b.id)}
            >
              <span className="begriff-name">{b.begriff}</span>
              <span className="begriff-kurz">{b.kurz}</span>
            </button>
            {offen === b.id && <p className="begriff-text">{b.text}</p>}
          </div>
        ))}
      </div>

      <h3 className="abstand-gross">Drei Lernende, drei Ausgangslagen</h3>
      <p>
        Alle drei haben in der Schule Zugang zum selben KI-Chatbot. Wähle jede Person aus und finde heraus, welche
        Herausforderungen bestehen.
      </p>
      <div className="lernende" role="group" aria-label="Lernende auswählen">
        {LERNENDE.map((l) => (
          <button
            key={l.id}
            type="button"
            className={`lernende-karte farbe-${l.farbe} ${aktiv === l.id ? "aktiv" : ""}`}
            aria-pressed={aktiv === l.id}
            onClick={() => {
              setAktiv(l.id);
              if (!gesehen.includes(l.id)) setGesehen([...gesehen, l.id]);
            }}
          >
            <span className="lernende-avatar" aria-hidden="true">
              {l.name.charAt(0)}
            </span>
            <span className="lernende-name">
              {l.name}
              {gesehen.includes(l.id) && <IconHaken groesse={16} />}
            </span>
            <span className="lernende-info">{l.info}</span>
          </button>
        ))}
      </div>
      {person ? (
        <div className={`lernende-detail farbe-${person.farbe}`} aria-live="polite">
          <p className="chip">{person.ebene}</p>
          <dl>
            <dt>Voraussetzungen</dt>
            <dd>{person.voraussetzungen}</dd>
            <dt>Herausforderung beim KI-Einsatz</dt>
            <dd>{person.herausforderung}</dd>
            <dt>Was helfen kann</dt>
            <dd>{person.hilft}</dd>
          </dl>
        </div>
      ) : (
        <p className="hilfe">Noch keine Person ausgewählt.</p>
      )}

      {gesehen.length === LERNENDE.length && (
        <>
          <Textantwort schluessel="m2:zugang" label={GERECHTIGKEITSFRAGE} mindestens={60} />
          <Impuls freigabe={hatText(werte, "m2:zugang", 60)}>
            <p>{GERECHTIGKEITS_IMPULS}</p>
          </Impuls>
        </>
      )}
    </>
  );
}

function Chancen() {
  return (
    <>
      <Gesehen schluessel={gesehenSchluessel("m2", "chancen")} />
      <p>
        KI bietet Potenziale für gerechtere Bildung. Wichtig: Es sind Potenziale – sie treten nicht automatisch ein,
        sondern hängen von der Umsetzung ab.
      </p>
      <div className="karten-raster">
        {CHANCEN.map((c, i) => (
          <article key={c.titel} className={`karte rand-${["hellblau", "flieder", "lindgruen", "pfirsich"][i]}`}>
            <h3>{c.titel}</h3>
            <p>{c.text}</p>
            <p className="karte-fuss">{c.bedingung}</p>
          </article>
        ))}
      </div>
    </>
  );
}

function Risiken() {
  return (
    <>
      <Gesehen schluessel={gesehenSchluessel("m2", "risiken")} />
      <p>Vier Problembereiche zeigen, wie KI bestehende Ungleichheiten verstärken kann.</p>
      <div className="karten-raster">
        {RISIKEN.map((r, i) => (
          <article key={r.titel} className="karte rand-risiko">
            <p className="karte-nummer">{i + 1}</p>
            <h3>{r.titel}</h3>
            <p>{r.text}</p>
            <p className="karte-fuss">
              <strong>Beispiel:</strong> {r.beispiel}
            </p>
          </article>
        ))}
      </div>
    </>
  );
}

function zuordnungKomplett(w: Werte): boolean {
  return ZUORDNUNG.every((z) => typeof w[`m2:zuordnung:${z.id}`] === "string");
}

function Zuordnung() {
  const { werte, setze } = useFortschritt();
  const [geprueft, setGeprueft] = useWert<boolean>("m2:zuordnung:geprueft", false);
  const richtig = ZUORDNUNG.filter((z) => werte[`m2:zuordnung:${z.id}`] === z.loesung).length;

  return (
    <>
      <p>
        Ordne jedes Beispiel einer Kategorie zu: <strong>Chance</strong>, <strong>Risiko</strong> oder{" "}
        <strong>abhängig von der Umsetzung</strong>. Danach siehst du eine Auswertung.
      </p>
      <ol className="zuordnung">
        {ZUORDNUNG.map((z) => {
          const wahl = werte[`m2:zuordnung:${z.id}`] as Kategorie | undefined;
          return (
            <li key={z.id} className="zuordnung-eintrag">
              <p>{z.text}</p>
              <div className="zuordnung-wahl" role="radiogroup" aria-label={`Kategorie für: ${z.text}`}>
                {KATEGORIEN.map((k) => {
                  const status = geprueft ? (k.id === z.loesung ? "richtig" : wahl === k.id ? "falsch" : "") : "";
                  return (
                    <button
                      key={k.id}
                      type="button"
                      role="radio"
                      aria-checked={wahl === k.id}
                      disabled={geprueft}
                      className={`pille ${status}`}
                      onClick={() => setze(`m2:zuordnung:${z.id}`, k.id)}
                    >
                      {k.titel}
                    </button>
                  );
                })}
              </div>
              {geprueft && (
                <p className={`rueckmeldung ${wahl === z.loesung ? "rueckmeldung-gut" : "rueckmeldung-hinweis"}`}>
                  {z.erklaerung}
                </p>
              )}
            </li>
          );
        })}
      </ol>
      {!geprueft ? (
        <button
          type="button"
          className="knopf knopf-primaer"
          disabled={!zuordnungKomplett(werte)}
          onClick={() => setGeprueft(true)}
        >
          Auswerten
        </button>
      ) : (
        <Hinweis art="erfolg">
          {richtig} von {ZUORDNUNG.length} Beispielen passend zugeordnet. Viele Beispiele hängen von der Umsetzung ab –
          genau darum geht es in den Unterrichtsfällen von Modul 3.
        </Hinweis>
      )}
      <aside className="weiterlesen">
        <p className="weiterlesen-titel">
          <IconBuch groesse={18} /> Zum Weiterlesen
        </p>
        <ul>
          {WEITERLESEN.map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ul>
      </aside>
    </>
  );
}

export const MODUL2: SchrittDef[] = [
  {
    id: "begriffe",
    titel: "Was bedeutet Bildungsgerechtigkeit?",
    Inhalt: Begriffe,
    fertig: (w) =>
      Array.isArray(w["m2:lernende"]) && (w["m2:lernende"] as string[]).length === LERNENDE.length && hatText(w, "m2:zugang", 60),
  },
  {
    id: "chancen",
    titel: "Chancen von KI",
    Inhalt: Chancen,
    fertig: (w) => w[gesehenSchluessel("m2", "chancen")] === true,
  },
  {
    id: "risiken",
    titel: "Risiken von KI",
    Inhalt: Risiken,
    fertig: (w) => w[gesehenSchluessel("m2", "risiken")] === true,
  },
  {
    id: "zuordnung",
    titel: "Zuordnungsquiz",
    Inhalt: Zuordnung,
    fertig: (w) => w["m2:zuordnung:geprueft"] === true && zuordnungKomplett(w),
  },
];
