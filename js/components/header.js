/**
 * GOTEK HEADER COMPONENT
 * Kế thừa chuẩn xác từ landing_page_gotek:
 * 1. Smart Scroll: Ẩn thanh header khi cuộn xuống (>100px), hiển thị lại ngay khi cuộn lên.
 * 2. Mobile Menu Toggle: Hoạt ảnh nút hamburger 3 nét và Overlay mở rộng với GSAP animation.
 */

export function initHeaderLogic() {
    const header = document.getElementById('main-header');
    if (!header) return;
    
    // 1. Smart Scroll: Hide on scroll down, Show on scroll up
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            header.classList.add('-translate-y-[150%]');
        } else {
            header.classList.remove('-translate-y-[150%]');
        }
        
        lastScrollY = currentScrollY;
    });

    // 2. Mobile Menu Toggle
    const menuBtn = document.getElementById('mobile-menu-btn');
    const closeBtn = document.getElementById('mobile-menu-close');
    const overlay = document.getElementById('mobile-menu-overlay');
    const drawer = overlay ? overlay.querySelector('.mobile-menu-drawer') : null;
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');
    let isMenuOpen = false;

    const toggleMenu = () => {
        isMenuOpen = !isMenuOpen;
        const spans = menuBtn ? menuBtn.querySelectorAll('span') : [];
        
        if (isMenuOpen) {
            if (spans.length >= 3) {
                spans[0].classList.add('translate-y-2', 'rotate-45');
                spans[1].classList.add('opacity-0');
                spans[2].classList.add('-translate-y-2', '-rotate-45');
            }
            
            overlay.classList.remove('invisible');
            overlay.classList.add('is-active');

            if (window.gsap) {
                gsap.to(overlay, { opacity: 1, duration: 0.25 });
                if (drawer) {
                    gsap.fromTo(drawer, 
                        { x: '100%' },
                        { x: '0%', duration: 0.35, ease: 'power3.out' }
                    );
                }
                gsap.fromTo('.mobile-nav-links a', 
                    { x: 25, opacity: 0 }, 
                    { x: 0, opacity: 1, duration: 0.25, stagger: 0.04, ease: 'power2.out', delay: 0.08 }
                );
            }
        } else {
            if (spans.length >= 3) {
                spans[0].classList.remove('translate-y-2', 'rotate-45');
                spans[1].classList.remove('opacity-0');
                spans[2].classList.remove('-translate-y-2', '-rotate-45');
            }
            
            if (window.gsap) {
                if (drawer) {
                    gsap.to(drawer, { 
                        x: '100%', 
                        duration: 0.25, 
                        ease: 'power2.in' 
                    });
                }
                gsap.to(overlay, { 
                    opacity: 0, 
                    duration: 0.25, 
                    ease: 'power2.in',
                    onComplete: () => {
                        overlay.classList.add('invisible');
                        overlay.classList.remove('is-active');
                    }
                });
            } else {
                overlay.classList.add('invisible');
                overlay.classList.remove('is-active');
            }
        }
    };

    if (menuBtn) {
        menuBtn.addEventListener('click', toggleMenu);
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', toggleMenu);
    }

    // Đóng khi click ngoài drawer (click vào lớp nền mờ)
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay && isMenuOpen) {
                toggleMenu();
            }
        });
    }
    
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (isMenuOpen) toggleMenu();
        });
    });

    // 3. Language switcher visual toggle (Đồng bộ cả Header Desktop và Mobile Drawer)
    const allLangBtns = document.querySelectorAll('.lang-switcher button, .mobile-lang-switcher button');
    allLangBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const langText = btn.textContent.trim().toUpperCase();
            const isVi = (langText === 'VI' || langText === 'VN');

            allLangBtns.forEach(b => {
                const bText = b.textContent.trim().toUpperCase();
                const bIsVi = (bText === 'VI' || bText === 'VN');
                const shouldBeActive = (isVi === bIsVi);

                if (shouldBeActive) {
                    b.classList.add('active');
                    if (b.classList.contains('lang-btn')) {
                        b.classList.add('bg-[#0055FF]', 'text-white');
                        b.classList.remove('text-navy/70');
                    } else {
                        b.classList.add('text-navy');
                    }
                } else {
                    b.classList.remove('active');
                    if (b.classList.contains('lang-btn')) {
                        b.classList.remove('bg-[#0055FF]', 'text-white');
                        b.classList.add('text-navy/70');
                    } else {
                        b.classList.remove('text-navy');
                    }
                }
            });
        });
    });
}
