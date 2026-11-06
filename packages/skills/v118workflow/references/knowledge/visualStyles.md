# Mười một phong cách vẽ và quy tắc thị giác

Tệp này hợp nhất tiền tố phong cách, prompt mỹ thuật và quy tắc thị giác của đạo diễn trong v1.1.8 thành kiến thức có thể thực thi. Đọc quy tắc chung trước, rồi đọc tiểu mục tương ứng với phong cách vẽ đã xác nhận; thiết kế cụ thể và mẫu prompt cho tài sản xem [assetDesign.md](assetDesign.md). Không cần truy cập kho mã cũ, dịch vụ prompt cũ hay mô hình cũ.

## Trước hết thiết lập quy ước thị giác của dự án

Lưu một bản "Quy ước thị giác của dự án" trong `Canvas/Tài sản.json`, ghi lại phong cách đã chọn và các quyết định dưới đây; các tài sản và từng tập sau đó tham chiếu cùng một phiên bản.

| Chiều | Quyết định bắt buộc phải đưa ra |
|---|---|
| Thế giới tự sự | Niên đại, vùng miền, hiện thực hay hư cấu, trình độ công nghệ; những điều này quyết định nhân vật và đồ vật nào được xuất hiện |
| Chất liệu biểu đạt | Cel vẽ tay, mảng màu phẳng, 3D cách điệu, đất sét stop-motion hay nhiếp ảnh người thật, không viết lẫn các cách render loại trừ nhau |
| Tạo hình | Tỉ lệ nhân vật và nhận diện khuôn mặt, độ dày nét, ngôn ngữ đường viền, hình chế trang phục; không được áp cho mọi người cùng màu da, chiều cao, dáng mặt |
| Màu sắc | Màu nền, màu phụ chính, một ít màu nhấn, và thay đổi nóng lạnh ở các đoạn then chốt |
| Ánh sáng và bóng | Loại nguồn sáng chính, hướng, mềm cứng, tầng sáng tối; ảnh thiết lập nhân vật và bối cảnh cốt truyện được phép có cách đánh sáng với mục đích rõ ràng riêng |
| Chất liệu bề mặt | Da, tóc, trang phục, kiến trúc và đạo cụ thể hiện chất liệu biểu đạt đó ra sao, dấu vết sử dụng có căn cứ câu chuyện hay không |
| Bố cục và chuyển động | Tầng không gian, góc nhìn thường dùng, khí chất của chuyển động máy và động tác nhân vật; shot cụ thể vẫn tuân theo cốt truyện |
| Độ rõ và hạng mục cấm | Yêu cầu nhận diện chủ thể, có dùng hạt mịn hay không, chất liệu biểu đạt cần tránh trộn vào, chữ chồng hoặc trang trí thừa |

Mã màu là tham chiếu phối màu, không phải pixel cố định cho mọi khung hình; nhiệt độ màu, tiêu cự, tỉ lệ sáng là biểu đạt ý đồ nhiếp ảnh hoặc mỹ thuật, không phải tham số chính xác mà mô hình chắc chắn hỗ trợ. Trước hết viết hiệu ứng nhìn thấy được như "ánh sáng cửa sổ bên trái chiếu sáng bức tường bên phải", rồi bổ sung con số khi cần. Màu da, màu tóc, vóc dáng do thiết lập nhân vật và thiết kế đã xác nhận quyết định, không lấy máy móc từ bảng màu phong cách.

Cùng một địa điểm giữ vị trí nguồn sáng chính trong thế giới, bài trí cố định và chất liệu. Khi đảo góc, quan hệ trái phải của nguồn sáng trong khung hình có thể thay đổi, không được coi "bên trái khung hình sáng" là quy luật bất biến cho mọi vị trí máy. Thay đổi do thời điểm, thời tiết, bật đèn hay chuyển sang không gian khác gây ra phải có căn cứ.

Bối cảnh thường dùng khung tiền cảnh, chủ thể trung cảnh, hậu cảnh kéo dài để giải thích không gian; phong cách phẳng biểu đạt bằng che khuất, kích thước và tầng mảng màu, không áp đặt làm mờ ống kính. Ảnh tài sản phải trình bày rõ danh tính và cấu trúc, shot điện ảnh mới chọn che khuất, độ sâu trường ảnh và khoảng trống theo tự sự.

Prompt khẳng định ưu tiên viết đối tượng nhìn thấy được và đặc trưng chất liệu biểu đạt; prompt phủ định chỉ đặt riêng khi mô hình hiện tại hỗ trợ, nếu không thì viết lại thành ràng buộc khẳng định. Cấm đặt "cel" đồng thời vào cả prompt khẳng định và phủ định, hay viết nhiếp ảnh người thật thành render bằng engine PBR. Chủ thể rõ nét không có nghĩa cấm mọi hạt nhiễu và nhoè chuyển động: phải phân biệt cấu trúc phim nhựa có chủ ý, độ sâu trường ảnh ống kính, vệt kéo động tác trong video với nhiễu mất kiểm soát, mất nét, nhoè toàn khung hình.

Các mục trong mẫu cũ như cấm yếu tố hiện đại, cố định màu da chiều cao nhân vật, cố định vị trí đèn, bắt buộc dùng một mô hình nào đó không được coi là quy tắc liên dự án. Lấy thiết lập thế giới, phong cách vẽ do người dùng xác nhận và năng lực của mô hình hiện tại làm chuẩn. Biển hiệu, thư từ, chữ trên màn hình có vai trò cốt truyện trong khung hình có thể giữ lại; chữ chồng ngoài khung như phụ đề, watermark, thẻ tiêu đề chỉ xuất hiện khi được yêu cầu rõ ràng.

## 1. Hoạt hình Nhật thập niên 90 · `2D_90s_japanese_anime`

**Chất liệu biểu đạt và tạo hình**: cel vẽ tay tô phẳng, đường viền mảnh và mượt, mảng màu đều kèm một ít tầng bóng rõ ràng. Cảm giác tự sự hoài cổ, đời thường, dịu dàng đến từ phối màu và sự quan sát, không dựa vào làm mờ toàn khung hay nhiễu hạt thô. Biểu cảm nhân vật tự nhiên, tránh mắt to, trẻ hoá và tỉ lệ cường điệu vô căn cứ.

**Bảng màu**: vàng ấm `#F5E6D0`, trắng ngà `#F5F0E8` làm nền sinh hoạt; hồng `#F4D5D5`, xanh da trời `#87AEC9`, tím nhạt `#D0C4D6`, hổ phách `#C9A96E` dùng cho tầng cảm xúc. Tổng thể độ bão hoà trung bình thấp, màu nhấn chỉ chiếm cục bộ.

| Tình huống | Xử lý ánh sáng và màu |
|---|---|
| Đời thường, trường học | Ánh sáng tự nhiên mềm, cân bằng vàng ấm/trắng ngà với xanh xám; giữ rõ khung cửa sổ và bóng nhân vật |
| Rung động, hoàng hôn | Điểm xuyết hồng hoặc cam nhạt, viền ấm của nắng chiều, nền có thể để lại chút xanh lạnh |
| Ban đêm, một mình | Môi trường xanh nhạt/tím nhạt tạo khoảng cách với điểm ấm từ cửa sổ hoặc đèn đường |
| Hồi ức | Màu hơi nhạt, độ ấm hơi tăng, vẫn giữ khuôn mặt và nét vẽ đọc được |

**Chất liệu bề mặt và tài sản**: trang phục dùng nét nếp gấp và mảng màu để thể hiện vải bông, len đan, đồng phục; vân gỗ, phản chiếu kim loại được giản lược vừa phải thành texture vẽ tay và nét highlight. Ảnh cơ bản có thể dùng nền ngà ấm. Chọn đồng phục học sinh, áo sơ mi, áo len, quần áo đi làm theo niên đại đã xác nhận, không được tự ý bỏ thiết bị kịch bản cần chỉ vì "hoài cổ".

**Không gian và động thái**: cửa sổ, hành lang, mái nhà, đường phố, đoàn tàu... tạo thành không gian đời thường; gió thổi rèm, lá cây, giọt mưa có thể tiếp nối cảm xúc. Thường dùng quan sát ổn định, đẩy máy chậm, quay đầu tự nhiên và thay đổi ánh nhìn, động tác mạnh thêm vào theo cốt truyện, không bắt buộc mọi shot đều chậm.

**Từ neo khẳng định**: `hoạt hình Nhật thập niên 90, cel vẽ tay tô phẳng, nét vẽ tinh tế mượt mà, tông ấm dịu, chủ thể rõ nét, chất cảm đời thường hoài cổ`. Video có thể dùng `hand-drawn cel animation, soft warm tones, clean line art, nostalgic aesthetic`.

**Tránh**: ảnh chụp tả thực, 3D nhựa, neon tràn lan, nét đứt thô, chuyển sắc phức tạp diện rộng, mảng đen nuốt khuôn mặt. Đừng dùng nhầm `no cel-shading` để triệt tiêu chính phong cách này.

## 2. Anime cổ phong · `2D_chinese_guofeng`

**Chất liệu biểu đạt và tạo hình**: hình chế phương Đông và thẩm mỹ tân quốc triều, kết hợp render cel của hoạt hình Nhật; nét bút tinh tế, đường nét sạch và mảng màu rõ ràng cùng tồn tại. Thần thái cổ điển chủ yếu thể hiện qua kiến trúc, đường viền trang phục, màu sắc và tư thế, không dựa vào chồng chất tuỳ tiện vân mây và trang sức vàng.

**Bảng màu**: trắng ánh trăng `#E8EAF5`, xanh ngọc `#4A9B8A`, chàm `#2B4C7E` tạo tầng chính; đỏ son `#C93752`, vàng kim `#D4AF37`, son phấn `#A94A5F`, đất son `#965E3E` làm điểm nhấn theo đoạn. Độ bão hoà trung bình, nét mực giữ chi tiết.

| Tình huống | Xử lý ánh sáng và màu |
|---|---|
| Đời thường trong sân viện, ấm áp | Nền trắng ánh trăng, điểm xuyết son phấn diện tích nhỏ, ánh sáng bên mềm hoặc ánh sáng cửa sổ |
| Núi rừng, tiên khí | Xanh ngọc/trắng ánh trăng, một ít viền vàng kim, viễn cảnh sương nhẹ còn cận cảnh rõ ràng |
| Điện đường, lễ hội | Đỏ son và vàng kim chủ đạo, nguồn từ cửa/đèn nến rõ ràng, tránh ánh vàng phủ toàn khung |
| Đêm trăng, đối đầu | Chàm, màu mực và trắng ánh trăng lạnh, viền hoặc khuôn mặt nhân vật có mặt sáng đọc được |

**Chất liệu bề mặt và tài sản**: lụa thể hiện qua mặt sáng tô phẳng và nếp gấp chảy trôi, kim loại thể hiện bằng nét sáng ngắn và chính xác, ngọc thể hiện bằng màu trong và mảng màu dịu; không trộn lỗ chân lông tả thực và tham số engine 3D. Nền trắng ánh trăng nhạt giúp nhận rõ tóc sẫm và vạt áo.

**Không gian và động thái**: bình phong, rèm sa, cửa sổ chạm hoa, mái cong, hành lang tạo che khuất và tầng lớp; tay áo, dải áo, mưa hoa, lá trúc tăng sự chuyển động. Máy có thể đẩy chậm hoặc dịch nhẹ, động tác chú trọng tư thế và đường viền then chốt, không được để trang trí nhấn chìm hành vi nhân vật.

**Từ neo khẳng định**: `anime cổ phong, thẩm mỹ tân quốc triều, hình chế phương Đông, cel tô phẳng, nét bút tinh tế, đường nét rõ ràng, bóng phân tầng cùng tông màu`.

**Tránh**: ảnh người thật, 3D nhựa dày nặng, viền đen thô, bóng đen bẩn, yếu tố kỳ ảo phương Tây hoặc cyberpunk vô căn cứ; quần áo không được giả vờ thay đồ chỉ bằng đổi màu.

## 3. Thiết kế phẳng 2D · `2D_flat_design`

**Chất liệu biểu đạt và tạo hình**: mảng màu đơn sắc, hình hình học và đường viền đều rõ ràng, giản lược ngũ quan và cấu trúc. Không có bóng thật, chuyển sắc, texture chất liệu và khối 3D; "phương án ánh sáng" ở đây được chuyển thành tổ hợp mảng màu và vùng độ sáng, không được đánh sáng tả thực.

**Bảng màu**: xanh lam `#3B82F6`, cam `#F59E0B`, trắng, xám làm nền; tím `#C084FC`, hồng `#FB7185`, vàng nhạt `#FDE047`, bạc hà `#5EEAD4` dùng làm trọng điểm. Có thể bão hoà khá cao, nhưng kiểm soát số lượng màu và diện tích mảng lớn.

| Tình huống | Phương án mảng màu |
|---|---|
| Đời thường, ấm áp | Cam và trắng ngà diện tích lớn, xanh lam làm phụ |
| Rung động, nhẹ nhàng | Hồng với cam hoặc vàng nhạt, một ít trang trí hình học |
| Công sở, lý tính | Xanh lam, xám lạnh, trắng, hình chữ nhật tạo trật tự |
| Cảnh đêm, hồi ức | Xanh đậm/tím phối điểm vàng nhỏ; hồi ức có thể giảm độ bão hoà tổng thể |

**Chất liệu bề mặt và tài sản**: khác biệt giữa kim loại, gỗ, vải thể hiện qua đường viền, màu gốc và rất ít nét đặc trưng, không xuất hiện chuyển sắc highlight, vi texture sợi, lỗ chân lông hay khúc xạ trong suốt. Biến thể giữ ngôn ngữ hình học ban đầu, nứt vỡ dùng một ít đường nứt rõ ràng, trạng thái ẩm ướt không tự động thêm ánh sáng thể tích.

**Bố cục**: phân biệt trước sau bằng chồng lấp, kích thước, phân vùng màu và khoảng trống; hình tròn có thể gợi thân thiện, tam giác có thể chỉ hướng, chữ nhật có thể gợi ổn định. Quan hệ đến từ bố cục cụ thể, không cần gán ý nghĩa cảm xúc cố định cho từng hình.

**Động thái**: dịch chuyển rõ ràng, thay đổi đường viền và động tác then chốt đơn giản; bố cục cố định hoặc lia ngang khá an toàn. Tránh độ sâu trường ảnh ống kính tả thực, quay vòng xuyên qua và mô phỏng chất liệu theo trọng lực vô căn cứ.

**Từ neo khẳng định**: `thiết kế phẳng 2D, vector art, tạo hình hình học, tô màu đơn sắc, đường nét đều rõ ràng, phân vùng mảng màu, khoảng trống, không bóng không chuyển sắc`.

**Tránh**: `3D rendering, photorealism, shadows, gradients, textures, realistic lighting`. Thời đại và đồ vật do dự án quyết định, không được vì mẫu cũ thỉnh thoảng có chữ "cổ phong" mà viết lại thế giới hiện đại.

## 4. Hoạt hình ngôn tình đô thị trưởng thành · `2D_mature_urban_romance`

**Chất liệu biểu đạt và tạo hình**: tỉ lệ nhân vật trưởng thành, tô màu cel, nét mảnh rõ ràng và ánh sáng low-key kịch tính. Gương mặt tinh tế và tầng lớp vải vóc phục vụ chuyện quan hệ đô thị, biểu cảm thể hiện qua thay đổi nhỏ ở ánh mắt, khoé miệng, đường mày, không mặc định chibi hay cường điệu hài hước.

**Bảng màu**: xanh nhạt `#B8D4E3`, xanh xám `#7A8B99`, màu mực `#1A1A2E`, bạc `#C0C7CE` làm nền lạnh; hồng sữa `#F2D7D5`, hổ phách `#C9A96E`, trắng ngà làm điểm ấm cảm xúc. Độ bão hoà trung bình thấp, tương phản sáng tối khá mạnh, vùng tối vẫn có tầng lớp.

| Tình huống | Xử lý ánh sáng và màu |
|---|---|
| Rung động, thân mật | Ánh sáng bên/ánh sáng viền ấm dịu trên nền lạnh, chú ý ánh nhìn và phản ứng khuôn mặt |
| Công sở, kiềm chế | Ánh sáng cửa sổ với chất liệu xanh xám/bạc, phân tách rõ nhân vật và không gian kính |
| Đối đầu, nhẫn nhịn | Ánh sáng bên cứng, bóng khá sâu, thay đổi căng thẳng ở đường môi hoặc ánh mắt |
| Hoà giải, hồi ức | Tăng dần hổ phách và hồng, giữ tính liên tục màu sắc vốn có |

**Chất liệu bề mặt và tài sản**: vest, sơ mi, áo khoác dài, váy thể hiện nếp gấp và khác biệt chất liệu hợp với đường cắt; kính, đồ gỗ, kim loại biểu đạt bằng vẽ 2D, tránh thêm từ chỉ chất liệu nhiếp ảnh/PBR vì "chi tiết tột cùng".

**Không gian và động thái**: trước cửa sổ căn hộ, vách ngăn văn phòng, quán cà phê, đường phố đêm mưa; khung cửa và phản chiếu tạo khoảng cách quan hệ. Đẩy máy chậm, phản ứng tĩnh, lệch ánh nhìn hợp với đối thoại tinh tế, vạt áo và rèm cửa khẽ động hỗ trợ cảm xúc.

**Từ neo khẳng định**: `hoạt hình ngôn tình đô thị trưởng thành, tô màu cel, đường nét rõ ràng, bố cục kiểu điện ảnh, ánh sáng low-key kịch tính, nền lạnh điểm ấm, vi biểu cảm kiềm chế`.

**Tránh**: ảnh chụp tả thực, chất nhựa 3D, huỳnh quang mất kiểm soát, khuôn mặt trẻ hoá quá mức, bịa bối cảnh cổ đại. Máy tính, điện thoại hiện đại... tồn tại theo kịch bản, không dùng lại các hạng mục cấm tự mâu thuẫn với bối cảnh hiện đại của mẫu cũ.

## 5. Render hoạt hình 3D · `3D_anime_render`

**Chất liệu biểu đạt và tạo hình**: 3D cách điệu có khối không gian thật, giữ đường viền rõ ràng kiểu cel, chất liệu chi tiết cao nhưng được thiết kế. Cảm giác đời sống đô thị ấm áp cùng tồn tại với tạo hình hoạt hình lập thể; tỉ lệ nhân vật theo thiết kế đã xác nhận, không được đồng thời yêu cầu "tỉ lệ cách điệu" và "tuyệt đối cấm tỉ lệ hoạt hình".

**Bảng màu**: cam ấm `#F5A673`, xanh da trời `#87AEC9`, hồng `#F4D5D5`, bạc hà `#9DC2A5`, hổ phách và trắng ngà. Khá tươi sáng nhưng không huỳnh quang, chuyển tiếp sáng tối mềm, đường viền vẫn rõ.

| Tình huống | Xử lý ánh sáng và màu |
|---|---|
| Sáng sớm, đời thường | Ánh sáng tự nhiên mềm, vàng ấm/trắng ngà phối ánh trời lạnh |
| Quán cà phê, ở nhà | Ánh sáng bên ấm, vải và mặt gỗ giữ tầng lập thể |
| Công việc, trường học | Ánh sáng đỉnh trung tính và ánh sáng môi trường bổ trợ, tránh toàn cảnh quá ấm |
| Hoàng hôn, cảnh đêm | Viền sáng hổ phách, cục bộ hồng cam; ban đêm đèn ấm đối chiếu không gian xanh |

**Chất liệu bề mặt và tài sản**: trang phục có nếp gấp đáng tin, kim loại có highlight cách điệu, đồ ăn có bề mặt ấm mịn; da không làm lỗ chân lông cấp ảnh chụp hay độ bóng tượng sáp. Độ chính xác của mô hình tập trung vào mặt, tay, mép trang phục và đường viền đạo cụ.

**Không gian và động thái**: cửa, hành lang, cầu thang tạo chiều sâu lập thể; mây, đèn xe, rèm cửa có thể khẽ động. Động tác tự nhiên mượt mà, trọng tâm hợp lý, chuyển động máy có lộ trình không gian, không áp nhịp dừng khung của đất sét.

**Từ neo khẳng định**: `render hoạt hình 3D, chất cảm cel, đường viền rõ ràng, chất liệu cách điệu chi tiết cao, đánh sáng điện ảnh tông ấm dịu, không gian lập thể`.

**Tránh**: tả thực như ảnh chụp, nhựa rẻ tiền, low-poly, bóng đen chết, phẳng hoá hoàn toàn; đừng để thuật ngữ chất liệu đè lên mô tả nhận diện nhân vật.

## 6. 3D cổ phong · `3D_chinese_traditional`

**Chất liệu biểu đạt và tạo hình**: mô hình 3D độ chính xác cao, chất liệu PBR đáng tin, bóng tiếp xúc và chiều sâu không gian; hình chế truyền thống phương Đông là khung xương. Khí chất cổ điển đến từ cấu trúc, kỹ nghệ và ánh sáng, không phải là thêm độ sâu trường ảnh vào tranh minh hoạ 2D.

**Bảng màu**: trắng ánh trăng `#E0E8F0`, xanh ngọc `#4A8C7E`, đỏ son `#B22222`, chàm `#3B4B7C`, vàng kim `#D4AF37`, màu mực. Tổng thể bão hoà trung bình, đỏ vàng có thể lộng lẫy nhưng không được lấn át cấu trúc nhân vật và bối cảnh.

| Tình huống | Xử lý ánh sáng và màu |
|---|---|
| Cung điện, lễ hội | Đỏ vàng và trắng ánh trăng, ánh sáng cửa và ánh đèn phân tầng, highlight kim loại không cháy sáng |
| Núi rừng, tĩnh lặng | Xanh ngọc/trắng ánh trăng, ánh sáng thể tích lớp mỏng, phân biệt chất liệu cận cảnh và không khí viễn cảnh |
| Ấm áp trong nhà | Ánh sáng ấm son phấn/vàng cục bộ, gỗ, lụa, ngọc có phản quang khác nhau |
| Đêm trăng, đe doạ | Nền lạnh chàm/màu mực, một ít điểm ấm hoặc viền sáng rõ ràng |

**Chất liệu bề mặt và tài sản**: lụa có ánh vải và độ rủ; gỗ có vân và lớp bóng thời gian hợp lý; kim loại khác biệt về phản chiếu và độ nhám; ngọc ấm mịn thấu sáng; gốm sứ có mặt men. Chất liệu mỗi thứ một khác, không được đồng loạt thành nhựa. Nền thiết lập nhân vật có thể dùng xám trung tính, tránh làm mất đường viền áo trắng.

**Không gian và động thái**: mái cong, đấu củng, ngói, song cửa có cấu tạo đúng; bình phong, màn sa tham gia vào thấu sáng và che khuất. Tay áo, dải lụa, cây cối bay theo gió có nguồn rõ ràng, đẩy kéo ổn định hoặc quay vòng nhẹ để trình bày không gian, động tác cốt truyện không bị giới hạn bởi "toàn bộ quay chậm".

**Từ neo khẳng định**: `3D cổ phong, mô hình độ chính xác cao, chất liệu vật lý PBR, màu truyền thống Trung Hoa, hình chế kiến trúc và trang phục phương Đông, ánh sáng thể tích, bóng tiếp xúc, chiều sâu không gian`.

**Tránh**: low-poly, texture thô, phản quang nhựa đồng đều, tranh minh hoạ phẳng, yếu tố cyberpunk hoặc kỳ ảo phương Tây vô căn cứ; ảnh người thật cũng không phải chất liệu biểu đạt mặc định của nhánh này.

## 7. Đất sét stop-motion · `3D_clay_stopmotion`

**Chất liệu biểu đạt và tạo hình**: nhân vật đất sét nặn tay, bối cảnh thu nhỏ và cảm giác quay dừng khung. Đường viền tròn trịa, vết ấn ngón tay nhỏ, vết khắc dụng cụ và sự không hoàn hảo của chất liệu thuộc về phong cách, không nên coi là khuyết điểm mà mài nhẵn hết.

**Bảng màu**: kem `#F5E6D0`, đỏ đất nung `#C96E5A`, xanh da trời `#87AEC9`, tím nhạt `#D0C4D6`, hổ phách, bạc hà, trắng ngà. Ấm áp dịu dàng, màu sắc có chất cảm của màu vẽ thủ công.

| Tình huống | Xử lý ánh sáng và màu |
|---|---|
| Đời thường, trong nhà | Ánh sáng bên kiểu sân khấu mềm, màu kem và đất nung, bóng nhẹ nhưng nhìn thấy |
| Thiên nhiên, kỳ tưởng | Cây cỏ thu nhỏ và đèn điểm ấm, điểm xuyết cục bộ thay vì phát sáng toàn cảnh |
| Cảnh đêm, hồi ức | Môi trường xanh nhạt với đèn ấm nhỏ, hồi ức có thể giảm bão hoà nhưng không xoá vân đất sét |

**Chất liệu bề mặt và tài sản**: tóc được nặn từ các lọn đất sét có vết khắc, không tạo từng sợi tóc cấp ảnh chụp. Mặt và vải có thể giữ dấu vân tay khi nặn; mảnh vải, gỗ, kim loại thật nhỏ có thể làm đạo cụ thu nhỏ, miễn là tỉ lệ khớp với thế giới thủ công. Nền cơ bản có thể dùng màu kem ấm.

**Không gian và động thái**: mặt bàn, chậu hoa, sách, tường gạch thể hiện tỉ lệ bối cảnh thu nhỏ; độ sâu trường ảnh nông có thể làm nổi mô hình cảnh nhỏ, nhưng mắt, đường viền nhân vật chính và đạo cụ then chốt phải rõ. Động tác có chút giật nhẹ của dừng khung và cảm giác điều chỉnh bằng tay, không được biến hết thành 3D kỹ thuật số mượt như lụa.

**Từ neo khẳng định**: `hoạt hình đất sét stop-motion, nặn thủ công, vân đất sét rõ ràng, vết ấn ngón tay nhỏ, bối cảnh thu nhỏ, ánh sáng ấm dịu, độ sâu trường ảnh nông với chủ thể rõ nét`.

**Tránh**: đồ chơi nhựa nhẵn bóng, bề mặt kỹ thuật số hoàn hảo quá mức, vector phẳng, nét viền cel, neon mạnh, mờ toàn khung; lia máy tốc độ cao và xoay liên tục không có căn cứ tự sự sẽ phá vỡ khí chất quay thủ công.

## 8. 3D cyberpunk cổ phong · `3D_guofeng_cyber`

**Chất liệu biểu đạt và ranh giới**: 3D độ chính xác cao và chất liệu PBR, hình chế kiểu Trung Hoa là chủ thể, cấu trúc chức năng và hiệu ứng ánh sáng công nghệ có công dụng cụ thể. Kiến thức cũ đồng thời chứa hai ngữ cảnh thiên truyền thống và cyberpunk rõ ràng: khi không có manh mối công nghệ thì đừng tự lắp bộ phận cơ khí cho nhân vật hay treo neon lên kiến trúc.

**Bảng màu**: nền truyền thống như trắng ánh trăng, xanh ngọc, chàm, đỏ son/vàng kim làm tầng nghi lễ, phát sáng xanh lam hoặc hồng tím làm điểm xuyết có kiểm soát. Trước hết xác định màu chủ của đồ vật truyền thống, rồi mới xác định màu và độ sáng của bộ phận công nghệ; tránh để cả bức ảnh chỉ còn ánh xanh tím lan toả.

| Tình huống | Cấu trúc truyền thống và tầng công nghệ kết hợp ra sao |
|---|---|
| Điện đường, nghi lễ | Cột xà đỏ son với kim loại/hologram cục bộ, bản thân cấu trúc vẫn nhận ra được |
| Viên lâm, nơi ở | Song cửa, bình phong, chất liệu gỗ/ngọc mang các thiết bị cảm biến hoặc chiếu hình nhỏ |
| Thương mại, giao thông đô thị | Tường kính kiểu tân Trung Hoa, kết cấu kim loại mang cảm giác mộng ghép, sân ga và biển chỉ dẫn mang hình học kiểu Trung Hoa |
| Chợ đêm đêm mưa, hồi hộp/bí ẩn | Đường viền phố ngõ và biển hiệu kiểu Trung Hoa, dải đèn có kiểm soát phản chiếu trên mặt đất ướt, vùng tối giữ chất liệu thật |

**Chất liệu bề mặt và tài sản**: lụa có thể dệt vào mạch dây tinh mịn, ngọc kết hợp titan, đồng thau kết hợp khớp cơ khí, mũ trang sức truyền thống kết hợp bộ phận chức năng nhỏ. Mỗi thiết kế phải nói rõ vật mang, cách kết nối và công dụng; không được dán nổi các ký hiệu phát sáng không liên quan. Các góc khác nhau giữ liên tục giao diện kết nối, vị trí phát sáng, tầng lớp trang phục.

**Mẫu nhận diện nhân vật**: `[tuổi/thân phận], [hai ba đặc điểm khuôn mặt và đường chân tóc phân biệt lẫn nhau], [khí chất nhân vật], [dáng người và hình chế trang phục], 3D độ chính xác cao, biểu cảm trung tính, khuôn mặt rõ nét`. Tệp nhân vật cơ bản cũ chỉ cung cấp hạt giống siêu cận cảnh khuôn mặt; quy trình này bổ sung thêm tư liệu nhận diện khuôn mặt và toàn thân chính diện/nghiêng/sau lưng, không nhầm siêu cận cảnh là tài sản nhân vật hoàn chỉnh.

**Trường hợp đặc biệt về tư liệu bối cảnh**: bối cảnh cơ bản và phái sinh dùng thiết lập bốn hướng 2×2 với cùng một điểm trung tâm: trên trái phía trước, trên phải phía phải, dưới trái phía sau, dưới phải phía trái. Bốn hướng dùng chung độ cao điểm nhìn, vị trí trong thế giới của kiến trúc và thiết bị, thời điểm, thời tiết và nguồn sáng, biến thể kế thừa bố cục ảnh cha; phương pháp và mẫu cụ thể xem [Thiết lập bốn hướng cho bối cảnh](assetDesign.md#thiết-lập-bốn-hướng-cho-bối-cảnh-cyberpunk-phong-cách-cổ-phong). Đầu ra phân cảnh là một khung hình duy nhất, không được kế thừa bố cục bốn ô của ảnh thiết lập vào phim thành phẩm.

**Không gian và động thái**: mái cong, cửa sổ hoa, hình chế sơn thuỷ cùng tồn tại với chiếu hình mang tính chức năng; có thao tác trước, rồi mới có phản hồi của thiết bị. Tay áo và bộ phận cơ khí đều có trọng lượng riêng, chuyển động máy ổn định và biến đổi công nghệ phục vụ động tác, không rung ngẫu nhiên, nháy màn hình lỗi hay phun sáng.

**Từ neo khẳng định**: `3D cyberpunk cổ phong, mô hình độ chính xác cao, chất liệu PBR, hình chế kiểu Trung Hoa làm cốt lõi, kết hợp chất liệu truyền thống với cấu trúc chức năng, tự phát sáng có kiểm soát, thống nhất màu nền truyền thống và điểm xuyết công nghệ`. Ngữ cảnh thuần truyền thống thì bỏ phần mô tả cyberpunk và phát sáng.

**Tránh**: thành phố cyberpunk chung chung không có cấu trúc kiểu Trung Hoa, neon đầy màn hình, cháy sáng tràn che mất chất liệu, phụ kiện lơ lửng, hiệu ứng năng lượng không có nhân quả. `prefix.md` cũ chỉ có "không cần bất kỳ tiền tố nào", vì vậy quy ước có thể thực thi ở đây đến từ quy tắc mỹ thuật và đạo diễn trong cùng thư mục, không phải bịa ra một tiền tố cũ.

## 9. Cổ phong người thật · `realpeople_ancient_chinese`

**Chất liệu biểu đạt và tạo hình**: nhiếp ảnh điện ảnh người thật trong thế giới Trung Hoa cổ điển. Kết cấu da tự nhiên, sợi tóc thật và trọng lực của vải, trang phục và kiến trúc tuân theo thời đại đã xác nhận hoặc thiết lập hư cấu; mô tả bằng chất liệu và nguồn sáng có thể quay được, tránh thuật ngữ engine 3D.

**Bảng màu và ánh sáng**: trắng ánh trăng, chàm, màu mực, xám bạc tạo nền cổ điển, hổ phách/vàng kim/son phấn tăng ấm một ít. Khoảng nhiệt độ màu mà tiền tố cũ và tệp đạo diễn đưa ra không hoàn toàn nhất quán, không cố định một giá trị phủ cho mọi bối cảnh; cụ thể lấy nguồn và hiệu quả của ánh trời, ánh trăng, ánh cửa sổ, ánh nến làm chuẩn.

| Tình huống | Xử lý ánh sáng và màu |
|---|---|
| Sân viện, ban ngày | Ánh trời tán xạ tự nhiên, tầng lớp nhân vật và kiến trúc gỗ đá rõ ràng |
| Phòng riêng, ấm áp | Chiếu sáng bên bằng ánh nến/cửa sổ ấm, lụa và da không bóng quá mức |
| Đêm trăng, một mình | Môi trường chàm và viền trắng bạc, đèn ấm cục bộ, chỗ tối vẫn có đường viền |
| Nghi lễ, đối đầu | Ánh sáng bóng bị chia cắt bởi bình phong hoặc song cửa, tương phản khá mạnh và ánh nhìn rõ ràng |

**Chất liệu bề mặt và tài sản**: độ rủ và kiểu dệt của lụa, gai, bông khác nhau, phản quang của kim loại, ngọc, gốm sứ mỗi thứ một khác; sau khi trang điểm vẫn giữ chất cảm da, không được làm đẹp thành mặt silicone. Tuổi tác và dấu vết sử dụng do trải nghiệm của nhân vật và đồ vật quyết định, không làm cũ đồng loạt.

**Không gian và động thái**: màn trướng, cửa vòm, hành lang, cây cối trong sân tạo khung và chiều sâu. Tay áo, sợi tóc, giọt mưa có nguồn vật lý; động tác cảnh văn hàm súc, tốc độ cảnh võ theo cốt truyện, lựa chọn shot giúp khán giả nhìn rõ động tác và quan hệ.

**Từ neo khẳng định**: `nhiếp ảnh điện ảnh cổ phong người thật, chi tiết da tự nhiên, vải và chất liệu thật, hướng nguồn sáng rõ ràng, không gian cổ điển phương Đông, chủ thể rõ nét, bố cục điện ảnh`.

**Tránh**: da nhựa, làm mịn da quá mức, nhân vật game 3D, anime, đồ vật hiện đại không khớp thiết lập, cháy sáng mất kiểm soát và filter nặng. Ảnh thiết lập tài sản có thể căn giữa, dùng ánh sáng mềm studio, không dùng lại câu "cấm tuyệt đối căn giữa hoặc chụp studio" trong mẫu phân cảnh.

## 10. Phim điện ảnh đô thị người thật · `realpeople_modern_city`

**Chất liệu biểu đạt và nhân vật**: phim điện ảnh đô thị Trung Hoa đương đại kiềm chế, mang tính quan sát. Cảm giác người thường, tư thế đứng bất đối xứng tự nhiên, vi biểu cảm và trọng tâm cơ thể quan trọng hơn tư thế người mẫu hoàn hảo. Giữ lỗ chân lông, nếp nhăn nhỏ, nốt ruồi nhỏ, tóc con, dấu vết mặc của quần áo; đây là manh mối nhận diện, không được xoá hết vì "độ nét cao".

**Nguồn sáng đi trước**: màu sắc đến từ ánh nắng thật và đèn thực tế. Xám sương, trắng đô thị, xanh tím than là nền thường gặp; nắng sớm, nắng chiều, đèn bàn, đèn đường có thể ấm, ánh trời, đèn huỳnh quang, màn hình có thể lạnh. Trước hết nói rõ ánh sáng chính đến từ đâu, rồi mới viết phản chiếu và ánh sáng bổ trợ, không áp filter xanh cam hay màu trà cho toàn cảnh.

| Tình huống | Công thức nguồn sáng có thể thực thi |
|---|---|
| Văn phòng ban ngày, cuộc sống thư thả | Ánh sáng cửa sổ diện rộng được rèm làm dịu, màn hình hoặc đèn trong nhà chỉ bổ trợ cục bộ |
| Ấm áp ở nhà, khói lửa phố phường | Ánh sáng ấm của đèn bàn/đèn treo/đèn đường chủ đạo, trắng lạnh của cửa hàng có thể đối trọng cục bộ |
| Một mình đêm mưa | Môi trường ánh trời lạnh, đèn đường ấm tạo bóng phản chiếu trên mặt đường ướt, vệt mưa trên kính tán xạ điểm sáng |
| Hồi hộp/bí ẩn, mong manh lúc nửa đêm | Ánh sáng cứng một bên rõ ràng hoặc một ngọn đèn nhỏ, vùng tối giữ hình dạng và chi tiết mờ nhạt |
| Hoàng hôn sang đêm | Nắng chiều rút đi, bầu trời xanh tím cùng tồn tại với đèn ấm vừa bật, bật tắt đèn có logic thời gian |

**Ngữ pháp nhiếp ảnh**: 24–28mm có thể nhấn mạnh không gian bao quanh, 35mm hợp với người và môi trường cùng tồn tại, 50mm hợp với ánh nhìn khách quan, 85mm có thể nén hậu cảnh và tập trung cảm xúc, tele có thể thể hiện khoảng cách nhìn từ xa; đây là gợi ý góc nhìn, không phải tham số mà mô hình hiện tại chắc chắn có. Cho phép cầm tay thở nhẹ, gimbal bám theo, quan sát cố định và chuyển tiêu điểm.

**Khác biệt tài sản**: nhân vật là bản ghi khuôn mặt và toàn thân chính diện/nghiêng/sau lưng trong cùng một buổi chụp studio, tư thế đứng tự nhiên và nhất quán. Bối cảnh là một ảnh chụp không gian không người, giữ các manh mối sinh hoạt như mặt sàn mòn, dấu tay trên kính cửa sổ, nửa cốc nước hay chiếc ghế lệch. Đạo cụ là một ảnh chụp tĩnh vật, có mặt bàn thật/phông giấy xám, bóng đổ tự nhiên có hướng rõ ràng; không mặc định trình bày mô hình bốn ô.

**Chất liệu bề mặt và môi trường**: vải bông hơi nhăn, denim bạc màu, nếp gấp da, vết xước nhỏ trên kim loại, vết nước trên bê tông, phản chiếu kính thể hiện việc sử dụng thực tế. Nhận diện địa phương thể hiện qua kiến trúc, đường phố, cây xanh, hình chế đồ vật và biển hiệu tiếng Trung khi cần; không được yêu cầu mọi đạo cụ đều xuất hiện thương hiệu hay chữ dài chính xác từ hư không. Khi cốt truyện yêu cầu đồ mới mua thì cho phép trạng thái mới tinh.

**Động thái và hạt**: từ dồn trọng tâm về trước đến đứng dậy, từ cầm cốc đến chạm bàn rồi buông ngón tay, viết rõ nhân quả của động tác; gió ở rèm cửa, ánh quét của đèn xe đều có nguồn. Có thể giữ lượng hạt điện ảnh mịn vừa phải và nhoè chuyển động tự nhiên của video, chủ thể vẫn nhận ra được, không được để mẫu chung "không nhiễu/không hạt" xoá đi.

**Từ neo khẳng định**: `nhiếp ảnh điện ảnh đô thị người thật, đô thị Trung Hoa đương đại, ánh sáng tự nhiên và đèn thực cảnh, kết cấu da thật, nếp gấp quần áo đã qua sử dụng, dấu vết sinh hoạt, vi biểu cảm kiềm chế`. Tuỳ shot bổ sung `handheld camera breathing`, `film grain texture` hoặc `smooth camera movement`, không chồng toàn bộ.

**Tránh**: CG/PBR/game engine, mặt nạ nhựa giả, làm mịn da mất lỗ chân lông, phòng mẫu mới tinh vô căn cứ, tư thế người mẫu catwalk, neon tràn lan và filter rẻ tiền. Không được gộp nhánh này với phong cách tả thực ngọt sủng tinh tế bên dưới.

## 11. Tả thực ngọt sủng đô thị · `realpeople_urban_modern`

**Chất liệu biểu đạt và tạo hình**: nhiếp ảnh tả thực người thật, biểu đạt quan hệ ấm áp đời thường và trực quan, tạo hình hiện đại khá tinh tế và tương phản sáng tối mạnh. Giữ chi tiết da và chất liệu, theo đuổi "thật nhưng đẹp"; tách biệt với cảm giác đời sống quan sát, ngẫu nhiên và thô ráp của nhánh trên.

**Bảng màu**: trắng gạo `#F5F0E8`, xám cao cấp `#8A8A8A`, xanh lạnh `#5E7485` làm nền đô thị; hồng kem `#F4D7D5`, hổ phách `#C9A96E` dùng cho tiêu điểm thân mật; bạc `#C0C7CE` và xám gạo dùng cho chất liệu hiện đại. Độ bão hoà trung bình thấp, tương phản mạnh, nền lạnh điểm ấm, chứ không phải phong cách trong trẻo tương phản thấp suốt từ đầu đến cuối.

| Tình huống | Xử lý ánh sáng và màu |
|---|---|
| Lần đầu gặp, đời thường | Nền trắng gạo/xám, ánh sáng ấm cục bộ, chủ thể và hậu cảnh có phân biệt sáng tối |
| Công việc, xung đột | Xám/xanh lạnh, ánh sáng môi trường trắng lạnh và bóng sâu hơn, giữ chi tiết khuôn mặt |
| Rung động, hẹn hò | Ánh sáng bên ấm rơi vào tiêu điểm quan hệ nhân vật, điểm xuyết hồng kem/hổ phách |
| Hoà giải, dạo đêm | Lạnh trước ấm sau; ban đêm điểm ấm từ ánh cửa sổ hoặc đèn đường cùng tồn tại với nền lạnh |

**Chất liệu bề mặt và tài sản**: đường cắt vest, vải sơ mi, phản chiếu kính, thiết bị kim loại, đồ gỗ đều phải rõ ràng đáng tin. Tầng lớp sợi tóc rõ nhưng không thành tóc giả; màu da và tỉ lệ nhân vật vẫn do nhân vật cụ thể quyết định. Phụ kiện có thể tăng nhận diện, nhưng không tuỳ ý thêm bớt theo shot.

**Không gian và động thái**: căn hộ, văn phòng, quán cà phê, tàu điện ngầm, thang máy, hành lang thể hiện đi làm và những khoảng dừng; khung cửa sổ, kính và cửa vòm thể hiện khoảng cách giữa các nhân vật. Đẩy máy chậm dịu dàng, bám theo và shot phản ứng có thể tăng cường quan hệ, động tác then chốt và hướng ánh nhìn được cụ thể hoá.

**Từ neo khẳng định**: `nhiếp ảnh tả thực người thật đô thị hiện đại, độ tương phản mạnh, chi tiết da và vải rõ ràng, đường cắt hiện đại, chất liệu thật, nền lạnh điểm ấm, biểu đạt quan hệ ấm áp`.

**Tránh**: chất liệu biểu đạt hoạt hình/CG, làm mịn da quá mức, tương phản thấp với soft focus nặng phủ mọi thứ, ô nhiễm neon mạnh, trang phục kiến trúc cổ đại vô căn cứ. Cho phép biển đèn thành phố mà cốt truyện cần; không được chép nguyên các câu mâu thuẫn trong văn bản cũ vừa đưa phương án cảnh đêm neon vừa cấm mọi màu sắc hiện đại.

## Đưa phong cách vào tài sản và phân cảnh

1. Chọn chất liệu biểu đạt và quy tắc thị giác chính từ các nhánh trên; phong cách pha trộn phải nói rõ cái nào là chủ thể, pha trộn những chiều nào, và coi đó là đề xuất chờ xác nhận, không được lặng lẽ phối trộn.
2. Ghi bảng màu cụ thể, ranh giới tạo hình nhân vật, nguồn sáng bối cảnh và cách thể hiện chất liệu trên canvas tài sản; viết ra "áp dụng những quy tắc nào, những gì được điều chỉnh vì thiết lập của phim này", không được chỉ viết tên phong cách.
3. Prompt của mỗi tài sản chỉ lấy quy tắc liên quan đến loại tài sản đó. Ảnh thiết lập nhân vật không nhét cả bộ từ không gian thành phố; tài sản bối cảnh không trộn nhân vật; đạo cụ không trộn tay diễn viên.
4. Phân cảnh kế thừa khuôn mặt, trang phục, không gian và ánh sáng màu cơ bản của tài sản đã xác nhận, chỉ điều chỉnh cỡ cảnh, vị trí máy, động tác và biểu cảm theo shot. Thay đổi màu cảm xúc mà đạo diễn cần phải nói rõ cảnh kích hoạt và tính liên tục.
5. Kiểm tra từ khẳng định và phủ định có xung đột không, tư liệu có lẫn chất liệu biểu đạt không, chi tiết có che lấp đặc điểm nhận diện không; đọc lại ảnh thực tế rồi mới đánh giá phong cách đã thành hay chưa, prompt đã viết không có nghĩa kết quả tạo ra đã đạt được.
