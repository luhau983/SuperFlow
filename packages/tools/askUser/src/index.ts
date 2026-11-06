import { z } from "zod";
import type { ToolPlugin } from "@toonflow/tools-scaffold/runtime";

const optionsSchema = z.array(z.string().trim().min(1).max(300)).max(20)
  .refine(options => new Set(options).size === options.length, "Các lựa chọn không được trùng nhau");

const fieldSchema = z.object({
  field: z.string().regex(/^[a-zA-Z][a-zA-Z0-9]{0,63}$/)
    .refine(field => !["constructor", "prototype", "__proto__"].includes(field), "Tên trường không hợp lệ")
    .describe("唯一的小驼峰字段名，例如 duckRef；仅英文字母和数字，不能包含下划线或短横线"),
  title: z.string().trim().min(1).max(200),
  type: z.enum(["input", "textarea", "radio", "checkbox", "select", "inputNumber", "switch"]),
  required: z.boolean().optional(),
  options: optionsSchema.optional().describe("radio、checkbox、select 类型必须提供非空选项"),
  placeholder: z.string().trim().max(300).optional(),
}).refine(field => !["radio", "checkbox", "select"].includes(field.type) || !!field.options?.length,
  "Trường lựa chọn phải có các lựa chọn");

const questionSchema = z.object({
  title: z.string().trim().min(1).max(100).describe("提问卡片标题，简要概括本次需要确认的内容"),
  question: z.string().trim().min(1).max(4000).describe("必填：问题或整组问题的说明；使用 fields 时也必须提供"),
  options: optionsSchema.max(8).optional(),
  fields: z.array(fieldSchema).max(12)
    .refine(fields => new Set(fields.map(field => field.field)).size === fields.length, "Tên trường không được trùng").optional()
    .describe("多个问题，每项一个问题；提供非空 fields 时不能同时提供顶层 options"),
}).refine(request => !request.fields?.length || request.options === undefined, "Biểu mẫu động không được đồng thời có lựa chọn ở cấp cao nhất");

const plugin: ToolPlugin = {
  validateConfig(config) {
    if (Object.keys(config).length) throw new Error("Công cụ hỏi người dùng không có cấu hình");
    return {};
  },
  createTools({ question }) {
    if (!question) return [];
    return [{
      name: "askUser",
      label: "Hỏi người dùng",
      description: "需要用户补充信息或作出选择时调用。单个选择题使用 options，多个问题使用 fields。结果包含 answer，多问题还包含 values；用户跳过整组提问时返回 skipped: true。",
      promptSnippet: "一次询问一个或多个问题；用户可以回答或跳过，跳过不代表阶段确认通过。",
      parameters: z.toJSONSchema(questionSchema, { io: "input", target: "draft-07" }),
      executionMode: "sequential",
      async execute(id, params, signal) {
        const result = await question.ask(id, questionSchema.parse(params), signal);
        return { content: [{ type: "text", text: JSON.stringify(result) }], details: result };
      },
    }];
  },
};

export default plugin;
