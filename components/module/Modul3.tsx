"use client";

import { Hinweis, Impuls, Textantwort } from "@/components/Bausteine";
import type { SchrittDef } from "@/components/module/typen";
import { hatText, useFortschritt, useWert, zahl } from "@/lib/fortschritt";
import { FALL_A, FALL_B, type OptionId } from "@/lib/inhalte/modul3";

function Situation({ absaetze }: { absaetze: string[] }) {
  return (
    <div className="situation">
      <p className="situation-titel">Unterrichtssituation</p>
      {absaetze.map((a) => (
        <p key={a}>{a}</p>
      ))}
    </div>
  );
}

function FallA() {
  const [option, setOption] = useWert<OptionId | null>("m3:a:option", null);
  const { werte } = useFortschritt();
  return (
    <>
      <p className="chip chip-hellblau">BWL · {FALL_A.thema}</p>
      <Situation absaetze={FALL_A.situation} />
      <div className="tabelle-rahmen">
        <table>
          <caption>Vorliegende Angebote für 200 Bürostühle</caption>
          <thead>
            <tr>
              <th scope="col">Lieferant</th>
              <th scope="col">Listenpreis</th>
              <th scope="col">Rabatt</th>
              <th scope="col">Skonto</th>
              <th scope="col">Bezugskosten</th>
            </tr>
          </thead>
          <tbody>
            {FALL_A.angebote.map((a) => (
              <tr key={a.lieferant}>
                <th scope="row">{a.lieferant}</th>
                <td>{a.preis}</td>
                <td>{a.rabatt}</td>
                <td>{a.skonto}</td>
                <td>{a.bezugskosten}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="abstand-gross">Aufgabe 1: Entscheidung treffen</h3>
      <p>Wie sollte die Lehrkraft vorgehen? Wähle eine Option und begründe deine Entscheidung.</p>
      <div className="optionen" role="radiogroup" aria-label="Vorgehensweise wählen">
        {FALL_A.optionen.map((o) => (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={option === o.id}
            className="option-karte"
            onClick={() => setOption(o.id)}
          >
            <span className="option-buchstabe">{o.id}</span>
            <span>
              <strong>{o.titel}</strong>
              <br />
              {o.text}
            </span>
          </button>
        ))}
      </div>
      <Textantwort schluessel="m3:a:begruendung" label="Begründe deine Entscheidung." mindestens={60} />
      <Impuls freigabe={option !== null && hatText(werte, "m3:a:begruendung", 60)} titel="Impulse zu allen drei Optionen">
        <dl className="impuls-liste">
          {FALL_A.optionen.map((o) => (
            <div key={o.id} className={option === o.id ? "eigene-wahl" : ""}>
              <dt>
                Option {o.id}: {o.titel}
                {option === o.id && <span className="chip chip-flieder">deine Wahl</span>}
              </dt>
              <dd>{o.impuls}</dd>
            </div>
          ))}
        </dl>
      </Impuls>
    </>
  );
}

function FallAReflexion() {
  const { werte } = useFortschritt();
  const fertig = FALL_A.reflexionsfragen.every((_, i) => hatText(werte, `m3:a:r${i + 1}`, 20));
  return (
    <>
      <p>Prüfe deine Entscheidung aus vier Blickwinkeln. Kurze, präzise Antworten genügen.</p>
      {FALL_A.reflexionsfragen.map((f, i) => (
        <Textantwort key={f} schluessel={`m3:a:r${i + 1}`} label={f} mindestens={20} zeilen={3} />
      ))}
      {fertig && (
        <Hinweis art="info">
          <strong>Didaktisches Ziel:</strong> {FALL_A.ziel} Diese Fragen greift der KI-Lernbegleiter in Modul 4 wieder
          auf.
        </Hinweis>
      )}
    </>
  );
}

function ChatAuszug({ chat }: { chat: (typeof FALL_B.chats)[number] }) {
  return (
    <figure className="chat-auszug">
      <figcaption>
        <strong>{chat.person}</strong> {chat.beschreibung}
      </figcaption>
      {chat.verlauf.map((n, i) => (
        <p key={i} className={`chat-zeile ${n.von === "ki" ? "chat-ki" : "chat-lernend"}`}>
          <span className="chat-wer">{n.von === "ki" ? "KI" : chat.person}</span>
          {n.text}
        </p>
      ))}
    </figure>
  );
}

function FallB() {
  const { werte } = useFortschritt();
  return (
    <>
      <p className="chip chip-lindgruen">Mathematik · {FALL_B.thema}</p>
      <Situation absaetze={FALL_B.situation} />
      <div className="chat-vergleich">
        {FALL_B.chats.map((c) => (
          <ChatAuszug key={c.person} chat={c} />
        ))}
      </div>
      <h3 className="abstand-gross">Aufgabe 1: Analyse</h3>
      <Textantwort schluessel="m3:b:analyse" label={FALL_B.analyseFrage} mindestens={60} />
      <Impuls freigabe={hatText(werte, "m3:b:analyse", 60)}>
        <p>{FALL_B.analyseImpuls}</p>
      </Impuls>
    </>
  );
}

function FallBBewertung() {
  const [bewertung, setBewertung] = useWert<number | null>("m3:b:bewertung", null);
  const { werte } = useFortschritt();
  return (
    <>
      <h3>Aufgabe 2: Bewertung</h3>
      <p>Beurteile die folgende Aussage:</p>
      <blockquote className="these these-klein">„{FALL_B.aussage}“</blockquote>
      <div className="zuordnung-wahl" role="radiogroup" aria-label="Deine Bewertung">
        {FALL_B.bewertungsSkala.map((s, i) => (
          <button
            key={s}
            type="button"
            role="radio"
            aria-checked={bewertung === i}
            className="pille"
            onClick={() => setBewertung(i)}
          >
            {s}
          </button>
        ))}
      </div>
      <Textantwort schluessel="m3:b:bewertung-text" label="Begründe deine Bewertung." mindestens={40} zeilen={3} />
      <Impuls freigabe={bewertung !== null && hatText(werte, "m3:b:bewertung-text", 40)}>
        <p>{FALL_B.aussageImpuls}</p>
      </Impuls>

      <h3 className="abstand-gross">Aufgabe 3: Handlungsempfehlung</h3>
      <p>{FALL_B.massnahmenFrage}</p>
      <Textantwort schluessel="m3:b:massnahme1" label="Maßnahme 1" mindestens={30} zeilen={2} />
      <Textantwort schluessel="m3:b:massnahme2" label="Maßnahme 2" mindestens={30} zeilen={2} />
      <Impuls
        freigabe={hatText(werte, "m3:b:massnahme1", 30) && hatText(werte, "m3:b:massnahme2", 30)}
        titel="Mit Beispielen vergleichen"
      >
        <p>Mögliche Maßnahmen, die andere vorgeschlagen haben:</p>
        <ul>
          {FALL_B.massnahmenImpuls.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
        <p>Wie die KI schrittweise hilft, ohne die eigene Problemlösung zu ersetzen, klärst du in Modul 4.</p>
      </Impuls>
    </>
  );
}

export const MODUL3: SchrittDef[] = [
  {
    id: "fall-a",
    titel: "Fall A: Entscheidung treffen",
    Inhalt: FallA,
    fertig: (w) => typeof w["m3:a:option"] === "string" && hatText(w, "m3:a:begruendung", 60),
  },
  {
    id: "fall-a-reflexion",
    titel: "Fall A: Entscheidung reflektieren",
    Inhalt: FallAReflexion,
    fertig: (w) => FALL_A.reflexionsfragen.every((_, i) => hatText(w, `m3:a:r${i + 1}`, 20)),
  },
  {
    id: "fall-b",
    titel: "Fall B: Analyse",
    Inhalt: FallB,
    fertig: (w) => hatText(w, "m3:b:analyse", 60),
  },
  {
    id: "fall-b-bewertung",
    titel: "Fall B: Bewerten und handeln",
    Inhalt: FallBBewertung,
    fertig: (w) =>
      zahl(w, "m3:b:bewertung") !== null &&
      hatText(w, "m3:b:bewertung-text", 40) &&
      hatText(w, "m3:b:massnahme1", 30) &&
      hatText(w, "m3:b:massnahme2", 30),
  },
];
