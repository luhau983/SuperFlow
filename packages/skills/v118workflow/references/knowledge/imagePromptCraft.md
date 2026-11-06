# Kiến thức về prompt ảnh phân cảnh và khung đầu

Dùng cho lộ trình khung đầu hoặc cho các đơn vị sản xuất mà người dùng đã xác nhận cần ảnh phân cảnh. Đầu vào là phân cảnh đã xác nhận và các ảnh tài sản đã chọn dùng; đây là việc chuyển cùng một khung hình thành mô tả mà mô hình có thể thực thi, không phải sáng tác lại cốt truyện lần thứ hai. Đọc file này trước; khi liên quan đến phong cách thì chỉ đọc các mục đã xác nhận trong [Phong cách thị giác](visualStyles.md); thiết kế tài sản nhân vật/bối cảnh còn thiếu thì quay lại [Thiết kế tài sản](assetDesign.md) và giai đoạn tài sản.

## Đầu vào và ranh giới mô hình

Kỹ thuật prompt chung của v1.1.8 cung cấp hai bộ mẫu ảnh tham chiếu: đoạn văn tiếng Trung cho Seedream và JSON tiếng Anh cho Nanobanana/Gemini, với tiền đề là đã có ảnh tham chiếu thật. Chúng là mẫu viết của phiên bản cũ, không đảm bảo mô hình cùng tên hiện nay hỗ trợ cùng kiểu đầu vào, trường negative prompt hay tham số.

Chọn theo mô hình và schema đầy đủ của node hiện tại: Seedream có thể chọn dùng mẫu đoạn văn bên dưới; Nanobanana/Gemini có thể chọn dùng mẫu có cấu trúc; các mô hình ảnh đã xác nhận khác giữ nguyên cùng khung hình và ràng buộc nhất quán, điều chỉnh thành cách diễn đạt prompt mà mô hình đó hỗ trợ. Khi chưa chỉ định mô hình thì trước tiên kiểm tra các lựa chọn khả dụng, không kế thừa "mặc định Seedream" của tài liệu cũ; không được vì thiếu ảnh mà âm thầm đổi việc tạo nhất quán theo tham chiếu thành text-to-image.

Ảnh tham chiếu phải được truyền vào thật sự qua node tư liệu và kết nối trong [Thực thi canvas](../canvasOperations.md). Cú pháp cũ @ảnhN (chữ "ảnh" viết bằng chữ Hán), reference_images, ControlNet cũ chỉ là ghi chú thích ứng của tài liệu cũ, không tự thêm các tham số này vào yêu cầu canvas hiện tại. Ví dụ bên dưới chọn dùng {{ref N}} thường gặp của host; số thứ tự chính thức phải lấy từ kết nối thật hiện tại và thứ tự sắp xếp, khi bộ thích ứng thực tế dùng cú pháp khác thì xác minh ánh xạ trước.

## Từ phân cảnh đến một khung hình

Giữ đầy đủ chủ thể, vật thể then chốt, các lớp không gian, quan hệ và cảm xúc trong khung hình; về thời gian chỉ lấy trạng thái mà khung hình này có thể biểu đạt, các động tác tiếp theo vẫn để lại trong mô tả video. Khi số từ eo hẹp thì cắt từ bổ nghĩa trước, không được xóa thông tin tự sự như lá thư, biển chỉ dẫn, quan hệ tiếp xúc.

| Tính chất đầu vào | Xử lý khung đơn | Mô tả video giữ lại gì |
|---|---|---|
| Khoảnh khắc tĩnh: dừng bước ngước nhìn, đứng nhìn chăm chú, cười lạnh, cúi bàn viết | Giữ nguyên trạng thái đó, không đổi thành "sắp sửa" | Chỉ khi có biến đổi tiếp theo mới viết diễn tiến động tác |
| Quá trình liên tục: đi qua hành lang dài, vung kiếm chém xuống, quay người rời đi | Lấy trạng thái đóng băng khởi đầu thật của động tác đã xác nhận, không vẽ trạng thái kết quả hay tư thế chuẩn bị trừu tượng | Toàn bộ quỹ đạo, tốc độ, trạng thái kết thúc và trình tự thời gian |
| Thay đổi cỡ cảnh: viễn cảnh→trung cảnh, cận cảnh→cận cảnh đặc tả | Lấy chính xác cỡ cảnh khởi đầu bên trái; viễn cảnh không được tự ý nâng thành đại viễn cảnh | Toàn bộ quỹ đạo chuyển động máy và khung kết |
| Fade in từ màn đen, hòa tan (dissolve) | Phân biệt chuyển cảnh với ảnh nội dung khả dụng đầu tiên; khi mô hình cần tham chiếu nhận diện được thì không dùng ảnh đen hoàn toàn làm tham chiếu danh tính ổn định | Vị trí xảy ra chuyển cảnh đã xác nhận; khi xung đột năng lực thì hỏi phương án xử lý |
| Khung cuối đã xác định | Dùng trạng thái kết thúc đã xác nhận của đơn vị đó, giữ nhất quán danh tính/không gian với khung đầu | Biến đổi thực sự xảy ra giữa khung đầu và khung cuối |

Chỉ khi phân cảnh thực sự mô tả "kiếm đã giơ lên quá đầu rồi chém xuống" thì khung đầu mới chọn trạng thái giơ kiếm; không được dựa vào "vung kiếm" mà tự bịa cách cầm sai, hướng mũi kiếm hay mục tiêu tấn công. Chuyển đổi không phải là lùi mọi động từ về trạng thái chưa bắt đầu.

### Ánh xạ trường

| Thông tin phân cảnh | Vị trí trong prompt ảnh |
|---|---|
| Bối cảnh, chủ thể, vật thể và mô tả khung hình | Đoạn chính của khung hình / scene_and_framing + subject_and_action, giữ từng mục |
| Cỡ cảnh, góc máy | Bố cục rõ ràng, phạm vi cắt khung, hướng quan sát; từ vựng xem [Kiến thức shot](shotCraft.md) |
| Động tác, tư thế, hướng, không gian | Theo phán đoán khung đầu giữ trạng thái của khoảnh khắc đó, và viết ai ở trái/phải, nhìn ai, cầm gì |
| Cảm xúc | Biểu cảm, hướng mắt, cơ mặt hoặc tư thế đã xác nhận, không đổi sang cảm xúc khác |
| Ánh sáng bối cảnh và phong cách đã chọn dùng | Kế thừa từ tham chiếu thật, không tự tạo phương án văn bản xung đột |
| Chuyển động máy, lời thoại, hiệu ứng âm thanh | Để lại trong mô tả video của tập này, không viết thành phụ đề trên ảnh, cắt ghép chuyển động hay chữ âm thanh |
| Nguồn tài sản | Đầu vào media thật tương ứng với mục đích sử dụng, văn bản canvas ghi node nguồn/phiên bản/node tham chiếu của tập này |

Kỹ thuật chung cũ yêu cầu ba đoạn "khung hình→ánh sáng→phong cách", nhưng tài liệu panel cuối cùng lại loại bỏ thiết kế ánh sáng độc lập. Ở đây giữ ưu tiên khung hình và ràng buộc phong cách ngắn, ánh sáng mặc định do ảnh bối cảnh đã chọn dùng đảm nhận; chỉ bổ sung khi người dùng/phân cảnh đã xác nhận rõ ràng cần ràng buộc bằng văn bản và nhất quán với tham chiếu, không tự bổ sung trường ánh sáng của mẫu cũ.

## Vị trí và danh tính

Đọc mốc chuẩn và các điểm thay đổi của cảnh này từ phân cảnh đã xác nhận, kế thừa trái phải, trước sau, hướng và quyền sở hữu đạo cụ. Khi thiếu hướng rõ ràng có thể tham chiếu đối tượng tương tác để đề xuất phương án, không được quyết định ngẫu nhiên độc lập ở từng ảnh; thiếu sót ảnh hưởng đến tính liên tục thì quay lại phân cảnh để xác nhận trước.

Hai nhân vật đối thoại có thể viết "{{ref 1}} ở phía trước bên trái, 3/4 chính diện quay sang phải nhìn {{ref 2}}; {{ref 2}} ở phía sau bên phải, mặt hướng sang trái"; không được chỉ viết "đối thoại hai người" để mô hình tự hoán đổi danh tính. Shot qua vai phải nói rõ ai là vai/lưng ở tiền cảnh, ai ở vị trí lấy nét. Nhân vật chỉ được đổi hướng tại điểm thay đổi đã có trong phân cảnh, sau đó tiếp tục dùng trạng thái mới.

Giữ nguồn riêng và đặc điểm nhận diện ổn định cho từng nhân vật khác nhau; tránh bản sao giống hệt, nhưng không được xóa các nhân vật giống nhau mà cốt truyện cần rõ ràng. Hình ảnh trong gương hoặc mặt nước vẫn thuộc về nhân vật gốc, tuân theo [Không gian và tính liên tục](shotCraft.md#không-gian-và-tính-liên-tục), không dựa vào "phản chiếu" mà thêm một người thật, cũng không lật máy móc mọi hình phản chiếu.

## Mẫu tham chiếu đoạn văn cho Seedream

Chỉ điền một phiên bản cho shot hiện tại, mọi số thứ tự, chủ thể và nội dung phải thay bằng đầu vào đã xác minh. Bên dưới là mẫu thân prompt, không phải tham số API:

~~~text
{{ref 1}} là tham chiếu nhân vật A, {{ref 2}} là tham chiếu nhân vật B, {{ref 3}} là tham chiếu bối cảnh này.

[Khung hình] Trong không gian đã xác nhận của {{ref 3}}, [cỡ cảnh khởi đầu và góc máy].
{{ref 1}} ở [vị trí rõ ràng], mặt hướng về [hướng/đối tượng], [động tác và biểu cảm ở khoảnh khắc đó];
{{ref 2}} ở [vị trí rõ ràng], [trạng thái và quan hệ tương tác].
[Các vật thể then chốt khác, lớp không gian và thông tin nhìn thấy được trong phân cảnh, không xóa không thêm].

[Phong cách và nhất quán] [Mốc neo ngắn cần thiết của phong cách đã xác nhận hiện tại].
Giữ khuôn mặt, kiểu tóc, trang phục và trạng thái đã định của từng nhân vật tham chiếu; tiếp tục dùng không gian và ánh sáng đã định của tham chiếu bối cảnh.
Chủ thể rõ ràng, [yêu cầu chất lượng nét vẽ/chất liệu phù hợp với phong cách vẽ hiện tại]; không có phụ đề ngoài khung, watermark hay chữ phủ giao diện.
~~~

Các chủ thể trong thân prompt phải tương ứng rõ ràng với ký hiệu tham chiếu thật và tên tương ứng, không được chỉ liệt kê tham chiếu ở đầu rồi trong thân lại viết "anh ấy/cô ấy" mơ hồ. Không thêm một bản diễn đạt lại bằng tiếng Anh gây ra khung hình khác. Mẫu cũ không có đoạn negative riêng; hiện tại nếu chỉ có một chuỗi prompt thì viết các mục loại trừ cần thiết vào thân prompt, không bịa ra tham số negativePrompt.

## Mẫu tham chiếu có cấu trúc cho Nanobanana/Gemini

Đây là văn bản có cấu trúc truyền vào prompt; các trường JSON là cách tổ chức khi viết, không có nghĩa là API của mô hình hiện tại thực sự có các tham số này. Ảnh tham chiếu vẫn cần kết nối thật, không được chỉ viết URL vào JSON.

~~~json
{
  "role": "Create the confirmed storyboard frame while preserving the identities and spatial continuity of the supplied references.",
  "character_reference": [
    {
      "image": 1,
      "ref": "{{ref 1}}",
      "description": "Two or three verified identity and wardrobe features of character A."
    }
  ],
  "continuity_rules": [
    "Preserve the confirmed face, hairstyle, wardrobe and prop ownership.",
    "Keep the adopted environment and its established lighting.",
    "Change only the framing, pose and expression specified by this shot.",
    "Do not introduce additional characters."
  ],
  "shot": {
    "scene_and_framing": "Verified scene reference, starting shot size, camera angle and visible spatial layers.",
    "subject_and_action": "Every confirmed visible subject and object; exact starting or static state, screen position, facing direction, eye line and expression.",
    "style": "Only the approved style anchors and appropriate image quality description."
  },
  "negative": "Unrequested subtitles, watermark, UI overlays, identity drift, extra characters, incorrect prop ownership."
}
~~~

Tham chiếu nhân vật có thể có nhiều mục, số thứ tự giữ theo chuỗi toàn bộ đầu vào thật, không được đánh số lại đầu vào thứ 3 toàn cục thành "nhân vật 1". Tham chiếu bối cảnh/đạo cụ trong shot phải trỏ rõ đến số thứ tự thực tế, không giả làm nhân vật. Khi thực sự cần ràng buộc ánh sáng bằng văn bản đã xác nhận thì có thể thêm trường lighting; không có nhu cầu đó thì không thiết kế thêm chỉ để lấp đầy mẫu cũ. negative chỉ là các mục loại trừ trong văn bản prompt, việc có hỗ trợ tham số negative độc lập hay không vẫn căn cứ theo schema của node.

## Ví dụ chuyển đổi một khung hình

Phân cảnh đã xác nhận là: "Lối ra sảnh ga, biển chỉ dẫn bên phải; nhân vật A đeo ba lô dừng bước ngước nhìn, tay nắm chặt vé tàu, vị trí phía trước bên trái, 3/4 chính diện quay sang phải; toàn cảnh cố định; căng thẳng nhưng đã quyết định." Đầu vào thật là bốn tham chiếu: nhân vật, ba lô, vé tàu, sảnh ga.

Có thể viết:

~~~text
{{ref 1}} là nhân vật A, {{ref 2}} là ba lô, {{ref 3}} là vé tàu, {{ref 4}} là sảnh ga.
[Khung hình] Bố cục toàn cảnh tại lối ra của {{ref 4}}, bên phải giữ biển chỉ dẫn đã xác nhận. {{ref 1}} dừng bước ở vị trí phía trước bên trái, thân người 3/4 chính diện quay sang phải, ngước nhìn biển chỉ dẫn bên phải, đeo {{ref 2}}, tay nắm chặt {{ref 3}}; ánh mắt căng thẳng nhưng vững vàng. Giữ quan hệ không gian trước sau của sảnh ga.
[Phong cách và nhất quán] Tiếp tục dùng phong cách đã xác nhận cùng hình tượng tham chiếu và trạng thái bối cảnh; chủ thể rõ ràng, không có phụ đề thừa, watermark và lớp phủ giao diện.
~~~

Không được đổi "dừng bước ngước nhìn" thành "sắp ngẩng đầu", không được bỏ sót vé tàu, không được thêm cánh hoa cho đẹp, cũng không được viết đám đông, màu đèn chưa xác nhận thành sự thật. Lời thoại và âm thanh môi trường nhà ga trong video để riêng trong mô tả video, không xuất hiện trong prompt khung đơn.

## Kiểm tra chất lượng và độ trung thực

- Đối chiếu ngược từng mục với phân cảnh: chủ thể/vật thể then chốt có đầy đủ không, bối cảnh có cùng địa điểm không, cỡ cảnh/góc máy khởi đầu có đúng không, ngữ nghĩa động tác và cảm xúc có nhất quán không, hướng có theo mốc chuẩn không.
- Từ ngữ phong cách và chất lượng ảnh chỉ là phụ trợ; tránh chồng chất từ ngữ lấn át chủ thể khung hình. Kỹ thuật cũ liệt kê film grain, soft focus, mất nét... là rủi ro giảm chất lượng; khi người dùng xác nhận hạt phim, phối cảnh không khí hoặc làm mềm mang tính phong cách thì giữ ý đồ đó, đồng thời nói rõ chủ thể/chi tiết then chốt phải rõ ràng, không được coi bản thân phong cách là lỗi.
- Độ sâu trường ảnh có thể viết background bokeh, subject in sharp focus, không để làm mờ hậu cảnh lan thành mất nét toàn ảnh; sương mù, khói và méo phản chiếu chỉ xuất hiện khi phân cảnh thực sự cần.
- Mặc định loại trừ phụ đề ngoài khung, watermark, UI; biển hiệu, lá thư, màn hình tin nhắn và chữ trên đạo cụ trong thế giới câu chuyện nếu là thông tin đã xác nhận thì nguyên văn và cách tồn tại phải được giữ, không được dùng "no text" để xóa hết. Khi việc tạo chữ không đáng tin cậy thì ghi lại nội dung cần người dùng kiểm tra.
- Xử lý hàng loạt cùng cảnh thì làm từng shot, không bỏ dòng, không gộp; mốc neo danh tính/bối cảnh giữ nhất quán, biểu cảm, động tác, bố cục thay đổi theo từng shot; khi đổi mô hình/chế độ cần kiểm tra xác nhận ban đầu còn bao phủ không.

## Ghi vào canvas của tập này

Mỗi đơn vị thực sự cần ảnh giữ lại: nguồn và phiên bản phân cảnh, lý do chọn khung đầu/khung cuối, cỡ cảnh và trạng thái khởi đầu, mẫu/mô hình hiện tại, prompt thực thi đầy đủ, ánh xạ tham chiếu thật. Prompt được ghi qua hàm node, mô tả có cấu trúc ghi vào node văn bản đã có của tập này; trường của node căn cứ theo schema.

Ghi kết quả từng mục và các mục chưa giải quyết vào "Kiểm tra chuyển đổi ảnh", đọc lại prompt và tham chiếu của node tạo. Sau khi tạo thành công còn phải thực sự xem ảnh, xác nhận danh tính, bàn tay, quan hệ tiếp xúc, vị trí hướng và chữ then chốt, không được dùng kiểm tra prompt thay cho nghiệm thu ảnh. Khi không có khả năng xem ảnh thì giữ trạng thái chờ người dùng xem trước.

Căn cứ vào production_skills/storyboard_prompt_techniques.md và production_execution_storyboard_panel.md của v1.1.8 (cd3e7c4). Thuật ngữ cỡ cảnh và quan hệ phản chiếu được hiệu chỉnh theo bố cục thực tế; mẫu mô hình cũ, cách ghi tham chiếu cũ và xung đột về trường ánh sáng được chuyển đổi theo các ranh giới nêu trên.
