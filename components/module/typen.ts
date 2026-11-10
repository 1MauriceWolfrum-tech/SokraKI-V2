import type { Werte } from "@/lib/typen";

// Ein Lernschritt innerhalb eines Moduls: Inhalt und Bedingung, wann er erledigt ist.
export type SchrittDef = {
  id: string;
  titel: string;
  Inhalt: () => React.ReactNode;
  fertig: (w: Werte) => boolean;
};

export function gesehenSchluessel(modul: string, schritt: string) {
  return `gesehen:${modul}:${schritt}`;
}
