let cart = JSON.parse(localStorage.getItem("cart")) || [];

function displayCart() {

  const cartItems = document.getElementById("cart-items");
  const totalElement = document.getElementById("cart-total");

  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {

    total += item.price * item.quantity;

    cartItems.innerHTML += `

    <div class="cart-item">

        <img src="${item.image}" class="cart-img">

        <div class="cart-info">
            <h3>${item.name}</h3>
            <p>${item.size}</p>
            <p>Rs. ${item.price}</p>
        </div>

        <div class="cart-quantity">

            <button onclick="decreaseQty(${index})">−</button>

            <span>${item.quantity}</span>

            <button onclick="increaseQty(${index})">+</button>

        </div>

        <button class="remove-btn"
        onclick="removeFromCart(${index})">
        Remove
        </button>

    </div>

    `;
  });

  totalElement.innerText = total;
}

function increaseQty(index){
  cart[index].quantity++;
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
}

function decreaseQty(index){

  if(cart[index].quantity > 1){
    cart[index].quantity--;
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
}

function removeFromCart(index){
  cart.splice(index,1);
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
}

displayCart();

cart.forEach((item, index) => {

  total += item.price * item.quantity;

  cartItems.innerHTML += `
  <div class="cart-item" style="animation-delay:${index * 0.08}s">

      <img src="${item.image}" class="cart-img">

      <div class="cart-info">
          <h3>${item.name}</h3>
          <p>${item.size}</p>
          <p>Rs. ${item.price}</p>
      </div>

      <div class="cart-quantity">
          <button onclick="decreaseQty(${index})">−</button>
          <span>${item.quantity}</span>
          <button onclick="increaseQty(${index})">+</button>
      </div>

      <button class="remove-btn" onclick="removeFromCart(${index})">
        Remove
      </button>

  </div>
  `;
});

window.addEventListener("scroll", () => {

const scroll = window.scrollY;

document.body.style.backgroundPosition =
`center ${scroll * 0.3}px`;

});