// import { Toonflow } from "./toonflow";
import type { Channel } from "./types";

// ACT: 暂停 Toonflow 云服务注册，原实现保留供恢复。
// const channels = new Map<string, Channel>([["toonflow", new Toonflow()]]);
const channels = new Map<string, Channel>();

export function getChannel(): Channel {
  const source = channels.get(process.env.TOONFLOW_CHANNEL?.trim() || "toonflow");
  if (!source) throw Object.assign(new Error("Dịch vụ cloud Toonflow hiện đã tắt."), { status: 503 });
  return source;
}
