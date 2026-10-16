/* 50Lemons static prototype. Design: Figma 0CvGmpJvmjaB9u7BwytbXs. */
(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const PROJECTS = window.BOTANICA_PROJECTS;
  const budgets = () => [
    {id:"entry",min:14.9,max:30,label:"THB 14.9M–30M"},
    {id:"mid",min:30,max:70,label:"THB 30M–70M"},
    {id:"premium",min:70,max:250,label:"THB 70M–250M"}
  ];
  const channels = ["Telegram", "WhatsApp", "Instagram", "Facebook"];
  const channelKeys = [
    "imgIconTelegram",
    "imgIconWhatsapp",
    "imgIconInstagram",
    "imgIconFacebook",
  ];
  const placeholders = {
    Telegram: "@username or phone number",
    WhatsApp: "+66…",
    Instagram: "@username",
    Facebook: "Profile link or name",
  };
  const slides = ["23d80.png", "a7387.png", "31222.png", "f9474.png"];
  const readTheme = () => {
    try {
      return localStorage.getItem("50lemons-theme");
    } catch {
      return null;
    }
  };
  const initialTheme =
    new URLSearchParams(location.search).get("theme") || readTheme();
  const state = {
    theme:
      initialTheme === "dark" ||
      (initialTheme !== "light" &&
        matchMedia("(prefers-color-scheme: dark)").matches)
        ? "dark"
        : "light",
    screen: "home",
    budget: {id:"all",label:"Browse All Projects"},
    project: null,
    channel: "Telegram",
    contacts: {},
    list: PROJECTS.slice(),
    sheet: false,
    slide: 0,
    request: null,
  };
  const assets = () => window.FIGMA_ASSETS[state.theme];
  const price = (n) => n == null ? "Price on request" : `From THB ${n}M`;
  const budgetLabel = (b) => b?.label || "Browse All Projects";
  const inBudget = (b) => PROJECTS.filter(p => b.id === "all" || (b.id === "unknown" ? p.price == null : p.price != null && p.price >= b.min && (b.id === "premium" ? p.price <= b.max : p.price < b.max)));
  const img = (src, w = 18, h = w) =>
    `<img src="${src}" alt="" width="${w}" height="${h}">`;
  const arrow = '<span class="button-arrow" aria-hidden="true"></span>';
  const reducedMotion = () =>
    matchMedia("(prefers-reduced-motion: reduce)").matches;
  function projectKind(p) { return ""; }
  function renderBudgets() {
    $("budgets").innerHTML = budgets()
      .map(
        (b, i) =>
          `<button class="budget-option" type="button" data-budget="${b.id}" aria-pressed="${state.budget?.id === b.id}" ><span class="budget-icon">${img(i === 0 ? assets().budget.imgIconPalmtree : assets().budget.imgIconPalmtree1)}</span><span class="budget-copy"><strong>${budgetLabel(b)}</strong><small>${inBudget(b).length} projects on the map</small></span><span class="budget-arrow">${img(assets().budget.imgIconArrowRight, 16)}</span></button>`,
      )
      .join("");
  }
  function renderFaq() {
    const light = [
      [
        "Worried About Legal Mistakes?",
        "A lawyer checks the documents before you pay, including how the villa is registered and the terms of the land lease.",
      ],
      [
        "Paperwork and Unclear Payments?",
        "All payments are set out in one quote before the deal. Document preparation can be arranged with your adviser.",
      ],
      [
        "Can Foreigners Own a Villa in Phuket?",
        "Ownership of a building and ownership of land are different. A villa purchase may involve a registered land lease. Have an independent lawyer review the title, structure and lease terms before payment.",
      ],
    ];
    const dark = [
      light[2],
      [
        "Are Botanica Villas Move-In Ready?",
        "Readiness, furnishing and handover dates vary by project and villa. Choose a project and request its current availability and specifications.",
      ],
      [
        "Can You Buy a Botanica Villa on an Installment Plan?",
        "Payment schedules depend on the project and the specific villa. Request the current payment plan and all fees before making a reservation.",
      ],
    ];
    $("faq").innerHTML = dark
      .map(
        ([q, a]) =>
          `<details><summary><span>${q}</span><span class="faq-plus">${img(assets().budget.imgIconPlus, 14)}</span></summary><p>${a}</p></details>`,
      )
      .join("");
  }
  function renderNavigation() {
    document.querySelectorAll("[data-step]").forEach((button, i) => {
      const step = button.dataset.step,
        active = step === state.screen;
      button.toggleAttribute("aria-current", false);
      if (active) button.setAttribute("aria-current", "step");
      button.disabled =
        step === "map"
          ? !state.budget
          : step === "contact"
            ? !state.project
            : false;
      const keys = ["imgIconWallet", "imgIconMap", "imgIconMessageCircle"];
      const source = active
        ? step === "contact"
          ? assets().contact
          : step === "map"
            ? assets().map
            : assets().budget
        : i === 0
          ? assets().map
          : assets().budget;
      // Inactive budget/map glyphs are supplied separately in the contact frame.
      button.querySelector("img").src = source[keys[i]];
    });
    $("back").innerHTML = img(assets().contact.imgIconArrowLeft, 18);
    $("sheet-close").innerHTML = img(assets().cards.imgIconX, 16);
  }
  function setSheetMode(mode) {
    const sheet = $("sheet");
    if (mode === "closed") { closeSheet(); return; }
    sheet.hidden = false;
    sheet.inert = false;
    sheet.dataset.mode = mode;
    state.sheet = true;
    $("sheet-expand").setAttribute("aria-label", mode === "full" ? "Collapse details" : "Expand details");
    $("sheet-expand").textContent = mode === "full" ? "⌄" : "⌃";
    $("sheet-handle").setAttribute("aria-expanded", String(mode === "full"));
    renderSheetDetails();
  }
  const editorialCopy = {"botanica skyport": "Пять минут до международного аэропорта Пхукета.", "botanica grand avenue": "Виллы в сердце Банг Тао.", "botanica wisdom": "Всего 800 метров до международной школы UWC.", "botanica forestique": "Бутиковый проект рядом с Лаяном.", "botanica four seasons": "Тихая локация в районе Пру Джампа. Рассрочка: 70% в первые два года, оставшиеся 30% — ещё на два года под 3% годовых.", "botanica pru jampa": "Гибкая рассрочка 70/30: 70% в первые два года, оставшиеся 30% — ещё на два года под 3% годовых.", "botanica green boulevard": "The Grove прямо на территории посёлка: супермаркет Tops, винный магазин и рестораны.", "botanica louvre": "Камерный бутиковый проект всего из восьми вилл с уникальным дизайном.", "botanica montazure": "Горы и море. Всего пять минут до пляжа Камала.", "botanica karon": "Виллы с видом на море, всего пять минут до пляжа Карон.", "botanica modern loft ii": "Доступные виллы среди каучуковой рощи рядом с Blue Tree.", "botanica lakeside 2": "Виллы каскадом на возвышенности с видом на горы.", "botanica sky valley": "Ультрасовременные премиальные виллы в стиле Джеймса Бонда 007.", "botanica chalong bay": "Рядом с пирсом Чалонг — главным морским хабом для поездок на острова.", "gens by botanica": "Доступные кондоминиумы рядом с Blue Tree.", "hythe by botanica": "Элитные вертикальные виллы в сердце Банг Тао, рядом с Laguna Golf.", "botanica majestia": "Около 300 метров до British International School.", "botanica foresta ii": "Двухэтажные современные виллы среди зелени Лаяна.", "grand sea through": "Виллы с видом на море в районе Равай.", "kamala ocean valley": "Ультралюксовые виллы с видом на море, в пяти минутах от пляжа Камала.", "the verdant by botanica": "Камерный проект из семи вилл в Пру Джампа по доступной цене."};
  editorialCopy["the verdant by botanica"] = "Камерный проект из семи вилл в Пру Джампа по доступной цене.";
  function renderSheetDetails() {
    const p = state.project;
    if (!p) { $("sheet-details").innerHTML = ""; return; }
    const area = areaOf(p);
    const description = editorialCopy[p.name.toLowerCase()] || p.details || p.subtitle || "Проект Botanica на Пхукете.";
    const facts = [
      ["ТИП НЕДВИЖИМОСТИ", p.type || "Villa"],
      ["РАСПОЛОЖЕНИЕ", area?.name || "Phuket"],
      ["СТОИМОСТЬ", p.price == null ? "По запросу" : price(p.price)]
    ];
    $("sheet-details").innerHTML = `<article class="editorial-paper"><div class="paper-brand"><span class="paper-emblem">✳</span><span>BOTANICA</span></div><div class="paper-rule"></div><p class="paper-kicker">THE COLLECTION · PHUKET</p><h3>${esc(p.name)}</h3><p class="paper-lead">${esc(description)}</p><div class="paper-divider"><span>✦</span></div><p class="paper-section-label">О ПРОЕКТЕ</p><p class="paper-body">${esc(description)}</p><div class="paper-facts">${facts.map(([k,v])=>`<div><span>${esc(k)}</span><strong>${esc(String(v))}</strong></div>`).join("")}</div><button class="sheet-inquire" type="button" data-reserve="${esc(p.id)}">Узнать подробнее <span aria-hidden="true">↗</span></button><p class="paper-footer">BOTANICA · PHUKET, THAILAND</p></article>`;
  }
  function closeSheet(restore = false) {
    state.sheet = false;
    $("sheet").dataset.mode = "closed";
    $("sheet").hidden = true;
    $("sheet").inert = true;
    $("footer").inert = false;


  }
  function go(screen, { focus = true } = {}) {
    if (
      (screen === "map" && !state.budget) ||
      (screen === "contact" && !state.project)
    )
      return;
    closeSheet();
    state.screen = screen;
    $("app").dataset.screen = screen;
    ["home", "budget", "map", "contact", "success"].forEach(
      (id) => ($(id).hidden = id !== screen),
    );
    $("footer").hidden = ["home", "success"].includes(screen);
    $("submit").hidden = screen !== "contact";
    $("back").hidden = ["home", "success"].includes(screen);
    renderNavigation();
    if (screen === "map") {
      // Cards remain visible even without a verified map location.
      $("footer").inert = false;
      renderCards();
      renderMap();
    }
    if (screen === "contact") {
      renderRecap();
      renderChannels();
    }
    if (focus) {
      const title = $(screen).querySelector("h1");
      title.tabIndex = -1;
      title.focus({ preventScroll: true });
    }
    $(screen).scrollTop = 0;
  }
  /* ---------- Map: one pin per area, project cards below ---------- */
  const AREAS = window.BOTANICA_AREAS || [];
  const areaOf = (p) => AREAS.find((a) => a.projects.includes(p.id)) || null;
  const isExact = (p) => p.locationStatus === "confirmed" && Number.isFinite(p.latitude) && Number.isFinite(p.longitude);
  const mapsUrl = (p) => {
    const a = areaOf(p);
    const [lat, lng] = isExact(p) ? [p.latitude, p.longitude] : a ? [a.lat, a.lng] : [null, null];
    return lat == null ? null : `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  };
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  state.area = "all"; // "all" | area id | "tbc"
  let map = null, markers = [], styledFor = null, libPromise = null;
  // OpenFreeMap: бесплатные векторные стили без API-ключа.
  // Для продакшена с гарантиями можно поднять свой хостинг и поменять только эти URL.
  const MAP_STYLES = {
    light: "https://tiles.openfreemap.org/styles/positron",
    dark: "https://tiles.openfreemap.org/styles/dark",
  };
  function setMapStatus(msg) {
    const el = $("map-status");
    el.hidden = !msg;
    el.textContent = msg || "";
  }
  // MapLibre GL JS: сначала локальная копия (assets/vendor), если её нет — CDN с зафиксированной версией.
  const MAPLIBRE_VERSION = "5.6.0";
  const MAPLIBRE_SOURCES = [
    "assets/vendor",
    `https://cdn.jsdelivr.net/npm/maplibre-gl@${MAPLIBRE_VERSION}/dist`,
  ];
  const addTag = (tag, attrs) =>
    new Promise((resolve, reject) => {
      const el = Object.assign(document.createElement(tag), attrs, { onload: resolve, onerror: reject });
      document.head.appendChild(el);
    });
  async function loadFromBase(base) {
    await addTag("link", { rel: "stylesheet", href: `${base}/maplibre-gl.css` });
    await addTag("script", { src: `${base}/maplibre-gl.js`, async: true });
    if (!window.maplibregl) throw new Error("maplibre-missing");
  }
  function loadMapLibre() {
    if (libPromise) return libPromise;
    libPromise = (async () => {
      if (window.maplibregl) return;
      let lastErr;
      for (const base of MAPLIBRE_SOURCES) {
        try { return await loadFromBase(base); } catch (e) { lastErr = e; }
      }
      throw lastErr || new Error("load-failed");
    })();
    libPromise.catch(() => {
      libPromise = null;
      setMapStatus("Map could not be loaded. Use the area chips and cards below.");
    });
    return libPromise;
  }
  function makePin(area, n, active) {
    // Обёртка нужна: MapLibre двигает её через transform, а у .area-pin свой transform.
    const wrap = document.createElement("div");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "area-pin" + (active ? " active" : "");
    btn.setAttribute("aria-label", `${area.name}: ${n} project${n > 1 ? "s" : ""}`);
    btn.innerHTML = `<b>${n}</b><i>${esc(area.name)}</i>`;
    btn.addEventListener("click", () => selectArea(area.id));
    wrap.appendChild(btn);
    return wrap;
  }
  const areaProjects = (a) => state.list.filter((p) => a.projects.includes(p.id));
  const tbcProjects = () => state.list.filter((p) => !areaOf(p));
  const visibleProjects = () =>
    state.area === "all" ? state.list
    : state.area === "tbc" ? tbcProjects()
    : state.list.filter((p) => areaOf(p)?.id === state.area);

  function renderChips() {
    const chip = (id, label, n) =>
      `<button type="button" class="area-chip" data-area="${id}" aria-pressed="${state.area === id}">${label}<span>${n}</span></button>`;
    const withProjects = AREAS.filter((a) => areaProjects(a).length);
    $("area-chips").innerHTML =
      chip("all", "All", state.list.length) +
      withProjects.map((a) => chip(a.id, esc(a.name), areaProjects(a).length)).join("") +
      (tbcProjects().length ? chip("tbc", "To be confirmed", tbcProjects().length) : "");
  }

  function renderMap() {
    $("map-empty").hidden = state.list.length !== 0;
    renderChips();
    loadMapLibre().then(drawMap).catch(() => {});
  }
  function drawMap() {
    if (state.screen !== "map") return;
    setMapStatus("");
    const styleUrl = state.theme === "dark" ? MAP_STYLES.dark : MAP_STYLES.light;
    if (!map) {
      map = new maplibregl.Map({
        container: "project-map",
        style: styleUrl,
        center: [98.32, 7.95],
        zoom: 10,
        attributionControl: { compact: true },
      });
      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
      styledFor = state.theme;
    } else if (styledFor !== state.theme) {
      map.setStyle(styleUrl);
      styledFor = state.theme;
    }
    markers.forEach((m) => m.remove());
    markers = [];
    const shown = AREAS.filter((a) => areaProjects(a).length);
    shown.forEach((a) => {
      const el = makePin(a, areaProjects(a).length, state.area === a.id);
      markers.push(new maplibregl.Marker({ element: el }).setLngLat([a.lng, a.lat]).addTo(map));
    });
    map.resize();
    requestAnimationFrame(() => {
      const sheetH = ($("sheet").hidden ? 0 : $("sheet").offsetHeight) + 100;
      const target = state.area === "all" || state.area === "tbc" ? shown : shown.filter((a) => a.id === state.area);
      if (!target.length) return;
      const bounds = new maplibregl.LngLatBounds();
      target.forEach((a) => bounds.extend([a.lng, a.lat]));
      map.fitBounds(bounds, {
        padding: { top: 150, bottom: sheetH + 24, left: 24, right: 24 },
        maxZoom: 13,
        duration: 0,
      });
    });
  }

  function selectArea(id) {
    state.area = state.area === id && id !== "all" ? "all" : id;
    const first = visibleProjects()[0];
    if (first) state.project = first;
    renderCards();
    renderMap();
    setSheetMode("peek");
    $("cards").scrollLeft = 0;
  }

  function renderCards() {
    const list = visibleProjects();
    const a = state.area !== "all" && state.area !== "tbc" ? AREAS.find((x) => x.id === state.area) : null;
    $("sheet-title").textContent =
      state.area === "tbc" ? "Location to be confirmed" : a ? `${a.name} · ${list.length} project${list.length > 1 ? "s" : ""}` : `All projects · ${list.length}`;
    $("cards").innerHTML = list.map((p) => {
      const area = areaOf(p);
      const url = mapsUrl(p);
      const where = isExact(p) ? "Exact location" : area ? `${esc(area.name)} area` : "Location to be confirmed";
      return `<article class="project-card${state.project?.id === p.id ? " selected" : ""}" data-card="${p.id}">
        <span class="place-tag${area ? "" : " tbc"}">${where}</span>
        <h3>${esc(p.name)}</h3>
        <p class="project-subtitle">${esc(p.subtitle)}</p>
        <div class="card-actions">
          ${url ? `<a class="card-link" href="${url}" target="_blank" rel="noopener">Open in Maps</a>` : ""}
          <button class="card-cta" type="button" data-reserve="${p.id}">${p.price == null ? "Request pricing" : price(p.price)}</button>
        </div>
      </article>`;
    }).join("");
    if (state.sheet) renderSheetDetails();
  }
  function selectProject(id) {
    const p = state.list.find((p) => p.id === id);
    if (!p) return;
    state.project = p;
    renderNavigation();
    renderSheetDetails();
  }
  function selectBudget(id) {
    state.budget = budgets().find((b) => b.id === id);
    if (!state.budget) return;
    const matched = inBudget(state.budget);
    // Unknown prices cannot be classified into a budget band.
    // Keep navigation usable by displaying the full unfiltered catalogue instead.
    state.list = matched.length ? matched : PROJECTS.slice();
    state.project = state.list.find((p) => p.id === state.project?.id) || state.list[0] || null;
    state.area = "all";
    renderBudgets();
    renderMap();
    renderCards();
    go("map");
  }
  function renderChannels() {
    $("channels").innerHTML = channels
      .map((channel, i) => {
        const selected = state.channel === channel;
        // Telegram in both Figma modes is white; inactive messenger glyphs differ.
        const set =
          state.theme === "light" && selected
            ? window.FIGMA_ASSETS.dark.contact
            : assets().contact;
        return `<button type="button" class="channel" data-channel="${channel}" aria-label="${channel}" aria-pressed="${selected}">${img(set[channelKeys[i]], 22)}</button>`;
      })
      .join("");
    $("contact-label").textContent = state.channel;
    $("contact-value").placeholder = placeholders[state.channel];
    $("contact-value").inputMode =
      state.channel === "WhatsApp" ? "tel" : "text";
    $("contact-value").value = state.contacts[state.channel] || "";
  }
  function renderRecap() {
    const p = state.project;
    $("recap").innerHTML =
      (p.image
        ? `<img class="recap-image" src="${p.image}" alt="${p.name} villa">`
        : "") +
      `<div class="recap-glass"><p class="recap-title">YOUR SELECTION</p><div class="recap-row"><span>Budget</span><strong>${budgetLabel(state.budget)}</strong></div><div class="recap-row"><span>Project</span><strong>${p.name} · ${price(p.price)}</strong></div></div>`;
  }
  function applyTheme(theme) {
    state.theme = theme;
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("50lemons-theme", theme);
    } catch {}
    document.querySelector("meta[name=theme-color]").content =
      theme === "dark" ? "#000f1e" : "#f7f7f5";
    $("theme-toggle").setAttribute(
      "aria-label",
      `Switch to ${theme === "dark" ? "light" : "dark"} mode`,
    );
    $("theme-toggle").setAttribute("aria-pressed", theme === "dark");
    $("theme-label").textContent = theme === "dark" ? "Light" : "Dark";
    $("home-title").innerHTML = "Buy a Botanica<br>Villa in Phuket";
    const stats = [
      ["22 Years", "of experience"],
      ["No. 1", "Villa Developer"],
      [String(PROJECTS.length), "projects"],
    ];
    $("stats").innerHTML = stats
      .map(([a, b]) => `<div><strong>${a}</strong><small>${b}</small></div>`)
      .join("");
    $("consent-copy").textContent =
      "I agree to the processing of personal data";
    if (state.budget) {
      const available = budgets();
      state.budget = available.find(b => b.id === state.budget.id) || {id:"all",label:"Browse All Projects"};
      state.list = inBudget(state.budget).length ? inBudget(state.budget) : PROJECTS.slice();
      if (!state.list.some(p => p.id === state.project?.id)) state.project = state.list[0] || null;
      renderMap();
      renderCards();
    }
    renderBudgets();
    renderFaq();
    renderNavigation();
    if (state.screen === "contact") {
      renderRecap();
      renderChannels();
    }
  }
  $("theme-toggle").addEventListener("click", () =>
    applyTheme(state.theme === "light" ? "dark" : "light"),
  );
  $("start").addEventListener("click", () => go("budget"));
  $("home-link").addEventListener("click", () => go("home"));
  $("back").addEventListener("click", () =>
    go(
      { budget: "home", map: "budget", contact: "map" }[state.screen] || "home",
    ),
  );
  $("budgets").addEventListener("click", (e) => {
    const b = e.target.closest("[data-budget]");
    if (b) selectBudget(b.dataset.budget);
  });
  document.querySelector(".tabbar").addEventListener("click", (e) => {
    const b = e.target.closest("[data-step]");
    if (b && !b.disabled) go(b.dataset.step);
  });
  $("sheet-close").addEventListener("click", () => closeSheet(true));
  $("sheet-expand").hidden = true;
  const handle = $("sheet-handle");
  let startY = null, draggedHandle = false;
  handle.addEventListener("pointerdown", e => { draggedHandle = false; startY = e.clientY; handle.setPointerCapture(e.pointerId); });
  handle.addEventListener("pointerup", e => {
    if (startY === null) return;
    const delta = e.clientY - startY;
    draggedHandle = Math.abs(delta) > 12;
    startY = null;
    if (!draggedHandle) { setSheetMode($("sheet").dataset.mode === "full" ? "peek" : "full"); return; }
    if (delta < -45) setSheetMode("full");
    else if (delta > 90 && $("sheet").dataset.mode === "peek") closeSheet();
    else if (delta > 45) setSheetMode("peek");
  });
  handle.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSheetMode($("sheet").dataset.mode === "full" ? "peek" : "full"); } });
  $("channels").addEventListener("click", (e) => {
    const b = e.target.closest("[data-channel]");
    if (!b) return;
    state.contacts[state.channel] = $("contact-value").value;
    state.channel = b.dataset.channel;
    renderChannels();
    $("contact-value").focus({ preventScroll: true });
  });
  $("contact-value").addEventListener("input", () => {
    state.contacts[state.channel] = $("contact-value").value;
    $("contact-value").removeAttribute("aria-invalid");
    $("form-error").textContent = "";
  });
  $("cards").addEventListener("click", (e) => {
    const card = e.target.closest("[data-card]");
    if (card && !e.target.closest("[data-reserve]")) { selectProject(card.dataset.card); renderCards(); }
    const reserve = e.target.closest("[data-reserve]");
    if (reserve) {
      selectProject(reserve.dataset.reserve);
      go("contact");
    }
  });
  $("sheet-details").addEventListener("click", e => {
    const b = e.target.closest("[data-reserve]");
    if (b) { selectProject(b.dataset.reserve); go("contact"); }
  });
  $("area-chips").addEventListener("click", (e) => {
    const c = e.target.closest("[data-area]");
    if (!c) return;
    state.area = "";            // force a fresh selection instead of toggling
    selectArea(c.dataset.area);
  });
  // MapLibre uses its own built-in controls.
  // The prototype prepares a payload; enable fetch('/api/order', ...) only once
  // an actual backend exists. Never display a false "sent" confirmation.
  $("contact-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const contactValue = $("contact-value").value.trim();
    if (
      contactValue.length < 3 ||
      (state.channel === "WhatsApp" &&
        contactValue.replace(/\D/g, "").length < 7)
    ) {
      $("form-error").textContent =
        state.channel === "WhatsApp"
          ? "Enter a phone number including the country code."
          : `Enter your ${state.channel} contact (at least 3 characters).`;
      $("contact-value").setAttribute("aria-invalid", "true");
      $("contact-value").focus();
      return;
    }
    if (!$("consent").checked) {
      $("form-error").textContent =
        "Please agree to the data processing terms to continue.";
      $("consent").focus();
      return;
    }
    $("form-error").textContent = "";
    state.request = {
      budget: budgetLabel(state.budget),
      project: state.project.name,
      price: price(state.project.price),
      projectId: state.project.id,
      subtitle: state.project.subtitle,
      channel: state.channel,
      contact: contactValue,
      language: "en",
      consent: true,
    };
    const summary = $("summary");
    summary.replaceChildren();
    for (const [label, value] of [
      ["Budget", state.request.budget],
      ["Project", `${state.request.project} · ${state.request.price}`],
      ["Contact", `${state.channel}: ${contactValue}`],
    ]) {
      const row = document.createElement("div"),
        dt = document.createElement("dt"),
        dd = document.createElement("dd");
      dt.textContent = label;
      dd.textContent = value;
      row.append(dt, dd);
      summary.append(row);
    }
    $("copy-status").textContent = "";
    const messengerUrls = {
      Telegram: "https://web.telegram.org/",
      WhatsApp: "https://web.whatsapp.com/",
      Instagram: "https://www.instagram.com/",
      Facebook: "https://www.facebook.com/messages/",
    };
    $("open-messenger").href = messengerUrls[state.channel];
    $("open-messenger").querySelector("span").textContent =
      `Open ${state.channel}`;
    go("success");
  });
  $("copy-request").addEventListener("click", async () => {
    const text = Object.entries(state.request || {})
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n");
    try {
      await navigator.clipboard.writeText(text);
      $("copy-status").textContent = "Request copied.";
    } catch {
      $("copy-status").textContent =
        "Copy is unavailable here. Select the request details above to copy them.";
    }
  });
  $("restart").addEventListener("click", () => {
    state.budget = {id:"all",label:"Browse All Projects"};
    state.project = null;
    state.request = null;
    state.list = PROJECTS.slice();
    state.contacts = {};
    state.channel = "Telegram";
    $("contact-form").reset();
    $("form-error").textContent = "";
    $("contact-value").removeAttribute("aria-invalid");
    renderBudgets();
    go("home");
  });
  const gallery = document.querySelector(".hero-slides"),
    dots = document.querySelector(".slider-dots");
  $("success").prepend(
    document.querySelector(".botanica-full").cloneNode(true),
  );
  gallery.innerHTML = slides
    .map(
      (file, i) =>
        `<img src="assets/figma/${file}" alt="Phuket villa view ${i + 1}" ${i ? 'loading="lazy"' : 'fetchpriority="high"'} draggable="false">`,
    )
    .join("");
  dots.innerHTML = slides
    .map(
      (_, i) =>
        `<button type="button" data-slide="${i}" aria-label="Show photo ${i + 1}" aria-pressed="${i === 0}"></button>`,
    )
    .join("");
  dots.addEventListener("click", (e) => {
    const b = e.target.closest("[data-slide]");
    if (b)
      gallery.scrollTo({
        left: gallery.clientWidth * Number(b.dataset.slide),
        behavior: reducedMotion() ? "auto" : "smooth",
      });
  });
  gallery.addEventListener("scroll", () => {
    state.slide = Math.round(gallery.scrollLeft / gallery.clientWidth);
    $("slide-count").textContent = `0${state.slide + 1} / 04`;
    dots
      .querySelectorAll("button")
      .forEach((b, i) => b.setAttribute("aria-pressed", i === state.slide));
  });
  let photoScale = 1,
    photoX = 0,
    photoY = 0,
    photoPointer = null;
  const photoPointers = new Map();
  let photoPinch = null,
    lastTap = 0;
  function drawPhoto() {
    $("lightbox-image").style.transform =
      `translate(${photoX}px,${photoY}px) scale(${photoScale})`;
  }
  function zoomPhoto(factor) {
    photoScale = Math.max(1, Math.min(6, photoScale * factor));
    if (photoScale === 1) {
      photoX = 0;
      photoY = 0;
    }
    drawPhoto();
  }
  function openPhoto(p) {
    photoScale = 1;
    photoX = 0;
    photoY = 0;
    $("lightbox-image").src = p.image;
    $("lightbox-image").alt = `${p.name} villa`;
    drawPhoto();
    $("lightbox").showModal();
  }
  $("lightbox-close").addEventListener("click", () => $("lightbox").close());
  $("photo-plus").addEventListener("click", () => zoomPhoto(1.3));
  $("photo-minus").addEventListener("click", () => zoomPhoto(1 / 1.3));
  $("photo-reset").addEventListener("click", () => {
    photoScale = 1;
    photoX = 0;
    photoY = 0;
    drawPhoto();
  });
  const photoWrap = document.querySelector(".lightbox-image-wrap");
  photoWrap.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      zoomPhoto(Math.exp(-e.deltaY * 0.002));
    },
    { passive: false },
  );
  photoWrap.addEventListener("pointerdown", (e) => {
    photoPointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    photoWrap.setPointerCapture(e.pointerId);
    photoPointer = { x: e.clientX, y: e.clientY };
  });
  photoWrap.addEventListener("pointermove", (e) => {
    const previous = photoPointers.get(e.pointerId);
    if (!previous) return;
    photoPointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (photoPointers.size === 2) {
      const [a, b] = [...photoPointers.values()],
        d = Math.hypot(a.x - b.x, a.y - b.y);
      if (photoPinch)
        photoScale = Math.max(
          1,
          Math.min(6, (photoPinch.scale * d) / photoPinch.d),
        );
      else photoPinch = { scale: photoScale, d: d || 1 };
    } else if (photoScale > 1) {
      photoX += e.clientX - previous.x;
      photoY += e.clientY - previous.y;
    }
    drawPhoto();
  });
  function endPhoto(e) {
    photoPointers.delete(e.pointerId);
    photoPinch = null;
    if (
      e.type === "pointerup" &&
      photoPointer &&
      Math.hypot(e.clientX - photoPointer.x, e.clientY - photoPointer.y) < 8
    ) {
      const now = Date.now();
      if (now - lastTap < 300) {
        photoScale = photoScale > 1 ? 1 : 2.5;
        photoX = 0;
        photoY = 0;
        drawPhoto();
      }
      lastTap = now;
    }
    photoPointer = null;
  }
  photoWrap.addEventListener("pointerup", endPhoto);
  photoWrap.addEventListener("pointercancel", endPhoto);
  $("lightbox").addEventListener("close", () => {
    photoPointers.clear();
    photoPointer = null;
    photoPinch = null;
  });
  document.addEventListener("keydown", (e) => {
    if (!state.sheet || $("lightbox").open) return;
    if (e.key === "Escape") {
      closeSheet(true);
      return;
    }
    if (e.key === "Tab") {
      const focusables = [...$("sheet").querySelectorAll("button")],
        first = focusables[0],
        last = focusables.at(-1);
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
  applyTheme(state.theme);
  go("home", { focus: false });
})();
