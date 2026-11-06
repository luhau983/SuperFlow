# Chuyển đổi canvas cho sản xuất video

Biến nội dung sáng tác đã chốt thành canvas mà người dùng có thể chỉnh sửa, kết nối và tiếp tục tạo. Áp dụng cho giai đoạn làm canvas trong các skill kịch bản, tiểu thuyết và ý tưởng; phán đoán sáng tác do skill tương ứng phụ trách, tệp này chỉ giải thích cách thực hiện. Quy ước gọi công cụ xem [Sổ tay thao tác canvas](../SKILL.md), không cần truy cập tài liệu bên ngoài.

## 0. Phối hợp từng giai đoạn

Mặc định dùng quy trình sản xuất đa tham chiếu Seedance 2.0/2.5: trước tiên hoàn thành và xác nhận kịch bản hoàn chỉnh của phạm vi lần này, rồi dựa vào kịch bản tạo tài sản nhân vật, bối cảnh, đạo cụ; từ kịch bản hoàn chỉnh tách ra nhiều đoạn, toàn bộ shot của mỗi đoạn được chuyển thành một prompt video, tài sản dùng trực tiếp làm đầu vào video. Một đoạn có thể có nhiều shot và động tác, tương ứng một node video; mặc định không tạo khung hình chính (keyframe). Khi người dùng nêu rõ yêu cầu đặc biệt như khung đầu, khung đầu và khung cuối, khóa bố cục, mới thêm giai đoạn tương ứng.

Trước khi viết prompt tài sản phải đọc [Quy chuẩn ảnh tài sản](../../script/references/assetGuide.md), trước khi tách đoạn và viết prompt video phải đọc [Hướng dẫn sản xuất đoạn](../../script/references/productionGuide.md). Tệp này phụ trách ánh xạ lên canvas, không thể dùng hướng dẫn thao tác thay cho các mẫu cụ thể nói trên.

| Giai đoạn | Thành quả trình cho người dùng xem | Nội dung chỉ được đẩy tiếp sau khi xác nhận |
| --- | --- | --- |
| Yêu cầu và bản tóm tắt | Các yêu cầu đã biết, những gì còn thiếu về khán giả/thời lượng/tỉ lệ khung/phong cách/âm thanh/công dụng tham chiếu | Câu chuyện và kịch bản; mỗi vòng chỉ hỏi số ít câu hỏi thực sự cần lúc này |
| Kịch bản hoàn chỉnh | Phần thân từng cảnh của phạm vi lần này, động tác đầy đủ và lời thoại/OS/VO, mở đầu, diễn biến và kết thúc; tóm tắt không thể thay cho phần thân | Dựa vào kịch bản trích xuất nhân vật, bối cảnh và đạo cụ; không được bỏ qua kịch bản chỉ vì đề tài quen thuộc |
| Thiết kế và chuẩn bị tài sản | Danh sách tài sản của kịch bản, prompt theo từng loại, cận cảnh khuôn mặt nhân vật và bộ ba góc nhìn trước-nghiêng-sau cùng các thành quả tài sản thực tế khác | Tạo và nghiệm thu tư liệu theo phạm vi đã xác nhận, tái sử dụng tài sản đạt chuẩn đã có; đạt rồi mới dùng cho video |
| Tách đoạn kịch bản và prompt video | Phạm vi kịch bản của mỗi đoạn, các shot bên trong, thời lượng dự kiến, trạng thái nối tiếp và một prompt đa tham chiếu hoàn chỉnh | Một bản mẫu nhỏ của một đoạn hoàn chỉnh có phạm vi rõ ràng, không tạo tác vụ riêng cho từng shot bên trong |
| Bản mẫu video | Video thực tế, nội dung đã kiểm tra và những chỗ cần điều chỉnh | Sau khi người dùng xác nhận hiệu quả thì mở rộng sang phạm vi shot mà họ đồng ý |
| Sản xuất hàng loạt và bàn giao | Tư liệu của các đoạn tương ứng, quy cách thực tế, các vấn đề còn lại | Dựng/ghép hoặc lô tiếp theo; không có khả năng ghép thì bàn giao các đoạn, không tuyên bố là phim hoàn chỉnh |

- Mỗi giai đoạn trước tiên hoàn thành thành quả có thể duyệt, rồi dùng `askUser` nếu có để hỏi "Tiếp tục theo phương án hiện tại / Điều chỉnh"; khi không có công cụ đó thì hỏi bằng văn bản và chờ trả lời. Chờ câu trả lời thật rồi mới đẩy tiếp, không làm liền nhiều giai đoạn chưa được xác nhận trong cùng một lượt, cũng không biến mỗi lần gọi công cụ thành một lần hỏi. Khi có việc tạo tiêu tốn credit tính toán, câu hỏi phải ghi rõ phương án tạo lần này và tính chất tính phí.
- Các giai đoạn cụ thể mà người dùng đã xác nhận rõ ràng hoặc ủy quyền làm liên tục thì tiếp tục áp dụng. Xác nhận bản tóm tắt không có nghĩa là xác nhận kịch bản, xác nhận tạo tài sản không có nghĩa là nghiệm thu kết quả tạo, cho phép một bản mẫu nhỏ không có nghĩa là cho phép sản xuất hàng loạt cả phim.
- `title`, `question` của `askUser` đều bắt buộc; nhiều câu hỏi thì dùng `fields`, tên trường dùng tên lowerCamelCase duy nhất như `visualStyle`, `referenceUse`. Không truyền đồng thời `fields` và `options` cấp cao nhất. Khi biểu mẫu thất bại thì sửa tham số và gửi lại, không được coi là người dùng bỏ qua; khi bước xác nhận giai đoạn bị bỏ qua, hủy hoặc không được trả lời thì giữ thành quả và tạm dừng, không tự động phê duyệt, cũng không hỏi dồn lặp lại.
- Sau khi người dùng điều chỉnh nội dung, trước tiên đồng bộ cập nhật bản tóm tắt, phân cảnh và prompt của node bị ảnh hưởng, rồi trình bày thành quả giai đoạn đã cập nhật. Ví dụ khi đổi thành "không có lời dẫn", không được để canvas giữ lời dẫn cũ rồi dùng prompt mới trong khung chat để tạo trực tiếp.
- Việc làm canvas thực hiện theo cấu hình và khả năng tạo thực tế bên trong node; không được để lách việc xác nhận giai đoạn hay chỗ thiếu tham số của node mà chuyển sang công cụ tạo khác để lén đổi sang một phương án khác.

## 1. Đọc hiện trạng, rồi mới quyết định cần những node nào

Dùng `getCanvas` để xác nhận tổng quan canvas mục tiêu, khi cần thì truyền `include: ["nodeTypes"]` để tra các loại khả dụng. Dùng `findCanvasNodes` để định vị node đã có; khi đã biết ID thì dùng thẳng `getCanvasNodes` tra các trường cần thiết, dùng `getCanvasEdges` tra kết nối cục bộ, dùng `getNodeTools` tra hàm. Tuân thủ phân trang, thông tin cắt bớt và con trỏ, không đọc chi tiết toàn đồ thị; tác vụ toàn đồ thị hoàn thành theo lô, chỉ giữ lô hiện tại và bản tóm tắt. Khi làm trên canvas hiện tại thì tiếp tục dùng canvas hiện tại; chỉ khi rõ ràng cần canvas mới hoặc chuyển sang tác phẩm đã có mới dùng công cụ tương ứng.

- Loại node chọn từ `availableNodeTypes` của `getCanvas`, hàm sửa nội dung và hàm tạo chọn từ danh sách `nodeTools` do `getNodeTools` trả về, rồi thực thi qua `nodeTools`. Tên giống nhau không có nghĩa là khả năng giống nhau, không coi tên ví dụ là ID loại cố định.
- Dùng số cảnh của kịch bản, số đoạn hoặc tên sẵn có của người dùng để định vị nội dung; số shot bên trong giữ lại trong kế hoạch đoạn và prompt. Kết hợp văn bản, tư liệu và kết nối để phân biệt các node cùng tên, khi làm tiếp chỉ bổ sung các mục còn thiếu hiện tại.
- Văn bản, hình ảnh, video là vai trò nội dung, không bắt buộc mỗi khâu đều phải tạo node. Đầu ra media đã tồn tại có thể kết nối thẳng xuống hạ nguồn, không tạo thêm node sao chép kết quả.
- Trước tiên hoàn thành một đơn vị sản xuất của giai đoạn hiện đã xác nhận, điền nội dung, đối chiếu tham chiếu, rồi mới mở rộng phạm vi được phép. Khi tài sản chưa được xác nhận thì không tạo hàng loạt node video cho cả phim, cũng không tạo trước một loạt node rỗng rồi mới bổ sung nội dung.

## 2. Nội dung đặt ở vị trí có thể chỉnh sửa

| Nội dung | Đặt ở đâu | Cách dùng |
| --- | --- | --- |
| Bản tóm tắt sáng tạo, kịch bản hoàn chỉnh, bảng đoạn và shot | Node văn bản | Lưu phần thân và kế hoạch có thể chỉnh sửa; không nối thẳng vào node tạo ảnh hay tạo video. |
| Thiết kế nhân vật, bối cảnh, đạo cụ | Node tạo ảnh của tài sản tương ứng | Điền theo quy chuẩn ảnh tài sản: nhân vật gồm cận cảnh khuôn mặt cộng bộ ba góc nhìn đầy đủ, bối cảnh/đạo cụ bố cục theo loại và phong cách vẽ riêng; không coi động tác, lời thoại, chuyển động máy của đoạn là prompt tạo ảnh. |
| Ảnh nhân vật, ảnh bối cảnh, ảnh đạo cụ đã xác nhận | Đầu ra media đã có hoặc node tư liệu | Tái sử dụng trực tiếp và kết nối vào node video đa tham chiếu; tệp đã có thì nạp vào node qua hàm nhập tư liệu thực tế. |
| Toàn bộ shot của một đoạn | Prompt của một node tạo video | Từ kịch bản tương ứng và kế hoạch shot của đoạn này chuyển thành một prompt ba phần, gồm định nghĩa tư liệu thực, các shot theo thứ tự và ràng buộc phong cách; không tách các shot bên trong thành nhiều node. |
| Khung hình chính hoặc khung đầu/khung cuối theo yêu cầu đặc biệt | Node tạo ảnh tương ứng | Chỉ chuẩn bị khi lộ trình đó đã được xác nhận rõ ràng, không phải bước trung gian cố định của sản xuất đa tham chiếu. |

Thứ tự thao tác là: `addNode` → ghi lại `node.id` được trả về → `getNodeTools` tra hàm → `renameNodes` (khi cần, truyền mảng `renames`) → `nodeTools` điền nội dung. Khi tạo cũng có thể đặt tên trực tiếp; node đã có thì bắt đầu từ bước sửa nội dung. Chỉ tạo node rỗng hoặc để prompt lại trong khung chat đều không được tính là đã dựng xong canvas.

Node tích hợp sẵn hiện tại có thể cung cấp `node:setText`, `node:setImage`, `node:setVideo`, `node:setAudio`, `node:setPrompt`, `node:getConfig`, `node:setConfig` và các hàm tạo tương ứng; chỉ dùng khi danh sách hàm lần này thực sự có nó, tham số thì đọc theo mô tả của hàm đó, không áp các tên này cho plugin khác.

Thứ được ghi vào node văn bản là nội dung văn bản để hạ nguồn đọc, không đồng nghĩa với việc kích hoạt mô hình ngôn ngữ bên trong node. Khi chữ đã được trợ lý hiện tại viết xong thì ghi thẳng vào, không cần tạo lại. Dùng `fields: ["data"], dataKeys: ["textPath"]` của `getCanvasNodes` để đọc vị trí tệp phần thân, rồi đọc tệp thực tế để đối chiếu; khi cần xem phần thân hiện có trong bộ nhớ thì dùng `path: ["outputs", "text", "value"]` để đọc theo đoạn. Chi tiết mặc định không có phần thân không có nghĩa là node rỗng, cũng đừng đoán đường dẫn hay sửa thẳng tệp thay cho hàm node.

Tệp hoặc model của node mới có thể vẫn đang khởi tạo. Khi nhận lỗi rõ ràng "chưa được tải" thì giữ node đó, xử lý trước nội dung độc lập, đợi khởi tạo xong rồi thử lại; không xóa và dựng lại, cũng không lẫn lộn giữa tạm thời chưa tải với thực sự chưa cấu hình model.

Nhập tư liệu phải dùng tệp đã tồn tại và đọc được. Tên ảnh, mô tả, prompt chờ tạo đều không thể coi là tệp ảnh. Media đã có trên canvas thì tái sử dụng trực tiếp; thiếu khả năng nhập thì nêu rõ chỗ thiếu đó, không dùng đường dẫn văn bản giả làm đầu ra media.

## 3. Kết nối phụ thuộc đầu vào, không kết nối các bước sản xuất

Trước tiên đọc cổng thực của hai đầu, rồi dùng `connectNodes` kết nối đầu ra với đầu vào tương thích. ID và loại cổng lấy từ thông tin node mới nhất. Mỗi cạnh đều phải trả lời được câu hỏi "hạ nguồn cần dùng nội dung gì của thượng nguồn".

- Văn bản đã kết nối sẽ được đưa nguyên khối vào prompt làm ngữ cảnh, vì vậy kịch bản và bảng đoạn không thể nối vào node tạo như dây trang trí. Trợ lý trước tiên đọc hết kịch bản hoàn chỉnh, rồi chuyển nguyên văn đoạn này và toàn bộ shot bên trong vào prompt đích; kịch bản vẫn là nguồn nội dung.
- Tạo ảnh dùng để chuẩn bị tài sản, video nối thẳng với tài sản đã xác nhận, dùng prompt đa tham chiếu mô tả toàn bộ đoạn; không thể lấy một ảnh phong cách thay cho tài sản nòng nọc, ếch hay ao, cũng không thể biến bộ ba góc nhìn của nhân vật thành ba nhân vật đứng cạnh nhau trong video.
- Ảnh phong cách chỉ dùng cho phối màu, nét vẽ hoặc chất liệu đã xác nhận; ảnh nhân vật ràng buộc ngoại hình nhận dạng, ảnh bối cảnh ràng buộc không gian môi trường, ảnh đạo cụ ràng buộc hình dạng đồ vật. Tham chiếu video, âm thanh chỉ thêm vào khi tác vụ hiện tại cần và node đích thực sự hỗ trợ, không máy móc kết nối mọi tài sản.
- Mỗi media thực sự được dùng đều phải ghi trong prompt `{{ref N}}`, tên tư liệu và công dụng cụ thể, không được chỉ nối cạnh, hoặc viết "nếu có kèm ảnh tham chiếu". Nhiều nhân vật thì nói rõ từng người làm gì, không để model đoán quan hệ tương ứng của tư liệu.
- Ảnh tham chiếu thông thường không mặc nhiên là khung đầu hay khung cuối. Ràng buộc khung đầu/khung cuối cần cấu hình thực tế hỗ trợ cách đó và thứ tự đúng, không thể chỉ viết "làm khung đầu" trong prompt rồi tuyên bố đã thiết lập xong.
- Nối dây trước, rồi dùng `nodeIds: [ID-mục-tiêu], direction: "incoming"` của `getCanvasEdges` để đọc đủ các cạnh vào của node đích theo trang. Dùng `fields: ["data"], dataKeys: ["referenceOrder"]` của `getCanvasNodes` để đọc thứ tự của node đích, dùng `fields: ["ports", "outputs"]` để đọc các node nguồn theo lô và đối chiếu số tham chiếu, cuối cùng gọi `node:setPrompt` của node đích. Chi tiết mặc định không trả về các trường này; phân trang và cắt bớt trường đều phải bổ sung theo [Quy tắc đọc canvas](../SKILL.md#đọc-canvas). Văn bản và media dùng chung dãy số, không được mặc định viết ảnh đầu tiên thành tham chiếu 1. Không xác nhận được số thì không đoán, không kích hoạt tạo; sau khi nối dây, xóa hoặc thay đổi thứ tự thì đối chiếu lại.
- Thứ tự trước sau của hai node video không yêu cầu nối cạnh. Chỉ khi đoạn sau thực sự dùng video đoạn trước làm tham chiếu, kéo dài tiếp hoặc đầu vào khác và node đích hỗ trợ thì mới nối; thứ tự dựng ghi trong tên, vị trí hoặc phần ghi chú.

Node tích hợp sẵn hiện tại thu thập các cạnh vào hợp lệ theo cổng đầu vào đích (thường là `in`). Khi có `data.referenceOrder[ID-cổng]` thì sắp xếp theo các khóa trong đó, khóa là `encodeURIComponent(JSON.stringify([source, sourceHandle]))`; các mục không được liệt kê xếp phía sau theo thứ tự cạnh vào, không có cấu hình sắp xếp thì giữ thứ tự cạnh vào. Mục thứ N trong danh sách chính là `{{ref N}}`. Đây là căn cứ đối chiếu, không phải giao diện để trợ lý trực tiếp sửa dữ liệu node.

Đầu prompt dùng `{{ref N}}` thật để định nghĩa chủ thể, bối cảnh, đạo cụ và các đặc trưng ổn định; tiếp theo theo số shot gốc của đoạn này viết từng shot về động tác và không gian, một chuyển động máy chính duy nhất, lời thoại đầy đủ và âm thanh, cuối cùng viết phong cách đã xác nhận và các ràng buộc cần thiết. Cách viết và ví dụ đầy đủ nhiều shot xem [Hướng dẫn sản xuất](../../script/references/productionGuide.md). Không thể dùng một câu "tham chiếu nòng nọc và ao, bơi về phía ếch" thay cho toàn bộ cốt truyện và shot của đoạn, cũng không thể chỉ vì có đánh dấu mà tuyên bố model đã tuân theo chính xác.

Nội dung thượng nguồn được dùng khi tạo phải được chuẩn bị sẵn sàng. Có thể dựng trước phụ thuộc và điền prompt hạ nguồn, nhưng đầu ra rỗng hay ảnh chưa được tạo không thể làm tham chiếu đã sẵn sàng để khởi động hạ nguồn.

## 4. Đối chiếu khả năng hiện tại trước khi kích hoạt tạo

Đọc prompt thực tế, cấu hình hiện tại và tư liệu đã kết nối của node tạo, trước tiên trình bày đối tượng và số lượng tạo lần này, model, tỉ lệ khung/độ phân giải/thời lượng video, prompt đầy đủ và tham chiếu, đồng thời thông báo sẽ phát sinh chi phí, rồi hỏi có tiêu tốn credit tính toán để tạo không, đợi đồng ý rõ ràng mới gọi hàm tạo. Khi chi phí không có báo giá đáng tin cậy thì nói là chưa biết. Ảnh đơn, biến thể và bản mẫu nhỏ cũng áp dụng; một lô cụ thể có thể xác nhận một lần, các lần bổ sung, tạo lại hoặc thử lại có thể tính phí vượt phạm vi đã phê duyệt thì xác nhận lại. Xác nhận thiết kế nội dung hay để trợ lý tiếp tục không đồng nghĩa với phê duyệt lần gọi tạo cần tiêu tốn credit tính toán mà chưa được giải thích. Khi người dùng chỉ yêu cầu dựng hoặc sửa prompt thì không tự động tạo.

Các tùy chọn model, tỉ lệ, độ phân giải, chế độ, thời lượng và âm thanh phải nhất quán với xác nhận hiện tại của người dùng. Khi cần đối chiếu, đọc cấu hình hiện tại và khả năng model khả dụng qua `node:getConfig` của node này; tiếp tục dùng cấu hình người dùng đã xác nhận và đáp ứng tác vụ, không chọn lại model cho chỉnh sửa thông thường. Khi không chỉ định nhà cung cấp, mặc định chọn theo thứ tự công cụ trả về model Toonflow thực sự khả dụng và hỗ trợ đầu vào, phiên bản và quy cách cần thiết, model mặc định do node tự điền không tính là người dùng chỉ định; không có model Toonflow phù hợp thì nêu rõ và xác nhận nhà cung cấp hoặc model thay thế. Khi video chưa chốt model sản xuất, chọn khả năng đa tham chiếu Seedance 2.0/2.5 thực sự được cung cấp theo lộ trình đã xác nhận, không thể chỉ vì trùng tên mà giả định hỗ trợ tư liệu, số lượng và quy cách cần thiết. Prompt viết "9:16" không thể làm node `16:9` thành khung dọc, viết "6 giây" cũng không thể ghi đè `4` giây thực tế.

Khi cần điều chỉnh, dùng `node:setConfig` thực sự được cung cấp để chỉ sửa các tùy chọn cần cho lần này, tham số và phạm vi hỗ trợ lấy mô tả hàm và `node:getConfig` làm chuẩn; khi đổi model thì cung cấp kèm nhà cung cấp và model. Sửa cấu hình không kích hoạt tạo, đối chiếu kết quả đã có hiệu lực rồi mới gọi hàm tạo theo phạm vi đã xác nhận. Chỉ khi node đích thực sự không có khả năng cấu hình khả dụng mới chỉ ra node cụ thể và các tùy chọn cần chỉnh, nhờ người dùng xử lý. Không được nhét tham số vào `node:setPrompt`, sửa trực tiếp JSON canvas hoặc chuyển sang công cụ media để lách xung đột.

Node chỉ bổ sung giá trị mặc định cho các tùy chọn chưa thiết lập hoặc không tương thích: ảnh dùng độ phân giải thấp nhất mà model hỗ trợ, tỉ lệ mặc định `16:9`; video dùng thời lượng ngắn nhất được hỗ trợ và độ phân giải thấp nhất tương ứng, tỉ lệ mặc định `9:16`, âm thanh mặc định bật và tuân theo khả năng âm thanh của model. Thiết lập hợp lệ đã có không bị giá trị mặc định ghi đè, cũng không chủ động đổi quy cách cao hơn mà người dùng đã xác nhận về mức thấp nhất mặc định.

Đẩy tiến theo phụ thuộc đã xác nhận: kịch bản hoàn chỉnh → tài sản nhân vật/bối cảnh/đạo cụ → tách đoạn kịch bản và prompt đa tham chiếu cho từng đoạn → bản mẫu đoạn → các đoạn còn lại được phép. Bảng kế hoạch ghi thời lượng, prompt Seedance chính thức mặc định tổ chức theo số shot mà không viết trục thời gian theo số giây tuyệt đối. Tài sản đã có thì tái sử dụng trực tiếp, không thêm khung hình chính cho từng shot, không phát lệnh tạo lặp lại trên cùng một node.

Khi yêu cầu thất bại, trước tiên đọc lỗi và kiểm tra tham số hiện tại. Trong phạm vi quy cách đã xác nhận có thể sửa lỗi định dạng tham số rõ ràng; không được tự giảm độ phân giải, rút ngắn thời lượng, đổi model/chế độ, xóa tham chiếu hoặc thay đổi âm thanh để "chạy được". Những thay đổi này phải giải thích ảnh hưởng trước và hỏi người dùng. Lỗi cùng loại mà chưa tìm ra nguyên nhân thì dừng lại, không liên tục thử các lộ trình sản xuất khác nhau.

## 5. Xử lý tách biệt việc bắt đầu chạy nền và việc hoàn thành

Trước khi phát lệnh, ghi lại đầu ra vốn có của node đó. Sau khi hàm tạo trả về "đã bắt đầu", bước hiện tại chỉ mới là đã gửi; đừng tuyên bố ngay là có tư liệu mới, cũng đừng gọi lại cùng hàm tạo đó để chờ kết quả.

- Ưu tiên dùng khả năng thông báo hoàn thành, chờ hoặc trạng thái mà công cụ thực sự cung cấp. Khi hiện không có truy vấn trạng thái đáng tin cậy, không bịa ra hàm truy vấn, cũng không coi việc node vẫn tồn tại hay đầu ra cũ vẫn hiển thị là thành công.
- Có thể làm trước các công việc văn bản và cấu trúc khác không phụ thuộc vào kết quả này, rồi đọc canvas để kiểm tra đầu ra. Khi cần tạo lại, đầu ra cũ không chứng minh được lần này đã xong; phải có kết quả mới hoặc bằng chứng hoàn thành rõ ràng, và xác nhận media đọc được.
- Chỉ khi kết quả thượng nguồn thực sự sẵn sàng và người dùng xác nhận hiệu quả của giai đoạn này mới khởi động hạ nguồn; tự đánh giá của trợ lý không thay được việc người dùng nghiệm thu. Không có kết quả mới và không xác nhận được trạng thái thì đánh dấu là chờ hoàn thành, giữ cấu trúc và phụ thuộc đã dựng, không truy vấn chạy không với tần suất cao hay gửi trùng lặp.
- Việc tạo media hiện tại do node nắm giữ, gỡ bỏ có thể hủy tác vụ. Trong lúc tạo, không chuyển canvas, xóa hay dựng lại node tạo chỉ để sắp xếp công việc; sắp xếp có thể di chuyển vị trí trên cùng canvas.
- Khi lượt này chỉ đổi prompt, media đã có vẫn là phiên bản cũ; khi báo cáo việc sửa đã xong và trạng thái tạo phải phân biệt rõ, không thể coi ảnh cũ là kết quả sau khi sửa.
- Đổi prompt trong lúc đang tạo không làm thay đổi yêu cầu đã gửi lần đó; muốn bản sửa tham gia lần tạo tiếp theo thì trước tiên xác nhận tác vụ hiện tại đã kết thúc hoặc hủy qua khả năng dừng thực tế. Dừng hội thoại cũng không đồng nghĩa với dừng tác vụ chạy nền của node.

## 6. Ví dụ: ba shot hợp thành một đoạn video

Giả sử kịch bản ngắn hoàn chỉnh đã xác nhận là "Lâm Ninh đẩy cửa vào phòng, phát hiện lá thư trên bàn, mở phong bì rồi khựng lại", không có lời thoại. Dung lượng thực tế của model chứa được chuỗi sự kiện liên tục này; loại node, ID và cổng vẫn lấy từ công cụ hiện tại.

1. Từ kịch bản trích xuất Lâm Ninh, căn phòng, lá thư, tái sử dụng tư liệu đạt chuẩn đã có; mục thiếu thì làm theo quy chuẩn ảnh tài sản, trình bày bảng tham chiếu nhân vật, ảnh bối cảnh không có người và ảnh đạo cụ rồi chờ xác nhận.
2. Lấy chuỗi sự kiện liên tục này làm "Cảnh 01·Đoạn 01", bên trong bố trí ba shot: trung cảnh máy bám theo vào phòng, đặc tả phát hiện lá thư, trung cận cảnh máy cố định quan sát phản ứng sau khi mở thư. Cả ba shot đều giữ trong cùng một prompt video của đoạn này.
3. Chỉ tạo một node "Cảnh 01·Đoạn 01·Video", nối ba tài sản thực, đối chiếu thứ tự tham chiếu, viết theo ba phần gồm định nghĩa tư liệu, động tác/âm thanh môi trường đầy đủ của ba shot và ràng buộc phong cách. Văn bản kịch bản không nối thẳng vào node, không làm thêm ba ảnh phân cảnh mở cửa, lá thư, phản ứng.
4. Đối chiếu model, chế độ, thời lượng, tỉ lệ khung và âm thanh thực tế của node, trình bày kế hoạch đoạn, prompt đầy đủ, số lượng và chi phí, sau khi người dùng phê duyệt rõ ràng phương án tiêu tốn credit tính toán lần này mới gọi tạo một lần; trình bày đoạn thực tế và hỏi điều chỉnh. Các đoạn khác chỉ tiếp tục theo phạm vi tiêu tốn credit tính toán đã được phép, không gửi riêng một yêu cầu cho mỗi shot bên trong.
5. Muốn hiển thị kết quả thì dùng `fitCanvas`; bố trí cục bộ dùng `moveNodes`, chỉ khi người dùng yêu cầu sắp xếp toàn bộ canvas mới dùng `arrangeCanvas`. Nhiều đoạn không tự động nối cạnh vì thứ tự thời gian, khi chưa dựng thì nói rõ là bàn giao dưới dạng các đoạn video.

## 7. Đối chiếu bàn giao canvas

Khi hoàn thành, dùng `getCanvasNodes` / `getCanvasEdges` đối chiếu các node bị ảnh hưởng, văn bản hoặc prompt, kết nối cục bộ và đầu ra, khi cần thì `fitCanvas` để hiển thị phạm vi lần này. Kiểm tra các thông báo cắt bớt, khi cần thì bổ sung nội dung theo đoạn dọc theo `path`. Đừng biến việc đối chiếu bàn giao thành mặc định sắp xếp lại toàn bộ canvas; nếu đã gọi `arrangeCanvas` theo yêu cầu người dùng thì nó đã khớp khung nhìn, không cần sắp xếp thêm hay khớp lại. Tiêu đề hay vị trí không thể thay cho việc kiểm chứng nội dung.

Báo cáo riêng từng phần: nội dung đã ghi, tham chiếu đã thiết lập, việc tạo đã gửi, sản phẩm mới đã có, phần đã xem và nghiệm thu, phần đã ghép. Khi chỉ có công cụ tệp thì không thể dùng việc viết trực tiếp tệp canvas để giả làm thao tác thời gian thực; khi thiếu công cụ canvas thì giữ thành quả sáng tác, và nói rõ cần mở canvas mục tiêu hoặc bật khả năng tương ứng.

## Căn cứ tham khảo

Nguồn công khai của phương pháp sáng tác xem [Ghi chú nguồn sản xuất](../../script/references/sources.md). Khi thao tác, dùng sổ tay này, hướng dẫn sản xuất cục bộ đã cài và giá trị trả về thực tế của công cụ, không cần truy cập tài liệu bên ngoài.
