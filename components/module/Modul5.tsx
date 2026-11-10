"use client";

import { Hinweis, Quiz, Skala, Textantwort, quizErgebnis } from "@/components/Bausteine";
import { IconDownload } from "@/components/Icons";
import { TheseZitat } from "@/components/module/Modul1";
import type { SchrittDef } from "@/components/module/typen";
import { hatText, text, useFortschritt, useWert, zahl } from "@/lib/fortschritt";
import { SKALA } from "@/lib/inhalte/modul1";
import { ABSCHLUSSTEST, FEEDBACK_AUSSAGEN, KRITERIEN, REFLEXIONSFRAGEN } from "@/lib/inhalte/modul5";

function Position() {
  const { werte } = useFortschritt();
  const vorher = zahl(werte, "m1:these");
  const nachher = zahl(werte, "m5:these");
  const label = (w: number | null) => (w === null ? "–" : `${w} – ${SKALA[w - 1].text}`);
  return (
    <>
      <p>Zum Abschluss die Aussage vom Anfang – wie siehst du sie jetzt?</p>
      <TheseZitat />
      <Skala schluessel="m5:these" legende="Wie stark stimmst du jetzt zu?" optionen={SKALA} />
      {nachher !== null && (
        <div className="vergleich" aria-live="polite">
          <div className="vergleich-spalte">
            <p className="vergleich-titel">Modul 1</p>
            <p className="vergleich-wert">{label(vorher)}</p>
            <p className="hilfe">„{text(werte, "m1:begruendung")}“</p>
          </div>
          <div className="vergleich-spalte vergleich-jetzt">
            <p className="vergleich-titel">Jetzt</p>
            <p className="vergleich-wert">{label(nachher)}</p>
            <p className="hilfe">
              {vorher === null || vorher === nachher
                ? "Deine Position ist gleich geblieben – entscheidend ist, wie gut du sie jetzt begründen kannst."
                : `Deine Zustimmung hat sich um ${Math.abs(nachher - vorher)} Punkt${Math.abs(nachher - vorher) === 1 ? "" : "e"} ${nachher < vorher ? "verringert" : "erhöht"}.`}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

function Reflexion() {
  const [kriterien, setKriterien] = useWert<boolean[]>("m5:kriterien", KRITERIEN.map(() => false));
  return (
    <>
      {REFLEXIONSFRAGEN.map((f) => (
        <Textantwort key={f.id} schluessel={`m5:${f.id}`} label={f.frage} mindestens={40} zeilen={3} />
      ))}
      <fieldset className="checkliste">
        <legend>Prüfe deine Antworten: Was macht eine gute Begründung aus?</legend>
        {KRITERIEN.map((k, i) => (
          <label key={k} className="checkliste-zeile">
            <input
              type="checkbox"
              checked={kriterien[i] ?? false}
              onChange={(e) => setKriterien(kriterien.map((v, j) => (j === i ? e.target.checked : v)))}
            />
            {k}
          </label>
        ))}
      </fieldset>
    </>
  );
}

function Test() {
  const { werte } = useFortschritt();
  const ergebnis = quizErgebnis(werte, ABSCHLUSSTEST, "m5:test");
  return (
    <>
      <p>Fünf Fragen – nicht nur Begriffe, sondern auch kleine Anwendungssituationen.</p>
      <Quiz fragen={ABSCHLUSSTEST} praefix="m5:test" />
      {ergebnis.alle && (
        <Hinweis art={ergebnis.richtig >= 4 ? "erfolg" : "info"}>
          {ergebnis.richtig} von {ABSCHLUSSTEST.length} Fragen richtig.{" "}
          {ergebnis.richtig >= 4
            ? "Du hast die Grundlagen sicher verstanden."
            : "Wirf bei Bedarf noch einmal einen Blick in Modul 2."}
        </Hinweis>
      )}
    </>
  );
}

function Feedback() {
  const { werte } = useFortschritt();
  const vollstaendig = FEEDBACK_AUSSAGEN.every((f) => zahl(werte, `m5:fb:${f.id}`) !== null);

  function speichern() {
    const daten = {
      kurs: "KI bildungsgerecht im Unterricht einsetzen (Prototyp V2)",
      datum: new Date().toISOString().slice(0, 10),
      bewertungen: Object.fromEntries(FEEDBACK_AUSSAGEN.map((f) => [f.text, zahl(werte, `m5:fb:${f.id}`)])),
      verbesserung: text(werte, "m5:fb:offen"),
      these: { vorher: zahl(werte, "m1:these"), nachher: zahl(werte, "m5:these") },
    };
    const blob = new Blob([JSON.stringify(daten, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "kursfeedback-sokraki.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <p>
        Hilf uns, den Kurs zu verbessern. Deine Angaben bleiben in deinem Browser; du entscheidest, ob du die Datei an
        das Projektteam weitergibst.
      </p>
      {FEEDBACK_AUSSAGEN.map((f) => (
        <Skala
          key={f.id}
          schluessel={`m5:fb:${f.id}`}
          legende={f.text}
          optionen={[1, 2, 3, 4, 5].map((n) => ({
            wert: n,
            text: n === 1 ? "trifft nicht zu" : n === 5 ? "trifft voll zu" : "",
          }))}
        />
      ))}
      <Textantwort schluessel="m5:fb:offen" label="Was sollten wir verbessern? (optional)" mindestens={0} zeilen={3} />
      <button type="button" className="knopf knopf-zweit" disabled={!vollstaendig} onClick={speichern}>
        <IconDownload groesse={18} /> Feedback als Datei speichern
      </button>
    </>
  );
}

export const MODUL5: SchrittDef[] = [
  { id: "position", titel: "Erneut positionieren", Inhalt: Position, fertig: (w) => zahl(w, "m5:these") !== null },
  {
    id: "reflexion",
    titel: "Reflexion",
    Inhalt: Reflexion,
    fertig: (w) => REFLEXIONSFRAGEN.every((f) => hatText(w, `m5:${f.id}`, 40)),
  },
  { id: "test", titel: "Abschlusstest", Inhalt: Test, fertig: (w) => quizErgebnis(w, ABSCHLUSSTEST, "m5:test").alle },
  {
    id: "feedback",
    titel: "Kursfeedback",
    Inhalt: Feedback,
    fertig: (w) => FEEDBACK_AUSSAGEN.every((f) => zahl(w, `m5:fb:${f.id}`) !== null),
  },
];
