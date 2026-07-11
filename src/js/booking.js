// Data structures for Doctors & Specialties
const doctorData = [
  { id: 'raju', name: 'Dr. Raju Bollabathini', specialty: 'joint-replacement', image: '/src/assets/dr-raju-bollabathini.png', bio: 'Chief Orthopedic Surgeon. Specialist in hip & knee replacements, trauma care, and pediatric consulting.' },
  { id: 'pediatric-team', name: 'Pediatric & NICU ICU Team', specialty: 'pediatric', image: '/src/assets/dr-elena-rostova.png', bio: 'Critical Care Specialists. Providing 24/7 emergency support for newborn care, low birth weight, and NICU.' },
  { id: 'physio-team', name: 'Physiotherapy & Rehab Team', specialty: 'physiotherapy', image: '/src/assets/dr-sarah-jenkins.png', bio: 'Rehab & Exercise Specialists. Guiding patients through post-operative recovery and electrotherapy.' }
];

document.addEventListener('DOMContentLoaded', () => {
  // Wizard State
  let currentStep = 1;
  const bookingState = {
    service: '',
    serviceName: '',
    doctorId: '',
    doctorName: '',
    date: null, // Date object
    timeSlot: '',
    patientName: '',
    patientPhone: '',
    patientEmail: '',
    patientNotes: ''
  };

  // DOM Elements
  const steps = document.querySelectorAll('.booking-step-panel');
  const indicators = document.querySelectorAll('.booking-step-indicator');
  const prevBtn = document.getElementById('wizard-prev-btn');
  const nextBtn = document.getElementById('wizard-next-btn');

  // Step 1: Services selection
  const serviceCards = document.querySelectorAll('.service-select-card');
  serviceCards.forEach(card => {
    card.addEventListener('click', () => {
      serviceCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      bookingState.service = card.getAttribute('data-service');
      bookingState.serviceName = card.querySelector('h4').textContent;
      validateCurrentStep();
    });
  });

  // Step 2: Doctor selection dynamic load
  function loadDoctorsForService() {
    const doctorContainer = document.getElementById('doctors-selection-grid');
    if (!doctorContainer) return;
    doctorContainer.innerHTML = ''; // Clear

    const selectedService = bookingState.service;
    
    // Filter doctors by selected service specialty
    const filteredDoctors = doctorData.filter(doc => {
      if (selectedService === 'physiotherapy' || selectedService === 'rehabilitation') {
        return doc.id === 'physio-team';
      }
      if (['general-pediatrics', 'neonatology', 'nicu', 'picu', 'vaccinations', 'child-development', 'ped-neurology', 'ped-pulmonology', 'ped-gastro', 'pediatric'].includes(selectedService)) {
        return doc.id === 'pediatric-team' || doc.id === 'raju';
      }
      // Otherwise, Dr. Raju handles all orthopedic specialties
      return doc.id === 'raju';
    });
    
    // Fallback: If no specialist specifically matching (or sports), show sports/joint doctors
    const doctorsToShow = filteredDoctors.length > 0 ? filteredDoctors : doctorData.slice(0, 3);

    doctorsToShow.forEach(doc => {
      const card = document.createElement('div');
      card.className = 'glass-card select-card doctor-select-card';
      card.setAttribute('data-doc-id', doc.id);
      card.setAttribute('data-doc-name', doc.name);
      
      card.innerHTML = `
        <div class="doctor-avatar-container" style="width:80px; height:80px; margin-bottom:12px;">
          <img src="${doc.image}" alt="${doc.name}" class="doctor-avatar">
        </div>
        <h4>${doc.name}</h4>
        <p style="font-size:0.8rem; margin-bottom:0;">${doc.bio}</p>
      `;

      card.addEventListener('click', () => {
        const docCards = doctorContainer.querySelectorAll('.doctor-select-card');
        docCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        bookingState.doctorId = doc.id;
        bookingState.doctorName = doc.name;
        validateCurrentStep();
      });

      doctorContainer.appendChild(card);
    });
  }

  // Step 3: Calendar Custom UI logic
  let calendarDate = new Date(); // Month showing in calendar
  
  function initCustomCalendar() {
    const calendarMonthTitle = document.getElementById('calendar-month-title');
    const calendarDaysGrid = document.getElementById('calendar-days-grid');
    const prevMonthBtn = document.getElementById('calendar-prev-month');
    const nextMonthBtn = document.getElementById('calendar-next-month');
    const slotsGrid = document.getElementById('time-slots-grid');

    if (!calendarMonthTitle || !calendarDaysGrid || !slotsGrid) return;

    // Render Months & Years
    function renderCalendar() {
      calendarDaysGrid.innerHTML = ''; // Clear
      
      const year = calendarDate.getFullYear();
      const month = calendarDate.getMonth();
      
      const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      
      calendarMonthTitle.textContent = `${monthNames[month]} ${year}`;

      // First day of current month
      const firstDayIndex = new Date(year, month, 1).getDay();
      // Total days of current month
      const totalDays = new Date(year, month + 1, 0).getDate();
      
      // Pad empty slots before start date
      for (let i = 0; i < firstDayIndex; i++) {
        const pad = document.createElement('div');
        calendarDaysGrid.appendChild(pad);
      }

      const today = new Date();

      // Render days
      for (let day = 1; day <= totalDays; day++) {
        const button = document.createElement('button');
        button.className = 'calendar-day';
        button.textContent = day;

        const currentBtnDate = new Date(year, month, day);
        
        // Mark past dates and Sundays as disabled
        if (currentBtnDate < new Date(today.getFullYear(), today.getMonth(), today.getDate()) || currentBtnDate.getDay() === 0) {
          button.disabled = true;
        }

        // Highlight current today
        if (today.getDate() === day && today.getMonth() === month && today.getFullYear() === year) {
          button.classList.add('today');
        }

        // Highlight selected date
        if (bookingState.date && 
            bookingState.date.getDate() === day && 
            bookingState.date.getMonth() === month && 
            bookingState.date.getFullYear() === year) {
          button.classList.add('active');
        }

        button.addEventListener('click', () => {
          const dayBtns = calendarDaysGrid.querySelectorAll('.calendar-day');
          dayBtns.forEach(b => b.classList.remove('active'));
          button.classList.add('active');
          
          bookingState.date = currentBtnDate;
          bookingState.timeSlot = ''; // Reset selected slot
          
          // Refresh time slots grid
          renderTimeSlots();
          validateCurrentStep();
        });

        calendarDaysGrid.appendChild(button);
      }
    }

    // Prev / Next Month
    if (prevMonthBtn && nextMonthBtn) {
      prevMonthBtn.addEventListener('click', () => {
        calendarDate.setMonth(calendarDate.getMonth() - 1);
        renderCalendar();
      });

      nextMonthBtn.addEventListener('click', () => {
        calendarDate.setMonth(calendarDate.getMonth() + 1);
        renderCalendar();
      });
    }

    // Render standard time slots
    function renderTimeSlots() {
      slotsGrid.innerHTML = '';
      if (!bookingState.date) {
        slotsGrid.innerHTML = '<p style="grid-column: span 2; text-align:center; color:var(--text-muted); font-size:0.85rem;">Please select a date first.</p>';
        return;
      }

      const slots = ["09:00 AM", "10:30 AM", "11:00 AM", "01:30 PM", "02:30 PM", "04:00 PM"];
      
      slots.forEach(slot => {
        const slotDiv = document.createElement('div');
        slotDiv.className = 'time-slot';
        slotDiv.textContent = slot;

        if (bookingState.timeSlot === slot) {
          slotDiv.classList.add('selected');
        }

        slotDiv.addEventListener('click', () => {
          const allSlots = slotsGrid.querySelectorAll('.time-slot');
          allSlots.forEach(s => s.classList.remove('selected'));
          slotDiv.classList.add('selected');
          
          bookingState.timeSlot = slot;
          validateCurrentStep();
        });

        slotsGrid.appendChild(slotDiv);
      });
    }

    renderCalendar();
    renderTimeSlots();
  }

  // Step 4 Details validation listener
  const detailsFormInputs = document.querySelectorAll('.details-input');
  detailsFormInputs.forEach(input => {
    input.addEventListener('input', () => {
      bookingState.patientName = document.getElementById('patient-name').value.trim();
      bookingState.patientPhone = document.getElementById('patient-phone').value.trim();
      bookingState.patientEmail = document.getElementById('patient-email').value.trim();
      bookingState.patientNotes = document.getElementById('patient-notes').value.trim();
      validateCurrentStep();
    });
  });

  // Step Validation logic
  function validateCurrentStep() {
    let isValid = false;

    if (currentStep === 1) {
      isValid = bookingState.service !== '';
    } else if (currentStep === 2) {
      isValid = bookingState.doctorId !== '';
    } else if (currentStep === 3) {
      isValid = bookingState.date !== null && bookingState.timeSlot !== '';
    } else if (currentStep === 4) {
      isValid = bookingState.patientName.length > 2 && 
                bookingState.patientPhone.length > 5 && 
                bookingState.patientEmail.includes('@');
    }

    nextBtn.disabled = !isValid;
  }

  // Render Confirmation Details
  function renderConfirmationSummary() {
    document.getElementById('summary-service').textContent = bookingState.serviceName;
    document.getElementById('summary-doctor').textContent = bookingState.doctorName;
    
    if (bookingState.date) {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      document.getElementById('summary-date').textContent = bookingState.date.toLocaleDateString(undefined, options);
    }
    
    document.getElementById('summary-time').textContent = bookingState.timeSlot;
    document.getElementById('summary-patient').textContent = bookingState.patientName;
  }

  // Navigation Logic
  function updateWizard() {
    // Hide all steps, show current
    steps.forEach((step, idx) => {
      if (idx + 1 === currentStep) {
        step.classList.add('active');
      } else {
        step.classList.remove('active');
      }
    });

    // Update Progress indicators
    indicators.forEach((indicator, idx) => {
      if (idx + 1 < currentStep) {
        indicator.classList.remove('active');
        indicator.classList.add('completed');
      } else if (idx + 1 === currentStep) {
        indicator.classList.remove('completed');
        indicator.classList.add('active');
      } else {
        indicator.classList.remove('active', 'completed');
      }
    });

    // Hide/show buttons based on step
    if (currentStep === 1) {
      prevBtn.style.visibility = 'hidden';
    } else if (currentStep === 5) {
      // Step 5 is success, hide both nav buttons
      prevBtn.style.display = 'none';
      nextBtn.style.display = 'none';
      renderConfirmationSummary();
    } else {
      prevBtn.style.visibility = 'visible';
      prevBtn.style.display = 'inline-block';
      nextBtn.style.display = 'inline-block';
    }

    // Change next button text on Step 4
    if (currentStep === 4) {
      nextBtn.textContent = 'Confirm Appointment';
    } else {
      nextBtn.textContent = 'Next Step';
    }

    validateCurrentStep();
  }

  // Button Listeners
  if (nextBtn && prevBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentStep === 1) {
        loadDoctorsForService();
      } else if (currentStep === 2) {
        initCustomCalendar();
      }
      
      currentStep++;
      updateWizard();
    });

    prevBtn.addEventListener('click', () => {
      currentStep--;
      updateWizard();
    });
  }

  // Initialize
  if (nextBtn && prevBtn) {
    updateWizard();
  }
});
