/**
 * GOTEK LEAD FORM COMPONENT
 * Xử lý kiểm tra dữ liệu và gửi form yêu cầu tư vấn
 */

import { $ } from '../utils/helpers.js';

export function initLeadForm() {
  const form = $('#leadConsultationForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const fullName = $('#formFullName')?.value.trim();
    const phone = $('#formPhone')?.value.trim();
    const email = $('#formEmail')?.value.trim();
    const service = $('#formService')?.value;
    const message = $('#formMessage')?.value.trim();

    // 1. Kiểm tra trường bắt buộc
    if (!fullName || !phone) {
      alert('Vui lòng nhập đầy đủ Họ tên và Số điện thoại!');
      return;
    }

    // 2. Kiểm tra định dạng số điện thoại Việt Nam (10 số)
    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!phoneRegex.test(phone)) {
      alert('Số điện thoại không hợp lệ! Vui lòng nhập đúng 10 số.');
      return;
    }

    // 3. Giả lập gửi form thành công
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Đang xử lý yêu cầu...';

    setTimeout(() => {
      alert(`🎉 Cảm ơn ${fullName}! Yêu cầu tư vấn dịch vụ [${service}] của bạn đã được gửi đến Gotek. Chuyên viên kỹ thuật sẽ liên hệ lại trong vòng 15 phút!`);
      form.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }, 800);
  });
}
