/**
 * GOTEK NUMBER COUNTER ANIMATION
 * Kích hoạt hiệu ứng tăng dần số từ 0 đến giá trị đích khi người dùng cuộn tới dải số liệu thống kê.
 */

export function initMetricCounters() {
  const container = document.querySelector('.partner-metrics-strip');
  const items = document.querySelectorAll('.partner-metrics-strip .metric-number');
  if (!items.length) return;

  const config = [
    { target: 30, suffix: '+', prefix: '', decimals: 0 },
    { target: 98, suffix: '%', prefix: '', decimals: 0 },
    { target: 99.9, suffix: '%', prefix: '', decimals: 1 }
  ];

  // Khởi tạo ban đầu hiển thị số 0 tương ứng
  items.forEach((item, index) => {
    const cfg = config[index];
    if (cfg) {
      const initialVal = (0).toFixed(cfg.decimals);
      item.textContent = `${cfg.prefix}${initialVal}${cfg.suffix}`;
    }
  });

  let hasAnimated = false;

  function animateCountUp() {
    if (hasAnimated) return;
    hasAnimated = true;

    const duration = 2000; // Thời gian chạy mượt mà 2 giây
    const startTime = performance.now();

    // Hàm easing tự nhiên (Ease Out Expo - bắt đầu nhanh, giảm dần mượt mà ở cuối)
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
          // Đảm bảo số kết thúc chính xác 100% không bị sai số làm tròn
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

  // Kích hoạt khi cuộn đến (IntersectionObserver)
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCountUp();
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.2,
      rootMargin: '0px 0px -50px 0px'
    });

    observer.observe(container || items[0]);
  } else {
    animateCountUp();
  }
}
