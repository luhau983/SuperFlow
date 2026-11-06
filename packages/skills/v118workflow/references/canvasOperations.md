# Thực thi canvas

Mọi thao tác lấy công cụ và schema node thực sự được cung cấp trong lượt này làm chuẩn. Dưới đây là cách dùng đã được kiểm tra của host hiện tại; khi thiếu công cụ thì nói rõ mục thiếu, không coi XML bản cũ, cơ sở dữ liệu cũ hay JSON canvas viết tay là đường thực thi thay thế.

## Đọc và định vị

1. `getCanvas({ include: ["canvases"] })` liệt kê canvas, theo kết quả phân trang khớp ID thật trong chỉ mục dự án. ID liên quan tới đường dẫn tệp, không đoán ID theo tiêu đề; dùng năng lực đọc tệp/liệt kê thư mục để kiểm tra đường dẫn tương đối thật.
2. Chỉ thao tác được trên canvas đang kích hoạt/được gắn trong lượt này. Sang canvas khác thì trước tiên `switchCanvas({ canvasId })`, chờ lưu và dùng ID mới trả về; `canvasId` của năm công cụ đọc là mục tiêu kiểm định, không được dùng nó để đọc trực tiếp canvas chưa kích hoạt.
3. Dùng `findCanvasNodes` tra node đã có; khi đã biết ID thì trực tiếp `getCanvasNodes({ nodeIds, fields: ["label", "data", "outputs", "ports"] })`. Chi tiết node mỗi lần tối đa 20 cái, tránh kéo cả đồ thị.
4. `hasMore/nextCursor` nghĩa là tiếp tục cùng truy vấn. `truncated` của giá trị node cần đọc từng đoạn theo `path/nextOffset` trả về, không được coi kịch bản hay prompt bị cắt cụt là toàn văn. Văn bản dài có thể dùng `path: ["outputs", "text", "value"]` và offset trả về để đọc tiếp, lấy đầu ra node thực tế làm chuẩn.

Sau khi công cụ tạo/chuyển thành công, các lệnh gọi tiếp theo trong lượt này được chuyển hướng sang canvas trả về. Khi người dùng tự sửa dự án, di chuyển tệp hoặc tải lại khiến ngữ cảnh mất hiệu lực, ngừng dùng tiếp ID cũ, nhờ họ gửi lại tin nhắn ở canvas đích. Hiển thị chuyển đổi bình thường không đồng nghĩa với hủy tạo, vẫn cần truy vấn trạng thái thật.

## Tạo và lưu trữ canvas

`addCanvas({ name: "Kịch bản" })` tạo canvas trống và chuyển sang nó, cách cài đặt hiện tại ghi ở **thư mục gốc workspace**. Tên không kèm `.json`, không được chứa ký tự phân cách đường dẫn; không có tham số `path/directory`. `renameCanvas` chỉ đổi tên, không chuyển được vào thư mục con, và sau khi đổi tên ID thay đổi.

Các công cụ workspace tích hợp hiện tại có năng lực đọc, liệt kê thư mục, ghi văn bản, v.v., nhưng không cung cấp công cụ di chuyển thư mục được host canvas phối hợp. `workspaceFiles.rename` gốc của MCP cũng không đồng nghĩa với di chuyển trong cây tệp: canvas đã chuyển đi có thể vẫn còn trong bộ nhớ, đổi tên tệp trực tiếp sẽ không đồng bộ ID/thực thể lưu của nó. **Cấm dùng di chuyển tệp gốc, shell hoặc ghi JSON trực tiếp để vượt qua host canvas.**

Quy trình đáng tin cậy:

1. Tra trùng rồi tạo các canvas trống giai đoạn này cần, ghi lại tệp thư mục gốc và ID mà công cụ trả về.
2. Trình bày danh sách lưu trữ cụ thể, ví dụ `Kịch bản.json → Canvas/Kịch bản.json`, `Tài sản.json → Canvas/Tài sản.json`, `Tập 001.json → Canvas/Tập/Tập 001.json`.
3. Nếu lượt này thực sự có năng lực lưu trữ công khai và phối hợp rõ ràng thực thể/trạng thái lưu của canvas, thao tác theo schema của nó và kiểm chứng; khi công cụ tích hợp hiện tại không có năng lực này, nhờ người dùng tạo thư mục mới từ menu thả xuống canvas ở góc trên bên trái, chọn "Di chuyển tới" trong menu "Thêm" hoặc menu chuột phải của canvas, rồi mở canvas đích của giai đoạn này và trả lời đã xong. Thao tác cây tệp sẽ chờ lưu và đồng bộ đường dẫn canvas.
4. Liệt kê lại thư mục, truy vấn danh sách canvas, đăng ký đường dẫn và ID thật sau khi di chuyển, rồi mới ghi node. Chưa kiểm chứng đã về đúng chỗ thì giữ trạng thái khởi tạo chưa hoàn thành, không tạo nội dung chính thức tạm thời hay lén quay về bố cục thư mục gốc.

Canvas đã về đúng chỗ thì dùng lại trực tiếp, không lập thêm một bộ cho quy trình này. Khi người dùng chỉ định rõ thư mục khác thì ghi lại cấu trúc thực tế; không coi `references/` của tài liệu skill là thư mục dự án.

## Thêm và điền node

Chỉ khi cần node mới mới gọi `getCanvas({ include: ["nodeTypes"] })`, lấy loại thật từ `availableNodeTypes`; dùng `addNode({ type, position: { x, y }, label })` để tạo và lưu ID node trả về.

Trước tiên `getNodeTools({ nodeIds: [nodeId] })` đọc định nghĩa hàm đầy đủ, rồi `nodeTools({ nodeId, name, args })`. Giữ tiền tố `node:` trả về, tham số điền theo schema của hàm đó. Các năng lực thường gặp hiện tại như sau, không được giả định node bên thứ ba cũng có các hàm này:

| Mục đích | Hàm dùng sau khi khám phá |
| --- | --- |
| Kịch bản, phương án, nhật ký giai đoạn | Node văn bản `node:setText`; đọc lại qua đầu ra văn bản, không được chỉ sửa nhãn |
| Tham chiếu ảnh cùng workspace | Node tư liệu ảnh `node:setImage`, truyền `path` workspace thật và `mimeType` khớp |
| Prompt ảnh/video | Node tạo tương ứng `node:setPrompt` |
| Cấu hình và năng lực mô hình | `node:getConfig`, `node:setConfig`; sau khi thay đổi kiểm tra lại cấu hình |
| Khởi tạo và theo dõi việc tạo | Ảnh `node:generateImage`, video `node:generateVideo`, trạng thái `node:getGenerationStatus`; chỉ gọi khi node đó thực sự cung cấp |

Tham số của hàm văn bản gốc là `{ text: "Toàn bộ chính văn" }`, hàm prompt là `{ prompt: "Prompt chuyên dụng" }`. Phản hồi của `node:setText` không chứa đường dẫn tệp; khi cần định vị tệp chính văn thì đọc `data.textPath` thực tế. Truy vấn năng lực mô hình qua `node:getConfig` của node tạo đã có; khi tạo vẫn phải kiểm tra cấu hình thực tế của node đích. `providerId/modelId` trong cấu hình đặt theo cặp, `mode`, thời lượng và độ phân giải dùng giá trị mà phản hồi thời gian thực hỗ trợ, không tự ghép tên chế độ.

Sau khi xác nhận kết quả ghi, khi cần thì `fitCanvas({ nodeIds })`. Quy trình cục bộ chỉ sắp xếp các node của lô này, không tự động chỉnh lý toàn bộ canvas của người dùng; `arrangeCanvas` là chỉnh lý toàn đồ thị, không nhận phạm vi node cục bộ.

## Dùng lại tài sản xuyên canvas

Canvas tổng tài sản là nguồn duy nhất của thiết lập chính thức và phiên bản được chọn dùng. Trong từng tập chỉ lập tham chiếu tư liệu dùng cho việc nối dây:

1. Chuyển sang canvas tài sản, đọc `outputs` thực tế của node tài sản đã xác nhận, lấy đường dẫn workspace của ảnh được chọn dùng (thường ở `outputs.image.value.url`) và MIME. Ghi lại đường dẫn/ID canvas nguồn, ID node tài sản, phiên bản, số tập sử dụng; mã tài sản của workflow chỉ là chỉ mục văn bản, không được giả làm ID node thật.
2. Chuyển về tập đích, tìm tham chiếu đã có cùng nguồn/phiên bản. Khi cần tạo mới thì thêm node tư liệu ảnh, rồi theo schema thực tế gọi `node:setImage({ path, mimeType })`, tham chiếu cùng một tệp, không tạo lại hay sao chép thiết lập chính thức.
3. Đọc lại đầu ra ảnh của node tham chiếu trong tập này, xác nhận đường dẫn tương ứng với phiên bản đã chọn. Ghi trong chỉ mục văn bản của tập này "Tên tài sản chuẩn → Canvas tài sản/node nguồn → Node tham chiếu tập này → Đường dẫn tệp".
4. Tư liệu bên ngoài trước tiên dùng năng lực nhập công khai của host. Nếu `import` từ thư viện toàn cục qua `assetOperator`, dùng **`workspacePath`** trả về làm đầu vào node; `path` trả về là nguồn thư viện toàn cục, không được dùng lẫn. Khi người dùng không yêu cầu chia sẻ toàn cục thì không tạo thêm bản sao thư viện toàn cục.

Kịch bản cũng vậy: văn bản chính thức chỉ duy trì trên canvas tổng kịch bản; ảnh chụp làm việc của từng tập phải ghi node nguồn, phiên bản và phạm vi. Sửa cốt truyện cục bộ phải quay về kịch bản chính thức xác nhận, rồi cập nhật các ảnh chụp làm việc bị ảnh hưởng.

## Nối dây và thứ tự tham chiếu

Dùng `ports` của `getCanvasNodes` để lấy cổng thật, `connectNodes({ connections: [{ source, sourceHandle, target, targetHandle }] })` chỉ kết nối cổng đầu ra với cổng đầu vào trong canvas này. Dùng `getCanvasEdges` đọc lại kết nối, không được tham chiếu node nguồn xuyên canvas để tạo cạnh.

Kết nối media thực sự dùng lần này, rồi kiểm tra chuỗi đầu vào thật của đích, theo ánh xạ `{{ref N}}` thực tế để viết prompt. Thứ tự của node tạo gốc hiện tại có thể kiểm chứng như sau: đọc toàn bộ cạnh vào của đích, lọc theo cổng đích thực tế; với mỗi cạnh đọc `outputs[sourceHandle]` của node nguồn, dùng `encodeURIComponent(JSON.stringify([sourceId, sourceHandle]))` để có khóa tham chiếu, sắp xếp theo `data.referenceOrder[targetHandle]` của đích, các mục chưa đăng ký giữ thứ tự cạnh vào và nối thêm vào sau. Các loại media khác nhau dùng chung số thứ tự của chuỗi đầu vào đó, mục chưa sẵn sàng vẫn chiếm chỗ và chặn việc tạo.

Chỉ dùng schema của năng lực điều chỉnh thứ tự khi công cụ thực tế cung cấp; không được chỉ sửa số thứ tự trong prompt mà không sửa tham chiếu thực tế. Tham chiếu bị thiếu không được lặng lẽ lọc bỏ rồi tiếp tục dùng số thứ tự cũ. Node câu chuyện/kịch bản đầy đủ dùng để duyệt, không nối kịch bản dài vào đầu vào ảnh/video thay cho prompt chuyên dụng; node tạo hiện tại sẽ nối toàn văn văn bản STRING được kết nối vào prompt.

## Tạo và nghiệm thu

Trước khi tạo, đọc lại cấu hình thực tế, prompt, đường dẫn và thứ tự tham chiếu, kiểm tra lô hiện tại đã được xác nhận. `node:generateImage` / `node:generateVideo` trả về `{ status: "generating" }` chỉ có nghĩa là đã khởi động; truy vấn qua `node:getGenerationStatus` của node đó, trạng thái là `idle/running/succeeded/failed`, đồng thời trả về `outputs` và `error` nếu có. Sau khi hoàn thành mới đọc đầu ra thật và xem media. Khi không có hàm trạng thái thì kiểm chứng theo đầu ra thật khả dụng hoặc giao diện, không được đoán giao diện API.

Trạng thái có thể chỉ thuộc về phiên kể từ khi mở node lần này. Sau khi tải lại, `idle` không chứng minh chưa từng tạo, đầu ra lịch sử tồn tại cũng không chứng minh tác vụ lần này thành công; phán đoán bằng cách kết hợp trạng thái tác vụ, thời gian bắt đầu/kết thúc, đường dẫn đầu ra, yêu cầu hiện tại và bản ghi chọn dùng. Sau khi quá thời gian, trước tiên truy vấn trạng thái, tránh khởi tạo lặp; thất bại thì giữ phiên bản đã chọn dùng trước đó, báo cáo thất bại cụ thể, không coi ảnh cũ video cũ là kết quả mới.

Chỉ báo cáo các cấp đã được xác minh: prompt sẵn sàng, đang tạo, tạo thành công chờ duyệt, đã chọn dùng, bàn giao đoạn hoặc bàn giao thành phẩm. Khi không có việc ghép thực tế và tệp thành phẩm, không được tuyên bố đã hoàn thành toàn phim.
