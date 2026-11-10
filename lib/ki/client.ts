import Anthropic from "@anthropic-ai/sdk";

// Gemeinsamer Zugang zur Claude API. Zugangsdaten kommen aus der Umgebung (ANTHROPIC_API_KEY
// oder ein `ant auth login`-Profil) und verlassen nie den Server.

export const KI_MODUS = process.env.KI_MODUS === "claude" ? "claude" : "skript";
const MODELL = process.env.KI_MODELL || "claude-opus-5-5";
const EFFORT = (process.env.KI_EFFORT || "low") as "low" | "medium" | "high";

let client: Anthropic | undefined;
function anthropic(): Anthropic {
  client ??= new Anthropic();
  return client;
}

export class KiNichtVerfuegbar extends Error {}

export async function frageClaude(
  system: string,
  messages: Anthropic.Beta.BetaMessageParam[],
  maxTokens = 16000,
): Promise<string> {
  const response = await anthropic().beta.messages.create({
    model: MODELL,
    max_tokens: maxTokens,
    // Bei einer Ablehnung durch die Sicherheitsfilter beantwortet ein Rückfallmodell dieselbe Anfrage.
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    system: [{ type: "text", text: system, cache_control: { type: "ephemeral" } }],
    messages,
    output_config: { effort: EFFORT },
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
  if (fehler instanceof Anthropic.AuthenticationError) return "KI-Zugang abgelehnt – prüfe die Zugangsdaten.";
  if (fehler instanceof Anthropic.RateLimitError) return "KI gerade ausgelastet.";
  if (fehler instanceof Anthropic.APIError) return `KI-Fehler ${fehler.status ?? ""}`.trim() + ".";
  if (fehler instanceof KiNichtVerfuegbar) return "KI hat die Antwort abgebrochen.";
  return "KI nicht erreichbar oder nicht eingerichtet – Zugangsdaten prüfen (siehe README).";
}
