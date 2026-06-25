document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // THEME MANAGEMENT (DARK / LIGHT MODE)
  // ==========================================================================
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeToggleIcon = themeToggleBtn.querySelector('i');
  const htmlElement = document.documentElement;

  // Function to set theme
  const setTheme = (theme) => {
    htmlElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update button icon
    if (theme === 'light') {
      themeToggleIcon.className = 'fa-solid fa-sun';
    } else {
      themeToggleIcon.className = 'fa-solid fa-moon';
    }
  };

  // Initialize theme
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme) {
    setTheme(savedTheme);
  } else if (systemPrefersDark) {
    setTheme('dark');
  } else {
    setTheme('light');
  }

  // Toggle theme click listener
  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  });

  // ==========================================================================
  // STICKY HEADER & SCROLL BEHAVIOR
  // ==========================================================================
  const header = document.querySelector('header');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // ==========================================================================
  // MOBILE NAVIGATION MENU
  // ==========================================================================
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  const navLinksItems = document.querySelectorAll('.nav-links a');

  const toggleMobileMenu = () => {
    mobileMenuBtn.classList.toggle('open');
    navLinks.classList.toggle('open');
    
    // Disable scroll on body when menu is open
    if (navLinks.classList.contains('open')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  };

  mobileMenuBtn.addEventListener('click', toggleMobileMenu);

  // Close mobile menu when a nav link is clicked
  navLinksItems.forEach(item => {
    item.addEventListener('click', () => {
      if (navLinks.classList.contains('open')) {
        toggleMobileMenu();
      }
    });
  });

  // ==========================================================================
  // SCROLL ACTIVE SECTION HIGHLIGHT
  // ==========================================================================
  const sections = document.querySelectorAll('section');
  
  const activeSectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinksItems.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, {
    rootMargin: '-30% 0px -60% 0px' // Focus active state when section takes up middle viewport
  });

  sections.forEach(section => {
    activeSectionObserver.observe(section);
  });

  // ==========================================================================
  // SCROLL REVEAL ANIMATIONS
  // ==========================================================================
  const revealElements = document.querySelectorAll('.scroll-reveal');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Stop observing once revealed
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1 // Trigger when 10% of element is visible
  });

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });

  // ==========================================================================
  // CONTACT FORM VALIDATION & SUBMISSION MOCK
  // ==========================================================================
  const form = document.getElementById('contact-form');
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-message');

  // Regex helper for email validation
  const isValidEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  // Show status validation for individual inputs
  const validateField = (inputElement) => {
    const formGroup = inputElement.parentElement;
    let isValid = true;

    // Reset validation state
    formGroup.classList.remove('invalid');

    // Perform checks
    if (inputElement.required && !inputElement.value.trim()) {
      isValid = false;
    } else if (inputElement.type === 'email' && inputElement.value.trim()) {
      if (!isValidEmail(inputElement.value.trim())) {
        isValid = false;
      }
    }

    if (!isValid) {
      formGroup.classList.add('invalid');
    }

    return isValid;
  };

  // Add blur listener to inputs for dynamic validation
  const inputs = form.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.addEventListener('blur', () => {
      validateField(input);
    });
    
    // Clear invalid state on typing
    input.addEventListener('input', () => {
      if (input.parentElement.classList.contains('invalid')) {
        input.parentElement.classList.remove('invalid');
      }
    });
  });

  // Handle form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    let isFormValid = true;

    // Validate all fields
    inputs.forEach(input => {
      const isFieldValid = validateField(input);
      if (!isFieldValid) {
        isFormValid = false;
      }
    });

    if (isFormValid) {
      // Mock loading state
      const submitBtn = form.querySelector('.btn-submit');
      const submitText = submitBtn.querySelector('span');
      const submitIcon = submitBtn.querySelector('i');
      
      submitBtn.disabled = true;
      submitText.textContent = 'Sending...';
      submitIcon.className = 'fa-solid fa-spinner fa-spin';

      // Simulate network request
      setTimeout(() => {
        // Reset button state
        submitBtn.disabled = false;
        submitText.textContent = 'Send Message';
        submitIcon.className = 'fa-solid fa-paper-plane';

        // Clear form
        form.reset();

        // Trigger Success Toast
        showToast('Message sent successfully! I will contact you shortly.', 'success');
      }, 1500);
    } else {
      // Focus on first invalid input
      const firstInvalid = form.querySelector('.form-group.invalid input, .form-group.invalid textarea');
      if (firstInvalid) {
        firstInvalid.focus();
      }
    }
  });

  // Function to show toast alert
  const showToast = (message, type = 'success') => {
    toastMsg.textContent = message;
    
    const toastIcon = toast.querySelector('i');
    if (type === 'success') {
      toastIcon.className = 'fa-solid fa-circle-check';
      toastIcon.style.color = '#10b981'; // Green
    } else {
      toastIcon.className = 'fa-solid fa-circle-exclamation';
      toastIcon.style.color = '#ef4444'; // Red
    }

    toast.classList.add('toast-show');

    // Hide after 4 seconds
    setTimeout(() => {
      toast.classList.remove('toast-show');
    }, 4000);
  };
});
