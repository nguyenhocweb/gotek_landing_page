/**
 * GOTEK SCROLL ANIMATIONS
 * 1. Section Giới Thiệu (About Partner):
 *    - Tiêu đề, lead text, description từ từ hiện ra mềm mại (Fade & Slide Up)
 *
 * 2. Bento Section:
 *    - Ảnh (.bento-left) trượt vào từ Trái sang (Left to Right)
 *    - Chữ (.bento-grid-matrix) trượt vào từ Phải sang (Right to Left)
 *
 * 3. Ecosystem Teams Section:
 *    - Phần tử bên trái trượt vào từ Trái sang
 *    - Phần tử bên phải trượt vào từ Phải sang
 */

if (typeof document !== 'undefined' && document.body) {
  document.body.classList.add('has-scroll-animations');
}

export function initAboutScrollAnimation() {
  if (typeof document !== 'undefined' && document.body) {
    document.body.classList.add('has-scroll-animations');
  }
  const aboutSec = document.querySelector('.about-partner-section');
  if (!aboutSec) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          aboutSec.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    observer.observe(aboutSec);
  } else {
    aboutSec.classList.add('animate-in');
  }
}

/**
 * 2. Section Giải Pháp Thiết Kế Website (Why Choose / Solutions):
 *    - Header: Slide up & Fade in
 *    - Kỹ Sư Gotek (Cột Trái): Trượt vào từ bên trái với ambient aura
 *    - Lưới 7 tính năng (Cột Phải): Xuất hiện so le (staggered cascade)
 */
export function initWhyChooseScrollAnimation() {
  const section = document.querySelector('.why-choose-section') || document.querySelector('.solutions-bento-section');
  if (!section) return;

  const header = section.querySelector('.solutions-header');
  const leftImage = section.querySelector('.why-choose-left-image');
  const items = section.querySelectorAll('.why-feature-item');
  const borderedCol = section.querySelector('.why-feature-col--bordered');

  const triggerAnimation = () => {
    section.classList.add('animate-in', 'animate-header-in');
    if (leftImage) leftImage.classList.add('animate-in');
    if (borderedCol) borderedCol.classList.add('animate-in');
    items.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add('animate-in');
      }, 50 + index * 75);
    });
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          triggerAnimation();
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    observer.observe(section);
  } else {
    triggerAnimation();
  }

  // Fallback an toàn sau 2.5s nếu chưa được kích hoạt
  setTimeout(() => {
    if (!section.classList.contains('animate-in')) {
      triggerAnimation();
    }
  }, 2500);
}

export function initBentoScrollAnimation() {
  initWhyChooseScrollAnimation();
}

export function initEcosystemScrollAnimation() {
  const section = document.querySelector('.ecosystem-teams-section');
  const header = document.querySelector('.ecosystem-teams-header');
  const rows = document.querySelectorAll('.ecosystem-zigzag-row');

  if ('IntersectionObserver' in window) {
    // Header từ từ hiện ra
    if (header && section) {
      const headerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            section.classList.add('animate-header-in');
            headerObserver.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
      });
      headerObserver.observe(header);
    }

    // Các hàng zig-zag
    if (rows.length) {
      const rowObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            rowObserver.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.05,
        rootMargin: '60px 0px 60px 0px'
      });

      rows.forEach(row => rowObserver.observe(row));
    }
  } else {
    if (section) section.classList.add('animate-header-in');
    rows.forEach(row => row.classList.add('animate-in'));
  }
}

/**
 * 4. Header & Section Giải Pháp Chuyên Sâu từ từ hiện ra
 */
export function initSolutionsHeaderAnimation() {
  initWhyChooseScrollAnimation();
}

/**
 * 5. Dự Án Tiêu Biểu:
 *    - Ảnh 2: Header từ từ hiện ra
 *    - Ảnh 3: Danh sách dự án dưới hiện lên
 */
export function initProjectsScrollAnimation() {
  const section = document.querySelector('.featured-projects-section');
  if (!section) return;

  const header = document.querySelector('.projects-header');
  const content = document.querySelector('#projectsContainer') || document.querySelector('.project-3-saas-web-hatang');

  if ('IntersectionObserver' in window) {
    // Ảnh 2: Header từ từ hiện ra
    if (header) {
      const headerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            section.classList.add('animate-header-in');
            headerObserver.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
      });
      headerObserver.observe(header);
    }

    // Ảnh 3: Danh sách dự án dưới hiện lên
    if (content) {
      const contentObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            section.classList.add('animate-content-in');
            contentObserver.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
      });
      contentObserver.observe(content);
    }
  } else {
    section.classList.add('animate-header-in', 'animate-content-in');
  }
}

/**
 * 6. Bảng Báo Giá Dịch Vụ:
 *    - Ảnh 4: Header từ từ hiện ra
 *    - Ảnh 5: Lưới 3 thẻ giá dưới hiện lên
 */
export function initPricingScrollAnimation() {
  const section = document.querySelector('.pricing-section');
  if (!section) return;

  const header = document.querySelector('.pricing-header');
  const grid = document.querySelector('#pricingGrid') || document.querySelector('.pricing-grid');

  if ('IntersectionObserver' in window) {
    // Ảnh 4: Header từ từ hiện ra
    if (header) {
      const headerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            section.classList.add('animate-header-in');
            headerObserver.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
      });
      headerObserver.observe(header);
    }

    // Ảnh 5: Lưới 3 thẻ giá dưới hiện lên
    if (grid) {
      const gridObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            section.classList.add('animate-content-in');
            gridObserver.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
      });
      gridObserver.observe(grid);
    }
  } else {
    section.classList.add('animate-header-in', 'animate-content-in');
  }
}
