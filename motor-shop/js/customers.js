document.addEventListener('DOMContentLoaded', function() {
    const customersTableBody = document.getElementById('dynamic-customers-body');

    // Dữ liệu khách hàng mẫu (có thể thay thế bằng dữ liệu từ API thực tế)
    let customers = [
        { id: 1, name: 'Nguyễn Văn A', email: 'vana@example.com', phone: '0901234567', registrationDate: '2023-01-15', status: 'Active' },
        { id: 2, name: 'Trần Thị B', email: 'thib@example.com', phone: '0912345678', registrationDate: '2023-03-20', status: 'Active' },
        { id: 3, name: 'Lê Văn C', email: 'vanc@example.com', phone: '0987654321', registrationDate: '2023-05-10', status: 'Inactive' }
    ];

    // Hàm hiển thị danh sách khách hàng
    function displayCustomers() {
        customersTableBody.innerHTML = ''; // Xóa nội dung hiện có
        if (customers.length === 0) {
            customersTableBody.innerHTML = `
                <tr class="empty-row">
                    <td colspan="7" class="text-center text-muted">Chưa có khách hàng nào.</td>
                </tr>
            `;
            return;
        }

        customers.forEach(customer => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${customer.id}</td>
                <td>${customer.name}</td>
                <td>${customer.email}</td>
                <td>${customer.phone}</td>
                <td>${customer.registrationDate}</td>
                <td>
                    <span class="badge ${customer.status === 'Active' ? 'bg-success' : 'bg-danger'}">
                        ${customer.status}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-info edit-customer" data-id="${customer.id}">Sửa</button>
                    <button class="btn btn-sm btn-danger delete-customer" data-id="${customer.id}">Xóa</button>
                </td>
            `;
            customersTableBody.appendChild(row);
        });

        // Gắn sự kiện cho nút Sửa và Xóa
        attachCustomerEventListeners();
    }

    // Hàm gắn sự kiện cho các nút Sửa/Xóa
    function attachCustomerEventListeners() {
        document.querySelectorAll('.edit-customer').forEach(button => {
            button.addEventListener('click', function() {
                const customerId = parseInt(this.dataset.id);
                editCustomer(customerId);
            });
        });

        document.querySelectorAll('.delete-customer').forEach(button => {
            button.addEventListener('click', function() {
                const customerId = parseInt(this.dataset.id);
                deleteCustomer(customerId);
            });
        });
    }

    // Hàm thêm khách hàng (ví dụ: mở modal hoặc form)
    function addCustomer() {
        alert('Chức năng thêm khách hàng sẽ được triển khai tại đây!');
       
    }

    // Hàm sửa khách hàng (ví dụ: mở modal với dữ liệu đã có)
    function editCustomer(id) {
        const customerToEdit = customers.find(customer => customer.id === id);
        if (customerToEdit) {
            alert(`Sửa thông tin khách hàng: ${customerToEdit.name} (ID: ${id})`);
            
        }
    }

    // Hàm xóa khách hàng
    function deleteCustomer(id) {
        if (confirm(`Bạn có chắc chắn muốn xóa khách hàng ID: ${id} không?`)) {
            customers = customers.filter(customer => customer.id !== id);
            displayCustomers(); // Cập nhật lại bảng
            alert(`Đã xóa khách hàng ID: ${id}`);
        }
    }

    // Gọi hàm hiển thị khách hàng khi trang được tải
    displayCustomers();

    
});