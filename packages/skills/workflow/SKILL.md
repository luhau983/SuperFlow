---
name: workflow
description: Trong canvas hiện tại của Toonflow, biến ý tưởng, tiểu thuyết hoặc kịch bản bản chốt thành văn bản, tài sản hình ảnh và đoạn video có thể xem được, hỗ trợ tái sử dụng tư liệu, làm tiếp và sửa cục bộ. Dùng khi thực sự sản xuất hoặc tiếp tục một dự án có sẵn; khi chỉ rõ là chỉ cần văn bản hội thoại thì không thao tác canvas, khi thảo luận hoặc chỉnh sửa chính skill thì không khởi động sản xuất.
metadata:
  version: "2.7.0"
  displayName: Quy trình sản xuất video
  author: Toonflow
  github: https://github.com/HBAI-Ltd/Toonflow-app
---

# Quy trình sản xuất trên canvas Toonflow

Tiếp nối từ nội dung người dùng đã có, đặt thành quả vào dự án Toonflow hiện tại. Tổ chức sản xuất dựa trên kịch bản lần này và tư liệu thật, không yêu cầu người dùng phải bổ sung trước một bộ tài liệu sản xuất. Gói này chứa đủ các phương pháp cần thiết, không phụ thuộc vào nhóm Skill đa vị trí trước đây.

## Bắt đầu từ đâu

Trước tiên xác định sản phẩm cần giao lần này, tư liệu đã có và các giới hạn người dùng nêu rõ; giữ nguyên thời lượng, phong cách, tỉ lệ khung, ngôn ngữ và phiên bản đã biết. Chỉ hỏi những mục còn thiếu có ảnh hưởng đến kết quả mà không thể suy đoán hợp lý.

| Đầu vào đã có | Cách xử lý |
|---|---|
| Ý tưởng hoặc một câu | Bổ sung mục tiêu, trở ngại và kết quả của nhân vật, tạo thành câu chuyện có thể duyệt và kịch bản hoàn chỉnh cho lần này |
| Tiểu thuyết, câu chuyện hoặc đoạn nguyên tác | Xác nhận phạm vi chuyển thể, giữ nguyên văn gốc, theo dõi sự kiện, nhân vật, lời thoại và thông tin chưa biết, chuyển thành kịch bản nghe nhìn |
| Kịch bản bản chốt / timeline + mục tiêu hiện tại là sản xuất, tạo, tiếp tục hoặc sửa video | **Bất kể người dùng có nhắc đến "Seedance", "prompt" hay model cụ thể hay không, đều lập tức vào thực thi "SEEDANCE EPISODE DIRECTOR · PART A" được nhúng trong file này.** Khi người dùng chưa chỉ định model, lập tức khóa định tuyến Seedance, và chỉ dùng một câu hỏi ngắn duy nhất để xác nhận "Seedance 2.0 hay 2.5"; khi người dùng đã chỉ định 2.0/2.5 thì định tuyến theo model tương ứng. Việc hỏi model không được chuyển sang cấu hình canvas, quy trình tài sản hay phương pháp prompt khác. |
| Kịch bản bản chốt / timeline + chỉ yêu cầu tài sản, đọc kịch bản, chẩn đoán hoặc tác vụ không phải video | Chỉ xử lý phạm vi không phải video mà người dùng yêu cầu rõ; không tự động tạo prompt video chỉ vì có kịch bản bản chốt. |
| Trong tác vụ Seedance, người dùng chưa chỉ định model | **Bắt buộc xác nhận model mục tiêu trước.** Chỉ hỏi một lần "Seedance 2.0 hay 2.5"; bước này thuộc phần xác định đầu vào A0 của PART A, không phải câu hỏi cấu hình thông thường. Sau khi người dùng trả lời, tiếp tục cùng trạng thái thực thi Seedance; các cấu hình thực thi như tỉ lệ khung, độ phân giải, chế độ tham chiếu, âm thanh gốc không thể thay thế, vượt qua hoặc làm gián đoạn định tuyến này. |
| Trong tác vụ Seedance, người dùng đã chỉ định 2.0/2.5 | Thực thi PART A trực tiếp; 2.0 đi theo A9.1, 2.5 đi theo A9.2. |
| Phần tiếp theo hoặc sản xuất đã có | Đọc lịch sử được chỉ định, node hiện tại và bản ghi chọn dùng, xác nhận phạm vi lần này, tiếp tục từ tiến độ thực tế |
| Chỉ định một đoạn, một tài sản hoặc một chỉnh sửa | Chỉ xử lý phạm vi đó và các phụ thuộc thực sự bị ảnh hưởng, không chạy lại toàn bộ chuỗi |

> **Quy tắc tạo prompt Seedance đã được nhúng trực tiếp vào workflow này, không phải Skill bên ngoài, cũng không phải workflow gọi sang một Skill khác.** Khi tác vụ bước vào giai đoạn "kịch bản đã xác nhận → prompt phân đoạn Seedance 2.0/2.5", bắt buộc thực thi trực tiếp **"SEEDANCE EPISODE DIRECTOR · PART A"** ở bên dưới file này. Quy tắc nhúng này là quy chuẩn thực thi có mức ưu tiên cao nhất của workflow ở giai đoạn tạo prompt Seedance: lấy A0–A12 trong `SKILL-seedance-episode-director.md` do người dùng cung cấp làm cơ sở, và gộp thêm các quy tắc về tính liên tục, độ ổn định khi tạo và kiểm tra lỗi hớ (sạn) mà người dùng đã bổ sung rõ ràng sau đó; nếu các đoạn khác của workflow này, references/methods, storyboard hoặc hướng dẫn cũ xung đột với nó, lấy PART A nhúng hiện tại làm chuẩn. Trừ khi người dùng sau này sửa đổi rõ ràng, không được dùng phương pháp khác để viết lại, làm yếu hoặc thay thế khóa trung thành cốt truyện, quy tắc xác nhận model mục tiêu, quy tắc phân đoạn/thời lượng, Reference binding, mẫu A9, kiểm tra A11 hoặc tối ưu một lần A12 trong đó.

### Khóa định tuyến Seedance (quy tắc lối vào có mức ưu tiên cao nhất)

Khi đồng thời thỏa mãn cả hai điều sau, **tự động coi là tác vụ Seedance**, không yêu cầu người dùng phải nói các từ kích hoạt như "Seedance", "2.0/2.5", "tạo prompt":

1. Hiện đã có kịch bản bản chốt có thể thực thi, timeline, đoạn cốt truyện theo shot, văn bản đoạn đã xác nhận, hoặc người dùng yêu cầu rõ ràng tiếp tục sản xuất video đã có;
2. Ý định hiện tại là sản xuất video, tạo video, tiếp tục video, sửa video, chuẩn bị tạo video, biến cốt truyện thành video, hoặc cấu hình cho video sắp tạo.

Một khi khớp, lập tức khóa thành **trạng thái thực thi Seedance**, và tuân thủ:

- **Vào PART A trước, rồi mới xử lý cấu hình thực thi canvas.** Bản thân model mục tiêu thuộc đầu vào bắt buộc của A0, không tính là cấu hình canvas; không được gọi trước các công cụ đọc canvas (`getCanvas/findCanvasNodes/getCanvasNodes/getCanvasEdges/getNodeTools`) hoặc `node:getConfig` của node, không được hỏi trước provider/resolution/ratio/mode, không được làm phân cảnh chung trước, hay vào phương pháp prompt khác trước rồi mới quyết định có dùng Seedance hay không.
- Khi người dùng chưa chỉ định 2.0/2.5, **bắt buộc sau khi định tuyến Seedance đã được khóa, dùng một câu hỏi ngắn duy nhất để xác nhận "Seedance 2.0 hay 2.5"**. Sau khi hỏi vẫn giữ trạng thái thực thi Seedance, không thoát ra, không chuyển sang workflow thông thường; người dùng trả lời model xong thì lập tức tiếp tục thực thi PART A từ A0.
- Khi người dùng đã chỉ định 2.0/2.5, dùng trực tiếp thông tin đó làm đầu vào A0; không được hỏi lại.
- **Tách riêng việc xác nhận model mục tiêu với việc hỏi cấu hình thực thi.** Khi chưa chỉ định 2.0/2.5, trước tiên xác nhận model mục tiêu trong A0; sau khi xác nhận, nếu tầng thực thi còn cần hỏi các cấu hình như tỉ lệ khung, độ phân giải, tạo âm thanh, chế độ tham chiếu, nhà cung cấp, thì các câu hỏi này chỉ là bổ sung tham số thực thi cho cùng một tác vụ Seedance. Sau khi người dùng trả lời vẫn ở cùng trạng thái thực thi Seedance, không được quay về workflow chung, chọn lại phương pháp prompt hoặc bỏ qua A0–A12.
- Khi người dùng trong phần hỏi đáp cấu hình chỉ trả lời ngắn như "16:9", "1080p", "bật âm thanh gốc", "2.5", các câu trả lời này được coi là **bổ sung cấu hình cho tác vụ Seedance hiện tại**, không phải tác vụ mới; không được giải trừ khóa chỉ vì câu trả lời đó không lặp lại chữ "Seedance/prompt".
- Nếu người dùng hỏi trước "có những cấu hình nào/dùng cấu hình gì" rồi mới quyết định, việc trả lời câu hỏi cấu hình không hủy định tuyến Seedance; một khi tiếp tục sản xuất video, bắt buộc quay lại/tiếp tục PART A.
- Chỉ khi người dùng chủ động đổi tác vụ rõ ràng thành "không tạo/sửa prompt video, chỉ làm tài sản, sáng tác kịch bản, tư vấn hoặc công việc khác không phải video", mới giải trừ khóa định tuyến Seedance.
- Ở giai đoạn tạo media thực tế, nếu node thời gian thực không hỗ trợ model đã chọn ở A0, chỉ được báo cáo xung đột năng lực thực tế và quay lại xử lý các mục bị ảnh hưởng trong PART A; **không được dùng model mặc định của tầng cấu hình để âm thầm thay thế định tuyến Seedance.**

**Cốt lõi: Seedance là lõi thực thi đạo diễn của giai đoạn sản xuất video, không phải plugin tùy chọn chỉ kích hoạt khi người dùng nói ra một từ khóa nào đó.**

### Cách ly cứng giai đoạn Seedance (bắt buộc)

Một khi khớp "Khóa định tuyến Seedance" ở trên — tức là đã có đầu vào cốt truyện có thể thực thi và mục tiêu hiện tại bước vào sản xuất/tạo/sửa video — lập tức vào **trạng thái thực thi cách ly cứng**; không yêu cầu người dùng nói thêm "Seedance" hay "prompt":

- Từ lúc vào PART A cho đến khi hoàn tất xuất prompt cuối cùng, **chỉ thực thi PART A nhúng trong file này**, không được đọc thêm hay áp dụng `references/sourceAndScript.md`, `references/methods/*`, bất kỳ quy tắc storyboard/phân cảnh cũ hay references dạy học cho người, cũng không được lấy từ các file này một bộ quy tắc thứ hai về phân đoạn, thời lượng, shot, vị trí đứng, diễn xuất, chuyển động máy, tính liên tục, âm thanh, Reference binding, mẫu hay QA.
- Kịch bản, timeline, thiết lập nhân vật/bối cảnh/đạo cụ, node tham chiếu thật/handle tài sản mà người dùng đã cung cấp thuộc đầu vào của PART A, không bị cách ly này hạn chế.
- **Ngoại lệ duy nhất**: chỉ khi A1.2/A4 của PART A cần rõ ràng "bổ sung tài sản tham chiếu/đề xuất thiết kế cần thiết khi không có ảnh tham chiếu", mới được đọc theo nhu cầu `references/assets.md`, `references/methods/visualDesign.md`, `references/methods/colorAndLight.md`; chỉ lấy nội dung cần cho thiết kế ngoại hình/không gian/chất liệu/ánh sáng, **không được mang các phương pháp về thời lượng, shot, diễn xuất hay tự sự trong các file này trở lại quy tắc prompt Seedance**. Hoàn tất đề xuất tài sản/thiết kế thì lập tức quay về PART A.
- Sau khi prompt Seedance cuối cùng đã được chốt theo A11/A12, nếu người dùng yêu cầu rõ ràng việc kết nối tham chiếu thực tế, ghi vào node tạo hoặc tạo/nghiệm thu media, mới thoát khỏi cách ly cứng prompt, vào **tầng thực thi** của `canvasExecution.md` / `stateAndDelivery.md`. Tầng thực thi chỉ được chuyển prompt đã chốt, kết nối tham chiếu thật, đặt tham số model thật và kiểm tra kết quả, **không được viết lại phân đoạn, định dạng, cốt truyện, vị trí đứng, diễn xuất, chuyển động máy hay tính liên tục mà PART A đã xác định**.
- Nếu tầng thực thi phát hiện năng lực thật của model xung đột cứng với prompt đã chốt, chỉ báo cáo xung đột năng lực cụ thể và quay về xử lý mục bị ảnh hưởng trong PART A; quy tắc canvas không được tự chế ra prompt tương thích khác.

**Mục đích: giai đoạn Seedance chỉ có một nguồn quy tắc đạo diễn — PART A nhúng trong file này. Tuyên bố ưu tiên không thể thay thế cách ly cứng.**

**Chỉ khi kịch bản chưa chốt và thực sự cần sáng tác hoặc chuyển thể** mới đọc [Đầu vào và kịch bản](references/sourceAndScript.md). Một khi vào cách ly cứng prompt Seedance, điều này ngừng hiệu lực.



## Lõi thực thi nhúng cho việc tạo prompt Seedance

Nội dung dưới đây lấy PART A trong `SKILL-seedance-episode-director.md` do người dùng cung cấp làm cơ sở thực thi, và đã gộp các yêu cầu về tính liên tục, độ ổn định khi tạo và kiểm tra lỗi hớ mà người dùng bổ sung rõ ràng sau đó. **Khi chạy, thực thi trực tiếp mục này, không đọc thêm, không gọi bất kỳ Skill seedance-episode-director độc lập nào.** Khi mục này xung đột với nội dung khác của workflow, mục này được ưu tiên.

# PART A — Quy tắc thực thi
═══════════════════════════════════════════

## A0. Xác định đầu vào

Nhận đầu vào của người dùng xong, trước tiên tự xác định các mục sau; suy ra được từ văn bản thì thực thi luôn, trừ khi việc thiếu thông tin khiến hướng đi của thành phẩm khác hẳn, nếu không thì đừng hỏi quá 2 câu:

1. **Model mục tiêu** —— người dùng nói 2.5 thì mỗi đoạn tối đa 30s; nói 2.0 thì mỗi đoạn tối đa 15s; **nếu người dùng không nói, bắt buộc dùng một câu hỏi ngắn duy nhất để xác nhận "Seedance 2.0 hay 2.5" rồi mới tiếp tục**. Câu hỏi này thuộc phần xác định đầu vào A0 của tác vụ Seedance này, trước và sau khi hỏi đều giữ khóa định tuyến Seedance; không được vì cần xác nhận model mà chuyển sang workflow thông thường, cấu hình canvas hay phương pháp prompt khác.
2. **Yêu cầu tổng thời lượng** —— người dùng đưa tổng thời lượng nghiêm ngặt (như "55s") thì lập ngân sách thời lượng theo A3; không đưa thì ước tính tổng độ dài theo nhịp tự nhiên của toàn bộ cốt truyện.
3. **Quy mô tự sự** —— xác định là một cảnh diễn đơn lẻ, một tập ngắn, hay một tập trọn vẹn dài 2–3 phút hoặc hơn.
   - Dù dài bao nhiêu, **trước tiên lên kế hoạch toàn phim, rồi mới quyết định chia thành mấy đợt giao**.
   - Chia đợt chỉ là quản lý dung lượng giao, không có nghĩa là cắt cốt truyện, cũng không có nghĩa là cắt lại cốt truyện.
4. **Timecode gốc** —— nếu người dùng đã đưa các khối thời gian như [0–10s] [10–25s], coi chúng là nhịp cốt truyện gốc/timeline tham chiếu; trừ khi người dùng nói rõ "khóa cứng nghiêm ngặt", không được máy móc đánh đồng chúng với đoạn tạo.
5. **Đã có thư viện tài sản tham chiếu chưa** (ảnh nhân vật / ảnh bối cảnh / ảnh đạo cụ / nhãn đặt tên)?
   - Có → **tham chiếu trực tiếp** (theo A1.2)
   - Không → trích xuất tài sản từ văn bản cốt truyện, chỉ đăng ký những tài sản thực sự xuất hiện trong tập này; nếu model là 2.5 và cần khóa danh tính, có thể tạo ảnh tham chiếu trước theo "Bổ sung cho Trường hợp hai" trong A1.2.
6. **Nguồn chữ trên hình** —— phân biệt "phụ đề/tiêu đề hậu kỳ" với "chữ vật thể trong bối cảnh/chữ trên bao bì sản phẩm", xử lý theo A1.3.

**Ràng buộc cốt lõi: đầy đủ, đúng thứ tự, có thể tạo.**
- Không làm mất cốt truyện, không bỏ qua các nhịp "khó quay".
- Không sắp xếp lại thứ tự trước sau của cốt truyện gốc.
- Không hy sinh lời thoại tự nhiên, quá trình hành động hay thời gian phản ứng chỉ để ép số đoạn xuống mức tối thiểu lý thuyết.
- Cốt truyện dài thì trước tiên lập "bảng toàn bộ đoạn của phim", rồi theo dung lượng mỗi đợt mà cắt thành Batch 1 / Batch 2 / Batch 3……; mỗi đợt đều giữ số đoạn toàn cục.

### A0.1 Khóa trung thành cốt truyện (mức ưu tiên cao nhất · hiệu lực trong toàn bộ quy trình)

**Tổng cương: chỉ đạo diễn, không biên kịch.**

Skill này được phép: **tách, gộp đoạn, tính giờ, chuyển thành shot, sắp xếp vị trí đứng, viết các hành động đã có sao cho nhìn thấy được, bổ sung chi tiết thực thi vật lý/quay phim không làm thay đổi sự thật cốt truyện.**

Skill này không được phép: **thêm sự kiện cốt truyện, xóa sự kiện cốt truyện, thay thế sự kiện cốt truyện, đổi thứ tự sự kiện, đổi người thực hiện/người chịu tác động của sự kiện, đổi nguồn gốc hoặc công dụng của đạo cụ, viết thêm tiền sử/nhân quả mà người dùng không cung cấp, tự ý cụ thể hóa nhân vật mơ hồ.**

#### A0.1.1 Thứ tự ưu tiên nguồn sự thật cốt truyện

Khi có xung đột, xác định "cái gì mới là sự thật cốt truyện" theo thứ tự sau:

1. **Chỉ thị sửa đổi rõ ràng mới nhất của người dùng**
2. **Cốt truyện gốc / kịch bản / timeline mà người dùng đang cung cấp**
3. **Thiết lập tài sản nhân vật, bối cảnh, đạo cụ mà người dùng cung cấp rõ ràng**
4. **Prompt, tóm tắt, giải thích bổ sung do AI tạo trước đó**

**Nội dung AI tự bổ sung ở lượt trước vĩnh viễn không được ngược lại nâng cấp thành sự thật cốt truyện.**

Ví dụ: phiên bản trước AI tự thêm "nhân vật A lấy đạo cụ A ra từ hộp đựng trước", nhưng cốt truyện gốc của người dùng chỉ viết "nhân vật A dùng đạo cụ A", phiên bản sau không được vì "tính liên tục" mà tiếp tục kế thừa hành động lấy ra thêm này.

#### A0.1.2 Năm loại tuyệt đối cấm sửa đổi

Với mỗi sự kiện trong cốt truyện gốc của người dùng, cấm:

1. **Thêm mới**: nguyên văn không có "mở nắp / rút giấy / đứng dậy / đưa cho / quay đầu / cầm bao bì lên", thì không được tự thêm vào cho trôi chảy.
2. **Xóa**: hành động, lời thoại, phản ứng, khoảng dừng, shot trống đã có trong nguyên văn, không được xóa vì thời lượng hay vì diễn xuất tiết chế.
3. **Thay thế**: nguyên văn là hành động A, không được đổi thành hành động B trông hợp lý hơn.
4. **Đổi người sở hữu hành động**: khi nguyên văn viết "cha mẹ / phụ huynh / người lớn", không được tự ý chỉ định là "bố" hay "mẹ"; ai nói, ai làm, ai cầm, ai được lau đều phải giữ nguyên.
5. **Đổi thứ tự / đổi nhân quả**: không được vì logic sản phẩm, tính liên tục hay thẩm mỹ shot mà đưa hành vi phía sau lên trước, hoặc thêm cho trạng thái phía sau một hành động tiền đề không có trong nguyên văn.

#### A0.1.3 Ranh giới được phép "cụ thể hóa"

Chỉ khi thỏa mãn các điều kiện sau, mới được viết hành động trong nguyên văn cụ thể hơn:

- Nội dung cụ thể hóa **nằm trực tiếp trong quá trình thực thi vật lý của hành động gốc**;
- Không thêm quyết định cốt truyện mới, thay đổi trạng thái đạo cụ hay quan hệ nhân vật;
- Xóa dòng mô tả cụ thể này đi thì sự thật cốt truyện hoàn toàn không đổi;
- Không yêu cầu khán giả nhận được thông tin mới mà nguyên văn không có.

Ví dụ:
- Nguyên văn "nhân vật A dùng đạo cụ A lau tay" → có thể viết "đạo cụ A chạm vào lòng bàn tay và lau qua các ngón tay", đây là trực quan hóa hành động đã có.
- Nguyên văn "nhân vật A dùng đạo cụ A lau tay" → **không được** viết "cầm hộp đựng lên → mở hộp → lấy ra đạo cụ A mới → rồi lau", vì đã thêm nhiều sự kiện cốt truyện.

Chuyển động máy quay, bố cục, cỡ cảnh, tiêu điểm, kết quả nhìn thấy được của ánh sáng, tiếng động foley tương ứng với va chạm đã có, thuộc về thực hiện kỹ thuật, không coi là thêm cốt truyện; nhưng chúng cũng không được tạo ra sự thật cốt truyện mới.

#### A0.1.4 Không bổ sung tiền sử, không truy ngược nguồn gốc

Nếu khi một khối thời gian bắt đầu, nguyên văn đã đưa ra một trạng thái, thì coi đó là **trạng thái ban đầu đã định** của nhịp đó.

- Nguyên văn viết "nhân vật A đã cầm đạo cụ A trong tay khi bước vào khung hình" → bắt đầu ngay từ "trong tay đã có đạo cụ A".
- Không được vì "đạo cụ thì phải có nguồn gốc" mà tự thêm "cầm hộp đựng / mở nắp / lấy ra".
- Nguyên văn viết "nhân vật đã đứng ở một vị trí nào đó" → có thể bắt đầu từ trạng thái ở vị trí đó; trừ khi nguyên văn viết rõ đứng dậy/đi tới, không được thêm toàn bộ quá trình di chuyển.

**Tính liên tục chỉ duy trì các trạng thái người dùng đã định nghĩa, không có trách nhiệm thay người dùng bổ sung tiền sử chưa được viết ra.**

#### A0.1.5 Thông tin mơ hồ thì giữ mơ hồ

Nội dung người dùng không nói rõ, mặc định giữ nguyên mức độ trừu tượng ban đầu:

- Các cách gọi chung như "cha mẹ / phụ huynh / người lớn / nhân viên / ai đó" giữ nguyên mức độ trừu tượng, không tự ý xác định danh tính, giới tính hay số người;
- "Một bàn tay" không suy ra cụ thể tay trái/tay phải, trừ khi việc thực thi shot thực sự cần và không tạo thành sự thật cốt truyện về sau;
- "Cầm đạo cụ A" không tự động suy ra "lấy thêm một cái mới từ hộp đựng";
- "Dùng đạo cụ A để hoàn thành hành động" không tự động suy ra số lần dùng, số lượng tiêu hao hay là cái thứ mấy;
- "Ở bên cạnh" không tự ý tạo quan hệ không gian chính xác, trừ khi cần đưa ra tọa độ trung tính để tạo shot, và không làm thay đổi cốt truyện.

#### A0.1.6 Khi cốt truyện nguồn có chỗ trống/mâu thuẫn

- **Chỗ trống**: không tự bịa cốt truyện nối cầu; ưu tiên dùng HARD CUT / khối thời gian mới / đoạn mới để bắt đầu từ trạng thái đã biết tiếp theo.
- **Mâu thuẫn**: không tự chọn một phiên bản để đè lên phiên bản kia; ưu tiên chỉnh sửa rõ ràng mới nhất của người dùng, nếu không thì đánh dấu "xung đột văn bản nguồn" trong tổng quan toàn phim.
- **Tổng thời lượng nghiêm ngặt xung đột với cốt truyện**: được phép tăng số đoạn hoặc đánh dấu xung đột thời lượng, không được xóa sửa cốt truyện để giải quyết.

---

## A1. Ngôn ngữ đầu ra và đặt tên tài sản

### A1.1 Ngôn ngữ đầu ra (bắt buộc)
**Mặc định toàn bộ tiếng Việt.** Prompt chính thức, danh sách tài sản, giải thích vị trí đứng, tầng diễn xuất, timeline ——
tất cả đều viết bằng tiếng Việt.

**Những phần giữ nguyên văn gốc không dịch:**
- Lời thoại (chép nguyên văn gốc, ví dụ "Kimi wa?" "Nani ga?")
- Giá trị số và đơn vị: `15s` `30s` `24fps` `4K` `2–3mm` `180°` `0:00–0:06`
- Góc quang học: `29°` `47°` `84°` `107°`
- Viết tắt kỹ thuật: `HARD CUT`

**Quy tắc tiêu đề cấu trúc:**
- Seedance 2.0: tiêu đề cấu trúc mặc định bằng tiếng Việt.
- Seedance 2.5: prompt chính thức cuối cùng cố định dùng các tiêu đề trường tiếng Anh sau: `Objective`, `Reference binding`, `Immutable locks`, `Target duration`, `Timeline`, `Visual direction`, `Audio direction`, `Preserve`, `Avoid`; nội dung trường mặc định vẫn bằng tiếng Việt.

**Ngoại lệ bản toàn tiếng Anh**: chỉ khi người dùng nói rõ "cho tôi bản tiếng Anh / for an international pipeline", mới đổi cả nội dung trường sang tiếng Anh.

### A1.2 Đặt tên tài sản và nhãn tham chiếu

**Chia thành hai trường hợp:**

**Trường hợp một · Người dùng đã xây dựng thư viện nhãn tham chiếu**
Người dùng dùng nhãn đặt tên trong pipeline của mình (như `@HERO1V2`, `@LâmTrựcNhân_v2`,
`#PhòngKháchNhàCũ` v.v.) ——
- **Tham chiếu trực tiếp nguyên dạng**, người dùng đưa gì thì chép y nguyên cái đó, kể cả `@` / `#` / bất kỳ ký hiệu nào
- Các nhãn này là **handle tham chiếu danh tính của nhân vật/bối cảnh/đạo cụ**,
  tương ứng với ảnh tham chiếu thật hoặc thư viện tài sản đã xây dựng
- **Điều bị cấm là: dùng hình ảnh khung cuối của đoạn trước làm tham chiếu vị trí đứng** ——
  vị trí đứng luôn được dựng lại bằng tọa độ tuyệt đối trong văn bản (xem A5)

**Trường hợp hai · Người dùng không có thư viện nhãn**
- Tên tài sản **không thêm @**, chỉ dùng tên tiếng Việt
- Danh sách viết: `Nhân vật | Lâm Trực Nhân` `Bối cảnh | Phòng khách nhà cũ` `Đạo cụ | Chai rượu mơ`
- Trích dẫn trong phần nội dung: viết trực tiếp "Lâm Trực Nhân" "Phòng khách nhà cũ" "Chai rượu mơ"
- Nhiều tài sản cùng loại trong cùng một đoạn: dùng tiếng Việt để phân biệt "cốc của Trực Nhân / cốc của Sato"

**Bổ sung cho Trường hợp hai · Không có thư viện tham chiếu nhưng cần khóa danh tính (Seedance 2.5)**

Khi model mục tiêu là 2.5, người dùng không có thư viện nhãn cũng không có ảnh tham chiếu, nhưng đoạn này cần khóa danh tính nhân vật / bối cảnh / đạo cụ:
- Được phép trước tiên tạo ảnh tham chiếu theo phương pháp tài sản của Toonflow (bảng tham chiếu bốn góc nhìn nhân vật / góc nhìn chính của bối cảnh / bảng 2×2 đạo cụ), rồi mới vào Reference binding của A1.2.1 / A9.2;
- Ảnh tham chiếu được tạo chỉ khóa các chiều "người dùng chỉ định hoặc có thể xác định rõ": khuôn mặt / kiểu tóc / cảm giác tuổi / vóc dáng / trang phục của nhân vật, cấu trúc và chất liệu bối cảnh, màu chủ đạo / hình dạng / cấu trúc đóng mở của đạo cụ;
- Ảnh tham chiếu không vượt quyền kiểm soát vị trí đứng, ánh sáng, shot hay cốt truyện thêm (giống phân loại vai trò ảnh tham chiếu và xử lý xung đột trong A1.2.1);
- Vẫn tuân theo trung thành cốt truyện A0.1: ngoại hình được tạo đều coi là "đề xuất thiết kế", không giả làm sự thật trong nguyên văn; không được vì thế mà thêm sự kiện cốt truyện, nguồn gốc đạo cụ, quan hệ nhân vật hay quy tắc thế giới; nhân vật / đạo cụ / chữ xuất hiện trong ảnh tham chiếu mà nguyên văn không nhắc tới, không được tự động đưa vào cốt truyện.

---

### A1.2.1 Gắn ảnh tham chiếu Seedance 2.5 (bắt buộc)

Khi model mục tiêu là **Seedance 2.5**, và người dùng cung cấp ảnh nhân vật, ảnh bối cảnh, ảnh sản phẩm, ảnh đạo cụ, ảnh vị trí đứng hoặc tham chiếu hình ảnh khác, bắt buộc gắn các ảnh tham chiếu này như một phần của prompt chính thức vào từng đoạn tạo có liên quan.

**Quy tắc cứng:**
- Node ảnh thật / handle tham chiếu do người dùng cung cấp phải được **trích dẫn nguyên dạng**, ví dụ `{{node/image-xxxx}}`, `@TênNhânVật_v2`, `#TênBốiCảnh`; cấm tự đổi tên, viết tắt hay bịa ra Ref không tồn tại.
- Mỗi đoạn tạo 2.5 đều **tự chứa**: ảnh tham chiếu cần cho đoạn đó phải được liệt kê lại trong `Reference binding` của chính đoạn đó, không được viết "như trên", "dùng lại ảnh tham chiếu đoạn trước".
- Ảnh nhân vật / ảnh sản phẩm được dùng lặp lại trong toàn phim, cũng phải gắn lặp lại trong mỗi đoạn thực sự liên quan đến chúng.
- Chỉ gắn ảnh tham chiếu thực sự liên quan đến đoạn này, không nhét toàn bộ ảnh của cả tập vào mọi đoạn một cách không phân biệt.
- Một ảnh chỉ kiểm soát các chiều được người dùng chỉ định hoặc có thể xác định rõ, cấm vượt quyền kiểm soát các chiều khác.

**Trích xuất tài sản tham chiếu và định danh đơn giản:**
- Trước tiên tự động trích xuất từ cốt truyện, shot, hành động và nội dung hình ảnh của đoạn này các tài sản tham chiếu thật **mà đoạn này thực sự liên quan và thực sự cần gọi đến**; ảnh nhân vật, ảnh bối cảnh, ảnh sản phẩm, ảnh đạo cụ, ảnh vị trí đứng, ảnh động tác v.v. đều nhận diện theo công dụng thực tế.
- Với mỗi tham chiếu thật chỉ làm **định danh ngắn gọn**, nói rõ nó tương ứng với ai / cái gì / loại công dụng nào là đủ, ví dụ "tham chiếu nhân vật Lâm Trực Nhân" "tham chiếu bối cảnh phòng khách nhà cũ" "tham chiếu đạo cụ chai rượu mơ" "tham chiếu vị trí đứng của đoạn này".
- Không triển khai giải thích dài dòng "kiểm soát gì / không kiểm soát gì" trong `Reference binding` cuối cùng; ranh giới tác dụng bên trong của ảnh tham chiếu vẫn được hiểu theo công dụng rõ ràng của người dùng và nội dung có thể xác định rõ, cấm vượt quyền đưa nhân vật, đạo cụ, phông nền, chữ hay tư thế thừa trong ảnh tham chiếu vào cốt truyện.
- Khi người dùng nói rõ "chỉ tham chiếu vị trí / chỉ tham chiếu trang phục / chỉ tham chiếu sản phẩm" v.v., giữ giới hạn công dụng "chỉ" này trong định danh đơn giản, ví dụ "chỉ tham chiếu vị trí đứng" "chỉ tham chiếu trang phục".

**Xử lý xung đột:**
- Khi thiết lập bằng văn bản của người dùng xung đột với ảnh tham chiếu, xử lý theo thứ tự ưu tiên nguồn sự thật của A0.1.1; chỉnh sửa văn bản rõ ràng mới nhất của người dùng được ưu tiên.
- Khi nhiều ảnh tham chiếu xung đột với nhau, không tự trộn thành thiết lập mới; dùng riêng từng ảnh theo công dụng người dùng nêu rõ.
- Ảnh tham chiếu có nhân vật, đạo cụ, chữ hay trang trí thừa mà người dùng không nhắc tới, không tự động đưa vào cốt truyện.

**Định dạng Reference binding 2.5 khuyến nghị:**
```text
Reference binding:
- {{node/image-xxxx}}: tham chiếu nhân vật Lâm Trực Nhân
- {{node/image-yyyy}}: tham chiếu bối cảnh phòng khách nhà cũ
- {{node/image-zzzz}}: tham chiếu đạo cụ chai rượu mơ
- {{node/image-aaaa}}: chỉ tham chiếu vị trí đứng
```

Dạng node trong ví dụ trên chỉ biểu thị **vị trí định dạng**; khi chạy bắt buộc thay bằng ID node / handle tài sản đầy đủ mà người dùng thực sự cung cấp và đoạn này thực sự cần, cấm chép y nguyên hoặc bịa ID mẫu. Nếu đoạn này không có bất kỳ ảnh tham chiếu / handle tài sản thật nào, thì bỏ toàn bộ mục này.


### A1.3 Chữ trên hình: phụ đề hậu kỳ vs chữ trên tài sản vật thể

Bắt buộc phân biệt hai loại chữ:

**A. Chữ kiểu hậu kỳ (mặc định cấm giao cho model tạo)**
- Phụ đề, tiêu đề, thẻ giải thích, thẻ thuyết minh, chữ trên sticker, chữ chồng UI, watermark
- Mặc định viết thành: **không phụ đề, không chữ màn hình thêm, không chồng chữ hậu kỳ**
- Những chữ này nếu cần, mặc định để lại cho khâu dựng hậu kỳ thêm vào

**B. Chữ vật thể trong cốt truyện / chữ trên tài sản sản phẩm (không phải phụ đề)**
- Chữ in sẵn trên túi bao bì, biển hiệu, thư, trang sách, giao diện điện thoại v.v.
- Nếu người dùng cung cấp ảnh tham chiếu/ảnh tài sản: ưu tiên viết "**giữ nghiêm ngặt ngoại hình tài sản tham chiếu, không thêm, không viết lại, không vẽ lại chữ trên bao bì**", đừng yêu cầu model tự tạo chữ rõ nét từ hư không
- Nếu không có tài sản tham chiếu: trừ khi cốt truyện bắt buộc phải đọc được chữ cụ thể, nếu không đừng đặt "chữ phải rõ ràng dễ đọc" làm nhiệm vụ tạo
- Chỉ khi người dùng yêu cầu rõ ràng một đoạn nào đó bắt buộc phải đọc được chữ, mới khóa từng chữ; đồng thời nhắc rằng đây là mục tạo rủi ro cao

**Do đó:** "không phụ đề / không chữ màn hình thêm" không xung đột với "chữ đã có sẵn trên bao bì sản phẩm". Điều bị cấm là AI tự thêm hoặc viết lại chữ, không phải biến bao bì thật thành bao bì không chữ.

---

## A2. Phân tích toàn bộ nhịp và giữ nguyên thứ tự (không lọc bỏ cốt truyện)

Mục tiêu của A2 không phải "chọn vài điểm then chốt", mà là tách cốt truyện gốc thành các **nhịp tự sự đầy đủ, liên tục, có thể tính giờ**. Năm loại nhịp then chốt chỉ dùng để đánh dấu, không làm ngưỡng cắt bỏ.

### A2.1 Nhịp nguyên tử: giữ lại toàn bộ, và lập "sổ cái cốt truyện nguồn"

Trước tiên tách các nhịp nguyên tử theo thứ tự nguyên văn, các loại thường gặp gồm:

| Nhịp nguyên tử | Định nghĩa | Ví dụ |
|---|---|---|
| **Lời thoại** | Một câu hoàn chỉnh hoặc một nhóm câu liên tiếp mà nhân vật thực sự nói ra | Hỏi, đáp, ngắt lời, bổ sung |
| **Hành động** | Hành động làm thay đổi vị trí/đồ vật/trạng thái cơ thể | Cầm lên, đặt xuống, đứng dậy, đi tới cửa |
| **Phản ứng** | Phản hồi phát sinh do sự kiện trước, nhưng không nhất thiết phải nói | Dừng cốc, lùi né, nhìn cổ tay, im lặng |
| **Thông tin** | Khán giả/nhân vật nhận được sự thật mới | Nhìn thấy vật gì đó, nhận ra sản phẩm, phát hiện vết thương |
| **Chuyển tiếp/khoảng trống** | Chuyển tiếp không gian, thời gian hoặc cảm xúc mà nguyên văn của người dùng yêu cầu rõ | Shot trống, âm thanh môi trường, khoảng dừng, nối bối cảnh |

**Mọi nhịp nguyên tử đều phải đăng ký.** Các hành động bình thường không thuộc "cao trào/bước ngoặt" cũng không được vì thế mà biến mất.

Nội bộ đánh số mỗi nhịp nguồn `E01 / E02 / E03 ...`, ít nhất ghi lại:
- Sự kiện trong nguyên văn do ai làm / ai nói;
- Hành động hoặc lời thoại là gì;
- Đối tượng tác động / đạo cụ là gì;
- Thứ tự gốc so với các sự kiện trước sau;
- Người dùng có nêu rõ các sự thật như thời gian, vị trí, số lượng, tay trái/phải, nguồn gốc đạo cụ hay không.

Sau đó mỗi **câu làm thay đổi trạng thái cốt truyện** trong mọi Timeline đều phải ánh xạ ngược về được một `E##`. Nội dung được phép không có `E##` chỉ giới hạn ở: quay phim, bố cục, kết quả nhìn thấy được của ánh sáng, chi tiết vật lý/foley tương ứng trực tiếp với hành động đã có, và các mô tả mang tính thực thi không làm thay đổi sự thật cốt truyện.

**Nếu một câu làm thay đổi nhân vật, đạo cụ, vị trí, số lượng, quan hệ, thông tin hay nhân quả, mà không tìm thấy nhịp nguồn tương ứng → coi là AI thêm cốt truyện, bắt buộc xóa.**

### A2.2 Năm loại nhãn then chốt: chỉ đánh dấu mức quan trọng, không đổi thứ tự

Trên các nhịp nguyên tử gắn thêm nhãn:
- **Điểm bước ngoặt**: quan hệ / quyền lực / thông tin đảo chiều
- **Đỉnh cảm xúc**: lúc cảm xúc bộc lộ mạnh nhất của đoạn/cảnh này
- **Điểm tăng thông tin**: thông tin mới làm thay đổi cách hiểu
- **Điểm quyết định**: nhân vật đưa ra lựa chọn và gánh hậu quả
- **Điểm im lặng**: khoảng trống có hiệu quả sau phần dẫn dắt

**Quy tắc cứng:**
- Các nhãn có thể chồng lên nhau, một nhịp có thể đồng thời thuộc nhiều loại.
- Nhịp không có bất kỳ nhãn then chốt nào vẫn được giữ lại.
- **Nghiêm cấm "sắp xếp cốt truyện theo đường cong cảm xúc".** Đường cong cảm xúc chỉ được đánh dấu theo thứ tự thời gian của cốt truyện gốc: thấp → áp lực → đỉnh → giải tỏa; nó là biểu đồ phân tích, không phải chỉ thị dựng lại.

### A2.3 Lập ngân sách thời gian cho từng nhịp trước

Với mỗi nhịp nguyên tử, ước tính thời lượng tự nhiên tối thiểu:

`Thời lượng tối thiểu của nhịp = thời gian lời thoại tự nhiên + khoảng dừng cần thiết + thời gian hành động/phản ứng bắt buộc phải hoàn thành tuần tự`

Lưu ý:
- "Nói + động tác nhỏ" có thể xảy ra đồng thời một cách tự nhiên thì có thể tính giờ chồng lên nhau;
- Các hành động nhân quả bắt buộc xảy ra trước sau thì phải cộng dồn;
- Lời thoại dài không được xử lý thô bạo kiểu "câu dài cố định 3–3.5s"; phải ước tính thời gian đọc tự nhiên theo độ dài văn bản thực tế, khoảng dừng, ngữ điệu;
- Khi không chắc chắn, thà chừa khoảng 10%–20% dư địa để thở, chứ đừng nhồi bằng tốc độ nói nhanh bất thường;
- Các khoảng dừng, phản ứng, quay người, di chuyển then chốt không được bị lời thoại nuốt mất hoàn toàn.

### A2.4 Nhịp → shot → đoạn tạo

Chỉ gộp các nhịp **liền kề về thời gian**, không ghép vượt qua cốt truyện ở giữa. **Gộp đoạn chỉ thay đổi cách chứa đựng, không thay đổi nội dung, người thực hiện, đối tượng, thứ tự hay số lượng của bất kỳ `E##` nào. Một nhịp nguồn có thể được thể hiện trải qua nhiều shot, nhưng không được viết lại thành một sự kiện khác.**

Một đoạn có thể chứa nhiều nhịp, nhưng "1–4 nhịp" chỉ là tham chiếu kinh nghiệm, không phải giới hạn cứng. Có tiếp tục gộp hay không, căn cứ vào các điều kiện sau:
1. Tổng thời lượng sau khi gộp ≤ giới hạn mỗi đoạn của model;
2. Mọi lời thoại đều nói hết được với tốc độ tự nhiên;
3. Hành động nhân quả then chốt có quá trình đầy đủ;
4. Ít nhất còn chừa được phản ứng và nhịp thở cần thiết;
5. Không vì nhồi quá đầy mà cứ mỗi 1–2 giây lại bị buộc cắt shot;
6. Cuối đoạn có thể hình thành trạng thái rõ ràng, có thể khai báo lại ở đoạn sau.

Xuất hiện bất kỳ tình huống nào sau đây, nên chủ động mở đoạn mới, kể cả khi về lý thuyết vẫn nhồi được:
- Lời thoại đã gần chạm giới hạn ngân sách thời gian;
- Cùng một đoạn cần quá nhiều hành động/phản ứng tranh chấp lẫn nhau;
- Cảm xúc hoặc mục tiêu chuyển giai đoạn rõ rệt;
- Bối cảnh/thời gian thay đổi;
- Tiếp tục gộp sẽ phá vỡ khả năng tạo độc lập giữa các đoạn;
- Cần tốc độ nói bất thường, hành động dịch chuyển tức thời hoặc lược bỏ phản ứng mới nhồi vừa.

### A2.5 Cách chia đợt cho cốt truyện dài

**Hoàn thành quy hoạch toàn bộ đoạn của phim trước, rồi mới giao theo đợt.**

Ví dụ một tập 180s:
- Seedance 2.0 lý thuyết tối thiểu 12 đoạn, nhưng thực tế có thể thành 13, 14, 15…… đoạn do mật độ lời thoại;
- Số đoạn toàn phim cố định trước là G01, G02, G03……;
- Sau đó giao theo mỗi đợt tối đa 6 đoạn: Batch 1 = G01–G06, Batch 2 = G07–G12, Batch 3 = các đoạn còn lại;
- Seedance 2.5 tương tự, mỗi đợt tối đa 3 đoạn.

**Ranh giới đợt chỉ ảnh hưởng đến số đoạn xuất ra trong một lần, không thay đổi thứ tự, số đoạn và tính liên tục của toàn phim.**

### A2.6 Phương án dự phòng

Nếu cốt truyện không có bước ngoặt/đỉnh rõ ràng, cũng đừng cố tạo ra năm loại điểm then chốt. Theo thứ tự nguyên văn, lấy "một đơn vị hành động/lời thoại/phản ứng có thể thực thi trọn vẹn" làm nhịp để tiếp tục quy hoạch là được.

---

## A3. Phân đoạn và ngân sách thời lượng

### A3.0 Trước tiên phân biệt "số đoạn tối thiểu lý thuyết" và "số đoạn thực tế"

**Giới hạn cứng mỗi đoạn:**
- Seedance 2.0: mỗi đoạn ≤ 15s
- Seedance 2.5: mỗi đoạn ≤ 30s

Khi người dùng đưa tổng thời lượng nghiêm ngặt, có thể tính trước số đoạn tối thiểu lý thuyết:

```text
Số đoạn tối thiểu lý thuyết = ⌈tổng thời lượng / giới hạn mỗi đoạn⌉
```

Công thức này chỉ trả lời "cần ít nhất mấy đoạn", **không có nghĩa là thực tế bắt buộc chỉ làm bấy nhiêu đoạn**.

Ví dụ: 55s / Seedance 2.0:
- Tối thiểu lý thuyết = 4 đoạn;
- Nếu lời thoại/hành động rất nhẹ, có thể làm 15 + 15 + 15 + 10;
- Nếu mật độ cốt truyện cao, cũng có thể làm 12 + 11 + 11 + 11 + 10 = 55s;
- Chỉ cần mỗi đoạn ≤ 15s, tổng khớp với tổng thời lượng của người dùng, cốt truyện đầy đủ là được.

**Nguyên tắc: cân bằng giữa "không quá dày" và "không vụn vặt", chứ không theo đuổi số đoạn ít nhất.**

### A3.1 Thứ tự xác định số đoạn thực tế

Quyết định theo thứ tự sau:
1. Hoàn thành toàn bộ nhịp và ngân sách thời lượng tối thiểu của A2 trước;
2. Gộp các nhịp liền kề từ trước ra sau;
3. Mỗi khi gần chạm giới hạn mỗi đoạn, kiểm tra xem lời thoại, hành động, phản ứng còn tự nhiên không;
4. Nếu không tự nhiên, cắt sớm và mở đoạn mới;
5. Thu được **số đoạn thực tế của toàn phim**;
6. Cuối cùng mới chia Batch theo A3.4.

Đừng quyết định trước "bắt buộc 4 đoạn", rồi ép ngược cốt truyện nhồi vào 4 đoạn.

### A3.2 Kiểm tra thời lượng lời thoại (ngưỡng cứng)

Mỗi câu thoại bắt buộc phải thực sự nói hết được trong shot/khung thời gian tương ứng.

Cách thực thi:
- Trước tiên mô phỏng thời gian đọc theo khẩu ngữ tự nhiên;
- Rồi cộng thêm các khoảng dừng, nói lắp, thở dốc, muốn nói lại thôi mà kịch bản yêu cầu rõ;
- Nếu trong lúc nói còn có động tác nhỏ có thể song song, thì có thể chồng lên;
- Nếu hành động bắt buộc phải hoàn thành trước/sau lời thoại, thì chiếm thời gian riêng;
- **Cấm dùng tốc độ nói nhanh bất thường để giải quyết thiếu thời lượng;**
- **Cấm vì thiếu thời lượng mà xóa từ, đổi từ, nuốt đuôi câu.**

Nếu "tổng thời lượng nghiêm ngặt" người dùng đưa ra xung đột với thời lượng tự nhiên tối thiểu của "toàn bộ lời thoại nguyên văn + hành động bắt buộc":
- Ưu tiên nén các shot trống, khoảng dừng không mang thông tin, chuyển động máy thừa **do AI tự thêm**; shot trống, khoảng dừng, khoảng trống mà nguyên văn của người dùng yêu cầu rõ không được nén hay xóa;
- Vẫn không đủ thì đánh dấu rõ "xung đột ràng buộc thời lượng" trong tổng quan toàn phim;
- Không tự ý xóa lời thoại hay sửa cốt truyện để giả vờ đáp ứng.

### A3.3 Cách viết timeline

- Timecode mỗi đoạn bắt đầu lại từ `00:00`, tiện cho việc đưa riêng lẻ trực tiếp vào model;
- Tổng quan toàn phim ghi riêng **khoảng thời gian toàn cục** tương ứng của đoạn đó;
- Timecode hành động trong đoạn không được mâu thuẫn nhau;
- Hành động song song có thể chồng khung thời gian, nhưng phải ghi rõ "đồng thời";
- Hành động tuần tự phải nối tiếp trước sau, không được dựa vào cùng một giây để hoàn thành nhiều hành động không thể đồng thời.

### A3.4 Cốt truyện dài và dung lượng mỗi đợt

**Giới hạn giao mỗi đợt (giới hạn dung lượng, không phải giới hạn toàn phim):**
- Seedance 2.0: mỗi đợt tối đa 6 đoạn
- Seedance 2.5: mỗi đợt tối đa 3 đoạn

Khi vượt quá:
- Số đoạn toàn phim giữ liên tục;
- Chỉ tách thành nhiều Batch;
- Không tính lại số đoạn phía trước;
- Không gọi nội dung chưa giao là "bị cắt bỏ", thống nhất gọi là "đoạn chờ giao ở đợt sau".

Cốt truyện 2–3 phút hoàn toàn được phép có 2, 3, 4 đợt hoặc nhiều hơn.

### A3.5 Mật độ shot mỗi đoạn (khuyến nghị, không phải giới hạn cứng)

- Seedance 2.0: thường 1–2 shot chính; nội dung cực nhẹ có thể 3, nhưng tránh cắt vụn
- Seedance 2.5: thường 2–4 shot chính

Nếu một đoạn để chứa hết cốt truyện mà cần HARD CUT tần suất cao liên tục, ưu tiên tách đoạn, chứ không tiếp tục nhồi shot.

### A3.6 Cấm chung và quy tắc chữ

Mặc định cấm:
- Không dissolve, không chớp trắng, không whip pan, không thay đổi tốc độ không có căn cứ cốt truyện;
- Không thêm VO, lời dẫn, lời thoại mà người dùng không cung cấp;
- Không tự động thêm BGM, âm báo cảm xúc;
- Không thêm nhân vật mới, đạo cụ mới, hành động cốt truyện mới;
- **Không tạo phụ đề hậu kỳ, tiêu đề, thẻ giải thích, chữ chồng UI, watermark hay chữ màn hình thêm khác.**

Nhưng chữ vật thể đã có trong bối cảnh / chữ trên bao bì sản phẩm thì theo A1.3:
- Có tài sản tham chiếu thì giữ ngoại hình tham chiếu, không thêm, không viết lại, không vẽ lại;
- Không viết nhầm "bao bì bắt buộc xuất hiện" thành "yêu cầu AI tạo chữ rõ ràng chính xác".

---

## A4. Quy hoạch tài sản và trạng thái xuất hiện trên hình (viết theo timeline)

A4 là **quy tắc quy hoạch nội bộ** dùng chung cho mọi model. Nếu trạng thái xuất hiện trên hình của nhân vật trong cùng một đoạn khác nhau ở các khối thời gian/shot khác nhau, bắt buộc đăng ký riêng theo timeline, không được chỉ viết một trạng thái tổng thể mơ hồ.

**Bổ sung A4 · Đề xuất thiết kế khi thiếu ngoại hình và ánh sáng**

Khi kịch bản / người dùng không cung cấp ngoại hình của một nhân vật, hoặc thiếu ánh sáng và tông môi trường của một bối cảnh, nhưng hình ảnh của tập này thực sự cần:
- Được phép suy ra "đề xuất thiết kế" theo phương pháp thiết kế hình ảnh / màu sắc và ánh sáng của Toonflow (visualDesign / colorAndLight), điền vào danh tính + neo ngoại hình hoặc ánh sáng bối cảnh của đoạn này;
- Mọi đề xuất đều đánh dấu "đề xuất thiết kế", không coi là sự thật cốt truyện; không vì thế mà thêm cốt truyện, nguồn gốc đạo cụ, quan hệ nhân vật hay quy tắc thế giới;
- Nếu không ảnh hưởng đến việc tạo đoạn này, thì giữ mức độ trừu tượng của nguyên văn, không cố bổ sung thiết kế (tuân theo A0.1.5).

**Ánh xạ đầu ra cuối cùng:**
- Seedance 2.0: vẫn xuất rõ "định danh tài sản" trước phần nội dung mỗi đoạn.
- Seedance 2.5: không xuất thêm khối "định danh tài sản" lặp lại; thông tin A4 lần lượt được ánh xạ vào `Reference binding`, `Immutable locks`, `Timeline` và `Preserve`. Chỉ khi người dùng yêu cầu rõ ràng liệt kê riêng danh sách tài sản mới xuất thêm.

Quy hoạch nội bộ có thể dùng định dạng sau:

```text
## Định danh tài sản

### Nhân vật liên quan

Nhân vật A | Tổng quan trạng thái xuất hiện trên hình
- Khối thời gian / Shot 1 | 00:00–00:XX | chỉ tay / xuất hiện thực tế / hoàn toàn ngoài khung hình…… | nói / không nói
- Khối thời gian / Shot 2 | 00:XX–00:XX | ……

Danh tính + neo ngoại hình: chỉ trích dẫn thông tin người dùng đã đưa.
Tọa độ thế giới: chỉ viết quan hệ không gian trung tính mà cốt truyện nguồn đã xác định hoặc cần thiết cho việc tạo.
Tọa độ khung hình: mô tả theo vị trí máy hiện tại, không làm thay đổi sự thật về vị trí trong thế giới.
Trạng thái đặc biệt: chỉ đăng ký các trạng thái bẩn / vết thương / độ ẩm / cầm vật v.v. đã có trong cốt truyện nguồn.
Diễn xuất trọng tâm của đoạn này: viết các hành động cốt truyện đã có sao cho nhìn thấy được, không thêm hành động.
Lời thoại thu đồng bộ giữ nghiêm ngặt nguyên văn:
"……"

Nhân vật B | Tổng quan trạng thái xuất hiện trên hình
- Khối thời gian / Shot 1 | 00:00–00:XX | hoàn toàn ngoài khung hình | chỉ có lời thoại đồng bộ
- Khối thời gian / Shot 2 | 00:XX–00:XX | xuất hiện thực tế | không nói
……

### Bối cảnh liên quan
Bối cảnh A | thời gian
(neo bối cảnh + vị trí/hướng/độ cao máy quay + tiền cảnh, trung cảnh, hậu cảnh + quan hệ không gian)

### Đạo cụ then chốt
Đạo cụ A
(trạng thái đầu đoạn do cốt truyện nguồn đưa ra + hành động theo timeline đã có trong cốt truyện nguồn + trạng thái cuối đoạn + cách xử lý chữ/bao bì; không truy ngược nguồn gốc chưa được nói rõ)
```

### A4.1 Bảng từ trạng thái xuất hiện trên hình của nhân vật

Chọn dùng theo phạm vi nhìn thấy thực tế của mỗi shot:
- Xuất hiện thực tế và nói
- Xuất hiện thực tế nhưng không nói
- Chỉ xuất hiện một phần khuôn mặt
- Chỉ xuất hiện tay
- Chỉ xuất hiện phía sau vai
- Chỉ xuất hiện bóng lưng
- Chỉ xuất hiện chân
- Hoàn toàn ngoài khung hình | chỉ có lời thoại đồng bộ
- Hoàn toàn ngoài khung hình | không có âm thanh

**Cùng một nhân vật có từ hai trạng thái trở lên trong một đoạn → bắt buộc liệt kê timeline.**

### A4.2 Mục nhân vật bắt buộc có 6 loại thông tin
1. Danh tính + neo ngoại hình
2. Timeline trạng thái xuất hiện theo từng shot
3. Tọa độ thế giới + tọa độ khung hình
4. Trạng thái đặc biệt (những gì sẽ thay đổi trong đoạn này: bẩn / vết thương / độ ẩm / cảm xúc biểu lộ ra ngoài v.v.)
5. Diễn xuất trọng tâm của đoạn này + 3–5 yêu cầu diễn xuất nhìn thấy được
6. Nguyên văn lời thoại đồng bộ (nếu có)

### A4.3 Mục bối cảnh bắt buộc có 4 loại thông tin
1. Neo bối cảnh
2. Vị trí + hướng + độ cao máy quay
3. Tiền cảnh / trung cảnh / hậu cảnh
4. Quan hệ không gian và trục giữa nhân vật/mốc định vị

### A4.4 Mục đạo cụ bắt buộc có 4 loại thông tin
1. Vị trí tuyệt đối / người sử dụng / trạng thái đầu đoạn
2. Hành động theo timeline của đoạn này (ai, khi nào, cử động thế nào)
3. Trạng thái cuối đoạn
4. Mục cấm; nếu có chữ trên bao bì, ghi chú theo A1.3 "giữ tài sản tham chiếu, không thêm/viết lại/vẽ lại chữ"

### A4.5 Cấm
- Không sao chép cả bộ hồ sơ nhân vật, chỉ giữ neo cần cho đoạn này
- Không viết tài sản không xuất hiện
- Không viết định danh tài sản thành lặp lại toàn bộ cốt truyện
- Không dùng cách viết tổng quát mâu thuẫn kiểu "đoạn này xuất hiện thực tế và nói (nhưng shot 1 lại ngoài khung hình)"
- Không yêu cầu AI tự tạo từ hư không chữ bao bì chính xác để thay thế tài sản tham chiếu

---

## A5. Vị trí đứng: tọa độ thế giới + tọa độ khung hình (hai tầng · tự chứa)

**Tiền đề cốt lõi: khi tạo mỗi đoạn, model không nhìn thấy bất kỳ hình ảnh nào của đoạn trước, cũng không dựa vào tham chiếu khung cuối của đoạn trước.**

### A5.1 5 khối thông tin mỗi đoạn bắt buộc tự chứa

1. **Tọa độ thế giới · trục và mốc định vị**: vị trí thật của nhân vật so với cửa, bàn, cửa sổ, hành lang v.v.; không liên quan đến vị trí máy.
2. **Tọa độ khung hình · trái/phải/trước/sau/che khuất trong shot hiện tại**: khai báo lại theo vị trí máy hiện tại.
3. **Hướng nguồn sáng · tầng thế giới + tầng khung hình**: chỉ kế thừa trong cùng một điều kiện chiếu sáng liên tục.
4. **Vị trí tuyệt đối và trạng thái đạo cụ**: gồm đường di chuyển trong đoạn này.
5. **Trạng thái kết thúc của đoạn này**: đoạn sau bắt buộc viết lại nó thành "trạng thái ban đầu tuyệt đối", chứ không viết "tiếp nối đoạn trước".

### A5.2 Chuỗi trạng thái của cảnh liên tục

Trong cùng một địa điểm, cùng một khoảng thời gian liên tục:

`Trạng thái kết thúc đoạn trước → đoạn sau viết lại thành trạng thái ban đầu tuyệt đối → hành động đoạn này → trạng thái kết thúc đoạn này`

Nội dung kế thừa gồm:
- Vị trí thế giới thực tế và hướng cơ thể của nhân vật
- Vị trí, người cầm, số lượng, mực chất lỏng, vết bẩn/hao mòn của đạo cụ
- Các trạng thái kéo dài như vết thương, trang phục, độ ẩm, vết máu, khói bụi
- Hướng ánh sáng chính, nhiệt độ màu và điều kiện môi trường

### A5.3 Di chuyển của nhân vật chỉ tuân theo cốt truyện nguồn, không thêm hành động vì tính liên tục

Điều bị cấm là AI tự tạo thay đổi vị trí không có căn cứ, cũng cấm vì "giải thích thay đổi vị trí" mà ngược lại bổ sung cốt truyện.

- Nguyên văn viết rõ "đứng dậy đi tới cửa" → bắt buộc giữ quá trình đứng dậy, đi, đến nơi, không được dịch chuyển tức thời.
- Nhịp tiếp theo trong nguyên văn viết thẳng "nhân vật đã đứng ở cửa", nhưng không viết đã qua đó thế nào → lấy "đứng ở cửa" làm trạng thái ban đầu đã định của nhịp đó, được phép vào bằng HARD CUT / đoạn mới; **không được tự thêm "đứng dậy, đi qua".**
- Nguyên văn viết rõ hai người đổi chỗ → thực thi theo quá trình trong nguyên văn; nguyên văn không viết đổi chỗ → không được vì bố cục mà để hai người hoán đổi vị trí thế giới.
- Trái phải trong khung hình có thể thay đổi do đổi vị trí máy hợp lệ, nhưng vị trí thế giới không được thay đổi khi không có nguồn.

### A5.4 Quy tắc trục

- Cùng một đoạn đối thoại liên tục mặc định duy trì trục 180° đã có;
- Nếu người dùng yêu cầu rõ shot ngược/vượt trục, hoặc cốt truyện cần đổi trục, nên dùng vị trí máy trung tính, di chuyển qua trục hoặc shot thiết lập để thay đổi không gian dễ hiểu;
- Cấm nhảy trục không báo trước;
- **"Không vượt trục" không có nghĩa là máy quay vĩnh viễn không được đổi vị trí.**

### A5.5 Neo lại khi đổi cảnh / nhảy thời gian

Khi bối cảnh, thời gian, thời tiết hoặc nguồn sáng chính thay đổi rõ rệt:
- Bối cảnh mới thiết lập lại tọa độ thế giới, tọa độ khung hình, trục và ánh sáng;
- Không cưỡng ép kế thừa vị trí máy hay hướng ánh sáng của cảnh trước;
- Trang phục, vết thương, đạo cụ mang theo người của nhân vật có kế thừa hay không, quyết định theo tính liên tục thời gian của cốt truyện.

Như vậy có thể hỗ trợ cốt truyện nhiều bối cảnh dài 2–3 phút hoặc hơn, mà không khóa cứng quy tắc vị trí đứng của cảnh đầu tiên cho cả tập.

---

## A6. Tầng diễn xuất

### A6.1 Cảm xúc = sản phẩm phụ của hành vi
Không viết "anh ấy rất buồn", hãy viết anh ấy **đang làm gì**. Cảm xúc rò rỉ từ những sai lệch nhỏ trong hành động.

### A6.2 Mục tiêu hướng tới đối tượng
Chỉ khi cốt truyện gốc của người dùng đã có thể thấy rõ mục tiêu của nhân vật, mới sắp xếp nó thành mục tiêu có thể thực thi, và hướng tới người / vật / nhiệm vụ cụ thể. **Không được vì diễn xuất trọn vẹn mà tự suy diễn động cơ, mục đích ẩn hay ý đồ quan hệ của nhân vật.**

### A6.3 Ưu tiên trạng thái, nhưng hành động nhân quả then chốt bắt buộc giữ quá trình
Hành động nhân quả then chốt (cầm lấy / đặt xuống / rót chất lỏng / mở cửa / đổi tay / ngồi xuống / đứng dậy / di chuyển) không được dịch chuyển tức thời.

### A6.4 Vi biểu cảm bắt buộc có căn cứ cốt truyện nguồn + trigger
Chỉ khi cốt truyện nguồn đã có phản ứng/biểu lộ cảm xúc tương ứng, mới được viết vi biểu cảm, và viết thành `[vi biểu cảm nhìn thấy được của phản ứng đã có] + [điều kiện kích hoạt trong nguyên văn]`. **Không được vì shot gần mà tự thêm các phản ứng mới như nhíu mày, mím môi, đỏ mặt, nuốt khan, cười gượng.**

### A6.5 mask + crack (chỉ khi cốt truyện nguồn hỗ trợ)
- **mask**: chỉ sắp xếp trạng thái bề mặt mà người dùng đã đưa ra, không tự gán cho nhân vật "ngụy trang".
- **crack**: chỉ cụ thể hóa phản ứng đã có của người dùng thành một sơ hở nhìn thấy được, không thêm phản ứng.
- Cùng một shot đừng chồng liên tiếp nhiều crack; khi cốt truyện nguồn không có crack thì có thể hoàn toàn không dùng.

### A6.6 Thích ứng kênh diễn xuất (bắt buộc viết)

| Shot nhìn thấy | Kênh diễn xuất chính |
|---|---|
| Thấy mặt | Ánh mắt + thay đổi cực nhỏ trên mặt |
| Chỉ thấy tay | Lực nắm + nhịp động tác + chạm |
| Thấy bóng lưng | Trọng tâm + vai cổ + hơi thở |
| Thấy chân | Dáng đi + chuyển trọng lượng |
| Toàn thân viễn cảnh | Tư thế + chiếm lĩnh không gian |

**Chỉ viết kênh diễn xuất thực sự nhìn thấy được trong shot này.**

### A6.7 Thời điểm tương đối giữa phản ứng và lời thoại
Phản ứng có thể bắt đầu trước khi lời thoại của đối phương kết thúc, nhưng bắt buộc phải có từ kích hoạt/hành động kích hoạt rõ ràng; đừng quy định máy móc "mọi phản ứng đều đợi nói xong" hoặc "mọi phản ứng đều đi trước".

### A6.8 Bùng nổ kiểu kìm nén
Cảm xúc mạnh có thể làm phép trừ với **các trang trí diễn xuất do AI tự thêm**, ví dụ bớt một lần nhíu mày thêm, bớt một tiếng thở dài thừa; **không được xóa, thay thế hay lùi lại hành động/lời thoại/phản ứng trong cốt truyện gốc của người dùng.** Có thể dùng biên độ nhẹ hơn, sự kiện diễn xuất ngắn hơn để thể hiện sự kìm nén, nhưng bản thân sự kiện cốt truyện bắt buộc tồn tại nguyên dạng.

### A6.9 Số sự kiện vi biểu cảm (tham chiếu giới hạn trên, không phải định mức tối thiểu)
- Đoạn ≤15s: thường không quá 1–2 vi phản ứng đã có trong cốt truyện nguồn
- Đoạn 16–30s: thường không quá 2–3 vi phản ứng đã có trong cốt truyện nguồn

**0 cái hoàn toàn được phép. Không được thêm vi biểu cảm để đạt số lượng.** Nếu shot chỉ thấy tay/bóng lưng, thì đừng cố viết vi biểu cảm khuôn mặt.

---

## A7. Chuyển động máy và nối giữa các đoạn

### A7.1 Đường cong cảm xúc

```text
Thấp ──→ Trung ──→ Cao ──→ Giải tỏa
Khởi      Áp lực     Đỉnh      Tiếp đất
```

Đường cong cảm xúc được ghi theo thứ tự thời gian của cốt truyện gốc, không được dùng để sắp xếp lại cốt truyện.

### A7.2 Vị trí cảm xúc → chuyển động máy
Đỉnh có thể chia thành ba loại: nội tâm, đảo chiều thông tin, hành động bên ngoài; chuyển động máy bắt buộc tuân theo phong cách người dùng chỉ định, không được vì "đỉnh" mà tự động đẩy vào gần hay tự động đặc tả lớn.

### A7.3 Quy tắc nối giữa các đoạn (ưu tiên tạo độc lập)

**Phạm vi xét: chỉ xét "shot cuối của đoạn N" và "shot đầu của đoạn N+1".**

Thuộc tính shot chia làm ba loại:
- **Chủ thể quay**: hai người / một người / cận bộ phận / shot trống / nhóm đông
- **Cỡ cảnh**: toàn cảnh / trung cảnh / cận cảnh / đặc tả / đại đặc tả
- **Góc máy**: chính diện / nghiêng / phía sau / qua vai / nhìn từ trên xuống / nhìn từ dưới lên

Để tránh hai đoạn tạo độc lập trông như khung nối tiếp lỗi ở điểm dựng, việc nối giữa các đoạn mặc định phải thỏa mãn ít nhất một trong các điều:
1. Loại chủ thể quay khác nhau;
2. Cỡ cảnh chênh ≥ 2 bậc;
3. Góc quay chênh ≥ 90°.

Khi cả ba đều không thỏa mãn, chỉ được điều chỉnh **chủ thể quay/cỡ cảnh/góc/bố cục** của shot đầu đoạn sau, không được thay đổi sự kiện cốt truyện nguồn, sự thật về vị trí nhân vật, hành động, đạo cụ hay lời thoại tương ứng với shot đầu đó.

**Khuyến nghị:**
- Trung cảnh hai người → đặc tả một người/cận bộ phận
- Trung cảnh hai người → shot trống
- Trung cảnh một người → trung cảnh hai người
- Đặc tả cận bộ phận → trung cảnh hai người
- Shot trống → trung cảnh hai người
- Trung cảnh nghiêng một người → đặc tả chính diện một người

**Rủi ro cao:**
- Cùng chủ thể + cùng cỡ cảnh + góc gần giống nhau nối thẳng qua đoạn
- Cùng một động tác tay nối cứng giữa hai đoạn tạo độc lập

Lưu ý: không tồn tại bộ quy tắc thứ hai kiểu "cận bộ phận → cận bộ phận đều cấm" mâu thuẫn với ba điều kiện trên. Nếu chủ thể/cỡ cảnh/góc đã đủ khác biệt thì dùng được; nhưng vẫn phải đảm bảo tính liên tục dễ đọc.

### A7.4 Dựng liên tục theo hành động

Match-on-action của cùng một hành động chưa hoàn thành **ưu tiên chỉ đặt trong cùng một đoạn tạo**:
- Hành động ở khung cuối shot A đang diễn ra;
- HARD CUT;
- Khung đầu shot B tiếp tục hoàn thành.

Khi vượt qua đoạn tạo, ưu tiên để đoạn trước hoàn thành hành động, đoạn sau bắt đầu lại từ "trạng thái ổn định sau khi hành động hoàn thành", để giảm sự không liên tục giữa các lần chạy model.

### A7.5 Bảng định tuyến phong cách

| Phong cách | Chuyển động máy | Diễn xuất | Ánh sáng | Âm thanh |
|---|---|---|---|---|
| **Kiểu kìm nén** | Chủ yếu cố định / đỉnh cũng có thể không động | Cảm xúc rò rỉ từ sai lệch hành động | Ánh sáng tự nhiên / tương phản thấp | Âm thanh môi trường chủ đạo |
| **Kiểu hồi hộp** | Chủ yếu vị trí máy ổn định / khi cần thì đột ngột shot ngược | Lõi là chênh lệch thông tin / phản ứng có thể chậm nửa nhịp | Bóng đổ cứng / ngược sáng chéo | Im lặng có thể hiệu quả hơn nhạc |
| **Kiểu hài** | Vị trí máy cố định / toàn cảnh đứng hình thường hiệu quả | Nhân vật diễn nghiêm túc, tương phản tạo tiếng cười | Ánh sáng bình thường đều | Âm thanh môi trường chủ đạo |

Khi người dùng đã có phong cách rõ ràng, phong cách của người dùng có mức ưu tiên cao nhất.

---

## A8. Kiểm tra tính liên tục giữa các đoạn (xác định liên hệ trước, rồi mới kiểm tra)

A7.3 là **nguồn quy tắc duy nhất cho việc chuyển loại shot giữa các đoạn**; A8 chỉ chịu trách nhiệm về tính liên tục của nhân vật, đạo cụ, môi trường và trạng thái kéo dài. **Không được cưỡng ép xâu mọi đoạn tạo liền kề thành cùng một không gian liên tục. Trước tiên xác định hai đoạn có thực sự có quan hệ liên tục không, rồi mới quyết định kế thừa gì.**

### A8.1 Trước tiên xác định quan hệ liên tục của các đoạn liền kề

Với mỗi `trạng thái cuối đoạn N → trạng thái đầu đoạn N+1`, nội bộ chỉ đánh dấu một trong ba loại sau:

1. **Liên hệ liên tục**: cùng địa điểm, cùng khoảng thời gian liên tục, hoặc cốt truyện nguồn nói rõ là "tiếp tục / ngay sau đó / nối tiếp / cùng một lượt đối thoại / cùng một chuỗi hành động", trạng thái đầu đoạn sau phụ thuộc trạng thái cuối đoạn trước.
2. **Liên hệ trạng thái cục bộ**: bối cảnh hoặc thời gian đã thay đổi, nhưng cốt truyện nguồn yêu cầu rõ một số trạng thái kéo dài tiếp tục tồn tại, ví dụ cùng một đạo cụ mang theo người, trang phục rách, vết thương, độ ẩm, vết bẩn, lượng sản phẩm còn lại v.v. Lúc này chỉ kế thừa các trạng thái kéo dài này, **không cưỡng ép kế thừa vị trí nhân vật, vị trí máy hay trái phải khung hình của cảnh trước**.
3. **Không có liên hệ liên tục / neo lại**: bối cảnh, thời gian hoặc đơn vị tự sự đã chuyển, và đoạn sau không phụ thuộc vào vị trí nhân vật hay trạng thái cuối đạo cụ của đoạn trước. Lúc này chỉ kiểm tra trạng thái khởi đầu, hành động và trạng thái cuối của chính đoạn này có hợp lý không; vị trí nhân vật, vị trí máy, ánh sáng thiết lập lại theo đoạn này.

Căn cứ xác định chỉ đến từ chỉ thị rõ ràng mới nhất của người dùng, kịch bản nguồn và trạng thái đã xác nhận. **Không được vì "cho nó nối được" mà tự tạo liên hệ.** Nếu cốt truyện nguồn đưa thẳng trạng thái đã định mới của đoạn sau mà không có quá trình chuyển tiếp, theo A0.1.4 coi trạng thái đó là trạng thái đầu mới, có thể vào bằng HARD CUT / khối thời gian mới, không bổ sung tiền sử di chuyển hay bàn giao.

### A8.2 Kiểm tra quan hệ vị trí nhân vật (bắt buộc với đoạn có liên hệ liên tục)

Với mỗi nhân vật thực sự có liên hệ liên tục, nội bộ duy trì một chuỗi trạng thái ngắn gọn:

`vị trí/tư thế tuyệt đối đầu đoạn → hành động trong cốt truyện nguồn → vị trí/tư thế tuyệt đối cuối đoạn → vị trí/tư thế ban đầu tuyệt đối của đoạn sau`

Ít nhất đối chiếu:
1. **Vị trí thế giới**: vị trí so với các mốc như cửa, bàn, cửa sổ, hành lang, xe cộ, đồ nội thất cố định có nhất quán không;
2. **Quan hệ tương đối giữa các nhân vật**: ai ở phía nào của ai, khoảng cách trước sau, có cách nhau bởi bàn/cửa/quầy v.v. hay không, các quan hệ này có bị thay đổi vô cớ không;
3. **Trạng thái cơ thể**: đứng / ngồi / ngồi xổm / nằm, hướng cơ thể, đối tượng đang hướng mặt về có liên tục không;
4. **Tay đang bận**: nếu nhân vật đang cầm đạo cụ then chốt, tay nào/hai tay có còn bị hành động đó chiếm không; nguyên văn không khóa tay trái/phải và shot không cần thì đừng cưỡng ép chỉ định, nhưng một khi đã xác định rõ để thực thi, thì không được đổi tay mà không có quá trình trong các shot liên quan;
5. **Trong khung và ngoài khung**: cắt khung hay đổi vị trí máy có thể khiến nhân vật từ trong khung thành ngoài khung, nhưng điều này không có nghĩa là nhân vật biến mất hay đổi chỗ trong không gian thế giới;
6. **Căn cứ di chuyển**: khi vị trí thay đổi, bắt buộc phải tương ứng với các sự kiện di chuyển/đứng dậy/ngồi xuống/quay người đã có trong `E##` của cốt truyện nguồn, hoặc trạng thái đầu mới do cốt truyện nguồn đưa trực tiếp; không có căn cứ thì không được dựa vào việc cắt shot để nhân vật dịch chuyển tức thời.

**Trái/phải khung hình có thể thay đổi do đổi vị trí máy hợp lệ, vị trí thế giới không được vì thế mà thay đổi.** Khi shot ngược trước tiên kiểm tra tọa độ thế giới, rồi tính lại tọa độ khung hình; cấm vì muốn giữ "luôn ở bên trái/phải khung hình" mà lén dời nhân vật.

### A8.3 Kiểm tra chuỗi trạng thái đạo cụ (bắt buộc trong đoạn + qua đoạn liên tục)

Với đạo cụ then chốt của cốt truyện, sản phẩm và vật nhỏ tham gia hành động, nội bộ duy trì:

`người cầm / tay dùng (nếu đã xác định rõ) / vị trí tuyệt đối / nhìn thấy hay bị che / số lượng / trạng thái đóng mở / vật chứa bên trong hoặc mực chất lỏng / vết bẩn độ ẩm hao mòn / hành động đoạn này / trạng thái cuối đoạn`

Quy tắc cứng:
- Một người trong các shot liên tục vốn đang cầm một cây bút, và không có sự kiện "đặt xuống / đưa ra / cất đi / rơi / rời khỏi khung hình" v.v. trong cốt truyện nguồn, thì khoảnh khắc tiếp theo **không được tự nhiên biến mất**;
- Nếu shot sau cắt mất tay hay đạo cụ, bị cơ thể/đồ nội thất che, được phép "tạm thời không nhìn thấy", nhưng trạng thái thế giới của nó vẫn giữ nguyên, **không được hiểu "không quay tới" thành "đạo cụ biến mất"**;
- Nếu cùng bàn tay cầm vật ở shot sau vẫn nhìn thấy rõ, mà không có sự kiện thay đổi trạng thái, thì đạo cụ đó phải tiếp tục ở trong tay;
- Đạo cụ đã đặt xuống không được quay lại tay mà không có quá trình, đạo cụ đã giao cho B thì shot sau không được đồng thời xuất hiện trong tay A;
- Số lượng, kích cỡ, hình dạng, màu sắc, cách đóng mở, mực chất lỏng, hao mòn và vết bẩn không được nhân bản, khôi phục hay thay đổi vô cớ;
- Đạo cụ đi vào hay rời khỏi mép khung hình không có nghĩa là trạng thái đạo cụ thay đổi, trừ khi cốt truyện nguồn thực sự có di chuyển.

### A8.4 Tính liên tục của bối cảnh và môi trường vật lý

Chỉ kiểm tra khi có "liên hệ liên tục" hoặc "liên hệ trạng thái cục bộ":
- Cửa ra vào/cửa sổ đóng mở, sự di chuyển đã xảy ra của ghế/bộ đồ ăn/đồ nội thất;
- Các trạng thái kéo dài như vệt nước trên sàn, vết bẩn, hư hỏng, khói, lượng thức ăn còn lại;
- Hướng ánh sáng chính, thời gian, thời tiết và việc bật tắt nguồn sáng thực tế;
- Trong gương, kính, bề mặt phản chiếu không được xuất hiện bản sao thừa mâu thuẫn với trạng thái nhân vật/đạo cụ hiện tại;
- Nhân vật và môi trường cố định không được xuyên vật thể, xuyên tường hay vượt qua chướng ngại kín mà không có căn cứ.

### A8.5 Ranh giới chỉnh sửa giữa các đoạn

Khi phát hiện vấn đề tính liên tục, chỉ được phép:
- Sửa xung đột văn bản về tọa độ thế giới/tọa độ khung hình;
- Sửa mô tả xuất hiện/che khuất;
- Sửa việc cầm giữ, khả năng nhìn thấy và khóa trạng thái của đạo cụ then chốt;
- Điều chỉnh cách chứa shot, cỡ cảnh hoặc điểm cắt, để hành động đã có dễ được thể hiện trọn vẹn hơn;
- Khi cần thiết, phân cảnh/phân đoạn lại tại **ranh giới `E##` đã có**.

**Cấm vì sửa tính liên tục mà thêm các hành động nối cầu người dùng không viết như "đặt bút xuống / lại cầm lên / đi sang phía bên kia / lấy lại một cái".** Nếu xung đột đến từ chính cốt truyện nguồn, theo A0.1.6 đánh dấu "xung đột văn bản nguồn", không tự ý sửa thành một câu chuyện khác.

**Đừng viết "như trên", "tiếp nối vị trí đứng đoạn trước". Đoạn sau cần kế thừa thì bắt buộc viết lại kết quả kế thừa thành trạng thái ban đầu tuyệt đối; đoạn không có quan hệ liên tục thì chỉ kiểm tra chính đoạn đó.**

---

## A9. Mẫu prompt phân đoạn (định tuyến theo model)

A9 chỉ định nghĩa **lớp vỏ giao nộp cuối cùng**, không thay đổi bất kỳ logic thực thi nào của A2–A8.

- Seedance 2.0 → dùng A9.1
- Seedance 2.5 → dùng A9.2

Nếu cách diễn đạt của A9 xung đột với quy tắc thực thi của A2–A8, A11–A12, lấy quy tắc thực thi làm chuẩn.

### A9.1 Mẫu prompt phân đoạn Seedance 2.0 (định danh tài sản + prompt chính thức)

```text
═══════════════════════════════════════════
G0N | Batch X / Đoạn N | Model mục tiêu: Seedance 2.0 | Thời lượng đoạn: Xs | Thời gian toàn cục: MM:SS–MM:SS
═══════════════════════════════════════════

## Định danh tài sản

### Nhân vật liên quan
Tên nhân vật | Tổng quan trạng thái xuất hiện trên hình
- Shot N-1 | 00:00–00:XX | chỉ tay / xuất hiện thực tế / hoàn toàn ngoài khung hình…… | nói / không nói
- Shot N-2 | 00:XX–00:XX | ……
(danh tính + neo ngoại hình + tọa độ thế giới + tọa độ khung hình + trạng thái đặc biệt + diễn xuất trọng tâm của đoạn này + yêu cầu diễn xuất + nguyên văn lời thoại đồng bộ)

### Bối cảnh liên quan
Tên bối cảnh | thời gian
(neo bối cảnh + vị trí, hướng, độ cao máy quay + tiền, trung, hậu cảnh + quan hệ không gian)

### Đạo cụ then chốt
Tên đạo cụ
(vị trí tuyệt đối đầu đoạn + hành động theo timeline + trạng thái cuối đoạn + mục cấm; chữ trên bao bì theo A1.3)

─────────────────────────────────────────
[Prompt chính thức]

Tạo một phim ngắn điện ảnh người thật có tổng thời lượng nghiêm ngặt là Xs.
(phong cách hình ảnh / mô tả tổng quát máy quay / mô tả tổng quát nguồn sáng)

## Quan hệ không gian nhân vật
(tọa độ thế giới + tọa độ khung hình · hai tầng; cấm chỉ viết "tiếp nối đoạn trước")

## Shot N-1 | 00:00–00:XX | XXs | chủ thể + cỡ cảnh + góc
Máy quay và bố cục: ……
Khóa khung đầu: ……
Timeline hành động: ……
Diễn xuất: ……
Vật lý: ……

## 00:XX | HARD CUT

## Shot N-2 | 00:XX–00:XX | XXs | chủ thể + cỡ cảnh + góc
……

## Ánh sáng
(hướng thế giới của nguồn sáng chính + hướng khung hình + logic phơi sáng + tính liên tục với đoạn trước/shot trước)

## Âm thanh
(âm thanh môi trường thật + nguyên văn lời thoại đồng bộ; có BGM hay không tuân theo yêu cầu của người dùng)

## Khóa thuận
(vị trí tuyệt đối của nhân vật / việc cầm đạo cụ / ánh nhìn / trạng thái liên tục / nhân vật không nên xuất hiện trong shot này)

## Khóa chữ
Không phụ đề, không chữ màn hình thêm, không chồng chữ hậu kỳ; chữ trên bao bì/biển hiệu vật thể chỉ giữ theo tài sản tham chiếu, không thêm, không viết lại, không vẽ lại.
```

### A9.2 Mẫu prompt phân đoạn Seedance 2.5 (kiến trúc Objective)

Giao nộp cuối cùng của Seedance 2.5 dùng cấu trúc gọn hơn, có thể đưa trực tiếp vào model. **Đừng lặp lại cả bộ định danh tài sản A4 trước mỗi đoạn nữa.** Thông tin A4 bắt buộc đã được nén vào `Reference binding`, `Immutable locks`, `Timeline`, `Preserve`.

#### A9.2.0 Cổng cứng định dạng cuối cùng (bắt buộc)

Khi model mục tiêu là **Seedance 2.5**, giao nộp cuối cùng chỉ được dùng cấu trúc trường của mục A9.2 này. Ngoài thông tin đầu đoạn, các trường cấp cao nhất được phép chỉ gồm:
- `Objective`
- `Reference binding` (chỉ xuất hiện khi có tài sản tham chiếu thật; không có tham chiếu thật thì bỏ cả mục)
- `Immutable locks`
- `Target duration`
- `Timeline`
- `Visual direction`
- `Audio direction`
- `Preserve`
- `Avoid`

**Cấm dùng trực tiếp bất kỳ bản nháp quy hoạch trung gian, mẫu của model khác hay lớp vỏ không phải A9.2 làm giao nộp cuối cùng cho 2.5.** Ngoài thông tin đầu đoạn và các trường trong danh sách trắng ở trên, phần nội dung cuối cùng của 2.5 không được xuất hiện bất kỳ trường cấp cao nhất nào khác, chương phân cảnh kiểu đánh số hay khối phân tích thêm.

`Timeline` cuối cùng của 2.5 bắt buộc theo A9.2.1 dùng khối thời gian `[0:00-0:XX]` + ngôn ngữ tự nhiên liên tục. Thay đổi shot nếu thực sự cần, chỉ được lồng trong ngôn ngữ tự nhiên của khối thời gian tương ứng, không được lập riêng hệ thống đánh số shot làm cấu trúc chính.

Nếu bản nháp nội bộ hoặc đầu vào thượng nguồn dùng cấu trúc khác, bắt buộc chỉ coi nó là **tư liệu nguồn** chứ không phải mẫu cuối cùng: trước tiên phân tích theo A0–A8/A11, rồi trước khi giao sắp xếp lại vào các trường danh sách trắng của A9.2. Chỉ cần phần nội dung cuối cùng xuất hiện cấu trúc cấp cao nhất ngoài danh sách trắng, lập tức bị coi là lỗi định dạng, **không được giao, bắt buộc viết lại ngay trong lượt này thành A9.2**.

```text
═══════════════════════════════════════════
G0N | Batch X / Đoạn N | Model mục tiêu: Seedance 2.5 | Thời lượng đoạn: Xs | Thời gian toàn cục: MM:SS–MM:SS
═══════════════════════════════════════════

Objective:
Dùng 1–2 câu nói rõ: vị trí của đoạn này trong cả tập, thời lượng/tỉ lệ khung/chất cảm tổng thể, và mục tiêu kịch tính cốt lõi mà đoạn này cần hoàn thành. Đừng thuật lại toàn bộ Timeline.

Reference binding:
- Tự động đọc và phân tích cốt truyện, shot, hành động và nội dung hình ảnh của đoạn này, từ đó trích xuất các tài sản tham chiếu mà đoạn này thực sự liên quan và cần gọi đến, gồm ảnh nhân vật, ảnh bối cảnh, ảnh sản phẩm, ảnh đạo cụ, ảnh vị trí đứng v.v.
- Định danh đơn giản cho các tài sản đã trích xuất, chỉ cần nói rõ đối tượng hoặc công dụng tương ứng của tài sản, ví dụ: "tham chiếu nhân vật nam chính" "tham chiếu bối cảnh quán trọ" "tham chiếu bao bì sản phẩm" "tham chiếu đạo cụ dây đỏ".
- Mọi ảnh tham chiếu thật hoặc handle tài sản mà người dùng đã cung cấp và đoạn này thực sự cần dùng, bắt buộc liệt kê từng cái, và giữ nguyên dạng ID node, handle tài sản hoặc định danh trích dẫn khác của nó, không được viết lại, viết tắt hay đánh số lại.
- Cùng một tài sản tham chiếu dù đã dùng ở đoạn trước, chỉ cần đoạn này vẫn liên quan, thì bắt buộc trích xuất và liệt kê lại trong đoạn này; cấm các cách viết lược như "như trên", "dùng lại tham chiếu đoạn trước".
- Chỉ trích xuất tài sản đoạn này thực sự liên quan, đừng máy móc thêm vào các tài sản không xuất hiện trong cốt truyện hay hình ảnh của đoạn này.
- Không cần giải thích chi tiết mỗi ảnh tham chiếu "kiểm soát gì / không kiểm soát gì", chỉ cần định danh tài sản ngắn gọn, rõ ràng.
- Nếu đoạn này không có bất kỳ ảnh tham chiếu thật, ID node hay handle tài sản nào, có thể bỏ cả mục.
- Nghiêm cấm tự bịa {{node/image-...}}, mã tài sản, nhãn trích dẫn hay tư liệu tham chiếu không tồn tại dựa trên cốt truyện.

Immutable locks:
- Chỉ viết các điều kiện bất biến ảnh hưởng trực tiếp đến độ ổn định khi tạo: danh tính/trang phục nhân vật, vị trí thế giới then chốt và quan hệ trái phải, logic ánh sáng của cảnh liên tục, trạng thái đạo cụ then chốt, cấu trúc sản phẩm, nguyên văn lời thoại và khẩu hình, khóa ngoài khung hình cần thiết v.v.
- Không chép lại cả cốt truyện của đoạn.
- Khi cảnh liên tục vượt qua đoạn, viết lại trạng thái kết thúc của đoạn trước thành trạng thái ban đầu tuyệt đối của đoạn này, không viết "tiếp nối đoạn trước".

Target duration: X seconds

Timeline:
[0:00-0:XX] Dùng một đoạn văn tiếng Việt tự nhiên liên tục mô tả hình ảnh thực sự nhìn thấy trong khối thời gian này: bối cảnh/vị trí đứng cần thiết, trạng thái xuất hiện hiện tại, cỡ cảnh hoặc cắt shot, thứ tự hành động, phản ứng diễn xuất then chốt, lời thoại đồng bộ, thay đổi đạo cụ then chốt và chi tiết vật lý cần thiết. Viết giống như mô tả thành phẩm, không tách thành các tiêu đề con "máy quay / hành động / diễn xuất / lời thoại / vật lý".

[0:XX-0:XX] Tiếp tục dùng một đoạn ngôn ngữ tự nhiên liên tục mô tả hình ảnh tiếp theo.

[0:XX-0:XX] Tiếp tục theo nhu cầu cốt truyện; số khối thời gian không cố định.

Visual direction:
Dùng 1 đoạn văn tự nhiên gọn để khái quát chất cảm quay phim tổng thể, ánh sáng, nhiệt độ màu, độ sâu trường ảnh, quan hệ hình ảnh giữa nhân vật/sản phẩm và chất cảm vật lý cần thiết. Chỉ viết các yêu cầu hình ảnh thực sự ảnh hưởng đến đoạn này.

Audio direction:
- Foley vật lý / âm thanh môi trường: ……
- Giọng lời thoại: ……
- Chỉ khi người dùng yêu cầu rõ nhạc nền mới viết nhạc nền; người dùng không yêu cầu thì mặc định "không nhạc nền, chỉ giữ âm thanh đồng bộ thật và âm thanh môi trường".

Preserve:
Dùng một dòng hoặc một đoạn văn tự nhiên ngắn liệt kê tạo hình nhân vật, neo bối cảnh, cấu trúc sản phẩm, trạng thái đạo cụ then chốt, quan hệ không gian hoặc logic hành động bắt buộc giữ lại.

Avoid:
Dùng một dòng hoặc một đoạn văn tự nhiên ngắn liệt kê các vấn đề dễ sai nhất và liên quan trực tiếp đến đoạn này; đừng chất một chuỗi dài từ phủ định chung chung.
```

#### A9.2.1 Cách viết Timeline (bắt buộc)

`Timeline` bắt buộc tham chiếu phong cách prompt thành phẩm Seedance 2.5 người dùng hay dùng: **khối thời gian + mô tả hình ảnh bằng ngôn ngữ tự nhiên liên tục**.

Minh họa đúng:

```text
Timeline:

[0:00-0:06]
Trong bối cảnh mà cốt truyện nguồn đã xác định rõ, nhân vật A thực hiện hành động gốc của E01. Shot theo nhu cầu cắt từ shot thiết lập sang trung cảnh nhân vật A; nếu nhân vật B ở nhịp này theo nguyên văn giữ ngoài khung hình, thì viết rõ "nhân vật B giữ ngoài khung hình". Chỉ bổ sung tư thế, tiếp xúc, phản hồi vật lý nhìn thấy trực tiếp được, không thêm các sự kiện mà cốt truyện nguồn không có như cầm lấy, mở nắp, di chuyển.

[0:06-0:12]
Tiếp nối E02–E03. Nhân vật A nói lời thoại theo nguyên văn, nhân vật B có phản ứng đã có theo nguyên văn. Có thể viết phản ứng đã có thành hành động cụ thể nhìn thấy được, nhưng không được mở rộng "phản ứng" thành hành vi cốt truyện mới. Khi cần cắt sang cận cảnh hoặc đặc tả cận bộ phận, thứ tự sự kiện cốt truyện không đổi.

[0:12-0:18]
Tiếp nối E04. Nếu khung đầu của khối thời gian này cốt truyện nguồn đã quy định một đạo cụ nằm trong tay nhân vật, thì bắt đầu ngay từ trạng thái đó, không truy ngược hay viết thêm việc đạo cụ được cầm vào tay như thế nào. Shot chỉ chịu trách nhiệm thể hiện, không chịu trách nhiệm bổ sung tiền sử.
```

**Yêu cầu thực thi:**
- Mỗi khối thời gian thường là 1 đoạn văn tự nhiên, thông tin đủ dùng là được.
- Số khối thời gian do cốt truyện quyết định tự nhiên, không cố định là 3 hay 4 khối.
- Có thể viết thẳng "cắt cận cảnh nam chính / cắt đặc tả tay / về trung cảnh hai người", không cần lập thêm số shot.
- Chỉ viết vị trí đứng, trái phải, trạng thái ngoài khung hình và tính liên tục có ảnh hưởng thực tế đến khối thời gian hiện tại, không lặp lại máy móc `Immutable locks`.
- Khi nhân vật không nên xuất hiện, viết ngắn "nữ chính giữ ngoài khung hình, không tự động đưa vào shot" là đủ.
- Lời thoại lồng thẳng vào vị trí hành động tương ứng xảy ra, không lặp lại một lần nữa sau Timeline.
- Chi tiết vật lý chỉ viết những gì liên quan trực tiếp đến hành động hiện tại, như chất lỏng sóng sánh, vải chạm vào, bề mặt đạo cụ ẩm ướt, trọng lượng vật thể, phản hồi va chạm.
- Mỗi khối thời gian ưu tiên giữ một chuỗi hành động rõ ràng, không vì theo đuổi đầy đủ thông tin mà nhồi kín từng giây.
- **Trọng tâm mô tả là "khoảnh khắc này thành phẩm thực sự nhìn thấy gì", không phải giải thích lại quy tắc.**
- Mỗi hành động trong Timeline làm thay đổi nhân vật/đạo cụ/vị trí/số lượng/quan hệ/thông tin, đều bắt buộc đến từ nhịp nguồn `E##` của A2.
- Không vì "trôi chảy hơn" "đầy đủ hơn" "có nhân quả hơn" mà bổ sung các hành vi cốt truyện nguồn không có như cầm lấy, đóng mở, rút ra, trao tay, đứng dậy, di chuyển, quay đầu, số lần sử dụng, tiêu hao đạo cụ.
- Nếu cốt truyện nguồn bắt đầu thẳng từ một trạng thái đã định, thì viết thẳng trạng thái đó; đừng truy hỏi hay quay bù việc trước đó nó đã xảy ra như thế nào.
- Khi nguyên văn dùng các cách gọi chung như "cha mẹ / phụ huynh / người lớn / ai đó", Timeline giữ nguyên cách gọi chung đó, trừ khi chỉ thị rõ ràng mới nhất của người dùng đã chỉ định nhân vật cụ thể.

#### A9.2.2 Reference binding (quy tắc cứng về tài sản tham chiếu thật của 2.5)

- Tự động đọc cốt truyện, shot, hành động và nội dung hình ảnh của đoạn này, chỉ trích xuất các tài sản tham chiếu thật như ảnh nhân vật, ảnh bối cảnh, ảnh sản phẩm, ảnh đạo cụ, ảnh vị trí đứng, ảnh động tác **mà đoạn này thực sự liên quan và cần gọi đến**.
- Chỉ trích dẫn node tham chiếu, nhãn ảnh hoặc handle tài sản mà người dùng thực sự cung cấp, và **giữ nguyên dạng node / handle đầy đủ**; cấm đổi tên, viết tắt, đánh số lại hoặc bịa ra trích dẫn không tồn tại dựa trên cốt truyện.
- Mỗi tham chiếu thật liệt kê riêng một dòng, theo cách viết "**node / handle thật: định danh tài sản ngắn gọn**"; định danh chỉ nói rõ đối tượng hoặc công dụng tương ứng, ví dụ "tham chiếu nhân vật nam chính" "tham chiếu bối cảnh quán trọ" "tham chiếu bao bì sản phẩm" "tham chiếu đạo cụ dây đỏ".
- Không yêu cầu triển khai giải thích dài "kiểm soát gì / không kiểm soát gì" cho từng ảnh; nhưng nội bộ vẫn phải tuân theo công dụng rõ ràng của người dùng, không được để ảnh nhân vật vượt quyền thay đổi vị trí đứng, để ảnh vị trí đứng đè lên danh tính nhân vật, để ảnh bối cảnh đưa thêm nhân vật hay đạo cụ vào.
- Khi người dùng nói rõ "chỉ tham chiếu vị trí / chỉ tham chiếu trang phục / chỉ tham chiếu sản phẩm" v.v., định danh ngắn gọn bắt buộc giữ giới hạn công dụng, ví dụ "chỉ tham chiếu vị trí đứng" "chỉ tham chiếu trang phục".
- **Mỗi đoạn tự chứa**: tham chiếu đã dùng ở đoạn trước, nếu đoạn này vẫn cần thì bắt buộc liệt kê lại; cấm viết "như trên", "dùng lại tham chiếu đoạn trước".
- Chỉ liệt kê tài sản đoạn này thực sự cần, không máy móc nhét cả thư viện tham chiếu của toàn tập vào mỗi đoạn.
- Khi không có tham chiếu thật, bỏ toàn bộ `Reference binding`; cấm làm giả `{{Ref}}`, `{{node/image-...}}`, mã tài sản hay tên tài sản không tồn tại.

#### A9.2.3 Immutable locks

Chỉ giữ thông tin **không được trôi**, ví dụ:
- Nam chính áo trắng, nữ chính áo đỏ;
- Nữ chính ở phía nam bàn/bên trái khung hình, nam chính ở phía bắc bàn/bên phải khung hình;
- Cấu trúc nắp lật màu xanh của sản phẩm;
- Một nhân vật giữ ngoài khung hình trong một khối thời gian nào đó;
- Lời thoại nguyên văn không đổi từ, không nuốt chữ;
- Hướng ánh đèn và trạng thái đạo cụ của cảnh liên tục không bị đặt lại.

Đừng viết mọi hành động thành lock; hành động sẽ thay đổi trong Timeline thì nên để trong Timeline.

#### A9.2.4 Audio direction

- Người dùng yêu cầu rõ BGM / nhạc nền → viết theo yêu cầu người dùng.
- Người dùng không yêu cầu → mặc định không BGM, không âm báo cảm xúc, chỉ giữ âm thanh môi trường thật, foley vật lý và lời thoại đồng bộ.
- Không vì trong ví dụ từng xuất hiện nhạc nền mà biến nhạc nền thành hành vi mặc định của 2.5.

#### A9.2.5 Preserve / Avoid

`Preserve` và `Avoid` bắt buộc phục vụ việc thực thi đoạn hiện tại:
- `Preserve` viết tạo hình, không gian, sản phẩm, đạo cụ, logic hành động thực sự không được trôi;
- `Avoid` viết các lỗi tạo dễ xảy ra nhất ở đoạn hiện tại;
- Cả hai đều giữ ngắn, không viết hàng chục nhãn chung chung.

---

## A10. Cấu trúc đầu ra toàn phim

Cốt truyện dài bắt buộc đồng thời phân biệt "quy hoạch toàn phim" và "giao nộp đợt hiện tại". Tổng quan toàn phim tiếp tục dùng tiếng Việt; phần nội dung của mỗi đoạn tạo thì định tuyến theo model mục tiêu tới A9.1 hoặc A9.2.

```text
═══════════════════════════════════════════
Tổng quan toàn phim
═══════════════════════════════════════════
· Model mục tiêu: Seedance 2.X
· Tổng thời lượng mục tiêu của người dùng: (nghiêm ngặt / tham chiếu / chưa chỉ định)
· Giới hạn cứng mỗi đoạn: 15s / 30s
· Số đoạn tối thiểu lý thuyết: ⌈tổng thời lượng / giới hạn mỗi đoạn⌉ (chỉ là cận dưới)
· Số đoạn thực tế toàn phim: X đoạn (xác định theo mật độ nội dung)
· Bảng đoạn toàn phim: G01 … GXX (gồm thời lượng mỗi đoạn + khoảng thời gian toàn cục + nhịp cốt lõi)
· Phương án đợt: Batch 1 = G01–G0X; Batch 2 = ……
· Đợt xuất hiện tại: Batch X
· Đoạn chờ giao ở đợt sau: GXX–GXX (nếu không có thì ghi "không có")
· Bảng tổng tài sản
· Bảng tổng ảnh tham chiếu (chỉ khi 2.5 và người dùng thực sự cung cấp ảnh tham chiếu): liệt kê nguyên dạng từng node ảnh / handle tài sản + công dụng; dùng cho quy hoạch toàn phim, không thay thế Reference binding riêng của từng đoạn
· Bảng thay đổi bối cảnh/thời gian
· Trục thế giới của từng cảnh liên tục
· Đường cong cảm xúc theo thứ tự thời gian gốc
· Nhãn nhịp then chốt
· Phong cách
· Phổ nhịp chuyển động máy
· Xung đột ràng buộc thời lượng (nếu không có ghi "không có")
· Trạng thái trung thành cốt truyện nguồn: phải là "đạt"; nếu chính văn bản nguồn có chỗ trống/xung đột, chỉ đánh dấu vấn đề, không tự bổ sung cốt truyện

─────────────────────────────────────────
Nếu model mục tiêu là Seedance 2.0:
[G01] dùng A9.1 "định danh tài sản + prompt chính thức"
[G02] dùng A9.1
……

Nếu model mục tiêu là Seedance 2.5:
[G01] dùng trực tiếp kiến trúc Objective của A9.2, không lặp lại thêm cả khối định danh tài sản
[G02] dùng A9.2
……
─────────────────────────────────────────
```

**Quy tắc tập dài:** dù hiện tại chỉ giao Batch 1, cũng nên quy hoạch trước các đoạn toàn cục phía sau và vị trí của đợt hiện tại trong toàn phim, tránh việc mỗi đợt cắt đoạn lại dẫn đến logic trước sau bị trôi.

**Quy tắc gọn cho 2.5:** tổng quan toàn phim chịu trách nhiệm giải thích "tại sao chia như vậy"; prompt từng đoạn chịu trách nhiệm "đoạn này cụ thể tạo như thế nào". Đừng nhồi lặp nội dung tổng quan vào mỗi `Objective` hay `Timeline` của 2.5.

---

## A11. Kiểm tra cấu trúc (giai đoạn sửa cấu trúc duy nhất trước A12)

A11 chịu trách nhiệm các vấn đề cấu trúc "có tạo được không, cốt truyện có bị chèn ép hỏng không"; A12 chỉ đánh bóng tầng chữ và tầng thể hiện.

### A11.1 Danh sách kiểm tra
- [ ] Đã lập sổ cái cốt truyện nguồn `E01 / E02 / E03...`, và lấy chỉ thị rõ ràng mới nhất của người dùng / cốt truyện gốc làm nguồn sự thật?
- [ ] Mỗi sự kiện làm thay đổi trạng thái cốt truyện trong Timeline cuối cùng đều ánh xạ được tới một `E##` nào đó, không có hành động mới không nguồn gốc?
- [ ] Không thêm, xóa, thay thế, đổi người sở hữu hay đổi thứ tự bất kỳ sự kiện cốt truyện nào của người dùng?
- [ ] Không tự ý cụ thể hóa nhân vật mơ hồ như "cha mẹ / phụ huynh / người lớn" thành bố/mẹ/người thứ hai?
- [ ] Không vì tính liên tục mà truy ngược nguồn gốc đạo cụ, bổ sung tiền sử mở nắp/rút ra/cầm lấy/di chuyển v.v.?
- [ ] Đã đăng ký toàn bộ nhịp nguyên tử theo thứ tự nguyên văn, không chỉ giữ lại năm loại điểm then chốt?
- [ ] Đường cong cảm xúc không bị dùng để sắp xếp lại cốt truyện?
- [ ] Số đoạn tối thiểu lý thuyết chỉ được dùng làm cận dưới, không ép số đoạn thực tế bằng nó?
- [ ] Mỗi đoạn ≤ giới hạn cứng mỗi đoạn của model?
- [ ] Tổng thời lượng các đoạn toàn phim khớp với tổng thời lượng nghiêm ngặt của người dùng; nếu không thể đồng thời thỏa mãn, đã đánh dấu rõ xung đột chưa?
- [ ] Mọi lời thoại đều có thể nói hết trọn vẹn với tốc độ tự nhiên trong khung thời gian của nó?
- [ ] Hành động tuần tự, phản ứng và khoảng dừng cần thiết có thời gian thực, không dựa vào dịch chuyển tức thời hay tốc độ nói nhanh bất thường?
- [ ] Cốt truyện dài có bảng đoạn toàn phim đầy đủ trước, rồi mới giao theo dung lượng Batch không?
- [ ] Trạng thái xuất hiện của nhân vật A4 có được quy hoạch theo timeline, và nhất quán với phần nội dung cuối cùng không?
- [ ] Đã xác định cho từng đoạn tạo liền kề là "liên hệ liên tục / liên hệ trạng thái cục bộ / không có liên hệ liên tục" chưa, không cưỡng ép kế thừa cho các đoạn không liên quan?
- [ ] Vị trí thế giới, quan hệ tương đối, tư thế, hướng và tay đang bận của nhân vật trong mọi đoạn có liên hệ liên tục có thể đi từ trạng thái cuối đoạn trước vào trạng thái đầu đoạn sau mà không mâu thuẫn không?
- [ ] Mọi đạo cụ then chốt đã hoàn thành kiểm tra chuỗi "người cầm / vị trí / số lượng / trạng thái / khả năng nhìn thấy" chưa, không có biến mất, nhân bản, đổi tay, khôi phục hay dịch chuyển tức thời không nguồn gốc?
- [ ] Các trạng thái đã thay đổi trong bối cảnh như cửa, đồ nội thất, vết bẩn, mực chất lỏng, hư hỏng, thời tiết và nguồn sáng có được kế thừa hợp lý trong các đoạn liên quan không?
- [ ] Đã làm kiểm tra trước độ ổn định khi tạo chưa, tránh nhồi đồng thời tương tác cơ thể/tay/đạo cụ rủi ro cao, chuyển động máy phức tạp, che khuất và xung đột đa tham chiếu vào cùng một shot?
- [ ] Nếu model mục tiêu là 2.0, có dùng A9.1 "định danh tài sản + prompt chính thức" không?
- [ ] Nếu model mục tiêu là 2.5, có dùng kiến trúc `Objective / Reference binding / Immutable locks / Target duration / Timeline / Visual direction / Audio direction / Preserve / Avoid` của A9.2 không?
- [ ] Nếu model mục tiêu là 2.5, phần nội dung cuối cùng có qua cổng cứng định dạng A9.2.0 không: ngoài đầu đoạn và các trường danh sách trắng A9.2, không có bất kỳ cấu trúc cấp cao nhất nào khác hay khối phân tích thêm?
- [ ] Nếu model mục tiêu là 2.5, `Timeline` có chỉ dùng khối thời gian + ngôn ngữ tự nhiên liên tục không, không lập riêng hệ thống đánh số shot làm cấu trúc tổ chức chính?
- [ ] Nếu người dùng cung cấp ảnh tham chiếu, mỗi đoạn liên quan của 2.5 có đều liệt kê nguyên dạng node ảnh thật / handle tài sản cần thiết trong `Reference binding` của chính nó không?
- [ ] `Reference binding` có chỉ liệt kê tài sản tham chiếu đoạn này thực sự cần, và theo dạng "node / handle thật + định danh tài sản ngắn gọn" không; giới hạn công dụng rõ ràng của người dùng như "chỉ vị trí đứng / chỉ trang phục / chỉ sản phẩm" có được giữ không?
- [ ] Có tránh dùng "như trên / dùng lại ảnh tham chiếu đoạn trước" thay cho việc gắn lại trong đoạn này không?
- [ ] `Timeline` của 2.5 có là "khối thời gian + ngôn ngữ tự nhiên liên tục" không, không thoái hóa thành một đống tiêu đề con máy quay/hành động/diễn xuất?
- [ ] 2.5 có tránh xuất lặp lại nguyên khối danh sách tài sản A4, mà nén thông tin cần thiết vào trường tương ứng không?
- [ ] Mỗi đoạn đều có tọa độ thế giới + tọa độ khung hình tự chứa, chứ không phải "như trên/tiếp nối đoạn trước"?
- [ ] Kế thừa trạng thái cảnh liên tục, neo lại khi đổi cảnh có đúng không?
- [ ] Nối giữa các đoạn thỏa mãn A7.3?
- [ ] Dựng liên tục theo hành động có cố gắng giữ trong cùng một đoạn tạo không?
- [ ] Lời thoại chép nguyên văn?
- [ ] Phụ đề/chữ chồng hậu kỳ có không giao cho model tạo không? Chữ trên tài sản vật thể có xử lý theo A1.3 không?
- [ ] Khi không có thư viện tham chiếu mà tạo ảnh tham chiếu, có chỉ dùng cho Reference binding, ngoại hình đánh dấu là đề xuất thiết kế, và không vượt quyền kiểm soát vị trí đứng/ánh sáng/cốt truyện không? (bổ sung cho Trường hợp hai của A1.2)

### A11.2 Cơ chế sửa có giới hạn (chống vòng lặp vô hạn)

Sau lần kiểm tra đầu tiên nếu phát hiện vấn đề:
1. Tổng hợp tất cả các mục không đạt trong một lần;
2. **Chỉ làm một vòng sửa cấu trúc tập trung**; sửa cấu trúc chỉ được điều chỉnh ranh giới phân đoạn, cách chứa shot, ngân sách thời gian, cách diễn đạt quay phim và thông tin khóa, **không được sửa nội dung sự kiện, người thực hiện, đối tượng, số lượng, thứ tự hay lời thoại của bất kỳ `E##` nào**;
3. Sau khi sửa chỉ đối chiếu lại các mục bị ảnh hưởng và tính liên tục trực tiếp của chúng;
4. Sau đó vào kiểm toán trung thành cốt truyện A11.3 và kiểm tra trước độ ổn định khi tạo A11.4; tất cả đạt thì vào A12.

**Cấm đệ quy qua lại A11 ↔ A12.**

Nếu sau một vòng sửa tập trung vẫn còn xung đột cứng kiểu "các yêu cầu của người dùng không thể đồng thời thỏa mãn" (ví dụ nghiêm ngặt 30s nhưng lời thoại nguyên văn đọc tự nhiên đã vượt 30s), giữ nguyên văn của người dùng và nói rõ trong "Tổng quan toàn phim | Xung đột ràng buộc thời lượng", không tiếp tục tính lại vô hạn.

### A11.3 Kiểm toán trung thành cốt truyện (bắt buộc làm trước khi vào A12)

Làm một lần đối chiếu một chiều, không hiển thị sổ cái nội bộ cho người dùng:

1. Đọc theo thứ tự `E01 → E02 → ...` từ sổ cái cốt truyện nguồn;
2. Xác nhận mỗi `E##` đều xuất hiện trong một đoạn tạo cuối cùng nào đó, và người thực hiện / đối tượng / lời thoại / thứ tự không thay đổi;
3. Quét ngược mọi hành động làm thay đổi trạng thái thế giới trong Timeline cuối cùng; nếu không tìm thấy `E##` nguồn, xóa hành động AI thêm đó;
4. Quay phim, bố cục, cỡ cảnh, lấy nét, kết quả vật lý trực tiếp và foley của hành động đã có có thể không có `E##`, nhưng không được tạo ra sự thật cốt truyện mới;
5. Nếu sau khi xóa hành động AI thêm phát sinh câu hỏi "trạng thái từ đâu ra", xử lý theo A0.1.4: lấy thẳng trạng thái người dùng đưa ra làm trạng thái ban đầu của nhịp đó, không bổ sung tiền sử;
6. Nếu chính văn bản nguồn có chỗ hổng hay mâu thuẫn, giữ nguyên chỗ hổng/mâu thuẫn và đánh dấu trong tổng quan toàn phim, không tự bắc cầu.

**Mục tiêu kiểm toán không phải làm cốt truyện trôi chảy hơn, mà là xác nhận prompt cuối cùng và cốt truyện của người dùng là cùng một chuyện.**

### A11.4 Kiểm tra trước độ ổn định khi tạo (giảm xác suất hình ảnh bị vỡ · bắt buộc)

Mục này chỉ giảm rủi ro khi tạo, **không thể cam kết đầu ra của model tuyệt đối không vỡ**. Mục tiêu là loại bỏ trước gánh nặng prompt dễ gây biến dạng nhân vật, lỗi tay, đạo cụ biến mất/nhân bản, cấu trúc hình ảnh tan chảy và trôi danh tính nhất; không được lấy lý do "ổn định" để xóa cốt truyện hay sửa sự kiện.

#### A11.4.1 Các mục kích hoạt rủi ro cao

Khi bất kỳ shot nào xuất hiện các tình huống sau, đánh dấu là rủi ro cao và chủ động giảm độ phức tạp:
- 3 chủ thể trở lên đồng thời di chuyển biên độ lớn, che khuất lẫn nhau hoặc tiếp xúc nhau;
- Hai tay/nhiều người đồng thời thao tác đạo cụ nhỏ, trao tay, cài khuy, rót chất lỏng, lau chùi và các tiếp xúc tinh tế khác, đồng thời còn yêu cầu chuyển động máy phức tạp;
- Các động tác cơ thể biên độ lớn như nhân vật quay người nhanh, ngồi xuống đứng lên, tiếp đất, mặc cởi, nhiều người đổi chỗ xảy ra đồng thời với chi tiết tay ở cận cảnh;
- Gương, kính, phản xạ mạnh, vật chứa trong suốt, nhiều bóng đổ và các bố cục dễ nhân bản nhân vật/chi thể/đạo cụ;
- Bao bì sản phẩm, chữ nhỏ, ngón tay, chất lỏng hay cấu trúc cơ khí vừa phải chính xác ở khoảng cách gần, vừa phải di chuyển/xoay tốc độ cao;
- Cùng một shot đồng thời yêu cầu độ sâu trường ảnh cực nông, che khuất mạnh, chuyển động máy nhanh, tiếp xúc tinh tế và diễn xuất nhiều nhân vật;
- Đoạn này trích dẫn quá nhiều ảnh tham chiếu, và nhiều ảnh có xung đột tiềm ẩn về cùng nhân vật, trang phục, cấu trúc bối cảnh hay hình dạng sản phẩm;
- Bản thân prompt có các yêu cầu loại trừ nhau, ví dụ "nhân vật hoàn toàn cố định" đồng thời "nhanh chóng đổi chỗ", "tay luôn cầm bút" đồng thời "cùng shot tay không hoàn thành một hành động khác".

#### A11.4.2 Thứ tự giảm rủi ro

Gặp rủi ro cao, xử lý theo thứ tự sau, cho đến khi prompt không còn quá tải:
1. **Xóa các kiểm soát không liên quan, không xóa cốt truyện.** Xóa thuật ngữ shot, từ phủ định chung chung, chi tiết chất liệu không liên quan và tham chiếu vô dụng không ảnh hưởng đến shot này; chỉ giữ các khóa shot hiện tại thực sự cần.
2. **Đơn giản hóa máy quay trước.** Khi có tiếp xúc tay/đạo cụ tinh tế, ưu tiên cố định hoặc một chuyển động đơn nhất ổn định; không chồng cùng lúc push/pull, quay vòng, lia nhanh, chuyển nét mạnh.
3. **Để tiếp xúc then chốt nhìn thấy trọn vẹn.** Các hành động trao tay, cầm lấy, lau chùi, đóng mở, chọn cỡ cảnh có thể đồng thời thấy tay và đạo cụ liên quan, tránh tại điểm tiếp xúc then chốt nhất bị mép khung, cơ thể hay tiền cảnh che hoàn toàn.
4. **Giảm xung đột độ sâu trường ảnh.** Khi tay, đạo cụ và bề mặt tiếp xúc then chốt đều phải nhận rõ được, không dùng độ sâu trường ảnh cực nông làm mờ hoàn toàn một bên.
5. **Hành động phức tạp và quay phim phức tạp đừng tranh cùng một khoảnh khắc.** Nếu cốt truyện nguồn cho phép tách shot, thì tại ranh giới `E##` đã có chia các tương tác phức tạp khác nhau ra các shot; nếu cốt truyện nguồn yêu cầu rõ xảy ra đồng thời, thì giữ đồng thời, nhưng giảm chuyển động máy, động thái phông nền và độ phức tạp diễn xuất không liên quan.
6. **Ảnh tham chiếu chỉ giữ những gì đoạn này thực sự cần.** Nhiều tham chiếu cho cùng một đối tượng nếu công dụng khác nhau, nói rõ phạm vi từng cái; xung đột nhau thì xử lý theo A1.2.1, không để model tự trộn.
7. **Thêm Avoid có định hướng cho đoạn rủi ro cao, chứ không chất từ phủ định cho toàn phim.** Có thể thêm theo rủi ro thực tế của shot này: không xuất hiện cánh tay/ngón tay thừa, dính chi, trôi danh tính khuôn mặt, đạo cụ nhân bản/biến mất, vật xuyên tay/xuyên bàn, cơ thể xuyên vật thể, hình học tan chảy, gương phản chiếu thừa nhân vật v.v.; không có rủi ro này thì không thêm máy móc.
8. **Vẫn quá tải mới phân cảnh lại/phân đoạn lại.** Chỉ được dùng ranh giới nhịp nguồn đã có, không xóa, không thêm, không đổi thứ tự, không thay đổi quan hệ xảy ra đồng thời.

#### A11.4.3 Tiêu chuẩn đạt độ ổn định

Trước khi vào A12 xác nhận:
- Mỗi shot có nhiệm vụ quan sát chính rõ ràng;
- Số lượng nhân vật, tiếp xúc chi thể, số lượng đạo cụ và nhân quả hành động có thể được cỡ cảnh hiện tại thể hiện rõ trọn vẹn;
- Máy quay không có lệnh chuyển động mâu thuẫn nhau;
- Không tồn tại yêu cầu gương/phản chiếu không cần thiết dễ gây lặp chủ thể;
- Các Reference binding không tranh giành cùng một chiều;
- Danh tính nhân vật then chốt, trang phục, cấu trúc sản phẩm và đạo cụ then chốt đều đã được khóa ở trường thích hợp;
- `Avoid` của đoạn rủi ro cao chỉ nhắm vào rủi ro thực tế, không phải hàng chục từ phủ định chung chung.

---

## A12. Tối ưu trước khi giao (đánh bóng cuối cùng · thực thi một lần)

**A12 chỉ thực thi một lần.** Nó không phải vòng phân cảnh thứ hai, cũng không chịu trách nhiệm tính lại số đoạn, cắt lại nhịp hay quay lui A11.

Tối ưu không phải viết lại, mà là trên cấu trúc có sẵn kiểm tra tính thể hiện và khả năng thực thi của A12.1–A12.18. Phát hiện vấn đề diễn đạt thông thường thì sửa luôn; phát hiện xung đột cứng cấp cấu trúc thì xử lý theo A12.19, không đệ quy quay lại.

### A12.1 Khóa khung đầu
Với khung đầu của mỗi shot, viết rõ theo "các mục áp dụng":
- Shot này có nhân vật không; nếu không có người, nói rõ "shot trống, không có nhân vật"
- Nhân vật đứng / ngồi / ngồi xổm / nằm
- Nhân vật ở trái hay phải khung hình
- Khoảng cách tương đối giữa các nhân vật
- Hướng cơ thể
- Điểm rơi ban đầu của ánh nhìn (cốt truyện nguồn có đối tượng chú ý rõ thì viết theo; không có thì chỉ dùng điểm rơi trung tính không mang thông tin mới, không suy diễn hứng thú/thù địch/mập mờ mới)
- Trong tay cầm gì
- Đạo cụ then chốt đặt ở đâu
- Khoảng cách và độ cao máy quay
- Tiền cảnh / trung cảnh / hậu cảnh

Các mục không áp dụng thì đừng cố bịa.

### A12.2 Khóa xuất hiện thực thi theo shot
Lấy quy hoạch trạng thái theo timeline nội bộ của A4 làm chuẩn; 2.5 dù không liệt kê riêng định danh tài sản, cũng bắt buộc thể hiện cùng ràng buộc xuất hiện đó trong Timeline / Immutable locks.

Nhân vật không nên xuất hiện trong shot này, viết rõ:
- Hoàn toàn không xuất hiện;
- Không xuất hiện mặt / cơ thể / vai / tay / bóng phản chiếu / bóng đổ / hình người ngoài vùng nét (chọn theo nhu cầu);
- Nếu chỉ có lời thoại đồng bộ ngoài khung hình, phải nói rõ "chỉ có giọng nói".

Đặc biệt là shot chủ quan, shot cận bộ phận, shot sau vai, shot một người, tránh để model tự động thêm ra một nhân vật khác.

### A12.3 Quang học: viết kết quả nhìn thấy được, không dựa vào model ống kính
- ❌ "85mm f/1.4"
- ✅ "góc nhìn cảm giác chân dung tiêu cự ngắn, phối cảnh khuôn mặt tự nhiên, phông nền mờ nhẹ"

Model ống kính có thể hỗ trợ, nhưng trọng tâm là kết quả hình ảnh cuối cùng.

### A12.4 Kiểm tra mâu thuẫn máy quay
Mỗi shot chỉ giữ một logic chuyển động máy chính.
- ❌ "shot hoàn toàn cố định, đồng thời lia ngang chậm"
- ✅ "máy quay cố định, chỉ chuyển nét một lần cực chậm"

### A12.5 Quay phim né tránh (chỉ áp dụng cho phong cách kìm nén/hàm súc)
Khi phong cách người dùng thuộc loại kìm nén, hàm súc, có thể ưu tiên:
- Đặc tả tay / cốc / dây đỏ / mép sàn nhà
- Sau vai / cột che / tiền cảnh mất nét
- Trung cảnh hai người / viễn cảnh cố định

Đừng cưỡng ép áp dụng điều này cho các phong cách khác như phim hành động, hài mạnh, thử nghiệm sản phẩm.

### A12.6 Diễn xuất: hành vi chứ không phải cảm xúc trừu tượng
- ❌ "anh ấy rất buồn"
- ✅ "anh ấy vốn đang nâng cốc, động tác dừng khoảng 0.4 giây, sau đó tiếp tục uống"

Ưu tiên viết **phản ứng đã tồn tại trong cốt truyện nguồn** thành hành động nhìn thấy được. Ánh nhìn dừng lại / ngón tay siết chặt / cốc khựng lại / môi hé rồi khép / hơi thở thay đổi / trọng tâm thay đổi chỉ được dùng khi nhất quán với phản ứng trong cốt truyện nguồn, không được dùng làm sự kiện diễn xuất mới do AI tự thêm.

### A12.7 Mật độ vi biểu cảm
Mỗi nhân vật mỗi shot thường 0–2 sự kiện vi biểu cảm rõ ràng. Khi shot không thấy mặt, không viết phản ứng khuôn mặt.

### A12.8 Cụ thể hóa mục tiêu ánh nhìn
Chỉ khi cốt truyện nguồn đã viết rõ nhân vật đang nhìn ai đó/vật gì đó/hướng nào đó, mới viết mục tiêu cụ thể. Nếu nguyên văn không có đối tượng chú ý, không được tự chọn một mục tiêu mang hàm ý cốt truyện.

Thứ tự hành vi tự nhiên có thể viết thành "mắt động trước → đầu theo sau", nhưng chỉ dùng để thể hiện động tác nhìn đã có trong nguyên văn, không thêm một lần nhìn.

### A12.9 Hành động hai người tránh đồng bộ máy móc
Nếu bản thân cốt truyện nguồn có hai hành động đã có có thể song song nhưng không khóa đồng bộ chính xác, có thể lệch nhịp nhẹ với điều kiện không thay đổi thứ tự sự kiện và nhân quả. **Không được vì "tự nhiên" mà thêm hành động cho bất kỳ nhân vật nào, lùi sự kiện then chốt hay thay đổi quan hệ xảy ra đồng thời vốn đã rõ ràng.**

### A12.10 Chuỗi nhân quả hành động
Ưu tiên tổ chức **các nhịp nguồn đã có** thành chuỗi nhân quả rõ ràng; nếu nguyên văn của người dùng thực sự có nhiều hành động, thì giữ lại toàn bộ, chỉ phân bổ trên cách chứa shot, không được vì "mỗi shot một hành động cốt lõi" mà xóa bất kỳ sự kiện nguồn nào. Các hành động trang trí do AI tự thêm nên xóa.

### A12.11 Tính liên tục đạo cụ (trong đoạn + qua đoạn liên quan)

Với mỗi đạo cụ then chốt ít nhất kiểm tra: **người cầm, tay dùng (nếu đã xác định rõ), vị trí tuyệt đối, trạng thái nhìn thấy/bị che, số lượng, hướng, đóng mở, mực chất lỏng/vật chứa bên trong, hao mòn, vết bẩn/độ ẩm, nơi đến cuối đoạn**.

- Trong đoạn quét từng khối thời gian theo "trạng thái đầu → hành động cốt truyện nguồn → trạng thái cuối"; đoạn có liên hệ liên tục thì so sánh thêm trạng thái cuối đoạn trước với trạng thái đầu đoạn sau theo A8.3.
- Một cây bút nếu vẫn do nhân vật cầm, và không có việc đặt xuống, trao tay, cất đi hay rơi tương ứng với `E##` nguồn, thì khoảnh khắc tiếp theo không được tự nhiên biến mất.
- Shot sau vì cắt khung hay che khuất mà không quay tới đạo cụ, không có nghĩa là đạo cụ đã biến mất; trạng thái thế giới tiếp tục được giữ.
- Nếu cùng một bàn tay vẫn nhìn thấy rõ mà đạo cụ không có nguồn gốc lại mất, coi là lỗi tính liên tục; nếu tay và đạo cụ đều ngoài khung, chỉ ghi "vẫn do nhân vật đó cầm/vẫn ở vị trí cũ", đừng tự thay đổi trạng thái.
- Đạo cụ đã đặt xuống không được quay lại tay mà không có quá trình; vật đã giao cho B không được đồng thời lại xuất hiện trong tay A; số lượng không được tăng giảm vô cớ.
- Nguyên văn không chỉ định tay trái/phải và shot không cần thì không cưỡng ép khóa tay; một khi prompt đã xác định rõ một tay nào đó để thực thi, thì trong các shot liên tục liên quan không được đổi tay mà không có quá trình.

Cấm khôi phục hay đặt lại vô cớ: cốc đã uống đột nhiên đầy, vết bẩn đã lau đột nhiên trở lại, cửa đã mở đóng lại không có hành động, đạo cụ hư tự động lành, vật đã tiêu hao khôi phục số lượng.

### A12.12 Tính chân thực vật lý
Kiểm tra trọng tâm quán tính chất lỏng, nếp gấp vải, tiếp xúc tay và đạo cụ, trọng lượng vật thể, rung mặt bàn, phản hồi va chạm, khúc xạ/phản xạ kính v.v.

### A12.13 Nhất quán ánh sáng
Cùng một cảnh liên tục giữ hướng ánh sáng chính, nhiệt độ màu và logic phơi sáng. Đổi cảnh/nhảy thời gian thì thiết lập lại theo A5.5, không cưỡng ép kế thừa.

Cấm chỉ vì cốt truyện quan trọng mà đột nhiên thêm ánh sáng viền, tăng ánh sáng mắt hay thay đổi phơi sáng, trừ khi phong cách người dùng yêu cầu rõ.

### A12.14 Âm thanh
Mặc định chỉ giữ lời thoại đồng bộ thật và âm thanh môi trường/hành động. BGM, nhạc nền, hiệu ứng âm thanh cảm xúc có tồn tại hay không, lấy yêu cầu người dùng làm chuẩn; người dùng không yêu cầu thì không tự động thêm, mặc định không nhạc nền.

### A12.15 Nguyên văn lời thoại + thời lượng
Lời thoại người dùng cung cấp bắt buộc:
- Chép nguyên văn
- Không đổi từ / không đổi cấu trúc câu / không thêm từ cảm thán / không lặp lại / không ứng tác

A12 **không được** giải quyết vấn đề lời thoại không vừa bằng "tăng tốc độ nói"; loại vấn đề này đáng lẽ đã được xử lý ở A11. A12 chỉ tinh chỉnh cách diễn đạt khoảng dừng không làm thay đổi cấu trúc.

### A12.16 Ưu tiên khóa thuận
Ưu tiên viết trạng thái có thể thực thi:
- "Nhân vật A trong shot này luôn ở bên trái khung hình"
- "Cốc do tay phải nhân vật A cầm"
- "Nhân vật B trong shot này hoàn toàn ngoài khung hình"

Sau đó bổ sung các mục cấm cần thiết.

### A12.17 Khóa chữ
Mặc định viết:
- Không phụ đề
- Không chữ màn hình thêm
- Không tiêu đề/thẻ giải thích/chữ chồng UI/watermark hậu kỳ

Nếu shot có chữ trên tài sản vật thể như bao bì sản phẩm, biển hiệu, thư từ:
- Có ảnh tham chiếu → giữ tài sản tham chiếu, không thêm, không viết lại, không vẽ lại chữ;
- Không yêu cầu model tạo thêm "chữ mới rõ ràng chính xác";
- Chỉ khi người dùng yêu cầu rõ chữ đọc được mới khóa từng chữ.

### A12.17.1 Tính đầy đủ của việc gắn ảnh tham chiếu (Seedance 2.5)
Khi người dùng cung cấp ảnh tham chiếu, A12 chỉ kiểm tra việc gắn có đầy đủ không, công dụng có rõ không, không được thay, xóa, gộp hay tự thêm ảnh tham chiếu ở giai đoạn tối ưu.

- Mỗi đoạn liên quan đều bắt buộc giữ node tham chiếu thật / handle tài sản mà đoạn đó cần;
- Không được vì "đoạn trước đã gắn" mà xóa khỏi đoạn sau;
- Không được mở rộng "chỉ tham chiếu vị trí đứng" thành tham chiếu ngoại hình nhân vật;
- Không được đưa phông nền, nhân vật lạ hay đạo cụ thừa trong ảnh tham chiếu nhân vật vào cốt truyện;
- Không được viết lại chữ phức tạp trong ảnh tham chiếu sản phẩm thành nội dung bao bì mới.

### A12.18 Thêm giới hạn thống nhất theo nhu cầu
Có thể chọn dùng theo dự án hiện tại:
- Không thêm nhân vật / đạo cụ / lời thoại / hành động cốt truyện
- Không vượt trục vô cớ / không hoán đổi vị trí nhân vật mà không có quá trình
- Không cắt nhanh kiểu MV
- Không bổ sáng / làm mịn da kiểu quảng cáo không có căn cứ phong cách
- Không phóng đại độ sâu trường ảnh / không dùng slow motion thiếu tự nhiên

**Đừng dán máy móc các giới hạn không liên quan đến shot hiện tại.**

### A12.18.1 Kiểm toán cuối cùng về tính liên tục và rủi ro lỗi hớ (bắt buộc trước khi giao)

Sau khi A12 hoàn tất đánh bóng chữ, trước khi xuất cuối cùng, làm thêm một lần **kiểm toán một chiều**, không quay về A11, không kích hoạt vòng A12 thứ hai:

1. **Lập ảnh chụp trạng thái đầu / trạng thái cuối của mỗi đoạn**: vị trí thế giới, tư thế, hướng, trạng thái xuất hiện, tay đang bận của nhân vật; người cầm/vị trí/số lượng/trạng thái của đạo cụ then chốt; các trạng thái kéo dài như cửa/đồ nội thất/vết bẩn/nguồn sáng của bối cảnh.
2. **Chỉ so sánh các cặp đoạn được A8 xác định là "liên hệ liên tục / liên hệ trạng thái cục bộ"**. Các đoạn liền kề không có quan hệ liên tục thì không cưỡng ép so vị trí nhân vật, chỉ kiểm tra bản thân đoạn đó có hợp lý không.
3. **Kiểm tra lỗi hớ nhân vật**: dịch chuyển tức thời không nguồn gốc, đổi bên không nguồn gốc, đứng↔ngồi không có quá trình, cùng một nhân vật ở cùng một vị trí thế giới bị nhân thành hai người, trong khung/ngoài khung mâu thuẫn với mô tả vị trí máy.
4. **Kiểm tra lỗi hớ đạo cụ**: biến mất, nhân bản, đổi tay, quay lại tay, thay đổi số lượng, đặt lại trạng thái đóng mở, khôi phục mực chất lỏng/vết bẩn/hư hỏng không nguồn gốc; đặc biệt kiểm tra tình huống "giây trước còn cầm, giây sau cùng bàn tay đó nhìn thấy rõ mà lại trống trơn".
5. **Kiểm tra lỗi hớ không gian**: đồ nội thất cố định bị dời chỗ, trạng thái cửa nhảy cóc, nhân vật xuyên tường/xuyên bàn, đồ vật xuyên tay, tỉ lệ nhân vật và bàn ghế đột biến, trong phản chiếu/gương có thêm nhân vật hay đạo cụ không tồn tại.
6. **Kiểm tra rủi ro vỡ khi tạo**: shot rủi ro cao đã được giảm chuyển động máy, che khuất, độ sâu trường ảnh, tiếp xúc đồng thời và xung đột tham chiếu theo A11.4 chưa; đã thêm Avoid có định hướng cần thiết nhắm vào rủi ro thực tế của shot này chưa.
7. **Rà soát lại trung thành cốt truyện**: mọi chỉnh sửa chỉ được thay đổi cách diễn đạt quay phim, thông tin khóa, mô tả che khuất/khả năng nhìn thấy và cách chứa shot; không được thêm các hành động nối cầu như "đặt bút xuống" "cầm bút lại" "đi về chỗ cũ" để che lỗi hớ.

Nếu phát hiện là mâu thuẫn của chính bản nháp AI, sửa trực tiếp trong lần A12 này cho nhất quán với trạng thái đã xác nhận; nếu phát hiện chính cốt truyện nguồn mâu thuẫn, giữ nguyên văn và đánh dấu "xung đột văn bản nguồn" trong tổng quan toàn phim.

**Mục này là kiểm toán rủi ro lỗi hớ ở phía prompt, không có nghĩa là video được tạo thực tế đã không có lỗi hớ. Video thực tế có xuất hiện nhiều tay nhiều ngón, dính chi, nhân vật đổi mặt, đạo cụ chợt hiện/biến mất, xuyên vật thể, lỗi gương phản chiếu v.v. hay không, bắt buộc nghiệm thu kết quả riêng khi media thực sự đọc được.**

### A12.19 Ranh giới tối ưu và điều kiện dừng (chống vòng lặp vô hạn)

A12 không được phép thay đổi:
- Lời thoại nguyên văn của người dùng
- **Hành động, phản ứng, số lượng sự kiện, người thực hiện, người chịu tác động, đạo cụ, thông tin và quan hệ nhân quả của bất kỳ `E##` nào trong cốt truyện nguồn**
- **Mức độ danh tính mơ hồ trong nguyên văn của người dùng (như "cha mẹ/phụ huynh/người lớn" không được tự ý cụ thể hóa)**
- Ý đồ cốt lõi của cốt truyện
- Thứ tự nhịp đã xác nhận ở A11
- Số đoạn thực tế toàn phim / thời lượng các đoạn
- Số đoạn toàn cục / quy hoạch Batch
- Danh tính tài sản then chốt
- Logic tọa độ thế giới đã xác nhận

A12 chỉ được phép:
- Viết mô tả cụ thể hơn, có thể thực thi hơn
- Bổ sung đầy đủ khóa khung đầu/khóa xuất hiện
- Giảm diễn xuất quá đà
- Bổ sung diễn đạt về vật lý, ánh sáng, âm thanh và tính liên tục
- Dọn dẹp các cách diễn đạt mâu thuẫn nhau

**Phân biệt nguồn xung đột:**
- Nếu xung đột là lỗi diễn đạt do chính bản nháp AI gây ra (như cùng một shot đồng thời viết tay trái/tay phải cầm cốc) → sửa trực tiếp trong A12 cho nhất quán với trạng thái đã xác nhận ở A11;
- Nếu xung đột đến từ chính kịch bản nguồn của người dùng (như cùng một thời điểm viết rõ hai vị trí loại trừ nhau) → không tự ý sửa cốt truyện, đánh dấu "xung đột văn bản nguồn" trong tổng quan toàn phim.

**Quy tắc dừng:** A12 hoàn tất một lần thì chỉ làm đánh dấu kiểm cuối cùng, không quay lại A11, không kích hoạt lần A12 thứ hai.

Đánh dấu kiểm cuối cùng:
- [ ] Mọi `E##` của cốt truyện nguồn đều xuất hiện và thứ tự, người thực hiện, đối tượng, lời thoại không thay đổi
- [ ] Trong Timeline không tồn tại hành động cốt truyện thêm mới không có `E##` nguồn
- [ ] Không bổ sung tiền sử, bổ sung nguồn gốc đạo cụ, tự ý cụ thể hóa nhân vật mơ hồ
- [ ] Các mục áp dụng của khung đầu đầy đủ
- [ ] Trạng thái xuất hiện của mỗi shot nhất quán với A4
- [ ] Không có mâu thuẫn máy quay
- [ ] Diễn xuất nhìn thấy được và không quá tải
- [ ] Mục tiêu ánh nhìn cụ thể
- [ ] Đạo cụ / vật lý / ánh sáng liên tục
- [ ] Mọi đoạn liền kề đã được xác định loại liên hệ theo A8; đoạn có quan hệ liên tục thì vị trí/tư thế/hướng nhân vật nhất quán, đoạn không có quan hệ thì không bị khóa cứng sai
- [ ] Đạo cụ then chốt không tồn tại biến mất, nhân bản, đổi tay, quay lại tay, thay đổi số lượng hay đặt lại trạng thái không nguồn gốc; việc cắt khung/che khuất không bị phán đoán nhầm thành thay đổi trạng thái thế giới
- [ ] Đã hoàn thành kiểm toán rủi ro lỗi hớ về không gian/cửa/đồ nội thất/phản xạ/gương/xuyên vật thể v.v.
- [ ] Shot rủi ro cao đã qua kiểm tra trước độ ổn định khi tạo A11.4 và đã giảm độ phức tạp có định hướng
- [ ] Lời thoại nguyên văn không bị sửa
- [ ] Không có phụ đề/chữ chồng do AI thêm
- [ ] Chữ vật thể được xử lý theo tài sản tham chiếu
- [ ] Không quay lui cấu trúc / không vòng lặp
- [ ] Nếu model mục tiêu là 2.5, giao nộp cuối cùng chỉ chứa các trường A9.2 cho phép, và không tồn tại bất kỳ vỏ ba phần kiểu cũ, vỏ 2.0 hay cấu trúc chính đánh số shot nào
- [ ] Ảnh tham chiếu được tạo (nếu có) chỉ dùng cho Reference binding, ngoại hình đánh dấu là đề xuất thiết kế, không vượt quyền đưa vào vị trí đứng/ánh sáng/cốt truyện (bổ sung cho Trường hợp hai của A1.2)

**Đánh dấu kiểm xong → xuất bản cuối cùng.**

---

═══════════════════════════════════════════

---

## Tiến hành trên canvas

Sản xuất thực tế mặc định được thể hiện trên canvas hiện tại, nhưng **định tuyến Seedance được ưu tiên hơn việc khám phá và cấu hình canvas**: nếu đã có kịch bản/timeline có thể thực thi và mục tiêu hiện tại là sản xuất, tạo, tiếp tục hoặc sửa video, bắt buộc trước tiên hoàn thành quy hoạch/bản chốt prompt Seedance tương ứng theo PART A của file này, rồi mới vào [Thực thi trên canvas](references/canvasExecution.md) để đọc theo nhu cầu tổng quan canvas, node mục tiêu, kết nối cục bộ, cấu hình model, cổng và hàm node. Không được vì cần `getConfig`, chọn độ phân giải/tỉ lệ khung/chế độ hoặc host bật hỏi cấu hình mà bỏ qua PART A. Chỉ khi chưa vào giai đoạn sản xuất video, mới khám phá canvas trước theo quy trình thông thường. "Hoàn thành kịch bản và phương án tài sản trước" chỉ giới hạn giai đoạn, vẫn dùng node văn bản, không kích hoạt tạo media; chỉ khi người dùng nói rõ muốn văn bản hội thoại, tư vấn hoặc không thao tác canvas thì mới bỏ qua thao tác node. Workspace dùng dự án hiện tại của host; khi chưa mở canvas thì nói rõ điều kiện cụ thể, tiếp tục phần văn bản có thể hoàn thành.

| Giai đoạn đạt tới | Thành quả hiện tại | Cần đọc |
|---|---|---|
| 1. Nội dung và phạm vi | Node văn bản nguyên văn hoặc kịch bản; bản tóm tắt sản xuất cần thiết | [Đầu vào và kịch bản](references/sourceAndScript.md) |
| 2. Tài sản | Danh sách nhân vật, bối cảnh, đạo cụ của phạm vi hiện tại và ảnh thực tế được chọn dùng | [Sản xuất tài sản](references/assets.md) |
| 3. Prompt Seedance | Quy hoạch toàn phim, phân đoạn và prompt chính thức bao phủ cốt truyện lần này; **chỉ thực thi PART A nhúng trong file này** (2.0 đi theo A9.1, 2.5 đi theo A9.2), giai đoạn này không đọc storyboard hay methods | **Chỉ PART A nhúng trong file này** |
| 4. Tạo và chọn dùng | Node tạo đoạn hiện tại, đầu ra thật, phản hồi và bản ghi chọn dùng | [Thực thi trên canvas](references/canvasExecution.md), [Trạng thái và giao nộp](references/stateAndDelivery.md) |
| 5. Giao nộp hoặc tiếp tục | Kịch bản hiệu lực, chỉ mục tư liệu và đoạn, phạm vi thực tế đã hoàn thành và bước tiếp theo | [Trạng thái và giao nộp](references/stateAndDelivery.md) |

Chỉ tạo các node mà giai đoạn hiện tại đã đạt tới cần dùng. Một đoạn cốt truyện có thể có nhiều shot, mặc định tương ứng với một prompt hoàn chỉnh, một node tạo video; không mặc định tạo khung hình then chốt cho từng shot trước. Nối dây truyền tư liệu thực tế, không có nghĩa là phê duyệt hay điều phối tự động.

Tài sản chính thức trong sản xuất cốt truyện căn cứ vào kịch bản hoàn chỉnh đã xác nhận lần này; khi thiết kế riêng nhân vật, bối cảnh hay đạo cụ, căn cứ vào yêu cầu thiết kế người dùng đã xác nhận và tư liệu có sẵn, không yêu cầu viết bổ sung kịch bản. Khi người dùng đồng thời yêu cầu kịch bản và phương án tài sản, có thể trong cùng một lượt trích xuất danh sách tài sản và bản nháp thiết kế, ghi rõ kịch bản chờ xác nhận mà chúng phụ thuộc, không coi bản nháp là sự cho phép tạo. Nhân vật không cần có tiểu sử đầy đủ trước, nhân vật chỉ có giọng nói thì không tạo chân dung vô dụng. Phong cách, diễn xuất, hành động và tính liên tục được hiện thực trực tiếp vào tư liệu sản xuất và shot, không bắt buộc viết báo cáo độc lập cho từng mục; khi không có nhu cầu đánh nhau, đạo cụ đặc biệt v.v. thì không tạo tài liệu rỗng.

## Đọc phương pháp theo vấn đề sáng tác hiện tại

Quy tắc thực thi quyết định cách lưu, tạo và tiếp tục trong Toonflow; các phương pháp dưới đây **chỉ dùng cho sáng tác/chuyển thể/thiết kế tài sản trước giai đoạn prompt Seedance, hoặc thực thi media sau khi có thành phẩm Seedance**. Sau khi vào cách ly cứng prompt Seedance, không đọc bất kỳ phương pháp sáng tác nào trong mục này; trước và sau khi chốt prompt không được để các phương pháp này đè lên PART A.

| Vấn đề đang giải quyết | Phương pháp cần đọc | Hiện thực phán đoán vào đâu |
|---|---|---|
| Tách kịch bản đã xác nhận thành prompt phân đoạn Seedance 2.0/2.5 (nhịp, thời lượng, vị trí đứng, diễn xuất, chuyển động máy, tính liên tục, mẫu) | **"SEEDANCE EPISODE DIRECTOR · PART A" nhúng trong file này** | Quy hoạch phân đoạn, prompt chính thức từng đoạn (A9.1/A9.2), khóa trung thành cốt truyện |
| Ý tưởng, động lực nhân vật, nhân quả, đại cương hoặc phần tiếp theo | [Phát triển câu chuyện](references/methods/storyDevelopment.md) | Mệnh đề hành động, chuỗi sự kiện, lựa chọn và kết quả |
| Nghe nhìn hóa tiểu thuyết, bối cảnh, tâm lý, lời thoại và thời lượng | [Chuyển thể kịch bản](references/methods/screenAdaptation.md) | Các cảnh, hành động và âm thanh hoàn chỉnh, đề xuất chuyển thể và ước tính thời gian |
| Ngoại hình, không gian, cấu trúc đạo cụ và trạng thái kéo dài | [Thiết kế hình ảnh](references/methods/visualDesign.md) | Neo tài sản, bản gốc không gian và biến thể |
| Phong cách, màu gốc chất liệu, cách nhận sáng và chỉnh màu | [Màu sắc và ánh sáng](references/methods/colorAndLight.md) | Căn cứ hình ảnh dùng chung, ánh sáng bối cảnh và ràng buộc đoạn |
| Sáng tác/chuyển thể cốt truyện ở giai đoạn chưa chốt | Chỉ dùng các phương pháp phát triển câu chuyện và chuyển thể kịch bản ở trên | Hình thành kịch bản có thể xác nhận; một khi đã chốt và vào Seedance, lập tức ngừng dùng các phương pháp này |
| Thực thi và nghiệm thu media sau prompt thành phẩm Seedance | [Thực thi trên canvas](references/canvasExecution.md), [Trạng thái và giao nộp](references/stateAndDelivery.md) | Chỉ thực thi prompt đã chốt, kết nối tham chiếu thật, kiểm tra kết quả thật; không được viết thêm quy tắc prompt khác |

Kết luận của các phương pháp này chỉ đi vào thành quả kịch bản/thiết kế tài sản **trước Seedance**; sau khi vào cách ly cứng prompt Seedance, bất kỳ kết luận phương pháp nào cũng không được ghi trực tiếp vào hay viết lại prompt cuối cùng, bắt buộc do PART A xử lý lại từ đầu vào đã xác nhận. Ví dụ phương pháp, nhịp theo thể loại và các phong cách ứng viên không được tự động trở thành sự thật của dự án này.

Chỉ khi chi phí bàn giao và gộp thấp hơn khối lượng phân tích độc lập, mới có thể dùng `subAgent` để chia sẻ việc trích xuất sự thật nguyên văn dài hoặc sắp xếp tư liệu **trước Seedance**. **Ở giai đoạn cách ly cứng prompt Seedance cấm để subAgent độc lập soạn thảo, viết lại hay tối ưu prompt phân đoạn**; A0–A12 bắt buộc do cùng một chuỗi thực thi chính hoàn thành thống nhất, tránh tác vụ con mang vào bộ quy tắc thứ hai về shot/diễn xuất/tính liên tục.

Văn bản ít, kiểm kê tài sản, nối dây và bố cục thì hoàn thành trực tiếp, không bố trí vị trí cố định hay vòng duyệt thêm. Phân công chỉ giới hạn ở xử lý nội dung độc lập, không thay đổi quy trình xác nhận, tạo và chọn dùng về sau; việc tạo phần sau phụ thuộc vào kết quả thật của phần trước vẫn phải chờ kết quả đó.

## Xác nhận và thực thi

- Trình bày thành quả giai đoạn thực chất và xác nhận có điều chỉnh không; nội dung người dùng đã phê duyệt rõ và phạm vi sản xuất liên tục thì dùng tiếp trực tiếp. Không biến mỗi lần gọi công cụ, phân tích nội bộ hay bước con không cần thiết thành câu hỏi.
- Xác nhận nội dung, cho phép tiêu hao credit tính toán, chọn dùng kết quả được ghi riêng. Trước khi tạo trình bày phương án cụ thể có thể duyệt: đối tượng và số lượng, model, prompt hoàn chỉnh, tham chiếu thực tế, quy cách và số lần thực thi. Với người dùng thống nhất gọi là "tiêu hao credit tính toán", không tra được thì ghi "mức tiêu hao credit tính toán chưa rõ".
- Nhận sự cho phép qua `askUser` của host hoặc trả lời rõ ràng. Cùng một phương án cụ thể hoặc đợt đã được phê duyệt thì không hỏi lặp lại theo từng node; khi thêm số lượng, thay đổi phương án thực tế hoặc thử lại thêm thì đối chiếu xem sự cho phép có bao phủ không. "Tiếp tục" thông thường, im lặng và biểu mẫu lỗi không cấu thành sự cho phép tạo mới.
- Model mục tiêu Seedance chỉ xác định theo A0 của PART A; **khi chưa chỉ định bắt buộc trước tiên dùng một câu hỏi ngắn duy nhất để xác nhận 2.0 hay 2.5.** Câu hỏi này thuộc A0 của Seedance, không thuộc cấu hình canvas, và không được giải trừ khóa định tuyến. Tầng canvas chỉ sau khi model mục tiêu đã xác nhận và vào PART A, mới thông qua cấu hình thời gian thực để kiểm tra model/chế độ đó có thực sự thực thi được không. Giá trị mặc định của node, giá trị mặc định của host, biểu mẫu cấu hình, cấu hình lịch sử hay câu trả lời của người dùng về các cấu hình như độ phân giải/tỉ lệ khung, đều không được ngược lại đè lên hay giải trừ định tuyến model của A0; hỏi đáp cấu hình kết thúc thì tiếp tục trạng thái thực thi Seedance hiện tại.
- Có lời thoại không có nghĩa là bắt buộc phải có mẫu giọng bên ngoài. Cách viết âm thanh trong prompt chỉ tuân theo PART A; khi thực thi thực tế chỉ thông qua [Thực thi trên canvas](references/canvasExecution.md) đối chiếu model có hỗ trợ âm thanh gốc và đầu vào âm thanh thật không, không được dựa vào đó viết lại quy tắc lời thoại/âm thanh của PART A.

## Ranh giới tối thiểu của hoàn thành và khôi phục

Nội dung node văn bản được lưu qua hàm node, đường dẫn file đọc từ `data.textPath` thực tế. Sản xuất qua nhiều lượt dùng một bản ghi trạng thái gọn và một node tổng quan; dùng tiếp sổ theo dõi hiện có, không vì thiếu mẫu cố định mà yêu cầu làm lại.

Văn bản chờ xác nhận hoặc đã chọn dùng cần căn cứ phiên bản cố định, việc tạo cần giữ prompt, tham số, tham chiếu và đầu ra cũ của lần này. Sau khi xác nhận đối chiếu lại node thực tế, tránh việc chỉnh sửa của người dùng trong lúc chờ bị coi là đã phê duyệt; tư liệu đã chọn dùng ưu tiên cố định ở node tư liệu, bản sửa thì tạo ứng viên mới. Cách làm cụ thể xem [Trạng thái và giao nộp](references/stateAndDelivery.md).

Node media gốc hiện tại trả về `generating` chỉ biểu thị đã bắt đầu, không được tuyên bố hoàn thành. Nếu lượt này không có trạng thái thật hay công cụ chờ, sau khi hoàn thành việc khởi động và phần văn bản đã được cho phép và không phụ thuộc của lượt này, ghi nhận và báo người dùng trả lời khi xong, rồi đọc lại node tương ứng; không bịa ra việc tự động đánh thức hay thăm dò nền. Việc tạo phần sau của các đoạn liên tục phải chờ đoạn trước được chọn dùng và lấy được trạng thái chỗ nối thật, quy hoạch văn bản có thể liệt kê trước trạng thái dự kiến; tài sản hoặc đoạn không phụ thuộc có thể bố trí theo đợt đã được cho phép rõ ràng.

Đường dẫn video không có nghĩa là Agent đã xem video. Chỉ kiểm tra theo năng lực đọc media thực tế, khi năng lực không đủ thì để người dùng xem trước và báo cáo vấn đề, trạng thái chỗ nối và quyết định chọn dùng, nói rõ phần Agent chưa kiểm tra. Giao nộp phân biệt đoạn đã tạo, đoạn người dùng chọn dùng, thành phẩm đã ghép và bản sao đã thu gom; không có công cụ tương ứng thì giao trung thực thành quả hiện có và các mục còn thiếu.
