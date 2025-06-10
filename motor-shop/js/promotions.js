// File: js/promotions.js

const promotions = [
    {
        id: 1,
        tenChuongTrinh: "Giảm 20% mùa hè",
        maGiam: "SUMMER20",
        giamGia: 20,
        ngayBatDau: "2025-06-01",
        ngayKetThuc: "2025-06-30",
        trangThai: "Đang diễn ra"
    },
    {
        id: 2,
        tenChuongTrinh: "Khuyến mãi sinh nhật",
        maGiam: "BDAY10",
        giamGia: 10,
        ngayBatDau: "2025-05-01",
        ngayKetThuc: "2025-05-05",
        trangThai: "Đã kết thúc"
    }
];

function renderPromotions() {
    const tbody = document.getElementById("dynamic-promotions-body");
    const emptyRow = document.querySelector("#promotionsTableBody .empty-row");
    if (emptyRow) emptyRow.style.display = "none";

    promotions.forEach(promo => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${promo.id}</td>
            <td>${promo.tenChuongTrinh}</td>
            <td>${promo.maGiam}</td>
            <td>${promo.giamGia}%</td>
            <td>${promo.ngayBatDau}</td>
            <td>${promo.ngayKetThuc}</td>
            <td>${promo.trangThai}</td>
            <td>
                <button class="btn btn-sm btn-warning">Sửa</button>
                <button class="btn btn-sm btn-danger">Xóa</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

document.addEventListener("DOMContentLoaded", renderPromotions);
