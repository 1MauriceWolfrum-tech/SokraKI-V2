// ENTWURFSTEXT – Modul 3: Unterrichtsszenarien aus BWL und Mathematik (Konzept Kapitel 6).
// Alle Personen und Betriebe sind erfunden.

export type OptionId = "A" | "B" | "C";

export const FALL_A = {
  titel: "Fallbeispiel A: KI im BWL-Unterricht",
  thema: "Angebotsvergleich",
  situation: [
    "Eine Lehrkraft unterrichtet eine Klasse angehender Industriekaufleute im ersten Ausbildungsjahr. Die Auszubildenden sollen zwei Lieferantenangebote für 200 Bürostühle vergleichen und eine begründete Entscheidung vorbereiten.",
    "In der Klasse zeigen sich große Unterschiede: Einige rechnen Bezugskalkulationen bereits sicher, andere haben Schwierigkeiten mit Fachbegriffen wie Skonto oder Bezugskosten und mit der Prozentrechnung. Drei Auszubildende haben kein eigenes Notebook.",
    "Die Lehrkraft überlegt, einen KI-Chatbot zur individuellen Unterstützung einzusetzen.",
  ],
  angebote: [
    { lieferant: "Bürowelt GmbH", preis: "120 € je Stuhl", rabatt: "10 %", skonto: "2 %", bezugskosten: "150 €" },
    { lieferant: "Sitzfix KG", preis: "115 € je Stuhl", rabatt: "5 %", skonto: "3 %", bezugskosten: "frei Haus" },
  ],
  optionen: [
    {
      id: "A" as OptionId,
      titel: "Gleiche Aufgaben, KI frei verfügbar",
      text: "Alle Lernenden bearbeiten dieselben Aufgaben und dürfen zusätzlich KI verwenden.",
      impuls:
        "Gleicher Zugang wirkt gerecht, setzt aber voraus, dass alle ein Gerät haben und KI gleich gut nutzen und prüfen können. Lernende mit Vorwissen profitieren meist stärker – die Unterschiede können wachsen.",
    },
    {
      id: "B" as OptionId,
      titel: "Gestufte Unterstützung",
      text: "Die Lehrkraft stellt unterschiedliche Unterstützungsangebote bereit, darunter KI-Erklärungen und selbst erstellte Hilfekarten.",
      impuls:
        "Mehrere Angebote berücksichtigen unterschiedliche Lernvoraussetzungen. Entscheidend ist, dass die Lehrkraft die KI-Erklärungen vorab prüft, die Wahl der Hilfen begleitet und die Hilfekarten auch ohne Gerät nutzbar sind.",
    },
    {
      id: "C" as OptionId,
      titel: "KI übernimmt die Begleitung",
      text: "Die Lernenden bearbeiten die Aufgaben ausschließlich mit KI, die ihnen passende Lösungswege vorschlägt.",
      impuls:
        "Wenn KI Lösungswege vorgibt, sinkt die eigene Denkleistung. Wer KI-Ergebnisse nicht prüfen kann, übernimmt Fehler, und die Lehrkraft verliert den Überblick über die Lernstände. Diese Variante gefährdet Bildungsgerechtigkeit am stärksten.",
    },
  ],
  reflexionsfragen: [
    "Welche Lernenden profitieren besonders von deiner Entscheidung?",
    "Welche Lernenden könnten benachteiligt werden?",
    "Welche Voraussetzungen müssen für einen gerechten KI-Einsatz erfüllt sein?",
    "Wie könnte die Lehrkraft sicherstellen, dass alle Lernenden die fachlichen Lernziele erreichen?",
  ],
  ziel: "Der Einsatz von KI garantiert allein noch keine Differenzierung. Entscheidend ist, wie die Lehrkraft KI in die Unterrichtsgestaltung einbindet.",
};

export const FALL_B = {
  titel: "Fallbeispiel B: KI im Mathematikunterricht",
  thema: "Lineare Kostenfunktionen",
  situation: [
    "Eine Lehrkraft unterrichtet eine Klasse an einer beruflichen Schule. Die Lernenden sollen lineare Kostenfunktionen aufstellen und interpretieren.",
    "Die Aufgabe: Ein Copyshop hat monatliche Fixkosten von 1.200 € und variable Kosten von 0,05 € pro Kopie. Stelle die Kostenfunktion auf und erkläre, was die Steigung bedeutet.",
    "Zwei Lernende nutzen dieselbe KI – aber auf unterschiedliche Weise.",
  ],
  chats: [
    {
      person: "Ben",
      beschreibung: "lässt sich die Aufgabe lösen",
      verlauf: [
        { von: "lernend", text: "Lös die Aufgabe mit dem Copyshop." },
        {
          von: "ki",
          text: "Die Kostenfunktion lautet K(x) = 0,05x + 1.200. Die Steigung 0,05 bedeutet, dass jede Kopie 5 Cent kostet. Fertig!",
        },
      ],
    },
    {
      person: "Sara",
      beschreibung: "lässt sich schrittweise Hinweise geben",
      verlauf: [
        { von: "lernend", text: "Gib mir bitte nur einen Hinweis, wie ich anfangen soll." },
        {
          von: "ki",
          text: "Überlege zuerst: Welche Kosten fallen an, auch wenn keine einzige Kopie gemacht wird? Wo steht dieser Wert in einer linearen Funktion?",
        },
        { von: "lernend", text: "Die 1.200 € sind fix – also der y-Achsenabschnitt?" },
        { von: "ki", text: "Gut begründet. Was passiert mit den Kosten bei jeder weiteren Kopie?" },
      ],
    },
  ],
  analyseFrage: "Inwiefern unterscheiden sich die beiden Formen der KI-Unterstützung hinsichtlich ihres Lernpotenzials?",
  analyseImpuls:
    "Ben erhält eine richtige Lösung, muss aber nichts selbst denken – ob er Fixkosten und Steigung verstanden hat, bleibt offen. Sara wird durch Fragen zum eigenen Lösungsweg geführt; sie verknüpft den Sachverhalt mit dem Funktionsbegriff. Gleiche KI, sehr unterschiedliches Lernpotenzial: Es kommt auf die Art der Nutzung an.",
  aussage: "KI fördert Bildungsgerechtigkeit, wenn alle Lernenden jederzeit vollständige Musterlösungen erhalten können.",
  bewertungsSkala: ["Stimme zu", "Stimme eher zu", "Stimme eher nicht zu", "Stimme nicht zu"],
  aussageImpuls:
    "Die Aussage greift zu kurz. Musterlösungen für alle schaffen gleichen Zugang, aber nicht gleiche Lernchancen: Lernende mit Vorwissen können eine Lösung nachvollziehen, andere schreiben sie ab. Bildungsgerechtigkeit braucht eine lernförderliche Nutzung – nicht nur Verfügbarkeit.",
  massnahmenFrage:
    "Entwickle zwei konkrete Maßnahmen, wie die Lehrkraft KI lernförderlich und möglichst chancengerecht einsetzen könnte.",
  massnahmenImpuls: [
    "Eine Prompt-Vorlage für die Klasse: „Gib mir einen Hinweis, keine Lösung.“",
    "KI-Phasen im Unterricht mit Schulgeräten statt nur zu Hause.",
    "Lernende erklären der KI ihren Lösungsweg und lassen ihn prüfen – nicht umgekehrt.",
    "Gestufte Hilfekarten als Alternative für alle, die ohne KI arbeiten.",
  ],
};
