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
document.addEventListener('DOMContentLoaded', async function() {
    updateCartCount();

    // GỢI Ý TỪ KHÓA TỰ ĐỘNG TỪ SẢN PHẨM 
const searchInput = document.querySelector('input[type="search"]');
if (searchInput) {
    // Thu thập tất cả tên và mô tả sản phẩm để tạo từ khóa gợi ý
    const keywordSet = new Set();
    document.querySelectorAll('.product-card').forEach(card => {
        const title = card.querySelector('.card-title')?.textContent.trim();
        const desc = card.querySelector('.card-text')?.textContent.trim();
        if (title) keywordSet.add(title);
        if (desc) {
            desc.split('|').forEach(part => keywordSet.add(part.trim()));
        }
    });

    const keywords = Array.from(keywordSet);

    // Tạo dropdown gợi ý
    const suggestionBox = document.createElement('ul');
    suggestionBox.className = 'list-group position-absolute w-100';
    suggestionBox.style.zIndex = '9999';
    suggestionBox.style.top = '100%';
    suggestionBox.style.display = 'none';
    suggestionBox.style.maxHeight = '200px';
    suggestionBox.style.overflowY = 'auto';
    searchInput.parentElement.style.position = 'relative';
    searchInput.parentElement.appendChild(suggestionBox);

    // Hiển thị gợi ý
    searchInput.addEventListener('input', function () {
        const value = this.value.trim().toLowerCase();
        suggestionBox.innerHTML = '';

        if (!value) {
            suggestionBox.style.display = 'none';
            return;
        }

        const matched = keywords.filter(k =>
            k.toLowerCase().includes(value)
        ).slice(0, 10); // giới hạn 10 gợi ý

        if (matched.length === 0) {
            suggestionBox.style.display = 'none';
            return;
        }

        matched.forEach(keyword => {
            const li = document.createElement('li');
            li.className = 'list-group-item list-group-item-action';
            li.textContent = keyword;
            li.style.cursor = 'pointer';

            li.addEventListener('click', function () {
                searchInput.value = keyword;
                suggestionBox.style.display = 'none';
                searchForm.dispatchEvent(new Event('submit'));
            });

            suggestionBox.appendChild(li);
        });

        suggestionBox.style.display = 'block';
    });

    // Ẩn khi click ngoài
    document.addEventListener('click', function (e) {
        if (!searchInput.contains(e.target) && !suggestionBox.contains(e.target)) {
            suggestionBox.style.display = 'none';
        }
    });
}

    // Xử lý form tìm kiếm
    const searchForm = document.querySelector('form.d-flex');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchInput = this.querySelector('input[type="search"]');
            const keyword = searchInput.value.trim();
            if (keyword === '') {
                showAlert('Vui lòng nhập từ khóa tìm kiếm', 'warning');
                return;
            }
            window.location.href = `index.html?search=${encodeURIComponent(keyword)}`;
        });
    }

    // Nếu có từ khóa tìm kiếm trong URL thì lọc sản phẩm (trên index.html) -- chức năng tìm kiếm 
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get('search');

    if (searchTerm && document.querySelectorAll('.product-card').length > 0) {
        const keyword = searchTerm.toLowerCase();
        const cards = document.querySelectorAll('.product-card');
        let matchedCount = 0;

        cards.forEach(card => {
            const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
            const desc = card.querySelector('.card-text')?.textContent.toLowerCase() || '';
            if (title.includes(keyword) || desc.includes(keyword)) {
                card.parentElement.style.display = 'block';
                matchedCount++;
            } else {
                card.parentElement.style.display = 'none';
            }
        });

        if (matchedCount === 0) {
            const container = document.querySelector('.row');
            if (container) {
                container.innerHTML = '<p class="text-center">Không tìm thấy sản phẩm phù hợp.</p>';
            }
        }
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

// thêm phần xử lí tìm kiếm và phần gợi ý tìm kiếm 
