import type { ThemaId } from "@/lib/typen";

// ENTWURFSTEXT – Bonusmodul: Vom KI-Output zum didaktisch geeigneten Arbeitsblatt (Konzept Kapitel 9).

export const THEMEN: Record<ThemaId, { titel: string; zielgruppe: string; prompt: string }> = {
  bwl: {
    titel: "BWL: Angebotsvergleich",
    zielgruppe: "angehende Industriekaufleute",
    prompt:
      "Erstelle ein Arbeitsblatt zum Thema Angebotsvergleich für eine Berufsschulklasse angehender Industriekaufleute mit unterschiedlichen Lernvoraussetzungen. Berücksichtige verschiedene Schwierigkeitsgrade und biete sprachliche Hilfestellungen an.",
  },
  mathe: {
    titel: "Mathematik: Lineare Kostenfunktionen",
    zielgruppe: "eine Klasse an einer beruflichen Schule",
    prompt:
      "Erstelle ein Arbeitsblatt zum Thema lineare Kostenfunktionen im beruflichen Kontext für eine Klasse an einer beruflichen Schule mit unterschiedlichen Lernvoraussetzungen. Berücksichtige verschiedene Schwierigkeitsgrade und biete sprachliche Hilfestellungen an.",
  },
};

// Vorbereitete Entwürfe für den Modus ohne KI. Sie enthalten absichtlich typische Schwachstellen.
export const ENTWUERFE: Record<ThemaId, string> = {
  bwl: `Arbeitsblatt: Angebotsvergleich

Die Müller GmbH möchte 200 neue Bürostühle kaufen. Herr Müller hat seine Sekretärin gebeten, zwei Angebote einzuholen.

Angebot 1 – Bürowelt GmbH: Listenpreis 120 € je Stuhl, 10 % Rabatt, 2 % Skonto, Bezugskosten 150 €.
Angebot 2 – Sitzfix KG: Listenpreis 115 € je Stuhl, 5 % Rabatt, 3 % Skonto, Lieferung frei Haus.

Aufgabe 1: Berechne den Bezugspreis beider Angebote unter Berücksichtigung von Rabatt, Skonto und Bezugskosten.
Aufgabe 2: Entscheide, welches Angebot die Müller GmbH annehmen sollte.
Aufgabe 3: Nenne zwei weitere Kriterien neben dem Preis, die bei der Entscheidung wichtig sind.

Lösung
Angebot 1: 200 × 120 € = 24.000 €. Rabatt 10 % = 2.400 €. Skonto 2 % vom Listenpreis = 480 €. Bezugspreis = 24.000 € − 2.400 € − 480 € + 150 € = 21.270 €.
Angebot 2: 200 × 115 € = 23.000 €. Rabatt 5 % = 1.150 €. Skonto 3 % = 655,50 €. Bezugspreis = 21.194,50 €.
Die Müller GmbH sollte Angebot 2 annehmen.`,
  mathe: `Arbeitsblatt: Lineare Kostenfunktionen

Die Druckerei Schnelldruck hat monatliche Fixkosten von 800 €. Für jedes gedruckte Flyer-Paket entstehen variable Kosten von 2 €.

Aufgabe 1: Stelle die Kostenfunktion K(x) auf. Bestimme den Ordinatenabschnitt und die Steigung.
Aufgabe 2: Berechne die Kosten für 300 Flyer-Pakete.
Aufgabe 3: Ein Paket wird für 6 € verkauft. Ab wie vielen Paketen macht die Druckerei Gewinn?

Lösung
Aufgabe 1: K(x) = 800x + 2. Ordinatenabschnitt 2, Steigung 800.
Aufgabe 2: K(300) = 800 · 300 + 2 = 240.002 €.
Aufgabe 3: 6x = 800x + 2 – es gibt keine Gewinnschwelle.`,
};

// Auflösung für die vorbereiteten Entwürfe – wird erst nach der eigenen Prüfung angezeigt.
export const SCHWACHSTELLEN: Record<ThemaId, { kriterium: string; text: string }[]> = {
  bwl: [
    {
      kriterium: "Fachliche Richtigkeit",
      text: "Skonto wird vom Listenpreis statt vom Zieleinkaufspreis (21.600 €) berechnet. Richtig: Skonto 432 €, Bezugspreis Angebot 1 = 21.318 €.",
    },
    {
      kriterium: "Differenzierung",
      text: "Der Auftrag verlangt verschiedene Schwierigkeitsgrade – alle Aufgaben stehen auf einer Stufe, Hilfen fehlen.",
    },
    {
      kriterium: "Sprachliche Verständlichkeit",
      text: "Fachbegriffe wie Skonto, Rabatt und Bezugskosten werden nicht erklärt, obwohl sprachliche Hilfen verlangt waren.",
    },
    {
      kriterium: "Selbstständiges Lernen",
      text: "Die vollständige Lösung steht direkt unter den Aufgaben.",
    },
    {
      kriterium: "Bildungsgerechtigkeit",
      text: "„Herr Müller … seine Sekretärin“ gibt ein Rollenklischee wieder.",
    },
  ],
  mathe: [
    {
      kriterium: "Fachliche Richtigkeit",
      text: "Fixkosten und variable Kosten sind vertauscht. Richtig: K(x) = 2x + 800, K(300) = 1.400 €, Gewinnschwelle bei 200 Paketen.",
    },
    {
      kriterium: "Sprachliche Verständlichkeit",
      text: "Fachbegriffe wie Ordinatenabschnitt und Steigung werden nicht erklärt.",
    },
    {
      kriterium: "Differenzierung",
      text: "Es gibt keine Schwierigkeitsgrade und keine gestuften Hilfen.",
    },
    {
      kriterium: "Selbstständiges Lernen",
      text: "Die Lösungen stehen direkt unter den Aufgaben.",
    },
    {
      kriterium: "Lernzielorientierung",
      text: "Ein Ergebnis von 240.002 € für 300 Pakete ist offensichtlich unrealistisch – eine Plausibilitätsprüfung fehlt.",
    },
  ],
};

export const CHECKLISTE = [
  { id: "c1", kriterium: "Fachliche Richtigkeit", frage: "Sind alle Informationen, Berechnungen und Lösungen korrekt?" },
  { id: "c2", kriterium: "Lernzielorientierung", frage: "Unterstützen die Aufgaben das angestrebte Lernziel?" },
  { id: "c3", kriterium: "Sprachliche Verständlichkeit", frage: "Sind Aufgabenstellungen und Fachbegriffe verständlich?" },
  { id: "c4", kriterium: "Differenzierung", frage: "Werden unterschiedliche Lernvoraussetzungen berücksichtigt?" },
  { id: "c5", kriterium: "Bildungsgerechtigkeit", frage: "Können Lernende mit unterschiedlichen Voraussetzungen sinnvoll mit dem Material arbeiten?" },
  { id: "c6", kriterium: "Selbstständiges Lernen", frage: "Fördern die Aufgaben eigenständiges Denken?" },
  { id: "c7", kriterium: "Beruflicher Bezug", frage: "Ist das Material für den beruflichen Unterricht geeignet?" },
];

export const VERANTWORTUNGSFRAGE = "Welche Verantwortung trägt die Lehrkraft, wenn sie KI-generierte Unterrichtsmaterialien verwendet?";

export const VERANTWORTUNGS_IMPULS =
  "KI kann bei der Materialerstellung unterstützen, die fachliche und didaktische Verantwortung bleibt aber bei der Lehrkraft. Sie prüft Richtigkeit, Passung zur Lerngruppe und Fairness – und kennzeichnet, dass das Material KI-gestützt erstellt wurde.";
