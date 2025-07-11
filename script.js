// Cart functionality
class Cart {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('foodOrderCart')) || [];
        this.loadCart();
    }

    loadCart() {
        // Update cart count in header
        const cartCountElements = document.querySelectorAll('.cart-count');
        const count = this.cart.reduce((total, item) => total + item.quantity, 0);
        cartCountElements.forEach(el => el.textContent = count);
    }

    addToCart(item, customization = {}) {
        const existingItem = this.cart.find(
            cartItem => cartItem.id === item.id && 
            JSON.stringify(cartItem.customization) === JSON.stringify(customization)
        );

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({ ...item, quantity: 1, customization });
        }

        this.saveCart();
    }

    removeFromCart(id, customization) {
        this.cart = this.cart.filter(
            item => !(item.id === id && JSON.stringify(item.customization) === JSON.stringify(customization))
        );
        this.saveCart();
    }

    updateQuantity(id, customization, newQuantity) {
        const item = this.cart.find(
            item => item.id === id && JSON.stringify(item.customization) === JSON.stringify(customization)
        );

        if (item) {
            if (newQuantity < 1) {
                this.removeFromCart(id, customization);
            } else {
                item.quantity = newQuantity;
                this.saveCart();
            }
        }
    }

    clearCart() {
        this.cart = [];
        this.saveCart();
    }

    getCartTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    saveCart() {
        localStorage.setItem('foodOrderCart', JSON.stringify(this.cart));
        this.loadCart();
        this.displayCart();
    }

    displayCart() {
        const cartItemsElement = document.getElementById('cartItems');
        const cartSummaryElement = document.getElementById('cartSummary');
        const cartActionsElement = document.getElementById('cartActions');
        const cartSubtotalElement = document.getElementById('cartSubtotal');
        const cartTotalElement = document.getElementById('cartTotal');

        if (!cartItemsElement) return;

        if (this.cart.length === 0) {
            cartItemsElement.innerHTML = `
                <div class="empty-cart">
                    <p>Your cart is empty</p>
                    <button class="button primary" id="closeCartBrowse">
                        Browse Menu
                    </button>
                </div>
            `;
            cartSummaryElement.style.display = 'none';
            cartActionsElement.style.display = 'none';

            // Add event listener to the button if it exists
            const closeButton = document.getElementById('closeCartBrowse');
            if (closeButton) {
                closeButton.addEventListener('click', () => {
                    document.getElementById('cartOverlay').style.display = 'none';
                });
            }
        } else {
            cartItemsElement.innerHTML = this.cart.map(item => `
                <div class="cart-item" data-id="${item.id}" data-customization="${JSON.stringify(item.customization)}">
                    <div class="item-info">
                        <h3>${item.name}</h3>
                        ${Object.keys(item.customization).length > 0 ? `
                            <div class="customization">
                                ${Object.entries(item.customization).map(([key, value]) => `
                                    <p>${key}: ${value}</p>
                                `).join('')}
                            </div>
                        ` : ''}
                        <p class="price">$${item.price.toFixed(2)}</p>
                    </div>
                    
                    <div class="quantity-controls">
                        <button class="decrease">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span>${item.quantity}</span>
                        <button class="increase">
                            <i class="fas fa-plus"></i>
                        </button>
                        <button class="remove-button">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');

            // Calculate totals
            const subtotal = this.getCartTotal();
            const total = subtotal + 2.99; // $2.99 delivery fee

            cartSubtotalElement.textContent = $${subtotal.toFixed(2)};
            cartTotalElement.textContent = $${total.toFixed(2)};

            cartSummaryElement.style.display = 'block';
            cartActionsElement.style.display = 'flex';

            // Add event listeners to quantity controls
            document.querySelectorAll('.decrease').forEach(button => {
                button.addEventListener('click', (e) => {
                    const cartItem = e.target.closest('.cart-item');
                    const id = parseInt(cartItem.dataset.id);
                    const customization = JSON.parse(cartItem.dataset.customization);
                    const quantityElement = cartItem.querySelector('span');
                    const currentQuantity = parseInt(quantityElement.textContent);
                    
                    this.updateQuantity(id, customization, currentQuantity - 1);
                });
            });

            document.querySelectorAll('.increase').forEach(button => {
                button.addEventListener('click', (e) => {
                    const cartItem = e.target.closest('.cart-item');
                    const id = parseInt(cartItem.dataset.id);
                    const customization = JSON.parse(cartItem.dataset.customization);
                    const quantityElement = cartItem.querySelector('span');
                    const currentQuantity = parseInt(quantityElement.textContent);
                    
                    this.updateQuantity(id, customization, currentQuantity + 1);
                });
            });

            document.querySelectorAll('.remove-button').forEach(button => {
                button.addEventListener('click', (e) => {
                    const cartItem = e.target.closest('.cart-item');
                    const id = parseInt(cartItem.dataset.id);
                    const customization = JSON.parse(cartItem.dataset.customization);
                    
                    this.removeFromCart(id, customization);
                });
            });
        }

        // Add event listener to clear cart button if it exists
        const clearCartButton = document.getElementById('clearCart');
        if (clearCartButton) {
            clearCartButton.addEventListener('click', () => {
                this.clearCart();
            });
        }
    }
}

// Initialize cart
const cart = new Cart();

// Cart overlay functionality
document.addEventListener('DOMContentLoaded', () => {
    // Initialize cart display
    cart.displayCart();

    // Cart button event listeners
    const cartButton = document.getElementById('cartButton');
    const cartOverlay = document.getElementById('cartOverlay');
    const closeCartButton = document.getElementById('closeCart');

    if (cartButton && cartOverlay) {
        cartButton.addEventListener('click', () => {
            cartOverlay.style.display = 'flex';
        });
    }

    if (closeCartButton && cartOverlay) {
        closeCartButton.addEventListener('click', () => {
            cartOverlay.style.display = 'none';
        });
    }

    // Close cart when clicking outside
    if (cartOverlay) {
        cartOverlay.addEventListener('click', (e) => {
            if (e.target === cartOverlay) {
                cartOverlay.style.display = 'none';
            }
        });
    }
});