/**
 * GOTEK APP CONTROLLER
 * Nạp dữ liệu từ thư mục data/ (thông qua GotekDataStore) và render tự động lên giao diện HTML.
 */

import { $, $$, getInitials } from './utils/helpers.js';
import { 
  initEcosystemScrollAnimation, 
  initProjectsScrollAnimation, 
  initPricingScrollAnimation 
} from './components/scrollAnimations.js?v=13';

export async function initApp() {
  if (!window.GotekDataStore) {
    console.error("[GotekApp] Không tìm thấy GotekDataStore!");
    return;
  }

  // 1. Nạp toàn bộ dữ liệu từ store
  const data = await window.GotekDataStore.loadAll();
  console.log("[GotekApp] Loaded data:", data);

  // 2. Render từng section có bọc try/catch độc lập
  try { renderSiteConfig(data.config); } catch (e) { console.error('Error in renderSiteConfig:', e); }
  try { renderServices(data.services); } catch (e) { console.error('Error in renderServices:', e); }
  try { renderProjectSections([data.projectsSaas, data.projectsWeb, data.projectsCustom]); } catch (e) { console.error('Error in renderProjectSections:', e); }
  try { renderPricing(data.pricing); } catch (e) { console.error('Error in renderPricing:', e); }
  try { renderEcosystem(data.ecosystem); } catch (e) { console.error('Error in renderEcosystem:', e); }
  try { renderTeam(data.team); } catch (e) { console.error('Error in renderTeam:', e); }
  try { renderTestimonials(data.testimonials); } catch (e) { console.error('Error in renderTestimonials:', e); }
  try { renderEcosystemTeams(data.ecosystemTeams); } catch (e) { console.error('Error in renderEcosystemTeams:', e); }
  try { renderFAQ(data.faq); } catch (e) { console.error('Error in renderFAQ:', e); }
}

/**
 * Render cấu hình thông tin thương hiệu, hotline, địa chỉ, số liệu thống kê
 */
function renderSiteConfig(config) {
  if (!config) return;

  // Hotline & Phone
  $$('.dyn-hotline').forEach(el => el.textContent = config.contact.phoneDisplay);
  $$('.dyn-hotline-link').forEach(el => el.setAttribute('href', `tel:${config.contact.hotline}`));
  $$('.dyn-email').forEach(el => el.textContent = config.contact.email);
  $$('.dyn-email-link').forEach(el => el.setAttribute('href', `mailto:${config.contact.email}`));
  $$('.dyn-address').forEach(el => el.textContent = config.contact.address);

  // Thống kê Hero stats
  const heroStatsContainer = $('#heroStatsContainer');
  if (heroStatsContainer && config.stats) {
    heroStatsContainer.innerHTML = config.stats.map(s => `
      <div class="hero-stat-item">
        <strong>${s.number}</strong>
        <span>${s.label}</span>
      </div>
    `).join('');
  }
}

/**
 * Render danh sách dịch vụ công nghệ
 */
function renderServices(services) {
  const container = $('#servicesGrid');
  if (!container || !services) return;

  container.innerHTML = services.map(s => `
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
        ${s.features.map(f => `
          <li>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            ${f}
          </li>
        `).join('')}
      </ul>
    </div>
  `).join('');
}

/**
 * Render danh sách dự án tiêu biểu theo từng nhóm độc lập (SaaS, Web, Dịch vụ tùy chỉnh)
 * - Tự động phát hiện số cột hiển thị theo kích thước màn hình (Desktop: 3 cột, Tablet: 2 cột, Mobile: 1 cột)
 * - Nếu số thẻ > số cột (lớn hơn khung cột): Kích hoạt animation chạy mượt mà
 *   + Nhóm 1 (Cái đầu): Chạy từ Phải sang Trái (RTL)
 *   + Nhóm 2 (Cái thứ 2): Chạy từ Trái sang Phải (LTR)
 *   + Nhóm 3 (Cái thứ 3): Chạy từ Phải sang Trái (RTL)
 * - Nếu số thẻ <= số cột (nhỏ hơn hoặc bằng khung): Đứng im tĩnh (Static)
 */
function renderProjectSections(groups) {
  const container = $('#projectsContainer') || $('.project-3-saas-web-hatang');
  if (!container || !groups) return;

  const validGroups = groups.filter(g => g && g.items && g.items.length > 0);
  if (validGroups.length === 0) return;

  function renderCard(item) {
    const link = item.link || '#contact';
    const isExt = link.startsWith('http');
    return `
      <article class="project-card">
        <a href="${link}" ${isExt ? 'target="_blank" rel="noopener noreferrer"' : ''} class="project-card-link" aria-label="${item.name || ''}">
          <div class="project-card-header">
            <h3 class="project-card-title">${item.name || item.title || ''}</h3>
          </div>
          <div class="project-scroll-viewport">
            <img src="${item.image}" alt="${item.name || item.title || ''}"
                 class="project-scroll-img" loading="lazy" />
          </div>
        </a>
      </article>
    `;
  }

  function updateProjectLayout() {
    const containerW = container.clientWidth || 1032;
    const screenW = window.innerWidth;
    // Ngưỡng cột theo màn hình:
    // Laptop / Desktop lớn: 3 cột để 3 thẻ chiếm vừa vặn 100% khung lớn
    // Tablet (640px - 991px): 2 cột
    // Mobile (< 640px): 1.15 cột
    let visibleCols;
    let gap;
    if (screenW >= 992) {
      visibleCols = 3;
      gap = 16;
    } else if (screenW >= 640) {
      visibleCols = 2;
      gap = 14;
    } else {
      visibleCols = 1.15;
      gap = 12;
    }

    // Padding bên trong của khung .project-saas
    const saasPadding = screenW >= 1200 ? 36 : (screenW >= 768 ? 28 : 20);
    const trackVisibleW = Math.max(200, containerW - saasPadding);

    // Độ rộng mỗi thẻ co giãn tương thích: 3 thẻ chiếm vừa khít khung lớn (~315px - 330px trên desktop)
    let cardW = Math.floor((trackVisibleW - (visibleCols - 1) * gap) / visibleCols);
    cardW = Math.max(220, Math.min(cardW, 360));

    const isLaptop = screenW >= 992;

    container.innerHTML = validGroups.map((group, gIdx) => {
      const itemsCount = group.items.length;
      // Tính tổng độ rộng thực tế của tất cả items (bao gồm thẻ cardW và khoảng cách gap)
      const totalItemsWidth = itemsCount > 0 ? (itemsCount * cardW + (itemsCount - 1) * gap) : 0;

      // FEEDBACK:
      // - Chỉ áp dụng với laptop (screenW >= 992px):
      //   + Nếu có từ 4 cái trở lên (itemsCount >= 4): CÓ AUTOMATION (chạy marquee lặp vô tận)
      //   + Dưới 4 cái (< 4): KHÔNG CÓ AUTOMATION (đứng im tĩnh hoàn toàn)
      // - Với mobile / tablet (screenW < 992px):
      //   + Tự động chạy marquee nếu số thẻ vượt quá số cột nhìn thấy (tràn khung)
      let isOverflow;
      if (isLaptop) {
        isOverflow = itemsCount >= 4;
      } else {
        const fullCols = Math.floor(visibleCols);
        isOverflow = itemsCount > fullCols || totalItemsWidth > trackVisibleW;
      }

      // Hướng chạy khi có overflow:
      // Cái đầu (gIdx 0): Phải sang Trái (RTL)
      // Cái thứ 2 (gIdx 1): Trái sang Phải (LTR)
      // Cái thứ 3 (gIdx 2): Phải sang Trái (RTL)
      const direction = (gIdx % 2 === 0) ? 'rtl' : 'ltr';

      // Nếu lớn hơn khung cột (overflow): nhân đôi danh sách thẻ để tạo vòng lặp chạy vô tận
      // Nếu nhỏ hơn hoặc bằng khung cột (không overflow): chỉ render đúng số thẻ ban đầu và đứng im
      const cardsHtml = isOverflow
        ? group.items.map(renderCard).join('') + group.items.map(renderCard).join('')
        : group.items.map(renderCard).join('');

      // Tốc độ animation tính theo số lượng thẻ để luôn trôi mượt
      const duration = Math.max(20, itemsCount * 7.5);

      return `
        <div class="project-saas-web-hatang" data-group-index="${gIdx}">
          <div class="project-type-pill">
            <h2>${group.categoryTitle || ''}</h2>
          </div>
          <div class="project-saas ${isOverflow ? `is-marquee dir-${direction}` : 'is-static'}"
               style="--card-w: ${cardW}px; --project-gap: ${gap}px; --marquee-duration: ${duration}s;">
            <div class="project-track">
              ${cardsHtml}
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Khởi chạy render
  updateProjectLayout();
  try { initProjectsScrollAnimation(); } catch (e) {}

  // Lắng nghe thay đổi kích thước màn hình để tự động cập nhật số cột và độ rộng thẻ
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      updateProjectLayout();
    }, 100);
  });
}

/**
 * Render bảng báo giá dịch vụ (Pricing)
 */
function renderPricing(pricing) {
  const container = $('#pricingGrid') || $('.pricing-grid');
  if (!container || !pricing || !Array.isArray(pricing)) return;

  container.innerHTML = pricing.map(pkg => `
    <div class="pricing-card ${pkg.isFeatured ? 'pricing-card-featured' : 'pricing-card-side'}">
      <div class="pricing-ribbon-tag">${pkg.ribbonTag || ''}</div>

      <div class="pricing-card-top-bar">
        <span class="pricing-category-badge">${pkg.categoryBadge || ''}</span>
        <span class="pricing-level-tag">${pkg.levelTag || ''}</span>
      </div>

      <h3 class="pricing-plan-name">${pkg.planName || ''}</h3>
      <p class="pricing-plan-desc">${pkg.planDesc || ''}</p>

      <div class="pricing-investment-box">
        <span class="investment-label">${pkg.investmentLabel || 'MỨC ĐẦU TƯ DỰ KIẾN'}</span>
        <div class="investment-price-row">
          <span class="investment-price">${pkg.price || ''}</span>
          <span class="investment-unit">${pkg.unit || ''}</span>
        </div>
      </div>

      <div class="pricing-features-wrap">
        <span class="features-label">${pkg.featuresLabel || 'BAO GỒM CÁC HẠNG MỤC:'}</span>
        <ul class="pricing-feature-list">
          ${(pkg.features || []).map(feat => `
            <li>
              <span class="feature-check-icon">&#10003;</span>
              <span>${feat}</span>
            </li>
          `).join('')}
        </ul>
      </div>

      <div class="pricing-card-footer">
        <a href="${pkg.buttonLink || '#contact'}" class="pricing-action-btn ${pkg.isFeatured ? 'pricing-action-primary' : ''}">
          <span>${pkg.buttonText || 'Tư Vấn Ngay'}</span>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
            stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </a>
      </div>
    </div>
  `).join('');

  try { initPricingScrollAnimation(); } catch (e) {}
}

/**
 * Render đội ngũ chuyên gia
 */
function renderTeam(team) {
  const container = $('#teamGrid');
  if (!container || !team) return;

  container.innerHTML = team.map(m => `
    <div class="card-team">
      <img class="card-team-avatar" src="${m.avatar}" alt="${m.name}" loading="lazy" />
      <h3 class="card-team-name">${m.name}</h3>
      <div class="card-team-role">${m.role}</div>
      <p class="card-team-bio">${m.bio}</p>
    </div>
  `).join('');
}

/**
 * Render đánh giá khách hàng (Testimonials)
 * Tự động trích xuất 2 ký tự đầu qua hàm getInitials(item.name) nếu không có trong data.
/**
 * Render đánh giá khách hàng (Testimonials) - Chuẩn thiết kế ảnh 2:
/**
 * Render đánh giá khách hàng (Testimonials) - Chuyển động lượn men theo đường cong (Curved Arc Motion):
 * 1. Comment nằm ở trên.
 * 2. Khung tác giả nằm ở DƯỚI comment: Ảnh đại diện thật của khách hàng, Name, 5 sao đặt dưới name, bỏ tên công ty.
 * 3. Chuyển động lượn men theo đường cong (Curved Path):
 *    - Các thẻ di chuyển theo quỹ đạo parabol y = (offset^2) * curveFactor - peakOffset.
 *    - Thẻ bên ngoài trượt men theo cánh cung dâng lên đỉnh ở giữa.
 *    - Thẻ ở giữa lướt men theo cánh cung chúc xuống khi trượt ra ngoài.
 *    - Chuyển động tính tại từng frame qua requestAnimationFrame với gia tốc mượt mà (smooth easing).
 * 4. Tối đa đúng 3 nút tròn chuyển slide (mỗi nút ứng với 1 nhóm 3 thẻ).
 */
function renderTestimonials(testimonialsData) {
  if (!testimonialsData) return;

  const sectionInfo = testimonialsData.section || null;
  const list = Array.isArray(testimonialsData) ? testimonialsData : (testimonialsData.testimonials || []);

  // 1. Render Header
  const titleEl = $('#testimonialsTitle');
  if (sectionInfo && titleEl && sectionInfo.title) {
    const cleanHighlight = (sectionInfo.highlightTitle || '').replace(/\?+$/, '');
    titleEl.innerHTML = `<span class="testimonials-title-main">${sectionInfo.title}</span> <span class="testimonials-title-sub text-brand-gradient">${cleanHighlight}</span>`;
  }

  const stageContainer = $('#testimonialsStage') || $('#testimonialsTrack');
  const dotsContainer = $('#testimonialsDots');
  if (!stageContainer || list.length === 0) return;

  const starSVG = `
    <svg class="testimonial-star-icon" viewBox="0 0 20 20" fill="currentColor">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
    </svg>
  `;

  // Render các thẻ đánh giá độc lập vào sân khấu cánh cung
  stageContainer.innerHTML = list.map((t, idx) => {
    const starsCount = t.rating || 5;
    const avatarUrl = t.avatar || 'assets/images/customers/customer_1.jpg';

    return `
      <div class="testimonial-card" data-card-index="${idx}">
        <!-- 1. Nội dung comment ở trên -->
        <p class="testimonial-quote">
          "${t.quote || t.comment || ''}"
        </p>

        <!-- 2. Nguyên khung hình ảnh + 5 sao nằm ở DƯỚI comment -->
        <div class="testimonial-author-bottom">
          <div class="testimonial-author-meta-wrap">
            <img src="${avatarUrl}" alt="${t.name}" class="testimonial-avatar-img" loading="lazy" />
            <div class="testimonial-author-meta">
              <h4 class="testimonial-author-name">${t.name}</h4>
              <div class="testimonial-stars">
                ${Array(starsCount).fill(starSVG).join('')}
              </div>
            </div>
          </div>
          <!-- Dấu nháy kép quote ở góc phải như hình 2 -->
          <div class="testimonial-quote-icon" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
            </svg>
          </div>
        </div>
      </div>
    `;
  }).join('');

  const cardElements = Array.from(stageContainer.querySelectorAll('.testimonial-card'));
  const N = cardElements.length;
  if (N === 0) return;

  // Cấu hình tham số hình học cho đường cong cánh cung (Curved Arc Geometry)
  function getArcMetrics() {
    const w = window.innerWidth;
    if (w < 480) {
      const cardW = Math.min(290, w - 56);
      return {
        spacing: cardW + 30, // Đảm bảo khoảng cách rõ ràng 30px giữa thẻ chính và thẻ lộ nửa cạnh
        curveFactor: 12,
        peakOffset: 6,
        tiltFactor: 1.8,
        scaleDrop: 0.05
      };
    } else if (w < 768) {
      return {
        spacing: 335, // Thẻ 290px + gap 45px
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

  // Chuyển slide từng thẻ tuần tự (chỉ 1 thẻ mỗi lần):
  let currentCenter = 0;
  let isAnimating = false;
  let animStartCenter = currentCenter;
  let animTargetCenter = currentCenter;
  let animStartTime = 0;
  const animDuration = 720; // ms

  // Hàm gia tốc mượt mà (Ease-in-out cubic)
  function easeInOutCubic(x) {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  }

  // Cập nhật vị trí từng thẻ men theo đường cong cánh cung
  function updateArcPositions(c) {
    const metrics = getArcMetrics();

    for (let k = 0; k < N; k++) {
      let offset = k - c;
      offset = ((((offset + N / 2) % N) + N) % N) - N / 2;

      const absOffset = Math.abs(offset);
      const card = cardElements[k];

      if (absOffset > 2.6) {
        card.style.opacity = '0';
        card.style.pointerEvents = 'none';
        card.style.visibility = 'hidden';
        continue;
      }

      card.style.visibility = 'visible';

      // QUỸ ĐẠO CÁNH CUNG CONG:
      // X tịnh tiến theo spacing
      const x = offset * metrics.spacing;
      // Y đạt đỉnh cao nhất tại offset = 0 (trung tâm) và lượn cong chúc xuống 2 bên theo hàm bậc hai (offset^2)
      const y = (offset * offset) * metrics.curveFactor - metrics.peakOffset;
      // Góc xoay nghiêng tự nhiên theo tiếp tuyến đường cong
      const rotate = offset * metrics.tiltFactor;
      // Kích thước thu phóng mượt mà
      const scale = Math.max(0.84, 1.02 - absOffset * metrics.scaleDrop);

      // Độ mờ: Thẻ trung tâm = 1, thẻ 2 bên mờ nhẹ tạo chiều sâu
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
      card.style.pointerEvents = absOffset < 1.35 ? 'auto' : 'none';

      if (absOffset < 0.4) {
        card.classList.add('is-center');
      } else {
        card.classList.remove('is-center');
      }
    }
  }

  function getNormalizedActiveIndex() {
    return ((Math.round(currentCenter) % N) + N) % N;
  }

  function updateDots(activeIdx) {
    if (!dotsContainer) return;
    const dots = Array.from(dotsContainer.querySelectorAll('.testimonials-dot'));
    if (dots.length === 0) return;

    const total = dots.length;
    if (window.innerWidth >= 768) {
      // Desktop / Laptop: Hiển thị các chấm điều hướng tương ứng từng thẻ, active lướt theo từng thẻ
      dots.forEach((d, i) => {
        d.style.display = 'inline-block';
        d.classList.toggle('active', i === activeIdx);
        d.classList.remove('dot-small');
      });
    } else {
      // Mobile: Sliding window tối đa 5 nút gọn gàng
      let startIndex = activeIdx - 2;
      if (startIndex < 0) startIndex = 0;
      if (startIndex > total - 5) startIndex = total - 5;
      const endIndex = startIndex + 4;

      dots.forEach((d, i) => {
        const isActive = (i === activeIdx);
        d.classList.toggle('active', isActive);

        if (i >= startIndex && i <= endIndex) {
          d.style.display = 'inline-block';
          const dist = Math.abs(i - activeIdx);
          if (dist >= 2) {
            d.classList.add('dot-small');
          } else {
            d.classList.remove('dot-small');
          }
        } else {
          d.style.display = 'none';
          d.classList.remove('dot-small');
        }
      });
    }
  }

  function buildDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';

    // Hiển thị nút tròn tương ứng với từng thẻ đánh giá (chuyển 1 thẻ mỗi lần)
    for (let i = 0; i < N; i++) {
      const btn = document.createElement('button');
      btn.className = 'testimonials-dot';
      btn.setAttribute('data-card-index', i);
      btn.setAttribute('aria-label', `Đánh giá ${i + 1}`);
      btn.addEventListener('click', () => {
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

  // Vòng lặp chuyển động men theo quỹ đạo cong qua requestAnimationFrame
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
      currentCenter = ((animTargetCenter % N) + N) % N;
      updateArcPositions(currentCenter);
      updateDots(getNormalizedActiveIndex());
    }
  }

  function startMoveTo(newTarget) {
    animStartCenter = currentCenter;
    animTargetCenter = newTarget;
    animStartTime = performance.now();
    isAnimating = true;

    const targetActive = ((Math.round(newTarget) % N) + N) % N;
    updateDots(targetActive);

    requestAnimationFrame(animateFrame);
  }

  // Chuyển qua đúng 1 item mỗi lần
  function nextCard() {
    startMoveTo(currentCenter + 1);
  }

  function prevCard() {
    startMoveTo(currentCenter - 1);
  }

  // Gắn sự kiện click thẻ lân cận để lướt mượt về trung tâm
  cardElements.forEach(card => {
    card.addEventListener('click', () => {
      const idx = parseInt(card.getAttribute('data-card-index'), 10);
      let offset = idx - currentCenter;
      offset = ((((offset + N / 2) % N) + N) % N) - N / 2;

      if (Math.abs(offset) > 0.4 && Math.abs(offset) < 1.6) {
        const delta = Math.round(offset);
        startMoveTo(currentCenter + delta);
        restartTimer();
      }
    });
  });

  // Hỗ trợ vuốt chạm (Touch Swipe)
  let touchStartX = 0;
  let touchEndX = 0;
  const wrapper = $('.testimonials-curved-wrapper');

  if (wrapper) {
    wrapper.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    wrapper.addEventListener('touchend', e => {
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

  // Tự động chuyển slide đều đặn (4s theo yêu cầu)
  let autoTimer = null;
  function startTimer() {
    autoTimer = setInterval(() => {
      nextCard();
    }, 4000);
  }

  function restartTimer() {
    if (autoTimer) clearInterval(autoTimer);
    startTimer();
  }

  if (wrapper) {
    wrapper.addEventListener('mouseenter', () => {
      if (autoTimer) clearInterval(autoTimer);
    });
    wrapper.addEventListener('mouseleave', () => {
      restartTimer();
    });
  }

  // Resize window: Cập nhật lại vị trí mượt mà
  window.addEventListener('resize', () => {
    updateArcPositions(currentCenter);
    updateDots(getNormalizedActiveIndex());
  });

  // Khởi tạo hiển thị ban đầu
  buildDots();
  updateArcPositions(currentCenter);
  startTimer();
}

/**
 * Render Hệ Sinh Thái Đối Tác (Mẫu 2: Checkerboard Logo Grid 2 Dòng, Có Slider & Tự Động Chuyển Sau 3s Nếu > 2 Dòng)
 */
let ecosystemSliderTimer = null;
let ecosystemSliderState = {
  currentSlide: 0,
  totalSlides: 1,
  isPaused: false,
  partners: []
};

function renderEcosystem(ecosystem) {
  if (!ecosystem || !$('#ecosystemSliderTrack')) return;

  // Render Header section
  const titleEl = $('#ecosystemTitle');
  const subEl = $('#ecosystemSubtitle');
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
  const track = $('#ecosystemSliderTrack');
  const wrapper = $('#ecosystemSliderWrapper');
  const controls = $('#ecosystemControls');
  const dotsContainer = $('#ecosystemDots');
  const prevBtn = $('#ecosystemPrevBtn');
  const nextBtn = $('#ecosystemNextBtn');

  if (!track || !wrapper) return;

  // Xác định số cột cho 1 dòng (Desktop: 5, Tablet ngang: 4, Tablet dọc: 3, Mobile: 2)
  const width = window.innerWidth;
  const cols = width > 1024 ? 5 : (width > 768 ? 4 : (width > 540 ? 3 : 2));
  const itemsPerSlide = cols * 2; // BẮT BUỘC ĐÚNG 2 DÒNG THEO YÊU CẦU
  const totalSlides = Math.ceil(partners.length / itemsPerSlide);
  ecosystemSliderState.totalSlides = totalSlides;

  // Dọn dẹp timer cũ nếu có
  if (ecosystemSliderTimer) {
    clearInterval(ecosystemSliderTimer);
    ecosystemSliderTimer = null;
  }

  // Nếu số đối tác <= 2 dòng: chỉ hiển thị 1 trang tĩnh, ẩn controls
  if (totalSlides <= 1) {
    if (controls) controls.style.display = 'none';
    track.style.transform = 'none';
    const topRow = partners.slice(0, cols);
    const bottomRow = partners.slice(cols, cols * 2);
    track.innerHTML = `
      <div class="ecosystem-slide">
        <div class="ecosystem-staggered-grid">
          <div class="ecosystem-staggered-row ecosystem-row-top">
            ${topRow.map(p => `
              <div class="ecosystem-partner-item" title="${p.title || p.name}">
                <img src="${p.logo}" alt="${p.alt || p.name}" />
              </div>
            `).join('')}
          </div>
          <div class="ecosystem-staggered-row ecosystem-row-bottom">
            ${bottomRow.map(p => `
              <div class="ecosystem-partner-item" title="${p.title || p.name}">
                <img src="${p.logo}" alt="${p.alt || p.name}" />
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
    return;
  }

  // Nếu nhiều hơn 2 dòng: Hiển thị bộ điều khiển & kích hoạt auto-play 3s
  if (controls) controls.style.display = 'flex';

  // Render các slide (mỗi slide đúng 2 dòng xen kẽ nhau)
  let slidesHTML = '';
  for (let i = 0; i < totalSlides; i++) {
    let slideItems = partners.slice(i * itemsPerSlide, (i + 1) * itemsPerSlide);
    // Nếu slide cuối không đủ số lượng lấp đầy 2 hàng, lấy xoay vòng từ đầu danh sách để slide luôn vuông vắn cân xứng
    if (slideItems.length < itemsPerSlide) {
      slideItems = slideItems.concat(partners.slice(0, itemsPerSlide - slideItems.length));
    }
    const topRow = slideItems.slice(0, cols);
    const bottomRow = slideItems.slice(cols, cols * 2);
    slidesHTML += `
      <div class="ecosystem-slide" data-slide-index="${i}">
        <div class="ecosystem-staggered-grid">
          <div class="ecosystem-staggered-row ecosystem-row-top">
            ${topRow.map(p => `
              <div class="ecosystem-partner-item" title="${p.title || p.name}">
                <img src="${p.logo}" alt="${p.alt || p.name}" />
              </div>
            `).join('')}
          </div>
          <div class="ecosystem-staggered-row ecosystem-row-bottom">
            ${bottomRow.map(p => `
              <div class="ecosystem-partner-item" title="${p.title || p.name}">
                <img src="${p.logo}" alt="${p.alt || p.name}" />
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }
  track.innerHTML = slidesHTML;

  // Render các nút tròn Pagination Dots
  if (dotsContainer) {
    dotsContainer.innerHTML = Array.from({ length: totalSlides }, (_, i) => `
      <button class="ecosystem-dot ${i === 0 ? 'active' : ''}" data-index="${i}" aria-label="Trang đối tác ${i + 1}"></button>
    `).join('');
  }

  function goToSlide(index) {
    if (ecosystemSliderState.totalSlides <= 1) return;
    ecosystemSliderState.currentSlide = (index + ecosystemSliderState.totalSlides) % ecosystemSliderState.totalSlides;
    track.style.transform = `translateX(-${ecosystemSliderState.currentSlide * 100}%)`;

    // Cập nhật trạng thái active của dots
    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll('.ecosystem-dot');
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === ecosystemSliderState.currentSlide);
      });
    }
  }

  function nextSlide() {
    goToSlide(ecosystemSliderState.currentSlide + 1);
  }

  function prevSlide() {
    goToSlide(ecosystemSliderState.currentSlide - 1);
  }

  // Bắt đầu autoplay sau 3s (3000ms) chuyển 1 lần
  function startAutoplay() {
    if (ecosystemSliderTimer) clearInterval(ecosystemSliderTimer);
    ecosystemSliderTimer = setInterval(() => {
      if (!ecosystemSliderState.isPaused) {
        nextSlide();
      }
    }, 3000);
  }

  // Gắn sự kiện nút bấm điều khiển
  if (prevBtn) {
    prevBtn.onclick = () => {
      prevSlide();
      startAutoplay(); // Reset timer 3s
    };
  }

  if (nextBtn) {
    nextBtn.onclick = () => {
      nextSlide();
      startAutoplay(); // Reset timer 3s
    };
  }

  if (dotsContainer) {
    dotsContainer.onclick = (e) => {
      const btn = e.target.closest('.ecosystem-dot');
      if (btn) {
        const idx = parseInt(btn.dataset.index, 10);
        if (!isNaN(idx)) {
          goToSlide(idx);
          startAutoplay(); // Reset timer 3s
        }
      }
    };
  }

  // Tạm dừng khi hover, tiếp tục khi rời chuột
  wrapper.onmouseenter = () => { ecosystemSliderState.isPaused = true; };
  wrapper.onmouseleave = () => { ecosystemSliderState.isPaused = false; };
  if (controls) {
    controls.onmouseenter = () => { ecosystemSliderState.isPaused = true; };
    controls.onmouseleave = () => { ecosystemSliderState.isPaused = false; };
  }

  // Hỗ trợ cảm ứng vuốt trên Mobile / iPad (Touch Swipe)
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

  // Tạm dừng khi chuyển tab trình duyệt
  document.addEventListener('visibilitychange', () => {
    ecosystemSliderState.isPaused = document.hidden;
  });
  document.addEventListener('visibilitychange', () => {
    ecosystemSliderState.isPaused = document.hidden;
  });

  // Khởi động từ slide 0
  ecosystemSliderState.currentSlide = 0;
  goToSlide(0);
  startAutoplay();
}

// Xử lý khi thay đổi kích thước cửa sổ (Resize debounced)
let ecoResizeTimer = null;
let ecoLastWidth = window.innerWidth;
window.addEventListener('resize', () => {
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

/**
 * Render Hệ Sinh Thái 3 Đội Ngũ, 3 Phần Việc (Bố cục Zig-Zag so le theo mẫu Image 1)
 * Hàng 1: Go Media (Nội dung Trái, Visual Pebble Phải)
 * Hàng 2: GoNetwork (Visual Pebble Trái, Nội dung Phải - So le đảo chiều)
 * Hàng 3: Gotek (Nội dung Trái, Visual Pebble Phải)
 */
function renderEcosystemTeams(data) {
  if (!data) return;

  // 1. Render Header (Tiêu đề, Eyebrow & Mô tả)
  const eyebrowEl = $('#ecosystemTeamsEyebrow');
  const titleEl = $('#ecosystemTeamsTitle');
  const descEl = $('#ecosystemTeamsDesc');

  if (eyebrowEl && data.section?.eyebrow) {
    eyebrowEl.textContent = data.section.eyebrow;
  }
  if (titleEl && data.section) {
    let sub = data.section.subtitleTitle || '';
    if (sub.includes('Ba Đội Ngũ') && !sub.includes('text-brand-gradient')) {
      sub = sub.replace('Ba Đội Ngũ', '<span class="text-brand-gradient">Ba Đội Ngũ</span>');
    }
    titleEl.innerHTML = `${data.section.title} <br class="hidden sm:inline" />${sub}`;
  }
  if (descEl && data.section) {
    descEl.textContent = data.section.description;
  }

  // 2. Render Ecosystem Zig-Zag Flow
  const stageEl = $('#ecosystemStage');
  if (!stageEl || !data.teams || data.teams.length < 3) return;

  const team1 = data.teams.find(t => t.id === 'team-gomedia') || data.teams[0];
  const team2 = data.teams.find(t => t.id === 'team-gonetwork') || data.teams[1];
  const team3 = data.teams.find(t => t.id === 'team-gotek') || data.teams[2];

  const items = [
    {
      ...team1,
      pillarTag: 'GO MEDIA',
      pillarSubtitle: 'CHIẾN LƯỢC & NỘI DUNG',
      desc1: team1.description || 'Go Media chuyển mục tiêu kinh doanh thành định hướng thương hiệu, kế hoạch nội dung và hoạt động thương mại điện tử nhất quán trên các kênh.',
      desc2: 'Từ bộ nhận diện số đến các chiến dịch truyền thông đa kênh, từng điểm chạm đều được thiết kế bài bản nhằm khơi dậy nhu cầu thực tế của khách hàng, tạo lập vị thế vững chắc và mở rộng thị trường.',
      visual: 'assets/images/ecosystem/gomedia-team.jpg',
      shapeClass: 'shape-pillar-1',
      containerClass: 'shape-pillar-1-container',
      isReversed: false
    },
    {
      ...team2,
      pillarTag: 'GONETWORK',
      pillarSubtitle: 'MẠNG LƯỚI & TIẾNG NÓI',
      desc1: team2.description || 'GoNetwork đưa kế hoạch vào mạng lưới nhà sáng tạo, KOL/KOC: làm rõ đối tượng, phạm vi, lịch triển khai và đầu mối phối hợp bài bản.',
      desc2: 'Thay vì quảng bá một chiều, thương hiệu tiếp cận người tiêu dùng thông qua những câu chuyện chân thực và gần gũi, giúp thông điệp lan tỏa tự nhiên với tỷ lệ tương tác và chuyển đổi cao nhất.',
      visual: 'assets/images/ecosystem/gonetwork-team.jpg',
      shapeClass: 'shape-pillar-2',
      containerClass: 'shape-pillar-2-container',
      isReversed: true
    },
    {
      ...team3,
      pillarTag: 'GOTEK',
      pillarSubtitle: 'CÔNG NGHỆ & VẬN HÀNH',
      desc1: team3.description || 'Gotek xây website, phần mềm, hạ tầng và tự động hóa để dữ liệu, quy trình cùng trải nghiệm số có thể vận hành, theo dõi và mở rộng không giới hạn.',
      desc2: 'Mọi điểm chạm từ tiếp thị và mạng lưới đối tác đều được Gotek kết nối liền mạch vào hệ thống dữ liệu tập trung, giúp doanh nghiệp kiểm soát toàn diện và sẵn sàng bứt phá tăng trưởng.',
      visual: 'assets/images/ecosystem/gotek-team.jpg',
      shapeClass: 'shape-pillar-3',
      containerClass: 'shape-pillar-3-container',
      isReversed: false
    }
  ];

  stageEl.innerHTML = items.map(item => `
    <article class="ecosystem-zigzag-row ${item.isReversed ? 'is-reversed' : ''}" id="${item.id}">
      <div class="ecosystem-zigzag-content">
        <div class="ecosystem-zigzag-brand-wrap">
          <img src="${item.logo}" alt="${item.name}" class="ecosystem-zigzag-brand-logo" />
        </div>
        <h3 class="ecosystem-zigzag-title">${item.title}</h3>
        <p class="ecosystem-zigzag-desc">${item.desc1}</p>
        <p class="ecosystem-zigzag-desc">${item.desc2}</p>
        <div class="ecosystem-zigzag-action">
          <a href="${item.link || '#'}" class="ecosystem-zigzag-cta" target="_blank" rel="noopener noreferrer">
            <span>${item.btntxt || ('Khám phá ' + item.name)}</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
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
  `).join('');

  // Kích hoạt hiệu ứng xuất hiện đối xứng (trái từ trái sang, phải từ phải sang)
  try { initEcosystemScrollAnimation(); } catch (e) { console.error('Error initEcosystemScrollAnimation:', e); }
}

/**
 * Render Câu Hỏi Thường Gặp (FAQ - Con lăn bánh xe Roller Wheel & Khung trả lời)
 * - Cột Trái: Hiển thị 7 câu hỏi dạng viên thuốc, cuộn tự do, câu ở giữa sáng nhất, các câu xa dần mờ và biến mất (Hình 2)
 * - Cột Phải: Khung câu trả lời nổi bật, cập nhật tức thời và mượt mà theo câu ở giữa
 */
function renderFAQ(faqData) {
  // 0. Dữ liệu mặc định nếu faqData rỗng (hỗ trợ cả môi trường mở trực tiếp file:///)
  const defaultFAQ = {
    section: {
      tag: "GIẢI ĐÁP THẮC MẮC",
      title: "Câu Hỏi",
      highlightTitle: "Thường Gặp",
      subtitle: "Giải đáp những thắc mắc phổ biến nhất để bạn hoàn toàn an tâm khi lựa chọn Gotek làm đối tác công nghệ chiến lược."
    },
    support: {
      title: "Chưa tìm thấy câu trả lời bạn cần?",
      description: "Đội ngũ kỹ sư trưởng sẵn sàng tư vấn trực tiếp và khảo sát bài toán kỹ thuật của bạn hoàn toàn miễn phí.",
      ctaText: "Tư vấn qua Zalo",
      ctaLink: "https://zalo.me/0978970605"
    },
    items: [
      {
        id: "faq-01",
        num: "01",
        category: "CHI PHÍ DỰ ÁN",
        question: "Chi phí phát triển một website hoặc phần mềm là bao nhiêu?",
        answer: "Chi phí phụ thuộc vào quy mô tính năng, kiến trúc hệ thống và công nghệ lựa chọn. Gotek luôn khảo sát kỹ lưỡng và cung cấp báo giá chi tiết, minh bạch theo từng Sprint bàn giao, cam kết không phát sinh chi phí ẩn trong suốt quá trình triển khai."
      },
      {
        id: "faq-02",
        num: "02",
        category: "TIẾN ĐỘ & THỜI GIAN",
        question: "Thời gian hoàn thành và bàn giao dự án mất bao lâu?",
        answer: "Một dự án tiêu chuẩn thường kéo dài từ 4 đến 8 tuần tùy theo phạm vi công việc. Đội ngũ áp dụng quy trình Agile Sprint hàng tuần, demo sản phẩm thực tế định kỳ vào mỗi thứ Sáu để khách hàng luôn chủ động nắm bắt tiến độ và góp ý kịp thời."
      },
      {
        id: "faq-03",
        num: "03",
        category: "BẢN QUYỀN SOURCE CODE",
        question: "Gotek có bàn giao 100% bản quyền mã nguồn (Source Code) không?",
        answer: "Chắc chắn có. Toàn bộ 100% bản quyền mã nguồn sạch, tài liệu kiến trúc kỹ thuật (System Architecture), tài liệu API OpenAPI/Swagger và toàn quyền quản trị tài nguyên Cloud sẽ được chuyển giao trọn vẹn cho doanh nghiệp của bạn."
      },
      {
        id: "faq-04",
        num: "04",
        category: "BẢO HÀNH & BẢO TRÌ",
        question: "Chính sách bảo hành, bảo trì và hỗ trợ kỹ thuật sau bàn giao ra sao?",
        answer: "Gotek cam kết bảo hành kỹ thuật 12 tháng miễn phí và hỗ trợ giám sát hệ thống 24/7. Chúng tôi tổ chức các buổi đào tạo chuyển giao công nghệ cho nhân sự nội bộ của bạn, đồng thời sẵn sàng đồng hành mở rộng tính năng theo các giai đoạn phát triển tiếp theo."
      },
      {
        id: "faq-05",
        num: "05",
        category: "BẢO MẬT & NDA",
        question: "Dữ liệu và ý tưởng kinh doanh của doanh nghiệp có được bảo mật không?",
        answer: "Gotek ký thỏa thuận bảo mật NDA pháp lý trước khi tiếp cận dữ liệu hoặc thảo luận chi tiết bài toán kinh doanh. Tất cả mã nguồn và dữ liệu kiểm thử đều được lưu trữ trên môi trường phân quyền bảo mật riêng biệt."
      },
      {
        id: "faq-06",
        num: "06",
        category: "MỞ RỘNG TÍNH NĂNG",
        question: "Gotek có hỗ trợ nâng cấp và phát triển tính năng mới sau này không?",
        answer: "Hoàn toàn có. Kiến trúc do Gotek xây dựng tuân thủ quy chuẩn Module hóa và Clean Architecture, giúp bạn dễ dàng bổ sung tính năng mới, kết nối AI hoặc mở rộng quy mô người dùng mà không cần đập đi xây lại."
      },
      {
        id: "faq-07",
        num: "07",
        category: "HẠ TẦNG & CHỊU TẢI",
        question: "Hệ thống có chịu tải được lượng người dùng lớn cùng lúc không?",
        answer: "Có. Đội ngũ Gotek thiết kế hạ tầng Cloud Auto-scaling trên AWS/GCP, kết hợp Redis Caching và Cloudflare CDN giúp hệ thống chịu tải hàng triệu lượt truy cập đồng thời với độ trễ cực thấp và ổn định 99.9% Uptime."
      },
      {
        id: "faq-08",
        num: "08",
        category: "LỘ TRÌNH THANH TOÁN",
        question: "Phương thức và lộ trình thanh toán dự án được chia như thế nào?",
        answer: "Lộ trình thanh toán được chia nhỏ theo 3 - 4 giai đoạn gắn liền với kết quả bàn giao thực tế (Khởi động -> Hoàn thiện UI/UX -> Bàn giao bản Beta kiểm thử -> Bàn giao nghiệm thu chính thức), đảm bảo an tâm và quyền lợi tối đa cho khách hàng."
      },
      {
        id: "faq-09",
        num: "09",
        category: "HỢP TÁC MVP",
        question: "Doanh nghiệp có thể bắt đầu từ một tính năng nhỏ trước được không?",
        answer: "Hoàn toàn được. Gotek khuyến khích phát triển theo mô hình MVP (Minimum Viable Product) để đưa sản phẩm ra thị trường nhanh nhất, kiểm chứng nhu cầu thực tế rồi mới mở rộng các phân hệ tiếp theo."
      },
      {
        id: "faq-10",
        num: "10",
        category: "ĐỘI NGŨ CHUYÊN MÔN",
        question: "Nhân sự trực tiếp thực hiện dự án có trình độ chuyên môn ra sao?",
        answer: "100% dự án tại Gotek được dẫn dắt bởi Solution Architect và Senior Developer có từ 5-8 năm kinh nghiệm thực chiến trong các bài toán High-Load và Enterprise Architecture."
      }
    ]
  };

  const activeData = (faqData && faqData.items && faqData.items.length > 0) ? faqData : defaultFAQ;

  // 1. Render Header
  const titleEl = $('#faqTitle');
  const subtitleEl = $('#faqSubtitle');
  if (activeData.section) {
    if (titleEl && activeData.section.title) {
      titleEl.innerHTML = `${activeData.section.title} <span class="text-brand-gradient">${activeData.section.highlightTitle || ''}</span>`;
    }
    if (subtitleEl && activeData.section.subtitle) subtitleEl.textContent = activeData.section.subtitle;
  }

  // 2. DOM Elements
  const trackEl = $('#faqRollerTrack');
  const viewportEl = $('#faqRollerViewport');
  const answerCardEl = $('#faqAnswerCard');
  if (!trackEl || !viewportEl) return;

  const supportData = activeData.support || defaultFAQ.support;

  // 3. Render danh sách câu hỏi vào track với cấu trúc 5 Set nhân bản để cuộn vòng lặp vô tận (Infinite Looping Cylinder)
  // Set 2 là Set chính (Canonical). Set 0, 1 nằm trước; Set 3, 4 nằm sau.
  // Khi ở đầu danh sách (Câu hỏi 1), các câu hỏi cuối (Q8, Q9, Q10) từ Set 1 tự động hiển thị ở trên theo yêu cầu.
  const N = activeData.items.length;
  const numSets = 5;
  const canonicalSetIndex = 2; // Set 2 ở vị trí trung tâm
  let trackHTML = '';

  for (let s = 0; s < numSets; s++) {
    const isMainSet = (s === canonicalSetIndex);
    activeData.items.forEach((item, idx) => {
      const globalIdx = s * N + idx;
      const isFirstItemInMain = isMainSet && (idx === 0);
      const isClone = !isMainSet;
      const isMobileHidden = isMainSet && (idx >= 5); // Mobile/iPad chỉ hiển thị 5 câu đầu

      const itemClasses = [
        'faq-roller-item',
        isFirstItemInMain ? 'is-center is-open' : '',
        isClone ? 'is-clone' : 'is-main',
        isMobileHidden ? 'faq-mobile-hidden' : ''
      ].filter(Boolean).join(' ');

      trackHTML += `
        <div class="${itemClasses}" data-index="${idx}" data-set="${s}" data-global-index="${globalIdx}" role="button" tabindex="0" aria-label="${item.question}">
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
  }
  trackEl.innerHTML = trackHTML;

  const allItems = Array.from(trackEl.querySelectorAll('.faq-roller-item'));
  let currentGlobalIndex = canonicalSetIndex * N; // Set 2 item 0 (Câu hỏi 1)
  let currentCenterRealIndex = 0;

  // Hàm cập nhật khung câu trả lời bên phải (dành cho Desktop)
  function updateAnswerCard(index) {
    const item = activeData.items[index];
    if (!item || !answerCardEl) return;

    answerCardEl.classList.remove('faq-fade-in');
    void answerCardEl.offsetWidth; // trigger reflow
    answerCardEl.classList.add('faq-fade-in');

    answerCardEl.innerHTML = `
      <h3 class="faq-answer-title">${item.question}</h3>
      <p class="faq-answer-content">${item.answer}</p>
    `;
  }

  // Hàm cuộn item vào chính giữa con lăn (chỉ cuộn viewportEl trên Desktop)
  let isProgrammaticScrolling = false;
  let programmaticScrollTimer = null;

  function scrollItemToCenter(item, smooth = true, callback = null) {
    if (window.innerWidth < 1024 || !item) return;
    const vRect = viewportEl.getBoundingClientRect();
    const iRect = item.getBoundingClientRect();
    const currentScroll = viewportEl.scrollTop;
    const offset = (iRect.top + iRect.height / 2) - (vRect.top + vRect.height / 2);
    const target = currentScroll + offset;

    if (!smooth) {
      viewportEl.style.scrollSnapType = 'none';
      viewportEl.scrollTop = target;
      requestAnimationFrame(() => {
        viewportEl.style.scrollSnapType = '';
        updateRollerPhysics();
        if (callback) callback();
      });
      return;
    }

    isProgrammaticScrolling = true;
    if (programmaticScrollTimer) clearTimeout(programmaticScrollTimer);

    viewportEl.scrollTo({
      top: target,
      behavior: 'smooth'
    });

    programmaticScrollTimer = setTimeout(() => {
      isProgrammaticScrolling = false;
      updateRollerPhysics();
      if (callback) callback();
    }, 380);
  }

  // Hàm tính toán hiệu ứng mờ dần theo khoảng cách đến tâm (chỉ chạy trên Desktop)
  function updateRollerPhysics() {
    if (window.innerWidth < 1024) return;
    const vRect = viewportEl.getBoundingClientRect();
    const centerY = vRect.top + vRect.height / 2;

    let closestRealIdx = 0;
    let closestGlobalIdx = currentGlobalIndex;
    let minDistance = Infinity;
    const maxDist = 210;

    allItems.forEach((item) => {
      const iRect = item.getBoundingClientRect();
      const itemCenterY = iRect.top + iRect.height / 2;
      const dist = Math.abs(centerY - itemCenterY);

      if (dist < minDistance) {
        minDistance = dist;
        closestRealIdx = parseInt(item.dataset.index, 10);
        closestGlobalIdx = parseInt(item.dataset.globalIndex, 10);
      }

      if (dist < 32) {
        // Ngay tâm giữa (Center) - RÕ NÉT NHẤT
        item.style.opacity = '1';
        item.style.transform = 'scale(1.03)';
        item.classList.add('is-center');
        item.style.pointerEvents = 'auto';
      } else {
        item.classList.remove('is-center');
        if (dist > maxDist) {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.86)';
          item.style.pointerEvents = 'none';
        } else {
          const ratio = (dist - 32) / (maxDist - 32);
          const opacity = Math.max(0, 0.82 - (ratio * 0.56));
          const scale = 0.98 - (ratio * 0.10);
          item.style.opacity = opacity.toFixed(2);
          item.style.transform = `scale(${scale.toFixed(3)})`;
          item.style.pointerEvents = 'auto';
        }
      }
    });

    // Cập nhật câu trả lời nếu câu ở giữa thay đổi
    if (closestRealIdx !== currentCenterRealIndex && minDistance < 42) {
      currentCenterRealIndex = closestRealIdx;
      currentGlobalIndex = closestGlobalIdx;
      updateAnswerCard(closestRealIdx);
    }
  }

  // Giữ vị trí cuộn thủ công luôn nằm quanh Set 2 trung tâm, tránh chạm mép track
  function handleScrollLoop() {
    if (isProgrammaticScrolling || window.innerWidth < 1024) return;
    if (allItems.length <= N) return;
    const singleSetHeight = allItems[N].offsetTop - allItems[0].offsetTop;
    if (singleSetHeight <= 0) return;

    if (viewportEl.scrollTop >= 3.5 * singleSetHeight) {
      viewportEl.style.scrollSnapType = 'none';
      viewportEl.scrollTop -= singleSetHeight;
      viewportEl.style.scrollSnapType = '';
    } else if (viewportEl.scrollTop < 1.5 * singleSetHeight) {
      viewportEl.style.scrollSnapType = 'none';
      viewportEl.scrollTop += singleSetHeight;
      viewportEl.style.scrollSnapType = '';
    }
  }

  // Lắng nghe sự kiện cuộn mượt bằng requestAnimationFrame
  let isTicking = false;
  viewportEl.addEventListener('scroll', () => {
    if (window.innerWidth < 1024) return;
    if (!isTicking) {
      requestAnimationFrame(() => {
        handleScrollLoop();
        updateRollerPhysics();
        isTicking = false;
      });
      isTicking = true;
    }
  }, { passive: true });

  // Khi click vào bất kỳ câu hỏi nào
  allItems.forEach((item) => {
    item.addEventListener('click', () => {
      const isMobile = window.innerWidth < 1024;
      if (isMobile) {
        // Giao diện nhỏ: Accordion Mẫu 1 (mở / đóng mượt mà)
        const wasOpen = item.classList.contains('is-open');
        allItems.forEach(i => {
          i.classList.remove('is-open');
        });
        if (!wasOpen) {
          item.classList.add('is-open');
        }
      } else {
        // Desktop: cuộn vào giữa con lăn và cập nhật
        const gIdx = parseInt(item.dataset.globalIndex, 10);
        const realIdx = parseInt(item.dataset.index, 10);
        currentGlobalIndex = gIdx;
        currentCenterRealIndex = realIdx;
        updateAnswerCard(realIdx);

        scrollItemToCenter(item, true, () => {
          // Chuẩn hóa vị trí về lại Set 2 trung tâm (không giật hình)
          if (currentGlobalIndex < 2 * N || currentGlobalIndex >= 3 * N) {
            const normalizedGlobal = 2 * N + realIdx;
            currentGlobalIndex = normalizedGlobal;
            scrollItemToCenter(allItems[normalizedGlobal], false);
          }
        });
        restartFaqTimer();
      }
    });
  });

  // =========================================================================
  // TỰ ĐỘNG CHUYỂN ĐỔI CÂU HỎI MỖI 2.5 GIÂY (CHỈ ÁP DỤNG TRÊN DESKTOP >= 1024PX)
  // VÒNG LẶP VÔ TẬN: HẾT CÂU 10 SẼ TỰ ĐỘNG CUỘN TIẾP XUỐNG CÂU 1 MƯỢT MÀ
  // IPAD VÀ MOBILE: KHÔNG CHẠY ANIMATION NÀY, GIỮ NGUYÊN ACCORDION THỦ CÔNG
  // =========================================================================
  let faqAutoTimer = null;

  function nextFAQ() {
    if (window.innerWidth < 1024) return;
    const nextGlobal = currentGlobalIndex + 1;
    if (nextGlobal >= allItems.length) {
      currentGlobalIndex = canonicalSetIndex * N;
      scrollItemToCenter(allItems[currentGlobalIndex], false);
      return;
    }

    const nextItem = allItems[nextGlobal];
    const realIdx = parseInt(nextItem.dataset.index, 10);
    currentGlobalIndex = nextGlobal;
    currentCenterRealIndex = realIdx;
    updateAnswerCard(realIdx);

    scrollItemToCenter(nextItem, true, () => {
      // Khi đã cuộn vào Set 3 (index >= 3*N), chuẩn hóa êm đềm về Set 2
      if (currentGlobalIndex >= 3 * N) {
        const normalizedGlobal = currentGlobalIndex - N;
        currentGlobalIndex = normalizedGlobal;
        scrollItemToCenter(allItems[normalizedGlobal], false);
      }
    });
  }

  function startFaqTimer() {
    // iPad và Mobile: không cần animation tự động chuyển đổi câu hỏi
    if (window.innerWidth < 1024) {
      pauseFaqTimer();
      return;
    }
    if (faqAutoTimer) clearInterval(faqAutoTimer);
    faqAutoTimer = setInterval(() => {
      nextFAQ();
    }, 2500);
  }

  function pauseFaqTimer() {
    if (faqAutoTimer) {
      clearInterval(faqAutoTimer);
      faqAutoTimer = null;
    }
  }

  function restartFaqTimer() {
    if (window.innerWidth < 1024) return;
    pauseFaqTimer();
    startFaqTimer();
  }

  // Tạm dừng khi rê chuột vào để người dùng đọc câu trả lời (Desktop)
  const faqSection = document.getElementById('faq');
  if (faqSection) {
    faqSection.addEventListener('mouseenter', () => {
      if (window.innerWidth >= 1024) pauseFaqTimer();
    });
    faqSection.addEventListener('mouseleave', () => {
      if (window.innerWidth >= 1024) startFaqTimer();
    });
  }

  // Xử lý resize màn hình giữa Desktop và Giao diện nhỏ
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024) {
      scrollItemToCenter(allItems[currentGlobalIndex], false);
      updateRollerPhysics();
      startFaqTimer();
    } else {
      pauseFaqTimer();
      allItems.forEach(item => {
        item.style.opacity = '';
        item.style.transform = '';
        item.style.pointerEvents = '';
      });
    }
  });

  // Khởi tạo câu trả lời và vị trí ban đầu (căn giữa Câu hỏi 1 ở Set 2)
  updateAnswerCard(0);
  if (window.innerWidth >= 1024) {
    setTimeout(() => {
      const startItem = allItems[currentGlobalIndex];
      if (startItem) {
        scrollItemToCenter(startItem, false);
        updateRollerPhysics();
      }
    }, 60);
    // Kích hoạt tự động chuyển đổi mỗi 3 giây riêng cho Desktop
    startFaqTimer();
  }
}

