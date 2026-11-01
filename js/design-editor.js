// ---------------------------------------------------------------
// Design-Editor: eigenes Corporate Design anlegen
// (Name, Haupt- und Akzentfarbe, Logo). Alles wird nur im Browser
// gespeichert. Die Vorschau aktualisiert sich live beim Bearbeiten.
// ---------------------------------------------------------------

(function () {
  const MAX_LOGO_BYTES = 1024 * 1024; // 1 MB

  const d = {
    dialog: document.getElementById("design-dialog"),
    form: document.getElementById("design-form"),
    name: document.getElementById("d-name"),
    primary: document.getElementById("d-primary"),
    accent: document.getElementById("d-accent"),
    logo: document.getElementById("d-logo"),
    logoWhite: document.getElementById("d-logo-white"),
    layout: document.getElementById("d-layout"),
    preview: document.getElementById("d-logo-preview"),
    status: document.getElementById("d-status")
  };

  let draft = null;        // Entwurf, der gerade bearbeitet wird
  let backup = null;       // Stand vor dem Öffnen (für "Abbrechen")
  let themeBefore = null;  // vorher gewähltes Design

  function readForm() {
    return {
      name: d.name.value.trim() || "Eigenes Design",
      primary: d.primary.value,
      accent: d.accent.value,
      logo: draft ? draft.logo : null,
      logoWhite: d.logoWhite.checked,
      layout: d.layout.value
    };
  }

  function showLogoPreview() {
    if (!draft || !draft.logo) { d.preview.hidden = true; d.preview.innerHTML = ""; return; }
    const cls = d.logoWhite.checked ? "logo-invert" : "";
    d.preview.hidden = false;
    d.preview.innerHTML = `
      <div style="background:#fff"><img src="${draft.logo}" alt="Logo auf hellem Hintergrund"></div>
      <div class="dark" style="background:${d.primary.value}"><img src="${draft.logo}" class="${cls}" alt="Logo auf dunklem Hintergrund"></div>`;
  }

  // Entwurf speichern und Vorschau sofort aktualisieren
  function applyDraft() {
    draft = readForm();
    if (!saveCustomThemeConfig(draft)) {
      d.status.classList.add("error");
      d.status.textContent = "Das Logo ist zu groß für den Browser-Speicher. Bitte eine kleinere Datei wählen.";
      return;
    }
    d.status.classList.remove("error");
    d.status.textContent = "";
    fillThemeSelect(CUSTOM_THEME_ID);
    showLogoPreview();
    render();
  }

  function open() {
    backup = loadCustomThemeConfig();
    themeBefore = els.themeSelect.value;
    draft = backup ? { ...backup } : null;

    d.name.value = backup ? backup.name : "";
    d.primary.value = backup ? backup.primary : "#16171A";
    d.accent.value = backup ? backup.accent : "#1C69D4";
    d.logoWhite.checked = backup ? Boolean(backup.logoWhite) : false;
    d.layout.value = backup && backup.layout ? backup.layout : "light";
    d.logo.value = "";
    d.status.textContent = "";
    d.status.classList.remove("error");

    applyDraft();
    d.dialog.showModal();
  }

  function cancel() {
    if (backup) saveCustomThemeConfig(backup); else removeCustomThemeConfig();
    fillThemeSelect(themeBefore);
    render();
    d.dialog.close();
  }

  function remove() {
    removeCustomThemeConfig();
    backup = null;
    fillThemeSelect(THEMES[0].id);
    render();
    d.dialog.close();
    showToast("Eigenes Design wurde gelöscht.");
  }

  d.logo.addEventListener("change", () => {
    const file = d.logo.files[0];
    if (!file) return;
    if (file.size > MAX_LOGO_BYTES) {
      d.status.classList.add("error");
      d.status.textContent = "Die Datei ist größer als 1 MB.";
      d.logo.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      draft = { ...readForm(), logo: reader.result }; // Bild als Data-URL
      applyDraft();
    };
    reader.readAsDataURL(file);
  });

  [d.name, d.primary, d.accent, d.logoWhite, d.layout].forEach(el => {
    el.addEventListener("input", applyDraft);
    el.addEventListener("change", applyDraft);
  });

  d.form.addEventListener("submit", e => {
    e.preventDefault();
    applyDraft();
    d.dialog.close();
    showToast("Eigenes Design gespeichert.");
  });
  document.getElementById("d-cancel").addEventListener("click", cancel);
  document.getElementById("d-remove").addEventListener("click", remove);
  d.dialog.addEventListener("cancel", e => { e.preventDefault(); cancel(); }); // Esc-Taste
  document.getElementById("btn-design").addEventListener("click", open);
})();
