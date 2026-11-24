import type { ModulMeta } from "@/lib/typen";

// ENTWURFSTEXT – vom Projektteam zu überarbeiten und mit Literatur zu belegen.
// Grundlage: Konzept „SokraKI – Variante B“ (Kursstruktur Kapitel 4–9, Lernziele Kapitel 3).

export const KURS = {
  titel: "KI bildungsgerecht im Unterricht einsetzen",
  untertitel: "Ein interaktiver Selbstlernkurs für angehende Lehrkräfte an beruflichen Schulen",
  einleitung:
    "Entdecke, wie du KI im BWL- und Mathematikunterricht so einsetzt, dass möglichst alle Lernenden davon profitieren – und wo KI bestehende Ungleichheiten verstärken kann.",
  ueberblick: [
    "KI-Chatbots erklären Fachbegriffe, vereinfachen Aufgaben und liefern auf Knopfdruck Lösungen. Ob davon alle Lernenden profitieren, ist damit aber noch nicht entschieden: Geräte, Vorwissen, Sprache und die Fähigkeit, KI-Antworten zu prüfen, sind in beruflichen Klassen sehr unterschiedlich verteilt.",
    "In diesem Kurs klärst du zuerst, was Bildungsgerechtigkeit bedeutet und welche Chancen und Risiken KI mit sich bringt. Danach triffst du Entscheidungen in zwei Unterrichtsfällen aus BWL und Mathematik und prüfst sie in einem sokratischen Dialog mit einem KI-Lernbegleiter, der dir Fragen stellt statt Antworten zu geben.",
    "Im optionalen Bonusmodul planst du ein Arbeitsblatt im sokratischen Dialog, lässt es von einer KI entwerfen und prüfst es mit einer Checkliste. Denn eines zieht sich durch den ganzen Kurs: Die fachliche und didaktische Verantwortung bleibt bei dir.",
  ],
  lernziele: [
    {
      titel: "Wissen und Verstehen",
      text: "Du kannst grundlegende Konzepte der Bildungsgerechtigkeit erläutern und Chancen sowie Risiken des KI-Einsatzes im Bildungsbereich beschreiben.",
    },
    {
      titel: "Analysieren und Bewerten",
      text: "Du kannst Unterrichtssituationen analysieren und begründet beurteilen, inwiefern der Einsatz von KI Bildungsgerechtigkeit fördert oder gefährdet.",
    },
    {
      titel: "Anwenden und Reflektieren",
      text: "Du kannst KI zur Erstellung von Unterrichtsmaterial nutzen, die Ergebnisse fachlich und didaktisch prüfen und Verbesserungen entwickeln.",
    },
  ],
  voraussetzungen: [
    "Grundlegende Kenntnisse über KI sind hilfreich, aber nicht erforderlich.",
    "Du brauchst nur einen Browser. Ein KI-Konto ist nicht nötig.",
    "Plane etwa 75 Minuten ein, mit Bonusmodul etwa 95 Minuten. Du kannst jederzeit unterbrechen.",
  ],
};

export const MODULE: ModulMeta[] = [
  {
    id: "m1",
    nummer: "01",
    titel: "Einstieg & Wissensdiagnose",
    kurz: "Positioniere dich zu einer These und prüfe dein Vorwissen.",
    dauer: 8,
    lernziel: "Lernziel 1",
  },
  {
    id: "m2",
    nummer: "02",
    titel: "Bildungsgerechtigkeit im KI-Zeitalter",
    kurz: "Begriffe, KI-Grundwissen, Chancen und Risiken von KI für gerechte Bildung.",
    dauer: 18,
    lernziel: "Lernziel 1",
  },
  {
    id: "m3",
    nummer: "03",
    titel: "KI im BWL- und Mathematikunterricht",
    kurz: "Escape Room mit drei Räumen, dann zwei Unterrichtsfälle: entscheiden, Chats analysieren, mit Musterlösung vergleichen.",
    dauer: 25,
    lernziel: "Lernziel 2",
  },
  {
    id: "m4",
    nummer: "04",
    titel: "Reflektieren mit dem KI-Lernbegleiter",
    kurz: "Lerne den sokratischen Dialog kennen und prüfe deine Entscheidung im Gespräch.",
    dauer: 18,
    lernziel: "Lernziel 2",
    ki: true,
  },
  {
    id: "m5",
    nummer: "05",
    titel: "Wissen überprüfen & Transfer",
    kurz: "Erneut positionieren, reflektieren und Abschlusstest.",
    dauer: 7,
    lernziel: "Lernziel 1 und 2",
  },
  {
    id: "bonus",
    nummer: "Bonus",
    titel: "KI-Arbeitsblatt erstellen und prüfen",
    kurz: "Arbeitsblatt sokratisch planen, mit KI erstellen und kritisch prüfen.",
    dauer: 20,
    lernziel: "Lernziel 3",
    optional: true,
    ki: true,
  },
];

export function modulMeta(id: string): ModulMeta | undefined {
  return MODULE.find((m) => m.id === id);
}
