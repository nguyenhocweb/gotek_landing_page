(() => {
  // gotek/js/components/header.js
  function initHeaderLogic() {
    const header = document.getElementById("main-header");
    if (!header) return;
    let lastScrollY = window.scrollY;
    window.addEventListener("scroll", () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        header.classList.add("-translate-y-[150%]");
      } else {
        header.classList.remove("-translate-y-[150%]");
      }
      lastScrollY = currentScrollY;
    });
    const menuBtn = document.getElementById("mobile-menu-btn");
    const closeBtn = document.getElementById("mobile-menu-close");
    const overlay = document.getElementById("mobile-menu-overlay");
    const drawer = overlay ? overlay.querySelector(".mobile-menu-drawer") : null;
    const mobileLinks = document.querySelectorAll(".mobile-nav-links a");
    let isMenuOpen = false;
    const toggleMenu = () => {
      isMenuOpen = !isMenuOpen;
      const spans = menuBtn ? menuBtn.querySelectorAll("span") : [];
      if (isMenuOpen) {
        if (spans.length >= 3) {
          spans[0].classList.add("translate-y-2", "rotate-45");
          spans[1].classList.add("opacity-0");
          spans[2].classList.add("-translate-y-2", "-rotate-45");
        }
        overlay.classList.remove("invisible");
        overlay.classList.add("is-active");
        if (window.gsap) {
          gsap.to(overlay, { opacity: 1, duration: 0.25 });
          if (drawer) {
            gsap.fromTo(
              drawer,
              { x: "100%" },
              { x: "0%", duration: 0.35, ease: "power3.out" }
            );
          }
          gsap.fromTo(
            ".mobile-nav-links a",
            { x: 25, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.25, stagger: 0.04, ease: "power2.out", delay: 0.08 }
          );
        }
      } else {
        if (spans.length >= 3) {
          spans[0].classList.remove("translate-y-2", "rotate-45");
          spans[1].classList.remove("opacity-0");
          spans[2].classList.remove("-translate-y-2", "-rotate-45");
        }
        if (window.gsap) {
          if (drawer) {
            gsap.to(drawer, {
              x: "100%",
              duration: 0.25,
              ease: "power2.in"
            });
          }
          gsap.to(overlay, {
            opacity: 0,
            duration: 0.25,
            ease: "power2.in",
            onComplete: () => {
              overlay.classList.add("invisible");
              overlay.classList.remove("is-active");
            }
          });
        } else {
          overlay.classList.add("invisible");
          overlay.classList.remove("is-active");
        }
      }
    };
    if (menuBtn) {
      menuBtn.addEventListener("click", toggleMenu);
    }
    if (closeBtn) {
      closeBtn.addEventListener("click", toggleMenu);
    }
    if (overlay) {
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay && isMenuOpen) {
          toggleMenu();
        }
      });
    }
    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => {
        if (isMenuOpen) toggleMenu();
      });
    });
    const allLangBtns = document.querySelectorAll(".lang-switcher button, .mobile-lang-switcher button");
    allLangBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const langText = btn.textContent.trim().toUpperCase();
        const isVi = langText === "VI" || langText === "VN";
        allLangBtns.forEach((b) => {
          const bText = b.textContent.trim().toUpperCase();
          const bIsVi = bText === "VI" || bText === "VN";
          const shouldBeActive = isVi === bIsVi;
          if (shouldBeActive) {
            b.classList.add("active");
            if (b.classList.contains("lang-btn")) {
              b.classList.add("bg-[#0055FF]", "text-white");
              b.classList.remove("text-navy/70");
            } else {
              b.classList.add("text-navy");
            }
          } else {
            b.classList.remove("active");
            if (b.classList.contains("lang-btn")) {
              b.classList.remove("bg-[#0055FF]", "text-white");
              b.classList.add("text-navy/70");
            } else {
              b.classList.remove("text-navy");
            }
          }
        });
      });
    });
  }

  // gotek/js/components/magneticBtn.js
  function initMagneticButtons() {
    const magneticBtns = document.querySelectorAll(".magnetic-btn");
    magneticBtns.forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        if (window.gsap) {
          gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.4, ease: "power2.out" });
        }
      });
      btn.addEventListener("mouseleave", () => {
        if (window.gsap) {
          gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.3)" });
        } else {
          btn.style.transform = "translate(0, 0)";
        }
      });
    });
  }

  // gotek/js/utils/helpers.js
  var $ = (selector, context = document) => context.querySelector(selector);
  var $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));

  // gotek/js/components/form.js
  function initLeadForm() {
    const form = $("#leadConsultationForm");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const fullName = $("#formFullName")?.value.trim();
      const phone = $("#formPhone")?.value.trim();
      const email = $("#formEmail")?.value.trim();
      const service = $("#formService")?.value;
      const message = $("#formMessage")?.value.trim();
      if (!fullName || !phone) {
        alert("Vui l\xF2ng nh\u1EADp \u0111\u1EA7y \u0111\u1EE7 H\u1ECD t\xEAn v\xE0 S\u1ED1 \u0111i\u1EC7n tho\u1EA1i!");
        return;
      }
      const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
      if (!phoneRegex.test(phone)) {
        alert("S\u1ED1 \u0111i\u1EC7n tho\u1EA1i kh\xF4ng h\u1EE3p l\u1EC7! Vui l\xF2ng nh\u1EADp \u0111\xFAng 10 s\u1ED1.");
        return;
      }
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = "\u0110ang x\u1EED l\xFD y\xEAu c\u1EA7u...";
      setTimeout(() => {
        alert(`\u{1F389} C\u1EA3m \u01A1n ${fullName}! Y\xEAu c\u1EA7u t\u01B0 v\u1EA5n d\u1ECBch v\u1EE5 [${service}] c\u1EE7a b\u1EA1n \u0111\xE3 \u0111\u01B0\u1EE3c g\u1EEDi \u0111\u1EBFn Gotek. Chuy\xEAn vi\xEAn k\u1EF9 thu\u1EADt s\u1EBD li\xEAn h\u1EC7 l\u1EA1i trong v\xF2ng 15 ph\xFAt!`);
        form.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }, 800);
    });
  }

  // gotek/js/components/tabs.js
  function initCapabilityTabs() {
    const tabButtons = document.querySelectorAll(".matrix-tab-btn");
    const statNum = document.getElementById("matrixBigStat");
    const statTitle = document.getElementById("matrixStatTitle");
    const statSub = document.getElementById("matrixStatSub");
    const checklist = document.getElementById("matrixChecklist");
    if (!tabButtons.length || !statNum || !statTitle || !statSub || !checklist) return;
    const tabContentData = {
      uptime: {
        num: "99.9<span>%</span>",
        title: "Chu\u1EA9n Kh\u1EA3 D\u1EE5ng H\u1EC7 Th\u1ED1ng Uptime",
        sub: "H\u1EA1 t\u1EA7ng Multi-Zone ch\u1ECBu t\u1EA3i cao",
        points: [
          "T\u1EF1 \u0111\u1ED9ng c\xE2n b\u1EB1ng t\u1EA3i (Load Balancing) kh\xF4ng gi\xE1n \u0111o\u1EA1n giao d\u1ECBch khi l\u01B0u l\u01B0\u1EE3ng t\u0103ng \u0111\u1ED9t bi\u1EBFn.",
          "Gi\xE1m s\xE1t s\u1EE9c kh\u1ECFe server 24/7 v\u1EDBi c\u1EA3nh b\xE1o th\u1EDDi gian th\u1EF1c v\u1EC1 Telegram/Slack c\u1EE7a Tech Lead.",
          "Sao l\u01B0u d\u1EEF li\u1EC7u t\u1EF1 \u0111\u1ED9ng h\xE0ng ng\xE0y (Daily Cloud Backup) v\xE0 s\u1EB5n s\xE0ng kh\xF4i ph\u1EE5c trong v\xF2ng 15 ph\xFAt."
        ]
      },
      delivery: {
        num: "&gt;90<span>%</span>",
        title: "K\u1EF7 Lu\u1EADt B\xE0n Giao \u0110\xFAng Ti\u1EBFn \u0110\u1ED9 Sprint",
        sub: "H\u01A1n 30+ s\u1EA3n ph\u1EA9m s\u1ED1 \u0111\xE3 nghi\u1EC7m thu th\u1EF1c t\u1EBF",
        points: [
          "Ph\xE2n b\u1ED5 c\xF4ng vi\u1EC7c chi ti\u1EBFt qua Jira / GitHub Projects, c\u1EADp nh\u1EADt ti\u1EBFn \u0111\u1ED9 c\xF4ng khai cho kh\xE1ch h\xE0ng.",
          "Chu k\u1EF3 Sprint 2 tu\u1EA7n r\xF5 r\xE0ng: L\u1EADp k\u1EBF ho\u1EA1ch -> L\u1EADp tr\xECnh -> Ki\u1EC3m th\u1EED QA -> Demo s\u1EA3n ph\u1EA9m ch\u1EA1y th\u1EADt.",
          "Cam k\u1EBFt kh\xF4ng ph\xE1t sinh chi ph\xED ho\u1EB7c t\xEDnh n\u0103ng ngo\xE0i ph\u1EA1m vi \u0111\xE3 th\u1ED1ng nh\u1EA5t trong t\xE0i li\u1EC7u SRS."
        ]
      },
      legal: {
        num: "100<span>%</span>",
        title: "B\xE0n Giao M\xE3 Ngu\u1ED3n S\u1EA1ch & To\xE0n Quy\u1EC1n",
        sub: "B\u1EA3o v\u1EC7 ph\xE1p l\xFD v\xE0 t\xE0i s\u1EA3n s\u1ED1 cho doanh nghi\u1EC7p",
        points: [
          "B\xE0n giao tr\u1ECDn v\u1EB9n to\xE0n b\u1ED9 kho l\u01B0u tr\u1EEF Git Repo, t\xE0i li\u1EC7u ki\u1EBFn tr\xFAc k\u1EF9 thu\u1EADt v\xE0 h\u01B0\u1EDBng d\u1EABn tri\u1EC3n khai.",
          "K\xFD k\u1EBFt h\u1EE3p \u0111\u1ED3ng b\u1EA3o m\u1EADt th\xF4ng tin (NDA) c\xF3 gi\xE1 tr\u1ECB ph\xE1p l\xFD cao nh\u1EA5t tr\u01B0\u1EDBc khi ti\u1EBFp c\u1EADn d\u1EEF li\u1EC7u.",
          "B\u1EA3o h\xE0nh h\u1EC7 th\u1ED1ng v\xE0 v\xE1 l\u1ED7i k\u1EF9 thu\u1EADt mi\u1EC5n ph\xED trong v\xF2ng 12 th\xE1ng k\u1EC3 t\u1EEB ng\xE0y nghi\u1EC7m thu."
        ]
      }
    };
    tabButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const tabKey = btn.getAttribute("data-tab");
        if (!tabKey || !tabContentData[tabKey]) return;
        tabButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const data = tabContentData[tabKey];
        const card = document.getElementById("capabilityTabDisplay");
        if (card) {
          card.style.opacity = "0.4";
          setTimeout(() => {
            statNum.innerHTML = data.num;
            statTitle.textContent = data.title;
            statSub.textContent = data.sub;
            checklist.innerHTML = data.points.map((p) => `
            <li>
              <span class="matrix-check-icon">&#10022;</span>
              <span>${p}</span>
            </li>
          `).join("");
            card.style.opacity = "1";
          }, 150);
        }
      });
    });
  }

  // gotek/js/components/processConnectors.js?v=24
  function initProcessConnectors() {
    const wrap = document.getElementById("staircaseWrap");
    const group = document.getElementById("staircasePathGroup");
    const defs = document.getElementById("staircaseDefs");
    if (!wrap || !group || !defs) return;
    const cardIds = ["card1", "card2", "card3", "card4", "card5", "card6"];
    const cards = cardIds.map((id) => document.getElementById(id)).filter(Boolean);
    if (cards.length !== 6) return;
    const cardStates = [false, false, false, false, false, false];
    let connectors = [];
    function getCardRect(id, wrapRect) {
      const el = document.getElementById(id);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return {
        el,
        left: r.left - wrapRect.left,
        top: r.top - wrapRect.top,
        right: r.right - wrapRect.left,
        bottom: r.bottom - wrapRect.top,
        width: r.width,
        height: r.height,
        centerX: r.left - wrapRect.left + r.width / 2
      };
    }
    function createCurveWithMask(x1, y1, x2, y2, index, groupEl, defsEl, isMobile = false) {
      let d;
      if (isMobile) {
        const dy = y2 - y1;
        const cp1X = x1;
        const cp1Y = y1 + dy * 0.52;
        const cp2X = x2;
        const cp2Y = y2 - dy * 0.48;
        d = `M ${x1} ${y1} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${x2} ${y2}`;
      } else {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const cp1X = x1 + dx * 0.52;
        const cp1Y = y1;
        const cp2X = x2;
        const cp2Y = y2 - Math.max(dy * 0.44, 36);
        d = `M ${x1} ${y1} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${x2} ${y2}`;
      }
      const maskId = `staircaseMask_${index}`;
      let mask = defsEl.querySelector(`#${maskId}`);
      if (!mask) {
        mask = document.createElementNS("http://www.w3.org/2000/svg", "mask");
        mask.setAttribute("id", maskId);
        mask.setAttribute("maskUnits", "userSpaceOnUse");
        defsEl.appendChild(mask);
      }
      mask.innerHTML = "";
      const maskPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
      maskPath.setAttribute("d", d);
      maskPath.setAttribute("stroke", "#ffffff");
      maskPath.setAttribute("stroke-width", "20");
      maskPath.setAttribute("fill", "none");
      maskPath.setAttribute("stroke-linecap", "round");
      mask.appendChild(maskPath);
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", d);
      path.setAttribute("class", "staircase-connector-path");
      path.setAttribute("mask", `url(#${maskId})`);
      groupEl.appendChild(path);
      const len = Math.ceil(maskPath.getTotalLength() || 450);
      maskPath.style.strokeDasharray = `${len} ${len}`;
      const item = {
        maskPath,
        path,
        length: len,
        isShown: false,
        reveal(duration = 380) {
          this.isShown = true;
          maskPath.style.transition = `stroke-dashoffset ${duration}ms cubic-bezier(0.35, 0, 0.25, 1)`;
          maskPath.style.strokeDashoffset = "0";
          setTimeout(() => {
            if (this.isShown) {
              path.setAttribute("marker-end", "url(#arrowhead)");
            }
          }, duration * 0.75);
        },
        hide(duration = 260) {
          this.isShown = false;
          path.removeAttribute("marker-end");
          maskPath.style.transition = `stroke-dashoffset ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
          maskPath.style.strokeDashoffset = `${len}`;
        },
        reset() {
          this.isShown = false;
          maskPath.style.transition = "none";
          maskPath.style.strokeDashoffset = `${len}`;
          path.removeAttribute("marker-end");
        },
        instantShow() {
          this.isShown = true;
          maskPath.style.transition = "none";
          maskPath.style.strokeDashoffset = "0";
          path.setAttribute("marker-end", "url(#arrowhead)");
        }
      };
      return item;
    }
    function renderConnectors() {
      wrap.classList.add("is-measuring");
      const wrapRect = wrap.getBoundingClientRect();
      const svg = document.getElementById("staircaseSvg");
      if (svg && wrapRect.width && wrapRect.height) {
        svg.setAttribute("viewBox", `0 0 ${wrapRect.width} ${wrapRect.height}`);
        svg.setAttribute("width", wrapRect.width);
        svg.setAttribute("height", wrapRect.height);
      }
      group.innerHTML = "";
      const r1 = getCardRect("card1", wrapRect);
      const r2 = getCardRect("card2", wrapRect);
      const r3 = getCardRect("card3", wrapRect);
      const r4 = getCardRect("card4", wrapRect);
      const r5 = getCardRect("card5", wrapRect);
      const r6 = getCardRect("card6", wrapRect);
      wrap.classList.remove("is-measuring");
      if (!r1 || !r2 || !r3 || !r4 || !r5 || !r6) return;
      const isPhone = window.innerWidth <= 640;
      if (isPhone) {
        const pLeft = 0.3;
        const pRight = 0.7;
        connectors = [
          createCurveWithMask(r1.left + r1.width * pLeft, r1.bottom, r2.left + r2.width * pRight, r2.top - 4, 0, group, defs, true),
          createCurveWithMask(r2.left + r2.width * pRight, r2.bottom, r3.left + r3.width * pLeft, r3.top - 4, 1, group, defs, true),
          createCurveWithMask(r3.left + r3.width * pLeft, r3.bottom, r4.left + r4.width * pRight, r4.top - 4, 2, group, defs, true),
          createCurveWithMask(r4.left + r4.width * pRight, r4.bottom, r5.left + r5.width * pLeft, r5.top - 4, 3, group, defs, true),
          createCurveWithMask(r5.left + r5.width * pLeft, r5.bottom, r6.left + r6.width * pRight, r6.top - 4, 4, group, defs, true)
        ];
      } else {
        connectors = [
          createCurveWithMask(r1.right, r1.top + r1.height * 0.38, r2.centerX, r2.top - 3, 0, group, defs, false),
          createCurveWithMask(r2.left, Math.max(r2.top + r2.height * 0.42, r1.bottom + 12), r3.centerX, r3.top - 3, 1, group, defs, false),
          createCurveWithMask(r3.right, r3.top + r3.height * 0.38, r4.centerX, r4.top - 3, 2, group, defs, false),
          createCurveWithMask(r4.left, Math.max(r4.top + r4.height * 0.42, r3.bottom + 12), r5.centerX, r5.top - 3, 3, group, defs, false),
          createCurveWithMask(r5.right, r5.top + r5.height * 0.38, r6.centerX, r6.top - 3, 4, group, defs, false)
        ];
      }
      connectors.forEach((conn, cIdx) => {
        if (cardStates[cIdx + 1]) {
          conn.instantShow();
        } else {
          conn.reset();
        }
      });
    }
    wrap.classList.add("has-js-anim");
    renderConnectors();
    setTimeout(renderConnectors, 120);
    setTimeout(renderConnectors, 450);
    function revealStep(idx) {
      if (cardStates[idx]) return;
      for (let i = 0; i < idx; i++) {
        if (!cardStates[i]) {
          cardStates[i] = true;
          cards[i]?.classList.add("is-revealed");
          if (i > 0 && connectors[i - 1]) {
            connectors[i - 1].instantShow();
          }
        }
      }
      cardStates[idx] = true;
      const card = cards[idx];
      if (!card) return;
      if (idx === 0) {
        card.classList.add("is-revealed");
      } else {
        const connIdx = idx - 1;
        if (connectors[connIdx]) {
          connectors[connIdx].reveal(380);
        }
        setTimeout(() => {
          if (cardStates[idx]) {
            card.classList.add("is-revealed");
          }
        }, 150);
      }
    }
    function hideStep(idx) {
      if (!cardStates[idx]) return;
      for (let j = idx; j < cards.length; j++) {
        if (cardStates[j]) {
          cardStates[j] = false;
          cards[j]?.classList.remove("is-revealed");
          if (j > 0 && connectors[j - 1]) {
            connectors[j - 1].hide(240);
          }
        }
      }
    }
    if ("IntersectionObserver" in window) {
      const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const card = entry.target;
          const idx = cards.indexOf(card);
          if (idx === -1) return;
          if (entry.isIntersecting) {
            revealStep(idx);
          } else {
            if (entry.boundingClientRect.top > 0) {
              hideStep(idx);
            }
          }
        });
      }, {
        threshold: 0.18,
        rootMargin: "0px 0px -40px 0px"
      });
      cards.forEach((c) => cardObserver.observe(c));
    } else {
      cards.forEach((c) => c.classList.add("is-revealed"));
      connectors.forEach((c) => c.instantShow());
    }
    window.addEventListener("resize", renderConnectors);
    if (window.ResizeObserver) {
      const ro = new ResizeObserver(() => renderConnectors());
      ro.observe(wrap);
    }
    if (document.fonts) {
      document.fonts.ready.then(renderConnectors);
    }
  }

  // gotek/js/components/circuitConnectors.js?v=1
  function initCircuitConnectors() {
    const wrap = document.getElementById("circuitWrapper");
    const svg = document.getElementById("circuitSvg");
    if (!wrap || !svg) return;
    function updateLines() {
      if (window.innerWidth < 768) {
        svg.innerHTML = "";
        return;
      }
      const wrapRect = wrap.getBoundingClientRect();
      if (wrapRect.width === 0 || wrapRect.height === 0) return;
      function getCard(id) {
        const el = document.getElementById(id);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return {
          el,
          left: r.left - wrapRect.left,
          top: r.top - wrapRect.top,
          right: r.right - wrapRect.left,
          bottom: r.bottom - wrapRect.top,
          width: r.width,
          height: r.height,
          centerX: r.left - wrapRect.left + r.width / 2,
          centerY: r.top - wrapRect.top + r.height / 2
        };
      }
      const c1 = getCard("circuit-uiux");
      const c2 = getCard("circuit-frontend");
      const c3 = getCard("circuit-mobile");
      const c4 = getCard("circuit-backend");
      const c5 = getCard("circuit-cloud");
      const c6 = getCard("circuit-ai");
      const c7 = getCard("circuit-seo");
      if (!c1 || !c2 || !c3 || !c4 || !c5 || !c6 || !c7) return;
      svg.setAttribute("viewBox", `0 0 ${wrapRect.width} ${wrapRect.height}`);
      const paths = [
        // 1. UI/UX -> Front-end (Đường kẻ dọc)
        {
          id: "line-uiux-frontend",
          cards: ["circuit-uiux", "circuit-frontend"],
          d: `M ${c1.centerX} ${c1.bottom} L ${c2.centerX} ${c2.top}`
        },
        // 2. Front-end -> Backend (L-step: Đi xuống rồi rẽ phải vào Backend)
        {
          id: "line-frontend-backend",
          cards: ["circuit-frontend", "circuit-backend"],
          d: `M ${c2.centerX} ${c2.bottom} V ${c4.centerY} H ${c4.left}`
        },
        // 3. Mobile App -> Backend (Đường kẻ dọc)
        {
          id: "line-mobile-backend",
          cards: ["circuit-mobile", "circuit-backend"],
          d: `M ${c3.centerX} ${c3.bottom} L ${c4.centerX} ${c4.top}`
        },
        // 4. Mobile App -> AI (Đường kẻ ngang)
        {
          id: "line-mobile-ai",
          cards: ["circuit-mobile", "circuit-ai"],
          d: `M ${c3.right} ${c6.centerY} L ${c6.left} ${c6.centerY}`
        },
        // 5. Cloud & DevOps -> AI (Đường kẻ dọc)
        {
          id: "line-cloud-ai",
          cards: ["circuit-cloud", "circuit-ai"],
          d: `M ${c5.centerX} ${c5.bottom} L ${c6.centerX} ${c6.top}`
        },
        // 6. AI -> SEO (Đường kẻ dọc)
        {
          id: "line-ai-seo",
          cards: ["circuit-ai", "circuit-seo"],
          d: `M ${c6.centerX} ${c6.bottom} L ${c7.centerX} ${c7.top}`
        },
        // 7. Backend -> SEO (Đường kẻ ngang)
        {
          id: "line-backend-seo",
          cards: ["circuit-backend", "circuit-seo"],
          d: `M ${c4.right} ${c4.centerY} L ${c7.left} ${c4.centerY}`
        }
      ];
      svg.innerHTML = paths.map((p) => `
      <path id="${p.id}" class="circuit-line-path" data-cards="${p.cards.join(" ")}" d="${p.d}" />
    `).join("");
      const allCards = [c1.el, c2.el, c3.el, c4.el, c5.el, c6.el, c7.el];
      allCards.forEach((card) => {
        card.onmouseenter = () => {
          const cardId = card.id;
          const matchingLines = svg.querySelectorAll(`[data-cards~="${cardId}"]`);
          matchingLines.forEach((line) => line.classList.add("active"));
        };
        card.onmouseleave = () => {
          const matchingLines = svg.querySelectorAll(".circuit-line-path.active");
          matchingLines.forEach((line) => line.classList.remove("active"));
        };
      });
    }
    updateLines();
    window.addEventListener("resize", updateLines);
    window.addEventListener("orientationchange", updateLines);
    if ("fonts" in document) {
      document.fonts.ready.then(updateLines);
    }
    if ("ResizeObserver" in window) {
      new ResizeObserver(updateLines).observe(wrap);
    }
    setTimeout(updateLines, 600);
    setTimeout(updateLines, 1200);
  }

  // gotek/js/components/counter.js?v=3
  function initMetricCounters() {
    const container = document.querySelector(".partner-metrics-strip");
    const items = document.querySelectorAll(".partner-metrics-strip .metric-number");
    if (!items.length) return;
    const config = [
      { target: 10, suffix: "+", prefix: "", decimals: 0 },
      { target: 1e3, suffix: "+", prefix: "", decimals: 0 },
      { target: 24, suffix: "/7", prefix: "", decimals: 0 }
    ];
    items.forEach((item, index) => {
      const cfg = config[index];
      if (cfg) {
        const initialVal = 0 .toFixed(cfg.decimals);
        item.textContent = `${cfg.prefix}${initialVal}${cfg.suffix}`;
      }
    });
    let hasAnimated = false;
    function animateCountUp() {
      if (hasAnimated) return;
      hasAnimated = true;
      const duration = 2e3;
      const startTime = performance.now();
      function easeOutExpo(t) {
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      }
      function step(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeVal = easeOutExpo(progress);
        items.forEach((item, index) => {
          const cfg = config[index];
          if (!cfg) return;
          if (progress < 1) {
            const current = (cfg.target * easeVal).toFixed(cfg.decimals);
            item.textContent = `${cfg.prefix}${current}${cfg.suffix}`;
          } else {
            const final = cfg.target.toFixed(cfg.decimals);
            item.textContent = `${cfg.prefix}${final}${cfg.suffix}`;
          }
        });
        if (progress < 1) {
          requestAnimationFrame(step);
        }
      }
      requestAnimationFrame(step);
    }
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCountUp();
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.2,
        rootMargin: "0px 0px -50px 0px"
      });
      observer.observe(container || items[0]);
    } else {
      animateCountUp();
    }
  }

  // gotek/js/components/scrollAnimations.js?v=14
  if (typeof document !== "undefined" && document.body) {
    document.body.classList.add("has-scroll-animations");
  }
  function initAboutScrollAnimation() {
    if (typeof document !== "undefined" && document.body) {
      document.body.classList.add("has-scroll-animations");
    }
    const aboutSec = document.querySelector(".about-partner-section");
    if (!aboutSec) return;
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            aboutSec.classList.add("animate-in");
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.15,
        rootMargin: "0px 0px -40px 0px"
      });
      observer.observe(aboutSec);
    } else {
      aboutSec.classList.add("animate-in");
    }
  }
  function initWhyChooseScrollAnimation() {
    const section = document.querySelector(".why-choose-section") || document.querySelector(".solutions-bento-section");
    if (!section) return;
    const header = section.querySelector(".solutions-header");
    const leftImage = section.querySelector(".why-choose-left-image");
    const items = section.querySelectorAll(".why-feature-item");
    const borderedCol = section.querySelector(".why-feature-col--bordered");
    const triggerAnimation = () => {
      section.classList.add("animate-in", "animate-header-in");
      if (leftImage) leftImage.classList.add("animate-in");
      if (borderedCol) borderedCol.classList.add("animate-in");
      items.forEach((item, index) => {
        setTimeout(() => {
          item.classList.add("animate-in");
        }, 50 + index * 75);
      });
    };
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            triggerAnimation();
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px"
      });
      observer.observe(section);
    } else {
      triggerAnimation();
    }
    setTimeout(() => {
      if (!section.classList.contains("animate-in")) {
        triggerAnimation();
      }
    }, 2500);
  }
  function initBentoScrollAnimation() {
    initWhyChooseScrollAnimation();
  }
  function initEcosystemScrollAnimation() {
    const section = document.querySelector(".ecosystem-teams-section");
    const header = document.querySelector(".ecosystem-teams-header");
    const rows = document.querySelectorAll(".ecosystem-zigzag-row");
    if ("IntersectionObserver" in window) {
      if (header && section) {
        const headerObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              section.classList.add("animate-header-in");
              headerObserver.unobserve(entry.target);
            }
          });
        }, {
          threshold: 0.15,
          rootMargin: "0px 0px -40px 0px"
        });
        headerObserver.observe(header);
      }
      if (rows.length) {
        const rowObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("animate-in");
              rowObserver.unobserve(entry.target);
            }
          });
        }, {
          threshold: 0.05,
          rootMargin: "60px 0px 60px 0px"
        });
        rows.forEach((row) => rowObserver.observe(row));
      }
    } else {
      if (section) section.classList.add("animate-header-in");
      rows.forEach((row) => row.classList.add("animate-in"));
    }
  }
  function initSolutionsHeaderAnimation() {
    initWhyChooseScrollAnimation();
  }
  function initProjectsScrollAnimation() {
    const section = document.querySelector(".featured-projects-section");
    if (!section) return;
    const header = document.querySelector(".projects-header");
    const content = document.querySelector("#projectsContainer") || document.querySelector(".project-3-saas-web-hatang");
    if ("IntersectionObserver" in window) {
      if (header) {
        const headerObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              section.classList.add("animate-header-in");
              headerObserver.unobserve(entry.target);
            }
          });
        }, {
          threshold: 0.15,
          rootMargin: "0px 0px -40px 0px"
        });
        headerObserver.observe(header);
      }
      if (content) {
        const contentObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              section.classList.add("animate-content-in");
              contentObserver.unobserve(entry.target);
            }
          });
        }, {
          threshold: 0.1,
          rootMargin: "0px 0px -40px 0px"
        });
        contentObserver.observe(content);
      }
    } else {
      section.classList.add("animate-header-in", "animate-content-in");
    }
  }
  function initPricingScrollAnimation() {
    const section = document.querySelector(".pricing-section");
    if (!section) return;
    const header = document.querySelector(".pricing-header");
    const grid = document.querySelector("#pricingGrid") || document.querySelector(".pricing-grid");
    if ("IntersectionObserver" in window) {
      if (header) {
        const headerObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              section.classList.add("animate-header-in");
              headerObserver.unobserve(entry.target);
            }
          });
        }, {
          threshold: 0.15,
          rootMargin: "0px 0px -40px 0px"
        });
        headerObserver.observe(header);
      }
      if (grid) {
        const gridObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              section.classList.add("animate-content-in");
              gridObserver.unobserve(entry.target);
            }
          });
        }, {
          threshold: 0.1,
          rootMargin: "0px 0px -40px 0px"
        });
        gridObserver.observe(grid);
      }
    } else {
      section.classList.add("animate-header-in", "animate-content-in");
    }
  }

  // gotek/js/components/heroInteractive.js?v=9
  var HERO_PILLARS = {
    default: {
      title: 'Ki\u1EBFn T\u1EA1o N\u1EC1n T\u1EA3ng S\u1ED1, <br /><span class="hero-clean-highlight">Hi\u1EC7u Qu\u1EA3 T\u1ED1i \u0110a &amp; Chu\u1EA9n B\u1EC1n V\u1EEFng.</span>',
      desc: 'Gotek \u0111\u1ED3ng h\xE0nh c\xF9ng doanh nghi\u1EC7p ki\u1EBFn t\u1EA1o website \u0111\u1ED9c b\u1EA3n, ph\xE1t tri\u1EC3n \u1EE9ng d\u1EE5ng di \u0111\u1ED9ng v\xE0 h\u1EC7 th\u1ED1ng SaaS ch\u1ECBu t\u1EA3i cao \u2014 cam k\u1EBFt <strong class="text-blue-accent">m\u01B0\u1EE3t m\xE0 60FPS</strong>, b\u1EA3o m\u1EADt tuy\u1EC7t \u0111\u1ED1i v\xE0 th\xFAc \u0111\u1EA9y chuy\u1EC3n \u0111\u1ED5i th\u1EF1c ch\u1EA5t.'
    },
    tin: {
      title: 'Cam K\u1EBFt \u0110i C\xF9ng <br /><span class="hero-clean-highlight">Tr\xE1ch Nhi\u1EC7m &amp; Ch\u1EEF T\xEDn.</span>',
      desc: 'Trao \u0111\u1ED5i trung th\u1EF1c, <strong class="text-blue-accent">x\xE1c \u0111\u1ECBnh r\xF5 nh\xE2n s\u1EF1 ph\u1EE5 tr\xE1ch</strong> v\xE0 \u0111\u1ED3ng h\xE0nh k\u1EF9 thu\u1EADt xuy\xEAn su\u1ED1t sau b\xE0n giao. Gotek cam k\u1EBFt gi\u1EEF tr\u1ECDn ch\u1EEF T\xEDn trong t\u1EEBng d\xF2ng code v\xE0 ti\u1EBFn \u0111\u1ED9 cam k\u1EBFt \u2014 l\xE0 \u0111i\u1EC3m t\u1EF1a c\xF4ng ngh\u1EC7 tin c\u1EADy, v\u1EEFng ch\u1EAFc cho m\u1ECDi ch\u1EB7ng \u0111\u01B0\u1EDDng t\u0103ng tr\u01B0\u1EDFng c\u1EE7a doanh nghi\u1EC7p.'
    },
    chuan: {
      title: 'L\xE0m \u0110\xFAng Theo <br /><span class="hero-clean-highlight">Ti\xEAu Ch\xED &amp; Chu\u1EA9n M\u1EF1c Cao.</span>',
      desc: 'Th\u1ED1ng nh\u1EA5t ti\xEAu chu\u1EA9n k\u1EF9 thu\u1EADt nghi\xEAm ng\u1EB7t ngay t\u1EEB kh\u1EDFi \u0111\u1EA7u, <strong class="text-blue-accent">ki\u1EC3m th\u1EED kh\u1EAFt khe t\u1EEBng chi ti\u1EBFt</strong> v\xE0 b\xE0n giao h\u1EC7 th\u1ED1ng s\u1EB5n s\xE0ng v\u1EADn h\xE0nh \u1ED5n \u0111\u1ECBnh. M\u1ECDi c\u1EA5u tr\xFAc d\u1EEF li\u1EC7u, giao di\u1EC7n UI/UX v\xE0 b\u1EA3o m\u1EADt \u0111\u1EC1u \u0111\u01B0\u1EE3c chu\u1EA9n h\xF3a b\xE0i b\u1EA3n, lo\u1EA1i b\u1ECF tri\u1EC7t \u0111\u1EC3 r\u1EE7i ro k\u1EF9 thu\u1EADt ng\u1EA7m.'
    },
    tien: {
      title: 'Ch\u1EE7 \u0110\u1ED9ng <br /><span class="hero-clean-highlight">M\u1EDF L\u1ED1i Ti\xEAn Phong.</span>',
      desc: 'Li\xEAn t\u1EE5c h\u1ECDc h\u1ECFi \u0111\xF3n \u0111\u1EA7u xu h\u01B0\u1EDBng, <strong class="text-blue-accent">ch\u1EE7 \u0111\u1ED9ng nghi\xEAn c\u1EE9u v\xE0 l\xE0m ch\u1EE7 c\xF4ng ngh\u1EC7 m\u1EDBi</strong> c\xF3 ki\u1EC3m so\xE1t. Gotek bi\u1EBFn \u0111\u1ED5i nh\u1EEFng ti\u1EBFn b\u1ED9 k\u1EF9 thu\u1EADt ph\u1EE9c t\u1EA1p th\xE0nh c\xE1c c\u1EA3i ti\u1EBFn \u1EE9ng d\u1EE5ng th\u1EF1c t\u1EBF, t\u1EA1o d\u1EF1ng l\u1EE3i th\u1EBF c\u1EA1nh tranh ti\xEAn phong gi\xFAp \u0111\u1ED1i t\xE1c b\u1EE9t ph\xE1 tr\xEAn th\u1ECB tr\u01B0\u1EDDng s\u1ED1.'
    },
    nhan: {
      title: 'C\xF4ng Ngh\u1EC7 B\u1EAFt \u0110\u1EA7u <br /><span class="hero-clean-highlight">T\u1EEB Tr\xE1i Tim Con Ng\u01B0\u1EDDi.</span>',
      desc: 'L\u1EAFng nghe b\u1EB1ng s\u1EF1 t\xF4n tr\u1ECDng, <strong class="text-blue-accent">th\u1EA5u hi\u1EC3u s\xE2u s\u1EAFc b\u1ED1i c\u1EA3nh</strong> v\xE0 x\xE2y d\u1EF1ng h\u1EC7 th\u1ED1ng h\u1ED7 tr\u1EE3 con ng\u01B0\u1EDDi l\xE0m vi\u1EC7c t\u1ED1t h\u01A1n. Ch\xFAng t\xF4i tin r\u1EB1ng c\xF4ng ngh\u1EC7 \u01B0u vi\u1EC7t nh\u1EA5t l\xE0 c\xF4ng ngh\u1EC7 ph\u1EE5c v\u1EE5 \u0111\u1EDDi s\u1ED1ng nh\xE2n v\u0103n, gi\u1EA3i ph\xF3ng s\u1EE9c s\xE1ng t\u1EA1o v\xE0 t\xF4n vinh n\u0103ng l\u1EF1c c\u1EE7a t\u1EEBng c\xE1 nh\xE2n trong t\u1ED5 ch\u1EE9c.'
    },
    toc: {
      title: 'Nhanh Nh\u01B0ng Lu\xF4n <br /><span class="hero-clean-highlight">C\xF3 M\u1EE5c Ti\xEAu &amp; \u0110\u1ECBnh H\u01B0\u1EDBng.</span>',
      desc: 'Ph\u1EA3n h\u1ED3i th\u1EA7n t\u1ED1c \u0111\xFAng h\u1EB9n, <strong class="text-blue-accent">ra quy\u1EBFt \u0111\u1ECBnh d\u1EE9t kho\xE1t</strong> d\u1EF1a tr\xEAn d\u1EEF li\u1EC7u v\xE0 lu\xF4n gi\u1EEF gu\u1ED3ng c\xF4ng vi\u1EC7c ti\u1EBFn v\u1EC1 k\u1EBFt qu\u1EA3 h\u1EEFu \xEDch nh\u1EA5t. T\u1ED1c \u0111\u1ED9 tri\u1EC3n khai v\u01B0\u1EE3t tr\u1ED9i k\u1EBFt h\u1EE3p c\xF9ng quy tr\xECnh tinh g\u1ECDn gi\xFAp r\xFAt ng\u1EAFn t\u1ED1i \u0111a th\u1EDDi gian ra m\u1EAFt, ch\u1EDBp tr\u1ECDn c\u01A1 h\u1ED9i kinh doanh cho kh\xE1ch h\xE0ng.'
    }
  };
  var CYCLE_KEYS = ["tin", "chuan", "tien", "nhan", "toc"];
  var CYCLE_INTERVAL = 2400;
  var INTERACTION_DWELL = 3600;
  function initHeroInteractive() {
    const heroSection = document.getElementById("hero");
    if (!heroSection) return;
    const titleEl = document.getElementById("heroTitle");
    const descEl = document.getElementById("heroDesc");
    const textAnimWrap = document.getElementById("heroTextAnimWrap");
    const centerContent = heroSection.querySelector(".hero-clean-content");
    if (!titleEl || !descEl) return;
    const interactiveCorners = heroSection.querySelectorAll("[data-corner]");
    if (!interactiveCorners || interactiveCorners.length === 0) return;
    let currentKey = "tin";
    let cycleTimer = null;
    let transitionTimer = null;
    let isSectionInView = true;
    function updateCenterContent(key, force = false) {
      if (key === currentKey && !force) return;
      const data = HERO_PILLARS[key];
      if (!data) return;
      currentKey = key;
      heroSection.classList.add("has-active-pillar");
      interactiveCorners.forEach((el) => {
        const cornerKey = el.getAttribute("data-corner");
        if (cornerKey === key) {
          el.classList.add("is-active");
          el.setAttribute("aria-pressed", "true");
        } else {
          el.classList.remove("is-active");
          el.setAttribute("aria-pressed", "false");
          if (document.activeElement === el || el.contains(document.activeElement)) {
            el.blur();
          }
        }
      });
      if (!textAnimWrap) {
        titleEl.innerHTML = data.title;
        descEl.innerHTML = data.desc;
        return;
      }
      textAnimWrap.classList.add("is-switching");
      clearTimeout(transitionTimer);
      transitionTimer = setTimeout(() => {
        titleEl.innerHTML = data.title;
        descEl.innerHTML = data.desc;
        requestAnimationFrame(() => {
          textAnimWrap.classList.remove("is-switching");
        });
      }, 120);
    }
    function getNextPillarKey() {
      const currentIndex = CYCLE_KEYS.indexOf(currentKey);
      const nextIndex = (currentIndex + 1) % CYCLE_KEYS.length;
      return CYCLE_KEYS[nextIndex];
    }
    function advanceToNextPillar() {
      if (!isSectionInView || document.hidden) return;
      if (document.activeElement && typeof document.activeElement.blur === "function") {
        document.activeElement.blur();
      }
      const nextKey = getNextPillarKey();
      updateCenterContent(nextKey);
    }
    function scheduleNextCycle(delay = CYCLE_INTERVAL) {
      clearTimeout(cycleTimer);
      cycleTimer = setTimeout(() => {
        if (isSectionInView && !document.hidden) {
          advanceToNextPillar();
        }
        scheduleNextCycle(CYCLE_INTERVAL);
      }, delay);
    }
    function handleUserSelect(key) {
      if (!key || !HERO_PILLARS[key]) return;
      updateCenterContent(key);
      scheduleNextCycle(INTERACTION_DWELL);
    }
    setTimeout(() => {
      updateCenterContent("tin", true);
      scheduleNextCycle(CYCLE_INTERVAL);
    }, 1150);
    interactiveCorners.forEach((cornerEl) => {
      const key = cornerEl.getAttribute("data-corner");
      if (!key || !HERO_PILLARS[key]) return;
      cornerEl.addEventListener("mouseenter", () => {
        handleUserSelect(key);
      });
      const handleTrigger = (e) => {
        if (e) {
          e.stopPropagation();
        }
        handleUserSelect(key);
      };
      cornerEl.addEventListener("click", handleTrigger);
      cornerEl.addEventListener("pointerup", handleTrigger);
      cornerEl.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleUserSelect(key);
        }
      });
    });
    if (centerContent) {
      centerContent.addEventListener("mouseenter", () => {
        scheduleNextCycle(INTERACTION_DWELL);
      });
    }
    heroSection.addEventListener("click", (e) => {
      const corner = e.target.closest("[data-corner]");
      if (corner) {
        const key = corner.getAttribute("data-corner");
        if (key && HERO_PILLARS[key]) {
          handleUserSelect(key);
        }
      }
    });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        clearTimeout(cycleTimer);
      } else if (isSectionInView) {
        scheduleNextCycle(CYCLE_INTERVAL);
      }
    });
    if ("IntersectionObserver" in window) {
      const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          isSectionInView = entry.isIntersecting;
          if (entry.isIntersecting && !document.hidden) {
            scheduleNextCycle(CYCLE_INTERVAL);
          } else {
            clearTimeout(cycleTimer);
          }
        });
      }, { threshold: 0.15 });
      heroObserver.observe(heroSection);
    }
    console.log("\u2728 Gotek Hero Interactive: Auto-cycle 2.4s, Inactive Dimming 0.28, User Hover/Click Dwell 3.6s.");
  }

  // gotek/js/components/footer.js?v=1
  function initFooterAccordion() {
    const footerAccordions = Array.from(document.querySelectorAll("[data-footer-accordion]"));
    if (!footerAccordions.length) return;
    const mobileFooter = window.matchMedia("(max-width: 820px)");
    const setFooterPanel = (accordion, expanded) => {
      const trigger = accordion.querySelector(".gotek-footer-accordion__trigger");
      const panel = trigger && document.getElementById(trigger.getAttribute("aria-controls"));
      if (!trigger || !panel) return;
      trigger.setAttribute("aria-expanded", String(expanded));
      panel.hidden = !expanded;
      accordion.classList.toggle("is-open", expanded);
    };
    const syncFooterAccordions = () => {
      footerAccordions.forEach((accordion) => setFooterPanel(accordion, !mobileFooter.matches));
      document.documentElement.classList.add("gotek-footer-accordion-ready");
    };
    footerAccordions.forEach((accordion) => {
      const trigger = accordion.querySelector(".gotek-footer-accordion__trigger");
      trigger?.addEventListener("click", (e) => {
        e.preventDefault();
        if (!mobileFooter.matches) return;
        const willOpen = trigger.getAttribute("aria-expanded") !== "true";
        footerAccordions.forEach((item) => setFooterPanel(item, item === accordion && willOpen));
      });
    });
    mobileFooter.addEventListener("change", syncFooterAccordions);
    syncFooterAccordions();
    const backToTopBtn = document.querySelector(".gotek-back-to-top");
    if (backToTopBtn) {
      backToTopBtn.addEventListener("click", (e) => {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      });
    }
  }

  // gotek/js/components/scrollAnimations.js?v=13
  if (typeof document !== "undefined" && document.body) {
    document.body.classList.add("has-scroll-animations");
  }
  function initEcosystemScrollAnimation2() {
    const section = document.querySelector(".ecosystem-teams-section");
    const header = document.querySelector(".ecosystem-teams-header");
    const rows = document.querySelectorAll(".ecosystem-zigzag-row");
    if ("IntersectionObserver" in window) {
      if (header && section) {
        const headerObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              section.classList.add("animate-header-in");
              headerObserver.unobserve(entry.target);
            }
          });
        }, {
          threshold: 0.15,
          rootMargin: "0px 0px -40px 0px"
        });
        headerObserver.observe(header);
      }
      if (rows.length) {
        const rowObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("animate-in");
              rowObserver.unobserve(entry.target);
            }
          });
        }, {
          threshold: 0.05,
          rootMargin: "60px 0px 60px 0px"
        });
        rows.forEach((row) => rowObserver.observe(row));
      }
    } else {
      if (section) section.classList.add("animate-header-in");
      rows.forEach((row) => row.classList.add("animate-in"));
    }
  }
  function initPricingScrollAnimation2() {
    const section = document.querySelector(".pricing-section");
    if (!section) return;
    const header = document.querySelector(".pricing-header");
    const grid = document.querySelector("#pricingGrid") || document.querySelector(".pricing-grid");
    if ("IntersectionObserver" in window) {
      if (header) {
        const headerObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              section.classList.add("animate-header-in");
              headerObserver.unobserve(entry.target);
            }
          });
        }, {
          threshold: 0.15,
          rootMargin: "0px 0px -40px 0px"
        });
        headerObserver.observe(header);
      }
      if (grid) {
        const gridObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              section.classList.add("animate-content-in");
              gridObserver.unobserve(entry.target);
            }
          });
        }, {
          threshold: 0.1,
          rootMargin: "0px 0px -40px 0px"
        });
        gridObserver.observe(grid);
      }
    } else {
      section.classList.add("animate-header-in", "animate-content-in");
    }
  }

  // gotek/js/app.js?v=38
  async function initApp() {
    if (!window.GotekDataStore) {
      console.error("[GotekApp] Kh\xF4ng t\xECm th\u1EA5y GotekDataStore!");
      return;
    }
    const data = await window.GotekDataStore.loadAll();
    console.log("[GotekApp] Loaded data:", data);
    try {
      renderSiteConfig(data.config);
    } catch (e) {
      console.error("Error in renderSiteConfig:", e);
    }
    try {
      renderServices(data.services);
    } catch (e) {
      console.error("Error in renderServices:", e);
    }
    try {
      renderProjectSections([data.projectsWeb, data.projectsSaas]);
    } catch (e) {
      console.error("Error in renderProjectSections:", e);
    }
    try {
      renderPricing(data.pricing);
    } catch (e) {
      console.error("Error in renderPricing:", e);
    }
    try {
      renderEcosystem(data.ecosystem);
    } catch (e) {
      console.error("Error in renderEcosystem:", e);
    }
    try {
      renderTeam(data.team);
    } catch (e) {
      console.error("Error in renderTeam:", e);
    }
    try {
      renderTestimonials(data.testimonials);
    } catch (e) {
      console.error("Error in renderTestimonials:", e);
    }
    try {
      renderEcosystemTeams(data.ecosystemTeams);
    } catch (e) {
      console.error("Error in renderEcosystemTeams:", e);
    }
    try {
      renderFAQ(data.faq);
    } catch (e) {
      console.error("Error in renderFAQ:", e);
    }
  }
  function renderSiteConfig(config) {
    if (!config) return;
    $$(".dyn-hotline").forEach((el) => el.textContent = config.contact.phoneDisplay);
    $$(".dyn-hotline-link").forEach((el) => el.setAttribute("href", `tel:${config.contact.hotline}`));
    $$(".dyn-email").forEach((el) => el.textContent = config.contact.email);
    $$(".dyn-email-link").forEach((el) => el.setAttribute("href", `mailto:${config.contact.email}`));
    $$(".dyn-address").forEach((el) => el.textContent = config.contact.address);
    const heroStatsContainer = $("#heroStatsContainer");
    if (heroStatsContainer && config.stats) {
      heroStatsContainer.innerHTML = config.stats.map((s) => `
      <div class="hero-stat-item">
        <strong>${s.number}</strong>
        <span>${s.label}</span>
      </div>
    `).join("");
    }
  }
  function renderServices(services) {
    const container = $("#servicesGrid");
    if (!container || !services) return;
    container.innerHTML = services.map((s) => `
    <div class="card-service">
      <div class="card-service-icon">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>
      </div>
      <span class="badge badge-primary" style="align-self: flex-start; margin-bottom: 12px;">${s.badge}</span>
      <h3 class="card-service-title">${s.title}</h3>
      <p class="card-service-desc">${s.description}</p>
      <ul class="card-service-features">
        ${s.features.map((f) => `
          <li>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            ${f}
          </li>
        `).join("")}
      </ul>
    </div>
  `).join("");
  }
  function renderProjectSections(groups) {
    const container = $("#projectsContainer") || $(".projects-showcase-container") || $(".project-3-saas-web-hatang");
    if (!container || !groups) return;
    let allItems = [];
    if (Array.isArray(groups)) {
      groups.forEach((g) => {
        if (g && Array.isArray(g.items)) {
          allItems = allItems.concat(g.items);
        } else if (g && Array.isArray(g)) {
          allItems = allItems.concat(g);
        }
      });
    }
    if (allItems.length === 0) return;
    function renderCard(item, idx) {
      return `
      <article class="project-card" data-index="${idx}" data-name="${item.name || item.title || ""}">
        <div class="project-card-link" role="button" tabindex="0" aria-label="${item.name || item.title || ""}">
          <div class="project-card-header">
            <h3 class="project-card-title">${item.name || item.title || ""}</h3>
          </div>
          <div class="project-scroll-viewport">
            <img src="${item.image}" alt="${item.name || item.title || ""}"
                 class="project-scroll-img" loading="lazy" />
          </div>
        </div>
      </article>
    `;
    }
    let marqueeRafId = null;
    let activeCard = null;
    let isHovered = false;
    let isDragging = false;
    let hasDragged = false;
    let dragStartX = 0;
    let dragScrollLeft = 0;
    let resumeTimer = null;
    function updateProjectLayout() {
      if (marqueeRafId) cancelAnimationFrame(marqueeRafId);
      const containerW = container.clientWidth || 1200;
      const screenW = window.innerWidth;
      let visibleCols;
      let gap;
      if (screenW >= 1200) {
        visibleCols = 5;
        gap = 16;
      } else if (screenW >= 992) {
        visibleCols = 4;
        gap = 14;
      } else if (screenW >= 768) {
        visibleCols = 3;
        gap = 12;
      } else if (screenW >= 540) {
        visibleCols = 2;
        gap = 12;
      } else {
        visibleCols = 1.18;
        gap = 10;
      }
      const trackVisibleW = containerW;
      let cardW = Math.floor((trackVisibleW - (visibleCols - 1) * gap) / visibleCols);
      cardW = Math.max(180, Math.min(cardW, 300));
      const singleSetCardsHtml = allItems.map((item, idx) => renderCard(item, idx)).join("");
      const fullTrackHtml = singleSetCardsHtml + singleSetCardsHtml + singleSetCardsHtml;
      container.innerHTML = `
      <div class="projects-track-wrapper" style="--card-w: ${cardW}px; --project-gap: ${gap}px;">
        <div class="projects-track">
          ${fullTrackHtml}
        </div>
      </div>
    `;
      const trackWrapper = container.querySelector(".projects-track-wrapper");
      const singleSetWidth = allItems.length * (cardW + gap);
      if (trackWrapper && singleSetWidth > 0) {
        trackWrapper.scrollLeft = singleSetWidth;
      }
      applyScrollDurationToImages();
      setupInteractions(trackWrapper, singleSetWidth);
      startMarqueeLoop(trackWrapper, singleSetWidth);
    }
    function startMarqueeLoop(trackWrapper, singleSetWidth) {
      if (!trackWrapper || singleSetWidth <= 0) return;
      if (marqueeRafId) cancelAnimationFrame(marqueeRafId);
      let lastTime = performance.now();
      const speed = 0.045;
      function loop(currentTime) {
        const delta = currentTime - lastTime;
        lastTime = currentTime;
        if (!isHovered && !isDragging && !activeCard) {
          trackWrapper.scrollLeft += speed * Math.min(delta, 50);
          if (trackWrapper.scrollLeft >= singleSetWidth * 2) {
            trackWrapper.scrollLeft -= singleSetWidth;
          } else if (trackWrapper.scrollLeft <= singleSetWidth * 0.3) {
            trackWrapper.scrollLeft += singleSetWidth;
          }
        }
        marqueeRafId = requestAnimationFrame(loop);
      }
      marqueeRafId = requestAnimationFrame(loop);
    }
    function setupInteractions(trackWrapper, singleSetWidth) {
      if (!trackWrapper) return;
      trackWrapper.addEventListener("mouseenter", () => {
        isHovered = true;
      });
      trackWrapper.addEventListener("mouseleave", () => {
        isHovered = false;
        isDragging = false;
      });
      trackWrapper.addEventListener("mousedown", (e) => {
        isDragging = true;
        hasDragged = false;
        dragStartX = e.pageX - trackWrapper.offsetLeft;
        dragScrollLeft = trackWrapper.scrollLeft;
        isHovered = true;
      });
      window.addEventListener("mouseup", () => {
        if (isDragging) {
          isDragging = false;
          setTimeout(() => {
            hasDragged = false;
          }, 50);
        }
      });
      trackWrapper.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - trackWrapper.offsetLeft;
        const walk = x - dragStartX;
        if (Math.abs(walk) > 4) {
          hasDragged = true;
          trackWrapper.scrollLeft = dragScrollLeft - walk;
          if (trackWrapper.scrollLeft >= singleSetWidth * 2) {
            trackWrapper.scrollLeft -= singleSetWidth;
            dragScrollLeft -= singleSetWidth;
          } else if (trackWrapper.scrollLeft <= singleSetWidth * 0.3) {
            trackWrapper.scrollLeft += singleSetWidth;
            dragScrollLeft += singleSetWidth;
          }
        }
      });
      trackWrapper.addEventListener("click", (e) => {
        if (hasDragged) return;
        const card = e.target.closest(".project-card");
        if (!card) return;
        e.preventDefault();
        e.stopPropagation();
        if (card === activeCard && card.classList.contains("is-active-center")) {
          card.classList.remove("is-active-center");
          activeCard = null;
          if (resumeTimer) clearTimeout(resumeTimer);
          resumeTimer = setTimeout(() => {
            isHovered = false;
          }, 1e3);
          return;
        }
        if (activeCard) {
          activeCard.classList.remove("is-active-center");
        }
        card.classList.add("is-active-center");
        activeCard = card;
        const wrapperRect = trackWrapper.getBoundingClientRect();
        const cardRect = card.getBoundingClientRect();
        const wrapperCenter = wrapperRect.left + wrapperRect.width / 2;
        const cardCenter = cardRect.left + cardRect.width / 2;
        const diff = cardCenter - wrapperCenter;
        trackWrapper.scrollBy({
          left: diff,
          behavior: "smooth"
        });
      });
      document.addEventListener("click", (e) => {
        if (!e.target.closest("#projectsContainer")) {
          if (activeCard) {
            activeCard.classList.remove("is-active-center");
            activeCard = null;
            isHovered = false;
          }
        }
      });
    }
    function applyScrollDurationToImages() {
      const images = container.querySelectorAll(".project-scroll-img");
      images.forEach((img) => {
        function calculateDuration() {
          const naturalH = img.naturalHeight || 0;
          const naturalW = img.naturalWidth || 1;
          const currentW = img.clientWidth || 240;
          const displayedH = naturalH > 0 ? naturalH * (currentW / naturalW) : img.offsetHeight || 1400;
          const viewportEl = img.closest(".project-scroll-viewport");
          const viewportH = viewportEl ? viewportEl.clientHeight : 420;
          const scrollDistance = Math.max(100, displayedH - viewportH);
          const speedPxPerSec = 170;
          const duration = Math.max(9, Math.round(scrollDistance / speedPxPerSec));
          img.style.setProperty("--scroll-duration", `${duration}s`);
        }
        if (img.complete && img.naturalHeight > 0) {
          calculateDuration();
        } else {
          img.addEventListener("load", calculateDuration, { once: true });
        }
      });
    }
    updateProjectLayout();
    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        updateProjectLayout();
      }, 120);
    });
  }
  function renderPricing(pricing) {
    const container = $("#pricingGrid") || $(".pricing-grid");
    if (!container || !pricing || !Array.isArray(pricing)) return;
    container.innerHTML = pricing.map((pkg) => `
    <div class="pricing-card ${pkg.isFeatured ? "pricing-card-featured" : "pricing-card-side"}">
      <div class="pricing-ribbon-tag">${pkg.ribbonTag || ""}</div>

      <div class="pricing-card-top-bar">
        <span class="pricing-category-badge">${pkg.categoryBadge || ""}</span>
        <span class="pricing-level-tag">${pkg.levelTag || ""}</span>
      </div>

      <h3 class="pricing-plan-name">${pkg.planName || ""}</h3>
      <p class="pricing-plan-desc">${pkg.planDesc || ""}</p>

      <div class="pricing-investment-box">
        <span class="investment-label">${pkg.investmentLabel || "M\u1EE8C \u0110\u1EA6U T\u01AF D\u1EF0 KI\u1EBEN"}</span>
        <div class="investment-price-row">
          <span class="investment-price">${pkg.price || ""}</span>
          <span class="investment-unit">${pkg.unit || ""}</span>
        </div>
      </div>

      <div class="pricing-features-wrap">
        <span class="features-label">${pkg.featuresLabel || "BAO G\u1ED2M C\xC1C H\u1EA0NG M\u1EE4C:"}</span>
        <ul class="pricing-feature-list">
          ${(pkg.features || []).map((feat) => `
            <li>
              <span class="feature-check-icon">&#10003;</span>
              <span>${feat}</span>
            </li>
          `).join("")}
        </ul>
      </div>

      <div class="pricing-card-footer">
        <a href="${pkg.buttonLink || "#contact"}" class="pricing-action-btn ${pkg.isFeatured ? "pricing-action-primary" : ""}">
          <span>${pkg.buttonText || "T\u01B0 V\u1EA5n Ngay"}</span>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
            stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </a>
      </div>
    </div>
  `).join("");
    try {
      initPricingScrollAnimation2();
    } catch (e) {
    }
  }
  function renderTeam(team) {
    const container = $("#teamGrid");
    if (!container || !team) return;
    container.innerHTML = team.map((m) => `
    <div class="card-team">
      <img class="card-team-avatar" src="${m.avatar}" alt="${m.name}" loading="lazy" />
      <h3 class="card-team-name">${m.name}</h3>
      <div class="card-team-role">${m.role}</div>
      <p class="card-team-bio">${m.bio}</p>
    </div>
  `).join("");
  }
  function renderTestimonials(testimonialsData) {
    if (!testimonialsData) return;
    const sectionInfo = testimonialsData.section || null;
    const list = Array.isArray(testimonialsData) ? testimonialsData : testimonialsData.testimonials || [];
    const titleEl = $("#testimonialsTitle");
    if (sectionInfo && titleEl && sectionInfo.title) {
      const cleanHighlight = (sectionInfo.highlightTitle || "").replace(/\?+$/, "");
      titleEl.innerHTML = `<span class="testimonials-title-main">${sectionInfo.title}</span> <span class="testimonials-title-sub text-brand-gradient">${cleanHighlight}</span>`;
    }
    const stageContainer = $("#testimonialsStage") || $("#testimonialsTrack");
    const dotsContainer = $("#testimonialsDots");
    if (!stageContainer || list.length === 0) return;
    const starSVG = `
    <svg class="testimonial-star-icon" viewBox="0 0 20 20" fill="currentColor">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
    </svg>
  `;
    stageContainer.innerHTML = list.map((t, idx) => {
      const starsCount = t.rating || 5;
      const avatarUrl = t.avatar || "assets/images/customers/customer_1.jpg";
      return `
      <div class="testimonial-card" data-card-index="${idx}">
        <!-- 1. N\u1ED9i dung comment \u1EDF tr\xEAn -->
        <p class="testimonial-quote">
          "${t.quote || t.comment || ""}"
        </p>

        <!-- 2. Nguy\xEAn khung h\xECnh \u1EA3nh + 5 sao n\u1EB1m \u1EDF D\u01AF\u1EDAI comment -->
        <div class="testimonial-author-bottom">
          <div class="testimonial-author-meta-wrap">
            <img src="${avatarUrl}" alt="${t.name}" class="testimonial-avatar-img" loading="lazy" />
            <div class="testimonial-author-meta">
              <h4 class="testimonial-author-name">${t.name}</h4>
              <div class="testimonial-stars">
                ${Array(starsCount).fill(starSVG).join("")}
              </div>
            </div>
          </div>
          <!-- D\u1EA5u nh\xE1y k\xE9p quote \u1EDF g\xF3c ph\u1EA3i nh\u01B0 h\xECnh 2 -->
          <div class="testimonial-quote-icon" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
            </svg>
          </div>
        </div>
      </div>
    `;
    }).join("");
    const cardElements = Array.from(stageContainer.querySelectorAll(".testimonial-card"));
    const N = cardElements.length;
    if (N === 0) return;
    function getArcMetrics() {
      const w = window.innerWidth;
      if (w < 480) {
        const cardW = Math.min(290, w - 56);
        return {
          spacing: cardW + 30,
          // Đảm bảo khoảng cách rõ ràng 30px giữa thẻ chính và thẻ lộ nửa cạnh
          curveFactor: 12,
          peakOffset: 6,
          tiltFactor: 1.8,
          scaleDrop: 0.05
        };
      } else if (w < 768) {
        return {
          spacing: 335,
          // Thẻ 290px + gap 45px
          curveFactor: 16,
          peakOffset: 8,
          tiltFactor: 2.2,
          scaleDrop: 0.05
        };
      } else if (w < 1024) {
        return {
          spacing: 365,
          curveFactor: 22,
          peakOffset: 12,
          tiltFactor: 2.8,
          scaleDrop: 0.055
        };
      } else {
        return {
          spacing: 390,
          curveFactor: 26,
          peakOffset: 14,
          tiltFactor: 3.4,
          scaleDrop: 0.06
        };
      }
    }
    let currentCenter = 0;
    let isAnimating = false;
    let animStartCenter = currentCenter;
    let animTargetCenter = currentCenter;
    let animStartTime = 0;
    const animDuration = 720;
    function easeInOutCubic(x) {
      return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    }
    function updateArcPositions(c) {
      const metrics = getArcMetrics();
      for (let k = 0; k < N; k++) {
        let offset = k - c;
        offset = ((offset + N / 2) % N + N) % N - N / 2;
        const absOffset = Math.abs(offset);
        const card = cardElements[k];
        if (absOffset > 2.6) {
          card.style.opacity = "0";
          card.style.pointerEvents = "none";
          card.style.visibility = "hidden";
          continue;
        }
        card.style.visibility = "visible";
        const x = offset * metrics.spacing;
        const y = offset * offset * metrics.curveFactor - metrics.peakOffset;
        const rotate = offset * metrics.tiltFactor;
        const scale = Math.max(0.84, 1.02 - absOffset * metrics.scaleDrop);
        let opacity = 1;
        if (absOffset > 1.3) {
          opacity = Math.max(0, 0.95 - (absOffset - 1.3) * 0.9);
        } else {
          opacity = 1 - absOffset * 0.06;
        }
        const zIndex = Math.round(30 - absOffset * 6);
        card.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${rotate.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
        card.style.opacity = opacity.toFixed(3);
        card.style.zIndex = zIndex;
        card.style.pointerEvents = absOffset < 1.35 ? "auto" : "none";
        if (absOffset < 0.4) {
          card.classList.add("is-center");
        } else {
          card.classList.remove("is-center");
        }
      }
    }
    function getNormalizedActiveIndex() {
      return (Math.round(currentCenter) % N + N) % N;
    }
    function updateDots(activeIdx) {
      if (!dotsContainer) return;
      const dots = Array.from(dotsContainer.querySelectorAll(".testimonials-dot"));
      if (dots.length === 0) return;
      const total = dots.length;
      let startIndex = activeIdx - 2;
      if (startIndex < 0) startIndex = 0;
      if (startIndex > total - 5) startIndex = Math.max(0, total - 5);
      const endIndex = Math.min(total - 1, startIndex + 4);
      dots.forEach((d, i) => {
        const isActive = i === activeIdx;
        d.classList.toggle("active", isActive);
        if (i >= startIndex && i <= endIndex) {
          d.style.display = "inline-block";
          const dist = Math.abs(i - activeIdx);
          if (dist >= 2) {
            d.classList.add("dot-small");
          } else {
            d.classList.remove("dot-small");
          }
        } else {
          d.style.display = "none";
          d.classList.remove("dot-small");
        }
      });
    }
    function buildDots() {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = "";
      for (let i = 0; i < N; i++) {
        const btn = document.createElement("button");
        btn.className = "testimonials-dot";
        btn.setAttribute("data-card-index", i);
        btn.setAttribute("aria-label", `\u0110\xE1nh gi\xE1 ${i + 1}`);
        btn.addEventListener("click", () => {
          const currentNormalized = getNormalizedActiveIndex();
          let diff = i - currentNormalized;
          if (diff > N / 2) diff -= N;
          if (diff < -N / 2) diff += N;
          startMoveTo(currentCenter + diff);
          restartTimer();
        });
        dotsContainer.appendChild(btn);
      }
      updateDots(getNormalizedActiveIndex());
    }
    function animateFrame(now) {
      if (!isAnimating) return;
      const elapsed = now - animStartTime;
      const progress = Math.min(elapsed / animDuration, 1);
      const eased = easeInOutCubic(progress);
      currentCenter = animStartCenter + (animTargetCenter - animStartCenter) * eased;
      updateArcPositions(currentCenter);
      if (progress < 1) {
        requestAnimationFrame(animateFrame);
      } else {
        isAnimating = false;
        currentCenter = (animTargetCenter % N + N) % N;
        updateArcPositions(currentCenter);
        updateDots(getNormalizedActiveIndex());
      }
    }
    function startMoveTo(newTarget) {
      animStartCenter = currentCenter;
      animTargetCenter = newTarget;
      animStartTime = performance.now();
      isAnimating = true;
      const targetActive = (Math.round(newTarget) % N + N) % N;
      updateDots(targetActive);
      requestAnimationFrame(animateFrame);
    }
    function nextCard() {
      startMoveTo(currentCenter + 1);
    }
    function prevCard() {
      startMoveTo(currentCenter - 1);
    }
    cardElements.forEach((card) => {
      card.addEventListener("click", () => {
        const idx = parseInt(card.getAttribute("data-card-index"), 10);
        let offset = idx - currentCenter;
        offset = ((offset + N / 2) % N + N) % N - N / 2;
        if (Math.abs(offset) > 0.4 && Math.abs(offset) < 1.6) {
          const delta = Math.round(offset);
          startMoveTo(currentCenter + delta);
          restartTimer();
        }
      });
    });
    let touchStartX = 0;
    let touchEndX = 0;
    const wrapper = $(".testimonials-curved-wrapper");
    if (wrapper) {
      wrapper.addEventListener("touchstart", (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });
      wrapper.addEventListener("touchend", (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
      }, { passive: true });
    }
    function handleSwipe() {
      const diff = touchEndX - touchStartX;
      if (Math.abs(diff) > 35) {
        if (diff < 0) {
          nextCard();
        } else {
          prevCard();
        }
        restartTimer();
      }
    }
    let autoTimer = null;
    function startTimer() {
      autoTimer = setInterval(() => {
        nextCard();
      }, 4e3);
    }
    function restartTimer() {
      if (autoTimer) clearInterval(autoTimer);
      startTimer();
    }
    if (wrapper) {
      wrapper.addEventListener("mouseenter", () => {
        if (autoTimer) clearInterval(autoTimer);
      });
      wrapper.addEventListener("mouseleave", () => {
        restartTimer();
      });
    }
    window.addEventListener("resize", () => {
      updateArcPositions(currentCenter);
      updateDots(getNormalizedActiveIndex());
    });
    buildDots();
    updateArcPositions(currentCenter);
    startTimer();
  }
  var ecosystemSliderTimer = null;
  var ecosystemSliderState = {
    currentSlide: 0,
    totalSlides: 1,
    isPaused: false,
    partners: []
  };
  function renderEcosystem(ecosystem) {
    if (!ecosystem || !$("#ecosystemSliderTrack")) return;
    const titleEl = $("#ecosystemTitle");
    const subEl = $("#ecosystemSubtitle");
    if (titleEl && ecosystem.section) {
      titleEl.innerHTML = `<span class="ecosystem-title-main">${ecosystem.section.title}</span> <span class="ecosystem-title-sub text-brand-gradient">${ecosystem.section.highlightTitle}</span>`;
    }
    if (subEl && ecosystem.section) {
      subEl.textContent = ecosystem.section.subtitle;
    }
    if (!ecosystem.partners || !ecosystem.partners.length) return;
    ecosystemSliderState.partners = ecosystem.partners;
    setupEcosystemCarousel();
  }
  function setupEcosystemCarousel() {
    const partners = ecosystemSliderState.partners;
    const track = $("#ecosystemSliderTrack");
    const wrapper = $("#ecosystemSliderWrapper");
    const controls = $("#ecosystemControls");
    const dotsContainer = $("#ecosystemDots");
    const prevBtn = $("#ecosystemPrevBtn");
    const nextBtn = $("#ecosystemNextBtn");
    if (!track || !wrapper) return;
    const width = window.innerWidth;
    const cols = width > 1024 ? 5 : width > 768 ? 4 : width > 540 ? 3 : 2;
    const itemsPerSlide = cols * 2;
    const totalSlides = Math.ceil(partners.length / itemsPerSlide);
    ecosystemSliderState.totalSlides = totalSlides;
    if (ecosystemSliderTimer) {
      clearInterval(ecosystemSliderTimer);
      ecosystemSliderTimer = null;
    }
    if (totalSlides <= 1) {
      if (controls) controls.style.display = "none";
      track.style.transform = "none";
      const topRow = partners.slice(0, cols);
      const bottomRow = partners.slice(cols, cols * 2);
      track.innerHTML = `
      <div class="ecosystem-slide">
        <div class="ecosystem-staggered-grid">
          <div class="ecosystem-staggered-row ecosystem-row-top">
            ${topRow.map((p) => `
              <div class="ecosystem-partner-item" title="${p.title || p.name}">
                <img src="${p.logo}" alt="${p.alt || p.name}" />
              </div>
            `).join("")}
          </div>
          <div class="ecosystem-staggered-row ecosystem-row-bottom">
            ${bottomRow.map((p) => `
              <div class="ecosystem-partner-item" title="${p.title || p.name}">
                <img src="${p.logo}" alt="${p.alt || p.name}" />
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    `;
      return;
    }
    if (controls) controls.style.display = "flex";
    let slidesHTML = "";
    for (let i = 0; i < totalSlides; i++) {
      let slideItems = partners.slice(i * itemsPerSlide, (i + 1) * itemsPerSlide);
      if (slideItems.length < itemsPerSlide) {
        slideItems = slideItems.concat(partners.slice(0, itemsPerSlide - slideItems.length));
      }
      const topRow = slideItems.slice(0, cols);
      const bottomRow = slideItems.slice(cols, cols * 2);
      slidesHTML += `
      <div class="ecosystem-slide" data-slide-index="${i}">
        <div class="ecosystem-staggered-grid">
          <div class="ecosystem-staggered-row ecosystem-row-top">
            ${topRow.map((p) => `
              <div class="ecosystem-partner-item" title="${p.title || p.name}">
                <img src="${p.logo}" alt="${p.alt || p.name}" />
              </div>
            `).join("")}
          </div>
          <div class="ecosystem-staggered-row ecosystem-row-bottom">
            ${bottomRow.map((p) => `
              <div class="ecosystem-partner-item" title="${p.title || p.name}">
                <img src="${p.logo}" alt="${p.alt || p.name}" />
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    `;
    }
    track.innerHTML = slidesHTML;
    if (dotsContainer) {
      dotsContainer.innerHTML = Array.from({ length: totalSlides }, (_, i) => `
      <button class="ecosystem-dot ${i === 0 ? "active" : ""}" data-index="${i}" aria-label="Trang \u0111\u1ED1i t\xE1c ${i + 1}"></button>
    `).join("");
    }
    function goToSlide(index) {
      if (ecosystemSliderState.totalSlides <= 1) return;
      ecosystemSliderState.currentSlide = (index + ecosystemSliderState.totalSlides) % ecosystemSliderState.totalSlides;
      track.style.transform = `translateX(-${ecosystemSliderState.currentSlide * 100}%)`;
      if (dotsContainer) {
        const dots = dotsContainer.querySelectorAll(".ecosystem-dot");
        dots.forEach((dot, idx) => {
          dot.classList.toggle("active", idx === ecosystemSliderState.currentSlide);
        });
      }
    }
    function nextSlide() {
      goToSlide(ecosystemSliderState.currentSlide + 1);
    }
    function prevSlide() {
      goToSlide(ecosystemSliderState.currentSlide - 1);
    }
    function startAutoplay() {
      if (ecosystemSliderTimer) clearInterval(ecosystemSliderTimer);
      ecosystemSliderTimer = setInterval(() => {
        if (!ecosystemSliderState.isPaused) {
          nextSlide();
        }
      }, 3e3);
    }
    if (prevBtn) {
      prevBtn.onclick = () => {
        prevSlide();
        startAutoplay();
      };
    }
    if (nextBtn) {
      nextBtn.onclick = () => {
        nextSlide();
        startAutoplay();
      };
    }
    if (dotsContainer) {
      dotsContainer.onclick = (e) => {
        const btn = e.target.closest(".ecosystem-dot");
        if (btn) {
          const idx = parseInt(btn.dataset.index, 10);
          if (!isNaN(idx)) {
            goToSlide(idx);
            startAutoplay();
          }
        }
      };
    }
    wrapper.onmouseenter = () => {
      ecosystemSliderState.isPaused = true;
    };
    wrapper.onmouseleave = () => {
      ecosystemSliderState.isPaused = false;
    };
    if (controls) {
      controls.onmouseenter = () => {
        ecosystemSliderState.isPaused = true;
      };
      controls.onmouseleave = () => {
        ecosystemSliderState.isPaused = false;
      };
    }
    let touchStartX = 0;
    let touchEndX = 0;
    wrapper.ontouchstart = (e) => {
      touchStartX = e.changedTouches[0].screenX;
      ecosystemSliderState.isPaused = true;
    };
    wrapper.ontouchend = (e) => {
      touchEndX = e.changedTouches[0].screenX;
      ecosystemSliderState.isPaused = false;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) nextSlide();
        else prevSlide();
        startAutoplay();
      }
    };
    document.addEventListener("visibilitychange", () => {
      ecosystemSliderState.isPaused = document.hidden;
    });
    document.addEventListener("visibilitychange", () => {
      ecosystemSliderState.isPaused = document.hidden;
    });
    ecosystemSliderState.currentSlide = 0;
    goToSlide(0);
    startAutoplay();
  }
  var ecoResizeTimer = null;
  var ecoLastWidth = window.innerWidth;
  window.addEventListener("resize", () => {
    clearTimeout(ecoResizeTimer);
    ecoResizeTimer = setTimeout(() => {
      if (Math.abs(window.innerWidth - ecoLastWidth) > 40) {
        ecoLastWidth = window.innerWidth;
        if (ecosystemSliderState.partners && ecosystemSliderState.partners.length) {
          setupEcosystemCarousel();
        }
      }
    }, 250);
  });
  function renderEcosystemTeams(data) {
    if (!data) return;
    const eyebrowEl = $("#ecosystemTeamsEyebrow");
    const titleEl = $("#ecosystemTeamsTitle");
    const descEl = $("#ecosystemTeamsDesc");
    if (eyebrowEl && data.section?.eyebrow) {
      eyebrowEl.textContent = data.section.eyebrow;
    }
    if (titleEl && data.section) {
      let sub = data.section.subtitleTitle || "";
      if (sub.includes("Ba \u0110\u1ED9i Ng\u0169") && !sub.includes("text-brand-gradient")) {
        sub = sub.replace("Ba \u0110\u1ED9i Ng\u0169", '<span class="text-brand-gradient">Ba \u0110\u1ED9i Ng\u0169</span>');
      }
      titleEl.innerHTML = `${data.section.title} <br class="hidden sm:inline" />${sub}`;
    }
    if (descEl && data.section) {
      descEl.textContent = data.section.description;
    }
    const stageEl = $("#ecosystemStage");
    if (!stageEl || !data.teams || data.teams.length < 3) return;
    const team1 = data.teams.find((t) => t.id === "team-gomedia") || data.teams[0];
    const team2 = data.teams.find((t) => t.id === "team-gonetwork") || data.teams[1];
    const team3 = data.teams.find((t) => t.id === "team-gotek") || data.teams[2];
    const items = [
      {
        ...team1,
        pillarTag: "GO MEDIA",
        pillarSubtitle: "CHI\u1EBEN L\u01AF\u1EE2C & N\u1ED8I DUNG",
        desc1: team1.description || "Go Media chuy\u1EC3n m\u1EE5c ti\xEAu kinh doanh th\xE0nh \u0111\u1ECBnh h\u01B0\u1EDBng th\u01B0\u01A1ng hi\u1EC7u, k\u1EBF ho\u1EA1ch n\u1ED9i dung v\xE0 ho\u1EA1t \u0111\u1ED9ng th\u01B0\u01A1ng m\u1EA1i \u0111i\u1EC7n t\u1EED nh\u1EA5t qu\xE1n tr\xEAn c\xE1c k\xEAnh.",
        desc2: "T\u1EEB b\u1ED9 nh\u1EADn di\u1EC7n s\u1ED1 \u0111\u1EBFn c\xE1c chi\u1EBFn d\u1ECBch truy\u1EC1n th\xF4ng \u0111a k\xEAnh, t\u1EEBng \u0111i\u1EC3m ch\u1EA1m \u0111\u1EC1u \u0111\u01B0\u1EE3c thi\u1EBFt k\u1EBF b\xE0i b\u1EA3n nh\u1EB1m kh\u01A1i d\u1EADy nhu c\u1EA7u th\u1EF1c t\u1EBF c\u1EE7a kh\xE1ch h\xE0ng, t\u1EA1o l\u1EADp v\u1ECB th\u1EBF v\u1EEFng ch\u1EAFc v\xE0 m\u1EDF r\u1ED9ng th\u1ECB tr\u01B0\u1EDDng.",
        visual: "assets/images/ecosystem/gomedia-team.jpg",
        shapeClass: "shape-pillar-1",
        containerClass: "shape-pillar-1-container",
        isReversed: false
      },
      {
        ...team2,
        pillarTag: "GONETWORK",
        pillarSubtitle: "M\u1EA0NG L\u01AF\u1EDAI & TI\u1EBENG N\xD3I",
        desc1: team2.description || "GoNetwork \u0111\u01B0a k\u1EBF ho\u1EA1ch v\xE0o m\u1EA1ng l\u01B0\u1EDBi nh\xE0 s\xE1ng t\u1EA1o, KOL/KOC: l\xE0m r\xF5 \u0111\u1ED1i t\u01B0\u1EE3ng, ph\u1EA1m vi, l\u1ECBch tri\u1EC3n khai v\xE0 \u0111\u1EA7u m\u1ED1i ph\u1ED1i h\u1EE3p b\xE0i b\u1EA3n.",
        desc2: "Thay v\xEC qu\u1EA3ng b\xE1 m\u1ED9t chi\u1EC1u, th\u01B0\u01A1ng hi\u1EC7u ti\u1EBFp c\u1EADn ng\u01B0\u1EDDi ti\xEAu d\xF9ng th\xF4ng qua nh\u1EEFng c\xE2u chuy\u1EC7n ch\xE2n th\u1EF1c v\xE0 g\u1EA7n g\u0169i, gi\xFAp th\xF4ng \u0111i\u1EC7p lan t\u1ECFa t\u1EF1 nhi\xEAn v\u1EDBi t\u1EF7 l\u1EC7 t\u01B0\u01A1ng t\xE1c v\xE0 chuy\u1EC3n \u0111\u1ED5i cao nh\u1EA5t.",
        visual: "assets/images/ecosystem/gonetwork-team.jpg",
        shapeClass: "shape-pillar-2",
        containerClass: "shape-pillar-2-container",
        isReversed: true
      },
      {
        ...team3,
        pillarTag: "GOTEK",
        pillarSubtitle: "C\xD4NG NGH\u1EC6 & V\u1EACN H\xC0NH",
        desc1: team3.description || "Gotek x\xE2y website, ph\u1EA7n m\u1EC1m, h\u1EA1 t\u1EA7ng v\xE0 t\u1EF1 \u0111\u1ED9ng h\xF3a \u0111\u1EC3 d\u1EEF li\u1EC7u, quy tr\xECnh c\xF9ng tr\u1EA3i nghi\u1EC7m s\u1ED1 c\xF3 th\u1EC3 v\u1EADn h\xE0nh, theo d\xF5i v\xE0 m\u1EDF r\u1ED9ng kh\xF4ng gi\u1EDBi h\u1EA1n.",
        desc2: "M\u1ECDi \u0111i\u1EC3m ch\u1EA1m t\u1EEB ti\u1EBFp th\u1ECB v\xE0 m\u1EA1ng l\u01B0\u1EDBi \u0111\u1ED1i t\xE1c \u0111\u1EC1u \u0111\u01B0\u1EE3c Gotek k\u1EBFt n\u1ED1i li\u1EC1n m\u1EA1ch v\xE0o h\u1EC7 th\u1ED1ng d\u1EEF li\u1EC7u t\u1EADp trung, gi\xFAp doanh nghi\u1EC7p ki\u1EC3m so\xE1t to\xE0n di\u1EC7n v\xE0 s\u1EB5n s\xE0ng b\u1EE9t ph\xE1 t\u0103ng tr\u01B0\u1EDFng.",
        visual: "assets/images/ecosystem/gotek-team.jpg",
        shapeClass: "shape-pillar-3",
        containerClass: "shape-pillar-3-container",
        isReversed: false
      }
    ];
    stageEl.innerHTML = items.map((item) => `
    <article class="ecosystem-zigzag-row ${item.isReversed ? "is-reversed" : ""}" id="${item.id}">
      <div class="ecosystem-zigzag-content">
        <div class="ecosystem-zigzag-brand-wrap">
          <img src="${item.logo}" alt="${item.name}" class="ecosystem-zigzag-brand-logo" />
        </div>
        <h3 class="ecosystem-zigzag-title">${item.title}</h3>
        <p class="ecosystem-zigzag-desc">${item.desc1}</p>
        <p class="ecosystem-zigzag-desc">${item.desc2}</p>
        <div class="ecosystem-zigzag-action">
          <a href="${item.link || "#"}" class="ecosystem-zigzag-cta" target="_blank" rel="noopener noreferrer">
            <span>${item.btntxt || "Kh\xE1m ph\xE1 " + item.name}</span>
          </a>
        </div>
      </div>
      <div class="ecosystem-zigzag-visual">
        <div class="ecosystem-blob-art-container ${item.containerClass}">
          <div class="ecosystem-blob-frame ${item.shapeClass}">
            <img src="${item.visual}" alt="${item.name} - ${item.title}" loading="lazy" />
          </div>
        </div>
      </div>
    </article>
  `).join("");
    try {
      initEcosystemScrollAnimation2();
    } catch (e) {
      console.error("Error initEcosystemScrollAnimation:", e);
    }
  }
  function renderFAQ(faqData) {
    const defaultFAQ = {
      section: {
        tag: "GI\u1EA2I \u0110\xC1P TH\u1EAEC M\u1EAEC",
        title: "C\xE2u H\u1ECFi",
        highlightTitle: "Th\u01B0\u1EDDng G\u1EB7p",
        subtitle: "Gi\u1EA3i \u0111\xE1p nh\u1EEFng th\u1EAFc m\u1EAFc ph\u1ED5 bi\u1EBFn nh\u1EA5t \u0111\u1EC3 b\u1EA1n ho\xE0n to\xE0n an t\xE2m khi l\u1EF1a ch\u1ECDn Gotek l\xE0m \u0111\u1ED1i t\xE1c c\xF4ng ngh\u1EC7 chi\u1EBFn l\u01B0\u1EE3c."
      },
      support: {
        title: "Ch\u01B0a t\xECm th\u1EA5y c\xE2u tr\u1EA3 l\u1EDDi b\u1EA1n c\u1EA7n?",
        description: "\u0110\u1ED9i ng\u0169 k\u1EF9 s\u01B0 tr\u01B0\u1EDFng s\u1EB5n s\xE0ng t\u01B0 v\u1EA5n tr\u1EF1c ti\u1EBFp v\xE0 kh\u1EA3o s\xE1t b\xE0i to\xE1n k\u1EF9 thu\u1EADt c\u1EE7a b\u1EA1n ho\xE0n to\xE0n mi\u1EC5n ph\xED.",
        ctaText: "T\u01B0 v\u1EA5n qua Zalo",
        ctaLink: "https://zalo.me/0978970605"
      },
      items: [
        {
          id: "faq-01",
          num: "01",
          category: "CHI PH\xCD D\u1EF0 \xC1N",
          question: "Chi ph\xED ph\xE1t tri\u1EC3n m\u1ED9t website ho\u1EB7c ph\u1EA7n m\u1EC1m l\xE0 bao nhi\xEAu?",
          answer: "Chi ph\xED ph\u1EE5 thu\u1ED9c v\xE0o quy m\xF4 t\xEDnh n\u0103ng, ki\u1EBFn tr\xFAc h\u1EC7 th\u1ED1ng v\xE0 c\xF4ng ngh\u1EC7 l\u1EF1a ch\u1ECDn. Gotek lu\xF4n kh\u1EA3o s\xE1t k\u1EF9 l\u01B0\u1EE1ng v\xE0 cung c\u1EA5p b\xE1o gi\xE1 chi ti\u1EBFt, minh b\u1EA1ch theo t\u1EEBng Sprint b\xE0n giao, cam k\u1EBFt kh\xF4ng ph\xE1t sinh chi ph\xED \u1EA9n trong su\u1ED1t qu\xE1 tr\xECnh tri\u1EC3n khai."
        },
        {
          id: "faq-02",
          num: "02",
          category: "TI\u1EBEN \u0110\u1ED8 & TH\u1EDCI GIAN",
          question: "Th\u1EDDi gian ho\xE0n th\xE0nh v\xE0 b\xE0n giao d\u1EF1 \xE1n m\u1EA5t bao l\xE2u?",
          answer: "M\u1ED9t d\u1EF1 \xE1n ti\xEAu chu\u1EA9n th\u01B0\u1EDDng k\xE9o d\xE0i t\u1EEB 4 \u0111\u1EBFn 8 tu\u1EA7n t\xF9y theo ph\u1EA1m vi c\xF4ng vi\u1EC7c. \u0110\u1ED9i ng\u0169 \xE1p d\u1EE5ng quy tr\xECnh Agile Sprint h\xE0ng tu\u1EA7n, demo s\u1EA3n ph\u1EA9m th\u1EF1c t\u1EBF \u0111\u1ECBnh k\u1EF3 v\xE0o m\u1ED7i th\u1EE9 S\xE1u \u0111\u1EC3 kh\xE1ch h\xE0ng lu\xF4n ch\u1EE7 \u0111\u1ED9ng n\u1EAFm b\u1EAFt ti\u1EBFn \u0111\u1ED9 v\xE0 g\xF3p \xFD k\u1ECBp th\u1EDDi."
        },
        {
          id: "faq-03",
          num: "03",
          category: "B\u1EA2N QUY\u1EC0N SOURCE CODE",
          question: "Gotek c\xF3 b\xE0n giao 100% b\u1EA3n quy\u1EC1n m\xE3 ngu\u1ED3n (Source Code) kh\xF4ng?",
          answer: "Ch\u1EAFc ch\u1EAFn c\xF3. To\xE0n b\u1ED9 100% b\u1EA3n quy\u1EC1n m\xE3 ngu\u1ED3n s\u1EA1ch, t\xE0i li\u1EC7u ki\u1EBFn tr\xFAc k\u1EF9 thu\u1EADt (System Architecture), t\xE0i li\u1EC7u API OpenAPI/Swagger v\xE0 to\xE0n quy\u1EC1n qu\u1EA3n tr\u1ECB t\xE0i nguy\xEAn Cloud s\u1EBD \u0111\u01B0\u1EE3c chuy\u1EC3n giao tr\u1ECDn v\u1EB9n cho doanh nghi\u1EC7p c\u1EE7a b\u1EA1n."
        },
        {
          id: "faq-04",
          num: "04",
          category: "B\u1EA2O H\xC0NH & B\u1EA2O TR\xCC",
          question: "Ch\xEDnh s\xE1ch b\u1EA3o h\xE0nh, b\u1EA3o tr\xEC v\xE0 h\u1ED7 tr\u1EE3 k\u1EF9 thu\u1EADt sau b\xE0n giao ra sao?",
          answer: "Gotek cam k\u1EBFt b\u1EA3o h\xE0nh k\u1EF9 thu\u1EADt 12 th\xE1ng mi\u1EC5n ph\xED v\xE0 h\u1ED7 tr\u1EE3 gi\xE1m s\xE1t h\u1EC7 th\u1ED1ng 24/7. Ch\xFAng t\xF4i t\u1ED5 ch\u1EE9c c\xE1c bu\u1ED5i \u0111\xE0o t\u1EA1o chuy\u1EC3n giao c\xF4ng ngh\u1EC7 cho nh\xE2n s\u1EF1 n\u1ED9i b\u1ED9 c\u1EE7a b\u1EA1n, \u0111\u1ED3ng th\u1EDDi s\u1EB5n s\xE0ng \u0111\u1ED3ng h\xE0nh m\u1EDF r\u1ED9ng t\xEDnh n\u0103ng theo c\xE1c giai \u0111o\u1EA1n ph\xE1t tri\u1EC3n ti\u1EBFp theo."
        },
        {
          id: "faq-05",
          num: "05",
          category: "B\u1EA2O M\u1EACT & NDA",
          question: "D\u1EEF li\u1EC7u v\xE0 \xFD t\u01B0\u1EDFng kinh doanh c\u1EE7a doanh nghi\u1EC7p c\xF3 \u0111\u01B0\u1EE3c b\u1EA3o m\u1EADt kh\xF4ng?",
          answer: "Gotek k\xFD th\u1ECFa thu\u1EADn b\u1EA3o m\u1EADt NDA ph\xE1p l\xFD tr\u01B0\u1EDBc khi ti\u1EBFp c\u1EADn d\u1EEF li\u1EC7u ho\u1EB7c th\u1EA3o lu\u1EADn chi ti\u1EBFt b\xE0i to\xE1n kinh doanh. T\u1EA5t c\u1EA3 m\xE3 ngu\u1ED3n v\xE0 d\u1EEF li\u1EC7u ki\u1EC3m th\u1EED \u0111\u1EC1u \u0111\u01B0\u1EE3c l\u01B0u tr\u1EEF tr\xEAn m\xF4i tr\u01B0\u1EDDng ph\xE2n quy\u1EC1n b\u1EA3o m\u1EADt ri\xEAng bi\u1EC7t."
        },
        {
          id: "faq-06",
          num: "06",
          category: "M\u1EDE R\u1ED8NG T\xCDNH N\u0102NG",
          question: "Gotek c\xF3 h\u1ED7 tr\u1EE3 n\xE2ng c\u1EA5p v\xE0 ph\xE1t tri\u1EC3n t\xEDnh n\u0103ng m\u1EDBi sau n\xE0y kh\xF4ng?",
          answer: "Ho\xE0n to\xE0n c\xF3. Ki\u1EBFn tr\xFAc do Gotek x\xE2y d\u1EF1ng tu\xE2n th\u1EE7 quy chu\u1EA9n Module h\xF3a v\xE0 Clean Architecture, gi\xFAp b\u1EA1n d\u1EC5 d\xE0ng b\u1ED5 sung t\xEDnh n\u0103ng m\u1EDBi, k\u1EBFt n\u1ED1i AI ho\u1EB7c m\u1EDF r\u1ED9ng quy m\xF4 ng\u01B0\u1EDDi d\xF9ng m\xE0 kh\xF4ng c\u1EA7n \u0111\u1EADp \u0111i x\xE2y l\u1EA1i."
        },
        {
          id: "faq-07",
          num: "07",
          category: "H\u1EA0 T\u1EA6NG & CH\u1ECAU T\u1EA2I",
          question: "H\u1EC7 th\u1ED1ng c\xF3 ch\u1ECBu t\u1EA3i \u0111\u01B0\u1EE3c l\u01B0\u1EE3ng ng\u01B0\u1EDDi d\xF9ng l\u1EDBn c\xF9ng l\xFAc kh\xF4ng?",
          answer: "C\xF3. \u0110\u1ED9i ng\u0169 Gotek thi\u1EBFt k\u1EBF h\u1EA1 t\u1EA7ng Cloud Auto-scaling tr\xEAn AWS/GCP, k\u1EBFt h\u1EE3p Redis Caching v\xE0 Cloudflare CDN gi\xFAp h\u1EC7 th\u1ED1ng ch\u1ECBu t\u1EA3i h\xE0ng tri\u1EC7u l\u01B0\u1EE3t truy c\u1EADp \u0111\u1ED3ng th\u1EDDi v\u1EDBi \u0111\u1ED9 tr\u1EC5 c\u1EF1c th\u1EA5p v\xE0 \u1ED5n \u0111\u1ECBnh 99.9% Uptime."
        },
        {
          id: "faq-08",
          num: "08",
          category: "L\u1ED8 TR\xCCNH THANH TO\xC1N",
          question: "Ph\u01B0\u01A1ng th\u1EE9c v\xE0 l\u1ED9 tr\xECnh thanh to\xE1n d\u1EF1 \xE1n \u0111\u01B0\u1EE3c chia nh\u01B0 th\u1EBF n\xE0o?",
          answer: "L\u1ED9 tr\xECnh thanh to\xE1n \u0111\u01B0\u1EE3c chia nh\u1ECF theo 3 - 4 giai \u0111o\u1EA1n g\u1EAFn li\u1EC1n v\u1EDBi k\u1EBFt qu\u1EA3 b\xE0n giao th\u1EF1c t\u1EBF (Kh\u1EDFi \u0111\u1ED9ng -> Ho\xE0n thi\u1EC7n UI/UX -> B\xE0n giao b\u1EA3n Beta ki\u1EC3m th\u1EED -> B\xE0n giao nghi\u1EC7m thu ch\xEDnh th\u1EE9c), \u0111\u1EA3m b\u1EA3o an t\xE2m v\xE0 quy\u1EC1n l\u1EE3i t\u1ED1i \u0111a cho kh\xE1ch h\xE0ng."
        },
        {
          id: "faq-09",
          num: "09",
          category: "H\u1EE2P T\xC1C MVP",
          question: "Doanh nghi\u1EC7p c\xF3 th\u1EC3 b\u1EAFt \u0111\u1EA7u t\u1EEB m\u1ED9t t\xEDnh n\u0103ng nh\u1ECF tr\u01B0\u1EDBc \u0111\u01B0\u1EE3c kh\xF4ng?",
          answer: "Ho\xE0n to\xE0n \u0111\u01B0\u1EE3c. Gotek khuy\u1EBFn kh\xEDch ph\xE1t tri\u1EC3n theo m\xF4 h\xECnh MVP (Minimum Viable Product) \u0111\u1EC3 \u0111\u01B0a s\u1EA3n ph\u1EA9m ra th\u1ECB tr\u01B0\u1EDDng nhanh nh\u1EA5t, ki\u1EC3m ch\u1EE9ng nhu c\u1EA7u th\u1EF1c t\u1EBF r\u1ED3i m\u1EDBi m\u1EDF r\u1ED9ng c\xE1c ph\xE2n h\u1EC7 ti\u1EBFp theo."
        },
        {
          id: "faq-10",
          num: "10",
          category: "\u0110\u1ED8I NG\u0168 CHUY\xCAN M\xD4N",
          question: "Nh\xE2n s\u1EF1 tr\u1EF1c ti\u1EBFp th\u1EF1c hi\u1EC7n d\u1EF1 \xE1n c\xF3 tr\xECnh \u0111\u1ED9 chuy\xEAn m\xF4n ra sao?",
          answer: "100% d\u1EF1 \xE1n t\u1EA1i Gotek \u0111\u01B0\u1EE3c d\u1EABn d\u1EAFt b\u1EDFi Solution Architect v\xE0 Senior Developer c\xF3 t\u1EEB 5-8 n\u0103m kinh nghi\u1EC7m th\u1EF1c chi\u1EBFn trong c\xE1c b\xE0i to\xE1n High-Load v\xE0 Enterprise Architecture."
        }
      ]
    };
    const activeData = faqData && faqData.items && faqData.items.length > 0 ? faqData : defaultFAQ;
    const titleEl = $("#faqTitle");
    const subtitleEl = $("#faqSubtitle");
    if (activeData.section) {
      if (titleEl && activeData.section.title) {
        titleEl.innerHTML = `${activeData.section.title} <span class="text-brand-gradient whitespace-nowrap inline-block">${activeData.section.highlightTitle || ""}</span>`;
      }
      if (subtitleEl && activeData.section.subtitle) subtitleEl.textContent = activeData.section.subtitle;
    }
    const trackEl = $("#faqRollerTrack");
    const viewportEl = $("#faqRollerViewport");
    const answerCardEl = $("#faqAnswerCard");
    if (!trackEl || !viewportEl) return;
    const supportData = activeData.support || defaultFAQ.support;
    const N = activeData.items.length;
    let trackHTML = "";
    activeData.items.forEach((item, idx) => {
      const isFirst = idx === 0;
      const isMobileHidden = idx >= 6;
      const itemClasses = [
        "faq-roller-item",
        isFirst ? "is-center is-open" : "",
        isMobileHidden ? "faq-mobile-hidden" : ""
      ].filter(Boolean).join(" ");
      trackHTML += `
      <div class="${itemClasses}" data-index="${idx}" role="button" tabindex="0" aria-label="${item.question}">
        <div class="faq-accordion-header">
          <span class="faq-roller-item-text">${item.question}</span>
          <span class="faq-roller-item-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/>
            </svg>
          </span>
        </div>
        <div class="faq-accordion-body">
          <div class="faq-accordion-body-inner">
            <p class="faq-accordion-answer">${item.answer}</p>
          </div>
        </div>
      </div>
    `;
    });
    trackEl.innerHTML = trackHTML;
    const allItems = Array.from(trackEl.querySelectorAll(".faq-roller-item"));
    let currentIndex = 0;
    let currentDisplayedIndex = -1;
    let answerTransitionTimer = null;
    let pendingIndex = null;
    function updateAnswerCard(index, immediate = false) {
      const item = activeData.items[index];
      if (!item || !answerCardEl) return;
      if (currentDisplayedIndex === index) return;
      if (immediate || currentDisplayedIndex === -1) {
        if (answerTransitionTimer) clearTimeout(answerTransitionTimer);
        currentDisplayedIndex = index;
        pendingIndex = null;
        answerCardEl.className = "faq-roller-answer-card is-card-entering";
        answerCardEl.innerHTML = `
        <h3 class="faq-answer-title">${item.question}</h3>
        <p class="faq-answer-content">${item.answer}</p>
      `;
        return;
      }
      const prevIndex = currentDisplayedIndex;
      pendingIndex = index;
      if (answerCardEl.classList.contains("is-card-exiting-up") || answerCardEl.classList.contains("is-card-exiting-down")) {
        return;
      }
      const isNext = index >= prevIndex;
      const exitClass = isNext ? "is-card-exiting-up" : "is-card-exiting-down";
      const enterStartClass = isNext ? "is-card-entering-start-up" : "is-card-entering-start-down";
      answerCardEl.classList.remove("is-card-entering");
      answerCardEl.classList.add(exitClass);
      if (answerTransitionTimer) clearTimeout(answerTransitionTimer);
      answerTransitionTimer = setTimeout(() => {
        const targetIdx = pendingIndex !== null ? pendingIndex : index;
        pendingIndex = null;
        currentDisplayedIndex = targetIdx;
        const targetItem = activeData.items[targetIdx];
        if (!targetItem) return;
        answerCardEl.innerHTML = `
        <h3 class="faq-answer-title">${targetItem.question}</h3>
        <p class="faq-answer-content">${targetItem.answer}</p>
      `;
        answerCardEl.classList.remove(exitClass);
        answerCardEl.classList.add(enterStartClass);
        void answerCardEl.offsetWidth;
        answerCardEl.classList.remove(enterStartClass);
        answerCardEl.classList.add("is-card-entering");
      }, 180);
    }
    let isProgrammaticScrolling = false;
    let programmaticScrollTimer = null;
    function scrollItemToCenter(item, smooth = true, callback = null) {
      if (window.innerWidth < 1024 || !item) return;
      const idx = parseInt(item.getAttribute("data-index") || "0", 10);
      const maxScroll = Math.max(0, viewportEl.scrollHeight - viewportEl.clientHeight);
      const vRect = viewportEl.getBoundingClientRect();
      const iRect = item.getBoundingClientRect();
      const currentScroll = viewportEl.scrollTop;
      const offset = iRect.top + iRect.height / 2 - (vRect.top + vRect.height / 2);
      let target = currentScroll + offset;
      if (idx === 0) {
        target = 0;
      } else if (idx === allItems.length - 1) {
        target = maxScroll;
      } else {
        target = Math.max(0, Math.min(target, maxScroll));
      }
      if (!smooth) {
        viewportEl.scrollTop = target;
        updateRollerPhysics();
        if (callback) callback();
        return;
      }
      isProgrammaticScrolling = true;
      if (programmaticScrollTimer) clearTimeout(programmaticScrollTimer);
      viewportEl.scrollTo({
        top: target,
        behavior: "smooth"
      });
      programmaticScrollTimer = setTimeout(() => {
        isProgrammaticScrolling = false;
        updateRollerPhysics();
        if (callback) callback();
      }, 450);
    }
    function updateRollerPhysics() {
      if (window.innerWidth < 1024) return;
      const vRect = viewportEl.getBoundingClientRect();
      const centerY = vRect.top + vRect.height / 2;
      const currentScroll = viewportEl.scrollTop;
      const maxScroll = Math.max(0, viewportEl.scrollHeight - viewportEl.clientHeight);
      let closestIdx = 0;
      let minDistance = Infinity;
      const maxDist = 115;
      allItems.forEach((item, idx) => {
        const iRect = item.getBoundingClientRect();
        const itemCenterY = iRect.top + iRect.height / 2;
        const dist = Math.abs(centerY - itemCenterY);
        if (dist < minDistance) {
          minDistance = dist;
          closestIdx = idx;
        }
      });
      if (currentScroll <= 15) {
        closestIdx = 0;
      } else if (currentScroll >= maxScroll - 20) {
        closestIdx = allItems.length - 1;
      }
      allItems.forEach((item, idx) => {
        const iRect = item.getBoundingClientRect();
        const itemCenterY = iRect.top + iRect.height / 2;
        const dist = Math.abs(centerY - itemCenterY);
        if (idx === closestIdx) {
          item.style.opacity = "1";
          item.style.transform = "scale(1.03)";
          item.classList.add("is-center");
          item.style.pointerEvents = "auto";
        } else {
          item.classList.remove("is-center");
          if (dist > maxDist) {
            item.style.opacity = "0.25";
            item.style.transform = "scale(0.88)";
          } else {
            const ratio = Math.min(1, Math.max(0, (dist - 20) / (maxDist - 20)));
            const opacity = Math.max(0.25, 0.85 - ratio * 0.55);
            const scale = 0.98 - ratio * 0.08;
            item.style.opacity = opacity.toFixed(2);
            item.style.transform = `scale(${scale.toFixed(3)})`;
          }
        }
      });
      if (closestIdx !== currentIndex) {
        currentIndex = closestIdx;
        updateAnswerCard(closestIdx);
      }
    }
    let isTicking = false;
    viewportEl.addEventListener("scroll", () => {
      if (window.innerWidth < 1024) return;
      if (!isTicking) {
        requestAnimationFrame(() => {
          updateRollerPhysics();
          isTicking = false;
        });
        isTicking = true;
      }
    }, { passive: true });
    let wheelDebounceTimer = null;
    viewportEl.addEventListener("wheel", (e) => {
      if (window.innerWidth < 1024) return;
      e.preventDefault();
      pauseFaqTimer();
      if (wheelDebounceTimer) return;
      wheelDebounceTimer = setTimeout(() => {
        wheelDebounceTimer = null;
      }, 280);
      if (e.deltaY > 0) {
        if (currentIndex < allItems.length - 1) {
          const nextIdx = currentIndex + 1;
          currentIndex = nextIdx;
          updateAnswerCard(nextIdx);
          scrollItemToCenter(allItems[nextIdx], true);
        }
      } else if (e.deltaY < 0) {
        if (currentIndex > 0) {
          const prevIdx = currentIndex - 1;
          currentIndex = prevIdx;
          updateAnswerCard(prevIdx);
          scrollItemToCenter(allItems[prevIdx], true);
        }
      }
    }, { passive: false });
    viewportEl.addEventListener("touchstart", () => {
      pauseFaqTimer();
    }, { passive: true });
    viewportEl.addEventListener("mouseenter", () => {
      pauseFaqTimer();
    });
    viewportEl.addEventListener("mouseleave", () => {
      if (window.innerWidth >= 1024 && currentIndex < allItems.length - 1) {
        startFaqTimer();
      }
    });
    allItems.forEach((item, idx) => {
      item.addEventListener("click", () => {
        const isMobile = window.innerWidth < 1024;
        if (isMobile) {
          const wasOpen = item.classList.contains("is-open");
          allItems.forEach((i) => i.classList.remove("is-open"));
          if (!wasOpen) item.classList.add("is-open");
        } else {
          currentIndex = idx;
          updateAnswerCard(idx);
          scrollItemToCenter(item, true);
          pauseFaqTimer();
        }
      });
    });
    let faqAutoTimer = null;
    function nextFAQ() {
      if (window.innerWidth < 1024) return;
      if (currentIndex >= allItems.length - 1) {
        pauseFaqTimer();
        return;
      }
      currentIndex++;
      const nextItem = allItems[currentIndex];
      if (nextItem) {
        updateAnswerCard(currentIndex);
        scrollItemToCenter(nextItem, true);
      }
    }
    function startFaqTimer() {
      if (window.innerWidth < 1024) return;
      if (currentIndex >= allItems.length - 1) return;
      if (faqAutoTimer) clearInterval(faqAutoTimer);
      faqAutoTimer = setInterval(() => {
        nextFAQ();
      }, 3800);
    }
    function pauseFaqTimer() {
      if (faqAutoTimer) {
        clearInterval(faqAutoTimer);
        faqAutoTimer = null;
      }
    }
    const faqSection = document.getElementById("faq");
    if (faqSection) {
      faqSection.addEventListener("mouseenter", () => {
        if (window.innerWidth >= 1024) pauseFaqTimer();
      });
      faqSection.addEventListener("mouseleave", () => {
        if (window.innerWidth >= 1024 && currentIndex < allItems.length - 1) {
          startFaqTimer();
        }
      });
    }
    window.addEventListener("resize", () => {
      if (window.innerWidth >= 1024) {
        scrollItemToCenter(allItems[currentIndex], false);
        updateRollerPhysics();
        if (currentIndex < allItems.length - 1) startFaqTimer();
      } else {
        pauseFaqTimer();
        allItems.forEach((item) => {
          item.style.opacity = "";
          item.style.transform = "";
          item.style.pointerEvents = "";
        });
      }
    });
    updateAnswerCard(0, true);
    if (window.innerWidth >= 1024) {
      viewportEl.scrollTop = 0;
      currentIndex = 0;
      updateRollerPhysics();
      setTimeout(() => {
        viewportEl.scrollTop = 0;
        updateRollerPhysics();
      }, 60);
      startFaqTimer();
    }
  }
  window.handleConsultationSubmit = function(formEl) {
    if (!formEl) return;
    const submitBtn = formEl.querySelector(".reg-submit-button");
    if (submitBtn) {
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = "<span>\u0110ang g\u1EEDi th\xF4ng tin...</span>";
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = "<span>\u2713 G\u1EEDi th\xE0nh c\xF4ng!</span>";
        submitBtn.style.background = "#10B981";
        let toast = document.createElement("div");
        toast.className = "gotek-consultation-toast";
        toast.innerHTML = `
        <div style="position: fixed; bottom: 30px; right: 30px; z-index: 99999; background: #0A1F68; color: #FFFFFF; padding: 18px 24px; border-radius: 12px; box-shadow: 0 16px 40px rgba(0, 0, 0, 0.25); display: flex; align-items: center; gap: 14px; font-family: 'Be Vietnam Pro', sans-serif; font-size: 0.92rem; border-left: 5px solid #0055FF; animation: slideInUp 0.4s ease;">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22DDE0" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <div>
            <div style="font-weight: 700; margin-bottom: 2px;">\u0110\u0103ng k\xFD t\u01B0 v\u1EA5n th\xE0nh c\xF4ng!</div>
            <div style="font-size: 0.82rem; color: #CBD5E1;">Chuy\xEAn gia Gotek s\u1EBD li\xEAn h\u1EC7 tr\u1EF1c ti\u1EBFp trong v\xF2ng 24 gi\u1EDD.</div>
          </div>
        </div>
      `;
        document.body.appendChild(toast);
        setTimeout(() => {
          toast.remove();
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = "";
          formEl.reset();
        }, 4e3);
      }, 800);
    }
  };

  // gotek/js/main.js
  function startApp() {
    console.log("\u{1F680} Gotek Web Application Initialized.");
    try {
      initHeroInteractive();
    } catch (e) {
      console.error("Error initHeroInteractive:", e);
    }
    try {
      initHeaderLogic();
    } catch (e) {
      console.error("Error initHeaderLogic:", e);
    }
    try {
      initMagneticButtons();
    } catch (e) {
      console.error("Error initMagneticButtons:", e);
    }
    try {
      initLeadForm();
    } catch (e) {
      console.error("Error initLeadForm:", e);
    }
    try {
      initCapabilityTabs();
    } catch (e) {
      console.error("Error initCapabilityTabs:", e);
    }
    try {
      initProcessConnectors();
    } catch (e) {
      console.error("Error initProcessConnectors:", e);
    }
    try {
      initCircuitConnectors();
    } catch (e) {
      console.error("Error initCircuitConnectors:", e);
    }
    try {
      initAboutScrollAnimation();
    } catch (e) {
      console.error("Error initAboutScrollAnimation:", e);
    }
    try {
      initMetricCounters();
    } catch (e) {
      console.error("Error initMetricCounters:", e);
    }
    try {
      initBentoScrollAnimation();
    } catch (e) {
      console.error("Error initBentoScrollAnimation:", e);
    }
    try {
      initEcosystemScrollAnimation();
    } catch (e) {
      console.error("Error initEcosystemScrollAnimation:", e);
    }
    try {
      initSolutionsHeaderAnimation();
    } catch (e) {
      console.error("Error initSolutionsHeaderAnimation:", e);
    }
    try {
      initProjectsScrollAnimation();
    } catch (e) {
      console.error("Error initProjectsScrollAnimation:", e);
    }
    try {
      initPricingScrollAnimation();
    } catch (e) {
      console.error("Error initPricingScrollAnimation:", e);
    }
    try {
      initFooterAccordion();
    } catch (e) {
      console.error("Error initFooterAccordion:", e);
    }
    try {
      initApp();
    } catch (e) {
      console.error("Error initApp:", e);
    }
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startApp);
  } else {
    startApp();
  }
})();
