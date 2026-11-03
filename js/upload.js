// ---------------------------------------------------------------
// Upload im KI-Dialog: Foto, Scan oder PDF einer bestehenden
// Arbeitsanweisung. Die Datei geht direkt an Gemini, das sie liest.
// ---------------------------------------------------------------

const MAX_UPLOAD_BYTES = 15 * 1024 * 1024; // 15 MB
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/heic", "image/heif", "application/pdf"];
let uploadedFile = null;

function getUploadedFile() { return uploadedFile; }

(function initUpload() {
  const u = {
    drop: document.getElementById("ai-drop"),
    input: document.getElementById("ai-file"),
    pick: document.getElementById("ai-file-pick"),
    empty: document.getElementById("ai-drop-empty"),
    filled: document.getElementById("ai-drop-file"),
    thumb: document.getElementById("ai-thumb"),
    name: document.getElementById("ai-file-name"),
    meta: document.getElementById("ai-file-meta"),
    remove: document.getElementById("ai-file-remove"),
    textLabel: document.getElementById("ai-text-label")
  };

  function formatSize(bytes) {
    return bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;
  }

  function showError(text) {
    els.aiStatus.classList.add("error");
    els.aiStatus.textContent = text;
  }

  function clear() {
    uploadedFile = null;
    u.input.value = "";
    u.empty.hidden = false;
    u.filled.hidden = true;
    u.thumb.innerHTML = "";
    u.textLabel.textContent = "Rohtext";
    els.aiText.placeholder = "z. B.: Erst Handschuhe anziehen. Dann Stecker vom Fensterheber einstecken bis er klickt...";
  }

  function handle(file) {
    if (!file) return;
    const type = file.type || (file.name.toLowerCase().endsWith(".pdf") ? "application/pdf" : "");
    if (!ALLOWED_TYPES.includes(type)) { showError("Bitte ein Foto (JPG, PNG, WEBP, HEIC) oder ein PDF hochladen."); return; }
    if (file.size > MAX_UPLOAD_BYTES) { showError("Die Datei ist größer als 15 MB."); return; }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      uploadedFile = { mimeType: type, base64: dataUrl.split(",")[1], name: file.name, size: file.size };
      els.aiStatus.textContent = "";
      els.aiStatus.classList.remove("error");
      u.empty.hidden = true;
      u.filled.hidden = false;
      u.name.textContent = file.name;
      u.meta.textContent = `${type === "application/pdf" ? "PDF" : "Bild"} · ${formatSize(file.size)}`;
      u.thumb.innerHTML = type === "application/pdf" || type.includes("hei")
        ? `<span class="drop-pdf">${type === "application/pdf" ? "PDF" : "IMG"}</span>`
        : `<img src="${dataUrl}" alt="">`;
      u.textLabel.textContent = "Zusätzliche Hinweise (optional)";
      els.aiText.placeholder = "z. B.: Bitte Station T-04 nennen und eine Quizfrage zum Drehmoment einbauen.";
    };
    reader.readAsDataURL(file);
  }

  u.pick.addEventListener("click", () => u.input.click());
  u.input.addEventListener("change", () => handle(u.input.files[0]));
  u.remove.addEventListener("click", clear);
  ["dragenter", "dragover"].forEach(ev => u.drop.addEventListener(ev, e => { e.preventDefault(); u.drop.classList.add("is-over"); }));
  ["dragleave", "drop"].forEach(ev => u.drop.addEventListener(ev, e => { e.preventDefault(); u.drop.classList.remove("is-over"); }));
  u.drop.addEventListener("drop", e => handle(e.dataTransfer.files[0]));
})();
