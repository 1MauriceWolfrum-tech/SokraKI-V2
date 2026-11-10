"use client";

import { BONUS } from "@/components/module/Bonus";
import { MODUL1 } from "@/components/module/Modul1";
import { MODUL2 } from "@/components/module/Modul2";
import { MODUL3 } from "@/components/module/Modul3";
import { MODUL4 } from "@/components/module/Modul4";
import { MODUL5 } from "@/components/module/Modul5";
import type { SchrittDef } from "@/components/module/typen";
import { useFortschritt } from "@/lib/fortschritt";
import { MODULE } from "@/lib/inhalte/kurs";
import type { ModulId, Werte } from "@/lib/typen";

export const SCHRITTE: Record<ModulId, SchrittDef[]> = {
  m1: MODUL1,
  m2: MODUL2,
  m3: MODUL3,
  m4: MODUL4,
  m5: MODUL5,
  bonus: BONUS,
};

const PFLICHT: ModulId[] = ["m1", "m2", "m3", "m4", "m5"];

export function modulFertig(w: Werte, id: ModulId): boolean {
  return SCHRITTE[id].every((s) => s.fertig(w));
}

// Die Module bauen aufeinander auf: Ein Modul öffnet sich, wenn das vorherige abgeschlossen ist.
// Das Bonusmodul öffnet sich nach Modul 5.
export function modulFrei(w: Werte, id: ModulId): boolean {
  if (id === "m1") return true;
  if (id === "bonus") return modulFertig(w, "m5");
  const i = PFLICHT.indexOf(id);
  return modulFertig(w, PFLICHT[i - 1]);
}

export function useKursstand() {
  const { werte, geladen } = useFortschritt();
  const status = MODULE.map((m) => {
    const schritte = SCHRITTE[m.id];
    const erledigt = schritte.filter((s) => s.fertig(werte)).length;
    return {
      ...m,
      erledigt,
      gesamt: schritte.length,
      fertig: erledigt === schritte.length,
      frei: modulFrei(werte, m.id),
    };
  });
  const pflicht = status.filter((s) => !s.optional);
  return {
    geladen,
    status,
    fertigeModule: pflicht.filter((s) => s.fertig).length,
    kursFertig: pflicht.every((s) => s.fertig),
    naechstes: status.find((s) => s.frei && !s.fertig && !s.optional),
  };
}
