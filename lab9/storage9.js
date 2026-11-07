// Món đang chọn cho mỗi category (null = chưa chọn), dùng chung cho trang
// "Собрать ланч" và "Оформить заказ"
const selectedDishes = {
    soup: null,
    main: null,
    salad: null,
    drink: null,
    dessert: null
};

// localStorage chỉ lưu chuỗi → lưu object { soup: 1, drink: 19, ... }
// (chỉ id món) dưới dạng JSON
const STORAGE_KEY = 'lunch-order-lab9';

function saveSelection() {
    const ids = {};

    Object.keys(selectedDishes).forEach((category) => {
        if (selectedDishes[category]) {
            ids[category] = selectedDishes[category].id;
        }
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

// Đọc id từ localStorage rồi tìm món tương ứng trong dishes (đã tải từ
// server) → gọi SAU loadDishes()
function restoreSelection() {
    const ids = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};

    Object.keys(selectedDishes).forEach((category) => {
        const dish = dishes.find((item) => item.id === ids[category]);
        selectedDishes[category] = dish || null;
    });
}

function clearSelection() {
    localStorage.removeItem(STORAGE_KEY);

    Object.keys(selectedDishes).forEach((category) => {
        selectedDishes[category] = null;
    });
}

function hasSelection() {
    return Object.values(selectedDishes).some((dish) => dish !== null);
}

function getTotal() {
    return Object.values(selectedDishes).reduce(
        (sum, dish) => sum + (dish ? dish.price : 0),
        0
    );
}
