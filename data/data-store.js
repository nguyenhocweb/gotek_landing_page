/**
 * GOTEK DATA STORE MODULE
 * Quản lý nạp dữ liệu độc lập theo từng phần từ các file JSON tương ứng trong thư mục data/.
 * 
 * Mỗi phần dữ liệu đã được tách riêng vào từng file chuyên biệt:
 * ├── site-config.json       (Thông tin thương hiệu, liên hệ, navigation, stats)
 * ├── services.json          (Danh sách các gói dịch vụ công nghệ)
 * ├── projects-saas.json     (Dự án SaaS nền tảng)
 * ├── projects-web.json      (Dự án Website & Cổng thông tin)
 * ├── projects-custom.json   (Dự án Phần mềm tùy biến)
 * ├── team.json              (Đội ngũ chuyên gia & kỹ sư)
 * ├── pricing.json           (Bảng giá dịch vụ)
 * ├── testimonials.json      (Đánh giá của khách hàng)
 * ├── ecosystem.json         (Hệ sinh thái đối tác doanh nghiệp)
 * ├── ecosystem-teams.json   (Mô hình 3 đội ngũ: Go Media, GoNetwork, Gotek)
 * └── faq.json               (Câu hỏi thường gặp & hỗ trợ)
 */

async function fetchJSON(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} khi tải ${path}`);
    }
    return await res.json();
  } catch (err) {
    console.error(`[GotekDataStore] Không thể nạp file "${path}":`, err);
    return null;
  }
}

window.GotekDataStore = {
  // 1. Cấu hình thương hiệu, liên hệ, menu
  async loadConfig() {
    return fetchJSON('data/site-config.json');
  },

  // 2. Danh sách dịch vụ
  async loadServices() {
    return fetchJSON('data/services.json');
  },

  // 3. Dự án tiêu biểu theo từng phân loại
  async loadProjectsSaas() {
    return fetchJSON('data/projects-saas.json');
  },
  async loadProjectsWeb() {
    return fetchJSON('data/projects-web.json');
  },
  async loadProjectsCustom() {
    return fetchJSON('data/projects-custom.json');
  },

  // 4. Ban lãnh đạo & đội ngũ kỹ sư
  async loadTeam() {
    return fetchJSON('data/team.json');
  },

  // 5. Bảng báo giá
  async loadPricing() {
    return fetchJSON('data/pricing.json');
  },

  // 6. Đánh giá khách hàng
  async loadTestimonials() {
    return fetchJSON('data/testimonials.json');
  },

  // 7. Hệ sinh thái đối tác
  async loadEcosystem() {
    return fetchJSON('data/ecosystem.json');
  },

  // 8. Hệ sinh thái 3 đội ngũ (Go Media, GoNetwork, Gotek)
  async loadEcosystemTeams() {
    return fetchJSON('data/ecosystem-teams.json');
  },

  // 9. Câu hỏi thường gặp FAQ
  async loadFAQ() {
    return fetchJSON('data/faq.json');
  },

  // 10. Nạp đồng thời toàn bộ dữ liệu từ các file riêng biệt
  async loadAll() {
    const [
      config,
      services,
      projectsSaas,
      projectsWeb,
      projectsCustom,
      team,
      pricing,
      testimonials,
      ecosystem,
      ecosystemTeams,
      faq
    ] = await Promise.all([
      this.loadConfig(),
      this.loadServices(),
      this.loadProjectsSaas(),
      this.loadProjectsWeb(),
      this.loadProjectsCustom(),
      this.loadTeam(),
      this.loadPricing(),
      this.loadTestimonials(),
      this.loadEcosystem(),
      this.loadEcosystemTeams(),
      this.loadFAQ()
    ]);

    return {
      config,
      services,
      projectsSaas,
      projectsWeb,
      projectsCustom,
      team,
      pricing,
      testimonials,
      ecosystem,
      ecosystemTeams,
      faq
    };
  }
};
