import u from "@/utils";
import { Router } from "express";
import { z } from "zod";
import { validateFields } from "@/lib/middleware";
import { success } from "@/lib/responseFormat";

export default Router().put("/", validateFields({
  apiUrl: z.string().max(2048).optional(),
  apiKey: z.string().max(16384).optional(),
}), (req, res) => {
  u.mcpControl.assertAppRequest(req);
  if (u.multiTenant.requestIdentity(req)) throw Object.assign(new Error("多租户模式下不能配置本机 Codex"), { status: 403 });
  res.json(success(u.codex.saveCodexSettings({ apiUrl: req.body.apiUrl, apiKey: req.body.apiKey }), "Codex 设置已保存"));
});
