/**
 * GOTEK MAIN ENTRY POINT
 * Khởi chạy toàn bộ ứng dụng khi tài liệu HTML đã sẵn sàng
 */

import { initHeaderLogic } from './components/header.js';
import { initMagneticButtons } from './components/magneticBtn.js';
import { initLeadForm } from './components/form.js';
import { initCapabilityTabs } from './components/tabs.js';
import { initProcessConnectors } from './components/processConnectors.js?v=24';
import { initCircuitConnectors } from './components/circuitConnectors.js?v=1';
import { initMetricCounters } from './components/counter.js?v=3';
import { 
  initAboutScrollAnimation,
  initBentoScrollAnimation, 
  initEcosystemScrollAnimation,
  initSolutionsHeaderAnimation,
  initProjectsScrollAnimation,
  initPricingScrollAnimation
} from './components/scrollAnimations.js?v=14';
import { initHeroInteractive } from './components/heroInteractive.js?v=9';
import { initFooterAccordion } from './components/footer.js?v=1';
import { initApp } from './app.js?v=38';

function startApp() {
  console.log('🚀 Gotek Web Application Initialized.');

  // 0. Khởi tạo tương tác 5 trụ cột Hero (Tín, Chuẩn, Tiên, Tốc, Nhân)
  try { initHeroInteractive(); } catch (e) { console.error('Error initHeroInteractive:', e); }

  // 1. Khởi tạo Header chuẩn floating pill và smart scroll từ landing_page_gotek
  try { initHeaderLogic(); } catch (e) { console.error('Error initHeaderLogic:', e); }

  // 2. Khởi tạo hiệu ứng nút hút nam châm magnetic-btn
  try { initMagneticButtons(); } catch (e) { console.error('Error initMagneticButtons:', e); }

  // 3. Khởi tạo Form tư vấn
  try { initLeadForm(); } catch (e) { console.error('Error initLeadForm:', e); }

  // 4. Khởi tạo Tabs ma trận năng lực (Mẫu 05)
  try { initCapabilityTabs(); } catch (e) { console.error('Error initCapabilityTabs:', e); }

  // 5. Khởi tạo đường nối từ vòng tròn trung tâm đến viền đáy thẻ quy trình
  try { initProcessConnectors(); } catch (e) { console.error('Error initProcessConnectors:', e); }

  // 5.1 Khởi tạo các đường kẻ nối circuit diagram cho Giải Pháp Chuyên Sâu
  try { initCircuitConnectors(); } catch (e) { console.error('Error initCircuitConnectors:', e); }

  // 5.2 Khởi tạo click mở rộng mô tả cho các thẻ giải pháp trên Mobile
  try { initWhyFeatureAccordion(); } catch (e) { console.error('Error initWhyFeatureAccordion:', e); }

  // 6. Khởi tạo animation từ từ hiện ra cho tiêu đề & đoạn văn bản Giới Thiệu
  try { initAboutScrollAnimation(); } catch (e) { console.error('Error initAboutScrollAnimation:', e); }

  // 7. Khởi tạo animation tăng số từ 0 đến đích cho dải số liệu thống kê
  try { initMetricCounters(); } catch (e) { console.error('Error initMetricCounters:', e); }

  // 8. Khởi tạo animation đối xứng Giải Pháp Chuyên Sâu: ảnh từ trái qua, chữ từ phải qua
  try { initBentoScrollAnimation(); } catch (e) { console.error('Error initBentoScrollAnimation:', e); }

  // 9. Khởi tạo animation đối xứng Hệ Sinh Thái: bên trái từ trái qua, bên phải từ phải qua
  try { initEcosystemScrollAnimation(); } catch (e) { console.error('Error initEcosystemScrollAnimation:', e); }

  // 10. Ảnh 1: Header Giải Pháp Chuyên Sâu từ từ hiện ra
  try { initSolutionsHeaderAnimation(); } catch (e) { console.error('Error initSolutionsHeaderAnimation:', e); }

  // 11. Ảnh 2 & 3: Dự Án Tiêu Biểu (Header từ từ hiện ra, danh sách dưới hiện lên)
  try { initProjectsScrollAnimation(); } catch (e) { console.error('Error initProjectsScrollAnimation:', e); }

  // 12. Ảnh 4 & 5: Bảng Báo Giá (Header từ từ hiện ra, 3 thẻ giá dưới hiện lên)
  try { initPricingScrollAnimation(); } catch (e) { console.error('Error initPricingScrollAnimation:', e); }

  // 13. Khởi tạo Footer accordion & back-to-top (chuẩn Gotek.asia)
  try { initFooterAccordion(); } catch (e) { console.error('Error initFooterAccordion:', e); }

  // 14. Khởi tạo và nạp dữ liệu động từ thư mục data/
  try { initApp(); } catch (e) { console.error('Error initApp:', e); }

  // 15. Hiệu ứng lướt ngang màu xanh ẩn/hiện mô tả các thẻ bước trên mobile
  try { initProcessCardWiper(); } catch (e) { console.error('Error initProcessCardWiper:', e); }
}

function initWhyFeatureAccordion() {
  const items = document.querySelectorAll('.why-feature-item');
  if (!items.length) return;

  items.forEach(item => {
    if (item._hasAccordionListener) return;
    item._hasAccordionListener = true;

    item.addEventListener('click', (e) => {
      if (window.innerWidth > 1024) return;
      const wasOpen = item.classList.contains('is-open');
      items.forEach(i => i.classList.remove('is-open'));
      if (!wasOpen) {
        item.classList.add('is-open');
      }
    });
  });
}

function initProcessCardWiper() {
  const cards = document.querySelectorAll('.step-card');
  if (!cards.length) return;

  cards.forEach((card) => {
    let wiper = card.querySelector('.step-card-wiper');
    if (!wiper) {
      wiper = document.createElement('div');
      wiper.className = 'step-card-wiper';
      card.appendChild(wiper);
    }

    let arrow = card.querySelector('.step-card-arrow');
    if (!arrow) {
      arrow = document.createElement('div');
      arrow.className = 'step-card-arrow';
      arrow.setAttribute('aria-hidden', 'true');
      arrow.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>';
      card.appendChild(arrow);
    }

    if (card._hasWiperListener) return;
    card._hasWiperListener = true;

    card.addEventListener('click', () => {
      if (window.innerWidth > 768) return;
      if (card._isWiping) return;

      const isCurrentlyShowingDesc = card.classList.contains('is-desc-active');

      if (!isCurrentlyShowingDesc) {
        cards.forEach((otherCard) => {
          if (otherCard !== card && otherCard.classList.contains('is-desc-active')) {
            const otherWiper = otherCard.querySelector('.step-card-wiper');
            if (otherWiper && !otherCard._isWiping) {
              otherCard._isWiping = true;
              otherWiper.className = 'step-card-wiper is-wiping-reverse';
              setTimeout(() => {
                otherCard.classList.remove('is-desc-active');
              }, 220);
              setTimeout(() => {
                otherWiper.className = 'step-card-wiper';
                otherCard._isWiping = false;
              }, 460);
            } else {
              otherCard.classList.remove('is-desc-active');
            }
          }
        });

        card._isWiping = true;
        wiper.className = 'step-card-wiper is-wiping-forward';

        setTimeout(() => {
          card.classList.add('is-desc-active');
        }, 220);

        setTimeout(() => {
          wiper.className = 'step-card-wiper';
          card._isWiping = false;
        }, 460);
      } else {
        card._isWiping = true;
        wiper.className = 'step-card-wiper is-wiping-reverse';

        setTimeout(() => {
          card.classList.remove('is-desc-active');
        }, 220);

        setTimeout(() => {
          wiper.className = 'step-card-wiper';
          card._isWiping = false;
        }, 460);
      }
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp();
}

