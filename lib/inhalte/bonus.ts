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

// Sokratische Planung (wie in Prototyp 1): Der Coach fragt, die Lehrkraft entscheidet.
// Aus den Antworten entsteht ein strukturierter Prompt mit vorgegebenem Denkweg (Chain of Thought).
export type PlanAntwort = { wahl: number[]; eigen: string };

export const PLANUNG: { id: string; frage: string; bausteine: Record<ThemaId, string[]> | string[] }[] = [
  {
    id: "ziel",
    frage: "Was sollen die Lernenden nach dem Arbeitsblatt können, was sie vorher noch nicht konnten?",
    bausteine: {
      bwl: [
        "den Bezugspreis zweier Angebote mit Rabatt, Skonto und Bezugskosten berechnen",
        "eine begründete Lieferantenentscheidung auch mit nicht-monetären Kriterien treffen",
        "die Fachbegriffe Rabatt, Skonto und Bezugskosten in eigenen Worten erklären",
      ],
      mathe: [
        "eine lineare Kostenfunktion aus Fixkosten und variablen Kosten aufstellen",
        "Steigung und y-Achsenabschnitt im Sachzusammenhang deuten",
        "die Gewinnschwelle berechnen und das Ergebnis auf Plausibilität prüfen",
      ],
    },
  },
  {
    id: "gruppe",
    frage: "Du kennst deine Klasse: Welche Unterschiede muss das Arbeitsblatt auffangen?",
    bausteine: [
      "einige haben Schwierigkeiten mit Fachsprache oder lernen Deutsch als Zweitsprache",
      "das mathematische Vorwissen ist sehr unterschiedlich",
      "nicht alle haben zu Hause ein eigenes Gerät oder einen Drucker",
      "leistungsstarke Lernende brauchen eine zusätzliche Herausforderung",
    ],
  },
  {
    id: "hilfen",
    frage: "Wie sollen die Lernenden Hilfe bekommen, ohne dass ihnen das Denken abgenommen wird?",
    bausteine: [
      "gestufte Hilfekarten mit Leitfragen statt fertiger Lösungswege",
      "ein Wortspeicher, der Fachbegriffe in einfacher Sprache erklärt",
      "Aufgaben in drei Niveaustufen: Basis, Standard, Erweiterung",
      "Lösungen nur getrennt zur Selbstkontrolle nach der Bearbeitung",
    ],
  },
  {
    id: "pruefung",
    frage: "Angenommen, die KI liefert dir gleich einen Entwurf: Woran prüfst du, ob er fachlich richtig und fair ist?",
    bausteine: [
      "alle Rechnungen selbst nachrechnen und Ergebnisse auf Plausibilität prüfen",
      "auf Rollenklischees und einseitige Beispiele achten",
      "prüfen, ob das Blatt auch ohne Gerät bearbeitbar ist",
      "Sprachniveau und Umfang der Aufgaben prüfen",
    ],
  },
];

export function planBausteine(i: number, thema: ThemaId): string[] {
  const b = PLANUNG[i].bausteine;
  return Array.isArray(b) ? b : b[thema];
}

export function planText(i: number, thema: ThemaId, a: PlanAntwort | undefined): string {
  if (!a) return "";
  const teile = a.wahl.map((j) => planBausteine(i, thema)[j]).filter(Boolean);
  if (a.eigen.trim()) teile.push(a.eigen.trim());
  return teile.join("; ");
}

export function planBeantwortet(a: PlanAntwort | undefined): boolean {
  return Boolean(a && (a.wahl.length > 0 || a.eigen.trim().length >= 10));
}

// Arbeitsblatt-Prompt mit Rolle, Kontext, Chain of Thought, Format und Regeln.
export function arbeitsblattPrompt(thema: ThemaId, antworten: (PlanAntwort | undefined)[]): string {
  const t = THEMEN[thema];
  const [ziel, gruppe, hilfen, pruefung] = antworten.map((a, i) => planText(i, thema, a));
  return `Rolle: Du bist eine erfahrene Lehrkraft an einer beruflichen Schule und erstellst Unterrichtsmaterial.

Auftrag: Erstelle ein Arbeitsblatt zum Thema „${t.titel.replace(/^.*?: /, "")}“ für ${t.zielgruppe}.
Lernziel: Die Lernenden sollen ${ziel || "das Thema sicher anwenden können"}.
Lerngruppe: ${gruppe || "heterogene Klasse"}.
Gewünschte Hilfen: ${hilfen || "gestufte Hilfen"}.

Gehe Schritt für Schritt vor:
1. Formuliere das Lernziel in einem Satz für die Lernenden.
2. Entwickle eine realistische berufliche Lernsituation ohne Rollenklischees.
3. Erstelle Aufgaben in drei Niveaustufen (Basis, Standard, Erweiterung).
4. Ergänze die gewünschten Hilfen so, dass sie zum Denken anregen und keine Lösung verraten.
5. Rechne alle Ergebnisse noch einmal nach und korrigiere Fehler.

Format: reiner Text mit klaren Überschriften. Lösungen nur getrennt am Ende unter „Lösungen für die Lehrkraft“.
Regeln: keine echten Personen, Fachbegriffe erklären, alle Aufgaben auch ohne Gerät bearbeitbar.
Ich prüfe den Entwurf anschließend so: ${pruefung || "fachliche Richtigkeit und Fairness"}.`;
}

// Sokratischer Planungs-Prompt für die eigene KI – die KI fragt, statt das Arbeitsblatt zu schreiben.
export function planungsPromptExtern(thema: ThemaId): string {
  const t = THEMEN[thema];
  return `<Rolle>
Agiere als didaktischer Coach für die Unterrichtsplanung an beruflichen Schulen.
</Rolle>

<Situation>
Ich plane ein Arbeitsblatt zum Thema „${t.titel.replace(/^.*?: /, "")}“ für ${t.zielgruppe}. Die Klasse ist heterogen.
</Situation>

<Zielsetzung>
Führe mit mir einen sokratischen Dialog, damit ich das Arbeitsblatt selbst durchdenke: Lernziel, Lernvoraussetzungen, Differenzierung, Hilfen und Fairness. Schreibe kein fertiges Arbeitsblatt und keine Lösungen.
</Zielsetzung>

<Antwortformat>
Beende jede Antwort mit genau einer präzisen Rückfrage. Hake nach, wenn meine Antwort oberflächlich ist.
</Antwortformat>

<Abschluss>
Wenn ich „Planung abschließen“ schreibe, fasse meine Entscheidungen als strukturierten Prompt für das Arbeitsblatt zusammen.
</Abschluss>`;
}

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
