/**
 * GOTEK HERO INTERACTIVE PILLARS
 * Tương tác 5 trụ cột: Tín - Chuẩn - Tiên - Tốc - Nhân
 * Hỗ trợ cả Desktop SVG và Mobile/iPad Cards (Hover + Click/Tap)
 * Khi hover hoặc click vào góc nào, chữ ở giữa đổi và GIỮ NGUYÊN nội dung đó
 * (chỉ khi reload/reset lại trang mới hiển thị lại "Kiến tạo nền tảng số...")
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
  nhan: {
    title: 'Công Nghệ Bắt Đầu <br /><span class="hero-clean-highlight">Từ Trái Tim Con Người.</span>',
    desc: 'Lắng nghe bằng sự tôn trọng, <strong class="text-blue-accent">thấu hiểu sâu sắc bối cảnh</strong> và xây dựng hệ thống hỗ trợ con người làm việc tốt hơn. Chúng tôi tin rằng công nghệ ưu việt nhất là công nghệ phục vụ đời sống nhân văn, giải phóng sức sáng tạo và tôn vinh năng lực của từng cá nhân trong tổ chức.'
  },
  chuan: {
    title: 'Làm Đúng Theo <br /><span class="hero-clean-highlight">Tiêu Chí &amp; Chuẩn Mực Cao.</span>',
    desc: 'Thống nhất tiêu chuẩn kỹ thuật nghiêm ngặt ngay từ khởi đầu, <strong class="text-blue-accent">kiểm thử khắt khe từng chi tiết</strong> và bàn giao hệ thống sẵn sàng vận hành ổn định. Mọi cấu trúc dữ liệu, giao diện UI/UX và bảo mật đều được chuẩn hóa bài bản, loại bỏ triệt để rủi ro kỹ thuật ngầm.'
  },
  tien: {
    title: 'Chủ Động <br /><span class="hero-clean-highlight">Mở Lối Tiên Phong.</span>',
    desc: 'Liên tục học hỏi đón đầu xu hướng, <strong class="text-blue-accent">chủ động nghiên cứu và làm chủ công nghệ mới</strong> có kiểm soát. Gotek biến đổi những tiến bộ kỹ thuật phức tạp thành các cải tiến ứng dụng thực tế, tạo dựng lợi thế cạnh tranh tiên phong giúp đối tác bứt phá trên thị trường số.'
  },
  toc: {
    title: 'Nhanh Nhưng Luôn <br /><span class="hero-clean-highlight">Có Mục Tiêu &amp; Định Hướng.</span>',
    desc: 'Phản hồi thần tốc đúng hẹn, <strong class="text-blue-accent">ra quyết định dứt khoát</strong> dựa trên dữ liệu và luôn giữ guồng công việc tiến về kết quả hữu ích nhất. Tốc độ triển khai vượt trội kết hợp cùng quy trình tinh gọn giúp rút ngắn tối đa thời gian ra mắt, chớp trọn cơ hội kinh doanh cho khách hàng.'
  }
};

export function initHeroInteractive() {
  const heroSection = document.getElementById('hero');
  if (!heroSection) return;

  const titleEl = document.getElementById('heroTitle');
  const descEl = document.getElementById('heroDesc');
  const textAnimWrap = document.getElementById('heroTextAnimWrap');

  if (!titleEl || !descEl) return;

  // Lấy tất cả các góc tương tác (cả Desktop SVG lẫn Mobile/iPad Cards)
  const interactiveCorners = heroSection.querySelectorAll('[data-corner]');
  if (!interactiveCorners || interactiveCorners.length === 0) return;

  let currentKey = 'default';
  let transitionTimer = null;

  // Hàm cập nhật chữ trung tâm với animation mượt
  function updateCenterContent(key) {
    if (key === currentKey) return;
    const data = HERO_PILLARS[key];
    if (!data) return;
    currentKey = key;

    // Cập nhật class active cho tất cả các góc tương ứng (cả svg lẫn mobile)
    interactiveCorners.forEach(el => {
      const cornerKey = el.getAttribute('data-corner');
      if (cornerKey === key) {
        el.classList.add('is-active');
        el.setAttribute('aria-pressed', 'true');
      } else {
        el.classList.remove('is-active');
        el.setAttribute('aria-pressed', 'false');
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
    }, 130);
  }

  // Gắn sự kiện hover và click cho từng góc: chuyển và giữ nguyên
  // Gắn sự kiện hover và click/tap cho từng góc: chuyển và giữ nguyên
  interactiveCorners.forEach(cornerEl => {
    const key = cornerEl.getAttribute('data-corner');
    if (!key || !HERO_PILLARS[key]) return;

    // Khi hover vào (Desktop): đổi chữ và GIỮ NGUYÊN
    cornerEl.addEventListener('mouseenter', () => {
      updateCenterContent(key);
    });

    // Khi click hoặc chạm (Mobile / iPad / Touch): đổi chữ và GIỮ NGUYÊN
    const handleTrigger = (e) => {
      if (e) {
        e.stopPropagation();
      }
      updateCenterContent(key);
    };

    cornerEl.addEventListener('click', handleTrigger);
    cornerEl.addEventListener('pointerup', handleTrigger);

    // Hỗ trợ bàn phím (Accessibility: phím Enter hoặc Space)
    cornerEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        updateCenterContent(key);
      }
    });
  });

  // Ủy quyền sự kiện (Event Delegation) cấp section: bắt trọn 100% cú chạm/click trên mobile & iPad
  heroSection.addEventListener('click', (e) => {
    const corner = e.target.closest('[data-corner]');
    if (corner) {
      const key = corner.getAttribute('data-corner');
      if (key && HERO_PILLARS[key]) {
        updateCenterContent(key);
      }
    }
  });

  heroSection.addEventListener('pointerup', (e) => {
    const corner = e.target.closest('[data-corner]');
    if (corner) {
      const key = corner.getAttribute('data-corner');
      if (key && HERO_PILLARS[key]) {
        updateCenterContent(key);
      }
    }
  });

  console.log('✨ Gotek Hero Interactive Initialized: Persistent on hover & click.');
}
