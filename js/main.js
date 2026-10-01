(function () {
  "use strict";

  var SITE = window.SITE || {};
  var PROJECTS = window.PROJECTS || [];
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }
  function $$(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  /* Small DOM builder: el("div", { class: "x", text: "hi" }, child1, child2) */
  function el(tag, attrs) {
    var node = document.createElement(tag);
    attrs = attrs || {};
    Object.keys(attrs).forEach(function (key) {
      var val = attrs[key];
      if (val === false || val == null) return;
      if (key === "class") node.className = val;
      else if (key === "text") node.textContent = val;
      else node.setAttribute(key, val === true ? "" : val);
    });
    for (var i = 2; i < arguments.length; i++) {
      var kid = arguments[i];
      if (kid == null || kid === false) continue;
      node.appendChild(typeof kid === "string" ? document.createTextNode(kid) : kid);
    }
    return node;
  }

  /* ---------- Site settings ---------- */

  function applySettings() {
    $$("[data-site='name']").forEach(function (n) {
      n.textContent = SITE.name || "";
    });
    $$("[data-site='availability']").forEach(function (n) {
      if (SITE.availability) n.textContent = SITE.availability;
      else n.hidden = true;
    });
    $$("[data-year]").forEach(function (n) {
      n.textContent = new Date().getFullYear();
    });

    $$("[data-link]").forEach(function (a) {
      var url = SITE.links && SITE.links[a.getAttribute("data-link")];
      var holder = a.closest("li") || a;
      if (url) {
        a.href = url;
        a.target = "_blank";
        a.rel = "noopener";
      } else {
        holder.hidden = true;
      }
    });

    $$("[data-email]").forEach(function (a) {
      var holder = a.closest("li") || a;
      if (SITE.email) a.href = "mailto:" + SITE.email;
      else holder.hidden = true;
    });

    $$("[data-resume]").forEach(function (a) {
      if (SITE.resume) {
        a.href = SITE.resume;
        a.setAttribute("download", "");
      } else {
        a.hidden = true;
      }
    });

    var photo = $("[data-photo]");
    if (photo && SITE.photo) {
      photo.src = SITE.photo;
      photo.hidden = false;
    }
  }

  /* ---------- Navigation ---------- */

  function initNav() {
    var header = $(".site-header");
    var toggle = $(".nav-toggle");
    if (!header || !toggle) return;

    function setOpen(open) {
      header.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    }

    toggle.addEventListener("click", function () {
      setOpen(!header.classList.contains("nav-open"));
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });
    $$(".site-nav a").forEach(function (a) {
      a.addEventListener("click", function () {
        setOpen(false);
      });
    });
  }

  /* ---------- Scroll reveal ---------- */

  var revealObserver = null;

  function observeReveal(root) {
    var targets = $$("[data-reveal]:not(.in)", root);
    if (!targets.length) return;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      targets.forEach(function (t) {
        t.classList.add("in");
      });
      return;
    }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("in");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
      );
    }
    targets.forEach(function (t) {
      revealObserver.observe(t);
    });
  }

  /* ---------- Placeholder artwork (used until real images are added) ---------- */

  var PALETTES = [
    ["#6773b8", "#2e376b"],
    ["#8e9bd6", "#485696"],
    ["#aeb9e3", "#5a69ae"]
  ];

  function artShape(category, stroke) {
    var s = 'fill="none" stroke="' + stroke + '" stroke-width="1.6" stroke-linejoin="round"';
    switch (category) {
      case "Environment":
        return (
          '<g ' + s + '>' +
          '<path d="M90 230V130a40 40 0 0 1 80 0v100"/><path d="M160 230V110a50 50 0 0 1 100 0v120"/>' +
          '<path d="M250 230V140a35 35 0 0 1 70 0v90"/><path d="M60 230h290"/>' +
          '<path d="M60 250h290" opacity=".5"/></g>'
        );
      case "Animation":
        return (
          '<g ' + s + '><path d="M50 220C110 60 200 60 240 150S330 240 360 90" stroke-dasharray="3 7"/></g>' +
          '<g fill="' + stroke + '"><circle cx="50" cy="220" r="6"/><circle cx="130" cy="108" r="6"/>' +
          '<circle cx="212" cy="120" r="6"/><circle cx="280" cy="198" r="6"/><circle cx="360" cy="90" r="6"/></g>'
        );
      case "Texturing":
        return (
          '<g ' + s + '><rect x="110" y="60" width="180" height="180" rx="4"/>' +
          '<path d="M110 120h180M110 180h180M170 60v180M230 60v180" opacity=".55"/>' +
          '<path d="M110 240L290 60" opacity=".5"/></g>'
        );
      case "UV":
        return (
          '<g ' + s + '><rect x="70" y="50" width="260" height="200"/>' +
          '<rect x="90" y="70" width="110" height="80"/><rect x="210" y="70" width="100" height="40"/>' +
          '<rect x="210" y="122" width="100" height="28"/><rect x="90" y="162" width="70" height="70"/>' +
          '<rect x="172" y="162" width="138" height="70"/></g>'
        );
      default:
        return (
          '<g ' + s + '><path d="M200 55l95 55v110l-95 55-95-55V110z"/>' +
          '<path d="M200 55v110l95 55M200 165l-95 55"/>' +
          '<path d="M152 82l95 55M248 82l-95 55" opacity=".5"/></g>'
        );
    }
  }

  function placeholderArt(project, index) {
    var pal = PALETTES[index % PALETTES.length];
    var light = index % PALETTES.length === 2;
    var stroke = light ? "rgba(30,37,72,.55)" : "rgba(255,255,255,.7)";
    var grid = light ? "rgba(30,37,72,.10)" : "rgba(255,255,255,.12)";
    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">' +
      '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="' + pal[0] + '"/><stop offset="1" stop-color="' + pal[1] + '"/></linearGradient>' +
      '<pattern id="p" width="25" height="25" patternUnits="userSpaceOnUse">' +
      '<path d="M25 0H0V25" fill="none" stroke="' + grid + '"/></pattern></defs>' +
      '<rect width="400" height="300" fill="url(#g)"/><rect width="400" height="300" fill="url(#p)"/>' +
      artShape(project.category, stroke) +
      "</svg>";
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }

  function thumbFor(project, index) {
    if (project.thumb) return project.thumb;
    var firstImage = (project.media || []).filter(function (m) {
      return m.type === "image" && m.src;
    })[0];
    return firstImage ? firstImage.src : placeholderArt(project, index);
  }

  /* ---------- Project cards ---------- */

  function buildCard(project, index, mode, onOpen) {
    var media = el(
      "span",
      { class: "card-media" },
      el("img", {
        src: thumbFor(project, index),
        alt: "",
        loading: "lazy",
        width: "400",
        height: "300"
      }),
      el("span", { class: "card-view", text: "View project" })
    );

    var body = [
      media,
      el("h3", { text: project.title }),
      el("p", { class: "card-meta", text: project.category + (project.year ? ", " + project.year : "") }),
      el("p", { class: "card-sub", text: project.summary || "" })
    ];

    var hit;
    if (mode === "link") {
      hit = el.apply(null, ["a", { class: "card-hit", href: "projects.html?open=" + encodeURIComponent(project.slug) }].concat(body));
    } else {
      hit = el.apply(null, ["button", { class: "card-hit", type: "button", "aria-haspopup": "dialog" }].concat(body));
      hit.addEventListener("click", function () {
        onOpen(project);
      });
    }

    var li = el("li", { class: "card", "data-reveal": true }, hit);
    li.setAttribute("data-category", project.category);
    return li;
  }

  function indexOfProject(project) {
    return PROJECTS.indexOf(project);
  }

  /* ---------- Lightbox ---------- */

  var lightbox = null;

  function buildLightbox() {
    var dlg = el("dialog", { class: "lightbox", "aria-labelledby": "lb-title" });
    var close = el("button", { class: "lb-close", type: "button", "aria-label": "Close project", text: "×" });
    var stage = el("div", { class: "lb-stage" });
    var thumbs = el("div", { class: "lb-thumbs", role: "group", "aria-label": "Project media" });
    var title = el("h2", { id: "lb-title" });
    var meta = el("p", { class: "lb-meta" });
    var desc = el("p");
    var facts = el("dl", { class: "lb-facts" });
    var prev = el("button", { class: "btn btn--ghost", type: "button", text: "Previous project" });
    var next = el("button", { class: "btn btn--ghost", type: "button", text: "Next project" });

    dlg.appendChild(close);
    dlg.appendChild(
      el(
        "div",
        { class: "lb-body" },
        el("div", { class: "lb-media" }, stage, thumbs),
        el("div", { class: "lb-info" }, title, meta, desc, facts, el("div", { class: "lb-nav" }, prev, next))
      )
    );
    document.body.appendChild(dlg);

    var state = { list: [], pos: 0, mediaPos: 0 };

    function mediaNode(project, item, idx) {
      var label = (item && item.alt) || project.title;
      if (!item) {
        return el("img", { src: placeholderArt(project, indexOfProject(project)), alt: project.title + " placeholder artwork" });
      }
      if (item.type === "video") {
        return el("video", { src: item.src, controls: true, playsinline: true, preload: "metadata", "aria-label": label });
      }
      if (item.type === "sketchfab") {
        return el("iframe", {
          src: "https://sketchfab.com/models/" + encodeURIComponent(item.id) + "/embed",
          title: label,
          allow: "autoplay; fullscreen; xr-spatial-tracking",
          allowfullscreen: true,
          loading: "lazy"
        });
      }
      if (item.type === "embed") {
        return el("iframe", { src: item.src, title: label, allowfullscreen: true, loading: "lazy" });
      }
      return el("img", { src: item.src, alt: label });
    }

    function showMedia(project, idx) {
      var items = project.media || [];
      state.mediaPos = idx;
      stage.replaceChildren(mediaNode(project, items[idx], idx));
      $$("button", thumbs).forEach(function (b, i) {
        b.setAttribute("aria-current", i === idx ? "true" : "false");
      });
    }

    function render() {
      var project = state.list[state.pos];
      var items = project.media || [];
      title.textContent = project.title;
      meta.textContent = project.category + (project.year ? ", " + project.year : "");
      desc.textContent = project.description || project.summary || "";

      facts.replaceChildren();
      [["Role", project.role], ["Tools", (project.tools || []).join(", ")]].forEach(function (pair) {
        if (!pair[1]) return;
        facts.appendChild(el("dt", { text: pair[0] }));
        facts.appendChild(el("dd", { text: pair[1] }));
      });

      thumbs.replaceChildren();
      if (items.length > 1) {
        items.forEach(function (item, i) {
          var inner =
            item.type === "image"
              ? el("img", { src: item.src, alt: "" })
              : document.createTextNode(item.type === "video" ? "Video" : "3D");
          var b = el("button", { type: "button", "aria-label": "Show media " + (i + 1) + " of " + items.length }, inner);
          b.addEventListener("click", function () {
            showMedia(project, i);
          });
          thumbs.appendChild(b);
        });
        thumbs.hidden = false;
      } else {
        thumbs.hidden = true;
      }

      showMedia(project, 0);
      var multiple = state.list.length > 1;
      prev.hidden = !multiple;
      next.hidden = !multiple;
    }

    function step(delta) {
      state.pos = (state.pos + delta + state.list.length) % state.list.length;
      render();
    }

    prev.addEventListener("click", function () {
      step(-1);
    });
    next.addEventListener("click", function () {
      step(1);
    });
    close.addEventListener("click", function () {
      dlg.close();
    });
    dlg.addEventListener("click", function (e) {
      if (e.target === dlg) dlg.close();
    });
    dlg.addEventListener("close", function () {
      stage.replaceChildren();
    });
    dlg.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft" && state.list.length > 1 && e.target.tagName !== "VIDEO") step(-1);
      if (e.key === "ArrowRight" && state.list.length > 1 && e.target.tagName !== "VIDEO") step(1);
    });

    return {
      open: function (project, list) {
        state.list = list && list.length ? list : [project];
        state.pos = Math.max(0, state.list.indexOf(project));
        render();
        if (!dlg.open) dlg.showModal();
      }
    };
  }

  function openProject(project, list) {
    if (!lightbox) lightbox = buildLightbox();
    lightbox.open(project, list);
  }

  /* ---------- Home: featured work ---------- */

  function initFeatured() {
    var host = $("[data-featured]");
    if (!host) return;
    var picks = PROJECTS.filter(function (p) {
      return p.featured;
    }).slice(0, 3);
    if (!picks.length) picks = PROJECTS.slice(0, 3);
    picks.forEach(function (p) {
      host.appendChild(buildCard(p, indexOfProject(p), "link"));
    });
    observeReveal(host);
  }

  /* ---------- Projects page ---------- */

  var CATEGORY_ORDER = ["Modeling", "Environment", "Texturing", "UV", "Animation"];

  function initProjects() {
    var host = $("[data-projects]");
    if (!host) return;

    var filters = $("[data-filters]");
    var count = $("[data-count]");
    var empty = $("[data-empty]");

    if (!PROJECTS.length) {
      if (empty) empty.hidden = false;
      if (filters) filters.hidden = true;
      return;
    }

    var cards = PROJECTS.map(function (p, i) {
      var card = buildCard(p, i, "button", function (project) {
        openProject(project, visibleProjects());
      });
      host.appendChild(card);
      return { project: p, node: card };
    });

    var active = "All";

    function visibleProjects() {
      return cards
        .filter(function (c) {
          return !c.node.hidden;
        })
        .map(function (c) {
          return c.project;
        });
    }

    function apply() {
      var shown = 0;
      cards.forEach(function (c) {
        var match = active === "All" || c.project.category === active;
        c.node.hidden = !match;
        if (match) shown++;
      });
      if (count) {
        count.textContent =
          active === "All"
            ? "Showing all " + PROJECTS.length + " projects"
            : "Showing " + shown + " of " + PROJECTS.length + " projects in " + active;
      }
    }

    if (filters) {
      var present = CATEGORY_ORDER.filter(function (c) {
        return PROJECTS.some(function (p) {
          return p.category === c;
        });
      });
      PROJECTS.forEach(function (p) {
        if (present.indexOf(p.category) === -1) present.push(p.category);
      });

      ["All"].concat(present).forEach(function (name) {
        var chip = el("button", { class: "chip", type: "button", "aria-pressed": name === "All" ? "true" : "false", text: name });
        chip.addEventListener("click", function () {
          active = name;
          $$(".chip", filters).forEach(function (c) {
            c.setAttribute("aria-pressed", c === chip ? "true" : "false");
          });
          apply();
        });
        filters.appendChild(chip);
      });
    }

    apply();
    observeReveal(host);

    var wanted = new URLSearchParams(window.location.search).get("open");
    if (wanted) {
      var match = PROJECTS.filter(function (p) {
        return p.slug === wanted;
      })[0];
      if (match) openProject(match, visibleProjects());
    }
  }

  /* ---------- Contact form ---------- */

  function initContact() {
    var form = $("[data-contact-form]");
    if (!form) return;
    var status = $("[data-form-status]", form);

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!SITE.email) {
        status.textContent = "The contact email has not been set up on this site yet.";
        return;
      }
      var data = new FormData(form);
      var name = (data.get("name") || "").toString().trim();
      var email = (data.get("email") || "").toString().trim();
      var company = (data.get("company") || "").toString().trim();
      var message = (data.get("message") || "").toString().trim();

      var body = message + "\n\n" + name + (company ? ", " + company : "") + "\n" + email;
      var subject = "Portfolio inquiry from " + name;
      status.textContent = "Opening your email app with the message filled in.";
      window.location.href =
        "mailto:" + SITE.email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    });
  }

  /* ---------- Start ---------- */

  applySettings();
  initNav();
  initFeatured();
  initProjects();
  initContact();
  observeReveal(document);
})();
