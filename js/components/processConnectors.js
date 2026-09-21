/**
 * PROCESS CONNECTORS COMPONENT WITH PROGRESSIVE STEP-BY-STEP REVEAL
 * Tự động tính toán tọa độ và vẽ các đường nét đứt mượt mà uốn lượn (Bezier S-curve)
 * kết nối tuần tự từ Bước 1 đến Bước 6 trong quy trình Bậc Thang Sole (Staircase Flow).
 *
 * Hiệu ứng Animation:
 * 1. Khung 1 từ từ hiện ra.
 * 2. Đường cong nét đứt vẽ dần từng đoạn (- - -) từ mép Thẻ 1 uốn lượn cắm vào đỉnh Thẻ 2.
 * 3. Khung 2 từ từ hiện ra.
 * 4. Đường cong nét đứt vẽ dần sang Thẻ 3...
 * ... Tuần tự cho đến khi hiện hết toàn bộ 6 bước!
 */

export function initProcessConnectors() {
  const wrap = document.getElementById('staircaseWrap');
  const group = document.getElementById('staircasePathGroup');
  const defs = document.getElementById('staircaseDefs');
  if (!wrap || !group || !defs) return;

  let hasAnimated = false;
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
    maskPath.setAttribute('stroke-width', '18');
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

    return {
      maskPath,
      path,
      length: len,
      reveal(duration = 750) {
        maskPath.style.transition = `stroke-dashoffset ${duration}ms cubic-bezier(0.35, 0, 0.25, 1)`;
        maskPath.style.strokeDashoffset = '0';
        // Thêm mũi tên sau khi vẽ gần xong
        setTimeout(() => {
          path.setAttribute('marker-end', 'url(#arrowhead)');
        }, duration * 0.85);
      },
      reset() {
        maskPath.style.transition = 'none';
        maskPath.style.strokeDashoffset = `${len}`;
        path.removeAttribute('marker-end');
      },
      instantShow() {
        maskPath.style.transition = 'none';
        maskPath.style.strokeDashoffset = '0';
        path.removeAttribute('mask');
        path.setAttribute('marker-end', 'url(#arrowhead)');
      }
    };
  }

  function renderConnectors() {
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

    if (!r1 || !r2 || !r3 || !r4 || !r5 || !r6) return;

    const isPhone = window.innerWidth <= 640;

    if (isPhone) {
      // Trên Điện Thoại (<= 640px): Nối từ đáy thẻ trên xuống đỉnh thẻ dưới (lùi vào 30% từ 2 mép) tuần tự từ Bước 1 đến Bước 6
      const pLeft = 0.30;
      const pRight = 0.70;

      connectors = [
        // 1. Thẻ 1 (đáy 30% trái) -> Thẻ 2 (đỉnh 70% phải)
        createCurveWithMask(r1.left + r1.width * pLeft, r1.bottom, r2.left + r2.width * pRight, r2.top - 4, 0, group, defs, true),
        // 2. Thẻ 2 (đáy 70% phải) -> Thẻ 3 (đỉnh 30% trái)
        createCurveWithMask(r2.left + r2.width * pRight, r2.bottom, r3.left + r3.width * pLeft, r3.top - 4, 1, group, defs, true),
        // 3. Thẻ 3 (đáy 30% trái) -> Thẻ 4 (đỉnh 70% phải)
        createCurveWithMask(r3.left + r3.width * pLeft, r3.bottom, r4.left + r4.width * pRight, r4.top - 4, 2, group, defs, true),
        // 4. Thẻ 4 (đáy 70% phải) -> Thẻ 5 (đỉnh 30% trái)
        createCurveWithMask(r4.left + r4.width * pRight, r4.bottom, r5.left + r5.width * pLeft, r5.top - 4, 3, group, defs, true),
        // 5. Thẻ 5 (đáy 30% trái) -> Thẻ 6 (đỉnh 70% phải)
        createCurveWithMask(r5.left + r5.width * pLeft, r5.bottom, r6.left + r6.width * pRight, r6.top - 4, 4, group, defs, true)
      ];

      if (hasAnimated) {
        connectors.forEach(c => c.instantShow());
      } else {
        connectors.forEach(c => c.reset());
      }
    } else {
      // Trên iPad (641px - 1024px) & Desktop (> 1024px): Bậc thang 2 cột sole (1 bên trái, 2 bên phải dưới...)
      connectors = [
        createCurveWithMask(r1.right, r1.top + r1.height * 0.38, r2.centerX, r2.top - 2, 0, group, defs, false),
        createCurveWithMask(r2.left, Math.max(r2.top + r2.height * 0.42, r1.bottom + 12), r3.centerX, r3.top - 2, 1, group, defs, false),
        createCurveWithMask(r3.right, r3.top + r3.height * 0.38, r4.centerX, r4.top - 2, 2, group, defs, false),
        createCurveWithMask(r4.left, Math.max(r4.top + r4.height * 0.42, r3.bottom + 12), r5.centerX, r5.top - 2, 3, group, defs, false),
        createCurveWithMask(r5.right, r5.top + r5.height * 0.38, r6.centerX, r6.top - 2, 4, group, defs, false)
      ];

      if (hasAnimated) {
        connectors.forEach(c => c.instantShow());
      } else {
        connectors.forEach(c => c.reset());
      }
    }
  }

  function playStepByStepAnimation() {
    if (hasAnimated) return;
    hasAnimated = true;

    wrap.classList.add('has-js-anim');

    const cards = [
      document.getElementById('card1'),
      document.getElementById('card2'),
      document.getElementById('card3'),
      document.getElementById('card4'),
      document.getElementById('card5'),
      document.getElementById('card6')
    ];

    // BƯỚC 1: Khung 1 xuất hiện nhanh, dứt khoát
    if (cards[0]) cards[0].classList.add('is-revealed');

    // BƯỚC 2: Đường cong 1 (Thẻ 1 -> Thẻ 2) vẽ nhanh trong 420ms
    setTimeout(() => {
      if (connectors[0]) connectors[0].reveal(420);
    }, 180);

    // BƯỚC 3: Khung 2 xuất hiện
    setTimeout(() => {
      if (cards[1]) cards[1].classList.add('is-revealed');
    }, 600);

    // BƯỚC 4: Đường cong 2 (Thẻ 2 -> Thẻ 3) vẽ nhanh trong 420ms
    setTimeout(() => {
      if (connectors[1]) connectors[1].reveal(420);
    }, 780);

    // BƯỚC 5: Khung 3 xuất hiện
    setTimeout(() => {
      if (cards[2]) cards[2].classList.add('is-revealed');
    }, 1200);

    // BƯỚC 6: Đường cong 3 (Thẻ 3 -> Thẻ 4) vẽ nhanh trong 420ms
    setTimeout(() => {
      if (connectors[2]) connectors[2].reveal(420);
    }, 1380);

    // BƯỚC 7: Khung 4 xuất hiện
    setTimeout(() => {
      if (cards[3]) cards[3].classList.add('is-revealed');
    }, 1800);

    // BƯỚC 8: Đường cong 4 (Thẻ 4 -> Thẻ 5) vẽ nhanh trong 420ms
    setTimeout(() => {
      if (connectors[3]) connectors[3].reveal(420);
    }, 1980);

    // BƯỚC 9: Khung 5 xuất hiện
    setTimeout(() => {
      if (cards[4]) cards[4].classList.add('is-revealed');
    }, 2400);

    // BƯỚC 10: Đường cong 5 (Thẻ 5 -> Thẻ 6) vẽ nhanh trong 420ms
    setTimeout(() => {
      if (connectors[4]) connectors[4].reveal(420);
    }, 2580);

    // BƯỚC 11: Khung 6 (Cột mốc hoàn thành) xuất hiện nổi bật
    setTimeout(() => {
      if (cards[5]) cards[5].classList.add('is-revealed');
    }, 3000);
  }

  // Khởi tạo tính toán ban đầu
  renderConnectors();
  setTimeout(renderConnectors, 100);
  setTimeout(renderConnectors, 400);

  // Kích hoạt IntersectionObserver khi người dùng cuộn đến khu vực quy trình
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          playStepByStepAnimation();
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.05,
      rootMargin: '50px 0px 50px 0px'
    });

    observer.observe(wrap);
  } else {
    playStepByStepAnimation();
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
