/**
 * CampusFind Master Application Controller
 * Exclusive Student Equipment Rental Marketplace for RGUKT Nuzvid
 */

import { initSearch } from './search.js';
import { initModals, showToast } from './modals.js';

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileDrawer();
  initSmoothScrollLinks();
  initNewsletterForm();

  // Initialize search & modals
  initSearch();
  initModals();

  console.log('CampusFind RGUKT Nuzvid Marketplace initialized successfully.');
});

/* --------------------------------------------------------------------------
   Header Scroll Blur & Dynamic Shadow Transition
   -------------------------------------------------------------------------- */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* --------------------------------------------------------------------------
   Mobile Drawer Interaction
   -------------------------------------------------------------------------- */
function initMobileDrawer() {
  const toggleBtn = document.getElementById('mobile-menu-btn');
  const drawerBackdrop = document.getElementById('mobile-drawer-backdrop');
  const closeBtn = document.getElementById('btn-close-mobile-drawer');
  const navLinks = document.querySelectorAll('.mobile-drawer-link');

  if (toggleBtn && drawerBackdrop) {
    toggleBtn.addEventListener('click', () => {
      drawerBackdrop.classList.add('is-open');
    });
  }

  if (closeBtn && drawerBackdrop) {
    closeBtn.addEventListener('click', () => {
      drawerBackdrop.classList.remove('is-open');
    });
  }

  if (drawerBackdrop) {
    drawerBackdrop.addEventListener('click', (e) => {
      if (e.target === drawerBackdrop) {
        drawerBackdrop.classList.remove('is-open');
      }
    });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      drawerBackdrop.classList.remove('is-open');
    });
  });
}

/* --------------------------------------------------------------------------
   Smooth Anchor Scrolling
   -------------------------------------------------------------------------- */
function initSmoothScrollLinks() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

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

/* --------------------------------------------------------------------------
   Newsletter / Gear Alerts Subscription
   -------------------------------------------------------------------------- */
function initNewsletterForm() {
  const forms = document.querySelectorAll('.newsletter-form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      if (input && input.value) {
        showToast(`Subscribed! You'll receive RGUKT gear alert updates for ${input.value}`);
        form.reset();
      }
    });
  });
}
