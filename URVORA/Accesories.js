// ============================================================
//  URVORA - Accessories Section | E-Commerce JavaScript
// ============================================================

// -----------------------------------------------
// 1. CART DATA
// -----------------------------------------------
let cart = [];

// -----------------------------------------------
// 2. WISHLIST DATA
// -----------------------------------------------
let wishlist = new Set();


// -----------------------------------------------
// 3. ADD TO CART
// -----------------------------------------------
function addToCart(name, price, img) {
    const existing = cart.find(item => item.name === name);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1, img });
    }
    updateCartCount();
    showToast(`${name} added to cart! 🛒`);
}


// -----------------------------------------------
// 4. BUY NOW
//    Adds item to cart then immediately opens
//    the cart modal at the checkout step.
// -----------------------------------------------
function buyNow(name, price, img) {
    // Add to cart (or bump quantity if already there)
    const existing = cart.find(item => item.name === name);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1, img });
    }
    updateCartCount();
    // Open cart so the user sees the checkout button immediately
    showCart();
}


// -----------------------------------------------
// 5. TOGGLE WISHLIST
// -----------------------------------------------
function toggleWishlist(name, btn) {
    if (wishlist.has(name)) {
        wishlist.delete(name);
        btn.textContent = "🤍";
        showToast(`${name} removed from wishlist`);
    } else {
        wishlist.add(name);
        btn.textContent = "❤️";
        showToast(`${name} added to wishlist! ❤️`);
    }
    updateWishlistCount();
}


// -----------------------------------------------
// 6. UPDATE CART COUNT BADGE
// -----------------------------------------------
function updateCartCount() {
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById("cart-count");
    if (badge) badge.textContent = total;
}


// -----------------------------------------------
// 7. UPDATE WISHLIST COUNT BADGE
// -----------------------------------------------
function updateWishlistCount() {
    const badge = document.getElementById("wishlist-count");
    if (badge) badge.textContent = wishlist.size;
}


// -----------------------------------------------
// 8. SHOW CART MODAL
// -----------------------------------------------
function showCart() {
    const modal = document.getElementById("cart-modal");
    const cartItemsDiv = document.getElementById("cart-items");
    const totalDiv = document.getElementById("cart-total");

    cartItemsDiv.innerHTML = "";

    if (cart.length === 0) {
        cartItemsDiv.innerHTML = "<p style='color:#888;text-align:center;padding:20px 0'>Your cart is empty.</p>";
        totalDiv.textContent = "";
    } else {
        let total = 0;
        cart.forEach(item => {
            total += item.price * item.quantity;
            cartItemsDiv.innerHTML += `
                <div class="cart-item-row">
                    <img src="${item.img}" alt="${item.name}" width="50" height="50"
                         style="border-radius:6px; object-fit:cover; flex-shrink:0;">
                    <div class="cart-item-info">
                        <p><strong>${item.name}</strong></p>
                        <p>₹${item.price.toLocaleString('en-IN')} × ${item.quantity}</p>
                    </div>
                    <div style="display:flex;flex-direction:column;gap:4px;align-items:flex-end">
                        <button class="remove-btn" onclick="removeFromCart('${item.name.replace(/'/g,"\\'")}')">✕</button>
                        <span style="font-size:12px;color:#888">₹${(item.price * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                </div>`;
        });
        totalDiv.textContent = `Total: ₹${total.toLocaleString('en-IN')}`;
    }

    modal.style.display = "flex";
}


// -----------------------------------------------
// 9. REMOVE ITEM FROM CART
// -----------------------------------------------
function removeFromCart(name) {
    cart = cart.filter(item => item.name !== name);
    updateCartCount();
    showCart();
}


// -----------------------------------------------
// 10. CLOSE CART MODAL
// -----------------------------------------------
function closeCart() {
    document.getElementById("cart-modal").style.display = "none";
}


// -----------------------------------------------
// 11. SHOW TOAST NOTIFICATION
// -----------------------------------------------
function showToast(message) {
    const old = document.getElementById("toast");
    if (old) old.remove();

    const toast = document.createElement("div");
    toast.id = "toast";
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.remove(), 2500);
}


// -----------------------------------------------
// 12. BUILD PRODUCT CARDS DYNAMICALLY
//     Injects Add to Cart, Buy Now, and Wishlist
//     buttons into every .items-card on the page.
// -----------------------------------------------
function setupProductCards() {
    const cards = document.querySelectorAll(".items-card");

    cards.forEach(card => {
        const imgEl = card.querySelector("img");
        const img = imgEl ? imgEl.src : "";
        const paragraphs = card.querySelectorAll("p");

        // First <p> is the product name
        const name = paragraphs[0]?.textContent.trim() || "Product";

        // Find the price paragraph (contains ₹)
        let price = 0;
        paragraphs.forEach(p => {
            if (p.textContent.includes("₹")) {
                const match = p.textContent.replace(/,/g, "").match(/₹(\d+)/);
                if (match) price = parseInt(match[1]);
            }
        });

        // Container for all three action buttons
        const actionsDiv = document.createElement("div");
        actionsDiv.className = "card-actions";

        // --- Add to Cart Button ---
        const cartBtn = document.createElement("button");
        cartBtn.className = "cart-btn";
        cartBtn.textContent = "🛒 Add to Cart";
        cartBtn.onclick = () => addToCart(name, price, img);

        // --- Buy Now Button ---
        const buyBtn = document.createElement("button");
        buyBtn.className = "buy-btn";
        buyBtn.textContent = "⚡ Buy Now";
        buyBtn.onclick = () => buyNow(name, price, img);

        // --- Wishlist Toggle Button ---
        const wishBtn = document.createElement("button");
        wishBtn.className = "wish-btn";
        wishBtn.textContent = "🤍";
        wishBtn.title = "Add to Wishlist";
        wishBtn.onclick = () => toggleWishlist(name, wishBtn);

        actionsDiv.appendChild(cartBtn);
        actionsDiv.appendChild(buyBtn);
        actionsDiv.appendChild(wishBtn);
        card.appendChild(actionsDiv);
    });
}


// -----------------------------------------------
// 13. SETUP NAV CART + WISHLIST BADGES
// -----------------------------------------------
function setupNavBadges() {
    const nav = document.querySelector(".main-navbar nav");
    if (!nav) return;

    const links = nav.querySelectorAll("a");
    links.forEach(link => {
        const text = link.textContent.trim();
        if (text === "Cart") {
            link.innerHTML = `Cart <span id="cart-count" class="badge">0</span>`;
            link.href = "#";
            link.onclick = (e) => { e.preventDefault(); showCart(); };
        }
        if (text === "Wishlist") {
            link.innerHTML = `Wishlist <span id="wishlist-count" class="badge">0</span>`;
        }
    });
}


// -----------------------------------------------
// 14. CREATE CART MODAL HTML
// -----------------------------------------------
function createCartModal() {
    const modal = document.createElement("div");
    modal.id = "cart-modal";
    modal.innerHTML = `
        <div class="cart-modal-box">
            <div class="cart-modal-header">
                <h3>🛒 Your Cart</h3>
                <button onclick="closeCart()" class="close-btn">✕</button>
            </div>
            <div id="cart-items"></div>
            <div id="cart-total"></div>
            <button class="checkout-btn" onclick="checkout()">Proceed to Checkout →</button>
        </div>`;
    // Close modal when clicking the dark overlay (outside the box)
    modal.addEventListener("click", (e) => {
        if (e.target === modal) closeCart();
    });
    document.body.appendChild(modal);
}


// -----------------------------------------------
// 15. CHECKOUT
// -----------------------------------------------
function checkout() {
    if (cart.length === 0) {
        showToast("Your cart is empty!");
        return;
    }
    alert("Thank you for shopping at URVORA! 🎉\nOrder placed successfully.");
    cart = [];
    updateCartCount();
    closeCart();
}


// -----------------------------------------------
// 16. INJECT STYLES FOR ALL DYNAMIC ELEMENTS
// -----------------------------------------------
function injectStyles() {
    const style = document.createElement("style");
    style.textContent = `
        /* Cart modal overlay */
        #cart-modal {
            display: none;
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 9999;
            justify-content: center;
            align-items: center;
        }

        /* Modal box */
        .cart-modal-box {
            background: #fff;
            border-radius: 12px;
            padding: 24px;
            width: 440px;
            max-width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        }

        /* Modal top row */
        .cart-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
        }

        /* Each cart item row */
        .cart-item-row {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 10px 0;
            border-bottom: 1px solid #eee;
        }
        .cart-item-info { flex: 1; font-size: 14px; }

        /* Remove button */
        .remove-btn {
            background: none;
            border: none;
            cursor: pointer;
            color: #999;
            font-size: 16px;
        }
        .remove-btn:hover { color: red; }

        /* Cart total */
        #cart-total {
            font-weight: bold;
            font-size: 18px;
            margin: 16px 0;
            text-align: right;
            color: #362517;
        }

        /* Close button */
        .close-btn {
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            color: #555;
        }

        /* Checkout button */
        .checkout-btn {
            width: 100%;
            padding: 12px;
            background: #362517;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 15px;
            cursor: pointer;
            margin-top: 8px;
        }
        .checkout-btn:hover { background: #5a3a1b; }

        /* Three-button row below each product card */
        .card-actions {
            display: flex;
            gap: 6px;
            margin-top: 12px;
            flex-wrap: wrap;
            justify-content: center;
        }

        /* Add to Cart button */
        .cart-btn {
            flex: 1;
            min-width: 110px;
            padding: 8px 6px;
            background: #362517;
            color: #fff;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 12px;
            font-family: Georgia, serif;
            transition: background 0.2s;
        }
        .cart-btn:hover { background: #5a3a1b; }

        /* Buy Now button */
        .buy-btn {
            flex: 1;
            min-width: 90px;
            padding: 8px 6px;
            background: #b87333;
            color: #fff;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 12px;
            font-family: Georgia, serif;
            transition: background 0.2s;
        }
        .buy-btn:hover { background: #d4873d; }

        /* Wishlist heart button */
        .wish-btn {
            padding: 8px 12px;
            background: #f5f0e8;
            border: 1px solid #c9b28c;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
            transition: background 0.2s;
        }
        .wish-btn:hover { background: #ffe0e0; border-color: #e08080; }

        /* Nav badge (number circle) */
        .badge {
            display: inline-block;
            background: #b87333;
            color: white;
            font-size: 11px;
            border-radius: 50%;
            padding: 2px 6px;
            margin-left: 4px;
            vertical-align: middle;
        }

        /* Toast notification */
        #toast {
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            background: #362517;
            color: #f3ede4;
            padding: 12px 24px;
            border-radius: 30px;
            font-size: 14px;
            font-family: Georgia, serif;
            z-index: 99999;
            white-space: nowrap;
            animation: fadeInOut 2.5s ease forwards;
        }

        @keyframes fadeInOut {
            0%   { opacity: 0; transform: translateX(-50%) translateY(10px); }
            15%  { opacity: 1; transform: translateX(-50%) translateY(0); }
            75%  { opacity: 1; }
            100% { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}


// -----------------------------------------------
// 17. INIT — Run everything when page loads
// -----------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    injectStyles();       // Step 1: Add CSS styles
    createCartModal();    // Step 2: Build cart popup
    setupNavBadges();     // Step 3: Add badges to Cart/Wishlist nav links
    setupProductCards();  // Step 4: Add buttons to every product card
});
