<template>
  <div class="mcpServers">
    <div class="mcpToolbar">
      <span data-ui-text="info">{{ localSupported ? "连接本地或远程 MCP 服务，供 Agent 调用工具。" : "连接远程 MCP 服务，供 Agent 调用工具。" }}</span>
      <uiButton v-if="canManage" @click="openEditor()" variant="default" type="button" :disabled="(loading)" size="sm"><component :is="IconPlus" aria-hidden="true" />添加 MCP</uiButton>
    </div>
    <uiAlert v-if="listError" class="listError" variant="destructive">
      <uiAlertTitle class="whitespace-normal overflow-visible line-clamp-none">{{ listError }}</uiAlertTitle>
      <uiButton @click="refreshKey++" variant="outline" type="button" size="sm">重试</uiButton>
    </uiAlert>
    <div class="serverList portLoading" :aria-busy="loading">
      <uiCard v-for="server in servers" :key="server.id" class="serverCard" style="gap:0; padding:0">
        <div class="cardBody" :style="{ padding: '20px' }">
          <div class="serverHeader">
            <h3 class="serverName">{{ server.name }}</h3>
            <uiBadge variant="secondary">{{ transportLabels[server.transport] }}</uiBadge>
          </div>
          <p v-if="canManage" class="serverAddress">{{ server.transport === "stdio" ? server.command : server.url }}</p>
          <span v-if="server.transport === 'stdio' && !localSupported" data-ui-text="warning">当前平台不支持本地 MCP。</span>
          <span v-else-if="server.loadError" data-ui-text="danger">{{ server.loadError }}</span>
          <div class="serverFooter">
            <label v-if="canManage" class="serverToggle">
              <span>{{ server.enabled ? "已启用" : "已禁用" }}</span>
              <uiSwitch
                :modelValue="server.enabled"
                :aria-label="`启用 ${server.name}`"
                :disabled="(loading || pendingServers.has(server.id) || (server.transport === 'stdio' && !localSupported)) || (pendingServers.has(server.id))"
                @update:modelValue="setEnabled(server, $event === true)"></uiSwitch>
            </label>
            <span v-else data-ui-text="info">{{ server.enabled ? "已启用" : "已禁用" }}</span>
            <div v-if="canManage" class="serverActions">
              <uiButton @click="openEditor(server)" variant="outline" type="button" :disabled="(loading || pendingServers.has(server.id))" size="sm">编辑</uiButton>
              <uiPopover v-model:open="confirmVisible1[String(server.id)]">
                <uiPopoverTrigger asChild>
                  <uiButton
                    variant="outline"
                    type="button"
                    :disabled="(loading || pendingServers.has(server.id)) || (pendingServers.has(server.id))"
                    size="sm"><icon-loader-2 v-if="pendingServers.has(server.id)" class="animate-spin" aria-hidden="true" />删除</uiButton>
                </uiPopoverTrigger>
                <uiPopoverContent class="w-[280px]">
                  <p>{{ `确定删除“${server.name}”吗？` }}</p>
                  <div class="confirmActions">
                    <uiButton type="button" variant="outline" size="sm" @click="confirmVisible1[String(server.id)] = false; ">取消</uiButton>
                    <uiButton type="button" size="sm" @click="confirmVisible1[String(server.id)] = false; removeServer(server)">删除</uiButton>
                  </div>
                </uiPopoverContent>
              </uiPopover>
            </div>
          </div>
        </div>
      </uiCard>
      <div v-if="loading" class="portLoadingMask" aria-hidden="true">
        <icon-loader-2 class="animate-spin" />
      </div>
    </div>
    <uiDialog :open="editorVisible" @update:open="open => { if (!open) { editorVisible = false; } }">
      <uiDialogContent
        :aria-describedby="undefined"
        class="uiDialogPanel"
        :style="{ width: 'min(680px, calc(100vw - 32px))', maxWidth: 'calc(100vw - 32px)' }"
        :showCloseButton="!saving"
        @interactOutside="event => { if (!(false)) event.preventDefault(); }"
        @escapeKeyDown="event => { if (!(!saving)) event.preventDefault(); }">
        <uiDialogHeader class="dialogHeader">
          <uiDialogTitle>{{ form.id ? '编辑 MCP' : '添加 MCP' }}</uiDialogTitle>
        </uiDialogHeader>
        <div class="dialogBody">
          <div style="overflow:auto; overscroll-behavior:contain" :style="{ maxHeight: 'min(62dvh, calc(100dvh - 240px))', height: undefined }">
            <div class="dialogContent">
              <form v-if="!form.id" @submit.prevent class="uiForm">
                <fieldset class="formFields" :disabled="saving">
                  <div class="methodField formField">
                    <uiLabel>添加方式</uiLabel>
                    <uiTabs :modelValue="creationMode" @update:modelValue="value => { creationMode = value as typeof creationMode; }">
                      <uiTabsList :aria-label="'添加 MCP 的方式'">
                        <uiTabsTrigger
                          v-for="option in creationMethods"
                          :key="typeof option === 'object' ? option.value : option"
                          :value="typeof option === 'object' ? option.value : option"
                          :disabled="(saving) || (typeof option === 'object' && 'disabled' in option && !!option.disabled)"><component :is="option.icon" :size="16" aria-hidden="true" />{{ typeof option === 'object' ? option.label : option }}</uiTabsTrigger>
                      </uiTabsList>
                    </uiTabs>
                  </div>
                </fieldset>
              </form>
              <form v-if="creationMode === 'quick'" class="serverForm uiForm" @submit.prevent="saveServer">
                <fieldset class="formFields" :disabled="saving || testing">
                  <div class="connectionFields">
                    <div class="formField">
                      <uiLabel :for="portFieldId + '-1'">名称</uiLabel>
                      <uiInput
                        :id="portFieldId + '-1'"
                        v-model="form.name"
                        autocomplete="off"
                        :maxlength="100"
                        :disabled="(saving || testing) || (false)"></uiInput>
                    </div>
                    <div class="formField">
                      <uiLabel :for="portFieldId + '-2'">连接方式</uiLabel>
                      <uiSelect
                        :modelValue="String(form.transport) === '' ? '__empty__' : (form.transport)"
                        @update:modelValue="selected => { const value = selected === '__empty__' ? '' : selected; form.transport = value as typeof form.transport; }">
                        <uiSelectTrigger :id="portFieldId + '-2'" aria-label="MCP 连接方式">
                          <uiSelectValue />
                        </uiSelectTrigger>
                        <uiSelectContent>
                          <uiSelectItem
                            v-for="(label, transport) in transportLabels"
                            :key="transport"
                            :value="transport"
                            :disabled="transport === 'stdio' && !localSupported">{{ undefined }}</uiSelectItem>
                        </uiSelectContent>
                      </uiSelect>
                    </div>
                  </div>
                  <template v-if="form.transport === 'stdio'">
                    <div class="formField">
                      <uiLabel :for="portFieldId + '-3'">启动命令</uiLabel>
                      <uiInput
                        :id="portFieldId + '-3'"
                        v-model="form.command"
                        class="codeInput"
                        autocomplete="off"
                        dir="ltr"
                        :disabled="(saving || testing) || (false)"></uiInput>
                      <span class="fieldHint" data-ui-text="info">{{ localSupported ? "命令在运行 SuperFlow 的电脑或服务端执行。" : "当前平台不支持本地 MCP，请改用远程连接。" }}</span>
                    </div>
                    <div class="formField">
                      <uiLabel :for="portFieldId + '-4'">参数（每行一个）</uiLabel>
                      <uiTextarea
                        :id="portFieldId + '-4'"
                        v-model="form.args"
                        class="codeInput"
                        autocomplete="off"
                        dir="ltr"
                        :disabled="(saving || testing) || (false)"
                        :rows="3"
                        style="field-sizing:fixed; resize:none"></uiTextarea>
                      <span class="fieldHint" data-ui-text="info">每行作为一个完整参数，路径含空格时无需加引号。</span>
                    </div>
                  </template>
                  <div v-else class="formField">
                    <uiLabel :for="portFieldId + '-5'">服务地址</uiLabel>
                    <uiInput
                      :id="portFieldId + '-5'"
                      v-model="form.url"
                      class="codeInput"
                      autocomplete="off"
                      dir="ltr"
                      :disabled="(saving || testing) || (false)"></uiInput>
                  </div>
                  <div class="moreSettings">
                    <uiCollapsible
                      :open="expandedSettings.includes('advanced')"
                      @update:open="open => { expandedSettings = open ? [...expandedSettings, 'advanced'] : expandedSettings.filter(item => item !== 'advanced'); }">
                      <uiCollapsibleTrigger class="collapseTrigger">
                        <span>更多设置</span>
                        <span v-if="settingsSummary" class="settingsSummary" data-ui-text="info">{{ settingsSummary }}</span>
                        <icon-chevron-down />
                      </uiCollapsibleTrigger>
                      <uiCollapsibleContent>
                        <template v-if="form.transport === 'stdio'">
                          <div class="formField">
                            <uiLabel :for="portFieldId + '-6'">工作目录（可选）</uiLabel>
                            <uiInput
                              :id="portFieldId + '-6'"
                              v-model="form.cwd"
                              class="codeInput"
                              autocomplete="off"
                              dir="ltr"
                              :disabled="(saving || testing) || (false)"></uiInput>
                          </div>
                          <div class="formField">
                            <uiLabel :for="portFieldId + '-7'">环境变量（JSON，可选）</uiLabel>
                            <uiTextarea
                              :id="portFieldId + '-7'"
                              v-model="form.env"
                              class="codeInput"
                              autocomplete="off"
                              spellcheck="false"
                              dir="ltr"
                              :disabled="(saving || testing) || (false)"
                              :rows="4"
                              style="field-sizing:fixed; resize:none"></uiTextarea>
                          </div>
                        </template>
                        <div v-else class="formField">
                          <uiLabel :for="portFieldId + '-8'">请求头（JSON，可选）</uiLabel>
                          <uiTextarea
                            :id="portFieldId + '-8'"
                            v-model="form.headers"
                            class="codeInput"
                            autocomplete="off"
                            spellcheck="false"
                            dir="ltr"
                            :disabled="(saving || testing) || (false)"
                            :rows="4"
                            style="field-sizing:fixed; resize:none"></uiTextarea>
                        </div>
                      </uiCollapsibleContent>
                    </uiCollapsible>
                  </div>
                  <div class="enabledRow">
                    <label class="enabledControl">
                      <uiSwitch v-model="form.enabled" aria-label="启用 MCP 服务" :disabled="(saving || testing)"></uiSwitch>
                      <span>启用此 MCP</span>
                    </label>
                    <span data-ui-text="info">保存后在下一轮 Agent 对话生效</span>
                  </div>
                </fieldset>
              </form>
              <mcpImportForm
                v-else-if="editorVisible"
                :key="creationMode"
                ref="importForm"
                :mode="creationMode"
                :localSupported
                @busy="saving = $event"
                @saved="finishImport" />
            </div>
          </div>
          <uiDialogFooter class="dialogFooter">
            <div class="editorFooter">
              <div
                v-if="feedbackVisible"
                class="connectionStatus"
                :class="{ hasError: !!editorError && !testing }"
                role="status"
                aria-live="polite"
                :aria-busy="testing">
                <template v-if="testing">
                  <icon-loader-2 class="loadingIcon" :size="16" aria-hidden="true" />
                  <span>正在连接并读取工具…</span>
                </template>
                <template v-else-if="editorError">
                  <icon-alert-circle class="errorIcon" :size="16" aria-hidden="true" />
                  <span class="errorText">{{ editorError }}</span>
                </template>
                <template v-else-if="testResult">
                  <icon-circle-check class="successIcon" :size="16" aria-hidden="true" />
                  <span>连接成功</span>
                  <span data-ui-text="info">{{ testResult.tools.length }}个工具</span>
                  <uiPopover v-if="testResult.tools.length">
                    <uiPopoverTrigger asChild>
                      <uiButton variant="link" type="button" size="sm">查看工具</uiButton>
                    </uiPopoverTrigger>
                    <uiPopoverContent
                      class="hoverPanel "
                      side="top"
                      align="start"
                      :sideOffset="8"
                      :style="{ width: 'min(420px, calc(100vw - 48px))px', maxWidth: 'calc(100vw - 24px)' }">
                      <div style="overflow:auto; overscroll-behavior:contain" :style="{ maxHeight: '300px', height: undefined }">
                        <div class="toolList">
                          <div v-for="tool in testResult.tools" :key="tool.name" class="toolItem">
                            <div class="toolName">{{ tool.name }}</div>
                            <p v-if="tool.description" class="toolDescription">{{ tool.description }}</p>
                          </div>
                        </div>
                      </div>
                    </uiPopoverContent>
                  </uiPopover>
                </template>
              </div>
              <div class="editorActions">
                <uiButton @click="editorVisible = false" variant="outline" type="button" :disabled="(saving)">取消</uiButton>
                <template v-if="creationMode === 'quick'">
                  <uiButton
                    @click="testConnection"
                    variant="outline"
                    type="button"
                    :disabled="(saving || (form.transport === 'stdio' && !localSupported)) || (testing)"><icon-loader-2 v-if="testing" class="animate-spin" aria-hidden="true" />{{ testing ? "连接中…" : "测试连接" }}</uiButton>
                  <uiButton
                    @click="saveServer"
                    variant="default"
                    type="button"
                    :disabled="(testing || (form.transport === 'stdio' && !localSupported)) || (saving)"><icon-loader-2 v-if="saving" class="animate-spin" aria-hidden="true" />保存</uiButton>
                </template>
                <uiButton v-else @click="importForm?.importServers()" variant="default" type="button" :disabled="(!importForm?.ready) || (saving)"><icon-loader-2 v-if="saving" class="animate-spin" aria-hidden="true" />导入</uiButton>
              </div>
            </div>
          </uiDialogFooter>
        </div>
      </uiDialogContent>
    </uiDialog>
  </div>
</template>

<script setup lang="ts">
import { uiPopover, uiPopoverTrigger, uiPopoverContent } from "@/components/ui/popover";
import { uiCollapsible, uiCollapsibleTrigger, uiCollapsibleContent } from "@/components/ui/collapsible";
import { uiTextarea } from "@/components/ui/textarea";
import { uiSelect, uiSelectTrigger, uiSelectValue, uiSelectContent, uiSelectItem } from "@/components/ui/select";
import { uiInput } from "@/components/ui/input";
import { uiTabs, uiTabsList, uiTabsTrigger } from "@/components/ui/tabs";
import { uiLabel } from "@/components/ui/label";
import { uiDialog, uiDialogContent, uiDialogHeader, uiDialogTitle, uiDialogFooter } from "@/components/ui/dialog";
import { uiSwitch } from "@/components/ui/switch";
import { uiBadge } from "@/components/ui/badge";
import { uiCard } from "@/components/ui/card";
import { uiAlert, uiAlertTitle } from "@/components/ui/alert";
import { uiButton } from "@/components/ui/button";
import axios from "axios";
import { t, translate } from "@toonflow/i18n/vue";
import { computed, onBeforeUnmount, ref, watch, useId } from "vue";
import { toast } from "vue-sonner";
import { IconPlus, IconFileCode, IconPackage, IconCircleCheck, IconAlertCircle, IconLoader2 } from "@tabler/icons-vue";
import mcpImportForm from "./mcpImportForm.vue";

type McpServerConfig = {
  id?: string;
  name: string;
  transport: "stdio" | "http" | "sse";
  enabled: boolean;
  command?: string;
  args?: string[];
  env?: Record<string, string>;
  cwd?: string;
  url?: string;
  headers?: Record<string, string>;
  loadError?: string;
};
type TestResult = { tools: { name: string; description?: string }[]; serverName?: string };
const { visible = true } = defineProps<{ visible?: boolean }>();
const transportLabels = { stdio: "本地（stdio）", http: "远程（Streamable HTTP）", sse: "远程（SSE）" };
const requestHeaders = { "x-toonflow-workspace": "1" };
const servers = ref<(McpServerConfig & { id: string })[]>([]);
const canManage = ref(false);
const localSupported = ref(false);
const creationMethods = computed(() => [
  { label: "快速创建", value: "quick", icon: IconPlus },
  { label: "从 JSON 导入", value: "json", icon: IconFileCode },
  { label: "导入 DXT 包", value: "dxt", icon: IconPackage, disabled: !localSupported.value },
]);
const loading = ref(false);
const listError = ref("");
const refreshKey = ref(0);
const pendingServers = ref(new Set<string>());
const editorVisible = ref(false);
const creationMode = ref<"quick" | "json" | "dxt">("quick");
const expandedSettings = ref<string[]>([]);
const importForm = ref<InstanceType<typeof mcpImportForm>>();
const saving = ref(false);
const testing = ref(false);
const editorError = ref("");
const testResult = ref<TestResult>();
const feedbackVisible = computed(() => creationMode.value === "quick" && (testing.value || !!editorError.value || !!testResult.value));
const form = ref({
  id: undefined as string | undefined, name: "", transport: "stdio" as McpServerConfig["transport"],
  enabled: true, command: "", args: "", cwd: "", env: "", url: "", headers: "",
});
const settingsSummary = computed(() => {
  const local = form.value.transport === "stdio";
  const parts = local && form.value.cwd.trim() ? [translate("已配置工作目录")] : [];
  const value = local ? form.value.env : form.value.headers;
  const label = local ? translate("环境变量") : translate("请求头");
  if (value.trim()) {
    try {
      const config = JSON.parse(value);
      parts.push(config && typeof config === "object" && !Array.isArray(config) ? t`${label} ${Object.keys(config).length} 项` : t`${label}已填写`);
    } catch { parts.push(t`${label}已填写`); }
  }
  return parts.join(" · ");
});
const controller = new AbortController();
let testController: AbortController | undefined;
let originalArgs: string[] = [];
onBeforeUnmount(() => {
  controller.abort();
  testController?.abort();
});
watch(form, () => { testResult.value = undefined; }, { deep: true, flush: "sync" });
watch(creationMode, () => {
  testController?.abort();
  testResult.value = undefined;
  editorError.value = "";
});
watch(
  () => [visible, refreshKey.value],
  async (_value, _previous, onCleanup) => {
    if (!visible) {
      editorVisible.value = false;
      testController?.abort();
      return;
    }
    const listController = new AbortController();
    onCleanup(() => listController.abort());
    loading.value = true;
    listError.value = "";
    canManage.value = false;
    try {
      const { data } = await axios.get<{ code: number; data: { servers: (McpServerConfig & { id: string })[]; canManage: boolean; localSupported: boolean }; message?: string }>(
        "/api/mcp/servers/list", { headers: requestHeaders, signal: listController.signal }
      );
      if (listController.signal.aborted) return;
      if (data.code !== 200) throw new Error(data.message || "读取 MCP 服务失败");
      if (!Array.isArray(data.data?.servers) || data.data.servers.some(server =>
        !server || typeof server.id !== "string" || typeof server.name !== "string"
        || !Object.hasOwn(transportLabels, server.transport) || typeof server.enabled !== "boolean"
      )) throw new Error("MCP 服务列表格式错误");
      servers.value = data.data.servers;
      canManage.value = data.data.canManage === true;
      localSupported.value = data.data.localSupported === true;
    } catch (cause) {
      if (!listController.signal.aborted) listError.value = errorMessage(cause);
    } finally {
      if (!listController.signal.aborted) loading.value = false;
    }
  },
  { immediate: true }
);

function errorMessage(cause: unknown) {
  return axios.isAxiosError(cause) ? cause.response?.data?.message || cause.message : cause instanceof Error ? cause.message : translate("操作失败");
}

function openEditor(server?: McpServerConfig) {
  if (!canManage.value || loading.value || (server?.id && pendingServers.value.has(server.id))) return;
  originalArgs = [...(server?.args ?? [])];
  form.value = {
    id: server?.id, name: server?.name ?? "", transport: server?.transport ?? (localSupported.value ? "stdio" : "http"),
    enabled: server?.enabled ?? true, command: server?.command ?? "", args: originalArgs.join("\n"),
    cwd: server?.cwd ?? "", env: server?.env ? JSON.stringify(server.env, null, 2) : "",
    url: server?.url ?? "", headers: server?.headers ? JSON.stringify(server.headers, null, 2) : "",
  };
  editorError.value = "";
  creationMode.value = "quick";
  expandedSettings.value = [];
  testResult.value = undefined;
  editorVisible.value = true;
}

function finishImport(count: number) {
  editorVisible.value = false;
  refreshKey.value++;
  toast.success(`已导入 ${count} 个 MCP 服务`);
}

function parseRecord(value: string, label: string): Record<string, string> | undefined {
  if (!value.trim()) return undefined;
  let parsed: unknown;
  try { parsed = JSON.parse(value); }
  catch { throw new Error(`${label}必须是有效的 JSON 对象`); }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed) || Object.values(parsed).some(item => typeof item !== "string")) {
    throw new Error(`${label}必须是 JSON 对象，所有值均为字符串`);
  }
  return parsed as Record<string, string>;
}

function serverFromForm(): McpServerConfig {
  const value = form.value;
  const name = value.name.trim();
  if (!name) throw new Error("请填写 MCP 名称");
  const server: McpServerConfig = { ...(value.id ? { id: value.id } : {}), name, transport: value.transport, enabled: value.enabled };
  if (value.transport === "stdio") {
    if (!localSupported.value) throw new Error("当前平台不支持本地 MCP，请改用远程连接");
    const command = value.command.trim();
    if (!command) throw new Error("请填写启动命令");
    return {
      ...server, command, args: value.args === originalArgs.join("\n") ? [...originalArgs] : value.args ? value.args.split(/\r?\n/) : [],
      ...(value.cwd.trim() ? { cwd: value.cwd.trim() } : {}), env: parseRecord(value.env, translate("环境变量")),
    };
  }
  const url = value.url.trim();
  if (!URL.canParse(url) || !["http:", "https:"].includes(new URL(url).protocol)) throw new Error("请输入有效的 HTTP 或 HTTPS 服务地址");
  return { ...server, url, headers: parseRecord(value.headers, translate("请求头")) };
}

async function saveServer() {
  if (!canManage.value || saving.value || testing.value) return;
  editorError.value = "";
  try {
    const server = serverFromForm();
    saving.value = true;
    const { data } = await axios.put("/api/mcp/servers/save", { server }, { headers: requestHeaders, signal: controller.signal });
    if (controller.signal.aborted) return;
    if (data.code !== 200) throw new Error(data.message || "保存 MCP 服务失败");
    editorVisible.value = false;
    refreshKey.value++;
    toast.success("MCP 服务已保存");
  } catch (cause) {
    if (!controller.signal.aborted) editorError.value = errorMessage(cause);
  } finally { saving.value = false; }
}

async function testConnection() {
  if (!canManage.value || saving.value || testing.value) return;
  editorError.value = "";
  testResult.value = undefined;
  const currentController = new AbortController();
  testController = currentController;
  try {
    const server = serverFromForm();
    testing.value = true;
    const { data } = await axios.post<{ code: number; data: TestResult; message?: string }>(
      "/api/mcp/servers/test", { server }, { headers: requestHeaders, signal: currentController.signal }
    );
    if (currentController.signal.aborted) return;
    if (data.code !== 200) throw new Error(data.message || "MCP 连接失败");
    if (!Array.isArray(data.data?.tools)) throw new Error("MCP 工具列表格式错误");
    testResult.value = data.data;
  } catch (cause) {
    if (!currentController.signal.aborted) editorError.value = errorMessage(cause);
  } finally {
    if (testController === currentController) testing.value = false;
  }
}

async function setEnabled(server: McpServerConfig, enabled: boolean) {
  if (!canManage.value || loading.value || !server.id || pendingServers.value.has(server.id)) return;
  pendingServers.value.add(server.id);
  try {
    const { data } = await axios.post("/api/mcp/servers/setEnabled", { id: server.id, enabled }, { headers: requestHeaders, signal: controller.signal });
    if (controller.signal.aborted) return;
    if (data.code !== 200) throw new Error(data.message || "更新 MCP 状态失败");
    server.enabled = enabled;
  } catch (cause) {
    if (!controller.signal.aborted) toast.error(errorMessage(cause));
  } finally { pendingServers.value.delete(server.id); }
}

async function removeServer(server: McpServerConfig) {
  if (!canManage.value || loading.value || !server.id || pendingServers.value.has(server.id)) return;
  pendingServers.value.add(server.id);
  try {
    const { data } = await axios.delete("/api/mcp/servers/remove", { data: { id: server.id }, headers: requestHeaders, signal: controller.signal });
    if (controller.signal.aborted) return;
    if (data.code !== 200) throw new Error(data.message || "删除 MCP 服务失败");
    servers.value = servers.value.filter(item => item.id !== server.id);
    toast.success("MCP 服务已删除");
  } catch (cause) {
    if (!controller.signal.aborted) {
      toast.error(errorMessage(cause));
      refreshKey.value++;
    }
  } finally { pendingServers.value.delete(server.id); }
}

watch(() => editorVisible.value, open => { if (!open) { testController?.abort(); } });

const confirmVisible1 = ref<Record<string, boolean>>({});
const portFieldId = useId();
</script>

<style scoped lang="scss">
.mcpServers {
  .mcpToolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 16px;
  }
  .listError { margin-bottom: 12px; }
  .serverList {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr));
    gap: 12px;
    min-height: 48px;
    .serverCard {
      min-width: 0;
      :deep(.cardBody) { padding: 16px; }
      .serverHeader {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 12px;
        .serverName { margin: 0; font-size: 14px; overflow-wrap: anywhere; }
        .el-tag { flex-shrink: 0; }
      }
      .serverAddress { color: var(--el-text-color-secondary); font-size: 12px; overflow-wrap: anywhere; }
      .serverFooter {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 12px;
        margin-top: 16px;
        .serverToggle {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: var(--el-text-color-secondary);
        }
        .serverActions { display: flex; gap: 8px; [data-slot="button"] { margin-left: 0; } }
      }
    }
  }
}
.dialogContent {
  padding: 8px 4px;
  .methodField {
    .methodOption {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 4px 0;
    }
  }
  .serverForm {
    .connectionFields {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      gap: 16px;
    }
    :is(.el-select, [data-slot="select-trigger"]) { width: 100%; }
    .codeInput {
      :deep(input[data-slot="input"]), :deep(textarea[data-slot="textarea"]) {
        font-family: "Cascadia Code", "SFMono-Regular", Consolas, monospace;
        font-size: 13px;
        line-height: 1.6;
      }
    }
    .fieldHint { display: block; margin-top: 6px; line-height: 1.5; }
    .moreSettings {
      margin-bottom: 14px;
      --el-collapse-border-color: var(--el-border-color-lighter);
      .settingsSummary { margin-left: 12px; font-weight: 400; }
      :deep(.el-collapse-item__content) { padding-bottom: 0; }
    }
    .enabledRow {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      .enabledControl {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 13px;
        color: var(--el-text-color-regular);
      }
    }
    @media (max-width: 520px) {
      .connectionFields { grid-template-columns: minmax(0, 1fr); gap: 0; }
      .enabledRow { align-items: flex-start; flex-direction: column; gap: 6px; }
    }
  }
}
.editorFooter {
  padding-top: 16px;
  border-top: 1px solid var(--el-border-color-lighter);
  .connectionStatus {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 14px;
    color: var(--el-text-color-regular);
    text-align: left;
    font-size: 13px;
    > svg { flex-shrink: 0; }
    .loadingIcon { animation: statusSpin 1s linear infinite; }
    .successIcon { color: var(--el-color-success); }
    .errorIcon { margin-top: 2px; color: var(--el-color-danger); }
    &.hasError { align-items: flex-start; }
    .errorText {
      flex: 1;
      min-width: 0;
      max-height: 72px;
      overflow-y: auto;
      white-space: pre-wrap;
      overflow-wrap: anywhere;
      line-height: 1.5;
    }
    @media (prefers-reduced-motion: reduce) {
      .loadingIcon { animation: none; }
    }
  }
  .editorActions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    [data-slot="button"] { margin-left: 0; }
  }
}
.toolList {
  .toolItem {
    padding: 10px 4px;
    overflow-wrap: anywhere;
    & + .toolItem { border-top: 1px solid var(--el-border-color-lighter); }
    .toolName { font-size: 13px; font-weight: 600; color: var(--el-text-color-primary); }
    .toolDescription { margin: 6px 0 0; font-size: 12px; line-height: 1.6; color: var(--el-text-color-secondary); }
  }
}
@keyframes statusSpin {
  to { transform: rotate(360deg); }
}
</style>
