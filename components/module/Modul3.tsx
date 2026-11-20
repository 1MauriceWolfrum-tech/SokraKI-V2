"use client";

import {
  Hinweis,
  Impuls,
  Mehrfachauswahl,
  Quiz,
  Textantwort,
  auswahlGeprueft,
  quizErgebnis,
} from "@/components/Bausteine";
import type { SchrittDef } from "@/components/module/typen";
import { hatText, useFortschritt, useWert, zahl } from "@/lib/fortschritt";
import { FALL_A, FALL_B, type OptionId, type Person } from "@/lib/inhalte/modul3";
import type { Werte } from "@/lib/typen";

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
      <div className="tabelle-rahmen tabelle-zahlen">
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
      <p>Wie sollte die Lehrkraft vorgehen? Wähle eine Option.</p>
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

      {option && (
        <>
          <h3 className="abstand-gross">Aufgabe 2: Entscheidung begründen</h3>
          <Mehrfachauswahl
            schluessel="m3:a:gruende"
            frage={`Welche Begründungen stützen deine Wahl (Option ${option})?`}
            hilfe="Wähle alle Aussagen, die zu deiner Entscheidung passen, und prüfe dann deine Auswahl."
            aussagen={FALL_A.begruendungen}
          />
          {auswahlGeprueft(werte, "m3:a:gruende") && (
            <>
              <Textantwort
                schluessel="m3:a:begruendung"
                label="Möchtest du etwas ergänzen? (optional)"
                hilfe="Zum Beispiel einen Gedanken, der in der Auswahl fehlt."
                mindestens={0}
                zeilen={2}
              />
              <Impuls freigabe titel="Impulse zu allen drei Optionen">
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
          )}
        </>
      )}
    </>
  );
}

function FallAReflexion() {
  const { werte } = useFortschritt();
  const fertig = quizErgebnis(werte, FALL_A.reflexion, "m3:a:quiz").alle;
  return (
    <>
      <p>Prüfe deine Entscheidung aus vier Blickwinkeln. Wähle jeweils die Antwort, die du für am treffendsten hältst.</p>
      <Quiz fragen={FALL_A.reflexion} praefix="m3:a:quiz" />
      {fertig && (
        <Hinweis art="info">
          <strong>Didaktisches Ziel:</strong> {FALL_A.ziel} Diese Fragen greift der KI-Lernbegleiter in Modul 4 wieder
          auf.
        </Hinweis>
      )}
    </>
  );
}

function ChatAuszug({ chat, urteil }: { chat: (typeof FALL_B.chats)[number]; urteil: boolean }) {
  const gut = chat.id === "sara";
  return (
    <figure className="chat-auszug">
      <figcaption>
        <strong>{chat.person}</strong> {chat.beschreibung}
        {urteil && (
          <>
            {" "}
            <span className={`urteil ${gut ? "urteil-gut" : "urteil-schwach"}`}>
              {gut ? "sokratisch · lernförderlich" : "nicht sokratisch · wenig lernförderlich"}
            </span>
          </>
        )}
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

function merkmaleKomplett(w: Werte): boolean {
  return FALL_B.merkmale.every((m) => typeof w[`m3:b:merkmal:${m.id}`] === "string");
}

function FallB() {
  const { werte, setze } = useFortschritt();
  const komplett = merkmaleKomplett(werte);
  return (
    <>
      <p className="chip chip-lindgruen">Mathematik · {FALL_B.thema}</p>
      <Situation absaetze={FALL_B.situation} />
      <div className="chat-vergleich">
        {FALL_B.chats.map((c) => (
          <ChatAuszug key={c.id} chat={c} urteil={komplett} />
        ))}
      </div>

      <h3 className="abstand-gross">Aufgabe 1: Analyse</h3>
      <p>
        Ein sokratischer Dialog führt durch gezielte Fragen zur eigenen Erkenntnis, statt fertige Lösungen zu liefern.
        In welchem Chat zeigt sich das jeweilige Merkmal? Die Rückmeldung erscheint sofort.
      </p>
      <ol className="zuordnung">
        {FALL_B.merkmale.map((m) => {
          const wahl = werte[`m3:b:merkmal:${m.id}`] as Person | undefined;
          return (
            <li key={m.id} className="zuordnung-eintrag">
              <p>{m.text}</p>
              <div className="zuordnung-wahl" role="radiogroup" aria-label={`Chat für: ${m.text}`}>
                {FALL_B.chats.map((c) => {
                  const status = wahl ? (c.id === m.loesung ? "richtig" : wahl === c.id ? "falsch" : "") : "";
                  return (
                    <button
                      key={c.id}
                      type="button"
                      role="radio"
                      aria-checked={wahl === c.id}
                      disabled={wahl !== undefined}
                      className={`pille ${status}`}
                      onClick={() => setze(`m3:b:merkmal:${m.id}`, c.id)}
                    >
                      Chat von {c.person}
                    </button>
                  );
                })}
              </div>
              {wahl && (
                <p className={`rueckmeldung ${wahl === m.loesung ? "rueckmeldung-gut" : "rueckmeldung-hinweis"}`}>
                  {m.erklaerung}
                </p>
              )}
            </li>
          );
        })}
      </ol>

      {komplett && (
        <>
          <h3 className="abstand-gross">Auflösung: Welcher Chat ist besser – und warum?</h3>
          <div className="tabelle-rahmen">
            <table>
              <caption>Die beiden Chats im Vergleich mit den Merkmalen des sokratischen Dialogs</caption>
              <thead>
                <tr>
                  <th scope="col">Merkmal</th>
                  <th scope="col">Ben</th>
                  <th scope="col">Sara</th>
                </tr>
              </thead>
              <tbody>
                {FALL_B.vergleich.map((v) => (
                  <tr key={v.kriterium}>
                    <th scope="row">{v.kriterium}</th>
                    <td>{v.ben}</td>
                    <td>{v.sara}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Hinweis art="erfolg">{FALL_B.fazit}</Hinweis>
          <p className="hilfe">Was einen sokratischen Dialog genau ausmacht, vertiefst du in Modul 4.</p>
        </>
      )}
    </>
  );
}

function FallBBewertung() {
  const [bewertung, setBewertung] = useWert<number | null>("m3:b:bewertung", null);
  const [check, setCheck] = useWert<boolean[]>("m3:b:selbstcheck", FALL_B.selbstcheck.map(() => false));
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
      {bewertung !== null && <Quiz fragen={[FALL_B.argument]} praefix="m3:b" />}

      <h3 className="abstand-gross">Aufgabe 3: Handlungsempfehlung</h3>
      <Textantwort
        schluessel="m3:b:empfehlung"
        label={FALL_B.empfehlungFrage}
        hilfe="Zwei bis vier Sätze genügen."
        mindestens={60}
        zeilen={4}
      />
      <Impuls freigabe={hatText(werte, "m3:b:empfehlung", 60)} titel="Mit der Musterlösung vergleichen">
        <p>
          <strong>Musterlösung</strong>
        </p>
        {FALL_B.musterloesung.map((m) => (
          <p key={m}>{m}</p>
        ))}
        <fieldset className="checkliste abstand">
          <legend>Selbstcheck: Was steckt in deiner Empfehlung?</legend>
          {FALL_B.selbstcheck.map((k, i) => (
            <label key={k} className="checkliste-zeile">
              <input
                type="checkbox"
                checked={check[i] ?? false}
                onChange={(e) => setCheck(check.map((v, j) => (j === i ? e.target.checked : v)))}
              />
              {k}
            </label>
          ))}
        </fieldset>
        <p className="hilfe">
          Fehlt etwas? Ergänze deine Empfehlung oben – sie fließt in das Gespräch mit dem Lernbegleiter in Modul 4 ein.
        </p>
      </Impuls>
    </>
  );
}

export const MODUL3: SchrittDef[] = [
  {
    id: "fall-a",
    titel: "Fall A: Entscheidung treffen",
    Inhalt: FallA,
    fertig: (w) => typeof w["m3:a:option"] === "string" && auswahlGeprueft(w, "m3:a:gruende"),
  },
  {
    id: "fall-a-reflexion",
    titel: "Fall A: Entscheidung reflektieren",
    Inhalt: FallAReflexion,
    fertig: (w) => quizErgebnis(w, FALL_A.reflexion, "m3:a:quiz").alle,
  },
  {
    id: "fall-b",
    titel: "Fall B: Zwei Chats analysieren",
    Inhalt: FallB,
    fertig: merkmaleKomplett,
  },
  {
    id: "fall-b-bewertung",
    titel: "Fall B: Bewerten und handeln",
    Inhalt: FallBBewertung,
    fertig: (w) =>
      zahl(w, "m3:b:bewertung") !== null &&
      quizErgebnis(w, [FALL_B.argument], "m3:b").alle &&
      hatText(w, "m3:b:empfehlung", 60),
  },
];
