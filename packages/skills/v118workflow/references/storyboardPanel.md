# Đưa bảng phân cảnh thành node trên canvas

Đầu vào là bảng phân cảnh đã xác nhận, đầu ra là các đơn vị sản xuất có thể kiểm tra trên canvas của tập hiện tại; giai đoạn này không khởi động tác vụ ảnh hay video.
Công cụ node và trường cụ thể xem [canvasOperations.md](canvasOperations.md), không được sao chép XML bảng phân cảnh cũ.

## Điều kiện tiên quyết

- Từ canvas của tập hiện tại đọc lại kế hoạch đạo diễn, bảng phân cảnh và bản ghi xác nhận sau khi xác nhận, ví dụ `Canvas/Tập/Tập 001.json`.
- Từ `Canvas/Tài sản.json` kiểm tra tài sản được chọn dùng và ảnh thật, khi cần rà lại lời thoại chính thức thì quay về `Canvas/Kịch bản.json`.
- Đọc năng lực mô hình và node thời gian thực, xác nhận hiện tại chọn dùng tuyến văn bản đa tham chiếu hay khung đầu; không bắt buộc chọn theo một thương hiệu cố định.
- Mô hình, tham số và phạm vi đã xác nhận giữ hiệu lực; thay đổi tuyến phải trước tiên nói rõ ảnh hưởng tới số lượng node và đầu vào rồi xác nhận.
- Khi phân cảnh có mục "Chờ tư liệu/Chờ xác nhận phương án", chỉ lập đơn vị có thể thực thi cho tập con mà người dùng đã xác nhận và phụ thuộc đầy đủ, giữ nguyên từng số shot/số đoạn gốc; các mục chưa giải quyết giữ văn bản đầy đủ và bản ghi chỗ thiếu, không tính là bảng đã hoàn thành. Khi bất kỳ shot cần thiết nào trong đoạn đa tham chiếu bị chặn, cả đoạn chờ xử lý, không được xóa shot đó rồi tạo các shot còn lại.

Đọc kiến thức theo tuyến rồi mới chuyển thành node: tuyến A đọc phần chọn chế độ và ràng buộc chung của [Chế độ video và mẫu](knowledge/videoPromptCraft.md), xác minh đoạn đã xác nhận có thể được chế độ hiện tại đáp ứng; tuyến B đọc đầy đủ [Kiến thức prompt ảnh phân cảnh và khung đầu](knowledge/imagePromptCraft.md), theo mô hình ảnh thực tế chọn mẫu chính văn đoạn văn tiếng Việt hoặc JSON tiếng Anh. Cả hai tuyến đều dùng phần không gian và tính liên tục của [Kiến thức shot](knowledge/shotCraft.md) để kiểm tra sự tiếp nối; phong cách chỉ lấy mục đã xác nhận của [Phong cách hình ảnh](knowledge/visualStyles.md). Giai đoạn này chỉ chuẩn bị node và ghi chú, không vì đọc thấy mẫu tạo mà khởi động tác vụ.

## Tuyến A: Văn bản đa tham chiếu

1. Mỗi đoạn đã xác nhận lập một đơn vị sản xuất video, giữ thứ tự đoạn và thời lượng định sẵn ban đầu, không gộp hay tách lại; khi mô hình/chế độ không đáp ứng được đoạn nhiều shot ban đầu thì quay lại xác nhận phân cảnh/chế độ, không được ép đổi sang Seedance hoặc xóa shot.
2. Lưu toàn bộ văn bản shot, lời thoại, hiệu ứng âm thanh và trình tự thời gian của đoạn đó trong ghi chú đọc được; không được dùng tóm tắt thay cho phân cảnh gốc.
3. Tham chiếu các ảnh tài sản đã xác nhận của đoạn đó, và chuẩn bị các đầu vào tham chiếu khác theo mức hỗ trợ của mô hình; không phải tài sản nào cũng bắt buộc tải lên.
4. Sự nối tiếp giữa các đoạn cùng cảnh chọn dùng trạng thái kết thúc/bắt đầu của bảng phân cảnh đã xác nhận; khi đổi cảnh không gán thêm động tác liên tục vô căn cứ.
5. Không bắt buộc tạo ảnh phân cảnh; chỉ khi người dùng chọn rõ ràng và mô hình hỗ trợ cách tham chiếu tương ứng mới chuẩn bị thêm.

## Tuyến B: Khung đầu

1. Mỗi shot đã xác nhận lập một đơn vị sản xuất video độc lập, thứ tự số shot và thời lượng mỗi shot nhất quán với bảng phân cảnh.
2. Chuẩn bị node ảnh khung đầu cho shot đó: khoảnh khắc tĩnh giữ theo mô tả gốc, động tác liên tục lấy khoảnh khắc bắt đầu thật, không được đổi hết các trạng thái sẵn có như đứng, nhìn chăm chú, cười lạnh thành "sắp xảy ra"; ghi chú video giữ toàn bộ quá trình động tác.
3. Cỡ cảnh phức hợp như "Toàn cảnh→Cận cảnh" lấy cỡ cảnh bắt đầu làm khung đầu, không được vẽ thẳng trạng thái kết quả làm khung đầu.
4. Dùng mẫu đầy đủ cho mô hình áp dụng trong kiến thức ảnh để ghi prompt, giữ từng mục chủ thể hình ảnh, vật then chốt, quan hệ không gian, hướng quay, cảm xúc và bối cảnh, gắn đầu vào ảnh thực tế của tài sản đã xác nhận. Nanobanana JSON là chính văn prompt, không được coi role/shot/negative v.v. trong đó là tham số công cụ node.
5. Chỉ khi mô hình hiện tại hỗ trợ khung đầu và khung cuối và người dùng chọn chế độ đó mới chuẩn bị khung cuối; không mặc định mỗi shot thêm tác vụ khung cuối.

## Quy tắc tham chiếu và prompt

- Mỗi dấu tham chiếu tương ứng với một đầu vào media thực tế, số thứ tự của ảnh, video hoặc âm thanh lấy theo thứ tự đầu vào thật của node hiện tại làm chuẩn; `@ảnhN` không phải cú pháp chung của mọi mô hình.
- Khi thiếu ảnh, trước tiên sửa đầu vào hoặc xác nhận lại phạm vi tham chiếu, không được xóa một ảnh nào đó mà vẫn giữ số thứ tự bị lệch.
- Vị trí đứng và hướng quay của nhân vật trong cùng cảnh liên tục theo mô tả phân cảnh đã xác nhận; thay đổi cần thiết phải có căn cứ tự sự hoặc động tác.
- Prompt ảnh phân cảnh không mang lời thoại và hiệu ứng âm thanh, nhưng ghi chú video của đơn vị này phải giữ chúng đầy đủ.
- Phong cách và ánh sáng mà ảnh bối cảnh đã đảm nhận giữ nhất quán, không đưa thêm thiết lập xung đột.
- Node đầu vào và node tạo giữ quan hệ rõ ràng, tránh nhầm thẻ ghi chú thành tác vụ tạo đã cấu hình.

## Đầu ra kiểm chứng được

Trên canvas của tập này nhìn thấy được số shot/số đoạn, văn bản phân cảnh gốc, thời lượng, tuyến, tham chiếu tài sản thật và node chờ tạo của mỗi đơn vị.
Số đơn vị video của văn bản đa tham chiếu bằng số đoạn được xác nhận lần này và phụ thuộc đầy đủ; số đơn vị video của tuyến khung đầu bằng số dòng shot được xác nhận lần này và phụ thuộc đầy đủ. Liệt kê riêng tổng số kế hoạch ban đầu và số chờ xử lý; chỉ khi bao phủ toàn bộ mới bằng số đoạn/số dòng shot của cả tập.
Các đơn vị cần ảnh có prompt chỉnh sửa được và đầu vào tham chiếu thật; các đơn vị không cần ảnh đánh dấu rõ lựa chọn đó.
Ghi chú tập này của mỗi đơn vị đồng thời lưu: lý do chọn mẫu/chế độ, phán đoán ngữ nghĩa khung đầu hoặc khung cuối, cỡ cảnh và trạng thái bắt đầu, chuẩn/thay đổi không gian cùng cảnh, thứ tự tham chiếu thật và ánh xạ mục đích. Phân cảnh gốc đầy đủ và âm thanh giữ trong ghi chú đọc được; bước chuẩn bị video sau đó mới viết prompt thực thi video đầy đủ của chế độ đó.
Bố cục sắp theo thứ tự đọc và sản xuất, tài sản vẫn lưu trên canvas tài sản thống nhất, không được lập kho tài sản chính thức thứ hai.

## Đọc lại và xác nhận

Đọc lại các node thực tế, kiểm tra từng mục số lượng, số shot/số đoạn, thời lượng, thứ tự tham chiếu và các trường công cụ đã được lưu đúng chưa.
Trình bày canvas của tập hiện tại, tuyến chọn dùng và phạm vi tạo dự kiến, chờ người dùng xác nhận đơn vị sản xuất và prompt.
Sau khi xác nhận, ghi trạng thái và dừng; cần ảnh phân cảnh thì vào [storyboardImages.md](storyboardImages.md), nếu không thì vào chuẩn bị video.
Các trường còn sót của bảng phân cảnh cũ và khác biệt chế độ xem [sourceMap.md](sourceMap.md).
