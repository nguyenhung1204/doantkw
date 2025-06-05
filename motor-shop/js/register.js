async function handleRegister(username, password) {
    try {
        // Fetch dữ liệu từ file JSON
        const response = await fetch('data/accounts.json');
        const accounts = await response.json();

        // Kiểm tra xem tài khoản đã tồn tại chưa
        const userExists = accounts.users.some((user) => user.username === username);
        if (userExists) {
            alert('Tài khoản đã tồn tại!');
            return;
        }

        // Thêm tài khoản mới vào danh sách
        accounts.users.push({ username, password });

        // Ghi lại file JSON (giả lập)
        await fetch('data/accounts.json', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(accounts)
        });

        alert('Đăng ký thành công!');
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Lỗi khi xử lý đăng ký:', error);
        alert('Có lỗi xảy ra, vui lòng thử lại sau!');
    }
}

// Xử lý sự kiện khi người dùng nhấn nút đăng ký
document.addEventListener('DOMContentLoaded', function () {
    const registerButton = document.getElementById('registerButton');
    if (registerButton) {
        registerButton.addEventListener('click', function () {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            handleRegister(username, password);
        });
    }
});