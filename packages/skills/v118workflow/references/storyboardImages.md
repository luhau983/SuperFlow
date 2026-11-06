# Tạo và nghiệm thu ảnh phân cảnh

Giai đoạn này chỉ xử lý các đơn vị sản xuất đã xác nhận cần ảnh phân cảnh. Phương pháp tạo, truy vấn trạng thái và đọc lại xem [canvasOperations.md](canvasOperations.md).

Trước khi bắt đầu, đọc [Kiến thức prompt ảnh phân cảnh và khung đầu](knowledge/imagePromptCraft.md), rà lại mẫu mô hình mà đơn vị sản xuất chọn dùng, ngữ nghĩa khung đơn và yêu cầu chất lượng từng mục; phong cách chỉ tra mục đã xác nhận của [Phong cách hình ảnh](knowledge/visualStyles.md). Dùng tiếp prompt đã được phê duyệt, khi phát hiện thiếu sót hoặc mâu thuẫn thực chất thì trước tiên sửa và xác nhận, không mượn việc chuyển đổi mẫu để tự ý thay đổi nội dung đã phê duyệt.

## Đầu vào và nơi lưu

- Từ canvas của tập hiện tại đọc bảng phân cảnh, đơn vị sản xuất, prompt ảnh và phạm vi tạo đã xác nhận, ví dụ `Canvas/Tập/Tập 001.json`.
- Ảnh tham chiếu lấy từ phiên bản tài sản đã xác nhận trong `Canvas/Tài sản.json`, kiểm tra trạng thái cha con nhất quán với cốt truyện của shot này.
- Node tạo, ảnh ứng viên, ảnh được chọn dùng và bản ghi nghiệm thu đều để trên canvas của tập hiện tại, giữ số shot/số đoạn.
- Khi văn bản đa tham chiếu không chọn ảnh phân cảnh, ghi lại trong tập này "Tuyến này không cần ảnh phân cảnh" và tiếp tục theo quy trình chính, không tạo tác vụ ảnh rỗng.

## Kiểm tra trước khi tạo

1. Đọc lại node thật và năng lực công cụ hiện tại, kiểm tra prompt, mẫu chọn dùng, mô hình, tỉ lệ khung, độ phân giải, số lượng đầu vào và phạm vi lần này; JSON có cấu trúc chỉ thuộc về văn bản prompt, không thành trường cấu hình node bổ sung.
2. Xác nhận từng ảnh tham chiếu thực sự đọc được, thứ tự ảnh nhất quán với dấu tham chiếu trong prompt.
3. Theo kiến thức ảnh truy ngược từng mục về phân cảnh gốc, kiểm tra khung đầu giữ trạng thái tĩnh; động tác liên tục lấy khoảnh khắc bắt đầu thật, gồm bối cảnh đã xác nhận, toàn bộ chủ thể/vật then chốt, bố cục, hướng quay và cảm xúc, không đổi biểu cảm tĩnh thành động tác chuẩn bị, không lấy trạng thái kết quả bên phải mũi tên cỡ cảnh làm khung đầu.
4. Khung cuối chỉ dùng cho chế độ khung đầu và khung cuối đã xác nhận và được mô hình hỗ trợ, kiểm tra nó nhất quán với khung đầu cùng shot và toàn bộ động tác.
5. Tham số và phạm vi đã xác nhận được dùng tiếp; mọi yêu cầu mở rộng phạm vi, thay đổi ảnh tham chiếu hoặc làm lại đều phải cho người dùng biết rõ.

Ghi phiên bản nguồn, phán đoán trạng thái bắt đầu, ánh xạ tham chiếu và các mục chưa giải quyết của lần "kiểm tra chuyển đổi ảnh" này vào ghi chú đơn vị đã có của tập này. Không được chỉ kiểm tra trong chat, cũng không cần lập canvas độc lập cho mỗi loại kiến thức.

## Thực hiện

1. Dùng công cụ node thực tế khởi động phạm vi đã ủy quyền, ghi lại node thật và thông tin tác vụ trả về.
2. Tác vụ mới chỉ khởi động thì đánh dấu "Đang tạo", không được báo cáo "Ảnh phân cảnh đã hoàn thành".
3. Theo công cụ trạng thái thời gian thực truy vấn trạng thái cuối, giữ trạng thái độc lập của mục thành công và thất bại.
4. Sau khi chuyển canvas vẫn theo bản ghi truy vấn node gốc; chuyển canvas không phải hủy, không vì thế mà khởi tạo lại cùng một tác vụ.
5. Sau khi thành công đọc lại node và ảnh đầu ra, xác nhận ảnh đã được lưu và mở được; thất bại chỉ thử lại các mục được chọn rõ ràng.

## Nghiệm thu ảnh

Xem thực tế ảnh, đối chiếu với phân cảnh tương ứng kiểm tra từng mục:

- Thân phận nhân vật, bối cảnh và đạo cụ nhất quán với tài sản đã xác nhận, không sai người, thiếu người hay thừa chủ thể.
- Chọn trạng thái cơ bản/phái sinh đúng, trang phục và khung giờ không nhảy vô lý trong cùng cảnh.
- Cỡ cảnh, góc nhìn, vị trí, hướng quay và trạng thái động tác chủ thể tương ứng với shot gốc, khung đầu không hoàn thành trước cả đoạn động tác.
- Bàn tay, che khuất, tương tác nhân vật, quyền sở hữu đạo cụ dễ hiểu, thông tin cốt truyện then chốt không bị cắt hay vẽ sai.
- Quan hệ không gian và cảm xúc giữa các shot trước sau cùng cảnh nối được, phong cách và ánh sáng không xung đột rõ với ảnh tham chiếu.
- Chủ thể và chi tiết cốt truyện then chốt rõ ràng; độ sâu trường ảnh, sương mù hoặc chất cảm hạt đã xác nhận không nên che mất thông tin cần thiết, không vì từ cấm của mẫu cũ mà xóa phong cách người dùng đã xác nhận.
- Không có phụ đề, watermark hay chữ giao diện ngoài ý muốn; chữ trong cảnh mà kịch bản yêu cầu được kiểm tra theo thiết kế tương ứng.

Với phản chiếu, đối chiếu thân phận, động tác và bộ phận nhìn thấy theo mặt gương/mặt nước và vị trí máy thực tế, không lật trái phải một cách máy móc. Khi hiện không có năng lực xem ảnh, ghi lại chờ người dùng xem trước, không dựa vào đường dẫn hay trạng thái tạo mà tuyên bố đã xem ảnh.

## Đọc lại và người dùng xác nhận

1. Gắn ứng viên thực tế và bản ghi vấn đề vào đơn vị sản xuất tương ứng, không được chỉ liệt kê danh sách thất bại trong chat.
2. Trình bày ảnh, số shot tương ứng và kết luận kiểm tra ngắn gọn, để người dùng xác nhận chọn dùng, sửa prompt, làm lại hoặc bỏ qua.
3. Ảnh thành công chưa được xác nhận chọn dùng giữ làm ứng viên, không được tự động thành đầu vào video đã nghiệm thu.
4. Sau khi người dùng quyết định, ghi tham chiếu thật của ảnh được chọn dùng, và đọc lại để xác nhận đã lưu thành công.
5. Bỏ qua shot cần khung đầu sẽ làm đầu vào video tương ứng không đầy đủ, ghi lại chờ xử lý, không được lặng lẽ chuyển sang tuyến khác.
6. Lưu danh sách hoàn thành/thất bại/bỏ qua trên canvas của tập này, dừng giai đoạn này, không tự động khởi động tác vụ video.

Chuẩn bị video tiếp theo xem [videoProduction.md](videoProduction.md), nguồn bản cũ xem [sourceMap.md](sourceMap.md).
