---
name: explainerVideo
description: Làm video giải thích khoa học ngắn tiếng Việt (3–4 phút, ~50 cảnh, 16:9) theo mẫu "AI Explainer" trên canvas Toonflow — kịch bản 7 nhịp có nhân vật nhân hoá, style low-poly 3D đồng nhất, character sheet, ảnh cảnh, giọng đọc từng câu, prompt chuyển động, clip ảnh→video và dựng thành phẩm có phụ đề. Dùng khi người dùng muốn làm video kiểu explainer/giải thích/"tại sao...?" theo mẫu này; không dùng khi chỉ bàn hoặc sửa chính skill.
metadata:
  version: "1.0.0"
  displayName: Video giải thích khoa học (mẫu Explainer)
  author: SuperFlow
---

# Video giải thích khoa học theo mẫu Explainer

Biến một **chủ đề** thành video giải thích ngắn: tiêu đề là câu hỏi nghịch lý, mỗi câu thoại là một cảnh 4–5 giây, nhân vật nhân hoá có tính cách, cùng một style ảnh cho toàn bộ video. Mọi thành quả nằm trên canvas của dự án hiện tại; tóm tắt trong chat không thay cho node trên canvas.

Thao tác canvas (đọc node, `addNode`, `nodeTools`, nối dây, `node:getConfig/setConfig/setPrompt/generateImage/generateVideo`) theo đúng hợp đồng trong skill `canvas` và tài liệu "canvasExecution" của skill `workflow` (định vị qua `available_skills`/`skillOperator`). Skill này chỉ quy định **nội dung và thứ tự** của mẫu Explainer.

## Nguyên tắc cố định

- **Làm từng bước, mỗi bước một cửa duyệt.** Xong bước → lưu lên canvas → đọc lại kiểm tra → trình bày → chờ người dùng xác nhận rõ ràng. Im lặng, bỏ qua hay câu "làm video đi" không phải xác nhận cho các bước sau.
- **Đồng nhất trên hết.** STYLE BLOCK và mô tả nhân vật (desc) được chốt ở bước 2 và **không sửa giữa chừng** một video; muốn đổi thì làm lại các ảnh bị ảnh hưởng.
- **1 câu thoại = 1 cảnh = 1 ảnh = 1 clip**, cùng một `id` ba chữ số (`001`, `002`, …) xuyên suốt kịch bản, bảng cảnh, ảnh, audio, prompt chuyển động và clip.
- **Không tự tiêu tốn hạn mức.** Trước mỗi đợt generate ảnh/audio/video: nêu số node, model, tham số, ước tính chi phí (nếu không tra được thì nói "chưa rõ") và chờ đồng ý. Chạy theo lô 10–15 cảnh.
- **Không bịa số liệu.** Mọi số liệu, mốc năm, tên chiến dịch, cơ chế khoa học phải có nguồn; không có nguồn thì bỏ hoặc nói chung chung.
- Không để model ảnh/video tự vẽ chữ, phụ đề, watermark; phụ đề được ghép ở bước dựng.

## Bố cục canvas

Một canvas cho một video, đặt tên theo chủ đề. Xếp từ trái sang phải theo bước, các cảnh xếp dọc theo `id`:

| Cột | Nội dung |
|---|---|
| 1 | Text "Kịch bản" (tiêu đề + câu thoại đánh số), text "Bảng cảnh", text "Nguồn" |
| 2 | Text "Style block", mỗi nhân vật: text desc + các image sheet đã duyệt |
| 3 | Mỗi cảnh: image generation "Cảnh 001" (nối ảnh sheet của nhân vật xuất hiện) |
| 4 | Mỗi cảnh: audio "Thoại 001" |
| 5 | Mỗi cảnh: video generation "Clip 001" (nối ảnh cảnh đã duyệt) |

Song song, lưu file trong workspace để tái dùng và dựng: `explainer/<slug>/script.md`, `scenes.csv`, `sources.md`, `style.md`, `characters/<tên>.txt`, `pronunciation.csv`, `timing.csv`, `motionPrompts.csv`, `subtitles.srt`. Đường dẫn chỉ ghi khi đã thật sự ghi/đọc được.

## Các bước và cửa duyệt

| Bước | Việc | Tài liệu đọc trước | Cửa duyệt |
|---|---|---|---|
| 0 | Chốt chủ đề, giọng đọc (nam/nữ), độ dài mục tiêu, model ảnh/video/audio sẽ dùng | — | Người dùng xác nhận thông số |
| 1 | Kịch bản 7 nhịp + bảng cảnh + nhân vật mới + nguồn | [Kịch bản](references/scriptGuide.md) | Duyệt kịch bản, đi hết checklist |
| 2 | Style block + desc nhân vật → character sheet | [Hình ảnh](references/visualAssets.md) | Duyệt từng nhân vật (ảnh front trước, rồi các góc/biểu cảm) |
| 3 | Ảnh cảnh theo lô | [Hình ảnh](references/visualAssets.md#3-ảnh-cảnh) | Duyệt từng lô; cảnh lệch thì tạo lại riêng cảnh đó |
| 4 | Giọng đọc từng câu + bảng timing | [Audio & chuyển động](references/audioMotion.md) | Nghe lại; sửa phát âm |
| 5 | Prompt chuyển động từng cảnh | [Audio & chuyển động](references/audioMotion.md#2-prompt-chuyển-động) | Duyệt bảng prompt |
| 6 | Clip ảnh→video theo lô | [Audio & chuyển động](references/audioMotion.md#3-tạo-clip) | Duyệt từng clip; clip lỗi đơn giản hoá motion rồi tạo lại |
| 7 | Dựng: ghép clip theo timing + voiceover + phụ đề | [Dựng thành phẩm](references/assembly.md) | Người dùng xem bản dựng |

Phải xong bước 4 trước bước 5: thời lượng clip lấy từ độ dài thật của câu thoại.

## Tiếp tục dự án đang làm

Đọc canvas và file trong `explainer/<slug>/` để xác định bước đầu tiên chưa được duyệt, rồi làm tiếp từ đó. Yêu cầu sửa một cảnh chỉ đụng tới cảnh đó và các khâu sau của chính nó (ảnh → clip → bản dựng), không chạy lại cả chuỗi. Sửa câu thoại thì phải làm lại audio của câu đó, kiểm lại thời lượng clip, rồi dựng lại.

## Báo cáo cuối mỗi bước

Nêu: đã làm gì, node/file thật nằm ở đâu, cảnh nào đạt/chưa đạt, ai đã kiểm (Agent hay người dùng), và một bước tiếp theo cần người dùng quyết định.
