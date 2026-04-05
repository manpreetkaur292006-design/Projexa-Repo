// ============================================================
//  URVORA - Accessories Section | E-Commerce JavaScript
// ============================================================

// -----------------------------------------------
// 1. CART DATA
//    We store cart items in an array.
//    Each item: { name, price, quantity, img }
// -----------------------------------------------
let cart = [];

// -----------------------------------------------
// 2. WISHLIST DATA
//    We store wishlist item names in a Set
//    (a Set avoids duplicates automatically)
// -----------------------------------------------
let wishlist = new Set();


// -----------------------------------------------
// 3. ADD TO CART
//    Called when user clicks "Add to Cart" button.
//    Finds if item already exists → increase qty,
//    otherwise push a new entry.
// -----------------------------------------------
function addToCart(name, price, img) {
    // Check if item already in cart
    const existing = cart.find(item => item.name === name);

    if (existing) {
        existing.quantity += 1; // Increase quantity
    } else {
        cart.push({ name, price, quantity: 1, img }); // Add new item
    }

    updateCartCount();  // Refresh cart badge number
    showToast(`${name} added to cart! 🛒`); // Show a small popup message
}


// -----------------------------------------------
// 4. ADD TO WISHLIST
//    Toggles item in/out of the wishlist.
//    Heart button turns red when item is wished.
// -----------------------------------------------
function toggleWishlist(name, btn) {
    if (wishlist.has(name)) {
        wishlist.delete(name);          // Remove from wishlist
        btn.textContent = "🤍";         // Empty heart
        showToast(`${name} removed from wishlist`);
    } else {
        wishlist.add(name);             // Add to wishlist
        btn.textContent = "❤️";         // Red heart
        showToast(`${name} added to wishlist! 🤍`);
    }

    updateWishlistCount(); // Refresh wishlist badge
}


// -----------------------------------------------
// 5. UPDATE CART COUNT BADGE
//    Shows total number of items in cart
//    next to the "Cart" nav link.
// -----------------------------------------------
function updateCartCount() {
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById("cart-count");
    if (badge) badge.textContent = total;
}


// -----------------------------------------------
// 6. UPDATE WISHLIST COUNT BADGE
// -----------------------------------------------
function updateWishlistCount() {
    const badge = document.getElementById("wishlist-count");
    if (badge) badge.textContent = wishlist.size;
}


// -----------------------------------------------
// 7. SHOW CART MODAL
//    Opens a popup showing all cart items,
//    their quantities, and total price.
// -----------------------------------------------
function showCart() {
    const modal = document.getElementById("cart-modal");
    const cartItemsDiv = document.getElementById("cart-items");
    const totalDiv = document.getElementById("cart-total");

    cartItemsDiv.innerHTML = ""; // Clear previous content

    if (cart.length === 0) {
        cartItemsDiv.innerHTML = "<p>Your cart is empty.</p>";
        totalDiv.textContent = "";
    } else {
        let total = 0;

        cart.forEach(item => {
            total += item.price * item.quantity;

            // Create a row for each cart item
            cartItemsDiv.innerHTML += `
                <div class="cart-item-row">
                    <img src="${item.img}" alt="${item.name}" width="50" height="50" style="border-radius:6px; object-fit:cover;">
                    <div class="cart-item-info">
                        <p><strong>${item.name}</strong></p>
                        <p>₹${item.price.toLocaleString()} × ${item.quantity}</p>
                    </div>
                    <button class="remove-btn" onclick="removeFromCart('${item.name}')">✕</button>
                </div>`;
        });

        totalDiv.textContent = `Total: ₹${total.toLocaleString()}`;
    }

    modal.style.display = "flex"; // Show modal
}


// -----------------------------------------------
// 8. REMOVE ITEM FROM CART
// -----------------------------------------------
function removeFromCart(name) {
    cart = cart.filter(item => item.name !== name); // Keep all items except removed one
    updateCartCount();
    showCart(); // Refresh the modal
}


// -----------------------------------------------
// 9. CLOSE CART MODAL
// -----------------------------------------------
function closeCart() {
    document.getElementById("cart-modal").style.display = "none";
}


// -----------------------------------------------
// 10. SHOW TOAST NOTIFICATION
//     A small message that appears and fades away.
// -----------------------------------------------
function showToast(message) {
    // Remove any existing toast first
    const old = document.getElementById("toast");
    if (old) old.remove();

    const toast = document.createElement("div");
    toast.id = "toast";
    toast.textContent = message;
    document.body.appendChild(toast);

    // Fade out after 2.5 seconds
    setTimeout(() => toast.remove(), 2500);
}


// -----------------------------------------------
// 11. BUILD PRODUCT CARDS DYNAMICALLY
//     This reads product data and injects
//     "Add to Cart" + Wishlist buttons into
//     each .items-card on the page.
// -----------------------------------------------
function setupProductCards() {
    const cards = document.querySelectorAll(".items-card");

    cards.forEach(card => {
        // Get product info from existing HTML
        const img = card.querySelector("img")?.src || "";
        const paragraphs = card.querySelectorAll("p");

        // First <p> is the product name
        const name = paragraphs[0]?.textContent.trim() || "Product";

        // Find the price paragraph (contains ₹)
        let price = 0;
        paragraphs.forEach(p => {
            if (p.textContent.includes("₹")) {
                // Extract only the number from price text like "Price- ₹7,250"
                const match = p.textContent.replace(/,/g, "").match(/₹(\d+)/);
                if (match) price = parseInt(match[1]);
            }
        });

        // Create action buttons container
        const actionsDiv = document.createElement("div");
        actionsDiv.className = "card-actions";

        // --- Add to Cart Button ---
        const cartBtn = document.createElement("button");
        cartBtn.className = "cart-btn";
        cartBtn.textContent = "🛒 Add to Cart";
        cartBtn.onclick = () => addToCart(name, price, img);

        // --- Wishlist Toggle Button ---
        const wishBtn = document.createElement("button");
        wishBtn.className = "wish-btn";
        wishBtn.textContent = "🤍";
        wishBtn.title = "Add to Wishlist";
        wishBtn.onclick = () => toggleWishlist(name, wishBtn);

        actionsDiv.appendChild(cartBtn);
        actionsDiv.appendChild(wishBtn);
        card.appendChild(actionsDiv); // Add buttons to card
    });
}


// -----------------------------------------------
// 12. SETUP NAV CART + WISHLIST BADGES
//     Adds a small number badge to Cart and
//     Wishlist links in the top nav bar.
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
// 13. CREATE CART MODAL HTML
//     Injects the cart popup into the page.
//     Styled via inline styles (no extra CSS file needed).
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
    document.body.appendChild(modal);
}


// -----------------------------------------------
// 14. CHECKOUT (placeholder)
//     You can later connect this to a payment page.
// -----------------------------------------------
function checkout() {
    if (cart.length === 0) {
        showToast("Your cart is empty!");
        return;
    }
    alert("Thank you for shopping at URVORA! 🎉\nOrder placed successfully.");
    cart = [];           // Clear cart after order
    updateCartCount();
    closeCart();
}


// -----------------------------------------------
// 15. INJECT STYLES FOR NEW ELEMENTS
//     Add CSS for cart modal, badges, buttons,
//     and toast — all from JS so you don't need
//     to change your CSS file.
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
            width: 420px;
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
            background: #222;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 15px;
            cursor: pointer;
        }
        .checkout-btn:hover { background: #444; }

        /* Action buttons below each card */
        .card-actions {
            display: flex;
            gap: 8px;
            margin-top: 10px;
        }

        /* Add to Cart button */
        .cart-btn {
            flex: 1;
            padding: 8px;
            background: #222;
            color: #fff;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 13px;
        }
        .cart-btn:hover { background: #444; }

        /* Wishlist heart button */
        .wish-btn {
            padding: 8px 12px;
            background: #f5f5f5;
            border: 1px solid #ddd;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
        }
        .wish-btn:hover { background: #ffe0e0; }

        /* Nav badge (number circle) */
        .badge {
            display: inline-block;
            background: red;
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
            background: #222;
            color: #fff;
            padding: 12px 24px;
            border-radius: 30px;
            font-size: 14px;
            z-index: 99999;
            animation: fadeInOut 2.5s ease forwards;
        }

        /* Toast fade animation */
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
// 16. INIT — Run everything when page loads
// -----------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    injectStyles();       // Step 1: Add CSS styles
    createCartModal();    // Step 2: Build cart popup
    setupNavBadges();     // Step 3: Add badges to Cart/Wishlist nav links
    setupProductCards();  // Step 4: Add buttons to every product card
});