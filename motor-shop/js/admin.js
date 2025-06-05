// Xử lý sidebar toggle
document.addEventListener('DOMContentLoaded', function() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
            mainContent.classList.toggle('active');
        });
    }
    
    // Khởi tạo biểu đồ
    initCharts();
});

// Khởi tạo biểu đồ với Chart.js
function initCharts() {
    // Biểu đồ doanh thu
    const revenueCtx = document.getElementById('revenueChart');
    if (revenueCtx) {
        new Chart(revenueCtx, {
            type: 'line',
            data: {
                labels: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'],
                datasets: [{
                    label: 'Doanh thu (triệu VND)',
                    data: [120, 190, 150, 210, 180, 250, 300],
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
    // Biểu đồ loại xe bán chạy
    const productCtx = document.getElementById('productChart');
    if (productCtx) {
        new Chart(productCtx, {
            type: 'doughnut',
            data: {
                labels: ['Thể thao', 'Naked bike', 'Cruiser', 'Tay ga', 'Phân khối lớn'],
                datasets: [{
                    data: [35, 25, 15, 10, 15],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.7)',
                        'rgba(54, 162, 235, 0.7)',
                        'rgba(255, 206, 86, 0.7)',
                        'rgba(75, 192, 192, 0.7)',
                        'rgba(153, 102, 255, 0.7)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                    }
                }
            }
        });
    }
}

// Xử lý đăng nhập
async function handleLogin(username, password) {
    try {
        // Fetch dữ liệu từ file JSON
        const response = await fetch('data/accounts.json');
        const accounts = await response.json();

        // Kiểm tra tài khoản admin
        if (username === accounts.admin.username && password === accounts.admin.password) {
            localStorage.setItem('loggedIn', 'true');
            localStorage.setItem('role', 'admin');
            alert('Đăng nhập thành công với tài khoản admin!');
            window.location.href = 'admin.html';
            return;
        }

        // Kiểm tra tài khoản user
        const user = accounts.users.find(
            (user) => user.username === username && user.password === password
        );

        if (user) {
            localStorage.setItem('loggedIn', 'true');
            localStorage.setItem('role', 'user');
            alert('Đăng nhập thành công với tài khoản user!');
            window.location.href = 'index.html';
            return;
        }

        // Nếu không tìm thấy tài khoản
        alert('Tên đăng nhập hoặc mật khẩu không đúng!');
    } catch (error) {
        console.error('Lỗi khi xử lý đăng nhập:', error);
        alert('Có lỗi xảy ra, vui lòng thử lại sau!');
    }
}

// Xử lý sự kiện khi người dùng nhấn nút đăng nhập
document.addEventListener('DOMContentLoaded', function () {
    const loginButton = document.getElementById('loginButton');
    if (loginButton) {
        loginButton.addEventListener('click', function () {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            handleLogin(username, password);
        });
    }
});

// Xử lý phân quyền - kiểm tra đăng nhập
function checkLogin() {
    const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
    const role = localStorage.getItem('role');

    if (!isLoggedIn) {
        window.location.href = 'login.html'; // Chuyển hướng nếu chưa đăng nhập
    } else {
        // Kiểm tra quyền truy cập
        if (role === 'admin' && !window.location.pathname.includes('admin.html')) {
            window.location.href = 'admin.html';
        } else if (role === 'user' && !window.location.pathname.includes('index.html')) {
            window.location.href = 'index.html';
        }
    }
}

// Gọi hàm kiểm tra khi trang được tải
document.addEventListener('DOMContentLoaded', checkLogin);