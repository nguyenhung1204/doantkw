// Khởi tạo giỏ hàng từ localStorage hoặc tạo mới
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Cập nhật số lượng sản phẩm trong giỏ hàng
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Thêm sản phẩm vào giỏ hàng
function addToCart(productId, productName, productPrice, productImage) {
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: productPrice,
            image: productImage,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showAlert('Đã thêm sản phẩm vào giỏ hàng', 'success');
}

// Hiển thị thông báo
function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} position-fixed top-0 end-0 m-3`;
    alertDiv.style.zIndex = '9999';
    alertDiv.style.transition = 'all 0.3s';
    alertDiv.textContent = message;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.style.opacity = '0';
        setTimeout(() => {
            alertDiv.remove();
        }, 300);
    }, 3000);
}

// Xử lý sự kiện khi DOM đã tải xong
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    
    // Xử lý form tìm kiếm
    const searchForm = document.querySelector('form.d-flex');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchInput = this.querySelector('input[type="search"]');
            if (searchInput.value.trim() === '') {
                showAlert('Vui lòng nhập từ khóa tìm kiếm', 'warning');
            } else {
                // Thực hiện tìm kiếm
                showAlert(`Đang tìm kiếm: ${searchInput.value}`, 'info');
            }
        });
    }
    
    // Xử lý slider tự động chuyển
    const myCarousel = document.querySelector('#mainSlider');
    if (myCarousel) {
        const carousel = new bootstrap.Carousel(myCarousel, {
            interval: 5000,
            pause: 'hover'
        });
    }
});

// Validate form đăng ký (sẽ dùng cho register.html)
function validateRegisterForm() {
    const form = document.getElementById('register-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = form.querySelector('#email').value;
            const password = form.querySelector('#password').value;
            const confirmPassword = form.querySelector('#confirm-password').value;
            let isValid = true;
            
            // Validate email
            if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
                showAlert('Email không hợp lệ', 'danger');
                isValid = false;
            }
            
            // Validate password
            if (password.length < 6) {
                showAlert('Mật khẩu phải có ít nhất 6 ký tự', 'danger');
                isValid = false;
            }
            
            // Validate confirm password
            if (password !== confirmPassword) {
                showAlert('Mật khẩu không khớp', 'danger');
                isValid = false;
            }
            
            if (isValid) {
                showAlert('Đăng ký thành công!', 'success');
                // Thực tế sẽ gửi dữ liệu đến server
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1500);
            }
        });
    }
}

// Gọi hàm validate khi trang đăng ký được tải
if (window.location.pathname.includes('register.html')) {
    document.addEventListener('DOMContentLoaded', validateRegisterForm);
}