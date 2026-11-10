import type { SzenarioId } from "@/lib/typen";
import type { OptionId } from "@/lib/inhalte/modul3";

// ENTWURFSTEXT – Modul 4: Reflektieren mit dem KI-Lernbegleiter (Konzept Kapitel 7).
// Methode: KI-gestützte sokratische Gesprächsführung nach einem selbst entwickelten Leitfaden.

export const PHASEN = [
  { nr: 1, titel: "Position klären", funktion: "Ausgangsentscheidung und Begründung erfragen" },
  { nr: 2, titel: "Annahmen hinterfragen", funktion: "Implizite Vorstellungen sichtbar machen" },
  { nr: 3, titel: "Perspektiven erweitern", funktion: "Unterschiedliche Lernvoraussetzungen berücksichtigen" },
  { nr: 4, titel: "Konsequenzen prüfen", funktion: "Chancen und Risiken der Entscheidung abwägen" },
  { nr: 5, titel: "Reflexion abschließen", funktion: "Begründete Handlungsempfehlung entwickeln" },
];

export const REGELN = [
  "Der Lernbegleiter stellt immer genau eine Frage.",
  "Er geht auf deine letzte Antwort ein.",
  "Er gibt keine fertigen Lösungen vor und bewertet dich nicht.",
  "Ist eine Antwort sehr knapp, fragt er einmal nach einer Begründung.",
];

// Drehbuch: eine Frage je Phase. Platzhalter {option} wird durch die gewählte Option ersetzt.
export const SKRIPT: Record<SzenarioId, { phasen: string[]; annahmen?: Record<OptionId, string> }> = {
  a: {
    phasen: [
      "Du hast dich für Option {option} entschieden. Warum hältst du diese Vorgehensweise für gerecht?",
      "", // Phase 2 hängt von der Option ab, siehe `annahmen`.
      "Denk an eine Auszubildende mit Schwierigkeiten bei Fachbegriffen und an einen Auszubildenden mit viel Vorwissen. Wie erleben die beiden deine Entscheidung jeweils?",
      "Welche Konsequenzen hat deine Entscheidung für deine Unterrichtsplanung – und welches Risiko nimmst du dabei bewusst in Kauf?",
      "Wie könntest du überprüfen, ob deine Unterstützung tatsächlich allen Lernenden zugutekommt?",
    ],
    annahmen: {
      A: "Du gehst davon aus, dass derselbe Zugang zu KI allen gleich hilft. Welche Unterschiede zwischen den Lernenden könnten trotz dieses gleichen Zugangs bestehen bleiben?",
      B: "Du setzt auf unterschiedliche Unterstützungsangebote. Woran erkennen die Lernenden, welches Angebot für sie das richtige ist?",
      C: "Du überlässt die Unterstützung vollständig der KI. Was nimmst du dabei über die Fähigkeit der Lernenden an, KI-Lösungswege zu prüfen?",
    },
  },
  b: {
    phasen: [
      "Du hast in Modul 3 zwei Maßnahmen für den Mathematikunterricht entwickelt. Welche davon hältst du für die wichtigste – und warum ist sie gerecht?",
      "Welche Annahme über deine Lernenden steckt in dieser Maßnahme?",
      "Wie wirkt deine Maßnahme auf einen Schüler, der zu Hause keinen KI-Zugang hat, und auf eine Schülerin, die KI täglich nutzt?",
      "Was passiert, wenn Lernende trotz deiner Maßnahme weiterhin vollständige Lösungen abfragen – welche Folgen hätte das für deinen Unterricht?",
      "Woran würdest du merken, dass die KI-Unterstützung das eigenständige Problemlösen fördert statt ersetzt?",
    ],
  },
};

export const NACHHAKEN = "Kannst du das genauer begründen – zum Beispiel an einer bestimmten Person aus dem Fall?";

export const ABSCHLUSS =
  "Danke für deine Antworten. Formuliere zum Abschluss deine begründete Handlungsempfehlung in zwei bis drei Sätzen.";

export const EMPFEHLUNG_FRAGE = "Deine begründete Handlungsempfehlung";
