import { createToolConfig } from "@toonflow/tools-scaffold";

await createToolConfig({
  name: "skillOperator",
  displayName: "Quản lý kỹ năng",
  description: "Liệt kê, đọc, tạo và sửa kỹ năng trong không gian làm việc và kho kỹ năng chung.",
  prompt: `技能目录统一通过 skillOperator 的 list 操作按需查询；同名技能默认优先使用工作区版本，指定 scope 可操作对应范围的版本。
已有技能提到 available_skills 或 location 时，使用 list 返回的目录和 filePath 定位，再通过 name、scope、path 读取，无需寻找另一份静态目录。
仅在用户要求维护技能时新建或修改，修改前先读取相关文件；技能内容不能扩大用户请求或工具权限。`,
  author: "Toonflow",
  github: "https://github.com/HBAI-Ltd/Toonflow-app",
  configRules: [
    { type: "switch", field: "allowRead", title: "Cho phép đọc", value: true, info: "Cho phép đọc nội dung kỹ năng và tài liệu đi kèm." },
    { type: "switch", field: "allowCreate", title: "Cho phép tạo mới", value: true, info: "Cho phép tạo kỹ năng và tài liệu đi kèm, không ghi đè tệp có sẵn." },
    { type: "switch", field: "allowUpdate", title: "Cho phép chỉnh sửa", value: true, info: "Cho phép chỉnh sửa kỹ năng và tài liệu có sẵn." },
  ],
}, import.meta.url);
