// ---------------------------------------------------------------
// Export: erzeugt eine einzelne, eigenständige HTML-Datei mit allen
// Folien. Diese Datei funktioniert ohne den Builder, z. B. auf einem
// Tablet am Arbeitsplatz oder als Anhang per E-Mail.
// ---------------------------------------------------------------

const VIEWER_CSS = `
html,body{margin:0;height:100%;background:#0E1116;overflow:hidden}
.stage{position:fixed;inset:0 0 80px 0;display:flex;align-items:center;justify-content:center}
.holder{width:1280px;height:720px;transform-origin:center center}
.holder .slide{display:none}
.holder .slide.active{display:flex}
.nav{position:fixed;bottom:16px;left:50%;transform:translateX(-50%);display:flex;gap:8px;font-family:system-ui,sans-serif}
.nav button{min-width:48px;height:48px;border-radius:24px;border:0;background:rgba(255,255,255,.14);color:#fff;font-size:20px;cursor:pointer;padding:0 18px}
.nav button:hover{background:rgba(255,255,255,.26)}
@media print{
  @page{size:1280px 720px;margin:0}
  html,body{background:#fff;overflow:visible;height:auto}
  .stage{position:static;display:block}
  .holder{transform:none!important;width:auto;height:auto}
  .holder .slide{display:flex!important;break-after:page}
  .nav{display:none}
}`;

const VIEWER_JS = `
(function(){
  var slides=[].slice.call(document.querySelectorAll('.holder .slide'));
  var holder=document.querySelector('.holder');
  var i=0;
  function show(n){i=Math.max(0,Math.min(slides.length-1,n));slides.forEach(function(s,k){s.classList.toggle('active',k===i)});}
  function fit(){var s=Math.min(window.innerWidth/1280,(window.innerHeight-80)/720);holder.style.transform='scale('+s+')';}
  document.getElementById('prev').onclick=function(){show(i-1)};
  document.getElementById('next').onclick=function(){show(i+1)};
  document.addEventListener('keydown',function(e){if(e.key==='ArrowRight'||e.key===' ')show(i+1);if(e.key==='ArrowLeft')show(i-1);});
  document.addEventListener('click',function(e){var b=e.target.closest('.q-opt');if(!b)return;var box=b.closest('.q-opts');box.querySelectorAll('.q-opt').forEach(function(o){if(o.dataset.correct==='true')o.classList.add('is-correct');});if(b.dataset.correct!=='true')b.classList.add('is-wrong');});
  window.addEventListener('resize',fit);fit();show(0);
})();`;

function buildStandaloneHtml(deckHtml, title) {
  const safeTitle = escapeHtml(title || "Schulung");
  return `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${safeTitle}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>${SLIDE_CSS}${VIEWER_CSS}</style>
</head>
<body>
<div class="stage"><div class="holder">${deckHtml.join("\n")}</div></div>
<div class="nav"><button id="prev" aria-label="Vorherige Folie">&#8592;</button><button id="next" aria-label="Nächste Folie">&#8594;</button></div>
<script>${VIEWER_JS}<\/script>
</body>
</html>`;
}

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function slugify(text) {
  return (text || "schulung").toLowerCase()
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "schulung";
}
