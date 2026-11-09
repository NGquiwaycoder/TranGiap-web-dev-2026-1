// Trang "Собрать ланч": vẽ món, chọn món (lưu vào localStorage) và panel
// "Перейти к оформлению" dính ở đáy màn hình

const panel = document.querySelector('.checkout-panel');
const panelTotal = document.querySelector('.checkout-panel__total');
const panelLink = document.querySelector('.checkout-panel__link');

// Sắp xếp theo tên (A→Я) rồi chèn từng thẻ vào đúng section theo category
function displayDishes() {
    const sortedDishes = [...dishes].sort(
        (a, b) => a.name.localeCompare(b.name)
    );

    sortedDishes.forEach((dish) => {
        const list = document.querySelector(
            `.dishes[data-category="${dish.category}"]`
        );
        list.append(createDishCard(dish, 'Добавить'));
    });
}

// Viền thẻ món đã chọn, bỏ viền các thẻ khác cùng category
function highlightCard(category) {
    const dish = selectedDishes[category];
    const cards = document.querySelectorAll(
        `.dishes[data-category="${category}"] .dish`
    );

    cards.forEach((card) => {
        const isSelected = dish !== null && card.dataset.dish === dish.keyword;
        card.classList.toggle('dish--selected', isSelected);
    });
}

// Panel ẩn khi chưa chọn món nào. Link chỉ bấm được khi đúng 1 combo:
// <a> không có href thì không còn là link (không bấm, không Tab tới được)
function updatePanel() {
    panel.hidden = !hasSelection();
    panelTotal.textContent = `Стоимость заказа: ${getTotal()}₽`;

    if (isValidCombo()) {
        panelLink.href = 'checkout10.html';
    } else {
        panelLink.removeAttribute('href');
    }
}

function selectDish(keyword) {
    const dish = findDish(keyword);

    selectedDishes[dish.category] = dish;
    saveSelection();
    highlightCard(dish.category);
    updatePanel();
}

// Event delegation: bắt click ở document, chỉ xử lý khi bấm nút trong .dish
document.addEventListener('click', (event) => {
    const button = event.target.closest('.dish button');

    if (button) {
        selectDish(button.closest('.dish').dataset.dish);
    }
});

// Tải món xong → vẽ thẻ → lấy lại lựa chọn cũ từ localStorage → viền +
// panel. Lỗi mạng/server (catch) → báo người dùng
loadDishes()
    .then(() => {
        displayDishes();
        restoreSelection();
        Object.keys(selectedDishes).forEach(highlightCard);
        updatePanel();
    })
    .catch((error) => {
        showNotification(`Не удалось загрузить блюда. ${error.message}`);
    });
