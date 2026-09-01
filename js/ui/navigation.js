/** Sidebar section navigation */

const sections = document.querySelectorAll('.lab-section');
const navBtns = document.querySelectorAll('.nav-btn');

export function initNavigation() {
  navBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.section;
      navBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      sections.forEach((sec) => {
        sec.classList.toggle('hidden', sec.id !== `sec-${id}`);
      });
    });
  });
}
