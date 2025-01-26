const menu = {
    Coffee: [
        { name: "Espresso", price: 20 },
        { name: "Chocolate Coffee", price: 25 },
        { name: "Cold Coffee", price: 30 },
        { name: "Mocha Latte", price: 40 }
    ],
    Tea: [
        { name: "Special Tea", price: 20 },
        { name: "Black Tea", price: 25 },
        { name: "Lemon Tea", price: 25 },
        { name: "Herbal Tea", price: 30 }
    ],
    Sandwich: [
        { name: "Veg Sandwich", price: 45 },
        { name: "Veg Cheese Sandwich", price: 55 },
        { name: "Veg Grilled Sandwich", price: 60 },
        { name: "Club Sandwich", price: 70 }
    ],
    Burger: [
        { name: "Veg Burger", price: 35 },
        { name: "Veg Cheese Burger", price: 40 },
        { name: "Hamburger", price: 50 },
        { name: "Chicken Burger", price: 60 }
    ],
    Waffle: [
        { name: "Waffle", price: 35 },
        { name: "Chocolate Waffle", price: 45 },
        { name: "Toaster Waffle", price: 45 },
        { name: "Liege Waffle", price: 60 }
    ]
};

function updateSubCategory(selectElement) {
    const subCategory = selectElement.parentElement.querySelector('.sub-category');
    const mainCategory = selectElement.value;

    subCategory.innerHTML = '<option value="">-- Select Option --</option>';
    if (menu[mainCategory]) {
        menu[mainCategory].forEach(item => {
            subCategory.innerHTML += `<option value="${item.price}">${item.name}</option>`;
        });
    }
    updatePrice();
}

function updatePrice(inputElement) {
    const parent = inputElement.parentElement;
    const subCategory = parent.querySelector('.sub-category');
    const quantity = parent.querySelector('.item-quantity').value;
    const priceDisplay = parent.querySelector('.item-price');

    const price = subCategory.value ? subCategory.value * quantity : 0;
    priceDisplay.textContent = `Rs.${price}`;
    calculateTotal();
}

function calculateTotal() {
    let total = 0;
    let totalBeforeDiscount = 0; // To track the original total price without discounts

    // Get the current day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const today = new Date().getDay();

    document.querySelectorAll('.order-item').forEach(item => {
        const mainCategory = item.querySelector('.main-category').value;
        const subCategory = item.querySelector('.sub-category').value;
        const quantity = parseInt(item.querySelector('.item-quantity').value) || 0;
        let itemPrice = parseInt(subCategory) || 0;

        // Track the original price
        const originalPrice = itemPrice * quantity;

        // Apply discounts based on the day and category
        if (mainCategory === "Coffee" && today >= 2 && today <= 7) {
            itemPrice *= 0.8; // 20% off
        } else if (mainCategory === "Sandwich" && today >= 4 && today <= 6) {
            itemPrice *= 0.7; // 30% off
        } else if (mainCategory === "Burger" && today >= 1 && today <= 6) {
            itemPrice *= 0.9; // 10% off
        }

        const discountedPrice = itemPrice * quantity;

        // Update the total values
        totalBeforeDiscount += originalPrice;
        total += discountedPrice;

        // Update the item's price display
        if (discountedPrice < originalPrice) {
            item.querySelector('.item-price').innerHTML = `
                <span style="text-decoration: line-through; color: red;">Rs.${originalPrice.toFixed(2)}</span>
                <span style="display: inline-block; width: 12px;"></span>
                <span style="color: green;"> Rs.${discountedPrice.toFixed(2)}</span>
            `;
        } else {
            item.querySelector('.item-price').textContent = `Rs.${discountedPrice.toFixed(2)}`;
        }
    });

    // Update the total amount display
    const totalDisplay = document.getElementById('total-amount');
    totalDisplay.textContent = `${total.toFixed(2)}`;
}


function addItem() {
    const orderItems = document.getElementById('order-items');
    const newItem = document.createElement('div');
    newItem.classList.add('order-item');
    newItem.innerHTML = `
        <select class="main-category" onchange="updateSubCategory(this)">
            <option value="">-- Select Category --</option>
            <option value="Coffee">Coffee</option>
            <option value="Tea">Tea</option>
            <option value="Sandwich">Sandwich</option>
            <option value="Burger">Burger</option>
            <option value="Waffle">Waffle</option>
        </select>
        <select class="sub-category" onchange="updatePrice(this)">
            <option value="">-- Select Option --</option>
        </select>
        <input type="number" class="item-quantity" min="1" placeholder="Count" value="1" onchange="updatePrice(this)">
        <span class="item-price">Rs.0</span>
        <button class="remove-item" onclick="removeItem(this)">Remove</button>
    `;
    orderItems.appendChild(newItem);
}

function removeItem(button) {
    button.parentElement.remove();
    calculateTotal();
}

function executeOrder() {
    const location = document.getElementById('user-location').value;
    if (!location) {
        alert('Please enter your location to proceed.');
        return;
    }
    document.getElementById('payment-section').style.display = 'block';
}

// Dynamically show payment details
function showPaymentDetails() {
    const method = document.getElementById('payment-method').value;
    const detailsDiv = document.getElementById('payment-details');
    detailsDiv.innerHTML = ''; // Reset content

    if (method === 'Net Banking') {
        detailsDiv.innerHTML = `
            <div style="margin: 1rem; display: flex; flex-direction: column; gap: 1rem; align-items: center;">

    <!-- Card Number Field -->
    <div style="display: flex; flex-direction: column; width: 100%;">
        <label style="margin-bottom: 0.5rem; font-weight: bold; font-size: 1rem; color: #333;">
            Card Number:
        </label>
        <input type="text" id="card-number" placeholder="Enter Card Number" 
               style="width: 100%; padding: 0.75rem; font-size: 1rem; border: 1px solid #bbb; border-radius: 6px; box-shadow: inset 0 1px 3px rgba(0,0,0,0.1); transition: border-color 0.3s ease;"
               onfocus="this.style.borderColor='#6a4c93';" onblur="this.style.borderColor='#bbb';">
    </div>

    <!-- CVV Field -->
    <div style="display: flex; flex-direction: column; width: 100%;">
        <label style="margin-bottom: 0.5rem; font-weight: bold; font-size: 1rem; color: #333;">
            CVV:
        </label>
        <input type="password" id="card-cvv" placeholder="Enter CVV" 
               style="width: 100%; padding: 0.75rem; font-size: 1rem; border: 1px solid #bbb; border-radius: 6px; box-shadow: inset 0 1px 3px rgba(0,0,0,0.1); transition: border-color 0.3s ease;"
               onfocus="this.style.borderColor='#6a4c93';" onblur="this.style.borderColor='#bbb';">
    </div>

    <!-- Pay Button -->
    <button onclick="processPayment()" 
            style="width: 20%; background-color: #6a4c93; color: white; padding: 0.75rem; font-size: 1rem; font-weight: bold; border: none; border-radius: 6px; cursor: pointer; text-align: center; transition: background-color 0.3s ease; margin: 0 auto;">
        Pay
    </button>

    <!-- JavaScript -->
    <script>
        const processPayment = () => {
            const cardNumber = document.getElementById('card-number').value.trim();
            const cvv = document.getElementById('card-cvv').value.trim();

            if (cardNumber.length !== 16 || isNaN(cardNumber)) {
                alert("Error: Card number is incomplete or incorrect. Please enter a valid 16-digit number.");
                return;
            }

            if (cvv.length !== 3 || isNaN(cvv)) {
                alert("Error: Invalid CVV. Please enter a 3-digit CVV.");
                return;
            }

            alert("Payment Processed Successfully!");
        };
    </script>
</div>

        `;
    } else if (method === 'UPI') {
        detailsDiv.innerHTML = `
            <div style="text-align: center;">
                <p>Scan the QR code below to pay:</p>
                <img src="./Img/QRCode.png" alt="QR Code" style="width: 200px; margin-top: 1rem; border: 2px solid #ddd; border-radius: 8px;">
            </div>
        `;
    } else if (method === 'Cash on Delivery') {
        detailsDiv.innerHTML = `
            <p style="text-align: center; color: green;">Thank you! Please pay in cash when your order is delivered.</p>
        `;
    }
}

function processPayment() {
    const cardNumber = document.getElementById('card-number')?.value;
    const cardCVV = document.getElementById('card-cvv')?.value;

    if (!cardNumber || !cardCVV) {
        alert("Please fill in your card details to proceed.");
        return;
    }
    alert("Your payment has been successfully processed!");
}

// Render Payment Section on Page Load
document.addEventListener("DOMContentLoaded", renderPaymentSection);