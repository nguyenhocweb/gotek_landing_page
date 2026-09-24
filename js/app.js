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
  try { renderProjectSections([data.projectsWeb, data.projectsSaas]); } catch (e) { console.error('Error in renderProjectSections:', e); }
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
 * Render danh sách dự án tiêu biểu theo mẫu chuẩn Hình 2:
 * - Thẻ đứng viền xanh thanh thoát (#6BA6FF), bo góc lớn 20px, nền trắng tinh khôi (#FFFFFF)
 * - Tiêu đề dự án nằm trên cùng căn giữa, màu xanh Gotek (#0055FF), đậm và sắc nét
 * - Ảnh chụp website toàn trang dài ở dưới, tự động cuộn mượt khi hover
 * - Hiển thị 5 cột trên màn hình Desktop lớn (>= 1200px), tự động chạy marquee vô tận khi số lượng vượt quá số cột
 * - Tạm dừng animation khi hover chuột vào bất kỳ thẻ nào
 */
function renderProjectSections(groups) {
  const container = $('#projectsContainer') || $('.projects-showcase-container') || $('.project-3-saas-web-hatang');
  if (!container || !groups) return;

  // Thu thập tất cả các items từ các nguồn dữ liệu vào một danh sách duy nhất
  let allItems = [];
  if (Array.isArray(groups)) {
    groups.forEach(g => {
      if (g && Array.isArray(g.items)) {
        allItems = allItems.concat(g.items);
      } else if (g && Array.isArray(g)) {
        allItems = allItems.concat(g);
      }
    });
  }
  if (allItems.length === 0) return;

  // Render thẻ chuẩn dạng tương tác: KHÔNG DÙNG THẺ <a> ĐỂ KHÔNG CHUYỂN TRANG
  function renderCard(item, idx) {
    return `
      <article class="project-card" data-index="${idx}" data-name="${item.name || item.title || ''}">
        <div class="project-card-link" role="button" tabindex="0" aria-label="${item.name || item.title || ''}">
          <div class="project-card-header">
            <h3 class="project-card-title">${item.name || item.title || ''}</h3>
          </div>
          <div class="project-scroll-viewport">
            <img src="${item.image}" alt="${item.name || item.title || ''}"
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

    // Ngưỡng cột theo màn hình chuẩn mẫu Hình 2:
    // Desktop lớn (>= 1200px): 5 cột (5 thẻ hiển thị đồng thời như Hình 2)
    // Laptop (992px - 1199px): 4 cột
    // Tablet ngang (768px - 991px): 3 cột
    // Tablet đứng (540px - 767px): 2 cột
    // Mobile (< 540px): 1.18 cột
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

    // Render 3 bộ items để tạo đường chạy vô tận (infinite seamless loop)
    const singleSetCardsHtml = allItems.map((item, idx) => renderCard(item, idx)).join('');
    const fullTrackHtml = singleSetCardsHtml + singleSetCardsHtml + singleSetCardsHtml;

    container.innerHTML = `
      <div class="projects-track-wrapper" style="--card-w: ${cardW}px; --project-gap: ${gap}px;">
        <div class="projects-track">
          ${fullTrackHtml}
        </div>
      </div>
    `;

    const trackWrapper = container.querySelector('.projects-track-wrapper');
    const singleSetWidth = allItems.length * (cardW + gap);

    // Bắt đầu ở bộ thứ 2 (chính giữa)
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
    // Vận tốc trôi mượt mà (~45px mỗi giây)
    const speed = 0.045;

    function loop(currentTime) {
      const delta = currentTime - lastTime;
      lastTime = currentTime;

      // Chỉ tự động chạy khi không hover, không drag, và không có thẻ nào đang active ở giữa
      if (!isHovered && !isDragging && !activeCard) {
        trackWrapper.scrollLeft += speed * Math.min(delta, 50);

        // Vòng lặp vô tận liền mạch
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

    // Hover chuột vào track
    trackWrapper.addEventListener('mouseenter', () => {
      isHovered = true;
    });

    trackWrapper.addEventListener('mouseleave', () => {
      isHovered = false;
      isDragging = false;
    });

    // Kéo thả chuột (Mouse drag to scroll)
    trackWrapper.addEventListener('mousedown', (e) => {
      isDragging = true;
      hasDragged = false;
      dragStartX = e.pageX - trackWrapper.offsetLeft;
      dragScrollLeft = trackWrapper.scrollLeft;
      isHovered = true;
    });

    window.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        setTimeout(() => {
          hasDragged = false;
        }, 50);
      }
    });

    trackWrapper.addEventListener('mousemove', (e) => {
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

    // CLICK VÀO THẺ:
    // 1. Không phải thẻ <a>, không chuyển trang đến #contact
    // 2. Thẻ đó animation mượt mà ra chính giữa màn hình
    // 3. Chạy dạng hover: ảnh tự động cuộn từ trên xuống dưới
    trackWrapper.addEventListener('click', (e) => {
      if (hasDragged) return;

      const card = e.target.closest('.project-card');
      if (!card) return;

      e.preventDefault();
      e.stopPropagation();

      // Nếu click lại chính thẻ đang active: đóng lại và tiếp tục marquee sau 1 giây
      if (card === activeCard && card.classList.contains('is-active-center')) {
        card.classList.remove('is-active-center');
        activeCard = null;
        if (resumeTimer) clearTimeout(resumeTimer);
        resumeTimer = setTimeout(() => {
          isHovered = false;
        }, 1000);
        return;
      }

      // Xóa active cũ
      if (activeCard) {
        activeCard.classList.remove('is-active-center');
      }

      // Kích hoạt thẻ mới: chạy dạng hover (cuộn ảnh)
      card.classList.add('is-active-center');
      activeCard = card;

      // ANIMATION RA GIỮA:
      // Tính toán vị trí tâm của thẻ so với tâm của khung trackWrapper
      const wrapperRect = trackWrapper.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();
      const wrapperCenter = wrapperRect.left + wrapperRect.width / 2;
      const cardCenter = cardRect.left + cardRect.width / 2;
      const diff = cardCenter - wrapperCenter;

      // Cuộn mượt thẻ vào chính giữa màn hình
      trackWrapper.scrollBy({
        left: diff,
        behavior: 'smooth'
      });
    });

    // Bấm ra ngoài vùng dự án: Đóng active card và tiếp tục marquee
    document.addEventListener('click', (e) => {
      if (!e.target.closest('#projectsContainer')) {
        if (activeCard) {
          activeCard.classList.remove('is-active-center');
          activeCard = null;
          isHovered = false;
        }
      }
    });
  }

  function applyScrollDurationToImages() {
    const images = container.querySelectorAll('.project-scroll-img');
    images.forEach(img => {
      function calculateDuration() {
        const naturalH = img.naturalHeight || 0;
        const naturalW = img.naturalWidth || 1;
        const currentW = img.clientWidth || 240;
        const displayedH = naturalH > 0 ? (naturalH * (currentW / naturalW)) : (img.offsetHeight || 1400);
        const viewportEl = img.closest('.project-scroll-viewport');
        const viewportH = viewportEl ? viewportEl.clientHeight : 420;
        const scrollDistance = Math.max(100, displayedH - viewportH);

        const speedPxPerSec = 170;
        const duration = Math.max(9, Math.round(scrollDistance / speedPxPerSec));

        img.style.setProperty('--scroll-duration', `${duration}s`);
      }

      if (img.complete && img.naturalHeight > 0) {
        calculateDuration();
      } else {
        img.addEventListener('load', calculateDuration, { once: true });
      }
    });
  }

  // Khởi chạy
  updateProjectLayout();

  // Resize window
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      updateProjectLayout();
    }, 120);
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
    // Đồng bộ cơ chế phân trang tối đa 5 nút gọn gàng (Sliding Window) cho cả Desktop, iPad và Mobile:
    // Nút ở giữa là active pill, 2 nút kế bên cỡ vừa, 2 nút ở 2 mép thu nhỏ (dot-small), các nút còn lại ẩn
    let startIndex = activeIdx - 2;
    if (startIndex < 0) startIndex = 0;
    if (startIndex > total - 5) startIndex = Math.max(0, total - 5);
    const endIndex = Math.min(total - 1, startIndex + 4);

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
      titleEl.innerHTML = `${activeData.section.title} <span class="text-brand-gradient whitespace-nowrap inline-block">${activeData.section.highlightTitle || ''}</span>`;
    }
    if (subtitleEl && activeData.section.subtitle) subtitleEl.textContent = activeData.section.subtitle;
  }

  // 2. DOM Elements
  const trackEl = $('#faqRollerTrack');
  const viewportEl = $('#faqRollerViewport');
  const answerCardEl = $('#faqAnswerCard');
  if (!trackEl || !viewportEl) return;

  const supportData = activeData.support || defaultFAQ.support;

  // 3. Render danh sách câu hỏi đơn (tuyến tính, không nhân bản clone vô tận)
  // Người dùng có thể lướt tự nhiên từ câu đầu tiên đến hết câu cuối cùng
  const N = activeData.items.length;
  let trackHTML = '';

  activeData.items.forEach((item, idx) => {
    const isFirst = (idx === 0);
    const isMobileHidden = (idx >= 6); // Mobile/iPad chỉ hiển thị 6 câu đầu gọn gàng

    const itemClasses = [
      'faq-roller-item',
      isFirst ? 'is-center is-open' : '',
      isMobileHidden ? 'faq-mobile-hidden' : ''
    ].filter(Boolean).join(' ');

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

  const allItems = Array.from(trackEl.querySelectorAll('.faq-roller-item'));
  let currentIndex = 0;
  let currentDisplayedIndex = -1;
  let answerTransitionTimer = null;
  let pendingIndex = null;

  // Hàm cập nhật khung câu trả lời bên phải: Animate TOÀN BỘ KHUNG (Khung cũ biến mất dần, Khung mới hiện lên mượt mà)
  function updateAnswerCard(index, immediate = false) {
    const item = activeData.items[index];
    if (!item || !answerCardEl) return;

    if (currentDisplayedIndex === index) return;

    // Lần khởi tạo đầu tiên: Render ngay lập tức
    if (immediate || currentDisplayedIndex === -1) {
      if (answerTransitionTimer) clearTimeout(answerTransitionTimer);
      currentDisplayedIndex = index;
      pendingIndex = null;
      answerCardEl.className = 'faq-roller-answer-card is-card-entering';
      answerCardEl.innerHTML = `
        <h3 class="faq-answer-title">${item.question}</h3>
        <p class="faq-answer-content">${item.answer}</p>
      `;
      return;
    }

    const prevIndex = currentDisplayedIndex;
    pendingIndex = index;

    // Nếu KHUNG đang trong giai đoạn exit, chỉ cần lưu pendingIndex để đón câu hỏi mới nhất
    if (answerCardEl.classList.contains('is-card-exiting-up') || answerCardEl.classList.contains('is-card-exiting-down')) {
      return;
    }

    // Xác định chiều chuyển động của khung theo câu hỏi (chuyển tới: lướt lên, quay lại: lướt xuống)
    const isNext = (index >= prevIndex);
    const exitClass = isNext ? 'is-card-exiting-up' : 'is-card-exiting-down';
    const enterStartClass = isNext ? 'is-card-entering-start-up' : 'is-card-entering-start-down';

    // 1. Toàn bộ KHUNG câu hỏi ban đầu biến mất dần mượt mà
    answerCardEl.classList.remove('is-card-entering');
    answerCardEl.classList.add(exitClass);

    if (answerTransitionTimer) clearTimeout(answerTransitionTimer);
    answerTransitionTimer = setTimeout(() => {
      const targetIdx = (pendingIndex !== null) ? pendingIndex : index;
      pendingIndex = null;
      currentDisplayedIndex = targetIdx;

      const targetItem = activeData.items[targetIdx];
      if (!targetItem) return;

      // Cập nhật nội dung câu hỏi mới vào khung
      answerCardEl.innerHTML = `
        <h3 class="faq-answer-title">${targetItem.question}</h3>
        <p class="faq-answer-content">${targetItem.answer}</p>
      `;

      // 2. Định vị KHUNG ở vị trí bắt đầu
      answerCardEl.classList.remove(exitClass);
      answerCardEl.classList.add(enterStartClass);

      // Kích hoạt reflow
      void answerCardEl.offsetWidth;

      // 3. Toàn bộ KHUNG câu hỏi tiếp theo hiện lên mượt mà
      answerCardEl.classList.remove(enterStartClass);
      answerCardEl.classList.add('is-card-entering');
    }, 180);
  }

  // Hàm cuộn item vào chính giữa con lăn (chỉ cuộn viewportEl trên Desktop)
  let isProgrammaticScrolling = false;
  let programmaticScrollTimer = null;

  function scrollItemToCenter(item, smooth = true, callback = null) {
    if (window.innerWidth < 1024 || !item) return;
    const idx = parseInt(item.getAttribute('data-index') || '0', 10);
    const maxScroll = Math.max(0, viewportEl.scrollHeight - viewportEl.clientHeight);
    const vRect = viewportEl.getBoundingClientRect();
    const iRect = item.getBoundingClientRect();
    const currentScroll = viewportEl.scrollTop;
    const offset = (iRect.top + iRect.height / 2) - (vRect.top + vRect.height / 2);
    
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
      behavior: 'smooth'
    });

    programmaticScrollTimer = setTimeout(() => {
      isProgrammaticScrolling = false;
      updateRollerPhysics();
      if (callback) callback();
    }, 450);
  }

  // Hàm tính toán hiệu ứng mờ dần theo khoảng cách đến tâm (chỉ chạy trên Desktop)
  function updateRollerPhysics() {
    if (window.innerWidth < 1024) return;
    const vRect = viewportEl.getBoundingClientRect();
    const centerY = vRect.top + vRect.height / 2;
    const currentScroll = viewportEl.scrollTop;
    const maxScroll = Math.max(0, viewportEl.scrollHeight - viewportEl.clientHeight);

    let closestIdx = 0;
    let minDistance = Infinity;
    const maxDist = 115;

    // Tìm item gần tâm con lăn nhất
    allItems.forEach((item, idx) => {
      const iRect = item.getBoundingClientRect();
      const itemCenterY = iRect.top + iRect.height / 2;
      const dist = Math.abs(centerY - itemCenterY);

      if (dist < minDistance) {
        minDistance = dist;
        closestIdx = idx;
      }
    });

    // Khi ở sát đỉnh (scrollTop <= 15px) -> chắc chắn chọn câu 1 (idx = 0)
    // Giúp giữ nguyên vị trí 4 nút như Ảnh 2 nhưng màu xanh nhảy lên câu 1 như Ảnh 1
    if (currentScroll <= 15) {
      closestIdx = 0;
    } else if (currentScroll >= maxScroll - 20) {
      closestIdx = allItems.length - 1;
    }

    // Cập nhật trạng thái hiển thị cho từng item dựa trên closestIdx
    allItems.forEach((item, idx) => {
      const iRect = item.getBoundingClientRect();
      const itemCenterY = iRect.top + iRect.height / 2;
      const dist = Math.abs(centerY - itemCenterY);

      if (idx === closestIdx) {
        // Câu đang được chọn: MÀU XANH NỔI BẬT
        item.style.opacity = '1';
        item.style.transform = 'scale(1.03)';
        item.classList.add('is-center');
        item.style.pointerEvents = 'auto';
      } else {
        item.classList.remove('is-center');
        if (dist > maxDist) {
          item.style.opacity = '0.25';
          item.style.transform = 'scale(0.88)';
        } else {
          const ratio = Math.min(1, Math.max(0, (dist - 20) / (maxDist - 20)));
          const opacity = Math.max(0.25, 0.85 - (ratio * 0.55));
          const scale = 0.98 - (ratio * 0.08);
          item.style.opacity = opacity.toFixed(2);
          item.style.transform = `scale(${scale.toFixed(3)})`;
        }
      }
    });

    // Cập nhật câu trả lời nếu câu ở giữa thay đổi
    if (closestIdx !== currentIndex) {
      currentIndex = closestIdx;
      updateAnswerCard(closestIdx);
    }
  }

  // Lắng nghe sự kiện cuộn mượt bằng requestAnimationFrame
  let isTicking = false;
  viewportEl.addEventListener('scroll', () => {
    if (window.innerWidth < 1024) return;
    if (!isTicking) {
      requestAnimationFrame(() => {
        updateRollerPhysics();
        isTicking = false;
      });
      isTicking = true;
    }
  }, { passive: true });

  // Cuộn con lăn chuột theo từng nấc câu hỏi (1 -> 2 -> 3 và 3 -> 2 -> 1 mượt mà, không bị nhảy vọt)
  let wheelDebounceTimer = null;
  viewportEl.addEventListener('wheel', (e) => {
    if (window.innerWidth < 1024) return;
    e.preventDefault();
    pauseFaqTimer();

    if (wheelDebounceTimer) return;
    wheelDebounceTimer = setTimeout(() => {
      wheelDebounceTimer = null;
    }, 280);

    if (e.deltaY > 0) {
      // Cuộn xuống: chuyển sang câu tiếp theo
      if (currentIndex < allItems.length - 1) {
        const nextIdx = currentIndex + 1;
        currentIndex = nextIdx;
        updateAnswerCard(nextIdx);
        scrollItemToCenter(allItems[nextIdx], true);
      }
    } else if (e.deltaY < 0) {
      // Cuộn lên: chuyển về câu trước đó
      if (currentIndex > 0) {
        const prevIdx = currentIndex - 1;
        currentIndex = prevIdx;
        updateAnswerCard(prevIdx);
        scrollItemToCenter(allItems[prevIdx], true);
      }
    }
  }, { passive: false });

  viewportEl.addEventListener('touchstart', () => {
    pauseFaqTimer();
  }, { passive: true });

  viewportEl.addEventListener('mouseenter', () => {
    pauseFaqTimer();
  });

  viewportEl.addEventListener('mouseleave', () => {
    if (window.innerWidth >= 1024 && currentIndex < allItems.length - 1) {
      startFaqTimer();
    }
  });

  // Khi click vào bất kỳ câu hỏi nào
  allItems.forEach((item, idx) => {
    item.addEventListener('click', () => {
      const isMobile = window.innerWidth < 1024;
      if (isMobile) {
        // Giao diện nhỏ: Accordion (mở / đóng mượt mà)
        const wasOpen = item.classList.contains('is-open');
        allItems.forEach(i => i.classList.remove('is-open'));
        if (!wasOpen) item.classList.add('is-open');
      } else {
        // Desktop: cuộn câu được chọn vào giữa và cập nhật
        currentIndex = idx;
        updateAnswerCard(idx);
        scrollItemToCenter(item, true);
        // Tạm dừng timer khi người dùng chủ động click chọn câu hỏi
        pauseFaqTimer();
      }
    });
  });

  // =========================================================================
  // AUTOMATION: TỰ ĐỘNG CHUYỂN CÂU HỎI LƯỚT TUẦN TỰ ĐẾN HẾT CÂU CUỐI CÙNG
  // KHI ĐẾN CÂU CUỐI CÙNG SẼ DỪNG LẠI (KHÔNG LẶP VÔ TẬN)
  // NGƯỜI DÙNG CÓ THỂ CUỘN LƯỚT TỰ DO TỪ ĐẦU ĐẾN CUỐI BẤT KỲ LÚC NÀO
  // =========================================================================
  let faqAutoTimer = null;

  function nextFAQ() {
    if (window.innerWidth < 1024) return;

    // Khi đã lướt đến câu cuối cùng -> dừng lại
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
    if (currentIndex >= allItems.length - 1) return; // Nếu đã ở câu cuối thì không chạy nữa
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

  // Tạm dừng khi rê chuột vào để người dùng đọc câu trả lời (Desktop)
  const faqSection = document.getElementById('faq');
  if (faqSection) {
    faqSection.addEventListener('mouseenter', () => {
      if (window.innerWidth >= 1024) pauseFaqTimer();
    });
    faqSection.addEventListener('mouseleave', () => {
      if (window.innerWidth >= 1024 && currentIndex < allItems.length - 1) {
        startFaqTimer();
      }
    });
  }

  // Xử lý resize màn hình giữa Desktop và Giao diện nhỏ
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024) {
      scrollItemToCenter(allItems[currentIndex], false);
      updateRollerPhysics();
      if (currentIndex < allItems.length - 1) startFaqTimer();
    } else {
      pauseFaqTimer();
      allItems.forEach(item => {
        item.style.opacity = '';
        item.style.transform = '';
        item.style.pointerEvents = '';
      });
    }
  });

  // Khởi tạo câu trả lời và vị trí ban đầu (câu hỏi 1 ở đầu danh sách)
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

/**
 * Xử lý gửi form đăng ký tư vấn dự án
 */
window.handleConsultationSubmit = function(formEl) {
  if (!formEl) return;
  const submitBtn = formEl.querySelector('.reg-submit-button');
  if (submitBtn) {
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Đang gửi thông tin...</span>';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span>✓ Gửi thành công!</span>';
      submitBtn.style.background = '#10B981';

      // Toast thông báo chuyên nghiệp
      let toast = document.createElement('div');
      toast.className = 'gotek-consultation-toast';
      toast.innerHTML = `
        <div style="position: fixed; bottom: 30px; right: 30px; z-index: 99999; background: #0A1F68; color: #FFFFFF; padding: 18px 24px; border-radius: 12px; box-shadow: 0 16px 40px rgba(0, 0, 0, 0.25); display: flex; align-items: center; gap: 14px; font-family: 'Be Vietnam Pro', sans-serif; font-size: 0.92rem; border-left: 5px solid #0055FF; animation: slideInUp 0.4s ease;">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22DDE0" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <div>
            <div style="font-weight: 700; margin-bottom: 2px;">Đăng ký tư vấn thành công!</div>
            <div style="font-size: 0.82rem; color: #CBD5E1;">Chuyên gia Gotek sẽ liên hệ trực tiếp trong vòng 24 giờ.</div>
          </div>
        </div>
      `;
      document.body.appendChild(toast);

      setTimeout(() => {
        toast.remove();
        submitBtn.innerHTML = originalText;
        submitBtn.style.background = '';
        formEl.reset();
      }, 4000);
    }, 800);
  }
};
