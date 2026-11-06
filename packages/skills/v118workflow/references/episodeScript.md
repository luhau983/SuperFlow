# Kịch bản từng tập

Giai đoạn này viết từng tập kịch bản có thể sản xuất; kịch bản chính thức của tất cả các tập đều lưu thống nhất trên canvas tổng kịch bản.

## Đầu vào

- Cấu hình dự án, khung xương câu chuyện, đại cương theo tập và chiến lược chuyển thể đã xác nhận.
- Nguyên văn và sự kiện tương ứng với tập hiện tại, cùng kịch bản đã xác nhận của tập trước và trạng thái nhân vật ở cuối tập đó.
- Số tập được yêu cầu xử lý rõ ràng lần này; kịch bản tập này đã có, ý kiến sửa của người dùng và bản ghi xác nhận.

## Bắt buộc đọc trước khi thực hiện

- Phải đọc các phần "Cảm xúc, động tác và lời thoại trong một tập", "Mẫu thành phẩm có thể điền trực tiếp", "Phương pháp thẩm định và phân cấp vấn đề" của [Phương pháp biên kịch](knowledge/scriptCraft.md), và đọc lại các quyết định chênh lệch thông tin/cú lật mà tập này đã chọn dùng.
- Phải đọc quy tắc chung và thể loại chính/phụ trợ dùng cho tập này trong [Thể loại tự sự](knowledge/narrativeGenres.md). Chuyển nhịp, diễn xuất, tiết lộ thông tin, âm thanh và điều cấm kỵ của chúng thành cảnh thực tế, không được chỉ ghi "chọn dùng phong cách thể loại nào đó".

## Phương pháp thực hiện

1. Theo [Thao tác canvas](canvasOperations.md) đọc lại đầu vào và tiến độ hiện tại, định vị tập được chỉ định còn cần viết hoặc sửa.
2. Mỗi lần tập trung một tập, trích xuất nguồn, chức năng kịch tính, lõi cảnh, quyết định cắt giảm và điểm kết thúc của nó; tập cuối khép lại theo kết cục đã xác nhận, không gượng tạo móc câu cho tập sau.
3. Nối tiếp thời gian, địa điểm, quan hệ nhân vật, ngoại hình và trạng thái đạo cụ then chốt của tập trước; không tạo lại toàn bộ các kịch bản đã hoàn thành.
4. Tổ chức các cảnh cụ thể, để động tác, lời thoại và thay đổi cảnh thúc đẩy cốt truyện; miêu tả tâm lý chuyển thành hành vi thể hiện được hoặc OS/VO cần thiết.
5. Ghi rõ số cảnh, địa điểm, thời gian/nội ngoại cảnh, nhân vật trong cảnh, động tác và biểu cảm, lời thoại, âm thanh cần thiết và chuyển cảnh.
6. Ước tính thời lượng theo cấu hình; khoảng 150 chữ/phút chỉ dùng làm tham chiếu cho lời thoại, động tác và khoảng dừng tính riêng, không được coi quy đổi số chữ là đo thực tế.
7. Kiểm tra thông tin mới, thay đổi xung đột và kỳ vọng ở cuối của tập này; thiết kế kỹ thuật shot để lại cho giai đoạn đạo diễn và phân cảnh phía sau.
8. Khi sửa tập này chỉ cập nhật nội dung được chỉ định, và rà lại sự nối tiếp với tập trước và đại cương tập sau.
9. Cảnh hành động nêu rõ mục tiêu/trở ngại/lựa chọn/kết quả; cảnh đời thường, chuyển tiếp và khoảng trống ghi lại tác dụng thực tế về quan hệ, thời gian, thông tin hoặc cảm xúc, không gượng tạo trở ngại và lựa chọn. Chọn kênh biểu đạt cảm xúc và viết ra động tác diễn được, kiểm tra lời nói bề mặt và ý định thật của lời thoại, ai biết gì, khi nào tiết lộ thông tin, giữ lại im lặng và đời thường có chức năng thể loại.

## Ghi vào canvas kịch bản

Vị trí mặc định là `Canvas/Kịch bản.json` trong workspace; mỗi tập một node kịch bản chính thức rõ ràng, định vị được.

- Tiêu đề node gợi ý là "Kịch bản Tập 001 | Tiêu đề tập", tiêu đề chính văn giữ tên tác phẩm, số tập và tiêu đề tập.
- Khi cùng một tập đã có node thì sửa tại chỗ; không được coi "bản sửa", "bản chốt" là một tập mới để tạo lặp.
- Node kịch bản đã xác nhận là nguồn sản xuất của tập đó; về sau `Canvas/Tập/Tập 001.json` ghi lại định vị nguồn thật của nó.
- Giai đoạn này không chuyển kịch bản chính thức sang canvas tập riêng, cũng không tạo kho tài sản mới cho mỗi tập.
- Trên cùng canvas, node văn bản "Quyết định sáng tác Tập 001" lưu nhịp thể loại của tập, thay đổi cảm xúc/thông tin từng cảnh, việc thực hiện phục bút, thay đổi khoảng cách quan hệ/quyền lực, âm thanh then chốt và căn cứ ước tính thời gian; trích dẫn các quyết định đã có, không kẹp phân tích và tham số mô hình vào chính văn kịch bản.
- Kịch bản chính thức thực hiện các quyết định trên thành động tác, lời thoại, im lặng, âm thanh cần thiết và chuyển cảnh; phương án đạo diễn từng tập phía sau đọc quyết định sáng tác rồi mới thiết kế shot, không được chỉ dựa vào nhãn thể loại mà biên kịch lại cốt truyện.

Chính văn kịch bản tối thiểu gồm:

```text
Tên tác phẩm EP001: Tiêu đề tập
Thời lượng mục tiêu / Tỉ lệ khung / Phong cách
Tóm tắt cốt truyện: xung đột chính, bước ngoặt then chốt và thay đổi cảm xúc của tập này
1-1 Tên bối cảnh Ngày/Nội
Nhân vật: các nhân vật thực tế xuất hiện trong cảnh này
△Môi trường, động tác, biểu cảm cụ thể và đạo cụ cần thiết
Tên nhân vật: lời thoại
OS/VO: độc thoại nội tâm hoặc lời ngoài khung hình cần thiết
Chuyển cảnh và cảnh tiếp theo; điểm kết thúc của tập này
```

## Cổng chất lượng và xác nhận

- Tập hiện tại nhất quán với đại cương và chiến lược đã xác nhận; không tự ý thêm, bỏ sót hoặc viết lại các tập khác.
- Số cảnh, nhân vật, thời gian địa điểm rõ ràng; động tác thể hiện được; lời thoại giữ giọng nhân vật; không có bước nhảy cốt truyện vô căn cứ.
- Thời lượng dự kiến phù hợp mục tiêu; trạng thái nhân vật, đạo cụ và tập trước sau liên tục; không bỏ sót chuyển cảnh và âm thanh cần thiết.
- Dùng các điểm kiểm tra cụ thể của thể loại đã đọc để đối chiếu chính văn: ví dụ hài có trải đường/cú chốt/phản ứng không, manh mối trinh thám có truy ngược được không, tình cảm ấm áp có dùng hành động thể hiện sự quan tâm không; không được chỉ kiểm tra định dạng chung.
- Sau khi ghi, đọc lại toàn bộ chính văn, kiểm tra nội dung không bị cắt cụt, node đúng chỗ, rồi trình bày tóm tắt và vấn đề của tập này.
- Sau khi mỗi tập hoàn thành, chờ người dùng xác nhận rõ ràng rồi mới đẩy tiếp tập sau hoặc giai đoạn hạ nguồn; nếu đã có ủy quyền theo lô rõ ràng thì thực hiện theo phạm vi đó.
- Không coi thông báo hoàn thành, sự im lặng của người dùng hay tự kiểm nội bộ đạt là xác nhận.

Kịch bản đã xác nhận có thể vào [Danh sách tài sản cơ bản](baseAssets.md); các tập còn lại tiếp tục quy trình này theo phạm vi đã được ủy quyền.

## Căn cứ bản cũ

`data/skills/script_execution_script.md`, `data/skills/script_agent_decision.md`, `src/agents/scriptAgent/index.ts`.
