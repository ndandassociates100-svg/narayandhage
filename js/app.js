/**
 * ND & ASSOCIATES - Core Application JavaScript
 * Handles Navigation, Header Scroll, Counter Animations, and UI Interactivity
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileDrawer();
  initStatCounters();
  initSmoothScroll();
  initCurrentYear();
  initQuickInquiryForm();
});

/* Sticky Header on Scroll */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* Mobile Off-Canvas Drawer */
function initMobileDrawer() {
  const hamburger = document.querySelector('.hamburger-btn');
  const drawer = document.querySelector('.mobile-drawer');
  const overlay = document.querySelector('.mobile-drawer-overlay');
  const closeBtn = document.querySelector('.drawer-close-btn');
  const drawerLinks = document.querySelectorAll('.drawer-nav-link');

  if (!hamburger || !drawer || !overlay) return;

  const openDrawer = () => {
    drawer.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/* Animated Stat Counters (Triggered when scrolled into view) */
function initStatCounters() {
  const statElements = document.querySelectorAll('.counter-val');
  if (!statElements.length) return;

  let animated = false;

  const animateCounters = () => {
    statElements.forEach(el => {
      const target = parseInt(el.getAttribute('data-target'), 10);
      const suffix = el.getAttribute('data-suffix') || '';
      const prefix = el.getAttribute('data-prefix') || '';
      const duration = 2000;
      const stepTime = 20;
      const totalSteps = duration / stepTime;
      const increment = target / totalSteps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          el.textContent = `${prefix}${target}${suffix}`;
          clearInterval(timer);
        } else {
          el.textContent = `${prefix}${Math.floor(current)}${suffix}`;
        }
      }, stepTime);
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        animateCounters();
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.stats-section');
  if (statsSection) observer.observe(statsSection);
}

/* Smooth Scrolling for Anchor Links */
function initSmoothScroll() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#' || !targetId) return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

/* Auto Update Copyright Year */
function initCurrentYear() {
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/* Quick Inquiry Form Handler - Connect to WhatsApp (+91 98505 53571) */
function initQuickInquiryForm() {
  const form = document.getElementById('quickInquiryForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('contactName');
    const mobileInput = document.getElementById('contactMobile');
    const serviceInput = document.getElementById('contactService');
    const messageInput = document.getElementById('contactMessage');

    const name = nameInput ? nameInput.value.trim() : '';
    const mobile = mobileInput ? mobileInput.value.trim() : '';
    const service = serviceInput ? serviceInput.value.trim() : 'General Inquiry';
    const message = messageInput ? messageInput.value.trim() : '';

    if (!name) {
      alert('Please enter your name.');
      nameInput?.focus();
      return;
    }

    const cleanMobile = mobile.replace(/[^0-9]/g, '').slice(-10);
    if (!cleanMobile || cleanMobile.length < 10) {
      alert('Please enter a valid 10-digit mobile number.');
      mobileInput?.focus();
      return;
    }

    // Build structured WhatsApp message
    let waText = `*Hello Narayan Sir,*\n\n` +
      `I am reaching out through your website inquiry form:\n\n` +
      `👤 *Name:* ${name}\n` +
      `📱 *Mobile Number:* ${cleanMobile}\n` +
      `💼 *Service of Interest:* ${service}`;

    if (message) {
      waText += `\n💬 *Message:* ${message}`;
    } else {
      waText += `\n💬 *Message:* I would like to get more information and schedule a consultation.`;
    }

    waText += `\n\nThank you!`;

    const targetNumber = '919850553571';
    const waUrl = `https://wa.me/${targetNumber}?text=${encodeURIComponent(waText)}`;

    // Open WhatsApp in a new tab / application window
    window.open(waUrl, '_blank');

    // Reset the form
    form.reset();
  });
}
