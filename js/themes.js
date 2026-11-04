// ---------------------------------------------------------------
// Corporate-Design-Vorlagen
// Jede Vorlage beschreibt Farben, Schrift und Logo eines (fiktiven)
// Unternehmens. Ein neues Design = ein neuer Eintrag in dieser Liste.
// ---------------------------------------------------------------

const THEMES = [
  {
    // Helles Layout mit großem Logo: gedacht für echte Firmenlogos
    id: "premium-light",
    name: "Premium Light (mit Logo)",
    layout: "light",
    font: "'Barlow', 'Helvetica Neue', Arial, sans-serif",
    colors: {
      primary: "#16171A",
      accent: "#1C69D4",
      accentText: "#1C69D4",
      bg: "#FFFFFF",
      surface: "#F3F5F8",
      text: "#16171A",
      mutedText: "#5C6370",
      line: "#DADDE2",
      warnBg: "#FFF1DC",
      warnText: "#7A4300",
      tipBg: "#E7F0FC",
      tipText: "#0F4A99"
    },
    logo: `<svg viewBox="0 0 250 40" xmlns="http://www.w3.org/2000/svg" aria-label="Ihr Logo"><rect x="1" y="1" width="248" height="38" rx="4" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="6 5" opacity=".5"/><text x="125" y="26" text-anchor="middle" font-family="Barlow, Arial, sans-serif" font-size="16" font-weight="600" fill="currentColor" opacity=".6" letter-spacing="2">IHR LOGO</text></svg>`
  },
];

// ---------------------------------------------------------------
// Eigenes Design (über den Design-Editor angelegt)
// Wird nur im Browser des Nutzers gespeichert, nie auf GitHub.
// ---------------------------------------------------------------

const CUSTOM_THEME_ID = "eigenes-design";
const CUSTOM_THEME_KEY = "sb.customTheme";

function loadCustomThemeConfig() {
  try { return JSON.parse(localStorage.getItem(CUSTOM_THEME_KEY)); } catch (e) { return null; }
}

function saveCustomThemeConfig(config) {
  try { localStorage.setItem(CUSTOM_THEME_KEY, JSON.stringify(config)); return true; }
  catch (e) { return false; } // z. B. Logo zu groß für den Browser-Speicher
}

function removeCustomThemeConfig() {
  try { localStorage.removeItem(CUSTOM_THEME_KEY); } catch (e) { /* ignorieren */ }
}

// Kontrast zweier Farben nach WCAG (für lesbare Textfarben)
function contrastRatio(hexA, hexB) {
  const lum = hex => {
    const rgb = hex.replace("#", "").match(/.{2}/g).map(h => parseInt(h, 16) / 255)
      .map(v => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
  };
  const [a, b] = [lum(hexA), lum(hexB)].sort((x, y) => y - x);
  return (a + 0.05) / (b + 0.05);
}

function buildCustomTheme(config) {
  const name = config.name || "Eigenes Design";
  const logo = config.logo
    ? `<img src="${config.logo}" alt="${escapeHtml(name)}" class="${config.logoWhite ? "logo-invert" : ""}">`
    : `<svg viewBox="0 0 250 40" xmlns="http://www.w3.org/2000/svg"><text x="0" y="29" font-family="Barlow, Arial, sans-serif" font-size="24" font-weight="700" fill="currentColor">${escapeHtml(name)}</text></svg>`;

  return {
    id: CUSTOM_THEME_ID,
    name: config.name ? `${config.name} (eigenes Design)` : "Eigenes Design",
    layout: config.layout === "dark" ? "dark" : "light",
    headerDark: config.layout === "light-dark",
    font: config.font || THEMES[0].font,
    colors: {
      ...THEMES[0].colors,
      primary: config.primary,
      accent: config.accent,
      // Akzent nur als Textfarbe nutzen, wenn er auf Weiß gut lesbar ist
      accentText: contrastRatio(config.accent, "#FFFFFF") >= 4.5 ? config.accent : config.primary,
      tipText: config.primary
    },
    logo
  };
}

function allThemes() {
  const config = loadCustomThemeConfig();
  return config ? [...THEMES, buildCustomTheme(config)] : THEMES;
}

function getTheme(id) {
  return allThemes().find(t => t.id === id) || THEMES[0];
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
