// Ruhige Pastell-Illustration für die Kursseite: Bildschirm mit Gesprächsblasen und einer Waage
// als Sinnbild für gerechte Bildung. Rein dekorativ.

export function Illustration() {
  return (
    <svg viewBox="0 0 420 320" className="illustration" aria-hidden="true">
      <circle cx="300" cy="120" r="96" fill="#EAF4F9" />
      <circle cx="120" cy="230" r="70" fill="#F6EEF8" />
      <rect x="70" y="70" width="230" height="150" rx="18" fill="#fff" stroke="#3A2A78" strokeWidth="3" />
      <rect x="70" y="70" width="230" height="28" rx="14" fill="#E1C9E8" />
      <circle cx="90" cy="84" r="5" fill="#fff" />
      <circle cx="106" cy="84" r="5" fill="#fff" />
      <rect x="92" y="114" width="120" height="26" rx="13" fill="#C2E3F0" />
      <rect x="150" y="150" width="128" height="26" rx="13" fill="#E4EEC4" />
      <rect x="92" y="186" width="96" height="18" rx="9" fill="#F2F0F8" />
      <g stroke="#3A2A78" strokeWidth="3" strokeLinecap="round" fill="none">
        <path d="M340 150v100M300 250h80M310 170h60" />
        <path d="M310 170l-16 36h32zM370 170l-16 36h32z" />
      </g>
      <circle cx="340" cy="150" r="7" fill="#35823A" />
      <path d="M318 74l10-10M332 64l3 12M346 70l-4 10" stroke="#AFD700" strokeWidth="4" strokeLinecap="round" />
      <rect x="230" y="236" width="70" height="44" rx="14" fill="#fff" stroke="#3A2A78" strokeWidth="3" />
      <path d="M252 280l-6 14 18-14" fill="#fff" stroke="#3A2A78" strokeWidth="3" strokeLinejoin="round" />
      <text x="265" y="266" textAnchor="middle" fontSize="22" fontWeight="700" fill="#3A2A78">
        ?
      </text>
    </svg>
  );
}
