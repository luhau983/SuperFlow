import { z } from "zod";

const requestSchema = z.object({
  action: z.enum(["list", "read", "create", "update", "mkdir", "move", "delete", "import"]),
  path: z.string().max(4096).optional().describe("全局素材库内的相对路径。list 可省略或为空以查询根目录；其他操作必填"),
  query: z.string().max(500).optional().describe("list 可选：在 path 下递归按名称或路径筛选文件；省略时只列出当前目录"),
  cursor: z.string().max(1024).optional().describe("list 可选：使用上次返回的 nextCursor 继续读取，不自行构造"),
  offset: z.number().int().min(1).optional().describe("read 可选：文本起始行号，从 1 开始"),
  limit: z.number().int().min(1).max(2000).optional().describe("list 每页最多 50 项；read 每次最多 2000 行"),
  content: z.string().max(200000).optional().describe("create/update 的完整文本内容，与 sourcePath 二选一；不能用于写入伪造的 Base64 媒体"),
  sourcePath: z.string().min(1).max(4096).optional().describe("create/update 的来源文件，必须是当前工作区内真实存在的相对路径，文件最多 100 MB，与 content 二选一"),
  revision: z.string().regex(/^[a-f\d]{64}$/i).optional().describe("update 必填：最近一次 read 返回的 SHA-256 revision，防止覆盖已变化的素材"),
  target: z.string().min(1).max(4096).optional().describe("move 必填：全局素材库内的目标相对路径；import 可选：当前工作区内的目标相对路径，省略时生成唯一新文件"),
}).strict();

const actionFields: Record<z.infer<typeof requestSchema>["action"], readonly string[]> = {
  list: ["path", "query", "cursor", "limit"],
  read: ["path", "offset", "limit"],
  create: ["path", "content", "sourcePath"],
  update: ["path", "content", "sourcePath", "revision"],
  mkdir: ["path"],
  move: ["path", "target"],
  delete: ["path"],
  import: ["path", "target"],
};

export const assetRequestSchema = requestSchema.superRefine((request, context) => {
  for (const [field, value] of Object.entries(request)) {
    if (field !== "action" && value !== undefined && !actionFields[request.action].includes(field)) {
      context.addIssue({ code: "custom", path: [field], message: `${request.action} Không chấp nhận ${field}` });
    }
  }
  if (request.action !== "list" && !request.path?.trim()) {
    context.addIssue({ code: "custom", path: ["path"], message: `${request.action} Phải cung cấp đường dẫn tài nguyên path` });
  }
  if (request.action === "list" && request.limit !== undefined && request.limit > 50) {
    context.addIssue({ code: "custom", path: ["limit"], message: "list Mỗi trang tối đa 50 mục" });
  }
  if ((request.action === "create" || request.action === "update") && (request.content !== undefined) === (request.sourcePath !== undefined)) {
    context.addIssue({ code: "custom", path: ["content"], message: "content và sourcePath phải cung cấp đúng một trường" });
  }
  if (request.action === "update" && !request.revision) {
    context.addIssue({ code: "custom", path: ["revision"], message: "Phải gọi read trước khi sửa và cung cấp revision được trả về" });
  }
  if (request.action === "move" && !request.target?.trim()) {
    context.addIssue({ code: "custom", path: ["target"], message: "move Phải cung cấp đường dẫn đích target" });
  }
});

export type AssetRequest = z.infer<typeof assetRequestSchema>;
