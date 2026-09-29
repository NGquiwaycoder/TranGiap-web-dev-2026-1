// Món đang được chọn cho mỗi category (null = chưa chọn)
const selectedDishes = {
    soup: null,
    main: null,
    drink: null
};

// Dòng chữ hiện khi category đó chưa có món
const emptyTexts = {
    soup: 'Блюдо не выбрано',
    main: 'Блюдо не выбрано',
    drink: 'Напиток не выбран'
};

const orderForm = document.querySelector('.order__form');
const orderEmpty = document.querySelector('.order__empty');
const orderSummary = document.querySelector('.order__summary');
const orderTotal = document.querySelector('.order__total');

// Tìm món trong mảng dishes theo keyword (lấy từ data-dish của thẻ)
function findDish(keyword) {
    return dishes.find((dish) => dish.keyword === keyword);
}

// Viền thẻ món đã chọn, bỏ viền các thẻ khác cùng category
function highlightCard(category, keyword) {
    const cards = document.querySelectorAll(
        `.dishes[data-category="${category}"] .dish`
    );

    cards.forEach((card) => {
        const isSelected = card.dataset.dish === keyword;
        card.classList.toggle('dish--selected', isSelected);
    });
}

// Vẽ lại khối "Ваш заказ", cập nhật input ẩn và tổng tiền
function updateOrder() {
    const categories = Object.keys(selectedDishes);
    const hasSelection = categories.some(
        (category) => selectedDishes[category] !== null
    );
    let total = 0;

    orderEmpty.hidden = hasSelection;
    orderSummary.hidden = !hasSelection;

    categories.forEach((category) => {
        const dish = selectedDishes[category];
        const text = document.getElementById(`order-${category}`);
        const input = document.getElementById(`input-${category}`);

        if (dish) {
            text.textContent = `${dish.name} ${dish.price}₽`;
            input.value = dish.keyword;
            total += dish.price;
        } else {
            text.textContent = emptyTexts[category];
            input.value = '';
        }
    });

    orderTotal.textContent = `${total}₽`;
}

function selectDish(keyword) {
    const dish = findDish(keyword);

    selectedDishes[dish.category] = dish;
    highlightCard(dish.category, keyword);
    updateOrder();
}

// Event delegation: bắt click ở document, chỉ xử lý khi bấm nút trong .dish
document.addEventListener('click', (event) => {
    const button = event.target.closest('.dish button');

    if (!button) {
        return;
    }

    selectDish(button.closest('.dish').dataset.dish);
});

// Nút "Сбросить" xoá luôn các món đã chọn
orderForm.addEventListener('reset', () => {
    Object.keys(selectedDishes).forEach((category) => {
        selectedDishes[category] = null;
        highlightCard(category, null);
    });

    updateOrder();
});

updateOrder();
