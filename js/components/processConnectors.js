/**
 * PROCESS CONNECTORS COMPONENT WITH DUAL-DIRECTION SCROLL-DRIVEN REVEAL & HIDE
 * Tự động tính toán tọa độ và vẽ các đường nét đứt uốn lượn (Bezier S-curve)
 * kết nối tuần tự từ Bước 1 đến Bước 6 trong quy trình Bậc Thang Sole (Staircase Flow).
 *
 * Tính năng tương tác:
 * 1. Cuộn tới đâu hiện animation tới đó: Khi từng thẻ lọt vào tầm nhìn, đường nét đứt vẽ tới và thẻ bung mở.
 * 2. Cuộn ngược về thì thu ẩn dần: Khi cuộn ngược lên, các bước phía dưới thu nhỏ và mờ dần biến mất, đường nối thu lại.
 * 3. Hỗ trợ responsive tuyệt đối cho Laptop / Desktop, Tablet và Mobile.
 */

export function initProcessConnectors() {
  const wrap = document.getElementById('staircaseWrap');
  const group = document.getElementById('staircasePathGroup');
  const defs = document.getElementById('staircaseDefs');
  if (!wrap || !group || !defs) return;

  const cardIds = ['card1', 'card2', 'card3', 'card4', 'card5', 'card6'];
  const cards = cardIds.map(id => document.getElementById(id)).filter(Boolean);
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
      mask = document.createElementNS('http://www.w3.org/2000/svg', 'mask');
      mask.setAttribute('id', maskId);
      mask.setAttribute('maskUnits', 'userSpaceOnUse');
      defsEl.appendChild(mask);
    }
    mask.innerHTML = '';

    const maskPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    maskPath.setAttribute('d', d);
    maskPath.setAttribute('stroke', '#ffffff');
    maskPath.setAttribute('stroke-width', '20');
    maskPath.setAttribute('fill', 'none');
    maskPath.setAttribute('stroke-linecap', 'round');
    mask.appendChild(maskPath);

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', d);
    path.setAttribute('class', 'staircase-connector-path');
    path.setAttribute('mask', `url(#${maskId})`);
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
        maskPath.style.strokeDashoffset = '0';
        setTimeout(() => {
          if (this.isShown) {
            path.setAttribute('marker-end', 'url(#arrowhead)');
          }
        }, duration * 0.75);
      },
      hide(duration = 260) {
        this.isShown = false;
        path.removeAttribute('marker-end');
        maskPath.style.transition = `stroke-dashoffset ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
        maskPath.style.strokeDashoffset = `${len}`;
      },
      reset() {
        this.isShown = false;
        maskPath.style.transition = 'none';
        maskPath.style.strokeDashoffset = `${len}`;
        path.removeAttribute('marker-end');
      },
      instantShow() {
        this.isShown = true;
        maskPath.style.transition = 'none';
        maskPath.style.strokeDashoffset = '0';
        path.setAttribute('marker-end', 'url(#arrowhead)');
      }
    };

    return item;
  }

  function renderConnectors() {
    // Tạm thời vô hiệu hóa transform khi đo để lấy tọa độ chuẩn xác 100%
    wrap.classList.add('is-measuring');

    const wrapRect = wrap.getBoundingClientRect();
    const svg = document.getElementById('staircaseSvg');
    if (svg && wrapRect.width && wrapRect.height) {
      svg.setAttribute('viewBox', `0 0 ${wrapRect.width} ${wrapRect.height}`);
      svg.setAttribute('width', wrapRect.width);
      svg.setAttribute('height', wrapRect.height);
    }
    group.innerHTML = '';

    const r1 = getCardRect('card1', wrapRect);
    const r2 = getCardRect('card2', wrapRect);
    const r3 = getCardRect('card3', wrapRect);
    const r4 = getCardRect('card4', wrapRect);
    const r5 = getCardRect('card5', wrapRect);
    const r6 = getCardRect('card6', wrapRect);

    wrap.classList.remove('is-measuring');

    if (!r1 || !r2 || !r3 || !r4 || !r5 || !r6) return;

    const isPhone = window.innerWidth <= 640;

    if (isPhone) {
      // Trên Điện Thoại (<= 640px): Nối từ đáy thẻ trên xuống đỉnh thẻ dưới tuần tự
      const pLeft = 0.30;
      const pRight = 0.70;

      connectors = [
        createCurveWithMask(r1.left + r1.width * pLeft, r1.bottom, r2.left + r2.width * pRight, r2.top - 4, 0, group, defs, true),
        createCurveWithMask(r2.left + r2.width * pRight, r2.bottom, r3.left + r3.width * pLeft, r3.top - 4, 1, group, defs, true),
        createCurveWithMask(r3.left + r3.width * pLeft, r3.bottom, r4.left + r4.width * pRight, r4.top - 4, 2, group, defs, true),
        createCurveWithMask(r4.left + r4.width * pRight, r4.bottom, r5.left + r5.width * pLeft, r5.top - 4, 3, group, defs, true),
        createCurveWithMask(r5.left + r5.width * pLeft, r5.bottom, r6.left + r6.width * pRight, r6.top - 4, 4, group, defs, true)
      ];
    } else {
      // Trên iPad & Desktop: Bậc thang 2 cột sole (1 bên trái, 2 bên phải dưới...)
      connectors = [
        createCurveWithMask(r1.right, r1.top + r1.height * 0.38, r2.centerX, r2.top - 3, 0, group, defs, false),
        createCurveWithMask(r2.left, Math.max(r2.top + r2.height * 0.42, r1.bottom + 12), r3.centerX, r3.top - 3, 1, group, defs, false),
        createCurveWithMask(r3.right, r3.top + r3.height * 0.38, r4.centerX, r4.top - 3, 2, group, defs, false),
        createCurveWithMask(r4.left, Math.max(r4.top + r4.height * 0.42, r3.bottom + 12), r5.centerX, r5.top - 3, 3, group, defs, false),
        createCurveWithMask(r5.right, r5.top + r5.height * 0.38, r6.centerX, r6.top - 3, 4, group, defs, false)
      ];
    }

    // Khôi phục trạng thái hiển thị của từng connector tương ứng với trạng thái thẻ
    connectors.forEach((conn, cIdx) => {
      if (cardStates[cIdx + 1]) {
        conn.instantShow();
      } else {
        conn.reset();
      }
    });
  }

  // Bật chế độ hỗ trợ animation qua JS
  wrap.classList.add('has-js-anim');

  // Khởi tạo tính toán ban đầu
  renderConnectors();
  setTimeout(renderConnectors, 120);
  setTimeout(renderConnectors, 450);

  /**
   * Kích hoạt animation khi cuộn tới Bước idx
   */
  function revealStep(idx) {
    if (cardStates[idx]) return;

    // Đảm bảo tất cả các bước trước đó đã được hiển thị
    for (let i = 0; i < idx; i++) {
      if (!cardStates[i]) {
        cardStates[i] = true;
        cards[i]?.classList.add('is-revealed');
        if (i > 0 && connectors[i - 1]) {
          connectors[i - 1].instantShow();
        }
      }
    }

    cardStates[idx] = true;
    const card = cards[idx];
    if (!card) return;

    if (idx === 0) {
      card.classList.add('is-revealed');
    } else {
      const connIdx = idx - 1;
      if (connectors[connIdx]) {
        connectors[connIdx].reveal(380);
      }
      setTimeout(() => {
        if (cardStates[idx]) {
          card.classList.add('is-revealed');
        }
      }, 150);
    }
  }

  /**
   * Thu ẩn dần khi người dùng cuộn ngược về lên trên (Bước idx rơi ra khỏi đáy màn hình)
   */
  function hideStep(idx) {
    if (!cardStates[idx]) return;

    // Khi bước idx rơi xuống dưới, thu ẩn bước này và toàn bộ các bước sau nó
    for (let j = idx; j < cards.length; j++) {
      if (cardStates[j]) {
        cardStates[j] = false;
        cards[j]?.classList.remove('is-revealed');
        if (j > 0 && connectors[j - 1]) {
          connectors[j - 1].hide(240);
        }
      }
    }
  }

  // Thiết lập IntersectionObserver độc lập cho từng thẻ
  if ('IntersectionObserver' in window) {
    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const card = entry.target;
        const idx = cards.indexOf(card);
        if (idx === -1) return;

        if (entry.isIntersecting) {
          // Cuộn tới đâu hiện animation tới đó
          revealStep(idx);
        } else {
          // Khi cuộn ngược về: nếu thẻ trôi xuống dưới đáy màn hình (top > 0), thu ẩn dần
          if (entry.boundingClientRect.top > 0) {
            hideStep(idx);
          }
        }
      });
    }, {
      threshold: 0.18,
      rootMargin: '0px 0px -40px 0px'
    });

    cards.forEach(c => cardObserver.observe(c));
  } else {
    // Dự phòng khi trình duyệt không hỗ trợ Observer
    cards.forEach(c => c.classList.add('is-revealed'));
    connectors.forEach(c => c.instantShow());
  }

  // Xử lý khi thay đổi kích thước màn hình
  window.addEventListener('resize', renderConnectors);

  if (window.ResizeObserver) {
    const ro = new ResizeObserver(() => renderConnectors());
    ro.observe(wrap);
  }

  if (document.fonts) {
    document.fonts.ready.then(renderConnectors);
  }
}
