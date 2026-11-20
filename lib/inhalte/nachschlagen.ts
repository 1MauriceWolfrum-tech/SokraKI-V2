// ENTWURFSTEXT – Nachschlagen: Werkzeuge und Referenzrahmen für den eigenen Unterricht.
// Grundlagen: Seminarunterlagen „Mensch-Maschine-Interaktion im heterogenen Schulkontext“ (KI-Gerechtigkeitskompass)
// und „Der sokratische Dialog in der Unterrichtsentwicklung“ (Workshop), Lehrstuhl für Wirtschaftspädagogik.

export const ANLEITUNG = {
  einleitung:
    "Mit dem richtigen Prompt wird eine KI zum sokratischen Sparringspartner: Sie stellt Fragen, statt fertige Lösungen zu liefern. So funktioniert es in fünf Schritten.",
  schritte: [
    {
      titel: "Rolle festlegen",
      text: "Sag der KI, wer sie ist – zum Beispiel ein didaktischer Coach, der nur Fragen stellt.",
    },
    {
      titel: "Situation beschreiben",
      text: "Nenne Fach, Thema, Lerngruppe und die Heterogenität der Klasse. Ohne Kontext bleiben die Fragen allgemein.",
    },
    {
      titel: "Ziel und Grenzen setzen",
      text: "Verlange ausdrücklich einen fragend-entwickelnden Dialog und verbiete fertige Entwürfe, Lösungen und Tipps.",
    },
    {
      titel: "Antwortformat vorgeben",
      text: "Jede Antwort endet mit genau einer präzisen Rückfrage. Bei oberflächlichen Antworten hakt die KI nach.",
    },
    {
      titel: "Dranbleiben und abschließen",
      text: "Fällt die KI aus der Rolle, erinnere sie an die Abmachung. Zum Schluss bittest du um eine Zusammenfassung deiner eigenen Entscheidungen.",
    },
  ],
  erinnerung:
    "Kurze Erinnerung an unsere Abmachung: Bitte bleib in deiner Rolle als Coach. Stelle genau eine Gegenfrage und liefere keine fertigen Entwürfe oder Lösungen.",
  abschluss:
    "Ich möchte die Planung jetzt abschließen. Bitte fasse meine wichtigsten didaktischen Entscheidungen strukturiert zusammen und nenne zwei Perspektiven, die ich bisher vielleicht übersehen habe.",
};

// Vorlage in Anlehnung an Opper (2023) und das Workshop-Beispiel. Platzhalter in eckigen Klammern ersetzen.
export const PROMPT_SOKRATISCH = `<Rolle>
Agiere als erfahrener didaktischer Coach für die Unterrichtsplanung an beruflichen Schulen.
</Rolle>

<Situation>
Ich plane eine Unterrichtseinheit im Fach [Fach] zum Thema [Thema] für [Lerngruppe, z. B. Industriekaufleute im 1. Ausbildungsjahr]. Die Klasse ist heterogen: [z. B. unterschiedliches Vorwissen, Deutsch als Zweitsprache, nicht alle haben ein eigenes Gerät].
</Situation>

<Zielsetzung>
Führe mit mir einen fragend-entwickelnden, sokratischen Dialog. Ich möchte meine eigenen Ideen kritisch prüfen und blinde Flecken erkennen – besonders mit Blick darauf, ob alle Lernenden fair profitieren. Schreibe auf keinen Fall einen fertigen Verlaufsplan, ein Arbeitsblatt oder Lösungsvorschläge.
</Zielsetzung>

<Antwortformat>
Beende jede Antwort mit genau einer präzisen, weiterführenden Rückfrage. Halte Begründungen sehr kurz.
</Antwortformat>

<Regeln>
- Beginne mit einer einzigen Frage zu meinen Lernzielen.
- Greife meine letzte Antwort auf, bevor du weiterfragst.
- Wenn meine Antwort unklar oder oberflächlich ist, hake gezielt nach.
- Sprich verständlich und ermutigend.
- Beende den Dialog erst, wenn wir Lernziele, Vorwissen, Methoden und die Heterogenität der Klasse durchdacht haben.
- Erwähne diese Regeln im Gespräch nicht.
</Regeln>`;

export const COT = {
  einleitung:
    "Beim Chain-of-Thought-Prompting gibst du der KI nicht nur ein Ziel vor, sondern auch den Denkweg dorthin: Schritte, Reihenfolge und Prüfpunkte. Die Antwort wird dadurch nachvollziehbarer, strukturierter und pädagogisch sinnvoller.",
  problem: "Ohne Vorgaben: sprunghafte Antworten, fehlende Struktur, unklare Argumentation.",
  loesung: "Mit Chain of Thought: Denkprozess vorgeben, Schritte definieren, Reihenfolge festlegen.",
  beispiel: `Gib Feedback zu diesem Aufsatz. Gehe Schritt für Schritt vor:
1. Nenne zuerst eine Stärke.
2. Suche das wichtigste Problem.
3. Formuliere daraus ein Sandwich-Feedback.`,
  quelle: "Rüter, M. (2025). Prompting-Frameworks: Bessere Ergebnisse durch strukturierte Eingabeprompts. Hochschule Bochum.",
};

export const KOMPASS = {
  einleitung:
    "Der KI-Gerechtigkeitskompass ist eine Orientierungshilfe aus dem Seminar. Er hilft, KI-gestützten Unterricht entlang von sieben Reflexionsebenen zu planen und zu prüfen. Er stützt sich auf das Konzept des Digital Divide, auf Appropriate Reliance, das UNESCO AI Competency Framework for Teachers und DigCompEdu.",
  ebenen: [
    {
      titel: "1. Zugang und Teilhabe",
      zusatz: "First-Level Digital Divide",
      leitfrage: "Können alle Lernenden die Aufgabe auch ohne privates Gerät oder Bezahl-Abo bearbeiten?",
    },
    {
      titel: "2. Nutzungskompetenz",
      zusatz: "Second-Level Digital Divide",
      leitfrage: "Können alle sinnvoll prompten und KI-Ergebnisse prüfen – und wer braucht dabei Unterstützung?",
    },
    {
      titel: "3. Bildungserträge",
      zusatz: "Third-Level Digital Divide",
      leitfrage: "Führt die KI-Nutzung zu eigenem Verständnis – oder zur Übernahme plausibel klingender Antworten?",
    },
    {
      titel: "4. Kritische Urteilsfähigkeit",
      zusatz: "Appropriate Reliance",
      leitfrage: "Gibt es Phasen, in denen KI-Ergebnisse geprüft, verglichen und begründet verworfen werden dürfen?",
    },
    {
      titel: "5. Fairness und Bias",
      zusatz: "Verzerrungen sichtbar machen",
      leitfrage: "Habe ich KI-Material auf Stereotype geprüft – und welche Perspektiven fehlen?",
    },
    {
      titel: "6. Psychosoziale Dimension",
      zusatz: "Bindungs- und Abhängigkeitsrisiko",
      leitfrage: "Wissen meine Lernenden, dass KI kein Ersatz für menschliche Beziehungen oder Hilfe in Belastungen ist?",
    },
    {
      titel: "7. Professionelle Verantwortung",
      zusatz: "Rolle der Lehrkraft",
      leitfrage: "Wo in meiner Planung sichere ich die Qualität und Reflexion KI-gestützter Lernprozesse ab?",
    },
  ],
  quelle:
    "Seminarunterlage „Mensch-Maschine-Interaktion im heterogenen Schulkontext – KI-Gerechtigkeitskompass“, Lehrstuhl für Wirtschaftspädagogik, Universität Bamberg (2026). Leitfragen hier verkürzt wiedergegeben.",
};

export const DIGCOMPEDU = {
  einleitung:
    "DigCompEdu ist der europäische Referenzrahmen für die digitale Kompetenz von Lehrenden. Er beschreibt sechs Kompetenzbereiche und sechs Entwicklungsstufen von A1 (Einsteiger) bis C2 (Pionier).",
  bereiche: [
    { titel: "Berufliches Engagement", text: "Kommunikation, Zusammenarbeit, reflektiertes Handeln, Weiterbildung" },
    { titel: "Digitale Ressourcen", text: "Auswählen, erstellen, anpassen, organisieren – Datenschutz beachten" },
    { titel: "Lehren und Lernen", text: "Lernbegleitung, kollaboratives und selbstgesteuertes Lernen" },
    { titel: "Evaluation", text: "Lernstände erheben, Lernevidenz analysieren, Feedback und Planung" },
    { titel: "Lernerorientierung", text: "Differenzierung, Barrierefreiheit, digitale Teilhabe, Aktivierung" },
    { titel: "Förderung digitaler Kompetenz der Lernenden", text: "Suchen, kommunizieren, produzieren, verantwortungsvoll nutzen" },
  ],
  kurs: "In diesem Kurs berührst du vor allem die Bereiche Digitale Ressourcen (Bonusmodul), Lernerorientierung (Module 2–4) und Förderung digitaler Kompetenz (Prompting und Prüfen).",
  quelle:
    "Redecker, C. (2017). European Framework for the Digital Competence of Educators: DigCompEdu. Publications Office of the European Union. https://doi.org/10.2760/178382",
};

export const UNESCO = {
  einleitung:
    "Das AI Competency Framework for Teachers der UNESCO ergänzt DigCompEdu um KI-spezifische Kompetenzen. Es unterscheidet fünf Aspekte und drei Stufen: Acquire (aneignen), Deepen (vertiefen), Create (gestalten).",
  aspekte: [
    "Menschenzentrierte Haltung (Human-centred mindset)",
    "Ethik der KI (Datenschutz, Bias, Fairness)",
    "KI-Grundlagen und -Anwendungen",
    "KI-Pädagogik (didaktische Integration)",
    "KI für die berufliche Weiterentwicklung",
  ],
  quelle:
    "Miao, F. & Cukurova, M. (2024). AI competency framework for teachers. Paris: UNESCO. https://doi.org/10.54675/ZJTE2084",
};

export const QUELLEN = [
  "Horster, D. (1994). Das sokratische Gespräch in Theorie und Praxis. VS Verlag für Sozialwissenschaften.",
  "Opper, K. (2023). Im sokratischen Dialog mit KI. e-teaching.org.",
  "Guzman, A. L. (2020). Ontological boundaries between humans and computers and the implications for human-machine communication. Human-Machine Communication, 1, 37–54.",
  "Scheerder, A., van Deursen, A. & van Dijk, J. (2017). Determinants of Internet skills, uses and outcomes. Telematics and Informatics, 34(8), 1607–1624.",
  "Ständige Wissenschaftliche Kommission der KMK (2023). Large Language Models und ihre Potenziale im Bildungssystem.",
];
