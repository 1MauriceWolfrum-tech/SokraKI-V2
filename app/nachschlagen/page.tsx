"use client";

import { Hinweis, Kopierfeld } from "@/components/Bausteine";
import { IconBuch } from "@/components/Icons";
import { ANLEITUNG, COT, DIGCOMPEDU, KOMPASS, PROMPT_SOKRATISCH, QUELLEN, UNESCO } from "@/lib/inhalte/nachschlagen";

const ABSCHNITTE = [
  { id: "anleitung", titel: "Sokratischer Dialog mit KI" },
  { id: "cot", titel: "Chain of Thought" },
  { id: "kompass", titel: "KI-Gerechtigkeitskompass" },
  { id: "digcompedu", titel: "DigCompEdu" },
  { id: "unesco", titel: "UNESCO-Kompetenzrahmen" },
  { id: "quellen", titel: "Quellen" },
];

export default function Nachschlagen() {
  return (
    <div className="schmal">
      <h1>Nachschlagen</h1>
      <p>
        Werkzeuge und Referenzrahmen für deinen eigenen Unterricht – jederzeit erreichbar, unabhängig von deinem
        Kursfortschritt.
      </p>
      <nav aria-label="Abschnitte">
        <ul className="inhaltsliste">
          {ABSCHNITTE.map((a) => (
            <li key={a.id}>
              <a href={`#${a.id}`}>{a.titel}</a>
            </li>
          ))}
        </ul>
      </nav>

      <section id="anleitung" className="abschnitt">
        <h2>Anleitung: Sokratischer Dialog mit KI</h2>
        <p>{ANLEITUNG.einleitung}</p>
        <ol className="prozess">
          {ANLEITUNG.schritte.slice(0, 4).map((s) => (
            <li key={s.titel}>
              <strong>{s.titel}</strong>
              {s.text}
            </li>
          ))}
        </ol>
        <p>
          <strong>{ANLEITUNG.schritte[4].titel}:</strong> {ANLEITUNG.schritte[4].text}
        </p>
        <Kopierfeld titel="Prompt-Vorlage: Unterricht sokratisch planen" text={PROMPT_SOKRATISCH} />
        <Kopierfeld titel="Wenn die KI aus der Rolle fällt" text={ANLEITUNG.erinnerung} />
        <Kopierfeld titel="Zum Abschluss des Dialogs" text={ANLEITUNG.abschluss} />
        <Hinweis art="warnung">
          Gib in externe KI-Dienste keine personenbezogenen Daten von Lernenden ein. Prüfe vorher, welche Dienste deine
          Schule datenschutzkonform freigegeben hat.
        </Hinweis>
      </section>

      <section id="cot" className="abschnitt">
        <h2>Chain of Thought: der KI den Denkweg vorgeben</h2>
        <p>{COT.einleitung}</p>
        <div className="karten-raster">
          <article className="karte rand-risiko">
            <h3>Problem</h3>
            <p>{COT.problem}</p>
          </article>
          <article className="karte rand-lindgruen">
            <h3>Lösung</h3>
            <p>{COT.loesung}</p>
          </article>
        </div>
        <Kopierfeld titel="Beispiel-Prompt mit Chain of Thought" text={COT.beispiel} />
        <p className="hilfe">Quelle: {COT.quelle}</p>
      </section>

      <section id="kompass" className="abschnitt">
        <h2>KI-Gerechtigkeitskompass</h2>
        <p>{KOMPASS.einleitung}</p>
        <ol className="kompass-liste">
          {KOMPASS.ebenen.map((e) => (
            <li key={e.titel}>
              <strong>{e.titel}</strong> <span className="hilfe">· {e.zusatz}</span>
              <p>{e.leitfrage}</p>
            </li>
          ))}
        </ol>
        <p className="hilfe">Quelle: {KOMPASS.quelle}</p>
      </section>

      <section id="digcompedu" className="abschnitt">
        <h2>DigCompEdu</h2>
        <p>{DIGCOMPEDU.einleitung}</p>
        <div className="tabelle-rahmen">
          <table>
            <caption>Die sechs Kompetenzbereiche</caption>
            <thead>
              <tr>
                <th scope="col">Bereich</th>
                <th scope="col">Worum es geht</th>
              </tr>
            </thead>
            <tbody>
              {DIGCOMPEDU.bereiche.map((b, i) => (
                <tr key={b.titel}>
                  <th scope="row">
                    {i + 1}. {b.titel}
                  </th>
                  <td>{b.text}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>{DIGCOMPEDU.kurs}</p>
        <p className="hilfe">Quelle: {DIGCOMPEDU.quelle}</p>
      </section>

      <section id="unesco" className="abschnitt">
        <h2>UNESCO AI Competency Framework for Teachers</h2>
        <p>{UNESCO.einleitung}</p>
        <ul>
          {UNESCO.aspekte.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
        <p className="hilfe">Quelle: {UNESCO.quelle}</p>
      </section>

      <section id="quellen" className="abschnitt">
        <aside className="weiterlesen">
          <p className="weiterlesen-titel">
            <IconBuch groesse={18} /> Weitere Quellen
          </p>
          <ul>
            {QUELLEN.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ul>
        </aside>
      </section>
    </div>
  );
}
