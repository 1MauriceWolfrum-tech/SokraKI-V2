"use client";

import { useState } from "react";
import { antwortReihenfolge } from "@/components/Bausteine";
import { IconSchloss, IconSchluessel } from "@/components/Icons";
import type { SchrittDef } from "@/components/module/typen";
import { useFortschritt, useWert } from "@/lib/fortschritt";
import { ESCAPE_EINLEITUNG, RAEUME, type Raum } from "@/lib/inhalte/escaperoom";
import type { Werte } from "@/lib/typen";

// Escape Room in Modul 3: Jeder Raum ist ein Lernschritt. Ein Raum gilt als gelöst, wenn das Rätsel richtig
// beantwortet ist; falsche Versuche zeigen eine Rückmeldung, die Tür bleibt dann zu.

type RaumStand = { versucht: number[]; wahl: number[]; geloest: boolean };
const LEER: RaumStand = { versucht: [], wahl: [], geloest: false };

function raumSchluessel(id: string) {
  return `m3:${id}`;
}

export function raumGeloest(w: Werte, id: string): boolean {
  return (w[raumSchluessel(id)] as RaumStand | undefined)?.geloest === true;
}

function Schluesselbund() {
  const { werte } = useFortschritt();
  return (
    <ol className="schluesselbund" aria-label="Gesammelte Schlüssel">
      {RAEUME.map((r, i) => {
        const da = raumGeloest(werte, r.id);
        return (
          <li key={r.id} className={da ? "gefunden" : ""}>
            {da ? <IconSchluessel groesse={18} /> : <IconSchloss groesse={18} />}
            <span>
              Schlüssel {i + 1}
              <span className="sr-only">{da ? " gefunden" : " noch verschlossen"}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function Raetsel({ raum, nummer }: { raum: Raum; nummer: number }) {
  const [stand, setStand] = useWert<RaumStand>(raumSchluessel(raum.id), LEER);
  const [geprueft, setGeprueft] = useState(false);
  const { raetsel } = raum;
  const reihenfolge = antwortReihenfolge(raum.id, raetsel.optionen.length);
  const richtige = raetsel.optionen.flatMap((o, i) => (o.richtig ? [i] : []));

  function waehleEinzeln(i: number) {
    if (stand.geloest) return;
    if (raetsel.optionen[i].richtig) setStand({ ...stand, wahl: [i], geloest: true });
    else setStand({ ...stand, wahl: [i], versucht: [...new Set([...stand.versucht, i])] });
  }

  function umschalten(i: number) {
    if (stand.geloest) return;
    setGeprueft(false);
    setStand({ ...stand, wahl: stand.wahl.includes(i) ? stand.wahl.filter((k) => k !== i) : [...stand.wahl, i] });
  }

  function pruefen() {
    const alleRichtig = stand.wahl.length === richtige.length && richtige.every((i) => stand.wahl.includes(i));
    setGeprueft(true);
    if (alleRichtig) setStand({ ...stand, geloest: true });
  }

  const zuletzt = stand.wahl.at(-1);
  const gefunden = stand.wahl.filter((i) => raetsel.optionen[i].richtig).length;
  const falschGewaehlt = stand.wahl.filter((i) => !raetsel.optionen[i].richtig);

  return (
    <fieldset className="quiz-frage raetsel">
      <legend>
        <span className="quiz-nummer">Rätsel {nummer}</span>
        {raetsel.frage}
        {raetsel.mehrfach && <span className="hilfe"> Wähle alle zutreffenden Antworten aus.</span>}
      </legend>
      <div
        role={raetsel.mehrfach ? "group" : "radiogroup"}
        aria-label={raetsel.frage}
        className="quiz-optionen"
      >
        {reihenfolge.map((i, position) => {
          const o = raetsel.optionen[i];
          const gewaehlt = stand.wahl.includes(i);
          const status = raetsel.mehrfach
            ? stand.geloest && o.richtig
              ? "richtig"
              : geprueft && gewaehlt && !o.richtig
                ? "falsch"
                : ""
            : stand.geloest && o.richtig
              ? "richtig"
              : stand.versucht.includes(i)
                ? "falsch"
                : "";
          return (
            <button
              key={o.text}
              type="button"
              role={raetsel.mehrfach ? "checkbox" : "radio"}
              aria-checked={gewaehlt}
              disabled={stand.geloest || (!raetsel.mehrfach && stand.versucht.includes(i))}
              className={`quiz-option ${status}`}
              onClick={() => (raetsel.mehrfach ? umschalten(i) : waehleEinzeln(i))}
            >
              <span className="quiz-buchstabe">{String.fromCharCode(65 + position)}</span>
              <span>{o.text}</span>
            </button>
          );
        })}
      </div>

      {raetsel.mehrfach && !stand.geloest && (
        <div className="impuls-start">
          <button type="button" className="knopf knopf-primaer" disabled={stand.wahl.length === 0} onClick={pruefen}>
            Tür öffnen
          </button>
        </div>
      )}

      <div aria-live="polite">
        {!raetsel.mehrfach && zuletzt !== undefined && !stand.geloest && (
          <p className="rueckmeldung rueckmeldung-hinweis">
            <strong>Die Tür bleibt zu. </strong>
            {raetsel.optionen[zuletzt].feedback}
          </p>
        )}
        {raetsel.mehrfach && geprueft && !stand.geloest && (
          <p className="rueckmeldung rueckmeldung-hinweis">
            <strong>Die Tür bleibt zu. </strong>
            Du hast {gefunden} von {richtige.length} Problemen gefunden.{" "}
            {falschGewaehlt.map((i) => raetsel.optionen[i].feedback).join(" ")}
          </p>
        )}
        {stand.geloest && (
          <>
            <p className="rueckmeldung rueckmeldung-gut">
              <strong>Gelöst! </strong>
              {raetsel.mehrfach
                ? richtige.map((i) => raetsel.optionen[i].feedback).join(" ")
                : raetsel.optionen[richtige[0]].feedback}
            </p>
            <div className="schluessel-karte">
              <span className="schluessel-symbol" aria-hidden="true">
                <IconSchluessel groesse={22} />
              </span>
              <div>
                <p className="schluessel-titel">Schlüssel {nummer}</p>
                <p>{raum.schluessel}</p>
              </div>
            </div>
          </>
        )}
      </div>
    </fieldset>
  );
}

function RaumAnsicht({ raum, nummer }: { raum: Raum; nummer: number }) {
  return (
    <>
      {nummer === 1 && <p>{ESCAPE_EINLEITUNG}</p>}
      <Schluesselbund />
      <div className="chips">
        <span className="chip chip-hellblau">{raum.ort}</span>
        <span className="chip chip-flieder">Thema: {raum.thema}</span>
      </div>

      <section className="raum-szene" aria-label="Szene">
        <p className="raum-label">Szene</p>
        <p>{raum.szene}</p>
      </section>

      <section className="situation" aria-label="Hintergrund">
        <p className="situation-titel">Hintergrund</p>
        <p>{raum.hintergrund}</p>
        {raum.prompt && (
          <figure className="raum-prompt">
            <figcaption>{raum.prompt.titel}</figcaption>
            <blockquote>{raum.prompt.text}</blockquote>
          </figure>
        )}
        {raum.aufgaben && (
          <ul className="raum-aufgaben">
            {raum.aufgaben.map((a) => (
              <li key={a.titel}>
                <strong>{a.titel}:</strong> „{a.text}“
              </li>
            ))}
          </ul>
        )}
        {raum.danach && <p>{raum.danach}</p>}
      </section>

      {raum.chats && (
        <div className="chat-vergleich">
          {raum.chats.map((c) => (
            <figure key={c.person} className="chat-auszug">
              <figcaption>
                <strong>Chatverlauf {c.person}</strong> ({c.beschreibung})
              </figcaption>
              {c.verlauf.map((n, i) =>
                n.von === "notiz" ? (
                  <p key={i} className="chat-notiz">
                    {n.text}
                  </p>
                ) : (
                  <p key={i} className={`chat-zeile ${n.von === "ki" ? "chat-ki" : "chat-lernend"}`}>
                    <span className="chat-wer">{n.von === "ki" ? "KI" : c.person}</span>
                    {n.text}
                  </p>
                ),
              )}
            </figure>
          ))}
        </div>
      )}

      <blockquote className="raum-reflexion">
        <p className="raum-label">Innere Reflexion</p>
        <p>{raum.reflexion}</p>
      </blockquote>

      <Raetsel raum={raum} nummer={nummer} />
    </>
  );
}

export const ESCAPE_SCHRITTE: SchrittDef[] = RAEUME.map((raum, i) => ({
  id: raum.id,
  titel: `Raum ${i + 1}: ${raum.titel}`,
  Inhalt: function RaumSchritt() {
    return <RaumAnsicht raum={raum} nummer={i + 1} />;
  },
  fertig: (w: Werte) => raumGeloest(w, raum.id),
}));
