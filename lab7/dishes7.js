// Danh sách món giờ lấy từ server (API), không còn viết sẵn trong file nữa
const API_URL = 'https://api.rozetkaimg.me/labs/api';

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
