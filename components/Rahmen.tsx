"use client";

import Link from "next/link";
import { IconSprechblase } from "@/components/Icons";
import { useKursstand } from "@/components/module";
import { useFortschritt } from "@/lib/fortschritt";

export function Kopfzeile() {
  const { geladen, fertigeModule } = useKursstand();
  return (
    <header className="kopfzeile">
      <div className="kopfzeile-innen">
        <Link href="/" className="marke">
          <span className="marke-zeichen" aria-hidden="true">
            <IconSprechblase groesse={20} />
          </span>
          <span className="marke-text">
            SokraKI
            <span className="marke-unterzeile">Selbstlernkurs · Prototyp</span>
          </span>
        </Link>
        <nav aria-label="Hauptnavigation" className="kopf-nav">
          <Link href="/#lernpfad">Lernpfad</Link>
          {geladen && (
            <span className="kopf-fortschritt" aria-label={`${fertigeModule} von 5 Modulen abgeschlossen`}>
              {fertigeModule}/5 Module
            </span>
          )}
        </nav>
      </div>
    </header>
  );
}

export function Fusszeile() {
  const { zuruecksetzen } = useFortschritt();
  return (
    <footer className="fusszeile">
      <div className="fusszeile-innen">
        <p>
          Prototyp aus dem Seminar „Multimediale Lernumgebungen“ (Wirtschaftspädagogik). Alle Personen in den Fällen
          sind erfunden. Deine Antworten bleiben in diesem Browser.
        </p>
        <button
          type="button"
          className="knopf-text"
          onClick={() => {
            if (window.confirm("Alle Antworten und den Fortschritt in diesem Browser löschen?")) zuruecksetzen();
          }}
        >
          Fortschritt zurücksetzen
        </button>
      </div>
    </footer>
  );
}
