# Trạng thái, sửa đổi và giao nộp

> **Ranh giới sử dụng với Seedance:** File này chỉ ghi lại phiên bản, kết quả tạo thực tế, việc chọn dùng và giao nộp. Nó không được viết lại các quy tắc prompt đã xác định trong PART A của `SKILL.md` chính; mọi sửa đổi prompt Seedance phải quay về PART A.

Sản xuất nhiều giai đoạn hoặc qua nhiều lượt dùng một file trạng thái gọn và một node văn bản tổng quan trên canvas. Ưu tiên dùng tiếp sổ theo dõi sẵn có của dự án và đường dẫn chính xác, bao gồm `production-state.md` bản cũ; dự án mới có thể dùng `productionState.md`, nhiều tập thì lưu trong thư mục con riêng của từng tập trong dự án. Tác vụ văn bản đơn lẻ đơn giản không bắt buộc lập cả bộ Trạng thái sản xuất.

File trạng thái ghi sự thật và chỉ mục, tổng quan chỉ hiển thị phạm vi hiện tại, thành phẩm hợp lệ, tiến độ, mục còn thiếu và bước tiếp theo. Nội dung chuyên môn vẫn nằm trong các node văn bản tương ứng, không sao chép vào toàn bộ sổ theo dõi. Chỉ thêm bản ghi khi có thành phẩm thực tế, không dựng sẵn nhiều bảng rỗng hay thư mục rỗng.

## Tối thiểu cần ghi những gì

```markdown
# Trạng thái sản xuất

Mục tiêu và phạm vi lần này:
Đường dẫn canvas hiện tại và file trạng thái:
Phiên bản kịch bản nguồn hoặc nguyên văn, phạm vi chọn dùng:
Giai đoạn hiện tại, phạm vi sản xuất liên tục đã được ủy quyền, việc cần xử lý:

## Thành phẩm
| Định danh | Mục đích/cảnh | Phiên bản | Canvas/node | Đường dẫn nội dung hoặc media hiện tại | Phiên bản cố định được chọn dùng | Phụ thuộc đầu vào | Trạng thái và căn cứ xác nhận |
|---|---|---|---|---|---|---|---|

## Lần thử tạo
| Định danh lần thử cục bộ | Tài sản/đoạn, node | Ảnh chụp prompt | Mô hình và đầy đủ tham số hiệu lực | File tham chiếu, phiên bản, thứ tự và mục đích | Output trước khi gọi | Phạm vi ủy quyền và số lần còn lại | Phản hồi và file thực tế |
|---|---|---|---|---|---|---|---|

## Chọn dùng đoạn
| Đoạn và phạm vi cốt truyện | Video lần này và lần thử tạo | Quyết định chọn dùng và khoảng dự kiến dùng | Trạng thái kết thúc thực tế và nguồn | Mục Agent đã kiểm tra/chưa kiểm tra | Phụ thuộc về sau |
|---|---|---|---|---|---|

## Giao nộp
File giao nộp thực tế và chỉ mục:
Phạm vi đã tạo/đã chọn dùng/đã ghép/đã gom về:
Mục còn thiếu và đầu vào cần để tiếp tục:
```

Lấy trường theo tác vụ, không bắt buộc lần nào cũng điền đủ mọi bảng. Phong cách sản xuất, phương án âm thanh và thông số có thể để trong bản tóm tắt và đánh chỉ mục ở đây. Định danh lần thử là bản ghi cục bộ, không được coi là task ID mà host chưa trả về. Đường dẫn được tuyên bố là tồn tại phải đến từ việc đọc, ghi thực tế hoặc từ node trả về.

## Phiên bản đã xác nhận không thể chỉ trỏ tới nội dung có thể thay đổi

Khi chuẩn bị nộp để duyệt, lưu một ảnh chụp lịch sử độc lập của nội dung phiên bản đó và trình bày đúng phiên bản cụ thể này; xác nhận của người dùng gắn với ảnh chụp này. Khi người dùng đã chỉ định rõ nguyên văn bản chốt thì có thể cố định trực tiếp nguyên văn đó. Ảnh chụp chỉ làm căn cứ lịch sử, không chỉnh sửa hai chiều, và không chỉ bổ sung lưu khi Agent sắp sửa.

Sau khi nhận xác nhận, đọc lại node hiện tại. Nếu nội dung bị người dùng sửa trong lúc chờ, xác nhận ban đầu vẫn ứng với phiên bản đã nộp, không thể tiện thể phê duyệt nội dung sau đó; liệt kê khác biệt và xử lý theo ý người dùng, ảnh chụp lịch sử giữ nguyên. Khi file đã xác nhận trước đây không có ảnh chụp, trước tiên so sánh với nội dung xác nhận có thể lấy được, lịch sử không thể khôi phục thì đánh dấu "căn cứ phiên bản cần xác minh", không lấy file hiện tại giả làm bản cũ.

File lịch sử chỉ đọc sẵn có có thể dùng lại trực tiếp; công cụ đọc ghi thông thường không đảm bảo người dùng mãi mãi không sửa được ảnh chụp, khi đọc phát hiện không nhất quán cũng phải đối chiếu. Khi không có khả năng ghi file nhưng có thể giữ node văn bản độc lập, giữ node cũ và tạo thêm ứng viên, ghi nhận riêng node và đường dẫn thực tế; khi không thể lưu lịch sử thì không ghi đè nội dung vẫn đang được chọn dùng, và nêu rõ giới hạn cụ thể.

Trước khi tạo, lưu ảnh chụp prompt đầy đủ thực tế, tham số, tham chiếu và ủy quyền; chỉnh sửa sau đó không ghi ngược vào lần thử này. Phiên bản prompt và phiên bản kết quả tách riêng: sửa chữ không có nghĩa video cũ được tạo từ chữ mới. Việc rà soát trước khi thực thi cụ thể theo [thực thi canvas](canvasExecution.md).

## Media đã chọn dùng và sửa đổi cục bộ

File đã chọn dùng được gắn vào node tư liệu độc lập, ghi đường dẫn thực tế và mục đích. Sửa ảnh hoặc video thì dùng node tạo ứng viên mới, sau khi chọn dùng mới cập nhật những hạ nguồn thực sự cần bản mới; giữ lại file, node, prompt đã chọn dùng cũ và quan hệ lịch sử, không chuyển trước các đoạn vẫn phụ thuộc kết quả cũ.

Mỗi thay đổi đều tra ảnh hưởng theo phụ thuộc đầu vào thực tế: ngoại hình nhân vật ảnh hưởng các đoạn dùng trạng thái đó, lời thoại ảnh hưởng dung lượng và khẩu hình của đoạn tương ứng, không gian hoặc hành động ảnh hưởng chỗ giao nối liền kề. Kết quả không bị ảnh hưởng tiếp tục có hiệu lực. Khi bản mới tương thích chỉ cập nhật quan hệ tương ứng, khi cần tạo lại thì nêu phạm vi bị ảnh hưởng và phương án cụ thể.

Khi xử lý phản hồi thực tế về Seedance, dùng A8, A11.4, A12.18.1 và các điều khoản A0–A12 tương ứng trong PART A của `SKILL.md` chính để định vị các vấn đề về tham chiếu, hành động, không gian, âm thanh, diễn xuất, ánh sáng màu sắc, đạo cụ và hình bị vỡ; khi cần sửa prompt thì quay về mục bị ảnh hưởng trong PART A để xử lý. **Cấm gọi thêm phương pháp shot/diễn xuất độc lập để lập bộ quy tắc sửa đổi thứ hai.** Đừng xử lý mọi vấn đề bằng cách thêm tính từ, thiết kế lại tài sản hoặc chạy lại cả phim.

Tài sản cũ người dùng đã chọn dùng rõ ràng thì dùng lại trực tiếp, không yêu cầu làm lại ảnh cho mẫu mới. Khi thiếu sổ theo dõi có thể dựng lại chỉ mục đã biết từ tài liệu người dùng chỉ định và canvas thời gian thực; xác nhận, tham số tạo hoặc nguồn chưa biết thì ghi là chưa biết, không đoán chọn dựa vào tên "bản cuối", thời gian sửa đổi hay số phiên bản lớn nhất.

## Kiểm định và chọn dùng

Khi đọc ảnh, kiểm tra thân phận, số lượng, góc nhìn cần thiết, trang phục và vật, quan hệ môi trường và chữ có thể đọc. Chỉ công cụ báo thành công không chứng minh ảnh đạt yêu cầu; tư liệu phù hợp mà người dùng đã chấp nhận rõ ràng thì không yêu cầu chọn dùng lại.

Video kiểm tra cốt truyện, lời thoại và người nói, OS/VO, thân phận và quan hệ có mặt, tiếp xúc động tác, vật cầm và tính liên tục không gian, âm thanh và thông số đầu ra; đồng thời kiểm tra lỗi lộ của việc tạo thực tế: mặt/kiểu tóc/trang phục nhân vật bị trôi, chi/ngón tay thừa hoặc thiếu, tay và mặt dính vào nhau, nhân vật hoặc đạo cụ xuyên qua nhau, đạo cụ then chốt lóe hiện/biến mất/nhân bản/đổi tay, kích thước và cấu trúc biến đổi đột ngột, cấu trúc bao bì sản phẩm bị chảy, gương/kính/bóng đổ xuất hiện bản sao sai. Với các đoạn liên tiếp, trước tiên theo A8 của PART A nhúng để xác định có thực sự liên quan không: có liên quan mới so sánh vị trí thế giới, tư thế, hướng, vật cầm của nhân vật và trạng thái môi trường; không liên quan thì chỉ kiểm định đoạn này. Phạm vi kiểm tra phụ thuộc vào năng lực thực tế của lượt này: đường dẫn file, trình phát, file tồn tại hoặc khung hình tĩnh đều không chứng minh Agent đã xem toàn phim, đã nghe track âm thanh. Video người dùng tải lên cũng phải xác nhận mô hình/công cụ thực tế đọc được, không mặc định có tệp đính kèm là đã duyệt phim xong.

Khi không có khả năng đọc video, nhờ người dùng xem trước kết quả hiện tại, báo vấn đề rõ ràng, có chọn dùng không, và trạng thái kết thúc mà đoạn tiếp theo thực sự phụ thuộc. Ghi "người dùng xem trước và chọn dùng" và các mục Agent chưa kiểm định, không yêu cầu bảng hỏi chất lượng không liên quan. Quyết định chọn dùng, phản hồi vấn đề và trạng thái kết thúc có thể lấy trong cùng một lần trả lời.

Đoạn liên tiếp phải có căn cứ thực tế: vị trí và hướng nhân vật, vật cầm và tiến độ hành động, sự kiện đã xảy ra, thay đổi ngoại hình và âm thanh kéo dài. Dùng video có thể xem, khung nối cảnh thực hoặc phản hồi của người dùng, không lấy trạng thái cuối trong kế hoạch giả làm trạng thái cuối thực tế. Viết chúng thành sự thật ban đầu rõ ràng của đoạn sau; kết quả hiện tại sai thì xử lý đoạn hiện tại trước, không nâng lỗi lộ thành cốt truyện mới.

Chỉ trích khung hoặc gắn media đoạn trước khi thực sự cần và công cụ hỗ trợ; đừng vì quy trình mà yêu cầu người dùng chụp thêm ảnh màn hình vô dụng. Đoạn không có phụ thuộc thời gian - không gian có thể tiến hành theo kế hoạch đã xác nhận và ủy quyền theo lô cụ thể, kết quả vẫn kiểm định và chọn dùng riêng.

## Giao nộp theo phạm vi hoàn thành thực tế

- Chỉ cần văn bản: giao văn bản hiện tại, node tương ứng hoặc file thực và các mục thiếu cần thiết.
- Video theo đoạn: giao các đoạn đã chọn dùng, thứ tự, căn cứ tạo thực tế, khoảng dự kiến dùng và mục thiếu. Tổng thời lượng tư liệu đã tạo không bằng thời lượng đo thực tế của phim đã dựng.
- Phim hoàn chỉnh duy nhất: chỉ thực hiện khi thực sự có công cụ dựng, cắt, trộn âm hoặc xuất và người dùng đã ủy quyền; nếu không thì nêu còn cần những công đoạn hậu kỳ nào, không gọi hai đường link tư liệu là phim hoàn chỉnh.
- Thư mục giao nộp: chỉ khi có khả năng sao chép nhị phân thực sự mới sao chép tư liệu đã chọn dùng vào thư mục đích trong dự án và kiểm định. `write` văn bản thông thường không sao chép được ảnh hay video; năng lực không đủ thì giao chỉ mục file nguồn và đánh dấu chờ gom về.

Gom về giữ nguyên bản gốc, khi nội dung giao nộp cũ khác thì dùng thư mục phiên bản mới, tránh lẫn tư liệu bị loại. Bản giao nộp không thay đổi và đã kiểm định thì dùng lại trực tiếp, không sao chép lặp lại. Giao nộp mặc định không bao gồm phát hành, tải lên hay dọn file nguồn; những việc này thực hiện theo phạm vi thực tế người dùng chỉ định riêng.

Câu trả lời cuối cùng nêu đã làm được gì, node/file thực ở đâu, nội dung nào do ai kiểm định, và bước tiếp theo cần thiết duy nhất. Việc chọn dùng toàn bộ đoạn, ghép phim, gom thư mục được ghi nhận riêng theo thực tế, không vì tổng quan hay danh sách đã xong mà đổi mọi trạng thái thành hoàn thành.
