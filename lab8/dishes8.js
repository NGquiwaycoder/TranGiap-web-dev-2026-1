// Địa chỉ API và khoá API_KEY dùng chung cho mọi request tới server
const API_URL = 'https://api.rozetkaimg.me/labs/api';

// Khoá cá nhân (UUIDv4): server dựa vào nó để biết đơn nào là của ai.
// Có khoá từ СДО thì thay đúng dòng này
const API_KEY = '9a34e96d-b6d8-4190-9e88-acaa3014e5bb';

// Tên category trên server khác tên dùng trong trang (data-category,
// selectedDishes...) → đổi về tên của trang ngay khi tải về
const categoryNames = {
    soup: 'soup',
    main_course: 'main',
    salads_starters: 'salad',
    beverage: 'drink',
    dessert: 'dessert'
};

let dishes = [];

// Gửi GET /dishes, chờ server trả JSON rồi lưu vào biến dishes.
// async/await: await "dừng" hàm cho tới khi fetch/json() xong
async function loadDishes() {
    const response = await fetch(`${API_URL}/dishes`);

    // fetch chỉ báo lỗi khi mất mạng; lỗi 404/500... phải tự kiểm tra ok
    if (!response.ok) {
        throw new Error(`Ошибка сервера: ${response.status}`);
    }

    const data = await response.json();

    dishes = data.map((dish) => ({
        ...dish,
        category: categoryNames[dish.category]
    }));
}
