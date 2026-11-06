# Nguyên văn và sự kiện chương

Giai đoạn này sắp xếp tiểu thuyết hoặc câu chuyện người dùng cung cấp thành bảng sự kiện có thể truy nguồn, làm căn cứ cho khung xương câu chuyện.

## Đầu vào

- Cấu hình dự án đã xác nhận, cùng các giới hạn như phạm vi chuyển thể, mức trung thành với nguyên tác, nội dung được phép điều chỉnh.
- Nguyên văn các chương, văn bản câu chuyện hoặc kịch bản sẵn có do người dùng cung cấp; giữ nguồn thật và đánh số gốc.
- Chỉ mục nguyên văn, bảng sự kiện và bản ghi xác nhận đã có trên canvas kịch bản; các xác nhận đã có tiếp tục dùng.

## Bắt buộc đọc trước khi thực hiện

- Phải đọc các phần "Thứ tự áp dụng", "Đánh giá sự kiện và ba mức mật độ" của [Phương pháp biên kịch](knowledge/scriptCraft.md), rồi mới trích xuất nguyên văn; không được dùng đề xuất chuyển thể thay cho sự thật nguyên văn.
- Khi thể loại đã được xác nhận, phải đọc phần "Sử dụng và đưa lên canvas" của [Thể loại tự sự](knowledge/narrativeGenres.md) và thể loại tương ứng, nhận diện những đời thường, im lặng, quan hệ, manh mối hoặc hành động cần giữ lại; khi thể loại chưa định thì chỉ trích xuất sự thật và ghi lại các ứng viên, không tự ý định giọng điệu.

## Phương pháp thực hiện

1. Theo [Thao tác canvas](canvasOperations.md) đọc workspace và canvas kịch bản, định vị các kết quả đã có.
2. Kiểm tra nguyên văn thực sự đọc được và phạm vi chương; khi thiếu chương hoặc tệp đính kèm không đọc được, nêu rõ chỗ thiếu, trước tiên bổ sung đầu vào cần thiết cho giai đoạn này.
3. Khi nguyên văn dài thì xử lý theo chương, giữ đường dẫn nguồn và chỉ mục chương; không được chỉ dựa vào tóm tắt mà tuyên bố đã đọc toàn bộ nguyên văn.
4. Đầu vào tiểu thuyết theo thứ tự chương gốc, mỗi chương đúng một dòng sự kiện tổng hợp; trích xuất sự kiện có ảnh hưởng lớn nhất tới nhân vật chính và tuyến chính, các sự kiện khác chỉ giữ nhân quả, quan hệ nhân vật hoặc phục bút cần thiết. Chi tiết nhiều sự kiện viết riêng vào phần bổ sung của chương đó, không tăng số dòng của bảng tổng hợp, cũng không gộp các chương khác nhau.
5. Sự kiện cốt lõi viết rõ "ai thực hiện hành động gì, gây ra kết quả gì", khoảng 30–60 chữ; không thuật lại cả đoạn hội thoại.
6. Thống nhất cách gọi chính của cùng một nhân vật và ghi lại tên khác; không coi tên khác là nhân vật mới.
7. Đánh dấu quan hệ với tuyến chính, mật độ thông tin, cảm xúc và thời lượng chuyển thể dự kiến. Dùng tiếp mức tham chiếu ước tính thời gian cũ: mật độ cao và cảm xúc cao khoảng 45–60 giây, trung bình khoảng 35–45 giây, mật độ thấp khoảng 25–35 giây; mỗi dòng ghi giá trị ước tính cụ thể kèm "giây", cảm xúc dùng nhãn chữ nối bằng "+". Giá trị này là ước tính chuyển thể cho nội dung chương, không có nghĩa một chương một tập, cũng không phải thời lượng của yêu cầu video phía sau.
8. Khi người dùng chỉ cung cấp ý tưởng câu chuyện nguyên bản, có thể sắp xếp theo các đoạn hoặc đơn vị tình tiết đã xác nhận; nội dung sáng tác mới phải đánh dấu rõ là đề xuất, không được ngụy trang thành sự thật nguyên văn.

## Ghi vào canvas kịch bản

Vị trí mặc định là `Canvas/Kịch bản.json` trong workspace; đường dẫn thực tế và thao tác node theo [Thao tác canvas](canvasOperations.md).

- Lưu nguồn, phạm vi bao phủ, tiêu đề chương và tình trạng thiếu trong node "Chỉ mục nguyên văn".
- Lưu bảng sự kiện trong node "Bảng sự kiện chương"; khi nội dung dài thì nhóm theo chương thực tế, vẫn đặt trên cùng canvas kịch bản.
- Dòng tổng hợp giữ bảy trường dưới đây; chi tiết mục tiêu/trở ngại, thông tin mới và người biết, đạo cụ quan trọng, thay đổi quan hệ và phục bút đính kèm riêng trong phần bổ sung của chương, giữ nguồn thật. Phần bổ sung lưu cùng node với dòng tổng hợp của chương tương ứng, khi đọc sự kiện chương ở bước sau thì đọc cùng lúc, không chỉ đọc bảng bảy trường. Mật độ hoặc biểu đạt thể loại cần tăng cường viết riêng trong node văn bản "Ứng viên chuyển thể", không sửa bảng sự thật.
- Khi nguyên văn đã có tệp đọc được thì ưu tiên đăng ký nguồn và cách định vị, tránh chất đống toàn văn lặp lại.
- Cập nhật node tương ứng đã có; không được vì vào lại giai đoạn này mà tạo lặp canvas kịch bản hoặc cả bộ bảng sự kiện.

Bảng tổng hợp sự kiện tiểu thuyết cố định bảy trường, một chương một dòng; có thể thêm tiêu đề bảng để dễ đọc trên canvas. Ý tưởng nguyên bản không có chương gốc thì theo đơn vị tình tiết đã xác nhận, một đơn vị một dòng, và nói rõ không phải chương nguyên tác:

| Chương/đoạn nguồn | Nhân vật liên quan | Sự kiện cốt lõi | Quan hệ tuyến chính và lý do | Mật độ thông tin | Thời lượng dự kiến (giây) | Cảm xúc |
|---|---|---|---|---|---|---|
| Số và tiêu đề thật | Cách gọi chuẩn | Hành động và kết quả | Mạnh/Trung bình/Yếu (lý do ngắn) | Cao/Trung bình/Thấp | Ước tính cụ thể như 50 giây | Nhãn chữ như Xung đột+Bước ngoặt |

## Cổng chất lượng và xác nhận

- Mỗi dòng đều định vị được về nguồn đã đọc; không có chương hư cấu hoặc nội dung vượt phạm vi đã xác nhận.
- Phạm vi đã xác nhận không bị bỏ sót; số dòng tổng hợp tiểu thuyết bằng số chương đã xử lý, đánh số khớp từng mục, không được tách ba chương thành nhiều dòng sự kiện rồi tuyên bố vẫn là định dạng tổng hợp cũ. Các chương không đọc được hoặc chưa xử lý phải đánh dấu rõ là chưa hoàn thành, không ngụy tạo sự kiện để đủ số dòng.
- Sự kiện trung thành với nguyên văn; cách gọi nhân vật nhất quán; độ mạnh yếu tuyến chính có căn cứ; trích xuất hội thoại phải đi đến kết quả.
- Rà soát theo phương pháp đã đọc: có nhầm "sự kiện xảy ra" thành tình tiết có biến đổi nhân quả không, có vì dòng nào đó tuyến chính yếu mà bỏ sót đời thường cảm xúc, manh mối hoặc thông tin môi trường quan trọng với thể loại này không.
- Sau khi ghi, đọc lại node, kiểm tra bảng sự kiện và chỉ mục nguồn thực sự tồn tại và nội dung đầy đủ.
- Trình bày cho người dùng phạm vi bao phủ, tóm tắt sự kiện và các chỗ thiếu cần quyết định, chờ xác nhận rõ ràng.
- Khi người dùng yêu cầu sửa, chỉ sửa các chương liên quan và kiểm tra lại; không chạy lại các chương khác đã xác nhận.

Sau khi xác nhận vào [Khung xương câu chuyện](storySkeleton.md); không được coi việc trích xuất sự kiện hoàn tất là khung xương câu chuyện đã được chấp thuận.

## Căn cứ bản cũ

`eventExtraction` trong `src/routes/novel/event/generateEvents.ts`, `src/utils/cleanNovel.ts`, `src/lib/initDB.ts`.
