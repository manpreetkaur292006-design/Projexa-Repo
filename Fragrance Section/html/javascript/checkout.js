let cart = JSON.parse(localStorage.getItem("cart")) || [];

if (cart.length === 0) {
    alert("Your cart is empty. Please add items before checkout.");
    window.location.href = "cart.html";
}

const orderItems = document.getElementById("order-items");
const totalElement = document.getElementById("order-total");

let total = 0;

cart.forEach(item => {

total += item.price * item.quantity;

orderItems.innerHTML += `
<div class="order-item">
<span>${item.name} x ${item.quantity}</span>
<span>Rs. ${item.price * item.quantity}</span>
</div>
`;

});

totalElement.innerText = total;

document.getElementById("checkoutForm")
.addEventListener("submit", function(e){

e.preventDefault();

alert("Order placed successfully!");

localStorage.removeItem("cart");

window.location.href = "index.html";

});

