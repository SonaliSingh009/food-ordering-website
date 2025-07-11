document.addEventListener('DOMContentLoaded', () => {
    // Sample menu data
    const menuData = [
        {
            id: 'burgers',
            name: 'Burgers',
            items: [
                {
                    id: 1,
                    name: 'Classic Burger',
                    description: 'Beef patty with lettuce, tomato, onion, and special sauce',
                    price: 8.99,
                    image: 'images/burger.jpg',
                    customizationOptions: {
                        doneness: ['Medium', 'Medium Well', 'Well Done'],
                        cheese: ['None', 'American', 'Cheddar', 'Swiss'],
                        extras: ['Bacon', 'Avocado', 'Mushrooms']
                    }
                },
                {
                    id: 2,
                    name: 'Cheeseburger',
                    description: 'Classic burger with your choice of cheese',
                    price: 9.49,
                    image: 'images/burger.jpg',
                    customizationOptions: {
                        cheese: ['American', 'Cheddar', 'Swiss', 'Pepper Jack'],
                        extras: ['Bacon', 'Avocado', 'Mushrooms', 'Fried Egg']
                    }
                }
            ]
        },
        {
            id: 'pizzas',
            name: 'Pizzas',
            items: [
                {
                    id: 3,
                    name: 'Margherita',
                    description: 'Tomato sauce, mozzarella, and basil',
                    price: 12.99,
                    image: 'images/pizza.jpg',
                    customizationOptions: {
                        size: ['Small', 'Medium', 'Large'],
                        crust: ['Thin', 'Regular', 'Thick', 'Gluten-Free']
                    }
                },
                {
                    id: 4,
                    name: 'Pepperoni',
                    description: 'Tomato sauce, mozzarella, and pepperoni',
                    price: 14.99,
                    image: 'images/pizza.jpg',
                    customizationOptions: {
                        size: ['Small', 'Medium', 'Large'],
                        crust: ['Thin', 'Regular', 'Thick', 'Gluten-Free'],
                        extras: ['Extra Cheese', 'Mushrooms', 'Olives']
                    }
                }
            ]
        }
    ];

    // DOM elements
    const menuCategories = document.getElementById('menuCategories');
    const menuItems = document.getElementById('menuItems');
    const customizationModal = document.getElementById('customizationModal');
    const modalItemName = document.getElementById('modalItemName');
    const customizationForm = document.getElementById('customizationForm');
    const cancelCustomization = document.getElementById('cancelCustomization');

    // Initialize menu
    function loadMenu(categoryId = 'burgers') {
        const category = menuData.find(c => c.id === categoryId);
        if (!category) return;

        menuItems.innerHTML = category.items.map(item => `
            <div class