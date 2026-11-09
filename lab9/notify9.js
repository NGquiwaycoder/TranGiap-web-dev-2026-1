// Thông báo (popup) dùng chung cho mọi trang của lab9: thiếu món, lỗi
// server, đặt / sửa / xoá đơn thành công

function closeNotification() {
    const notification = document.querySelector('.notification');

    if (notification) {
        notification.remove();
    }
}

// Thông báo được tạo mới bằng JS mỗi lần cần hiện, bấm "Окей" thì xoá đi
function showNotification(text) {
    closeNotification();

    const notification = document.createElement('div');
    notification.className = 'notification';

    const message = document.createElement('p');
    message.className = 'notification__text';
    message.textContent = text;

    const button = document.createElement('button');
    button.className = 'notification__button';
    button.type = 'button';
    button.textContent = 'Окей 👌';
    button.addEventListener('click', closeNotification);

    notification.append(message, button);
    document.body.append(notification);
    button.focus();
}
