# Khởi tạo và lưu trữ dự án

Đầu vào là mục tiêu của người dùng, tiểu thuyết/câu chuyện/kịch bản sẵn có, dự án hiện tại và thư mục canvas. Đầu ra ghi vào canvas kịch bản duy nhất; bước này xác nhận phạm vi dự án và nơi lưu, không tạo cốt truyện hay media.

## Xác nhận phạm vi sản xuất

Trước tiên đọc các tệp thực tế và canvas sẵn có, chỉ bổ sung những gì chưa rõ: tên dự án, số tập mục tiêu, các tập xử lý lần này, thời lượng mỗi tập, phạm vi nguồn, tỉ lệ khung, thể loại câu chuyện và phong cách mỹ thuật. Các chương nguyên tác phải tồn tại; "chương 1–10" không thể thực hiện trực tiếp trên đầu vào chỉ có 8 chương. Khi người dùng không biết chia tập thế nào, trước tiên đọc tóm tắt nguồn, đưa ra phương án có căn cứ để người dùng chọn.

Điểm chặn trả phí chỉ xác nhận khi người dùng dự định làm phim ngắn thương mại, các dự án khác ghi "không áp dụng". 150 chữ/phút là mức ước tính thô theo cách lập kế hoạch kịch bản của bản cũ, không phải bảo đảm thời lượng; phân cảnh quay còn phải tính lại thời gian dựa trên lời thoại, khoảng dừng và động tác. Kịch bản sẵn có chỉ kiểm tra phạm vi, tính đầy đủ và trạng thái bản chốt, không ép bổ sung giai đoạn chuyển thể.

Mô hình ảnh/video trước tiên ghi lại lựa chọn sẵn có của người dùng; đến trước lần tạo đầu tiên mới kiểm tra năng lực thực tế của node hiện tại và xác nhận tham số, không đặt trước nhà cung cấp hay bắt buộc dùng Seedance. Khi chỉ cần kịch bản hoặc tài sản, các giai đoạn sản xuất không liên quan phía sau không khởi động.

## Chọn kiến thức dùng cho dự án này

Đọc phần hướng dẫn lựa chọn của [Thể loại tự sự](knowledge/narrativeGenres.md) và [Phong cách mỹ thuật](knowledge/visualStyles.md) cùng các mục phù hợp với ý định người dùng. Bản cũ dùng chúng lần lượt làm cẩm nang đạo diễn và cẩm nang mỹ thuật, skill này vẫn ghi lại riêng: thể loại tự sự phụ trách việc tiết lộ thông tin, nhịp, diễn xuất và mục đích shot; phong cách mỹ thuật phụ trách hình khối, chất liệu, màu sắc, ánh sáng và chất cảm chuyển động.

Khi đã có thể loại được chỉ định hoặc ảnh tham chiếu thì dùng tiếp, không bắt người dùng chọn lại từ preset. Khi cần đề xuất, dùng các bối cảnh cụ thể trong nguồn để giải thích lý do lựa chọn, ví dụ trinh thám chọn dùng thông tin cục bộ và manh mối có thể truy ngược, đất sét chọn dùng vân thủ công và nhịp dừng-chạy có trọng lượng; đề xuất thể loại chính/phong cách chính và các hướng phụ trợ cần thiết, chờ người dùng xác nhận. Thể loại/phong cách vẽ tùy chỉnh dùng phương pháp chung gần nhất và ghi rõ điểm sai lệch, không được giả vờ thư viện cũ có preset đó.

Trong "Cấu hình dự án" lưu `Thể loại tự sự và mục kiến thức tương ứng / Phong cách mỹ thuật và mục kiến thức tương ứng / Các điểm thực tế chọn dùng / Ghi đè tùy chỉnh của người dùng / Các giới hạn mẫu cũ không áp dụng`. Các giai đoạn sau đọc những quyết định này, rồi đến tệp kiến thức lấy phương pháp cụ thể cần cho giai đoạn hiện tại; chọn phong cách vẽ không đồng nghĩa với cho phép thiết lập lại ngoại hình của tài sản sẵn có.

## Lập thư mục canvas

Trước tiên đọc [Thực thi canvas](canvasOperations.md), liệt kê các canvas và thư mục hiện có. Mặc định `Canvas/Kịch bản.json`, `Canvas/Tài sản.json`; canvas theo tập đặt ở `Canvas/Tập/Tập 001.json` theo tiến độ thực tế, không tạo trước tất cả các tập.

- Dùng lại canvas sẵn có và đúng mục đích; canvas cùng tên nhưng nội dung khác thì xác minh trước, không ghi đè.
- Dự án lần đầu lập hai canvas trống kịch bản và tài sản; nếu lần này chỉ làm kịch bản thì canvas tài sản có thể để đến giai đoạn tài sản mới lập. Tạo từng cái một, ghi lại ID trả về, không được chuyển đổi song song.
- Khi công cụ hiện tại không thể tạo mới/phối hợp di chuyển canvas trong thư mục, trước tiên liệt kê cho người dùng vị trí hiện tại và vị trí đích của các canvas trống đã tạo, rồi nhờ họ lập thư mục và đặt về đúng chỗ qua cây tệp của workspace. Giải thích rằng giới hạn đến từ năng lực của công cụ hiện tại; sau khi người dùng trả lời đã xong và canvas đích được mở lại, mới kiểm tra danh sách tệp và ID canvas.
- Các bước lưu trữ tương tự áp dụng khi lần đầu vào sản xuất mỗi tập. Chưa đặt về đúng chỗ thì không được bắt đầu điền canvas đó hoặc ghi trạng thái lưu trữ là hoàn thành. Không dùng `write` để ghép JSON canvas, không đặt dấu gạch chéo vào `addCanvas.name`.
- Tệp tư liệu do host lưu ở vị trí trả về. `Canvas/Tài sản.json` là canvas quản lý tài sản, không phải thư mục chứa ảnh được tạo; không di chuyển tệp `assets/` để mô phỏng cấp thư mục của canvas.

## Đầu ra canvas

Tạo hoặc cập nhật các node văn bản sau trên canvas kịch bản:

| Node | Nội dung |
| --- | --- |
| Cấu hình dự án | Tên tác phẩm, loại/đường dẫn đầu vào, phạm vi nguồn, số tập toàn bộ và lần này, thời lượng mục tiêu, tỉ lệ khung, phong cách tự sự/mỹ thuật và kiến thức được chọn dùng, ràng buộc thương mại áp dụng |
| Chỉ mục canvas | Mục đích, đường dẫn tương đối thực tế, ID canvas mới nhất; canvas theo tập chỉ thêm vào sau khi tồn tại, không điền ID hư cấu |
| Nhật ký giai đoạn | Phạm vi lần này, các giai đoạn đã có/căn cứ xác nhận, điểm dừng hiện tại, tư liệu cần bổ sung, bước tiếp theo |

Khi đã có kịch bản bản chốt đầy đủ từ tệp bên ngoài hoặc được cung cấp trong chat, sau khi thư mục đã đặt đúng chỗ thì **ghi nguyên văn vào các node văn bản chính thức theo từng tập của canvas tổng kịch bản**, ghi lại nguồn gốc và căn cứ bản chốt của người dùng, rồi đọc lại toàn bộ chính văn. Nếu đã có node chính thức tương ứng thì kiểm tra và dùng lại. Nhánh này không sáng tác lại kịch bản, không yêu cầu bổ sung khung xương, cũng không xác nhận lại nội dung bản chốt mà người dùng đã nói rõ; các tập không thuộc phạm vi sản xuất lần này không khởi động khâu sau.

Ghi qua các hàm node, rồi đọc lại cấu hình và chỉ mục, xác nhận đường dẫn thực sự tồn tại và không trộn việc sản xuất nhiều tập vào một canvas. Trình bày cấu hình, thư mục và bước tiếp theo để người dùng xác nhận. Sau khi xác nhận, đầu vào có tiểu thuyết thì vào [Nguồn và sự kiện chương](sourceEvents.md), đã có kịch bản bản chốt đầy đủ thì sau khi các node chính thức được lưu xong vào [Tài sản cơ bản](baseAssets.md) hoặc giai đoạn sản xuất được chỉ định.

Nguồn: v1.1.8 `data/skills/script_agent_decision.md`, `src/routes/project/addProject.ts`. Việc tổ chức canvas và thư mục là quy ước di chuyển của skill này, không phải cấu trúc lưu trữ của bản cũ.
