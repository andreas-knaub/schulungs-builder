// ---------------------------------------------------------------
// Corporate-Design-Vorlagen
// Jede Vorlage beschreibt Farben, Schrift und Logo eines (fiktiven)
// Unternehmens. Ein neues Design = ein neuer Eintrag in dieser Liste.
// ---------------------------------------------------------------

const THEMES = [
  {
    id: "musterwerk",
    name: "Musterwerk GmbH",
    font: "'Barlow', 'Helvetica Neue', Arial, sans-serif",
    colors: {
      primary: "#0B2545",     // Hauptfarbe (Titelband, Badges)
      accent: "#13A8C9",      // Akzent (Aufzählungspunkte, Fortschritt)
      accentText: "#0B6E85",  // Akzent als lesbare Textfarbe
      bg: "#FFFFFF",
      surface: "#F3F6F9",
      text: "#14202E",
      mutedText: "#5A6878",
      line: "#D5DDE5",
      warnBg: "#FFF1DC",
      warnText: "#7A4300",
      tipBg: "#E3F4F8",
      tipText: "#0B4F60"
    },
    // Logo als SVG, "currentColor" übernimmt die jeweilige Textfarbe
    logo: `<svg viewBox="0 0 250 40" xmlns="http://www.w3.org/2000/svg" aria-label="Musterwerk"><rect x="0" y="4" width="32" height="32" rx="4" fill="none" stroke="currentColor" stroke-width="4"/><path d="M8 28V12l8 9 8-9v16" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/><text x="44" y="29" font-family="Barlow, Arial, sans-serif" font-size="24" font-weight="700" fill="currentColor" letter-spacing="1">MUSTERWERK</text></svg>`
  },
  {
    id: "nordwerk",
    name: "Nordwerk Automotive",
    font: "'IBM Plex Sans', 'Helvetica Neue', Arial, sans-serif",
    colors: {
      primary: "#1F2328",
      accent: "#F26B1D",
      accentText: "#B4460A",
      bg: "#FFFFFF",
      surface: "#F5F4F2",
      text: "#1F2328",
      mutedText: "#5F646B",
      line: "#DCDAD6",
      warnBg: "#FDE8DC",
      warnText: "#8A2E00",
      tipBg: "#EEF0F2",
      tipText: "#2E3440"
    },
    logo: `<svg viewBox="0 0 220 40" xmlns="http://www.w3.org/2000/svg" aria-label="Nordwerk"><path d="M4 36V4l26 32V4" fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round"/><text x="44" y="29" font-family="IBM Plex Sans, Arial, sans-serif" font-size="23" font-weight="600" fill="currentColor">nordwerk</text><text x="150" y="29" font-family="IBM Plex Sans, Arial, sans-serif" font-size="23" font-weight="400" fill="currentColor" opacity=".7">auto</text></svg>`
  },
  {
    id: "gruenlinie",
    name: "Grünlinie Fertigung",
    font: "'Barlow', 'Helvetica Neue', Arial, sans-serif",
    colors: {
      primary: "#145C43",
      accent: "#3DBE8B",
      accentText: "#147350",
      bg: "#FFFFFF",
      surface: "#F2F7F4",
      text: "#15241D",
      mutedText: "#56665E",
      line: "#D4E2DA",
      warnBg: "#FFF0D6",
      warnText: "#744300",
      tipBg: "#E2F3EA",
      tipText: "#114A35"
    },
    logo: `<svg viewBox="0 0 180 40" xmlns="http://www.w3.org/2000/svg" aria-label="Grünlinie"><circle cx="18" cy="20" r="15" fill="none" stroke="currentColor" stroke-width="4"/><path d="M9 24c5-8 13-10 18-10" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><text x="44" y="29" font-family="Barlow, Arial, sans-serif" font-size="24" font-weight="700" fill="currentColor">Grünlinie</text></svg>`
  }
];

function getTheme(id) {
  return THEMES.find(t => t.id === id) || THEMES[0];
}

// Wandelt die Farben einer Vorlage in CSS-Variablen um
function themeStyle(theme) {
  const c = theme.colors;
  return [
    `--primary:${c.primary}`, `--accent:${c.accent}`, `--accent-text:${c.accentText}`,
    `--bg:${c.bg}`, `--surface:${c.surface}`, `--text:${c.text}`,
    `--muted-text:${c.mutedText}`, `--line:${c.line}`,
    `--warn-bg:${c.warnBg}`, `--warn-text:${c.warnText}`,
    `--tip-bg:${c.tipBg}`, `--tip-text:${c.tipText}`,
    `--font:${theme.font}`
  ].join(";");
}
