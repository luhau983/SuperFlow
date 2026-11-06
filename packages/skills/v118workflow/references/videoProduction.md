# Chuẩn bị, tạo và nghiệm thu video

Quy trình này có ba điểm dừng xác nhận độc lập, không được vượt qua một lần. Mọi thành quả để trên canvas của tập hiện tại, ví dụ `Canvas/Tập/Tập 001.json`.
Node cụ thể, khám phá công cụ, trạng thái và thao tác tệp xem [canvasOperations.md](canvasOperations.md).

Trước khi chuẩn bị, đọc [Kiến thức chế độ video, mẫu mô hình và âm thanh](knowledge/videoPromptCraft.md): trước tiên đọc phần chọn chế độ và ràng buộc chung, rồi đọc đầy đủ mẫu thực tế áp dụng cho lần này trong các mẫu Seedance ba đoạn, Wan khung đầu đơn, khung đầu/khung đầu và khung cuối chung hoặc đa tham chiếu chung, cuối cùng đọc phần ghi chép tập này và nghiệm thu. Không được chỉ lấy tên mẫu; phải thực sự điền số shot gốc, động tác, lời thoại, âm thanh và tham chiếu thật của tập này. Phong cách chỉ tra mục đã xác nhận của [Phong cách hình ảnh](knowledge/visualStyles.md), khi có nghi vấn về tính thời gian hoặc nối tiếp thì đọc lại phần tương ứng của [Kiến thức shot](knowledge/shotCraft.md).

## I. Chuẩn bị video

Đầu vào là bảng phân cảnh đã xác nhận, đơn vị sản xuất, ảnh tài sản được chọn dùng, và ảnh phân cảnh đã xác nhận mà tuyến được chọn cần.
Lời thoại chính thức lấy `Canvas/Kịch bản.json` làm chuẩn; tham chiếu tài sản lấy từ `Canvas/Tài sản.json`, không lập bản sao tài sản chính thức mới.

1. Đọc đầu vào, số lượng tham chiếu, thời lượng, độ phân giải, tỉ lệ khung, âm thanh và chế độ mà mô hình video hiện tại thực sự hỗ trợ, không bắt buộc Seedance.
2. Văn bản đa tham chiếu chuẩn bị một video cho mỗi đoạn; tuyến khung đầu chuẩn bị một video cho mỗi shot, chỉ khi hỗ trợ và đã chọn khung đầu và khung cuối mới thêm khung cuối.
3. Thời lượng đơn vị đồng thời bị ràng buộc bởi giới hạn 15 giây của v1.1.8 và giới hạn của mô hình hiện tại; thời lượng rời rạc hoặc đầu vào không tương thích thì quay lại xác nhận phân cảnh/chế độ.
4. Theo mô hình/chế độ đầu vào thực tế chọn mẫu áp dụng trong tệp kiến thức, viết prompt thực thi đầy đủ cho mỗi đơn vị: chủ thể và bối cảnh, số shot gốc và toàn bộ shot con, trạng thái đầu cuối của động tác, chuyển động máy, trình tự thời gian, lời thoại đầy đủ và hiệu ứng âm thanh cụ thể. Khi mẫu yêu cầu một shot liên tục đơn mà gặp nhiều shot đã xác nhận thì quay lại xác nhận phân cảnh/chế độ, không vì khớp định dạng mà xóa shot.
5. Lời thoại giữ ngôn ngữ gốc và nguyên văn, phân biệt đối thoại, OS và VO; chỉ người nói mới khẩu hình tương ứng, không được để lời dẫn tự động thành nhân vật mở miệng.
6. Dấu tham chiếu được lập theo `{{ref N}}` của host hiện tại và thứ tự đầu vào media thật, đồng thời kiểm tra ánh xạ thích ứng, không coi `@ảnhN` cũ hay XML là giao thức chung; ảnh, video, âm thanh ghi chú riêng mục đích thực tế, thiếu ảnh phân cảnh thì không hư cấu tham chiếu bố cục, cũng không vì thế mà bỏ tham chiếu tài sản thật.
7. Khi thiếu ảnh, âm thanh không được hỗ trợ hoặc tham chiếu vượt giới hạn thì trước tiên điều chỉnh phương án và xác nhận, không được bỏ đầu vào rồi tạo thẳng.
8. Sau khi ghi node video và ghi chú, đọc lại, kiểm tra số shot/số đoạn, thứ tự, prompt, thời lượng, đầu vào media thực tế và mốc đầu ra đã có; chính văn mẫu chỉ viết nội dung thực thi, ý kiến duyệt để trong ghi chú đọc được.

Trong ghi chú sản xuất đã có của tập này, lưu lựa chọn mẫu và lý do, mô hình/chế độ, prompt thực thi đầy đủ, quan hệ tương ứng với số shot gốc, lời thoại/OS/VO và người nói cùng khẩu hình, căn cứ âm sắc, phiên bản nguồn tham chiếu và ánh xạ đầu vào thực tế, trạng thái đầu cuối và sự tiếp nối trước sau. Không có mẫu giọng thật thì không bịa tham chiếu âm thanh, không có năng lực âm thanh thì không hứa tạo lời thoại/âm sắc; không thêm bản sao tài sản chính thức ở đây.

**Điểm dừng A: Xác nhận chuẩn bị.** Trình bày prompt, mô hình/chế độ, tham số, số lượng đơn vị và phạm vi, chờ người dùng xác nhận hoặc sửa.
Sau khi ghi phạm vi xác nhận ngược vào canvas của tập này thì dừng; xác nhận nội dung chuẩn bị không tự động đồng nghĩa với ủy quyền khởi động tạo.

## II. Tạo video

Điều kiện vào: phần chuẩn bị đã thông qua, và đã nhận được chỉ thị tạo cho lô video này; cùng một phạm vi ủy quyền rõ ràng thì không xác nhận đi xác nhận lại.

1. Đọc lại kết quả chuẩn bị, bảo đảm mục tiêu tạo và phạm vi ủy quyền vẫn nhất quán, thay đổi tham số không được lặng lẽ có hiệu lực.
2. Khởi động phạm vi xác nhận qua công cụ node được khám phá thời gian thực, giữ ứng viên cũ và phiên bản đã chọn dùng.
3. Ghi lại định danh node/tác vụ thực tế và "Đang tạo", dùng công cụ trạng thái hiện khả dụng để truy vấn trạng thái cuối.
4. Sau khi chuyển canvas tiếp tục truy vấn theo định danh thật; không được diễn giải việc rời trang thành hủy tác vụ rồi đặt lặp.
5. Sau khi thành công đọc lại đầu ra video và mở để kiểm chứng, thất bại thì ghi lại đơn vị tương ứng và nguyên nhân; yêu cầu thành công không đồng nghĩa với video thành công.
6. Ghi ngược riêng các mục thành công, thất bại, vẫn đang chạy vào tập này; mục chưa hoàn thành không tính vào hoàn thành bàn giao.

**Điểm dừng B: Xác nhận kết quả tạo.** Trình bày các ứng viên phát được và phạm vi thất bại, chờ người dùng quyết định nghiệm thu, thử lại cục bộ hoặc sửa.
Chưa có chỉ thị rõ ràng thì không tự động chạy lại mục thất bại, không đánh dấu thẳng toàn bộ ứng viên thành công là thành phẩm đã chọn dùng.

## III. Nghiệm thu và bàn giao video

Điều kiện vào: người dùng xác nhận vào nghiệm thu hoặc yêu cầu rõ ràng chọn đoạn/bàn giao. Phát thực tế các ứng viên, đối chiếu phân cảnh và lời thoại để kiểm tra:

- Thân phận, hình thái nhân vật, bối cảnh và đạo cụ nhất quán, động tác và shot phù hợp phân cảnh đã xác nhận, không thiếu sự kiện then chốt.
- Lời thoại đầy đủ, người nói đúng, quan hệ giữa OS/VO và khẩu hình đúng, hiệu ứng âm thanh phù hợp bối cảnh; kiểm tra âm thanh theo năng lực mô hình thực tế.
- Thời lượng thực tế, tỉ lệ khung, độ nét dùng được, động tác, bối cảnh và cảm xúc giữa các đoạn liên tục, không có cắt cụt rõ ràng hay đoạn đuôi thừa.
- Tệp video đọc được và tương ứng đúng đơn vị; ghi lại khác biệt giữa các ứng viên, vị trí vấn đề và phiên bản khuyến nghị sử dụng.

Theo phương pháp nghiệm thu của kiến thức video, ghi bằng chứng đã xem thực tế và thời điểm có vấn đề ngược vào tập này. Khi công cụ hiện tại không thể phát/hiểu video hoặc đọc track âm thanh, nhờ người dùng xem trước và phản hồi, giữ "Chờ người dùng kiểm chứng", không được dùng đường dẫn đọc được, trạng thái thành công hay đầu ra cũ để giả là đã xem và nghe.

**Điểm dừng C: Xác nhận chọn dùng và bàn giao.** Trình bày ý kiến nghiệm thu từng đơn vị, phương án chọn đoạn và thứ tự, chờ người dùng quyết định phạm vi chọn dùng hoặc làm lại.
Sau khi người dùng xác nhận, ghi kết quả chọn dùng và tham chiếu video thật ngược vào canvas của tập này, giữ các ứng viên không được chọn và bản ghi vấn đề.

## Ranh giới bàn giao

Mặc định có thể bàn giao các đoạn sắp theo thứ tự đã xác nhận và danh sách, ghi rõ số tập, số shot/số đoạn, thời lượng thực tế, tham chiếu tệp và các mục chưa giải quyết.
Khi người dùng yêu cầu ghép, trước tiên xác minh host hiện tại có năng lực ghép khả dụng, rồi xác nhận phương án cụ thể; không có năng lực thì nói rõ bàn giao dưới dạng các đoạn.
Chỉ sau khi ghép thực tế, đọc lại tệp và phát kiểm chứng mới được gọi là thành phẩm của tập này; không được dùng danh sách hay tác vụ chưa thực hiện để giả là đã xuất xong.
README bản cũ có nhắc tới ghép nối xuất, nhưng tag đó không cung cấp route xuất sản xuất nào có thể dựa vào để dùng lại, không bịa API cũ.
Thư mục bàn giao được lưu theo tổ chức dự án đã xác nhận, node canvas giữ tham chiếu thật; không tùy tiện di chuyển hay xóa bản gốc đã tạo.
Sau khi ghi ngược trạng thái bàn giao của tập này thì dừng; tập sau vẫn theo quy trình chính thực hiện từng giai đoạn, không được mở rộng xác nhận của tập này cho tất cả các tập.

Ranh giới giữa bàn làm việc bản cũ và node hiện tại xem [sourceMap.md](sourceMap.md).
