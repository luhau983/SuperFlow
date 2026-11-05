<template>
  <uiDialog v-model:open="visible">
    <uiDialogContent
      :aria-describedby="undefined"
      class="sm:max-w-[960px]"
      :showCloseButton="!saving"
      @interactOutside="event => event.preventDefault()"
      @escapeKeyDown="event => saving && event.preventDefault()">
      <uiDialogHeader>
        <uiDialogTitle>Agent 系统提示词</uiDialogTitle>
      </uiDialogHeader>
      <div v-if="loading" class="loadState" role="status">正在读取系统提示词…</div>
      <div v-else-if="loadError" class="loadState">
        <p class="text-destructive text-sm" role="alert">{{ loadError }}</p>
        <uiButton variant="outline" @click="loadPrompt">重试</uiButton>
      </div>
      <div v-else class="promptEditor">
        <div class="promptDescription">
          <p>保存后下一条消息生效，留空使用默认提示词。</p>
          <p v-pre>保留 {{tools}}、{{guidelines}}、{{environment}} 及相关条件块，以自动填入工具规则和运行环境。</p>
        </div>
        <div class="promptInput">
          <uiTextarea v-model="draft" class="promptTextarea" :maxlength="maxLength" :disabled="saving" aria-label="Agent 系统提示词" />
          <span class="wordLimit">{{ draft.length }}/{{ maxLength }}</span>
        </div>
        <p v-if="saveError" class="text-destructive text-sm" role="alert">{{ saveError }}</p>
      </div>
      <uiDialogFooter class="dialogFooter">
        <uiButton variant="outline" :disabled="loading || !!loadError || saving" @click="draft = defaultSystemPrompt">恢复默认</uiButton>
        <div class="footerActions">
          <uiButton variant="outline" :disabled="saving" @click="visible = false">取消</uiButton>
          <uiButton :disabled="saving || loading || !!loadError || !maxLength || draft.length > maxLength" @click="save"><icon-loader-2 v-if="saving" class="animate-spin" aria-hidden="true" />保存</uiButton>
        </div>
      </uiDialogFooter>
    </uiDialogContent>
  </uiDialog>
</template>

<script setup lang="ts">
import axios from "axios";
import { onBeforeUnmount, onMounted, ref } from "vue";
import { toast } from "vue-sonner";
import { saveSettings, settings } from "@/stores/settings";
import { uiButton } from "@/components/ui/button";
import { uiDialog, uiDialogContent, uiDialogFooter, uiDialogHeader, uiDialogTitle } from "@/components/ui/dialog";
import { uiTextarea } from "@/components/ui/textarea";

const visible = defineModel<boolean>({ default: false });
const draft = ref("");
const defaultSystemPrompt = ref("");
const maxLength = ref(0);
const loading = ref(false);
const saving = ref(false);
const loadError = ref("");
const saveError = ref("");
const controller = new AbortController();
onBeforeUnmount(() => controller.abort());
onMounted(loadPrompt);

async function loadPrompt() {
  if (loading.value) return;
  loading.value = true;
  loadError.value = "";
  try {
    const { data } = await axios.get<{ code: number; data: { defaultSystemPrompt: string; maxLength: number }; message?: string }>("/api/settings/systemPrompt", {
      headers: { "x-toonflow-workspace": "1", "Cache-Control": "no-cache" }, signal: controller.signal,
    });
    if (data.code !== 200) throw new Error(data.message || "读取系统提示词失败");
    if (typeof data.data?.defaultSystemPrompt !== "string" || !Number.isSafeInteger(data.data.maxLength) || data.data.maxLength <= 0) {
      throw new Error("系统提示词格式错误");
    }
    defaultSystemPrompt.value = data.data.defaultSystemPrompt;
    maxLength.value = data.data.maxLength;
    const saved = settings.value.agentSystemPrompt;
    draft.value = typeof saved === "string" && saved.trim() ? saved : defaultSystemPrompt.value;
  } catch (error) {
    loadError.value = axios.isAxiosError<{ message?: string }>(error) ? error.response?.data?.message || "读取系统提示词失败，请重试" : error instanceof Error ? error.message : "读取系统提示词失败，请重试";
  } finally { loading.value = false; }
}

async function save() {
  if (saving.value || loading.value || loadError.value || !maxLength.value || draft.value.length > maxLength.value) return;
  const agentSystemPrompt = !draft.value.trim() || draft.value === defaultSystemPrompt.value ? "" : draft.value;
  saving.value = true;
  saveError.value = "";
  try {
    await saveSettings(() => ({ agentSystemPrompt }));
    toast.success("系统提示词已保存");
    visible.value = false;
  } catch (error) {
    saveError.value = axios.isAxiosError<{ message?: string }>(error) ? error.response?.data?.message || "保存失败，请重试；当前内容已保留" : error instanceof Error ? error.message : "保存失败，请重试；当前内容已保留";
  } finally { saving.value = false; }
}
</script>

<style lang="scss" scoped>
.loadState {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-height: 120px;
}

.promptEditor {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: min(640px, 65dvh);
  min-height: 0;
  min-width: 0;

  .promptDescription {
    color: var(--muted-foreground);
    font-size: 13px;
    line-height: 1.6;
    p { margin: 0; }
  }

  .promptInput {
    position: relative;
    display: flex;
    flex: 1;
    min-height: 0;

    .promptTextarea { height: 100%; padding-bottom: 24px; resize: none; field-sizing: fixed; }

    .wordLimit {
      position: absolute;
      inset-inline-end: 12px;
      bottom: 6px;
      color: var(--muted-foreground);
      font-size: 12px;
      pointer-events: none;
    }
  }
}

.dialogFooter {
  justify-content: space-between;
  gap: 12px;

  .footerActions { display: flex; gap: 8px; }
}
</style>
