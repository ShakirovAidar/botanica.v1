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
  function closeSheet(restore = false) {
    state.sheet = false;
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
      $("sheet").hidden = false;
      $("sheet").inert = false;
      $("footer").inert = false;
      state.sheet = true;
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
  function renderMap() {
    $("map-empty").hidden = state.list.length !== 0;
    const notice = $("price-filter-notice");
    if (notice) {
      const unverified = state.budget && state.budget.id !== "all" && !inBudget(state.budget).length;
      notice.hidden = !unverified;
      notice.textContent = unverified ? `Current prices for ${state.budget.label} are not verified. Showing all ${PROJECTS.length} projects without claiming they fall within this range. Request pricing for availability.` : "";
    }
    const p = state.project;
    const iframe = $("google-map");
    const fallback = $("map-location-fallback");
    const link = $("open-google-maps");
    // Search embeds work without a Google Maps API key. Search results are NOT verified locations.
    const query = p ? `${p.name}, Phuket, Thailand` : 'Phuket, Thailand';
    const embed = p?.mapEmbed || `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=12&output=embed`;
    const share = p?.mapShare || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    iframe.hidden = false;
    if (iframe.getAttribute('src') !== embed) iframe.setAttribute('src', embed);
    fallback.hidden = false;
    fallback.textContent = p ? 'Map search preview — exact project location not verified' : 'Phuket overview — select a project below';
    link.hidden = false;
    link.href = share;
    link.textContent = p ? 'Search this project in Google Maps ↗' : 'Open Phuket in Google Maps ↗';

  }
  let cardScrollTimer,
    scrollLocked = false;
  function renderCards() {
    $("cards").innerHTML = state.list
      .map((p) => {
        const badge = p.paymentPlan ? '<span class="project-badge">70/30 payment plan</span>' : '';
        const media = p.image
          ? `<img class="project-photo" src="${p.image}" alt="${p.name}" loading="lazy" decoding="async"><button class="photo-button" type="button" data-photo="${p.id}" aria-label="Enlarge ${p.name} photo"></button>`
          : `<span class="photo-soon">Photo coming soon</span>`;
        return `<article class="project-card${state.project?.id === p.id ? " selected" : ""}" data-card="${p.id}">${media}${badge}<div class="project-content"><h3>${p.name}</h3><p class="project-subtitle">${p.subtitle}</p>${p.details ? `<details class="project-details"><summary>Project details</summary><p>${p.details}</p></details>` : ''}<button class="project-select" type="button" data-select="${p.id}" aria-pressed="${state.project?.id === p.id}">View on map</button><button class="button primary" type="button" data-reserve="${p.id}"><span>${p.price == null ? "Request Pricing" : price(p.price)}</span>${arrow}</button></div></article>`;
      })
      .join("");
  }
  function selectProject(id, open = true) {
    const p = state.list.find((p) => p.id === id);
    if (!p) return;
    state.project = p;
    document.querySelectorAll("[data-card]").forEach(c => c.classList.toggle("selected", c.dataset.card === id));
    document.querySelectorAll("[data-select]").forEach(b => b.setAttribute("aria-pressed", b.dataset.select === id));
    renderMap();
    renderNavigation();
    if (open) {
      state.sheet = true;
      $("sheet").hidden = false;
      $("sheet").inert = false;
      $("footer").inert = false;
      const card = document.querySelector(`[data-card="${id}"]`);
      scrollLocked = true;
      if (card) $("cards").scrollLeft = card.offsetLeft - 16;
      requestAnimationFrame(() => {
        scrollLocked = false;
      });
      $("sheet-close").focus({ preventScroll: true });
    }
  }
  function selectBudget(id) {
    state.budget = budgets().find((b) => b.id === id);
    if (!state.budget) return;
    const matched = inBudget(state.budget);
    // Unknown prices cannot be classified into a budget band.
    // Keep navigation usable by displaying the full unfiltered catalogue instead.
    state.list = matched.length ? matched : PROJECTS.slice();
    state.project = state.list.find((p) => p.id === state.project?.id) || state.list[0] || null;
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
      state.list = inBudget(state.budget);
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
    const reserve = e.target.closest("[data-reserve]"),
      photo = e.target.closest("[data-photo]");
    if (reserve) {
      selectProject(reserve.dataset.reserve, false);
      go("contact");
    }
    const selection = e.target.closest("[data-select]");
    if (selection) selectProject(selection.dataset.select, false);
    if (photo) {
      const p = state.list.find((p) => p.id === photo.dataset.photo);
      openPhoto(p);
    }
  });
  $("cards").addEventListener("scroll", () => {
    if (scrollLocked) return;
    clearTimeout(cardScrollTimer);
    cardScrollTimer = setTimeout(() => {
      if (!state.sheet || state.screen !== "map") return;
      const cards = [...$("cards").children];
      const nearest = cards.find(c => c.getBoundingClientRect().left >= 0) || cards[0];
      if (nearest) selectProject(nearest.dataset.card, false);
    }, 120);
  });
  // Google Maps uses its own built-in controls.
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
