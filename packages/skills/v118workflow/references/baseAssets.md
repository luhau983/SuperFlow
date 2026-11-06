# Danh sách tài sản cơ bản

Giai đoạn này trích xuất nhân vật, bối cảnh và đạo cụ từ kịch bản đã xác nhận, lập danh sách tài sản duy nhất cho toàn dự án; không tự động tạo ảnh.

## Đầu vào

- Các node kịch bản đã xác nhận được đưa vào lần này, cùng số tập và số cảnh tương ứng.
- Tài sản, tên chuẩn, tên khác, thiết lập hình ảnh và trạng thái xác nhận đã có trên canvas tổng tài sản.
- Phong cách vẽ, thời đại, tỉ lệ khung đã xác nhận và tham chiếu nhân vật hoặc bối cảnh do người dùng cung cấp.

## Nạp kiến thức trước khi thực hiện

- Đọc phần "Căn cứ thiết kế và ghi chép trên canvas" của [Phương pháp thiết kế tài sản](knowledge/assetDesign.md), rồi đọc chương nhân vật, bối cảnh hoặc đạo cụ theo loại cần trích xuất.
- Đọc quy tắc chung và mục phong cách vẽ đã xác nhận hiện tại của [Phong cách vẽ và quy tắc hình ảnh](knowledge/visualStyles.md); khi chưa chọn phong cách vẽ thì trước tiên đưa ra các phương án có khác biệt, không mặc định một kiểu thẩm mỹ nào.
- Ghi phương tiện, bảng màu, ranh giới tạo hình nhân vật, nguồn sáng bối cảnh, cách biểu đạt chất liệu cụ thể thành "Quy ước hình ảnh dự án" trên canvas tài sản; không được chỉ đăng ký một cái tên phong cách vẽ.

## Phương pháp thực hiện

1. Theo [Thao tác canvas](canvasOperations.md) đọc lại canvas kịch bản và canvas tổng tài sản, trước tiên nhận diện tài sản hiện có, sau đó bổ sung mục mới.
2. Nhận diện từng cảnh các nhân vật, địa điểm thực sự xuất hiện và các đạo cụ có chức năng cốt truyện hoặc hình ảnh độc lập.
3. Với nhiều cách gọi của cùng một nhân vật thì thống nhất tên, đăng ký tên khác; các thực thể khác nhau trùng tên phải phân biệt rõ, không được chỉ dựa vào chuỗi ký tự mà gộp.
4. Mô tả nhân vật mới gồm ngoại hình, trang phục và khí chất đã biết; các thông tin đã rõ như giới tính thì trung thành với kịch bản, thông tin chưa biết đánh dấu là chờ định.
5. Mô tả bối cảnh gồm không gian, ánh sáng, bày trí cố định và tông màu; các trạng thái như ngày đêm của cùng một địa điểm trước tiên đăng ký là nhu cầu biến thể, không lập lặp tài sản cơ bản.
6. Mô tả đạo cụ gồm hình dạng, màu sắc, chất liệu, kích thước hoặc hiệu ứng đặc biệt; bày trí cố định và đồ thông dụng chỉ liệt kê riêng khi ảnh hưởng độc lập tới cốt truyện.
7. Mỗi mục ghi tập xuất hiện, số cảnh và nguồn kịch bản; cùng một tài sản dùng lại xuyên tập, kịch bản mới chỉ bổ sung liên kết và nhu cầu biến thể cần thiết.
8. Các lựa chọn ngoại hình chưa có căn cứ liệt kê thành đề xuất thiết kế, chờ xác nhận; không được coi phỏng đoán là sự thật đã định của kịch bản.
9. Bổ sung đủ thẻ thiết kế theo kiến thức cho từng mục: nhận diện cốt lõi, cách trình bày, sự thật và đề xuất, phạm vi áp dụng; nhân vật tránh trùng mặt, bối cảnh có bố cục đọc được, đạo cụ có cấu trúc và chức năng đọc được. Ở đây chỉ viết thiết kế, không khởi tạo việc tạo ảnh.

## Ghi vào canvas tổng tài sản

Vị trí mặc định là `Canvas/Tài sản.json` trong workspace, toàn dự án chỉ duy trì một canvas tổng tài sản này.

- Node "Chỉ mục tài sản cơ bản" ghi phân loại, tên, phạm vi xuất hiện và định vị node tài sản thực tế.
- Lưu các node mô tả tài sản theo nhóm nhân vật, bối cảnh, đạo cụ; mỗi tài sản cơ bản có một bản ghi duy nhất, có thể tham chiếu lâu dài.
- Quy ước hình ảnh dự án và mỗi quyết định thiết kế đều lưu trên canvas tổng tài sản, tài sản tham chiếu cùng một phiên bản quy ước; ghi riêng sự thật kịch bản, tham chiếu của người dùng và đề xuất chờ xác nhận.
- Tài sản đã có thì cập nhật quan hệ xuất hiện tại chỗ, giữ thiết lập hình ảnh đã xác nhận; không được vì tập mới vào mà lập lại cùng một tài sản.
- Canvas kịch bản lưu định vị nguồn của danh sách tài sản; canvas sản xuất mỗi tập chỉ đăng ký các tham chiếu của tập đó, không sao chép phiên bản chính độc lập.
- Mọi định vị node dùng giá trị trả về thực tế của công cụ, và đọc lại kiểm tra theo [Thao tác canvas](canvasOperations.md).

Danh sách tối thiểu gồm:

| Tên chuẩn/tên khác | Loại | Mô tả hình ảnh và căn cứ | Tập/cảnh xuất hiện | Nhu cầu biến thể | Trạng thái xác nhận |
|---|---|---|---|---|---|
| Tên thực thể duy nhất | Nhân vật/Bối cảnh/Đạo cụ | Đặc điểm đã biết và mục chờ định | Định vị kịch bản thật | Ngày đêm, thay trang phục, v.v. | Chờ xác nhận/Đã xác nhận |

## Cổng chất lượng và xác nhận

- Toàn bộ danh sách đều đến từ kịch bản đã xác nhận lần này; không liệt kê bản thân văn bản cốt truyện là tài sản, cũng không bịa ra tài sản chưa xuất hiện.
- Nhân vật, bối cảnh, đạo cụ cốt truyện then chốt không bị bỏ sót; tên khác đã được quy về, các thực thể khác nhau trùng tên không bị gộp nhầm.
- Tài sản cơ bản và nhu cầu biến thể phân biệt rõ; mô tả phục vụ được thiết kế hình ảnh phía sau, sự thật đã biết và đề xuất tách riêng.
- Đã áp dụng kiến thức phong cách vẽ tương ứng; chất liệu và cách trình bày của nhân vật, bối cảnh, đạo cụ không trộn các phương tiện loại trừ nhau, quyết định hình ảnh có nội dung cụ thể để xác nhận.
- Tập xuất hiện, số cảnh và node kịch bản truy ngược được; tài sản đã có được dùng lại và không mất thiết lập đã xác nhận.
- Sau khi ghi, đọc lại chỉ mục và các node tài sản, kiểm tra số lượng, phân loại, mục trùng lặp và liên kết xuất hiện.
- Trình bày tài sản mới, tài sản dùng lại, nhu cầu biến thể và thiết kế chờ định, chờ người dùng xác nhận rõ ràng.
- Khi người dùng sửa cục bộ chỉ cập nhật tài sản liên quan và kiểm tra các tập bị ảnh hưởng, không lập lại toàn bộ kho tài sản.

Sau khi xác nhận vào [Sản xuất ảnh tài sản](generateAssets.md); xác nhận danh sách không đồng nghĩa với ủy quyền tạo ảnh hay nghiệm thu ảnh đạt.

## Căn cứ bản cũ

`scriptAssetExtraction` trong `src/routes/script/extractAssets.ts`, `src/lib/initDB.ts` và `src/lib/fixDB.ts`.
