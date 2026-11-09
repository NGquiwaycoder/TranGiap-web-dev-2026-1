// Kiểm tra món đã chọn có khớp 1 combo không + thông báo (popup).
// Dùng selectedDishes khai báo trong storage8.js

// 5 combo hợp lệ (tráng miệng thêm vào combo nào cũng được nên không có ở đây)
const combos = [
    ['soup', 'main', 'salad', 'drink'],
    ['soup', 'main', 'drink'],
    ['soup', 'salad', 'drink'],
    ['main', 'salad', 'drink'],
    ['main', 'drink']
];

const comboCategories = ['soup', 'main', 'salad', 'drink'];

function isChosen(category) {
    return selectedDishes[category] !== null;
}

// Đúng 1 combo: mọi loại trong combo đều đã chọn, mọi loại ngoài combo
// đều chưa chọn
function isValidCombo() {
    return combos.some((combo) => comboCategories.every(
        (category) => combo.includes(category) === isChosen(category)
    ));
}

// Nội dung thông báo cần hiện ('' = đơn hợp lệ)
function getOrderError() {
    const hasSoup = isChosen('soup');
    const hasMain = isChosen('main');
    const hasSalad = isChosen('salad');
    const hasDrink = isChosen('drink');
    const hasDessert = isChosen('dessert');

    if (isValidCombo()) {
        return '';
    }
    if (!hasSoup && !hasMain && !hasSalad && !hasDrink && !hasDessert) {
        return 'Ничего не выбрано. Выберите блюда для заказа';
    }
    if (!hasSoup && !hasMain && !hasSalad) {
        return 'Выберите главное блюдо';
    }
    if (hasSoup && !hasMain && !hasSalad) {
        return 'Выберите главное блюдо/салат/стартер';
    }
    if (hasSalad && !hasSoup && !hasMain) {
        return 'Выберите суп или главное блюдо';
    }
    return 'Выберите напиток';
}

function closeNotification() {
    const notification = document.querySelector('.notification');

    if (notification) {
        notification.remove();
    }
}

// Thông báo được tạo mới bằng JS mỗi lần cần hiện, bấm "Окей" thì xoá đi
function showNotification(text) {
    closeNotification();

    const notification = document.createElement('div');
    notification.className = 'notification';

    const message = document.createElement('p');
    message.className = 'notification__text';
    message.textContent = text;

    const button = document.createElement('button');
    button.className = 'notification__button';
    button.type = 'button';
    button.textContent = 'Окей 👌';
    button.addEventListener('click', closeNotification);

    notification.append(message, button);
    document.body.append(notification);
    button.focus();
}
