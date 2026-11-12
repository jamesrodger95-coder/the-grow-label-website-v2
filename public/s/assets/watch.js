(() => {
  const root = document.documentElement;
  const token = root.dataset.token;
  // On thegrowlabel.com the page is static, so events go back to the ops site (data-api).
  const api = root.dataset.api || "";
  const preview = root.dataset.preview === "1" || new URLSearchParams(location.search).get("preview") === "1";
  const send = (type, value) => {
    if (preview || !token) return;
    try {
      const body = JSON.stringify({ type, value });
      const url = `${api}/s/${token}/event`;
      // text/plain keeps the request "simple", so it also works cross-origin without CORS.
      if (navigator.sendBeacon) navigator.sendBeacon(url, new Blob([body], { type: "text/plain;charset=UTF-8" }));
      else fetch(url, { method: "POST", mode: api ? "no-cors" : "same-origin", headers: { "content-type": "text/plain" }, body, keepalive: true });
    } catch {}
  };
  send("open");

  // Reveal on scroll
  const items = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    items.forEach((el) => io.observe(el));
  } else items.forEach((el) => el.classList.add("in"));

  // Headline rises once the font is ready; the "what happens next" line draws when it scrolls into view.
  const rise = document.querySelector(".rise");
  if (rise) {
    const go = () => rise.classList.add("in");
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(go);
    setTimeout(go, 700);
  }
  const path = document.querySelector("[data-path]");
  if (path) {
    if ("IntersectionObserver" in window) {
      const po = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) { path.classList.add("in"); po.disconnect(); } }), { threshold: 0.3 });
      po.observe(path);
    } else path.classList.add("in");
  }

  // Player: silent autoplay loop first, then one tap for the full version with sound.
  const wrap = document.querySelector(".player");
  const video = wrap && wrap.querySelector("video");
  const btn = wrap && wrap.querySelector(".sound");
  const stage = document.querySelector(".stage");
  if (video && btn) {
    video.play().catch(() => {});
    const marks = new Set();
    const start = () => {
      video.muted = false;
      video.loop = false;
      video.controls = true;
      video.currentTime = 0;
      wrap.classList.add("playing");
      if (stage) { stage.classList.add("playing"); stage.style.removeProperty("--rx"); stage.style.removeProperty("--ry"); }
      video.play().catch(() => {});
      send("play");
    };
    btn.addEventListener("click", start);
    video.addEventListener("timeupdate", () => {
      if (video.muted || !video.duration) return;
      const pct = Math.floor((video.currentTime / video.duration) * 4) * 25;
      if (pct >= 25 && !marks.has(pct)) { marks.add(pct); send("progress", pct); }
    });
    video.addEventListener("ended", () => { if (!marks.has(100)) { marks.add(100); send("progress", 100); } });
    // Two or three films: the switch swaps the source and goes back to the silent loop.
    const ideaText = document.querySelector(".idea p");
    document.querySelectorAll(".film").forEach((b) => b.addEventListener("click", () => {
      if (b.classList.contains("on")) return;
      document.querySelectorAll(".film").forEach((x) => { x.classList.toggle("on", x === b); x.setAttribute("aria-pressed", String(x === b)); });
      marks.clear();
      video.controls = false; video.muted = true; video.loop = true;
      wrap.classList.remove("playing"); if (stage) stage.classList.remove("playing");
      video.poster = b.dataset.poster; video.src = b.dataset.src;
      video.play().catch(() => {});
      if (ideaText && b.dataset.idea) ideaText.textContent = b.dataset.idea;
    }));
  }
  // Scroll prompts: progress line and a floating button that names the next part.
  const bar = document.querySelector(".progress i");
  const pill = document.querySelector(".next-pill");
  const parts = [...document.querySelectorAll("[data-part]")];
  let target = null;
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    if (bar) bar.style.width = (max > 0 ? Math.min(100, (scrollY / max) * 100) : 100) + "%";
    if (!pill) return;
    const mid = scrollY + innerHeight * 0.55;
    let i = 0;
    parts.forEach((s, n) => { if (s.offsetTop <= mid) i = n; });
    const next = parts[i + 1];
    const label = parts[i].dataset.next;
    const cue = document.querySelector(".scroll-cue");
    const r = cue && cue.getBoundingClientRect();
    const cueVisible = r && r.top < innerHeight - 10 && r.bottom > 90;
    const nextSeen = next && next.getBoundingClientRect().top < innerHeight * 0.72;
    const card = document.querySelector(".cal-card");
    const cr = card && card.getBoundingClientRect();
    const calVisible = cr && cr.top < innerHeight - 120 && cr.bottom > 140;
    if (next && label && scrollY < max - 40 && !cueVisible && !nextSeen && !calVisible) {
      target = next;
      pill.querySelector(".next-label").textContent = "Next: " + label;
      pill.hidden = false;
    } else pill.hidden = true;
  };
  if (pill) pill.addEventListener("click", () => target && window.scrollTo({ top: target.offsetTop - 60, behavior: "smooth" }));
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll);
  onScroll();
  document.querySelectorAll("[data-cta], [data-cta-out]").forEach((a) => a.addEventListener("click", () => send("cta")));

  // Booking calendar, shown on the page itself. If it cannot load, the "open in a new tab" link still works.
  const calBox = document.getElementById("cal");
  if (calBox && calBox.dataset.calLink) {
    const loadCal = () => {
      if (calBox.dataset.loaded) return;
      calBox.dataset.loaded = "1";
      const origin = calBox.dataset.calOrigin || "https://cal.com";
      const src = (origin === "https://cal.com" ? "https://app.cal.com" : origin) + "/embed/embed.js";
      (function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if (typeof namespace === "string") { cal.ns[namespace] = cal.ns[namespace] || api; p(cal.ns[namespace], ar); p(cal, ["initNamespace", namespace]); } else p(cal, ar); return; } p(cal, ar); }; })(window, src, "init");
      const Cal = window.Cal;
      Cal("init", { origin });
      Cal("inline", { elementOrSelector: "#cal", calLink: calBox.dataset.calLink, layout: "month_view", config: { theme: "light", layout: "month_view" } });
      Cal("ui", { theme: "light", layout: "month_view", hideEventTypeDetails: false, cssVarsPerTheme: { light: { "cal-brand": "#4a3ac4" }, dark: { "cal-brand": "#ab9fee" } } });
      const ready = () => calBox.classList.add("ready");
      Cal("on", { action: "linkReady", callback: ready });
      Cal("on", { action: "__iframeReady", callback: ready });
      let booked = false;
      const onBooked = () => { if (!booked) { booked = true; send("booked"); } };
      Cal("on", { action: "bookingSuccessful", callback: onBooked });
      Cal("on", { action: "bookingSuccessfulV2", callback: onBooked });
      setTimeout(() => calBox.classList.add("slow"), 7000);
    };
    if ("IntersectionObserver" in window) {
      const co = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) { loadCal(); co.disconnect(); } }), { rootMargin: "900px 0px" });
      co.observe(calBox);
    }
    addEventListener("load", () => setTimeout(loadCal, 1800));
  }
  document.querySelectorAll("[data-site]").forEach((a) => a.addEventListener("click", () => send("site")));

  // Nav gets a hairline once the page moves.
  const nav = document.querySelector(".nav");
  const onNav = () => nav && nav.classList.toggle("scrolled", scrollY > 8);
  addEventListener("scroll", onNav, { passive: true });
  onNav();

  // Pointer effects, only with a mouse and only when motion is welcome.
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mouse = matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (!calm && mouse) {
    const hero = document.querySelector(".hero");
    if (hero && stage) {
      hero.addEventListener("pointermove", (e) => {
        if (stage.classList.contains("playing")) return;
        const r = stage.getBoundingClientRect();
        const x = (e.clientX - (r.left + r.width / 2)) / innerWidth;
        const y = (e.clientY - (r.top + r.height / 2)) / innerHeight;
        stage.style.setProperty("--ry", (x * 16).toFixed(2) + "deg");
        stage.style.setProperty("--rx", (-y * 12).toFixed(2) + "deg");
      });
      hero.addEventListener("pointerleave", () => { stage.style.removeProperty("--rx"); stage.style.removeProperty("--ry"); });
    }
    document.querySelectorAll("[data-glow]").forEach((el) => el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", (e.clientX - r.left) + "px");
      el.style.setProperty("--my", (e.clientY - r.top) + "px");
    }));
  }
})();
