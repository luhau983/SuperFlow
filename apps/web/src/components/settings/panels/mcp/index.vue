<template>
  <div class="mcpPanel">
    <section class="settingSection" aria-labelledby="mcpEnabledTitle">
      <div class="settingHeader">
        <h3 id="mcpEnabledTitle">开启 MCP</h3>
        <uiSwitch
          :modelValue="mcpSettings.enabled"
          aria-label="开启 MCP"
          :disabled="(saving)"
          @update:modelValue="(value) => setEnabled(value === true)"></uiSwitch>
      </div>
      <p class="description">允许外部 Coding 工具和 Agent 操作 SuperFlow。开启后，将客户端配置添加到对应工具中。</p>
    </section>
    <section class="settingSection" aria-labelledby="mcpConnectionTitle">
      <div class="settingHeader">
        <h3 id="mcpConnectionTitle">连接状态</h3>
        <uiButton @click="refreshStatus" variant="ghost" type="button" :disabled="(saving) || (loading)"><icon-loader-2 v-if="loading" class="animate-spin" aria-hidden="true" /><component :is="IconRefresh" aria-hidden="true" />刷新</uiButton>
      </div>
      <uiAlert v-if="statusError" variant="destructive">
        <uiAlertTitle class="whitespace-normal overflow-visible line-clamp-none">{{ statusError }}</uiAlertTitle>
      </uiAlert>
      <template v-else-if="status">
        <div class="connectionState">
          <uiBadge variant="outline">{{ status.enabled ? "已开启" : "已关闭" }}</uiBadge>
          <span v-if="status.enabled">{{ status.connections.length }}个界面已连接</span>
        </div>
        <ul v-if="status.enabled && status.connections.length" class="connectionList">
          <li v-for="connection in status.connections" :key="connection.id">
            <span>{{ connection.state.directory || "首页" }}</span>
            <small v-if="connection.state.directory">{{ connection.state.panel === "document" ? "文档" : "画布" }}</small>
          </li>
        </ul>
      </template>
      <p class="description">画布与节点操作需要 SuperFlow 界面保持打开。</p>
    </section>
    <section class="settingSection" aria-labelledby="mcpEndpointTitle">
      <h3 id="mcpEndpointTitle">服务地址</h3>
      <div class="portSetting">
        <label for="mcpPort">首选本地端口</label>
        <uiNumberField class="numberField"
          id="mcpPort"
          v-model="portDraft"
          :min="1"
          :max="65535"
          :disabled="saving"
          :formatOptions="{ maximumFractionDigits: 0, minimumFractionDigits: 0 }">
          <uiNumberFieldContent>
            <uiNumberFieldDecrement />
            <uiNumberFieldInput />
            <uiNumberFieldIncrement />
          </uiNumberFieldContent>
        </uiNumberField>
        <uiButton
          @click="savePort"
          variant="outline"
          type="button"
          :disabled="(portDraft === undefined || portDraft === (status?.preferredPort ?? mcpSettings.port)) || (saving)"
          size="sm"><icon-loader-2 v-if="saving" class="animate-spin" aria-hidden="true" />保存</uiButton>
      </div>
      <p class="description">默认 10588，占用时自动顺延。保存后自动切换 MCP 端口，地址变化后请重新复制客户端配置。</p>
      <uiInput :modelValue="status?.endpoint ?? ''" dir="ltr" readonly aria-label="MCP 服务地址"></uiInput>
      <p v-if="status?.port" class="description">当前本地监听端口：{{ status.port }}</p>
      <p v-if="status?.port && status.port !== status.preferredPort && !status.error" class="description">首选端口{{ status.preferredPort }}已被占用，已顺延至{{ status.port }}。</p>
      <uiAlert v-if="status?.error" class="listenerError" variant="destructive">
        <uiAlertTitle class="whitespace-normal overflow-visible line-clamp-none">{{ status.error }}</uiAlertTitle>
      </uiAlert>
      <div class="actions">
        <uiButton @click="copyConfig('http')" variant="outline" type="button" :disabled="(!mcpSettings.enabled || !status?.endpoint || saving)"><component :is="IconCopy" aria-hidden="true" />复制 HTTP 配置</uiButton>
        <uiButton v-if="status?.stdio" @click="copyConfig('stdio')" variant="outline" type="button" :disabled="(!mcpSettings.enabled || saving)"><component :is="IconTerminal2" aria-hidden="true" />复制 stdio 配置</uiButton>
      </div>
      <p class="description">HTTP 配置包含访问凭证，请仅提供给可信的客户端。</p>
    </section>
    <section class="settingSection" aria-labelledby="mcpSkillTitle">
      <h3 id="mcpSkillTitle">SuperFlow Skill</h3>
      <p class="description">教外部 Agent 组合使用 SuperFlow 工具。将 SKILL.md 安装到对应 Coding 工具的技能目录。</p>
      <div class="actions">
        <uiButton @click="handleSkill('view')" variant="outline" type="button" :disabled="(!!skillAction) "><icon-loader-2 v-if="skillAction === 'view'" class="animate-spin" aria-hidden="true" /><component :is="IconFileText" aria-hidden="true" />查看 Skill</uiButton>
        <uiButton @click="handleSkill('copy')" variant="outline" type="button" :disabled="(!!skillAction) "><icon-loader-2 v-if="skillAction === 'copy'" class="animate-spin" aria-hidden="true" /><component :is="IconCopy" aria-hidden="true" />复制</uiButton>
        <uiButton @click="handleSkill('download')" variant="outline" type="button" :disabled="(!!skillAction) "><icon-loader-2 v-if="skillAction === 'download'" class="animate-spin" aria-hidden="true" /><component :is="IconDownload" aria-hidden="true" />导出 Skill</uiButton>
      </div>
    </section>
    <uiDialog :open="skillVisible" @update:open="open => { if (!open) { skillVisible = false; } }" :unmountOnHide="false">
      <uiDialogContent
        :aria-describedby="undefined"
        v-if="dialogRendered1"
        class="uiDialogPanel"
        :style="{ width: 'min(760px, calc(100vw - 32px))', maxWidth: 'calc(100vw - 32px)' }">
        <uiDialogHeader class="dialogHeader">
          <uiDialogTitle>SuperFlow Skill</uiDialogTitle>
        </uiDialogHeader>
        <div class="dialogBody">
          <div class="skillContent">
            <messageMarkdown :content="skillContent" />
          </div>
        </div>
      </uiDialogContent>
    </uiDialog>
    <uiDialog :open="copyVisible" @update:open="open => { if (!open) { copyVisible = false; } }" :unmountOnHide="false">
      <uiDialogContent
        :aria-describedby="undefined"
        v-if="dialogRendered2"
        class="uiDialogPanel"
        :style="{ width: 'min(680px, calc(100vw - 32px))', maxWidth: 'calc(100vw - 32px)' }"
        @openAutoFocus="() => { copyInput?.$el.select(); }">
        <uiDialogHeader class="dialogHeader">
          <uiDialogTitle>{{ `复制 ${copyTitle}` }}</uiDialogTitle>
        </uiDialogHeader>
        <div class="dialogBody">
          <p class="copyHint">浏览器无法自动复制，请选中文本后手动复制。{{ copyHasCredential ? "此配置包含访问凭证，请仅提供给可信的客户端。" : "" }}</p>
          <uiTextarea
            ref="copyInput"
            :modelValue="copyContent"
            dir="ltr"
            readonly
            :aria-label="copyTitle"
            :rows="8"
            style="field-sizing: content; resize: none; line-height: 24px; min-height: 208px; max-height: 448px"></uiTextarea>
        </div>
      </uiDialogContent>
    </uiDialog>
  </div>
</template>

<script setup lang="ts">
import { uiTextarea } from "@/components/ui/textarea";
import { uiDialog, uiDialogContent, uiDialogHeader, uiDialogTitle } from "@/components/ui/dialog";
import { uiInput } from "@/components/ui/input";
import { uiNumberField, uiNumberFieldContent, uiNumberFieldInput, uiNumberFieldDecrement, uiNumberFieldIncrement } from "@/components/ui/numberField";
import { uiBadge } from "@/components/ui/badge";
import { uiAlert, uiAlertTitle } from "@/components/ui/alert";
import { uiButton } from "@/components/ui/button";
import { uiSwitch } from "@/components/ui/switch";
import { translate } from "@toonflow/i18n/vue";
import { computed, onMounted, ref, watch } from "vue";
import axios from "axios";
import { toast } from "vue-sonner";
import { IconCopy, IconDownload, IconFileText, IconRefresh, IconTerminal2 } from "@tabler/icons-vue";
import { saveSettings, settings } from "@/stores/settings";
import saveFile from "@/lib/saveFile";
import { writeClipboardText } from "@/lib/clipboard";
import messageMarkdown from "@/components/messageMarkdown.vue";

type McpStatus = {
  enabled: boolean;
  connections: { id: string; state: { directory?: string; panel?: string; canvasId?: string } }[];
  endpoint: string | null;
  stdio: { command: string; args: string[] } | null;
  preferredPort: number;
  port: number | null;
  error: string | null;
};

const headers = { "x-toonflow-workspace": "1" };
const mcpSettings = computed(() => {
  const raw = settings.value.mcp;
  const value = raw && typeof raw === "object" && !Array.isArray(raw) ? raw as Record<string, unknown> : {};
  return {
    enabled: value.enabled === true,
    token: typeof value.token === "string" ? value.token : "",
    port: typeof value.port === "number" && Number.isInteger(value.port) && value.port >= 1 && value.port <= 65535 ? value.port : 10588,
  };
});
const portDraft = ref<number | undefined>(mcpSettings.value.port);
watch(() => mcpSettings.value.port, port => { portDraft.value = port; });
const status = ref<McpStatus>();
const statusError = ref("");
const loading = ref(false);
const saving = ref(false);
const skillContent = ref("");
const skillVisible = ref(false);
const skillAction = ref<"view" | "copy" | "download" | "">("");
const copyVisible = ref(false);
const copyContent = ref("");
const copyTitle = ref("");
const copyHasCredential = ref(false);
const copyInput = ref<{ $el: HTMLInputElement }>();

function errorMessage(error: unknown) {
  return axios.isAxiosError<{ message?: string }>(error) ? error.response?.data?.message || error.message : error instanceof Error ? error.message : translate("操作失败");
}

async function refreshStatus() {
  loading.value = true;
  statusError.value = "";
  try {
    const { data } = await axios.get<{ code: number; data: McpStatus; message?: string }>("/api/mcp/status", { headers });
    if (data.code !== 200) throw new Error(data.message || "读取 MCP 状态失败");
    if (portDraft.value === (status.value?.preferredPort ?? mcpSettings.value.port)) portDraft.value = data.data.preferredPort;
    status.value = data.data;
  } catch (error) {
    statusError.value = errorMessage(error);
  } finally {
    loading.value = false;
  }
}

async function setEnabled(enabled: boolean) {
  saving.value = true;
  try {
    await saveSettings(current => {
      const raw = current.mcp;
      const mcp = raw && typeof raw === "object" && !Array.isArray(raw) ? raw as Record<string, unknown> : {};
      let token = typeof mcp.token === "string" ? mcp.token : "";
      if (enabled && !token) token = Array.from(crypto.getRandomValues(new Uint8Array(32)), value => value.toString(16).padStart(2, "0")).join("");
      return { mcp: { ...mcp, enabled, token } };
    });
    await refreshStatus();
  } catch (error) {
    toast.error(errorMessage(error));
  } finally {
    saving.value = false;
  }
}

async function savePort() {
  const port = portDraft.value;
  if (port === undefined || !Number.isInteger(port) || port < 1 || port > 65535) {
    toast.error("端口必须是 1 到 65535 的整数");
    return;
  }
  saving.value = true;
  try {
    await saveSettings(current => {
      const raw = current.mcp;
      const mcp = raw && typeof raw === "object" && !Array.isArray(raw) ? raw as Record<string, unknown> : {};
      return { mcp: { ...mcp, port } };
    });
    await refreshStatus();
  } catch (error) {
    toast.error(errorMessage(error));
  } finally {
    saving.value = false;
  }
}

async function copyConfig(transport: "http" | "stdio") {
  if (!status.value || !mcpSettings.value.enabled) return;
  const config = transport === "stdio" ? status.value.stdio : {
    url: status.value.endpoint,
    headers: { Authorization: `Bearer ${mcpSettings.value.token}` },
  };
  if (!config) return;
  await copyText(JSON.stringify({ mcpServers: { toonflow: config } }, null, 2), translate("MCP 配置"), transport === "http");
}

async function copyText(content: string, title: string, hasCredential = false) {
  try {
    await writeClipboardText(content);
    toast.success(`${title}已复制`);
    return;
  } catch {
    // ACT: HTTP 页面或剪贴板权限受限时保留手动复制入口。
  }
  copyContent.value = content;
  copyTitle.value = title;
  copyHasCredential.value = hasCredential;
  copyVisible.value = true;
}

async function handleSkill(action: "view" | "copy" | "download") {
  skillAction.value = action;
  try {
    const readSkill = () => axios.get<Blob>("/api/mcp/skill", { headers, responseType: "blob" }).then(({ data }) => data);
    if (action === "download") {
      await saveFile(readSkill, "SKILL.md");
      return;
    }
    skillContent.value ||= await (await readSkill()).text();
    if (action === "view") skillVisible.value = true;
    else await copyText(skillContent.value, "Skill");
  } catch (error) {
    toast.error(errorMessage(error));
  } finally {
    skillAction.value = "";
  }
}

onMounted(refreshStatus);
const dialogRendered1 = ref(skillVisible.value);
watch(skillVisible, open => { if (open) dialogRendered1.value = true; });
const dialogRendered2 = ref(copyVisible.value);
watch(copyVisible, open => { if (open) dialogRendered2.value = true; });
</script>

<style lang="scss" scoped>
.mcpPanel {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 0 4px 8px;

  .settingSection {
    min-width: 0;

    h3 {
      margin: 0 0 12px;
      color: var(--el-text-color-primary);
      font-size: 14px;
      font-weight: 600;
    }

    .settingHeader {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;

      h3 { margin: 0; }
    }

    .description {
      margin: 8px 0 0;
      color: var(--el-text-color-secondary);
      font-size: 12px;
      line-height: 1.6;
    }

    .portSetting {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;

      :is(.el-input-number, .numberField) { width: 120px; }
    }

    .description + :is(.el-input, [data-slot="input"], .inputGroup) { margin-top: 12px; }

    .listenerError { margin-top: 8px; }

    .connectionState, .actions {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 12px;
      font-size: 13px;

      [data-slot="button"] { margin-left: 0; }
    }

    .connectionList {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 0;
      margin: 12px 0 0;
      list-style: none;

      li {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 12px;
        font-size: 12px;
        overflow-wrap: anywhere;

        small { flex-shrink: 0; color: var(--el-text-color-secondary); }
      }
    }
  }
}

.skillContent {
  max-height: 65vh;
  overflow: auto;
}

.copyHint {
  margin: 0 0 12px;
  color: var(--el-text-color-secondary);
  font-size: 12px;
  line-height: 1.6;
}
</style>
