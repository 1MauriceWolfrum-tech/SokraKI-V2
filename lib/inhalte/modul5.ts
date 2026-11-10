import type { QuizFrage } from "@/lib/typen";

// ENTWURFSTEXT – Modul 5: Reflexion und Lernerfolgskontrolle (Konzept Kapitel 8).

export const REFLEXIONSFRAGEN = [
  { id: "r1", frage: "Hat sich deine Einschätzung verändert? Begründe deine Antwort." },
  { id: "r2", frage: "Welche Chancen und Risiken von KI für Bildungsgerechtigkeit sind dir besonders wichtig geworden?" },
  { id: "r3", frage: "Welche konkrete Maßnahme würdest du in deinem zukünftigen Unterricht umsetzen?" },
];

// Kriterien für eine gute Begründung – die Qualität der Reflexion zeigt sich nicht allein an einer veränderten Position.
export const KRITERIEN = [
  "Ich beziehe mich auf konkrete Lernende oder Lernvoraussetzungen.",
  "Ich verwende mindestens einen Begriff aus Modul 2, etwa Chancengerechtigkeit oder digitale Ungleichheit.",
  "Ich wäge Chancen und Risiken gegeneinander ab.",
  "Ich nenne eine konkrete Maßnahme für den Unterricht.",
];

export const ABSCHLUSSTEST: QuizFrage[] = [
  {
    id: "t1",
    frage: "Was beschreibt Bildungsteilhabe?",
    optionen: [
      { text: "Das Recht, eine Schule zu besuchen.", feedback: "Das Recht allein reicht nicht – Teilhabe heißt, Angebote auch tatsächlich nutzen zu können." },
      {
        text: "Die Möglichkeit, an Bildungsangeboten teilzunehmen und sie tatsächlich zu nutzen.",
        richtig: true,
        feedback: "Richtig. Ein Angebot, das man mangels Gerät oder Kenntnissen nicht nutzen kann, schafft keine Teilhabe.",
      },
      { text: "Dass alle Lernenden dieselben Noten erhalten.", feedback: "Das wäre Ergebnisgleichheit, nicht Teilhabe." },
      { text: "Dass Lernende ihre Lehrkraft frei wählen dürfen.", feedback: "Wahlfreiheit ist hier nicht gemeint." },
    ],
  },
  {
    id: "t2",
    frage: "Alle Lernenden einer Klasse haben Zugang zum selben KI-Tool. Warum können trotzdem ungleiche Lernchancen entstehen?",
    optionen: [
      { text: "Weil das Tool für manche Lernende schneller rechnet.", feedback: "Die Rechengeschwindigkeit ist nicht der entscheidende Unterschied." },
      {
        text: "Weil Lernende KI unterschiedlich gut steuern und ihre Antworten unterschiedlich gut prüfen können.",
        richtig: true,
        feedback: "Genau – die zweite Ebene digitaler Ungleichheit: Kompetenzen entscheiden über den Nutzen.",
      },
      { text: "Gar nicht – gleicher Zugang stellt immer Gerechtigkeit her.", feedback: "Gleicher Zugang ist nur die erste Ebene." },
      { text: "Weil KI-Tools nur auf Englisch funktionieren.", feedback: "Die meisten Tools funktionieren auf Deutsch; die Sprache der Fachbegriffe kann aber eine Hürde sein." },
    ],
  },
  {
    id: "t3",
    frage: "Eine KI erstellt eine Übungsaufgabe, in der „der Chef“ entscheidet und „die Sekretärin“ den Kaffee bringt. Welches Risiko zeigt sich?",
    optionen: [
      { text: "Digitale Ungleichheit.", feedback: "Hier geht es nicht um Zugang oder Kompetenzen, sondern um den Inhalt." },
      {
        text: "Algorithmische Verzerrung.",
        richtig: true,
        feedback: "Richtig. Die KI gibt ein Rollenklischee aus ihren Trainingsdaten wieder.",
      },
      { text: "Fehlende Barrierefreiheit.", feedback: "Barrierefreiheit betrifft die Zugänglichkeit, nicht stereotype Inhalte." },
      { text: "Kein Risiko – es ist nur ein Beispiel.", feedback: "Gerade Beispiele prägen Vorstellungen. Stereotype gehören nicht ins Unterrichtsmaterial." },
    ],
  },
  {
    id: "t4",
    frage: "Welche KI-Nutzung ist im Mathematikunterricht am ehesten lernförderlich?",
    optionen: [
      { text: "Die KI liefert sofort die vollständige Lösung.", feedback: "Das spart Zeit, ersetzt aber das eigene Denken." },
      {
        text: "Die KI gibt schrittweise Hinweise und regt zum eigenen Lösungsweg an.",
        richtig: true,
        feedback: "Richtig – so wie bei Sara in Modul 3.",
      },
      { text: "Die KI rechnet, die Lernenden schreiben ab.", feedback: "So entsteht kaum Lernzuwachs." },
      { text: "Die KI ersetzt die Erklärung der Lehrkraft vollständig.", feedback: "KI kann ergänzen, aber die Lehrkraft nicht ersetzen." },
    ],
  },
  {
    id: "t5",
    frage:
      "Eine Lehrkraft setzt ein KI-generiertes Arbeitsblatt ungeprüft ein. Ein Rechenfehler fällt erst in der Klassenarbeit auf. Wer trägt die Verantwortung?",
    optionen: [
      { text: "Der Anbieter der KI.", feedback: "Der Anbieter haftet nicht für den Einsatz im Unterricht." },
      { text: "Die Lernenden, die den Fehler übernommen haben.", feedback: "Lernende dürfen sich auf geprüftes Material verlassen." },
      {
        text: "Die Lehrkraft – sie verantwortet eingesetzte Materialien fachlich und didaktisch.",
        richtig: true,
        feedback: "Richtig. KI kann unterstützen, die Verantwortung bleibt bei der Lehrkraft.",
      },
      { text: "Niemand – KI-Fehler sind unvermeidlich.", feedback: "Fehler sind möglich, aber durch Prüfen vermeidbar." },
    ],
  },
];

export const FEEDBACK_AUSSAGEN = [
  { id: "f1", text: "Die Inhalte waren verständlich aufbereitet." },
  { id: "f2", text: "Die Unterrichtsfälle waren realistisch." },
  { id: "f3", text: "Der KI-Lernbegleiter hat mich zum Nachdenken angeregt." },
  { id: "f4", text: "Ich fühle mich sicherer, KI bildungsgerecht im Unterricht einzusetzen." },
  { id: "f5", text: "Die Bearbeitungszeit war angemessen." },
];
