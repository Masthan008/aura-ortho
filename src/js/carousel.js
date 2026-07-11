document.addEventListener('DOMContentLoaded', () => {
  initTestimonialCarousel();
});

function initTestimonialCarousel() {
  const slides = document.querySelectorAll('.testimonial-slide');
  const indicatorsContainer = document.getElementById('carousel-indicators');

  if (slides.length === 0) return;

  let currentIndex = 0;
  let timer = null;

  // Render dots
  if (indicatorsContainer) {
    indicatorsContainer.innerHTML = '';
    slides.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.className = `carousel-dot ${idx === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to testimonial slide ${idx + 1}`);
      
      dot.addEventListener('click', () => {
        goToSlide(idx);
        resetTimer();
      });
      
      indicatorsContainer.appendChild(dot);
    });
  }

  function goToSlide(index) {
    slides[currentIndex].classList.remove('active');
    
    // Update index
    currentIndex = index;
    if (currentIndex >= slides.length) currentIndex = 0;
    if (currentIndex < 0) currentIndex = slides.length - 1;
    
    slides[currentIndex].classList.add('active');

    // Update dots
    if (indicatorsContainer) {
      const dots = indicatorsContainer.querySelectorAll('.carousel-dot');
      dots.forEach((dot, idx) => {
        if (idx === currentIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function resetTimer() {
    if (timer) clearInterval(timer);
    timer = setInterval(nextSlide, 5000);
  }

  // Start rotation
  resetTimer();
}
