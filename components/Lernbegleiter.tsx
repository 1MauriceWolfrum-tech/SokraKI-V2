"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Hinweis } from "@/components/Bausteine";
import { IconSprechblase } from "@/components/Icons";
import { useWert } from "@/lib/fortschritt";
import { PHASEN } from "@/lib/inhalte/modul4";
import { startZustand } from "@/lib/lernbegleiter/phasen";
import {
  MAX_ZEICHEN,
  type BegleiterAnfrage,
  type BegleiterAntwort,
  type Beitrag,
  type GespraechsZustand,
  type KiModus,
  type SzenarioId,
} from "@/lib/typen";

export function Lernbegleiter({ szenario, entscheidung }: { szenario: SzenarioId; entscheidung: string }) {
  const [verlauf, setVerlauf] = useWert<Beitrag[]>(`m4:verlauf:${szenario}`, []);
  const [zustand, setZustand] = useWert<GespraechsZustand | null>(`m4:zustand:${szenario}`, null);
  const [eingabe, setEingabe] = useState("");
  const [laedt, setLaedt] = useState(false);
  const [hinweis, setHinweis] = useState<string | null>(null);
  const [fehler, setFehler] = useState<string | null>(null);
  const [modus, setModus] = useState<KiModus | null>(null);
  const gestartet = useRef(false);
  const ende = useRef<HTMLDivElement>(null);

  const frage = useCallback(
    async (bisher: Beitrag[], z: GespraechsZustand) => {
      setLaedt(true);
      setFehler(null);
      try {
        const anfrage: BegleiterAnfrage = { szenario, entscheidung, verlauf: bisher, zustand: z };
        const res = await fetch("/api/lernbegleiter", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(anfrage),
        });
        if (!res.ok) throw new Error(String(res.status));
        const daten = (await res.json()) as BegleiterAntwort;
        setModus(daten.modus);
        setHinweis(daten.hinweis ?? null);
        setVerlauf([...bisher, { rolle: "begleiter", text: daten.antwort, phase: daten.zustand.phase }]);
        setZustand(daten.zustand);
      } catch {
        setFehler("Der Lernbegleiter ist gerade nicht erreichbar. Versuche es noch einmal.");
      } finally {
        setLaedt(false);
      }
    },
    [szenario, entscheidung, setVerlauf, setZustand],
  );

  useEffect(() => {
    if (gestartet.current || verlauf.length > 0) return;
    gestartet.current = true;
    void frage([], startZustand());
  }, [verlauf.length, frage]);

  useEffect(() => {
    ende.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [verlauf.length, laedt]);

  function senden() {
    const t = eingabe.trim();
    if (!t || laedt || !zustand || zustand.abgeschlossen) return;
    const bisher: Beitrag[] = [...verlauf, { rolle: "teilnehmer", text: t }];
    setVerlauf(bisher);
    setEingabe("");
    void frage(bisher, zustand);
  }

  function neuBeginnen() {
    if (!window.confirm("Gespräch wirklich neu beginnen? Der bisherige Verlauf wird gelöscht.")) return;
    setVerlauf([]);
    setZustand(null);
    void frage([], startZustand());
  }

  const phase = zustand?.phase ?? 1;

  return (
    <section className="begleiter" aria-label="Gespräch mit dem KI-Lernbegleiter">
      <ol className="phasenleiste">
        {PHASEN.map((p) => (
          <li
            key={p.nr}
            className={p.nr < phase || zustand?.abgeschlossen ? "erledigt" : p.nr === phase ? "aktuell" : ""}
            aria-current={p.nr === phase && !zustand?.abgeschlossen ? "step" : undefined}
          >
            <span className="phasen-nr">{p.nr}</span>
            <span className="phasen-titel">{p.titel}</span>
          </li>
        ))}
      </ol>

      <div className="begleiter-kopf">
        <span className="begleiter-icon" aria-hidden="true">
          <IconSprechblase groesse={22} />
        </span>
        <div>
          <strong>KI-Lernbegleiter</strong>
          <p className="hilfe">
            {modus === "claude"
              ? "KI-System (Claude) – kein Mensch. Stellt Fragen, gibt keine Lösungen."
              : "Folgt eurem Gesprächsleitfaden – kein Mensch. Stellt Fragen, gibt keine Lösungen."}
          </p>
        </div>
      </div>

      <div className="verlauf" aria-live="polite">
        {verlauf.map((b, i) => (
          <div key={i} className={`nachricht nachricht-${b.rolle}`}>
            <span className="nachricht-wer">{b.rolle === "begleiter" ? "Lernbegleiter" : "Du"}</span>
            <p>{b.text}</p>
          </div>
        ))}
        {laedt && (
          <div className="nachricht nachricht-begleiter">
            <span className="nachricht-wer">Lernbegleiter</span>
            <p className="tippt" aria-label="Der Lernbegleiter formuliert eine Frage">
              <span />
              <span />
              <span />
            </p>
          </div>
        )}
        <div ref={ende} />
      </div>

      {hinweis && <Hinweis art="warnung">{hinweis}</Hinweis>}
      {fehler && <Hinweis art="warnung">{fehler}</Hinweis>}

      {zustand?.abgeschlossen ? (
        <Hinweis art="erfolg">
          Das Gespräch ist abgeschlossen. Formuliere im nächsten Schritt deine Handlungsempfehlung.
        </Hinweis>
      ) : (
        <div className="eingabe">
          <label htmlFor="begleiter-antwort" className="sr-only">
            Deine Antwort
          </label>
          <textarea
            id="begleiter-antwort"
            rows={3}
            maxLength={MAX_ZEICHEN}
            value={eingabe}
            disabled={laedt || !zustand}
            placeholder="Antworte in eigenen Worten …"
            onChange={(e) => setEingabe(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) senden();
            }}
          />
          <div className="eingabe-leiste">
            <span className="hilfe">Senden mit Strg + Enter</span>
            <button type="button" className="knopf knopf-primaer" onClick={senden} disabled={laedt || !eingabe.trim()}>
              Senden
            </button>
          </div>
        </div>
      )}
      {verlauf.length > 1 && (
        <button type="button" className="knopf-text" onClick={neuBeginnen}>
          Gespräch neu beginnen
        </button>
      )}
    </section>
  );
}
