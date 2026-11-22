import type { Arbeitsblatt, Aufgabe, Niveau, Schwachstelle } from "@/lib/typen";

// Feste Struktur eines Arbeitsblatts: Die KI liefert sie als JSON, die Lernenden bearbeiten sie in Feldern,
// die Druckseite setzt sie ins A4-Layout.

export const NIVEAUS: { id: Niveau; titel: string; marke: string }[] = [
  { id: "basis", titel: "Basis", marke: "●○○" },
  { id: "standard", titel: "Standard", marke: "●●○" },
  { id: "erweiterung", titel: "Erweiterung", marke: "●●●" },
];

export function niveau(id: Niveau) {
  return NIVEAUS.find((n) => n.id === id) ?? NIVEAUS[1];
}

export const GRENZEN = { kurz: 200, text: 4000, glossar: 12, aufgaben: 12, schwachstellen: 10, schwachstelle: 300 };

export const ARBEITSBLATT_SCHEMA: Record<string, unknown> = {
  type: "object",
  additionalProperties: false,
  required: ["titel", "lernziel", "situation", "glossar", "aufgaben"],
  properties: {
    titel: { type: "string", description: "Kurzer Titel des Arbeitsblatts" },
    lernziel: { type: "string", description: "Lernziel in einem Satz aus Sicht der Lernenden" },
    situation: {
      type: "string",
      description: "Ausgangssituation mit allen Angaben, die für die Aufgaben nötig sind; Absätze durch Zeilenumbrüche getrennt",
    },
    glossar: {
      type: "array",
      description: "Fachbegriffe mit kurzer, einfacher Erklärung; leer, wenn keine nötig sind",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["begriff", "erklaerung"],
        properties: { begriff: { type: "string" }, erklaerung: { type: "string" } },
      },
    },
    aufgaben: {
      type: "array",
      description: "Aufgaben in sinnvoller Reihenfolge",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["niveau", "text", "hilfe", "loesung"],
        properties: {
          niveau: { type: "string", enum: ["basis", "standard", "erweiterung"] },
          text: { type: "string", description: "Aufgabenstellung" },
          hilfe: { type: "string", description: "Hilfe oder Tipp zur Aufgabe; leer, wenn keine vorgesehen ist" },
          loesung: { type: "string", description: "Vollständige Lösung mit Rechenweg für die Lehrkraft" },
        },
      },
    },
  },
};

function istText(v: unknown, max: number): v is string {
  return typeof v === "string" && v.length <= max;
}

function istObjekt(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function istAufgabe(v: unknown): v is Aufgabe {
  return (
    istObjekt(v) &&
    NIVEAUS.some((n) => n.id === v.niveau) &&
    istText(v.text, GRENZEN.text) &&
    istText(v.hilfe, GRENZEN.text) &&
    istText(v.loesung, GRENZEN.text)
  );
}

export function istArbeitsblatt(v: unknown): v is Arbeitsblatt {
  return (
    istObjekt(v) &&
    istText(v.titel, GRENZEN.kurz) &&
    istText(v.lernziel, GRENZEN.text) &&
    istText(v.situation, GRENZEN.text) &&
    Array.isArray(v.glossar) &&
    v.glossar.length <= GRENZEN.glossar &&
    v.glossar.every((g) => istObjekt(g) && istText(g.begriff, GRENZEN.kurz) && istText(g.erklaerung, GRENZEN.text)) &&
    Array.isArray(v.aufgaben) &&
    v.aufgaben.length >= 1 &&
    v.aufgaben.length <= GRENZEN.aufgaben &&
    v.aufgaben.every(istAufgabe)
  );
}

export function sindSchwachstellen(v: unknown): v is Schwachstelle[] {
  return (
    Array.isArray(v) &&
    v.length >= 1 &&
    v.length <= GRENZEN.schwachstellen &&
    v.every(
      (s) => istObjekt(s) && istText(s.problem, GRENZEN.schwachstelle) && istText(s.vorschlag, GRENZEN.schwachstelle),
    )
  );
}

// Eine Schwachstelle zählt, wenn Problem und Vorschlag ausformuliert sind.
export function vollstaendig(liste: Schwachstelle[]): Schwachstelle[] {
  return liste.filter((s) => s.problem.trim().length >= 10 && s.vorschlag.trim().length >= 10);
}
