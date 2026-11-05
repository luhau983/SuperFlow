import { homedir } from "node:os";
import { join } from "node:path";
import { readFileSync } from "@toonflow/file";
import { isEnabled } from "@/utils/multiTenant/mode";
import { t } from "@/lib/i18n";
import conf from "@/utils/conf";

let loginCache: { at: number; loggedIn: boolean; email: string } | undefined;
let loginProcess: ReturnType<typeof Bun.spawn> | undefined;
let loginUrl = "";
let cachedToken: { token: string; expiresAt: number } | undefined;
let pendingToken: Promise<string> | undefined;

export function codexHome() {
  return process.env.CODEX_HOME?.trim() || join(homedir(), ".codex");
}

export function codexExecutable() {
  return Bun.which("codex");
}

function readLogin() {
  try {
    const auth = JSON.parse(readFileSync(join(codexHome(), "auth.json"), "utf8")) as { auth_mode?: unknown; tokens?: { id_token?: unknown } };
    if (auth.auth_mode !== "chatgpt") return { loggedIn: false, email: "" };
    const idToken = typeof auth.tokens?.id_token === "string" ? auth.tokens.id_token : "";
    const claims = JSON.parse(Buffer.from(idToken.split(".")[1] ?? "", "base64url").toString("utf8") || "{}") as { email?: unknown };
    return { loggedIn: true, email: typeof claims.email === "string" ? claims.email : "" };
  } catch {
    return { loggedIn: false, email: "" };
  }
}

function login() {
  // ACT: 列表接口频繁调用，10 秒内复用检测结果；登录状态变化最多延迟 10 秒生效，登录流程结束时主动清除缓存。
  if (!loginCache || Date.now() - loginCache.at > 10_000) loginCache = { at: Date.now(), ...readLogin() };
  return loginCache;
}

export const defaultCodexApiUrl = "https://chatgpt.com/backend-api";

export function codexSettings() {
  const value = conf.get("codex", {});
  return {
    linked: value.linked === true,
    apiUrl: typeof value.apiUrl === "string" && value.apiUrl.trim() ? value.apiUrl.trim() : defaultCodexApiUrl,
    apiKey: typeof value.apiKey === "string" ? value.apiKey.trim() : "",
  };
}

function updateSettings(patch: { linked?: boolean; apiUrl?: string; apiKey?: string }) {
  conf.set("codex", { ...conf.get("codex", {}), ...patch });
  cachedToken = undefined;
}

/** 文本模型：用户主动链接后，使用自定义访问令牌，或本机 Codex 的 ChatGPT 登录。 */
export function codexTextAvailable() {
  const settings = codexSettings();
  return !isEnabled() && settings.linked && (!!settings.apiKey || (!!codexExecutable() && login().loggedIn));
}

/** 图片生成依赖本机 codex exec，只在链接且本机 Codex 已登录时可用。 */
export function codexImageAvailable() {
  return !isEnabled() && codexSettings().linked && !!codexExecutable() && login().loggedIn;
}

export function requireCodexImage() {
  if (!codexImageAvailable()) {
    throw Object.assign(new Error("Codex 图片生成需要链接本机 Codex，请在设置的语言模型中链接 Codex"), { status: 400 });
  }
}

export function codexStatus() {
  const current = login();
  const settings = codexSettings();
  return {
    supported: !isEnabled(),
    installed: !!codexExecutable(),
    loggedIn: current.loggedIn,
    email: current.email,
    linked: settings.linked,
    loggingIn: !!loginProcess,
    loginUrl,
    apiUrl: settings.apiUrl,
    defaultApiUrl: defaultCodexApiUrl,
    hasApiKey: !!settings.apiKey,
  };
}

function accountId(token: string) {
  try {
    const claims = JSON.parse(Buffer.from(token.split(".")[1] ?? "", "base64url").toString("utf8")) as Record<string, { chatgpt_account_id?: unknown } | undefined>;
    return typeof claims["https://api.openai.com/auth"]?.chatgpt_account_id === "string";
  } catch {
    return false;
  }
}

/** 保存自定义地址与访问令牌；apiKey 为 undefined 时保留原值，空字符串表示清除。 */
export function saveCodexSettings(input: { apiUrl?: string; apiKey?: string }) {
  if (isEnabled()) throw Object.assign(new Error("多租户模式下不能配置本机 Codex"), { status: 403 });
  const apiUrl = input.apiUrl?.trim() ?? "";
  if (apiUrl) {
    let url: URL;
    try { url = new URL(apiUrl); } catch { throw Object.assign(new Error("Codex 地址必须是有效的 HTTP(S) 地址"), { status: 400 }); }
    if (!/^https?:$/.test(url.protocol) || url.username || url.password) throw Object.assign(new Error("Codex 地址必须是有效的 HTTP(S) 地址"), { status: 400 });
  }
  const apiKey = input.apiKey?.trim();
  if (apiKey && !accountId(apiKey)) {
    throw Object.assign(new Error("访问令牌必须是包含 ChatGPT 账号信息的 Codex 访问令牌（JWT）"), { status: 400 });
  }
  updateSettings({ apiUrl: apiUrl && apiUrl !== defaultCodexApiUrl ? apiUrl : undefined, ...(apiKey === undefined ? {} : { apiKey: apiKey || undefined }) });
  return codexStatus();
}

/** 用户主动链接：已配置访问令牌或本机已登录时直接链接；否则启动 codex login，由 Codex 打开浏览器完成 ChatGPT 授权。 */
export function linkCodex() {
  if (isEnabled()) throw Object.assign(new Error("多租户模式下不能链接本机 Codex"), { status: 403 });
  loginCache = undefined;
  if (codexSettings().apiKey || login().loggedIn) {
    updateSettings({ linked: true });
    return codexStatus();
  }
  const executable = codexExecutable();
  if (!executable) throw Object.assign(new Error("未找到 codex 命令，请先安装 Codex CLI，或填写访问令牌"), { status: 400 });
  if (!loginProcess) {
    const child = Bun.spawn([executable, "login"], { stdin: "ignore", stdout: "pipe", stderr: "pipe", windowsHide: true });
    loginProcess = child;
    loginUrl = "";
    // ACT: 授权最长等待 10 分钟，超时结束登录进程，用户可重新点击链接。
    const timer = setTimeout(() => child.kill(), 10 * 60_000);
    const readUrl = async (stream: ReadableStream<Uint8Array>) => {
      const decoder = new TextDecoder();
      for await (const chunk of stream) {
        loginUrl ||= decoder.decode(chunk, { stream: true }).match(/https:\/\/auth\.openai\.com\/\S+/)?.[0] ?? "";
      }
    };
    void Promise.all([readUrl(child.stdout), readUrl(child.stderr)]).catch(() => {});
    void child.exited.then(() => {
      clearTimeout(timer);
      if (loginProcess !== child) return;
      loginProcess = undefined;
      loginUrl = "";
      loginCache = undefined;
      if (login().loggedIn) updateSettings({ linked: true });
    });
  }
  return codexStatus();
}

/** 只断开 SuperFlow 与 Codex 的链接，不注销 Codex CLI 自身的登录。 */
export function unlinkCodex() {
  updateSettings({ linked: false });
  const child = loginProcess;
  loginProcess = undefined;
  loginUrl = "";
  child?.kill();
  return codexStatus();
}

function tokenExpiresAt(token: string) {
  try {
    const payload = JSON.parse(Buffer.from(token.split(".")[1] ?? "", "base64url").toString("utf8")) as { exp?: unknown };
    return typeof payload.exp === "number" ? payload.exp * 1000 : 0;
  } catch {
    return 0;
  }
}

/** 通过 codex app-server 的 getAuthStatus 读取并按需刷新 ChatGPT 令牌，凭据文件的读写始终由 Codex 自身负责。 */
async function requestToken() {
  const executable = codexExecutable();
  if (!executable) throw Object.assign(new Error("未找到 codex 命令，请先安装 Codex CLI"), { status: 400 });
  const child = Bun.spawn([executable, "app-server"], { stdin: "pipe", stdout: "pipe", stderr: "ignore", windowsHide: true });
  const send = (message: unknown) => {
    child.stdin.write(`${JSON.stringify(message)}\n`);
    child.stdin.flush();
  };
  const timer = setTimeout(() => child.kill(), 30_000);
  try {
    send({ id: 1, method: "initialize", params: { clientInfo: { name: "superflow", title: "SuperFlow", version: "1.0.0" }, capabilities: null } });
    const decoder = new TextDecoder();
    let buffer = "";
    for await (const chunk of child.stdout) {
      buffer += decoder.decode(chunk, { stream: true });
      for (let index = buffer.indexOf("\n"); index >= 0; index = buffer.indexOf("\n")) {
        const line = buffer.slice(0, index).trim();
        buffer = buffer.slice(index + 1);
        if (!line) continue;
        const message = JSON.parse(line) as { id?: unknown; result?: { authMethod?: unknown; authToken?: unknown }; error?: { message?: unknown } };
        if (message.id === 1) {
          if (message.error) throw new Error(t`Codex app-server 初始化失败：${String(message.error.message ?? "")}`);
          send({ method: "initialized" });
          send({ id: 2, method: "getAuthStatus", params: { includeToken: true, refreshToken: true } });
        } else if (message.id === 2) {
          const token = message.result?.authToken;
          if (message.error || message.result?.authMethod !== "chatgpt" || typeof token !== "string" || !token) {
            throw Object.assign(new Error("Codex 未以 ChatGPT 账号登录，请执行 codex login 后重试"), { status: 401 });
          }
          return token;
        }
      }
    }
    throw new Error("Codex app-server 未返回登录状态，请确认 Codex CLI 可以正常运行");
  } finally {
    clearTimeout(timer);
    child.kill();
  }
}

export async function getCodexToken() {
  if (!codexTextAvailable()) throw Object.assign(new Error("Codex 未链接，请在设置的语言模型中链接 Codex"), { status: 400 });
  const { apiKey } = codexSettings();
  if (apiKey) return apiKey;
  // 提前 5 分钟刷新，避免长时间生成过程中令牌过期。
  if (cachedToken && cachedToken.expiresAt - Date.now() > 5 * 60_000) return cachedToken.token;
  pendingToken ??= requestToken().then(token => {
    cachedToken = { token, expiresAt: tokenExpiresAt(token) };
    return token;
  }).finally(() => { pendingToken = undefined; });
  return pendingToken;
}
