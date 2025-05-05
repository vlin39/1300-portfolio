// Sidebar toggle
const sidebar = document.getElementById('sidebar');
// Remove the 'collapsed' class initially to make sidebar open by default on desktop
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

// Create multiple sets of clones for truly infinite scrolling
// We create 3 copies total (original + 2 clone sets) for a total of 12 cards
for (let j = 0; j < 2; j++) {
  for (let i = 0; i < totalCards; i++) {
    const clone = originalCards[i].cloneNode(true);
    carousel.appendChild(clone);
  }
}

// Create carousel controls inside the group-box
const carouselControls = document.createElement('div');
carouselControls.className = 'carousel-controls';
carouselControls.innerHTML = `
  <button id="prevBtn">&#x276E;</button>
  <div class="carousel-indicator" id="carouselIndicator">1 / ${totalCards}</div>
  <button id="pauseBtn">
    <span class="iconify" data-icon="material-symbols:pause-rounded"></span>
  </button>
  <button id="nextBtn">&#x276F;</button>
`;

// Insert controls into the group-box
projectsBox.querySelector('.carousel-wrapper').after(carouselControls);

const indicator = document.getElementById('carouselIndicator');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pauseBtn = document.getElementById('pauseBtn');

// Start with autoplay enabled
let paused = false;
let interval;
let currentIndex = 0;
let cardWidth = originalCards[0].offsetWidth + 20; // Card width + gap

// Position the carousel to show the first card
carousel.scrollLeft = 0;

function updateIndicator() {
  // Always show a number from 1 to totalCards
  let displayIndex = (currentIndex % totalCards) + 1;
  indicator.textContent = `${displayIndex} / ${totalCards}`;
  
  // Apply active styling to cards only when not paused
  const allCards = document.querySelectorAll('.carousel-card');
  allCards.forEach((card, i) => {
    // First remove any existing active class
    card.classList.remove('active-card');
    
    // Only add active class to current card if carousel is playing
    if (!paused && i % totalCards === currentIndex % totalCards) {
      card.classList.add('active-card');
    }
  });
  
  // Update carousel and cards based on play state
  if (paused) {
    // Remove special styling when paused - just show normal cards
    carousel.classList.add('paused');
    document.querySelectorAll('.carousel-card').forEach(card => {
      card.style.opacity = '1';
      card.style.transform = 'scale(1)';
    });
  } else {
    // Restore dynamic styling when playing
    carousel.classList.remove('paused');
    document.querySelectorAll('.carousel-card').forEach((card, i) => {
      if (i % totalCards === currentIndex % totalCards) {
        card.style.opacity = '1';
        card.style.transform = 'scale(1.05)';
      } else {
        card.style.opacity = '0.7';
        card.style.transform = 'scale(1)';
      }
    });
  }
}

function scrollToIndex(index) {
  // Ensure smooth scrolling to the target card
  const scrollPosition = (index % (totalCards * 3)) * cardWidth;
  
  // Check if we're near the end of our cloned cards
  if (index >= totalCards * 2) {
    // First scroll with animation
    carousel.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    });
    
    // Then after animation completes, instantly jump back to equivalent position in first set
    setTimeout(() => {
      const resetIndex = index % totalCards;
      carousel.scrollTo({
        left: resetIndex * cardWidth,
        behavior: 'auto'
      });
      currentIndex = resetIndex;
    }, 500);
  } else {
    // Normal scroll within range
    carousel.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    });
  }
}

function nextSlide() {
  currentIndex = (currentIndex + 1) % (totalCards * 3);
  scrollToIndex(currentIndex);
  updateIndicator();
}

function prevSlide() {
  currentIndex = (currentIndex - 1 + (totalCards * 3)) % (totalCards * 3);
  scrollToIndex(currentIndex);
  updateIndicator();
}

function startAutoLoop() {
  // Clear any existing interval first
  if (interval) clearInterval(interval);
  interval = setInterval(nextSlide, 3000);
}

function stopAutoLoop() {
  clearInterval(interval);
  interval = null;
}

pauseBtn.addEventListener('click', () => {
  paused = !paused;
  if (paused) {
    stopAutoLoop();
    pauseBtn.innerHTML = '<span class="iconify" data-icon="iconoir:play-solid"></span>';
    // Just show first 4 cards when paused
    resetToOriginalCards();
  } else {
    startAutoLoop();
    pauseBtn.innerHTML = '<span class="iconify" data-icon="material-symbols:pause-rounded"></span>';
  }
  updateIndicator();
});

// Function to reset to just showing the original 4 cards when paused
function resetToOriginalCards() {
  // Calculate which of the original cards should be shown
  const baseIndex = currentIndex % totalCards;
  // Scroll to that position in the original set
  carousel.scrollTo({
    left: baseIndex * cardWidth,
    behavior: 'smooth'
  });
  currentIndex = baseIndex;
}

nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);

// Initialize the carousel
updateIndicator();
// Start autoplay by default
startAutoLoop();

// Add scroll snap behavior for better UX
carousel.style.scrollSnapType = 'x mandatory';
document.querySelectorAll('.carousel-card').forEach(card => {
  card.style.scrollSnapAlign = 'center';
});

// Add listener for manual scrolling
let isScrolling;
carousel.addEventListener('scroll', () => {
  // Clear our timeout throughout the scroll
  window.clearTimeout(isScrolling);

  // Set a timeout to run after scrolling ends
  isScrolling = setTimeout(() => {
    // Calculate which card is most visible
    const scrollPos = carousel.scrollLeft;
    const closestIndex = Math.round(scrollPos / cardWidth) % totalCards;
    
    // Only update if we've actually moved to a different card
    if (closestIndex !== currentIndex % totalCards) {
      currentIndex = closestIndex;
      updateIndicator();
    }
  }, 100);
});

// Swipe gestures
let startX = 0;
carousel.addEventListener('touchstart', e => {
  startX = e.touches[0].clientX;
  // Pause autoplay when user interacts
  if (!paused) {
    stopAutoLoop();
  }
});

carousel.addEventListener('touchend', e => {
  let deltaX = e.changedTouches[0].clientX - startX;
  if (Math.abs(deltaX) > 50) {
    if (deltaX > 0) prevSlide();
    else nextSlide();
  }
  // Resume autoplay if it was playing
  if (!paused) {
    startAutoLoop();
  }
});

// Handle window resize to recalculate card width
window.addEventListener('resize', () => {
  // Need to wait for the resize to finish to get accurate measurements
  setTimeout(() => {
    // Recalculate card width
    const newCardWidth = originalCards[0].offsetWidth + 20;
    if (newCardWidth !== cardWidth && newCardWidth > 20) {
      cardWidth = newCardWidth;
      scrollToIndex(currentIndex);
    }
  }, 100);
});

// Media query handler for responsive sidebar - make it collapsed on small screens
const mediaQuery = window.matchMedia('(max-width: 768px)');
function handleScreenChange(e) {
  if (e.matches) {
    // On small screens, collapse sidebar to just the button
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