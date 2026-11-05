import u from "@/utils";
import { Router } from "express";
import { success } from "@/lib/responseFormat";

export default Router().post("/", (req, res) => {
  u.mcpControl.assertAppRequest(req);
  res.json(success(u.codex.unlinkCodex(), "已取消链接 Codex"));
});
