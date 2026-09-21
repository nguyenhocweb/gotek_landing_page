/**
 * GOTEK CAPABILITY MATRIX TABS COMPONENT
 * Xử lý chuyển đổi dữ liệu tab tương tác cho Section "Đối Tác Công Nghệ & Phần Mềm Chuyên Nghiệp"
 */

export function initCapabilityTabs() {
  const tabButtons = document.querySelectorAll('.matrix-tab-btn');
  const statNum = document.getElementById('matrixBigStat');
  const statTitle = document.getElementById('matrixStatTitle');
  const statSub = document.getElementById('matrixStatSub');
  const checklist = document.getElementById('matrixChecklist');

  if (!tabButtons.length || !statNum || !statTitle || !statSub || !checklist) return;

  const tabContentData = {
    uptime: {
      num: '99.9<span>%</span>',
      title: 'Chuẩn Khả Dụng Hệ Thống Uptime',
      sub: 'Hạ tầng Multi-Zone chịu tải cao',
      points: [
        'Tự động cân bằng tải (Load Balancing) không gián đoạn giao dịch khi lưu lượng tăng đột biến.',
        'Giám sát sức khỏe server 24/7 với cảnh báo thời gian thực về Telegram/Slack của Tech Lead.',
        'Sao lưu dữ liệu tự động hàng ngày (Daily Cloud Backup) và sẵn sàng khôi phục trong vòng 15 phút.'
      ]
    },
    delivery: {
      num: '&gt;90<span>%</span>',
      title: 'Kỷ Luật Bàn Giao Đúng Tiến Độ Sprint',
      sub: 'Hơn 30+ sản phẩm số đã nghiệm thu thực tế',
      points: [
        'Phân bổ công việc chi tiết qua Jira / GitHub Projects, cập nhật tiến độ công khai cho khách hàng.',
        'Chu kỳ Sprint 2 tuần rõ ràng: Lập kế hoạch -> Lập trình -> Kiểm thử QA -> Demo sản phẩm chạy thật.',
        'Cam kết không phát sinh chi phí hoặc tính năng ngoài phạm vi đã thống nhất trong tài liệu SRS.'
      ]
    },
    legal: {
      num: '100<span>%</span>',
      title: 'Bàn Giao Mã Nguồn Sạch & Toàn Quyền',
      sub: 'Bảo vệ pháp lý và tài sản số cho doanh nghiệp',
      points: [
        'Bàn giao trọn vẹn toàn bộ kho lưu trữ Git Repo, tài liệu kiến trúc kỹ thuật và hướng dẫn triển khai.',
        'Ký kết hợp đồng bảo mật thông tin (NDA) có giá trị pháp lý cao nhất trước khi tiếp cận dữ liệu.',
        'Bảo hành hệ thống và vá lỗi kỹ thuật miễn phí trong vòng 12 tháng kể từ ngày nghiệm thu.'
      ]
    }
  };

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabKey = btn.getAttribute('data-tab');
      if (!tabKey || !tabContentData[tabKey]) return;

      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const data = tabContentData[tabKey];

      // Smooth fade transition
      const card = document.getElementById('capabilityTabDisplay');
      if (card) {
        card.style.opacity = '0.4';
        setTimeout(() => {
          statNum.innerHTML = data.num;
          statTitle.textContent = data.title;
          statSub.textContent = data.sub;
          checklist.innerHTML = data.points.map(p => `
            <li>
              <span class="matrix-check-icon">&#10022;</span>
              <span>${p}</span>
            </li>
          `).join('');
          card.style.opacity = '1';
        }, 150);
      }
    });
  });
}


