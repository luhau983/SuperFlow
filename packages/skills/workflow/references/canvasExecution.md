# Thực thi canvas

> **Ranh giới sử dụng với Seedance:** File này chỉ phụ trách canvas và việc thực thi tham số/tham chiếu mô hình thực tế, không tham gia sáng tác prompt Seedance. Chỉ cần đã có kịch bản/timeline có thể thực thi và mục tiêu đi vào sản xuất/tạo/sửa đổi video, phải trước tiên qua "khóa định tuyến Seedance" của `SKILL.md` chính để vào PART A nhúng; **không được coi năm công cụ đọc canvas, `node:getConfig` của node hay việc hỏi cấu hình là bước vào cửa trước Seedance.** Prompt chính thức phải do PART A lập kế hoạch/chốt trước; file này không được chia đoạn lại, viết lại định dạng A9.1/A9.2, thay thế Timeline, bổ sung quy tắc diễn xuất/chuyển động máy/tính liên tục. Câu trả lời của người dùng cho các câu hỏi cấu hình như tỉ lệ khung, độ phân giải, chế độ, âm thanh chỉ bổ sung tham số cho tác vụ Seedance hiện tại, không gỡ bỏ hay đặt lại định tuyến Seedance.

Chỉ dùng các công cụ thực tế được cung cấp trong lượt này để thao tác canvas Toonflow hiện tại. Bên dưới là hợp đồng hiện hành; `parameters` thời gian thực là căn cứ gọi, ví dụ cũ trong tài liệu host không ghi đè nó. Quy trình sản xuất xem file vào cửa, ghi nhận phiên bản và kết quả xem [trạng thái và giao nộp](stateAndDelivery.md).

## Khám phá và ràng buộc

`getCanvas({})` chỉ trả về tổng quan canvas đang kích hoạt; khi cần loại hoặc danh sách canvas thì truyền `include: ["nodeTypes"]` hoặc `["canvases"]`. Dùng `findCanvasNodes` để định vị mục tiêu theo tên, loại hoặc trạng thái chọn; khi đã biết ID node thì dùng thẳng `getCanvasNodes` để đọc các trường cần thiết, `getCanvasEdges` để đọc kết nối cục bộ, `getNodeTools` để khám phá hàm và schema đầy đủ. Loại node có thể mang tiền tố runtime, không hardcode.

Năm công cụ đọc canvas bị giới hạn số mục và dung lượng 64 KiB, tiếp tục phân trang theo `hasMore` / `nextCursor`; node và dây nối mỗi trang quét tối đa 2000 mục, kết quả rỗng nhưng `hasMore: true` vẫn phải tiếp tục. `totalNodes/totalEdges` là tổng lượng của canvas chứ không phải số khớp; `selectedOnly` lọc tại chỗ, không phải ảnh chụp đóng băng. Giữ nguyên tham số truy vấn ban đầu, chỉ thay con trỏ; con trỏ mất hiệu lực thì truy vấn lại. Tác vụ toàn bộ canvas xử lý theo lô, ngữ cảnh chỉ giữ lô hiện tại, tóm tắt và con trỏ. `getCanvasNodes` mặc định chỉ đọc `label/type/position`, cổng, nội dung và output phải chọn rõ `ports/data/outputs`; `dataKeys` chỉ lọc trường khi đã chọn `data`. `nodeIds` của truy vấn chi tiết và truy vấn hàm mỗi lô tối đa 20 cái, phải loại trùng trước; di chuyển, đổi tên, xóa và kết nối mỗi lô tối đa 64 mục.

`nextCursor` cấp cao nhất chỉ dùng để giữ tham số ban đầu và tiếp tục phân trang node. Khi xử lý bất kỳ `truncated` nào của node, chỉ truy vấn node sở hữu nó, dùng đường dẫn và offset của mục đó, không mang `cursor` ban đầu: `text` dùng `path` và `nextOffset` của mục đó làm `textOffset` để đọc tiếp; `entries` chuyển sang dùng `valueOffset`, không có `nextOffset` nghĩa là đường dẫn đó đã đến cuối. `depth/budget` thu hẹp phạm vi theo `path` của mục đó rồi truy vấn lại, không mang `cursor` cũ; `valueLimit` của object/mảng tối đa 100, `textLimit` của chuỗi tối đa 4000, offset dương bắt buộc chỉ định `path`. Đường dẫn tối đa 64 cấp và 2048 byte JSON UTF-8, mỗi đoạn tối đa 256 ký tự; `pathDepthLimit/pathBytesLimit/circular` không thể bổ sung đầy đủ bằng cách lặp lại yêu cầu một cách đáng tin cậy, `keyTooLong` có thể dùng `nextOffset` trả về làm `valueOffset` để bỏ qua khóa đó và tiếp tục, nhưng giá trị bị bỏ qua vẫn chưa được đọc. Không coi nội dung bị cắt là bằng chứng đầy đủ.

Mặc định dùng lại dự án hiện tại và canvas đích. Khi có sổ theo dõi sẵn thì đối chiếu ràng buộc; người dùng đã nói rõ chuyển mục tiêu thì thao tác theo ủy quyền của họ, "tiếp tục" mơ hồ mà gặp ràng buộc khác thì làm rõ trước. Sau khi tạo mới, chuyển, đổi tên thành công thì dùng ràng buộc được trả về, không dùng tiếp ID cũ.

| Công cụ | Dạng tham số hiện tại |
|---|---|
| `getCanvas` | `{include?:["canvases","nodeTypes"],cursor?,limit?,canvasId?}` |
| `findCanvasNodes` | `{query?,types?,selectedOnly?,cursor?,limit?,canvasId?}` |
| `getCanvasNodes` | `{nodeIds:[...],fields?:["label","type","position","ports","data","outputs"],dataKeys?,path?,valueOffset?,valueLimit?,textOffset?,textLimit?,cursor?,canvasId?}` |
| `getCanvasEdges` | `{nodeIds?:[...],direction?:"incoming"/"outgoing"/"both",cursor?,limit?,canvasId?}` |
| `getNodeTools` | `{nodeIds:[...],names?,cursor?,limit?,canvasId?}` |
| `addNode` | `{type, position:{x,y}, label?}` |
| `nodeTools` | `{nodeId, name:"node:<tên hàm>", args:{...}}` |
| `connectNodes` | `{connections:[{source,sourceHandle,target,targetHandle}]}` |
| `moveNodes` | `{moves:[{nodeId,position:{x,y}}]}` |
| `renameNodes` | `{renames:[{nodeId,label}]}` |
| `deleteNodes` / `deleteEdges` | `{nodeIds:[...]}` / `{edgeIds:[...]}` |
| `addCanvas` / `switchCanvas` | `{name?}` / `{canvasId}` |
| `renameCanvas` | `{canvasId?,name}` |
| `fitCanvas` / `arrangeCanvas` | `{nodeIds?}` / `{}` |

Sửa đổi hàng loạt thì tách lô theo giới hạn số lượng thực tế. `addNode` không nhận `data` tùy ý, ID chỉ định hay nội dung; dùng `node.id` trả về để truy vấn `getNodeTools`, rồi theo schema đầy đủ dùng `nodeTools` điền nội dung, biên nhận thêm mới không chứa danh sách hàm. Đừng gọi công cụ di chuyển/đổi tên dạng số ít bản cũ, không ghi trực tiếp JSON canvas.

Biên nhận ID của thao tác cấu trúc có thể bị rút gọn còn tối đa 100 mục: `arrangeCanvas` cho thêm `arrangedCount`, `fitCanvas` cho `nodeCount`, `deleteNodes` cho `removedEdgeCount`. `truncated` chỉ ảnh hưởng danh sách ID trả về, không có nghĩa chỉ hoàn thành phần xem trước, không lặp lại thao tác để lấy biên nhận đầy đủ; chuyển sang dùng công cụ chỉ đọc để đối chiếu. `nodeTools` trả về kết quả của hàm nghiệp vụ cụ thể, không chịu giới hạn 64 KiB của năm công cụ đọc nói trên.

Theo bố cục hiện có đặt nội dung, tài sản, đoạn từ trái sang phải, cùng giai đoạn xếp dọc, tránh che node của người dùng. Dùng `fitCanvas` để hiển thị thành phẩm của lượt này; `arrangeCanvas` sẽ sắp xếp toàn bộ node cấp cao nhất, chỉ gọi khi việc sắp xếp toàn canvas thuộc phạm vi người dùng. Hiện không có công cụ nhóm, không giả tạo giao diện nhóm.

## Node nội dung và tư liệu

- Văn bản dùng `node:setText({text})` mà node đó thực sự đăng ký. Sau khi thành công dùng `getCanvasNodes({ nodeIds: [ID đích], fields: ["data"], dataKeys: ["textPath"] })` đọc lại đường dẫn, đọc nội dung tương ứng để đối chiếu và ghi nhận; `setText` hiện chỉ trả về nội dung, không trả về đường dẫn. Khi cần xem nội dung trong bộ nhớ hiện tại thì dùng `path: ["outputs", "text", "value"]` của `getCanvasNodes` để đọc theo phân đoạn; JSON canvas được lưu bền không chứa phần nội dung inline này, không thể dựa vào đó để kết luận văn bản rỗng.
- Nội dung do node biên tập và lưu, không ghi trực tiếp vào `textPath` của nó để vòng qua giao diện. File trạng thái và ảnh chụp phiên bản lưu bằng công cụ file văn bản thực tế; ảnh chụp không làm bản nội dung thứ hai có thể chỉnh sửa.
- Tư liệu gắn qua `node:setImage`, `node:setVideo`, `node:setAudio` đã khám phá, hiện thường là `{path,mimeType}`. `path` dùng đường dẫn tương đối trong workspace, trỏ tới file thực sự tồn tại và đọc được trong workspace này, không được điền output dự kiến hoặc đường dẫn bên ngoài chưa nhập vào.
- Ảnh mới làm bằng node tạo ảnh, ảnh đã chọn dùng ưu tiên cố định bằng node tư liệu ảnh. Phiên bản sau dùng node tạo ứng viên mới, giữ node và kết nối đã chọn dùng; không vì tạo lại mà thay node nguồn vẫn đang được hạ nguồn tham chiếu.
- Node văn bản hiện tại không có `generateText` mà Agent gọi được, chữ do trợ lý hoàn thành rồi ghi vào. Công cụ file không đảm bảo hỗ trợ hiểu video hoặc sao chép nhị phân, ranh giới cụ thể xem [giao nộp](stateAndDelivery.md).

## Tham chiếu thực và prompt

Trước tiên dùng `ports` của `getCanvasNodes` kiểm tra ID, hướng, loại của cổng nguồn/đích, dùng `getCanvasEdges` kiểm tra kết nối đã có. Chỉ nối media được chọn dùng cho đoạn này vào node tạo, không dùng dây nối để biểu thị giai đoạn, phê duyệt hay chỉ mục phụ thuộc. Ứng viên thượng nguồn còn đang tạo hoặc chưa được chọn dùng không thể thành tham chiếu chính thức.

`prompt` của node tạo là lối vào prompt thực thi duy nhất của lần này, ghi vào qua `node:setPrompt({prompt})`. Node văn bản kịch bản hoàn chỉnh và phân cảnh giữ vai trò căn cứ nội dung, không dùng dây STRING gắn lặp lại vào node tạo nữa; cài đặt hiện tại sẽ nối toàn văn văn bản được kết nối vào cuối prompt. Tham chiếu STRING không liên quan hiện có thì gỡ bỏ trong phạm vi chỉnh sửa đã ủy quyền, nếu không thì nêu ảnh hưởng rồi tạm dừng lần tạo đó.

Khi giao diện nhà cung cấp/canvas thực sự dùng `{{ref N}}` làm tham chiếu truyền tải, `{{ref N}}` chỉ được ứng với thứ tự và loại kết nối thực tế của lần này, không được coi thứ tự trong danh sách kế hoạch là thứ tự thực. **Đây thuộc ánh xạ ở tầng thực thi, không ủy quyền viết lại các handle node/tài sản gốc trong `Reference binding` đã chốt của PART A thành một định dạng prompt hiển thị cho người dùng khác.** Hiện cần đọc dữ liệu hiện trường theo lô để khôi phục thứ tự, không tồn tại công cụ `getReferences`:

1. Dùng `getCanvasEdges({ nodeIds: [ID đích], direction: "incoming" })` đọc phân trang toàn bộ cạnh vào, giữ thứ tự trả về, lọc các cạnh của cổng đầu vào thực tế. Dùng `getCanvasNodes` chỉ định rõ `fields: ["ports", "outputs"]` để đối chiếu node nguồn theo lô, xác nhận cổng nguồn tồn tại và loại tương thích, lấy nội dung thực tế từ `outputs[sourceHandle]`, bổ sung các trường cần thiết theo thông tin bị cắt.
2. Dùng `fields: ["data"], dataKeys: ["referenceOrder"]` của `getCanvasNodes` đọc thứ tự đích. Lấy `encodeURIComponent(JSON.stringify([source,sourceHandle]))` làm khóa, sắp xếp ổn định theo vị trí trong `data.referenceOrder[cổng đích]`; mục không được liệt kê xếp cuối và giữ thứ tự cạnh vào ban đầu. Chỉ khi trường đầy đủ và thực sự không có bản ghi thứ tự mới dùng thứ tự cạnh vào hợp lệ.
3. Mục thứ N sau khi sắp xếp ứng với `{{ref N}}`, các loại khác nhau dùng chung số thứ tự. Đầu vào có output chưa sẵn sàng vẫn chiếm chỗ và chặn việc tạo, không được xóa mục rỗng rồi tiếp tục áp số. Tính tương thích loại node/cổng lấy theo runtime trả về.

Khi không lấy được đầu vào đầy đủ hoặc không chứng minh được thứ tự thì giữ bản nháp prompt và nêu các mục cần xác minh, không đoán số.

Canvas hiện tại đánh số tham chiếu thống nhất, nhưng một số bộ thích ứng nhà cung cấp tổ chức lại yêu cầu theo ảnh, video, âm thanh. Mặc định chọn dùng tài sản ảnh thực cộng phương án âm thanh gốc đã xác nhận; khi thực sự cần trộn media, phải xác minh quan hệ tương ứng giữa thứ tự canvas với mô hình/bộ thích ứng thực tế. Không chứng minh được nhất quán thì dừng ở "chờ xác nhận ánh xạ tham chiếu", nêu xung đột cụ thể; không được lặng lẽ bỏ âm thanh được chỉ định, đổi chế độ hoặc nói dối là số thứ tự đúng.

Khung đầu, khung cuối có ngữ nghĩa rõ ràng, thay đổi thứ tự có thể hoán đổi vai trò. Chỉ dùng khi người dùng chọn lộ trình đó và năng lực thực tế hỗ trợ, đối chiếu ô đầu vào cụ thể; không bắt buộc mọi đoạn trích khung cuối. Sau khi kết nối hoặc nguồn tham chiếu thay đổi thì đối chiếu lại tham chiếu và prompt, ủy quyền ban đầu không tự động bao phủ phương án thực thi đã thay đổi.

## Hỏi cấu hình không được cắt ngang Seedance

- Việc xác minh cấu hình trong file này chỉ được phép diễn ra sau khi `SKILL.md` chính đã khóa định tuyến Seedance và hoàn tất xác nhận mô hình đích A0; nếu người dùng chưa chỉ định 2.0/2.5, PART A chính phải hỏi ngắn một lần để xác nhận "Seedance 2.0 hay 2.5". Câu hỏi xác nhận mô hình này do PART A chính phụ trách, file này không được tự chọn mô hình mặc định, cũng không được hỏi lặp lại.
- Nếu host bắt buộc phải xác nhận với người dùng các tham số thực thi như `ratio`, `resolution`, `mode`, `generateAudio`, provider, thì câu hỏi và câu trả lời của người dùng đều thuộc phần bổ sung tham số thực thi của cùng một tác vụ Seedance. Sau khi trả lời tiếp tục dùng prompt PART A đã lập kế hoạch/chốt, không quay lại quy trình làm việc chung.
- Nếu trong câu trả lời cấu hình người dùng nói rõ đổi mô hình sang 2.0/2.5, đây là cập nhật đầu vào A0: quay về PART A định tuyến lại các prompt chính thức bị ảnh hưởng theo mô hình đích mới, rồi mới quay lại file này để thực thi; không được chỉ đổi mô hình ở tầng cấu hình node mà vẫn dùng vỏ prompt của mô hình khác.
- Nếu năng lực thời gian thực không hỗ trợ mô hình đích của PART A, báo xung đột năng lực; không được lặng lẽ dùng mô hình mặc định của node.

## Chuẩn bị trước khi tạo

1. Gọi `node:getConfig` của node hiện tại, xác minh mô hình khả dụng, chế độ, loại và số lượng tham chiếu, tỉ lệ khung, kích thước ảnh hoặc thời lượng/độ phân giải video, âm thanh gốc và khả năng đầu vào âm thanh. Thông số ảnh và video đánh giá riêng, không dùng tiếp giá trị mặc định không liên quan.
2. Nối xong tư liệu thực tế trước, rồi đọc chế độ khớp hiện tại. Thiết lập cấu hình qua `node:setConfig`: trường ảnh theo schema dùng `providerId/modelId/size/ratio`; video dùng `providerId/modelId/duration/resolution/ratio/mode/generateAudio`. Chỉ truyền các trường cần và được hỗ trợ, `providerId` và `modelId` cung cấp theo cặp, mode dùng giá trị thực tế trả về.
3. Ghi prompt đầy đủ, rồi đọc cấu hình và canvas, đối chiếu prompt thực tế, tham chiếu, thông số và output trước khi gọi. Thiếu tham chiếu cần thiết thì dừng lần tạo đó và tiếp tục phần văn bản; không được lặng lẽ đổi ảnh-sang-ảnh hoặc đa tham chiếu thành chế độ không tham chiếu.
4. Cố định phương án lần này: đối tượng, số lượng, prompt đầy đủ, tham số, file tham chiếu cùng mục đích/thứ tự, số lần thực thi; trình bày và dùng tiếp hoặc lấy ủy quyền cụ thể cho việc tiêu tốn credit tính toán. Khi không truy vấn được credit tính toán thì nói rõ là chưa biết, không coi Token hội thoại là mức tiêu tốn media.
5. **Rà soát ngay trước khi thực thi.** Sau khi người dùng trả lời, đọc lại canvas và cấu hình hiện tại, so sánh với phương án được ủy quyền, bao gồm node, prompt, chế độ, âm thanh, tham chiếu và số lượng. Nếu có thay đổi, dùng tiếp các đối tượng vẫn khớp; đối tượng bị ảnh hưởng thì trình bày lại khác biệt và đối chiếu ủy quyền. Đừng lấy "đã xác nhận" để thực thi cấu hình bị sửa sau đó trên giao diện.
6. Khi điều kiện tiên quyết và ủy quyền được đáp ứng, qua `nodeTools` gọi `node:generateImage` hoặc `node:generateVideo` thực tế, tham số hiện tại là `{}`. Không vòng qua canvas để chuyển sang công cụ media trực tiếp.

Đọc lại và thực thi không phải thao tác nguyên tử do host cung cấp. Sau khi rà soát mà vẫn có chỉnh sửa đồng thời, output lần này không thể quy nguồn chỉ dựa vào prompt hiện tại; giữ ảnh chụp lần thử, ghi chú căn cứ cần xác minh, không thể cam kết loại bỏ hoàn toàn race condition đồng thời.

## Trong khi tạo và đọc lại kết quả

Node gốc hiện tại sau khi khởi động trả về ngay `{status:"generating"}`; `getConfig` không cung cấp trạng thái cuối của tác vụ. Ghi lại mỗi lần thử và output cũ. Trong cùng một lô đã ủy quyền, các node khác nếu không phụ thuộc kết quả đang chờ tạo thì có thể tiếp tục đối chiếu và khởi động; node phụ thuộc ảnh cơ sở, biến thể hoặc kết quả chọn dùng của đoạn trước phải chờ, không coi chuỗi phụ thuộc là lô độc lập.

Sau khi hoàn thành các lần khởi động độc lập và công việc văn bản có thể thực thi trong lượt này, tổng hợp các node đang tạo và việc chờ phụ thuộc, bảo người dùng trả lời khi xong, giữ canvas hiện tại. Khi không có khả năng theo dõi trạng thái/chờ thì kết thúc lượt này, không giả tạo việc theo dõi nền, polling vô hạn hoặc coi file cũ là kết quả mới.

Sau khi người dùng báo hoàn thành, dùng `getCanvasNodes` đọc `outputs` và `data` cần thiết của các node liên quan, đối chiếu output mới, file thực tế và việc người dùng có tự tạo hoặc thay tư liệu trong lúc đó không. Đường dẫn mới chỉ là một trong các bằng chứng, không tự động chứng minh nó thuộc phương án lần này; khi quy thuộc không rõ thì hỏi output này ứng với lần tạo nào, tạm chưa chọn dùng cho hạ nguồn.

Nếu lượt này thực sự cung cấp công cụ truy vấn hoặc chờ tác vụ mới, có thể đọc hoàn thành, thất bại và kết quả theo hợp đồng thực của nó, vẫn giữ việc chọn dùng và kiểm tra chất lượng. Không được dựa vào đoạn mô tả này để bịa API, jobId hay tự động đánh thức.

Tạo thất bại, quá thời gian hoặc bị hủy thì trước tiên xác nhận trạng thái kết quả và nguyên nhân. Khi công cụ trả về không rõ ràng thì không thử lại mù quáng, để tránh tiêu tốn credit tính toán lặp lại; thay đổi phương án và thử thêm thì đối chiếu phạm vi ủy quyền. Người dùng chuyển canvas, dự án hoặc đóng trang có thể gỡ node và hủy yêu cầu, sau khi khôi phục thì khám phá lại trạng thái, không đảm bảo nền vẫn tiếp tục.

Khi đọc được kết quả thì kiểm tra theo năng lực thực tế; việc chọn dùng video và nối cảnh đoạn tiếp theo xem [trạng thái và giao nộp](stateAndDelivery.md). Chỉ file thực sự được xác nhận chọn dùng mới cố định thành node tư liệu, khi năng lực tham chiếu không đủ hoặc người dùng chọn sản xuất bên ngoài thì đưa yêu cầu nhập tối thiểu cần thiết, không ép dùng nền tảng bên ngoài.
