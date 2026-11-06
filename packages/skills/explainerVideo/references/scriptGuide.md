# Kịch bản (bước 1)

Vai trò: biên kịch video giải thích khoa học dạng ngắn, tiếng Việt, giọng hài hước, nhân hoá.

## Thông số (đo từ video mẫu 3:45, ~50 cảnh)

- 1 cảnh ≈ 1 câu thoại ≈ 20–25 âm tiết ≈ 4–5 giây.
- Video 3–4 phút ≈ 45–55 cảnh ≈ 1.000–1.200 âm tiết. Video ngắn hơn thì giảm số cảnh theo tỷ lệ, giữ đủ 7 nhịp.
- Tốc độ đọc ≈ 5 âm tiết/giây (nhanh, kiểu TikTok).

## Cấu trúc 7 nhịp

| Nhịp | % thời lượng | Nội dung | Ví dụ từ video mẫu |
|---|---|---|---|
| 1. Câu hỏi tiêu đề | cố định trên màn hình | Nghịch lý, đối lập 2 vế | Gấu ăn cá hồi sống bị giun, sao người ăn sashimi lại không sao? |
| 2. Mở quen thuộc | 5% | Trải nghiệm ai cũng biết | Sashimi béo ngậy, tan trong miệng |
| 3. Bối cảnh | 15% | Hành trình / nguồn gốc | Cá hồi sinh ở sông, ra biển lớn |
| 4. Mối đe doạ | 20% | Nhân hoá phản diện | Giun Anisakis, ruột gấu thành "khách sạn 5 sao" |
| 5. Lời giải khoa học | 25% | Cơ chế + số liệu | Nuôi công nghiệp, cấp đông sâu phá huỷ ký sinh trùng |
| 6. Cú twist lịch sử/kinh doanh | 20% | Sự thật ít người biết | Người Nhật trước thập niên 80 không ăn cá hồi sống; chiến dịch của Na Uy |
| 7. Chốt hài | 15% | Đập lại ngộ nhận phổ biến | Wasabi không giết được ký sinh trùng |

## Quy tắc viết

- Mỗi câu = 1 hình ảnh vẽ được. Câu nào không hình dung được cảnh thì viết lại.
- Nhân hoá mọi thứ: cá, giun, tế bào, công ty… đều là nhân vật có tính cách.
- Mỗi 4–6 câu có 1 câu ví von hài (khách sạn 5 sao, tắm suối nước nóng…).
- Nhịp 5 và 6 có ít nhất 1 số liệu hoặc mốc thời gian cụ thể.
- Tối đa 3–4 nhân vật lặp lại; cảnh còn lại là bối cảnh/vật thể.
- Không câu nào dài quá 30 âm tiết (phụ đề sẽ quá 3 dòng).
- Viết cho giọng đọc: số/năm dễ đọc sai thì viết bằng chữ ("thập niên tám mươi"), viết tắt viết đầy đủ ("ki-lô-mét"). Từ nước ngoài **không** sửa trong kịch bản mà ghi vào `pronunciation.csv` (`from,to`).

## Kiểm chứng (bắt buộc)

- Đánh dấu `[CẦN NGUỒN]` sau mọi số liệu, mốc năm, tên chiến dịch, cơ chế khoa học.
- Mỗi điểm đánh dấu cần 1 nguồn (báo, cơ quan y tế, paper). Có công cụ tìm kiếm/đọc web thì tự tra; không có nguồn thì bỏ hoặc nói chung chung — không bịa.
- Ghi nguồn vào `sources.md` và text node "Nguồn" (`id câu — nhận định — link/trích dẫn`). Khi đã có nguồn thì xoá dấu `[CẦN NGUỒN]` khỏi câu.

## Đầu ra

1. **Kịch bản** (`script.md` + text node "Kịch bản"): tiêu đề `# <câu hỏi>`, mỗi nhịp có dòng `## Nhịp N — <tên>`, mỗi câu thoại một dòng `001. nội dung`.

   ```markdown
   # Gấu ăn cá hồi sống thì bị giun sán tơi tả, tại sao bạn ăn sashimi cá hồi lại bình an vô sự?

   ## Nhịp 2 — Mở quen thuộc
   001. Ai từng ăn sashimi cá hồi đều biết: thịt béo ngậy, tan ngay trong miệng.
   ## Nhịp 3 — Bối cảnh
   002. Cá hồi sinh ra ở sông nước ngọt, rồi bơi ra biển lớn để vỗ béo.
   003. Ngoài biển, tôm nhỏ chứa đầy ấu trùng giun Anisakis.
   ```

2. **Bảng cảnh** (`scenes.csv` + text node "Bảng cảnh"): cột `id,characters,scene,camera,motion`.
   - 1 dòng / câu thoại, `id` khớp số câu.
   - `scene`, `camera`, `motion` viết **tiếng Anh**. `camera` là `close-up` / `medium shot` / `wide shot` (có thể kèm biến thể như `medium close-up`).
   - `characters` chỉ dùng tên nhân vật đã/ sẽ có desc, phân cách `;`, để trống nếu không có nhân vật.
   - `motion`: tối đa 1 hành động nhân vật + (tuỳ chọn) 1 chuyển động máy, phân cách `;`. Xem quy tắc ở [Audio & chuyển động](audioMotion.md#viết-cột-motion).

   ```csv
   id,characters,scene,camera,motion
   001,,a boy happily eating salmon sashimi with chopsticks in a cozy sushi bar,medium close-up,slow push-in; boy chews and smiles
   002,salmon,salmon character swimming out of a river into the open blue ocean,wide shot,camera follows salmon swimming forward
   003,salmon;anisakis,salmon in the ocean with tiny anisakis worms hiding in small shrimp around it,medium shot,bubbles rise; salmon looks around nervously
   ```

3. **Nhân vật mới**: tên (lowercase, không dấu, không khoảng trắng) + mô tả 1 dòng tiếng Anh hợp style. Tổng nhân vật lặp lại ≤ 4.

## Checklist trước khi sang bước 2

- [ ] Tiêu đề là câu hỏi đối lập, đọc 1 lần hiểu ngay
- [ ] Số câu đúng mục tiêu (45–55 cho 3–4 phút), không câu nào > 30 âm tiết
- [ ] Đủ 7 nhịp, có twist ở nhịp 6
- [ ] Mọi số liệu có nguồn trong "Nguồn", không còn `[CẦN NGUỒN]`
- [ ] Nhân vật lặp lại ≤ 4, mỗi nhân vật có mô tả
- [ ] Bảng cảnh đủ cột, tập `id` trùng khớp tuyệt đối với kịch bản
