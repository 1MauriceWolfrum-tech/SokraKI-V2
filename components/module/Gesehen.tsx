"use client";

import { useEffect } from "react";
import { useFortschritt } from "@/lib/fortschritt";

// Markiert einen reinen Informationsschritt als gelesen, sobald er angezeigt wird.
export function Gesehen({ schluessel }: { schluessel: string }) {
  const { werte, setze } = useFortschritt();
  const bereits = werte[schluessel] === true;
  useEffect(() => {
    if (!bereits) setze(schluessel, true);
  }, [bereits, schluessel, setze]);
  return null;
}
