<template>
  <form class="importForm uiForm" @submit.prevent="importServers">
    <fieldset class="formFields" :disabled="importing">
      <div class="formField">
        <uiLabel :for="portFieldId + '-1'">{{ mode === 'json' ? '配置文件' : 'DXT 包' }}</uiLabel>
        <div class="fileSource">
          <input ref="fileInput" type="file" :accept="mode === 'json' ? '.json' : '.dxt,.mcpb'" hidden @change="selectFile" />
          <div class="inputGroup">
            <component :is="mode === 'json' ? IconFileCode : IconPackage" aria-hidden="true" />
            <uiInput
              :id="portFieldId + '-1'"
              :modelValue="fileName"
              placeholder="尚未选择文件"
              readonly
              aria-label="已选择的 MCP 文件"
              :disabled="(importing) || (false)"></uiInput>
          </div>
          <uiButton @click="fileInput?.click()" variant="outline" type="button" :disabled="(reading) || (importing)"><icon-loader-2 v-if="reading" class="animate-spin" aria-hidden="true" /><component :is="IconFolderOpen" aria-hidden="true" />选择文件</uiButton>
        </div>
      </div>
      <template v-if="mode === 'json'">
        <div class="formField">
          <uiLabel :for="portFieldId + '-2'">JSON 配置</uiLabel>
          <uiTextarea
            :id="portFieldId + '-2'"
            v-model="source"
            class="sourceInput"
            :maxlength="1024 * 1024"
            autocomplete="off"
            spellcheck="false"
            dir="ltr"
            :disabled="(importing) || (reading)"
            :rows="10"
            style="field-sizing:fixed; resize:none"></uiTextarea>
          <span class="fieldHint" data-ui-text="info">支持 mcpServers 批量配置、带 name 的单个配置或配置数组，导入后新增服务。</span>
        </div>
      </template>
      <template v-else-if="packageInfo">
        <div class="packageInfo">
          <div class="packageHeading">
            <strong data-ui-text="default">{{ packageInfo.name }}</strong>
            <uiBadge variant="outline">v{{ packageInfo.version }}</uiBadge>
          </div>
          <span v-if="packageInfo.description" class="packageDescription" data-ui-text="info">{{ packageInfo.description }}</span>
        </div>
        <div v-for="field in fields" :key="field.key" :required="field.required" class="formField">
          <uiLabel :for="portFieldId + '-3' + '-' + String(field.key)">{{ field.title }}</uiLabel>
          <uiSwitch
            :id="portFieldId + '-3' + '-' + String(field.key)"
            v-if="field.type === 'boolean'"
            v-model="field.booleanValue"
            :aria-label="field.title"
            :disabled="(importing)"></uiSwitch>
          <uiNumberField class="numberField" v-else-if="field.type === 'number'" v-model="field.numberValue" :min="field.min" :max="field.max">
            <uiNumberFieldContent>
              <uiNumberFieldDecrement />
              <uiNumberFieldInput :aria-label="field.title" />
              <uiNumberFieldIncrement />
            </uiNumberFieldContent>
          </uiNumberField>
          <div v-else class="inputGroup">
            <uiInput
              v-model="field.textValue"
              :type="field.multiple ? 'textarea' : field.sensitive ? 'password' : 'text'"
              :showPassword="!field.multiple && field.sensitive"
              autocomplete="off"
              spellcheck="false"
              :aria-label="field.title"
              :disabled="(importing) || (false)"></uiInput>
            <uiButton
              @mousedown.prevent
              type="button"
              variant="ghost"
              size="icon-sm"
              :aria-label="passwordVisible1[String(field.key)] ? '隐藏密码' : '显示密码'"
              :disabled="importing"
              @click="passwordVisible1[String(field.key)] = !passwordVisible1[String(field.key)]">
              <icon-eye-off v-if="passwordVisible1[String(field.key)]" />
              <icon-eye v-else />
            </uiButton>
          </div>
          <span v-if="field.description" class="fieldHint" data-ui-text="info">{{ field.description }}</span>
          <span v-if="field.multiple" class="fieldHint" data-ui-text="info">每行一个路径。</span>
        </div>
      </template>
      <uiAlert v-if="error" class="importError" variant="destructive">
        <uiAlertTitle class="whitespace-normal overflow-visible line-clamp-none">{{ error }}</uiAlertTitle>
      </uiAlert>
    </fieldset>
  </form>
</template>

<script setup lang="ts">
import { uiAlert, uiAlertTitle } from "@/components/ui/alert";
import { uiNumberField, uiNumberFieldContent, uiNumberFieldInput, uiNumberFieldDecrement, uiNumberFieldIncrement } from "@/components/ui/numberField";
import { uiSwitch } from "@/components/ui/switch";
import { uiBadge } from "@/components/ui/badge";
import { uiTextarea } from "@/components/ui/textarea";
import { uiButton } from "@/components/ui/button";
import { uiInput } from "@/components/ui/input";
import { uiLabel } from "@/components/ui/label";
import { translate } from "@toonflow/i18n/vue";
import axios from "axios";
import { computed, onBeforeUnmount, ref, useId } from "vue";
import { IconFileCode, IconPackage, IconFolderOpen } from "@tabler/icons-vue";

type DxtField = {
  key: string;
  type: "string" | "number" | "boolean" | "directory" | "file";
  title: string;
  description?: string;
  required?: boolean;
  default?: string | number | boolean | string[];
  sensitive?: boolean;
  multiple?: boolean;
  min?: number;
  max?: number;
};
type DxtInfo = { name: string; version: string; description?: string; userConfig: DxtField[] };
type FieldDraft = DxtField & { textValue: string; numberValue: number | undefined; booleanValue: boolean };
const { mode, localSupported } = defineProps<{ mode: "json" | "dxt"; localSupported: boolean }>();
const emit = defineEmits<{ busy: [value: boolean]; saved: [count: number] }>();
const requestHeaders = { "x-toonflow-workspace": "1" };
const fileInput = ref<HTMLInputElement>();
const fileName = ref("");
const source = ref("");
const reading = ref(false);
const importing = ref(false);
const error = ref("");
const packageInfo = ref<DxtInfo>();
const fields = ref<FieldDraft[]>([]);
const packagePayload = ref<{ fileName: string; content: string }>();
const ready = computed(() => !reading.value && !importing.value && (mode === "json" ? !!source.value.trim() : localSupported && !!packageInfo.value && !!packagePayload.value));
const controller = new AbortController();
let inspectController: AbortController | undefined;
let fileReader: FileReader | undefined;
onBeforeUnmount(() => {
  controller.abort();
  inspectController?.abort();
  fileReader?.abort();
});
defineExpose({ importServers, ready });

function errorMessage(cause: unknown) {
  return axios.isAxiosError(cause) ? cause.response?.data?.message || cause.message : cause instanceof Error ? cause.message : translate("导入失败");
}

async function selectFile(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  input.value = "";
  if (!file || importing.value) return;
  inspectController?.abort();
  fileReader?.abort();
  const currentController = new AbortController();
  inspectController = currentController;
  error.value = "";
  fileName.value = file.name;
  source.value = "";
  packageInfo.value = undefined;
  packagePayload.value = undefined;
  fields.value = [];
  reading.value = true;
  try {
    const maxBytes = (mode === "json" ? 1 : 50) * 1024 * 1024;
    if (!file.size || file.size > maxBytes) throw new Error(`请选择非空且不超过 ${mode === "json" ? 1 : 50} MB 的文件`);
    if (mode === "json") {
      if (!/\.json$/i.test(file.name)) throw new Error("请选择 .json 配置文件");
      const content = await file.text();
      if (!currentController.signal.aborted) source.value = content;
      return;
    }
    if (!localSupported) throw new Error("当前平台不支持导入本地 MCP 包");
    if (!/\.(dxt|mcpb)$/i.test(file.name)) throw new Error("请选择 .dxt 或 .mcpb 包");
    const content = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      fileReader = reader;
      reader.onload = () => resolve((reader.result as string).split(",", 2)[1]!);
      reader.onerror = () => reject(reader.error);
      reader.onabort = () => reject(new DOMException("文件读取已取消", "AbortError"));
      reader.readAsDataURL(file);
    });
    if (currentController.signal.aborted) return;
    const payload = { fileName: file.name, content };
    const { data } = await axios.post<{ code: number; data: DxtInfo; message?: string }>(
      "/api/mcp/servers/inspectDxt", payload, { headers: requestHeaders, signal: currentController.signal }
    );
    if (currentController.signal.aborted) return;
    if (data.code !== 200) throw new Error(data.message || "读取 DXT 包失败");
    if (!data.data || typeof data.data.name !== "string" || typeof data.data.version !== "string" || !Array.isArray(data.data.userConfig)) {
      throw new Error("DXT 包信息格式错误");
    }
    packageInfo.value = data.data;
    packagePayload.value = payload;
    fields.value = data.data.userConfig.map(field => ({
      ...field,
      textValue: Array.isArray(field.default) ? field.default.join("\n") : typeof field.default === "string" ? field.default : "",
      numberValue: typeof field.default === "number" ? field.default : undefined,
      booleanValue: typeof field.default === "boolean" ? field.default : false,
    }));
  } catch (cause) {
    if (!currentController.signal.aborted) error.value = errorMessage(cause);
  } finally {
    if (inspectController === currentController) reading.value = false;
  }
}

function readUserConfig() {
  return Object.fromEntries(fields.value.flatMap(field => {
    const value = field.type === "boolean" ? field.booleanValue
      : field.type === "number" ? field.numberValue
      : field.multiple ? field.textValue.split(/\r?\n/).filter(line => line.trim()) : field.textValue;
    const missing = value === undefined || value === "" || (Array.isArray(value) && !value.length);
    if (missing && field.required) throw new Error(`请填写${field.title}`);
    return value === undefined ? [] : [[field.key, value]];
  }));
}

async function importServers() {
  if (!ready.value) return;
  error.value = "";
  try {
    const payload = mode === "json" ? { source: source.value } : { ...packagePayload.value!, userConfig: readUserConfig() };
    importing.value = true;
    emit("busy", true);
    const { data } = await axios.post(
      `/api/mcp/servers/${mode === "json" ? "importJson" : "importDxt"}`, payload, { headers: requestHeaders, signal: controller.signal }
    );
    if (controller.signal.aborted) return;
    if (data.code !== 200) throw new Error(data.message || "导入 MCP 失败");
    const count = mode === "json" && Array.isArray(data.data?.servers) ? data.data.servers.length : 1;
    emit("saved", count);
  } catch (cause) {
    if (!controller.signal.aborted) error.value = errorMessage(cause);
  } finally {
    importing.value = false;
    emit("busy", false);
  }
}

const passwordVisible1 = ref<Record<string, boolean>>({});
const portFieldId = useId();
</script>

<style scoped lang="scss">
.importForm {
  .fileSource {
    display: flex;
    width: 100%;
    gap: 8px;
    :is(.el-input, [data-slot="input"], .inputGroup) { min-width: 0; }
    [data-slot="button"] { flex-shrink: 0; }
  }
  .sourceInput :deep(textarea[data-slot="textarea"]) {
    height: min(28dvh, 240px);
    min-height: 140px;
    padding: 12px;
    font-family: "Cascadia Code", "SFMono-Regular", Consolas, monospace;
    font-size: 13px;
    line-height: 1.7;
  }
  .packageInfo {
    margin-bottom: 18px;
    overflow-wrap: anywhere;
    .packageHeading { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; }
    .packageDescription { display: block; margin-top: 8px; line-height: 1.5; }
  }
  .fieldHint { display: block; width: 100%; margin-top: 6px; line-height: 1.5; }
  .importError { margin-top: 12px; }
}
</style>
