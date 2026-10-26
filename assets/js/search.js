/**
 * CampusFind Product Search, Filter & Gallery Engine
 * Exclusively for RGUKT Nuzvid Campus Gear
 */

import { initialProducts, categoriesList } from './data.js';
import { openProductModal, toggleWishlist, isWishlisted } from './modals.js';

// Dynamic in-memory state
export let allProducts = [...initialProducts];

let currentFilters = {
  category: 'All',
  searchQuery: '',
  maxBudget: Infinity,
  onlyAvailable: false,
  sort: 'featured',
  quickTag: null
};

export function addProductToListings(newProduct) {
  allProducts.unshift(newProduct);
  renderCategoryPills();
  renderProducts();
}

export function initSearch() {
  renderCategoryPills();
  renderProducts();
  bindFilterEvents();
}

export function applyHeroSearch(query, category, maxBudget) {
  currentFilters.searchQuery = query ? query.toLowerCase().trim() : '';
  currentFilters.category = category || 'All';
  currentFilters.maxBudget = maxBudget && maxBudget !== 'All' ? Number(maxBudget) : Infinity;

  // Update UI chips
  updateCategoryPillsUI(currentFilters.category);

  renderProducts();
  const targetSection = document.getElementById('explore-items');
  if (targetSection) {
    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function renderCategoryPills() {
  const container = document.getElementById('category-filter-chips');
  if (!container) return;

  container.innerHTML = categoriesList.map(cat => {
    const isActive = cat.id === currentFilters.category;
    // Calculate live count
    const count = cat.id === 'All' ? allProducts.length : allProducts.filter(p => p.category === cat.id).length;
    return `
      <button class="filter-chip ${isActive ? 'is-active' : ''}" data-category="${cat.id}">
        <span>${cat.name}</span>
        <span class="chip-count">(${count})</span>
      </button>
    `;
  }).join('');

  container.querySelectorAll('[data-category]').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      currentFilters.category = btn.dataset.category;
      renderProducts();
    });
  });
}

function updateCategoryPillsUI(selectedCategory) {
  const container = document.getElementById('category-filter-chips');
  if (!container) return;
  container.querySelectorAll('[data-category]').forEach(btn => {
    if (btn.dataset.category === selectedCategory) {
      btn.classList.add('is-active');
    } else {
      btn.classList.remove('is-active');
    }
  });
}

function bindFilterEvents() {
  // Search input in header/marketplace
  const searchInput = document.getElementById('marketplace-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentFilters.searchQuery = e.target.value.toLowerCase().trim();
      renderProducts();
    });
  }

  // Sort dropdown
  const sortSelect = document.getElementById('products-sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentFilters.sort = e.target.value;
      renderProducts();
    });
  }

  // Budget radio or select
  const budgetSelect = document.getElementById('products-budget-select');
  if (budgetSelect) {
    budgetSelect.addEventListener('change', (e) => {
      const val = e.target.value;
      currentFilters.maxBudget = val === 'All' ? Infinity : Number(val);
      renderProducts();
    });
  }

  // Hero Search Form
  const heroForm = document.getElementById('hero-search-form');
  if (heroForm) {
    heroForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = document.getElementById('hero-search-query').value;
      const cat = document.getElementById('hero-search-category').value;
      const budget = document.getElementById('hero-search-budget').value;
      applyHeroSearch(q, cat, budget);
    });
  }

  // Hero Quick Tag Buttons
  const quickTags = document.querySelectorAll('.hero-quick-tag');
  quickTags.forEach(btn => {
    btn.addEventListener('click', () => {
      const tag = btn.dataset.tag;
      if (currentFilters.quickTag === tag) {
        currentFilters.quickTag = null;
        btn.classList.remove('is-active');
      } else {
        quickTags.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        currentFilters.quickTag = tag;
      }
      renderProducts();
      const targetSection = document.getElementById('explore-items');
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Clear filters button in empty states
  document.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'btn-clear-all-filters') {
      currentFilters = {
        category: 'All',
        searchQuery: '',
        maxBudget: Infinity,
        onlyAvailable: false,
        sort: 'featured',
        quickTag: null
      };
      if (searchInput) searchInput.value = '';
      if (sortSelect) sortSelect.value = 'featured';
      if (budgetSelect) budgetSelect.value = 'All';
      updateCategoryPillsUI('All');
      document.querySelectorAll('.hero-quick-tag').forEach(b => b.classList.remove('is-active'));
      renderProducts();
    }
  });
}

export function renderProducts() {
  const container = document.getElementById('products-grid-container');
  const countBadge = document.getElementById('products-count-badge');
  if (!container) return;

  let filtered = allProducts.filter(item => {
    // Category match
    if (currentFilters.category !== 'All' && item.category !== currentFilters.category) {
      return false;
    }
    // Budget match
    if (item.dailyRate > currentFilters.maxBudget) {
      return false;
    }
    // Search query match
    if (currentFilters.searchQuery) {
      const q = currentFilters.searchQuery;
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchCategory = item.category.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchOwner = item.owner.name.toLowerCase().includes(q);
      const matchTags = item.tags ? item.tags.some(t => t.toLowerCase().includes(q)) : false;
      if (!matchTitle && !matchCategory && !matchDesc && !matchOwner && !matchTags) {
        return false;
      }
    }
    // Quick Tag Match
    if (currentFilters.quickTag) {
      const qtag = currentFilters.quickTag.toLowerCase();
      const hasTag = item.tags ? item.tags.some(t => t.toLowerCase().includes(qtag)) : false;
      const matchCat = item.category.toLowerCase().includes(qtag);
      if (!hasTag && !matchCat) {
        return false;
      }
    }
    return true;
  });

  // Sorting
  if (currentFilters.sort === 'price-low') {
    filtered.sort((a, b) => a.dailyRate - b.dailyRate);
  } else if (currentFilters.sort === 'price-high') {
    filtered.sort((a, b) => b.dailyRate - a.dailyRate);
  } else {
    // featured: put featured items first
    filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  }

  if (countBadge) {
    countBadge.textContent = `${filtered.length} equipment item${filtered.length === 1 ? '' : 's'} found`;
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state-card" style="grid-column: 1 / -1; padding: 4rem 2rem; text-align: center; background-color: var(--c-ivory-warm); border-radius: var(--radius-lg); border: 1px dashed var(--c-sage);">
        <div style="width: 56px; height: 56px; margin: 0 auto 1.25rem; border-radius: 50%; background: var(--c-sage-light); color: var(--c-forest); display: flex; align-items: center; justify-content: center;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </div>
        <h3 style="font-family: var(--font-heading); font-size: 1.35rem; color: var(--c-forest); margin-bottom: 0.5rem;">No campus gear matched your search</h3>
        <p style="color: var(--c-charcoal-muted); font-size: 0.95rem; max-width: 500px; margin: 0 auto 1.5rem;">
          Try broadening your search term, selecting "All Equipment", or increasing the daily budget filter.
        </p>
        <button class="btn btn-primary" id="btn-clear-all-filters">
          Reset All Filters
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map((item, index) => {
    const isSaved = isWishlisted(item.id);
    // Editorial layout: first featured items get wider emphasis
    let colClass = "col-span-4";
    if (index === 0 && item.featured) {
      colClass = "col-span-6 is-spotlight";
    } else if (index === 1 && item.featured) {
      colClass = "col-span-6 is-spotlight";
    }

    return `
      <article class="product-card ${colClass}" data-id="${item.id}">
        <div class="product-card-media">
          <img src="${item.image}" alt="${item.title}" loading="lazy" />
          <span class="product-category-pill">${item.category}</span>
          <span class="demo-preview-tag">RGUKT Demo</span>
          <button class="product-wishlist-btn ${isSaved ? 'is-active' : ''}" data-wishlist-id="${item.id}" title="${isSaved ? 'Remove from Saved' : 'Save for Later'}" aria-label="Save ${item.title}">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="${isSaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
            </svg>
          </button>
          <div class="product-condition-tag">${item.condition}</div>
        </div>

        <div class="product-card-body">
          <div class="product-pickup-row">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            <span>${item.owner.pickupSpot}</span>
          </div>

          <h3 class="product-title" title="${item.title}">${item.title}</h3>
          
          <div class="product-owner-meta">
            <span class="owner-name-tag">${item.owner.name}</span>
            <span class="owner-dept-badge">${item.owner.dept}</span>
          </div>

          <p class="product-desc-snippet">${item.description}</p>

          <div class="product-card-footer">
            <div class="product-pricing-box">
              <div class="daily-price-wrap">
                <span class="price-val">₹${item.dailyRate}</span>
                <span class="price-unit">/day</span>
              </div>
              ${item.weeklyRate ? `<span class="weekly-price-tag">₹${item.weeklyRate}/week</span>` : ''}
            </div>

            <button class="btn btn-secondary btn-view-product" data-open-product="${item.id}">
              <span>View Details</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');

  // Bind View Details buttons
  container.querySelectorAll('[data-open-product]').forEach(btn => {
    btn.addEventListener('click', () => {
      openProductModal(btn.dataset.openProduct);
    });
  });

  // Bind Wishlist buttons
  container.querySelectorAll('[data-wishlist-id]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleWishlist(btn.dataset.wishlistId);
    });
  });
}
