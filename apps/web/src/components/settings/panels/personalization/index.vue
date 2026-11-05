<template>
  <div class="personalization">
    <section class="settingSection" aria-labelledby="instructionsTitle">
      <div class="settingInfo">
        <h3 id="instructionsTitle">SuperFlow 说明</h3>
        <p class="description">为所有聊天提供额外说明和上下文。支持 Markdown，保存后下一次发送消息时生效。</p>
      </div>
      <uiAlert v-if="document.error" variant="destructive">
        <uiAlertTitle class="whitespace-normal overflow-visible line-clamp-none">{{ getDocumentError(document) }}</uiAlertTitle>
      </uiAlert>
      <uiTextarea
        v-model="document.content"
        :maxlength="maxLength"
        :disabled="!document.loaded || document.loading"
        aria-label="SuperFlow 说明内容"
        :rows="4"
        style="field-sizing: content; resize: none; line-height: 24px; min-height: 112px; max-height: 208px"></uiTextarea>
      <div class="editorFooter">
        <span class="editorStatus">{{ document.loading ? "正在读取…" : isDirty(document) ? "有未保存的修改" : "" }}<span>{{ document.content.length }}/{{ maxLength }}</span></span>
        <div class="editorActions">
          <uiButton
            aria-label="重新加载 SuperFlow 说明"
            @click="reloadDocument(document, 'agents')"
            variant="outline"
            type="button"
            :disabled="(document.saving) || (document.loading)"><icon-loader-2 v-if="document.loading" class="animate-spin" aria-hidden="true" /><component :is="IconRefresh" aria-hidden="true" />{{ document.loaded ? "重新加载" : "重试" }}</uiButton>
          <uiButton
            aria-label="保存 SuperFlow 说明"
            @click="saveDocument(document, 'agents')"
            variant="default"
            type="button"
            :disabled="(!document.loaded || document.loading || document.conflict || !isDirty(document) || document.content.length > maxLength) || (document.saving)"><icon-loader-2 v-if="document.saving" class="animate-spin" aria-hidden="true" /><component :is="IconDeviceFloppy" aria-hidden="true" />保存</uiButton>
        </div>
      </div>
    </section>
    <section class="settingSection">
      <div class="memoryOptions">
        <div class="settingHeader">
          <div class="settingInfo">
            <h4>启用本地记忆</h4>
            <p class="description">记住你的偏好，在后续聊天中使用。关闭后仍保留已保存的内容。</p>
          </div>
          <uiSwitch
            :modelValue="memoryEnabled"
            aria-label="启用本地记忆"
            :disabled="(savingMemorySetting)"
            @update:modelValue="(value) => setMemoryEnabled(value === true)"></uiSwitch>
        </div>
        <div class="settingHeader">
          <div class="settingInfo">
            <h4>删除本地记忆</h4>
          </div>
          <uiButton
            aria-label="删除本地记忆"
            @click="deleteMemory"
            variant="outline"
            type="button"
            :disabled="(!!memoryAction || memoryDocument.loading || memoryDocument.saving) "><icon-loader-2 v-if="memoryAction === 'delete'" class="animate-spin" aria-hidden="true" /><component :is="IconTrash" aria-hidden="true" />删除</uiButton>
        </div>
        <div class="settingHeader">
          <div class="settingInfo">
            <h4>查看本地记忆</h4>
          </div>
          <uiButton
            aria-label="查看本地记忆"
            @click="viewMemory"
            variant="outline"
            type="button"
            :disabled="(!!memoryAction || memoryDocument.loading || memoryDocument.saving) "><icon-loader-2 v-if="memoryAction === 'view'" class="animate-spin" aria-hidden="true" /><component :is="IconEye" aria-hidden="true" />查看</uiButton>
        </div>
      </div>
    </section>
    <uiDialog :open="memoryVisible" @update:open="open => { if (!open) { memoryVisible = false; } }" :unmountOnHide="false">
      <uiDialogContent
        :aria-describedby="undefined"
        v-if="dialogRendered1"
        class="uiDialogPanel"
        :style="{ width: 'min(760px, calc(100vw - 32px))', maxWidth: 'calc(100vw - 32px)' }">
        <uiDialogHeader class="dialogHeader">
          <uiDialogTitle>SuperFlow 记忆</uiDialogTitle>
        </uiDialogHeader>
        <div class="dialogBody">
          <div class="memoryContent">
            <uiAlert v-if="memoryDocument.error" variant="destructive">
              <uiAlertTitle class="whitespace-normal overflow-visible line-clamp-none">{{ getDocumentError(memoryDocument) }}</uiAlertTitle>
            </uiAlert>
            <uiTextarea
              v-if="memoryEditing"
              v-model="memoryDocument.content"
              :maxlength="maxLength"
              :disabled="memoryDocument.loading"
              aria-label="本地记忆内容"
              :rows="10"
              style="field-sizing: content; resize: none; line-height: 24px; min-height: 256px; max-height: 448px"></uiTextarea>
            <messageMarkdown v-else-if="memoryDocument.content.trim()" :content="memoryDocument.content" />
            <div v-else style="padding:32px; text-align:center; color:var(--muted-foreground)">暂无本地记忆</div>
          </div>
          <uiDialogFooter class="dialogFooter">
            <div class="memoryFooter">
              <span class="editorStatus">{{ isDirty(memoryDocument) ? "有未保存的修改 · " : "" }}{{ memoryDocument.content.length }}/{{ maxLength }}</span>
              <div class="editorActions">
                <uiButton
                  aria-label="重新加载本地记忆"
                  @click="reloadDocument(memoryDocument, 'memory')"
                  variant="outline"
                  type="button"
                  :disabled="(memoryDocument.saving) || (memoryDocument.loading)"><icon-loader-2 v-if="memoryDocument.loading" class="animate-spin" aria-hidden="true" /><component :is="IconRefresh" aria-hidden="true" />重新加载</uiButton>
                <uiButton
                  v-if="memoryEditing"
                  aria-label="保存本地记忆"
                  @click="saveMemory"
                  variant="default"
                  type="button"
                  :disabled="(memoryDocument.loading || memoryDocument.conflict || !isDirty(memoryDocument) || memoryDocument.content.length > maxLength) || (memoryDocument.saving)"><icon-loader-2 v-if="memoryDocument.saving" class="animate-spin" aria-hidden="true" /><component :is="IconDeviceFloppy" aria-hidden="true" />保存</uiButton>
                <uiButton
                  v-else
                  aria-label="编辑本地记忆"
                  @click="memoryEditing = true"
                  variant="default"
                  type="button"
                  :disabled="(memoryDocument.loading)"><component :is="IconEdit" aria-hidden="true" />编辑</uiButton>
              </div>
            </div>
          </uiDialogFooter>
        </div>
      </uiDialogContent>
    </uiDialog>
  </div>
</template>

<script setup lang="ts">
import { uiDialog, uiDialogContent, uiDialogHeader, uiDialogTitle, uiDialogFooter } from "@/components/ui/dialog";
import { uiSwitch } from "@/components/ui/switch";
import { uiButton } from "@/components/ui/button";
import { uiTextarea } from "@/components/ui/textarea";
import { uiAlert, uiAlertTitle } from "@/components/ui/alert";
import { msg, translate } from "@toonflow/i18n/vue";
import { computed, onActivated, reactive, ref, watch } from "vue";
import axios from "axios";
import { toast } from "vue-sonner";
import messageBox from "@/lib/messageBox";
import { IconDeviceFloppy, IconEdit, IconEye, IconRefresh, IconTrash } from "@tabler/icons-vue";
import { saveSettings, settings } from "@/stores/settings";
import messageMarkdown from "@/components/messageMarkdown.vue";

defineOptions({ name: "personalization" });

type DocumentContent = { content: string; revision: string };
type DocumentState = DocumentContent & {
  savedContent: string;
  loaded: boolean;
  loading: boolean;
  saving: boolean;
  conflict: boolean;
  error: string;
};
type DocumentResponse = { code: number; data: DocumentContent; message?: string };

const props = defineProps<{ visible: boolean }>();
const maxLength = 20000;
const headers = { "x-toonflow-workspace": "1" };
const conflictMessage = msg`文件已被其他操作修改。当前草稿已保留，请先复制需要保留的内容，再重新加载最新版本。`;
const document = reactive<DocumentState>({
  content: "",
  revision: "",
  savedContent: "",
  loaded: false,
  loading: false,
  saving: false,
  conflict: false,
  error: "",
});
const memoryEnabled = computed(() => {
  const value = settings.value.personalization;
  return !value || typeof value !== "object" || Array.isArray(value) || (value as Record<string, unknown>).memoryEnabled !== false;
});
const savingMemorySetting = ref(false);
const memoryAction = ref<"view" | "delete" | "">("");
const memoryVisible = ref(false);
const memoryEditing = ref(false);
const memoryDocument = reactive<DocumentState>({
  content: "", revision: "", savedContent: "", loaded: false, loading: false, saving: false, conflict: false, error: "",
});

function isDirty(document: DocumentState) {
  return document.content !== document.savedContent;
}

function getDocumentError(document: DocumentState) {
  return document.error === conflictMessage.id ? translate(conflictMessage) : document.error;
}

function errorMessage(error: unknown) {
  return axios.isAxiosError<{ message?: string }>(error)
    ? error.response?.data?.message || error.message
    : error instanceof Error
    ? error.message
    : translate("操作失败，请重试");
}

async function loadDocument(document: DocumentState, name: "agents" | "memory", discardChanges = false) {
  if (document.loading || document.saving || (!discardChanges && isDirty(document))) return;
  const content = document.content;
  document.loading = true;
  document.error = "";
  try {
    const { data } = await axios.get<DocumentResponse>("/api/settings/personalization/get", { params: { document: name }, headers });
    if (data.code !== 200) throw new Error(data.message || "读取失败，请重试");
    if (document.content !== content) return;
    document.content = data.data.content;
    document.savedContent = data.data.content;
    document.revision = data.data.revision;
    document.loaded = true;
    document.conflict = false;
  } catch (error) {
    document.error = errorMessage(error);
  } finally {
    document.loading = false;
  }
}

async function reloadDocument(document: DocumentState, name: "agents" | "memory") {
  if (isDirty(document)) {
    try {
      await messageBox.confirm("重新加载将放弃当前文档未保存的修改，读取最新内容。", "重新加载", {
        confirmButtonText: "放弃修改并加载",
        cancelButtonText: "继续编辑",
        type: "warning",
      });
    } catch {
      return;
    }
  }
  await loadDocument(document, name, true);
}

async function saveDocument(document: DocumentState, name: "agents" | "memory") {
  if (!document.loaded || document.loading || document.saving || document.conflict || !isDirty(document)) return;
  const content = document.content;
  if (content.length > maxLength) {
    toast.error(`内容不能超过 ${maxLength} 个字符`);
    return;
  }
  document.saving = true;
  document.error = "";
  try {
    const { data } = await axios.put<DocumentResponse>(
      "/api/settings/personalization/save",
      { document: name, content, revision: document.revision },
      { headers }
    );
    if (data.code === 409) {
      document.conflict = true;
      throw new Error(conflictMessage.id);
    }
    if (data.code !== 200) throw new Error(data.message || "保存失败，请重试");
    document.savedContent = data.data.content;
    document.revision = data.data.revision;
    if (document.content === content) document.content = data.data.content;
    toast.success(`${name === "agents" ? "SuperFlow 说明" : "本地记忆"}已保存`);
    return true;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 409) document.conflict = true;
    document.error = document.conflict ? conflictMessage.id : errorMessage(error);
    toast.error(getDocumentError(document));
  } finally {
    document.saving = false;
  }
}

async function setMemoryEnabled(memoryEnabled: boolean) {
  if (savingMemorySetting.value) return;
  savingMemorySetting.value = true;
  try {
    await saveSettings((current) => {
      const value = current.personalization;
      return { personalization: { ...(value && typeof value === "object" && !Array.isArray(value) ? value : {}), memoryEnabled } };
    });
  } catch (error) {
    toast.error(errorMessage(error));
  } finally {
    savingMemorySetting.value = false;
  }
}

async function readMemory() {
  const { data } = await axios.get<DocumentResponse>("/api/settings/personalization/get", { params: { document: "memory" }, headers });
  if (data.code !== 200) throw new Error(data.message || "读取本地记忆失败，请重试");
  return data.data;
}

async function viewMemory() {
  if (memoryAction.value || memoryDocument.loading || memoryDocument.saving) return;
  memoryAction.value = "view";
  try {
    await loadDocument(memoryDocument, "memory");
    if (memoryDocument.loaded) memoryVisible.value = true;
    else toast.error(getDocumentError(memoryDocument));
  } catch (error) {
    toast.error(errorMessage(error));
  } finally {
    memoryAction.value = "";
  }
}

async function saveMemory() {
  if (await saveDocument(memoryDocument, "memory")) memoryEditing.value = isDirty(memoryDocument);
}

async function deleteMemory() {
  if (memoryAction.value || memoryDocument.loading || memoryDocument.saving) return;
  memoryAction.value = "delete";
  try {
    const memory = await readMemory();
    if (!memory.content && !isDirty(memoryDocument)) {
      toast.info("暂无本地记忆");
      return;
    }
    try {
      await messageBox.confirm("将删除所有工作区共用的本地记忆及未保存的记忆修改，此操作无法撤销。SuperFlow 说明会保留。", "删除本地记忆", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "warning",
      });
    } catch {
      return;
    }
    const { data } = await axios.put<DocumentResponse>(
      "/api/settings/personalization/save",
      { document: "memory", content: "", revision: memory.revision },
      { headers }
    );
    if (data.code === 409) throw new Error("本地记忆已更新，未删除任何内容。请重新查看后重试。");
    if (data.code !== 200) throw new Error(data.message || "删除本地记忆失败，请重试");
    Object.assign(memoryDocument, data.data, { savedContent: data.data.content, loaded: true, conflict: false, error: "" });
    memoryEditing.value = false;
    toast.success("本地记忆已删除");
  } catch (error) {
    toast.error(
      axios.isAxiosError(error) && error.response?.status === 409 ? "本地记忆已更新，未删除任何内容。请重新查看后重试。" : errorMessage(error)
    );
  } finally {
    memoryAction.value = "";
  }
}

function refreshDocument() {
  if (!props.visible) return;
  void loadDocument(document, "agents");
}

watch(() => props.visible, refreshDocument, { immediate: true });
onActivated(refreshDocument);
const dialogRendered1 = ref(memoryVisible.value);
watch(memoryVisible, open => { if (open) dialogRendered1.value = true; });
</script>

<style lang="scss" scoped>
.personalization {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 0 4px 8px;

  .settingSection {
    display: flex;
    flex-direction: column;
    min-width: 0;
    gap: 12px;

    h3,
    h4 {
      margin: 0;
      color: var(--el-text-color-primary);
      font-size: 14px;
      font-weight: 600;
    }

    .settingInfo {
      min-width: 0;

      .description {
        margin: 6px 0 0;
        color: var(--el-text-color-secondary);
        font-size: 12px;
        line-height: 1.6;
      }
    }

    .memoryOptions {
      display: flex;
      flex-direction: column;
      gap: 20px;

      .settingHeader {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 24px;

        > [data-slot="button"],
        > :is(.el-switch, [data-slot="switch"]) {
          flex-shrink: 0;
        }
      }
    }

    .editorFooter {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 12px;

      .editorStatus {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        color: var(--el-text-color-secondary);
        font-size: 12px;
      }

      .editorActions {
        display: flex;
        gap: 8px;
        margin-left: auto;

        [data-slot="button"] {
          margin-left: 0;
        }
      }
    }
  }
}

.memoryContent {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 60vh;
  overflow: auto;
}

.memoryFooter {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  .editorStatus {
    color: var(--el-text-color-secondary);
    font-size: 12px;
  }

  .editorActions {
    display: flex;
    gap: 8px;
    margin-left: auto;

    [data-slot="button"] { margin-left: 0; }
  }
}
</style>
