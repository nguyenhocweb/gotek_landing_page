/**
 * GOTEK FOOTER INTERACTIVE COMPONENT
 * Xử lý accordion đóng mở trên Mobile/Tablet và nút Cuộn về đầu trang (Back-to-top)
 * Chuẩn hành vi 100% từ Gotek.asia
 */

export function initFooterAccordion() {
  const footerAccordions = Array.from(document.querySelectorAll('[data-footer-accordion]'));
  if (!footerAccordions.length) return;

  const mobileFooter = window.matchMedia('(max-width: 820px)');

  const setFooterPanel = (accordion, expanded) => {
    const trigger = accordion.querySelector('.gotek-footer-accordion__trigger');
    const panel = trigger && document.getElementById(trigger.getAttribute('aria-controls'));
    if (!trigger || !panel) return;
    trigger.setAttribute('aria-expanded', String(expanded));
    panel.hidden = !expanded;
    accordion.classList.toggle('is-open', expanded);
  };

  const syncFooterAccordions = () => {
    footerAccordions.forEach((accordion) => setFooterPanel(accordion, !mobileFooter.matches));
    document.documentElement.classList.add('gotek-footer-accordion-ready');
  };

  footerAccordions.forEach((accordion) => {
    const trigger = accordion.querySelector('.gotek-footer-accordion__trigger');
    trigger?.addEventListener('click', (e) => {
      e.preventDefault();
      if (!mobileFooter.matches) return;
      const willOpen = trigger.getAttribute('aria-expanded') !== 'true';
      footerAccordions.forEach((item) => setFooterPanel(item, item === accordion && willOpen));
    });
  });

  mobileFooter.addEventListener('change', syncFooterAccordions);
  syncFooterAccordions();

  // Smooth scroll cho nút "Về đầu trang"
  const backToTopBtn = document.querySelector('.gotek-back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}
