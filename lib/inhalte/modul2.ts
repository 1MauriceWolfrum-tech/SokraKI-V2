// ENTWURFSTEXT – Modul 2: Bildungsgerechtigkeit im KI-Zeitalter (Konzept Kapitel 5).
// Begriffe in der Hausarbeit anhand geeigneter Literatur präzise definieren.

export const BEGRIFFE = [
  {
    id: "bildungsgerechtigkeit",
    begriff: "Bildungsgerechtigkeit",
    kurz: "Wie sollen Bildungschancen gerecht verteilt sein?",
    text: "Bildungsgerechtigkeit ist eine normative Frage: Wie sollten Bildungschancen und Bildungsmöglichkeiten in einer Gesellschaft verteilt sein? Sie umfasst mehr als die identische Behandlung aller Lernenden.",
  },
  {
    id: "chancengerechtigkeit",
    begriff: "Chancengerechtigkeit",
    kurz: "Erfolg soll nicht von der Herkunft abhängen.",
    text: "Bildungserfolg soll nicht unangemessen von sozialer Herkunft, Einkommen, Sprache oder anderen nicht leistungsbezogenen Voraussetzungen abhängen.",
  },
  {
    id: "bildungsteilhabe",
    begriff: "Bildungsteilhabe",
    kurz: "Angebote nutzen können – nicht nur dürfen.",
    text: "Bildungsteilhabe beschreibt die Möglichkeit, an Bildungsangeboten teilzunehmen und sie tatsächlich zu nutzen. Ein Angebot, das man wegen fehlender Geräte oder Kenntnisse nicht nutzen kann, schafft keine Teilhabe.",
  },
  {
    id: "digitale-ungleichheit",
    begriff: "Digitale Ungleichheit",
    kurz: "Zugang, Kompetenz und Nutzen sind ungleich verteilt.",
    text: "Digitale Ungleichheit zeigt sich auf drei Ebenen: beim Zugang zu Technik, bei den Kompetenzen, sie zu nutzen, und bei den Vorteilen, die Menschen daraus ziehen.",
  },
];

export const LERNENDE = [
  {
    id: "emma",
    name: "Emma",
    info: "18 · Industriekauffrau, 1. Ausbildungsjahr",
    farbe: "hellblau",
    voraussetzungen: "Eigener Laptop, schnelles Internet, nutzt KI-Tools täglich.",
    herausforderung:
      "Emma übernimmt KI-Antworten oft ungeprüft, weil sie überzeugend klingen. Fehler in Rechnungen fallen ihr nicht auf.",
    hilft: "Aufgaben, in denen KI-Antworten geprüft, verglichen und begründet werden müssen.",
    ebene: "Kompetenz: KI sinnvoll nutzen und prüfen",
  },
  {
    id: "tobias",
    name: "Tobias",
    info: "20 · Kaufmann im Einzelhandel, 2. Ausbildungsjahr",
    farbe: "lindgruen",
    voraussetzungen: "Nur ein Smartphone mit begrenztem Datenvolumen, arbeitet am Wochenende im Betrieb.",
    herausforderung:
      "KI-gestützte Hausaufgaben kann Tobias kaum bearbeiten. Ihm fehlen Gerät, Datenvolumen und Zeit.",
    hilft: "KI-Phasen im Unterricht mit Schulgeräten und Aufgaben, die auch ohne KI lösbar sind.",
    ebene: "Zugang: Geräte, Internet, Zeit",
  },
  {
    id: "leyla",
    name: "Leyla",
    info: "19 · Industriekauffrau, 1. Ausbildungsjahr",
    farbe: "flieder",
    voraussetzungen: "Mathematisch sehr stark, lebt seit drei Jahren in Deutschland, Deutsch auf B2-Niveau.",
    herausforderung:
      "Prompts und KI-Antworten in Fachsprache sind für Leyla mühsam. Beim Übersetzen gehen Fachbegriffe wie Skonto verloren.",
    hilft: "KI gezielt für sprachliche Vereinfachung nutzen, ergänzt um einen Wortspeicher und Hilfe beim Formulieren von Prompts.",
    ebene: "Sprache: Fachsprache und Prompting",
  },
];

export const GERECHTIGKEITSFRAGE = "Warum bedeutet gleicher Zugang zu KI nicht automatisch gleiche Bildungschancen?";

export const GERECHTIGKEITS_IMPULS =
  "Gleicher Zugang ist nur die erste Ebene. Ob KI beim Lernen hilft, hängt auch von Geräten und Zeit außerhalb der Schule ab, von der Fähigkeit, KI zu steuern und ihre Antworten zu prüfen, und von sprachlichen und fachlichen Voraussetzungen. Wer diese Voraussetzungen mitbringt, profitiert stärker – Unterschiede können dadurch sogar wachsen.";

export const CHANCEN = [
  {
    titel: "Individuelle Lernunterstützung",
    text: "KI kann zusätzliche Erklärungen bereitstellen und Aufgaben an unterschiedliche Lernstände anpassen.",
    bedingung: "Voraussetzung: Die Lehrkraft prüft die Erklärungen und begleitet, wer welche Hilfe nutzt.",
  },
  {
    titel: "Sprachliche Unterstützung",
    text: "KI kann komplexe Aufgabenstellungen sprachlich vereinfachen oder Fachbegriffe erläutern.",
    bedingung: "Voraussetzung: Fachbegriffe bleiben erhalten und werden erklärt statt weggelassen.",
  },
  {
    titel: "Barriereärmere Lernmaterialien",
    text: "KI kann bei alternativen Darstellungsformen helfen, etwa Schaubild, Tabelle oder Vorlesetext.",
    bedingung: "Voraussetzung: Die Lehrkraft kontrolliert, ob die Alternative fachlich gleichwertig ist.",
  },
  {
    titel: "Zeitlich flexible Lernbegleitung",
    text: "Lernende können auch außerhalb des Unterrichts zusätzliche Erklärungen erhalten.",
    bedingung: "Voraussetzung: Alle haben zu Hause Zugang – sonst profitieren nur manche.",
  },
];

export const RISIKEN = [
  {
    titel: "Digitale Ungleichheit",
    text: "Nicht alle Lernenden verfügen über dieselben technischen Voraussetzungen.",
    beispiel: "Hausaufgaben mit KI benachteiligen Auszubildende, die nur ein Smartphone mit wenig Datenvolumen haben.",
  },
  {
    titel: "Unterschiedliche KI-Kompetenzen",
    text: "Der Nutzen von KI hängt davon ab, wie kompetent Lernende sie steuern und ihre Ergebnisse prüfen.",
    beispiel: "Wer gezielt nachfragt, bekommt eine passende Erklärung; wer nur „Lös das“ schreibt, eine fertige Lösung.",
  },
  {
    titel: "Algorithmische Verzerrungen",
    text: "KI-Systeme können Stereotype und Benachteiligungen aus ihren Trainingsdaten wiedergeben.",
    beispiel: "Eine KI erzeugt Übungsfälle, in denen Führungskräfte immer Männer und Assistenzkräfte immer Frauen sind.",
  },
  {
    titel: "Fehlerhafte und ungeeignete Inhalte",
    text: "KI kann fachlich falsche, irreführende oder didaktisch ungeeignete Erklärungen erzeugen.",
    beispiel: "Eine KI berechnet Skonto vom Listenpreis statt vom Zieleinkaufspreis – sprachlich überzeugend, fachlich falsch.",
  },
];

export type Kategorie = "chance" | "risiko" | "abhaengig";

export const KATEGORIEN: { id: Kategorie; titel: string }[] = [
  { id: "chance", titel: "Chance" },
  { id: "risiko", titel: "Risiko" },
  { id: "abhaengig", titel: "Abhängig von der Umsetzung" },
];

export const ZUORDNUNG: { id: string; text: string; loesung: Kategorie; erklaerung: string }[] = [
  {
    id: "z1",
    text: "Eine KI vereinfacht die Sprache einer Aufgabe für Lernende mit geringen Deutschkenntnissen, ohne den Fachinhalt zu verändern.",
    loesung: "chance",
    erklaerung: "Sprachliche Hürden sinken, der fachliche Anspruch bleibt – eine Chance für mehr Teilhabe.",
  },
  {
    id: "z2",
    text: "Nur Lernende mit Bezahl-Abo haben Zugriff auf das leistungsfähigere KI-Modell.",
    loesung: "risiko",
    erklaerung: "Der Lernerfolg hängt hier vom Geldbeutel ab – ein klares Risiko für Chancengerechtigkeit.",
  },
  {
    id: "z3",
    text: "Die Klasse darf einen KI-Chatbot als zusätzliche Hilfe bei den Hausaufgaben nutzen.",
    loesung: "abhaengig",
    erklaerung: "Das kann helfen – oder diejenigen bevorzugen, die zu Hause Geräte haben und KI gut nutzen können.",
  },
  {
    id: "z4",
    text: "Ein KI-Tool erstellt Übungsfälle, in denen Führungskräfte immer männlich und Assistenzkräfte immer weiblich sind.",
    loesung: "risiko",
    erklaerung: "Algorithmische Verzerrung: Stereotype werden unbemerkt in Unterrichtsmaterial übernommen.",
  },
  {
    id: "z5",
    text: "Lernende können sich abends zu Hause zusätzliche Erklärungen von einer KI geben lassen.",
    loesung: "abhaengig",
    erklaerung: "Flexible Lernbegleitung ist ein Potenzial – aber nur für alle, die zu Hause Zugang und Zeit haben.",
  },
  {
    id: "z6",
    text: "Die Lehrkraft lässt sich von einer KI alternative Darstellungen eines Kalkulationsschemas erstellen und prüft sie vor dem Einsatz.",
    loesung: "chance",
    erklaerung: "Barriereärmere Materialien mit Qualitätskontrolle durch die Lehrkraft – eine Chance.",
  },
];

export const WEITERLESEN = [
  "Scheerder, A., van Deursen, A. & van Dijk, J. (2017). Determinants of Internet skills, uses and outcomes. Telematics and Informatics, 34(8), 1607–1624.",
  "Bender, E. M., Gebru, T., McMillan-Major, A. & Shmitchell, S. (2021). On the dangers of stochastic parrots. FAccT ’21, 610–623.",
  "UNESCO (2023). Guidance for generative AI in education and research. Paris: UNESCO.",
];

// Was Lehrkräfte über KI wissen sollten – in Anlehnung an die Seminarunterlage
// „Mensch-Maschine-Interaktion im heterogenen Schulkontext“ (Folien 13, 14, 17 und 20) und Guzman (2020).

export const KI_KANN = [
  "Muster in großen Datenmengen erkennen",
  "Texte sprachlich hochwertig erzeugen",
  "Informationen schnell abrufen und zusammenfassen",
  "Gleichbleibend und ohne Ermüdung arbeiten",
];

export const KI_KANN_NICHT = [
  "Inhalte tatsächlich verstehen",
  "Den Wahrheitsgehalt der eigenen Aussagen prüfen",
  "Kontext aus gelebter Erfahrung herstellen",
  "Moralisch urteilen und Gefühle empfinden",
];

export const KI_KERNSATZ = "Sprachliche Überzeugungskraft ist keine Garantie für fachliche Qualität.";

export const KERNRISIKEN = [
  {
    titel: "Automation Bias",
    text: "Systemvorschläge werden unkritisch übernommen – gerade dann, wenn die KI-Erklärung fehlerhaft, aber überzeugend klingt.",
    heterogenitaet: "Leistungsschwächere Lernende vertrauen Ausgaben eher blind. Herkunftsbedingte Unterschiede können dadurch wachsen.",
  },
  {
    titel: "Halluzinationen",
    text: "Die KI erfindet Fakten, Quellen oder Rechenschritte und präsentiert sie in sachlichem, plausiblem Ton.",
    heterogenitaet: "Ohne Prüfkompetenz verfestigen sich Falschinformationen – vor allem bei Lernenden mit wenig Vorwissen.",
  },
  {
    titel: "Algorithmische Verzerrung (Bias)",
    text: "Die KI gibt gesellschaftliche Vorurteile aus ihren Trainingsdaten wieder.",
    heterogenitaet: "Lernende aus benachteiligten Gruppen können durch stereotype Beispiele gebremst oder demotiviert werden.",
  },
];

export const DIGITAL_DIVIDE = [
  {
    ebene: "First-Level Divide",
    stichwort: "Zugang",
    text: "Geräte und schnelles Internet sind ungleich verteilt.",
    beispiel: "Tobias hat nur ein Smartphone mit wenig Datenvolumen.",
  },
  {
    ebene: "Second-Level Divide",
    stichwort: "Nutzung und Kompetenz",
    text: "Auch mit Gerät fehlt oft das Wissen, KI wirksam zu steuern und ihre Antworten zu prüfen.",
    beispiel: "Emma übernimmt KI-Rechnungen ungeprüft.",
  },
  {
    ebene: "Third-Level Divide",
    stichwort: "Ertrag und Teilhabe",
    text: "Entscheidend ist, wer tatsächlich einen Lern- und Bildungsgewinn aus der Nutzung zieht.",
    beispiel: "Wer KI als Tutor nutzt, lernt dazu – wer nur Lösungen abfragt, kaum.",
  },
];

export type Vertrauen = "zu-wenig" | "angemessen" | "zu-viel";

export const VERTRAUENSSTUFEN: { id: Vertrauen; titel: string }[] = [
  { id: "zu-wenig", titel: "Zu wenig Vertrauen" },
  { id: "angemessen", titel: "Angemessenes Vertrauen" },
  { id: "zu-viel", titel: "Zu viel Vertrauen" },
];

export const VERTRAUENSFAELLE: { id: string; text: string; loesung: Vertrauen; erklaerung: string }[] = [
  {
    id: "v1",
    text: "Emma kopiert die KI-Bezugskalkulation direkt in ihre Hausaufgabe, weil die Erklärung so sicher klingt.",
    loesung: "zu-viel",
    erklaerung: "Automation Bias: Die KI-Antwort wird ungeprüft übernommen. Ein Rechenfehler bliebe unentdeckt.",
  },
  {
    id: "v2",
    text: "Leyla lässt sich Skonto von der KI in einfacher Sprache erklären und vergleicht die Erklärung mit ihrem Lehrbuch.",
    loesung: "angemessen",
    erklaerung: "Die KI unterstützt, die Erklärung wird an einer zweiten Quelle geprüft – so sieht angemessenes Vertrauen aus.",
  },
  {
    id: "v3",
    text: "Eine Lehrkraft verbietet jede KI-Nutzung, weil „da sowieso nur Unsinn herauskommt“.",
    loesung: "zu-wenig",
    erklaerung: "Pauschales Misstrauen lässt sinnvolle Unterstützung ungenutzt – etwa sprachliche Hilfen für Lernende wie Leyla.",
  },
  {
    id: "v4",
    text: "Tobias rechnet das KI-Ergebnis mit einer Überschlagsrechnung nach und fragt bei einer Abweichung im Unterricht nach.",
    loesung: "angemessen",
    erklaerung: "Plausibilitätsprüfung und Rückfrage: Die KI unterstützt die Entscheidung, ersetzt sie aber nicht.",
  },
];
