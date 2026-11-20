import type { QuizFrage, SzenarioId } from "@/lib/typen";
import type { OptionId } from "@/lib/inhalte/modul3";

// ENTWURFSTEXT – Modul 4: Reflektieren mit dem KI-Lernbegleiter (Konzept Kapitel 7).
// Methode: KI-gestützte sokratische Gesprächsführung nach einem selbst entwickelten Leitfaden.

// Was einen sokratischen Dialog ausmacht – in Anlehnung an Horster (1994) und den Seminar-Workshop
// „Der sokratische Dialog in der Unterrichtsentwicklung“.
export const SOKRATIK = {
  einleitung:
    "Der sokratische Dialog geht auf den Philosophen Sokrates zurück: Er hat seinen Gesprächspartnern keine Antworten gegeben, sondern so lange gezielt nachgefragt, bis sie ihre eigenen Annahmen prüften und selbst zu einer begründeten Einsicht kamen. Ziel ist nicht die Vermittlung fertiger Lösungen, sondern eigenständiges Denken durch strukturierte Fragen und Reflexion.",
  prozess: [
    { titel: "Konkretes Beispiel", text: "Ausgangspunkt ist ein konkreter Fall aus der Praxis – das Fundament." },
    { titel: "Gezielte Frage", text: "Eine präzise Frage lenkt den Blick auf eine Annahme oder Lücke." },
    { titel: "Kognitive Aktivierung", text: "Die eigene Position wird geprüft und bei Bedarf korrigiert." },
    { titel: "Selbstständige Erkenntnis", text: "Die Einsicht entsteht bei der lernenden Person, nicht beim Gegenüber." },
  ],
  merkmale: [
    { ist: "Eine Frage auf einmal", nicht: "Mehrere Fragen oder lange Erklärungen" },
    { ist: "Knüpft an die letzte Antwort an", nicht: "Stellt Fragen nach Schema F" },
    { ist: "Fordert Begründungen ein", nicht: "Lobt oder bestätigt nur" },
    { ist: "Lässt die Erkenntnis bei dir", nicht: "Liefert Lösungen, Tipps oder fertige Entwürfe" },
    { ist: "Hakt bei oberflächlichen Antworten nach", nicht: "Gibt sich mit „passt schon“ zufrieden" },
  ],
  mitKi:
    "Eine KI antwortet von sich aus lieber, als zu fragen. Damit sie sokratisch arbeitet, braucht sie klare Regeln: eine Rolle, eine Zielsetzung, ein festes Antwortformat (genau eine Frage) und das Verbot, Lösungen zu liefern. Genau so ist der Lernbegleiter in diesem Kurs gebaut. Eine Anleitung mit Prompt zum Kopieren findest du unter „Nachschlagen“.",
};

// Quiz: Sokratisch oder nicht?
const SOKRATISCH = "Sokratisch";
const NICHT = "Nicht sokratisch";

export const SOKRATISCH_ODER_NICHT: QuizFrage[] = [
  {
    id: "s1",
    frage:
      "Lehrkraft: „Ich würde allen Lernenden dieselbe KI geben.“ – KI: „Was setzt du damit über die Geräte und Kenntnisse deiner Lernenden voraus?“",
    optionen: [
      { text: SOKRATISCH, richtig: true, feedback: "Richtig: eine gezielte Frage, die eine verborgene Annahme sichtbar macht." },
      { text: NICHT, feedback: "Doch: Die KI stellt genau eine Frage und lenkt den Blick auf eine Annahme – typisch sokratisch." },
    ],
  },
  {
    id: "s2",
    frage:
      "Lernende: „Wie berechne ich den Bezugspreis?“ – KI: „Der Bezugspreis beträgt 21.318 €. Soll ich dir noch den Rechenweg zeigen?“",
    optionen: [
      { text: SOKRATISCH, feedback: "Nein: Die KI liefert die Lösung. Die Frage am Ende ändert daran nichts." },
      { text: NICHT, richtig: true, feedback: "Richtig: Die KI nimmt das Denken ab. Eine Frage am Ende macht noch keinen sokratischen Dialog." },
    ],
  },
  {
    id: "s3",
    frage: "Lehrkraft: „Ich setze gestufte Hilfekarten ein.“ – KI: „Super Idee, das ist bestimmt gerecht! Hast du noch Fragen?“",
    optionen: [
      { text: SOKRATISCH, feedback: "Nein: Lob und Bestätigung regen nicht zum Weiterdenken an." },
      { text: NICHT, richtig: true, feedback: "Richtig: Die KI bestätigt nur und fordert keine Begründung ein." },
    ],
  },
  {
    id: "s4",
    frage:
      "KI: „Welches Lernziel verfolgst du? Wie viel Zeit planst du? Welche Methode wählst du? Und wie gehst du mit Heterogenität um?“",
    optionen: [
      { text: SOKRATISCH, feedback: "Nicht ganz: Vier Fragen auf einmal überfordern und verhindern ein gezieltes Nachdenken." },
      { text: NICHT, richtig: true, feedback: "Richtig: Ein sokratischer Dialog stellt eine Frage nach der anderen." },
    ],
  },
  {
    id: "s5",
    frage:
      "Lehrkraft: „Weil Hilfekarten auch ohne Gerät funktionieren.“ – KI: „Du nennst die Geräte. Woran würdest du merken, dass die Hilfekarten auch tatsächlich genutzt werden?“",
    optionen: [
      { text: SOKRATISCH, richtig: true, feedback: "Richtig: Die KI greift die Antwort auf und führt genau einen Schritt weiter." },
      { text: NICHT, feedback: "Doch: Anknüpfen an die letzte Antwort plus eine weiterführende Frage – das ist sokratisch." },
    ],
  },
  {
    id: "s6",
    frage: "KI: „Hier sind fünf Tipps für einen gerechten KI-Einsatz: 1. Schulgeräte nutzen, 2. Prompts üben, 3. …“",
    optionen: [
      { text: SOKRATISCH, feedback: "Nein: Tipps sind fertige Lösungen – du musst nichts selbst erarbeiten." },
      { text: NICHT, richtig: true, feedback: "Richtig: Eine Liste mit Tipps ersetzt das eigene Nachdenken." },
    ],
  },
];

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
      "Du hast in Modul 3 eine Handlungsempfehlung für den Mathematikunterricht formuliert. Welche Maßnahme darin hältst du für die wichtigste – und warum ist sie gerecht?",
      "Welche Annahme über deine Lernenden steckt in dieser Maßnahme?",
      "Wie wirkt deine Maßnahme auf einen Schüler, der zu Hause keinen KI-Zugang hat, und auf eine Schülerin, die KI täglich nutzt?",
      "Was passiert, wenn Lernende trotz deiner Maßnahme weiterhin vollständige Lösungen abfragen – welche Folgen hätte das für deinen Unterricht?",
      "Woran würdest du merken, dass die KI-Unterstützung das eigenständige Problemlösen fördert statt ersetzt?",
    ],
  },
};

// Antwortbausteine je Phase: ein Klick übernimmt den Text ins Eingabefeld, wo er ergänzt werden kann.
// Sie verkürzen das Gespräch, ohne eine „richtige“ Antwort vorzugeben.
export const ANTWORTBAUSTEINE: Record<SzenarioId, { phasen: string[][]; annahmen?: Record<OptionId, string[]> }> = {
  a: {
    phasen: [
      [
        "Ich halte das für gerecht, weil die Lernenden sehr unterschiedliche Voraussetzungen mitbringen und so jede Person passende Hilfe bekommt.",
        "Ich halte das für gerecht, weil alle Lernenden dieselben Möglichkeiten haben und niemand bevorzugt wird.",
        "Ich halte das für gerecht, weil die KI individuell erklären kann und die Lehrkraft dadurch entlastet wird.",
      ],
      [],
      [
        "Die Auszubildende mit Schwierigkeiten braucht Hilfe bei Fachbegriffen, weil sie KI-Antworten sonst nicht versteht; der andere kommt wahrscheinlich allein zurecht.",
        "Der Auszubildende mit Vorwissen profitiert vermutlich mehr, da er gezielter fragen und die Antworten besser prüfen kann.",
        "Beide erleben es ähnlich, weil die Aufgabe für alle gleich ist – das könnte die Unterschiede aber übersehen.",
      ],
      [
        "Ich muss mehr Zeit für die Vorbereitung einplanen, weil ich KI-Erklärungen und Hilfekarten vorher prüfen muss.",
        "Ich nehme in Kauf, dass Lernende KI-Fehler übernehmen, da ich nicht jede Antwort kontrollieren kann.",
        "Ich nehme in Kauf, dass Lernende ohne Gerät weniger Unterstützung bekommen, weil die KI-Phasen nicht für alle gleich nutzbar sind.",
      ],
      [
        "Ich lasse die Lernenden ihren Rechenweg erklären, weil ich so sehe, ob sie den Angebotsvergleich verstanden haben.",
        "Ich vergleiche die Ergebnisse der Lernenden mit und ohne KI-Hilfe, damit ich Unterschiede früh erkenne.",
        "Ich frage am Ende kurz nach, welche Hilfe wem genützt hat, denn so kann ich die Angebote anpassen.",
      ],
    ],
    annahmen: {
      A: [
        "Unterschiede bei Geräten bleiben bestehen, weil drei Auszubildende kein eigenes Notebook haben.",
        "Unterschiede beim Prompten und Prüfen bleiben bestehen, da nicht alle KI-Antworten kritisch einschätzen können.",
        "Sprachliche Unterschiede bleiben bestehen, weil Fachbegriffe wie Skonto in KI-Antworten nicht automatisch erklärt werden.",
      ],
      B: [
        "Ich bespreche die Angebote vorher mit der Klasse, damit alle wissen, wofür welche Hilfe gedacht ist.",
        "Die Lernenden erkennen es an einer kurzen Selbsteinschätzung, weil sie so ihren Bedarf selbst benennen.",
        "Ich weise die Hilfen gezielt zu, weil ich die Lernstände aus dem Unterricht kenne.",
      ],
      C: [
        "Ich nehme an, dass alle KI-Lösungswege prüfen können – das trifft aber vermutlich nicht auf alle zu, weil Vorwissen fehlt.",
        "Ich nehme an, dass die KI fachlich korrekt arbeitet, da sie sonst die Lernenden in die Irre führt.",
        "Ich nehme an, dass alle Zugang zu einem Gerät haben, weil die Begleitung sonst nicht funktioniert.",
      ],
    },
  },
  b: {
    phasen: [
      [
        "Am wichtigsten ist eine Prompt-Vorlage für alle, weil dann nicht nur geübte Lernende die KI lernförderlich nutzen.",
        "Am wichtigsten sind KI-Phasen mit Schulgeräten, weil so alle unabhängig von der Ausstattung zu Hause Zugang haben.",
        "Am wichtigsten ist, dass Lernende ihren Lösungsweg erklären, denn so bleibt das eigene Denken im Mittelpunkt.",
      ],
      [
        "Ich nehme an, dass die Lernenden die Prompt-Vorlage auch wirklich nutzen, weil sie den Sinn verstehen.",
        "Ich nehme an, dass alle gleich gut mit den Schulgeräten umgehen können, weil wir sie regelmäßig im Unterricht nutzen.",
        "Ich nehme an, dass Lernende lieber selbst denken, wenn man sie anleitet, weil eigene Erfolge motivieren.",
      ],
      [
        "Der Schüler ohne Zugang profitiert von KI-Phasen im Unterricht, weil er zu Hause keine Hilfe hat; die Schülerin braucht eher Anleitung, KI nicht nur für Lösungen zu nutzen.",
        "Für beide ist die Maßnahme ähnlich hilfreich, da sie im Unterricht unter gleichen Bedingungen stattfindet.",
        "Die Schülerin mit KI-Erfahrung ist im Vorteil, weil sie die Prompt-Vorlage schneller sinnvoll einsetzt.",
      ],
      [
        "Dann lernen diese Lernenden weniger, weil sie die Funktion nicht selbst aufstellen – das würde ich in der Klassenarbeit merken.",
        "Dann müsste ich KI-freie Übungsphasen einbauen, damit ich sehe, was die Lernenden ohne Hilfe können.",
        "Dann würde ich die Lösungen thematisieren und erklären lassen, denn so wird Abschreiben sichtbar.",
      ],
      [
        "Ich würde es merken, wenn die Lernenden Steigung und y-Achsenabschnitt in eigenen Worten erklären, denn das zeigt Verständnis.",
        "Ich würde es an neuen Aufgaben ohne KI merken, weil dann sichtbar wird, ob sie den Weg verstanden haben.",
        "Ich würde es merken, wenn Lernende der KI Fragen stellen statt Lösungen zu verlangen, weil sie dann selbst weiterdenken.",
      ],
    ],
  },
};

export const NACHHAKEN = "Kannst du das genauer begründen – zum Beispiel an einer bestimmten Person aus dem Fall?";

export const ABSCHLUSS =
  "Danke für deine Antworten. Formuliere zum Abschluss deine begründete Handlungsempfehlung in zwei bis drei Sätzen.";

export const EMPFEHLUNG_FRAGE = "Deine begründete Handlungsempfehlung";

export const MUSTER_EMPFEHLUNG: Record<SzenarioId, string> = {
  a: "Die Lehrkraft sollte gestufte Unterstützung anbieten: KI-Erklärungen, die sie vorab fachlich geprüft hat, und Hilfekarten, die auch ohne Gerät nutzbar sind. KI-Phasen finden mit Schulgeräten im Unterricht statt. Die Auszubildenden erklären ihren Rechenweg, damit sichtbar wird, wer den Angebotsvergleich verstanden hat. So erhalten alle passende Hilfe – unabhängig von Gerät, Vorwissen und Sprache.",
  b: "Die Lehrkraft sollte KI als Denkpartner einsetzen: Eine gemeinsam geübte Prompt-Vorlage („Gib mir nur einen Hinweis, keine Lösung“) sorgt dafür, dass alle die KI lernförderlich nutzen können, nicht nur die Geübten. KI-Phasen finden mit Schulgeräten statt, Hilfekarten sind die Alternative ohne KI. KI-freie Übungen und das Erklären des Lösungswegs zeigen, ob das eigene Problemlösen gefördert wird.",
};
