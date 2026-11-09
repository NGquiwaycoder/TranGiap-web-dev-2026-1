// API "Food Construct" tự làm, thay cho API khoá học đang không hoạt động.
// Cùng địa chỉ (/labs/api/...), cùng định dạng dữ liệu và câu báo lỗi
// như đề lab 7–9. Chạy trên Netlify Functions; đơn hàng lưu ở Netlify Blobs
import { getStore } from '@netlify/blobs';
import dishes from '../dishes.json' with { type: 'json' };

const AUTH_ERROR = 'Для получения доступа к API необходимо пройти ' +
    'процедуру авторизации. Для этого нужно передать в запросе ' +
    'персональный API Key.';

const MAX_ORDERS = 10;

// Trường id món trong đơn → category của món
const DISH_FIELDS = {
    soup_id: 'soup',
    main_course_id: 'main_course',
    salad_id: 'salads_starters',
    drink_id: 'beverage',
    dessert_id: 'dessert'
};

// 5 combo hợp lệ (tráng miệng thêm vào combo nào cũng được)
const COMBOS = [
    ['soup_id', 'main_course_id', 'salad_id', 'drink_id'],
    ['soup_id', 'main_course_id', 'drink_id'],
    ['soup_id', 'salad_id', 'drink_id'],
    ['main_course_id', 'salad_id', 'drink_id'],
    ['main_course_id', 'drink_id']
];

const COMBO_FIELDS = ['soup_id', 'main_course_id', 'salad_id', 'drink_id'];

// Các trường được phép sửa bằng PUT (theo đề lab 9)
const EDITABLE_FIELDS = [
    'full_name', 'email', 'phone', 'delivery_address',
    'delivery_type', 'delivery_time', 'comment'
];

const REQUIRED_FIELDS = ['full_name', 'email', 'phone', 'delivery_address'];

// Cho phép gọi API từ trang ở domain khác (vd khi test trên localhost)
const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
};

const API_INFO = {
    name: 'Food Construct API',
    description: 'Собственный эмулятор API курса «Основы веб-технологий»',
    authorization: 'api_key в строке запроса (нужен для /orders)',
    endpoints: [
        'GET /labs/api/dishes',
        'GET /labs/api/dishes/{id}',
        'GET /labs/api/orders',
        'GET /labs/api/orders/{id}',
        'POST /labs/api/orders',
        'PUT /labs/api/orders/{id}',
        'DELETE /labs/api/orders/{id}'
    ]
};

// Lỗi có mã HTTP đi kèm → trả về dạng { "error": "..." }
class ApiError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}

function sendJson(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            ...CORS_HEADERS
        }
    });
}

function toText(value) {
    return value === undefined || value === null ? '' : String(value).trim();
}

// "2026-11-02 18:41:23" (giờ UTC), giống API khoá học
function formatDateTime(date) {
    return date.toISOString().slice(0, 19).replace('T', ' ');
}

// Số phút từ 00:00 theo giờ Moskva (UTC+3, không đổi giờ mùa hè)
function moscowMinutes() {
    const moscow = new Date(Date.now() + 3 * 60 * 60 * 1000);
    return moscow.getUTCHours() * 60 + moscow.getUTCMinutes();
}

// Mỗi API key ứng với 1 "người dùng" → lấy 1 số cố định làm student_id
function getStudentId(apiKey) {
    let hash = 0;

    for (const char of apiKey) {
        hash = (hash * 31 + char.charCodeAt(0)) % 1000000;
    }
    return hash;
}

// Ảnh lưu dạng "soups/gazpacho.webp" → link đầy đủ theo domain hiện tại
function withImageUrl(dish, origin) {
    return { ...dish, image: `${origin}/api/images/${dish.image}` };
}

// Đọc dữ liệu gửi lên: JSON hoặc FormData (multipart / urlencoded)
async function readBody(request) {
    const type = request.headers.get('content-type') || '';

    if (type.includes('application/json')) {
        try {
            return await request.json();
        } catch {
            throw new ApiError(400, 'Тело запроса не является JSON');
        }
    }
    if (type.includes('form')) {
        return Object.fromEntries(await request.formData());
    }
    return {};
}

// ===== Kiểm tra dữ liệu đơn hàng =====

// oldTime: giờ của đơn cũ (khi sửa). Giờ không đổi thì không bắt lỗi
// "раньше текущего времени" để vẫn sửa được tên, địa chỉ...
function checkTime(time, oldTime) {
    if (!/^\d{2}:\d{2}$/.test(time)) {
        throw new ApiError(400, 'Время доставки указывается в формате HH:MM');
    }

    const [hours, minutes] = time.split(':').map(Number);
    const total = hours * 60 + minutes;

    if (minutes > 59 || total < 7 * 60 || total > 23 * 60) {
        throw new ApiError(400, 'Доступное время доставки: с 7:00 до 23:00');
    }
    if (minutes % 5 !== 0) {
        throw new ApiError(400, 'Время доставки указывается с шагом 5 минут');
    }
    if (time !== oldTime && total < moscowMinutes()) {
        throw new ApiError(
            400,
            'Время доставки не может быть раньше текущего времени'
        );
    }
}

// Thông tin khách + giao hàng. old = đơn cũ (khi sửa) hoặc null
function checkCustomer(data, old) {
    const result = {};

    REQUIRED_FIELDS.forEach((field) => {
        result[field] = toText(data[field]);

        if (!result[field]) {
            throw new ApiError(400, `Поле ${field} обязательно`);
        }
    });

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result.email)) {
        throw new ApiError(400, 'Некорректный email');
    }

    result.delivery_type = toText(data.delivery_type);
    result.delivery_time = null;

    if (!['now', 'by_time'].includes(result.delivery_type)) {
        throw new ApiError(
            400,
            'delivery_type может быть только "now" или "by_time"'
        );
    }
    if (result.delivery_type === 'by_time') {
        result.delivery_time = toText(data.delivery_time);

        if (!result.delivery_time) {
            throw new ApiError(
                400,
                'Для доставки ко времени нужно указать delivery_time'
            );
        }
        checkTime(result.delivery_time, old ? old.delivery_time : null);
    }

    result.comment = toText(data.comment);
    return result;
}

// id món: phải tồn tại, đúng loại, và cả đơn phải khớp 1 combo
function checkDishes(data) {
    const result = {};
    const chosen = [];

    Object.keys(DISH_FIELDS).forEach((field) => {
        const value = toText(data[field]);
        result[field] = null;

        if (!value) {
            return;
        }

        const dish = dishes.find((item) => item.id === Number(value));

        if (!dish) {
            throw new ApiError(400, `Блюдо с id=${value} не найдено`);
        }
        if (dish.category !== DISH_FIELDS[field]) {
            throw new ApiError(
                400,
                `Блюдо «${dish.name}» нельзя указать в поле ${field}`
            );
        }

        result[field] = dish.id;
        chosen.push(field);
    });

    const isCombo = COMBOS.some((combo) => COMBO_FIELDS.every(
        (field) => combo.includes(field) === chosen.includes(field)
    ));

    if (!isCombo) {
        throw new ApiError(
            400,
            'Состав заказа не соответствует ни одному из комбо'
        );
    }
    return result;
}

// ===== Lưu trữ (Netlify Blobs) =====
// Store "orders": key = api_key, value = mảng đơn của key đó.
// Store "meta": id cuối cùng đã cấp (id tăng dần, không trùng giữa các key)

async function loadOrders(stores, apiKey) {
    const key = encodeURIComponent(apiKey);
    return await stores.orders.get(key, { type: 'json' }) || [];
}

async function saveOrders(stores, apiKey, orders) {
    await stores.orders.setJSON(encodeURIComponent(apiKey), orders);
}

async function getNextId(stores) {
    const lastId = await stores.meta.get('last-id', { type: 'json' }) || 0;
    await stores.meta.setJSON('last-id', lastId + 1);
    return lastId + 1;
}

// Mới nhất lên đầu; trùng giây thì id lớn hơn lên trước
function sortNewest(orders) {
    return [...orders].sort((a, b) => b.created_at.localeCompare(
        a.created_at
    ) || b.id - a.id);
}

// ===== Xử lý từng loại request =====

function handleDishes(method, id, origin) {
    if (method !== 'GET') {
        throw new ApiError(405, 'Метод не поддерживается');
    }
    if (!id) {
        return sendJson(dishes.map((dish) => withImageUrl(dish, origin)));
    }

    const dish = dishes.find((item) => item.id === Number(id));

    if (!dish) {
        throw new ApiError(404, 'Блюдо не найдено');
    }
    return sendJson(withImageUrl(dish, origin));
}

async function createOrder(request, stores, apiKey, orders) {
    if (orders.length >= MAX_ORDERS) {
        throw new ApiError(
            400,
            `Нельзя создать больше ${MAX_ORDERS} заказов`
        );
    }

    const data = await readBody(request);
    const customer = checkCustomer(data, null);
    const dishIds = checkDishes(data);
    const now = formatDateTime(new Date());
    const subscribe = ['1', 'true', 'on'].includes(
        toText(data.subscribe).toLowerCase()
    );

    const order = {
        id: await getNextId(stores),
        ...customer,
        subscribe: subscribe ? 1 : 0,
        ...dishIds,
        created_at: now,
        updated_at: now,
        student_id: getStudentId(apiKey)
    };

    await saveOrders(stores, apiKey, [...orders, order]);
    return sendJson(order);
}

// PUT: chỉ lấy các trường được sửa, ghép với đơn cũ rồi kiểm tra lại
async function updateOrder(request, stores, apiKey, orders, index) {
    const old = orders[index];
    const data = await readBody(request);
    const merged = { ...old };

    EDITABLE_FIELDS.forEach((field) => {
        if (data[field] !== undefined) {
            merged[field] = data[field];
        }
    });

    const order = {
        ...old,
        ...checkCustomer(merged, old),
        updated_at: formatDateTime(new Date())
    };
    const updated = [...orders];
    updated[index] = order;

    await saveOrders(stores, apiKey, updated);
    return sendJson(order);
}

async function handleOrders(request, id, url, stores) {
    const apiKey = toText(url.searchParams.get('api_key'));

    if (!apiKey) {
        throw new ApiError(401, AUTH_ERROR);
    }

    const orders = await loadOrders(stores, apiKey);

    if (!id) {
        if (request.method === 'GET') {
            return sendJson(sortNewest(orders));
        }
        if (request.method === 'POST') {
            return await createOrder(request, stores, apiKey, orders);
        }
        throw new ApiError(405, 'Метод не поддерживается');
    }

    const index = orders.findIndex((order) => order.id === Number(id));

    if (index === -1) {
        throw new ApiError(404, 'Заказ не найден');
    }
    if (request.method === 'GET') {
        return sendJson(orders[index]);
    }
    if (request.method === 'PUT') {
        return await updateOrder(request, stores, apiKey, orders, index);
    }
    if (request.method === 'DELETE') {
        await saveOrders(
            stores,
            apiKey,
            orders.filter((order) => order.id !== orders[index].id)
        );
        return sendJson(orders[index]);
    }
    throw new ApiError(405, 'Метод не поддерживается');
}

// Bộ định tuyến: /labs/api/<resource>/<id>
export async function handleRequest(request, stores) {
    if (request.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const url = new URL(request.url);
    const parts = url.pathname.replace(/^\/labs\/api\/?/, '')
        .split('/')
        .filter(Boolean);
    const [resource, id] = parts;

    try {
        if (parts.length > 2) {
            throw new ApiError(404, 'Не найдено');
        }
        if (!resource) {
            return sendJson(API_INFO);
        }
        if (resource === 'dishes') {
            return handleDishes(request.method, id, url.origin);
        }
        if (resource === 'orders') {
            return await handleOrders(request, id, url, stores);
        }
        throw new ApiError(404, 'Не найдено');
    } catch (error) {
        if (error instanceof ApiError) {
            return sendJson({ error: error.message }, error.status);
        }
        console.error(error);
        return sendJson({ error: 'Внутренняя ошибка сервера' }, 500);
    }
}

// Netlify gọi hàm này cho mọi request tới /labs/api/...
// consistency: 'strong' → vừa lưu xong đọc lại là thấy ngay
export default async function api(request) {
    return handleRequest(request, {
        orders: getStore({ name: 'orders', consistency: 'strong' }),
        meta: getStore({ name: 'meta', consistency: 'strong' })
    });
}

export const config = {
    path: ['/labs/api', '/labs/api/*']
};
