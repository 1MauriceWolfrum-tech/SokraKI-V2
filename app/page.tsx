"use client";

import Link from "next/link";
import { Illustration } from "@/components/Illustration";
import {
  IconHaken,
  IconNiveau,
  IconPfeilRechts,
  IconSanduhr,
  IconSchild,
  IconSchloss,
  IconSprache,
  IconSprechblase,
  IconZertifikat,
} from "@/components/Icons";
import { useKursstand } from "@/components/module";
import { KURS } from "@/lib/inhalte/kurs";

const INFOS = [
  { Icon: IconNiveau, text: "Einsteiger:innen" },
  { Icon: IconSanduhr, text: "ca. 60 Min. + 15 Min. Bonus" },
  { Icon: IconZertifikat, text: "Teilnahmebestätigung" },
  { Icon: IconSprache, text: "Deutsch" },
  { Icon: IconSprechblase, text: "KI-Lernbegleiter" },
  { Icon: IconSchild, text: "Daten bleiben im Browser" },
];

const ABSCHNITTE = [
  { id: "ueberblick", titel: "Überblick" },
  { id: "lernziele", titel: "Was werde ich erreichen?" },
  { id: "lernpfad", titel: "Lernpfad" },
  { id: "voraussetzungen", titel: "Welche Voraussetzungen benötige ich?" },
];

export default function Kursseite() {
  const { geladen, status, naechstes, kursFertig, fertigeModule } = useKursstand();
  const begonnen = status.some((s) => s.erledigt > 0);
  const ziel = kursFertig ? "/abschluss" : naechstes ? `/modul/${naechstes.id}` : "/modul/m1";
  const ctaText = kursFertig ? "Zur Teilnahmebestätigung" : begonnen ? `Weiterlernen: Modul ${naechstes?.nummer ?? "01"}` : "Kurs starten";

  return (
    <>
      <section className="held">
        <div className="held-innen">
          <div className="held-text">
            <nav aria-label="Brotkrümelnavigation" className="brotkrumen">
              <span>Startseite</span>
              <span>Selbstlernkurse</span>
              <span aria-current="page">{KURS.titel}</span>
            </nav>
            <div className="chips">
              <span className="chip chip-hellblau">Selbstlernkurs</span>
              <span className="chip chip-flieder">Prototyp V2</span>
            </div>
            <h1>
              KI <em>bildungsgerecht</em> im Unterricht einsetzen
            </h1>
            <p className="held-untertitel">{KURS.einleitung}</p>
            <Link href={ziel} className="knopf knopf-primaer knopf-gross">
              {geladen ? ctaText : "Kurs starten"} <IconPfeilRechts groesse={18} />
            </Link>
            {geladen && begonnen && (
              <p className="hilfe abstand">
                {fertigeModule} von 5 Modulen abgeschlossen
              </p>
            )}
          </div>
          <Illustration />
        </div>
        <div className="infobox">
          {INFOS.map(({ Icon, text }) => (
            <span key={text} className="infobox-eintrag">
              <Icon groesse={18} />
              {text}
            </span>
          ))}
        </div>
      </section>

      <div className="seite-zweispaltig">
        <nav className="seitennav" aria-label="Abschnitte">
          <ul>
            {ABSCHNITTE.map((a) => (
              <li key={a.id}>
                <a href={`#${a.id}`}>{a.titel}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="seiteninhalt">
          <section id="ueberblick">
            <h2>Überblick</h2>
            {KURS.ueberblick.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </section>

          <section id="lernziele">
            <h2>Was werde ich erreichen?</h2>
            <ol className="lernziele">
              {KURS.lernziele.map((l, i) => (
                <li key={l.titel}>
                  <span className="lernziel-nr">Lernziel {i + 1}</span>
                  <strong>{l.titel}</strong>
                  <p>{l.text}</p>
                </li>
              ))}
            </ol>
          </section>

          <section id="lernpfad">
            <h2>Lernpfad</h2>
            <p>
              Die Module bauen aufeinander auf. Ein Modul öffnet sich, sobald das vorherige abgeschlossen ist – so kennst
              du vor dem Gespräch mit dem KI-Lernbegleiter bereits die Grundlagen.
            </p>
            <ol className="lernpfad">
              {status.map((m) => {
                const zustand = m.fertig ? "fertig" : !m.frei ? "gesperrt" : m.erledigt > 0 ? "begonnen" : "offen";
                return (
                  <li key={m.id} className={`modulkarte modul-${zustand} ${m.optional ? "modul-bonus" : ""}`}>
                    <span className="modul-nummer">{m.nummer}</span>
                    <div className="modul-text">
                      <h3>{m.titel}</h3>
                      <p>{m.kurz}</p>
                      <p className="modul-meta">
                        <IconSanduhr groesse={16} /> {m.dauer} Min. · {m.lernziel}
                        {m.optional && " · optional"}
                      </p>
                      {geladen && m.frei && (
                        <div
                          className="fortschritt"
                          role="progressbar"
                          aria-valuemin={0}
                          aria-valuemax={m.gesamt}
                          aria-valuenow={m.erledigt}
                          aria-label={`Fortschritt ${m.titel}`}
                        >
                          <div style={{ width: `${(m.erledigt / m.gesamt) * 100}%` }} />
                        </div>
                      )}
                    </div>
                    <div className="modul-aktion">
                      {zustand === "gesperrt" ? (
                        <span className="status-gesperrt">
                          <IconSchloss groesse={18} /> gesperrt
                        </span>
                      ) : (
                        <Link href={`/modul/${m.id}`} className={`knopf ${zustand === "fertig" ? "knopf-zweit" : "knopf-primaer"}`}>
                          {zustand === "fertig" ? (
                            <>
                              <IconHaken groesse={18} /> Ansehen
                            </>
                          ) : zustand === "begonnen" ? (
                            "Fortsetzen"
                          ) : (
                            "Starten"
                          )}
                        </Link>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>

          <section id="voraussetzungen">
            <h2>Welche Voraussetzungen benötige ich?</h2>
            <ul className="hakenliste">
              {KURS.voraussetzungen.map((v) => (
                <li key={v}>
                  <IconHaken groesse={18} />
                  {v}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}
