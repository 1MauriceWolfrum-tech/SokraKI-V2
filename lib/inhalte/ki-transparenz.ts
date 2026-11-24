// ENTWURFSTEXT – Kennzeichnung der KI im Kurs (Transparenz, vgl. Art. 50 KI-Verordnung der EU).
// Jede Stelle, an der eine KI arbeitet, zeigt vor der Nutzung, was die KI tut und welche Daten dafür gesendet werden.

export type KiStelle = "lernbegleiter" | "entwurf" | "ueberarbeitung";

export const KI_STELLEN: Record<KiStelle, { ort: string; aufgabe: string; versand: string; ohneKi: string }> = {
  lernbegleiter: {
    ort: "Modul 4 · Gespräch mit dem Lernbegleiter",
    aufgabe: "formuliert die Fragen des Lernbegleiters und hakt nach",
    versand: "Gesendet werden deine Antworten im Gespräch und deine Entscheidung aus Modul 3.",
    ohneKi: "Die Fragen kommen dann aus dem Gesprächsleitfaden des Projektteams.",
  },
  entwurf: {
    ort: "Bonus · Arbeitsblatt generieren",
    aufgabe: "erstellt aus deinem Arbeitsauftrag einen Entwurf des Arbeitsblatts",
    versand: "Gesendet wird dein Arbeitsauftrag (Prompt), sobald du auf „Entwurf erzeugen“ klickst.",
    ohneKi: "Du bekommst dann einen vorbereiteten Beispielentwurf.",
  },
  ueberarbeitung: {
    ort: "Bonus · Arbeitsblatt fertigstellen",
    aufgabe: "arbeitet deine Verbesserungsvorschläge in das Arbeitsblatt ein",
    versand: "Gesendet werden das Arbeitsblatt und deine Vorschläge, sobald du auf „einarbeiten lassen“ klickst.",
    ohneKi: "Du setzt deine Vorschläge dann selbst in den Feldern um.",
  },
};

export const KI_DATENSCHUTZ =
  "Die KI-Anbieter speichern die Anfragen nicht und nutzen sie nicht zum Training. Gib trotzdem keine echten Namen oder andere personenbezogenen Daten ein.";

export const KI_GRENZEN = "KI-Antworten können Fehler enthalten – prüfe sie kritisch.";

export const KI_OHNE =
  "Alle anderen Inhalte – Texte, Quizze, Escape Room, Rückmeldungen und Musterlösungen – hat das Projektteam selbst erstellt. Dort arbeitet keine KI.";
