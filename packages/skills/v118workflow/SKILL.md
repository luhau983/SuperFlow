---
name: v118workflow
description: Kết hợp phương pháp biên kịch, 12 loại kỹ thuật tự sự, 11 phong cách mỹ thuật cùng kiến thức về tài sản, phân cảnh, prompt ảnh và prompt video của Toonflow v1.1.8, để sản xuất tiểu thuyết hoặc kịch bản theo từng giai đoạn và xác nhận. Duy trì thống nhất canvas kịch bản, canvas tài sản và canvas sản xuất của từng tập; dùng để tái hiện quy trình phiên bản cũ, sản xuất theo tập hoặc làm tiếp, khi thảo luận hoặc chỉnh sửa chính skill này thì không khởi động sản xuất.
metadata:
  version: "1.1.0"
  displayName: Quy trình sản xuất theo tập v1.1.8
  author: Toonflow
  github: https://github.com/HBAI-Ltd/Toonflow-app
---

# Quy trình sản xuất theo tập v1.1.8

Chuyển "dây chuyền biên kịch + dây chuyền sản xuất + bàn làm việc video" của phiên bản cũ thành các thao tác canvas của Toonflow hiện tại. Thứ tự thực hiện mỗi bước là: **đọc đầu vào đã xác nhận → hoàn thành giai đoạn này → lưu vào canvas chỉ định → đọc lại và kiểm tra → trình bày kết quả → chờ người dùng xác nhận**. Bản tóm tắt trong khung chat không thể thay cho thành quả trên canvas, tác vụ đã khởi động không thể thay cho media thành công.

Skill này đồng thời chứa các quy trình con và kiến thức chuyên môn cần để hoàn thành chúng. Trước tiên đọc reference của giai đoạn hiện tại, rồi theo yêu cầu trong đó đọc phương pháp chung và thể loại/phong cách đã chọn trong `references/knowledge/`; không được chỉ điền vài bản tóm tắt theo bảng quy trình rồi tuyên bố hoàn thành, cũng không áp dụng cùng lúc mọi thể loại và phong cách vẽ. Căn cứ phiên bản cũ và các lựa chọn khi chuyển đổi xem [Ánh xạ nguồn](references/sourceMap.md); không gọi cơ sở dữ liệu cũ, ghi XML hay giao diện dành riêng cho sub-Agent, không tự động áp dụng định tuyến model của workflow khác.

Nghiệm thu giai đoạn đối chiếu nội dung, số lượng, ánh xạ nguồn và trạng thái theo [Đối chiếu hợp đồng đầu ra](references/sourceMap.md#đối-chiếu-hợp-đồng-đầu-ra-theo-giai-đoạn). Ở đây giữ các sản phẩm cốt lõi và hai lộ trình sản xuất của phiên bản cũ, còn lưu trữ trên canvas, xác nhận từng bước và nghiệm thu kết quả tạo là yêu cầu của việc chuyển đổi; không được coi việc tên giai đoạn giống nhau hay tệp đã được tạo là đầu ra nhất quán, cũng không cam kết hai lần tạo bằng AI giống nhau từng chữ hay từng khung hình.

## Trước tiên định vị tiến độ và canvas

1. Xác nhận dự án hiện tại, mục tiêu lần này của người dùng, đầu vào đã có và kết quả đã xác nhận. Khi đã có kịch bản bản chốt hoàn chỉnh, trước tiên theo các bước khởi tạo lưu nguyên văn vào node chính thức của canvas tổng kịch bản, rồi mới vào sản xuất tài sản cơ bản hoặc tập mục tiêu, không suy ngược để bịa ra tiểu thuyết, bảng sự kiện hay khung xương; làm tiếp thì tiếp tục từ giai đoạn đầu tiên chưa xác nhận.
2. Trước tiên đọc [Khởi tạo và lưu trữ dự án](references/projectSetup.md) và [Thực thi trên canvas](references/canvasOperations.md), kiểm chứng công cụ, vị trí tệp và node hiện tại. Tiếp tục dùng cấu hình đã xác nhận, chỉ bổ sung các mục thiếu ảnh hưởng đến bước hiện tại.
3. Mọi canvas nằm trong **Workspace dự án do người dùng chọn**, không phải thư mục cài đặt skill. Cấu trúc mặc định như dưới đây; dự án đã có có thể tiếp tục dùng thư mục và tên người dùng đã xác nhận, nhưng vẫn giữ một canvas tổng kịch bản, một canvas tổng tài sản, mỗi tập một canvas sản xuất.

```text
Workspace dự án/
└─ Canvas/
   ├─ Kịch bản.json
   ├─ Tài sản.json
   └─ Tập/
      ├─ Tập 001.json
      ├─ Tập 002.json
      └─ …
```

| Canvas | Nội dung chính thức duy nhất |
| --- | --- |
| Kịch bản | Cấu hình dự án, chỉ mục nguồn, sự kiện theo chương, khung xương câu chuyện và đề cương theo tập, chiến lược chuyển thể, kịch bản chính thức của các tập, chỉ mục đường dẫn canvas |
| Tài sản | Tài sản cơ bản và tài sản phái sinh của toàn bộ phim, quan hệ cha con, thiết lập thị giác, prompt, ảnh đã chọn, các tập sử dụng |
| Tập N | Nguồn kịch bản/ảnh chụp làm việc của tập này, kế hoạch đạo diễn, bảng phân cảnh, node tư liệu tham chiếu, ảnh phân cảnh, video, ghi chép chọn dùng và bàn giao |

Ảnh trong canvas tập là tham chiếu cục bộ đến cùng tệp tài sản, không phải một kho tài sản chính thức khác. Giữa các canvas không thể nối cạnh trực tiếp; trước tiên chuyển sang đọc đầu ra tài sản thực, rồi tạo node tham chiếu trong tập này. Tệp tư liệu giữ vị trí do host trả về, không được di chuyển kết quả tạo trong `assets/` chỉ để sắp xếp thư mục canvas.

`addCanvas` hiện tại không có tham số thư mục. Phải theo [Cách lưu trữ canvas](references/canvasOperations.md#tạo-và-lưu-trữ-canvas) để đưa cây tệp về đúng vị trí, khám phá lại đường dẫn/ID thực rồi mới điền thành quả, không được để mọi canvas ở thư mục gốc rồi tuyên bố đã lưu trữ xong.

## Quy trình chính và các cửa xác nhận

Mỗi hàng là một giai đoạn độc lập, trước khi thực hiện đọc reference của hàng đó và kiến thức mà nó chỉ định. Đầu ra đã được xác nhận rõ ràng có thể tái sử dụng và ghi lại nguồn; "bỏ qua" phải có lý do phù hợp và người dùng lựa chọn rõ ràng. Khi dự án không liên quan đến chuyển thể nguyên tác, sự kiện theo chương, khung xương hoặc chiến lược có thể rút gọn hoặc bỏ qua theo đầu vào đã có, không được bịa ra trải nghiệm từ hư không.

| Bước | Quy trình con | Nơi đặt thành quả và kết quả cần xác nhận lần này |
| --- | --- | --- |
| 0 | [Khởi tạo dự án](references/projectSetup.md) | Canvas kịch bản: cấu hình dự án, phạm vi, thư mục và chỉ mục canvas |
| 1 | [Nguồn và sự kiện theo chương](references/sourceEvents.md) | Canvas kịch bản: chương thực tế và bảng sự kiện; xác nhận độ bao phủ nguồn và sự thật |
| 2 | [Khung xương câu chuyện](references/storySkeleton.md) | Canvas kịch bản: lõi câu chuyện, cung nhân vật, đề cương theo tập, ghi chép cắt giảm; xác nhận phương án chia tập |
| 3 | [Chiến lược chuyển thể](references/adaptationStrategy.md) | Canvas kịch bản: nguyên tắc và ranh giới chuyển thể; xác nhận các lựa chọn giữ/bỏ |
| 4 | [Kịch bản từng tập](references/episodeScript.md) | Canvas kịch bản: kịch bản hoàn chỉnh của tập này; mặc định mỗi tập xác nhận một lần, rồi mới quyết định viết tiếp tập nào |
| 5 | [Trích xuất tài sản cơ bản](references/baseAssets.md) | Canvas tài sản: nhân vật/bối cảnh/đạo cụ và các tập xuất hiện; xác nhận tái sử dụng, tạo mới và thiết lập thị giác |
| 6 | [Sản xuất ảnh tài sản](references/generateAssets.md) | Canvas tài sản: prompt và ảnh của tài sản cơ bản; trước tiên xác nhận phương án tạo, rồi xác nhận ảnh được chọn dùng |
| 7 | [Kế hoạch đạo diễn](references/directorPlan.md) | Canvas tập hiện tại: chia cảnh, thống kê lời thoại, cảm xúc, chuyển tiếp và lưu ý |
| 8 | [Phân tích tài sản phái sinh](references/deriveAssets.md) | Canvas tài sản: danh sách phái sinh của tập này và tài sản cha; xác nhận toàn bộ, một phần, điều chỉnh hoặc bỏ qua |
| 9 | [Sản xuất ảnh tài sản](references/generateAssets.md) | Canvas tài sản: ảnh phái sinh đã chọn; khi không có nhu cầu phái sinh thì ghi rõ là bỏ qua |
| 10 | [Bảng phân cảnh](references/storyboardTable.md) | Canvas tập hiện tại: cảnh → đoạn → shot, ánh xạ tài sản thực và kết quả kiểm tra |
| 11 | [Đặt bảng phân cảnh lên canvas](references/storyboardPanel.md) | Canvas tập hiện tại: theo chế độ thực tế tạo node văn bản, tham chiếu, ảnh/video; xác nhận số lượng, thời lượng và dây nối |
| 12 | [Ảnh phân cảnh](references/storyboardImages.md) | Canvas tập hiện tại: ảnh phân cảnh của chế độ khung đầu; chế độ đa tham chiếu thuần văn bản có thể bỏ qua, phải ghi lại lý do |
| 13 | [Video và bàn giao](references/videoProduction.md) | Canvas tập hiện tại: prompt/cấu hình video → kết quả tạo → chọn dùng và bàn giao, ba cửa xác nhận độc lập |

Các bước 7–13 lặp lại cho mỗi tập. Sau khi hoàn thành tập này, để người dùng chọn tiếp tục tập nào; đừng hiểu "một tập hoàn thành" là toàn bộ phim đã hoàn thành. Tài sản cơ bản có thể bổ sung đủ theo lô dựa trên kịch bản đã xác nhận, xuyên tập vẫn duy trì trong cùng một canvas tài sản.

## Kiến thức được dùng theo quy trình như thế nào

| Nội dung công việc | Kiến thức bắt buộc phải đọc | Thành quả bắt buộc phải thực hiện |
| --- | --- | --- |
| Khung xương câu chuyện, chuyển thể, kịch bản từng tập | [Phương pháp biên kịch](references/knowledge/scriptCraft.md) + thể loại của dự án này trong [Thể loại tự sự](references/knowledge/narrativeGenres.md) | Canvas kịch bản: khát khao và trở ngại của nhân vật, cung nhân vật, tiến triển cảm xúc, giải phóng thông tin, đảo ngược/cài cắm và các lựa chọn chuyển thể cụ thể |
| Thiết kế và prompt tài sản cơ bản/phái sinh | [Thiết kế tài sản](references/knowledge/assetDesign.md) + phong cách đã chọn trong [Phong cách mỹ thuật](references/knowledge/visualStyles.md) | Canvas tài sản: điểm neo nhận dạng nhân vật, không gian và màu-ánh sáng của bối cảnh, cấu trúc đạo cụ, khác biệt của biến thể, prompt có thể thực thi và phiên bản chọn dùng |
| Kế hoạch đạo diễn và phân cảnh | [Thiết kế shot](references/knowledge/shotCraft.md) + thể loại tự sự của dự án này; khi liên quan đến biểu đạt thị giác thì đọc phong cách mỹ thuật đã chọn | Canvas tập này: ý đồ shot, phạm vi thông tin có thể thấy, vị trí đứng và trục nhìn, nhịp điệu và tính liên tục, đưa vào kế hoạch đạo diễn và các shot cụ thể |
| Prompt ảnh phân cảnh và nghiệm thu | [Prompt ảnh](references/knowledge/imagePromptCraft.md) + phong cách mỹ thuật đã chọn | Canvas tập này: trạng thái khung đầu, cỡ cảnh/hướng, ánh xạ tham chiếu thực tế, prompt phù hợp model và kết quả kiểm tra |
| Prompt video và nghiệm thu | [Prompt video](references/knowledge/videoPromptCraft.md) + phương pháp biểu hiện video của phong cách mỹ thuật đã chọn | Canvas tập này: trình tự/động tác/âm thanh viết theo chế độ đã chọn, gắn tham chiếu thực, tính liên tục động và nghiệm thu từng đoạn |

Thể loại tự sự quyết định cách tổ chức thông tin, cảm xúc và shot, phong cách mỹ thuật quyết định hình dạng, chất liệu, màu-ánh sáng và cách biểu hiện, hai thứ chọn độc lập, không coi "hồi hộp" là phong cách vẽ hay coi "đất sét" là thể loại cốt truyện. Người dùng đã có lựa chọn rõ ràng thì tiếp tục dùng; chưa chọn thì dựa vào nội dung đề xuất phương án có lý do, xác nhận xong thì ghi vào cấu hình dự án.

Kiến thức không phải là sự ủy quyền thêm về cốt truyện. Giai đoạn biên kịch có thể dùng phương pháp cấu trúc và đảo ngược trong phạm vi chuyển thể người dùng cho phép; sau khi kịch bản là bản chốt, kỹ thuật thể loại chỉ hướng dẫn cách biểu hiện các sự kiện đã xác nhận, không được thêm manh mối đánh lạc hướng (red herring), đổi kết cục, hoán đổi thứ tự sự kiện hay tự thêm cảnh diễn. Ví dụ phong cách cũng không thể ghi đè danh tính nhân vật, thế giới quan và ảnh tham chiếu đã xác nhận.

Khi phương pháp chung, ngoại lệ của thể loại và mẫu model lịch sử xung đột, trước tiên đáp ứng nội dung người dùng đã xác nhận và khả năng thực của công cụ hiện tại, rồi mới áp dụng phương pháp phù hợp với dự án này. Nhịp nhanh một tuyến, độ dài shot cố định, mẫu màu da/chiều cao của phiên bản cũ không ép áp dụng cho mọi dự án; điều kiện áp dụng của phim ngắn thương mại, phim quần tượng, khoảng lặng và các biến thể đặc biệt xem trong từng tệp kiến thức.

Mỗi lần chỉ ghi **phương pháp và kết quả mà dự án này thực sự áp dụng** vào canvas tương ứng: ví dụ cảnh này giấu manh mối nào, vì sao nhân vật giữ tư thế nghiêng người, ánh sáng chính của bối cảnh đến từ đâu, những đặc trưng nào của ảnh cha giữ nguyên. Đừng chép cả tài liệu kiến thức thành node, cũng đừng chỉ ghi "đã tham khảo skill nào đó" mà không có quyết định sản xuất có thể duyệt.

## Xác nhận từng bước như thế nào

- Trước tiên ghi toàn bộ kết quả có thể duyệt của giai đoạn này vào canvas, đọc lại qua công cụ để xác nhận đã lưu; văn bản dài có thể tách node theo chương, tập, cảnh, không cắt bớt nội dung chính thức. Dùng `fitCanvas` để hiển thị kết quả lần này.
- Trong node văn bản "Nhật ký giai đoạn" của canvas hiện tại, ghi rõ giai đoạn/số tập, phiên bản đầu vào, ID node đầu ra, kết quả kiểm tra, trạng thái và các mục chờ quyết định. Trạng thái phân biệt `Bản nháp`, `Chờ xác nhận`, `Đã xác nhận`, `Đang tạo`, `Thất bại`, `Chờ rà soát lại`, `Đã bỏ qua`.
- Trình bày tên canvas và đường dẫn tương đối, tóm tắt thành quả, vấn đề cụ thể, nội dung bước tiếp theo. Dùng `askUser` nếu có để người dùng chọn "Xác nhận sang bước tiếp theo / Sửa mục chỉ định / Làm lại bước hiện tại"; khi không có công cụ hỏi thì hỏi trong hội thoại và chờ. Trước khi người dùng trả lời thì kết thúc giai đoạn này, không tạo trước node sản xuất của giai đoạn sau hay kích hoạt tạo media.
- Sau khi người dùng trả lời thì ghi lại quyết định của họ. Chỉ sửa mục người dùng chỉ định, đọc lại kết quả đã sửa rồi xác nhận; đừng coi kiểm tra đạt, câu hỏi bị hủy, bỏ qua hỏi đáp, hết thời gian hay im lặng là phê duyệt. "Tiếp tục" chỉ đẩy sang giai đoạn tiếp theo đang chờ xác nhận hiện tại.
- Cấu hình, tài sản hoặc lô tạo cụ thể mà người dùng đã xác nhận rõ ràng tiếp tục có hiệu lực, không đòi lại cùng một sự ủy quyền. Nếu người dùng ủy quyền rõ ràng một lô cùng giai đoạn cho nhiều tập, có thể thực hiện theo phạm vi đó và trình bày tập trung; khi không có ủy quyền như vậy vẫn xác nhận từng tập, không coi mục tiêu của toàn dự án là cho phép toàn bộ quy trình.
- Phương án tạo phải gồm model/chế độ thực tế, đối tượng và số lượng, prompt, tham chiếu, thời lượng/tỉ lệ khung/độ phân giải và chi phí đã biết; chi phí chưa biết thì ghi là chưa biết. Chỉ gọi tạo sau khi phạm vi lô hiện tại được xác nhận. Sau khi thất bại, trước tiên đối chiếu trạng thái thực, ứng viên thêm, đổi model hay thử lại có tính phí không được vượt quá phạm vi đã xác nhận.

## Làm tiếp, sửa đổi và thất bại

Mỗi lần làm tiếp lấy nội dung canvas và ghi chép xác nhận của người dùng làm chuẩn, không chỉ dựa vào trí nhớ của khung chat. Kết quả đã có nhưng thiếu xác nhận thì trước tiên trình bày kết quả đã có để bổ sung xác nhận, không tạo lại.

Sau khi thay đổi thượng nguồn, đánh dấu các hạ nguồn thực sự bị ảnh hưởng: kịch bản thay đổi thì kiểm tra đạo diễn/phân cảnh/video của tập này, phiên bản tài sản thay đổi thì kiểm tra phân cảnh/video tham chiếu tài sản đó. Đánh dấu chúng là chờ rà soát lại, giữ thành quả gốc và ghi chép chọn dùng, không tự động làm lại toàn bộ phim. Các xác nhận không bị ảnh hưởng vẫn tiếp tục có hiệu lực.

Khi thiếu nguồn, thư mục chưa về đúng vị trí, thiếu công cụ hoặc ghi thất bại, nêu rõ các mục cụ thể chưa hoàn thành và các bước khôi phục. Không được gói văn bản trong chat, node rỗng, đường dẫn tệp giả, đầu ra cũ hay việc tác vụ đã khởi động thành giai đoạn đã hoàn thành. Chỉ xử lý phạm vi người dùng yêu cầu lần này; khi chỉ tư vấn hoặc chỉnh sửa skill thì không tạo dự án sản xuất.
