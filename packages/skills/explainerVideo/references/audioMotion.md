# Audio & chuyển động (bước 4–6)

Thứ tự bắt buộc: kịch bản → **audio** → prompt chuyển động (dùng độ dài audio) → clip.

## 1. Giọng đọc

### Chuẩn bị câu đọc

Với mỗi dòng `NNN. nội dung` của kịch bản (bỏ tiêu đề và dòng `## Nhịp`):

1. Xoá mọi `[...]`, gộp khoảng trắng thừa, bỏ khoảng trắng trước dấu câu.
2. Áp từng cặp trong `pronunciation.csv` (`from,to`, không phân biệt hoa thường) — chỉ cho văn bản gửi đi đọc; kịch bản và phụ đề giữ nguyên chữ gốc.

Dấu phẩy = nghỉ ngắn. Muốn nhấn mạnh thì tách câu (sửa kịch bản, quay lại cửa duyệt bước 1).

### Tạo audio

Thông số mục tiêu theo mẫu: giọng nam miền Bắc (nữ nếu người dùng chọn), nhanh hơn bình thường khoảng 12% (~5 âm tiết/giây), nghỉ 0,25 giây giữa các câu.

- **Trong canvas:** mỗi câu một audio generation node "Thoại <id>". Gọi `node:getConfig` trước: chỉ dùng model đọc được **tiếng Việt** (tuỳ provider; tuỳ chọn ngôn ngữ của node có thể chỉ liệt kê zh/en nhưng model vẫn nhận văn bản tiếng Việt). Tạo thử 1–2 câu, để người dùng nghe xác nhận giọng, rồi mới chạy cả lô.
- **Không có model đọc tiếng Việt:** nói rõ, đề nghị người dùng tạo bên ngoài (ví dụ edge-tts `vi-VN-NamMinhNeural` / `vi-VN-HoaiMyNeural`, rate `+12%`), mỗi câu một file `explainer/<slug>/audio/<id>.mp3` trong workspace; sau đó tạo audio node "Thoại <id>" và gắn file bằng `node:setAudio` với đường dẫn có thật. Không tự gắn đường dẫn chưa tồn tại.

### Timing và phụ đề

Đo độ dài từng file audio đã duyệt bằng tool `ffprobe` (`format.duration`). Ghi:

- `timing.csv`: `id,text,duration` (giây, 2 chữ số thập phân).
- `subtitles.srt`: mỗi câu một mục; câu đầu bắt đầu ở 0, mỗi câu kế tiếp bắt đầu = kết thúc câu trước + 0,25 giây. Văn bản phụ đề là câu gốc trong kịch bản (đã bỏ `[...]`), ngắt tối đa 2 dòng.

Kiểm tra và báo người dùng: thời lượng trung bình mỗi câu (mục tiêu 4–5 giây) và danh sách câu > 6 giây → đề nghị tách/rút gọn. Câu đọc sai: bổ sung `pronunciation.csv` rồi tạo lại riêng câu đó.

## 2. Prompt chuyển động

Mỗi cảnh một prompt tiếng Anh theo công thức:

```text
<camera move>; <action>; <ambient motion>; keep low-poly 3D style and character design exactly as the input image, smooth natural motion
```

(Nếu đổi style ở bước 2, thay "low-poly 3D" bằng tên style đã chốt.)

**Camera move** — theo cột `camera`: chứa `close` → nhóm close; chứa `wide` → nhóm wide; còn lại → medium. Mỗi nhóm xoay vòng lần lượt, và nếu trùng kiểu máy với cảnh liền trước thì nhảy sang kiểu kế tiếp:

| Nhóm | Các kiểu máy (xoay vòng) |
|---|---|
| close | slow push-in, subtle handheld drift, slow pull-back |
| medium | gentle dolly-in, slow orbit left, slight tilt up, slow orbit right |
| wide | slow pan right, slow crane down, slow pan left, slow aerial drift forward |

Nếu cột `motion` có đoạn nói về máy quay (camera, push-in, pull-back, pan, tilt, zoom, dolly, orbit, crane, tracking) thì dùng đoạn đó thay cho kiểu máy tự chọn.

**Action** — các đoạn còn lại của cột `motion`; trống thì `character makes a small natural gesture`.

**Ambient motion** — theo từ khoá trong cột `scene` (lấy luật đầu tiên khớp; bỏ nếu action đã nói cùng ý, ví dụ bubbles):

| Từ khoá trong scene | Chuyển động nền |
|---|---|
| ocean, sea, underwater, aquarium, swimming, river (không phải river bank) | bubbles rising, light rays shimmering through water |
| kitchen, restaurant, bar, food, soup, cook | steam gently rising, warm light flicker |
| factory, warehouse, freezer, frozen, ice, cold | cold mist drifting, frost particles floating |
| night, lamp, lantern, neon, city | lights softly flickering, faint particles in the air |
| forest, field, grass, tree, outdoor | leaves swaying in light breeze |
| stomach, gut, intestine, cell, body, blood | soft organic pulsing of the surroundings |
| office, meeting, government, city hall | papers fluttering slightly, background people moving |
| (không khớp) | subtle environmental motion |

Bối cảnh mới hay lặp lại thì thêm luật tương tự và báo người dùng.

**Negative prompt** cố định: `morphing, face distortion, extra limbs, flicker, text, subtitles, watermark, style change, fast camera`. Nếu model không có ô negative, nối vào cuối prompt dạng `Avoid: ...`.

**Thời lượng clip**: câu thoại ≤ 5,2 giây → clip 5 giây; dài hơn → 10 giây (hoặc mức gần nhất ≥ độ dài câu mà model hỗ trợ).

Ghi `motionPrompts.csv`: `id,duration,speech,prompt,negative,override`. Prompt người dùng sửa tay đánh `override=1`; lần sinh lại sau phải giữ nguyên các dòng đó.

### Viết cột motion

- Tối đa 1 hành động nhân vật + (tuỳ chọn) 1 camera, phân cách `;`.
- Tốt: `salmon looks around nervously` / `bear raises the fish; slight tilt up`.
- Tránh: xoay người 180°, biến hình, nhiều nhân vật cùng làm việc khác nhau, chữ xuất hiện.
- Cảm xúc dùng động từ rõ: blinks, shrugs, gasps, nods, trembles, grins.

## 3. Tạo clip

Mỗi cảnh một video generation node "Clip <id>":

1. Nối **chỉ** ảnh cảnh đã duyệt làm ảnh đầu vào; không nối text kịch bản (text nối vào sẽ bị gộp vào prompt).
2. `node:getConfig` → chọn chế độ ảnh→video (single image / first frame), tỉ lệ 16:9, thời lượng theo bảng, **tắt sinh âm thanh** (giọng đọc đã có riêng).
3. `node:setPrompt` với prompt từ bảng (kèm negative nếu cần), đọc lại cấu hình và prompt trước khi chạy.
4. Chạy theo lô sau khi người dùng đồng ý chi phí.

Kiểm tra từng clip: mặt/nhân vật không méo, style không đổi, không chữ, chuyển động nhỏ đúng ý. Clip lỗi: đơn giản hoá motion (bỏ camera hoặc đổi sang hành động nhỏ hơn), đánh `override=1` và tạo lại riêng clip đó. Nếu Agent không xem được video, nhờ người dùng xem và báo clip nào đạt.
