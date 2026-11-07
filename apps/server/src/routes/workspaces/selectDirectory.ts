import { Router } from "express";
import { execFile } from "node:child_process";
import { join } from "node:path";
import { promisify } from "node:util";
import { realpath } from "@toonflow/file";
import u from "@/utils";
import { error, success } from "@/lib/responseFormat";
import { getRuntimePlatform } from "@/lib/platform";

const router = Router();
const runFile = promisify(execFile);

export default router.post("/", async (req, res) => {
  const native = getRuntimePlatform().nativeDevelopment && u.workspace.isLocalHostRequest(req);
  res.set("Cache-Control", "no-store");
  if (!native) return res.json(success({ native: false, directory: null }));

  if (!u.workspace.isLocalWorkspaceRequest(req)) {
    return res.status(403).json(error("仅允许本机开发页面选择目录", null, 403));
  }

  const windowsScript = `
$ErrorActionPreference = "Stop"
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false)
Add-Type -AssemblyName System.Windows.Forms
[System.Windows.Forms.Application]::EnableVisualStyles()
$dialog = [System.Windows.Forms.FolderBrowserDialog]::new()
$dialog.Description = "选择工作目录"
$owner = [System.Windows.Forms.Form]::new()
$owner.ShowInTaskbar = $false
$owner.Opacity = 0
try {
  # ACT: 隐形父窗口先显示，系统目录弹窗才能继承置顶状态。
  $owner.Show()
  $owner.TopMost = $true
  $owner.Activate()
  if ($dialog.ShowDialog($owner) -eq [System.Windows.Forms.DialogResult]::OK) { [Console]::Write($dialog.SelectedPath) }
} finally { $dialog.Dispose(); $owner.Dispose() }
`;
  const macScript = `try
  return POSIX path of (choose folder with prompt "选择工作目录")
on error number -128
  return ""
end try`;
  // ACT: 启动环境的 PATH 可能不含 System32（如由开发工具启动），用系统目录下的绝对路径调用 PowerShell。
  const powershell = join(process.env.SystemRoot || "C:\\Windows", "System32", "WindowsPowerShell", "v1.0", "powershell.exe");
  try {
    const { stdout } = process.platform === "win32"
      ? await runFile(powershell, ["-NoProfile", "-NonInteractive", "-STA", "-Command", windowsScript], { windowsHide: true })
      : process.platform === "linux"
        // zenity exits with code 1 when the dialog is cancelled.
        ? await runFile("zenity", ["--file-selection", "--directory", "--title", "选择工作目录"]).catch((cause: { code?: unknown }) => {
          if (cause.code === 1) return { stdout: "" };
          throw cause;
        })
        : await runFile("/usr/bin/osascript", ["-e", macScript]);
    const selected = stdout.replace(/\r?\n$/, "");
    const directory = selected ? await realpath(selected) : null;
    res.json(success({ native: true, directory }));
  } catch (cause) {
    console.error("打开本机文件夹选择器失败：", cause);
    res.status(500).json(error("无法打开本机文件夹选择器，请重试", null, 500));
  }
});
