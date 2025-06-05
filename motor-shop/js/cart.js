// Hiển thị giỏ hàng
function displayCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');
    
    // Lấy giỏ hàng từ localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Xóa nội dung cũ
    if (cartItemsContainer) {
        cartItemsContainer.innerHTML = '';
    }
    
    let subtotal = 0;
    
    // Hiển thị từng sản phẩm trong giỏ hàng
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        if (cartItemsContainer) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div class="d-flex align-items-center">
                        <img src="${item.image}" class="cart-item-image me-3" alt="${item.name}">
                        <div>
                            <h6 class="mb-0">${item.name}</h6>
                            <small class="text-muted">ID: ${item.id}</small>
                        </div>
                    </div>
                </td>
                <td>${formatCurrency(item.price)}</td>
                <td>
                    <div class="input-group">
                        <button class="btn btn-outline-secondary minus-btn" type="button" data-index="${index}">-</button>
                        <input type="number" class="form-control quantity-input" value="${item.quantity}" min="1" data-index="${index}">
                        <button class="btn btn-outline-secondary plus-btn" type="button" data-index="${index}">+</button>
                    </div>
                </td>
                <td>${formatCurrency(itemTotal)}</td>
                <td>
                    <button class="btn btn-outline-danger remove-btn" data-index="${index}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            cartItemsContainer.appendChild(row);
        }
    });
    
    // Cập nhật tổng tiền
    if (subtotalElement) subtotalElement.textContent = formatCurrency(subtotal);
    if (totalElement) totalElement.textContent = formatCurrency(subtotal);
    
    // Thêm sự kiện cho các nút
    addCartEventListeners();
    
    // Cập nhật số lượng trên icon giỏ hàng
    updateCartCount();
}

// Định dạng tiền tệ
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

// Thêm sự kiện cho các nút trong giỏ hàng
function addCartEventListeners() {
    // Nút giảm số lượng
    document.querySelectorAll('.minus-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            updateQuantity(index, -1);
        });
    });
    
    // Nút tăng số lượng
    document.querySelectorAll('.plus-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            updateQuantity(index, 1);
        });
    });
    
    // Nhập số lượng
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', function() {
            const index = this.getAttribute('data-index');
            const newQuantity = parseInt(this.value);
            
            if (newQuantity > 0) {
                updateQuantity(index, 0, newQuantity);
            } else {
                this.value = 1;
            }
        });
    });
    
    // Nút xóa sản phẩm
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            removeFromCart(index);
        });
    });
}

// Cập nhật số lượng sản phẩm
function updateQuantity(index, change, newQuantity = null) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (index >= 0 && index < cart.length) {
        if (newQuantity !== null) {
            cart[index].quantity = newQuantity;
        } else {
            cart[index].quantity += change;
            
            // Đảm bảo số lượng không nhỏ hơn 1
            if (cart[index].quantity < 1) {
                cart[index].quantity = 1;
            }
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart();
    }
}

// Xóa sản phẩm khỏi giỏ hàng
function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (index >= 0 && index < cart.length) {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart();
        showAlert('Đã xóa sản phẩm khỏi giỏ hàng', 'success');
    }
}

// Hiển thị giỏ hàng khi trang được tải
document.addEventListener('DOMContentLoaded', displayCart);