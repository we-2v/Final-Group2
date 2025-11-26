// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Product data for products page
const products = [
    { id: 1, name: "Smartphone X", price: 699.99, category: "phone", image: "<https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=Smartphone>" },
    { id: 2, name: "Ultra Laptop Pro", price: 1299.99, category: "laptop", image: "<https://via.placeholder.com/300x200/50E3C2/FFFFFF?text=Laptop>" },
    { id: 3, name: "Wireless Headphones", price: 199.99, category: "audio", image: "<https://via.placeholder.com/300x200/9013FE/FFFFFF?text=Headphones>" },
    { id: 4, name: "Smart Watch", price: 299.99, category: "wearable", image: "<https://via.placeholder.com/300x200/F5A623/FFFFFF?text=Smart+Watch>" },
    { id: 5, name: "Tablet Mini", price: 499.99, category: "tablet", image: "<https://via.placeholder.com/300x200/D0021B/FFFFFF?text=Tablet>" },
    { id: 6, name: "Gaming Console", price: 399.99, category: "gaming", image: "<https://via.placeholder.com/300x200/7ED321/FFFFFF?text=Console>" }
];

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();

    // Add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });

    // Cart modal functionality
    const cartLink = document.getElementById('cart-link');
    const cartModal = document.getElementById('cart-modal');
    const closeBtn = document.querySelector('.close');

    if (cartLink) {
        cartLink.addEventListener('click', function(e) {
            e.preventDefault();
            showCartModal();
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', hideCartModal);
    }

    if (cartModal) {
        cartModal.addEventListener('click', function(e) {
            if (e.target === cartModal) {
                hideCartModal();
            }
        });
    }

    // Checkout button
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', checkout);
    }

    // Load products on products page
    if (window.location.pathname.includes('products.html')) {
        loadProducts();
        setupFilters();
    }
});

// Cart functions
function addToCart(e) {
    const button = e.target;
    const id = button.dataset.id;
    const name = button.dataset.name;
    const price = parseFloat(button.dataset.price);

    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: id,
            name: name,
            price: price,
            quantity: 1
        });
    }

    updateCartCount();
    saveCart();
    showNotification(`${name} added to cart!`);
}

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

function showCartModal() {
    const cartModal = document.getElementById('cart-modal');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    if (cartItems) {
        cartItems.innerHTML = '';

        if (cart.length === 0) {
            cartItems.innerHTML = '<p>Your cart is empty</p>';
        } else {
            cart.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'cart-item';
                itemElement.innerHTML = `
                    <span>${item.name}</span>
                    <span>$${item.price} x ${item.quantity}</span>
                    <button onclick="removeFromCart('${item.id}')" class="remove-btn">Remove</button>
                `;
                cartItems.appendChild(itemElement);
            });
        }
    }

    if (cartTotal) {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = total.toFixed(2);
    }

    if (cartModal) {
        cartModal.style.display = 'block';
    }
}

function hideCartModal() {
    const cartModal = document.getElementById('cart-modal');
    if (cartModal) {
        cartModal.style.display = 'none';
    }
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartCount();
    saveCart();
    showCartModal();
}

function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    alert('Thank you for your purchase! This is a demo store.');
    cart = [];
    updateCartCount();
    saveCart();
    hideCartModal();
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #27ae60;
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        z-index: 1002;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Products page functions
function loadProducts(filteredProducts = products) {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;

    productsGrid.innerHTML = '';

    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="price">$${product.price}</p>
            <button class="add-to-cart"
                    data-id="${product.id}"
                    data-name="${product.name}"
                    data-price="${product.price}">
                Add to Cart
            </button>
        `;
        productsGrid.appendChild(productCard);
    });

    // Re-attach event listeners to new buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

function setupFilters() {
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');

    if (searchInput) {
        searchInput.addEventListener('input', filterProducts);
    }

    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterProducts);
    }
}

function filterProducts() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const category = document.getElementById('category-filter').value;

    let filtered = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm);
        const matchesCategory = !category || product.category === category;
        return matchesSearch && matchesCategory;
    });

    loadProducts(filtered);
}

// Add CSS animation for notification
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    .remove-btn {
        background: #e74c3c;
        color: white;
        border: none;
        padding: 5px 10px;
        border-radius: 3px;
        cursor: pointer;
        font-size: 0.8rem;
    }

    .remove-btn:hover {
        background: #c0392b;
    }
`;
document.head.appendChild(style);
