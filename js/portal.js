// ---------------------------------------------------------------
// Portal: Startseite, Schulungsinhalte (Bereich → Abteilung →
// Station → Schulungen) und Speichern in die Bibliothek.
// Die Navigation läuft über die Adresse (#/start, #/schulungen/...),
// damit der QR-Code einer Station direkt auf deren Seite zeigen kann.
// ---------------------------------------------------------------

const portal = {
  editorMode: false,        // Ersteller-Ansicht: Entwürfe, Bearbeiten, Löschen
  currentTrainingId: null,  // Schulung, die gerade im Builder bearbeitet wird
  presenting: null,         // { id, lang } während eine Schulung aus der Bibliothek läuft
  deleteArmed: null
};

const p$ = id => document.getElementById(id);
const pv = {
  start: p$("view-start"), library: p$("view-library"), builder: p$("view-builder"),
  toolbar: p$("builder-toolbar"), heroLogo: p$("hero-logo"),
  startDeps: p$("start-deps"), startSearch: p$("start-search"), startForm: p$("start-search-form"),
  crumbs: p$("lib-crumbs"), title: p$("lib-title"), content: p$("lib-content"),
  search: p$("lib-search"), editorMode: p$("lib-editor-mode"), admin: p$("lib-admin"),
  pLang: p$("p-lang"),
  saveDialog: p$("save-dialog"), saveForm: p$("save-form"), saveTitle: p$("save-title"), saveInfo: p$("save-info"),
  sUnit: p$("s-unit"), sUnitNewWrap: p$("s-unit-new-wrap"), sUnitNew: p$("s-unit-new"), sStationWrap: p$("s-station-wrap"),
  sDep: p$("s-dep"), sDepNewWrap: p$("s-dep-new-wrap"), sDepNew: p$("s-dep-new"),
  sStation: p$("s-station"), sStationNewWrap: p$("s-station-new-wrap"),
  sStationCode: p$("s-station-code"), sStationName: p$("s-station-name"),
  sCopyWrap: p$("s-copy-wrap"), sCopy: p$("s-copy"), sMsg: p$("s-status-msg"),
  qrDialog: p$("qr-dialog"), qrTitle: p$("qr-title"), qrBig: p$("qr-big"), qrUrl: p$("qr-url")
};

const SMALL_ICONS = {
  clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>`,
  steps: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01"/></svg>`,
  qr: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h3v3h-3zM20 14v3M14 20h3M20 20h1"/></svg>`
};

// ---------- Hilfsfunktionen ----------

function visibleTrainings() {
  return portal.editorMode ? library.trainings : library.trainings.filter(t => t.status === "freigegeben");
}

function libHref(...ids) {
  return "#/schulungen" + ids.filter(Boolean).map(id => "/" + encodeURIComponent(id)).join("");
}

function stationUrl(depId, unitId, stationId) {
  if (!location.protocol.startsWith("http")) return "";
  const ids = unitId === WHOLE_AREA ? [depId] : [depId, unitId, stationId];
  return `${location.origin}${location.pathname}${libHref(...ids)}`;
}

// "Lackiererei · Decklack · DL-01" für die Karten
function locationLabel(t) {
  const dep = findDepartment(t.department);
  if (!dep) return "";
  const unit = findUnit(dep, t.unit);
  const st = findStation(unit, t.station);
  return [dep.name, unit ? unit.name : "Ganzer Bereich", st && st.id !== "alle" ? st.code : ""].filter(Boolean).join(" · ");
}

function formatDate(iso) {
  try { return new Date(iso).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" }); }
  catch (e) { return ""; }
}

function applyPortalTheme() {
  const theme = getTheme(els.themeSelect.value);
  const style = themeStyle(theme);
  pv.start.setAttribute("style", style);
  pv.library.setAttribute("style", style);
  if (pv.heroLogo) pv.heroLogo.innerHTML = theme.logo;
}

function trainingCard(t, showLocation) {
  const info = trainingInfo(t);
  const loc = locationLabel(t);
  const langs = info.languages.map(l => `<span>${l.toUpperCase()}</span>`).join("");
  const status = t.status === "freigegeben"
    ? (portal.editorMode ? `<span class="badge ok">Freigegeben</span>` : "")
    : `<span class="badge draft">Entwurf</span>`;
  const armed = portal.deleteArmed === t.id;
  return `
    <article class="t-card">
      <div class="t-badges"><span class="badge">${info.type}</span>${status}</div>
      ${showLocation && loc ? `<div class="t-loc">${escapeHtml(loc)}</div>` : ""}
      <h3>${escapeHtml(info.title)}</h3>
      ${info.subtitle ? `<p>${escapeHtml(info.subtitle)}</p>` : ""}
      <div class="t-meta">
        ${info.dauer ? `<span>${SMALL_ICONS.clock}${escapeHtml(info.dauer)}</span>` : ""}
        <span>${SMALL_ICONS.steps}${info.steps} Schritte</span>
        ${info.version ? `<span>Version ${escapeHtml(info.version)}</span>` : ""}
      </div>
      <div class="t-langs" aria-label="Verfügbare Sprachen">${langs}</div>
      <div class="t-actions">
        <button type="button" class="btn btn-start" data-act="start" data-id="${t.id}">Schulung starten</button>
        ${portal.editorMode ? `
          <button type="button" class="btn" data-act="edit" data-id="${t.id}">Bearbeiten</button>
          <button type="button" class="btn ${armed ? "btn-danger" : ""}" data-act="delete" data-id="${t.id}">${armed ? "Wirklich löschen?" : "Löschen"}</button>` : ""}
      </div>
      ${portal.editorMode ? `<div class="t-updated">Geändert am ${formatDate(t.updatedAt)}</div>` : ""}
    </article>`;
}

// ---------- Startseite ----------

function renderStart() {
  applyPortalTheme();
  pv.startSearch.value = "";
  pv.startDeps.innerHTML = library.departments.map(d => `
    <a class="start-dep" href="${libHref(d.id)}">
      <span class="tile-icon">${DEPARTMENT_ICONS[d.icon] || DEPARTMENT_ICONS.standard}</span>
      <b>${escapeHtml(d.name)}</b>
    </a>`).join("");
}

// ---------- Schulungsinhalte ----------

function crumbs(items) {
  pv.crumbs.innerHTML = items.map((it, i) => i < items.length - 1
    ? `<a href="${it.href}">${escapeHtml(it.label)}</a><span aria-hidden="true">›</span>`
    : `<span aria-current="page">${escapeHtml(it.label)}</span>`).join("");
}

const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

function renderLibrary(depId, unitId, stationId) {
  applyPortalTheme();
  pv.admin.hidden = !portal.editorMode;
  const query = pv.search.value.trim().toLowerCase();
  const vis = visibleTrainings();
  const root = { label: "Schulungsinhalte", href: libHref() };

  // Suche über alle Bereiche
  if (query) {
    const hits = vis.filter(t => (t.source + " " + locationLabel(t)).toLowerCase().includes(query));
    crumbs([root, { label: "Suche" }]);
    pv.title.innerHTML = `<div><h1>Suchergebnisse</h1><p>${plural(hits.length, "Schulung", "Schulungen")} zu „${escapeHtml(pv.search.value.trim())}“</p></div>`;
    pv.content.innerHTML = hits.length
      ? `<div class="cards">${hits.map(t => trainingCard(t, true)).join("")}</div>`
      : `<div class="empty-state">Keine passende Schulung gefunden.</div>`;
    return;
  }

  const dep = findDepartment(depId);

  // Ebene 1: Bereiche
  if (!dep) {
    crumbs([root]);
    pv.title.innerHTML = `<div><h1>Bereich wählen</h1><p>Wählen Sie Ihren Bereich, dann Ihre Abteilung und Station.</p></div>`;
    pv.content.innerHTML = `<div class="tiles">${library.departments.map(d => {
      const count = vis.filter(t => t.department === d.id).length;
      return `<a class="tile" href="${libHref(d.id)}">
        <span class="tile-icon">${DEPARTMENT_ICONS[d.icon] || DEPARTMENT_ICONS.standard}</span>
        <b>${escapeHtml(d.name)}</b>
        <span>${plural(d.units.length, "Abteilung", "Abteilungen")} · ${plural(count, "Schulung", "Schulungen")}</span>
      </a>`;
    }).join("")}</div>`;
    return;
  }

  const unit = findUnit(dep, unitId);

  // Ebene 2: Abteilungen eines Bereichs (+ Schulungen für den ganzen Bereich)
  if (!unit) {
    crumbs([root, { label: dep.name }]);
    const icon = DEPARTMENT_ICONS[dep.icon] || DEPARTMENT_ICONS.standard;
    const whole = vis.filter(t => t.department === dep.id && t.unit === WHOLE_AREA)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    const url = stationUrl(dep.id, WHOLE_AREA);
    pv.title.innerHTML = `<div><h1>${escapeHtml(dep.name)}</h1><p>Wählen Sie Ihre Abteilung.</p></div>
      ${url ? `<button type="button" class="btn" id="btn-station-qr">${SMALL_ICONS.qr}QR-Code für ${escapeHtml(dep.name)}</button>` : ""}`;
    pv.content.innerHTML = `<div class="tiles">${dep.units.map(u => {
      const count = vis.filter(t => t.department === dep.id && t.unit === u.id).length;
      const stations = u.stations.filter(s => s.id !== "alle").length;
      return `<a class="tile tile-unit" href="${libHref(dep.id, u.id)}">
        <span class="tile-icon">${icon}</span>
        <b>${escapeHtml(u.name)}</b>
        <span>${plural(stations, "Station", "Stationen")} · ${plural(count, "Schulung", "Schulungen")}</span>
      </a>`;
    }).join("")}</div>
    ${whole.length ? `<h2 class="lib-section">Für den ganzen Bereich ${escapeHtml(dep.name)}</h2>
      <div class="cards">${whole.map(t => trainingCard(t, false)).join("")}</div>` : ""}`;
    bindQr(`QR-Code ${dep.name}`, url);
    return;
  }

  const st = findStation(unit, stationId);

  // Ebene 3: Stationen einer Abteilung
  if (!st) {
    crumbs([root, { label: dep.name, href: libHref(dep.id) }, { label: unit.name }]);
    pv.title.innerHTML = `<div><h1>${escapeHtml(unit.name)}</h1><p>${escapeHtml(dep.name)} · Wählen Sie Ihre Station.</p></div>`;
    pv.content.innerHTML = `<div class="tiles">${unit.stations.map(s => {
      const count = vis.filter(t => t.department === dep.id && t.unit === unit.id && t.station === s.id).length;
      return `<a class="tile tile-station" href="${libHref(dep.id, unit.id, s.id)}">
        <span class="station-code">${escapeHtml(s.code)}</span>
        <b>${escapeHtml(s.name)}</b>
        <span>${plural(count, "Schulung", "Schulungen")}</span>
      </a>`;
    }).join("")}</div>`;
    return;
  }

  // Ebene 4: Schulungen einer Station
  crumbs([root, { label: dep.name, href: libHref(dep.id) }, { label: unit.name, href: libHref(dep.id, unit.id) }, { label: st.code }]);
  const list = vis.filter(t => t.department === dep.id && t.unit === unit.id && t.station === st.id)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  const url = stationUrl(dep.id, unit.id, st.id);
  pv.title.innerHTML = `
    <div><h1>${escapeHtml(st.code)}${st.id !== "alle" ? " · " + escapeHtml(st.name) : ""}</h1><p>${escapeHtml(dep.name)} · ${escapeHtml(unit.name)}${st.id === "alle" ? " · " + escapeHtml(st.name) : ""}</p></div>
    ${url ? `<button type="button" class="btn" id="btn-station-qr">${SMALL_ICONS.qr}QR-Code für diese Station</button>` : ""}`;
  pv.content.innerHTML = list.length
    ? `<div class="cards">${list.map(t => trainingCard(t, false)).join("")}</div>`
    : `<div class="empty-state">Für diese Station gibt es noch keine Schulungen.${portal.editorMode ? ` <a href="#/erstellen">Jetzt eine erstellen</a>` : ""}</div>`;
  bindQr(`QR-Code ${st.code}`, url);
}

function bindQr(title, url) {
  const qrBtn = p$("btn-station-qr");
  if (qrBtn) qrBtn.addEventListener("click", () => {
    pv.qrTitle.textContent = title;
    pv.qrBig.innerHTML = makeQr(url) || `<p class="muted">QR-Code konnte nicht erzeugt werden.</p>`;
    pv.qrUrl.textContent = url;
    pv.qrDialog.showModal();
  });
}

// ---------- Schulung aus der Bibliothek präsentieren ----------

function buildPresentationDeck() {
  const t = findTraining(portal.presenting.id);
  const lang = portal.presenting.lang;
  const source = (lang !== langOfSource(t.source) && t.translations[lang]) || t.source;
  const theme = getTheme(t.themeId || els.themeSelect.value);
  deck = buildDeck(parseTraining(source), theme, stationUrl(t.department, t.unit, t.station));
}

function presentTraining(id) {
  const t = findTraining(id);
  if (!t) return;
  const original = langOfSource(t.source);
  portal.presenting = { id, lang: original };
  const langs = [original, ...Object.keys(t.translations || {}).filter(l => l !== original)];
  pv.pLang.innerHTML = langs.map(code => {
    const l = LANGUAGES.find(x => x.code === code);
    return `<option value="${code}">${l ? l.name : code}</option>`;
  }).join("");
  pv.pLang.hidden = langs.length < 2;
  buildPresentationDeck();
  openPresentation(0);
}

// Wird von closePresentation() in app.js aufgerufen
function onPresentationClosed() {
  if (!portal.presenting) return;
  portal.presenting = null;
  pv.pLang.hidden = true;
  render(); // Vorschau des Builders wiederherstellen
}

pv.pLang.addEventListener("change", () => {
  if (!portal.presenting) return;
  portal.presenting.lang = pv.pLang.value;
  buildPresentationDeck();
  showPresentSlide(presentIndex);
});

// ---------- Schulung im Builder bearbeiten ----------

function editTraining(id) {
  const t = findTraining(id);
  if (!t) return;
  setSource(t.source);
  // Gespeicherte Übersetzungen wieder bereitstellen
  translation.original = t.source;
  translation.originalLang = langOfSource(t.source);
  translation.current = translation.originalLang;
  translation.cache = { ...(t.translations || {}) };
  langSelect.value = translation.current;
  if (t.themeId && allThemes().some(th => th.id === t.themeId)) {
    els.themeSelect.value = t.themeId;
    store.set(STORAGE.theme, t.themeId);
    render();
  }
  portal.currentTrainingId = id;
  location.hash = "#/erstellen";
  showToast(`„${trainingInfo(t).title}“ wird bearbeitet.`);
}

// ---------- In Bibliothek speichern ----------

function fillUnitSelect(depId, selected) {
  const dep = findDepartment(depId);
  const units = dep ? dep.units : [];
  pv.sUnit.innerHTML = units.map(u => `<option value="${u.id}">${escapeHtml(u.name)}</option>`).join("")
    + `<option value="${WHOLE_AREA}">Ganzer Bereich (alle Abteilungen)</option>`
    + `<option value="__new">＋ Neue Abteilung …</option>`;
  pv.sUnit.value = selected && (selected === WHOLE_AREA || units.some(u => u.id === selected)) ? selected
    : (units[0] ? units[0].id : "__new");
  pv.sUnitNewWrap.hidden = pv.sUnit.value !== "__new";
  pv.sUnitNew.value = "";
  fillStationSelect(depId, pv.sUnit.value, store.get("sb.lastStation"));
}

function fillStationSelect(depId, unitId, selected) {
  const unit = findUnit(findDepartment(depId), unitId);
  pv.sStationWrap.hidden = unitId === WHOLE_AREA;
  const stations = unit ? unit.stations : [ALL_STATIONS];
  pv.sStation.innerHTML = stations.map(s =>
    `<option value="${s.id}">${escapeHtml(s.code)}${s.id !== "alle" ? " · " + escapeHtml(s.name) : ""}</option>`).join("")
    + `<option value="__new">＋ Neue Station …</option>`;
  pv.sStation.value = stations.some(s => s.id === selected) ? selected : stations[0].id;
  pv.sStationNewWrap.hidden = true;
}

function openSaveDialog() {
  const editing = portal.currentTrainingId ? findTraining(portal.currentTrainingId) : null;
  const parsed = parseTraining(translation.original !== null ? translation.original : els.editor.value);
  const title = (parsed.slides.find(s => s.type === "title") || {}).title;
  if (!title) { showToast("Bitte zuerst eine Schulung mit Titel (# Titel) erstellen."); return; }

  pv.saveTitle.textContent = editing ? "Änderungen speichern" : "In Bibliothek speichern";
  pv.saveInfo.textContent = `„${title}“ · ${parsed.stepCount} Schritte` +
    (Object.keys(translation.cache).length ? ` · ${Object.keys(translation.cache).length + 1} Sprachen` : "");

  pv.sDep.innerHTML = library.departments.map(d => `<option value="${d.id}">${escapeHtml(d.name)}</option>`).join("")
    + `<option value="__new">＋ Neuer Bereich …</option>`;
  const depId = editing ? editing.department : (store.get("sb.lastDep") || library.departments[0].id);
  pv.sDep.value = findDepartment(depId) ? depId : library.departments[0].id;
  pv.sDepNewWrap.hidden = true;
  pv.sDepNew.value = "";
  fillUnitSelect(pv.sDep.value, editing ? editing.unit : store.get("sb.lastUnit"));
  if (editing) fillStationSelect(pv.sDep.value, pv.sUnit.value, editing.station);
  pv.sStationCode.value = "";
  pv.sStationName.value = "";

  const status = editing ? editing.status : "freigegeben";
  pv.saveForm.querySelectorAll('input[name="s-status"]').forEach(r => { r.checked = r.value === status; });
  pv.sCopyWrap.hidden = !editing;
  pv.sCopy.checked = false;
  pv.sMsg.textContent = "";
  pv.sMsg.classList.remove("error");
  pv.saveDialog.showModal();
}

pv.sDep.addEventListener("change", () => {
  const isNew = pv.sDep.value === "__new";
  pv.sDepNewWrap.hidden = !isNew;
  fillUnitSelect(isNew ? null : pv.sDep.value);
  if (isNew) pv.sDepNew.focus();
});

pv.sUnit.addEventListener("change", () => {
  const isNew = pv.sUnit.value === "__new";
  pv.sUnitNewWrap.hidden = !isNew;
  fillStationSelect(pv.sDep.value, pv.sUnit.value);
  if (isNew) pv.sUnitNew.focus();
});

pv.sStation.addEventListener("change", () => {
  pv.sStationNewWrap.hidden = pv.sStation.value !== "__new";
  if (!pv.sStationNewWrap.hidden) pv.sStationCode.focus();
});

pv.saveForm.addEventListener("submit", e => {
  e.preventDefault();
  const fail = text => { pv.sMsg.classList.add("error"); pv.sMsg.textContent = text; };

  // Bereich (bestehend oder neu)
  let dep = findDepartment(pv.sDep.value);
  if (pv.sDep.value === "__new") {
    const name = pv.sDepNew.value.trim();
    if (!name) return fail("Bitte einen Namen für den neuen Bereich eingeben.");
    if (pv.sUnit.value === "__new" && !pv.sUnitNew.value.trim()) return fail("Bitte einen Namen für die neue Abteilung eingeben.");
    let id = slugId(name);
    while (findDepartment(id)) id += "-2";
    dep = { id, name, icon: "standard", units: [] };
  }

  // Abteilung (bestehend, neu oder ganzer Bereich)
  let unitId = pv.sUnit.value;
  let unit = findUnit(dep, unitId);
  let newUnit = null;
  if (unitId === "__new") {
    const name = pv.sUnitNew.value.trim();
    if (!name) return fail("Bitte einen Namen für die neue Abteilung eingeben.");
    let id = slugId(name);
    while (findUnit(dep, id) || id === WHOLE_AREA) id += "-2";
    unit = newUnit = { id, name, stations: [{ ...ALL_STATIONS }] };
    unitId = id;
  }

  // Station (bestehend oder neu); beim ganzen Bereich immer "alle"
  let stationId = unitId === WHOLE_AREA ? "alle" : pv.sStation.value;
  let newStation = null;
  if (stationId === "__new") {
    const code = pv.sStationCode.value.trim();
    const name = pv.sStationName.value.trim();
    if (!code || !name) return fail("Bitte Kürzel und Bezeichnung der neuen Station eingeben.");
    let id = slugId(code);
    while (findStation(unit, id)) id += "-2";
    newStation = { id, code, name };
    stationId = id;
  }

  // Erst jetzt, wenn alle Eingaben stimmen, Neues anlegen
  if (!findDepartment(dep.id)) library.departments.push(dep);
  if (newUnit) dep.units.push(newUnit);
  if (newStation) unit.stations.splice(Math.max(0, unit.stations.length - 1), 0, newStation); // vor "Alle Stationen"

  const status = pv.saveForm.querySelector('input[name="s-status"]:checked').value;
  const record = {
    id: portal.currentTrainingId && !pv.sCopy.checked ? portal.currentTrainingId : newId("tr"),
    department: dep.id,
    unit: unitId,
    station: stationId,
    status,
    source: translation.original !== null ? translation.original : els.editor.value,
    themeId: els.themeSelect.value,
    translations: { ...translation.cache },
    updatedAt: new Date().toISOString()
  };

  const index = library.trainings.findIndex(t => t.id === record.id);
  if (index >= 0) library.trainings[index] = record; else library.trainings.push(record);
  if (!saveLibrary(library)) return fail("Der Browser-Speicher ist voll. Bitte die Bibliothek exportieren und alte Schulungen löschen.");

  portal.currentTrainingId = record.id;
  store.set("sb.lastDep", dep.id);
  store.set("sb.lastUnit", unitId);
  store.set("sb.lastStation", stationId);
  pv.saveDialog.close();
  showToast(`Gespeichert in ${locationLabel(record)}${status === "entwurf" ? " (Entwurf)" : ""}.`);
});

p$("s-cancel").addEventListener("click", () => pv.saveDialog.close());
p$("btn-save-lib").addEventListener("click", openSaveDialog);

// Neuer Inhalt im Builder = neue Schulung (nicht mehr die bearbeitete)
["btn-sample", "btn-sample-sw", "btn-clear", "ai-run"].forEach(id =>
  p$(id).addEventListener("click", () => { portal.currentTrainingId = null; }));

// ---------- Aktionen auf den Karten ----------

function handleCardAction(e) {
  const btn = e.target.closest("[data-act]");
  if (!btn) return;
  const id = btn.dataset.id;
  if (btn.dataset.act === "start") presentTraining(id);
  if (btn.dataset.act === "edit") editTraining(id);
  if (btn.dataset.act === "delete") {
    if (portal.deleteArmed !== id) {
      portal.deleteArmed = id; // erster Klick: nachfragen
      route();
      setTimeout(() => { if (portal.deleteArmed === id) { portal.deleteArmed = null; route(); } }, 4000);
      return;
    }
    library.trainings = library.trainings.filter(t => t.id !== id);
    portal.deleteArmed = null;
    saveLibrary(library);
    showToast("Schulung gelöscht.");
    route();
  }
}
pv.content.addEventListener("click", handleCardAction);

// ---------- Export / Import der Bibliothek ----------

p$("lib-export").addEventListener("click", () => {
  downloadFile("schulungsbibliothek.json", JSON.stringify(library, null, 2), "application/json");
  showToast("Bibliothek wurde exportiert.");
});

p$("lib-import").addEventListener("click", () => p$("lib-import-file").click());
p$("lib-import-file").addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      let data = JSON.parse(reader.result);
      if (!Array.isArray(data.departments) || !Array.isArray(data.trainings)) throw new Error();
      // Alte Exporte (ohne Abteilungen) werden in die neue Struktur übernommen
      if (isOldLibrary(data)) data = upgradeLibrary(data, { version: 2, departments: JSON.parse(JSON.stringify(library.departments)), trainings: [] });
      // Zusammenführen: gleiche IDs werden aktualisiert, neue ergänzt
      data.departments.forEach(d => {
        const existing = findDepartment(d.id);
        if (!existing) { library.departments.push(d); return; }
        d.units.forEach(u => {
          const eu = findUnit(existing, u.id);
          if (!eu) { existing.units.push(u); return; }
          u.stations.forEach(s => { if (!findStation(eu, s.id)) eu.stations.splice(eu.stations.length - 1, 0, s); });
        });
      });
      data.trainings.forEach(t => {
        const i = library.trainings.findIndex(x => x.id === t.id);
        if (i >= 0) library.trainings[i] = t; else library.trainings.push(t);
      });
      saveLibrary(library);
      showToast(`${data.trainings.length} Schulungen importiert.`);
      route();
    } catch (err) {
      showToast("Die Datei ist keine gültige Schulungsbibliothek.");
    }
    e.target.value = "";
  };
  reader.readAsText(file);
});

// ---------- Navigation ----------

function route() {
  const parts = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean).map(decodeURIComponent);
  const view = ["start", "schulungen", "erstellen"].includes(parts[0]) ? parts[0] : "start";

  pv.start.hidden = view !== "start";
  pv.library.hidden = view !== "schulungen";
  pv.builder.hidden = view !== "erstellen";
  pv.toolbar.hidden = view !== "erstellen";
  document.querySelectorAll(".mainnav a").forEach(a => a.classList.toggle("active", a.dataset.nav === view));

  if (view === "start") renderStart();
  if (view === "schulungen") renderLibrary(parts[1], parts[2], parts[3]);
  if (view === "erstellen") requestAnimationFrame(fitPreview);
}

(function initPortal() {
  try { portal.editorMode = localStorage.getItem("sb.editorMode") === "1"; } catch (e) { /* ignorieren */ }
  pv.editorMode.checked = portal.editorMode;
  pv.editorMode.addEventListener("change", () => {
    portal.editorMode = pv.editorMode.checked;
    try { localStorage.setItem("sb.editorMode", portal.editorMode ? "1" : "0"); } catch (e) { /* ignorieren */ }
    route();
  });
  pv.search.addEventListener("input", () => route());
  // Suche auf der Startseite: Begriff übernehmen und Suchergebnisse zeigen
  pv.startForm.addEventListener("submit", e => {
    e.preventDefault();
    const q = pv.startSearch.value.trim();
    if (!q) { pv.startSearch.focus(); return; }
    pv.search.value = q;
    location.hash = "#/schulungen";
  });
  els.themeSelect.addEventListener("change", applyPortalTheme);
  window.addEventListener("hashchange", route);
  if (!location.hash) history.replaceState(null, "", "#/start");
  route();
})();
