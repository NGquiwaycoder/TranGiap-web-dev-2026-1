// Ẩn/hiện thẻ món của 1 category theo kind (kind = null → hiện tất cả).
// Chỉ ẩn bằng class, KHÔNG xoá thẻ → món đã chọn vẫn giữ nguyên trong form
function applyFilter(category, kind) {
    const cards = document.querySelectorAll(
        `.dishes[data-category="${category}"] .dish`
    );

    cards.forEach((card) => {
        const isHidden = kind !== null && card.dataset.kind !== kind;
        card.classList.toggle('dish--hidden', isHidden);
    });
}

function handleFilterClick(button) {
    const filters = button.closest('.filters');
    const wasActive = button.classList.contains('active');

    filters.querySelectorAll('.filters__button').forEach((item) => {
        item.classList.remove('active');
    });

    // Bấm lại nút đang active → bỏ lọc, hiện lại tất cả món
    if (wasActive) {
        applyFilter(filters.dataset.category, null);
        return;
    }

    button.classList.add('active');
    applyFilter(filters.dataset.category, button.dataset.kind);
}

document.addEventListener('click', (event) => {
    const button = event.target.closest('.filters__button');

    if (button) {
        handleFilterClick(button);
    }
});
