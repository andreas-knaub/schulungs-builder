// ---------------------------------------------------------------
// Folien-Design (1280 x 720 px, 16:9)
// Liegt als Text in JavaScript, damit es sowohl in der App als auch
// im HTML-Export identisch verwendet werden kann.
// ---------------------------------------------------------------

const SLIDE_CSS = `
.slide{width:1280px;height:720px;position:relative;overflow:hidden;background:var(--bg);color:var(--text);font-family:var(--font);display:flex;flex-direction:column;box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.slide *{box-sizing:border-box}
.slide strong{font-weight:700}

/* Kopfbereich */
.s-head{display:flex;align-items:center;gap:26px;padding:52px 72px 0}
.s-badge{flex:none;width:84px;height:84px;border-radius:50%;background:var(--primary);color:#fff;display:flex;align-items:center;justify-content:center;font-size:38px;font-weight:700}
.s-kicker{font-size:16px;letter-spacing:.16em;text-transform:uppercase;color:var(--accent-text);font-weight:700}
.s-title{font-size:46px;line-height:1.08;font-weight:700;margin:6px 0 0}

/* Inhalt */
.s-body{flex:1;display:grid;grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);gap:44px;padding:40px 72px 24px;min-height:0}
.s-body.single{grid-template-columns:minmax(0,1fr)}
.s-col{display:flex;flex-direction:column;gap:20px;min-height:0}
.s-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:18px;font-size:27px;line-height:1.35}
.s-list li{display:flex;gap:18px}
.s-list li::before{content:"";flex:none;width:12px;height:12px;margin-top:13px;background:var(--accent);border-radius:2px}
.s-p{font-size:25px;line-height:1.45;margin:0}
.s-box{border-radius:12px;padding:20px 24px;display:flex;gap:16px;font-size:22px;line-height:1.4;align-items:flex-start}
.s-box svg{flex:none;width:30px;height:30px;margin-top:1px}
.s-box b{display:block;font-size:14px;letter-spacing:.12em;text-transform:uppercase;margin-bottom:4px}
.s-warn{background:var(--warn-bg);color:var(--warn-text)}
.s-tip{background:var(--tip-bg);color:var(--tip-text)}
.s-img{width:100%;height:100%;object-fit:contain;border-radius:12px;background:var(--surface);min-height:0}

/* Fußzeile */
.s-foot{display:flex;align-items:center;justify-content:space-between;gap:24px;padding:0 72px 30px;font-size:15px;color:var(--muted-text)}
.s-foot .s-logo{height:26px;color:var(--primary);display:flex}
.s-foot .s-logo svg{height:100%;width:auto}
.s-logo img{height:100%;width:auto;max-width:260px;object-fit:contain;display:block}
.t-band .logo-invert{filter:brightness(0) invert(1)}
.s-progress{position:absolute;left:0;bottom:0;height:7px;background:var(--accent)}

/* Titelfolie */
.slide.t-title{flex-direction:row}
.t-band{width:40%;background:var(--primary);color:#fff;padding:60px 56px;display:flex;flex-direction:column;justify-content:space-between}
.t-band .s-logo{height:40px;display:flex}
.t-band .s-logo svg{height:100%;width:auto}
.t-label{font-size:18px;letter-spacing:.16em;text-transform:uppercase;font-weight:600;opacity:.85}
.t-steps{font-size:84px;font-weight:700;line-height:1}
.t-steps span{display:block;font-size:20px;font-weight:500;opacity:.85;margin-top:8px}
.t-main{flex:1;padding:72px 72px;display:flex;flex-direction:column;justify-content:center;gap:26px}
.t-main h1{font-size:60px;line-height:1.05;margin:0;font-weight:700}
.t-sub{font-size:26px;line-height:1.4;color:var(--muted-text);margin:0}
.t-meta{display:flex;flex-wrap:wrap;gap:12px;margin-top:8px}
.t-chip{border:1.5px solid var(--line);border-radius:999px;padding:8px 18px;font-size:18px;color:var(--text)}
.t-chip i{font-style:normal;color:var(--muted-text);margin-right:6px}

/* Quiz */
.q-question{font-size:34px;line-height:1.3;font-weight:600;margin:0}
.q-opts{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px;margin-top:8px}
.q-opt{border:2px solid var(--line);border-radius:12px;padding:22px 26px;font-size:24px;line-height:1.3;background:var(--surface);color:var(--text);text-align:left;cursor:pointer;font-family:inherit;display:flex;gap:18px;align-items:center}
.q-opt:hover{border-color:var(--accent)}
.q-letter{flex:none;width:40px;height:40px;border-radius:50%;background:var(--bg);border:2px solid var(--line);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:20px}
.q-opt.is-correct{border-color:#1E8A4C;background:#E3F5EA}
.q-opt.is-correct .q-letter{background:#1E8A4C;border-color:#1E8A4C;color:#fff}
.q-opt.is-wrong{border-color:#C0392B;background:#FBE5E2}
.q-opt.is-wrong .q-letter{background:#C0392B;border-color:#C0392B;color:#fff}

/* Abschlussfolie */
.e-grid{display:grid;grid-template-columns:minmax(0,1fr) 300px;gap:56px;align-items:center;flex:1;padding:40px 72px 24px}
.e-grid.no-qr{grid-template-columns:minmax(0,1fr)}
.e-stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px;margin-top:28px}
.e-stat{background:var(--surface);border-radius:12px;padding:22px 24px}
.e-stat b{display:block;font-size:52px;line-height:1;color:var(--primary)}
.e-stat span{font-size:18px;color:var(--muted-text)}
.e-qr{background:#fff;border:1.5px solid var(--line);border-radius:14px;padding:22px;display:flex;flex-direction:column;align-items:center;gap:12px;font-size:16px;color:var(--muted-text);text-align:center}
.e-qr svg{width:236px;height:236px;display:block}

/* Helles Layout: große Logo-Fläche und Kopfleiste mit Logo */
.layout-light .l-top{order:-1;flex:none;height:100px;display:flex;align-items:center;justify-content:space-between;gap:32px;padding:0 64px;background:var(--bg);border-bottom:4px solid var(--accent)}
.l-logo{height:104px;display:flex;align-items:center;color:var(--primary)}
.l-logo svg,.l-logo img{height:100%;width:auto;max-width:600px;object-fit:contain;display:block}
.layout-light .l-logo img,.tl-logo img{mix-blend-mode:multiply}
.l-meta{text-align:right;font-size:16px;line-height:1.45;color:var(--muted-text)}
.l-meta b{display:block;font-size:18px;color:var(--text)}
.layout-light.head-dark .l-top{background:var(--primary)}
.layout-light.head-dark .l-logo{color:#fff}
.layout-light.head-dark .l-logo img{mix-blend-mode:normal}
.layout-light.head-dark .l-meta{color:rgba(255,255,255,.72)}
.layout-light.head-dark .l-meta b{color:#fff}
.layout-light .s-head{padding-top:40px}
.layout-light .s-head .s-kicker{display:none}
.layout-light .s-badge{background:var(--accent)}
.layout-light .s-body{padding-bottom:40px}
.layout-light .e-grid{padding-bottom:40px}
.slide.t-light{flex-direction:row}
.tl-logo-area{width:45%;flex:none;background:var(--surface);display:flex;align-items:center;justify-content:center;padding:56px}
.tl-logo{height:260px;max-width:100%;display:flex;align-items:center;justify-content:center;color:var(--primary)}
.tl-logo svg,.tl-logo img{height:100%;width:auto;max-width:100%;object-fit:contain;display:block}
.tl-main{flex:1;padding:72px 72px 88px;display:flex;flex-direction:column;justify-content:center;gap:22px}
.tl-main h1{font-size:60px;line-height:1.04;margin:0;font-weight:700;color:var(--text)}
.tl-kpis{display:flex;margin-top:14px;border-top:1px solid var(--line);padding-top:24px}
.tl-kpi{flex:1;padding-right:20px}
.tl-kpi+.tl-kpi{border-left:1px solid var(--line);padding-left:24px}
.tl-kpi b{display:block;font-size:46px;line-height:1;font-weight:700;color:var(--text)}
.tl-kpi span{font-size:17px;color:var(--muted-text)}
.tl-bar{position:absolute;left:0;right:0;bottom:0;height:10px;background:var(--accent)}
/* ===== Design-Update: ruhiger und moderner ===== */
/* Folie: heller Grauton statt reinem Weiß, Titelfolie bleibt weiß */
.layout-light{background:#F4F4F6}
.slide.t-light{background:#FFFFFF}

/* Kopfzeile: weiße Navbar mit Abstand, feiner Schatten statt dicker Linie */
.layout-light .l-top{height:auto;padding:24px 64px;border-bottom:0;background:#FFFFFF;box-shadow:0 1px 3px rgba(16,24,40,.06),0 1px 2px rgba(16,24,40,.04)}
.l-logo{height:52px}

/* Linien unten: nur noch dezent */
.layout-light .s-progress{height:3px}
.tl-bar{height:4px}

/* Schritt-Nummer: abgerundetes Quadrat in zartem Blau */
.layout-light .s-badge{width:64px;height:64px;border-radius:16px;font-size:30px;background:#E8F0FB;color:var(--accent-text)}

/* Aufzählung: mehr Luft, dunkelgrau statt schwarz, runde Punkte */
.s-list{gap:24px;line-height:1.5;color:#3A3F47}
.s-list li::before{width:8px;height:8px;border-radius:50%;margin-top:15px}

/* Hinweis-Karten: weiß, abgerundet, Akzent links, feiner Schatten */
.s-box{background:#FFFFFF;color:#3A3F47;border-radius:12px;border-left:4px solid var(--accent);padding:22px 26px;box-shadow:0 1px 3px rgba(16,24,40,.08),0 6px 16px rgba(16,24,40,.05)}
.s-box b{color:var(--accent-text)}
.s-box svg{color:var(--accent-text)}
.s-warn{border-left-color:#E8A33D}
.s-warn b,.s-warn svg{color:#9A5A0B}

/* Quiz und Abschluss: Karten statt grauer Kästen */
.layout-light .q-opt,.layout-light .e-stat{background:#FFFFFF;border:1px solid #E4E6EA;box-shadow:0 1px 3px rgba(16,24,40,.06)}
`;
