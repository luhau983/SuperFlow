# Kế hoạch đạo diễn từng tập

Chỉ xử lý một tập đã xác nhận hiện tại. Thứ tự đầy đủ và ủy quyền theo giai đoạn xem [SKILL.md](../SKILL.md), thao tác canvas xem [canvasOperations.md](canvasOperations.md).

Trước khi bắt đầu, đọc phần "Căn cứ phân cảnh và diễn xuất" của [Kiến thức shot](knowledge/shotCraft.md) và thể loại đã xác nhận trong [Thể loại tự sự](knowledge/narrativeGenres.md), đọc lại quyết định phương pháp tự sự và quyết định sáng tác của tập này trên canvas kịch bản, dùng phương pháp của chúng để hoàn thành kế hoạch chia cảnh, cảm xúc và diễn xuất dưới đây. Phong cách hình ảnh chỉ dùng lại [mục phong cách](knowledge/visualStyles.md) đã xác nhận ở giai đoạn tài sản, không chọn lại thể loại, phong cách vẽ hay tách shot trước ở giai đoạn đạo diễn. Khi đã có bản chốt nhưng không có bản ghi phương pháp, chỉ phân tích manh mối, quan hệ và cảm xúc đã có trong nguyên văn, không bịa thêm ý đồ sáng tác hay cốt truyện.

## Đầu vào và nơi lưu

- Kịch bản chính thức lấy từ node đã xác nhận của tập đó trong `Canvas/Kịch bản.json`, ghi lại định danh node thực tế và phiên bản.
- Đọc các tài sản khả dụng của tập đó và trạng thái đã xác nhận từ `Canvas/Tài sản.json`; chỉ kiểm tra tên thật và tham chiếu, không tạo tài sản ở đây.
- Kế hoạch đạo diễn, ý kiến duyệt và bản ghi xác nhận ghi vào canvas của tập đó, ví dụ `Canvas/Tập/Tập 001.json`.
- Kế hoạch đã có thì đọc trước rồi sửa; giữ nội dung không bị lần sửa này ảnh hưởng, không được dựa vào tóm tắt chat mà ghi đè canvas.

## Phương pháp

1. Chia cảnh theo đánh dấu cảnh đã có trong kịch bản; khi không có đánh dấu cảnh, lấy thay đổi địa điểm, nhảy thời gian hoặc kết thúc đoạn diễn liên tục làm ranh giới.
2. Đánh số theo thứ tự tự sự `Sc1, Sc2...`, bao phủ tất cả các cảnh, không thêm tình tiết trong cảnh.
3. Thống kê từng cảnh số câu thoại và số chữ, gồm đối thoại, độc thoại, OS, VO và thông tin chữ cần truyền đạt; không có lời thoại ghi số không.
4. Ghi lại từng cảnh cường độ cảm xúc 0~10 và tông cảm xúc bằng một câu, khi có diễn tiến thì ghi rõ điểm đầu và điểm cuối.
5. Chuyển các khoảnh khắc cảm xúc then chốt thành ánh mắt, hơi thở, tư thế và biên độ động tác có căn cứ trong kịch bản; viết các neo nhất quán, khoảng cách không gian, nguồn âm môi trường cụ thể và chỗ dễ sai thành lưu ý mà khâu sau thực hiện được, không dùng kho từ cảm xúc để thêm ném đồ, khóc hay lời thoại mới.
6. Chỉ đề xuất chuyển tiếp giữa các cảnh khi khoảng cách không thời gian hoặc chênh lệch cảm xúc cần nối; các cảnh có thể nối trực tiếp thì không cần gượng thêm đoạn chuyển.
7. Động tác nối hoặc shot trống mới thêm phải đánh dấu rõ là "Chuyển tiếp dự kiến bổ sung", nói rõ nối hai cảnh nào, chờ người dùng xác nhận.

Kế hoạch đạo diễn phụ trách chia cảnh, thống kê lời thoại, cảm xúc và lưu ý, không viết trước bảng phân cảnh hay khởi động tạo media.
Ánh sáng và phong cách hình ảnh dùng tiếp tài sản đã xác nhận; giai đoạn này không tạo thêm ánh sáng xung đột, không sắp xếp nhạc nền chưa được yêu cầu.
Nguyên văn lời thoại vẫn lấy kịch bản chính thức làm chuẩn, kết quả thống kê không được thành căn cứ để xóa sửa lời thoại hay nén cốt truyện.

## Thành quả được ghi

Lập hoặc cập nhật kế hoạch đạo diễn đọc được trên canvas của tập này, tối thiểu gồm ba phần sau:

| Cảnh | Tên bối cảnh | Số câu thoại | Số chữ thoại | Cường độ cảm xúc | Tông cảm xúc |
|---|---|---|---|---|---|
| Sc1 | Địa điểm và đoạn diễn hiện tại trong kịch bản | Số đếm thực tế | Số đếm thực tế | 0~10 | Điểm đầu→Điểm cuối |

- Lưu ý từng cảnh: số cảnh, khoảnh khắc cảm xúc và căn cứ diễn xuất nhìn thấy được, neo nhất quán, khoảng cách không gian, nguồn âm môi trường, nhắc chỗ dễ sai; theo nội dung thực tế của tập này viết rõ phương pháp thể loại được thực hiện thế nào, ví dụ lúc này khán giả có thể biết manh mối sẵn có nào, phản ứng hài cần khoảng dừng ra sao, quan hệ gia đình được biểu đạt bằng động tác đời thường nào, mục không có thì có thể bỏ.
- Bảng chuyển tiếp giữa các cảnh: cảnh trước sau, cách chuyển tiếp, nội dung nối cụ thể, có thuộc dự kiến bổ sung không; khi không cần chuyển tiếp ghi "Không".
- Bản ghi nguồn: node kịch bản chính thức và phiên bản, tham chiếu thật của các tài sản liên quan, phạm vi sửa lần này.

## Đọc lại và xác nhận

1. Sau khi ghi, đọc lại canvas của tập này, kiểm tra cảnh không sót không trùng, đánh số liên tục, cảm xúc và lưu ý mỗi cảnh đầy đủ.
2. Kiểm tra nguồn thống kê lời thoại, căn cứ diễn xuất và chuyển tiếp dự kiến bổ sung, không trộn ví dụ kho từ cảm xúc hay gợi ý sáng tác thành cốt truyện đã xác nhận.
3. Trình bày cho người dùng vị trí canvas, tóm tắt chia cảnh và các chuyển tiếp cần quyết định, nói rõ hiện tại là "Chờ xác nhận".
4. Chờ người dùng xác nhận hoặc đưa ra sửa đổi; khi người dùng chỉ xác nhận một phần, chỉ đánh dấu phần đó là thông qua.
5. Sau khi bản ghi xác nhận được lưu vào canvas của tập này thì dừng, do quy trình chính quyết định giai đoạn tiếp theo, không tự động phân tích hay tạo tài sản phái sinh.

Nguồn và khác biệt với giao thức cũ xem ánh xạ kế hoạch đạo diễn trong [sourceMap.md](sourceMap.md).
