import type { QuizFrage } from "@/lib/typen";

// ENTWURFSTEXT – Modul 1: Einstieg und Wissensdiagnose (Konzept Kapitel 4).

export const THESE = "Wenn alle Schülerinnen und Schüler KI nutzen dürfen, haben alle die gleichen Bildungschancen.";

export const SKALA = [
  { wert: 1, text: "Stimme überhaupt nicht zu" },
  { wert: 2, text: "Stimme eher nicht zu" },
  { wert: 3, text: "Teils, teils" },
  { wert: 4, text: "Stimme eher zu" },
  { wert: 5, text: "Stimme vollständig zu" },
];

export const WISSENSDIAGNOSE: QuizFrage[] = [
  {
    id: "d1",
    frage: "Welche der folgenden Situationen beschreibt eine mögliche digitale Bildungsungleichheit?",
    optionen: [
      {
        text: "Alle Lernenden erhalten dieselbe Aufgabenstellung.",
        feedback: "Dieselbe Aufgabe für alle ist eine Frage der Differenzierung, aber noch keine digitale Ungleichheit.",
      },
      {
        text: "Einige Lernende verfügen über leistungsfähige KI-Tools, während andere keinen zuverlässigen Internetzugang haben.",
        richtig: true,
        feedback: "Genau. Unterschiede beim Zugang zu Geräten, Internet und Tools sind die erste Ebene digitaler Ungleichheit.",
      },
      {
        text: "Die Lehrkraft erklärt ein Thema auf unterschiedliche Weise.",
        feedback: "Unterschiedliche Erklärungen sind eher eine Form der Differenzierung und können Ungleichheit sogar abbauen.",
      },
      {
        text: "Die Lernenden bearbeiten Aufgaben in Partnerarbeit.",
        feedback: "Partnerarbeit ist eine Sozialform und für sich genommen keine digitale Ungleichheit.",
      },
    ],
  },
  {
    id: "d2",
    frage: "Was beschreibt Chancengerechtigkeit am treffendsten?",
    optionen: [
      {
        text: "Alle Lernenden erhalten genau dieselbe Förderung.",
        feedback: "Gleiche Förderung für alle kann ungerecht sein, wenn die Ausgangslagen verschieden sind.",
      },
      {
        text: "Bildungserfolg soll nicht unangemessen von sozialer Herkunft oder anderen nicht leistungsbezogenen Voraussetzungen abhängen.",
        richtig: true,
        feedback: "Richtig. Chancengerechtigkeit fragt, ob Erfolg von Herkunft, Geld oder Sprache abhängt statt von Lernen und Leistung.",
      },
      {
        text: "Alle Lernenden erreichen am Ende dieselben Noten.",
        feedback: "Das wäre Ergebnisgleichheit. Chancengerechtigkeit zielt auf faire Ausgangsbedingungen, nicht auf gleiche Noten.",
      },
      {
        text: "Leistungsstarke Lernende werden besonders gefördert.",
        feedback: "Begabtenförderung kann sinnvoll sein, beschreibt aber nicht den Kern von Chancengerechtigkeit.",
      },
    ],
  },
  {
    id: "d3",
    frage: "Was versteht man unter algorithmischer Verzerrung (Bias)?",
    optionen: [
      {
        text: "Einen Rechenfehler der KI bei Prozentaufgaben.",
        feedback: "Rechenfehler kommen vor, sind aber fehlerhafte Inhalte und keine systematische Verzerrung.",
      },
      {
        text: "Eine systematische Verzerrung, durch die KI Stereotype oder Benachteiligungen aus ihren Trainingsdaten wiedergeben kann.",
        richtig: true,
        feedback: "Genau. KI lernt aus Daten, in denen gesellschaftliche Vorurteile stecken – und kann sie in ihren Antworten wiederholen.",
      },
      {
        text: "Die Vorliebe mancher Lernender für bestimmte KI-Tools.",
        feedback: "Das ist eine persönliche Präferenz, keine Eigenschaft des Algorithmus.",
      },
      {
        text: "Eine Funktion, mit der KI ihre Antworten an Nutzende anpasst.",
        feedback: "Personalisierung ist eine gewollte Funktion. Bias meint ungewollte, systematische Schieflagen.",
      },
    ],
  },
  {
    id: "d4",
    frage:
      "Eine Auszubildende lässt eine Aufgabe vollständig von einer KI lösen und schreibt die Lösung ab. Welche Aussage trifft am ehesten zu?",
    optionen: [
      {
        text: "Sie hat die Aufgabe verstanden, weil die Lösung richtig ist.",
        feedback: "Eine richtige Lösung zeigt nicht, dass jemand den Lösungsweg verstanden hat.",
      },
      {
        text: "Ob sie etwas lernt, hängt davon ab, wie sie die KI nutzt – eine fertige Lösung ersetzt nicht das eigene Verstehen.",
        richtig: true,
        feedback: "Richtig. Entscheidend ist die Art der Nutzung: Hinweise und eigene Denkschritte fördern Lernen, Abschreiben kaum.",
      },
      {
        text: "KI-Lösungen sind immer fehlerfrei und können bedenkenlos übernommen werden.",
        feedback: "KI kann überzeugend klingende, aber falsche Lösungen erzeugen. Prüfen bleibt notwendig.",
      },
      {
        text: "Abschreiben ist bei KI-Lösungen kein Problem, weil die KI ja ein Werkzeug ist.",
        feedback: "Auch mit Werkzeugen gilt: Ohne eigene Denkleistung entsteht kaum Lernzuwachs.",
      },
    ],
  },
];
