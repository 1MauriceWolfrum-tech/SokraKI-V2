// ENTWURFSTEXT – Modul 3: Escape Room „Frau Müllers Schultag“ (Idee aus dem Team-Feedback, angelehnt an das
// WiPäd-Modul „Professionelles Handeln im Bildungskontext“). Szenen, Hintergründe, Rätsel und Schlüssel stammen aus
// dem Feedback; die Rückmeldungen zu den falschen Antworten sind Entwürfe und sollten noch überarbeitet werden.
// Offen: ein vierter Raum und kurze KI-Videos zur Auflösung je Raum.

export type RaumNachricht = { von: "person" | "ki" | "notiz"; text: string };

export type Raum = {
  id: string;
  ort: string;
  titel: string;
  thema: string;
  szene: string;
  hintergrund: string;
  prompt?: { titel: string; text: string };
  chats?: { person: string; beschreibung: string; verlauf: RaumNachricht[] }[];
  aufgaben?: { titel: string; text: string }[];
  danach?: string;
  reflexion: string;
  raetsel: {
    frage: string;
    mehrfach?: boolean;
    optionen: { text: string; richtig?: boolean; feedback: string }[];
  };
  schluessel: string;
};

export const ESCAPE_EINLEITUNG =
  "Begleite Frau Müller durch einen Schultag mit KI. In jedem Raum wartet eine Situation, die auf den ersten Blick eindeutig wirkt. Löse das Rätsel, dann bekommst du einen Schlüssel für den nächsten Raum.";

export const RAEUME: Raum[] = [
  {
    id: "raum1",
    ort: "Raum 1 · Fachraum BWL",
    titel: "Der Antwortmaschinen-Raum",
    thema: "Digital Divide, Attributionsfehler",
    szene:
      "Frau Müller betritt den BWL-Fachraum. Auf dem Pult liegen zwei Ausdrucke der Hausaufgabe zum Break-Even-Point, oben steht Lena, darunter, mit Knick in der Ecke, Emre. Der Beamer wirft den Kalkulationsraster der letzten Stunde an die Wand. Als Hausaufgabe durfte die Klasse „eine KI zur Hilfe nehmen“.",
    hintergrund:
      "Lena hat der KI geschrieben: „Stell mir Fragen, aber verrate die Lösung nicht.“ Sie kann ihren Rechenweg im Unterricht erklären. Emre hat nur ein Smartphone mit wenig Datenvolumen. Er tippte „Lösung Break-Even-Point“, übernahm das Ergebnis (richtig!) und konnte in der Stunde nichts dazu sagen. Beide haben dieselbe Zahl abgegeben.",
    reflexion:
      "„Lena denkt mit, Emre schreibt ab. Der ist einfach bequem.“ Kurz darauf zögert sie: „Hat ihm jemand gezeigt, wie man die KI so benutzt wie Lena? Habe ich es überhaupt jemandem gezeigt?“",
    raetsel: {
      frage: "Was ist die wahrscheinlichste Ursache für den Unterschied?",
      optionen: [
        {
          text: "Emre ist weniger motiviert.",
          feedback:
            "Das ist der naheliegende Schluss – und genau der Attributionsfehler: Der Unterschied wird der Person zugeschrieben, obwohl die Bedingungen verschieden sind. Schau noch einmal auf Gerät, Datenvolumen und Anleitung.",
        },
        {
          text: "Lena und Emre unterscheiden sich in der Nutzungskompetenz und den Rahmenbedingungen.",
          richtig: true,
          feedback:
            "Genau. Lena weiß, wie sie die KI als Lernhilfe einsetzt. Emre hat schlechtere Voraussetzungen – und niemand hat ihm gezeigt, wie es anders geht.",
        },
        {
          text: "KI eignet sich nur für gute Schüler.",
          feedback:
            "KI kann allen helfen, wenn alle lernen, sie gezielt zu nutzen. Der Unterschied liegt hier nicht an der Leistung, sondern an Zugang und Anleitung.",
        },
      ],
    },
    schluessel: "Unterschiedliche Nutzung ist oft ein Gerechtigkeitsthema, kein Motivationsthema.",
  },
  {
    id: "raum2",
    ort: "Raum 2 · Fachraum Mathe",
    titel: "Der Hausaufgaben-Raum",
    thema: "Sokratischer Tutor, „Ein Prompt für alle“-Fehler",
    szene:
      "Der Mathe-Raum ist leer, die Stühle stehen schon hochgestellt. Auf dem Whiteboard klebt noch die Prozentrechnung von heute. Frau Müller öffnet auf dem Lehrer-Laptop die Chatverläufe zweier Schüler. Der Bildschirm wirft einen kalten Schein auf die Pultlampe.",
    hintergrund:
      "Frau Müller hat der ganzen Klasse denselben sokratischen Tutor-Prompt gegeben, denn „Fragen statt Lösungen“ ist didaktisch sinnvoll. Die Hausaufgabe: Ein Fahrrad kostet 240 €, es gibt 15 % Rabatt. Wie viel zahlst du?",
    prompt: {
      titel: "Der Prompt von Frau Müller",
      text: "Du bist ein Sokratischer Tutor für Mathematik in Klasse 7. Gib niemals die Lösung. Stelle immer nur Fragen, die mich zum Nachdenken bringen. Wenn meine Antwort falsch ist, stelle eine weitere Frage. Verwende präzise Fachbegriffe wie Grundwert, Prozentwert und Prozentsatz.",
    },
    chats: [
      {
        person: "Jonas",
        beschreibung: "hat einen Laptop, sein Bruder hilft manchmal",
        verlauf: [
          { von: "person", text: "240 minus 15." },
          { von: "ki", text: "Wie bist du darauf gekommen?" },
          { von: "person", text: "Rabatt sind 15, also ziehe ich ab." },
          { von: "ki", text: "Hat der Rabatt hier die Einheit Euro oder Prozent?" },
          { von: "person", text: "Prozent! Also 15 Prozent von 240. Das sind 36, dann 204 €." },
        ],
      },
      {
        person: "Amira",
        beschreibung: "nur Smartphone, Deutsch als Zweitsprache, niemand zu Hause für Mathe",
        verlauf: [
          { von: "person", text: "Ich verstehe die Aufgabe nicht. Fahrrad 240 Euro, 15 Prozent Rabatt." },
          { von: "ki", text: "Was ist in dieser Aufgabe der Grundwert, und wie hängt er mit dem Prozentwert zusammen?" },
          { von: "person", text: "Ich weiß nicht." },
          { von: "ki", text: "Überlege: Welche Größe entspricht 100 %, und welche Größe ist gesucht?" },
          { von: "person", text: "Ich weiß nicht." },
          { von: "ki", text: "Was ist der Grundwert in dieser Aufgabe?" },
          { von: "notiz", text: "Amira antwortet nicht mehr. Im Heft steht nichts." },
        ],
      },
    ],
    reflexion:
      "„Der Prompt war doch gut. Aber für wen eigentlich? Jonas hatte genug Vorwissen, um mit einer Frage weiterzukommen. Amira hat dreimal Fachbegriffe bekommen, die sie nicht kennt, und dieselbe Hürde nochmal. Mein Tutor hat sie nicht begleitet, sondern ausgefragt.“",
    raetsel: {
      frage: "Welche Ergänzung am Prompt hilft Amira am meisten?",
      optionen: [
        {
          text: "„Stelle schwierigere Fragen.“",
          feedback: "Amira scheitert schon an der ersten Frage. Schwierigere Fragen vergrößern die Hürde, statt sie zu verkleinern.",
        },
        {
          text: "„Nutze kurze Sätze und erkläre Fachbegriffe mit einem Beispiel. Wenn ich ‚Weiß nicht‘ schreibe, gehe eine Hinweisstufe weiter, statt die Frage zu wiederholen.“",
          richtig: true,
          feedback:
            "Genau. Einfache Sprache, erklärte Fachbegriffe und gestufte Hinweise holen Amira dort ab, wo sie steht – und sie denkt trotzdem selbst.",
        },
        {
          text: "„Gib nach der ersten Frage die Lösung.“",
          feedback:
            "Dann hätte Amira eine Zahl im Heft, aber nichts verstanden. Gesucht ist Hilfe, die das eigene Denken unterstützt.",
        },
      ],
    },
    schluessel: "Sokratisch heißt nicht „nur fragen“, sondern Hilfe in Stufen.",
  },
  {
    id: "raum3",
    ort: "Raum 3 · Lehrerzimmer",
    titel: "Der Perfekte-KI-Raum",
    thema: "Arbeitsblatt prüfen, Automation Bias",
    szene:
      "Im Lehrerzimmer duftet es nach Kaffee, der Drucker rattert. Frau Müller zieht ein frisch gedrucktes Arbeitsblatt heraus: sauber gegliedert, freundliches Layout, Überschrift „Rabatt und Prozentrechnung, Klasse 7“. Die KI hat es in zehn Sekunden erstellt. In fünf Minuten beginnt der Unterricht.",
    hintergrund: "Das Blatt wirkt professionell. Frau Müller überfliegt drei Aufgaben:",
    aufgaben: [
      { titel: "Aufgabe 1", text: "Ein Fahrrad kostet 240 €, es gibt 15 % Rabatt. Lösung: 240 − 15 = 225 €." },
      {
        titel: "Aufgabe 2",
        text: "Ermitteln Sie unter Berücksichtigung der prozentualen Preisreduktion den resultierenden Verkaufspreis des Artikels.",
      },
      {
        titel: "Aufgabe 3",
        text: "Herr Dr. Weber, Geschäftsführer, kauft einen neuen Firmenwagen. Frau Slavic, Reinigungskraft, kauft ein Waschmittel im Angebot. Berechnen Sie jeweils den Preis.",
      },
    ],
    danach: "Sie denkt: „Sieht gut aus, das passt.“",
    reflexion:
      "„Weil es so sicher und ordentlich aussieht, vertraue ich ihm. Aber habe ich nachgerechnet? Und kann Amira mit ihrem Deutsch Aufgabe 2 überhaupt verstehen? Und warum ist die Geschäftsführung ein Herr Doktor und die Reinigungskraft eine Frau mit nicht-deutschem Nachnamen?“",
    raetsel: {
      frage: "Welche drei Probleme stecken im Blatt?",
      mehrfach: true,
      optionen: [
        {
          text: "Fachfehler in Aufgabe 1: 15 % von 240 € sind 36 €, richtig wären 204 €.",
          richtig: true,
          feedback: "Fachlichkeit: Die KI hat 15 € statt 15 % abgezogen.",
        },
        {
          text: "Aufgabe 2 ist sprachlich zu komplex (Behördendeutsch) und benachteiligt Lernende mit Deutsch als Zweitsprache.",
          richtig: true,
          feedback: "Sprache: Dieselbe Aufgabe geht auch in kurzen, klaren Sätzen.",
        },
        {
          text: "Aufgabe 3 arbeitet mit Stereotypen bei Berufen und Namen.",
          richtig: true,
          feedback: "Beispiele: Rollen und Namen verteilen Status nach Geschlecht und Herkunft.",
        },
        {
          text: "Das Layout ist zu bunt.",
          feedback:
            "Das Layout stört an diesem Blatt am wenigsten – gerade das saubere Aussehen hat Frau Müller vom genauen Prüfen abgehalten.",
        },
        {
          text: "Die Aufgaben sind zu leicht für Klasse 7.",
          feedback: "Der Schwierigkeitsgrad ist hier nicht das Problem. Achte auf Fachlichkeit, Sprache und Beispiele.",
        },
      ],
    },
    schluessel:
      "Professionell aussehen heißt nicht richtig und gerecht sein. Die Lehrkraft prüft Fachlichkeit, Sprache und Beispiele.",
  },
];
