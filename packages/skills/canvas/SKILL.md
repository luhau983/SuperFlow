---
name: canvas
description: Sổ tay thao tác canvas của Toonflow. Dùng các công cụ canvas để tạo, chuyển đổi và đổi tên canvas; thêm, di chuyển, đổi tên, kết nối và xóa node; tự động sắp xếp toàn bộ canvas, điều chỉnh khung nhìn (viewport) và gọi các hàm do node đăng ký. Dùng khi người dùng yêu cầu thao tác trên canvas hiện tại hoặc dựng luồng node.
metadata:
  version: "2.1.0"
  displayName: Sổ tay thao tác canvas
  author: Toonflow
  github: https://github.com/HBAI-Ltd/Toonflow-app
---

# Sổ tay thao tác canvas

Điều khiển canvas đang chạy hiện tại thông qua công cụ "Thao tác canvas" đã được bật. Công cụ chỉ khả dụng khi có ngữ cảnh canvas; khi thiếu công cụ, hãy nhờ người dùng mở canvas của dự án mục tiêu và xác nhận công cụ đã được bật, không sửa JSON của canvas để lách qua công cụ.

## Quy trình thao tác

1. Khi đã biết ID node thì đọc thẳng mục tiêu; nếu không, dùng `getCanvas({})` để xác nhận tổng quan canvas đang kích hoạt, dùng `findCanvasNodes` để tìm theo tên, loại hoặc trạng thái chọn. Chỉ khi cần thêm node mới dùng `getCanvas({ include: ["nodeTypes"] })` để tra loại.
2. Chọn thao tác bên dưới theo yêu cầu của người dùng, chờ kết quả trả về của từng lần. Các lần gọi sau dùng ID do bước trước trả về, không đoán ID, loại node, cổng (port) hay hàm của node.
3. Dùng `getCanvasNodes` để đọc các trường mục tiêu khi cần, `getCanvasEdges` để tra kết nối cục bộ; khi cần chỉnh nội dung node, dùng `getNodeTools` để đọc mô tả và `parameters` đầy đủ của hàm node đó, rồi gọi qua `nodeTools`.
4. Sau khi hoàn tất điều chỉnh cấu trúc, gọi `fitCanvas` khi cần để hiển thị kết quả, rồi dùng `getCanvasNodes` / `getCanvasEdges` chỉ đối chiếu các node, tên và kết nối bị ảnh hưởng. `arrangeCanvas` đã tự động khớp khung nhìn, không cần gọi lại `fitCanvas`. Chỉ báo cáo những thao tác mà công cụ thực sự đã hoàn thành.

Với sản xuất câu chuyện hoặc video, trước tiên đọc [Các giai đoạn sản xuất và xác nhận](references/videoProduction.md#0-phối-hợp-từng-giai-đoạn). Mặc định chỉ thực hiện giai đoạn hiện đã được xác nhận; trước hết thu thập thông tin từng bước, sau đó trình bày thành quả giai đoạn và hỏi điều chỉnh, đợi người dùng nói rõ là tiếp tục. Không vì người dùng nói "làm một phim ngắn" mà tạo một lần toàn bộ phân cảnh và node tạo, cũng không coi việc hỏi thất bại, bỏ qua hay im lặng là xác nhận.

Mặc định tạo tài sản nhân vật, bối cảnh, đạo cụ từ kịch bản hoàn chỉnh của lần này, rồi tách thành các đoạn nhiều shot; mỗi đoạn tương ứng một prompt video và một node video, tài sản dùng trực tiếp cho tạo đa tham chiếu. Trước khi viết prompt tài sản, đọc [Quy chuẩn ảnh tài sản](../script/references/assetGuide.md); trước khi viết prompt video, đọc [Hướng dẫn sản xuất đoạn](../script/references/productionGuide.md). Cận cảnh khuôn mặt nhân vật và bộ ba góc nhìn đầy đủ trước-nghiêng-sau không được giản lược thành một ảnh cốt truyện chung duy nhất.

Liên kết trong tài liệu tính tương đối theo thư mục của tệp hiện tại. Quy chuẩn `script` xuyên skill được định vị theo `location` thực tế trong `available_skills`; khi thiếu phụ thuộc thì nêu rõ mục thiếu, chỉ tiếp tục các thao tác cấu trúc không phụ thuộc vào nó, không dựa vào phần giới thiệu để bịa ra quy chuẩn.

Cách viết dưới đây có nghĩa là "tên công cụ (đối tượng tham số)". Gọi thẳng công cụ tương ứng, không bọc thêm một lớp `{ name, args }`; chỉ riêng `nodeTools` có tham số `name` và `args`.

## Đọc canvas

Cả năm công cụ đọc đều hỗ trợ `canvasId` tùy chọn, dùng để xác nhận canvas đang kích hoạt, không thể dùng nó để đọc canvas chưa kích hoạt. Mỗi phản hồi tối đa 64 KiB, không cung cấp ảnh chụp nhanh toàn đồ thị:

| Công cụ | Tham số và kết quả trả về |
| --- | --- |
| `getCanvas` | Mặc định trả về `id`, số node, số dây nối, số mục đang chọn và `viewport`. `include: ["canvases"]` tra danh sách canvas `{ id, name }`, `include: ["nodeTypes"]` tra `{ type, label }` của `availableNodeTypes`; hai loại danh sách dùng chung phân trang, `limit` mặc định 30, tối đa 100. |
| `findCanvasNodes` | Lọc theo `query` (ID hoặc tên đầy đủ), `types` (tối đa 20 loại), `selectedOnly`; khi bỏ qua bộ lọc thì liệt kê theo trang. Trả về tóm tắt `nodes`, bản xem trước tên tối đa 512 ký tự; `limit` mặc định 30, tối đa 100. |
| `getCanvasNodes` | `nodeIds` mỗi lần 1–20 cái, không được trùng; `fields` mặc định là `label/type/position`, ngoài ra có thể chọn `ports/data/outputs`. `dataKeys` giới hạn các thuộc tính riêng của data cần lấy, tối đa 20 cái; trả về phép chiếu `nodes`. |
| `getCanvasEdges` | `nodeIds` tùy chọn, tối đa 20 cái; `direction` nhận `incoming/outgoing/both`, mặc định `both`, chỉ khi bỏ qua ID mới duyệt toàn bộ cạnh theo trang. Trả về `edges`; `limit` mặc định 100, tối đa 200. |
| `getNodeTools` | `nodeIds` mỗi lần 1–20 cái, không được trùng, `names` có thể lọc tối đa 20 tên hàm đầy đủ. Trả về `nodeTools` (gồm `nodeId/name/description/parameters`); `limit` mặc định 20, tối đa 50. Schema không bị cắt bớt, một mục quá lớn thì báo lỗi rõ ràng. |

Với phân trang, kiểm tra `hasMore` / `nextCursor`, giữ nguyên toàn bộ tham số truy vấn ban đầu, chỉ thay `cursor`; lọc node và truy vấn dây nối mỗi lần quét tối đa 2000 mục, kể cả khi `nodes` / `edges` hiện tại rỗng, `hasMore: true` vẫn có nghĩa là chưa quét xong. `totalNodes` / `totalEdges` là tổng số của cả canvas, không phải số kết quả khớp bộ lọc. Không tự phân tích hay tự dựng con trỏ (cursor); khi hết hiệu lực thì truy vấn lại. `selectedOnly` lọc theo trạng thái chọn tại thời điểm đọc từng trang, thao tác chỉnh sửa của người dùng có thể làm thay đổi kết quả truy vấn, không coi phân trang là một ảnh chụp nhanh đã đóng băng.

Bên trong một node cũng có thể rất lớn. `getCanvasNodes` dùng `path` để chọn đường dẫn con trong phép chiếu, ví dụ `path: ["data", "promptModel"]` hoặc `["outputs", "text", "value"]`, trả về `value` của đường dẫn đó; đoạn đầu chỉ có thể là một trong sáu trường chiếu, `ports` tương ứng với `data.handles` của node. Mảng và đối tượng phân trang bằng `valueOffset` / `valueLimit`, mặc định 0 / 30, tối đa 100 mục; chuỗi chia đoạn bằng `textOffset` / `textLimit`, mặc định 0 / 1000, tối đa 4000 ký tự. Khi `valueOffset` hoặc `textOffset` lớn hơn 0 thì bắt buộc phải cung cấp `path`, để tránh mọi trường chiếu cùng bị lệch. Đường dẫn chỉ truy cập thuộc tính riêng, không đọc được thuộc tính kế thừa.

`path` tối đa 64 tầng, mỗi đoạn tối đa 256 ký tự (cho phép khóa rỗng của đối tượng JSON), độ dài JSON UTF-8 của toàn bộ đường dẫn tối đa 2048 byte. Khi chạm giới hạn độ sâu hoặc số byte của đường dẫn thì trả về `pathDepthLimit` / `pathBytesLimit`, không được nhầm dấu hiệu đó là đã đọc xong toàn bộ nội dung; khóa quá dài được đánh dấu bằng `keyTooLong`, kèm `nextOffset` để tiếp tục đọc các trường phía sau.

`hasMore/nextCursor` ở cấp cao nhất có nghĩa là còn node chưa được trả về, giữ nguyên tham số ban đầu để tiếp tục phân trang node; `truncated` của từng node có nghĩa là giá trị của node đó chưa đọc hết. Khi xử lý bất kỳ mục bị cắt nào, chỉ truy vấn node chứa nó, dùng đường dẫn và offset của mục đó, không mang theo `cursor` ban đầu; quy tắc cụ thể:

- `text`: dùng `path` của mục đó và `nextOffset` làm `textOffset` để đọc tiếp; `entries`: dùng `path` của mục đó và `nextOffset` làm `valueOffset` để đọc tiếp. Không có `nextOffset` nghĩa là đường dẫn đó đã đến cuối, dấu hiệu vẫn có thể còn vì lần này chỉ trả về nửa sau.
- `depth/budget`: dùng `path` của mục đó để mở một truy vấn chi tiết mới, thu hẹp phạm vi đọc; khi đọc lại đường dẫn không mang theo `cursor` của truy vấn ban đầu.
- `pathDepthLimit/pathBytesLimit/keyTooLong/circular` có nghĩa là không thể triển khai đầy đủ. `keyTooLong` có thể dùng `nextOffset` trả về để bỏ qua khóa đó và đọc tiếp các trường sau, nhưng giá trị bị bỏ qua vẫn chưa lấy được; không thử lại liên tục với giới hạn cứng hay coi đó là nội dung đầy đủ.

Với nội dung node, trước tiên đọc các trường cần thiết, phát hiện bị cắt thì mới bổ sung theo đường dẫn, không mở rộng thành đọc toàn đồ thị. Đường dẫn tệp văn bản đã có thì giao cho công cụ đọc tệp; khi đối chiếu toàn văn phải bao gồm cả đoạn đã đọc và đoạn đọc tiếp.

Tác vụ toàn cục xử lý từng trang và ghi lại tiến độ, trong ngữ cảnh chỉ giữ lô hiện tại, bản tóm tắt tích lũy và con trỏ; không tích lũy toàn bộ chi tiết. Thao tác thêm/xóa trên toàn đồ thị có thể làm con trỏ duyệt mất hiệu lực, hãy truy vấn lại và đối chiếu theo các ID đã xử lý hoặc kết quả, tránh thực hiện trùng lặp. Sau khi thêm, xóa node hoặc chuyển canvas, dùng `getNodeTools` để khám phá lại các hàm liên quan.

## Quản lý canvas

| Công cụ | Tham số | Hành vi và kết quả trả về |
| --- | --- | --- |
| `addCanvas` | `{ name? }` | Tạo canvas trống và chuyển sang nó; khi bỏ qua tên thì tự động dùng tên "Canvas N" chưa bị chiếm. Trả về tổng quan canvas mới được kích hoạt. |
| `switchCanvas` | `{ canvasId }` | Chờ các sửa đổi hiện tại được lưu rồi chuyển sang canvas chỉ định, trả về tổng quan canvas mới được kích hoạt. |
| `renameCanvas` | `{ canvasId?, name }` | Khi bỏ qua ID thì đổi tên canvas đang kích hoạt, đồng thời sửa tên tệp JSON. Trả về tổng quan canvas đang kích hoạt sau thao tác. |

Tên sau khi bỏ khoảng trắng đầu cuối phải dài 1–120 ký tự, không kèm phần mở rộng `.json`, phải là tên tệp hợp lệ; không được chứa dấu phân cách đường dẫn, ký tự không hợp lệ trong tên tệp, ký tự điều khiển, không được kết thúc bằng dấu chấm hay dùng tên dành riêng của hệ thống. Tệp trùng tên sẽ không bị ghi đè.

ID canvas gắn với tên tệp, sau khi đổi tên hãy đọc lại ID được trả về. Đổi tên một canvas không kích hoạt sẽ không chuyển sang nó. Sau khi tạo hoặc chuyển canvas thành công qua các công cụ trên, các lần gọi tiếp theo trong lượt này sẽ tác động lên canvas mới được kích hoạt.

## Node và dây nối

| Công cụ | Tham số | Hành vi và kết quả trả về |
| --- | --- | --- |
| `addNode` | `{ type, position: { x, y }, label? }` | Thêm node mới, trả về thông tin node; hàm thì tra bằng `getNodeTools`. Khi không chỉ định tên thì dùng `label` của loại. |
| `moveNodes` | `{ moves: [{ nodeId, position: { x, y } }] }` | Di chuyển hàng loạt, trả về thông tin node `nodes`. Node không kéo được sẽ từ chối thao tác. |
| `renameNodes` | `{ renames: [{ nodeId, label }] }` | Cập nhật tên hiển thị hàng loạt, trả về thông tin node `nodes`. Không thay đổi ID node. |
| `deleteNodes` | `{ nodeIds: [...] }` | Xóa node và các cạnh kết nối của nó, trả về `nodeIds`, `removedEdgeCount`, tối đa 100 mục `removedEdgeIds` và `truncated`; việc cắt bớt chỉ ảnh hưởng đến biên nhận. |
| `connectNodes` | `{ connections: [{ source, sourceHandle, target, targetHandle }] }` | Kết nối hàng loạt cổng đầu ra với cổng đầu vào, trả về `{ edges }`. Khi kết nối hoàn toàn giống hệt đã tồn tại thì trả về cạnh đã có. |
| `deleteEdges` | `{ edgeIds: [...] }` | Xóa các dây nối chỉ định, trả về `edgeIds` và thông tin node liên quan `nodes`. |
| `selectNodes` | `{ nodeIds: [...] }` | Thay thế lựa chọn hiện tại, trả về `selectedCount`, tối đa 100 mục `selectedNodeIds` và `truncated`; mảng rỗng hủy chọn node. |
| `arrangeCanvas` | `{}` | Sắp xếp toàn bộ canvas hiện tại: theo kích thước thực của node và dây nối, xếp các node cấp cao nhất từ trái sang phải, node con di chuyển theo node cha, và tự động khớp khung nhìn. Trả về `arrangedCount`, tối đa 100 mục `arrangedNodeIds`, `truncated` và `viewport`; không đổi nội dung, dây nối hay lựa chọn, không kích hoạt tạo. |
| `fitCanvas` | `{ nodeIds?: [...] }` | Điều chỉnh khung nhìn, trả về `fitted`, `viewport`, `nodeCount` và `truncated`; khi truyền `nodeIds` thì trả thêm tối đa 100 mục `nodeIds`, khi bỏ qua thì hiển thị toàn bộ node. |

`truncated` trong biên nhận của các thao tác trên chỉ có nghĩa là danh sách ID được rút gọn, không có nghĩa là thao tác chỉ hoàn thành phần xem trước. Không thực hiện lại thao tác chỉ để lấy đủ biên nhận; khi cần thì dùng công cụ đọc để đối chiếu phạm vi bị ảnh hưởng.

### Ràng buộc tham số

- `position` dùng tọa độ canvas, không phải tọa độ pixel màn hình; `x`, `y` phải là số hữu hạn. Khi bật bám lưới, vị trí khi thêm mới và di chuyển sẽ được làm tròn theo lưới, lấy `node.position` được trả về làm chuẩn.
- `label` của node sau khi bỏ khoảng trắng đầu cuối phải dài 1–200 ký tự.
- `addNode` chỉ chấp nhận các loại có trong `availableNodeTypes` hiện tại, không chấp nhận `data` tùy ý hay ID node tự định nghĩa. Khi cần điền nội dung hoặc thiết lập tham số node, dùng hàm node đã đăng ký.
- Các thao tác di chuyển, đổi tên, xóa, kết nối nói trên mỗi lô có 1–64 mục, một mục đơn lẻ cũng dùng tham số mảng. Chỉ cần một mục kiểm tra không đạt thì cả lô không được thực hiện; ngoại lệ xảy ra trong lúc thực hiện không có nghĩa là các tác dụng phụ đã phát sinh được tự động hoàn tác, trước khi khôi phục vẫn cần đọc lại.
- Tham số cấp cao nhất của công cụ được kiểm tra theo đối tượng nghiêm ngặt, không truyền trường chưa khai báo. `nodeTools.args` còn phải thỏa định nghĩa tham số của hàm node cụ thể.
- ID node, ID canvas, ID cạnh là các định danh khác nhau, không dùng tên hiển thị thay cho chúng.

### Quy tắc kết nối

Trước tiên đọc cổng hai đầu bằng `getCanvasNodes({ nodeIds: [...], fields: ["ports"] })`, mỗi cổng gồm `id`, `type`, `dataType`, có thể còn có `label`. `source`, `target` là ID node; `sourceHandle`, `targetHandle` là ID cổng bên trong từng node tương ứng.

- Chỉ được kết nối từ cổng đầu ra `type: "source"` đến cổng đầu vào `type: "target"`.
- Dùng ID cổng thực tế, không đoán dựa trên chữ gợi ý như "Đầu vào ảnh". Các node khác nhau có thể có cổng cùng tên, phải đồng thời xác nhận node sở hữu.
- Công cụ áp dụng quy tắc kiểm tra kết nối của canvas và node đích; khớp loại không đảm bảo chắc chắn kết nối được, node đích có thể có quy tắc bổ sung. Khi kết nối bị từ chối, kiểm tra cổng và mô tả hàm mới nhất, không sửa JSON để ép nối dây.
- Văn bản kịch bản và phân cảnh dùng để lập kế hoạch, không trực tiếp làm đầu vào cho node tạo ảnh hoặc video. Trước tiên xác nhận các tài sản như nhân vật, bối cảnh, rồi chuyển toàn bộ shot của đoạn hiện tại thành một prompt video chuyên dụng; dây nối chỉ mang những tư liệu thực sự được dùng lần này.
- Sau khi nối xong media, đối chiếu thứ tự tham chiếu thực tế của node đích, rồi dùng `node:setPrompt` ghi `{{ref N}}`, tên tư liệu và công dụng. Nối dây thành công không có nghĩa là prompt đã gắn với tư liệu; chi tiết đánh số và đối chiếu cấu hình xem [Chuyển đổi sản xuất mục 3–4](references/videoProduction.md).
- Khi node hoặc dây nối cấm kết nối, chọn, di chuyển, xóa thì tuân theo lỗi được trả về. Xóa node có node con thì phải xóa node con trước hoặc đưa chúng vào cùng lô xóa; nếu liên quan đến nội dung người dùng không yêu cầu xóa, trước tiên làm rõ phạm vi, không tự động mở rộng thao tác xóa.

## Gọi hàm node

Dùng `nodeTools({ nodeId, name, args })`:

- `nodeId` và `name` phải đến từ cùng một mục trong danh sách hàm; `name` giữ nguyên tiền tố đầy đủ `node:`.
- Dựng `args` theo JSON Schema `parameters` của mục đó, tuân thủ trường bắt buộc, enum và cấu trúc dữ liệu; hàm không có tham số cũng truyền `{}`.
- Không giả định mọi node đều có cùng một bộ hàm, ví dụ các khả năng như thiết lập prompt, nhập tư liệu, tạo media phải lấy nội dung đăng ký thực tế của node đó làm chuẩn.
- Khi cần đối chiếu hoặc sửa cấu hình tạo, nếu danh sách có `node:getConfig` thì dùng nó để đọc cấu hình hiện tại và khả năng của các model khả dụng; các tùy chọn cần thay đổi thì sửa bằng `node:setConfig` theo mô tả tham số thực tế, rồi đối chiếu kết quả trả về. Sửa cấu hình không kích hoạt tạo; các thiết lập hợp lệ người dùng đã xác nhận thì tiếp tục dùng, không chọn lại model chỉ vì một tác vụ chỉnh sửa thông thường.
- Trước khi tạo ảnh hoặc video, trình bày model thực tế, đối tượng và số lượng, quy cách, prompt, tham chiếu và chi phí, chờ người dùng phê duyệt rõ ràng phương án tiêu tốn credit tính toán; không biết giá thì nói là chưa biết. Ảnh đơn, bản mẫu nhỏ, bổ sung thêm, tạo lại và các lần thử lại có thể tính phí đều bị ràng buộc bởi phạm vi ủy quyền, một lô cụ thể có thể xác nhận một lần. Dùng `askUser` nếu có, khi không có công cụ đó thì hỏi bằng văn bản và chờ trả lời; chưa trả lời thì không được kích hoạt tạo. Khi không chỉ định nhà cung cấp, mặc định chọn model Toonflow thực sự khả dụng và đáp ứng yêu cầu theo thứ tự công cụ trả về; lựa chọn người dùng chỉ định rõ hoặc đã xác nhận được ưu tiên, không được coi giá trị mặc định tự động của node là lựa chọn của người dùng; khi không có model Toonflow phù hợp thì trước tiên nêu rõ và xác nhận nhà cung cấp hoặc model thay thế.
- Giá trị trả về do hàm node quyết định; khi không có giá trị trả về thì là `null`. Giới hạn 64 KiB của năm công cụ đọc canvas không áp dụng cho kết quả thực thi của hàm nghiệp vụ `nodeTools`. Thực thi thành công không tự động có nghĩa là tạo media thành công, phải kiểm tra nội dung trả về và trạng thái node mới nhất.
- Sau khi tạo node mới có thể dùng ngay ID node được trả về để tra `getNodeTools` và gọi, không cần kết thúc lượt hội thoại hiện tại.

## Tác vụ thường gặp

### Chuyển phương án sáng tác thành canvas có thể thực thi

Khi tác vụ sản xuất từ kịch bản, tiểu thuyết hay ý tưởng cần biến phân cảnh, tư liệu và prompt thành node, đọc [Chuyển đổi canvas cho sản xuất video](references/videoProduction.md). Tài liệu đó giải thích nội dung nào đưa vào node văn bản, cách tái sử dụng media và kết nối các phụ thuộc thực, cũng như đối chiếu hoàn tất của việc tạo chạy nền. Các tham số chung vẫn lấy sổ tay này và mô tả do công cụ hiện tại trả về làm chuẩn.

### Tạo canvas mới và thêm node

Gọi `addCanvas({ "name": "Bản nháp phân cảnh" })`, rồi dùng `getCanvas({ "include": ["nodeTypes"] })` để tra `availableNodeTypes`, chọn loại phù hợp với yêu cầu của người dùng truyền vào `type` của `addNode`. Ví dụ vị trí có thể dùng `{ "x": 120, "y": 160 }`; tên do ý định của người dùng quyết định. Ghi lại `node.id` được trả về, dùng `getNodeTools` để tra và gọi hàm điền nội dung node, cuối cùng gọi `fitCanvas({})`.

### Kết nối hai node đã có

Gọi `findCanvasNodes`, định vị hai node theo tên hoặc trạng thái chọn mà người dùng chỉ định; khi đã biết ID thì bỏ qua bước tìm, nếu các node cùng tên không phân biệt được thì trước tiên làm rõ mục tiêu. Sau khi dùng `getCanvasNodes` đọc cổng đầu ra và đầu vào, điền ID thực tế vào mảng `connections` của `connectNodes`. Kiểm tra hai đầu của `edges` được trả về, rồi khi cần thì lấy tiêu điểm vào hai node này.

### Tìm và đọc một đoạn chỉ định

Ví dụ người dùng chỉ định G51, trước tiên gọi `findCanvasNodes({ "query": "G51", "limit": 20 })`, xác nhận mục tiêu theo kết quả phân trang. `ID-mục-tiêu` dưới đây phải thay bằng ID thực tế được trả về:

- Đối chiếu prompt và đầu ra: `getCanvasNodes({ "nodeIds": ["ID-mục-tiêu"], "fields": ["label", "data", "outputs"], "dataKeys": ["prompt", "referenceOrder"] })`. Trường mặc định không gồm `ports/data/outputs`, không được coi trường chưa yêu cầu là giá trị rỗng.
- Đọc prompt dài: `getCanvasNodes({ "nodeIds": ["ID-mục-tiêu"], "path": ["data", "prompt"], "textLimit": 4000 })`; các lần sau dùng `nextOffset` được trả về, không tự suy ra theo độ dài yêu cầu.
- Tra cạnh vào của mục tiêu: `getCanvasEdges({ "nodeIds": ["ID-mục-tiêu"], "direction": "incoming", "limit": 100 })`; tra các hàm có thể gọi: `getNodeTools({ "nodeIds": ["ID-mục-tiêu"], "limit": 20 })`.

### Sắp xếp node hàng loạt

Chỉ khi người dùng yêu cầu rõ ràng sắp xếp toàn bộ canvas hiện tại, sau khi xác nhận mục tiêu thì gọi `arrangeCanvas({})` một lần, không tự tính tọa độ của mọi node rồi di chuyển từng cái. Công cụ này tái sử dụng chức năng sắp xếp sẵn có của canvas, không nhận `nodeIds` hay tham số phạm vi cục bộ khác.

Khi các node cần sắp xếp chưa được đo kích thước hoặc không thể di chuyển, công cụ trả về lỗi rõ ràng; không đoán kích thước hay lách giới hạn di chuyển. Canvas trống trả về bình thường với `arrangedNodeIds` rỗng, không thực hiện bố cục hay điều chỉnh khung nhìn.

Khi chỉ sắp xếp các shot chỉ định hoặc node cục bộ, đọc vị trí thực tế và phạm vi mục tiêu, dùng mảng `moves` của `moveNodes` để điều chỉnh các node đó, khi cần thì dùng `fitCanvas({ "nodeIds": [...] })` để hiển thị. Khi chỉ yêu cầu nhìn rõ nội dung thì dùng thẳng `fitCanvas`, không xếp lại node. Không được gọi `arrangeCanvas` để sắp xếp cục bộ mà di chuyển các node khác của người dùng, cũng không xóa hay dựng lại node thay cho việc di chuyển.

## Xử lý sau khi thất bại

- Loại node chưa bật, cổng không tồn tại, hàm chưa đăng ký: lần lượt dùng `getCanvas({ include: ["nodeTypes"] })`, `getCanvasNodes`, `getNodeTools` để tra trạng thái mới nhất và điều chỉnh thao tác, không đoán hàm thay thế.
- Canvas đã đóng, người dùng tự tay chuyển dự án hoặc canvas, ngữ cảnh của lượt này mất hiệu lực: ngừng dùng ID cũ, nhờ người dùng gửi lại yêu cầu trên canvas mục tiêu.
- Hết thời gian, hủy hoặc lưu thất bại không có nghĩa là thao tác đã được hoàn tác. Khi ngữ cảnh vẫn còn hiệu lực, trước tiên đọc trạng thái canvas mới nhất, xác nhận xem đã tạo node, dây nối hay canvas chưa, rồi mới quyết định có thử lại hay không, tránh tạo trùng hoặc kích hoạt tạo trùng.
- Công cụ sẽ chờ các thao tác cần lưu được lưu xong; không ghi trực tiếp JSON canvas theo cách khác. Công cụ hiện tại không cung cấp giao diện chung để xóa canvas, ghi tùy ý dữ liệu node hay thiết lập tùy ý tham số khung nhìn.
