// Sidebar toggle
const sidebar = document.getElementById('sidebar');
const contentArea = document.querySelector('.content-area');

// Remove the 'collapsed' class initially to make sidebar open by default on desktop
sidebar.classList.remove('collapsed');

document.getElementById('sidebarToggle').addEventListener('click', () => {
  sidebar.classList.toggle('collapsed');
  
  // Update content area margin when sidebar is toggled
  if (sidebar.classList.contains('collapsed')) {
    contentArea.style.marginLeft = '60px'; // Smaller margin when collapsed
  } else {
    contentArea.style.marginLeft = '240px'; // Normal margin when expanded
  }
  
  // On mobile, don't add margin
  if (window.innerWidth <= 768) {
    contentArea.style.marginLeft = '0';
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

// Media query handler for responsive sidebar - make it collapsed on small screens
const mediaQuery = window.matchMedia('(max-width: 768px)');
function handleScreenChange(e) {
  if (e.matches) {
    // On small screens, collapse sidebar to just the button
    sidebar.classList.add('collapsed');
    contentArea.style.marginLeft = '0';
  } else {
    // On larger screens, expand sidebar
    sidebar.classList.remove('collapsed');
    contentArea.style.marginLeft = '240px';
  }
}
// Run on page load
handleScreenChange(mediaQuery);
// Add listener for screen size changes
mediaQuery.addEventListener('change', handleScreenChange);

// Calculate and set minimum width for project cards based on screen size
function setProjectCardMinWidth() {
  const projectContainer = document.querySelector('.project-container');
  if (!projectContainer) return;
  
  const containerWidth = projectContainer.offsetWidth;
  const cards = document.querySelectorAll('.project-card');
  if (!cards.length) return;
  
  // Set minimum width to ensure at least one card is always visible
  // We'll make sure cards are at least 75% of the container width on small screens,
  // and smaller on larger screens
  let minWidth = Math.min(300, containerWidth * 0.75);
  
  // Apply minimum width to all cards
  cards.forEach(card => {
    card.style.minWidth = `${minWidth}px`;
    card.style.width = `${minWidth}px`;
  });
}

// Run on page load and when window is resized
window.addEventListener('load', setProjectCardMinWidth);
window.addEventListener('resize', setProjectCardMinWidth);