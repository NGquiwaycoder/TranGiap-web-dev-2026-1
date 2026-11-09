// Kiểm tra món đã chọn có khớp 1 combo không.
// Dùng selectedDishes khai báo trong storage10.js

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
