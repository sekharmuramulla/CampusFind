/**
 * CampusFind Modals, Booking Workflow & User Dashboard
 * Complete functional prototype for RGUKT Nuzvid Campus Marketplace
 */

import { allProducts, addProductToListings } from './search.js';
import { sampleInitialBookings, sampleInitialUserListings } from './data.js';

// Local Prototype State
export let myBookings = [...sampleInitialBookings];
export let myUserListings = [...sampleInitialUserListings];
let wishlist = new Set(['prod-01', 'prod-04']); // Initial saved items for immediate delight

export function initModals() {
  bindModalBackdrops();
  bindListItemModal();
  bindDashboardModal();
  bindWishlistDrawer();
  updateWishlistUI();
  updateDashboardBadges();
}

/* --------------------------------------------------------------------------
   Toast Notifications
   -------------------------------------------------------------------------- */
export function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color: var(--c-lime); flex-shrink: 0;">
      <path d="M20 6 9 17l-5-5"/>
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 300ms ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/* --------------------------------------------------------------------------
   Wishlist Engine
   -------------------------------------------------------------------------- */
export function isWishlisted(productId) {
  return wishlist.has(productId);
}

export function toggleWishlist(productId) {
  const product = allProducts.find(p => p.id === productId);
  if (!product) return;

  if (wishlist.has(productId)) {
    wishlist.delete(productId);
    showToast(`Removed "${product.title}" from saved equipment`);
  } else {
    wishlist.add(productId);
    showToast(`Saved "${product.title}" to your gear wishlist`);
  }

  updateWishlistUI();
  import('./search.js').then(mod => mod.renderProducts());
}

export function updateWishlistUI() {
  const countBadges = document.querySelectorAll('.wishlist-count-badge');
  countBadges.forEach(b => {
    b.textContent = wishlist.size;
    b.style.display = wishlist.size > 0 ? 'flex' : 'none';
  });

  renderWishlistDrawerItems();
}

function renderWishlistDrawerItems() {
  const container = document.getElementById('wishlist-items-container');
  const countTitle = document.getElementById('wishlist-drawer-count');
  if (!container) return;

  const savedItems = allProducts.filter(p => wishlist.has(p.id));
  if (countTitle) {
    countTitle.textContent = `${savedItems.length} saved item${savedItems.length === 1 ? '' : 's'}`;
  }

  if (savedItems.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 3rem 1rem; color: var(--c-charcoal-muted);">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin: 0 auto 1rem; color: var(--c-sage);">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
        </svg>
        <p style="font-weight: 600; color: var(--c-forest); margin-bottom: 0.25rem;">No saved equipment yet</p>
        <p style="font-size: 0.8125rem;">Click the heart icon on any gear card to save it for exam prep or events.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = savedItems.map(item => `
    <div class="wishlist-item">
      <img src="${item.image}" alt="${item.title}" />
      <div class="wishlist-item-details">
        <h4 class="wishlist-item-title">${item.title}</h4>
        <span class="wishlist-item-price">₹${item.dailyRate}/day</span>
        <div style="font-size: 0.72rem; color: var(--c-charcoal-muted);">${item.owner.pickupSpot}</div>
      </div>
      <div style="display: flex; gap: 0.25rem;">
        <button class="btn btn-secondary" style="padding: 0.35rem 0.65rem; font-size: 0.75rem;" data-open-from-wishlist="${item.id}">
          View
        </button>
        <button class="wishlist-remove-btn" data-remove-wishlist="${item.id}" title="Remove from list">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      </div>
    </div>
  `).join('');

  container.querySelectorAll('[data-open-from-wishlist]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('wishlist-drawer-backdrop')?.classList.remove('is-open');
      openProductModal(btn.dataset.openFromWishlist);
    });
  });

  container.querySelectorAll('[data-remove-wishlist]').forEach(btn => {
    btn.addEventListener('click', () => {
      toggleWishlist(btn.dataset.removeWishlist);
    });
  });
}

function bindWishlistDrawer() {
  const triggerBtn = document.getElementById('btn-nav-wishlist');
  const drawerBackdrop = document.getElementById('wishlist-drawer-backdrop');
  const closeBtn = document.getElementById('btn-close-wishlist');

  if (triggerBtn && drawerBackdrop) {
    triggerBtn.addEventListener('click', () => {
      drawerBackdrop.classList.add('is-open');
    });
  }

  if (closeBtn && drawerBackdrop) {
    closeBtn.addEventListener('click', () => {
      drawerBackdrop.classList.remove('is-open');
    });
  }
}

/* --------------------------------------------------------------------------
   Product Detail View & Booking Flow
   -------------------------------------------------------------------------- */
export function openProductModal(productId) {
  const product = allProducts.find(p => p.id === productId);
  if (!product) return;

  const backdrop = document.getElementById('product-modal-backdrop');
  const content = document.getElementById('product-modal-content');
  if (!backdrop || !content) return;

  const isSaved = isWishlisted(product.id);
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  content.innerHTML = `
    <div class="product-modal-media-header">
      <img src="${product.image}" alt="${product.title}" />
      <span class="product-category-pill">${product.category}</span>
      <span class="demo-preview-tag">RGUKT Nuzvid Verified Demo</span>
    </div>

    <div class="product-modal-body">
      <!-- Title & Price Top Row -->
      <div class="product-modal-meta-row">
        <div>
          <div class="product-pickup-row" style="margin-bottom: 0.35rem;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            <span>Pickup: ${product.owner.pickupSpot}</span>
          </div>
          <h2 class="heading-subsection" style="color: var(--c-forest); margin-top: 0.2rem;">${product.title}</h2>
          <div style="display: flex; align-items: center; gap: 0.65rem; margin-top: 0.4rem;">
            <span class="badge-editorial" style="font-size: 0.7rem; padding: 0.2rem 0.6rem;">${product.condition}</span>
            <span style="font-size: 0.8125rem; color: var(--c-charcoal-muted);">${product.owner.name} (${product.owner.dept})</span>
          </div>
        </div>

        <div style="text-align: right;">
          <div class="daily-price-wrap">
            <span class="price-val" style="font-size: 1.85rem;">₹${product.dailyRate}</span>
            <span class="price-unit">/day</span>
          </div>
          ${product.weeklyRate ? `<div style="font-size: 0.8125rem; color: var(--c-forest-soft); font-weight: 600;">₹${product.weeklyRate} per week</div>` : ''}
          <div style="font-size: 0.72rem; color: var(--c-charcoal-muted); margin-top: 2px;">Refundable Deposit: ₹${product.deposit}</div>
        </div>
      </div>

      <!-- Description -->
      <p class="text-body" style="color: var(--c-charcoal); margin: 1.25rem 0;">${product.description}</p>

      <!-- Specifications & Owner Grid -->
      <div class="modal-specs-grid">
        <div class="spec-cell">
          <span class="spec-label">Item Condition</span>
          <span class="spec-val">${product.condition}</span>
        </div>
        <div class="spec-cell">
          <span class="spec-label">Campus Handover Spot</span>
          <span class="spec-val">${product.owner.pickupSpot}</span>
        </div>
        <div class="spec-cell">
          <span class="spec-label">Contact Preference</span>
          <span class="spec-val">${product.owner.contactPref}</span>
        </div>
        <div class="spec-cell">
          <span class="spec-label">Availability</span>
          <span class="spec-val" style="color: var(--c-success); font-weight: 800;">${product.availability}</span>
        </div>
      </div>

      <!-- Included Gear Accessories -->
      <h3 class="modal-section-title">Included Gear &amp; Accessories</h3>
      <div class="amenities-checklist">
        ${product.includedAccessories.map(acc => `
          <div class="amenity-check-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            <span>${acc}</span>
          </div>
        `).join('')}
      </div>

      <!-- Live Rental Booking Form Flow -->
      <div class="booking-flow-card">
        <div class="booking-flow-header">
          <h4 style="font-family: var(--font-heading); font-size: 1.05rem; font-weight: 700; color: var(--c-forest); margin-bottom: 0.25rem;">
            Request Campus Rental
          </h4>
          <p style="font-size: 0.8125rem; color: var(--c-charcoal-muted);">
            Pick your dates. Pay zero commission. Handover directly with the student owner on campus.
          </p>
        </div>

        <form id="rental-booking-form">
          <div class="form-row" style="margin-bottom: 0.85rem;">
            <div class="form-group" style="margin-bottom: 0;">
              <label for="book-start-date">Rental Start Date</label>
              <input type="date" id="book-start-date" required class="form-control" min="${today}" value="${today}" />
            </div>
            <div class="form-group" style="margin-bottom: 0;">
              <label for="book-end-date">Return Date</label>
              <input type="date" id="book-end-date" required class="form-control" min="${today}" value="${tomorrow}" />
            </div>
          </div>

          <div class="form-row" style="margin-bottom: 0.85rem;">
            <div class="form-group" style="margin-bottom: 0;">
              <label for="book-student-name">Your Full Name</label>
              <input type="text" id="book-student-name" required placeholder="e.g. Rahul V." class="form-control" />
            </div>
            <div class="form-group" style="margin-bottom: 0;">
              <label for="book-student-id">RGUKT Roll Number / ID</label>
              <input type="text" id="book-student-id" required placeholder="e.g. N210345" class="form-control" />
            </div>
          </div>

          <div class="form-group" style="margin-bottom: 1rem;">
            <label for="book-phone">WhatsApp Number (For Handover Coordination)</label>
            <input type="tel" id="book-phone" required placeholder="10-digit mobile number" class="form-control" />
          </div>

          <!-- Dynamic Live Price Calculation Summary -->
          <div class="live-price-summary" id="live-price-summary-box">
            <div class="price-row">
              <span id="price-calc-label">1 day @ ₹${product.dailyRate}/day</span>
              <strong id="price-calc-subtotal">₹${product.dailyRate}</strong>
            </div>
            <div class="price-row">
              <span>Security Deposit (Refunded upon return)</span>
              <span>₹${product.deposit}</span>
            </div>
            <div class="price-row total-row">
              <span>Estimated Handover Total</span>
              <span class="total-amount" id="price-calc-total">₹${product.dailyRate + product.deposit}</span>
            </div>
            <div class="deposit-notice">
              * Rental amount is handed directly to the owner at handover. Booking request requires owner approval.
            </div>
          </div>

          <button type="submit" class="btn btn-lime" style="width: 100%; height: 48px; margin-top: 1.15rem;">
            <span>Send Booking Request to ${product.owner.name}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
          </button>
        </form>
      </div>

      <!-- Action Footer -->
      <div class="modal-footer-actions">
        <button class="btn btn-secondary" id="modal-wishlist-toggle">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="${isSaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
          </svg>
          <span>${isSaved ? 'Saved in Gear List' : 'Save for Later'}</span>
        </button>

        <span class="text-xs" style="color: var(--c-charcoal-muted);">
          Protected by RGUKT Campus Peer Guidelines
        </span>
      </div>
    </div>
  `;

  // Attach dynamic price calculation listener
  const startDateInput = content.querySelector('#book-start-date');
  const endDateInput = content.querySelector('#book-end-date');
  const calcLabel = content.querySelector('#price-calc-label');
  const calcSubtotal = content.querySelector('#price-calc-subtotal');
  const calcTotal = content.querySelector('#price-calc-total');

  function updatePriceCalc() {
    const start = new Date(startDateInput.value);
    const end = new Date(endDateInput.value);
    let diffDays = Math.round((end - start) / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) diffDays = 1;

    let subtotal = 0;
    if (product.weeklyRate && diffDays >= 7) {
      const weeks = Math.floor(diffDays / 7);
      const remDays = diffDays % 7;
      subtotal = (weeks * product.weeklyRate) + (remDays * product.dailyRate);
      calcLabel.textContent = `${diffDays} days (${weeks} wk + ${remDays}d)`;
    } else {
      subtotal = diffDays * product.dailyRate;
      calcLabel.textContent = `${diffDays} day${diffDays > 1 ? 's' : ''} @ ₹${product.dailyRate}/day`;
    }

    calcSubtotal.textContent = `₹${subtotal}`;
    calcTotal.textContent = `₹${subtotal + product.deposit}`;
    return { diffDays, subtotal, total: subtotal + product.deposit };
  }

  startDateInput.addEventListener('change', () => {
    if (endDateInput.value < startDateInput.value) {
      endDateInput.value = startDateInput.value;
    }
    endDateInput.min = startDateInput.value;
    updatePriceCalc();
  });
  endDateInput.addEventListener('change', updatePriceCalc);

  // Form Submission
  const bookingForm = content.querySelector('#rental-booking-form');
  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const studentName = content.querySelector('#book-student-name').value.trim();
    const studentId = content.querySelector('#book-student-id').value.trim();
    const phone = content.querySelector('#book-phone').value.trim();
    const { diffDays, subtotal, total } = updatePriceCalc();

    if (phone.replace(/\D/g, '').length < 10) {
      showToast('Please enter a valid 10-digit WhatsApp number', 'error');
      return;
    }

    const newBooking = {
      id: "book-" + Date.now(),
      productId: product.id,
      productTitle: product.title,
      productImage: product.image,
      ownerName: product.owner.name,
      pickupSpot: product.owner.pickupSpot,
      startDate: startDateInput.value,
      endDate: endDateInput.value,
      days: diffDays,
      rate: product.dailyRate,
      total: subtotal,
      deposit: product.deposit,
      status: "Submitted (Awaiting Owner)",
      statusCode: "pending",
      notes: `Requested by ${studentName} (${studentId}). Coordination on ${phone}.`
    };

    myBookings.unshift(newBooking);
    updateDashboardBadges();

    // Show Confirmation Dialog
    showBookingConfirmation(newBooking, product);
    backdrop.classList.remove('is-open');
  });

  // Modal Wishlist Toggle
  const modalWishlist = content.querySelector('#modal-wishlist-toggle');
  modalWishlist.addEventListener('click', () => {
    toggleWishlist(product.id);
    openProductModal(product.id);
  });

  backdrop.classList.add('is-open');
}

function showBookingConfirmation(booking, product) {
  showToast(`Booking request sent to ${product.owner.name}! View status in your Dashboard.`);
  
  const confirmModal = document.getElementById('confirmation-modal-backdrop');
  const confirmBody = document.getElementById('confirmation-modal-content');
  if (confirmModal && confirmBody) {
    confirmBody.innerHTML = `
      <div style="text-align: center; padding: 2rem 1.5rem;">
        <div style="width: 64px; height: 64px; border-radius: 50%; background: var(--c-lime); color: var(--c-forest-dark); display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem;">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <span class="badge-editorial" style="margin-bottom: 0.75rem;">Request Sent</span>
        <h3 style="font-family: var(--font-heading); font-size: 1.5rem; color: var(--c-forest); margin-bottom: 0.5rem;">
          Booking Request Submitted!
        </h3>
        <p style="color: var(--c-charcoal-muted); font-size: 0.9375rem; max-width: 440px; margin: 0 auto 1.5rem;">
          Your request for <strong>${booking.productTitle}</strong> (${booking.days} days) has been forwarded to <strong>${booking.ownerName}</strong>.
        </p>

        <div style="background: var(--c-ivory-warm); border: 1px solid var(--c-sage); border-radius: var(--radius-md); padding: 1.15rem; text-align: left; margin-bottom: 1.75rem;">
          <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.4rem;">
            <span style="color: var(--c-charcoal-muted);">Rental Dates:</span>
            <strong>${booking.startDate} to ${booking.endDate}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.4rem;">
            <span style="color: var(--c-charcoal-muted);">Pickup Spot:</span>
            <strong>${booking.pickupSpot}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.85rem; padding-top: 0.5rem; border-top: 1px dashed var(--c-sage);">
            <span style="color: var(--c-charcoal-muted);">Estimated Rent Total:</span>
            <strong style="color: var(--c-forest); font-size: 1rem;">₹${booking.total} (+ ₹${booking.deposit} refundable deposit)</strong>
          </div>
        </div>

        <div style="display: flex; gap: 0.75rem; justify-content: center;">
          <button class="btn btn-primary" id="btn-view-in-dashboard">
            View in Dashboard
          </button>
          <button class="btn btn-secondary" onclick="document.getElementById('confirmation-modal-backdrop').classList.remove('is-open');">
            Keep Browsing
          </button>
        </div>
      </div>
    `;

    confirmModal.querySelector('#btn-view-in-dashboard')?.addEventListener('click', () => {
      confirmModal.classList.remove('is-open');
      openDashboardModal('rentals');
    });

    confirmModal.classList.add('is-open');
  }
}

/* --------------------------------------------------------------------------
   "List an Item" Modal & Controller
   -------------------------------------------------------------------------- */
function bindListItemModal() {
  const triggerNav = document.getElementById('btn-nav-list-item');
  const triggerHero = document.getElementById('btn-hero-list-item');
  const modal = document.getElementById('list-item-modal-backdrop');
  const form = document.getElementById('list-item-form');

  if (triggerNav && modal) {
    triggerNav.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('is-open');
    });
  }
  if (triggerHero && modal) {
    triggerHero.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('is-open');
    });
  }

  // Mobile trigger
  const triggerMobile = document.getElementById('btn-mobile-list-item');
  if (triggerMobile && modal) {
    triggerMobile.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('mobile-drawer-backdrop')?.classList.remove('is-open');
      modal.classList.add('is-open');
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const title = form.querySelector('[name="item_title"]').value.trim();
      const category = form.querySelector('[name="item_category"]').value;
      const dailyRate = Number(form.querySelector('[name="item_daily_rate"]').value);
      const weeklyRate = Number(form.querySelector('[name="item_weekly_rate"]').value) || (dailyRate * 5);
      const deposit = Number(form.querySelector('[name="item_deposit"]').value) || (dailyRate * 3);
      const condition = form.querySelector('[name="item_condition"]').value;
      const pickupSpot = form.querySelector('[name="item_pickup_spot"]').value.trim();
      const ownerName = form.querySelector('[name="item_owner_name"]').value.trim();
      const ownerDept = form.querySelector('[name="item_owner_dept"]').value.trim();
      const desc = form.querySelector('[name="item_desc"]').value.trim();
      const accessoriesRaw = form.querySelector('[name="item_accessories"]').value.trim();

      const accessories = accessoriesRaw 
        ? accessoriesRaw.split(',').map(s => s.trim()).filter(Boolean)
        : ["Item Handover in Working Order"];

      // Pick image based on category
      let imgPath = "assets/images/products/calculator.jpg";
      if (category === "Electronics") imgPath = "assets/images/products/laptop.jpg";
      else if (category === "Photography") imgPath = "assets/images/products/dslr-camera.jpg";
      else if (category === "Project Equipment") imgPath = "assets/images/products/arduino-kit.jpg";
      else if (category === "Audio Accessories") imgPath = "assets/images/products/microphone.jpg";
      else if (category === "Everyday Essentials") imgPath = "assets/images/products/powerbank.jpg";

      const newItem = {
        id: "prod-" + Date.now(),
        title,
        category,
        dailyRate,
        weeklyRate,
        deposit,
        condition,
        availability: "Available Now",
        owner: {
          name: ownerName,
          dept: ownerDept,
          role: "RGUKT Student Owner",
          pickupSpot,
          rating: "5.0",
          contactPref: "WhatsApp / In-person handover"
        },
        image: imgPath,
        description: desc,
        includedAccessories: accessories,
        featured: false,
        tags: [category, "Student Listing", "Newly Listed"]
      };

      // Add to marketplace
      addProductToListings(newItem);

      // Add to user listings
      myUserListings.unshift({
        id: "listing-" + Date.now(),
        title: newItem.title,
        category: newItem.category,
        dailyRate: newItem.dailyRate,
        weeklyRate: newItem.weeklyRate,
        condition: newItem.condition,
        status: "Active",
        pickupSpot: newItem.owner.pickupSpot,
        inquiriesCount: 0,
        image: newItem.image
      });

      updateDashboardBadges();
      showToast(`"${title}" is now listed on CampusFind! Students can discover and request it.`);
      form.reset();
      modal.classList.remove('is-open');

      // Scroll to marketplace
      const exploreSection = document.getElementById('explore-items');
      if (exploreSection) {
        exploreSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }
}

/* --------------------------------------------------------------------------
   User Dashboard Modal (Prototype with 4 Functional Tabs)
   -------------------------------------------------------------------------- */
export function openDashboardModal(defaultTab = 'rentals') {
  const modal = document.getElementById('dashboard-modal-backdrop');
  if (!modal) return;
  modal.classList.add('is-open');
  switchDashboardTab(defaultTab);
}

function bindDashboardModal() {
  const triggerNav = document.getElementById('btn-nav-dashboard');
  const triggerMobile = document.getElementById('btn-mobile-dashboard');
  const modal = document.getElementById('dashboard-modal-backdrop');

  if (triggerNav && modal) {
    triggerNav.addEventListener('click', (e) => {
      e.preventDefault();
      openDashboardModal('rentals');
    });
  }

  if (triggerMobile && modal) {
    triggerMobile.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('mobile-drawer-backdrop')?.classList.remove('is-open');
      openDashboardModal('rentals');
    });
  }

  // Dashboard Tab Switching
  const tabs = document.querySelectorAll('.dashboard-tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      switchDashboardTab(tab.dataset.dashTab);
    });
  });
}

function switchDashboardTab(tabName) {
  const tabs = document.querySelectorAll('.dashboard-tab-btn');
  tabs.forEach(t => {
    t.classList.toggle('is-active', t.dataset.dashTab === tabName);
  });

  const contentArea = document.getElementById('dashboard-tab-content');
  if (!contentArea) return;

  if (tabName === 'rentals') {
    renderMyRentalsTab(contentArea);
  } else if (tabName === 'listings') {
    renderMyListingsTab(contentArea);
  } else if (tabName === 'requests') {
    renderBookingRequestsTab(contentArea);
  } else if (tabName === 'profile') {
    renderProfileTab(contentArea);
  }
}

function renderMyRentalsTab(container) {
  if (myBookings.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 3rem 1rem;">
        <p style="font-weight: 700; color: var(--c-forest); margin-bottom: 0.25rem;">No rental requests yet</p>
        <p style="font-size: 0.85rem; color: var(--c-charcoal-muted); margin-bottom: 1.25rem;">Browse equipment like calculators, laptops, or cameras and request a rental.</p>
        <a href="#explore-items" class="btn btn-primary" onclick="document.getElementById('dashboard-modal-backdrop').classList.remove('is-open');">Explore Gear</a>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      ${myBookings.map(b => `
        <div class="dash-item-card">
          <img src="${b.productImage}" alt="${b.productTitle}" class="dash-item-thumb" />
          <div style="flex-grow: 1; min-width: 0;">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; margin-bottom: 0.25rem;">
              <h4 style="font-family: var(--font-heading); font-size: 0.95rem; font-weight: 700; color: var(--c-forest); text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">
                ${b.productTitle}
              </h4>
              <span class="status-badge status-${b.statusCode}">${b.status}</span>
            </div>
            <div style="font-size: 0.8125rem; color: var(--c-charcoal-muted); margin-bottom: 0.25rem;">
              Owner: <strong>${b.ownerName}</strong> • Handover at <strong>${b.pickupSpot}</strong>
            </div>
            <div style="font-size: 0.78rem; color: var(--c-forest-soft); font-weight: 600;">
              Dates: ${b.startDate} to ${b.endDate} (${b.days} days) • Total: ₹${b.total} (+ ₹${b.deposit} deposit)
            </div>
            ${b.notes ? `<div style="font-size: 0.75rem; background: var(--c-ivory-warm); padding: 0.35rem 0.65rem; border-radius: var(--radius-xs); margin-top: 0.4rem; color: var(--c-charcoal);">${b.notes}</div>` : ''}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderMyListingsTab(container) {
  container.innerHTML = `
    <div style="margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center;">
      <span style="font-size: 0.85rem; color: var(--c-charcoal-muted);">Gear you are sharing with RGUKT students:</span>
      <button class="btn btn-lime" style="padding: 0.4rem 0.85rem; font-size: 0.78rem;" id="btn-dash-add-gear">
        + List Another Gear
      </button>
    </div>
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      ${myUserListings.map(l => `
        <div class="dash-item-card">
          <img src="${l.image}" alt="${l.title}" class="dash-item-thumb" />
          <div style="flex-grow: 1;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.25rem;">
              <h4 style="font-family: var(--font-heading); font-size: 0.95rem; font-weight: 700; color: var(--c-forest);">${l.title}</h4>
              <span class="status-badge status-approved">Active on Campus</span>
            </div>
            <div style="font-size: 0.8125rem; color: var(--c-charcoal-muted);">
              Category: ${l.category} • Rate: ₹${l.dailyRate}/day (₹${l.weeklyRate}/week)
            </div>
            <div style="font-size: 0.78rem; color: var(--c-forest-soft); margin-top: 0.25rem;">
              Campus Handover: ${l.pickupSpot} • Condition: ${l.condition}
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  container.querySelector('#btn-dash-add-gear')?.addEventListener('click', () => {
    document.getElementById('dashboard-modal-backdrop')?.classList.remove('is-open');
    document.getElementById('list-item-modal-backdrop')?.classList.add('is-open');
  });
}

function renderBookingRequestsTab(container) {
  container.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <div class="dash-item-card" style="border-left: 4px solid var(--c-forest-soft);">
        <div style="flex-grow: 1;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
            <h4 style="font-family: var(--font-heading); font-size: 0.95rem; font-weight: 700; color: var(--c-forest);">
              Logitech Presentation Clicker (Booking Inquiry)
            </h4>
            <span class="status-badge status-pending">Action Needed</span>
          </div>
          <p style="font-size: 0.8125rem; color: var(--c-charcoal); margin-bottom: 0.5rem;">
            From: <strong>Manoj K. (E3 CSE - N190822)</strong> for Department PPT Defense.
          </p>
          <div style="font-size: 0.78rem; color: var(--c-charcoal-muted); margin-bottom: 0.75rem;">
            Requested Duration: 2 Days (₹80 total) • Handover: SAC Foyer
          </div>
          <div style="display: flex; gap: 0.5rem;">
            <button class="btn btn-primary" style="padding: 0.4rem 0.85rem; font-size: 0.78rem;" id="btn-demo-accept-request">
              Accept &amp; Coordinate Handover
            </button>
            <button class="btn btn-secondary" style="padding: 0.4rem 0.85rem; font-size: 0.78rem;" id="btn-demo-decline-request">
              Decline
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  container.querySelector('#btn-demo-accept-request')?.addEventListener('click', function() {
    this.parentElement.innerHTML = `<span style="font-size: 0.8125rem; color: var(--c-success); font-weight: 700;">✓ Request Accepted! WhatsApp coordination opened.</span>`;
    showToast('Accepted rental request! Coordinate handover with Manoj at SAC.');
  });
  container.querySelector('#btn-demo-decline-request')?.addEventListener('click', function() {
    this.closest('.dash-item-card').remove();
    showToast('Rental request declined.');
  });
}

function renderProfileTab(container) {
  container.innerHTML = `
    <div style="background: var(--c-ivory-warm); border: 1px solid var(--c-sage); border-radius: var(--radius-md); padding: 1.5rem;">
      <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
        <div style="width: 52px; height: 52px; border-radius: 50%; background: var(--c-forest); color: var(--c-lime); font-family: var(--font-heading); font-size: 1.25rem; font-weight: 800; display: flex; align-items: center; justify-content: center;">
          RG
        </div>
        <div>
          <h4 style="font-family: var(--font-heading); font-size: 1.15rem; font-weight: 700; color: var(--c-forest);">
            RGUKT Student Profile
          </h4>
          <span style="font-size: 0.78rem; color: var(--c-forest-soft); font-weight: 600;">
            Rajiv Gandhi University of Knowledge Technologies, Nuzvid
          </span>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; font-size: 0.85rem;">
        <div>
          <span style="color: var(--c-charcoal-muted); font-size: 0.75rem; text-transform: uppercase; font-weight: 700;">Campus ID</span>
          <div style="font-weight: 700; color: var(--c-forest); margin-top: 2px;">N200001 (Verified Demo)</div>
        </div>
        <div>
          <span style="color: var(--c-charcoal-muted); font-size: 0.75rem; text-transform: uppercase; font-weight: 700;">Hostel Block</span>
          <div style="font-weight: 700; color: var(--c-forest); margin-top: 2px;">Hostel K3 / I-Block</div>
        </div>
        <div>
          <span style="color: var(--c-charcoal-muted); font-size: 0.75rem; text-transform: uppercase; font-weight: 700;">Department</span>
          <div style="font-weight: 700; color: var(--c-forest); margin-top: 2px;">Computer Science &amp; Engineering</div>
        </div>
        <div>
          <span style="color: var(--c-charcoal-muted); font-size: 0.75rem; text-transform: uppercase; font-weight: 700;">Trust Level</span>
          <div style="font-weight: 700; color: var(--c-success); margin-top: 2px;">Peer Verified (4.9 ★)</div>
        </div>
      </div>

      <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px dashed var(--c-sage); font-size: 0.78rem; color: var(--c-charcoal-muted);">
        Notice: In this prototype, data is stored in local browser state. When connected to university single sign-on (SSO), profile information will sync with student intranet credentials.
      </div>
    </div>
  `;
}

function updateDashboardBadges() {
  const badge = document.getElementById('dash-rentals-count-badge');
  if (badge) {
    badge.textContent = myBookings.length;
    badge.style.display = myBookings.length > 0 ? 'inline-flex' : 'none';
  }
}

/* --------------------------------------------------------------------------
   Generic Modal Backdrop Dismissal
   -------------------------------------------------------------------------- */
function bindModalBackdrops() {
  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        backdrop.classList.remove('is-open');
      }
    });

    const closeBtn = backdrop.querySelector('.modal-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        backdrop.classList.remove('is-open');
      });
    }
  });

  // ESC key dismisses active modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-backdrop.is-open, .mobile-drawer-backdrop.is-open, .wishlist-drawer-backdrop.is-open').forEach(el => {
        el.classList.remove('is-open');
      });
    }
  });
}
