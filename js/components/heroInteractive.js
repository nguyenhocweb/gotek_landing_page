/**
 * GOTEK HERO INTERACTIVE PILLARS
 * Tương tác 5 trụ cột: Tín - Chuẩn - Tiên - Nhân - Tốc
 * Hỗ trợ cả Desktop SVG và Mobile/iPad Cards (Hover + Click/Tap + Auto-Cycle)
 * 
 * Quy chuẩn hoạt động:
 * 1. Tự động chuyển đổi mượt mà giữa 5 trụ cột (2.4s mỗi trụ cột)
 * 2. Làm mờ rõ rệt ô vuông các trụ cột chưa chọn / chưa tới lượt (opacity: 0.28)
 * 3. Khi rê chuột (hover) hoặc nhấn (click/tap): chuyển ngay sang trụ cột đó và
 *    giữ lại trong 3.6s (lớn hơn thời gian automation một chút) rồi tự động chuyển tiếp sang các chữ khác.
 */

export const HERO_PILLARS = {
  default: {
    title: 'Kiến Tạo Nền Tảng Số, <br /><span class="hero-clean-highlight">Hiệu Quả Tối Đa &amp; Chuẩn Bền Vững.</span>',
    desc: 'Gotek đồng hành cùng doanh nghiệp kiến tạo website độc bản, phát triển ứng dụng di động và hệ thống SaaS chịu tải cao — cam kết <strong class="text-blue-accent">mượt mà 60FPS</strong>, bảo mật tuyệt đối và thúc đẩy chuyển đổi thực chất.'
  },
  tin: {
    title: 'Cam Kết Đi Cùng <br /><span class="hero-clean-highlight">Trách Nhiệm &amp; Chữ Tín.</span>',
    desc: 'Trao đổi trung thực, <strong class="text-blue-accent">xác định rõ nhân sự phụ trách</strong> và đồng hành kỹ thuật xuyên suốt sau bàn giao. Gotek cam kết giữ trọn chữ Tín trong từng dòng code và tiến độ cam kết — là điểm tựa công nghệ tin cậy, vững chắc cho mọi chặng đường tăng trưởng của doanh nghiệp.'
  },
  chuan: {
    title: 'Làm Đúng Theo <br /><span class="hero-clean-highlight">Tiêu Chí &amp; Chuẩn Mực Cao.</span>',
    desc: 'Thống nhất tiêu chuẩn kỹ thuật nghiêm ngặt ngay từ khởi đầu, <strong class="text-blue-accent">kiểm thử khắt khe từng chi tiết</strong> và bàn giao hệ thống sẵn sàng vận hành ổn định. Mọi cấu trúc dữ liệu, giao diện UI/UX và bảo mật đều được chuẩn hóa bài bản, loại bỏ triệt để rủi ro kỹ thuật ngầm.'
  },
  tien: {
    title: 'Chủ Động <br /><span class="hero-clean-highlight">Mở Lối Tiên Phong.</span>',
    desc: 'Liên tục học hỏi đón đầu xu hướng, <strong class="text-blue-accent">chủ động nghiên cứu và làm chủ công nghệ mới</strong> có kiểm soát. Gotek biến đổi những tiến bộ kỹ thuật phức tạp thành các cải tiến ứng dụng thực tế, tạo dựng lợi thế cạnh tranh tiên phong giúp đối tác bứt phá trên thị trường số.'
  },
  nhan: {
    title: 'Công Nghệ Bắt Đầu <br /><span class="hero-clean-highlight">Từ Trái Tim Con Người.</span>',
    desc: 'Lắng nghe bằng sự tôn trọng, <strong class="text-blue-accent">thấu hiểu sâu sắc bối cảnh</strong> và xây dựng hệ thống hỗ trợ con người làm việc tốt hơn. Chúng tôi tin rằng công nghệ ưu việt nhất là công nghệ phục vụ đời sống nhân văn, giải phóng sức sáng tạo và tôn vinh năng lực của từng cá nhân trong tổ chức.'
  },
  toc: {
    title: 'Nhanh Nhưng Luôn <br /><span class="hero-clean-highlight">Có Mục Tiêu &amp; Định Hướng.</span>',
    desc: 'Phản hồi thần tốc đúng hẹn, <strong class="text-blue-accent">ra quyết định dứt khoát</strong> dựa trên dữ liệu và luôn giữ guồng công việc tiến về kết quả hữu ích nhất. Tốc độ triển khai vượt trội kết hợp cùng quy trình tinh gọn giúp rút ngắn tối đa thời gian ra mắt, chớp trọn cơ hội kinh doanh cho khách hàng.'
  }
};

const CYCLE_KEYS = ['tin', 'chuan', 'tien', 'nhan', 'toc'];
const CYCLE_INTERVAL = 2400;   // 2.4s: thời gian automation nhanh gọn, sinh động
const INTERACTION_DWELL = 3600; // 3.6s: lớn hơn automation tý khi hover hoặc click để người dùng đọc kịp

export function initHeroInteractive() {
  const heroSection = document.getElementById('hero');
  if (!heroSection) return;

  const titleEl = document.getElementById('heroTitle');
  const descEl = document.getElementById('heroDesc');
  const textAnimWrap = document.getElementById('heroTextAnimWrap');
  const centerContent = heroSection.querySelector('.hero-clean-content');

  if (!titleEl || !descEl) return;

  // Lấy tất cả các góc tương tác (cả Desktop SVG lẫn Mobile/iPad Cards)
  const interactiveCorners = heroSection.querySelectorAll('[data-corner]');
  if (!interactiveCorners || interactiveCorners.length === 0) return;

  let currentKey = 'tin';
  let cycleTimer = null;
  let transitionTimer = null;
  let isSectionInView = true;

  // Hàm cập nhật chữ trung tâm với animation mượt
  function updateCenterContent(key, force = false) {
    if (key === currentKey && !force) return;
    const data = HERO_PILLARS[key];
    if (!data) return;
    currentKey = key;

    // Kích hoạt class làm mờ các góc còn lại trên toàn section
    heroSection.classList.add('has-active-pillar');

    // Cập nhật class active cho tất cả các góc tương ứng (cả svg lẫn mobile)
    interactiveCorners.forEach(el => {
      const cornerKey = el.getAttribute('data-corner');
      if (cornerKey === key) {
        el.classList.add('is-active');
        el.setAttribute('aria-pressed', 'true');
      } else {
        el.classList.remove('is-active');
        el.setAttribute('aria-pressed', 'false');
        // Giải phóng focus ảo trên mobile/tablet để browser không ghim trạng thái hover
        if (document.activeElement === el || el.contains(document.activeElement)) {
          el.blur();
        }
      }
    });

    // Nếu không có wrapper hoạt họa thì cập nhật trực tiếp
    if (!textAnimWrap) {
      titleEl.innerHTML = data.title;
      descEl.innerHTML = data.desc;
      return;
    }

    // Hiệu ứng mượt 60FPS: Fade out nhẹ -> Đổi text -> Fade in
    textAnimWrap.classList.add('is-switching');

    clearTimeout(transitionTimer);
    transitionTimer = setTimeout(() => {
      titleEl.innerHTML = data.title;
      descEl.innerHTML = data.desc;

      // Kích hoạt fade in
      requestAnimationFrame(() => {
        textAnimWrap.classList.remove('is-switching');
      });
    }, 120);
  }

  // Lấy trụ cột tiếp theo theo vòng tròn lặp
  function getNextPillarKey() {
    const currentIndex = CYCLE_KEYS.indexOf(currentKey);
    const nextIndex = (currentIndex + 1) % CYCLE_KEYS.length;
    return CYCLE_KEYS[nextIndex];
  }

  // Chuyển sang trụ cột tiếp theo
  function advanceToNextPillar() {
    if (!isSectionInView || document.hidden) return;
    // Bỏ focus của phần tử chạm trước đó để mobile browser không giữ sáng
    if (document.activeElement && typeof document.activeElement.blur === 'function') {
      document.activeElement.blur();
    }
    const nextKey = getNextPillarKey();
    updateCenterContent(nextKey);
  }

  // Lên lịch tự động chuyển sang trụ cột kế tiếp
  function scheduleNextCycle(delay = CYCLE_INTERVAL) {
    clearTimeout(cycleTimer);
    cycleTimer = setTimeout(() => {
      if (isSectionInView && !document.hidden) {
        advanceToNextPillar();
      }
      // Sau khi chuyển, tiếp tục chu kỳ bình thường với CYCLE_INTERVAL
      scheduleNextCycle(CYCLE_INTERVAL);
    }, delay);
  }

  // Xử lý khi người dùng tương tác (Hover hoặc Click/Tap)
  function handleUserSelect(key) {
    if (!key || !HERO_PILLARS[key]) return;
    updateCenterContent(key);
    // Sau khi hover hoặc click: giữ lại 3.6s (lớn hơn thời gian automation một chút) rồi tự động chuyển sang chữ khác
    scheduleNextCycle(INTERACTION_DWELL);
  }

  // Khởi tạo trạng thái ban đầu: sau 1.1s khi Snap-Lock kết thúc
  setTimeout(() => {
    updateCenterContent('tin', true);
    scheduleNextCycle(CYCLE_INTERVAL);
  }, 1150);

  // Gắn sự kiện hover và click/tap cho từng góc
  interactiveCorners.forEach(cornerEl => {
    const key = cornerEl.getAttribute('data-corner');
    if (!key || !HERO_PILLARS[key]) return;

    // Khi hover vào (Desktop): chuyển ngay và lên lịch chuyển tiếp sau 3.6s
    cornerEl.addEventListener('mouseenter', () => {
      handleUserSelect(key);
    });

    // Khi click hoặc chạm (Mobile / iPad / Touch): chuyển ngay và lên lịch chuyển tiếp sau 3.6s
    const handleTrigger = (e) => {
      if (e) {
        e.stopPropagation();
      }
      handleUserSelect(key);
    };

    cornerEl.addEventListener('click', handleTrigger);
    cornerEl.addEventListener('pointerup', handleTrigger);

    // Hỗ trợ bàn phím (Accessibility: phím Enter hoặc Space)
    cornerEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleUserSelect(key);
      }
    });
  });

  // Khi rê chuột vào khối văn bản trung tâm để đọc: gia hạn thêm dwell time
  if (centerContent) {
    centerContent.addEventListener('mouseenter', () => {
      scheduleNextCycle(INTERACTION_DWELL);
    });
  }

  // Ủy quyền sự kiện (Event Delegation) cấp section: bắt trọn 100% cú chạm/click
  heroSection.addEventListener('click', (e) => {
    const corner = e.target.closest('[data-corner]');
    if (corner) {
      const key = corner.getAttribute('data-corner');
      if (key && HERO_PILLARS[key]) {
        handleUserSelect(key);
      }
    }
  });

  // Tối ưu hiệu năng: Tạm dừng khi tab chuyển sang background
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearTimeout(cycleTimer);
    } else if (isSectionInView) {
      scheduleNextCycle(CYCLE_INTERVAL);
    }
  });

  // Tối ưu hiệu năng: Tạm dừng khi người dùng cuộn khỏi Hero section
  if ('IntersectionObserver' in window) {
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
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

  console.log('✨ Gotek Hero Interactive: Auto-cycle 2.4s, Inactive Dimming 0.28, User Hover/Click Dwell 3.6s.');
}
