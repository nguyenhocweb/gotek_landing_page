/**
 * GOTEK UTILITIES & HELPERS
 * Các hàm tiện ích dùng chung trong toàn bộ hệ thống
 */

export const $ = (selector, context = document) => context.querySelector(selector);
export const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));

/**
 * Định dạng số tiền sang định dạng VNĐ
 */
export function formatCurrency(amount) {
  if (typeof amount === 'number') {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  }
  return amount;
}

/**
 * Tránh lỗi vỡ layout khi ảnh không tải được
 */
export function handleImageFallback(imgElement, fallbackSrc = 'assets/images/logo.png') {
  imgElement.onerror = () => {
    imgElement.onerror = null;
    imgElement.src = fallbackSrc;
  };
}

/**
 * Hàm debounce để tối ưu hiệu năng cuộn hoặc gõ phím
 */
export function debounce(func, wait = 100) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Lấy 2 ký tự viết tắt đại diện từ họ tên (Hỗ trợ danh xưng tiếng Việt)
 * Ví dụ: "Alex Trần" -> "AT", "Hoàng Lê" -> "HL", "Bs. Lan Anh" -> "LA", "Thu Hà" -> "TH"
 * @param {string} name - Họ và tên
 * @returns {string} 2 ký tự in hoa đại diện
 */
export function getInitials(name) {
  if (!name || typeof name !== 'string') return 'GK';
  // Loại bỏ các tiền tố chức danh hoặc danh xưng thường gặp
  const clean = name.replace(/^(Bs\.|ThS\.|TS\.|Bác sĩ|Tiến sĩ|Thạc sĩ|Ông|Bà|Anh|Chị)\s+/i, '').trim();
  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length === 0) return 'GK';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  // Lấy ký tự đầu tiên của từ đầu tiên và ký tự đầu tiên của từ cuối cùng
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

