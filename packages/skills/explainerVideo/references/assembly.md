# Dựng thành phẩm (bước 7)

Chỉ làm khi tool `ffmpeg`/`ffprobe` có trong lượt này và người dùng đã duyệt đủ clip + audio. Thiếu tool thì giao danh sách file theo thứ tự (`Clip <id>`, `Thoại <id>`, `subtitles.srt`, `timing.csv`) và nói rõ còn việc dựng.

Mọi đường dẫn là đường dẫn tương đối trong workspace, lấy từ output thật của node (đọc `outputs` bằng `getCanvasNodes`). Ghi kết quả vào `explainer/<slug>/build/`; không ghi đè file đã có — trùng tên thì dùng hậu tố `-v2`, `-v3`.

## 1. Khung thời gian

Với mỗi cảnh: `slot = duration (timing.csv) + 0,25`, riêng cảnh cuối `slot = duration + 0,5`. Thời điểm phụ đề trong `subtitles.srt` phải khớp với cách cộng dồn này (nếu sai, sinh lại SRT trước khi dựng).

## 2. Ghép audio vào từng cảnh

Mỗi cảnh một lệnh: clip được cắt/kéo dài đúng `slot` (thiếu thì giữ khung cuối), giọng đọc đặt từ giây 0 và thêm khoảng lặng tới hết `slot`. Ví dụ cảnh 003 có `slot = 4.87`:

```json
{
  "steps": [
    { "method": "input", "args": ["<đường dẫn Clip 003>"] },
    { "method": "input", "args": ["<đường dẫn Thoại 003>"] },
    { "method": "complexFilter", "args": [[
      "[0:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,fps=30,format=yuv420p,tpad=stop_mode=clone:stop_duration=10[v]",
      "[1:a]aresample=48000,apad[a]"
    ]] },
    { "method": "outputOptions", "args": [["-map", "[v]", "-map", "[a]", "-t", "4.87", "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-c:a", "aac", "-b:a", "192k", "-ac", "2"]] },
    { "method": "output", "args": ["explainer/<slug>/build/003.mp4"] }
  ]
}
```

Chạy lần lượt, kiểm `ffprobe` từng file (có cả video lẫn audio, độ dài ≈ `slot`).

## 3. Nối các cảnh

Ghi `explainer/<slug>/build/list.txt` bằng tool ghi file của workspace, mỗi dòng `file '003.mp4'` theo đúng thứ tự `id`. Rồi:

```json
{
  "steps": [
    { "method": "input", "args": ["explainer/<slug>/build/list.txt"] },
    { "method": "inputOptions", "args": [["-f", "concat", "-safe", "0"]] },
    { "method": "outputOptions", "args": [["-c", "copy"]] },
    { "method": "output", "args": ["explainer/<slug>/build/joined.mp4"] }
  ]
}
```

## 4. Phụ đề và tiêu đề

Kiểm filter có sẵn bằng `operation: { "method": "availableFilters" }`.

- Có `subtitles`: đốt phụ đề vào hình — `-vf subtitles=explainer/<slug>/subtitles.srt:force_style='FontName=Arial,FontSize=22,Outline=2,MarginV=40'`, `-c:a copy` → `final.mp4`.
- Có thêm `drawtext` và người dùng muốn câu hỏi tiêu đề cố định trên màn hình (nhịp 1): ghi tiêu đề vào `explainer/<slug>/build/title.txt`, thêm vào cùng chuỗi `-vf` một `drawtext=textfile=...:fontfile=<font hỗ trợ tiếng Việt>:fontsize=44:fontcolor=white:borderw=3:x=(w-text_w)/2:y=40`. Hỏi người dùng file font nếu chưa biết; không đoán.
- Không có `subtitles`: giao `joined.mp4` + `subtitles.srt` (phụ đề rời) và nói rõ.

## 5. Kiểm tra và giao

`ffprobe` file cuối: độ dài ≈ tổng `slot`, 1920×1080, có audio. Báo người dùng đường dẫn thật của `final.mp4` (hoặc `joined.mp4` + `subtitles.srt`), tổng thời lượng, và nhờ xem lại vì Agent không nghe/xem được toàn bộ video. Không xoá các file trung gian trong `build/` khi chưa được người dùng cho phép.
