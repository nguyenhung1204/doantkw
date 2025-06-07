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
    setupOrderTabEvents();// 
    updateNotificationDropdown();//
    renderDynamicOrdersToTable(); // 
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

//////////////////////////////////////////////////////////////////////////////////////////
// --- HÀM MỚI ĐƯỢC THÊM VÀO ---

// Hàm lấy tất cả đơn hàng từ localStorage (ĐÃ CHUYỂN TỪ sessionStorage)
function getAllOrdersFromLocalStorage() {
    return JSON.parse(localStorage.getItem('orders')) || [];
}

// Function to attach events for viewing customer details
function attachCustomerDetailsEvents() {
    document.querySelectorAll('.view-customer-details').forEach(button => {
        button.addEventListener('click', function() {
            const name = this.dataset.name;
            const phone = this.dataset.phone;
            const address = this.dataset.address;
            const notes = this.dataset.notes;

            document.getElementById('modalCustomerName').textContent = name;
            document.getElementById('modalCustomerPhone').textContent = phone;
            document.getElementById('modalCustomerAddress').textContent = address;
            document.getElementById('modalOrderNotes').textContent = notes || 'Không có ghi chú.'; // Hiển thị "Không có ghi chú" nếu trống
        });
    });
}

// Hàm render đơn hàng động vào bảng (ĐÃ ĐIỀU CHỈNH ĐỂ DÙNG getAllOrdersFromLocalStorage)
function renderDynamicOrdersToTable() {
    const ordersTableBody = document.getElementById('ordersTableBody');
    ordersTableBody.innerHTML = ''; // Clear existing rows

    let orders = JSON.parse(localStorage.getItem('orders')) || [];

    if (orders.length === 0) {
        // Cập nhật colspan cho thông báo trống
        ordersTableBody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Chưa có đơn hàng nào.</td></tr>';
        return;
    }

    orders.forEach(order => {
        const row = document.createElement('tr');
        // Thêm class cho các đơn hàng "Chờ xử lý" để dễ nhận biết
        if (order.status === 'Chờ xử lý') {
            row.classList.add('table-warning');
        }

        // Lấy thông tin khách hàng, kiểm tra nếu có tồn tại
        const customerName = order.customerInfo ? order.customerInfo.name : 'N/A';
        const customerPhone = order.customerInfo ? order.customerInfo.phone : 'N/A';
        const customerAddress = order.customerInfo ? order.customerInfo.address : 'N/A';
        const orderNotes = order.customerInfo ? order.customerInfo.notes : '';

        row.innerHTML = `
            <td>${order.id}</td>
            <td>${order.date}</td>
            <td>
                <strong>${customerName}</strong><br>
                <small>${customerPhone}</small><br>
                <button class="btn btn-link btn-sm p-0 text-decoration-none view-customer-details"
                        data-bs-toggle="modal" data-bs-target="#customerDetailsModal"
                        data-name="${customerName}"
                        data-phone="${customerPhone}"
                        data-address="${customerAddress}"
                        data-notes="${orderNotes}">
                    Xem chi tiết
                </button>
            </td>
            <td>${order.total.toLocaleString('vi-VN')} VNĐ</td>
            <td><span class="badge bg-secondary">${order.status}</span></td>
            <td>
                <button class="btn btn-info btn-sm view-order-details" data-order-id="${order.id}">Xem ĐH</button>
                <button class="btn btn-success btn-sm mark-order-completed" data-order-id="${order.id}">Hoàn thành</button>
            </td>
        `;
        ordersTableBody.appendChild(row);
    });

    attachOrderTableEvents(); // Attach events after rendering
    attachCustomerDetailsEvents(); // Thêm hàm mới để gắn sự kiện cho nút "Xem chi tiết"
}

// Hàm để gắn sự kiện cho việc kích hoạt tab "Đơn hàng" (ĐÃ ĐIỀU CHỈNH ĐỂ GỌI renderDynamicOrdersToTable)
function setupOrderTabEvents() {
    const orderTabLink = document.getElementById('order'); // Lấy thẻ A với id="order"
    if (orderTabLink) {
        // Sử dụng event 'shown.bs.tab' của Bootstrap
        orderTabLink.addEventListener('shown.bs.tab', function (event) {
            console.log('Tab Đơn hàng đã được hiển thị, đang tải dữ liệu đơn hàng động.');
            renderDynamicOrdersToTable(); // Gọi hàm hiển thị đơn hàng để tải dữ liệu mới nhất
        });
    }
}

// Gắn các sự kiện cho nút "Xem" và "Hoàn thành"
function attachOrderTableEvents() {
    document.querySelectorAll('.view-order-details').forEach(button => {
        button.addEventListener('click', function() {
            const orderId = this.dataset.orderId;
            viewOrderDetails(orderId);
        });
    });

    document.querySelectorAll('.mark-order-completed').forEach(button => {
        button.addEventListener('click', function() {
            const orderId = this.dataset.orderId;
            markOrderCompleted(orderId);
        });
    });
}

// Xử lý xem chi tiết đơn hàng (có thể mở modal hoặc trang mới)
function viewOrderDetails(orderId) {
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    const order = orders.find(o => o.id === orderId);

    if (order) {
        let details = `
            <p><strong>ID Đơn hàng:</strong> ${order.id}</p>
            <p><strong>Ngày đặt:</strong> ${order.date}</p>
            <p><strong>Thông tin khách hàng:</strong></p>
            <ul>
                <li>Họ và tên: ${order.customerInfo ? order.customerInfo.name : 'N/A'}</li>
                <li>Số điện thoại: ${order.customerInfo ? order.customerInfo.phone : 'N/A'}</li>
                <li>Địa chỉ: ${order.customerInfo ? order.customerInfo.address : 'N/A'}</li>
                <li>Ghi chú: ${order.customerInfo ? (order.customerInfo.notes || 'Không có') : 'Không có'}</li>
            </ul>
            <p><strong>Tổng tiền:</strong> ${order.total.toLocaleString('vi-VN')} VNĐ</p>
            <p><strong>Trạng thái:</strong> ${order.status}</p>
            <h5>Sản phẩm:</h5>
            <ul>
        `;
        order.items.forEach(item => {
            details += `<li>${item.name} (x${item.quantity}) - ${item.price.toLocaleString('vi-VN')} VNĐ/sp</li>`;
        });
        details += `</ul>`;
        showAlert(`Chi tiết đơn hàng ${orderId}:\n\n${details}`, 'info'); // Dùng alert tạm, nên dùng modal
        console.log('Chi tiết đơn hàng:', order);
    } else {
        showAlert('Không tìm thấy đơn hàng này.', 'danger');
    }
}

// Xử lý đánh dấu đơn hàng là hoàn thành
function markOrderCompleted(orderId) {
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    const orderIndex = orders.findIndex(o => o.id === orderId);

    if (orderIndex > -1) {
        orders[orderIndex].status = 'Đã hoàn thành'; // Cập nhật trạng thái
        localStorage.setItem('orders', JSON.stringify(orders));
        showAlert(`Đơn hàng ${orderId} đã được đánh dấu là HOÀN THÀNH.`, 'success');
        renderDynamicOrdersToTable(); // Render lại bảng
        updateNotificationDropdown(); // Cập nhật lại thông báo
    } else {
        showAlert('Không tìm thấy đơn hàng này để hoàn thành.', 'danger');
    }
}

// Thay thế hàm showAlert hiện tại bằng hàm hiển thị Bootstrap Toast
function showAlert(message, type) {
    const toastLiveExample = document.getElementById('liveToast');
    const toastHeader = document.getElementById('toastHeader');
    const toastBody = document.getElementById('toastBody');

    if (toastLiveExample && toastHeader && toastBody) {
        toastBody.textContent = message;

        // Cập nhật tiêu đề và màu sắc dựa trên loại thông báo
        if (type === 'success') {
            toastHeader.textContent = 'Thành công';
            toastLiveExample.classList.remove('bg-danger', 'bg-info');
            toastLiveExample.classList.add('bg-success', 'text-white'); // Thêm màu nền và chữ trắng
        } else if (type === 'danger') {
            toastHeader.textContent = 'Lỗi';
            toastLiveExample.classList.remove('bg-success', 'bg-info');
            toastLiveExample.classList.add('bg-danger', 'text-white'); // Thêm màu nền và chữ trắng
        } else if (type === 'info') {
            toastHeader.textContent = 'Thông tin';
            toastLiveExample.classList.remove('bg-success', 'bg-danger');
            toastLiveExample.classList.add('bg-info', 'text-white'); // Thêm màu nền và chữ trắng
        } else {
            toastHeader.textContent = 'Thông báo'; // Mặc định
            toastLiveExample.classList.remove('bg-success', 'bg-danger', 'bg-info', 'text-white');
            toastLiveExample.classList.add('text-dark'); // Màu chữ mặc định
        }
        
        const toast = new bootstrap.Toast(toastLiveExample);
        toast.show();
        console.log(`Đã hiển thị Toast: ${message} (Loại: ${type})`);
    } else {
        // Fallback về alert nếu không tìm thấy các phần tử Toast
        console.warn('Không tìm thấy các phần tử Toast, sử dụng alert làm fallback.');
        alert(message);
    }
}

// --- NEW FUNCTION: Update Notification Dropdown with New Orders ---
function updateNotificationDropdown() {
    console.log('Bắt đầu updateNotificationDropdown...');
    // notificationDropdownMenu giờ là thẻ UL có ID 'notification'
    const notificationDropdownMenu = document.getElementById('notification'); 
    const notificationBadge = document.querySelector('#notificationDropdown .badge');
    
    // Tinh chỉnh cách lấy notificationHeaderLi: Lấy trực tiếp thẻ h6
    const notificationHeaderH6 = notificationDropdownMenu ? notificationDropdownMenu.querySelector('li .dropdown-header') : null;
    let insertionPoint = null;

    // Debug: Kiểm tra xem các phần tử có được tìm thấy không
    console.log('notificationDropdownMenu (UL with ID notification):', notificationDropdownMenu);
    console.log('notificationBadge:', notificationBadge);
    console.log('notificationHeaderH6 (h6 header):', notificationHeaderH6); // Log the h6 directly

    if (!notificationDropdownMenu) {
        console.warn('Không tìm thấy menu dropdown thông báo với ID "notification". Dừng cập nhật.');
        return;
    }

    // Đặt điểm chèn là thẻ LI chứa header thông báo
    if (notificationHeaderH6) {
        insertionPoint = notificationHeaderH6.closest('li'); // Get the parent LI of the h6
        console.log('Insertion point (LI của Thông báo):', insertionPoint);
    } else {
        console.warn('Không tìm thấy header thông báo trong menu dropdown. Sẽ cố gắng thêm vào đầu menu.');
        // Fallback: Chèn sau phần tử LI đầu tiên nếu header không tìm thấy
        insertionPoint = notificationDropdownMenu.querySelector('li:first-child');
        if (insertionPoint) {
            console.log('Fallback insertion point (first LI):', insertionPoint);
        } else {
            console.warn('Không tìm thấy điểm chèn nào trong menu thông báo.');
            return; 
        }
    }

    // Xóa các thông báo đơn hàng động cũ để tránh trùng lặp
    notificationDropdownMenu.querySelectorAll('.dynamic-notification-item').forEach(item => item.remove());
    console.log('Đã xóa các thông báo động cũ.');

    let orders = getAllOrdersFromLocalStorage(); 
    console.log('Tổng số đơn hàng từ localStorage:', orders.length, orders);

    // Lọc ra các đơn hàng có trạng thái "Chờ xử lý"
    const newOrders = orders.filter(order => order.status === 'Chờ xử lý');
    console.log('Số lượng đơn hàng "Chờ xử lý" sau khi lọc:', newOrders.length, newOrders);


    if (newOrders.length === 0) {
        console.log('Không có đơn hàng mới nào để hiển thị trong thông báo.');
        if (notificationBadge) {
            notificationBadge.textContent = ''; 
            notificationBadge.classList.add('d-none'); 
            console.log('Badge thông báo đã được ẩn/xóa số.');
        }
        return;
    }

    // Sắp xếp đơn hàng theo ngày, mới nhất lên trước
    newOrders.sort((a, b) => {
        const [dayA, monthA, yearA] = a.date.split('/');
        const [dayB, monthB, yearB] = b.date.split('/');
        const dateA = new Date(parseInt(yearA), parseInt(monthA) - 1, parseInt(dayA));
        const dateB = new Date(parseInt(yearB), parseInt(monthB) - 1, parseInt(dayB));
        return dateB.getTime() - dateA.getTime();
    });

    let newNotificationCount = 0;

    newOrders.forEach(order => {
        const listItem = document.createElement('li');
        listItem.classList.add('dynamic-notification-item'); 
        
        const link = document.createElement('a');
        link.classList.add('dropdown-item');
        link.href = `#orders-tab-pane`; 
        link.setAttribute('data-bs-toggle', 'tab');
        link.setAttribute('data-bs-target', '#orders-tab-pane');
        link.setAttribute('aria-controls', 'orders-tab-pane');
        link.setAttribute('aria-selected', 'false'); 
        
        // Cố gắng hiển thị ID đơn hàng ngắn hơn (nếu có tiền tố ORD-)
        const displayOrderId = order.id.startsWith('ORD-') ? order.id.split('-')[1] : order.id;
        link.innerHTML = `Đơn hàng mới #${displayOrderId} - ${order.customer} (${order.status})`; 

        // Thêm event listener để khi click vào thông báo, tab Đơn hàng sẽ được kích hoạt
        link.addEventListener('click', function(e) {
            e.preventDefault(); 
            const ordersTab = document.getElementById('order');
            if (ordersTab) {
                const bsTab = new bootstrap.Tab(ordersTab);
                bsTab.show(); 
                console.log(`Đã chuyển đến tab Đơn hàng từ thông báo #${order.id}`);
            }
        });

        listItem.appendChild(link);
        
        // Chèn thông báo mới ngay sau header
        if (insertionPoint) {
            insertionPoint.after(listItem);
            insertionPoint = listItem; // Cập nhật điểm chèn cho thông báo tiếp theo
            console.log(`Đã chèn thông báo cho đơn hàng ${order.id}`);
        } else {
            // Trường hợp fallback: chèn vào cuối menu nếu không tìm thấy điểm chèn cụ thể
            notificationDropdownMenu.appendChild(listItem); 
            console.log(`Fallback: Đã chèn thông báo cho đơn hàng ${order.id} vào cuối menu.`);
        }
        newNotificationCount++;
    });

    // Cập nhật badge số lượng thông báo
    if (notificationBadge) {
        if (newNotificationCount > 0) {
            notificationBadge.textContent = newNotificationCount;
            notificationBadge.classList.remove('d-none'); 
            console.log(`Badge thông báo đã được cập nhật: ${newNotificationCount}`);
        } else {
            notificationBadge.textContent = '';
            notificationBadge.classList.add('d-none'); 
            console.log('Badge thông báo đã được ẩn/xóa số.');
        }
    }
    console.log(`Hoàn tất cập nhật thông báo. Có ${newNotificationCount} đơn hàng mới.`);
}
