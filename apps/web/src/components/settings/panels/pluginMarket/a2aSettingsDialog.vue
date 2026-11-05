<template>
  <uiDialog v-model:open="visible">
    <uiDialogContent
      class="sm:max-w-[560px]"
      :showCloseButton="!saving"
      :aria-describedby="undefined"
      @interactOutside="(event: Event) => event.preventDefault()"
      @escapeKeyDown="(event: Event) => saving && event.preventDefault()"
      @closeAutoFocus="emit('closed')">
      <uiDialogHeader>
        <uiDialogTitle>A2A 服务</uiDialogTitle>
      </uiDialogHeader>
      <form class="settingsForm" :aria-busy="loading" @submit.prevent="save">
        <fieldset class="formFields" :disabled="loading || saving">
          <div class="formItem">
            <uiLabel for="a2aEnabled">允许外部 Agent 调用本地团队</uiLabel>
            <uiSwitch id="a2aEnabled" v-model="enabled" aria-label="开启 A2A 服务" />
          </div>
          <div class="formItem">
            <uiLabel for="a2aDirectory">授权工作区</uiLabel>
            <div class="directoryField">
              <uiInput id="a2aDirectory" v-model="directory" dir="ltr" placeholder="选择允许团队操作的工作区" />
              <workspacePicker v-model="directory" :disabled="loading || saving" />
            </div>
          </div>
          <div class="formItem">
            <uiLabel>文本模型</uiLabel>
            <modelPopover v-model="selectedModel" v-model:reasoningEffort="reasoningEffort" :active="visible" :disabled="loading || saving" />
          </div>
          <div v-if="url" class="formItem">
            <uiLabel for="a2aUrl">服务地址</uiLabel>
            <uiInput id="a2aUrl" :modelValue="url" dir="ltr" readonly />
          </div>
          <div v-if="token" class="formItem">
            <uiLabel for="a2aToken">访问令牌</uiLabel>
            <div class="passwordField">
              <uiInput id="a2aToken" :modelValue="token" :type="tokenVisible ? 'text' : 'password'" dir="ltr" readonly autocomplete="off" />
              <uiButton
                class="passwordToggle"
                type="button"
                variant="ghost"
                size="icon-sm"
                :aria-label="tokenVisible ? '隐藏' : '显示'"
                :aria-pressed="tokenVisible"
                @click="tokenVisible = !tokenVisible">
                <icon-eye-off v-if="tokenVisible" aria-hidden="true" />
                <icon-eye v-else aria-hidden="true" />
              </uiButton>
            </div>
          </div>
        </fieldset>
        <p class="formHint">保存开启后，本地团队卡片可复制各自的 Agent Card 地址。外部调用使用访问令牌，仅操作这里授权的工作区。</p>
        <uiAlert v-if="error" class="settingsError" variant="destructive">
          <icon-alert-circle aria-hidden="true" />
          <uiAlertTitle class="line-clamp-none">{{ error }}</uiAlertTitle>
        </uiAlert>
        <div v-if="loading" class="loadingMask" aria-hidden="true">
          <icon-loader-2 class="animate-spin" />
        </div>
      </form>
      <uiDialogFooter>
        <uiButton variant="outline" :disabled="saving" @click="visible = false">关闭</uiButton>
        <uiButton :disabled="saving || loading || !loaded || (enabled && (!directory.trim() || !selectedModel))" @click="save"><icon-loader-2 v-if="saving" class="animate-spin" aria-hidden="true" />保存</uiButton>
      </uiDialogFooter>
    </uiDialogContent>
  </uiDialog>
</template>

<script setup lang="ts">
import { translate } from "@toonflow/i18n/vue";
import axios from "axios";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { toast } from "vue-sonner";
import type { ThinkingLevel } from "@toonflow/server/modelReasoning";
import { useNodeModelSelection } from "@toonflow/nodes-scaffold/nodeAi";
import modelPopover from "@/components/modelPopover.vue";
import workspacePicker from "@/pages/home/workspacePicker.vue";
import { modelChoices } from "@/stores/settings";
import { uiAlert, uiAlertTitle } from "@/components/ui/alert";
import { uiButton } from "@/components/ui/button";
import { uiDialog, uiDialogContent, uiDialogFooter, uiDialogHeader, uiDialogTitle } from "@/components/ui/dialog";
import { uiInput } from "@/components/ui/input";
import { uiLabel } from "@/components/ui/label";
import { uiSwitch } from "@/components/ui/switch";

type A2aSettings = { enabled: boolean; directory: string; token?: string; url: string; providerId?: string; modelId?: string; thinkingLevel?: ThinkingLevel };
const emit = defineEmits<{ saved: []; closed: [] }>();
const visible = ref(true);
const enabled = ref(false);
const directory = ref("");
const selectedModel = ref("");
const selectedModelChoice = useNodeModelSelection(modelChoices, selectedModel);
const thinkingLevel = ref<ThinkingLevel>();
const reasoningEffort = computed({ get: () => thinkingLevel.value ?? "", set: (value: string) => { thinkingLevel.value = value ? value as ThinkingLevel : undefined; } });
const token = ref("");
const tokenVisible = ref(false);
const url = ref("");
const loading = ref(true);
const loaded = ref(false);
const saving = ref(false);
const error = ref("");
const headers = { "x-toonflow-workspace": "1" };
const controller = new AbortController();
onBeforeUnmount(() => controller.abort());
onMounted(async () => {
  try { await load(); }
  catch (cause) { error.value = errorMessage(cause); }
  finally { loading.value = false; }
});

function errorMessage(cause: unknown) {
  return axios.isAxiosError(cause) ? cause.response?.data?.message || cause.message : cause instanceof Error ? cause.message : translate("操作失败");
}

async function load() {
  const { data } = await axios.get<{ code: number; data: A2aSettings; message?: string }>("/api/agents/a2a/get", { headers, signal: controller.signal });
  if (data.code !== 200) throw new Error(data.message || "读取 A2A 设置失败");
  applySettings(data.data);
}

function applySettings(value: A2aSettings) {
  if (!value || typeof value.enabled !== "boolean" || typeof value.directory !== "string") throw new Error("A2A 设置格式错误");
  enabled.value = value.enabled;
  directory.value = value.directory;
  selectedModel.value = value.providerId && value.modelId ? JSON.stringify([value.providerId, value.modelId]) : "";
  thinkingLevel.value = value.thinkingLevel;
  token.value = value.token ?? "";
  url.value = value.url;
  loaded.value = true;
}

async function save() {
  if (saving.value || loading.value || !loaded.value) return;
  saving.value = true;
  error.value = "";
  try {
    const model = selectedModelChoice.value;
    if (enabled.value && !model) throw new Error("请选择可用的文本模型");
    const { data } = await axios.put("/api/agents/a2a/save", {
      enabled: enabled.value, directory: directory.value.trim(), providerId: model?.providerId ?? "", modelId: model?.modelId ?? "",
      ...(thinkingLevel.value ? { thinkingLevel: thinkingLevel.value } : {}),
    }, { headers });
    if (data.code !== 200) throw new Error(data.message || "保存 A2A 设置失败");
    applySettings(data.data);
    emit("saved");
    toast.success("A2A 设置已保存");
  } catch (cause) { error.value = errorMessage(cause); }
  finally { saving.value = false; }
}
</script>

<style scoped lang="scss">
.settingsForm {
  position: relative;
  display: grid;
  gap: 16px;
  min-width: 0;

  .formFields {
    display: grid;
    gap: 16px;
    min-width: 0;
    margin: 0;
    padding: 0;
    border: 0;

    .formItem {
      display: grid;
      gap: 8px;
      min-width: 0;
    }
  }

  .directoryField {
    display: flex;
    gap: 8px;
    width: 100%;
    :deep(.workspaceButton) { flex-shrink: 0; max-width: 180px; }
  }

  .passwordField {
    position: relative;
    :deep(input) { padding-right: 40px; }
    .passwordToggle { position: absolute; top: 50%; right: 2px; transform: translateY(-50%); }
  }

  .formHint {
    margin: 0;
    color: var(--muted-foreground);
    font-size: 12px;
    line-height: 1.6;
  }

  .loadingMask {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: color-mix(in oklab, var(--background) 60%, transparent);
    color: var(--muted-foreground);
  }
}
</style>
