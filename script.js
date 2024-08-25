// Function to add a new product
function addProduct(button, position) {
    const productContainer = document.getElementById('product-container');
    const productBox = button.closest('.product-box');
    const newProductBox = productBox.cloneNode(true);
    
    newProductBox.querySelector('.description').value = '';
    newProductBox.querySelector('.price').value = '';

    if (position === 'above') {
        productContainer.insertBefore(newProductBox, productBox);
    } else if (position === 'below'){
        productContainer.insertBefore(newProductBox, productBox.nextSibling);
    }

    updateIndexNumbers();
    saveData(); // Save form data when adding a product
}

// Function to remove the specific product input box
function removeProduct(button) {
    const container = document.getElementById('product-container');
    const currentBox = button.parentNode.parentNode;
    const boxes = container.getElementsByClassName('product-box');

    if (boxes.length > 1) { // Always keep at least one box
        container.removeChild(currentBox);
        calculateTotal(); // Recalculate total after removing a box
        updateIndexNumbers();  // Update the index numbers
        saveData();
    }
}

// Function to calculate the total sum of all prices with math operations
function calculateTotal() {
    const prices = document.getElementsByClassName('price');
    let total = 0;
    let error = '';

    for (let i = 0; i < prices.length; i++)
    {
        const priceExpression = prices[i].value;
        if (priceExpression.trim() !== '') 
        {
            try {
                // Evaluate the math expression from the input
                const evaluatedPrice = eval(priceExpression);
                if (!isNaN(evaluatedPrice)) total += evaluatedPrice;
                else  error = 'Invalid price entry in one of the fields.';
                
            } catch (e) {
                error ='Error in '+(i+1).toString()+' th price expression. Please correct it.';
            }
        }
    }
    document.getElementById('totalPrice').textContent = total.toFixed(2);
    document.getElementById('errorMessage').textContent = error;
    saveData();
}
// Function to update index numbers
function updateIndexNumbers() {
    const productBoxes = document.querySelectorAll('.product-box .index-number');
    productBoxes.forEach((box, index) => {
        box.textContent = index + 1;
    });
}
// Initial index update
updateIndexNumbers();






// ------save data when enabling or disabling desktop mode on mobile device----
let resetFormData=false;
window.onload = function() {
    if(resetFormData==false){
        restoreFormData();  // Restore the product data when the page loads
        calculateTotal();    // Recalculate the total
    }
    resetFormData=false;
};
// Save form data to localStorage
function saveData() {
    const productData = [];
    const productBoxes = document.querySelectorAll('.product-box');
    
    productBoxes.forEach(box => {
        const description = box.querySelector('.description').value;
        const price = box.querySelector('.price').value;
        productData.push({ description, price });
    });

    localStorage.setItem('productData', JSON.stringify(productData));  // Save data in JSON format
}
// Restore form data from localStorage
function restoreFormData() {
    const savedData = JSON.parse(localStorage.getItem('productData'));
    if (savedData) {
        savedData.forEach((product, index) => {
            if (index > 0) addProduct(document.querySelector('.product-box'), 'below');
            const productBoxes = document.querySelectorAll('.product-box');
            const lastBox = productBoxes[productBoxes.length - 1];

            lastBox.querySelector('.description').value = product.description;
            lastBox.querySelector('.price').value = product.price;
        });
    }
}
// ------end of save data when enabling or disabling desktop mode on mobile device----




// -------------reset button----------
// Reset form to its initial state with confirmation popup
function resetForm() {
    const confirmation = confirm("Are you sure you want to reset the calculator? This will clear all inputs.");
    // If the user confirms, proceed with resetting the form
    if (confirmation) {
        // Clear localStorage
        localStorage.removeItem('productData');
        resetFormData=true;
        location.reload();
    }
}
// -----------end of reset button---------
