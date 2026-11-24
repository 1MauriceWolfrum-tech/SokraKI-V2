import "server-only";
import type { KiAnfrage } from "@/lib/ki/client";

// Zugang über OpenRouter (https://openrouter.ai): ein Schlüssel für viele Modelle, abgerechnet über Guthaben.
// Der Schlüssel steht nur in .env.local, wird nur hier auf dem Server gelesen und nur an OpenRouter gesendet.
// Datenschutz: Es kommen nur Anbieter zum Zug, die Anfragen nicht speichern (ZDR) und nicht zum Training nutzen.

const MODELL = process.env.OPENROUTER_MODELL || "anthropic/claude-haiku-5.5";
const EFFORT = process.env.KI_EFFORT || "low";
export const OPENROUTER_MODELL = MODELL;

// Der Schlüssel darf nur an OpenRouter gehen. Eine lokale Testadresse ist nur in der Entwicklung erlaubt.
const ERLAUBTE_ADRESSEN = ["https://openrouter.ai/api/v1", "https://eu.openrouter.ai/api/v1", "https://us.openrouter.ai/api/v1"];
const LOKALE_TESTADRESSE = /^http:\/\/(localhost|127\.0\.0\.1):\d{1,5}\/api\/v1$/;

// Kostenbremse: Modelle oberhalb dieser Preise ($ je 1 Mio. Tokens) lehnt OpenRouter ab – etwa nach einem Tippfehler
// in OPENROUTER_MODELL. Claude Haiku 5.5 kostet 0,10 $ / 0,50 $.
const MAX_PREIS = { prompt: 2, completion: 10 };

export class OpenRouterFehler extends Error {
  status?: number;
  private eigenerHinweis?: string;

  constructor(nachricht: string, status?: number, hinweis?: string) {
    super(nachricht);
    this.status = status;
    this.eigenerHinweis = hinweis;
  }

  get hinweis(): string {
    if (this.eigenerHinweis) return this.eigenerHinweis;
    switch (this.status) {
      case 401:
        return "OpenRouter-Zugang abgelehnt – prüfe OPENROUTER_API_KEY.";
      case 402:
        return "Das OpenRouter-Guthaben ist aufgebraucht.";
      case 403:
        return "OpenRouter hat die Anfrage abgelehnt.";
      case 404:
        return "Kein passender KI-Anbieter gefunden – prüfe OPENROUTER_MODELL.";
      case 408:
        return "Die KI hat zu lange gebraucht.";
      case 429:
        return "KI gerade ausgelastet.";
      case 502:
      case 503:
        return "Der KI-Anbieter ist gerade nicht erreichbar.";
      default:
        return this.status ? `KI-Fehler ${this.status}.` : "KI hat die Antwort abgebrochen.";
    }
  }
}

function basisAdresse(): string {
  const adresse = (process.env.OPENROUTER_BASE_URL || ERLAUBTE_ADRESSEN[0]).trim().replace(/\/+$/, "");
  const lokalErlaubt = process.env.NODE_ENV !== "production" && LOKALE_TESTADRESSE.test(adresse);
  if (ERLAUBTE_ADRESSEN.includes(adresse) || lokalErlaubt) return adresse;
  throw new OpenRouterFehler("Unzulässige OPENROUTER_BASE_URL.", undefined, "OPENROUTER_BASE_URL ist keine erlaubte OpenRouter-Adresse.");
}

type Antwort = {
  model?: string;
  choices?: { message?: { content?: string | null }; finish_reason?: string | null }[];
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    completion_tokens_details?: { reasoning_tokens?: number };
    cost?: number;
  };
  error?: { code?: number; message?: string };
};

// Verbrauch ins Server-Protokoll – ohne Inhalte, nur Zahlen.
function protokolliere(daten: Antwort) {
  const u = daten.usage;
  if (!u) return;
  const denken = u.completion_tokens_details?.reasoning_tokens;
  const kosten = typeof u.cost === "number" ? `, ${u.cost.toFixed(5)} $` : "";
  console.info(
    `[KI] ${daten.model ?? MODELL}: ${u.prompt_tokens ?? "?"} Tokens rein, ${u.completion_tokens ?? "?"} raus` +
      `${denken ? ` (davon ${denken} Denken)` : ""}${kosten}`,
  );
}

export async function frageOpenRouter({ system, nachrichten, anweisung, schema, maxTokens = 8000 }: KiAnfrage): Promise<string> {
  const schluessel = process.env.OPENROUTER_API_KEY?.trim();
  if (!schluessel) {
    throw new OpenRouterFehler("OPENROUTER_API_KEY fehlt.", undefined, "OPENROUTER_API_KEY fehlt in .env.local.");
  }
  const adresse = basisAdresse();

  // Systemnachrichten mitten im Gespräch versteht nicht jedes Modell gleich. Die Anweisung für genau diese
  // Antwort steht deshalb am Ende des Systemprompts.
  const systemText = anweisung
    ? `${system}\n\n<Anweisung_fuer_diese_Antwort>\n${anweisung}\n</Anweisung_fuer_diese_Antwort>`
    : system;

  const res = await fetch(`${adresse}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${schluessel}`,
      "Content-Type": "application/json",
      "X-OpenRouter-Title": "SokraKI",
    },
    body: JSON.stringify({
      model: MODELL,
      messages: [{ role: "system", content: systemText }, ...nachrichten],
      max_tokens: maxTokens,
      reasoning: { effort: EFFORT },
      ...(schema && { response_format: { type: "json_schema", json_schema: { name: "antwort", strict: true, schema } } }),
      // Nur Anbieter ohne Datenspeicherung, die alle Parameter (z. B. das JSON-Schema) unterstützen, bis zum Höchstpreis.
      provider: { zdr: true, data_collection: "deny", require_parameters: true, max_price: MAX_PREIS },
    }),
    // Keine Weiterleitungen: Der Schlüssel soll nie bei einer anderen Adresse landen.
    redirect: "error",
    cache: "no-store",
    signal: AbortSignal.timeout(90_000),
  });

  const daten = (await res.json().catch(() => ({}))) as Antwort;
  if (!res.ok || daten.error) {
    throw new OpenRouterFehler(daten.error?.message ?? `HTTP ${res.status}`, daten.error?.code ?? res.status);
  }
  protokolliere(daten);
  const wahl = daten.choices?.[0];
  const text = wahl?.message?.content?.trim();
  if (wahl?.finish_reason !== "stop" || !text) {
    throw new OpenRouterFehler(`Antwort abgebrochen: ${wahl?.finish_reason ?? "leer"}`);
  }
  return text;
}
