document.addEventListener("DOMContentLoaded", () => {

  const products = document.querySelectorAll(".product-card");
  const priceRange = document.getElementById("priceRange");
  const priceValue = document.getElementById("priceValue");

  const allFilters = document.querySelectorAll(
    ".filter-brand, .filter-concentration, .filter-family, .filter-gender"
  );

  allFilters.forEach(f => f.addEventListener("change", applyFilters));
  priceRange.addEventListener("input", applyFilters);

  function getChecked(className) {
    return Array.from(document.querySelectorAll(className))
      .filter(f => f.checked)
      .map(f => f.value);
  }

  function applyFilters() {

    const brands = getChecked(".filter-brand");
    const concentrations = getChecked(".filter-concentration");
    const families = getChecked(".filter-family");
    const genders = getChecked(".filter-gender");
    const maxPrice = parseInt(priceRange.value);

    priceValue.textContent = maxPrice;

    products.forEach(product => {

      const brandMatch = brands.length === 0 || brands.includes(product.dataset.brand);
      const concentrationMatch = concentrations.length === 0 || concentrations.includes(product.dataset.concentration);
      const familyMatch = families.length === 0 || families.includes(product.dataset.family);
      const genderMatch = genders.length === 0 || genders.includes(product.dataset.gender);
      const priceMatch = parseInt(product.dataset.price) <= maxPrice;

      if (brandMatch && concentrationMatch && familyMatch && genderMatch && priceMatch) {
        product.style.opacity = "1";
        product.style.transform = "scale(1)";
        product.style.display = "block";
      } else {
        product.style.opacity = "0";
        product.style.transform = "scale(0.95)";
        setTimeout(() => product.style.display = "none", 200);
      }

    });

  }

});

function clearFilters() {
  document.querySelectorAll("input[type=checkbox]").forEach(f => f.checked = false);
  document.getElementById("priceRange").value = 20000;
  document.getElementById("priceValue").textContent = 20000;
  location.reload();
}

function openMenu() {
    document.getElementById("menuOverlay").classList.add("active");

    document.querySelectorAll("body > *:not(.menu-overlay)")
      .forEach(el => el.classList.add("page-blur"));

    const items = document.querySelectorAll(".menu-section li");

    items.forEach((item, index) => {
      item.style.opacity = "0";
      item.style.transform = "translateY(20px)";
      item.style.transition = "none";

      setTimeout(() => {
        item.style.transition = "all 0.5s ease";
        item.style.opacity = "1";
        item.style.transform = "translateY(0)";
      }, 200 + index * 120);
    });
  }

function closeMenu() {
  document.getElementById("menuOverlay").classList.remove("active");

  document.querySelectorAll(".page-blur")
    .forEach(el => el.classList.remove("page-blur"));
}
