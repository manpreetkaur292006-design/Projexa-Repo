// ============================================================
//  URVORA — E-Commerce JS  |  Fully Debugged + Search Added
//  Fixes: innerHTML+=, apostrophe crash, wishlist modal,
//         qty controls, z-index shimmer, double-inject guard,
//         alert() removed, heart state restore
//  Added: Live search with result highlighting & navigation
// ============================================================

// ─── STATE ──────────────────────────────────────────────────
let cart     = JSON.parse(localStorage.getItem('urvora_cart')    || '[]');
let wishlist = new Set(JSON.parse(localStorage.getItem('urvora_wish') || '[]'));

// ─── PERSIST ────────────────────────────────────────────────
function saveState() {
    try {
        localStorage.setItem('urvora_cart', JSON.stringify(cart));
        localStorage.setItem('urvora_wish', JSON.stringify([...wishlist]));
    } catch(e) { /* private browsing fallback */ }
}

// ─── PRICE EXTRACTION ───────────────────────────────────────
function extractPrice(card) {
    const ps = [...card.querySelectorAll('p')];
    for (let i = ps.length - 1; i >= 0; i--) {
        if (ps[i].textContent.includes('₹')) {
            const match = ps[i].textContent.replace(/,/g, '').match(/₹(\d+)/);
            if (match) return parseInt(match[1], 10);
        }
    }
    return 0;
}

// ─── ADD TO CART ─────────────────────────────────────────────
function addToCart(name, price, img) {
    const existing = cart.find(i => i.name === name);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1, img });
    }
    saveState();
    updateCartCount();
    showToast(`Added to cart — ${name}`);
}

// ─── BUY NOW ─────────────────────────────────────────────────
function buyNow(name, price, img) {
    addToCart(name, price, img);
    setTimeout(() => showCart(), 150);
}

// ─── CHANGE QTY IN CART ──────────────────────────────────────
function changeQty(index, delta) {
    if (!cart[index]) return;
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) cart.splice(index, 1);
    saveState();
    updateCartCount();
    renderCartItems();
}

// ─── REMOVE FROM CART ────────────────────────────────────────
function removeFromCart(index) {
    cart.splice(index, 1);
    saveState();
    updateCartCount();
    renderCartItems();
}

// ─── TOGGLE WISHLIST ─────────────────────────────────────────
function toggleWishlist(name, img, btn) {
    if (wishlist.has(name)) {
        wishlist.delete(name);
        if (btn) btn.textContent = '🤍';
        showToast(`Removed from wishlist — ${name}`);
    } else {
        wishlist.add(name);
        if (btn) btn.textContent = '❤️';
        showToast(`Added to wishlist — ${name}`);
    }
    saveState();
    updateWishlistCount();
    syncWishlistIcons();
}

function syncWishlistIcons() {
    document.querySelectorAll('.wish-btn').forEach(btn => {
        btn.textContent = wishlist.has(btn.dataset.name) ? '❤️' : '🤍';
    });
}

// ─── BADGE COUNTERS ──────────────────────────────────────────
function updateCartCount() {
    const total = cart.reduce((s, i) => s + i.quantity, 0);
    const badge = document.getElementById('cart-count');
    if (badge) badge.textContent = total;
}

function updateWishlistCount() {
    const badge = document.getElementById('wishlist-count');
    if (badge) badge.textContent = wishlist.size;
}

// ─── CART MODAL ──────────────────────────────────────────────
function showCart() {
    document.getElementById('cart-modal').style.display = 'flex';
    renderCartItems();
}

function closeCart() {
    document.getElementById('cart-modal').style.display = 'none';
}

function renderCartItems() {
    const itemsDiv = document.getElementById('cart-items');
    const totalDiv = document.getElementById('cart-total');
    if (!itemsDiv) return;

    if (cart.length === 0) {
        itemsDiv.innerHTML = `
            <div style="text-align:center;padding:32px 0;color:#9a7550">
                <div style="font-size:36px;margin-bottom:10px">🛒</div>
                <p style="font-family:'Cinzel',Georgia,serif;font-size:12px;letter-spacing:.15em">
                    YOUR CART IS EMPTY
                </p>
            </div>`;
        totalDiv.textContent = '';
        return;
    }

    let total = 0;
    const rows = cart.map((item, idx) => {
        total += item.price * item.quantity;
        return `
        <div class="cart-item-row">
            <img src="${escHtml(item.img)}" alt="${escHtml(item.name)}"
                 width="56" height="56"
                 style="border-radius:4px;object-fit:cover;flex-shrink:0;
                        box-shadow:2px 2px 0 #c9a84c">
            <div class="cart-item-info">
                <strong>${escHtml(item.name)}</strong>
                <span>₹${item.price.toLocaleString('en-IN')}</span>
            </div>
            <div class="qty-controls">
                <button class="qty-btn" data-action="dec" data-index="${idx}">−</button>
                <span class="qty-num">${item.quantity}</span>
                <button class="qty-btn" data-action="inc" data-index="${idx}">+</button>
            </div>
            <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;min-width:72px">
                <button class="remove-btn" data-index="${idx}">✕</button>
                <span style="font-size:12px;color:#9a7530;font-family:'Cinzel',Georgia,serif;letter-spacing:.05em">
                    ₹${(item.price * item.quantity).toLocaleString('en-IN')}
                </span>
            </div>
        </div>`;
    });

    itemsDiv.innerHTML = rows.join('');
    totalDiv.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center">
            <span style="font-size:13px;color:#9a7550;letter-spacing:.05em">
                ${cart.reduce((s,i)=>s+i.quantity,0)} item(s)
            </span>
            <span>Total: ₹${total.toLocaleString('en-IN')}</span>
        </div>`;

    itemsDiv.querySelectorAll('.qty-btn').forEach(btn => {
        btn.onclick = () => {
            const idx   = parseInt(btn.dataset.index, 10);
            const delta = btn.dataset.action === 'inc' ? 1 : -1;
            changeQty(idx, delta);
        };
    });
    itemsDiv.querySelectorAll('.remove-btn').forEach(btn => {
        btn.onclick = () => removeFromCart(parseInt(btn.dataset.index, 10));
    });
}

// HTML-escape helper
function escHtml(str) {
    return String(str)
        .replace(/&/g,'&amp;')
        .replace(/</g,'&lt;')
        .replace(/>/g,'&gt;')
        .replace(/"/g,'&quot;')
        .replace(/'/g,'&#39;');
}

// ─── WISHLIST MODAL ──────────────────────────────────────────
function showWishlist() {
    document.getElementById('wish-modal').style.display = 'flex';
    renderWishlistItems();
}

function closeWishlist() {
    document.getElementById('wish-modal').style.display = 'none';
}

function renderWishlistItems() {
    const container = document.getElementById('wish-items');
    if (!container) return;

    if (wishlist.size === 0) {
        container.innerHTML = `
            <div style="text-align:center;padding:32px 0;color:#9a7550">
                <div style="font-size:36px;margin-bottom:10px">🤍</div>
                <p style="font-family:'Cinzel',Georgia,serif;font-size:12px;letter-spacing:.15em">
                    YOUR WISHLIST IS EMPTY
                </p>
            </div>`;
        return;
    }

    const rows = [...wishlist].map(name => {
        let img = '', price = 0;
        document.querySelectorAll('.items-card').forEach(card => {
            const cardName = card.querySelector('p')?.textContent.trim();
            if (cardName === name) {
                img   = card.querySelector('img')?.src || '';
                price = extractPrice(card);
            }
        });
        return `
        <div class="wish-item-row">
            ${img ? `<img src="${escHtml(img)}" alt="${escHtml(name)}"
                         width="56" height="56"
                         style="border-radius:4px;object-fit:cover;flex-shrink:0;
                                box-shadow:2px 2px 0 #c9a84c">` : ''}
            <div class="cart-item-info">
                <strong>${escHtml(name)}</strong>
                ${price ? `<span>₹${price.toLocaleString('en-IN')}</span>` : ''}
            </div>
            <div style="display:flex;gap:6px">
                <button class="wish-move-btn mini-cart-btn"
                        data-name="${escHtml(name)}"
                        data-price="${price}"
                        data-img="${escHtml(img)}">🛒</button>
                <button class="wish-remove-btn remove-btn"
                        data-name="${escHtml(name)}">✕</button>
            </div>
        </div>`;
    });

    container.innerHTML = rows.join('');

    container.querySelectorAll('.wish-move-btn').forEach(btn => {
        btn.title = 'Move to cart';
        btn.onclick = () => {
            addToCart(btn.dataset.name, parseInt(btn.dataset.price||'0',10), btn.dataset.img);
        };
    });
    container.querySelectorAll('.wish-remove-btn').forEach(btn => {
        btn.onclick = () => {
            wishlist.delete(btn.dataset.name);
            saveState();
            updateWishlistCount();
            syncWishlistIcons();
            renderWishlistItems();
        };
    });
}

// ─── CHECKOUT ────────────────────────────────────────────────
function checkout() {
    if (cart.length === 0) {
        showToast('Your cart is empty!');
        return;
    }

    const box = document.querySelector('.cart-modal-box');
    const original = box.innerHTML;

    box.innerHTML = `
        <div style="text-align:center;padding:40px 20px">
            <div style="font-size:48px;margin-bottom:16px">🎉</div>
            <h3 style="font-family:'Cinzel',Georgia,serif;font-size:16px;
                       letter-spacing:.2em;color:#1a0f07;margin-bottom:12px">
                ORDER CONFIRMED
            </h3>
            <p style="font-family:'EB Garamond',Georgia,serif;font-size:16px;
                      color:#6b4a2b;line-height:1.8;margin-bottom:28px">
                Thank you for shopping at URVORA.<br>
                Your order has been placed successfully.
            </p>
            <button onclick="confirmClose()"
                    style="background:#1a0f07;color:#e8cc7a;border:none;
                           padding:12px 32px;font-family:'Cinzel',Georgia,serif;
                           font-size:11px;letter-spacing:.2em;cursor:pointer">
                CONTINUE SHOPPING
            </button>
        </div>`;

    window._originalCartBox = original;
    cart = [];
    saveState();
    updateCartCount();
}

function confirmClose() {
    closeCart();
    setTimeout(() => {
        const box = document.querySelector('.cart-modal-box');
        if (box && window._originalCartBox) box.innerHTML = window._originalCartBox;
    }, 300);
}

// ─── TOAST ───────────────────────────────────────────────────
function showToast(message) {
    const old = document.getElementById('toast');
    if (old) old.remove();
    const toast = document.createElement('div');
    toast.id = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => { if (toast.parentNode) toast.remove(); }, 2600);
}

// ─── SETUP PRODUCT CARDS ─────────────────────────────────────
function setupProductCards() {
    document.querySelectorAll('.items-card').forEach(card => {
        if (card.querySelector('.card-actions')) return;

        const img   = card.querySelector('img')?.src || '';
        const name  = card.querySelector('p')?.textContent.trim() || 'Product';
        const price = extractPrice(card);

        const div = document.createElement('div');
        div.className = 'card-actions';

        const cartBtn = document.createElement('button');
        cartBtn.className = 'cart-btn';
        cartBtn.textContent = '🛒 Add to Cart';
        cartBtn.onclick = () => addToCart(name, price, img);

        const buyBtn = document.createElement('button');
        buyBtn.className = 'buy-btn';
        buyBtn.textContent = '⚡ Buy Now';
        buyBtn.onclick = () => buyNow(name, price, img);

        const wishBtn = document.createElement('button');
        wishBtn.className = 'wish-btn';
        wishBtn.dataset.name = name;
        wishBtn.title = 'Add to Wishlist';
        wishBtn.textContent = wishlist.has(name) ? '❤️' : '🤍';
        wishBtn.onclick = () => toggleWishlist(name, img, wishBtn);

        div.appendChild(cartBtn);
        div.appendChild(buyBtn);
        div.appendChild(wishBtn);
        card.appendChild(div);
    });
}

// ─── NAV BADGES ──────────────────────────────────────────────
function setupNavBadges() {
    const nav = document.querySelector('.main-navbar nav');
    if (!nav) return;

    nav.querySelectorAll('a').forEach(link => {
        const text = link.textContent.trim();

        if (text === 'Cart') {
            link.innerHTML = `Cart <span id="cart-count" class="badge">0</span>`;
            link.href = '#';
            link.onclick = e => { e.preventDefault(); showCart(); };
        }

        if (text === 'Wishlist') {
            link.innerHTML = `Wishlist <span id="wishlist-count" class="badge">0</span>`;
            link.href = '#';
            link.onclick = e => { e.preventDefault(); showWishlist(); };
        }

        // ── NEW: wire up the Search nav link ──
        if (text === 'Search') {
            link.href = '#';
            link.onclick = e => { e.preventDefault(); showSearch(); };
        }
    });
}

// ─── SEARCH ──────────────────────────────────────────────────

function showSearch() {
    document.getElementById('search-modal').style.display = 'flex';
    const input = document.getElementById('search-input');
    input.value = '';
    renderSearchResults('');
    // Small delay to let modal render before focusing
    setTimeout(() => input.focus(), 80);
}

function closeSearch() {
    document.getElementById('search-modal').style.display = 'none';
    clearSearchHighlights();
}

// Collect all product cards into a searchable index once
function buildSearchIndex() {
    const index = [];
    document.querySelectorAll('.items-card').forEach(card => {
        const nameEl  = card.querySelector('p');
        const img     = card.querySelector('img');
        const price   = extractPrice(card);
        const name    = nameEl?.textContent.trim() || '';
        // Determine category from the closest <section> heading
        const section = card.closest('section');
        const category = section?.querySelector('h2')?.textContent.trim() || '';

        if (name) {
            index.push({ name, price, img: img?.src || '', category, card });
        }
    });
    return index;
}

function renderSearchResults(query) {
    const container = document.getElementById('search-results');
    if (!container) return;

    clearSearchHighlights();

    const trimmed = query.trim().toLowerCase();

    if (!trimmed) {
        container.innerHTML = `
            <div class="search-empty">
                <div style="font-size:32px;margin-bottom:10px">🔍</div>
                <p>Start typing to search watches &amp; jewellery…</p>
            </div>`;
        return;
    }

    const index   = buildSearchIndex();
    const matches = index.filter(item =>
        item.name.toLowerCase().includes(trimmed) ||
        item.category.toLowerCase().includes(trimmed)
    );

    if (matches.length === 0) {
        container.innerHTML = `
            <div class="search-empty">
                <div style="font-size:32px;margin-bottom:10px">😔</div>
                <p style="font-family:'Cinzel',Georgia,serif;font-size:11px;letter-spacing:.15em">
                    NO RESULTS FOR "${escHtml(query.trim().toUpperCase())}"
                </p>
            </div>`;
        return;
    }

    const rows = matches.map((item, i) => `
        <div class="search-result-row" data-index="${i}">
            ${item.img
                ? `<img src="${escHtml(item.img)}" alt="${escHtml(item.name)}"
                        width="52" height="52"
                        style="border-radius:3px;object-fit:cover;flex-shrink:0;
                               box-shadow:2px 2px 0 #c9a84c">`
                : ''}
            <div class="search-result-info">
                <strong>${highlightMatch(item.name, trimmed)}</strong>
                <span class="search-category">${escHtml(item.category)}</span>
                ${item.price ? `<span class="search-price">₹${item.price.toLocaleString('en-IN')}</span>` : ''}
            </div>
            <button class="search-goto-btn" data-index="${i}" title="View product">→</button>
        </div>`
    ).join('');

    container.innerHTML = `
        <p class="search-count">${matches.length} result${matches.length !== 1 ? 's' : ''} found</p>
        ${rows}`;

    // Bind click: close modal, scroll to card, flash highlight
    container.querySelectorAll('.search-result-row, .search-goto-btn').forEach(el => {
        el.onclick = () => {
            const idx  = parseInt(el.dataset.index, 10);
            const item = matches[idx];
            closeSearch();
            setTimeout(() => {
                item.card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                item.card.classList.add('search-highlight');
                setTimeout(() => item.card.classList.remove('search-highlight'), 2000);
            }, 200);
        };
    });
}

// Wrap matched text in a <mark> for highlighting
function highlightMatch(text, query) {
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return escHtml(text).replace(
        new RegExp(`(${escaped})`, 'gi'),
        '<mark class="search-mark">$1</mark>'
    );
}

function clearSearchHighlights() {
    document.querySelectorAll('.search-highlight').forEach(el => {
        el.classList.remove('search-highlight');
    });
}

// ─── CREATE MODALS ───────────────────────────────────────────
function createCartModal() {
    if (document.getElementById('cart-modal')) return;
    const modal = document.createElement('div');
    modal.id = 'cart-modal';
    modal.innerHTML = `
        <div class="cart-modal-box">
            <div class="cart-modal-header">
                <h3>YOUR CART</h3>
                <button onclick="closeCart()" class="close-btn">✕</button>
            </div>
            <div id="cart-items"></div>
            <div id="cart-total"></div>
            <button class="checkout-btn" onclick="checkout()">
                Proceed to Checkout →
            </button>
        </div>`;
    modal.addEventListener('click', e => { if (e.target === modal) closeCart(); });
    document.body.appendChild(modal);
}

function createWishlistModal() {
    if (document.getElementById('wish-modal')) return;
    const modal = document.createElement('div');
    modal.id = 'wish-modal';
    modal.innerHTML = `
        <div class="cart-modal-box">
            <div class="cart-modal-header">
                <h3>YOUR WISHLIST</h3>
                <button onclick="closeWishlist()" class="close-btn">✕</button>
            </div>
            <div id="wish-items"></div>
        </div>`;
    modal.addEventListener('click', e => { if (e.target === modal) closeWishlist(); });
    document.body.appendChild(modal);
}

// ── NEW: Search modal ──────────────────────────────────────
function createSearchModal() {
    if (document.getElementById('search-modal')) return;
    const modal = document.createElement('div');
    modal.id = 'search-modal';
    modal.innerHTML = `
        <div class="search-modal-box">
            <div class="search-modal-header">
                <div class="search-input-wrap">
                    <span class="search-icon-inline">🔍</span>
                    <input
                        id="search-input"
                        type="text"
                        placeholder="Search watches, jewellery…"
                        autocomplete="off"
                        spellcheck="false"
                    >
                    <button id="search-clear-btn" class="search-clear-btn" title="Clear">✕</button>
                </div>
                <button onclick="closeSearch()" class="close-btn" style="margin-left:10px">✕</button>
            </div>
            <div id="search-results"></div>
        </div>`;
    modal.addEventListener('click', e => { if (e.target === modal) closeSearch(); });
    document.body.appendChild(modal);

    // Live search on input
    const input     = document.getElementById('search-input');
    const clearBtn  = document.getElementById('search-clear-btn');

    input.addEventListener('input', () => {
        clearBtn.style.display = input.value ? 'flex' : 'none';
        renderSearchResults(input.value);
    });

    clearBtn.addEventListener('click', () => {
        input.value = '';
        clearBtn.style.display = 'none';
        renderSearchResults('');
        input.focus();
    });

    // Close on Escape
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && document.getElementById('search-modal').style.display === 'flex') {
            closeSearch();
        }
    });
}

// ─── INJECT STYLES ───────────────────────────────────────────
function injectStyles() {
    if (document.getElementById('urvora-dyn-styles')) return;
    const style = document.createElement('style');
    style.id = 'urvora-dyn-styles';
    style.textContent = `
        /* ── Modals ── */
        #cart-modal, #wish-modal, #search-modal {
            display: none;
            position: fixed;
            inset: 0;
            background: rgba(26,15,7,.55);
            z-index: 9999;
            justify-content: center;
            align-items: center;
            backdrop-filter: blur(3px);
        }
        .cart-modal-box {
            background: #fdf8f2;
            border-top: 3px solid #c9a84c;
            padding: 28px;
            width: 480px;
            max-width: 92vw;
            max-height: 85vh;
            overflow-y: auto;
            box-shadow: 0 24px 64px rgba(26,15,7,.35);
            border-radius: 2px;
            animation: modalIn .25s cubic-bezier(.25,.46,.45,.94) both;
        }
        @keyframes modalIn {
            from { opacity:0; transform:translateY(16px) scale(.98); }
            to   { opacity:1; transform:none; }
        }
        .cart-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 14px;
            border-bottom: 1px solid rgba(201,168,76,.3);
        }
        .cart-modal-header h3 {
            font-family: 'Cinzel', Georgia, serif;
            font-size: 13px;
            font-weight: 400;
            letter-spacing: .3em;
            color: #1a0f07;
        }
        .close-btn {
            background: none;
            border: none;
            font-size: 18px;
            cursor: pointer;
            color: #9a7550;
            line-height: 1;
            transition: color .2s;
        }
        .close-btn:hover { color: #1a0f07; }

        /* ── Cart / Wish rows ── */
        .cart-item-row, .wish-item-row {
            display: flex;
            align-items: center;
            gap: 14px;
            padding: 12px 0;
            border-bottom: 1px solid rgba(201,168,76,.15);
        }
        .cart-item-info {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 3px;
        }
        .cart-item-info strong {
            font-family: 'Cormorant Garamond', Georgia, serif;
            font-size: 15px;
            color: #1a0f07;
        }
        .cart-item-info span {
            font-family: 'Cinzel', Georgia, serif;
            font-size: 11px;
            letter-spacing: .06em;
            color: #9a7530;
        }

        /* ── Qty controls ── */
        .qty-controls {
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .qty-btn {
            width: 26px;
            height: 26px;
            background: none;
            border: 1px solid rgba(201,168,76,.5);
            border-radius: 2px;
            cursor: pointer;
            font-size: 14px;
            line-height: 1;
            color: #5a3a1b;
            transition: all .2s;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .qty-btn:hover { background: #1a0f07; color: #e8cc7a; border-color: #1a0f07; }
        .qty-num {
            min-width: 22px;
            text-align: center;
            font-family: 'Cinzel', Georgia, serif;
            font-size: 12px;
            color: #1a0f07;
        }
        .remove-btn {
            background: none;
            border: none;
            cursor: pointer;
            color: #c9b28c;
            font-size: 14px;
            transition: color .2s;
            padding: 2px 4px;
        }
        .remove-btn:hover { color: #c0392b; }

        /* ── Cart totals ── */
        #cart-total {
            font-family: 'Cormorant Garamond', Georgia, serif;
            font-size: 20px;
            font-weight: 400;
            margin: 16px 0 4px;
            color: #1a0f07;
            letter-spacing: .02em;
        }
        .checkout-btn {
            width: 100%;
            padding: 14px;
            background: #1a0f07;
            color: #e8cc7a;
            border: none;
            font-family: 'Cinzel', Georgia, serif;
            font-size: 11px;
            letter-spacing: .22em;
            cursor: pointer;
            transition: background .25s;
            margin-top: 10px;
        }
        .checkout-btn:hover { background: #362517; }
        .mini-cart-btn {
            background: #1a0f07;
            color: #e8cc7a;
            border: none;
            border-radius: 2px;
            padding: 4px 8px;
            cursor: pointer;
            font-size: 14px;
        }

        /* ── Product card action buttons ── */
        .card-actions {
            display: flex;
            gap: 6px;
            margin: 12px 10px 14px;
            position: relative;
            z-index: 3;
        }
        .cart-btn {
            flex: 1;
            padding: 9px 6px;
            background: #1a0f07;
            color: #f5ede0;
            border: none;
            border-radius: 0;
            cursor: pointer;
            font-family: 'Cinzel', Georgia, serif;
            font-size: 9px;
            letter-spacing: .15em;
            transition: background .2s;
        }
        .cart-btn:hover { background: #362517; }
        .buy-btn {
            flex: 1;
            padding: 9px 6px;
            background: #9a7530;
            color: #fdf8f2;
            border: none;
            border-radius: 0;
            cursor: pointer;
            font-family: 'Cinzel', Georgia, serif;
            font-size: 9px;
            letter-spacing: .15em;
            transition: background .2s;
        }
        .buy-btn:hover { background: #c9a84c; color: #1a0f07; }
        .wish-btn {
            padding: 9px 14px;
            background: transparent;
            border: 1px solid rgba(201,168,76,.45);
            cursor: pointer;
            font-size: 15px;
            transition: background .2s, border-color .2s;
            line-height: 1;
        }
        .wish-btn:hover { background: #fdf0e8; border-color: #c9a84c; }

        /* ── Badge ── */
        .badge {
            display: inline-block;
            background: #9a7530;
            color: #fdf8f2;
            font-family: 'Cinzel', Georgia, serif;
            font-size: 10px;
            border-radius: 50%;
            padding: 2px 6px;
            margin-left: 4px;
            vertical-align: middle;
            min-width: 20px;
            text-align: center;
        }

        /* ── Toast ── */
        #toast {
            position: fixed;
            bottom: 28px;
            left: 50%;
            transform: translateX(-50%) translateY(0);
            background: #1a0f07;
            color: #e8cc7a;
            padding: 11px 26px;
            font-family: 'Cinzel', Georgia, serif;
            font-size: 10px;
            letter-spacing: .15em;
            z-index: 99999;
            white-space: nowrap;
            border-top: 1px solid #c9a84c;
            animation: toastAnim 2.6s ease forwards;
        }
        @keyframes toastAnim {
            0%   { opacity:0; transform:translateX(-50%) translateY(12px); }
            12%  { opacity:1; transform:translateX(-50%) translateY(0); }
            75%  { opacity:1; }
            100% { opacity:0; }
        }

        /* ════════════════════════════════════════
           ── SEARCH MODAL ──
           ════════════════════════════════════════ */
        .search-modal-box {
            background: #fdf8f2;
            border-top: 3px solid #c9a84c;
            padding: 22px 24px 8px;
            width: 560px;
            max-width: 94vw;
            max-height: 88vh;
            overflow-y: auto;
            box-shadow: 0 24px 64px rgba(26,15,7,.35);
            border-radius: 2px;
            animation: modalIn .25s cubic-bezier(.25,.46,.45,.94) both;
        }
        .search-modal-header {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 16px;
            padding-bottom: 14px;
            border-bottom: 1px solid rgba(201,168,76,.3);
        }
        .search-input-wrap {
            flex: 1;
            display: flex;
            align-items: center;
            background: #fff9f2;
            border: 1px solid rgba(201,168,76,.5);
            border-radius: 2px;
            padding: 0 10px;
            gap: 8px;
        }
        .search-input-wrap:focus-within {
            border-color: #c9a84c;
            box-shadow: 0 0 0 2px rgba(201,168,76,.15);
        }
        .search-icon-inline {
            font-size: 15px;
            color: #9a7550;
            flex-shrink: 0;
        }
        #search-input {
            flex: 1;
            border: none;
            outline: none;
            background: transparent;
            font-family: 'Cormorant Garamond', Georgia, serif;
            font-size: 16px;
            color: #1a0f07;
            padding: 11px 0;
            letter-spacing: .02em;
        }
        #search-input::placeholder {
            color: #c9b28c;
            font-style: italic;
        }
        .search-clear-btn {
            display: none;
            align-items: center;
            justify-content: center;
            background: none;
            border: none;
            cursor: pointer;
            color: #9a7550;
            font-size: 13px;
            padding: 2px 4px;
            flex-shrink: 0;
            transition: color .2s;
        }
        .search-clear-btn:hover { color: #1a0f07; }

        /* ── Search results ── */
        .search-count {
            font-family: 'Cinzel', Georgia, serif;
            font-size: 10px;
            letter-spacing: .18em;
            color: #9a7550;
            margin: 0 0 10px;
            text-transform: uppercase;
        }
        .search-result-row {
            display: flex;
            align-items: center;
            gap: 14px;
            padding: 11px 10px;
            border-radius: 2px;
            cursor: pointer;
            transition: background .15s;
            border-bottom: 1px solid rgba(201,168,76,.12);
        }
        .search-result-row:last-child { border-bottom: none; }
        .search-result-row:hover {
            background: #fdf0e0;
        }
        .search-result-info {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 3px;
        }
        .search-result-info strong {
            font-family: 'Cormorant Garamond', Georgia, serif;
            font-size: 15px;
            color: #1a0f07;
        }
        .search-category {
            font-family: 'Cinzel', Georgia, serif;
            font-size: 9px;
            letter-spacing: .15em;
            color: #c9a84c;
            text-transform: uppercase;
        }
        .search-price {
            font-family: 'Cinzel', Georgia, serif;
            font-size: 11px;
            letter-spacing: .06em;
            color: #9a7530;
        }
        .search-goto-btn {
            background: none;
            border: 1px solid rgba(201,168,76,.4);
            color: #9a7530;
            font-size: 16px;
            width: 30px;
            height: 30px;
            border-radius: 2px;
            cursor: pointer;
            flex-shrink: 0;
            transition: all .2s;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .search-goto-btn:hover {
            background: #1a0f07;
            color: #e8cc7a;
            border-color: #1a0f07;
        }
        /* Highlighted match text */
        .search-mark {
            background: #f5d87a;
            color: #1a0f07;
            border-radius: 2px;
            padding: 0 2px;
            font-style: normal;
        }
        /* Empty state */
        .search-empty {
            text-align: center;
            padding: 32px 0 24px;
            color: #9a7550;
            font-family: 'Cinzel', Georgia, serif;
            font-size: 11px;
            letter-spacing: .12em;
        }
        /* Card highlight flash when jumped to from search */
        @keyframes cardFlash {
            0%   { box-shadow: 0 0 0 3px #c9a84c, 0 0 20px rgba(201,168,76,.4); }
            50%  { box-shadow: 0 0 0 5px #c9a84c, 0 0 30px rgba(201,168,76,.6); }
            100% { box-shadow: none; }
        }
        .search-highlight {
            animation: cardFlash 2s ease forwards;
        }
    `;
    document.head.appendChild(style);
}

// ─── INIT ────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    injectStyles();
    createCartModal();
    createWishlistModal();
    createSearchModal();   // ← new
    setupNavBadges();
    setupProductCards();
    updateCartCount();
    updateWishlistCount();
    syncWishlistIcons();
});