import { shallowReactive, type VNodeChild } from "vue";
import { translate } from "@toonflow/i18n/vue";

// ACT: 保留 ElMessageBox 的 Promise 约定以便逐处替换：确认时 resolve，取消/关闭时 reject "cancel" | "close"。
export type MessageBoxAction = "confirm" | "cancel" | "close";
export type MessageBoxContent = string | ((controls: { cancel: () => void }) => VNodeChild);

export interface MessageBoxOptions {
  type?: "success" | "info" | "warning" | "error";
  confirmButtonText?: string;
  cancelButtonText?: string;
  closeOnClickModal?: boolean;
  autofocus?: boolean;
  inputValue?: string;
  inputPlaceholder?: string;
  inputPattern?: RegExp;
  inputErrorMessage?: string;
  inputValidator?: (value: string) => boolean | string;
}

export interface MessageBoxRequest {
  id: number;
  kind: "alert" | "confirm" | "prompt";
  title: string;
  content: MessageBoxContent;
  options: MessageBoxOptions;
  settle: (action: MessageBoxAction, value?: string) => void;
}

export const messageBoxQueue = shallowReactive<MessageBoxRequest[]>([]);
let nextId = 0;

function open<T>(kind: MessageBoxRequest["kind"], content: MessageBoxContent, title: string, options: MessageBoxOptions, result: (value: string) => T) {
  return new Promise<T>((resolve, reject) => {
    const request: MessageBoxRequest = {
      id: ++nextId, kind, title, content, options,
      settle(action, value = "") {
        const index = messageBoxQueue.indexOf(request);
        if (index < 0) return;
        messageBoxQueue.splice(index, 1);
        if (action === "confirm") resolve(result(value));
        else reject(action);
      },
    };
    messageBoxQueue.push(request);
  });
}

/** 返回 null 表示通过；否则返回需要显示的错误文本。 */
export function validatePrompt(value: string, options: MessageBoxOptions) {
  if (options.inputPattern && !options.inputPattern.test(value)) return options.inputErrorMessage || translate("输入的内容无效");
  const verdict = options.inputValidator?.(value) ?? true;
  if (verdict === true) return null;
  return typeof verdict === "string" ? verdict : options.inputErrorMessage || translate("输入的内容无效");
}

const messageBox = {
  alert: (content: MessageBoxContent, title = "", options: MessageBoxOptions = {}) => open("alert", content, title, options, () => "confirm" as const),
  confirm: (content: MessageBoxContent, title = "", options: MessageBoxOptions = {}) => open("confirm", content, title, options, () => "confirm" as const),
  prompt: (content: MessageBoxContent, title = "", options: MessageBoxOptions = {}) => open("prompt", content, title, options, value => ({ value, action: "confirm" as const })),
  /** 关闭所有弹框，等价于用户点击关闭。 */
  close: () => { for (const request of [...messageBoxQueue]) request.settle("close"); },
};

export default messageBox;
