# Nguồn phiên bản cũ và việc chuyển đổi hiện tại

Nguồn được cố định là [Toonflow-app v1.1.8](https://github.com/HBAI-Ltd/Toonflow-app/tree/cd3e7c4e83963bea255be2e621eb78d2cd1c2188), đã đối chiếu commit mà tag tham chiếu tới là `cd3e7c4e83963bea255be2e621eb78d2cd1c2188`. Các đường dẫn dưới đây đều tương đối theo commit này, không trích dẫn phiên bản sau để giả làm quy trình cũ. Khi thực hiện tác vụ không cần mỗi lần lên mạng đọc các nguồn này, skill này đã đúc kết sẵn các phương pháp cần thiết.

## Nguồn của các quy trình con

| reference của skill này | Tệp nguồn v1.1.8 |
| --- | --- |
| projectSetup | `data/skills/script_agent_decision.md`; `src/routes/project/addProject.ts` |
| sourceEvents | `src/routes/novel/event/generateEvents.ts`; `src/utils/cleanNovel.ts`; prompt sự kiện theo chương trong `src/lib/initDB.ts` |
| storySkeleton | `data/skills/script_execution_skeleton.md`; `data/skills/script_agent_supervision.md` |
| adaptationStrategy | `data/skills/script_execution_adaptation.md`; `data/skills/script_agent_supervision.md` |
| episodeScript | `data/skills/script_execution_script.md`; `src/agents/scriptAgent/index.ts` |
| baseAssets | `src/routes/script/extractAssets.ts`; prompt trích xuất tài sản trong `src/lib/initDB.ts`, `src/lib/fixDB.ts` |
| generateAssets | `src/routes/assetsGenerate/polishAssetsPrompt.ts`, `generateAssets.ts`; `data/skills/art_skills/{phong cách}/art_prompt/art_character.md`, `art_scene.md`, `art_prop.md`; `data/skills/production_execution_generate_assets.md`; `src/routes/production/assets/batchGenerateAssetsImage.ts` |
| directorPlan | `data/skills/production_execution_director_plan.md` |
| deriveAssets | `data/skills/production_execution_derive_assets.md` |
| storyboardTable | `data/skills/production_execution_storyboard_table.md`; `data/skills/production_agent_supervision.md` |
| storyboardPanel | `data/skills/production_execution_storyboard_panel.md`; `data/skills/production_skills/storyboard_prompt_techniques.md` |
| storyboardImages | `data/skills/production_execution_storyboard_gen.md`; `src/routes/production/storyboard/batchGenerateImage.ts` |
| videoProduction | `src/routes/production/workbench/generateVideoPrompt.ts`, `generateVideo.ts`, `batchGenerateVideo.ts`, `selectVideo.ts`; prompt theo model/chế độ trong `data/modelPrompt/video/` |

Lối vào tổng của quyết định biên kịch cũ: `data/skills/script_agent_decision.md`. Lối vào tổng của quyết định sản xuất cũ: `data/skills/production_agent_decision.md`. Phần cài đặt chạy thực của phiên bản cũ: `src/agents/scriptAgent/`, `src/agents/productionAgent/`.

## Đối chiếu hợp đồng đầu ra theo giai đoạn

Tính nhất quán được đánh giá dựa trên cùng đầu vào đã xác nhận, phạm vi, phân cảnh và chế độ thực sự được hỗ trợ; thứ được đối chiếu là cấu trúc sản phẩm, độ trung thành của nội dung, số lượng, ánh xạ và trạng thái khả dụng. Model tạo sẽ đưa ra lựa chọn sáng tạo, ngay cả skill thực thi cũ cũng nói rõ phân cảnh không theo đuổi lời giải duy nhất; không thể đảm bảo kịch bản, prompt hay media tạo lại giống nhau từng chữ, từng khung hình.

| Giai đoạn | Sản phẩm hợp lệ của v1.1.8 | Hợp đồng mà canvas hiện tại bắt buộc giữ lại |
| --- | --- | --- |
| Sự kiện theo chương | Mỗi chương một bản tóm tắt bảy trường, lưu vào `o_novel.event` tương ứng | Canvas kịch bản mỗi chương một hàng: chương, nhân vật, sự kiện cốt lõi, quan hệ với tuyến chính, mật độ, số giây, nhãn cảm xúc; chi tiết đính kèm riêng, không được thay đổi số hàng tổng hợp |
| Khung xương câu chuyện | Lõi câu chuyện, cung nhân vật, ba hồi, phân bổ N tập và cắt giảm | Tổng quan đúng N tập, từng tập truy được nguồn và lựa chọn giữ/bỏ; số chương không bằng số tập |
| Chiến lược chuyển thể | Nguyên tắc, lựa chọn giữ/bỏ, cách trình bày thế giới quan dựa trên sự kiện và khung xương | Phần thân chiến lược độc lập, có thể ràng buộc việc sáng tác các tập sau, không lấy tiêu đề hay tóm tắt thay thế |
| Kịch bản từng tập | Mỗi lần một `scriptItem` hoàn chỉnh, cập nhật kịch bản chính thức theo dự án và tên tập | Mỗi tập một phần thân hoàn chỉnh, nguồn, phạm vi, trạng thái tập trước liên tục; bản sửa cập nhật tại chỗ, không biến thành tập mới |
| Tài sản cơ bản | Thực thể nhân vật/bối cảnh/đạo cụ gắn với kịch bản nơi xuất hiện; prompt trau chuốt được tạo riêng | Thực thể duy nhất trên canvas tài sản, tên/bí danh, phân loại, mô tả, tập/cảnh xuất hiện, tham chiếu node thực; danh sách không giả làm ảnh |
| Kế hoạch đạo diễn | Bảng chia cảnh sáu cột, lưu ý từng cảnh, bảng chuyển tiếp cần thiết | Đầy đủ độ bao phủ các cảnh, số câu/số chữ lời thoại, cảm xúc 0-10 và tông chủ đạo; không tách shot sớm |
| Phái sinh và ảnh | Ghi chép cha con, mô tả thay đổi, cùng kết quả tạo độc lập | Mỗi biến thể có tài sản cha thực, căn cứ nhu cầu và trạng thái; chỉ ảnh đã chọn dùng mới làm tham chiếu ảnh chính thức, một phần/bỏ qua xử lý theo quy tắc bàn giao phái sinh |
| Bảng phân cảnh | Cảnh → đoạn → shot, tham chiếu cấp đoạn, mỗi shot bảy cột, đoạn ≤15 giây | Sự kiện gốc và lời thoại đầy đủ, thứ tự đúng, mỗi shot có thời lượng bằng số, tổng thời lượng đoạn và tham chiếu thực tế; mặc định 4 chữ/giây cộng ngắt nghỉ và dư lượng, các cách tính diễn xuất khác phải xác nhận rõ |
| Bảng đa tham chiếu thuần văn bản | Mỗi đoạn một bản ghi phân cảnh, track độc lập; mô tả chứa toàn bộ shot con, mặc định không tạo ảnh phân cảnh | Mỗi đoạn một đơn vị video, lưu đầy đủ số shot gốc, chữ của shot con, lời thoại/hiệu ứng âm thanh và thời lượng đoạn; vẫn có tham chiếu tài sản thực, không đồng nghĩa với text-to-video thuần không có tham chiếu |
| Bảng khung đầu và tạo ảnh | Mỗi shot một bản ghi, track độc lập, tạo ảnh khung đầu theo từng shot | Mỗi shot một đơn vị video và một khung đầu; số shot gốc và thời lượng shot đơn không đổi. Khung cuối chỉ thêm khi chế độ thực sự được chọn cần đến |
| Prompt/tạo/chọn dùng video | Tạo prompt và video ứng viên theo track, rồi gắn riêng videoId được chọn dùng với track | Mỗi đơn vị một prompt thực thi; số lượng ứng viên và số lượng chọn dùng tách riêng; mỗi đơn vị hoàn thành chọn dùng rõ ràng một phiên bản, ghi lại thuộc về shot/đoạn gốc nào và tệp thực |

Tính toán số lượng cho hai lộ trình: phân cảnh đã xác nhận có đoạn A (shot 1=4 giây, shot 2=5 giây, shot 3=3 giây, tổng 12 giây), đoạn B (shot 4=6 giây, shot 5=4 giây, tổng 10 giây), và model hỗ trợ các thời lượng này, mỗi đơn vị tạo lần đầu một lần:

| Sản phẩm | Đa tham chiếu văn bản | Khung đầu |
| --- | --- | --- |
| Đơn vị sản xuất/tương ứng track độc lập | 2 cái, lần lượt giữ shot 1–3, shot 4–5 | 5 cái, lần lượt giữ shot 1 đến shot 5 |
| Ảnh phân cảnh mặc định | 0 ảnh | 5 ảnh khung đầu |
| Prompt video | 2 bản | 5 bản |
| Ứng viên lô đầu/cuối cùng mỗi đơn vị chọn một phiên bản | 2 cái/2 cái | 5 cái/5 cái |
| Tổng thời lượng kế hoạch | 12+10=22 giây | 4+5+3+6+4=22 giây |

Thử lại làm tăng ứng viên, không thể thay đổi việc thuộc về đơn vị sản xuất nào; khi model không hỗ trợ một thời lượng nào đó thì trước tiên xác nhận lại phương án, không được xóa shot hay âm thầm đổi thời lượng để cho khớp số lượng trong bảng. Sản xuất một phần phải liệt kê riêng các chỗ thiếu, không tính tập con khả dụng là toàn bộ phim hoặc cả tập đã hoàn thành.

Chuỗi bằng chứng thực tế: `production_execution_storyboard_panel.md:56–75,103–130` định nghĩa đơn vị ghi → `add_flowData_storyboard` của `src/agents/productionAgent/tools.ts` phát `addStoryboard` → frontend đóng gói theo tag `data/web/index.html` chuyển đổi trường rồi gọi `src/routes/production/storyboard/batchAddStoryboardInfo.ts` → nhóm theo track, cộng duration và liên kết `o_videoTrack` → `workbench/getGenerateData.ts` cung cấp cho bàn làm việc theo track → `generateVideoPrompt.ts` / `batchGeneratePrompt.ts` tạo prompt theo track → `generateVideo.ts` / `batchGenerateVideo.ts` tạo ứng viên cho track → `selectVideo.ts` ghi riêng việc chọn dùng.

Các khiếm khuyết khi chạy của phiên bản cũ không thể làm yêu cầu tương đương đầu ra: agent bảng phân cảnh vẫn nối thêm chỉ thị XML, nhưng frontend đóng gói không xử lý `storyboardItem` trong callback XML, chuỗi ghi hiệu quả là công cụ có cấu trúc nói trên; giao diện video cũ sẽ kẹp thời lượng vào phạm vi của model, trạng thái tạo cũng có sự không nhất quán "tạo thành công/đã hoàn thành". Hiện tại bắt buộc phải ghi thực sự và đọc lại, xác nhận trước các tham số không tương thích, phân biệt tạo và chọn dùng. Các hành vi cũ như không có ảnh cha vẫn phát lệnh phái sinh, thiếu ảnh thì lọc bỏ tham chiếu mà không quay về ảnh cha cũng không được kế thừa.

Vì vậy "hợp đồng sản phẩm cốt lõi nhất quán" không có nghĩa là hành vi thao tác hoàn toàn giống nhau: skill này còn bổ sung rõ ràng lưu trữ ba loại canvas, xác nhận từng giai đoạn, tính toàn vẹn của ảnh cha/tham chiếu và nghiệm thu media, đồng thời giữ các điều chỉnh về phương pháp nội dung liệt kê ở cuối tài liệu. Khi báo cáo là tái hiện nghiêm ngặt, phải đồng thời liệt kê các khác biệt chuyển đổi này và những khâu chưa thực sự chạy.

## Kiến thức vốn phụ thuộc được hợp nhất thế nào

Phiên bản cũ không chỉ dựa vào các bước thực thi. Các nhóm kiến thức dưới đây đã được chuyển thành reference trong gói, các tệp giai đoạn yêu cầu đọc trước khi sáng tác thực tế; thư mục nguồn chỉ dùng để truy vết, khi thực thi không cần cài thêm skill cũ.

| Kiến thức trong gói | Nội dung thực chất | Nguồn kiến thức cũ |
| --- | --- | --- |
| [scriptCraft](knowledge/scriptCraft.md) | Nhân vật và mâu thuẫn, ba hồi/chia tập, mật độ cảm xúc/thông tin/tình tiết, kỳ vọng và đảo ngược, lựa chọn chuyển thể, kịch bản diễn được và thẩm định | Phần thân kiến thức của `script_execution_skeleton.md`, `script_execution_adaptation.md`, `script_execution_script.md`, `script_agent_supervision.md` |
| [narrativeGenres](knowledge/narrativeGenres.md) | Nhịp beat, giải phóng thông tin, diễn xuất, cỡ cảnh/chuyển động máy, âm thanh và ranh giới áp dụng của 12 loại tự sự | `data/skills/story_skills/{thể loại}/driector_skills/director_planning_narrative.md`, `director_storyboard_table_narrative.md`, 12 × 2 bản |
| [visualStyles](knowledge/visualStyles.md) | Hình dạng, phối màu, ánh sáng-bóng đổ, chất liệu, bố cục, biểu đạt cảm xúc và biểu hiện video của 11 phong cách vẽ | `data/skills/art_skills/{phong cách}/prefix.md` của từng phong cách, 3 bản kỹ thuật thị giác trong `driector_skills/`, `art_prompt/art_storyboard_video.md` |
| [assetDesign](knowledge/assetDesign.md) | Thiết kế có cấu trúc và prompt cho nhân vật/bối cảnh/đạo cụ, giữ danh tính theo tham chiếu, khác biệt cơ bản/phái sinh và nghiệm thu | `art_prompt/art_character.md`, `art_scene.md`, `art_prop.md` và các `_derivative.md` tương ứng của 11 phong cách, kết hợp prefix tương ứng |
| [shotCraft](knowledge/shotCraft.md) | Ngữ pháp shot tự sự, liên tục về không gian/trục nhìn/động tác, tách gộp shot, tính giờ lời thoại, chuyển cảnh và thẩm duyệt cụ thể | `data/skills/production_skills/storyboard_table_techniques.md`, các skill thực thi đạo diễn/bảng/bảng phân cảnh và `production_agent_supervision.md` |
| [imagePromptCraft](knowledge/imagePromptCraft.md) | Kho từ cỡ cảnh, ngữ nghĩa khung đầu, vị trí đứng/hướng/bề mặt phản chiếu, gắn tham chiếu, mẫu prompt Seedream và Nanobanana | `data/skills/production_skills/storyboard_prompt_techniques.md`, `production_execution_storyboard_panel.md`, kết hợp kỹ thuật thị giác đã chọn |
| [videoPromptCraft](knowledge/videoPromptCraft.md) | Cấu trúc động/shot/âm thanh/tham chiếu và mẫu model của các chế độ khung đầu, khung đầu và khung cuối, đa tham chiếu | Bốn tài liệu trong `data/modelPrompt/video/`: khung đầu-khung cuối chung, đa tham chiếu chung, Wan 2.6, Seedance 2, kết hợp `art_storyboard_video.md` của phong cách đã chọn |

Chuỗi nạp thực tế cũng đã được đối chiếu:

1. `src/agents/scriptAgent/index.ts` đọc riêng từng skill thực thi biên kịch; kiến thức nằm ngay trong phần thân tài liệu thực thi, không chỉ có mô tả công cụ theo giai đoạn.
2. `createArtSkills` của `src/agents/productionAgent/index.ts` theo `artStyle` và `directorManual` của dự án quét hai thư mục `driector_skills` thị giác và tự sự; `useProductionSkills` còn thêm `production_skills` chung vào giai đoạn bảng phân cảnh và bảng đặt phân cảnh.
3. `src/routes/assetsGenerate/polishAssetsPrompt.ts` chọn sổ tay cơ bản/phái sinh theo nhân vật/bối cảnh/đạo cụ và việc có tài sản cha hay không; `src/utils/getArtPrompt.ts` ghép `prefix.md` của phong cách với sổ tay đó.
4. Các route prompt video đơn lẻ và hàng loạt trước tiên chọn mẫu model/chế độ, rồi tiêm `getArtPrompt(artStyle, "art_skills", "art_storyboard_video")`, do đó prompt video cũng phải kế thừa phong cách mỹ thuật, không chỉ liệt kê lời thoại và thời lượng.

Thư mục nguồn của 12 loại là `Comedy_humor`, `Coming_of_age`, `Family_warmth`, `Historical_epic`, `Horror_supernatural`, `Hot_blooded_action`, `Mystery_thriller`, `Psychological_drama`, `Scifi_post_apocalypse`, `Sweet_romance_novel`, `Urban_workplace_drama`, `Xianxia_fantasy`.

Thư mục nguồn của 11 phong cách mỹ thuật là `2D_90s_japanese_anime`, `2D_chinese_guofeng`, `2D_flat_design`, `2D_mature_urban_romance`, `3D_anime_render`, `3D_chinese_traditional`, `3D_clay_stopmotion`, `3D_guofeng_cyber`, `realpeople_ancient_chinese`, `realpeople_modern_city`, `realpeople_urban_modern`. Mỗi phong cách đã đối chiếu prefix, 7 bản art_prompt và 3 bản kỹ thuật thị giác đạo diễn, tổng cộng 121 bản; hợp nhất theo phương pháp chung và ngoại lệ của phong cách, không yêu cầu nạp toàn bộ 121 bản gốc vào mỗi lượt sản xuất.

## Giữ lại và điều chỉnh

- **Giữ trách nhiệm của các giai đoạn.** Sự kiện theo chương → khung xương câu chuyện (gồm đề cương theo tập) → chiến lược chuyển thể → kịch bản từng tập; sản xuất là kế hoạch đạo diễn → phân tích phái sinh → tạo ảnh tùy chọn → bảng phân cảnh → đặt phân cảnh lên canvas → tạo ảnh có điều kiện, cuối cùng nối vào bàn làm việc video.
- **Xác nhận ở mỗi giai đoạn là yêu cầu của lần chuyển đổi này.** Phiên bản cũ chỉ một số giai đoạn có giám sát tự động, kịch bản có thể được tạo liên tục âm thầm. Ở đây thống nhất thành: thành quả đặt lên canvas, đọc lại kiểm tra, người dùng xác nhận; đầu vào và lô người dùng đã xác nhận thì không xác nhận lại.
- **Canvas thống nhất là ánh xạ lưu trữ mới.** planData, SQLite, XML văn bản kịch bản và việc ghi bảng phân cảnh có cấu trúc của phiên bản cũ đổi thành canvas kịch bản/tài sản/sản xuất từng tập. XML của bảng phân cảnh chỉ là phần sót lại do xung đột, không tuyên bố bản thân nó có thể ghi vào kho một cách đáng tin cậy; không giữ giao thức gọi cũ, cũng không yêu cầu môi trường hiện tại có subagent cùng tên.
- **Dùng trách nhiệm thực thi để hóa giải xung đột của phiên bản cũ.** Đạo diễn chỉ làm kế hoạch như chia cảnh; phân tích phái sinh đọc kịch bản và tài sản, không bắt buộc phụ thuộc vào "dự hoạch phái sinh" đã bị skill thực thi đạo diễn loại bỏ. Phân cảnh lấy "cảnh → đoạn → bảng bảy cột" của skill thực thi mới làm chuẩn, "nhóm" còn sót lại trong bảng đặt phân cảnh ánh xạ thành đoạn, không bịa thêm cột hướng độc lập.
- **Tham chiếu thực được ưu tiên.** Chuỗi sản xuất cũ không xử lý tài sản cơ bản bị thiếu; skill này có bước tài sản cơ bản độc lập, có thể quay về canvas tài sản để bổ sung và xác nhận, không bịa ID tài sản, cũng không ngầm dựng một kho tài sản khác trong một tập.
- **Giữ cách tính kế hoạch đoạn 15 giây và ước tính thời gian mặc định của v1.1.8.** Mặc định tiếp tục dùng 4 chữ/giây của tầng thực thi, ngắt nghỉ và dư lượng đầu cuối của tầng thẩm định; 3/2 chữ/giây của kỹ thuật chung là tùy chọn cho diễn xuất đã xác nhận, không âm thầm thay đổi độ dài shot và số lượng đoạn. Đồng thời tuân theo giới hạn ngắn hơn của model thực tế, khi không tương thích hoặc thay đổi cách tính thì xác nhận lại. Các con số như tốc độ nói chỉ là ước tính, không phải cam kết về khả năng khi chạy.
- **Nội dung đi trước mẫu thương mại.** Các thiên hướng phim ngắn thương mại cũ như chỉ cho phép khung dọc, nhịp trả phí cố định, mật độ "bàn tay vàng" (cheat) không bắt buộc áp dụng; giữ thể loại, tỉ lệ khung, câu chuyện và ranh giới chuyển thể người dùng đã xác nhận. Chữ trên màn hình gốc không tự ý đổi thành lồng tiếng thêm mới, đề xuất chuyển tiếp cần thiết phải xác nhận trước.
- **Giữ kiến thức, loại bỏ các kiểm soát thực thi đã mất hiệu lực.** Chỉ thị "không được nạp skill/không được đọc lại" của tài liệu cũ xung đột với kho kỹ thuật thực sự được tiêm vào và cơ chế đọc theo giai đoạn hiện tại, không kế thừa các giới hạn khi chạy này. Kiến thức về hướng, trục nhìn trong kỹ thuật shot được ánh xạ vào mô tả hình ảnh và chuyển động máy của bảng bảy cột, không vì cột cũ bị xóa mà xóa luôn nội dung chuyên môn.
- **Giải thích nhịp điệu theo thể loại.** Nhịp nhanh một tuyến và điểm nhấn thương mại được giữ làm phương pháp cho dự án phù hợp; hai tuyến/mảnh vụn của thanh xuân, quần tượng của sử thi, đời thường của gia đình, khoảng lặng thi vị của tiên hiệp cũng được giữ. Con số là cách tính theo kinh nghiệm của phiên bản cũ, không thay thế thời lượng thực tế của lời thoại, động tác và nhịp điệu người dùng đã xác nhận.
- **Phân biệt kiến thức thiết kế và phạm vi trích xuất tự động theo giai đoạn.** Thời tiết/góc độ/hư hại trong sổ tay bối cảnh, phương pháp phái sinh đạo cụ vẫn dùng được cho thiết kế người dùng nêu rõ; SOP sản xuất mặc định chỉ tự động trích xuất thay đổi tổng thể của nhân vật và thay đổi thời điểm trong ngày của bối cảnh, không vì thế mà xóa bỏ các kiến thức thiết kế khác đã tồn tại.
- **Tách riêng mẫu tài sản chung và khác biệt phong cách.** Bốn góc nhìn của nhân vật là phương án tư liệu nhận dạng thống nhất của skill này; `3D_guofeng_cyber/art_character.md` cũ thực ra là mẫu siêu cận cảnh khuôn mặt, không tuyên bố mọi phong cách vẽ cũ đều đã có cùng bốn góc nhìn. Màu da/chiều cao, yếu tố hiện đại/cổ đại của nhân vật theo danh tính và thế giới quan người dùng đã xác nhận, không được bị ví dụ của một prefix nào đó ghi đè.
- **Giữ tư liệu bốn hướng của bối cảnh cyberpunk phong cách cổ phong.** `art_prompt/art_scene.md:95–117,150–151` và `art_scene_derivative.md:124–129,173–174` của phong cách này yêu cầu thiết lập 2×2 trước/phải/sau/trái cùng một tâm điểm, áp dụng cho cả cơ bản và phái sinh; 10 phong cách vẽ còn lại là ảnh bối cảnh đơn. Tỉ lệ thực tế tuân theo model hiện tại, phái sinh giữ độ cao điểm nhìn của ảnh cha, không để mức cố định 1,6 mét của tài liệu phái sinh cũ ghi đè ảnh cha nhìn từ trên cao; bốn ô chỉ dùng cho tư liệu tài sản, không phải bố cục phân cảnh.
- **Mẫu prompt không đồng nghĩa với giao thức công cụ.** JSON tiếng Anh của ảnh, ký hiệu tham chiếu kiểu cũ của video thuộc mẫu nội dung lịch sử, được chuyển thành prompt node hiện tại và tham chiếu media thực; không coi trường của mẫu là cấu hình node, không coi giả định cũ về số ảnh, thời lượng video hay "không hỗ trợ động tác nào đó" là sự thật của model hiện tại.
- **Model do khả năng thực quyết định.** Prompt video cũ có các nhánh gắn model, Wan, Seedance, khung đầu-khung cuối chung và đa tham chiếu, không bắt buộc Seedance; không áp model mặc định của các workflow khác hiện tại.
- **Không bịa khả năng thành phim.** README cũ có nhắc đến ghép nối xuất file, nhưng đã đối chiếu các route sản xuất không đủ chứng minh có giao diện chung tương ứng; hiện tại chỉ ghép qua công cụ thực sự khả dụng, hoặc bàn giao trung thực các đoạn có thứ tự kèm danh sách.

## Nguồn của hợp đồng thực thi hiện tại

Dưới đây là căn cứ chuyển đổi của kho mã hiện tại khi tạo skill này, **không phải tệp của v1.1.8**; khi thực thi vẫn lấy schema thời gian thực của công cụ làm chuẩn:

- `packages/tools/canvas/src/runtime.ts`: tham số của các công cụ canvas, node, dây nối.
- `apps/web/src/pages/workspace/panels/canvas/useCanvasTools.ts`, `canvasHost.vue`, `components/canvasMenu.vue`: điều phối ngữ cảnh lượt này, chuyển canvas và thao tác cây tệp.
- `packages/tools/workspace/src/index.ts`: phạm vi công cụ tệp workspace tích hợp sẵn.
- `packages/nodes/videoGenerationNode/src/index.vue`: tra khả năng model hiện tại qua `getConfig` của node.
- `packages/nodes/textNode/src/index.vue`, `imageNode/src/index.vue`, `imageGenerationNode/src/index.vue`, `videoGenerationNode/src/index.vue`: các hàm công khai và đầu ra của node.
- `apps/server/src/agent/assets.ts`, `apps/server/src/utils/assets/index.ts`: nhập tài sản toàn cục và đường dẫn workspace.
- `apps/server/src/agent/skills/index.ts`, `apps/server/src/utils/skills/files.ts`: hợp đồng đọc, tạo mới và chỉnh sửa skill.

Skill giữ thư mục hiện tại và tên frontmatter `v118workflow`, mọi kiến thức đều nằm trong `references/knowledge/` của gói này, không phụ thuộc vào một gói skill cũ khác đã cài.
