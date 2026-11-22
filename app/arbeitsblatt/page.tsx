"use client";

import Link from "next/link";
import { useEffect } from "react";
import { DruckBlatt } from "@/components/Arbeitsblatt";
import { Hinweis } from "@/components/Bausteine";
import { IconDrucker, IconPfeilLinks } from "@/components/Icons";
import { istArbeitsblatt } from "@/lib/arbeitsblatt";
import { useFortschritt, useWert } from "@/lib/fortschritt";
import { THEMEN } from "@/lib/inhalte/bonus";
import type { ThemaId } from "@/lib/typen";

// Druckseite für das überarbeitete Arbeitsblatt aus dem Bonusmodul. Das PDF entsteht über den Druckdialog
// des Browsers – ohne Server und ohne zusätzliche Bibliothek.

export default function ArbeitsblattDruck() {
  const { werte, geladen } = useFortschritt();
  const [mitLoesungen, setMitLoesungen] = useWert<boolean>("druck:loesungen", true);
  const blatt = werte["bonus:fassung"];
  const thema = werte["bonus:thema"] as ThemaId | undefined;
  const titel = istArbeitsblatt(blatt) ? blatt.titel : "";

  // Der Seitentitel wird beim Speichern als PDF zum Dateinamen. Er wird erst beim Drucken gesetzt,
  // weil Next.js den Titel nach dem Laden der Seite selbst verwaltet.
  useEffect(() => {
    if (!titel) return;
    let vorher = document.title;
    const vorDemDruck = () => {
      vorher = document.title;
      document.title = titel;
    };
    const nachDemDruck = () => {
      document.title = vorher;
    };
    window.addEventListener("beforeprint", vorDemDruck);
    window.addEventListener("afterprint", nachDemDruck);
    return () => {
      window.removeEventListener("beforeprint", vorDemDruck);
      window.removeEventListener("afterprint", nachDemDruck);
    };
  }, [titel]);

  if (!geladen) return <p className="schmal hilfe">Lade Arbeitsblatt …</p>;
  if (!istArbeitsblatt(blatt) || !thema || !THEMEN[thema]) {
    return (
      <div className="schmal">
        <h1>Arbeitsblatt</h1>
        <p>Erstelle und überarbeite zuerst im Bonusmodul ein Arbeitsblatt.</p>
        <Link href="/modul/bonus" className="knopf knopf-primaer">
          Zum Bonusmodul
        </Link>
      </div>
    );
  }

  return (
    <div className="schmal druckseite">
      <div className="nicht-drucken">
        <nav aria-label="Brotkrümelnavigation" className="brotkrumen">
          <Link href="/">Kurs</Link>
          <Link href="/modul/bonus">Bonusmodul</Link>
          <span aria-current="page">Arbeitsblatt</span>
        </nav>
        <h1>Dein Arbeitsblatt</h1>
        <p>
          So sieht dein überarbeitetes Arbeitsblatt auf DIN A4 aus. Für ein PDF wählst du im Druckdialog als Drucker „Als
          PDF speichern“ oder „Microsoft Print to PDF“.
        </p>
        <label className="checkliste-zeile">
          <input type="checkbox" checked={mitLoesungen} onChange={(e) => setMitLoesungen(e.target.checked)} />
          Lösungsblatt für die Lehrkraft als eigene Seite anhängen
        </label>
        <div className="knopfreihe abstand">
          <button type="button" className="knopf knopf-primaer" onClick={() => window.print()}>
            <IconDrucker groesse={18} /> Drucken oder als PDF speichern
          </button>
          <Link href="/modul/bonus" className="knopf knopf-zweit">
            <IconPfeilLinks groesse={18} /> Zurück zum Bonusmodul
          </Link>
        </div>
        {werte["bonus:geprueft"] !== true && (
          <Hinweis art="warnung">
            Du hast noch nicht bestätigt, dass du das Arbeitsblatt geprüft hast. Prüfe vor dem Einsatz alle Zahlen und
            Lösungen.
          </Hinweis>
        )}
      </div>

      <DruckBlatt
        blatt={blatt}
        fach={THEMEN[thema].titel}
        zielgruppe={THEMEN[thema].zielgruppe}
        mitLoesungen={mitLoesungen}
      />
    </div>
  );
}
