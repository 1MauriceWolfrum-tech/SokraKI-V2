import type { Auswahlaussage, QuizFrage } from "@/lib/typen";

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
  // Begründungsbausteine: Die Lernenden wählen aus, was ihre Entscheidung trägt, und erhalten eine Rückmeldung.
  begruendungen: [
    {
      text: "Die Lernenden haben unterschiedliche Voraussetzungen – die Unterstützung sollte sich danach richten.",
      bewertung: "tragfaehig",
      feedback: "Genau: Chancengerechtigkeit heißt nicht, alle gleich zu behandeln, sondern ungleiche Voraussetzungen auszugleichen.",
    },
    {
      text: "Alle bekommen dieselben Möglichkeiten – also ist die Lösung gerecht.",
      bewertung: "kurz",
      feedback: "Gleicher Zugang ist nur die erste Ebene. Drei Auszubildende haben kein Notebook, andere können KI-Antworten kaum prüfen.",
    },
    {
      text: "Hilfen müssen auch ohne eigenes Gerät nutzbar sein, weil drei Auszubildende kein Notebook haben.",
      bewertung: "tragfaehig",
      feedback: "Richtig erkannt: Wer kein Gerät hat, darf beim KI-Einsatz nicht abgehängt werden (First-Level Divide).",
    },
    {
      text: "Die Lehrkraft muss KI-Erklärungen vorher prüfen, weil sie fehlerhaft sein können.",
      bewertung: "tragfaehig",
      feedback: "Ja. KI kann Skonto oder Bezugskosten falsch berechnen – die fachliche Verantwortung bleibt bei der Lehrkraft.",
    },
    {
      text: "KI erklärt geduldiger als eine Lehrkraft, deshalb sollte sie die Begleitung übernehmen.",
      bewertung: "kurz",
      feedback: "Geduld ersetzt keine Prüfung. Wer KI-Lösungswege nicht beurteilen kann, übernimmt Fehler – und die Lehrkraft verliert den Überblick.",
    },
    {
      text: "KI spart der Lehrkraft Zeit, die sie in die Einzelbetreuung schwächerer Lernender stecken kann.",
      bewertung: "eingeschraenkt",
      feedback: "Ein guter Gedanke – aber nur, wenn die gewonnene Zeit wirklich gezielt bei denen ankommt, die Unterstützung brauchen.",
    },
    {
      text: "Wer mit KI nicht zurechtkommt, kann die Aufgaben ja ohne KI lösen.",
      bewertung: "kurz",
      feedback: "So wächst die Lücke: Wer KI gut nutzt, bekommt zusätzliche Hilfe, die anderen nicht. Gerecht wäre eine gleichwertige Alternative.",
    },
  ] satisfies Auswahlaussage[],
  reflexion: [
    {
      id: "r1",
      frage: "Wer profitiert bei Option A (gleiche Aufgaben, KI frei verfügbar) am stärksten?",
      optionen: [
        {
          text: "Alle Lernenden gleichermaßen, weil alle denselben Zugang haben.",
          feedback: "Gleicher Zugang führt nicht zu gleichem Nutzen – Geräte und KI-Kompetenzen sind ungleich verteilt.",
        },
        {
          text: "Lernende mit eigenem Gerät und Vorwissen, die KI-Antworten prüfen können.",
          richtig: true,
          feedback: "Richtig. Sie nutzen KI als Tutor – die Unterschiede in der Klasse können dadurch wachsen.",
        },
        {
          text: "Vor allem Lernende mit Schwierigkeiten bei Fachbegriffen.",
          feedback: "Sie könnten profitieren, brauchen dafür aber Anleitung beim Prompten und beim Prüfen der Antworten.",
        },
      ],
    },
    {
      id: "r2",
      frage: "Wer wird bei Option C (KI übernimmt die Begleitung) am ehesten benachteiligt?",
      optionen: [
        {
          text: "Die leistungsstarken Lernenden, weil sie unterfordert sind.",
          feedback: "Unterforderung ist möglich, aber das größere Risiko liegt woanders.",
        },
        {
          text: "Lernende ohne Gerät und Lernende, die KI-Lösungswege nicht prüfen können.",
          richtig: true,
          feedback: "Genau. Sie haben keinen Zugang oder übernehmen Fehler – und niemand bemerkt es rechtzeitig.",
        },
        {
          text: "Niemand – die KI passt die Lösungswege ja an jede Person an.",
          feedback: "Angepasste Lösungswege ersetzen nicht das eigene Denken und sind nicht automatisch richtig.",
        },
      ],
    },
    {
      id: "r3",
      frage: "Welche Voraussetzung ist für einen gerechten KI-Einsatz in diesem Fall am wichtigsten?",
      optionen: [
        {
          text: "Ein möglichst leistungsfähiges KI-Modell mit Bezahl-Abo.",
          feedback: "Ein besseres Modell löst weder das Geräteproblem noch fehlende Prüfkompetenz.",
        },
        {
          text: "KI-Phasen im Unterricht mit Schulgeräten, geprüfte KI-Erklärungen und Hilfen ohne Gerät.",
          richtig: true,
          feedback: "Richtig: Zugang sichern, Qualität prüfen und eine gleichwertige Alternative anbieten.",
        },
        {
          text: "Dass die Lernenden KI-Nutzung zu Hause selbst organisieren.",
          feedback: "Das verlagert die Ungleichheit nach Hause – genau dort sind Geräte und Zeit ungleich verteilt.",
        },
      ],
    },
    {
      id: "r4",
      frage: "Wie stellt die Lehrkraft am besten sicher, dass alle die fachlichen Lernziele erreichen?",
      optionen: [
        {
          text: "Sie kontrolliert, ob am Ende alle das richtige Ergebnis haben.",
          feedback: "Ein richtiges Ergebnis kann auch abgeschrieben sein. Es zeigt nicht, ob der Rechenweg verstanden wurde.",
        },
        {
          text: "Die Lernenden erklären ihren Rechenweg und begründen ihre Entscheidung für einen Lieferanten.",
          richtig: true,
          feedback: "Genau. Erklären und Begründen macht Verständnis sichtbar – mit und ohne KI.",
        },
        {
          text: "Sie lässt die KI die Lösungen der Lernenden bewerten.",
          feedback: "Die KI kann sich irren. Die Lernstandsdiagnose bleibt Aufgabe der Lehrkraft.",
        },
      ],
    },
  ] satisfies QuizFrage[],
  ziel: "Der Einsatz von KI garantiert allein noch keine Differenzierung. Entscheidend ist, wie die Lehrkraft KI in die Unterrichtsgestaltung einbindet.",
};

export type Person = "ben" | "sara";

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
      id: "ben" as Person,
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
      id: "sara" as Person,
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
  // Merkmale des sokratischen Dialogs: Welcher Chat zeigt sie?
  merkmale: [
    {
      id: "m1",
      text: "Die KI stellt eine gezielte Frage, statt die Lösung vorzugeben.",
      loesung: "sara" as Person,
      erklaerung: "Saras KI fragt nach den Fixkosten – Sara muss selbst nachdenken. Bens KI liefert sofort das Ergebnis.",
    },
    {
      id: "m2",
      text: "Die KI liefert eine richtige, aber fertige Lösung.",
      loesung: "ben" as Person,
      erklaerung: "Bens Ergebnis stimmt – aber er musste dafür nichts selbst denken.",
    },
    {
      id: "m3",
      text: "Die lernende Person formuliert selbst einen Gedanken und prüft ihn.",
      loesung: "sara" as Person,
      erklaerung: "Sara stellt eine eigene Vermutung auf („also der y-Achsenabschnitt?“) – kognitive Aktivierung.",
    },
    {
      id: "m4",
      text: "Ob die Person Fixkosten und Steigung verstanden hat, bleibt offen.",
      loesung: "ben" as Person,
      erklaerung: "Ben könnte das Ergebnis abschreiben, ohne es zu verstehen – sein Lernstand bleibt unsichtbar.",
    },
    {
      id: "m5",
      text: "Die KI knüpft an die letzte Antwort an und führt genau einen Schritt weiter.",
      loesung: "sara" as Person,
      erklaerung: "Die KI greift Saras Antwort auf und fragt nach den variablen Kosten – Schritt für Schritt zur eigenen Erkenntnis.",
    },
  ],
  vergleich: [
    { kriterium: "Gezielte Fragen statt fertiger Lösungen", ben: "Nein – Lösung sofort", sara: "Ja – eine Frage pro Schritt" },
    { kriterium: "Anknüpfen an Vorwissen und letzte Antwort", ben: "Nein", sara: "Ja – greift Saras Vermutung auf" },
    { kriterium: "Eigenes Denken (kognitive Aktivierung)", ben: "Kaum nötig", sara: "Sara stellt Vermutungen auf" },
    { kriterium: "Prüfen und Korrigieren eigener Urteile", ben: "Nicht möglich", sara: "„Gut begründet“ bestätigt ihre Prüfung" },
    { kriterium: "Selbstständige Erkenntnis", ben: "Bleibt offen", sara: "Sara erarbeitet die Funktion selbst" },
  ],
  fazit:
    "Saras Chat ist der lernförderlichere: Er folgt dem sokratischen Prinzip. Die KI stellt eine Frage nach der anderen, knüpft an Saras Antworten an und überlässt ihr die Erkenntnis. Bens Chat liefert eine richtige Lösung, aber kein Lernen. Den Unterschied macht nicht die KI, sondern der Prompt: „Gib mir nur einen Hinweis“ macht die KI zum Denkpartner – und genau diese Fähigkeit ist in einer Klasse ungleich verteilt.",
  aussage: "KI fördert Bildungsgerechtigkeit, wenn alle Lernenden jederzeit vollständige Musterlösungen erhalten können.",
  bewertungsSkala: ["Stimme zu", "Stimme eher zu", "Stimme eher nicht zu", "Stimme nicht zu"],
  argument: {
    id: "argument",
    frage: "Welches Argument trifft den Kern der Aussage am besten?",
    optionen: [
      {
        text: "Musterlösungen für alle schaffen gleichen Zugang – das ist gerecht.",
        feedback: "Gleicher Zugang ist wichtig, aber nicht ausreichend: Wer wenig Vorwissen hat, schreibt eher ab, statt nachzuvollziehen.",
      },
      {
        text: "Verfügbarkeit allein reicht nicht: Gerecht wird es erst, wenn KI so genutzt wird, dass alle selbst denken und lernen.",
        richtig: true,
        feedback: "Genau. Bildungsgerechtigkeit braucht eine lernförderliche Nutzung – nicht nur Verfügbarkeit.",
      },
      {
        text: "Musterlösungen sind grundsätzlich schädlich und gehören nicht in den Unterricht.",
        feedback: "Zu pauschal: Musterlösungen können zur Selbstkontrolle nach eigener Bearbeitung sehr hilfreich sein.",
      },
    ],
  } satisfies QuizFrage,
  empfehlungFrage:
    "Formuliere deine Handlungsempfehlung: Wie sollte die Lehrkraft KI in diesem Mathematikunterricht lernförderlich und chancengerecht einsetzen? Nenne mindestens eine konkrete Maßnahme und begründe sie.",
  musterloesung: [
    "Die Lehrkraft sollte KI als Denkpartner statt als Lösungsmaschine einsetzen.",
    "Maßnahme 1 – Prompt-Vorlage für alle: Sie gibt der Klasse einen Prompt wie „Gib mir nur einen Hinweis, keine Lösung. Frag mich zuerst, was ich schon weiß.“ und übt die Nutzung gemeinsam im Unterricht. So können nicht nur die geübten Lernenden die KI wie Sara nutzen.",
    "Maßnahme 2 – Zugang im Unterricht: KI-Phasen finden mit Schulgeräten statt; gestufte Hilfekarten stehen als gleichwertige Alternative ohne KI bereit.",
    "Maßnahme 3 – Verständnis sichtbar machen: Die Lernenden erklären ihren Lösungsweg in Partnerarbeit oder lassen die KI ihren eigenen Weg prüfen – nicht umgekehrt.",
    "Begründung: So erhalten alle Zugang zu lernförderlicher Unterstützung – unabhängig von Gerät und Vorwissen –, und die KI ersetzt das eigene Problemlösen nicht.",
  ],
  selbstcheck: [
    "Meine Empfehlung nennt mindestens eine konkrete Maßnahme.",
    "Sie sorgt dafür, dass die Lernenden selbst denken (Hinweise statt Lösungen).",
    "Sie berücksichtigt Lernende ohne Gerät oder mit wenig KI-Erfahrung.",
    "Sie ist begründet – mit Bezug zum Lernpotenzial oder zur Bildungsgerechtigkeit.",
  ],
};
