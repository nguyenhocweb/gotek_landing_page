/**
 * GOTEK DATA STORE MODULE
 * Hỗ trợ nạp dữ liệu động từ data/*.json khi chạy trên HTTP server,
 * và tự động fallback về FALLBACK_DATA khi chạy trực tiếp trên file:/// (không bao giờ bị lỗi CORS hay trắng trang).
 */

const FALLBACK_DATA = {
  "data/site-config.json": {
    "brand": {
      "name": "Gotek",
      "legalName": "Công Ty Cổ Phần Công Nghệ Gotek",
      "slogan": "Thiết kế website chuyên nghiệp, chuẩn SEO & vận hành bền vững",
      "logo": "assets/images/logo.png",
      "yearFounded": 2020
    },
    "contact": {
      "hotline": "+84978970605",
      "phoneDisplay": "+84 97 897 0605",
      "companyPhone": "+84 97 897 0605",
      "email": "info@gotek.asia",
      "address": "Go Media Agency Đà Nẵng — 91 Thành Thái, Cẩm Lệ, Đà Nẵng",
      "workingHours": "Thứ 2 - Thứ 7: 08:00 - 18:00 (Hỗ trợ kỹ thuật 24/7)"
    },
    "navigation": [
      {
        "label": "Trang chủ",
        "href": "#hero"
      },
      {
        "label": "Giới thiệu",
        "href": "#about"
      },
      {
        "label": "Dịch vụ",
        "href": "#services"
      },
      {
        "label": "Dự án",
        "href": "#projects"
      },
      {
        "label": "Bảng giá",
        "href": "#pricing"
      },
      {
        "label": "Tư vấn",
        "href": "#consultation"
      },
      {
        "label": "Quy trình",
        "href": "#process"
      },
      {
        "label": "Đánh giá",
        "href": "#testimonials"
      },
      {
        "label": "Hệ sinh thái",
        "href": "#ecosystem-teams"
      },
      {
        "label": "FAQ",
        "href": "#faq"
      },
      {
        "label": "Liên hệ",
        "href": "#contact"
      }
    ],
    "socials": [
      {
        "name": "Facebook",
        "icon": "facebook",
        "url": "https://www.facebook.com/gotek.asia/"
      },
      {
        "name": "Instagram",
        "icon": "instagram",
        "url": "https://www.instagram.com/gotek.asia/"
      },
      {
        "name": "Threads",
        "icon": "threads",
        "url": "https://www.threads.com/@gotek.asia"
      },
      {
        "name": "X",
        "icon": "x",
        "url": "https://x.com/gotek_asia"
      }
    ],
    "stats": [
      {
        "number": "10+",
        "label": "Năm kinh nghiệm thực chiến"
      },
      {
        "number": "1000+",
        "label": "Dự án website hoàn thành"
      },
      {
        "number": "99.9%",
        "label": "Cam kết Uptime Cloud"
      },
      {
        "number": "24/7",
        "label": "Hỗ trợ & bảo hành trọn đời"
      }
    ]
  },
  "data/services.json": [
    {
      "id": "web-corporate",
      "title": "Thiết kế website doanh nghiệp",
      "description": "Xây dựng website nhận diện đẳng cấp, thể hiện trọn vẹn vị thế thương hiệu, chuẩn SEO 100% Google và tối ưu trải nghiệm đa thiết bị.",
      "icon": "globe",
      "image": "assets/images/services/service-1.jpg",
      "badge": "Độc Bản",
      "features": [
        "Giao diện độc bản thiết kế trên Figma",
        "Tối ưu Core Web Vitals xanh tuyệt đối",
        "Cấu trúc code chuẩn SEO Google từ lõi",
        "CMS quản trị trực quan, dễ cập nhật"
      ]
    },
    {
      "id": "web-ecommerce",
      "title": "Website bán hàng & e-commerce",
      "description": "Tối ưu hóa hành trình mua sắm và tỷ lệ chuyển đổi (CRO), tích hợp thanh toán tự động, quản lý đơn hàng và báo cáo doanh thu thông minh.",
      "icon": "shopping-cart",
      "image": "assets/images/services/service-2.jpg",
      "badge": "Tối Ưu CRO",
      "features": [
        "Luồng mua hàng 1-click mượt mà 60FPS",
        "Tích hợp VNPay, MoMo, Visa/Mastercard",
        "Đồng bộ kho hàng, khuyến mãi & vận chuyển",
        "Tối ưu Schema sản phẩm leo top Google"
      ]
    },
    {
      "id": "web-saas-portal",
      "title": "Cổng thông tin & web ứng dụng",
      "description": "Phát triển web app, cổng thông tin dữ liệu lớn và hệ thống số hóa nghiệp vụ chuyên biệt với kiến trúc mở rộng linh hoạt.",
      "icon": "layers",
      "image": "assets/images/services/service-3.jpg",
      "badge": "Chịu Tải Lớn",
      "features": [
        "Frontend React / Next.js SSR hiện đại",
        "Phân quyền đa cấp RBAC & bảo mật WAF",
        "Xử lý dữ liệu lớn & API thời gian thực",
        "Hạ tầng Docker / Cloud Auto-scaling"
      ]
    },
    {
      "id": "uiux-prototype",
      "title": "Thiết kế UI/UX & prototype",
      "description": "Nghiên cứu hành vi người dùng (UX Research), xây dựng Wireframe và Prototype tương tác thực tế trước khi bắt tay lập trình.",
      "icon": "palette",
      "image": "assets/images/services/service-4.jpg",
      "badge": "Sáng Tạo",
      "features": [
        "Mapping luồng chuyển đổi người dùng",
        "Design System toàn diện theo Brand Kit",
        "Demo trải nghiệm trực tiếp trên Figma",
        "Kiểm chứng tính khả dụng trước khi code"
      ]
    },
    {
      "id": "seo-performance",
      "title": "Tối ưu tốc độ & SEO tổng thể",
      "description": "Nâng cấp website hiện có lên điểm số PageSpeed 95+, tối ưu cấu trúc Technical SEO và thiết lập các phễu tự động hóa.",
      "icon": "zap",
      "image": "assets/images/services/service-5.jpg",
      "badge": "Chuẩn SEO",
      "features": [
        "Tối ưu hóa LCP, FID, CLS đạt chuẩn Google",
        "Cấu hình Cache đa tầng Redis / LiteSpeed",
        "Setup Schema, Sitemap và Technical SEO",
        "Bảo mật SSL và tường lửa chống DDoS"
      ]
    },
    {
      "id": "hosting-infrastructure",
      "title": "Hạ tầng Cloud & vận hành 24/7",
      "description": "Cung cấp hosting tốc độ cao, VPS riêng biệt và dịch vụ giám sát chủ động, bảo trì định kỳ đảm bảo website vận hành liên tục.",
      "icon": "server",
      "image": "assets/images/services/service-1.jpg",
      "badge": "Vận Hành 24/7",
      "features": [
        "Cam kết 99.9% Uptime cho toàn hệ thống",
        "Sao lưu dữ liệu tự động hàng ngày",
        "Cảnh báo sự cố và xử lý khẩn cấp 24/7",
        "Sẵn sàng mở rộng khi traffic tăng vọt"
      ]
    }
  ],
  "data/projects-saas.json": {
    "categoryTitle": "Website doanh nghiệp",
    "items": [
      {
        "id": "dohwa-biomass",
        "name": "DOHWA Biomass Global",
        "image": "assets/images/projects/long_drdbiomass.jpg",
        "desc": "Website doanh nghiệp sản xuất và xuất khẩu năng lượng sinh khối 100.000 tấn/năm.",
        "link": "#contact"
      },
      {
        "id": "quan-nhau-tu-do",
        "name": "Quán Nhậu Tự Do",
        "image": "assets/images/projects/long_quannhautudo.jpg",
        "desc": "Website chuỗi nhà hàng F&B ẩm thực phong cách hoài niệm 18 chi nhánh.",
        "link": "#contact"
      },
      {
        "id": "god-restaurant",
        "name": "GOD Restaurant Fine Dining",
        "image": "assets/images/projects/long_godrestaurant.jpg",
        "desc": "Website thương hiệu nhà hàng ẩm thực Việt Nam cao cấp tại Đà Nẵng.",
        "link": "#contact"
      },
      {
        "id": "gotek-tech",
        "name": "Gotek Technology Ecosystem",
        "image": "assets/images/projects/long_gotek.jpg",
        "desc": "Cổng thông tin giải pháp công nghệ và hệ sinh thái phần mềm doanh nghiệp.",
        "link": "https://gotek.asia/"
      },
      {
        "id": "wechoice-awards-2025",
        "name": "Cổng bình chọn quốc gia",
        "image": "assets/images/projects/long_wechoice.jpg",
        "desc": "Cổng thông tin và hệ thống bình chọn giải thưởng quốc gia WeChoice Awards.",
        "link": "#contact"
      }
    ]
  },
  "data/projects-web.json": {
    "categoryTitle": "Website thương mại & cổng dịch vụ",
    "items": [
      {
        "id": "yolife-vn-ecommerce",
        "name": "Chăm sóc sức khỏe",
        "image": "assets/images/projects/long_yolife.jpg",
        "desc": "Website thương mại điện tử D2C và Landing Page tối ưu CRO ngành chăm sóc sức khỏe.",
        "link": "https://yolife.vn/"
      },
      {
        "id": "seoulcenter-landing",
        "name": "Thẩm mỹ quốc tế",
        "image": "assets/images/projects/long_seoulcenter.jpg",
        "desc": "Trang đích chiến dịch Mua 1 Được 3 của Seoul Center chuẩn y khoa.",
        "link": "#contact"
      },
      {
        "id": "futa-residence",
        "name": "Bất động sản nghỉ dưỡng",
        "image": "assets/images/projects/long_futaresidence.jpg",
        "desc": "Landing page dự án bất động sản nghỉ dưỡng hạng sang bên biển Mỹ Khê của FUTA Land.",
        "link": "#contact"
      }
    ]
  },
  "data/projects-custom.json": {
    "categoryTitle": "Hệ thống web & nền tảng riêng",
    "items": []
  },
  "data/team.json": [
    {
      "id": "team-01",
      "name": "Lê Nguyễn Cẩm Chi",
      "role": "CEO & sáng lập viên",
      "avatar": "assets/images/team/avatar_ceo_1.jpg",
      "bio": "Hơn 12 năm kinh nghiệm điều hành và tư vấn chiến lược chuyển đổi số cho các tập đoàn đa quốc gia.",
      "skills": [
        "Chiến lược số",
        "Quản trị sản phẩm",
        "Lãnh đạo"
      ]
    },
    {
      "id": "team-02",
      "name": "Trần Quốc Toàn",
      "role": "Giám đốc kỹ thuật (CTO)",
      "avatar": "assets/images/team/avatar_ceo_1.jpg",
      "bio": "Chuyên gia kiến trúc hệ thống phân tán, nguyên Lead Architect tại các kỳ lân công nghệ Đông Nam Á.",
      "skills": [
        "Microservices",
        "Cloud DevOps",
        "An ninh mạng"
      ]
    },
    {
      "id": "team-03",
      "name": "Nguyễn Minh Châu",
      "role": "Giám đốc thiết kế (Head of Design)",
      "avatar": "assets/images/team/avatar_ceo_1.jpg",
      "bio": "Đạt nhiều giải thưởng thiết kế quốc tế, kiến tạo trải nghiệm người dùng tinh tế và đột phá.",
      "skills": [
        "Design System",
        "UX Research",
        "Motion Interaction"
      ]
    },
    {
      "id": "team-04",
      "name": "Phạm Hoàng Nam",
      "role": "Trưởng nhóm AI & dữ liệu lớn",
      "avatar": "assets/images/team/avatar_ceo_1.jpg",
      "bio": "Tiến sĩ Khoa học Máy tính, chủ nhiệm nhiều đề tài nghiên cứu về Large Language Models và Computer Vision.",
      "skills": [
        "Machine Learning",
        "RAG Systems",
        "Python/PyTorch"
      ]
    }
  ],
  "data/pricing.json": [
    {
      "id": "web-standard",
      "isFeatured": false,
      "ribbonTag": "GÓI DOANH NGHIỆP",
      "categoryBadge": "GÓI DOANH NGHIỆP",
      "levelTag": "Web Standard",
      "planName": "Website doanh nghiệp",
      "planDesc": "Dành cho doanh nghiệp cần sự hiện diện trực tuyến đẳng cấp, giới thiệu năng lực công ty, chuẩn SEO và dễ quản trị.",
      "investmentLabel": "MỨC ĐẦU TƯ DỰ KIẾN",
      "price": "Từ 15.000.000đ",
      "unit": "/ dự án",
      "featuresLabel": "BAO GỒM CÁC HẠNG MỤC:",
      "features": [
        "Thiết kế UI/UX độc bản theo nhận diện thương hiệu (Figma)",
        "Tối ưu hóa tốc độ tải trang Core Web Vitals 95+",
        "Giao diện responsive mượt mà 100% trên mọi thiết bị",
        "Cấu trúc chuẩn SEO Google & tích hợp Schema Rich Snippets",
        "Hệ quản trị nội dung CMS thân thiện, dễ dùng không cần code",
        "Bàn giao toàn bộ mã nguồn sạch & bảo hành kỹ thuật 12 tháng"
      ],
      "buttonText": "Nhận tư vấn kỹ thuật",
      "buttonLink": "#contact"
    },
    {
      "id": "web-ecommerce",
      "isFeatured": true,
      "ribbonTag": "PHỔ BIẾN NHẤT",
      "categoryBadge": "GÓI BÁN HÀNG & CRO",
      "levelTag": "Web E-Commerce",
      "planName": "Website thương mại & cổng dịch vụ",
      "planDesc": "Tối ưu hóa phễu chuyển đổi (CRO) bứt phá doanh thu, tích hợp giỏ hàng, thanh toán trực tuyến và tự động hóa marketing.",
      "investmentLabel": "MỨC ĐẦU TƯ DỰ KIẾN",
      "price": "Từ 28.000.000đ",
      "unit": "/ dự án",
      "featuresLabel": "BAO GỒM TOÀN BỘ TÍNH NĂNG:",
      "features": [
        "Nghiên cứu hành trình khách hàng & thiết kế tối ưu chuyển đổi (CRO)",
        "Tích hợp cổng thanh toán trực tuyến (VNPay, Momo, Visa/Mastercard)",
        "Frontend Next.js / React siêu tốc đạt điểm số PageSpeed tối ưu",
        "Quản lý sản phẩm, đơn hàng, kho hàng và báo cáo doanh thu trực quan",
        "Cấu hình Cache đa tầng (Redis/LiteSpeed) & bảo mật SSL, Firewall",
        "Đồng hành đào tạo vận hành nội bộ & hỗ trợ kỹ thuật 24/7 trọn đời"
      ],
      "buttonText": "Đăng ký tư vấn ngay",
      "buttonLink": "#contact"
    },
    {
      "id": "enterprise-custom",
      "isFeatured": false,
      "ribbonTag": "HỆ THỐNG RIÊNG",
      "categoryBadge": "HỆ THỐNG & SAAS",
      "levelTag": "Enterprise Custom",
      "planName": "Hệ thống web & nền tảng riêng",
      "planDesc": "Thiết kế và phát triển nền tảng web phức tạp, cổng thông tin dữ liệu lớn hoặc SaaS may đo theo đặc thù vận hành.",
      "investmentLabel": "MỨC ĐẦU TƯ DỰ KIẾN",
      "price": "Tùy chỉnh scope",
      "unit": "/ theo bài toán",
      "featuresLabel": "BAO GỒM CÁC HẠNG MỤC:",
      "features": [
        "Kiến trúc hệ thống tùy biến chuyên sâu (Next.js / Laravel / Microservices)",
        "Hệ thống phân quyền đa cấp (RBAC), SSO & bảo mật an ninh đa lớp",
        "Tích hợp API bên thứ ba, kết nối ERP/CRM nội bộ và module AI",
        "Hạ tầng VPS/Cloud Auto-scaling chịu tải hàng triệu lượt truy cập",
        "Bàn giao 100% Source Code + Pipeline CI/CD tự động",
        "Solution Architect đồng hành giám sát và nâng cấp dài hạn"
      ],
      "buttonText": "Nhận tư vấn kỹ thuật",
      "buttonLink": "#contact"
    }
  ],
  "data/testimonials.json": {
    "section": {
      "title": "Khách hàng",
      "highlightTitle": "nói gì về Gotek"
    },
    "testimonials": [
      {
        "id": "t-01",
        "name": "Bùi Mạnh Đức",
        "avatar": "assets/images/customers/customer_1.jpg",
        "rating": 5,
        "time": "Google Maps",
        "quote": "Tôi khá hài lòng chất lượng dịch vụ thiết kế website tại Gotek, bạn tư vấn và hỗ trợ kỹ thuật nhiệt tình. Website khi demo và thiết kế ra sản phẩm giống hệt."
      },
      {
        "id": "t-02",
        "name": "Nhi Nguyễn",
        "avatar": "assets/images/customers/customer_2.jpg",
        "rating": 5,
        "time": "Google Maps",
        "quote": "Tôi là công ty nhỏ, cần website giới thiệu sản phẩm + blog + phần liên hệ. Tôi chọn gói giá vừa phải của Gotek. Họ tư vấn rõ ràng từ đầu: chức năng cần thiết, giao diện mẫu nào phù hợp, SEO cơ bản, hosting, bảo mật. Website hoàn thành trong đúng tiến độ."
      },
      {
        "id": "t-03",
        "name": "Rr Rri",
        "avatar": "assets/images/customers/customer_3.jpg",
        "rating": 5,
        "time": "Google Maps",
        "quote": "Tôi muốn một website bán hàng với giao diện hiện đại, dễ quản lý được sản phẩm, tính năng thanh toán, cập nhật lịch trình mua hàng... Gotek đã thực hiện tốt hơn mong đợi. Giao diện đẹp, chuẩn SEO, load trang nhanh, đặc biệt là phần admin dễ sử dụng."
      },
      {
        "id": "t-04",
        "name": "Nam Nguyễn",
        "avatar": "assets/images/customers/customer_4.jpg",
        "rating": 5,
        "time": "Google Maps",
        "quote": "Trước khi hợp tác với Gotek, website công ty tôi thường xuyên bị downtime, tốc độ tải trang rất chậm, khách vào chán, thoát nhiều. Sau khi sử dụng Hosting + website do Gotek triển khai, uptime tốt hơn rõ rệt."
      },
      {
        "id": "t-05",
        "name": "Vũ Thành",
        "avatar": "assets/images/customers/customer_5.jpg",
        "rating": 5,
        "time": "Google Maps",
        "quote": "Gotek thiết kế website chuẩn, team SEO bên mình không cần tối ưu gì thêm, mở index chạy live chỉ hơn 1 tháng là lên top nhiều từ khóa mà chưa cần tốn tài nguyên. Cám ơn team, chúc Gotek ngày càng phát triển."
      },
      {
        "id": "t-06",
        "name": "Hải Đào",
        "avatar": "assets/images/customers/customer_6.jpg",
        "rating": 5,
        "time": "Google Maps",
        "quote": "Gotek đã giúp công ty mình thiết kế website chuẩn SEO, giao diện đẹp và rất dễ sử dụng. Đội ngũ hỗ trợ nhiệt tình, giải đáp nhanh chóng mọi thắc mắc. Rất hài lòng với dịch vụ, chắc chắn sẽ tiếp tục hợp tác lâu dài."
      },
      {
        "id": "t-07",
        "name": "Gamer Kenz",
        "avatar": "assets/images/customers/customer_1.jpg",
        "rating": 5,
        "time": "Google Maps",
        "quote": "Website do Gotek thiết kế chạy rất mượt, tối ưu SEO tốt nên chỉ sau vài tháng đã có thứ hạng cao trên Google. Giao diện hiện đại, thân thiện với người dùng. Đội ngũ hỗ trợ tận tình, mình rất hài lòng."
      },
      {
        "id": "t-08",
        "name": "Hiền Trần",
        "avatar": "assets/images/customers/customer_2.jpg",
        "rating": 5,
        "time": "Google Maps",
        "quote": "Mình yêu cầu nhiều tính năng đặc biệt trên website và Gotek đều đáp ứng được. Sản phẩm hoàn thiện vượt mong đợi, vừa đẹp vừa dễ quản lý. Đây chắc chắn là đơn vị thiết kế web đáng tin cậy."
      },
      {
        "id": "t-09",
        "name": "Điện Tử Cân",
        "avatar": "assets/images/customers/customer_3.jpg",
        "rating": 5,
        "time": "Google Maps",
        "quote": "Thiết kế website OK, đẹp, support nhiệt tình mỗi khi mình cần. 10/10."
      },
      {
        "id": "t-10",
        "name": "Thế Nam Phạm",
        "avatar": "assets/images/customers/customer_4.jpg",
        "rating": 5,
        "time": "Google Maps",
        "quote": "Mình sử dụng dịch vụ hosting và server của Gotek hơn 6 tháng nay, tốc độ ổn định, ít khi gặp lỗi. Khi có vấn đề kỹ thuật thì đội support xử lý cực nhanh. Giá cả cũng hợp lý so với chất lượng."
      },
      {
        "id": "t-11",
        "name": "Warzone COD",
        "avatar": "assets/images/customers/customer_5.jpg",
        "rating": 5,
        "time": "Google Maps",
        "quote": "Ấn tượng nhất ở Gotek là phong cách làm việc chuyên nghiệp và thân thiện. Từ khâu tư vấn đến triển khai đều rõ ràng, minh bạch. Sản phẩm bàn giao đúng hẹn và vượt mong đợi."
      },
      {
        "id": "t-12",
        "name": "Kadupul Spa",
        "avatar": "assets/images/customers/customer_6.jpg",
        "rating": 5,
        "time": "Google Maps",
        "quote": "Good web services, speed support. Highly recommended for business website."
      }
    ]
  },
  "data/ecosystem.json": {
    "section": {
      "title": "Hệ Sinh Thái",
      "highlightTitle": "Đối Tác Chiến Lược",
      "subtitle": "Gotek đồng hành phát triển cùng các doanh nghiệp uy tín và tổ chức công nghệ hàng đầu."
    },
    "partners": [
      {
        "name": "Vinamilk",
        "title": "Vinamilk - F&B / Hàng tiêu dùng",
        "logo": "assets/partner-logos/01-vinamilk.png",
        "alt": "Vinamilk"
      },
      {
        "name": "Suntory PepsiCo",
        "title": "Suntory PepsiCo - F&B / Đồ uống",
        "logo": "assets/partner-logos/02-suntory-pepsico.png",
        "alt": "Suntory PepsiCo"
      },
      {
        "name": "Diana",
        "title": "Diana - Hàng tiêu dùng",
        "logo": "assets/partner-logos/03-diana.png",
        "alt": "Diana"
      },
      {
        "name": "Nam Nùng",
        "title": "Nam Nùng - Ẩm thực",
        "logo": "assets/partner-logos/04-nam-nung.png",
        "alt": "Nam Nùng"
      },
      {
        "name": "La Roche-Posay",
        "title": "La Roche-Posay - Dược mỹ phẩm",
        "logo": "assets/partner-logos/05-la-roche-posay.png",
        "alt": "La Roche-Posay"
      },
      {
        "name": "Top Gia",
        "title": "Top Gia - Gia dụng",
        "logo": "assets/partner-logos/06-top-gia.png",
        "alt": "Top Gia"
      },
      {
        "name": "Bobby",
        "title": "Bobby - Mẹ & Bé",
        "logo": "assets/partner-logos/07-bobby.png",
        "alt": "Bobby"
      },
      {
        "name": "Corona Resort & Casino",
        "title": "Corona Resort & Casino - Nghỉ dưỡng & Giải trí",
        "logo": "assets/partner-logos/08-corona-resort.png",
        "alt": "Corona Resort & Casino"
      },
      {
        "name": "Green+",
        "title": "Green+ - Dược liệu & Sức khỏe",
        "logo": "assets/partner-logos/09-green-plus.png",
        "alt": "Green+"
      },
      {
        "name": "Kichi-Kichi",
        "title": "Kichi-Kichi - Ẩm thực / F&B",
        "logo": "assets/partner-logos/10-kichi-kichi.png",
        "alt": "Kichi-Kichi"
      },
      {
        "name": "Simple Drink",
        "title": "Simple Drink - Đồ uống",
        "logo": "assets/partner-logos/11-simple-drink.png",
        "alt": "Simple Drink"
      },
      {
        "name": "Popeyes",
        "title": "Popeyes - Thức ăn nhanh",
        "logo": "assets/partner-logos/12-popeyes.png",
        "alt": "Popeyes"
      },
      {
        "name": "JanShop",
        "title": "JanShop - Thời trang",
        "logo": "assets/partner-logos/13-janshop.png",
        "alt": "JanShop"
      },
      {
        "name": "Wyndham Danang Golden Bay",
        "title": "Wyndham Danang Golden Bay - Khách sạn & Nghỉ dưỡng",
        "logo": "assets/partner-logos/14-wyndham-danang.png",
        "alt": "Wyndham Danang Golden Bay"
      },
      {
        "name": "Win / WinMart",
        "title": "Win / WinMart - Bán lẻ",
        "logo": "assets/partner-logos/15-win-winmart.png",
        "alt": "Win / WinMart"
      },
      {
        "name": "Merci Bánh Mì",
        "title": "Merci Bánh Mì - F&B Bakery",
        "logo": "assets/partner-logos/16-merci-banh-mi.png",
        "alt": "Merci Bánh Mì"
      },
      {
        "name": "Lynk & Co",
        "title": "Lynk & Co - Ô tô / Vận tải",
        "logo": "assets/partner-logos/17-lynk-and-co.png",
        "alt": "Lynk & Co"
      },
      {
        "name": "Starbucks",
        "title": "Starbucks - Chuỗi Cà phê",
        "logo": "assets/partner-logos/18-starbucks.png",
        "alt": "Starbucks"
      },
      {
        "name": "Lapin Bakery & Cafe",
        "title": "Lapin Bakery & Cafe - Bakery & Dessert",
        "logo": "assets/partner-logos/19-lapin-bakery.png",
        "alt": "Lapin Bakery & Cafe"
      },
      {
        "name": "Havana",
        "title": "Havana - Thời trang & Phụ kiện",
        "logo": "assets/partner-logos/20-havana.png",
        "alt": "Havana"
      },
      {
        "name": "Chicken Plus+",
        "title": "Chicken Plus+ - F&B Gà rán",
        "logo": "assets/partner-logos/21-chicken-plus.png",
        "alt": "Chicken Plus+"
      },
      {
        "name": "Phở 1954 Coffee",
        "title": "Phở 1954 Coffee - F&B Coffee",
        "logo": "assets/partner-logos/22-pho-1954-coffee.png",
        "alt": "Phở 1954 Coffee"
      },
      {
        "name": "Changhi",
        "title": "Changhi - Chè & Tráng miệng",
        "logo": "assets/partner-logos/23-changhi.png",
        "alt": "Changhi"
      },
      {
        "name": "Flower Studio",
        "title": "Flower Studio - Nghệ thuật & Hoa",
        "logo": "assets/partner-logos/24-flower-studio.png",
        "alt": "Flower Studio"
      },
      {
        "name": "Socos",
        "title": "Socos - Công nghệ",
        "logo": "assets/partner-logos/25-socos.png",
        "alt": "Socos"
      },
      {
        "name": "Sông Thần",
        "title": "Sông Thần - Công nghiệp & BĐS",
        "logo": "assets/partner-logos/26-song-than.png",
        "alt": "Sông Thần"
      },
      {
        "name": "Coca-Cola",
        "title": "Coca-Cola - Nước giải khát",
        "logo": "assets/partner-logos/27-coca-cola.png",
        "alt": "Coca-Cola"
      },
      {
        "name": "Tasco",
        "title": "Tasco - Hạ tầng giao thông",
        "logo": "assets/partner-logos/28-tasco.png",
        "alt": "Tasco"
      },
      {
        "name": "Anh Đức Print",
        "title": "Anh Đức Print - In ấn & Bao bì",
        "logo": "assets/partner-logos/29-anh-duc-print.png",
        "alt": "Anh Đức Print"
      },
      {
        "name": "Aeon",
        "title": "Aeon - Đại siêu thị & Bán lẻ",
        "logo": "assets/partner-logos/30-aeon.png",
        "alt": "Aeon"
      },
      {
        "name": "Houm Design",
        "title": "Houm Design - Nội thất & Kiến trúc",
        "logo": "assets/partner-logos/31-houm-design.png",
        "alt": "Houm Design"
      },
      {
        "name": "Udon Ten",
        "title": "Udon Ten - Ẩm thực Nhật",
        "logo": "assets/partner-logos/32-udon-ten.png",
        "alt": "Udon Ten"
      },
      {
        "name": "Văn Cocktail Bar",
        "title": "Văn Cocktail Bar - Bar & Lounge",
        "logo": "assets/partner-logos/33-van-cocktail-bar.png",
        "alt": "Văn Cocktail Bar"
      },
      {
        "name": "Hybra",
        "title": "Hybra - Sáng tạo & Thiết kế",
        "logo": "assets/partner-logos/34-hybra.png",
        "alt": "Hybra"
      },
      {
        "name": "Kasa Craft Beer",
        "title": "Kasa Craft Beer - Bia thủ công",
        "logo": "assets/partner-logos/35-kasa-craft-beer.png",
        "alt": "Kasa Craft Beer"
      },
      {
        "name": "iSushi",
        "title": "iSushi - Buffet Nhật Bản",
        "logo": "assets/partner-logos/36-isushi.png",
        "alt": "iSushi"
      },
      {
        "name": "Titi Kij",
        "title": "Titi Kij - Mì cay & Lẩu",
        "logo": "assets/partner-logos/37-titi-kij.png",
        "alt": "Titi Kij"
      },
      {
        "name": "Acorn Studio",
        "title": "Acorn Studio - Sản phẩm sáng tạo",
        "logo": "assets/partner-logos/38-acorn-studio.png",
        "alt": "Acorn Studio"
      },
      {
        "name": "Cozy Tea",
        "title": "Cozy Tea - Trà & Đồ uống",
        "logo": "assets/partner-logos/39-cozy-tea.png",
        "alt": "Cozy Tea"
      },
      {
        "name": "Yolife",
        "title": "Yolife - Chăm sóc sức khỏe",
        "logo": "assets/partner-logos/40-yolife.png",
        "alt": "Yolife"
      },
      {
        "name": "Uyên Phương Cosmetic",
        "title": "Uyên Phương Cosmetic - Mỹ phẩm làm đẹp",
        "logo": "assets/partner-logos/41-uyen-phuong-cosmetic.png",
        "alt": "Uyên Phương Cosmetic"
      },
      {
        "name": "The Nam An",
        "title": "The Nam An - Bất động sản & F&B",
        "logo": "assets/partner-logos/42-the-nam-an.png",
        "alt": "The Nam An"
      },
      {
        "name": "W Coffee & Tea",
        "title": "W Coffee & Tea - Cà phê & Trà",
        "logo": "assets/partner-logos/43-w-coffee-tea.png",
        "alt": "W Coffee & Tea"
      },
      {
        "name": "Spicy Box",
        "title": "Spicy Box - Tokpokki & Fastfood",
        "logo": "assets/partner-logos/44-spicy-box.png",
        "alt": "Spicy Box"
      },
      {
        "name": "Anna",
        "title": "Anna - Thời trang & Phụ kiện",
        "logo": "assets/partner-logos/45-anna.png",
        "alt": "Anna"
      },
      {
        "name": "nOt Coffee & Tea",
        "title": "nOt Coffee & Tea - Cafe & Tea",
        "logo": "assets/partner-logos/46-not-coffee-tea.png",
        "alt": "nOt Coffee & Tea"
      },
      {
        "name": "Only Nuts",
        "title": "Only Nuts - Hạt dinh dưỡng",
        "logo": "assets/partner-logos/47-only-nuts.png",
        "alt": "Only Nuts"
      },
      {
        "name": "Nghé Coffee & Vegan",
        "title": "Nghé Coffee & Vegan - Chay & Cà phê",
        "logo": "assets/partner-logos/48-nghe-coffee-vegan.png",
        "alt": "Nghé Coffee & Vegan"
      },
      {
        "name": "160 Store",
        "title": "160 Store - Thời trang nam",
        "logo": "assets/partner-logos/49-160-store.png",
        "alt": "160 Store"
      },
      {
        "name": "Geely",
        "title": "Geely - Tập đoàn ô tô",
        "logo": "assets/partner-logos/50-geely.png",
        "alt": "Geely"
      },
      {
        "name": "Golf Valley Hotel",
        "title": "Golf Valley Hotel - Khách sạn 4 sao Dalat",
        "logo": "assets/partner-logos/51-golf-valley-hotel.png",
        "alt": "Golf Valley Hotel"
      },
      {
        "name": "Yên Yakiniku",
        "title": "Yên Yakiniku - Nướng Nhật Bản",
        "logo": "assets/partner-logos/52-yen-yakiniku.png",
        "alt": "Yên Yakiniku"
      }
    ]
  },
  "data/ecosystem-teams.json": {
    "section": {
      "eyebrow": "MÔ HÌNH HỢP TÁC CHIẾN LƯỢC",
      "title": "Một hệ sinh thái.",
      "subtitleTitle": "<span class=\"text-brand-gradient\">Ba đội ngũ</span>, ba phần việc.",
      "description": "Doanh nghiệp có thể bắt đầu từ một nhu cầu cụ thể rồi kết nối thêm năng lực phù hợp khi dự án cần mở rộng."
    },
    "teams": [
      {
        "id": "team-gomedia",
        "position": "left",
        "name": "Go Media",
        "tag": "GO MEDIA",
        "tagClass": "tag-navy",
        "title": "Xây thương hiệu và tạo nhu cầu thị trường",
        "logo": "assets/images/partner-go-media.png",
        "description": "Go Media chuyển mục tiêu kinh doanh thành định hướng thương hiệu, kế hoạch nội dung và hoạt động thương mại điện tử nhất quán trên các kênh.",
        "link": "#",
        "btntxt": "Khám phá Go Media"
      },
      {
        "id": "team-gonetwork",
        "position": "right",
        "name": "GoNetwork",
        "tag": "GONETWORK",
        "tagClass": "tag-cyan",
        "title": "Kết nối thương hiệu với đúng tiếng nói",
        "logo": "assets/images/partner-gonetwork.png",
        "description": "GoNetwork đưa kế hoạch vào mạng lưới nhà sáng tạo, KOL/KOC; làm rõ đối tượng, phạm vi, lịch triển khai và đầu mối phối hợp.",
        "link": "#",
        "btntxt": "Khám phá Go Network"
      },
      {
        "id": "team-gotek",
        "position": "bottom",
        "name": "Gotek",
        "tag": "GOTEK",
        "tagClass": "tag-blue",
        "title": "Biến chiến lược thành hệ thống vận hành được",
        "logo": "assets/images/gotek-logo-color.svg",
        "description": "Gotek xây website, phần mềm, hạ tầng và tự động hóa để dữ liệu, quy trình cùng trải nghiệm số có thể vận hành, theo dõi và mở rộng.",
        "link": "#",
        "btntxt": "Khám phá Go Tek"
      }
    ]
  },
  "data/faq.json": {
    "section": {
      "tag": "GIẢI ĐÁP TRƯỚC KHI BẮT ĐẦU",
      "title": "Câu hỏi thường gặp về",
      "highlightTitle": "thiết kế website",
      "subtitle": "Những thông tin cần làm rõ trước khi Gotek tư vấn cấu trúc, công nghệ và lộ trình phù hợp cho doanh nghiệp."
    },
    "support": {
      "title": "Bạn đang chuẩn bị một dự án website?",
      "description": "Chia sẻ mục tiêu, nhóm người dùng và nội dung hiện có. Gotek sẽ cùng bạn xác định phạm vi phù hợp trước khi triển khai.",
      "ctaText": "Gửi yêu cầu tư vấn",
      "ctaLink": "https://zalo.me/3535048579811648632"
    },
    "items": [
      {
        "id": "faq-01",
        "num": "01",
        "category": "KHỞI ĐẦU DỰ ÁN",
        "question": "Gotek cần những thông tin gì để bắt đầu tư vấn?",
        "answer": "Mục tiêu kinh doanh, nhóm khách hàng mục tiêu, nội dung hiện có, tính năng mong muốn và thời điểm dự kiến ra mắt là những dữ liệu quan trọng nhất để Gotek cùng bạn xác định phạm vi phù hợp trước khi triển khai."
      },
      {
        "id": "faq-02",
        "num": "02",
        "category": "GIAO DIỆN & BẢN QUYỀN",
        "question": "Website sẽ được thiết kế riêng hay sử dụng giao diện có sẵn?",
        "answer": "Gotek ưu tiên thiết kế theo nhận diện và mục tiêu riêng (độc bản 100% trên Figma). Chúng tôi không sử dụng template dựng sẵn rẻ tiền; phương án triển khai luôn được cá nhân hóa và thống nhất sau bước phân tích yêu cầu."
      },
      {
        "id": "faq-03",
        "num": "03",
        "category": "CÔNG NGHỆ NỀN TẢNG",
        "question": "Nên sử dụng WordPress hay phát triển hệ thống riêng?",
        "answer": "WordPress phù hợp với website tin tức, nội dung và blog cần xuất bản nhanh; hệ thống riêng (Next.js, Laravel, Node.js) phù hợp khi quy trình, mô hình dữ liệu hoặc các tích hợp nghiệp vụ có yêu cầu đặc thù chịu tải cao."
      },
      {
        "id": "faq-04",
        "num": "04",
        "category": "SEO & HIỆU NĂNG",
        "question": "Gotek hỗ trợ SEO và hiệu năng tốc độ tải trang như thế nào?",
        "answer": "Cấu trúc nội dung, HTML ngữ nghĩa, tốc độ tải trang Core Web Vitals 95+, hiển thị di động responsive và khả năng quản trị được đội ngũ kỹ sư tính toán tối ưu ngay từ giai đoạn thiết kế kiến trúc đầu tiên."
      },
      {
        "id": "faq-05",
        "num": "05",
        "category": "QUẢN TRỊ NỘI DUNG",
        "question": "Doanh nghiệp có thể tự cập nhật nội dung sau bàn giao không?",
        "answer": "Hoàn toàn có thể. Hệ thống quản trị (CMS) trực quan, bảng điều khiển phân quyền rõ ràng và tài liệu video hướng dẫn sử dụng chi tiết được chuẩn bị chu đáo theo từng phạm vi bàn giao của dự án."
      },
      {
        "id": "faq-06",
        "num": "06",
        "category": "QUY TRÌNH HỢP TÁC",
        "question": "Quy trình tư vấn và triển khai diễn ra như thế nào?",
        "answer": "Gotek làm rõ nhu cầu thực tế, sau đó đề xuất cấu trúc nội dung, phạm vi tính năng, công nghệ và lộ trình Sprint chi tiết trước khi hai bên thống nhất ký kết hợp đồng và bắt tay triển khai."
      },
      {
        "id": "faq-07",
        "num": "07",
        "category": "BẢN QUYỀN SOURCE CODE",
        "question": "Gotek có bàn giao 100% bản quyền mã nguồn (Source Code) không?",
        "answer": "Chắc chắn có. Toàn bộ mã nguồn bản quyền sạch, tài liệu kiến trúc kỹ thuật và toàn quyền quản trị tài nguyên hosting / máy chủ đều được bàn giao trọn vẹn, không ràng buộc phụ thuộc kỹ thuật."
      },
      {
        "id": "faq-08",
        "num": "08",
        "category": "BẢO HÀNH & BẢO TRÌ",
        "question": "Chính sách bảo hành, bảo trì và hỗ trợ kỹ thuật sau bàn giao ra sao?",
        "answer": "Gotek cam kết đồng hành kỹ thuật, hỗ trợ 24/7 xử lý sự cố khẩn cấp, giám sát máy chủ và sao lưu dữ liệu tự động định kỳ, bảo vệ an toàn cho website của bạn trên mọi chặng đường phát triển."
      }
    ]
  }
};

async function fetchJSON(path) {
  // 1. Nếu mở trực tiếp dạng file:/// -> dùng ngay dữ liệu dự phòng để tránh bị trình duyệt chặn CORS
  if (window.location.protocol === 'file:' && FALLBACK_DATA[path]) {
    return FALLBACK_DATA[path];
  }

  // 2. Nếu chạy trên HTTP Server -> nạp trực tiếp từ file JSON
  try {
    const res = await fetch(path + '?_v=' + Date.now());
    if (!res.ok) {
      throw new Error('HTTP ' + res.status + ' khi tải ' + path);
    }
    return await res.json();
  } catch (err) {
    // Fallback nếu server lỗi hoặc offline
    if (FALLBACK_DATA[path]) {
      return FALLBACK_DATA[path];
    }
    console.error('[GotekDataStore] Không thể nạp file "' + path + '":', err);
    return null;
  }
}

window.GotekDataStore = {
  async loadConfig() { return fetchJSON('data/site-config.json'); },
  async loadServices() { return fetchJSON('data/services.json'); },
  async loadProjectsSaas() { return fetchJSON('data/projects-saas.json'); },
  async loadProjectsWeb() { return fetchJSON('data/projects-web.json'); },
  async loadProjectsCustom() { return fetchJSON('data/projects-custom.json'); },
  async loadTeam() { return fetchJSON('data/team.json'); },
  async loadPricing() { return fetchJSON('data/pricing.json'); },
  async loadTestimonials() { return fetchJSON('data/testimonials.json'); },
  async loadEcosystem() { return fetchJSON('data/ecosystem.json'); },
  async loadEcosystemTeams() { return fetchJSON('data/ecosystem-teams.json'); },
  async loadFAQ() { return fetchJSON('data/faq.json'); },

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
