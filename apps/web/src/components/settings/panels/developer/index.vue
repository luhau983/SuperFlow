<template>
  <div class="developerPanel">
    <div class="developer" :class="{ blurred: developerLocked }" :inert="developerLocked">
      <div class="developerRow">
        <div class="toolDescription">
          <h3>开发者工具</h3>
          <p>查看页面结构、控制台与网络请求。</p>
        </div>
        <uiButton :disabled="opening || !actualPlatform.isDesktop" @click="openDevTools"><icon-loader-2 v-if="opening" class="animate-spin" aria-hidden="true" /><icon-terminal-2 v-else aria-hidden="true" />打开 DevTools</uiButton>
      </div>
      <p v-if="!actualPlatform.isDesktop" class="infoText">浏览器模式请从浏览器菜单打开开发者工具。</p>
      <p v-if="requestError" class="errorText" role="alert">{{ requestError }}</p>
      <div class="developerRow">
        <div class="toolDescription">
          <h3>模拟平台</h3>
          <p>切换会重新加载当前页面。仅模拟前端分支，原生能力与服务端权限仍以实际环境为准。</p>
        </div>
        <uiSelect :modelValue="platformSimulation" @update:modelValue="changePlatformSimulation">
          <uiSelectTrigger class="platformSelect" aria-label="模拟平台">
            <uiSelectValue />
          </uiSelectTrigger>
          <uiSelectContent>
            <uiSelectItem value="actual">实际平台</uiSelectItem>
            <uiSelectItem value="browser">浏览器</uiSelectItem>
            <uiSelectItem value="windowsDesktop">Windows 桌面</uiSelectItem>
            <uiSelectItem value="macDesktop">macOS 桌面</uiSelectItem>
            <uiSelectItem value="mobile">移动端</uiSelectItem>
          </uiSelectContent>
        </uiSelect>
      </div>
      <div class="developerRow">
        <div class="toolDescription">
          <h3>首次使用引导</h3>
          <p>当前{{ hello.completed ? '已完成' : '未完成' }}。重置后打开引导页，保留已配置的模型。</p>
        </div>
        <uiButton variant="outline" :disabled="resettingHello || importingStorage || writingStorage" @click="resetHello"><icon-loader-2 v-if="resettingHello" class="animate-spin" aria-hidden="true" /><icon-refresh v-else aria-hidden="true" />重置并打开引导页</uiButton>
      </div>
      <div class="developerRow">
        <div class="toolDescription">
          <h3>更新说明</h3>
          <p>打开当前版本的更新说明弹窗。</p>
        </div>
        <uiButton variant="outline" :disabled="openingUpdateBox" @click="openUpdateBox"><icon-loader-2 v-if="openingUpdateBox" class="animate-spin" aria-hidden="true" /><icon-file-text v-else aria-hidden="true" />查看更新说明</uiButton>
      </div>
      <div class="developerRow">
        <div class="toolDescription">
          <h3>供应商开发工具</h3>
          <p>授权读取本地供应商文件，调试生成接口与媒体结果。</p>
        </div>
        <uiButton variant="outline" @click="providerDebugVisible = true"><icon-code aria-hidden="true" />开发供应商</uiButton>
      </div>
      <div class="developerRow">
        <div class="toolDescription">
          <h3>Agent 系统提示词</h3>
          <p>编辑 Agent 的基础指令，保存后下一条消息生效。</p>
        </div>
        <uiButton variant="outline" @click="systemPromptVisible = true"><icon-edit aria-hidden="true" />编辑提示词</uiButton>
      </div>
      <div v-if="!isRemoteConnection" class="developerRow">
        <div class="toolDescription">
          <h3>自定义更新源</h3>
          <p>填写更新清单和安装包所在的目录地址，保存后可在关于页选择。</p>
        </div>
        <div class="updateSourceEditor">
          <div class="clearableInput">
            <uiInput
              v-model="customUpdateUrl"
              placeholder="https://example.com/desktopUpdates"
              aria-label="自定义更新源目录地址"
              :disabled="savingUpdateUrl"
              @keyup.enter="saveCustomUpdateUrl" />
            <button v-if="customUpdateUrl && !savingUpdateUrl" class="clearButton" type="button" aria-label="清除" @click="customUpdateUrl = ''">
              <icon-circle-x aria-hidden="true" />
            </button>
          </div>
          <uiButton :disabled="savingUpdateUrl" @click="saveCustomUpdateUrl"><icon-loader-2 v-if="savingUpdateUrl" class="animate-spin" aria-hidden="true" />保存</uiButton>
        </div>
      </div>
      <p v-if="!isRemoteConnection && updateUrlError" class="errorText" role="alert">{{ updateUrlError }}</p>
      <div v-if="!isRemoteConnection" class="pluginInstaller">
        <div class="installerHeader">
          <h3>手动安装插件</h3>
          <uiSelect v-model="installType" :disabled="!!installing">
            <uiSelectTrigger class="typeSelect" aria-label="安装插件类型">
              <uiSelectValue />
            </uiSelectTrigger>
            <uiSelectContent>
              <uiSelectItem v-for="(item, type) in installTypes" :key="type" :value="type">{{ item.label }}</uiSelectItem>
              <uiSelectItem value="agent" disabled>Agent（暂未开放）</uiSelectItem>
            </uiSelectContent>
          </uiSelect>
        </div>
        <div class="toolDescription">
          <p>{{ selectedInstaller.description }}支持本地文件或文件直链，安装后可在插件市场查看。</p>
        </div>
        <div class="checkboxField">
          <uiCheckbox id="developerForceInstall" v-model="forceInstall" :disabled="!!installing" />
          <uiLabel for="developerForceInstall">强制安装（允许覆盖同版本或降级）</uiLabel>
        </div>
        <input ref="fileInput" class="fileInput" type="file" :accept="selectedInstaller.accept" @change="installFile" />
        <uiButton variant="outline" :disabled="!!installing" @click="fileInput?.click()"><icon-loader-2 v-if="installing === 'file'" class="animate-spin" aria-hidden="true" /><icon-file-upload v-else aria-hidden="true" />选择本地{{ selectedInstaller.label }}文件</uiButton>
        <div class="urlInstaller">
          <div class="clearableInput">
            <uiInput
              v-model="pluginUrl"
              :disabled="!!installing"
              :placeholder="`https://example.com/${selectedInstaller.example}`"
              :aria-label="`${selectedInstaller.label}文件地址`"
              @keyup.enter="installUrl" />
            <button v-if="pluginUrl && !installing" class="clearButton" type="button" aria-label="清除" @click="pluginUrl = ''">
              <icon-circle-x aria-hidden="true" />
            </button>
          </div>
          <uiButton :disabled="!!installing || !pluginUrl.trim()" @click="installUrl"><icon-loader-2 v-if="installing === 'url'" class="animate-spin" aria-hidden="true" /><icon-download v-else aria-hidden="true" />从 URL 安装</uiButton>
        </div>
        <p v-if="installError" class="errorText" role="alert">{{ installError }}</p>
        <p v-else-if="installedName" class="successText" role="status">{{ installedName }}已安装</p>
      </div>
      <div class="storageManager">
        <div class="developerRow">
          <div class="toolDescription">
            <h3>浏览器持久缓存</h3>
            <p>管理当前站点的 localStorage。修改重新加载后生效；首次使用引导请通过上方按钮重置。导入会覆盖同名项，保留其他项。</p>
          </div>
          <div class="storageToolbar">
            <input ref="storageFileInput" type="file" accept=".json,application/json" hidden @change="importStorage" />
            <uiButton variant="outline" :disabled="storageBusy" @click="storageFileInput?.click()"><icon-loader-2 v-if="importingStorage" class="animate-spin" aria-hidden="true" /><icon-file-upload v-else aria-hidden="true" />导入</uiButton>
            <uiButton variant="outline" :disabled="storageBusy" @click="exportStorage"><icon-download aria-hidden="true" />导出</uiButton>
            <uiButton variant="outline" :disabled="storageBusy" @click="loadStorage"><icon-refresh aria-hidden="true" />刷新列表</uiButton>
          </div>
        </div>
        <p v-if="storageError" class="errorText" role="alert">{{ storageError }}</p>
        <p v-else-if="storageMessage" class="successText" role="status">{{ translate(storageMessage) }}</p>
        <div v-for="entry in storageEntries" :key="entry.key" class="storageItem">
          <div class="storageHeader">
            <span class="storageKey">{{ entry.key || '（空键名）' }}</span>
            <div class="storageActions">
              <uiButton variant="ghost" size="sm" :disabled="storageBusy" :aria-label="`修改 ${entry.key}`" @click="editStorage(entry)"><icon-edit aria-hidden="true" />修改</uiButton>
              <uiPopover :open="deleteConfirmKey === entry.key" @update:open="open => deleteConfirmKey = open ? entry.key : null">
                <uiPopoverTrigger asChild>
                  <uiButton
                    class="text-destructive hover:text-destructive"
                    variant="ghost"
                    size="sm"
                    :disabled="storageBusy"
                    :aria-label="`删除 ${entry.key}`"><icon-trash aria-hidden="true" />删除</uiButton>
                </uiPopoverTrigger>
                <uiPopoverContent class="grid w-64 gap-3 text-sm" align="end">
                  <p class="m-0">确定删除这条缓存？</p>
                  <div class="flex justify-end gap-2">
                    <uiButton variant="outline" size="sm" @click="deleteConfirmKey = null">取消</uiButton>
                    <uiButton variant="destructive" size="sm" :disabled="storageBusy" @click="confirmDeleteStorage(entry)">删除</uiButton>
                  </div>
                </uiPopoverContent>
              </uiPopover>
            </div>
          </div>
          <template v-if="editingKey === entry.key">
            <uiTextarea v-model="storageValue" class="storageEditor" rows="5" :disabled="storageBusy" :aria-label="`${entry.key} 的值`" />
            <div class="storageActions">
              <uiButton variant="outline" :disabled="storageBusy" @click="editingKey = null">取消</uiButton>
              <uiButton :disabled="storageBusy" @click="writeStorage(entry, storageValue)"><icon-loader-2 v-if="writingStorage" class="animate-spin" aria-hidden="true" />保存</uiButton>
            </div>
          </template>
          <div v-else class="storageValue">{{ entry.value }}</div>
        </div>
      </div>
    </div>
    <providerDebugDialog v-if="providerDebugVisible" v-model="providerDebugVisible" />
    <systemPromptDialog v-if="systemPromptVisible" v-model="systemPromptVisible" />
    <updateBox
      v-if="updateBoxVisible"
      v-model="updateBoxVisible"
      :version="updateBoxBuild.version"
      :buildCode="updateBoxBuild.hash || translate('未提供')" />
    <div v-if="developerLocked" class="developerConfirm">
      <icon-code :size="28" aria-hidden="true" />
      <h3>确认进入开发者选项</h3>
      <p>此功能仅供开发调试，普通用户请勿开启。安装未知节点或修改、清除缓存可能导致程序异常或数据丢失。请确认你了解相关风险后继续，系统将记住你的选择。</p>
      <uiButton @click="confirmDeveloper">确认并继续</uiButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { locale, msg, translate, type MessageDescriptor } from "@toonflow/i18n/vue";
import { computed, defineAsyncComponent, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useDeveloperStore } from "@/stores/developer";
import { useHelloStore } from "@/stores/hello";
import { saveSettings, settings } from "@/stores/settings";
import { desktopUpdateSnapshot } from "@/stores/desktopUpdate";
import type { updateSnapshot } from "@toonflow/server/desktop";
import saveFile from "@/lib/saveFile";
import { actualPlatform, isRemoteConnection, platformSimulation, setPlatformSimulation } from "@/lib/platform";
import { installPluginFile } from "../../installPluginFile";
import { toast } from "vue-sonner";
import axios from "axios";
import { uiButton } from "@/components/ui/button";
import { uiCheckbox } from "@/components/ui/checkbox";
import { uiInput } from "@/components/ui/input";
import { uiLabel } from "@/components/ui/label";
import { uiPopover, uiPopoverContent, uiPopoverTrigger } from "@/components/ui/popover";
import { uiSelect, uiSelectContent, uiSelectItem, uiSelectTrigger, uiSelectValue } from "@/components/ui/select";
import type { AcceptableValue } from "reka-ui";
import { uiTextarea } from "@/components/ui/textarea";

const developerStore = useDeveloperStore();
const hello = useHelloStore();
const router = useRouter();
const resettingHello = ref(false);
const providerDebugDialog = defineAsyncComponent(() => import("./providerDebugDialog.vue"));
const providerDebugVisible = ref(false);
const systemPromptDialog = defineAsyncComponent(() => import("./systemPromptDialog.vue"));
const systemPromptVisible = ref(false);
const updateBox = defineAsyncComponent(() => import("@/components/updateBox.vue"));
const updateBoxVisible = ref(false);
const openingUpdateBox = ref(false);
const updateBoxBuild = ref({ version: import.meta.env.appVersion ?? "", hash: import.meta.env.DEV ? "dev" : "" });
const developerLocked = computed(() => !developerStore.developerConfirmed);
const customUpdateUrl = ref(typeof settings.value.desktopUpdateCustomUrl === "string" ? settings.value.desktopUpdateCustomUrl : "");
const savingUpdateUrl = ref(false);
const updateUrlError = ref("");

async function openUpdateBox() {
  if (openingUpdateBox.value) return;
  openingUpdateBox.value = true;
  try {
    if (actualPlatform.isDesktop) {
      const snapshot = desktopUpdateSnapshot.value ?? (await axios.get<{ data: updateSnapshot }>("/api/desktop/update", { timeout: 10000 })).data.data;
      if (!snapshot?.version || !snapshot.hash) throw new Error("未能读取当前版本和构建代码，请重试。");
      updateBoxBuild.value = { version: snapshot.version, hash: snapshot.hash };
    }
    updateBoxVisible.value = true;
  } catch (error) {
    toast.error(axios.isAxiosError<{ message?: string }>(error) ? error.response?.data?.message || error.message : error instanceof Error ? error.message : "读取版本信息失败");
  } finally {
    openingUpdateBox.value = false;
  }
}

async function saveCustomUpdateUrl() {
  if (isRemoteConnection) return;
  if (savingUpdateUrl.value) return;
  const url = customUpdateUrl.value.trim();
  updateUrlError.value = "";
  try {
    if (url && !URL.canParse(url)) throw new Error("请输入有效的 HTTP(S) 目录地址");
    if (url) {
      const parsed = new URL(url);
      if (!["http:", "https:"].includes(parsed.protocol) || parsed.username || parsed.password || parsed.search || parsed.hash || url.length > 2048)
        throw new Error("请输入不含账号、查询参数或锚点的 HTTP(S) 目录地址");
    }
    savingUpdateUrl.value = true;
    await saveSettings(current => ({
      desktopUpdateCustomUrl: url,
      ...(url || current.desktopUpdateSource !== "custom" ? {} : { desktopUpdateSource: "official" }),
    }));
    customUpdateUrl.value = url;
    toast.success("自定义更新源已保存");
  } catch (error) {
    updateUrlError.value = axios.isAxiosError<{ message?: string }>(error) ? error.response?.data?.message || error.message : error instanceof Error ? error.message : "保存更新源失败";
  } finally {
    savingUpdateUrl.value = false;
  }
}

function changePlatformSimulation(value: AcceptableValue) {
  // reka Select 选中当前项时也会触发更新，保持原 change 语义只在值变化时重新加载。
  if (typeof value === "string" && value !== platformSimulation) setPlatformSimulation(value);
}

async function resetHello() {
  if (storageBusy.value) return;
  resettingHello.value = true;
  try {
    await hello.reset();
    loadStorage();
    await router.replace("/hello");
  } catch {
    toast.error("重置引导失败，请重试");
  } finally {
    resettingHello.value = false;
  }
}

function confirmDeveloper() {
  developerStore.developerConfirmed = true;
  loadStorage();
}

const installTypes = {
  node: { get label() { return translate("节点"); }, accept: ".umd.js", example: "imageNode.umd.js", get description() { return translate("选择脚手架打包的 .umd.js 文件。"); } },
  ext: { get label() { return translate("文件扩展"); }, accept: ".umd.js", example: "ext-image.umd.js", get description() { return translate("选择扩展脚手架打包的 ext-*.umd.js 文件。"); } },
  skill: { get label() { return translate("技能"); }, accept: ".zip,.md,.tar,.tar.gz,.tgz", example: "skill.zip", get description() { return translate("支持包含技能与资源的 .zip 包、SKILL.md，以及 .tar、.tar.gz、.tgz 包。"); } },
  tool: { get label() { return translate("工具"); }, accept: ".tool.js", example: "canvas.tool.js", get description() { return translate("选择脚手架打包的 .tool.js 文件。"); } },
};
const installType = ref<keyof typeof installTypes>("node");
const selectedInstaller = computed(() => installTypes[installType.value]);
const fileInput = ref<HTMLInputElement>();
const pluginUrl = ref("");
const forceInstall = ref(false);
const installing = ref<"file" | "url" | "">("");
const installError = ref("");
const installedName = ref("");
watch(installType, () => {
  pluginUrl.value = "";
  installError.value = "";
  installedName.value = "";
});
const storageEntries = ref<{ key: string; value: string }[]>([]);
const storageError = ref("");
const editingKey = ref<string | null>(null);
const deleteConfirmKey = ref<string | null>(null);
const storageValue = ref("");
const storageFileInput = ref<HTMLInputElement>();
const importingStorage = ref(false);
const writingStorage = ref(false);
const storageBusy = computed(() => importingStorage.value || writingStorage.value || resettingHello.value);
const storageMessage = ref<string | MessageDescriptor>("");

function readStorage() {
  return Object.fromEntries(Object.keys(localStorage).map(key => [key, localStorage.getItem(key) ?? ""]));
}

function saveStorage(entries: [string, string | null][]) {
  const previous = entries.map(([key]) => [key, localStorage.getItem(key)] as const);
  try {
    for (const [key, value] of entries) {
      if (value === null) localStorage.removeItem(key);
      else localStorage.setItem(key, value);
    }
  } catch (error) {
    // ACT: localStorage 没有事务，写入失败时恢复本次修改的项。
    for (const [key, value] of previous.reverse()) {
      if (value === null) localStorage.removeItem(key);
      else localStorage.setItem(key, value);
    }
    throw error;
  }
}

async function importStorage(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  input.value = "";
  if (!file || storageBusy.value) return;
  importingStorage.value = true;
  storageError.value = "";
  storageMessage.value = "";
  try {
    const data: unknown = JSON.parse((await file.text()).replace(/^\uFEFF/, ""));
    if (!data || typeof data !== "object" || Array.isArray(data) || Object.values(data).some(value => typeof value !== "string")) {
      throw new Error("请选择键值均为字符串的 JSON 对象，例如 {\"key\":\"value\"}。");
    }
    const entries = Object.entries(data) as [string, string][];
    saveStorage(entries);
    loadStorage();
    storageMessage.value = msg`已导入 ${entries.length} 项，重新加载页面后生效。`;
  } catch (err) {
    storageError.value = err instanceof Error ? err.message : "导入缓存失败";
  } finally {
    importingStorage.value = false;
  }
}

async function exportStorage() {
  storageError.value = "";
  storageMessage.value = "";
  try {
    const data = readStorage();
    await saveFile(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }), "toonflowLocalStorage.json");
  } catch (err) {
    storageError.value = err instanceof Error ? err.message : "导出缓存失败";
  }
}

function loadStorage() {
  storageError.value = "";
  storageMessage.value = "";
  try {
    storageEntries.value = Object.entries(readStorage()).sort(([left], [right]) => left.localeCompare(right)).map(([key, value]) => ({ key, value }));
    editingKey.value = null;
  } catch (err) {
    storageError.value = err instanceof Error ? err.message : "读取缓存失败";
  }
}

function editStorage(entry: { key: string; value: string }) {
  editingKey.value = entry.key;
  storageValue.value = entry.value;
}

function confirmDeleteStorage(entry: { key: string; value: string }) {
  deleteConfirmKey.value = null;
  writeStorage(entry, null);
}

function writeStorage(entry: { key: string; value: string }, value: string | null) {
  if (storageBusy.value) return;
  writingStorage.value = true;
  storageError.value = "";
  storageMessage.value = "";
  try {
    if (readStorage()[entry.key] !== entry.value) throw new Error("这条数据已发生变化，请刷新列表后重试。");
    saveStorage([[entry.key, value]]);
    if (editingKey.value === entry.key) editingKey.value = null;
    loadStorage();
    storageMessage.value = msg`已保存，重新加载页面后生效。`;
  } catch (err) {
    storageError.value = err instanceof Error ? err.message : "更新缓存失败";
  } finally {
    writingStorage.value = false;
  }
}

loadStorage();

async function installFile(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  input.value = "";
  if (!file || installing.value) return;
  await installPlugin("file", file);
}

async function installUrl() {
  if (!pluginUrl.value.trim() || installing.value) return;
  await installPlugin("url");
}

async function installPlugin(sourceType: "file" | "url", file?: File) {
  const type = installType.value;
  installing.value = sourceType;
  installError.value = "";
  installedName.value = "";
  try {
    if (file) {
      installedName.value = await installPluginFile(type, file, forceInstall.value);
    } else {
      const { data } = await axios.post(`/api/${type === "ext" ? "ext" : `${type}s`}/install`, { url: pluginUrl.value.trim(), force: forceInstall.value }, { headers: { "x-toonflow-workspace": "1" } });
      if (data.code !== 200) throw new Error(data.message || "安装失败");
      installedName.value = data.data.name;
      window.dispatchEvent(new CustomEvent("toonflow:plugin-installed", { detail: { type, name: data.data.name } }));
      if (type === "ext") window.dispatchEvent(new CustomEvent("toonflow:ext-updated", { detail: { name: data.data.name } }));
    }
  } catch (err) {
    installError.value = axios.isAxiosError<{ message?: string }>(err) ? err.response?.data.message || "安装失败，请检查网络后重试" : err instanceof Error ? err.message : "安装失败";
  } finally {
    installing.value = "";
  }
}

const opening = ref(false);
const requestError = ref("");

async function openDevTools() {
  if (!actualPlatform.isDesktop || opening.value) return;
  opening.value = true;
  requestError.value = "";
  try {
    const response = await fetch("/api/desktop/devtools", { method: "POST", headers: { "x-toonflow-desktop": "1", "Accept-Language": locale.value } });
    if (!response.ok) throw new Error((await response.json()).message || "打开开发者工具失败，请重试。");
  } catch (error) {
    requestError.value = error instanceof Error ? error.message : "打开开发者工具失败，请重试。";
  } finally {
    opening.value = false;
  }
}
</script>

<style lang="scss" scoped>
.developerPanel {
  position: relative;
  height: 100%;
  overflow: hidden;

  .developer {
    height: 100%;
    overflow-y: auto;
    overscroll-behavior: contain;
    &.blurred { filter: blur(6px); user-select: none; pointer-events: none; }
    display: flex;
    flex-direction: column;
    gap: 16px;

    .toolDescription {
      h3 { margin: 0 0 8px; font-size: 14px; color: var(--foreground); }
      p { margin: 0; font-size: 13px; line-height: 1.6; color: var(--muted-foreground); }
    }

    .infoText, .errorText, .successText { margin: 0; font-size: 14px; overflow-wrap: anywhere; }
    .infoText { color: var(--muted-foreground); }
    .errorText { color: var(--destructive); }
    .successText { color: var(--el-color-success); }

    .clearableInput {
      position: relative;
      flex: 1;
      min-width: 200px;

      :deep(input) { padding-inline-end: 32px; }

      .clearButton {
        position: absolute;
        top: 50%;
        inset-inline-end: 8px;
        display: inline-flex;
        padding: 2px;
        border: 0;
        border-radius: 999px;
        background: transparent;
        color: var(--muted-foreground);
        cursor: pointer;
        transform: translateY(-50%);

        &:hover { color: var(--foreground); }
        &:focus-visible { outline: 2px solid var(--ring); }
        svg { width: 16px; height: 16px; }
      }
    }

    .pluginInstaller {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
      margin-top: 16px;

      .installerHeader {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 12px;
        width: 100%;

        h3 { margin: 0; font-size: 14px; color: var(--foreground); }
        .typeSelect { width: 160px; }
      }

      .checkboxField { display: flex; align-items: center; gap: 8px; }
      .fileInput { display: none; }
      .urlInstaller {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        gap: 12px;
      }
    }

    .developerRow {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 16px;

      .platformSelect { width: 180px; }

      .updateSourceEditor {
        display: flex;
        flex: 1;
        flex-wrap: wrap;
        gap: 8px;
        min-width: min(100%, 280px);
      }
    }

    .storageManager {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-top: 16px;
      min-width: 0;

      .storageToolbar {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .storageItem {
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 12px;
        border-radius: var(--radius);
        background: var(--muted);

        .storageHeader {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 8px;

          .storageKey { overflow-wrap: anywhere; font-size: 13px; font-weight: 500; }
        }

        .storageActions { display: flex; justify-content: flex-end; flex-shrink: 0; gap: 8px; }
        .storageEditor { field-sizing: fixed; background: var(--background); }
        .storageValue { white-space: pre-wrap; overflow-wrap: anywhere; max-height: 120px; overflow: auto; font-size: 13px; color: var(--muted-foreground); }
      }
    }
  }

  .developerConfirm {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    padding: 24px;
    overflow-y: auto;
    text-align: center;
    background: color-mix(in srgb, var(--background) 75%, transparent);

    h3 { margin: 0; font-size: 16px; }
    p { margin: 0; max-width: 320px; line-height: 1.6; color: var(--muted-foreground); }
  }
}

</style>
