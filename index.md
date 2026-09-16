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
Đọc là "`button` nằm BÊN TRONG 1 phần tử `.dish` đang được hover". Cách CSS thuần làm hiệu ứng "hover vào cha => con đổi style" mà không cần JavaScript: `:hover` theo dõi trạng thái chuột trên `.dish`, `button` chỉ là selector con viết tiếp phía sau trong cùng 1 rule.

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
