/**
 * CIRCUIT CONNECTORS COMPONENT (GOTEK ARCHITECTURE DIAGRAM)
 * Tự động tính toán tọa độ pixel và vẽ các đường kẻ nối (Circuit Lines)
 * chính xác 100% giữa 7 ô giải pháp công nghệ theo sơ đồ kiến trúc Gotek.
 */

export function initCircuitConnectors() {
  const wrap = document.getElementById('circuitWrapper');
  const svg = document.getElementById('circuitSvg');
  if (!wrap || !svg) return;

  function updateLines() {
    if (window.innerWidth < 768) {
      svg.innerHTML = '';
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

    const c1 = getCard('circuit-uiux');
    const c2 = getCard('circuit-frontend');
    const c3 = getCard('circuit-mobile');
    const c4 = getCard('circuit-backend');
    const c5 = getCard('circuit-cloud');
    const c6 = getCard('circuit-ai');
    const c7 = getCard('circuit-seo');

    if (!c1 || !c2 || !c3 || !c4 || !c5 || !c6 || !c7) return;

    svg.setAttribute('viewBox', `0 0 ${wrapRect.width} ${wrapRect.height}`);

    const paths = [
      // 1. UI/UX -> Front-end (Đường kẻ dọc)
      { 
        id: 'line-uiux-frontend', 
        cards: ['circuit-uiux', 'circuit-frontend'],
        d: `M ${c1.centerX} ${c1.bottom} L ${c2.centerX} ${c2.top}` 
      },
      
      // 2. Front-end -> Backend (L-step: Đi xuống rồi rẽ phải vào Backend)
      { 
        id: 'line-frontend-backend', 
        cards: ['circuit-frontend', 'circuit-backend'],
        d: `M ${c2.centerX} ${c2.bottom} V ${c4.centerY} H ${c4.left}` 
      },
      
      // 3. Mobile App -> Backend (Đường kẻ dọc)
      { 
        id: 'line-mobile-backend', 
        cards: ['circuit-mobile', 'circuit-backend'],
        d: `M ${c3.centerX} ${c3.bottom} L ${c4.centerX} ${c4.top}` 
      },
      
      // 4. Mobile App -> AI (Đường kẻ ngang)
      { 
        id: 'line-mobile-ai', 
        cards: ['circuit-mobile', 'circuit-ai'],
        d: `M ${c3.right} ${c6.centerY} L ${c6.left} ${c6.centerY}` 
      },
      
      // 5. Cloud & DevOps -> AI (Đường kẻ dọc)
      { 
        id: 'line-cloud-ai', 
        cards: ['circuit-cloud', 'circuit-ai'],
        d: `M ${c5.centerX} ${c5.bottom} L ${c6.centerX} ${c6.top}` 
      },
      
      // 6. AI -> SEO (Đường kẻ dọc)
      { 
        id: 'line-ai-seo', 
        cards: ['circuit-ai', 'circuit-seo'],
        d: `M ${c6.centerX} ${c6.bottom} L ${c7.centerX} ${c7.top}` 
      },
      
      // 7. Backend -> SEO (Đường kẻ ngang)
      { 
        id: 'line-backend-seo', 
        cards: ['circuit-backend', 'circuit-seo'],
        d: `M ${c4.right} ${c4.centerY} L ${c7.left} ${c4.centerY}` 
      }
    ];

    svg.innerHTML = paths.map(p => `
      <path id="${p.id}" class="circuit-line-path" data-cards="${p.cards.join(' ')}" d="${p.d}" />
    `).join('');

    // Gắn hiệu ứng tương tác: Hover vào thẻ nào thì các đường kẻ nối tới thẻ đó sẽ sáng xanh
    const allCards = [c1.el, c2.el, c3.el, c4.el, c5.el, c6.el, c7.el];
    allCards.forEach(card => {
      card.onmouseenter = () => {
        const cardId = card.id;
        const matchingLines = svg.querySelectorAll(`[data-cards~="${cardId}"]`);
        matchingLines.forEach(line => line.classList.add('active'));
      };
      card.onmouseleave = () => {
        const matchingLines = svg.querySelectorAll('.circuit-line-path.active');
        matchingLines.forEach(line => line.classList.remove('active'));
      };
    });
  }

  // Khởi chạy ngay và các sự kiện phụ trợ
  updateLines();
  window.addEventListener('resize', updateLines);
  window.addEventListener('orientationchange', updateLines);

  if ('fonts' in document) {
    document.fonts.ready.then(updateLines);
  }

  if ('ResizeObserver' in window) {
    new ResizeObserver(updateLines).observe(wrap);
  }

  // Cập nhật lại sau khi animation bento trượt vào
  setTimeout(updateLines, 600);
  setTimeout(updateLines, 1200);
}
