# Kiến thức về chế độ video, mẫu mô hình và âm thanh

Dùng cho chuẩn bị và nghiệm thu video. Trước tiên đọc phân cảnh đã xác nhận, đơn vị sản xuất và tham chiếu thật, sau đó chỉ đọc mẫu áp dụng cho lần này trong file này; phong cách dùng các mục đã xác nhận hiện tại trong [Phong cách thị giác](visualStyles.md), shot, tính thời gian và tính liên tục dùng [Kiến thức shot](shotCraft.md). File này hấp thụ bốn prompt mô hình của v1.1.8, không đưa vào định tuyến Seedance hay mô hình mặc định của workflow khác.

## Chọn chế độ đầu vào thực tế trước

| Năng lực và lộ trình đã xác nhận | Mẫu bản cũ có thể chọn dùng | Đơn vị sản xuất |
|---|---|---|
| Seedance 2.0, đầu vào đa tham chiếu văn bản thực sự khả dụng | Mẫu ba đoạn (gốc tiếng Trung) bên dưới | Một đoạn đã xác nhận, gồm toàn bộ các shot con vốn có |
| Wan 2.6, thực sự hỗ trợ khung đầu một ảnh | Mẫu khung đầu một ảnh dạng tự sự tiếng Anh bên dưới | Một shot đã xác nhận và một khung đầu |
| Đã xác nhận khung đầu/khung đầu và khung cuối, yêu cầu shot liên tục | Visual/Motion/Camera/Audio/Narrative bên dưới | Một đơn vị động tác liên tục đã xác nhận; lộ trình khung đầu của quy trình này mặc định mỗi shot một đơn vị |
| Các chế độ đa tham chiếu thực sự khả dụng khác | References/Instruction bên dưới | Một đoạn đã xác nhận; ảnh phân cảnh thật có hay không đều được |

Bảng này là lựa chọn mẫu nội dung, không phải danh sách trắng tương thích mô hình. Trước tiên tra loại/số lượng media, chế độ, thời lượng, độ phân giải, âm thanh mà mô hình hỗ trợ và cấu hình node hiện tại. Chưa chỉ định mô hình thì xác nhận trước, không vì xuất hiện "phim ngắn" mà chọn Seedance; 2.5 hoặc phiên bản khác không được mạo nhận là đã được mẫu v1.1.8 kiểm chứng.

Thứ tự ưu tiên thực tế của định tuyến generateVideoPrompt cũ là: prompt mô hình tùy chỉnh đã gắn trong cơ sở dữ liệu và đọc được → tên mô hình chứa wan và 2.6 → tên khớp Seedance 2.0/2-0 → mode liên quan khung đầu và khung cuối → mode đa tham chiếu dạng mảng chuỗi → cấu hình prompt chung làm dự phòng. Chú thích nhánh Wan ghi "khung đầu và khung cuối", nhưng file thực tế được tải và nội dung đều là khung đầu một ảnh, không được dựa vào chú thích mà yêu cầu khung cuối. Đây là sự thật về định tuyến cũ, hiện tại không truy cập cơ sở dữ liệu cũ hay ghép chuỗi mode cũ; mẫu mà người dùng chọn rõ ràng và schema hiện tại được ưu tiên.

Mẫu chung cũ giả định nhận được 12 trường videoDesc, cờ ảnh phân cảnh..., định tuyến thật cuối cùng chỉ đưa vào videoDesc và duration. Khi chuyển đổi thì đọc trực tiếp phân cảnh đầy đủ, đầu ra node và bản ghi chọn dùng đã lưu của tập này, không vì mẫu cũ từng viết một trường nào đó mà cho rằng nó thực sự tồn tại.

## Ràng buộc nội dung chung cho mọi mẫu

1. Trước tiên liệt kê nguồn của đơn vị, thứ tự số shot gốc, lời thoại đầy đủ, âm thanh, trạng thái bắt đầu và kết thúc của động tác, tham chiếu thực tế và tổng thời lượng; không phân nhóm lại, không gộp các shot đã xác nhận.
2. Một prompt chỉ phục vụ đơn vị sản xuất hiện tại. Phần mở đầu hoặc mô tả trong thân phải nhất quán với đầu vào thực tế; ảnh tài sản phụ trách danh tính/ngoại hình, ảnh phân cảnh phụ trách bố cục của shot đó, không gọi ảnh ba góc nhìn của nhân vật là khung hình khung đầu.
3. Ảnh, video, âm thanh phải là đầu vào media thật, không phải chuỗi URL, tên file hay số thứ tự hư cấu. Ánh xạ giữa chuỗi đầu vào thống nhất và yêu cầu phân loại theo nhà cung cấp được kiểm tra theo [Thực thi canvas](../canvasOperations.md); khi không chứng minh được ánh xạ thì dừng ở trạng thái chờ xác nhận, không tự đổi số thứ tự.
4. Khi mẫu xuất hiện {{ref N}} thì đó chỉ là placeholder tham chiếu thực thi của host, số thứ tự phải điền sau khi đọc lại. Không chép nguyên cú pháp cũ @ảnhN / @hìnhảnhN (viết bằng chữ Hán); đặc biệt không được tiếp tục theo mẫu cũ mà gọi âm thanh là "ảnh".
5. Quy thuộc người nói và âm thanh phải rõ ràng. Lời thoại thông thường có khẩu hình tương ứng; OS/VO không để nhân vật trên hình mở miệng theo, shot phản ứng của người nghe cũng không chuyển người nói. Mọi lời thoại giữ nguyên ngôn ngữ gốc và nguyên từng chữ.
6. Động tác viết quá trình nhìn thấy được, tốc độ và trạng thái kết thúc, cảm xúc thể hiện qua tư thế/ánh nhìn/hơi thở; không thêm lời thoại, động cơ, địa điểm, nhân vật hay sự kiện trang trí.
7. Kế thừa ánh sáng bối cảnh và phong cách thị giác đã chọn dùng; không dựa vào ví dụ tiếng Anh cũ mà tự tạo hoàng hôn, tông lạnh, trang phục hay hướng gió. Đoạn ánh sáng của mẫu cũ chỉ giữ khi đầu vào đã xác nhận thực sự có thông tin tương ứng.
8. Mặc định chỉ dùng âm thanh môi trường và âm thanh động tác thật, không tự phối nhạc. Chữ trong khung hình và phụ đề ngoài khung tách riêng; không được vì "không có chữ" mặc định mà xóa lá thư, biển hiệu, thông tin trên màn hình trong kịch bản hoặc nhu cầu phụ đề rõ ràng của người dùng.
9. Thời lượng phải rõ ràng trong cấu hình canvas và dung lượng lời thoại, kể cả khi mẫu viết đã chọn không ghi số giây trong thân prompt, cũng không được để mô hình tùy ý suy đoán. Giới hạn trên của đơn vị là giá trị nhỏ hơn giữa 15 giây của quy trình này và năng lực mô hình thực tế; không tương thích thì quay lại phân cảnh để xác nhận.

## Seedance 2.0 đa tham chiếu văn bản (mẫu gốc tiếng Trung)

Tiếp tục dùng "cấu trúc ba đoạn" của mẫu cũ: trước tiên định nghĩa chủ thể/bối cảnh/đạo cụ, sau đó viết toàn bộ shot theo số shot gốc, cuối cùng đưa ra ràng buộc phong cách và độ ổn định ngắn gọn. Chỉ áp dụng khi lần này đã xác nhận chọn dùng mô hình và chế độ đầu vào đó; không ép các mô hình khác đổi sang cú pháp này.

### Cách điền

- Đoạn thứ nhất gắn mỗi tham chiếu thực tế với hai ba đặc điểm ổn định đã xác minh, nhân vật dùng <Chủ thể1>, bối cảnh dùng <Bối cảnh1>, đạo cụ dùng <Đạo cụ1>; ba loại nhãn được đánh số riêng. Nhãn là cách chỉ định nội bộ trong prompt, không phải ID node.
- Nếu cùng cảnh đã có mô tả nối tiếp đã xác nhận thì đặt nguyên văn sau phần định nghĩa, làm trạng thái bắt đầu của shot đầu. Đoạn đầu tiên của cảnh mới không ép viết nối tiếp; khi đầu ra thực tế của đoạn trước chưa được chọn dùng thì chỉ ghi trạng thái quy hoạch.
- Một shot tương ứng với một dòng phân cảnh gốc, không bỏ shot, không đổi thứ tự. Mỗi shot được tổ chức theo "cỡ cảnh và chuyển động máy chính → động tác/biểu cảm → vị trí và hướng → lời thoại/hiệu ứng âm thanh".
- Một shot dùng một chuyển động máy chính; thân prompt dùng số shot gốc, không viết trục thời gian tuyệt đối. Mẫu cũ cho rằng biểu đạt số giây chính xác không ổn định, vì vậy chọn dùng cách viết này; thời lượng thật vẫn được cấu hình trên node và ghi lại trong mô tả đơn vị.
- Lời thoại dùng dấu ngoặc nhọn {}, hiệu ứng âm thanh dùng dấu ngoặc góc <>; không nhét ID tài sản nội bộ, lời gọi công cụ, ghi chú kiểm duyệt vào prompt thực thi.

~~~text
Định nghĩa [đặc điểm danh tính ổn định đã xác minh] trong {{ref 1}} là <Chủ thể1> (nhân vật A);
định nghĩa [mốc neo không gian đã xác nhận] trong {{ref 2}} là <Bối cảnh1> (tên bối cảnh);
định nghĩa [đặc điểm cấu trúc đã xác nhận] trong {{ref 3}} là <Đạo cụ1> (tên đạo cụ).

[Nếu có thì giữ nguyên từng chữ: mô tả đã xác nhận nối tiếp shot trước]

Shot 1: [cỡ cảnh + một chuyển động máy chính]. <Chủ thể1> ở [vị trí] của <Bối cảnh1>, mặt hướng về [hướng],
[diễn tiến nhìn thấy được của động tác và biểu cảm đã xác nhận], [tương tác thật] với <Đạo cụ1>.
<Chủ thể1> nói {lời thoại gốc}, giọng: [đặc điểm giọng đã xác nhận hoặc tham chiếu âm thanh thật]. <[nguồn âm cụ thể]>.
Shot 2: [shot tiếp theo của phân cảnh gốc, tiếp tục danh tính, quyền sở hữu đạo cụ và trạng thái kết thúc của shot trước].
[Shot không lời thoại chỉ viết không có lời thoại và hiệu ứng âm thanh thực tế; OS/VO dùng chú thích tương ứng và giữ nhân vật không khớp khẩu hình]

[Nhãn ngắn cần thiết của phong cách đã xác nhận hiện tại]; danh tính và khuôn mặt chủ thể ổn định, động tác liền mạch,
giữ khác biệt nhân vật và quan hệ không gian rõ ràng, không có bản sao vô căn cứ, watermark hay chữ phủ ngoài khung.
~~~

Giọng nói chỉ sắp xếp khi có lời nói. Khi đã có mẫu âm thanh đã xác nhận và mô hình hỗ trợ đầu vào đó thì gắn âm thanh thật của nhân vật đó; không có mẫu thì không ép người dùng cung cấp. Có thể theo "cảm giác tuổi, cao độ, chất giọng trong/khàn..., độ dày mỏng, phát âm, hơi thở, tốc độ nói, đặc trưng cảm xúc" để đề xuất phương án giọng ngắn gọn, chưa được xác nhận thì không coi giọng mặc định mà bảng cũ đưa ra theo giới tính/thân phận phản diện là sự thật. Không cần lấp đầy cả chín chiều, cũng không được hứa kiểm soát giọng cho mô hình không có năng lực âm thanh.

~~~text
Lời thoại thông thường: <Chủ thể1> nói {lời thoại gốc}, giọng: [mô tả đã xác nhận]; chỉ khẩu hình của người nói đó tương ứng.
Độc thoại nội tâm: <Chủ thể1> OS nội tâm {lời thoại gốc}, giọng: [mô tả đã xác nhận]; miệng không mở đóng theo âm thanh.
Giọng ngoài hình: giọng ngoài hình VO {lời thoại gốc}, [nguồn âm rõ ràng]; nhân vật trong hình không khớp khẩu hình theo lời dẫn.
Không lời thoại: không có lời thoại, <[âm thanh môi trường hoặc âm thanh động tác cần thiết]>.
~~~

Gói ràng buộc chỉ thêm những mục đơn vị này cần. Bối cảnh nhiều chủ thể thông thường có thể nêu rõ số người và đặc điểm nhận diện để tránh nhân bản; cốt truyện thực sự có anh em sinh đôi thì không được áp "cấm nhân vật có ngoại hình giống nhau" cũ mà xóa nhân vật. Không được vì ví dụ động nhiều người của mẫu cũ viết "máy cố định" mà ghi đè lên việc quay bám theo người dùng đã xác nhận.

## Wan 2.6 khung đầu một ảnh

Đầu vào là một khung đầu đã chọn dùng và một shot đã xác nhận. Dùng đoạn tự sự tiếng Anh: tông phong cách → động tác chủ thể và môi trường → kết thúc bằng máy quay. Không có khung cuối, không dùng số tham chiếu; khung đầu vẫn được truyền vào qua đầu vào ảnh thật.

Nhân vật chỉ viết số ít đặc điểm nhận diện đã xác minh từ khung đầu, trọng tâm đặt vào việc sẽ chuyển động thế nào tiếp theo. Cảm xúc được gợi ý bằng động tác, ví dụ "ánh mắt hạ xuống, vai từ từ chùng xuống" phải là diễn xuất đã xác nhận, không được dùng mẫu để thêm vô căn cứ. Không lặp đi lặp lại 4K, cinematic, high quality, không dựa vào bản dịch tiếng Anh để thay đổi ngôn ngữ lời thoại.

~~~text
[A concise sentence expressing the approved visual style.]
[Character name and a few verified identity features] begins in [the exact adopted first-frame state],
then [the confirmed action, pace and emotional progression], ending in [the confirmed end state].
[The verified setting, relevant object and spatial relationship; no invented scenery.]
[Only an already approved and consistent lighting constraint, if necessary.]
"[Full dialogue in the original language]" — [Speaker] (dialogue / inner monologue, OS / voiceover, VO).
[Specific environmental and action sounds, or No dialogue where applicable.]
Captured in [starting shot size and angle], [the confirmed camera movement and endpoint],
as one continuous shot.
~~~

Khi không có lời thoại thì xóa dòng lời thoại, viết No dialogue; khi có OS/VO thì ghi rõ nhân vật silent lips. Thân mẫu không viết số giây, duration của node vẫn dùng giá trị đã xác nhận. Định tuyến cũ chỉ khớp theo tên không thể chứng minh node Wan hôm nay hỗ trợ âm thanh hay thời lượng tương tự, gặp xung đột năng lực thì điều chỉnh phương án và xác nhận trước.

## Mẫu năm đoạn chung cho khung đầu/khung đầu và khung cuối

Dùng cho shot liên tục mà người dùng đã xác nhận: khung đầu cho trạng thái bắt đầu, khung cuối chỉ dùng khi chế độ hiện tại hỗ trợ và thực sự cần. Mô tả chủ thể bằng văn bản thuần, không đánh số tham chiếu khung trong thân; vị trí khung đầu và khung cuối được gắn bởi chế độ/đầu vào thật.

~~~text
[Visual]
[Character A]: [verified identity anchors], [starting position and posture], [speaking/silent].
[Character B, if present]: [verified identity anchors], [position], [speaking/silent].
[Confirmed setting, relevant prop and approved style.]

[Motion]
0s-[t1]s: [The first confirmed action and state change].
[t1]s-[total]s: [The subsequent confirmed action ending in the adopted end-frame state if supplied].

[Camera]
[Starting size and angle], [one continuous camera path and final framing],
single continuous take, no cuts.

[Audio]
[Actual planned interval]: "[Full dialogue in the original language]" — [speaker] (dialogue, lip-sync active).
[OS/VO, if present, with silent lips; other characters remain silent].
[Specific environmental and action sounds].

[Narrative]
[The existing dramatic beat and its relation to this confirmed unit; no added event].
~~~

Trục thời gian chỉ dùng khi ở mẫu này và chế độ thật phù hợp, mỗi đoạn ít nhất 1 giây, bao phủ liên tục tổng thời lượng đã xác nhận; số giây cần phân bổ theo dung lượng lời thoại và động tác, không chia đều thành khối, không bịa đảm bảo kiểm soát chính xác. Trạng thái nói có thể thay đổi theo khoảng; khi các nhân vật khác nhau đều có lời thoại thì nêu rõ ai speaking lúc nào, các khoảng khác silent, không đánh dấu nhân vật silent vĩnh viễn.

Khung đầu và khung cuối không được thể hiện dịch chuyển/biến dạng không thể hoàn thành trong thời lượng cho trước, cũng không được dùng "không cắt shot" để ghép cứng hai cảnh vốn có thành một không gian. Ví dụ của mẫu cũ chứa nhiều phân cảnh, nhưng thân của nó yêu cầu một shot liên tục; nếu đơn vị đã xác nhận hiện có chứa cắt shot thật thì quay lại xác nhận chế độ/phân cảnh, không tự xóa shot để thích ứng.

## Đa tham chiếu chung References/Instruction

Áp dụng cho các chế độ đa tham chiếu thực sự khả dụng khác. Giữ "danh sách mục đích tham chiếu + mô tả thực thi tiếng Anh", danh tính khung hình do tham chiếu thực tế đảm nhận; lời thoại giữ nguyên văn, thời lượng được nêu rõ trong cấu hình node.

~~~text
[References]
{{ref 1}}: [Character A identity reference].
{{ref 2}}: [Confirmed scene reference].
[Only list other real inputs; describe their actual type and purpose.]

[Instruction]
[Approved visual style in a short phrase].
Shot [original number]: [Shot size and camera move].
The character from {{ref 1}} [confirmed action and expression],
[explicit screen position, facing direction and interaction],
in the environment of {{ref 2}}.
"[Full dialogue in the original language]" — [speaker] (dialogue / inner monologue, OS / voiceover, VO).
[Specific physical sounds; other characters' lip-sync state when needed].
Shot [next original number]: [Next confirmed shot with matching continuity].
[Retain the confirmed ending state and exclude only unrequested overlays or duplicates].
~~~

Nếu thực tế đã kết nối ảnh phân cảnh đã chọn dùng của shot này thì có thể thêm "Use {{ref N}} as the composition reference for shot K"; thiếu ảnh phân cảnh thì không viết câu này, không cấp số thứ tự giả, tham chiếu tài sản vẫn có hiệu lực. Nếu cả đơn vị thực sự không có đầu vào media và mô hình cho phép, thì dùng lộ trình văn bản thuần đã xác nhận và tên chủ thể dễ đọc, không giả vờ tồn tại tham chiếu đa tham chiếu.

File chung cũ vừa viết "phân cảnh đơn không làm xuyên shot" lại vừa dùng ví dụ xuyên phân cảnh, đồng thời khi không có ảnh phân cảnh thì cấm mọi tham chiếu; khi chuyển đổi giữ lại cách viết tách tham chiếu và thân, lấy đơn vị đã xác nhận của tập này và đầu vào thật làm chuẩn. Nhiều shot chỉ dùng khi mô hình/chế độ hiện tại và cách phân nhóm đã xác nhận cho phép, không được từ mẫu này suy ra mọi mô hình đa tham chiếu đều hỗ trợ chuyển shot.

## Từ vựng động tác, âm thanh và shot

Thuật ngữ shot phải biểu đạt chính xác khung hình, chứ không áp mù quáng ánh xạ cũ. Đại viễn cảnh có thể dùng extreme wide shot, viễn cảnh wide shot, toàn cảnh full shot, trung cảnh medium shot, cận cảnh medium close-up, cận cảnh đặc tả close-up, đại cận cảnh đặc tả extreme close-up. Cận cảnh không được dịch tất cả thành cận cảnh đặc tả khuôn mặt, khi bộ phận bố cục có nhập nhằng thì viết rõ phạm vi cắt khung.

Cố định là static camera; đẩy vào là push in/dolly in; kéo ra là pull back/dolly out; quay bám theo là tracking shot; lia phải nói rõ pan left/right hoặc tilt; nâng hạ là crane up/down; quay vòng là orbit around và nói rõ hướng. Các động từ không gian như holding, standing beside, following behind, sitting in phải nhất quán với khung hình và quyền sở hữu đạo cụ. handheld, slow motion, Dutch angle chỉ xuất hiện khi phân cảnh đã xác nhận cần.

Trong mẫu tiếng Anh, câu mô tả có thể bằng tiếng Anh, lời thoại nguyên văn không dịch. Thời gian lời thoại có thể kéo qua shot phản ứng của người nghe, âm thanh vẫn thuộc người nói; với OS/VO phải đồng thời nêu rõ thông tin có tiếng và quan hệ không khẩu hình. Việc lồng tiếng cho thông tin chỉ có chữ, làm sáng từng dòng hoặc âm báo thuộc phương án trình bày cần xác nhận, không vì mẫu cũ mặc định mà thêm vào.

## Ghi chép của tập này, kiểm tra trước khi thực thi và nghiệm thu

Lưu trong mô tả sản xuất/ghi chép giai đoạn đã có của tập này:

- Mẫu đã chọn dùng và lý do, mô hình/chế độ thực tế hiện tại, phạm vi đoạn hoặc shot, thời lượng mục tiêu và quy cách.
- Các đoạn prompt tương ứng với toàn bộ số shot gốc, lời thoại đầy đủ và người nói/OS/VO, nguồn âm thanh và yêu cầu khẩu hình.
- Loại, thứ tự, mục đích tham chiếu thực tế, phiên bản tài sản nguồn và node hiện tại; khung đầu và khung cuối ghi chú vai trò bắt đầu/kết thúc, các mục chưa sẵn sàng không xóa rồi đánh số lại.
- Trạng thái bắt đầu của shot đầu, kết quả đã chọn dùng của đoạn trước hoặc căn cứ quy hoạch, trạng thái kết thúc và cách nối với đoạn sau.
- Prompt thực thi đầy đủ và phạm vi người dùng xác nhận; thân mẫu không trộn báo cáo kiểm duyệt, ý kiến kiểm duyệt lưu trong mô tả dễ đọc.

Sau khi ghi, đọc lại prompt, cấu hình, kết nối và mốc đầu ra qua hàm node, xác nhận thứ người dùng phê duyệt chính là phương án thực tế này. Trạng thái tạo tuân theo [Thực thi canvas](../canvasOperations.md); "generating", idle sau reload hoặc đầu ra cũ không thể chứng minh lần này thành công.

Khi nghiệm thu, xem danh tính, tiếp xúc động tác/đạo cụ, trái phải và ánh nhìn của nhân vật, thứ tự shot, độ đầy đủ của lời thoại, nguồn âm thanh và khẩu hình, phần cuối có bị cắt không, cùng trạng thái giao nhau thực tế giữa các đoạn trước sau của media thực tế. Ghi rõ từng mục bằng chứng đã xem và vị trí vấn đề. Khi công cụ hiện tại không thể phát/hiểu video hoặc đọc track âm thanh, thì để người dùng xem trước và phản hồi, ghi "chờ người dùng kiểm tra"; đường dẫn file và trạng thái thành công không thể giả làm đã xem, đã nghe. Trước khi người dùng chọn dùng, video tạo thành công vẫn chỉ là ứng viên.

Căn cứ vào data/modelPrompt/video/seedance2Multi-parameterMode.md, wan2.6Single-imageFirstFrameMode.md, universalFirstAndLastFrameMode.md, universalMulti-parameterMode.md cùng src/routes/production/workbench/generateVideoPrompt.ts trong v1.1.8 (cd3e7c4). Cú pháp và hiệu quả mà mẫu cũ mô tả không phải là cam kết đã đo thực tế đối với mô hình hiện tại.
