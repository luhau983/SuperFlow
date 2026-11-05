<template>
  <uiDialog :open="visible" @update:open="(open: boolean) => open || close()">
    <uiDialogContent class="sm:max-w-[1080px]" :aria-describedby="undefined" @closeAutoFocus="emit('closed')">
      <uiDialogHeader>
        <uiDialogTitle>Agent ·{{ agent.displayName }}</uiDialogTitle>
      </uiDialogHeader>
      <uiAlert v-if="error" variant="destructive">
        <icon-alert-circle aria-hidden="true" />
        <uiAlertTitle class="line-clamp-none">{{ error }}</uiAlertTitle>
      </uiAlert>
      <div class="agentEditor" :aria-busy="loading">
        <nav class="fileList" aria-label="Agent 文件">
          <uiButton v-if="readme" class="fileButton" :class="{ active: selectedPath === '' }" variant="ghost" size="sm" @click="selectFile('')"><icon-book :size="18" aria-hidden="true" />说明</uiButton>
          <uiButton
            v-for="file in files"
            :key="file.path"
            class="fileButton"
            :class="{ active: selectedPath === file.path }"
            variant="ghost"
            size="sm"
            :disabled="saving"
            @click="selectFile(file.path)">
            <icon-file :size="18" aria-hidden="true" />
            <span class="fileName">{{ file.path }}</span>
            <span v-if="file.content !== file.original" class="dirtyMark">●</span>
          </uiButton>
        </nav>
        <div class="fileContent">
          <messageMarkdown v-if="!selectedPath" :content="readme" />
          <uiTextarea
            v-else-if="selectedFile"
            v-model="selectedFile.content"
            class="sourceInput"
            :readonly="!canManage"
            :disabled="saving"
            :spellcheck="false"
            :aria-label="selectedPath" />
        </div>
        <div v-if="loading" class="loadingMask" aria-hidden="true">
          <icon-loader-2 class="animate-spin" />
        </div>
      </div>
      <uiDialogFooter>
        <uiButton variant="outline" :disabled="saving || confirming" @click="close()">关闭</uiButton>
        <uiButton v-if="canManage" :disabled="saving || loading || !selectedFile || selectedFile.content === selectedFile.original" @click="save"><icon-loader-2 v-if="saving" class="animate-spin" aria-hidden="true" />保存当前文件</uiButton>
      </uiDialogFooter>
    </uiDialogContent>
  </uiDialog>
</template>

<script setup lang="ts">
import { translate } from "@toonflow/i18n/vue";
import axios from "axios";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { toast } from "vue-sonner";
import messageBox from "@/lib/messageBox";
import { IconBook, IconFile } from "@tabler/icons-vue";
import messageMarkdown from "@/components/messageMarkdown.vue";
import type { Plugin } from "./types";
import { uiAlert, uiAlertTitle } from "@/components/ui/alert";
import { uiButton } from "@/components/ui/button";
import { uiDialog, uiDialogContent, uiDialogFooter, uiDialogHeader, uiDialogTitle } from "@/components/ui/dialog";
import { uiTextarea } from "@/components/ui/textarea";

const { agent, canManage } = defineProps<{ agent: Plugin; canManage: boolean }>();
const emit = defineEmits<{ saved: []; closed: [] }>();
const visible = ref(true);
const loading = ref(true);
const saving = ref(false);
const confirming = ref(false);
const error = ref("");
const readme = ref("");
const files = ref<{ path: string; content: string; original: string }[]>([]);
const selectedPath = ref("");
const selectedFile = computed(() => files.value.find(file => file.path === selectedPath.value));
const headers = { "x-toonflow-workspace": "1" };
const controller = new AbortController();
onBeforeUnmount(() => controller.abort());
onMounted(async () => {
  try {
    const { data } = await axios.get("/api/agents/read", { params: { name: agent.name }, headers, signal: controller.signal });
    if (data.code !== 200 || !Array.isArray(data.data?.files) || !data.data.files.every((file: { path?: unknown; content?: unknown }) => typeof file.path === "string" && typeof file.content === "string")) {
      throw new Error(data.message || "Agent 文件列表无效");
    }
    files.value = data.data.files.map((file: { path: string; content: string }) => ({ ...file, original: file.content }));
    readme.value = typeof data.data.readme === "string" ? data.data.readme : agent.readme ?? "";
    if (!readme.value) selectedPath.value = files.value[0]?.path ?? "";
  } catch (cause) {
    if (!controller.signal.aborted) error.value = errorMessage(cause);
  } finally { loading.value = false; }
});

function errorMessage(cause: unknown) {
  return axios.isAxiosError(cause) ? cause.response?.data?.message || cause.message : cause instanceof Error ? cause.message : translate("操作失败");
}

function selectFile(path: string) {
  if (!saving.value) selectedPath.value = path;
}

// 关闭入口（关闭按钮、右上角、遮罩、Esc）都经过此守卫，有未保存修改时须确认后才关闭。
async function close() {
  if (saving.value || confirming.value) return;
  if (files.value.some(file => file.content !== file.original)) {
    confirming.value = true;
    try { await messageBox.confirm("修改尚未保存，确定放弃修改并关闭吗？", "未保存的修改", { confirmButtonText: "放弃修改", cancelButtonText: "继续编辑", type: "warning" }); }
    catch { return; }
    finally { confirming.value = false; }
  }
  visible.value = false;
}

async function save() {
  const file = selectedFile.value;
  if (!file || !canManage || saving.value || file.content === file.original) return;
  saving.value = true;
  error.value = "";
  const content = file.content;
  try {
    const { data } = await axios.put("/api/agents/save", { name: agent.name, path: file.path, content }, { headers });
    if (data.code !== 200) throw new Error(data.message || "保存失败");
    file.original = content;
    emit("saved");
    toast.success("已保存");
  } catch (cause) { error.value = errorMessage(cause); }
  finally { saving.value = false; }
}
</script>

<style scoped lang="scss">
.agentEditor {
  position: relative;
  display: flex;
  gap: 16px;
  min-width: 0;
  height: min(60vh, 560px);
  min-height: 220px;

  .fileList {
    display: flex;
    flex-direction: column;
    flex: 0 0 min(220px, 30%);
    overflow-y: auto;

    .fileButton {
      justify-content: flex-start;
      min-width: 0;
      min-height: 32px;
      flex-shrink: 0;
      &.active { color: var(--primary); }
      .fileName { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .dirtyMark { color: var(--el-color-warning); }
      svg { flex-shrink: 0; }
    }
  }

  .fileContent {
    flex: 1;
    min-width: 0;
    overflow-y: auto;
    .sourceInput {
      height: 100%;
      resize: none;
      field-sizing: fixed;
      font-family: ui-monospace, Consolas, monospace;
      line-height: 1.6;
      tab-size: 2;
    }
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
