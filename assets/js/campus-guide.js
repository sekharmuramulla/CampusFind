/**
 * CampusFind Campus Discovery Module
 * Displays neighborhood essentials and transit proximity around Indian universities
 */

import { campusesData } from './data.js';
import { applyHeroSearch } from './search.js';

let activeCampusId = 'du';

export function initCampusGuide() {
  renderCampusTabs();
  renderActiveCampus();
}

function renderCampusTabs() {
  const tabsContainer = document.getElementById('campus-discovery-tabs');
  if (!tabsContainer) return;

  tabsContainer.innerHTML = campusesData.map(campus => `
    <button class="campus-tab-btn ${campus.id === activeCampusId ? 'is-active' : ''}" data-campus-id="${campus.id}">
      ${campus.shortName}
    </button>
  `).join('');

  tabsContainer.querySelectorAll('[data-campus-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      activeCampusId = btn.dataset.campusId;
      tabsContainer.querySelectorAll('.campus-tab-btn').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      renderActiveCampus();
    });
  });
}

function renderActiveCampus() {
  const displayContainer = document.getElementById('campus-discovery-display');
  if (!displayContainer) return;

  const campus = campusesData.find(c => c.id === activeCampusId) || campusesData[0];

  displayContainer.innerHTML = `
    <div class="campus-hub-info">
      <div class="campus-meta-pill">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
        ${campus.city} • ${campus.studentCount}
      </div>
      <h3 class="heading-subsection" style="color: var(--c-forest); margin-bottom: 0.5rem;">${campus.name}</h3>
      <p class="text-sm" style="color: var(--c-charcoal-muted);">${campus.badgeText}</p>

      <div class="campus-amenities-breakdown">
        ${campus.highlights.map(item => `
          <div class="amenity-category-card">
            <h4 class="amenity-cat-title">
              ${getCategoryIcon(item.icon)}
              ${item.category}
            </h4>
            <p class="amenity-cat-items">${item.items}</p>
          </div>
        `).join('')}
      </div>

      <div style="margin-top: 2rem; display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;">
        <button class="btn btn-primary" id="btn-view-campus-stays" data-college-query="${campus.name}">
          Browse Stays Near ${campus.shortName}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
        </button>
        <span class="text-xs" style="color: var(--c-charcoal-muted);">Real transit estimates • 0 Brokerage</span>
      </div>
    </div>

    <div class="campus-hub-visual">
      <img src="${campus.image}" alt="${campus.name} collegiate atmosphere" loading="lazy" />
      <div class="campus-visual-overlay">
        <span class="badge-editorial" style="align-self: flex-start; margin-bottom: 0.5rem;">Campus Radar</span>
        <h4 style="font-family: var(--font-heading); font-size: 1.15rem; color: var(--c-white); font-weight: 700;">
          Everything you need within a 10-minute walk.
        </h4>
        <p style="font-size: 0.8125rem; color: var(--c-sage); margin-top: 0.25rem;">
          Verified walking distance to campus gates, libraries, and transport hubs.
        </p>
      </div>
    </div>
  `;

  const btnStays = displayContainer.querySelector('#btn-view-campus-stays');
  if (btnStays) {
    btnStays.addEventListener('click', () => {
      applyHeroSearch(campus.name, 'All', 'All');
    });
  }
}

function getCategoryIcon(iconName) {
  if (iconName === 'coffee') {
    return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" x2="6" y1="2" y2="4"/><line x1="10" x2="10" y1="2" y2="4"/><line x1="14" x2="14" y1="2" y2="4"/></svg>`;
  }
  if (iconName === 'book-open') {
    return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`;
  }
  if (iconName === 'shopping-bag') {
    return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`;
  }
  return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`;
}
