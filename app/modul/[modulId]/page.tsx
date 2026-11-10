"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Hinweis } from "@/components/Bausteine";
import { IconHaken, IconPfeilLinks, IconPfeilRechts, IconSanduhr, IconSchloss } from "@/components/Icons";
import { SCHRITTE, modulFrei } from "@/components/module";
import { useFortschritt, zahl } from "@/lib/fortschritt";
import { MODULE, modulMeta } from "@/lib/inhalte/kurs";
import type { ModulId } from "@/lib/typen";

export default function ModulSeite() {
  const id = useParams<{ modulId: string }>().modulId as ModulId;
  const meta = modulMeta(id);
  const router = useRouter();
  const { werte, geladen, setze } = useFortschritt();

  const schritte = meta ? SCHRITTE[meta.id] : [];
  const ersterOffener = schritte.findIndex((s) => !s.fertig(werte));
  const erreichbar = ersterOffener === -1 ? schritte.length - 1 : ersterOffener;
  const gespeichert = zahl(werte, `pos:${id}`);
  const position = Math.min(gespeichert ?? erreichbar, erreichbar, Math.max(schritte.length - 1, 0));

  // Beim ersten Öffnen die Position festhalten, damit die Seite nicht mitten in der Bearbeitung
  // zum nächsten Schritt springt, sobald ein Schritt erledigt ist.
  useEffect(() => {
    if (geladen && meta && gespeichert === null) setze(`pos:${id}`, erreichbar);
  }, [geladen, meta, gespeichert, erreichbar, id, setze]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [position]);

  if (!meta) {
    return (
      <div className="schmal">
        <h1>Modul nicht gefunden</h1>
        <Link href="/">Zur Kursseite</Link>
      </div>
    );
  }
  if (!geladen) return <p className="schmal hilfe">Lade Fortschritt …</p>;

  if (!modulFrei(werte, meta.id)) {
    return (
      <div className="schmal">
        <p className="status-gesperrt">
          <IconSchloss groesse={20} /> Dieses Modul ist noch gesperrt
        </p>
        <h1>{meta.titel}</h1>
        <p>Schließe zuerst das vorherige Modul ab. So hast du die Grundlagen, auf denen dieses Modul aufbaut.</p>
        <Link href="/#lernpfad" className="knopf knopf-primaer">
          Zum Lernpfad
        </Link>
      </div>
    );
  }

  const schritt = schritte[position];
  const fertig = schritt.fertig(werte);
  const letzter = position === schritte.length - 1;
  const index = MODULE.findIndex((m) => m.id === meta.id);
  const naechstesModul = MODULE[index + 1];

  function gehe(i: number) {
    setze(`pos:${id}`, i);
  }

  function abschliessen() {
    if (meta!.id === "m5") router.push("/abschluss");
    else if (meta!.id === "bonus" || !naechstesModul) router.push("/#lernpfad");
    else router.push(`/modul/${naechstesModul.id}`);
  }

  return (
    <>
      <section className="held held-klein">
        <div className="held-innen held-einspaltig">
          <nav aria-label="Brotkrümelnavigation" className="brotkrumen">
            <Link href="/">Kurs</Link>
            <Link href="/#lernpfad">Lernpfad</Link>
            <span aria-current="page">Modul {meta.nummer}</span>
          </nav>
          <div className="chips">
            <span className="chip chip-hellblau">Modul {meta.nummer}</span>
            <span className="chip chip-lindgruen">
              <IconSanduhr groesse={14} /> {meta.dauer} Min.
            </span>
            <span className="chip chip-flieder">{meta.lernziel}</span>
          </div>
          <h1>{meta.titel}</h1>
          <p className="held-untertitel">{meta.kurz}</p>
        </div>
      </section>

      <div className="seite-zweispaltig">
        <nav className="seitennav schrittnav" aria-label="Lernschritte">
          <p className="seitennav-titel">Lernschritte</p>
          <ol>
            {schritte.map((s, i) => {
              const erledigt = s.fertig(werte);
              const gesperrt = i > erreichbar;
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    className={`schritt-link ${i === position ? "aktiv" : ""} ${erledigt ? "erledigt" : ""}`}
                    aria-current={i === position ? "step" : undefined}
                    disabled={gesperrt}
                    onClick={() => gehe(i)}
                  >
                    <span className="schritt-marke">{erledigt ? <IconHaken groesse={14} /> : i + 1}</span>
                    {s.titel}
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="seiteninhalt">
          <p className="schritt-zaehler">
            Schritt {position + 1} von {schritte.length}
          </p>
          <h2>{schritt.titel}</h2>
          <div className="schritt-inhalt">
            <schritt.Inhalt />
          </div>

          <div className="schritt-navigation">
            <button type="button" className="knopf knopf-zweit" disabled={position === 0} onClick={() => gehe(position - 1)}>
              <IconPfeilLinks groesse={18} /> Zurück
            </button>
            {letzter ? (
              <button type="button" className="knopf knopf-primaer" disabled={!fertig} onClick={abschliessen}>
                {meta.id === "m5" ? "Kurs abschließen" : "Modul abschließen"} <IconPfeilRechts groesse={18} />
              </button>
            ) : (
              <button type="button" className="knopf knopf-primaer" disabled={!fertig} onClick={() => gehe(position + 1)}>
                Weiter <IconPfeilRechts groesse={18} />
              </button>
            )}
          </div>
          {!fertig && (
            <Hinweis art="info">Bearbeite diesen Schritt vollständig, dann geht es weiter.</Hinweis>
          )}
        </div>
      </div>
    </>
  );
}
