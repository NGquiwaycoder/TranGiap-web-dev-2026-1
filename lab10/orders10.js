// Trang "Заказы": danh sách đơn của người dùng (GET /orders) + 3 cửa sổ
// modal: xem (Подробнее), sửa (PUT), xoá (DELETE)

const ordersBody = document.querySelector('.orders tbody');
const ordersWrapper = document.querySelector('.orders__wrapper');
const ordersEmpty = document.querySelector('.orders__empty');
const viewModal = document.getElementById('view-modal');
const editModal = document.getElementById('edit-modal');
const deleteModal = document.getElementById('delete-modal');
const editForm = document.getElementById('edit-form');
const editTime = document.getElementById('edit-time');
const deleteConfirm = document.getElementById('delete-confirm');

// Thứ tự + tên hiển thị các món trong "Состав заказа"
const dishFields = [
    { field: 'soup_id', label: 'Суп' },
    { field: 'main_course_id', label: 'Основное блюдо' },
    { field: 'salad_id', label: 'Салат' },
    { field: 'drink_id', label: 'Напиток' },
    { field: 'dessert_id', label: 'Десерт' }
];

let orders = [];
let currentOrder = null; // đơn đang mở trong modal

// Gửi request tới API (api_key luôn nằm trong URL). Server báo lỗi bằng
// { "error": "..." } + mã 4xx/5xx → ném lỗi với đúng câu đó
async function sendRequest(path, options) {
    const response = await fetch(
        `${API_URL}${path}?api_key=${API_KEY}`,
        options
    );
    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.error);
    }
    return result;
}

// Các món của 1 đơn: [{ label: 'Суп', dish: {...} }, ...] (bỏ loại trống)
function getOrderDishes(order) {
    return dishFields
        .filter(({ field }) => order[field])
        .map(({ field, label }) => ({
            label,
            dish: dishes.find((dish) => dish.id === order[field])
        }));
}

function getOrderPrice(order) {
    return getOrderDishes(order).reduce(
        (sum, { dish }) => sum + dish.price,
        0
    );
}

// Server lưu giờ UTC dạng "2026-11-02 18:41:23" → thêm "T" và "Z" để
// Date hiểu đúng, rồi in theo giờ máy người dùng: 02.11.2026 21:41
function formatDate(text) {
    const date = new Date(`${text.replace(' ', 'T')}Z`);
    const pad = (number) => String(number).padStart(2, '0');

    return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.` +
        `${date.getFullYear()} ${pad(date.getHours())}:` +
        `${pad(date.getMinutes())}`;
}

function formatDelivery(order) {
    if (order.delivery_type === 'by_time') {
        return order.delivery_time.slice(0, 5);
    }
    return 'Как можно скорее (с 07:00 до 23:00)';
}

// ===== Bảng đơn hàng =====

function createCell(text) {
    const cell = document.createElement('td');
    cell.textContent = text;
    return cell;
}

// Nút icon (Bootstrap Icons): data-action cho biết bấm vào để làm gì
function createActionButton(action, icon, title) {
    const button = document.createElement('button');
    button.className = 'orders__action';
    button.type = 'button';
    button.dataset.action = action;
    button.title = title;
    button.setAttribute('aria-label', title);

    const iconElement = document.createElement('i');
    iconElement.className = `bi ${icon}`;

    button.append(iconElement);
    return button;
}

function createOrderRow(order, index) {
    const row = document.createElement('tr');
    row.dataset.id = order.id;

    const names = getOrderDishes(order).map(({ dish }) => dish.name);
    const actions = document.createElement('td');
    actions.className = 'orders__actions';
    actions.append(
        createActionButton('view', 'bi-eye', 'Подробнее'),
        createActionButton('edit', 'bi-pencil', 'Редактирование'),
        createActionButton('delete', 'bi-trash', 'Удаление')
    );

    row.append(
        createCell(index + 1),
        createCell(formatDate(order.created_at)),
        createCell(names.join(', ')),
        createCell(`${getOrderPrice(order)}₽`),
        createCell(formatDelivery(order)),
        actions
    );
    return row;
}

function displayOrders() {
    ordersBody.innerHTML = '';

    orders.forEach((order, index) => {
        ordersBody.append(createOrderRow(order, index));
    });

    ordersEmpty.hidden = orders.length > 0;
    ordersWrapper.hidden = orders.length === 0;
}

// Mới nhất lên đầu: chuỗi "YYYY-MM-DD HH:MM:SS" so sánh như chữ là đúng
// thứ tự thời gian; trùng giây thì id lớn hơn (tạo sau) lên trước
async function loadOrders() {
    orders = await sendRequest('/orders');
    orders.sort((a, b) => b.created_at.localeCompare(a.created_at) ||
        b.id - a.id);
    displayOrders();
}

function refreshOrders() {
    loadOrders().catch((error) => {
        showNotification(`Не удалось загрузить заказы. ${error.message}`);
    });
}

// ===== Modal =====

function openModal(modal) {
    modal.hidden = false;
}

function closeModal(modal) {
    modal.hidden = true;
}

// 1 cặp "tên — giá trị" trong danh sách <dl> (dt = tên, dd = giá trị)
function addDetail(list, term, value) {
    const termElement = document.createElement('dt');
    termElement.textContent = term;

    const valueElement = document.createElement('dd');
    valueElement.textContent = value;

    list.append(termElement, valueElement);
}

function createTitle(text) {
    const title = document.createElement('h4');
    title.className = 'details__title';
    title.textContent = text;
    return title;
}

// Khối "Состав заказа" + "Стоимость" (dùng cho cả modal xem lẫn sửa)
function createDishesBlock(order) {
    const list = document.createElement('dl');
    list.className = 'details';

    getOrderDishes(order).forEach(({ label, dish }) => {
        addDetail(list, label, `${dish.name} (${dish.price}₽)`);
    });

    const total = document.createElement('p');
    total.className = 'details__total';
    total.textContent = `Стоимость: ${getOrderPrice(order)}₽`;

    const block = document.createElement('div');
    block.append(createTitle('Состав заказа'), list, total);
    return block;
}

function showViewModal(order) {
    const body = viewModal.querySelector('.modal__body');
    const dateList = document.createElement('dl');
    const deliveryList = document.createElement('dl');
    const comment = document.createElement('p');

    dateList.className = 'details';
    addDetail(dateList, 'Дата оформления', formatDate(order.created_at));

    deliveryList.className = 'details';
    addDetail(deliveryList, 'Имя получателя', order.full_name);
    addDetail(deliveryList, 'Адрес доставки', order.delivery_address);
    addDetail(deliveryList, 'Время доставки', formatDelivery(order));
    addDetail(deliveryList, 'Телефон', order.phone);
    addDetail(deliveryList, 'Email', order.email);

    comment.textContent = order.comment || '—';

    body.innerHTML = '';
    body.append(
        dateList,
        createTitle('Доставка'),
        deliveryList,
        createTitle('Комментарий'),
        comment,
        createDishesBlock(order)
    );
    openModal(viewModal);
}

// Giống form đặt hàng: ô giờ chỉ mở (và bắt buộc) khi chọn "Ко времени"
function setEditTimeEnabled(isEnabled) {
    editTime.disabled = !isEnabled;
    editTime.required = isEnabled;
}

// Điền sẵn dữ liệu đơn vào form. form.elements.<name> = ô có name đó
function showEditModal(order) {
    const fields = editForm.elements;
    const dishesBox = document.getElementById('edit-dishes');

    document.getElementById('edit-date').textContent =
        formatDate(order.created_at);
    fields.full_name.value = order.full_name;
    fields.delivery_address.value = order.delivery_address;
    fields.delivery_type.value = order.delivery_type;
    fields.delivery_time.value = (order.delivery_time || '').slice(0, 5);
    fields.phone.value = order.phone;
    fields.email.value = order.email;
    fields.comment.value = order.comment || '';
    setEditTimeEnabled(order.delivery_type === 'by_time');

    dishesBox.innerHTML = '';
    dishesBox.append(createDishesBlock(order));
    openModal(editModal);
}

// PUT /orders/{id}: chỉ gửi các ô của form sửa (FormData)
async function saveOrder() {
    try {
        await sendRequest(`/orders/${currentOrder.id}`, {
            method: 'PUT',
            body: new FormData(editForm)
        });
    } catch (error) {
        showNotification(`Не удалось изменить заказ. ${error.message}`);
        return;
    }

    closeModal(editModal);
    showNotification('Заказ успешно изменён');
    refreshOrders();
}

// DELETE /orders/{id}
async function deleteOrder() {
    try {
        await sendRequest(`/orders/${currentOrder.id}`, { method: 'DELETE' });
    } catch (error) {
        showNotification(`Не удалось удалить заказ. ${error.message}`);
        return;
    }

    closeModal(deleteModal);
    showNotification('Заказ успешно удалён');
    refreshOrders();
}

// ===== Sự kiện =====

// Event delegation: 1 listener cho mọi nút icon trong bảng
ordersBody.addEventListener('click', (event) => {
    const button = event.target.closest('[data-action]');

    if (!button) {
        return;
    }

    const id = Number(button.closest('tr').dataset.id);
    currentOrder = orders.find((order) => order.id === id);

    if (button.dataset.action === 'view') {
        showViewModal(currentOrder);
    } else if (button.dataset.action === 'edit') {
        showEditModal(currentOrder);
    } else {
        openModal(deleteModal);
    }
});

// Nút "×", "Ок", "Отмена" (có data-close) → đóng modal chứa nó
document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-close]');

    if (button) {
        closeModal(button.closest('.modal'));
    }
});

editForm.addEventListener('change', (event) => {
    if (event.target.name === 'delivery_type') {
        setEditTimeEnabled(event.target.value === 'by_time');
    }
});

// submit chỉ xảy ra khi các ô required hợp lệ; chặn tải lại trang
editForm.addEventListener('submit', (event) => {
    event.preventDefault();
    saveOrder();
});

deleteConfirm.addEventListener('click', deleteOrder);

// Cần danh sách món (tên, giá) trước, rồi mới tải đơn
loadDishes()
    .then(loadOrders)
    .catch((error) => {
        showNotification(`Не удалось загрузить заказы. ${error.message}`);
    });
