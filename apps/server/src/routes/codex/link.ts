import u from "@/utils";
import { Router } from "express";
import { success } from "@/lib/responseFormat";

export default Router().post("/", (req, res) => {
  u.mcpControl.assertAppRequest(req);
  if (u.multiTenant.requestIdentity(req)) throw Object.assign(new Error("多租户模式下不能链接本机 Codex"), { status: 403 });
  res.json(success(u.codex.linkCodex()));
});
