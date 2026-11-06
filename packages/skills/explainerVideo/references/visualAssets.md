# Hình ảnh (bước 2–3)

## 1. Style block

Một đoạn tiếng Anh cố định, dán **y nguyên** vào đầu MỌI prompt ảnh. Lưu ở `style.md` và text node "Style block". Mặc định theo mẫu:

```text
low-poly 3D render, faceted geometric surfaces, soft cinematic lighting,
pastel-saturated palette, cute anthropomorphic characters with big expressive eyes,
shallow depth of field, clean composition, no text, no watermark, 16:9 landscape
```

Người dùng muốn style khác thì đề xuất một block mới cùng cấu trúc (chất liệu/kỹ thuật render, ánh sáng, bảng màu, kiểu nhân vật, bố cục, `no text, no watermark`, tỉ lệ khung) và chốt trước khi tạo bất kỳ ảnh nào.

## 2. Character sheet

Mỗi nhân vật lặp lại có `characters/<tên>.txt` (1 dòng tiếng Anh) và text node desc. Ví dụ từ mẫu:

```text
salmon character, silver-pink low-poly body, big round blue eyes, slightly chubby, small pectoral fins used like hands
brown bear character, chunky low-poly brown fur, small round ears, stern eyebrows, big paws
anisakis worm character, pale white segmented low-poly body, black sunglasses, smug grin
```

Mô tả phải có dấu hiệu nhận diện cố định (màu, hình khối, mắt, phụ kiện) để model giữ được qua các cảnh.

Quy trình mỗi nhân vật:

1. Image generation node "<tên> — front": prompt = style block + desc + `full body, front view, standing, plain white background`. Tỉ lệ 1:1 hoặc 3:4 nếu model hỗ trợ. **Duyệt front trước.**
2. Front đã duyệt làm ảnh tham chiếu (nối dây vào node), tạo tiếp: `side` (side view), `34` (three-quarter view), `happy`, `scared`, `angry` (biểu cảm, nửa người hoặc toàn thân). Prompt thêm: `same character as the reference image, keep exact colors, proportions, eyes and accessories, plain white background`.
3. Ảnh lệch thì tạo candidate mới, không ghi đè ảnh đã duyệt. Ảnh được chọn giữ trong image node (hoặc image asset node) đặt tên `<tên> — <góc>`.

Kiểm tra: cùng màu, cùng tỉ lệ đầu/thân, cùng mắt/phụ kiện, nền trắng, không chữ.

## 3. Ảnh cảnh

Mỗi dòng bảng cảnh → một image generation node "Cảnh <id>", tỉ lệ **16:9**.

Prompt:

```text
<style block>
Scene: <scene>
Shot: <camera>
Characters: <tên> — <desc>; ... (chỉ nhân vật trong cột characters)
Keep each character identical to its reference sheet. No text, no watermark.
```

Tham chiếu: nối ảnh sheet đã duyệt của từng nhân vật có trong cảnh — ưu tiên `front`, thêm 1 ảnh biểu cảm phù hợp nếu cảnh có cảm xúc rõ (sợ → `scared`). Không quá số ảnh tham chiếu model cho phép (kiểm bằng `node:getConfig`); vượt thì chỉ giữ `front` mỗi nhân vật. Khi model dùng `{{ref N}}`, đánh số theo thứ tự nối dây thật.

Chạy theo lô 10–15 cảnh. Sau mỗi lô, trình bày cả lô dạng lưới (liệt kê id + ảnh) để người dùng soát nhanh:

- Nhân vật đúng thiết kế, không lẫn nhân vật thừa/thiếu
- Đúng style, đúng khung 16:9, đúng kiểu cảnh (close/medium/wide)
- Không chữ, không watermark, không biến dạng

Cảnh lệch: chỉnh prompt cảnh đó (không đụng style block/desc) và tạo lại riêng cảnh đó. Ảnh đã duyệt là đầu vào duy nhất của clip ở bước 6.
