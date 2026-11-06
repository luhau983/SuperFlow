import { createToolConfig } from "@toonflow/tools-scaffold";

await createToolConfig({
  name: "workspace",
  displayName: "Tệp không gian làm việc",
  description: "Đọc, liệt kê và sửa tệp trong không gian làm việc, tìm nội dung và tệp, tải ảnh từ xa vào không gian làm việc.",
  prompt: `路径相对于当前工作区解析。文件修改不得越出工作区；全局技能目录只允许读取技能及其附带资料。
grep 搜索文件内容、find 查找文件，范围严格限定在当前工作区，不搜索全局技能目录。
修改已有文件前先读取相关内容，避免覆盖用户已有修改。
存在与任务匹配的可用技能时，先阅读技能目录中的 SKILL.md，再按需读取其引用的本地资料；不要一次加载全部技能，也不要只凭名称猜测技能内容。`,
  author: "Toonflow",
  github: "https://github.com/HBAI-Ltd/Toonflow-app",
  configRules: [
    { type: "switch", field: "readOnly", title: "Chế độ chỉ đọc", value: false, info: "Khi bật, chỉ được đọc tệp, liệt kê thư mục và tìm kiếm trong không gian làm việc." },
  ],
}, import.meta.url);
