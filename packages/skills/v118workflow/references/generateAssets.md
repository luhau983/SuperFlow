# Prompt tài sản và tạo ảnh

Tài sản cơ bản và tài sản phái sinh đều được hoàn thành trong `Canvas/Tài sản.json`. Các thao tác cụ thể về node, kết nối, tạo và trạng thái xem [canvasOperations.md](canvasOperations.md).

## Đầu vào và chuẩn bị

- Dùng danh sách tài sản, mô tả, phong cách và phạm vi tạo lần này đã xác nhận, kiểm tra các node tài sản thật và ảnh hiện có.
- Trước khi thực hiện đọc các chương về loại tương ứng, biến thể, mẫu prompt và nghiệm thu trong [Phương pháp thiết kế tài sản](knowledge/assetDesign.md), rồi đọc quy tắc chung và nhánh đã chọn của [Phong cách vẽ và quy tắc hình ảnh](knowledge/visualStyles.md); đọc lại "Quy ước hình ảnh dự án" đã xác nhận từ canvas tài sản, cụ thể hóa thành thiết kế cụ thể cho lần này, không được chỉ thêm nhãn phong cách.
- Thân phận, tuổi tác, trang phục thường ngày của nhân vật và thiết lập thế giới đến từ kịch bản đã xác nhận và thiết kế tài sản, không được áp thẩm mỹ cố định của một phong cách cũ nào đó.
- Đọc năng lực hiện tại của mô hình ảnh, các tỉ lệ khả dụng, độ phân giải và giới hạn ảnh tham chiếu; nếu tham số đã được xác nhận trong phạm vi lần này thì dùng tiếp ủy quyền.
- Tham số chưa xác nhận hoặc thay đổi phạm vi thì trước tiên trình bày và xác nhận; không được diễn giải việc xác nhận prompt thành ủy quyền tạo không giới hạn.
- Tài sản phái sinh phải đọc ảnh cha đã xác nhận của nó, dùng ảnh cha làm đầu vào ảnh thực tế; chỉ viết chữ đường dẫn ảnh cha không tính là gắn tham chiếu.

## Phương pháp thiết kế

| Tài sản | Nội dung hình ảnh | Yêu cầu kiểm chứng được |
|---|---|---|
| Nhân vật cơ bản | Cận cảnh khuôn mặt, cộng ba góc nhìn toàn thân đầy đủ chính diện, nghiêng, sau lưng | Dùng tiếp phương pháp bốn góc của đa số phong cách cũ; cyberpunk phong cách cổ phong bổ sung đầy đủ tư liệu trên hạt giống khuôn mặt cũ. Thân phận, kiểu tóc, vóc dáng, trang phục nhất quán; toàn thân không cắt đầu chân, khuôn mặt rõ ràng |
| Bối cảnh cơ bản | Thường là góc nhìn chính một khung hình; cyberpunk phong cách cổ phong dùng ảnh thiết lập bốn hướng 2×2 trước/phải/sau/trái cùng một tâm điểm | Chủ thể không gian rõ ràng, có chiều sâu đọc được; không có nhân vật, bóng người hay đường nét cơ thể người. Cyberpunk phong cách cổ phong nhất quán cấu trúc bốn hướng, độ cao điểm nhìn, nguồn sáng thế giới; các phong cách vẽ khác không ghép đa góc nhìn |
| Đạo cụ cơ bản | Theo phong cách chọn tĩnh vật đơn độc một ảnh hoặc chính-nghiêng-sau kèm chi tiết; điện ảnh đô thị người thật mặc định một ảnh chụp vật thật | Chất liệu, quan hệ kích thước và chức năng nhận ra được; không xuất hiện cơ thể người hay bàn tay cầm, đeo; tĩnh vật chụp ảnh có mặt đỡ và bóng đổ thật |
| Phái sinh nhân vật | Dùng ảnh cha giữ thân phận, chỉ thay đổi việc thay trang phục, biến thân hoặc hình thái đã xác nhận | Nhân vật mới và cũ nhận ra là cùng một thân phận, phạm vi thay đổi khớp với danh sách |
| Phái sinh bối cảnh | Dùng ảnh cha giữ cấu trúc không gian và bố cục trình bày, thay đổi khung giờ đã xác nhận; cyberpunk phong cách cổ phong dùng tiếp ảnh thiết lập bốn hướng | Địa điểm, bố cục chủ thể và bày trí cốt lõi liên tục, thay đổi khung giờ rõ ràng; biến thể bốn hướng đổi khung giờ đồng bộ, không được chỉ đổi một ô |
| Biến thể bổ sung rõ ràng | Chỉ khi người dùng đã xác nhận riêng mới thiết kế thời tiết/góc máy/trạng thái bối cảnh, trạng thái đạo cụ, v.v. | Dùng phương pháp kiến thức tương ứng, khóa phần không thay đổi; không được vì kho kiến thức có mẫu mà mở rộng phạm vi tạo mặc định |

Ảnh đa góc nhìn nhân vật và ảnh bốn hướng bối cảnh cyberpunk phong cách cổ phong là tư liệu nhận diện tài sản, không đồng nghĩa với tỉ lệ thành phẩm; chọn tỉ lệ ảnh tài sản phù hợp theo năng lực mô hình hiện tại. Cách xử lý khi phương pháp bốn hướng và mô hình không chứa được rõ ràng xem [Thiết lập bốn hướng cho bối cảnh](knowledge/assetDesign.md#thiết-lập-bốn-hướng-cho-bối-cảnh-cyberpunk-phong-cách-cổ-phong).
Prompt viết riêng chủ thể, cấu trúc/chất liệu, phong cách cần thiết và mục cấm, tránh để chuỗi từ phong cách dài che lấp bản thân tài sản.
Nhân vật, bối cảnh, đạo cụ được cụ thể hóa theo thẻ thiết kế và mẫu trong kiến thức; giữ các khác biệt nhánh như cảm giác da tự nhiên/hạt mịn vừa phải của điện ảnh người thật, dấu vết thủ công của đất sét hoặc khối màu phẳng thuần. Chỉ dùng từ phủ định độc lập khi mô hình hiện tại hỗ trợ, và kiểm tra xung đột giữa khẳng định và phủ định.
Ánh sáng và tông màu được xác nhận thống nhất trong tài sản bối cảnh, phân cảnh phía sau dùng tiếp, không được mỗi shot định nghĩa lại một bộ nền tảng hình ảnh.

## Xác nhận prompt và tạo

1. Ghi các quyết định thiết kế như nhận diện cốt lõi, bảng màu/nguồn sáng/chất liệu/cách trình bày của mỗi mục, prompt cuối cùng, nguồn ảnh tham chiếu và tham số lần này vào canvas tài sản, và liên kết với phiên bản quy ước hình ảnh; ưu tiên dùng lại nội dung đã xác nhận.
2. Đọc lại và trình bày prompt cùng phạm vi tạo; thiếu xác nhận thì dừng ở đây, đã có ủy quyền rõ ràng thì không đòi lại cùng một sự cho phép.
3. Theo thông tin công cụ node thời gian thực, lập hoặc cập nhật node tạo ảnh và đầu vào tham chiếu thực tế, không bịa trường plugin.
4. Chỉ khởi động các mục chờ tạo trong phạm vi đã xác nhận; giữ ảnh đã chọn dùng và ứng viên hiện có, không mặc định chạy lại toàn bộ.
5. Ghi lại định danh tác vụ/node thực tế và trạng thái "Đang tạo"; gửi yêu cầu không có nghĩa ảnh đã thành công.
6. Theo công cụ thời gian thực truy vấn trạng thái cuối và đọc lại kết quả; thất bại chỉ báo cáo mục tương ứng và nguyên nhân, sửa lại phạm vi rồi mới quyết định thử lại.
7. Chuyển sang canvas khác không có nghĩa là hủy tác vụ; theo bản ghi định vị node gốc để truy vấn, không khởi động lặp cùng một tác vụ chưa hoàn thành.

## Nghiệm thu và xác nhận ảnh

- Xem thực tế ảnh thành công, kiểm tra các yêu cầu trong bảng, tính nhất quán phong cách, thân phận tham chiếu và khiếm khuyết rõ ràng; không được chỉ dựa vào prompt để đánh giá chất lượng.
- Theo nghiệm thu theo loại của tệp kiến thức, kiểm tra góc nhìn, vật liệu, nguồn sáng và thay đổi trạng thái; "rõ ràng" không được đánh giá nhầm thành phải xóa mọi lỗ chân lông thật, nếp nhăn quần áo, vân thủ công hay hạt nhiễu chụp ảnh có chủ ý.
- Đọc lại để xác nhận ảnh đã được lưu và truy cập được, kết quả tạo tương ứng với mục tài sản và quan hệ cha con.
- Trình bày từng ứng viên và các vấn đề phát hiện, để người dùng chọn chọn dùng, làm lại cục bộ hoặc tạm giữ; phiên bản chưa được chọn dùng vẫn là ứng viên.
- Sau khi người dùng xác nhận, ghi lại tham chiếu thật, phạm vi áp dụng và trạng thái xác nhận của ảnh được chọn dùng; canvas của tập này chỉ tham chiếu các tài sản này.
- Giai đoạn này kết thúc ở nghiệm thu tài sản, không tự động tạo phân cảnh hay video; phần sau do quy trình chính đẩy từng bước.

## Tiêu chuẩn hoàn thành

Mỗi mục trong phạm vi xác nhận đều có ảnh thật đọc được và trạng thái rõ ràng, hoặc liệt kê rõ mục thất bại/bỏ qua.
Tài sản phái sinh truy ngược được về tài sản cha và đầu vào ảnh cha thực tế, tài sản dùng lại không bị ghi đè ngoài ý muốn.
Nguồn phương pháp đầy đủ xem ánh xạ thiết kế và tạo tài sản trong [sourceMap.md](sourceMap.md).
