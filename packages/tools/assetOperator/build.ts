import { createToolConfig } from "@toonflow/tools-scaffold";

await createToolConfig({
  name: "assetOperator",
  displayName: "Quản lý tài nguyên chung",
  description: "Tìm, đọc và quản lý thư viện tài nguyên chung, nhập tài nguyên vào không gian làm việc hoặc lưu trữ kết quả đã tạo.",
  prompt: `全局素材库通过 assetOperator 查询和管理，与当前工作区的 assets 文件夹不同。
先查询和读取相关素材，再按用户要求维护；沿用当前会话已有授权，只有删除或覆盖不在授权范围内时才询问。
将工作区生成结果入库时使用 sourcePath；全局素材用于画布或生成参考前先 import 到当前工作区，使用返回的真实路径。`,
  author: "Toonflow",
  github: "https://github.com/HBAI-Ltd/Toonflow-app",
  configRules: [
    { type: "switch", field: "readOnly", title: "Chế độ chỉ đọc", value: false, info: "Khi bật, không thể sửa thư viện tài nguyên chung; vẫn có thể tìm, đọc và sao chép tài nguyên vào không gian làm việc hiện tại." },
  ],
}, import.meta.url);
