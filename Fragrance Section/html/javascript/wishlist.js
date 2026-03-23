const products = {
  "le-beau-paradise": {
    name: "Jean Paul Gaultier Le Beau Paradise Garden",
    price: "Rs. 8,999",
    image: "css/images/labeau.png",
  },
  "dior-sauvage": {
    name: "Dior Sauvage",
    price: "Rs. 11,999",
    image: "css/images/sauvage.png"
  },
  "ysl-y": {
    name: "YSL Y Eau De Parfum",
    price: "Rs. 13,899",
    image: "css/images/ysl.png"
  },

  "gypsy-water": {
    name: "Byredo Gypsy Water",
    price: "Rs. 19,499",
    image: "css/images/gypsy water.png"
  },
  "instant-crush": {
    name: "Mancera Instant Crush",
    price: "Rs. 17,499",
    image: "css/images/instant crush.png"
  },
  "burberry-her": {
    name: "Burberry Her",
    price: "Rs. 10,899",
    image: "css/images/her.png"
  },

  "coco-chanel": {
    name: "Coco Chanel",
    price: "Rs. 14,499",
    image: "css/images/coco.png"
  },
  "chanel-noir": {
    name: "Chanel Noir",
    price: "Rs. 13,499",
    image: "css/images/noir.png"
  },
  "date-woman": {
    name: "BELLAVITA Luxury Date Woman",
    price: "Rs. 2,999",
    image: "css/images/datewoman.png"
  },

  "dior-oud": {
    name: "Dior Oud Essence",
    price: "Rs. 16,499",
    image: "css/images/oud.png"
  },
  "oud-wood": {
    name: "Tom Ford Oud Wood",
    price: "Rs. 18,499",
    image: "css/images/oudwood.png"
  },
  "gucci-bloom": {
    name: "Gucci Bloom",
    price: "Rs. 12,499",
    image: "css/images/bloom.png"
  },

  "my-way": {
    name: "Armani My Way",
    price: "Rs. 13,199",
    image: "css/images/myway.png"
  },
  "one-million": {
    name: "1 Million Parfum",
    price: "Rs. 14,899",
    image: "css/images/million.png"
  },
  "versace-eros": {
    name: "Versace Eros",
    price: "Rs. 11,499",
    image: "css/images/eros.png"
  }
};

function loadWishlist() {
  const container = document.getElementById("wishlistContainer");
  const emptyState = document.getElementById("emptyState");

  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  container.innerHTML = "";

  if (wishlist.length === 0) {
    emptyState.style.display = "block";
    return;
  }

  emptyState.style.display = "none";

  wishlist.forEach(id => {
    if (products[id]) {
      const item = products[id];

      const card = document.createElement("div");
      card.classList.add("wishlist-card");

      card.innerHTML = `
        <img src="${item.image}" alt="">
        <h3>${item.name}</h3>
        <p>${item.price}</p>
        <button class="remove-btn" onclick="removeFromWishlist('${id}')">
          REMOVE
        </button>
      `;

      container.appendChild(card);
    }
  });
}

function removeFromWishlist(id) {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  wishlist = wishlist.filter(item => item !== id);
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  loadWishlist();
}

document.addEventListener("DOMContentLoaded", loadWishlist);