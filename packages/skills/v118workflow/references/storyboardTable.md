# Bảng phân cảnh từng tập và duyệt

Chỉ chuyển kịch bản và kế hoạch đạo diễn đã xác nhận thành phân cảnh có thể thực hiện. Thao tác xem [canvasOperations.md](canvasOperations.md).

Trước khi bắt đầu, đọc đầy đủ [Kiến thức thiết kế shot, diễn xuất và duyệt](knowledge/shotCraft.md) và thể loại đã xác nhận trong [Thể loại tự sự](knowledge/narrativeGenres.md), đọc lại phương pháp thể loại mà kế hoạch đạo diễn đã chọn dùng, thực sự dùng các phương pháp cỡ cảnh/góc máy/chuyển động máy, liên tục không gian, tính thời gian lời thoại, tiết lộ thông tin và phân cấp vấn đề trong đó để xử lý tập này. Khi liên quan đến biểu hiện phong cách chỉ tra các mục đã xác nhận trong [Phong cách hình ảnh](knowledge/visualStyles.md); không được thêm các ví dụ trong kiến thức thành cốt truyện.

## Đầu vào và nơi lưu

- Kịch bản chính thức lấy từ `Canvas/Kịch bản.json`; kế hoạch đạo diễn lấy từ canvas của tập hiện tại, ví dụ `Canvas/Tập/Tập 001.json`.
- Tài sản khả dụng và ảnh đã xác nhận lấy từ `Canvas/Tài sản.json`, kiểm tra tham chiếu node thật, trạng thái cơ bản và trạng thái phái sinh.
- Bảng phân cảnh đầy đủ, các vấn đề thẩm định và bản ghi xác nhận lưu trên canvas của tập hiện tại; không sửa kịch bản chính thức hay tạo media ở đây.
- Khi thiếu đầu vào ảnh hưởng tới việc thực hiện về sau, ghi lại chỗ thiếu và quay về giai đoạn tương ứng; không được bịa ID tài sản hoặc coi ảnh còn thiếu là ảnh đã có.

Khi người dùng đã chọn tạo một phần hoặc bỏ qua phái sinh, theo [Quy tắc bàn giao phái sinh](deriveAssets.md#bàn-giao-sau-khi-tạo-một-phần-hoặc-bỏ-qua) phân biệt ảnh khả dụng và trạng thái chưa tạo. Có thể giữ bản nháp phân cảnh đầy đủ và các trạng thái cần thiết, nhưng tham chiếu chỉ điền phiên bản thực sự khả dụng; các shot bị ảnh hưởng đánh dấu là chờ tư liệu, không đánh giá cả bản nháp là sẵn sàng sản xuất, cũng không tự ý khởi động lại việc tạo đã bỏ qua.

Năng lực mô hình có thể truy vấn qua `node:getConfig` của node video đã có. Khi chưa có năng lực để truy vấn, viết bản nháp kế hoạch theo mức 15 giây và ghi rõ "Chờ kiểm định mô hình", không tạo trước cả loạt node media chỉ để tra tham số; trước khi chuyển sang node sản xuất phải bổ sung đủ xác nhận mô hình/chế độ, phát hiện xung đột về thời lượng hoặc giới hạn tham chiếu thì sửa các phân cảnh bị ảnh hưởng và xác nhận lại.

## Phương pháp tách

1. Theo thứ tự kịch bản đã xác nhận bao phủ các cảnh và sự kiện then chốt, đưa khoảnh khắc cảm xúc, neo nhất quán và chuyển tiếp đã xác nhận trong kế hoạch đạo diễn vào shot.
2. Chia đoạn theo bước ngoặt cảm xúc, chuỗi động tác hoặc chuyển đổi người nói; giới hạn mỗi đoạn lấy giá trị nhỏ hơn giữa 15 giây của v1.1.8 và giới hạn của mô hình hiện tại.
3. Khi tái hiện SOP v1.1.8, mặc định ước tính thô 4 chữ/giây theo tầng thực thi, rồi theo mức thẩm định cũ thêm khoảng dừng cần thiết và tổng biên đầu cuối khoảng 1 giây. 3/2 chữ/giây trong kiến thức shot là phương pháp tùy chọn cho diễn xuất chậm; khi người dùng đã có yêu cầu về tốc độ nói/diễn xuất thì dùng tiếp, nếu không thì trước tiên trình bày ảnh hưởng của nó tới độ dài shot và số đoạn rồi xác nhận, không lặng lẽ đổi mức mặc định. Thực tế đọc không hết vẫn phải báo ra và điều chỉnh phương án, không được xóa chữ hoặc bỏ qua khoảng dừng để nhồi vào thời lượng.
4. Khi lời thoại dài hoặc VO trong cùng đoạn vượt quá 20 chữ, ưu tiên tách thành các shot liên tục theo chỗ ngắt nghĩa và thay đổi cỡ cảnh/góc nhìn, có thể dùng shot phản ứng của người nghe để tiếp nối âm thanh.
5. Ngữ nghĩa không thể cắt thì giữ trọn, gánh bằng diễn tiến động tác hoặc chuyển động máy; vượt dung lượng đoạn thì chia lại đoạn, không kéo dài thời lượng một cách tĩnh.
6. Chọn cỡ cảnh, góc quan sát và chuyển động máy theo thông tin mà shot này cần truyền đạt, nói rõ phạm vi cắt khung, khung mở đầu, đường đi và khung kết thúc; mô tả hình ảnh viết động tác, tư thế, biểu cảm và thay đổi trạng thái nhìn thấy được, ngoại hình cố hữu của nhân vật do tài sản đã xác nhận đảm nhận.
7. Mỗi cảnh lập chuẩn trái phải trước sau, hướng quay, ánh mắt và vật cầm của nhân vật, di chuyển/vượt trục ghi rõ căn cứ thay đổi. Giữ vị trí dễ hiểu của các nhân vật có mặt trong shot hoặc đoạn liền kề, cận cảnh không nhồi cả nhóm; các đoạn liền kề ghi rõ sự tiếp nối về động tác, cảm xúc, ánh mắt hoặc âm thanh.
8. Lời thoại, OS, VO, thông báo hệ thống và chữ trên màn hình cần truyền đạt được giữ nguyên từng chữ, ghi rõ nguồn; không thêm lời thoại hay tình tiết ngoài kịch bản.
9. Hiệu ứng âm thanh theo nhu cầu ghi âm môi trường và âm động tác cụ thể, không tự ý thêm nhạc nền; dùng tiếp ảnh bối cảnh, không viết thêm ánh sáng xung đột với nó.

## Định dạng đầu ra

Tổ chức theo "Cảnh → Đoạn → Shot", tham chiếu tài sản đặt ở cấp đoạn, dùng định danh canvas/node thực tế của host hiện tại.

```markdown
## Cảnh 1: Tên bối cảnh | Nhân vật tham gia: Nhân vật A, Nhân vật B
### Đoạn 1 (khoảng 10s)
Tên tài sản tham chiếu: Nhân vật A, Nhân vật B, Bối cảnh
Tài sản tham chiếu: tham chiếu canvas/node thật tương ứng
| STT | Mô tả hình ảnh | Thời lượng | Cỡ cảnh | Chuyển động máy | Lời thoại | Hiệu ứng âm thanh |
|---|---|---|---|---|---|---|
```

Hướng quay, quan hệ không gian, động tác ghi vào mô tả hình ảnh, không yêu cầu các cột độc lập mà bản cũ đã bỏ.
Thời lượng mỗi shot là giá trị số rõ ràng, thời lượng đoạn bằng tổng thời lượng các shot trong đó, giữ số shot liên tục và ranh giới cảnh rõ ràng.
Cùng một nhân vật trong một đoạn chọn dùng trạng thái cơ bản hoặc phái sinh khớp với cốt truyện, không được nhầm trạng thái cha con thành hai người.

Trong phần ghi chú phân cảnh đã có của tập này bổ sung các căn cứ thiết kế cần thiết: vì sao shot then chốt chọn cỡ cảnh/chuyển động máy đó, thông tin sẵn có mà shot đó cho khán giả biết hoặc tạm chưa biết, nhịp thể loại được thể hiện thế nào, số chữ và ước tính thời gian theo tốc độ nói/khoảng dừng của lời thoại dài, chuẩn không gian và điểm thay đổi mỗi cảnh, trạng thái kết thúc của đoạn đến trạng thái bắt đầu của đoạn sau. Trạng thái cuối chưa tạo đánh dấu là kế hoạch; đây là ghi chú đọc được, không thêm trường schema công cụ, cũng không thay đổi cấu trúc bảng bảy cột.

## Duyệt sau khi ghi

1. Đọc lại bảng phân cảnh thực tế trên canvas, và đối chiếu với kịch bản chính thức, kế hoạch đạo diễn và nguồn tài sản, không được chỉ duyệt tóm tắt chat.
2. Kiểm tra lời thoại không bị xóa sửa chút nào, sự kiện các cảnh được bao phủ toàn bộ, thứ tự đúng, các trường bắt buộc của mỗi shot đầy đủ.
3. Kiểm tra tham chiếu tài sản là thật, liên kết nhân vật và bối cảnh nhận diện được là đúng, việc dùng trạng thái phái sinh phù hợp cốt truyện, không hư cấu ảnh khả dụng.
4. Theo kiến thức shot kiểm tra tổng shot, giới hạn đoạn, dung lượng lời thoại, nhịp diễn xuất và tính liên tục không gian/động tác; các mục vi phạm năng lực thực thi phải chỉ rõ, không được coi heuristic cũ shot đơn 8 giây/shot dài 12 giây là bảo đảm của mô hình hiện tại.
5. Báo cáo chỉ liệt kê vấn đề, theo mức Nghiêm trọng/Trung bình/Nhẹ định vị từng cảnh/đoạn/số shot, kèm nguyên văn thực tế hoặc tham chiếu, ảnh hưởng và đề xuất sửa; ghi báo cáo ngược vào tập này, không tự ý sửa kịch bản đã xác nhận. Tổng quan A/B/C/D cũ là tùy chọn, không thay được bằng chứng hay xác nhận của người dùng.

## Điểm xác nhận

Trình bày bảng phân cảnh và báo cáo vấn đề cho người dùng, ghi lại phạm vi cụ thể của "Thông qua / Sửa theo chỉ định / Làm lại".
Sau khi sửa, đọc lại và rà soát phần bị ảnh hưởng; sau khi người dùng xác nhận thì lưu bản ghi, rồi dừng giai đoạn này.
Chưa xác nhận bảng phân cảnh thì không tạo lô media có thể thực thi, không khởi động tạo ảnh phân cảnh hay video.
Nguồn và khác biệt với cấu trúc bảng cũ xem [sourceMap.md](sourceMap.md).
