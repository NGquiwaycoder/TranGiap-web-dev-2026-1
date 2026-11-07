// Tạo 1 thẻ <li class="dish"> từ 1 object món ăn. buttonText: chữ trên nút
// ("Добавить" ở trang "Собрать ланч", "Удалить" ở trang "Оформить заказ")
function createDishCard(dish, buttonText) {
    const card = document.createElement('li');
    card.className = 'dish';
    card.dataset.dish = dish.keyword;
    card.dataset.kind = dish.kind;

    const image = document.createElement('img');
    image.src = dish.image;
    image.alt = dish.name;

    const price = document.createElement('p');
    price.className = 'dish__price';
    price.textContent = `${dish.price} ₽`;

    const title = document.createElement('p');
    title.className = 'dish__name';
    title.textContent = dish.name;

    const count = document.createElement('p');
    count.className = 'dish__weight';
    count.textContent = dish.count;

    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = buttonText;

    card.append(image, price, title, count, button);
    return card;
}

// Tìm món trong mảng dishes theo keyword (lấy từ data-dish của thẻ)
function findDish(keyword) {
    return dishes.find((dish) => dish.keyword === keyword);
}
