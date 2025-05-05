// Sidebar toggle
const sidebar = document.getElementById('sidebar');
// Remove the 'collapsed' class initially to make sidebar open by default
sidebar.classList.remove('collapsed');

document.getElementById('sidebarToggle').addEventListener('click', () => {
  sidebar.classList.toggle('collapsed');
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

// Improved Carousel functionality
const carousel = document.getElementById('carousel');
const projectsBox = document.getElementById('projects');
const originalCards = [...carousel.children];
const totalCards = originalCards.length; // Should be 4

// Create a full set of clones for true infinite scrolling
for (let i = 0; i < totalCards; i++) {
  const clone = originalCards[i].cloneNode(true);
  carousel.appendChild(clone);
}

// Create carousel controls inside the group-box
const carouselControls = document.createElement('div');
carouselControls.className = 'carousel-controls';
carouselControls.innerHTML = `
  <button id="prevBtn">&#x276E;</button>
  <div class="carousel-indicator" id="carouselIndicator">1 / ${totalCards}</div>
  <button id="pauseBtn">
    <span class="iconify" data-icon="iconoir:play-solid"></span>
  </button>
  <button id="nextBtn">&#x276F;</button>
`;

// Insert controls into the group-box
projectsBox.querySelector('.carousel-wrapper').after(carouselControls);

const indicator = document.getElementById('carouselIndicator');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pauseBtn = document.getElementById('pauseBtn');

let paused = true;
let interval;
let currentIndex = 0;
const cardWidth = originalCards[0].offsetWidth + 20; // Card width + gap

// Position the carousel to show the first card
carousel.scrollLeft = 0;

function updateIndicator() {
  // Always show a number from 1 to totalCards
  let displayIndex = (currentIndex % totalCards) + 1;
  indicator.textContent = `${displayIndex} / ${totalCards}`;
  
  // Apply active styling to all instances of the current card
  const allCards = document.querySelectorAll('.carousel-card');
  allCards.forEach((card, i) => {
    if (i % totalCards === currentIndex % totalCards) {
      card.classList.add('active-card');
    } else {
      card.classList.remove('active-card');
    }
  });
}

function scrollToIndex(index) {
  // Ensure smooth scrolling to the target card
  carousel.scrollTo({
    left: (index % (totalCards * 2)) * cardWidth,
    behavior: 'smooth'
  });
}

function nextSlide() {
  currentIndex = (currentIndex + 1) % (totalCards * 2);
  scrollToIndex(currentIndex);
  updateIndicator();
}

function prevSlide() {
  currentIndex = (currentIndex - 1 + (totalCards * 2)) % (totalCards * 2);
  scrollToIndex(currentIndex);
  updateIndicator();
}

function startAutoLoop() {
  interval = setInterval(nextSlide, 3000);
}

function stopAutoLoop() {
  clearInterval(interval);
}

pauseBtn.addEventListener('click', () => {
  paused = !paused;
  if (paused) {
    stopAutoLoop();
    pauseBtn.innerHTML = '<span class="iconify" data-icon="iconoir:play-solid"></span>';
  } else {
    startAutoLoop();
    pauseBtn.innerHTML = '<span class="iconify" data-icon="material-symbols:pause-rounded"></span>';
  }
});

nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);

// Initialize the carousel
updateIndicator();

// Add scroll snap behavior for better UX
carousel.style.scrollSnapType = 'x mandatory';
document.querySelectorAll('.carousel-card').forEach(card => {
  card.style.scrollSnapAlign = 'center';
});

// Swipe gestures
let startX = 0;
carousel.addEventListener('touchstart', e => startX = e.touches[0].clientX);
carousel.addEventListener('touchend', e => {
  let deltaX = e.changedTouches[0].clientX - startX;
  if (Math.abs(deltaX) > 50) {
    if (deltaX > 0) prevSlide();
    else nextSlide();
  }
});

// Handle window resize to recalculate card width
window.addEventListener('resize', () => {
  const newCardWidth = originalCards[0].offsetWidth + 20;
  if (newCardWidth !== cardWidth && newCardWidth > 20) {
    // Update card width and re-scroll to current index
    cardWidth = newCardWidth;
    scrollToIndex(currentIndex);
  }
});

// Media query handler for responsive sidebar
const mediaQuery = window.matchMedia('(max-width: 768px)');
function handleScreenChange(e) {
  if (e.matches) {
    // On small screens, collapse sidebar
    sidebar.classList.add('collapsed');
  } else {
    // On larger screens, expand sidebar
    sidebar.classList.remove('collapsed');
  }
}
// Run on page load
handleScreenChange(mediaQuery);
// Add listener for screen size changes
mediaQuery.addEventListener('change', handleScreenChange);