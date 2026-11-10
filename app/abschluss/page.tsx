"use client";

import Link from "next/link";
import { Hinweis } from "@/components/Bausteine";
import { IconDrucker } from "@/components/Icons";
import { useKursstand } from "@/components/module";
import { useWert } from "@/lib/fortschritt";
import { KURS, MODULE } from "@/lib/inhalte/kurs";

export default function Abschluss() {
  const { geladen, kursFertig, status } = useKursstand();
  const [name, setName] = useWert<string>("abschluss:name", "");
  const [datum] = useWert<string>("abschluss:datum", new Date().toLocaleDateString("de-DE"));

  if (!geladen) return <p className="schmal hilfe">Lade Fortschritt …</p>;
  if (!kursFertig) {
    return (
      <div className="schmal">
        <h1>Teilnahmebestätigung</h1>
        <p>Die Bestätigung steht bereit, sobald du die Module 01 bis 05 abgeschlossen hast.</p>
        <Link href="/#lernpfad" className="knopf knopf-primaer">
          Zum Lernpfad
        </Link>
      </div>
    );
  }

  const bonusFertig = status.find((s) => s.id === "bonus")?.fertig;

  return (
    <div className="schmal">
      <div className="nicht-drucken">
        <h1>Geschafft!</h1>
        <p>
          Du hast den Selbstlernkurs abgeschlossen. Trage optional deinen Namen ein und speichere die Bestätigung als
          PDF. Der Name wird nur in deinem Browser gespeichert.
        </p>
        <div className="feld">
          <label htmlFor="name">Name auf der Bestätigung (optional)</label>
          <input id="name" type="text" maxLength={80} value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <button type="button" className="knopf knopf-primaer" onClick={() => window.print()}>
          <IconDrucker groesse={18} /> Drucken oder als PDF speichern
        </button>
      </div>

      <article className="urkunde" aria-label="Teilnahmebestätigung">
        <p className="urkunde-kopf">Teilnahmebestätigung</p>
        <p className="urkunde-name">{name.trim() || "Teilnehmer:in"}</p>
        <p>hat den Selbstlernkurs</p>
        <p className="urkunde-titel">{KURS.titel}</p>
        <p>am {datum} abgeschlossen.</p>
        <ul className="urkunde-module">
          {MODULE.filter((m) => !m.optional || bonusFertig).map((m) => (
            <li key={m.id}>
              {m.nummer === "Bonus" ? "Bonus" : `Modul ${m.nummer}`}: {m.titel}
            </li>
          ))}
        </ul>
        <p className="urkunde-fuss">
          Umfang ca. {bonusFertig ? 75 : 60} Minuten · Prototyp aus dem Seminar „Multimediale Lernumgebungen“ – keine
          offizielle Bescheinigung.
        </p>
      </article>

      {!bonusFertig && (
        <div className="nicht-drucken">
          <Hinweis art="info">
            Lust auf mehr? Im <Link href="/modul/bonus">Bonusmodul</Link> lässt du ein Arbeitsblatt von einer KI
            entwerfen und prüfst es mit einer Checkliste.
          </Hinweis>
        </div>
      )}
    </div>
  );
}
