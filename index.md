git config --global user.name "Tên của bạn"
git config --global user.email "email@example.com"
git config --list  # Kiểm tra cấu hình
git init                          # Tạo kho git mới
git clone <url>                   # Sao chép kho từ server
git clone <url> <tên-folder>      # Clone vào folder cụ thể
git status                   # Xem trạng thái thư mục hiện tại
git log                      # Xem lịch sử commit
git log --oneline            # Log dạng ngắn gọn
git log -n 5                 # Xem 5 commit gần nhất
git diff                     # Xem thay đổi chưa stage
git diff --staged            # Xem thay đổi đã stage
git add <file>               # Thêm file cụ thể
git add .                    # Thêm tất cả thay đổi
git commit -m "Tin nhắn"     # Commit với lời nhắn
git commit -am "Tin nhắn"    # Add + Commit (chỉ file tracked)
git commit --amend           # Sửa commit gần nhất
git branch                   # Liệt kê branch local
git branch -a                # Liệt kê tất cả branch
git branch <tên-branch>      # Tạo branch mới
git checkout <tên-branch>    # Chuyển sang branch
git checkout -b <branch>     # Tạo + chuyển branch (cùng lúc)
git switch <branch>          # Cách mới để chuyển branch
git branch -d <branch>       # Xóa branch
git merge <branch>           # Gộp branch vào hiện tại
git push                     # Push commit lên server
git push origin <branch>     # Push branch cụ thể
git pull                     # Cập nhật + merge từ server
git fetch                    # Chỉ cập nhật (không merge)
git restore <file>           # Hoàn tác thay đổi file (unstaged)
git restore --staged <file>  # Bỏ stage file
git reset HEAD~1             # Hoàn tác commit gần nhất (giữ thay đổi)
git reset --hard HEAD~1      # Hoàn tác hoàn toàn commit gần nhất
git revert <commit-id>       # Tạo commit mới để hoàn tác
git stash                    # Lưu thay đổi tạm thời
git stash list               # Liệt kê stash
git stash pop                # Lấy stash gần nhất
git stash drop               # Xóa stash
git tag <tên-tag>            # Tạo tag
git tag -a <tên> -m "Tin nhắn"  # Tag có annotation
git push origin <tag>        # Push tag lên server



--------------------------------------------------------------------------
.htmlhintrc — cấu hình cho HTMLHint

HTMLHint là công cụ static analyzer: nó không chạy code, chỉ đọc file .html và so khớp với các "rule" để tìm lỗi cú pháp/quy ước viết HTML. Khi bạn cài extension HTMLHint trong VS Code, extension tự động tìm file .htmlhintrc ở gốc project để biết bật/tắt rule nào — không có file này thì nó dùng bộ mặc định, có file này thì dùng đúng bộ bạn khai báo.


eslint.config.mjs — cấu hình cho ESLint

ESLint là static analyzer tương tự nhưng cho JavaScript. File này dùng flat config — định dạng cấu hình mới của ESLint (thay cho .eslintrc.json cũ), viết bằng JS thật (.mjs = ES Module) và export default ra một mảng object cấu hình. Đây là lý do cần cài Node.js: ESLint (chạy trên Node) sẽ import trực tiếp file này để đọc cấu hình, chứ không parse JSON như HTMLHint.


==========================================================================
LAB 1 — Trang chủ (lab1/index1.html + lab1/style1.css)
==========================================================================

### Thẻ HTML dùng lần đầu

- `<header>` / `<main>` / `<footer>` / `<section>`: thẻ "semantic" — về hiển thị chẳng khác `<div>`, nhưng có Ý NGHĨA rõ cho trình duyệt/screen reader/SEO: header = đầu trang, main = nội dung chính (chỉ nên có 1 cái/trang), footer = chân trang, section = 1 khối nội dung độc lập có chủ đề riêng.
- `<nav>`: khối chứa menu điều hướng — cũng chỉ mang ý nghĩa ngữ nghĩa, tự nó không có style riêng.
- `<h1>` / `<h2>`: tiêu đề, có thứ tự cấp bậc (chỉ 1 `<h1>`/trang, `<h2>` là con của nó).
- `<ul>` / `<li>`: danh sách không thứ tự — dùng cho menu nav và danh sách ưu điểm.
- `<a href="...">`: liên kết. `href="#id"` là **anchor link** — nhảy tới phần tử có `id` trùng tên trong CÙNG trang, không load lại trang.
- `<img src="..." alt="...">`: `alt` là text thay thế khi ảnh lỗi / cho screen reader, không phải chú thích trang trí.
- `<table>/<thead>/<tbody>/<tr>/<th>/<td>`: bảng dữ liệu — `th` là ô tiêu đề (đậm, giữa), `td` là ô dữ liệu thường.
- `id="contacts"`: định danh DUY NHẤT trong cả trang (khác `class` dùng lặp lại nhiều lần) — dùng làm đích cho anchor link.

### CSS dùng lần đầu

- `* { box-sizing: border-box; }`: universal selector áp dụng cho MỌI phần tử. `border-box` nghĩa là `width` khai báo đã TÍNH LUÔN cả padding + border vào bên trong (mặc định `content-box` thì padding/border cộng thêm ra ngoài width, dễ vỡ layout khi có padding).
- `display: flex` + `gap`: biến `nav ul` thành hàng ngang, `gap` là khoảng cách đều giữa các item (thay margin thủ công).
- `:hover`: pseudo-class — style chỉ áp dụng khi chuột đang trỏ vào phần tử.
- Class selector (`.about`, `.advantages`) vs selector theo thẻ (`header`, `nav`): dùng class khi chỉ muốn style riêng 1 nhóm cụ thể, không ảnh hưởng các thẻ cùng loại khác trên trang.
- `border-collapse: collapse`: gộp viền giữa 2 ô bảng liền kề thành 1 đường (mặc định mỗi ô có viền riêng, nhìn bị đôi/dày).

==========================================================================
LAB 2 — Trang "Собрать ланч" (lab2/index2.html + style-base2.css + style-menu2.css)
==========================================================================

Lab này thêm nhiều khái niệm mới nhất từ trước tới giờ — phần quan trọng nhất để bảo vệ bài:

### 1. CSS Grid — bố cục dạng lưới
```css
.dishes {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}
```
- `display: grid`: biến phần tử thành container lưới, các con trực tiếp bên trong tự xếp vào ô lưới.
- `grid-template-columns: repeat(3, 1fr)`: khai báo lưới 3 cột, mỗi cột rộng `1fr` (1 phần bằng nhau của khoảng trống còn lại). `repeat(3, 1fr)` chỉ là viết gọn của `1fr 1fr 1fr`.
- Khác Flexbox ở chỗ: Flex sắp xếp theo 1 trục (hàng HOẶC cột), Grid sắp xếp theo CẢ HÀNG LẪN CỘT cùng lúc — hợp để làm lưới sản phẩm như bài này.
- `gap`: khoảng cách giữa các ô lưới (dùng chung được cho cả Grid và Flex).

### 2. Flexbox nâng cao (trên từng khối `.dish`)
- `display: flex; flex-direction: column;`: xếp các con (ảnh, giá, tên, khối lượng, nút) theo chiều DỌC thay vì ngang mặc định.
- `flex-grow: 1` (đặt trên `.dish__name`): phần tử này "nở ra" chiếm hết khoảng trống dư trong container flex. Đây là mẹo giải yêu cầu khó nhất của đề: vì `.dish` nằm trong Grid, mọi ô CÙNG HÀNG bị Grid kéo cao bằng nhau (mặc định `align-items: stretch`); khi 1 tên món dài xuống 2 dòng làm cả hàng cao hơn, phần tên món có `flex-grow:1` ở MỌI ô sẽ giãn ra lấp đúng phần chênh lệch đó, đẩy khối-lượng + nút xuống cùng một mức ở tất cả các ô trong hàng.
- `flex-wrap: wrap` (trên `nav ul`): cho phép item tự xuống dòng khi không đủ chỗ ngang, thay vì bị ép co lại hoặc tràn ra ngoài.
- `justify-content: space-between`: canh item theo trục CHÍNH sao cho khoảng cách giữa các item bằng nhau, item đầu/cuối dính sát 2 mép container.
- `align-items: center`: canh item theo trục PHỤ (khi nav xếp dọc ở mobile, đây là canh giữa theo chiều ngang).

### 3. `filter: drop-shadow(...)`
Tạo bóng đổ bám theo ĐÚNG HÌNH DẠNG nội dung bên trong (kể cả bo góc/ảnh trong suốt), khác `box-shadow` luôn cho ra bóng hình chữ nhật.

### 4. Contextual selector (selector ngữ cảnh)
```css
.dish:hover button { background-color: tomato; }
```
Đọc là "`button` nằm BÊN TRONG 1 phần tử `.dish` đang được hover". Cách CSS thuần làm hiệu ứng "hover vào cha → con đổi style" mà không cần JavaScript: `:hover` theo dõi trạng thái chuột trên `.dish`, `button` chỉ là selector con viết tiếp phía sau trong cùng 1 rule.

### 5. Responsive — `@media`
```css
@media (max-width: 800px) { ... }
```
Media query: chỉ áp dụng khối CSS bên trong khi điều kiện đúng (ở đây: chiều rộng màn hình ≤ 800px). Nhiều khối `@media` với ngưỡng giảm dần (800 → 600) cho phép style chồng lên nhau, màn càng nhỏ càng bị ghi đè thêm. Bắt buộc phải có `<meta name="viewport" content="width=device-width, initial-scale=1.0">` trong `<head>` thì `@media` mới hoạt động đúng trên điện thoại thật.

### 6. Sticky footer (footer luôn dính đáy trang)
```css
body { display: flex; flex-direction: column; min-height: 100vh; }
main { flex: 1; }
```
`100vh` = 100% chiều cao viewport (khung nhìn trình duyệt, không phải chiều cao nội dung). Khi `body` là flex-column cao tối thiểu bằng màn hình và `main` có `flex:1` (nở ra chiếm hết khoảng trống dư), `footer` luôn bị đẩy xuống đúng đáy màn hình dù nội dung trang ngắn tới đâu.

### 7. Đặt tên class kiểu BEM rút gọn
`dish__price`, `dish__name`, `dish__weight`: dấu `__` là quy ước BEM (Block Element Modifier) — `dish` là khối cha, phần sau `__` là phần tử con thuộc khối đó. Giúp CSS dễ đọc, tránh trùng tên class linh tinh giữa các khối khác nhau.

### 8. Link chéo giữa 2 trang + class "active"
- `../lab1/index1.html`: `..` nghĩa là lùi ra 1 cấp thư mục — từ `lab2/` lùi ra gốc repo rồi vào `lab1/`.
- Class `active` là tự đặt tên, tự viết CSS (`nav a.active { color: tomato; }`), không phải thuộc tính có sẵn của trình duyệt — gắn thủ công vào đúng link đang trỏ tới chính trang hiện tại, để người dùng biết mình đang ở đâu trong menu.

### 9. File `_redirects` (riêng của Netlify, không phải chuẩn HTML/CSS)
Dòng `/   /index1.html   200` nghĩa là: ai vào domain gốc `/` thì Netlify âm thầm trả về nội dung `index1.html` nhưng vẫn giữ URL là `/` (gọi là **rewrite**, khác **redirect thật** dùng mã 301/302 sẽ đổi hẳn URL trên thanh địa chỉ). Cần file này vì bình thường mọi static hosting tự tìm đúng tên `index.html` cho `/` — sau khi đổi tên file thành `index1.html`, phải tự khai báo lại quy tắc đó, nếu không domain gốc sẽ ra lỗi 404.

### 10. `ul`/`li` thay cho `div` (sửa theo góp ý của thầy)
Danh sách món ăn bản chất là 1 danh sách → dùng `<ul class="dishes">` + `<li class="dish">` đúng ngữ nghĩa hơn `<div>`. Trình duyệt tự gắn cho `ul` dấu chấm (`list-style: disc`) + `padding-left` + `margin` (gọi là **User Agent Stylesheet** — style mặc định có sẵn của trình duyệt), nên phải "reset" bằng `list-style: none; margin: 0; padding: 0;`.

### 11. `<meta name="viewport">` (bổ sung ở lab3 cho cả lab1, lab2)
`<meta name="viewport" content="width=device-width, initial-scale=1.0">`: báo điện thoại "chiều rộng trang = chiều rộng màn hình thật, không phóng to/thu nhỏ". Thiếu dòng này, điện thoại giả lập màn ~980px rồi thu nhỏ cả trang → `@media (max-width: 600px)` không bao giờ kích hoạt. Đề lab2 có yêu cầu dòng này.

==========================================================================
LAB 3 — Form đặt hàng (lab3/index3.html + style-base3.css + style-menu3.css + style-form3.css)
==========================================================================

### 1. `<form action="..." method="POST">`
- `action`: địa chỉ server nhận dữ liệu khi bấm "Отправить" (ở đây `https://httpbin.org/post` — trang test, trả lại đúng những gì mình gửi để kiểm tra).
- `method="POST"`: gửi dữ liệu trong **thân (body)** của request HTTP, không hiện lên thanh địa chỉ. Khác `GET` — dữ liệu bị gắn thẳng vào URL dạng `?name=...&email=...` (lộ ra, giới hạn độ dài).
- Dữ liệu gửi đi có dạng cặp **`name` = `value`**: thuộc tính `name` của mỗi ô nhập là "tên trường" server nhận được. Ô nào không có `name` thì KHÔNG được gửi.

### 2. `<label for="id">` — gắn nhãn với ô nhập
`for` của label trùng với `id` của input/select/textarea → trình duyệt hiểu 2 cái là 1 cặp: bấm vào chữ nhãn cũng focus/tick vào ô, screen reader đọc đúng tên ô. Đề bắt buộc mọi label phải gắn kiểu này.

### 3. Các loại ô nhập (`<input type="...">`)
| type | Dùng cho | Trình duyệt tự làm gì |
|---|---|---|
| `text` | tên, địa chỉ | ô chữ thường |
| `email` | email | tự kiểm tra có dạng `a@b.c` mới cho gửi |
| `tel` | số điện thoại | trên điện thoại hiện bàn phím số |
| `checkbox` | đăng ký nhận tin | ô tick; `checked` = tick sẵn mặc định. Chỉ khi tick mới gửi `subscribe=yes` |
| `radio` | chọn thời gian giao | chỉ chọn được 1 trong nhóm — các radio **cùng `name`** tạo thành 1 nhóm |
| `time` | giờ giao | ô chọn giờ; `min="07:00" max="23:00"` giới hạn khoảng, `step="300"` = bước 300 giây = 5 phút |

### 4. `<select>` + `<option>`
- `select` là ô xổ xuống; mỗi `option` là 1 lựa chọn. Chữ hiển thị (`Фо Бо`) khác giá trị gửi đi (`value="pho-bo"`) — server nhận `soup=pho-bo`, dễ xử lý hơn chữ tiếng Nga.
- Option đầu `value=""` ("-- Выберите суп --") là "placeholder": kết hợp với `required`, nếu người dùng chưa chọn món thật thì value rỗng → form không cho gửi.

### 5. `required` — bắt buộc nhập
Thuộc tính boolean (chỉ cần có mặt, không cần giá trị). Ô trống thì trình duyệt tự chặn gửi form và hiện thông báo — không cần JavaScript. Với radio, chỉ cần 1 radio trong nhóm có `required` là cả nhóm bắt buộc.

### 6. `<textarea>`, `<fieldset>` + `<legend>`
- `textarea`: ô nhập **nhiều dòng** (bình luận). Khác `input` ở chỗ có thẻ đóng `</textarea>`.
- `fieldset`: gom 1 nhóm ô liên quan (2 radio chọn thời gian); `legend`: tiêu đề của nhóm đó ("Время доставки:"). Mặc định `fieldset` có viền + padding → reset bằng `border: none; padding: 0`. Lưu ý: `margin` đặt trên `legend` bị trình duyệt bỏ qua, nên khoảng cách phải đặt trên chính `fieldset`.

### 7. `<button type="reset">` / `type="submit"` / `type="button"`
- `submit`: gửi form (nút mặc định nếu không ghi `type` và nằm trong form).
- `reset`: đưa mọi ô về giá trị ban đầu (checkbox về lại trạng thái tick sẵn).
- `button`: nút thường, không làm gì với form — dùng cho nút "Добавить" để khỏi vô tình gửi form.

### 8. Chia 2 cột bằng Grid, co lại 1 cột trên màn hẹp
`.order__form { display: grid; grid-template-columns: 1fr 1fr; }` chia form thành 2 cột bằng nhau; `@media (max-width: 800px)` đổi thành `1fr` (1 cột) và ô nhập `width: 100%` để không tràn màn hình điện thoại.

==========================================================================
LAB 4 — JavaScript: hiển thị món bằng DOM + chọn món + tính tiền
(lab4/index4.html + dishes4.js + display4.js + order4.js)
==========================================================================

### 1. Nhúng JS bằng `<script src="..." defer>`
- File JS riêng (đề cấm viết JS trực tiếp trong HTML — rule `inline-script-disabled` của HTMLHint).
- `defer`: trình duyệt tải file song song nhưng **chỉ chạy sau khi dựng xong toàn bộ HTML**, và chạy **đúng thứ tự khai báo** (dishes4 → display4 → order4). Nhờ vậy script tìm được các thẻ `ul.dishes`, form... (nếu chạy sớm hơn thì các thẻ đó chưa tồn tại → `null`).
- Biến `const dishes` khai báo ở cấp ngoài cùng của `dishes4.js` dùng được ở 2 file sau vì các script thường (không phải module) chia sẻ chung 1 phạm vi toàn cục.

### 2. Mảng object — `dishes4.js`
- **Object** `{ keyword: 'pho-bo', price: 450, ... }`: gom nhiều thông tin của 1 món vào 1 biến, truy cập bằng dấu chấm `dish.price`.
- **Mảng** `[ {...}, {...} ]`: danh sách nhiều object. `keyword` là mã Latin duy nhất cho mỗi món, dùng để tìm món và gửi lên server.
- `const`: biến không gán lại được (nhưng nội dung object/mảng bên trong vẫn sửa được). `let`: biến gán lại được (dùng cho `total` vì cộng dồn).

### 3. DOM — tạo thẻ bằng JavaScript (`display4.js`)
**DOM** (Document Object Model) = cây object mà trình duyệt dựng từ HTML; JS thao tác trên cây này để thêm/sửa/xoá thẻ trên trang.
- `document.createElement('li')`: tạo thẻ mới (chưa hiện trên trang).
- `.className = 'dish'`: gán class. `.textContent = '...'`: gán chữ bên trong (an toàn, không bị hiểu nhầm thành HTML).
- `.dataset.dish = 'pho-bo'` ↔ thuộc tính HTML `data-dish="pho-bo"`: **data-атрибут** — thuộc tính tự đặt tên (bắt đầu bằng `data-`) để gắn dữ liệu riêng vào thẻ. Ở đây lưu keyword để khi bấm nút biết đó là món nào.
- `.append(a, b, c)`: gắn các thẻ con vào thẻ cha; gắn vào 1 thẻ đã có trên trang thì thẻ mới mới hiện ra.
- `document.querySelector('.dishes[data-category="soup"]')`: tìm **1** thẻ đầu tiên khớp CSS selector. `querySelectorAll(...)`: tìm **tất cả**, trả về danh sách.
- Template string `` `images/${dish.image}.jpeg` ``: chuỗi dùng dấu backtick, chèn biến trực tiếp bằng `${...}` thay vì cộng chuỗi.

### 4. Sắp xếp `sort()` + `localeCompare()`
```js
const sortedDishes = [...dishes].sort((a, b) => a.name.localeCompare(b.name));
```
- `sort(hàmSoSánh)`: hàm nhận 2 phần tử `a`, `b`, trả số âm nếu `a` đứng trước, dương nếu `b` đứng trước.
- `localeCompare`: so sánh chuỗi theo đúng bảng chữ cái ngôn ngữ (đúng thứ tự tiếng Nga А→Я), khác so sánh `<`/`>` chỉ theo mã ký tự.
- `[...dishes]`: tạo bản sao mảng rồi mới sắp xếp — vì `sort()` sửa trực tiếp mảng gốc.
- `(a, b) => ...`: **arrow function** — cách viết hàm ngắn gọn.

### 5. `forEach`, `find`, `some`, `Object.keys`
- `mảng.forEach((phầnTử) => {...})`: chạy hàm cho **từng** phần tử.
- `mảng.find((dish) => dish.keyword === keyword)`: trả về phần tử **đầu tiên** thoả điều kiện (dùng data-атрибут để tìm món trong mảng — đúng yêu cầu đề).
- `mảng.some(...)`: `true` nếu **ít nhất 1** phần tử thoả điều kiện (dùng để biết đã chọn món nào chưa).
- `Object.keys(obj)`: lấy danh sách tên thuộc tính của object → `['soup', 'main', 'drink']`.
- `===`: so sánh chặt (cả giá trị lẫn kiểu dữ liệu), nên dùng thay cho `==`.

### 6. Sự kiện — `addEventListener` + event delegation
- `phầnTử.addEventListener('click', hàm)`: khi có sự kiện `click` thì chạy hàm.
- **Event delegation**: thay vì gắn sự kiện cho từng nút "Добавить" (9 nút, lại được tạo động), chỉ gắn **1 lần ở `document`**. Sự kiện click "nổi bọt" (bubbling) từ nút lên tới `document`, ở đó kiểm tra `event.target.closest('.dish button')` xem có phải bấm đúng nút món ăn không.
- `closest(selector)`: đi ngược lên các thẻ cha, trả về thẻ gần nhất khớp selector (hoặc `null`).
- Sự kiện `reset` của form: bấm "Сбросить" thì xoá luôn các món đã chọn.

### 7. Hiện/ẩn phần tử + đổi class bằng JS
- `.hidden = true/false` ↔ thuộc tính HTML `hidden`: ẩn/hiện thẻ ("Ничего не выбрано" và khối tóm tắt luân phiên nhau). Lưu ý: nếu CSS đặt `display` cho thẻ đó thì sẽ đè mất tác dụng của `hidden` — vì vậy `.order__summary` không có `display` trong CSS.
- `classList.toggle('dish--selected', điềuKiện)`: thêm class nếu điều kiện đúng, gỡ nếu sai → viền thẻ món đã chọn, bỏ viền các thẻ khác cùng loại. `--selected` là **modifier** trong quy ước BEM (trạng thái của khối).

### 8. `<input type="hidden">` — gửi keyword lên server
Ô ẩn không hiện trên trang nhưng **vẫn được gửi cùng form**. Khi chọn món, JS gán `input.value = dish.keyword` → server nhận `soup=tom-yam&main_dish=com-rang&drink=thai-tea` (keyword Latin, đúng yêu cầu đề), trong khi người dùng chỉ thấy tên + giá tiếng Nga.

### 9. ESLint
File JS phải qua ESLint với `eslint.config.mjs` của thầy (thụt lề 4 space, có `;` cuối lệnh, dấu cách quanh toán tử, dòng ≤ 80 ký tự, không dùng biến/hàm trước khi khai báo...). Kiểm tra bằng lệnh `npx eslint lab4/*.js` hoặc extension ESLint trong VS Code.
