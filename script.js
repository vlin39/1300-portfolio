// Sidebar toggle
const sidebar = document.getElementById('sidebar');
const contentArea = document.querySelector('.content-area');

// sidebar open by default on desktop
sidebar.classList.remove('collapsed');


// Toggle button logic
document.getElementById('sidebarToggle').addEventListener('click', () => {
  sidebar.classList.toggle('collapsed');

  if (sidebar.classList.contains('collapsed')) {
    contentArea.style.marginLeft = '70px';
    contentArea.style.width = 'calc(100% - 100px)';
  } else {
    contentArea.style.marginLeft = '250px';
    contentArea.style.width = 'calc(100% - 280px)';
  }

  // On mobile, override to no margin and full width
  if (window.innerWidth <= 768) {
    contentArea.style.marginLeft = '0';
    contentArea.style.width = '100%';
  }
});

// Active link highlight
const sections = document.querySelectorAll('.section-anchor');
const navLinks = document.querySelectorAll('.sidebar a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 90;
    if (scrollY >= sectionTop) current = section.id;
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
  });
});

// Media query handler for responsive sidebar
const mediaQuery = window.matchMedia('(max-width: 768px)');
function handleScreenChange(e) {
  if (e.matches) {
    sidebar.classList.add('collapsed');
    contentArea.style.marginLeft = '0';
    contentArea.style.width = '100%';
  } else {
    sidebar.classList.remove('collapsed');
    contentArea.style.marginLeft = '180px';
    contentArea.style.width = 'calc(100% - 180px)';
  }
}
// Run on page load
handleScreenChange(mediaQuery);
// Listen for screen size changes
mediaQuery.addEventListener('change', handleScreenChange);

// Project card sizing
function setProjectCardMinWidth() {
  const projectContainer = document.querySelector('.project-container');
  if (!projectContainer) return;

  const containerWidth = projectContainer.offsetWidth;
  const cards = document.querySelectorAll('.project-card');
  if (!cards.length) return;

  let minWidth = Math.min(300, containerWidth * 0.75);

  cards.forEach(card => {
    card.style.minWidth = `${minWidth}px`;
    card.style.width = `${minWidth}px`;
  });
}

// Run on load and resize
window.addEventListener('load', setProjectCardMinWidth);
window.addEventListener('resize', setProjectCardMinWidth);

if (sidebar.classList.contains('collapsed')) {
  contentArea.style.marginLeft = '70px';
  contentArea.style.width = 'calc(100% - 100px)';
} else {
  contentArea.style.marginLeft = '250px';
  contentArea.style.width = 'calc(100% - 280px)';
}

if (window.innerWidth <= 768) {
  contentArea.style.marginLeft = '0';
  contentArea.style.width = '100%';
}
