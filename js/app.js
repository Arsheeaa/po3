/* Static GitHub Pages version of the original portfolio.
   Content is loaded from data/site.json so projects/skills/text can be edited
   without touching this file. Animations and visual CSS are kept equivalent
   to the original React implementation. */

(() => {
  const DATA_URL = "data/site.json";
  const ACCENT = "#5cf0a1";
  const MUTED = "#8fa89b";
  const FILL = { solid: 3, working: 2, basic: 1 };

  let data = null;
  let lang = initialLang();
  let activeProject = null;
  let activeIndex = 0;
  let modalImage = 0;
  let menuOpen = false;

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const t = (v) => v ? (typeof v === "object" && ("fa" in v || "en" in v) ? (v[lang] ?? v.en ?? "") : v) : "";
  const pad = (n, len=2) => String(n).padStart(len, "0");

  function initialLang() {
    const saved = localStorage.getItem("lang");
    if (saved === "en" || saved === "fa") return saved;
    return navigator.language?.toLowerCase().startsWith("fa") ? "fa" : "en";
  }

  function setDocumentLang() {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "fa" ? "rtl" : "ltr";
    localStorage.setItem("lang", lang);
    document.title = lang === "fa" ? "ارشیا تقی‌پور — پورتفولیو" : "Arshia Taghipour — Portfolio";
  }

  function arrowIcon(cls="arrow") {
    return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden><path d="M5 12h14M13 6l6 6-6 6"/></svg>`;
  }
  function chevron(cls="") {
    return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden><path d="M9 6l6 6-6 6"/></svg>`;
  }

  function chip() {
    let pins = Array.from({length:7}, (_,i) => {
      const p = 22 + i*9.5;
      return `<g stroke="#9fb3a9" stroke-width="2.2"><line x1="${p}" y1="6" x2="${p}" y2="14"/><line x1="${p}" y1="86" x2="${p}" y2="94"/><line x1="6" y1="${p}" x2="14" y2="${p}"/><line x1="86" y1="${p}" x2="94" y2="${p}"/></g>`;
    }).join("");
    return `<svg viewBox="0 0 100 100" aria-hidden>${pins}
      <rect x="14" y="14" width="72" height="72" rx="6" fill="#141a17" stroke="#2c3a33" stroke-width="1.5"/>
      <rect x="24" y="24" width="52" height="52" rx="3" fill="#0d1210" stroke="#3a4a42" stroke-width="1"/>
      <circle cx="30" cy="30" r="2.2" fill="#5cf0a1" opacity=".9"/>
      <text x="50" y="49" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="9.5" fill="#c9d6cf" font-weight="600">ESP32</text>
      <text x="50" y="61" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="6" fill="#7d9186">WROOM</text>
      <path d="M60 68 h10 v-4 h-8 v-3 h8 v-3 h-8" fill="none" stroke="#5cf0a1" stroke-width="1.2" opacity=".7"/>
    </svg>`;
  }
  function relay() {
    return `<svg viewBox="0 0 120 80" aria-hidden>
      <rect x="4" y="8" width="112" height="64" rx="6" fill="#1a3d8f" stroke="#2d55b8" stroke-width="1.5"/>
      <rect x="12" y="16" width="96" height="48" rx="3" fill="none" stroke="#3b64c4" stroke-width="1" opacity=".6"/>
      <text x="60" y="36" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="10" fill="#dbe7ff" font-weight="600">RELAY</text>
      <text x="60" y="50" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="6.5" fill="#9db4ea">10A 250VAC</text>
      <rect x="20" y="72" width="8" height="6" fill="#c9c9c9"/><rect x="36" y="72" width="8" height="6" fill="#c9c9c9"/><rect x="52" y="72" width="8" height="6" fill="#c9c9c9"/>
      <rect x="84" y="2" width="8" height="6" fill="#c9c9c9"/><rect x="96" y="2" width="8" height="6" fill="#c9c9c9"/>
    </svg>`;
  }
  function capacitor() {
    return `<svg viewBox="0 0 40 80" aria-hidden>
      <line x1="14" y1="62" x2="14" y2="80" stroke="#b9c3be" stroke-width="2"/><line x1="26" y1="62" x2="26" y2="80" stroke="#b9c3be" stroke-width="2"/>
      <rect x="4" y="4" width="32" height="60" rx="5" fill="#1d2a52" stroke="#2f4180" stroke-width="1.5"/>
      <rect x="8" y="8" width="8" height="52" rx="3" fill="#c5cbe0" opacity=".85"/>
      <text x="12" y="40" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="7" fill="#1d2a52" font-weight="700">–</text>
      <text x="26" y="38" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="6" fill="#9fb0e0">470µ</text>
      <ellipse cx="20" cy="6" rx="16" ry="3" fill="#2a3a6d"/>
    </svg>`;
  }
  function resistor() {
    return `<svg viewBox="0 0 120 40" aria-hidden>
      <line x1="0" y1="20" x2="24" y2="20" stroke="#b9c3be" stroke-width="2"/><line x1="96" y1="20" x2="120" y2="20" stroke="#b9c3be" stroke-width="2"/>
      <rect x="24" y="8" width="72" height="24" rx="10" fill="#d9c39a" stroke="#b39a6b" stroke-width="1"/>
      <rect x="38" y="8" width="6" height="24" fill="#b23b2e"/><rect x="50" y="8" width="6" height="24" fill="#1a1a1a"/><rect x="62" y="8" width="6" height="24" fill="#c2452c"/><rect x="80" y="8" width="6" height="24" fill="#c9a227"/>
    </svg>`;
  }
  function led() {
    return `<svg viewBox="0 0 40 40" aria-hidden>
      <circle class="led-glow" cx="20" cy="20" r="18" fill="#5cf0a1" opacity="0"/>
      <circle class="led-core" cx="20" cy="20" r="9" fill="#183a2b" stroke="#2fa86c" stroke-width="1.5"/>
      <circle class="led-dot" cx="20" cy="20" r="4" fill="#2a5a44"/>
    </svg>`;
  }
  function wifi() {
    return `<svg viewBox="0 0 60 60" aria-hidden>
      <circle cx="30" cy="44" r="3.5" fill="#5cf0a1"/>
      <path class="w1" d="M20 36 a14 14 0 0 1 20 0" fill="none" stroke="#5cf0a1" stroke-width="2.4" stroke-linecap="round" opacity=".35"/>
      <path class="w2" d="M12 28 a25 25 0 0 1 36 0" fill="none" stroke="#5cf0a1" stroke-width="2.4" stroke-linecap="round" opacity=".35"/>
      <path class="w3" d="M4 20 a36 36 0 0 1 52 0" fill="none" stroke="#5cf0a1" stroke-width="2.4" stroke-linecap="round" opacity=".35"/>
    </svg>`;
  }

  function navHtml() {
    const links = [
      ["projects", t(data.nav.projects)], ["skills", t(data.nav.skills)],
      ["story", t(data.nav.story)], ["contact", t(data.nav.contact)]
    ];
    return `<header class="nav">
      <div class="container nav-inner">
        <a href="#top" class="nav-logo" aria-label="home">${esc(data.profile.initials)}<span class="dot"></span></a>
        <nav class="nav-links mono">${links.map((l,i)=>`<a href="#${l[0]}"><span>0${i+1}.</span>${esc(l[1])}</a>`).join("")}</nav>
        <div class="nav-right">
          <button class="lang-btn mono" id="lang-btn" aria-label="switch language">${lang === "fa" ? "EN" : "فارسی"}</button>
          <button class="menu-btn ${menuOpen ? "open":""}" id="menu-btn" aria-label="menu" aria-expanded="${menuOpen}">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </header>
    <div class="nav-drawer ${menuOpen ? "open":""}" id="nav-drawer">
      ${links.map((l,i)=>`<a href="#${l[0]}"><span class="mono">0${i+1}.</span>${esc(l[1])}</a>`).join("")}
    </div>`;
  }

  function heroHtml() {
    const p=data.profile, h=data.hero;
    return `<section class="hero" id="top">
      <div class="hero-pin">
        <div class="container hero-inner">
          <div class="hero-text">
            <div class="hero-hello mono">${esc(t(p.hello))}</div>
            <div class="hero-name-card">
              <span class="tape tl"></span><span class="tape br"></span>
              <div class="sticky-note">${esc(t(p.note))}</div>
              <h1 class="hero-name">${esc(t(p.name))}</h1>
              <div class="hero-role mono">${esc(t(p.role))}</div>
              <div class="stamp mono">${p.stamp.map(esc).join(" · ")}</div>
            </div>
            <p class="hero-tagline">${esc(t(p.tagline))}</p>
            <div class="hero-meta"><span class="status-pill mono"><i></i> ${esc(t(p.status))}</span></div>
          </div>
          <div class="stage" aria-hidden>
            <div class="stage-steps mono">${h.steps.map(s=>`<span>${esc(t(s))}</span>`).join("")}</div>
            <div class="board">
              <svg class="board-traces" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path pathLength="1" d="M46 31 H53 V28 H60"></path>
                <path pathLength="1" d="M29 48 V53 H27 V58"></path>
                <path pathLength="1" d="M40 62.5 V74"></path>
                <path pathLength="1" d="M75 38 V42 H80.5 V46"></path>
                <path pathLength="1" d="M80.5 68 V70"></path>
                <path pathLength="1" d="M46 40 H50 V88 H70"></path>
                <circle cx="53" cy="28" r="1.2"></circle><circle cx="27" cy="53" r="1.2"></circle>
                <circle cx="80.5" cy="42" r="1.2"></circle><circle cx="50" cy="88" r="1.2"></circle>
              </svg>
              <div class="slot slot-mcu" data-dx="-120" data-dy="-150" data-r="-18">${chip()}</div>
              <div class="slot slot-relay" data-dx="150" data-dy="-160" data-r="22">${relay()}</div>
              <div class="slot slot-cap" data-dx="190" data-dy="20" data-r="-35">${capacitor()}</div>
              <div class="slot slot-res" data-dx="-170" data-dy="80" data-r="28">${resistor()}</div>
              <div class="slot slot-led" data-dx="-90" data-dy="170" data-r="0">${led()}</div>
              <div class="slot slot-wifi" data-dx="140" data-dy="160" data-r="15">${wifi()}</div>
              <span class="board-label mono">REV 2 · ${esc(p.initials)}</span>
            </div>
            <div class="mini-panel mono">
              <div class="bar"><i></i><i></i><i></i><span>${esc(t(h.panelTitle))}</span></div>
              <div class="mini-row"><span>${esc(t(h.panelToggle))}</span><span class="toggle"><i></i></span></div>
              <div class="mini-chart"><span>${esc(t(h.panelChart))}</span>
                <svg viewBox="0 0 100 30" preserveAspectRatio="none"><path pathLength="1" d="M0 22 C10 20 14 12 22 14 S34 24 42 18 S54 6 62 10 S74 20 82 14 S94 8 100 12"></path></svg>
              </div>
            </div>
          </div>
        </div>
        <div class="scroll-hint mono"><span>${esc(t(h.scroll))}</span><i></i></div>
      </div>
    </section>`;
  }

  function projectsHtml() {
    const ui=data.ui;
    return `<section class="section" id="projects">
      <div class="container">
        <div class="sec-head reveal"><div class="sec-label mono">01 — ${esc(t(data.nav.projects))}</div>
          <h2 class="sec-title">${esc(t(ui.projectsTitle))}</h2><p class="sec-sub">${esc(t(ui.projectsSub))}</p>
        </div>
        <div class="projects-grid">
          ${data.projects.map((p,i)=>`<article class="pcard reveal ${p.featured ? "featured":""}" data-project="${esc(p.id)}" role="button" tabindex="0" aria-label="${esc(t(p.title))}">
            ${p.featured ? `<span class="featured-flag mono">${esc(t(ui.featured))}</span>`:""}
            <div class="pcard-img"><span class="pcard-idx mono">${pad(i+1)}</span>${p.year?`<span class="pcard-year mono">${esc(p.year)}</span>`:""}
              <img src="${esc(p.images[0]||"")}" alt="${esc(t(p.title))}" loading="${i<2?"eager":"lazy"}">
            </div>
            <div class="pcard-body"><h3 class="pcard-title">${esc(t(p.title))}</h3><p class="pcard-desc">${esc(t(p.shortDesc))}</p>
              <div class="tags mono">${p.tags.map(x=>`<span class="tag">${esc(x)}</span>`).join("")}</div>
              <span class="pcard-more mono">${esc(t(ui.viewProject))} ${arrowIcon()}</span>
            </div>
          </article>`).join("")}
        </div>
      </div>
    </section>`;
  }

  function skillsHtml() {
    const ui=data.ui;
    return `<section class="section" id="skills"><div class="container">
      <div class="sec-head reveal"><div class="sec-label mono">02 — ${esc(t(data.nav.skills))}</div>
        <h2 class="sec-title">${esc(t(ui.skillsTitle))}</h2><p class="sec-sub">${esc(t(ui.skillsSub))}</p>
      </div>
      <div class="legend mono reveal">
        ${["solid","working","basic"].map(lv=>`<div><span class="seg">${[1,2,3].map(n=>`<i class="${n<=FILL[lv]?"f":""}"></i>`).join("")}</span>${esc(t(ui.levels[lv]))}</div>`).join("")}
        <div class="usage"><i></i>${esc(t(ui.usage["1"]))}</div><div class="usage u2"><i></i>${esc(t(ui.usage["2"]))}</div><div class="usage u3"><i></i>${esc(t(ui.usage["3"]))}</div>
      </div>
      <div class="skills-grid">${data.skills.map(g=>`<div class="skill-group reveal">
        <div class="skill-group-head"><h3>${esc(t(g.group))}</h3><span class="mono">${g.items.length} × </span></div>
        ${g.items.map(s=>`<div class="skill-row"><div class="skill-top"><span class="skill-name">${esc(s.name)}</span><span class="skill-level mono">${esc(t(ui.levels[s.level]))}</span></div>
          <div class="meter" aria-label="${esc(t(ui.levelLabel))}: ${FILL[s.level]}/3">${[1,2,3].map(n=>`<i class="${n<=FILL[s.level]?"f":""}"></i>`).join("")}</div>
          <div class="skill-foot"><span class="usage mono u${s.usage}"><i></i>${esc(t(ui.usage[String(s.usage)]))}</span>${s.note?`<span class="skill-note">${esc(t(s.note))}</span>`:""}</div>
        </div>`).join("")}
      </div>`).join("")}</div>
    </div></section>`;
  }

  function storyHtml() {
    const ui=data.ui;
    return `<section class="section" id="story"><div class="container">
      <div class="sec-head reveal"><div class="sec-label mono">03 — ${esc(t(data.nav.story))}</div>
        <h2 class="sec-title">${esc(t(ui.storyTitle))}</h2><p class="sec-sub">${esc(t(ui.storySub))}</p>
      </div>
      <div class="story-wrap"><div class="story-line"><div class="story-progress"></div></div>
        ${data.story.map(ch=>`<article class="chapter reveal"><div class="chapter-marker mono">${esc(ch.tag)}</div><h3>${esc(t(ch.title))}</h3><p>${esc(t(ch.text))}</p></article>`).join("")}
      </div>
    </div></section>`;
  }

  function contactHtml() {
    const ui=data.ui, c=data.contact;
    return `<section class="section" id="contact" style="padding-bottom:24px"><div class="container">
      <div class="sec-label mono reveal">04 — ${esc(t(data.nav.contact))}</div>
      <div class="contact-card reveal"><span class="tape tl"></span>
        <div><h2 class="contact-title">${esc(t(ui.contactTitle))}</h2><p class="contact-sub">${esc(t(ui.contactSub))}</p></div>
        <div class="contact-actions"><a class="btn-primary" href="mailto:${esc(c.email)}"><span>${esc(t(ui.sendEmail))}</span>${arrowIcon()}</a>
        <div class="contact-actions"><a class="btn-primary" href="tel:${esc(c.call)}"><span>${esc(t(ui.call))}</span>${arrowIcon()}</a>
          <div class="contact-links">${c.links.map(l=>`<a href="${esc(l.url)}" target="_blank" rel="noreferrer"><strong>${esc(l.label)}</strong><span class="mono">${esc(l.handle)}</span></a>`).join("")}</div>
        </div>
      </div>
      <footer class="footer mono"><span>© ${new Date().getFullYear()} ${esc(t(data.profile.name))}</span><span>${esc(t(ui.footer))}</span></footer>
    </div></section>`;
  }

  function render() {
    setDocumentLang();
    document.getElementById("root").innerHTML = navHtml() + `<main>${heroHtml()}${projectsHtml()}${skillsHtml()}${storyHtml()}${contactHtml()}</main>`;
    bindEvents();
    initReveal();
    initHeroAnimation();
    initStoryAnimation();
    requestAnimationFrame(() => { if (window.ScrollTrigger) ScrollTrigger.refresh(); });
  }

  function bindEvents() {
    $("#lang-btn").addEventListener("click", () => { lang = lang === "fa" ? "en" : "fa"; activeProject = null; render(); });
    $("#menu-btn").addEventListener("click", () => { menuOpen = !menuOpen; render(); });
    $$("#nav-drawer a").forEach(a => a.addEventListener("click", () => { menuOpen=false; }));
    $$(".pcard").forEach(card => {
      const open = () => openProject(card.dataset.project);
      card.addEventListener("click", open);
      card.addEventListener("keydown", e => { if(e.key==="Enter" || e.key===" ") { e.preventDefault(); open(); }});
    });
  }

  function initReveal() {
    const items = $$(".reveal");
    if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      items.forEach(i=>i.classList.add("is-in")); $$(".skill-row").forEach(i=>i.classList.add("is-on")); return;
    }
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const target=e.target, idx=items.indexOf(target);
        target.style.transitionDelay=`${Math.min(idx%6,5)*60}ms`;
        target.classList.add("is-in"); io.unobserve(target);
        setTimeout(()=>target.style.transitionDelay="",1000);
      });
    }, {rootMargin:"0px 0px -10% 0px", threshold:0.15});
    items.forEach(i=>io.observe(i));

    const sio = new IntersectionObserver(entries => entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("is-on");sio.unobserve(e.target);}}), {threshold:0.6});
    $$(".skill-row").forEach(i=>sio.observe(i));
  }

  function initHeroAnimation() {
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    const el=$(".hero"); if(!el) return;
    const desktop=matchMedia("(min-width: 900px)").matches, reduce=matchMedia("(prefers-reduced-motion: reduce)").matches, k=desktop?1:0.6;
    const pin=$(".hero-pin",el), text=$(".hero-text",el), stage=$(".stage",el);
    const slots=$$(".slot",el), traces=$$(".board-traces path",el), vias=$$(".board-traces circle",el);
    const steps=$$(".stage-steps span",el), ledGlow=$(".led-glow",el), ledDot=$(".led-dot",el), wifiArcs=$$(".slot-wifi path",el);
    const panel=$(".mini-panel",el), toggle=$(".mini-panel .toggle",el), knob=$(".mini-panel .toggle i",el), chart=$(".mini-chart path",el), hint=$(".scroll-hint",el);

    if(reduce){
      gsap.set(traces,{strokeDashoffset:0}); gsap.set(vias,{opacity:1}); gsap.set(ledGlow,{opacity:.35}); gsap.set(ledDot,{fill:ACCENT});
      gsap.set(wifiArcs,{opacity:1}); gsap.set(panel,{autoAlpha:1}); gsap.set(knob,{x:14}); gsap.set(toggle,{backgroundColor:"#2fa86c"});
      gsap.set(chart,{strokeDashoffset:0}); gsap.set(steps,{opacity:1,color:ACCENT}); gsap.set(hint,{autoAlpha:0}); return;
    }
    slots.forEach(s=>gsap.set(s,{x:Number(s.dataset.dx)*k,y:Number(s.dataset.dy)*k,rotation:Number(s.dataset.r),scale:.8,opacity:.85}));
    gsap.set(vias,{opacity:0}); gsap.set(steps,{opacity:.45,color:MUTED}); gsap.set(steps[0],{opacity:1,color:ACCENT});

    const tl=gsap.timeline({defaults:{ease:"power2.inOut"},scrollTrigger:{trigger:pin,start:"top top",end:()=>"+="+(desktop?230:260)+"%",pin,scrub:.7,anticipatePin:1,invalidateOnRefresh:true}});
    const setStep=(i,at)=>{tl.to(steps[i],{opacity:1,color:ACCENT,duration:.15},at);if(i>0)tl.to(steps[i-1],{opacity:.45,color:MUTED,duration:.15},at);};
    tl.to(hint,{autoAlpha:0,duration:.15},0);
    if(!desktop){
      tl.to(text,{autoAlpha:0,y:-30,duration:.5},0);
      tl.to(stage,{y:()=>{const avail=pin.clientHeight-64,centre=Math.max(0,(avail-stage.offsetHeight)/2);return -(text.offsetHeight+28+16)+centre-10;},duration:.6},.05);
    }
    tl.to(slots,{x:0,y:0,rotation:0,scale:1,opacity:1,duration:1,stagger:.08},.1); setStep(1,.5);
    tl.to(traces,{strokeDashoffset:0,duration:.7,stagger:.08,ease:"none"},.9); tl.to(vias,{opacity:1,duration:.2,stagger:.04},1.2);
    setStep(2,1.7); tl.to(ledDot,{fill:ACCENT,duration:.15},1.7); tl.to(ledGlow,{opacity:.35,duration:.25},1.7); tl.to(wifiArcs,{opacity:1,duration:.2,stagger:.1},1.8);
    setStep(3,2.2); tl.fromTo(panel,{autoAlpha:0,y:40},{autoAlpha:1,y:0,duration:.6},2.2); tl.to(knob,{x:14,duration:.2},2.8); tl.to(toggle,{backgroundColor:"#2fa86c",duration:.2},2.8); tl.to(chart,{strokeDashoffset:0,duration:.8,ease:"none"},2.9); tl.to(ledGlow,{opacity:.6,duration:.15,yoyo:true,repeat:1},2.8);
    tl.to([text,stage],{autoAlpha:0,y:"-=40",scale:.97,duration:.7,ease:"power2.in"},3.9); tl.to({},{duration:.2});
  }

  function initStoryAnimation() {
    if(!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    const wrap=$(".story-wrap"), progress=$(".story-progress"); if(!wrap||!progress)return;
    gsap.fromTo(progress,{height:"0%"},{height:"100%",ease:"none",scrollTrigger:{trigger:wrap,start:"top 60%",end:"bottom 60%",scrub:.4,invalidateOnRefresh:true}});
    $$(".chapter").forEach(ch=>ScrollTrigger.create({
      trigger:ch,start:"top 62%",end:"bottom 40%",
      onEnter:()=>ch.classList.add("is-on"),onEnterBack:()=>ch.classList.add("is-on"),onLeaveBack:()=>ch.classList.remove("is-on")
    }));
  }

  function openProject(id) {
    activeIndex=data.projects.findIndex(p=>p.id===id); if(activeIndex<0)return;
    activeProject=data.projects[activeIndex]; modalImage=0; renderModal(); document.body.style.overflow="hidden";
  }
  function closeModal() { activeProject=null; $(".modal-backdrop")?.remove(); document.body.style.overflow=""; }
  function navProject(dir) {
    activeIndex=(activeIndex+dir+data.projects.length)%data.projects.length; activeProject=data.projects[activeIndex]; modalImage=0; renderModal();
  }
  function renderModal() {
    $(".modal-backdrop")?.remove();
    const p=activeProject, ui=data.ui, imgs=p.images||[];
    const root=document.createElement("div"); root.className="modal-backdrop"; root.setAttribute("role","dialog"); root.setAttribute("aria-modal","true"); root.setAttribute("aria-label",t(p.title));
    root.innerHTML=`<div class="modal">
      <div class="modal-top mono"><span>${esc(t(ui.projectsTitle).toUpperCase())} · ${pad(activeIndex+1,3)} / ${pad(data.projects.length,3)}</span>
        <div style="display:flex;gap:8px">
          <button class="close-btn" data-action="prev" aria-label="${esc(t(ui.prev))}"><span class="icon-prev">${chevron()}</span></button>
          <button class="close-btn" data-action="next" aria-label="${esc(t(ui.next))}"><span class="icon-next">${chevron()}</span></button>
          <button class="close-btn" data-action="close">✕ ${esc(t(ui.close))}</button>
        </div>
      </div>
      <div class="gallery"><div class="gallery-main">
        ${imgs.length?`<img src="${esc(imgs[modalImage])}" alt="${esc(t(p.title))} ${modalImage+1}">`:""}
        ${imgs.length>1?`<button class="gal-btn prev" data-action="img-prev" aria-label="${esc(t(ui.prev))}"><span class="icon-prev">${chevron()}</span></button>
        <button class="gal-btn next" data-action="img-next" aria-label="${esc(t(ui.next))}"><span class="icon-next">${chevron()}</span></button>
        <span class="gal-count mono">${modalImage+1} / ${imgs.length}</span>`:""}
      </div>
      ${imgs.length>1?`<div class="thumbs">${imgs.map((src,i)=>`<button class="thumb ${i===modalImage?"on":""}" data-img="${i}" aria-label="image ${i+1}"><img src="${esc(src)}" alt="" loading="lazy"></button>`).join("")}</div>`:""}</div>
      <div class="pinfo"><div class="pinfo-paper"><h3 class="pinfo-title">${esc(t(p.title))}</h3>
        <div class="pinfo-tags mono">${p.tags.map(tag=>`<span class="tag">${esc(tag)}</span>`).join("")}</div>
        <div class="pinfo-meta mono">${p.year?`<div>${esc(t(ui.year))}<b>${esc(p.year)}</b></div>`:""}<div>${esc(t(ui.type))}<b>${esc(t(ui.personal))}</b></div></div>
      </div>
      <div class="pblock"><h4 class="mono">${esc(t(ui.overview))}</h4><p>${esc(t(p.longDesc))}</p></div>
      ${(p.highlights&&p.highlights[lang]?.length)?`<div class="pblock"><h4 class="mono">${esc(t(ui.highlights))}</h4><ul class="hl-list">${p.highlights[lang].map(h=>`<li>${esc(h)}</li>`).join("")}</ul></div>`:""}
      ${(p.stack&&p.stack.length)?`<div class="pblock"><h4 class="mono">${esc(t(ui.stack))}</h4><div class="stack-grid mono">${p.stack.map(s=>`<span>${esc(s)}</span>`).join("")}</div></div>`:""}
      </div>
    </div>`;
    root.addEventListener("click",e=>{if(e.target===root)closeModal();});
    root.querySelectorAll("[data-action]").forEach(b=>b.addEventListener("click",()=>{
      const a=b.dataset.action; if(a==="close")closeModal(); if(a==="prev")navProject(-1); if(a==="next")navProject(1);
      if(a==="img-prev"){modalImage=(modalImage-1+imgs.length)%imgs.length;renderModal();}
      if(a==="img-next"){modalImage=(modalImage+1)%imgs.length;renderModal();}
    }));
    root.querySelectorAll("[data-img]").forEach(b=>b.addEventListener("click",()=>{modalImage=Number(b.dataset.img);renderModal();}));
    document.body.appendChild(root);
  }

  document.addEventListener("keydown", e=>{
    if(!activeProject)return;
    const imgs=activeProject.images||[];
    if(e.key==="Escape")closeModal();
    if(e.key==="ArrowRight" && imgs.length){modalImage=(modalImage+1)%imgs.length;renderModal();}
    if(e.key==="ArrowLeft" && imgs.length){modalImage=(modalImage-1+imgs.length)%imgs.length;renderModal();}
  });

  fetch(DATA_URL,{cache:"no-cache"}).then(r=>{if(!r.ok)throw new Error(`HTTP ${r.status}`);return r.json();}).then(d=>{data=d;render();}).catch(err=>{
    document.getElementById("root").innerHTML=`<div class="loading mono" style="padding:24px;text-align:center"><div>Couldn't load <code>data/site.json</code>.<br><small style="opacity:.6">${esc(err)}</small></div></div>`;
  });
})();
