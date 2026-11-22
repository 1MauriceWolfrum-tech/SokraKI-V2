import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { OpenRouterFehler, frageOpenRouter } from "@/lib/ki/openrouter";
import type { KiModus } from "@/lib/typen";

// Gemeinsamer Zugang zur KI. Zugangsdaten kommen aus der Umgebung und verlassen nie den Server –
// "server-only" bricht den Build ab, falls diese Datei je in Browser-Code importiert wird.
// KI_MODUS=openrouter → über OpenRouter, KI_MODUS=claude → Claude API direkt, sonst Leitfaden ohne KI.

export const KI_MODUS: KiModus =
  process.env.KI_MODUS === "openrouter" ? "openrouter" : process.env.KI_MODUS === "claude" ? "claude" : "skript";
const MODELL = process.env.KI_MODELL || "claude-opus-5-5";
const EFFORT = (process.env.KI_EFFORT || "low") as "low" | "medium" | "high";

export type KiNachricht = { role: "user" | "assistant"; content: string };

export type KiAnfrage = {
  system: string;
  nachrichten: KiNachricht[];
  // Anweisung für genau diese Antwort, z. B. die aktuelle Gesprächsphase.
  anweisung?: string;
  // JSON-Schema, wenn die Antwort strukturiert sein soll.
  schema?: Record<string, unknown>;
  maxTokens?: number;
};

export class KiNichtVerfuegbar extends Error {}
export class KiFormatFehler extends Error {}
export class KiLimitErreicht extends Error {}

// Kostenbremse: höchstens so viele KI-Aufrufe pro Minute und pro 24 Stunden (zählt ab Serverstart).
// Ein kompletter Kursdurchlauf braucht etwa 11 Aufrufe.
const LIMIT_PRO_MINUTE = Number(process.env.KI_LIMIT_PRO_MINUTE) || 20;
const LIMIT_PRO_TAG = Number(process.env.KI_LIMIT_PRO_TAG) || 300;
const speicher = globalThis as typeof globalThis & { __sokrakiKiAufrufe?: number[] };
const aufrufe = (speicher.__sokrakiKiAufrufe ??= []);

function kostenbremse() {
  const jetzt = Date.now();
  while (aufrufe.length > 0 && jetzt - aufrufe[0] > 86_400_000) aufrufe.shift();
  const letzteMinute = aufrufe.filter((t) => jetzt - t < 60_000).length;
  if (letzteMinute >= LIMIT_PRO_MINUTE || aufrufe.length >= LIMIT_PRO_TAG) {
    throw new KiLimitErreicht(`KI-Limit erreicht (${letzteMinute}/min, ${aufrufe.length}/Tag).`);
  }
  aufrufe.push(jetzt);
}

export async function frageKi(anfrage: KiAnfrage): Promise<string> {
  kostenbremse();
  return KI_MODUS === "openrouter" ? frageOpenRouter(anfrage) : frageClaude(anfrage);
}

let client: Anthropic | undefined;
function anthropic(): Anthropic {
  client ??= new Anthropic();
  return client;
}

async function frageClaude({ system, nachrichten, anweisung, schema, maxTokens = 16000 }: KiAnfrage): Promise<string> {
  const messages: Anthropic.Beta.BetaMessageParam[] = [
    ...nachrichten,
    // Als Systemnachricht am Ende bleibt der zwischengespeicherte Anfang des Gesprächs unverändert.
    ...(anweisung ? [{ role: "system" as const, content: anweisung }] : []),
  ];
  const response = await anthropic().beta.messages.create({
    model: MODELL,
    max_tokens: maxTokens,
    // Bei einer Ablehnung durch die Sicherheitsfilter beantwortet ein Rückfallmodell dieselbe Anfrage.
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    system: [{ type: "text", text: system, cache_control: { type: "ephemeral" } }],
    messages,
    output_config: { effort: EFFORT, ...(schema && { format: { type: "json_schema", schema } }) },
  });
  if (response.stop_reason === "refusal" || response.stop_reason === "max_tokens") {
    throw new KiNichtVerfuegbar(`Antwort abgebrochen: ${response.stop_reason}`);
  }
  return response.content
    .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === "text")
    .map((b) => b.text)
    .join("")
    .trim();
}

export function fehlerHinweis(fehler: unknown): string {
  if (fehler instanceof OpenRouterFehler) return fehler.hinweis;
  if (fehler instanceof KiLimitErreicht) return "Das KI-Limit dieses Rechners ist erreicht (Kostenbremse).";
  if (fehler instanceof Anthropic.AuthenticationError) return "KI-Zugang abgelehnt – prüfe die Zugangsdaten.";
  if (fehler instanceof Anthropic.RateLimitError) return "KI gerade ausgelastet.";
  if (fehler instanceof Anthropic.APIError) return `KI-Fehler ${fehler.status ?? ""}`.trim() + ".";
  if (fehler instanceof KiNichtVerfuegbar) return "KI hat die Antwort abgebrochen.";
  if (fehler instanceof KiFormatFehler || fehler instanceof SyntaxError) return "Die KI-Antwort hatte nicht das erwartete Format.";
  if (fehler instanceof DOMException && fehler.name === "TimeoutError") return "Die KI hat zu lange gebraucht.";
  return "KI nicht erreichbar oder nicht eingerichtet – Zugangsdaten prüfen (siehe README).";
}
