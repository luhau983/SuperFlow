# Phân tích tài sản phái sinh

Phân tích các biến thể hình ảnh mà kịch bản đã xác nhận hiện tại cần và các thiết kế người dùng yêu cầu bổ sung rõ ràng, không tạo ảnh ở giai đoạn này. Thao tác canvas xem [canvasOperations.md](canvasOperations.md).

## Đầu vào và nơi lưu

- Đọc kịch bản chính thức của tập đó từ `Canvas/Kịch bản.json`; đọc tài sản cơ bản, các biến thể sẵn có và trạng thái xác nhận từ `Canvas/Tài sản.json`.
- Phán đoán trực tiếp dựa trên kịch bản và mô tả tài sản, không yêu cầu kế hoạch đạo diễn cung cấp "Danh sách dự kiến phái sinh" của bản cũ.
- Danh sách phái sinh và quan hệ cha con ghi thống nhất vào `Canvas/Tài sản.json`, canvas của tập này chỉ giữ tham chiếu và ghi chú shot áp dụng.
- Tài sản cha phải thực sự tồn tại; thiếu tài sản cơ bản thì ghi lại chỗ thiếu và quay lại giai đoạn tài sản cơ bản, không bịa node cha hay lén tạo mới tài sản cơ bản.

## Nạp kiến thức trước khi thực hiện

- Đọc phần phân lớp tạo hình nhân vật, biến thể bối cảnh của [Phương pháp thiết kế tài sản](knowledge/assetDesign.md); khi gặp nhu cầu như trạng thái đạo cụ do người dùng yêu cầu bổ sung rõ ràng thì đọc thêm chương tương ứng.
- Đọc nhánh hiện tại của [Phong cách vẽ và quy tắc hình ảnh](knowledge/visualStyles.md), và đọc lại "Quy ước hình ảnh dự án", thẻ thiết kế tài sản cha và ảnh cha đã xác nhận trên canvas tài sản.
- Dùng kiến thức để chi tiết hóa "mục bất biến, mục được phép thay đổi, thay đổi kéo theo về chất liệu/ánh sáng", ghi vào canvas tài sản; có kiến thức thiết kế dùng được không đồng nghĩa với mở rộng phạm vi trích xuất mặc định trong bảng dưới.

## Phạm vi tự động trích xuất mặc định

| Loại | Có thể trích xuất | Không trích xuất |
|---|---|---|
| Nhân vật | Thay trang phục toàn bộ, hiệu ứng biến thân, thay đổi hình thái về vóc dáng hoặc cấu trúc | Biểu cảm tức thời, viền mắt đỏ lên, cận cảnh cục bộ tay mắt miệng, tư thế trong một shot |
| Bối cảnh | Biến thể theo khung giờ như cảnh ngày, cảnh đêm, sáng sớm, hoàng hôn của cùng một địa điểm | Chỉ đổi góc máy, thay đổi thời tiết, trạng thái hư hỏng |
| Đạo cụ | Quy trình này không tự động phái sinh | Mọi biến thể trạng thái đạo cụ |

Đây là ranh giới trích xuất mặc định của v1.1.8. Khi người dùng yêu cầu rõ ràng các thiết kế bổ sung như thời tiết, góc máy hoặc trạng thái đạo cụ, ghi lại nhu cầu đó và trực tiếp dùng phương pháp kiến thức tương ứng, không bị hạn chế bởi các mục loại trừ mặc định trong bảng; đã có yêu cầu rõ ràng thì không hỏi lại có cần không, chỉ xác nhận thiết kế và phương án tạo chưa xác định.
Tự động trích xuất mặc định lấy các trạng thái tài sản ổn định, dùng lại được, làm thay đổi ngoại hình nhận diện tổng thể làm chuẩn; kịch bản viết là quan trọng không có nghĩa phải tạo tài sản mới. Ảnh tham chiếu bổ sung mà người dùng đã xác nhận có thể giữ cùng thân phận và ngoại hình, chỉ thay đổi góc máy hoặc trạng thái chỉ định.
Khi cùng một trạng thái đã có ảnh xác nhận thì ưu tiên dùng lại; đã có phiên bản chờ duyệt thì tiếp tục sửa, không tạo lặp biến thể cùng tên.
Mỗi tài sản cha thường chỉ cần 1~5 biến thể có căn cứ, khi không cần thì giữ ở số không.

## Phân tích và ghi

1. Đối chiếu từng tài sản với kịch bản và nhu cầu rõ ràng của người dùng, ghi lại cảnh gây ra thay đổi, câu chữ rõ ràng hoặc căn cứ nhu cầu.
2. Phân biệt trạng thái cơ bản và trạng thái đích, ghi rõ "khác biệt so với trạng thái cơ bản" và "đặc điểm thân phận cần giữ".
3. Khi tự động trích xuất mặc định, kiểm tra thay đổi có thể được biểu đạt bằng động tác, biểu cảm hoặc bố cục của một phân cảnh đơn lẻ không, nếu có thể thì không lập phái sinh; ảnh tham chiếu biến thể độc lập mà người dùng đã yêu cầu rõ thì làm bản nháp thiết kế theo phạm vi đó.
4. Kiểm tra các biến thể sẵn có, dùng lại hoặc sửa; chỉ thêm bản nháp cho trạng thái không có bản ghi tương ứng.
5. Ghi vào canvas tài sản thống nhất, và ghi lại tham chiếu canvas/node thật của tài sản cha, không được chỉ xuất danh sách trong chat.
6. Thực hiện thiết kế theo kiến thức tương ứng: thay trang phục ghi thay đổi thực tế của trang điểm/kiểu tóc/áo trong/áo chính/giày/phụ kiện chứ không thiết lập lại toàn bộ; khung giờ ghi thay đổi nguồn sáng, độ dài bóng và việc bật tắt đèn; trạng thái đạo cụ bổ sung ghi phản ứng chất liệu cụ thể. Ghi ngược phong cách, bảng màu, chất liệu cùng các mục khóa theo ảnh cha, sau khi xác nhận mới được dùng để tạo.

## Đầu ra kiểm chứng được

Mỗi mục gồm: tài sản cha và tham chiếu ảnh cha, tên phái sinh, loại, mục bất biến, mô tả thay đổi, thiết kế hình ảnh cụ thể, căn cứ kịch bản hoặc nhu cầu người dùng, tập/cảnh áp dụng, trạng thái ảnh.
Tên nên ngắn gọn và dễ nhận biết, ví dụ "Tên nhân vật·Đồ chiến đấu" hoặc "Sân vườn·Cảnh đêm"; giữ quan hệ truy ngược được với tài sản cha.
Mô tả dùng "Khác biệt so với trạng thái cơ bản · Đặc điểm hình ảnh đích", tránh viết mở rộng thân phận nhân vật hoặc thiết lập thế giới không có căn cứ.
Khi ảnh cha chưa xác nhận hoặc không đọc được có thể lưu bản nháp thiết kế, nhưng không được đánh dấu là có thể tạo, cũng không được tuyên bố có ảnh tham chiếu dùng được.
Khi không có biến thể đủ điều kiện, ghi "Không cần thêm phái sinh" và phạm vi đã kiểm tra vào canvas tài sản, đồng thời đồng bộ tiến độ của tập này.

## Đọc lại và xác nhận

1. Đọc lại canvas tài sản, kiểm tra số lượng thêm mới/dùng lại lần này, tham chiếu tài sản cha, căn cứ kịch bản và trạng thái ảnh.
   Đồng thời kiểm tra thiết kế dùng tiếp đúng quy ước phong cách vẽ: thay trang phục không đổi mặt, đổi khung giờ không đổi địa điểm; biểu hiện phương tiện, chất liệu và thay đổi trạng thái tương xứng, biến thể bổ sung có căn cứ xác nhận riêng.
2. Trình bày ba loại kết quả thêm mới, dùng lại, chờ bổ sung đầu vào, nói rõ ảnh chưa được tạo.
3. Để người dùng xác nhận toàn bộ, một phần, sửa hoặc bỏ qua; biến thể bị bỏ qua không được tiếp tục dùng làm tham chiếu ảnh khả dụng.
4. Ghi phạm vi xác nhận ngược vào canvas tài sản và tiến độ của tập này, dừng giai đoạn này.
5. Về sau theo [generateAssets.md](generateAssets.md) tạo tập con đã xác nhận; không tự động khởi tạo tác vụ.

## Bàn giao sau khi tạo một phần hoặc bỏ qua

Ghi rõ từng mục "trạng thái cốt truyện cần có, ảnh khả dụng hiện có, lựa chọn của người dùng, tập/cảnh bị ảnh hưởng, trạng thái về sau", không được chỉ để lại hai chữ "Đã bỏ qua".

- Đã có ảnh chọn dùng ở trạng thái phù hợp: dùng lại trực tiếp, và ghi lại nguồn thực tế, không tạo mới nữa.
- Chỉ có trạng thái cơ bản mà không có trạng thái cần thiết: giữ yêu cầu cốt truyện như thay trang phục, cảnh đêm và bản ghi chưa tạo, không được đem ảnh cơ bản giả làm ảnh phái sinh. Phân cảnh vẫn có thể viết bản nháp văn bản đầy đủ, nhưng các shot bị ảnh hưởng đánh dấu là "Chờ tư liệu/Chờ xác nhận phương án", không được vào bước tạo media tương ứng hay tuyên bố cả tập có thể sản xuất.
- Khi người dùng muốn dùng tiếp ảnh hiện có để tiếp tục, đề xuất phương án thay thế cụ thể, nói rõ cách giữ cốt truyện gốc và trạng thái hình ảnh; chỉ khi phương án đó được xác nhận và mô hình hiện tại thực sự đáp ứng được mới cập nhật các phân cảnh liên quan và tham chiếu thực tế. Không tự động xóa thay trang phục/cảnh đêm, cũng không diễn giải "bỏ qua tạo" thành đã đồng ý hạ cấp hình ảnh.
- Các shot không bị chỗ thiếu ảnh hưởng có thể tiếp tục theo tập con người dùng đã xác nhận; cả tập ghi là hoàn thành một phần, giữ lại phạm vi chưa giải quyết. Khi người dùng chưa ủy quyền lại, không vì khâu sau đọc thấy chỗ thiếu mà khởi tạo lại các tác vụ phái sinh đã bỏ qua.

Cách xử lý xung đột với prompt quyết định của bản cũ và nguồn xem [sourceMap.md](sourceMap.md).
