// adding the scroll event to the explore collection button

document.addEventListener("DOMContentLoaded", () => {
  console.log("JS loaded!"); // Check if this shows in Console

  const btn = document.querySelector(".explore-btn");
  console.log("Button found:", btn); // Check if button detected

  if (btn) {
    btn.addEventListener("click", () => {
      console.log("Button clicked!");
      document
        .getElementById("shop-collect")
        .scrollIntoView({ behavior: "smooth" });
    });
  }
});

// adding the scroll event to the build your glow button

document.addEventListener("DOMContentLoaded", () => {
  console.log("JS loaded!"); // Check if this shows in Console

  const btn = document.querySelector(".glow");
  console.log("Button found:", btn); // Check if button detected

  if (btn) {
    btn.addEventListener("click", () => {
      console.log("Button clicked!");
      document
        .getElementById("decor-card-2")
        .scrollIntoView({ behavior: "smooth" });
    });
  }
});

// adding the scroll event to the shop all button

document.addEventListener("DOMContentLoaded", () => {
  console.log("JS loaded!"); // Check if this shows in Console

  const btn = document.querySelector(".shop-all");
  console.log("Button found:", btn); // Check if button detected

  if (btn) {
    btn.addEventListener("click", () => {
      console.log("Button clicked!");
      document
        .getElementById("collections-head")
        .scrollIntoView({ behavior: "smooth" });
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const exploreBtn = document.querySelector(".explore-btn");
  const glowBtn = document.querySelector(".glow");
  const shopAllBtn = document.querySelector(".shop-all");

  if (exploreBtn) {
    exploreBtn.addEventListener("click", () => {
      document
        .getElementById("shop-collect")
        .scrollIntoView({ behavior: "smooth" });
    });
  }

  if (glowBtn) {
    glowBtn.addEventListener("click", () => {
      document
        .getElementById("decor-card-2")
        .scrollIntoView({ behavior: "smooth" });
    });
  }

  if (shopAllBtn) {
    shopAllBtn.addEventListener("click", () => {
      document
        .getElementById("collections-head")
        .scrollIntoView({ behavior: "smooth" });
    });
  }

  // NEW: Modal functionality
  const modal = document.getElementById("productModal");
  const closeBtn = document.getElementById("closeModal");
  const modalBody = document.getElementById("modalBody");
  const products = document.querySelectorAll(".products[data-product]");

  // Open product modal
  products.forEach((product) => {
    product.addEventListener("click", async () => {
      const productFile = `./${product.dataset.product}`;

      try {
        const response = await fetch(productFile);
        const htmlContent = await response.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, "text/html");
        const mainContent = doc.querySelector(
          "main, #main, .product-detail, body > *:first-child",
        );

        modalBody.innerHTML = mainContent ? mainContent.outerHTML : htmlContent;
        const productName = product.querySelector("h3").textContent;
        const productPrice = product.querySelector(".prod-price").textContent;

        currentProduct = {
          name: productName,
          price: productPrice,
          file: product.dataset.product,
        };

        attachProductButtons();
        modal.style.display = "flex";
        document.body.style.overflow = "hidden"; // Prevent background scroll
      } catch (error) {
        modalBody.innerHTML = `
                    <h2>Oops!</h2>
                    <p>Product details not found. <br> Please check the file: ${productFile}</p>
                `;
        modal.style.display = "flex";
      }
    });
  });

  // Close modal
  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  function closeModal() {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  }
});

// Cart and wishlist storage
let cart = [];
let wishlist = [];

// Save to localStorage
function saveCart() {
  if (typeof Storage !== "undefined") {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
}

function saveWishlist() {
  if (typeof Storage !== "undefined") {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }
}

// Load from localStorage on page load
function loadCart() {
  if (typeof Storage !== "undefined") {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) cart = JSON.parse(savedCart);
  }
}

function loadWishlist() {
  if (typeof Storage !== "undefined") {
    const savedWishlist = localStorage.getItem("wishlist");
    if (savedWishlist) wishlist = JSON.parse(savedWishlist);
  }
}

// Load on page start
loadCart();
loadWishlist();

function updateCounters() {
  document.getElementById("cartCount").textContent = `Cart (${cart.length})`;
  document.getElementById("wishlistCount").textContent =
    `Wishlist (${wishlist.length})`;
}

let currentProduct = null;

function attachProductButtons() {
  const addToCartBtn = modalBody.querySelector(".add-to-cart");
  const wishlistBtn = modalBody.querySelector(".wishlist-btn");
  const buyNowBtn = modalBody.querySelector(".buy-now");

  if (addToCartBtn) {
    addToCartBtn.onclick = function (e) {
      e.stopPropagation();
      if (currentProduct) {
        cart.push({ ...currentProduct });
        saveCart();
        updateCounters();
        alert(`${currentProduct.name} added to cart`);
      }
    };
  }

  if (wishlistBtn) {
    wishlistBtn.onclick = function (e) {
      e.stopPropagation();
      if (currentProduct) {
        wishlist.push({ ...currentProduct });
        saveWishlist();
        updateCounters();
        alert(`${currentProduct.name} added to wishlist`);
      }
    };
  }

  if (buyNowBtn) {
    buyNowBtn.onclick = function (e) {
      e.stopPropagation();
      if (currentProduct) {
        alert(
          `Proceeding to buy ${currentProduct.name} for ${currentProduct.price}`,
        );
      }
    };
  }
}

// direct add-to-cart from product cards on main page
document.querySelectorAll(".products .add-to-cart").forEach((btn) => {
  btn.addEventListener("click", function (e) {
    e.stopPropagation();

    const productCard = this.closest(".products");
    const productName = productCard.querySelector("h3").textContent;
    const productPrice = productCard.querySelector(".prod-price").textContent;
    const productFile = productCard.dataset.product;

    const productData = {
      name: productName,
      price: productPrice,
      file: productFile,
    };

    cart.push(productData);
    saveCart();
    updateCounters();
    alert(`${productName} added to cart`);
  });
});

updateCounters();
