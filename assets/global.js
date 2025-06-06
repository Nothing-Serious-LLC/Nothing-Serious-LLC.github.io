// Mobile Navigation
document.addEventListener('DOMContentLoaded', function() {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileMenuClose = document.querySelector('.mobile-menu-close');
  const mobileOverlay = document.querySelector('.mobile-overlay');
  const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu-links a');
  
  // Toggle mobile menu
  function toggleMobileMenu() {
    mobileMenu.classList.toggle('active');
    mobileOverlay.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  }
  
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
  }
  
  if (mobileMenuClose) {
    mobileMenuClose.addEventListener('click', toggleMobileMenu);
  }
  
  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', toggleMobileMenu);
  }
  
  // Set active nav link
  const currentPath = window.location.pathname;
  navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPath || 
        (currentPath === '/' && link.getAttribute('href') === '/index.html') ||
        (currentPath === '/index.html' && link.getAttribute('href') === '/')) {
      link.classList.add('active');
    }
  });
  
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  // Add fade-in animation to elements as they come into view
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in-up');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observe elements with animate class
  document.querySelectorAll('.animate').forEach(el => {
    observer.observe(el);
  });
});

// Form validation and enhancement
function enhanceForm(formId) {
  const form = document.getElementById(formId);
  if (!form) return;
  
  // Add floating label behavior
  const inputs = form.querySelectorAll('.form-input, .form-textarea');
  inputs.forEach(input => {
    input.setAttribute('placeholder', ' ');
  });
  
  // Real-time validation
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Reset errors
    form.querySelectorAll('.form-group').forEach(group => {
      group.classList.remove('error');
    });
    
    let isValid = true;
    
    // Validate required fields
    form.querySelectorAll('[required]').forEach(field => {
      if (!field.value.trim()) {
        field.closest('.form-group').classList.add('error');
        isValid = false;
      }
    });
    
    // Validate email
    const emailField = form.querySelector('input[type="email"]');
    if (emailField && emailField.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailField.value)) {
        emailField.closest('.form-group').classList.add('error');
        isValid = false;
      }
    }
    
    if (!isValid) return;
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<div class="spinner" style="width: 20px; height: 20px; margin: 0 auto;"></div>';
    
    // Submit form
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        // Show success message
        form.style.display = 'none';
        const successMsg = document.createElement('div');
        successMsg.className = 'success-message fade-in';
        successMsg.innerHTML = `
          <div style="text-align: center;">
            <svg width="80" height="80" viewBox="0 0 80 80" style="margin-bottom: 20px;">
              <circle cx="40" cy="40" r="38" fill="none" stroke="#4caf50" stroke-width="4" 
                      stroke-dasharray="238" stroke-dashoffset="238">
                <animate attributeName="stroke-dashoffset" to="0" dur="0.5s" fill="freeze" />
              </circle>
              <path d="M20 40 L32 52 L60 24" fill="none" stroke="#4caf50" stroke-width="4" 
                    stroke-dasharray="60" stroke-dashoffset="60">
                <animate attributeName="stroke-dashoffset" to="0" dur="0.3s" begin="0.5s" fill="freeze" />
              </path>
            </svg>
            <h2 style="color: #4caf50; margin-bottom: 10px;">Message Sent!</h2>
            <p>Thank you for reaching out. We'll get back to you soon.</p>
          </div>
        `;
        form.parentNode.insertBefore(successMsg, form);
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      // Show error message
      alert('Sorry, something went wrong. Please try again later.');
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });
} 