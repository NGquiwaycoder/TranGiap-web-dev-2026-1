// Tạo 1 thẻ <li class="dish"> từ 1 object món ăn
function createDishCard(dish) {
    const card = document.createElement('li');
    card.className = 'dish';
    card.dataset.dish = dish.keyword;

    const image = document.createElement('img');
    image.src = `images/${dish.image}.jpeg`;
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
    button.textContent = 'Добавить';

    card.append(image, price, title, count, button);
    return card;
}

// Sắp xếp theo tên (A→Я) rồi chèn từng thẻ vào đúng section theo category
function displayDishes() {
    const sortedDishes = [...dishes].sort(
        (a, b) => a.name.localeCompare(b.name)
    );

    sortedDishes.forEach((dish) => {
        const list = document.querySelector(
            `.dishes[data-category="${dish.category}"]`
        );
        list.append(createDishCard(dish));
    });
}

displayDishes();
