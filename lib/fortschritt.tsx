"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { Werte } from "@/lib/typen";

// Alle Antworten und der Fortschritt liegen nur im Browser (localStorage) – ohne Konto und ohne Server-Datenbank.

const SPEICHER_SCHLUESSEL = "sokraki-v2-fortschritt";

type Kontext = {
  werte: Werte;
  geladen: boolean;
  setze: (schluessel: string, wert: unknown) => void;
  zuruecksetzen: () => void;
};

const FortschrittKontext = createContext<Kontext | null>(null);

function lade(): Werte {
  try {
    const roh = window.localStorage.getItem(SPEICHER_SCHLUESSEL);
    return roh ? (JSON.parse(roh) as Werte) : {};
  } catch {
    return {};
  }
}

export function FortschrittProvider({ children }: { children: React.ReactNode }) {
  const [werte, setWerte] = useState<Werte>({});
  const [geladen, setGeladen] = useState(false);

  useEffect(() => {
    setWerte(lade());
    setGeladen(true);
  }, []);

  useEffect(() => {
    if (!geladen) return;
    try {
      window.localStorage.setItem(SPEICHER_SCHLUESSEL, JSON.stringify(werte));
    } catch {
      // Speichern ist eine Komfortfunktion; ohne Speicher läuft der Kurs weiter.
    }
  }, [werte, geladen]);

  const setze = useCallback((schluessel: string, wert: unknown) => {
    setWerte((w) => ({ ...w, [schluessel]: wert }));
  }, []);

  const zuruecksetzen = useCallback(() => setWerte({}), []);

  return (
    <FortschrittKontext.Provider value={{ werte, geladen, setze, zuruecksetzen }}>{children}</FortschrittKontext.Provider>
  );
}

export function useFortschritt(): Kontext {
  const k = useContext(FortschrittKontext);
  if (!k) throw new Error("useFortschritt außerhalb des FortschrittProvider");
  return k;
}

// Ein einzelner gespeicherter Wert, z. B. eine Textantwort oder eine Quiz-Auswahl.
export function useWert<T>(schluessel: string, start: T): [T, (wert: T) => void] {
  const { werte, setze } = useFortschritt();
  const wert = (schluessel in werte ? werte[schluessel] : start) as T;
  return [wert, (neu: T) => setze(schluessel, neu)];
}

// Hilfsfunktionen für die Abschlussbedingungen der Lernschritte.
export function text(w: Werte, schluessel: string): string {
  const v = w[schluessel];
  return typeof v === "string" ? v : "";
}

export function hatText(w: Werte, schluessel: string, mindestens = 20): boolean {
  return text(w, schluessel).trim().length >= mindestens;
}

export function zahl(w: Werte, schluessel: string): number | null {
  const v = w[schluessel];
  return typeof v === "number" ? v : null;
}
