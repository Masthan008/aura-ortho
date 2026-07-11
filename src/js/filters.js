document.addEventListener('DOMContentLoaded', () => {
  // 1. Specialty filter (Doctors page)
  initSpecialtyFilter();

  // 2. Doctor full-screen modals
  initDoctorModals();

  // 3. Condition Library Search & Body Part Tabs (Conditions page)
  initConditionLibrary();

  // 4. Download progress simulation
  initDownloadProgress();
});

// Specialty Filtering on doctors.html
function initSpecialtyFilter() {
  const filterBtns = document.querySelectorAll('.doctor-filter-btn');
  const docCards = document.querySelectorAll('.doctor-card-wrapper');

  if (filterBtns.length > 0 && docCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Toggle Active Class
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const category = btn.getAttribute('data-filter');

        docCards.forEach(card => {
          const specialty = card.getAttribute('data-specialty');
          
          if (category === 'all' || specialty === category) {
            card.style.display = 'block';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            }, 50);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }
}

// Doctor Details modal triggers on doctors.html
function initDoctorModals() {
  const docCards = document.querySelectorAll('.doctor-card-trigger');
  const modal = document.getElementById('doctor-modal');
  const closeBtn = document.getElementById('doctor-modal-close');

  if (docCards.length > 0 && modal) {
    docCards.forEach(card => {
      card.addEventListener('click', () => {
        // Gather details from attributes
        const name = card.getAttribute('data-name');
        const spec = card.getAttribute('data-spec');
        const img = card.getAttribute('data-img');
        const bio = card.getAttribute('data-bio');
        const edu = card.getAttribute('data-edu').split(';');
        const certs = card.getAttribute('data-certs').split(';');

        // Set content
        document.getElementById('modal-name').textContent = name;
        document.getElementById('modal-spec').textContent = spec;
        document.getElementById('modal-img').setAttribute('src', img);
        document.getElementById('modal-bio').textContent = bio;

        const eduList = document.getElementById('modal-education');
        const certList = document.getElementById('modal-certs');

        eduList.innerHTML = '';
        certList.innerHTML = '';

        edu.forEach(item => {
          if (!item.trim()) return;
          const li = document.createElement('li');
          li.innerHTML = `<i data-lucide="graduation-cap"></i> <span>${item.trim()}</span>`;
          eduList.appendChild(li);
        });

        certs.forEach(item => {
          if (!item.trim()) return;
          const li = document.createElement('li');
          li.innerHTML = `<i data-lucide="award"></i> <span>${item.trim()}</span>`;
          certList.appendChild(li);
        });

        // Recreate icons in modal
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
          window.lucide.createIcons({
            attrs: {
              class: 'lucide-icon'
            }
          });
        }

        // Show Modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    const hideModal = () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    };

    if (closeBtn) closeBtn.addEventListener('click', hideModal);
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        hideModal();
      }
    });
  }
}

// Condition Library filter by search text + body part tabs on conditions.html
function initConditionLibrary() {
  const searchInput = document.getElementById('condition-search');
  const partTabs = document.querySelectorAll('.part-filter-btn');
  const conditionCards = document.querySelectorAll('.condition-card-wrapper');

  if (conditionCards.length > 0) {
    const filterConditions = () => {
      const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
      
      let activeTab = 'all';
      partTabs.forEach(tab => {
        if (tab.classList.contains('active')) {
          activeTab = tab.getAttribute('data-filter');
        }
      });

      conditionCards.forEach(card => {
        const name = card.getAttribute('data-name').toLowerCase();
        const parts = card.getAttribute('data-parts').split(',');
        
        const matchQuery = name.includes(query);
        const matchTab = activeTab === 'all' || parts.includes(activeTab);

        if (matchQuery && matchTab) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    };

    if (searchInput) {
      searchInput.addEventListener('input', filterConditions);
    }

    if (partTabs.length > 0) {
      partTabs.forEach(tab => {
        tab.addEventListener('click', () => {
          partTabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          filterConditions();
        });
      });
    }
  }
}

// Download Button simulation showing a filling progress bar on conditions.html
function initDownloadProgress() {
  const downloadBtns = document.querySelectorAll('.download-card-btn');

  downloadBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      
      const card = btn.closest('.download-card');
      if (!card) return;

      const progressBar = card.querySelector('.download-progress');
      if (!progressBar) return;

      // Prevent duplicate download clicks while running
      if (btn.getAttribute('data-downloading') === 'true') return;
      btn.setAttribute('data-downloading', 'true');

      let progress = 0;
      btn.style.opacity = '0.7';
      btn.innerHTML = `<span style="font-size:0.75rem; font-weight:700;">...</span>`;

      const interval = setInterval(() => {
        progress += 4;
        progressBar.style.width = `${progress}%`;

        if (progress >= 100) {
          clearInterval(interval);
          btn.innerHTML = `<i data-lucide="check" class="lucide-icon"></i>`;
          btn.style.background = '#22C55E';
          btn.style.color = 'white';
          btn.style.borderColor = '#22C55E';
          btn.style.opacity = '1';
          btn.removeAttribute('data-downloading');

          // Re-trigger lucide icons
          if (window.lucide) {
            window.lucide.createIcons();
          }

          // Trigger dummy download file link
          setTimeout(() => {
            alert('Your Patient Care Guide has been prepared and downloaded successfully.');
            // Reset after 3s
            setTimeout(() => {
              progressBar.style.width = '0';
              btn.innerHTML = `<i data-lucide="download" class="lucide-icon"></i>`;
              btn.style.background = '';
              btn.style.color = '';
              btn.style.borderColor = '';
              if (window.lucide) window.lucide.createIcons();
            }, 3000);
          }, 200);
        }
      }, 50);
    });
  });
}
