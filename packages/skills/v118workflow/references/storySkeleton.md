# Khung xương câu chuyện và đại cương theo tập

Giai đoạn này xác định tuyến truyện, cung nhân vật và phương án chia tập; bản cũ đặt chung chúng trong khung xương câu chuyện.

## Đầu vào

- Cấu hình dự án đã xác nhận: tổng số tập, thời lượng mỗi tập, phạm vi nguồn, tỉ lệ khung, phong cách và giới hạn chuyển thể.
- Chỉ mục nguyên văn và bảng sự kiện chương đã xác nhận, cùng khung xương và bản ghi xác nhận đã có trên canvas kịch bản.
- Các nhân vật trọng điểm, tình tiết cần giữ, hướng kết cục và lịch phát hành áp dụng mà người dùng yêu cầu rõ.

## Bắt buộc đọc trước khi thực hiện

- Phải đọc các chương về mật độ, lõi câu chuyện, nhân vật, chênh lệch thông tin và cú lật, mẫu thành phẩm và thẩm định trong [Phương pháp biên kịch](knowledge/scriptCraft.md); khi chọn dùng nhịp phim ngắn thương mại thì đọc thêm phần tham chiếu định lượng của nó.
- Phải đọc quy tắc chung và thể loại chính đã xác nhận trong [Thể loại tự sự](knowledge/narrativeGenres.md); khi thực sự có pha trộn thể loại thì đọc thêm thể loại phụ trợ. Tổ chức khung xương theo nhịp tương ứng, không áp tuyến đơn, số lượng cú lật hoặc nhịp nhanh cho mọi đề tài.

## Phương pháp thực hiện

1. Theo [Thao tác canvas](canvasOperations.md) đọc lại node thật; khung xương đã có thì hiểu trước rồi sửa cục bộ.
2. Dùng một câu xác định lõi câu chuyện: mục tiêu của nhân vật chính, trở ngại cốt lõi và mâu thuẫn hấp dẫn nhất của câu chuyện.
3. Viết cung nhân vật của nhân vật chính từ trạng thái ban đầu, qua biến cố then chốt, đến thay đổi cuối cùng; nhân vật cốt lõi viết thân phận, đặc điểm, hoàn cảnh, hành động, hướng kết cục.
4. Tổ chức cấu trúc ba hồi gồm thiết lập, phát triển, cao trào và khép lại, nói rõ chức năng mỗi hồi, nguồn bao phủ, số tập tương ứng và bước ngoặt cuối hồi.
5. Sắp xếp từng tập theo tổng số tập đã xác nhận; mỗi tập nêu rõ sự tiếp nối nhân quả, thay đổi xung đột/quan hệ/cảm xúc, thông tin mới và điểm kết thúc. Tập thường tạo kỳ vọng cho tập sau; tập cuối thực hiện kết cục đã xác nhận, chỉ khi người dùng yêu cầu kết mở hoặc phần tiếp theo mới giữ lại hồi hộp về sau.
6. Với mỗi chỗ giữ lại, nén, gộp hoặc xóa đều nói rõ căn cứ, tránh chỉ chia đều các chương vào số tập.
7. Đăng ký thông tin cài cắm và vị trí thực hiện cho các cú lật then chốt; việc hé lộ phải có căn cứ trước đó, không được sửa thiết lập nhân vật khi chưa được phép.
8. Khi dự án thực sự có yêu cầu điểm chặn trả phí hoặc phát hành thì thiết kế theo cấu hình đã xác nhận; không yêu cầu thì không áp đặt nhịp marketing.

## Ghi vào canvas kịch bản

Vị trí mặc định là `Canvas/Kịch bản.json` trong workspace; toàn bộ khung xương và đại cương của tất cả các tập đều ở canvas tổng này.

- Node "Khung xương câu chuyện": lõi câu chuyện, khát vọng và trở ngại, sự kiện then chốt của cung nhân vật, tiểu sử năm yếu tố, ranh giới năng lực/cái giá, cách nói chuyện, thiết kế xuất hiện, cấu trúc ba hồi.
- Node "Đại cương theo tập" hoặc các node nhóm theo tập: cách xử lý nguồn, mục tiêu/trở ngại/lựa chọn/kết quả, thay đổi cảm xúc, thông tin mới và chênh lệch hiểu biết giữa khán giả và nhân vật, kỳ vọng ở cuối.
- Node "Nhật ký quyết định chuyển thể": căn cứ cắt giảm toàn cục, nguồn phục bút và vị trí cài cắm/hé lộ, điểm chặn phát hành áp dụng.
- Node "Quyết định phương pháp tự sự": thể loại chính/phụ trợ, nhịp đoạn được chọn, thay đổi quan hệ hoặc quyền lực, động tác diễn xuất cụ thể, ý đồ âm thanh và các mẫu bị loại bỏ cùng lý do; không được chỉ ghi nhãn thể loại.
- Cập nhật node tương ứng đã có, và theo [Thao tác canvas](canvasOperations.md) giữ định vị node thật.

Đại cương từng tập tối thiểu gồm:

| Số tập | Tiêu đề tập | Phạm vi nguồn | Chức năng kịch tính | Lõi cảnh | Xử lý nguồn và lý do | Điểm kết thúc và kỳ vọng/khép lại |
|---|---|---|---|---|---|---|
| Một số nguyên | Tiêu đề tập này | Chương/đoạn thật | Vai trò của tập này | Xung đột và thay đổi chính | Giữ/Nén/Gộp/Xóa | Kỳ vọng bước tiếp hoặc thực hiện ở tập cuối |

Khi tổng số tập nhiều thì viết tổng quan trước, rồi triển khai tập đầu, tập bước ngoặt cuối hồi, tập cao trào và các tập người dùng chỉ định; tổng quan vẫn phải một dòng một tập, không dùng dòng phạm vi thay cho nhiều tập.

## Cổng chất lượng và xác nhận

- Số tập đúng bằng cấu hình, không nhảy số, không trùng lặp; một chương tách thành nhiều tập thì ghi rõ đoạn mỗi tập sử dụng.
- Toàn bộ nguồn đều có đích đến rõ ràng, kể cả nội dung bị xóa; không có chương không tồn tại hoặc tình tiết mới chưa được phép.
- Động cơ và thay đổi của nhân vật hợp lý; nhân quả ba hồi liền mạch; mỗi tập có tiến triển thực chất và điểm kết thúc phù hợp với dự án này.
- Độ dài dự kiến phù hợp thời lượng mục tiêu; nhật ký cắt giảm khớp với nội dung các tập; cú lật truy ngược được về căn cứ cài cắm.
- Định vị vấn đề theo các chiều thẩm định của phương pháp biên kịch: khát vọng và trở ngại có thành lập không, lựa chọn của nhân vật có mang lại hệ quả không, các tập có thêm thông tin/cảm xúc/quan hệ không, nhịp thể loại có thực sự rơi vào tập và cảnh không.
- Sau khi ghi, đọc lại thành phẩm, kiểm tra độc lập các vấn đề trên, trình bày cho người dùng tóm tắt phương án, vấn đề cụ thể và đề xuất.
- Chờ người dùng thông qua rõ ràng, chỉ định sửa hoặc làm lại; chấm điểm hay tự kiểm nội bộ đạt đều không thay được xác nhận của người dùng.
- Sửa cục bộ chỉ cập nhật tập, nhân vật hoặc quyết định bị ảnh hưởng, đồng thời kiểm tra tập trước sau và tính liền mạch của tuyến chính.

Sau khi xác nhận vào [Chiến lược chuyển thể](adaptationStrategy.md).

## Căn cứ bản cũ

`data/skills/script_execution_skeleton.md`, `data/skills/script_agent_supervision.md`, `data/skills/script_agent_decision.md`.
