// Trang "Оформить заказ": hiện món đã chọn (nút "Удалить"), điền khối
// "Ваш заказ" trong form và gửi đơn lên server bằng fetch

// Tên trường id món mà API yêu cầu cho từng category
const orderFields = {
    soup: 'soup_id',
    main: 'main_course_id',
    salad: 'salad_id',
    drink: 'drink_id',
    dessert: 'dessert_id'
};

// Dòng chữ hiện khi category đó chưa có món ("Главное блюдо" là giống trung
// nên dùng "Не выбрано")
const emptyTexts = {
    soup: 'Не выбран',
    main: 'Не выбрано',
    salad: 'Не выбран',
    drink: 'Не выбран',
    dessert: 'Не выбран'
};

const orderList = document.querySelector('.dishes');
const emptyMessage = document.querySelector('.checkout__empty');
const orderForm = document.querySelector('.order__form');
const orderTotal = document.querySelector('.order__total');
const deliveryTime = document.getElementById('delivery-time');
const submitButton = orderForm.querySelector('[type="submit"]');

// Vẽ thẻ các món đã chọn theo thứ tự category (суп → ... → десерт)
function displayOrderDishes() {
    orderList.innerHTML = '';

    Object.values(selectedDishes).forEach((dish) => {
        if (dish) {
            orderList.append(createDishCard(dish, 'Удалить'));
        }
    });

    emptyMessage.hidden = hasSelection();
}

// Khối "Ваш заказ" bên trái form: tên + giá từng món, tổng tiền
function updateSummary() {
    Object.keys(selectedDishes).forEach((category) => {
        const dish = selectedDishes[category];
        const text = document.getElementById(`order-${category}`);

        text.textContent = dish
            ? `${dish.name} ${dish.price}₽`
            : emptyTexts[category];
    });

    orderTotal.textContent = `${getTotal()}₽`;
}

// Bấm "Удалить": bỏ món khỏi đơn + localStorage, xoá thẻ khỏi trang
function removeDish(card) {
    const dish = findDish(card.dataset.dish);

    selectedDishes[dish.category] = null;
    saveSelection();
    card.remove();
    emptyMessage.hidden = hasSelection();
    updateSummary();
}

// Ô giờ giao chỉ dùng khi chọn "К указанному времени". Ô bị khoá
// (disabled) thì trình duyệt KHÔNG gửi nó lên server
function setDeliveryTimeEnabled(isEnabled) {
    deliveryTime.disabled = !isEnabled;
    deliveryTime.required = isEnabled;
}

// Thiếu món → chặn gửi + hiện thông báo (giống lab6)
function checkOrder(event) {
    const error = getOrderError();

    if (error) {
        event.preventDefault();
        showNotification(error);
    }
}

// POST /orders. FormData lấy mọi ô có name trong form (multipart/form-data),
// thêm id các món đã chọn. api_key luôn nằm trong URL (query string)
async function sendOrder() {
    const formData = new FormData(orderForm);

    Object.keys(orderFields).forEach((category) => {
        if (selectedDishes[category]) {
            formData.append(orderFields[category], selectedDishes[category].id);
        }
    });

    try {
        const response = await fetch(`${API_URL}/orders?api_key=${API_KEY}`, {
            method: 'POST',
            body: formData
        });
        const result = await response.json();

        // Server báo lỗi dạng { "error": "..." } kèm mã 4xx/5xx
        if (!response.ok) {
            throw new Error(result.error);
        }

        // Thành công mới xoá localStorage; lỗi thì giữ nguyên để gửi lại
        clearSelection();
        orderForm.reset();
        displayOrderDishes();
        updateSummary();
        showNotification('Заказ успешно оформлен!');
    } catch (error) {
        showNotification(`Не удалось оформить заказ. ${error.message}`);
    }
}

// Event delegation: chỉ xử lý khi bấm nút trong .dish
orderList.addEventListener('click', (event) => {
    const button = event.target.closest('.dish button');

    if (button) {
        removeDish(button.closest('.dish'));
    }
});

// Đổi radio "Время доставки" → khoá/mở ô giờ giao
orderForm.addEventListener('change', (event) => {
    if (event.target.name === 'delivery_type') {
        setDeliveryTimeEnabled(event.target.value === 'by_time');
    }
});

// "Сбросить" chỉ xoá chữ đã nhập; món đã chọn bỏ bằng nút "Удалить"
orderForm.addEventListener('reset', () => {
    setDeliveryTimeEnabled(false);
});

// click chạy TRƯỚC bước trình duyệt kiểm tra các ô required → thiếu món là
// báo ngay. submit chỉ xảy ra khi mọi ô required đã hợp lệ
submitButton.addEventListener('click', checkOrder);

orderForm.addEventListener('submit', (event) => {
    // Chặn trình duyệt tự gửi form (tải lại trang) → tự gửi bằng fetch
    event.preventDefault();

    const error = getOrderError();

    if (error) {
        showNotification(error);
        return;
    }

    sendOrder();
});

setDeliveryTimeEnabled(false);

loadDishes()
    .then(() => {
        restoreSelection();
        displayOrderDishes();
        updateSummary();
    })
    .catch((error) => {
        showNotification(`Не удалось загрузить блюда. ${error.message}`);
    });
