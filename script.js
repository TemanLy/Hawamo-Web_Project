/* ===========================
   HAWAMO CAFE — script.js
   Navbar, filters, modal, form validation, scroll reveal
   =========================== */

// ===========================
// 1. NAVBAR — Mobile toggle & active link
// ===========================
(function initNavbar() {
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  // Toggle mobile menu open/closed
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      // Animate hamburger bars into X
      const bars = toggle.querySelectorAll('span');
      const isOpen = navLinks.classList.contains('open');
      bars[0].style.transform = isOpen ? 'translateY(7px) rotate(45deg)' : '';
      bars[1].style.opacity   = isOpen ? '0' : '1';
      bars[2].style.transform = isOpen ? 'translateY(-7px) rotate(-45deg)' : '';
    });

    // Close menu when a link is clicked (mobile)
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  // Highlight the active page link
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPath) link.classList.add('active');
  });
})();


// ===========================
// 2. SCROLL REVEAL — Fade-in sections on scroll
// ===========================
(function initScrollReveal() {
  // Find all elements with .reveal class
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // only animate once
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => observer.observe(el));
})();


// ===========================
// 3. MENU FILTER — menu.html
// ===========================
(function initMenuFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const menuCards  = document.querySelectorAll('.menu-card[data-category]');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const selected = btn.dataset.filter; // e.g. "coffee", "all"

      menuCards.forEach(card => {
        const match = selected === 'all' || card.dataset.category === selected;
        // Using hidden attribute for clean show/hide
        if (match) {
          card.removeAttribute('hidden');
        } else {
          card.setAttribute('hidden', '');
        }
      });
    });
  });
})();

// ===========================
// 5. RESERVATION FORM — reservations.html
// ===========================
(function initReservationForm() {
  const form    = document.getElementById('reservationForm');
  const success = document.getElementById('successMessage');
  if (!form) return;

  // Helper: mark a field as having an error
  const setError = (input, msg) => {
    const group = input.closest('.form-group');
    group.classList.add('has-error');
    group.querySelector('.form-error').textContent = msg;
  };

  // Helper: clear error state
  const clearError = input => {
    input.closest('.form-group').classList.remove('has-error');
  };

  // Clear error on user input
  form.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('input', () => clearError(input));
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    const name    = form.querySelector('#name');
    const phone   = form.querySelector('#phone');
    const date    = form.querySelector('#date');
    const time    = form.querySelector('#time');
    const guests  = form.querySelector('#guests');

    // Reset previous errors
    [name, phone, date, time, guests].forEach(clearError);

    // --- Validate each field ---
    if (!name.value.trim()) {
      setError(name, 'Please enter your full name.'); valid = false;
    }

    if (!phone.value.trim()) {
      setError(phone, 'Please enter your WhatsApp number.'); valid = false;
    } else if (!/^[0-9+\s\-]{6,}$/.test(phone.value.trim())) {
      setError(phone, 'Please enter a valid phone number.'); valid = false;
    }

    if (!date.value) {
      setError(date, 'Please select a reservation date.'); valid = false;
    } else {
      // Date must not be in the past
      const today = new Date(); today.setHours(0, 0, 0, 0);
      if (new Date(date.value) < today) {
        setError(date, 'Please select a future date.'); valid = false;
      }
    }

    if (!time.value) {
      setError(time, 'Please select a reservation time.'); valid = false;
    }

    if (!guests.value || parseInt(guests.value) < 1) {
      setError(guests, 'Minimum 1 person required.'); valid = false;
    }

    if (!valid) return;

    // --- Success ---
    const guestName = name.value.trim().split(' ')[0]; // first name only
    document.getElementById('successName').textContent = name.value.trim();

    form.style.display = 'none';
    success.classList.add('show');
    success.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
})();


// ===========================
// 6. SET MIN DATE on reservation form (today)
// ===========================
(function setMinDate() {
  const dateInput = document.getElementById('date');
  if (!dateInput) return;
  const today = new Date().toISOString().split('T')[0];
  dateInput.setAttribute('min', today);
})();
