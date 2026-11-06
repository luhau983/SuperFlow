# Chiến lược chuyển thể

Giai đoạn này chuyển khung xương câu chuyện đã xác nhận thành các nguyên tắc lựa chọn và biểu đạt mà biên kịch có thể trực tiếp tuân theo.

## Đầu vào

- Cấu hình dự án, sự kiện chương, khung xương câu chuyện và đại cương theo tập đầy đủ đã xác nhận.
- Yêu cầu của người dùng về mức trung thành với nguyên tác, phạm vi được sửa, phong cách, nhân vật, kết cục và khán giả mục tiêu.
- Chiến lược chuyển thể và bản ghi xác nhận đã có; giữ lại các quyết định vẫn còn hiệu lực.

## Bắt buộc đọc trước khi thực hiện

- Phải đọc các phần "Lựa chọn chuyển thể và thế giới quan", "Chênh lệch thông tin, móc câu và cú lật", "Phương pháp thẩm định và phân cấp vấn đề" của [Phương pháp biên kịch](knowledge/scriptCraft.md), khi cần thì xem lại phương pháp nhân vật và mật độ.
- Phải đọc quy tắc chung và thể loại chính/phụ trợ đã xác nhận trong [Thể loại tự sự](knowledge/narrativeGenres.md), dùng các phương pháp tiết lộ thông tin, diễn xuất, âm thanh và khoảng trống của chúng để xây dựng chuyển đổi phương tiện cụ thể; không được chỉ nén lời thoại là xong.

## Phương pháp thực hiện

1. Theo [Thao tác canvas](canvasOperations.md) đọc lại khung xương, sự kiện và chiến lược hiện có, trước tiên kiểm tra các xác nhận tiền đề đã hoàn tất chưa.
2. Chắt lọc 3–5 nguyên tắc chuyển thể cốt lõi, mỗi nguyên tắc ghi mức ưu tiên, chỉ dẫn tích cực và ranh giới không được vượt.
3. Nguyên tắc phải phục vụ lõi câu chuyện, động cơ nhân vật và cung nhân vật đã xác nhận, không dùng câu chung chung như "tăng cường nhịp" thay cho cách làm cụ thể.
4. Chuyển phần tự thuật, miêu tả tâm lý và thông tin bối cảnh của nguyên tác thành hành động nhìn thấy được, tình huống, lời thoại cần thiết hoặc OS/VO ngắn gọn.
5. Liệt kê nội dung dự định xóa, nén hoặc gộp, lý do và ảnh hưởng tới tuyến chính, đối chiếu từng mục với các quyết định của khung xương.
6. Thiết kế việc trình bày thế giới quan từng bước: mỗi thiết lập then chốt xuất hiện khi nào, do ai dẫn ra, khán giả lúc đó cần biết bao nhiêu.
7. Giữ nhất quán ngôn ngữ, hành vi và nhận diện ngoại hình của nhân vật, đồng thời cân nhắc tỉ lệ khung, thời lượng và mức khả thi khi tạo bằng AI.
8. Khi người dùng yêu cầu trung thành với nguyên tác thì chỉ thực hiện chuyển đổi phương tiện đã được phép; khi liên quan đến thiết lập mới, gộp nhân vật hoặc thay đổi kết cục thì liệt kê riêng thành mục chờ xác nhận.

## Ghi vào canvas kịch bản

Vị trí mặc định là `Canvas/Kịch bản.json` trong workspace; chiến lược và toàn bộ kịch bản dùng chung canvas này.

- Cập nhật node "Chiến lược chuyển thể", gồm nguyên tắc cốt lõi, quyết định cắt giảm, trình bày thế giới quan và ràng buộc biểu đạt hình ảnh.
- Các lựa chọn theo mẫu kiến thức đưa về chương/cảnh nguồn, ba mức mật độ hoặc chức năng thể loại, cách thay thế và nhân vật/phục bút bị ảnh hưởng; thế giới quan ghi lần xuất hiện đầu tiên, bằng chứng hành động, mức độ giải thích, nhân vật neo, điểm nhìn của khán giả và phần bổ sung về sau.
- Cập nhật node "Quyết định phương pháp tự sự", ghi lại nhịp cảm xúc, chênh lệch hiểu biết, động tác then chốt/ẩn ý, khoảng trống và ý đồ âm thanh cụ thể được chọn dùng; tương tác phức tạp giữ mục tiêu cốt truyện, phương án tạo được xác nhận riêng theo năng lực hiện tại.
- Khi thay đổi ảnh hưởng tới khung xương đã xác nhận thì trước tiên đánh dấu xung đột cụ thể, nói rõ node cần điều chỉnh; không được lặng lẽ ghi đè khung xương.
- Các quyết định mới chờ xác nhận được đánh dấu tách biệt với nguyên tắc đã xác nhận, tránh để biên kịch phía sau dùng nhầm.
- Đọc ghi và định vị node theo [Thao tác canvas](canvasOperations.md).

Mẫu nguyên tắc cốt lõi:

| Mức ưu tiên | Nguyên tắc | Cách thực hiện cụ thể | Ranh giới phủ định |
|---|---|---|---|
| Cao/Trung bình/Thấp | Vấn đề chuyển thể được giải quyết | Nhân vật, bối cảnh hoặc cách thể hiện tương ứng | Nội dung không được xóa hoặc thay đổi |

Mẫu lựa chọn: `Nguồn → Giữ/Nén/Gộp/Xóa → Lý do → Ảnh hưởng tới tuyến chính và cung nhân vật → Số tập tương ứng`.

## Cổng chất lượng và xác nhận

- Mỗi nguyên tắc có cách thực hiện cụ thể và ranh giới, và không đi ngược yêu cầu của người dùng.
- Nội dung mà khung xương đánh dấu giữ lại không bị chiến lược tự ý xóa; các lựa chọn mới liệt kê rõ xung đột và phạm vi ảnh hưởng.
- Phần giải thích thế giới quan có thể được cốt truyện dẫn ra tự nhiên, không có thiết lập cần thiết nào phải dựa vào đoạn giải thích dài mới hiểu được.
- Hành vi nhân vật, tông cảm xúc, phục bút và cú lật nhất quán với khung xương; không vì theo đuổi kích thích mà phá vỡ nhân quả.
- Đối chiếu với phương pháp và điều cấm kỵ của thể loại đã đọc, kiểm tra việc cắt giảm có xóa nhầm phần trải đường cần thiết, sự lặp lại đời thường, im lặng, phản ứng then chốt hoặc cái giá nhân tính không; mỗi phương án thay thế vẫn phải thực hiện được chức năng của cảnh gốc.
- Bố trí hình ảnh và lời thoại phù hợp tỉ lệ khung và thời lượng mỗi tập đã xác nhận, không mặc định chỉ cho phép màn hình dọc hoặc hình thức phim ngắn cố định.
- Sau khi ghi, đọc lại chiến lược, kiểm tra mối tương ứng cụ thể của nó với khung xương, rồi trình bày tóm tắt và các quyết định chờ định.
- Chờ người dùng xác nhận rõ ràng rồi mới biên kịch; khi yêu cầu sửa chỉ xử lý nguyên tắc được chỉ định và nội dung bị ảnh hưởng.

Sau khi xác nhận vào [Kịch bản từng tập](episodeScript.md).

## Căn cứ bản cũ

`data/skills/script_execution_adaptation.md`, `data/skills/script_agent_supervision.md`, `data/skills/script_agent_decision.md`.
