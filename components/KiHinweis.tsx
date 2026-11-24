"use client";

import { IconKi } from "@/components/Icons";
import { KI_DATENSCHUTZ, KI_GRENZEN, KI_OHNE, KI_STELLEN, type KiStelle } from "@/lib/inhalte/ki-transparenz";
import { useKiStatus } from "@/lib/kiStatus";

// Einheitliche Kennzeichnung der KI im Kurs: überall dieselbe violette KI-Marke, damit man KI-Stellen wiedererkennt.

export function KiMarke({ text = "KI" }: { text?: string }) {
  return (
    <span className="ki-marke">
      <IconKi groesse={14} />
      {text}
    </span>
  );
}

// Hinweis vor einer KI-Stelle: Was macht die KI hier, welche Daten gehen an wen – oder läuft die Stelle ohne KI?
export function KiHinweis({ stelle }: { stelle: KiStelle }) {
  const status = useKiStatus();
  const s = KI_STELLEN[stelle];
  if (!status) return null;

  if (!status.aktiv) {
    return (
      <aside className="ki-hinweis ki-hinweis-aus" aria-label="Hinweis zum KI-Einsatz">
        <p className="ki-hinweis-kopf">
          <KiMarke text="KI-Stelle" /> KI ist hier gerade nicht aktiv
        </p>
        <p>
          An dieser Stelle kann eine KI arbeiten
          {status.grund === "nur-lokal" ? " – sie ist aber nur auf dem eigenen Rechner verfügbar." : ", sie ist aber gerade nicht eingerichtet."}{" "}
          {s.ohneKi} Es werden keine Daten gesendet.
        </p>
      </aside>
    );
  }

  return (
    <aside className="ki-hinweis" aria-label="Hinweis zum KI-Einsatz">
      <p className="ki-hinweis-kopf">
        <KiMarke /> Hier arbeitet eine KI
      </p>
      <p>
        Ein Sprachmodell ({status.modell}, {status.weg}) {s.aufgabe}. {s.versand}
      </p>
      <p className="ki-hinweis-klein">
        {KI_DATENSCHUTZ} {KI_GRENZEN}
      </p>
    </aside>
  );
}

// Übersicht für die Kursseite: alle KI-Stellen auf einen Blick.
export function KiUebersicht() {
  const status = useKiStatus();
  return (
    <>
      <p>
        Eine KI arbeitet nur an drei klar gekennzeichneten Stellen. Du erkennst sie an dieser Marke: <KiMarke />
      </p>
      <ul className="ki-liste">
        {Object.values(KI_STELLEN).map((s) => (
          <li key={s.ort}>
            <strong>{s.ort}:</strong> Die KI {s.aufgabe}.
          </li>
        ))}
      </ul>
      <p>{KI_OHNE}</p>
      {status && (
        <p className={`ki-status ${status.aktiv ? "" : "ki-status-aus"}`}>
          {status.aktiv
            ? `Aktuell eingerichtet: ${status.modell} ${status.weg}.`
            : "Aktuell ist keine KI eingerichtet – alle drei Stellen laufen mit vorbereiteten Inhalten, und es werden keine Daten gesendet."}
        </p>
      )}
      <p className="hilfe">{KI_DATENSCHUTZ}</p>
    </>
  );
}
