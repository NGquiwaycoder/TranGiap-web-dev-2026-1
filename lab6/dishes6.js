// Danh sách tất cả món ăn. image = đường dẫn trong images/ (không đuôi)
// kind = giá trị để lọc, trùng với data-kind của nút lọc tương ứng
const dishes = [
    // ===== Супы: fish 2, meat 2, veg 2 =====
    {
        keyword: 'tom-yam',
        name: 'Том ям',
        price: 480,
        category: 'soup',
        count: '450 мл',
        image: 'soups/tom-yam',
        kind: 'fish'
    },
    {
        keyword: 'bun-hai-san',
        name: 'Бун хай шан',
        price: 480,
        category: 'soup',
        count: '800 мл',
        image: 'soups/bun-hai-san',
        kind: 'fish'
    },
    {
        keyword: 'pho-bo',
        name: 'Фо Бо',
        price: 420,
        category: 'soup',
        count: '800 мл',
        image: 'soups/pho-bo',
        kind: 'meat'
    },
    {
        keyword: 'pho-ga',
        name: 'Фо Га',
        price: 400,
        category: 'soup',
        count: '800 мл',
        image: 'soups/pho-ga',
        kind: 'meat'
    },
    {
        keyword: 'gazpacho',
        name: 'Гаспачо',
        price: 195,
        category: 'soup',
        count: '350 г',
        image: 'soups/gazpacho',
        kind: 'veg'
    },
    {
        keyword: 'mushroom-soup',
        name: 'Грибной суп-пюре',
        price: 185,
        category: 'soup',
        count: '330 г',
        image: 'soups/mushroom-soup',
        kind: 'veg'
    },

    // ===== Главные блюда: fish 2, meat 2, veg 2 =====
    {
        keyword: 'pad-thai',
        name: 'Пад тай с креветками',
        price: 470,
        category: 'main',
        count: '380 г',
        image: 'main/pad-thai',
        kind: 'fish'
    },
    {
        keyword: 'tom-chua-ngot',
        name: 'Том чуа нгот',
        price: 450,
        category: 'main',
        count: '400 г',
        image: 'main/tom-chua-ngot',
        kind: 'fish'
    },
    {
        keyword: 'bun-cha',
        name: 'Бун ча',
        price: 500,
        category: 'main',
        count: '450 г',
        image: 'main/bun-cha',
        kind: 'meat'
    },
    {
        keyword: 'bo-luc-lac',
        name: 'Бо луклак',
        price: 420,
        category: 'main',
        count: '400 г',
        image: 'main/bo-luc-lac',
        kind: 'meat'
    },
    {
        keyword: 'com-rang-veg',
        name: 'Ком ранг вегетарианский',
        price: 320,
        category: 'main',
        count: '380 г',
        image: 'main/com-rang-veg',
        kind: 'veg'
    },
    {
        keyword: 'mien-xao-veg',
        name: 'Мьен сао вегетарианский',
        price: 320,
        category: 'main',
        count: '380 г',
        image: 'main/mien-xao-veg',
        kind: 'veg'
    },

    // ===== Салаты и стартеры: fish 1, meat 1, veg 4 =====
    {
        keyword: 'tom-chien-xu',
        name: 'Том чиен су',
        price: 410,
        category: 'salad',
        count: '5 шт',
        image: 'salads/tom-chien-xu',
        kind: 'fish'
    },
    {
        keyword: 'nem-ga',
        name: 'Нем га',
        price: 300,
        category: 'salad',
        count: '3 шт',
        image: 'salads/nem-ga',
        kind: 'meat'
    },
    {
        keyword: 'french-fries',
        name: 'Картошка фри с соусом',
        price: 160,
        category: 'salad',
        count: '120 г',
        image: 'salads/french-fries',
        kind: 'veg'
    },
    {
        keyword: 'french-fries-cheese',
        name: 'Картошка фри с сыром',
        price: 190,
        category: 'salad',
        count: '120 г',
        image: 'salads/french-fries-cheese',
        kind: 'veg'
    },
    {
        keyword: 'caprese',
        name: 'Капрезе с моцареллой',
        price: 350,
        category: 'salad',
        count: '235 г',
        image: 'salads/caprese',
        kind: 'veg'
    },
    {
        keyword: 'korean-salad',
        name: 'Корейский салат с овощами и яйцом',
        price: 330,
        category: 'salad',
        count: '250 г',
        image: 'salads/korean-salad',
        kind: 'veg'
    },

    // ===== Напитки: cold 3, hot 3 =====
    {
        keyword: 'nau-da',
        name: 'Нау да',
        price: 200,
        category: 'drink',
        count: '200 мл',
        image: 'drinks/nau-da',
        kind: 'cold'
    },
    {
        keyword: 'bubble-tea',
        name: 'Классический бабл ти',
        price: 300,
        category: 'drink',
        count: '450 мл',
        image: 'drinks/bubble-tea',
        kind: 'cold'
    },
    {
        keyword: 'mango-shake',
        name: 'Манго шейк',
        price: 399,
        category: 'drink',
        count: '450 мл',
        image: 'drinks/mango-shake',
        kind: 'cold'
    },
    {
        keyword: 'ca-phe-phin',
        name: 'Кафе фин',
        price: 180,
        category: 'drink',
        count: '200 мл',
        image: 'drinks/ca-phe-phin',
        kind: 'hot'
    },
    {
        keyword: 'ginger-tea',
        name: 'Имбирный чай',
        price: 80,
        category: 'drink',
        count: '200 мл',
        image: 'drinks/ginger-tea',
        kind: 'hot'
    },
    {
        keyword: 'jasmine-tea',
        name: 'Жасминовый чай',
        price: 50,
        category: 'drink',
        count: '200 мл',
        image: 'drinks/jasmine-tea',
        kind: 'hot'
    },

    // ===== Десерты: small 3, medium 2, large 1 =====
    {
        keyword: 'cheesecake',
        name: 'Чизкейк',
        price: 240,
        category: 'dessert',
        count: '125 г',
        image: 'desserts/cheesecake',
        kind: 'small'
    },
    {
        keyword: 'chocolate-cheesecake',
        name: 'Шоколадный чизкейк',
        price: 260,
        category: 'dessert',
        count: '125 г',
        image: 'desserts/chocolate-cheesecake',
        kind: 'small'
    },
    {
        keyword: 'chocolate-cake',
        name: 'Шоколадный торт',
        price: 270,
        category: 'dessert',
        count: '140 г',
        image: 'desserts/chocolate-cake',
        kind: 'small'
    },
    {
        keyword: 'baklava',
        name: 'Пахлава',
        price: 220,
        category: 'dessert',
        count: '300 г',
        image: 'desserts/baklava',
        kind: 'medium'
    },
    {
        keyword: 'donuts-3',
        name: 'Пончики (3 штуки)',
        price: 410,
        category: 'dessert',
        count: '350 г',
        image: 'desserts/donuts-3',
        kind: 'medium'
    },
    {
        keyword: 'donuts-6',
        name: 'Пончики (6 штук)',
        price: 650,
        category: 'dessert',
        count: '700 г',
        image: 'desserts/donuts-6',
        kind: 'large'
    }
];
