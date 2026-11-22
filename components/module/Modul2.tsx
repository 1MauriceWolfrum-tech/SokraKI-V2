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
  DIGITAL_DIVIDE,
  KERNRISIKEN,
  KI_KANN,
  KI_KANN_NICHT,
  KI_KERNSATZ,
  VERTRAUENSFAELLE,
  VERTRAUENSSTUFEN,
  GERECHTIGKEITSFRAGE,
  GERECHTIGKEITS_IMPULS,
  KATEGORIEN,
  LERNENDE,
  RISIKEN,
  WEITERLESEN,
  ZUORDNUNG,
  type Kategorie,
  type Vertrauen,
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
          <Textantwort schluessel="m2:zugang" label={GERECHTIGKEITSFRAGE} mindestens={30} />
          <Impuls freigabe={hatText(werte, "m2:zugang", 30)}>
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

function vertrauenKomplett(w: Werte): boolean {
  return VERTRAUENSFAELLE.every((v) => typeof w[`m2:vertrauen:${v.id}`] === "string");
}

function KiWissen() {
  const { werte, setze } = useFortschritt();
  return (
    <>
      <p>
        KI-Systeme wie ChatGPT, Gemini oder Claude antworten freundlich und sprachlich sicher. Das verleitet dazu, ihnen
        menschliche Fähigkeiten zuzuschreiben, die sie nicht haben. Sprachmodelle berechnen, welches Wort mit der
        höchsten Wahrscheinlichkeit als Nächstes folgt – ohne echtes Verständnis, Bewusstsein oder moralisches Urteil.
      </p>
      <div className="karten-raster">
        <article className="karte rand-hellblau">
          <h3>Was KI kann</h3>
          <ul>
            {KI_KANN.map((k) => (
              <li key={k}>{k}</li>
            ))}
          </ul>
        </article>
        <article className="karte rand-pfirsich">
          <h3>Was KI (noch) nicht kann</h3>
          <ul>
            {KI_KANN_NICHT.map((k) => (
              <li key={k}>{k}</li>
            ))}
          </ul>
        </article>
      </div>
      <Hinweis art="info">
        <strong>{KI_KERNSATZ}</strong>
      </Hinweis>

      <h3 className="abstand-gross">Drei Kernrisiken und was sie für heterogene Klassen bedeuten</h3>
      <div className="karten-raster">
        {KERNRISIKEN.map((r) => (
          <article key={r.titel} className="karte rand-risiko">
            <h3>{r.titel}</h3>
            <p>{r.text}</p>
            <p className="karte-fuss">
              <strong>Auswirkung auf Heterogenität:</strong> {r.heterogenitaet}
            </p>
          </article>
        ))}
      </div>

      <h3 className="abstand-gross">Die drei Ebenen des Digital Divide</h3>
      <div className="tabelle-rahmen">
        <table>
          <caption>Digitale Ungleichheit zeigt sich nicht nur beim Zugang</caption>
          <thead>
            <tr>
              <th scope="col">Ebene</th>
              <th scope="col">Worum es geht</th>
              <th scope="col">Beispiel aus dem Kurs</th>
            </tr>
          </thead>
          <tbody>
            {DIGITAL_DIVIDE.map((d) => (
              <tr key={d.ebene}>
                <th scope="row">
                  {d.ebene}
                  <br />
                  <span className="hilfe">{d.stichwort}</span>
                </th>
                <td>{d.text}</td>
                <td>{d.beispiel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="abstand-gross">Wie viel Vertrauen ist angemessen?</h3>
      <p>
        Problematisch ist beides: KI-Ergebnisse ungeprüft zu übernehmen und KI pauschal abzulehnen. Ziel ist ein
        angemessenes, fachlich begründetes Vertrauen (<em>Appropriate Reliance</em>): Die KI unterstützt Entscheidungen,
        trifft sie aber nicht.
      </p>
      <div className="vertrauensskala" aria-hidden="true">
        <div className="vertrauensskala-balken" />
        <div className="vertrauensskala-beschriftung">
          <span>Zu wenig: KI wird gar nicht genutzt</span>
          <span>Angemessen: KI unterstützt Entscheidungen</span>
          <span>Zu viel: KI wird ungeprüft übernommen</span>
        </div>
      </div>
      <p>Ordne die vier Situationen auf der Skala ein. Die Rückmeldung erscheint sofort.</p>
      <ol className="zuordnung">
        {VERTRAUENSFAELLE.map((v) => {
          const wahl = werte[`m2:vertrauen:${v.id}`] as Vertrauen | undefined;
          return (
            <li key={v.id} className="zuordnung-eintrag">
              <p>{v.text}</p>
              <div className="zuordnung-wahl" role="radiogroup" aria-label={`Einordnung für: ${v.text}`}>
                {VERTRAUENSSTUFEN.map((s) => {
                  const status = wahl ? (s.id === v.loesung ? "richtig" : wahl === s.id ? "falsch" : "") : "";
                  return (
                    <button
                      key={s.id}
                      type="button"
                      role="radio"
                      aria-checked={wahl === s.id}
                      disabled={wahl !== undefined}
                      className={`pille ${status}`}
                      onClick={() => setze(`m2:vertrauen:${v.id}`, s.id)}
                    >
                      {s.titel}
                    </button>
                  );
                })}
              </div>
              {wahl && (
                <p className={`rueckmeldung ${wahl === v.loesung ? "rueckmeldung-gut" : "rueckmeldung-hinweis"}`}>
                  {v.erklaerung}
                </p>
              )}
            </li>
          );
        })}
      </ol>
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
      Array.isArray(w["m2:lernende"]) && (w["m2:lernende"] as string[]).length === LERNENDE.length && hatText(w, "m2:zugang", 30),
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
    id: "ki-wissen",
    titel: "Was Lehrkräfte über KI wissen sollten",
    Inhalt: KiWissen,
    fertig: vertrauenKomplett,
  },
  {
    id: "zuordnung",
    titel: "Zuordnungsquiz",
    Inhalt: Zuordnung,
    fertig: (w) => w["m2:zuordnung:geprueft"] === true && zuordnungKomplett(w),
  },
];
