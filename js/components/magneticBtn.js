/**
 * GOTEK MAGNETIC BUTTON EFFECT
 * Kế thừa từ landing_page_gotek: Hiệu ứng nút hút theo trỏ chuột mượt mà bằng GSAP
 */

export function initMagneticButtons() {
    const magneticBtns = document.querySelectorAll('.magnetic-btn');

    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            if (window.gsap) {
                gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.4, ease: "power2.out" });
            }
        });

        btn.addEventListener('mouseleave', () => {
            if (window.gsap) {
                gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.3)" });
            } else {
                btn.style.transform = 'translate(0, 0)';
            }
        });
    });
}
