// Gemeinsame Typen für Kursinhalte, Fortschritt, Lernbegleiter und Arbeitsblatt.

export type ModulId = "m1" | "m2" | "m3" | "m4" | "m5" | "bonus";

export type Werte = Record<string, unknown>;

export type ModulMeta = {
  id: ModulId;
  nummer: string;
  titel: string;
  kurz: string;
  dauer: number;
  lernziel: string;
  optional?: boolean;
};

export type QuizFrage = {
  id: string;
  frage: string;
  optionen: { text: string; richtig?: boolean; feedback: string }[];
};

export type KiModus = "skript" | "claude";

// KI-Lernbegleiter (Modul 4)
export type SzenarioId = "a" | "b";
export type Rolle = "begleiter" | "teilnehmer";
export type Beitrag = { rolle: Rolle; text: string; phase?: number };
export type GespraechsZustand = {
  phase: number;
  nachgehakt: boolean;
  zuege: number;
  abgeschlossen: boolean;
};
export type BegleiterAnfrage = {
  szenario: SzenarioId;
  entscheidung: string;
  verlauf: Beitrag[];
  zustand: GespraechsZustand;
};
export type BegleiterAntwort = {
  antwort: string;
  zustand: GespraechsZustand;
  modus: KiModus;
  hinweis?: string;
};

// KI-Arbeitsblatt (Bonusmodul)
export type ThemaId = "bwl" | "mathe";
export type ArbeitsblattAnfrage = { thema: ThemaId; prompt: string };
export type ArbeitsblattAntwort = { entwurf: string; modus: KiModus; hinweis?: string };

// Obergrenzen für Anfragen an die KI-Schnittstellen.
export const MAX_ZEICHEN = 2000;
export const MAX_BEITRAEGE = 24;
