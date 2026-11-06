# Thiết kế tài sản, biến thể và phương pháp viết prompt

Tệp này hợp nhất các ràng buộc thị giác về nhân vật, bối cảnh, đạo cụ, ba loại phái sinh và hình ảnh/video của từng phong cách vẽ trong v1.1.8. Trước khi trích xuất tài sản, hãy đọc "Cơ sở thiết kế và ghi chép trên canvas"; làm loại tài sản nào thì đọc thêm chương, mẫu và mục nghiệm thu tương ứng. Việc chọn phong cách vẽ và khác biệt giữa chúng xem [visualStyles.md](visualStyles.md), thao tác công cụ canvas thực tế xem [canvasOperations.md](../canvasOperations.md).

## Cơ sở thiết kế và ghi chép trên canvas

Bản ghi chính duy nhất của mọi tài sản đặt trong `Canvas/Tài sản.json`; `Canvas/Kịch bản.json` cung cấp nguồn sự thật, các canvas sản xuất theo tập chỉ tham chiếu phiên bản đã xác nhận. Tệp kiến thức cung cấp phương pháp thiết kế, không thay kịch bản thêm nhân vật, đạo cụ hay tình tiết mới.

Trước hết phân biệt ba loại thông tin: sự thật rõ ràng trong kịch bản, tham chiếu do người dùng đưa, và lựa chọn mỹ thuật còn chờ xác nhận. Kiểu tóc, trang phục hay cấu trúc chưa biết có thể đề xuất phương án cụ thể, nhưng phải đánh dấu là đề xuất. Phong cách vẽ không thể thay thế cá tính nhân vật, càng không được áp các giá trị mặc định về giới tính, chiều cao, màu da và ngũ quan của mẫu cũ cho mọi nhân vật.

Mỗi node mô tả tài sản tối thiểu lưu thẻ thiết kế dưới đây; đây là yêu cầu về nội dung, không phải trường node bịa ra.

| Hạng mục | Nội dung ghi chép |
|---|---|
| Danh tính và nguồn gốc | Tên duy nhất/bí danh, loại, tập và cảnh xuất hiện, căn cứ kịch bản hoặc tham chiếu của người dùng |
| Nhận diện cốt lõi | Khuôn mặt/kiểu tóc/đường nét của nhân vật, bố cục và mốc nhận diện của bối cảnh, hình dạng và chức năng của đạo cụ |
| Quy ước thị giác | Phong cách sử dụng, bảng màu cụ thể, cách thể hiện chất liệu, nền và cách trình bày |
| Nguồn sáng và bố cục | Vị trí sáng cơ bản, mềm hay cứng, quan hệ sáng tối, góc nhìn/vị trí máy và chi tiết cần nhìn rõ |
| Sự thật và đề xuất | Những gì đã xác nhận, những gì là lựa chọn chờ xác nhận để bổ sung thông tin thị giác |
| Biến thể | Tham chiếu thật tới tài sản cha và ảnh cha, các hạng mục không đổi, phần duy nhất được phép thay đổi, tập và cảnh áp dụng |
| Thực thi và chọn dùng | Prompt cuối cùng, đầu vào tham chiếu thực tế, phạm vi tham số đã xác nhận, tham chiếu ảnh ứng viên và ảnh được chọn, trạng thái |

Xác nhận thiết kế có thể tái sử dụng trước, rồi mới viết prompt tạo. Thay đổi nhân vật cơ bản, bố cục không gian hay phong cách sẽ ảnh hưởng tới hạ nguồn: ghi lại các biến thể và phân cảnh bị ảnh hưởng, quay về điểm xác nhận tương ứng để xử lý, không được ghi đè bản ghi chính rồi giả vờ hạ nguồn vẫn còn hiệu lực.

## Nhân vật: nhận diện trước, tạo hình sau

### Xây dựng nhân vật cơ bản có khác biệt

Dùng danh tính, giai đoạn tuổi, môi trường sống, tính cách và chức năng trong cốt truyện để suy ra ngoại hình, không dùng "đẹp/điển trai/chất lượng cao" thay cho thiết kế. Xác định ít nhất hai ba đặc điểm có thể nhận ra ở mọi góc, tránh để các nhân vật khác nhau dùng chung một khuôn mặt mẫu.

| Chiều | Lựa chọn có thể quan sát |
|---|---|
| Đường nét đầu mặt | Dài/tròn/vuông, quan hệ gò má và hàm dưới, độ rộng trán, hình cằm; không chỉ thay tên |
| Cấu trúc ngũ quan | Dáng mày, khe mắt và khoảng cách hai mắt, chỗ gãy sống mũi, dáng môi, vành tai; giữ tổ hợp thay vì chồng chất "tinh xảo" |
| Đặc điểm da tóc | Màu da, đường chân tóc, màu tóc, độ dài, ngôi rẽ, xoăn hay thẳng, râu, nốt ruồi nhỏ hoặc sẹo do thiết lập quyết định |
| Dáng người | Quan hệ chiều cao, vóc dáng, vai cổ, trọng tâm và tư thế đứng tự nhiên; trẻ em, người già... tuân theo tuổi thực |
| Trang phục cơ bản | Quần áo và giày hoàn chỉnh khớp với thời đại, thân phận, nghề nghiệp và trạng thái thường ngày, tiện cho việc thay đồ sau này |
| Khí chất | Thể hiện qua ánh nhìn, độ thả lỏng của mày mắt, khoé miệng và tư thế đứng; ảnh cơ bản chủ yếu dùng vi biểu cảm trung tính |

Phim điện ảnh đô thị người thật có thể dùng các hướng quan sát như lạnh lùng tiết chế, dịu dàng lắng nghe, gọn gàng tháo vát, trẻ trung thẳng thắn, từng trải đời phố chợ: lần lượt thay đổi cốt tướng, ánh mắt, biểu cảm và dấu vết cuộc sống; không gắn cố định các hướng này với một giới tính, màu da hay chiều cao nào. Giữ kết cấu da tự nhiên, tóc con và độ bất đối xứng vừa phải, tránh để mọi nhân vật đều thành người mẫu quảng cáo đã chỉnh sửa kỹ.

### Cận cảnh khuôn mặt cộng bản vẽ ba góc nhìn hoàn chỉnh

Cùng một khung hình trình bày từ trái sang phải: cận cảnh khuôn mặt, toàn thân chính diện, toàn thân nghiêng, toàn thân sau lưng. Cận cảnh lấy từ đỉnh đầu đầy đủ tới gần xương quai xanh, khuôn mặt đủ lớn; ba toàn thân lấy đủ từ đỉnh đầu tới lòng bàn chân, không cắt mất trang sức tóc, vạt áo và giày. Góc nghiêng khoảng 90°, sau lưng khoảng 180°, đặc điểm trước sau trái phải tương ứng với nhau.

- Cùng một người, cùng kiểu tóc, cùng vóc dáng, cùng một bộ quần áo; vị trí cúc áo, vạt áo, hoa văn, túi, thắt lưng, giày và phụ kiện nhất quán.
- Nền đơn giản có độ sáng khác biệt với chủ thể, ánh sáng đều nhưng vẫn giữ được cấu trúc. Thường dùng xám nhạt; hoạt hình Nhật có thể dùng trắng ngà, 2D cổ phong có thể dùng trắng ánh trăng, đất sét có thể dùng kem sữa ấm, phim điện ảnh đô thị người thật có thể dùng phông giấy xám trung tính.
- Nhánh người thật được hiểu là ghi lại bốn góc trong cùng một buổi chụp studio nhân vật, giữ trọng tâm tự nhiên, không dùng tư thế đứng nghiêm như ma-nơ-canh; 3D/2D thể hiện bằng chất liệu tương ứng, không trộn thuật ngữ nhiếp ảnh.
- Khung ngang rộng tiện xếp cạnh nhau, nhưng chỉ chọn tỉ lệ mà mô hình hiện tại thực sự hỗ trợ. Nếu một lần xuất không chứa được rõ ràng, trước hết nói rõ và xác nhận phương án chia ảnh, vẫn giữ đủ tư liệu khuôn mặt và chính diện/nghiêng/sau lưng hoàn chỉnh.
- Mẫu cơ bản cũ của cổ phong cyberpunk chỉ có siêu cận cảnh khuôn mặt; quy trình này giữ lại phương pháp "khuôn mặt khác biệt" của nó, rồi thống nhất bổ sung tư liệu toàn thân, không được coi một khuôn mặt là thiết lập nhân vật đã hoàn thành.

### Phân lớp tạo hình nhân vật và biến thể

| Lớp | Quyết định thiết kế | Ranh giới giữ nguyên |
|---|---|---|
| Danh tính cơ bản | Khuôn mặt, vóc dáng, điểm nhận diện da tóc và tư thế đứng chuẩn đã xác nhận | Thay đồ không được biến thành người khác; nhu cầu biến hình rõ ràng thì ghi riêng các cấu trúc được phép thay đổi |
| Trang điểm | Mặt mộc, thường ngày, theo dịp, lễ hội hoặc trạng thái cốt truyện; thay đổi cụ thể ở mày mắt, má, môi | Đạo cụ, thời tiết, từ chỉ động tác không tự động kích hoạt trang điểm đậm; sau khi trang điểm vẫn nhận ra nhân vật |
| Kiểu tóc/trang sức đầu | Chải, buộc, búi, tết và trang sức tóc cần thiết | Đường chân tóc, màu tóc và độ dài chưa được cho phép không đổi; cấu trúc nghiêng và sau lưng tương ứng được |
| Lớp trong | Cổ áo, độ dài tay, chất vải và màu của lớp sát người | Quan hệ giữa các lớp hợp lý, không xuyên lớp hay lơ lửng |
| Trang phục chính/áo khoác | Phom dáng và đường cắt do thời đại, dịp, nhiệt độ, thân phận quyết định | Chính diện/nghiêng/sau lưng là cùng một món đồ, trọng lượng và nếp gấp hợp với chất liệu |
| Giày và phụ kiện | Kiểu giày hoàn chỉnh, thắt lưng, trang sức, kính, mũ, túi | Không thiếu giày; phụ kiện bám sát cơ thể, không lơ lửng vô cớ hay cắm vào da |

Buổi sáng ở nhà có thể dùng mặt mộc và kiểu tóc lỏng; đi làm thì chỉnh trang vừa phải, quần áo vừa người; gặp mặt trang trọng thì nhấn mạnh đường cắt và trang điểm cục bộ; đám cưới/lễ hội có thể trang điểm tạo hình đầy đủ. Trên đây là phương pháp đề xuất, không tự động thêm trang điểm hay trang sức cho mọi nhân vật. Mặc nhiều lớp kiểu hiện đại phải có lý do về thời tiết/dịp; trang phục truyền thống coi trọng hình chế của cổ áo, vạt áo, thắt lưng, váy bào và giày; biến thể cyberpunk phải nói rõ vật mang truyền thống và bộ phận chức năng kết nối với nhau thế nào.

Biến thể nhân vật lấy ảnh cha đã xác nhận làm đầu vào thật, ghi rõ hạng mục giữ nguyên và hạng mục thay đổi. Ảnh thiết lập trang phục không thêm hành động cầm điện thoại, cốc cà phê, vũ khí hay hành động cốt truyện trong bối cảnh; những thứ này được tích hợp thông qua đạo cụ độc lập và phân cảnh. Biến hình đáng kể có thể thay đổi cấu trúc cơ thể đã được xác nhận, nhưng phải ghi lại tính liên tục về nhận diện và ranh giới mới.

## Bối cảnh: xây dựng không gian có thể tái sử dụng

### Thiết kế bối cảnh cơ bản

Trước hết xác định chức năng của địa điểm, thời đại và vùng miền, trong nhà hay ngoài trời, người sử dụng chính và lộ trình cốt truyện, rồi mới thiết kế cấu trúc. Đa số phong cách vẽ dùng một khung nhìn chính đại diện duy nhất, nhìn rõ lối vào, lối ra, khu vực hoạt động chính và mốc cố định; cổ phong cyberpunk dùng thiết lập bốn hướng nói dưới đây, không được dùng một góc cục bộ đẹp mắt thay cho không gian hoàn chỉnh.

| Tầng | Nội dung thiết kế |
|---|---|
| Khung xương cố định | Vị trí và quan hệ của tường, cửa ra vào, cửa sổ, cầu thang, cột, đường, bờ nước...; có thể hỗ trợ nhân vật đi lại thực tế |
| Bài trí chính | Công dụng, chất liệu và hướng đặt của bàn, tủ, giường, bình phong, quầy bar, bàn làm việc... |
| Tiền, trung, hậu cảnh | Khung cửa/cành cây/cạnh đồ nội thất làm tiền cảnh, khu vực hoạt động ở trung cảnh, hành lang/ngoài cửa sổ/núi xa làm hậu cảnh kéo dài |
| Nguồn sáng | Cửa sổ ở hướng nào, ngọn đèn nào, vị trí mặt trời và thời điểm, chỗ nào sinh ra bóng đổ và phản chiếu |
| Môi trường | Mùa, thời tiết, thảm thực vật, trạng thái mặt đất; loài cây khớp với vùng miền và mùa |
| Dấu vết sinh hoạt/lịch sử | Sự hao mòn, sửa chữa, sắp đặt, bụi bặm liên quan đến trải nghiệm của địa điểm; không mặc định toàn cảnh cũ nát |

Bối cảnh tài sản không xuất hiện người, bóng người, đường nét cơ thể hay hình bóng. Bối cảnh trống vẫn có thể kể chuyện: một chiếc ghế chưa đẩy vào, nửa cốc nước cho thấy vừa rời đi; ghế xếp ngay ngắn và máy chiếu đang mở cho thấy sắp bắt đầu; móc trên tường và đường viền cũ trên sàn cho thấy đã dọn đi. Chi tiết phải khớp kịch bản, không ám chỉ thêm sự kiện chưa xảy ra.

Nội thất hiện đại có thể chọn cấu trúc chức năng từ căn hộ, văn phòng, phòng họp, quán cà phê, cửa hàng tiện lợi, bệnh viện, lớp học; ngoại cảnh chọn khung không gian từ đường phố, ngõ cũ, khu dân cư, sân thượng, cửa ga tàu điện ngầm, bờ sông... Không gian truyền thống chú trọng sân viện, hành lang, điện đường, song cửa, mái cong và kết cấu gỗ đá. Không gian cyberpunk phải có cấu trúc kiểu Trung Hoa nhận ra được trước rồi mới thêm hệ thống công nghệ, không dùng đèn neon thay cho kiến trúc.

Bố cục lấy góc nhìn ngang tầm mắt hoặc góc nhìn có thể giải thích rõ bố cục làm điểm khởi đầu. Phim điện ảnh đô thị người thật có thể dùng góc rộng/tiêu chuẩn kiểu 24–35mm và vùng rõ nét lớn hơn; phong cách phẳng dùng mảng màu che khuất và quan hệ tỉ lệ; đất sét dùng bối cảnh thu nhỏ và độ sâu trường ảnh vừa phải. Thông số ống kính là biểu đạt mỹ thuật, tham số thực tế theo công cụ hiện tại.

### Thiết lập bốn hướng cho bối cảnh cyberpunk phong cách cổ phong

`3D_guofeng_cyber` là trường hợp đặc biệt về cách trình bày bối cảnh trong 11 phong cách vẽ của phiên bản cũ, cả bối cảnh cơ bản lẫn bối cảnh phái sinh đều giữ tư liệu bốn hướng. 10 phong cách còn lại vẫn mặc định một khung hình, không mở rộng bố cục này cho mọi phong cách.

- Cùng một điểm trung tâm, cùng độ cao điểm nhìn, chỉ thay đổi hướng nhìn: trên trái là phía trước 0°, trên phải là phía phải 90°, dưới trái là phía sau 180°, dưới phải là phía trái 270°, xếp thành 2×2. Không phải đứng ngoài bối cảnh vòng quanh tòa nhà chụp bốn mặt tiền.
- Không gian nhỏ có thể dùng góc nhìn ngang tầm mắt người, đô thị quy mô lớn có thể dùng điểm nhìn trung tâm trên cao đã xác nhận; một khi ảnh cha đã được xác nhận, biến thể dùng lại điểm trung tâm và độ cao đó, không đột ngột hạ ảnh cha trên cao xuống giá trị mặc định 1,6 mét của mẫu phái sinh cũ.
- Kiến trúc, lối vào, lối đi, thiết bị cyberpunk và bài trí cố định có vị trí duy nhất trong cùng một thế giới; ranh giới, chất liệu, mùa và thời tiết của các hướng liền kề khớp được với nhau. Ánh sáng tự nhiên và các nguồn sáng nhân tạo như neon giữ vị trí trong thế giới, vùng nhận sáng và bóng đổ thay đổi hợp lý theo hướng quan sát, không yêu cầu ô nào cũng sáng ở cùng một phía của khung hình.
- Tỉ lệ 1:1 của phiên bản cũ hợp với cách xếp 2×2, tỉ lệ và độ phân giải thực tế phải được mô hình hỗ trợ và được xác nhận. Nếu bốn ô không thể trình bày rõ ràng, nói rõ chỗ thiếu và xác nhận việc tách thành bốn ảnh tư liệu của cùng một bối cảnh; bốn ảnh cùng thuộc về một bối cảnh và một phiên bản trong canvas tài sản, không được tuyên bố một ảnh một hướng đã bổ sung đủ tư liệu.
- Khi phân cảnh tham chiếu, ghi rõ dùng hướng nào và quan hệ không gian của nó, đầu ra vẫn là một khung hình duy nhất của shot đó, không mang bố cục bốn ô của tư liệu tài sản vào phân cảnh hay video.

### Biến thể bối cảnh

| Biến thể | Bắt buộc giữ nguyên | Có thể thay đổi và ảnh hưởng kéo theo |
|---|---|---|
| Thời điểm trong ngày | Cấu trúc địa điểm, vị trí bài trí, góc máy và hao mòn đã có | Độ cao/hướng mặt trời, nóng lạnh, độ dài bóng, độ sáng ngoài cửa sổ, bật tắt đèn nhân tạo và thứ bậc nguồn sáng |
| Thời tiết | Cùng địa điểm, bố cục chính, đồ vật không bị ảnh hưởng | Sợi mưa, vệt mưa trên kính, phản chiếu mặt đất ướt, vị trí tuyết đọng, tầng xa gần của sương mù; thay đổi bề mặt hợp với chất liệu |
| Vị trí máy/tiêu cự | Cấu trúc thế giới, vị trí đồ vật thực tế, thời điểm và thời tiết, nguồn sáng của thế giới | Phạm vi khuôn hình, phối cảnh và quan hệ che khuất, độ sâu trường ảnh; không được biến đổi góc thành đổi địa điểm |
| Trạng thái cốt truyện rõ ràng | Khung xương không gian vẫn nhận ra được và manh mối liên tục | Chỉ những sửa chữa, hư hại, trang trí, sắp đặt đã xác nhận, nói rõ nguyên nhân và cảnh áp dụng |

SOP v1.1.8 mặc định tự động trích xuất thay đổi thời điểm trong ngày của cùng địa điểm; thời tiết, vị trí máy, hư hại... chỉ được đưa vào phạm vi thiết kế độc lập sau khi người dùng nêu rõ nhu cầu. Kiến thức có các phương pháp này không có nghĩa quy trình tự động mở rộng. Biến thể dùng lại cách trình bày của bối cảnh cha: bối cảnh thường một khung, cổ phong cyberpunk thiết lập bốn hướng; bốn hướng đồng bộ thay đổi trạng thái đã xác nhận, không được một ô ban ngày còn ô khác ban đêm.

Chuyển ngày sang đêm không thể chỉ đổi bầu trời: ánh sáng tự nhiên yếu đi, đèn đường/đèn trong nhà trở lại làm nguồn sáng chính, phản chiếu và bóng đổ đồng bộ thay đổi. Chuyển nắng sang mưa không thể chỉ thêm vệt mưa: mặt đất ướt, kính đọng nước, không khí và ánh sáng cửa sổ thay đổi. Khi đổi góc nhìn, giữ vị trí nguồn sáng trong thế giới, tính lại hướng nhận sáng trong khung hình.

## Đạo cụ: cấu trúc, chất liệu và trạng thái cốt truyện

### Phán đoán có tách riêng hay không và cách trình bày

Đạo cụ chỉ được lập tài sản khi có vai trò cốt truyện hoặc thị giác độc lập; bài trí nền thông thường có thể để lại trong bối cảnh. Ghi rõ công dụng, hình dạng, quan hệ kích thước, kết nối cấu trúc, chất liệu chính phụ và trạng thái, không dùng "đạo cụ tinh xảo" thay cho thông tin có thể kiểm tra.

| Loại | Thông tin nhận diện trọng tâm |
|---|---|
| Thiết bị liên lạc/điện tử | Đường viền thân máy, màn hình và phím bấm, cổng kết nối, ốp bảo vệ, trạng thái bật tắt và giao diện cần thiết |
| Đồ dùng ăn uống | Miệng cốc, quai cốc, dung tích vật chứa, chất liệu, thứ đựng bên trong và hơi nước/cặn mà cốt truyện yêu cầu |
| Đồ dùng văn phòng/học tập | Bìa, cách đóng gáy, mép trang, kẹp bút, thẻ nhân viên...; chữ chỉ thiết kế theo nhu cầu cốt truyện |
| Đồ dùng đi lại/mang theo người | Răng chìa khoá, nan và mặt ô, cấu trúc túi, dây đeo vai, mép thẻ |
| Trang sức/tín vật | Hoa văn, khảm nạm, khớp cài, vết khắc, chỗ khuyết độc đáo, và vì sao có thể nhận ra |
| Đồ gia dụng/sức khoẻ | Vật chứa, miệng mở, chất liệu, cấu trúc cần cho cách sử dụng; không tự bịa thêm thông tin cá nhân thật |
| Khí vật truyền thống/huyễn tưởng | Kỹ nghệ thời đại, các chất liệu như gỗ, kim loại, ngọc, gốm, hình chế và cơ chế/hiệu ứng đặc biệt rõ ràng |

Đa số phong cách có thể dùng cách trình bày 2×2 gồm chính diện, nghiêng, sau lưng cộng chi tiết, chủ thể hoàn chỉnh, tỉ lệ nhất quán, cấu trúc các góc khớp nhau. Nếu một ảnh đơn đủ để nhận diện hoặc người dùng đã xác nhận cách khác, chọn theo nhu cầu. **Phim điện ảnh đô thị người thật `realpeople_modern_city` mặc định là một ảnh nhiếp ảnh tĩnh vật thật**: phông giấy xám, mặt bàn vân gỗ nhạt hoặc trắng kem, có mặt đỡ thật, bóng tiếp xúc mềm, không áp bố cục mô hình bốn ô.

Ảnh đạo cụ độc lập không xuất hiện người, tay, người đeo hay động tác sử dụng; trang sức có thể đặt phẳng, vũ khí hoặc dụng cụ có thể đặt yên an toàn. Nền đơn giản, đạo cụ vào khung đầy đủ, chi tiết bề mặt không bị độ sâu trường ảnh làm mờ. Tên và công dụng của tài sản ghi trong phần mô tả trên canvas, không yêu cầu bộ tạo vẽ nhãn vào ảnh.

### Chất liệu thể hiện trạng thái như thế nào

Trước hết xác định đồ vật là mới, dùng hằng ngày, dùng lâu năm, bị hư hại hay được niêm cất, rồi mới chọn dấu vết cụ thể. Lão hoá và hư hại của cùng một chất liệu có thứ tự nhân quả; không cho gốm sứ bị gỉ, không viết vết móp kim loại cho giấy.

| Chất liệu | Kết cấu bình thường | Dấu vết thời gian hoặc sử dụng | Hư hại/thay đổi môi trường đọc được |
|---|---|---|---|
| Kim loại | Phản chiếu kiểu xước tóc, rèn hoặc đánh bóng, highlight ở cạnh | Vùng tiếp xúc mòn bóng, vết xước nhỏ, oxy hoá vừa phải | Móp, cong, chỗ gãy, gỉ sét; nước mưa đọng thành giọt hoặc màng nước |
| Ngọc/đá | Ấm mịn trong màu hoặc vân đá, khác biệt độ mài bóng | Lớp bóng do vuốt ve, mòn góc cạnh | Vết nứt, sứt mẻ, bong mảnh, giữ danh tính vân gốc |
| Thuỷ tinh | Trong suốt, khúc xạ ở cạnh, phản chiếu thật | Dấu tay, vệt nước, vết xước nhẹ | Đường nứt, vỡ vụn, thiếu mảnh; độ ẩm tạo ngưng tụ |
| Gốm sứ | Ánh dịu mặt men, khác biệt giữa xương gốm và men | Mòn miệng/đáy cốc, rạn men nhỏ | Sứt mẻ, vết nứt, mảnh vỡ, lộ xương gốm |
| Gỗ | Vân gỗ, khác biệt giữa mặt sơn và gỗ trần | Lớp bóng thời gian, mòn sơn, màu sẫm đi | Nứt toác, chỗ gãy, mọt hoặc vết cháy, chọn theo cốt truyện |
| Giấy | Sợi giấy, nếp gấp, bề mặt hút sáng | Mép trang xơ, ố vàng, dấu vết lật giở nhiều lần | Rách, mất góc, ướt nhăn, mực loang |
| Vải | Kiểu dệt, cảm giác nhung, độ rủ và nếp gấp do chịu lực | Phai màu, xù lông, chỗ chịu lực mòn mỏng | Rách, tuột chỉ, lỗ thủng, ướt nặng bám dính hoặc vết bẩn cục bộ |
| Da thuộc | Vân da, độ mềm cứng, đường may và dầu viền | Nếp gập, lớp bóng thời gian, mòn mép | Nứt, rách, bong lớp mặt, phần kim loại thay đổi riêng |
| Nhựa/mặt panel điện tử | Đường ghép khuôn ép phun, mờ/bóng, phản chiếu màn hình | Vết xước nhỏ, phai màu, vùng phím mòn bóng | Sứt cạnh, vết nứt, biến dạng, vỡ màn hình, rò dịch hoặc lỗi hiển thị |

Các dấu vết vật lý trên phải được chuyển sang chất liệu biểu đạt đã chọn: cel dùng nét và mảng màu, thiết kế phẳng dùng ký hiệu đơn giản, 3D thể hiện bề mặt và phản chiếu, đất sét giữ dấu vết thủ công, tả thực người thật mô tả hành vi vật liệu mà máy quay nhìn thấy. Không được thêm texture sợi tả thực cho đạo cụ phong cách phẳng.

Biến thể đạo cụ giữ nguyên đường viền, hoa văn cốt lõi và điểm neo cấu trúc ban đầu, cũng như vị trí máy trình bày, nền, nguồn sáng. Thay đổi trạng thái phải nhận ra ngay, nguyên nhân truy được. Mảnh vỡ then chốt giữ phần có thể nhận diện; "được trân trọng cất giữ" có thể thể hiện qua lớp bọc và dấu vết mở ra đóng lại nhiều lần, "yêu quý mang sát người" có thể thể hiện qua vị trí vuốt ve cụ thể, không cần thêm tay người giữ. Trạng thái mới tinh và mòn nặng loại trừ nhau; đèn điện/màn hình phát sáng bình thường cũng phải phân biệt với năng lượng phép thuật vô căn cứ.

SOP không tự động trích xuất phái sinh đạo cụ; chỉ dùng các phương pháp này cho nhu cầu trạng thái bổ sung mà người dùng nêu rõ, và xác nhận phạm vi riêng.

## Mẫu prompt có thể điền trực tiếp

Trong ngoặc vuông điền nội dung đã xác nhận, xoá mục không áp dụng; dưới đây là mẫu ngữ nghĩa, không yêu cầu công cụ hiện tại có trường cùng tên. Tham chiếu phải gắn với đầu vào ảnh thực tế, chỉ viết "tham chiếu đường dẫn nào đó" không cấu thành ảnh tham chiếu. Ký hiệu tham chiếu chuyên dụng chỉ dùng khi mô hình được chọn và công cụ hiện tại thực sự hỗ trợ.

### Nhân vật cơ bản

```text
Tư liệu thiết lập nhân vật [phong cách vẽ và chất liệu biểu đạt đã chọn], [tên nhân vật/thân phận/giai đoạn tuổi].
Nhận diện cốt lõi: [đường nét đầu mặt, tổ hợp ngũ quan, đường chân tóc, kiểu tóc và một vài đặc điểm độc đáo]; [vóc dáng đã xác nhận và tư thế đứng tự nhiên].
Mặc [trang phục cơ bản hoàn chỉnh và giày, hình chế, màu sắc, chất liệu], biểu cảm trung tính tự nhiên.
Cùng một khung hình lần lượt là cận cảnh khuôn mặt, toàn thân chính diện, toàn thân nghiêng, toàn thân sau lưng; khuôn mặt rõ ràng, ba toàn thân đủ đầu đến chân.
Bốn góc là cùng một nhân vật, cùng kiểu tóc, trang phục và tư thế đứng, cấu trúc nghiêng và sau lưng tương ứng với nhau.
[Nền đơn giản], [ánh sáng trình bày phù hợp chất liệu biểu đạt]; không thêm môi trường cốt truyện hay đạo cụ cầm tay, không thêm nhãn hay chữ chồng lên.
```

Phái sinh nhân vật đổi phần mở đầu thành "lấy ảnh cha đã gắn làm tham chiếu danh tính", ghi từng mục "Không đổi: [khuôn mặt/vóc dáng/màu tóc/tư thế đứng]; Chỉ thay đổi: [trang điểm/kiểu tóc/lớp trong/trang phục chính/giày/phụ kiện]", rồi dùng lại quy chuẩn góc nhìn. Không thay đổi tất cả các lớp một lượt.

### Bối cảnh cơ bản và biến thể bối cảnh

Dưới đây là mẫu bối cảnh một khung hình; cổ phong cyberpunk dùng mẫu bốn hướng phía sau, không được viết lẫn "một khung/không ghép nhiều góc nhìn" với yêu cầu bốn ô.

```text
[Phong cách vẽ và chất liệu biểu đạt đã chọn], [tên và chức năng địa điểm], một khung nhìn chính của không gian, [thời đại và vùng miền], [thời điểm/mùa/thời tiết].
Khung xương không gian: [vị trí lối vào, cửa sổ, lối đi và khu vực chính]; bài trí cố định: [đồ vật chính và vị trí tương đối].
Tiền cảnh [khung/vật che], trung cảnh [khu vực hoạt động chính], hậu cảnh [phần không gian kéo dài], cấu trúc chủ thể rõ ràng.
Nguồn sáng chính đến từ [vị trí và nguồn thật], [mềm cứng và nóng lạnh]; [ánh sáng phụ, phản chiếu và bóng đổ].
[Chất liệu và dấu vết sử dụng cần thiết]; không người, không bóng người hay đường nét cơ thể, không ghép thành nhiều góc nhìn, không thêm chữ chồng ngoài khung.
```

Mẫu cổ phong cyberpunk:

```text
Thiết lập bốn hướng cho bối cảnh 3D cyberpunk phong cách cổ phong, [chức năng địa điểm, thời đại và vùng miền, cấu trúc kiểu Trung Hoa và hệ thống công nghệ], [thời điểm/mùa/thời tiết thống nhất].
Điểm trung tâm cố định [vị trí] và độ cao điểm nhìn [độ cao đã xác nhận], chỉ xoay hướng quan sát; cùng một khung hình 2×2: trên trái phía trước 0°, trên phải phía phải 90°, dưới trái phía sau 180°, dưới phải phía trái 270°.
Khung xương không gian [vị trí tương đối trong thế giới của cửa, cửa sổ, lối đi, kiến trúc và bài trí]; ranh giới bốn hướng và mốc cố định có thể tương ứng, không thay đổi điểm trung tâm hay phóng to thu nhỏ riêng một ô.
Nguồn sáng chính [vị trí trong thế giới và nguồn], thiết bị cyberpunk [vị trí cố định và trạng thái phát sáng], vùng nhận sáng, bóng đổ và phản chiếu ở mỗi góc nhìn tuân theo cùng một bộ nguồn sáng.
[Chất liệu PBR, hình chế kiểu Trung Hoa, bộ phận công nghệ cụ thể và dấu vết sử dụng cần thiết]; mùa và thời tiết bốn hướng nhất quán, không có đường nét nhân vật, bóng người, cơ thể hay động vật, không thêm nhãn hay watermark ngoài khung.
```

Biến thể bốn hướng lấy ảnh cha đã gắn làm tham chiếu, khoá bố cục bốn hướng, điểm trung tâm, độ cao, vị trí kiến trúc và thiết bị, rồi ghi các thay đổi đã xác nhận như thời điểm/thời tiết diễn ra đồng bộ ở mỗi hướng; thay đổi trạng thái không có nghĩa là tạo một địa điểm khác.

Ví dụ biến thể bối cảnh: lấy ảnh cha "Sân viện · cảnh ngày" đã gắn làm tham chiếu, giữ vị trí cổng sân, cột hành lang, bàn đá, cây cối và cùng một vị trí máy, chỉ đổi thành cảnh đêm; ánh sáng trời yếu đi thành môi trường xanh lam lạnh, hai chiếc đèn lồng đã đặt sẵn bên cổng sáng lên, bóng đổ ấm trên bàn đá và mặt đất tuân theo vị trí đèn lồng; vẫn là cùng một sân viện không người. Chưa xác nhận trời mưa thì không thêm phản chiếu mặt đất ướt.

### Đạo cụ cơ bản và biến thể đạo cụ

```text
[Phong cách vẽ và chất liệu biểu đạt đã chọn], tĩnh vật độc lập [tên/loại đạo cụ], [cấu trúc tương ứng với công dụng], [hình dạng và quan hệ kích thước].
[Chất liệu chính phụ, màu sắc, hoa văn cốt lõi, kỹ nghệ], trạng thái hiện tại [trạng thái đã xác nhận và dấu vết nhìn thấy cụ thể].
[Bố cục một góc nhìn hoặc chính diện/nghiêng/sau lưng cộng chi tiết đã xác nhận], cấu trúc tương ứng, vào khung đầy đủ, không người, không tay, không động tác đeo hay cầm nắm.
[Nền và cách đặt đỡ], [ánh sáng và bóng đổ phù hợp chất liệu biểu đạt], chi tiết then chốt rõ ràng, không thêm nhãn hay watermark.
```

Ví dụ biến thể đạo cụ: lấy ảnh cha "Phong bì cũ" đã gắn làm tham chiếu, giữ màu giấy, chỗ dán, vị trí nếp gấp và cùng một vị trí máy tĩnh vật, chỉ đổi thành sau khi dầm mưa; mặt giấy hút nước sẫm màu cục bộ, mép hơi quăn, vết mực có sẵn loang nhẹ, giữ nét chữ nhận ra được và cấu trúc chỗ dán; không tự ý thêm vết rách, cháy sém hay chữ mới.

### Lựa chọn ràng buộc phủ định

Trước hết loại trừ nội dung xung đột trực tiếp với nhiệm vụ hiện tại, rồi thêm một ít từ chỉ lỗi thực sự có rủi ro. Không dán nguyên cả đoạn từ phủ định cũ.

| Nhiệm vụ | Hướng ràng buộc phù hợp | Không nên thêm máy móc |
|---|---|---|
| Thiết lập nhân vật | Ghép nhiều người khác nhau, mặt bị trôi, thiếu góc nhìn, cắt đầu chân, chi sai, trang phục thay đổi giữa các góc nhìn | Cấm tuyệt đối căn giữa/chụp studio, hoặc quy định mọi nhân vật cùng chiều cao màu da |
| Tài sản bối cảnh | Người, bóng người, cấu trúc biến dạng, ánh sáng bóng đổ không có nguồn, chữ lớn phủ lên không gian; nhánh một khung hình còn loại trừ ghép nhiều góc nhìn | Cấm tư liệu bốn hướng đã xác nhận của cổ phong cyberpunk, hoặc cấm biển đường, thư từ, thiết bị trong nhà mà cốt truyện cần |
| Đạo cụ độc lập | Tay/người, cấu trúc lơ lửng, góc nhìn không nhất quán, đổi chất liệu vô căn cứ | Cấm màn hình/đèn vốn thực sự phát sáng, hoặc đồng thời yêu cầu mới tinh và mòn cũ |
| Phong cách vẽ | Từ ảnh chụp/3D/2D mâu thuẫn với chất liệu biểu đạt đã chọn, cụ thể tới nhánh đó | Thêm "cấm cel" cho cel, cấm hạt nhiễu tuyệt đối cho phim điện ảnh người thật |

Khi mô hình không hỗ trợ prompt phủ định riêng, viết các yêu cầu cần thiết thành điều kiện nhìn thấy được dạng khẳng định, ví dụ "bốn góc của cùng một nhân vật, đủ đầu đến chân, nền đơn giản, trang phục nhất quán". Độ phân giải và tỉ lệ dùng tham số thực tế đã xác nhận và được hỗ trợ, chữ "4K/8K" không bằng kích thước đầu ra thực tế.

## Kiểm tra trước khi tạo và nghiệm thu khi đọc lại

Trước khi tạo, đối chiếu thẻ thiết kế, prompt, ảnh tham chiếu và tham số có cùng phiên bản không; dùng lại phạm vi đã xác nhận, không thêm lô chưa được cho phép. Bản thiết kế, đang xếp hàng, đang tạo, ứng viên, đã chọn dùng phải phân biệt rõ, không được bỏ qua các điểm xác nhận của quy trình chính.

- Nhân vật: khác biệt rõ với nhân vật khác, khuôn mặt và chính diện/nghiêng/sau lưng là cùng một người, quần áo và giày đầy đủ, không tự ý đổi tuổi, vóc dáng, điểm nhận diện da tóc; chất liệu người thật, đất sét, phẳng... đều tự đứng vững.
- Bối cảnh: bố cục địa điểm đọc được và liên tục, không lén thêm bóng người; nguồn sáng giải thích được, không gian và chất liệu hợp phong cách, thay đổi thời điểm/thời tiết tạo ra ảnh hưởng kéo theo đúng. Cổ phong cyberpunk còn phải đối chiếu cách xếp trước/phải/sau/trái, cùng điểm trung tâm cùng độ cao, mốc bốn hướng nối tiếp và trạng thái thống nhất, không được chỉ nghiệm thu một ô.
- Đạo cụ: đường viền, cấu trúc và hoa văn then chốt nhận ra được, chất liệu/trạng thái hợp lý, không có tay hay người cầm; ảnh tĩnh vật đơn của phim điện ảnh đô thị người thật có mặt đỡ và bóng đổ đáng tin.
- Biến thể: thực sự dùng ảnh cha đã xác nhận; chỉ thay đổi hạng mục được phép; hạng mục không đổi, khác biệt trạng thái và tập/cảnh áp dụng đều đọc lại được.
- Chung: prompt không có chỉ thị loại trừ nhau, ảnh thật truy cập được; xem kết quả thực tế rồi ghi vấn đề và kết luận chọn dùng, không lấy "công cụ trả về thành công" thay cho nghiệm thu thị giác.

Chỉ sau khi qua nghiệm thu và được người dùng xác nhận chọn dùng, mới ghi tham chiếu ảnh thật vào bản ghi chính của tài sản và các tập bị ảnh hưởng. Chỉnh sửa chỉ nhắm vào hạng mục không đạt, giữ lại ảnh đã xác nhận và ứng viên, không mặc định ghi đè toàn bộ tài sản.
