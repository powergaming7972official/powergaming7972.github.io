"use strict";

/* =====================================
   Search & Filter System
===================================== */

const initSearchAndFilters = () => {
  /* =====================================
     Configuration
  ===================================== */

  const SELECTORS = {
    searchInput: "#searchInput",
    filterButton: ".filter-btn",
    cards: ".livery-card, .mod-card, .download-card",
    resultCount: "#searchResultCount, .search-result-count",
    noResults: "#noResults, .no-results",
    clearButton: "#clearSearch, .clear-search",
  };

  const CLASSES = {
    active: "active",
    hidden: "is-hidden",
    visible: "is-visible",
  };

  const DEFAULT_CATEGORY = "all";
  const SEARCH_DEBOUNCE_MS = 120;

  /* =====================================
     DOM Cache
  ===================================== */

  const searchInput = document.querySelector(SELECTORS.searchInput);
  const filterButtons = Array.from(document.querySelectorAll(SELECTORS.filterButton));
  const cards = Array.from(document.querySelectorAll(SELECTORS.cards));
  const resultCount = document.querySelector(SELECTORS.resultCount);
  const noResults = document.querySelector(SELECTORS.noResults);
  const clearButton = document.querySelector(SELECTORS.clearButton);

  if (!searchInput && !filterButtons.length) return;
  if (!cards.length) return;

  /* =====================================
     State
  ===================================== */

  let activeCategory = DEFAULT_CATEGORY;
  let debounceTimer = null;

  /* =====================================
     Helpers
  ===================================== */

  const normalizeText = (value = "") =>
    String(value).toLowerCase().trim().replace(/\s+/g, " ");

  const getButtonCategory = (button) =>
    normalizeText(button?.dataset.filter || button?.dataset.category || button?.textContent || DEFAULT_CATEGORY);

  const getCardCategory = (card) =>
    normalizeText(card?.dataset.category || DEFAULT_CATEGORY);

  const getCardSearchText = (card) => {
    const directSearchText = card.dataset.search;
    const title = card.querySelector(".title, .card-title, h1, h2, h3")?.textContent || "";
    const description = card.querySelector(".description, .card-description, p")?.textContent || "";
    const category = card.dataset.category || card.querySelector(".category, .card-category")?.textContent || "";
    const badges = Array.from(card.querySelectorAll(".badge, .tag"))
      .map((badge) => badge.textContent)
      .join(" ");

    return normalizeText(
      directSearchText || `${title} ${description} ${category} ${badges} ${card.textContent}`
    );
  };

  const cardData = cards.map((card) => ({
    element: card,
    searchText: getCardSearchText(card),
    category: getCardCategory(card),
  }));

  const setCardVisibility = (card, isVisible) => {
    card.classList.toggle(CLASSES.hidden, !isVisible);
    card.classList.toggle(CLASSES.visible, isVisible);
    card.hidden = !isVisible;
  };

  const updateActiveButton = (selectedButton) => {
    filterButtons.forEach((button) => {
      const isActive = button === selectedButton;
      button.classList.toggle(CLASSES.active, isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  };

  const updateResultCount = (visibleCount) => {
    if (!resultCount) return;

    const label = visibleCount === 1 ? "result" : "results";
    resultCount.textContent = `${visibleCount} ${label} found`;
  };

  const updateNoResults = (visibleCount) => {
    if (!noResults) return;

    const hasNoResults = visibleCount === 0;
    noResults.hidden = !hasNoResults;
    noResults.classList.toggle(CLASSES.visible, hasNoResults);
  };

  const updateClearButton = () => {
    if (!clearButton || !searchInput) return;

    const hasSearchValue = normalizeText(searchInput.value).length > 0;
    clearButton.hidden = !hasSearchValue;
    clearButton.disabled = !hasSearchValue;
  };

  const applyFilters = () => {
    const searchValue = normalizeText(searchInput?.value || "");
    let visibleCount = 0;

    cardData.forEach(({ element, searchText, category }) => {
      const matchesSearch = !searchValue || searchText.includes(searchValue);
      const matchesCategory =
        activeCategory === DEFAULT_CATEGORY || category.includes(activeCategory);
      const isVisible = matchesSearch && matchesCategory;

      if (isVisible) visibleCount += 1;
      setCardVisibility(element, isVisible);
    });

    updateResultCount(visibleCount);
    updateNoResults(visibleCount);
    updateClearButton();
  };

  const debounceApplyFilters = () => {
    window.clearTimeout(debounceTimer);
    debounceTimer = window.setTimeout(applyFilters, SEARCH_DEBOUNCE_MS);
  };

  const clearSearch = () => {
    if (!searchInput) return;

    searchInput.value = "";
    applyFilters();
    searchInput.focus();
  };

  const setInitialActiveCategory = () => {
    if (!filterButtons.length) return;

    const initiallyActiveButton =
      filterButtons.find((button) => button.classList.contains(CLASSES.active)) ||
      filterButtons.find((button) => getButtonCategory(button) === DEFAULT_CATEGORY) ||
      filterButtons[0];

    activeCategory = getButtonCategory(initiallyActiveButton);
    updateActiveButton(initiallyActiveButton);
  };

  /* =====================================
     Events
  ===================================== */

  searchInput?.addEventListener("input", debounceApplyFilters);

  searchInput?.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && searchInput.value) {
      clearSearch();
    }
  });

  clearButton?.addEventListener("click", clearSearch);

  filterButtons.forEach((button) => {
    button.setAttribute("type", "button");
    button.setAttribute("aria-pressed", "false");

    button.addEventListener("click", () => {
      activeCategory = getButtonCategory(button);
      updateActiveButton(button);
      applyFilters();
    });
  });

  /* =====================================
     Initial Render
  ===================================== */

  setInitialActiveCategory();
  applyFilters();
};

/* =====================================
   Initialize
===================================== */

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSearchAndFilters, { once: true });
} else {
  initSearchAndFilters();
}