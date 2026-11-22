// Startet den Kurs im WLAN (z. B. zum Testen am Handy) – immer ohne KI.
// Werte aus der Umgebung haben Vorrang vor .env.local; der leere Schlüssel sorgt dafür,
// dass der API-Schlüssel in diesem Modus gar nicht erst geladen wird.
import { spawn } from "node:child_process";

const env = { ...process.env, KI_MODUS: "skript", OPENROUTER_API_KEY: "", ANTHROPIC_API_KEY: "" };
console.log("Netzwerk-Modus: Der Kurs läuft ohne KI. Der API-Schlüssel wird nicht geladen.");

const next = spawn("npx", ["next", "dev", "-H", "0.0.0.0"], { stdio: "inherit", env, shell: process.platform === "win32" });
next.on("exit", (code) => process.exit(code ?? 0));
