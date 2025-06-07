// --- Global Utility Functions (Moved here for wider accessibility) ---


// Hiển thị thông báo (đảm bảo có thể truy cập toàn cục)
function showAlert(message, type) {
    console.log(`Thông báo (${type}): ${message}`);
    // Sử dụng alert tạm thời, bạn nên thay thế bằng một UI alert tốt hơn
    alert(message); 
}

// Cập nhật số lượng sản phẩm trên icon giỏ hàng (ĐÃ DI CHUYỂN RA NGOÀI DOMContentLoaded)
function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCountElement = document.getElementById('cart-count'); // Giả sử có một element với ID này
    if (cartCountElement) {
        let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElement.textContent = totalItems;
    }
}


// Hiển thị giỏ hàng (hàm cũ, KHÔNG THAY ĐỔI nội dung logic bên trong)
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
    updateCartCount(); // Gọi hàm đã được di chuyển lên trên
}

// Định dạng tiền tệ
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}


// Thêm sự kiện cho các nút trong giỏ hàng (hàm cũ, KHÔNG THAY ĐỔI)
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

// Cập nhật số lượng sản phẩm (hàm cũ, KHÔNG THAY ĐỔI)
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

// Xóa sản phẩm khỏi giỏ hàng (hàm cũ, KHÔNG THAY ĐỔI)
function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || []; 
    
    if (index >= 0 && index < cart.length) {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart)); 
        displayCart();
        showAlert('Đã xóa sản phẩm khỏi giỏ hàng', 'success');
    }
}

// Hiển thị giỏ hàng khi trang được tải (hàm cũ, KHÔNG THAY ĐỔI)
document.addEventListener('DOMContentLoaded', displayCart);


// ĐÂY LÀ PHẦN CHỨA LOGIC XỬ LÝ THANH TOÁN VÀ LƯU ĐƠN HÀNG
document.addEventListener('DOMContentLoaded', function() {
    displayCart();
    updateCartCount(); // Gọi hàm đã được di chuyển lên trên

    const processCheckoutBtn = document.getElementById('process-checkout-btn');
if (processCheckoutBtn) {
        processCheckoutBtn.addEventListener('click', function() {
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            if (cart.length === 0) {
                showAlert('Giỏ hàng của bạn đang trống. Vui lòng thêm sản phẩm để thanh toán.', 'warning');
                return;
            }

            // Kiểm tra tính hợp lệ của form thông tin cá nhân (được thêm vào sau)
            const customerInfoForm = document.getElementById('customer-info-form');
            if (customerInfoForm && !customerInfoForm.checkValidity()) {
                customerInfoForm.reportValidity(); // Hiển thị các lỗi validation của trình duyệt
                showAlert('Vui lòng điền đầy đủ và chính xác thông tin cá nhân bắt buộc.', 'danger');
                return;
            }


            // Lấy thông tin khách hàng từ các trường nhập liệu
            const customerName = document.getElementById('customerName').value;
            const customerPhone = document.getElementById('customerPhone').value;
            const customerAddress = document.getElementById('customerAddress').value;
            const orderNotes = document.getElementById('orderNotes').value;


            // --- LOGIC TẠO VÀ LƯU ĐƠN HÀNG MỚI (TẠM THỜI) ---
            const orderId = 'ORD-' + Date.now(); // Tạo ID đơn hàng đơn giản
            const orderDate = new Date().toLocaleString('vi-VN');
            const currentTotalAmount = parseFloat(document.getElementById('total').textContent.replace(' VNĐ', '').replace(/\./g, ''));

            const newOrder = {
                id: orderId,
                customerInfo: { // Thêm đối tượng chứa thông tin khách hàng
                    name: customerName,
                    phone: customerPhone,
                    address: customerAddress,
                    notes: orderNotes
                },
                date: orderDate,
                total: currentTotalAmount,
                status: 'Chờ xử lý',
                items: cart // Lưu trữ các sản phẩm trong đơn hàng
            };

            let orders = JSON.parse(localStorage.getItem('orders')) || [];
            orders.push(newOrder);
            localStorage.setItem('orders', JSON.stringify(orders)); // LƯU VÀO localStorage
            console.log('Đơn hàng mới đã được lưu vào localStorage:', newOrder);
            // --- KẾT THÚC LOGIC TẠO VÀ LƯU ĐƠN HÀNG ---

            // Mô phỏng quá trình thanh toán thành công
            showAlert('Đơn hàng đã được thanh toán thành công! Cảm ơn bạn đã mua hàng.', 'success');

            // Xóa toàn bộ giỏ hàng khỏi localStorage (LOGIC CŨ VẪN CHẠY)
            localStorage.removeItem('cart');

            // Cập nhật lại số lượng sản phẩm trên icon giỏ hàng về 0 (LOGIC CŨ VẪN CHẠY)
            updateCartCount(); // Gọi hàm đã được di chuyển lên trên

            // Hiển thị lại giỏ hàng trên trang cart.html (sẽ hiển thị giỏ hàng trống) (LOGIC CŨ VẪN CHẠY)
            displayCart();

            // (Tùy chọn) Chuyển hướng người dùng về trang chủ sau vài giây (LOGIC CŨ VẪN CHẠY)
            setTimeout(() => {
                window.location.href = 'index.html'; // Chuyển về trang chủ sau 3 giây
            }, 3000);
        });
    }
});
