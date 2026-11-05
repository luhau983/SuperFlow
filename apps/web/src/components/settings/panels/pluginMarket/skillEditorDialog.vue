<template>
  <uiDialog :open="visible" @update:open="(open: boolean) => open || close()">
    <uiDialogContent class="sm:max-w-[1080px]" :aria-describedby="undefined" @closeAutoFocus="emit('closed')">
      <uiDialogHeader>
        <uiDialogTitle>编辑技能 ·{{ skill.displayName }}</uiDialogTitle>
      </uiDialogHeader>
      <div class="skillEditor" :aria-busy="filesLoading || fileLoading">
        <uiAlert v-if="filesError" variant="destructive">
          <icon-alert-circle aria-hidden="true" />
          <uiAlertTitle class="line-clamp-none">{{ filesError }}</uiAlertTitle>
        </uiAlert>
        <template v-else>
          <div class="fileTree">
            <uiButton
              v-if="isDirectorySkill"
              class="newFileButton"
              variant="outline"
              size="sm"
              :disabled="creating || saving || moving"
              @click="createFile"><icon-loader-2 v-if="creating" class="animate-spin" aria-hidden="true" /><icon-file-plus v-else aria-hidden="true" />新建文件</uiButton>
            <el-tree
              :key="treeVersion"
              class="tree"
              :data="[treeRoot]"
              :icon="IconChevronRight"
              nodeKey="key"
              :props="{ label: 'label', children: 'children' }"
              defaultExpandAll
              highlightCurrent
              :currentNodeKey="selectedPath"
              :draggable="isDirectorySkill"
              :allowDrag="allowDrag"
              :allowDrop="allowDrop"
              @nodeClick="handleNodeClick"
              @nodeDrop="handleNodeDrop">
              <template #default="{ data, node }">
                <span class="treeItem">
                  <component
                    v-if="data.type === 'directory'"
                    :is="node.expanded && !node.isLeaf ? IconFolderOpen : IconFolder"
                    :size="18"
                    aria-hidden="true" />
                  <icon-file v-else :size="18" aria-hidden="true" />
                  <span class="treeLabel">{{ data.label }}</span>
                  <span v-if="dirtyPaths.has(data.key)" class="dirtyMark" aria-hidden="true">●</span>
                </span>
              </template>
            </el-tree>
          </div>
          <div class="fileEditor">
            <uiAlert v-if="fileError" variant="destructive">
              <icon-alert-circle aria-hidden="true" />
              <uiAlertTitle class="line-clamp-none">{{ fileError }}</uiAlertTitle>
            </uiAlert>
            <template v-else>
              <p v-if="selectedPath === mainPath" class="fileHint">name 为技能标识，不可修改</p>
              <uiTextarea
                v-model="draft"
                class="sourceInput"
                :disabled="fileLoading || saving"
                :aria-label="`${selectedPath} 源码`"
                :spellcheck="false" />
            </template>
          </div>
        </template>
      </div>
      <uiDialogFooter>
        <uiButton variant="outline" :disabled="saving || moving || confirming" @click="close()">关闭</uiButton>
        <uiButton :disabled="saving || fileLoading || !!fileError || draft === original || confirming" @click="save"><icon-loader-2 v-if="saving" class="animate-spin" aria-hidden="true" />保存</uiButton>
      </uiDialogFooter>
    </uiDialogContent>
  </uiDialog>
</template>

<script setup lang="ts">
import axios from "axios";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { toast } from "vue-sonner";
import messageBox from "@/lib/messageBox";
import { IconChevronRight, IconFolder, IconFolderOpen } from "@tabler/icons-vue";
import { uiAlert, uiAlertTitle } from "@/components/ui/alert";
import { uiButton } from "@/components/ui/button";
import { uiDialog, uiDialogContent, uiDialogFooter, uiDialogHeader, uiDialogTitle } from "@/components/ui/dialog";
import { uiTextarea } from "@/components/ui/textarea";
import type { Plugin } from "./types";

interface TreeNode {
  key: string;
  label: string;
  type: "file" | "directory";
  children?: TreeNode[];
}

const { skill } = defineProps<{ skill: Plugin }>();
const emit = defineEmits<{ saved: []; closed: [] }>();
const visible = ref(true);
const files = ref<string[]>([]);
const mainPath = ref("");
const filesLoading = ref(true);
const filesError = ref("");
const treeVersion = ref(0);
const selectedPath = ref("");
const draft = ref("");
const original = ref("");
const fileLoading = ref(true);
const fileError = ref("");
const saving = ref(false);
const creating = ref(false);
const moving = ref(false);
const confirming = ref(false);
const drafts = new Map<string, string>();
const dirtyPaths = ref(new Set<string>());
const headers = { "x-toonflow-workspace": "1" };
let controller = new AbortController();

// 单文件技能只有主文件本身，没有可管理的附属文件目录。
const isDirectorySkill = computed(() => files.value.length > 1 || files.value[0] !== mainPath.value);
const treeRoot = computed<TreeNode>(() => {
  const root: TreeNode = { key: "", label: skill.displayName, type: "directory", children: [] };
  const directories = new Map<string, TreeNode>([["", root]]);
  for (const path of files.value) {
    const parts = path.split("/");
    let parentKey = "";
    for (let index = 0; index < parts.length - 1; index++) {
      const key = parts.slice(0, index + 1).join("/");
      if (!directories.has(key)) {
        const node: TreeNode = { key, label: parts[index]!, type: "directory", children: [] };
        directories.get(parentKey)!.children!.push(node);
        directories.set(key, node);
      }
      parentKey = key;
    }
    directories.get(parentKey)!.children!.push({ key: path, label: parts.at(-1)!, type: "file" });
  }
  return root;
});

onBeforeUnmount(() => controller.abort());
onMounted(loadFiles);

async function loadFiles() {
  filesLoading.value = true;
  filesError.value = "";
  try {
    const { data } = await axios.get("/api/skills/list", { params: { name: skill.name }, headers, signal: controller.signal });
    if (data.code !== 200 || typeof data.data?.mainPath !== "string" || !Array.isArray(data.data.files) || !data.data.files.every((path: unknown) => typeof path === "string")) {
      throw new Error(data.message || "技能文件列表格式错误");
    }
    mainPath.value = data.data.mainPath;
    files.value = data.data.files;
    treeVersion.value++;
    if (!selectedPath.value || !files.value.includes(selectedPath.value)) await selectFile(mainPath.value);
  } catch (error) {
    if (!controller.signal.aborted) filesError.value = errorMessage(error, "读取技能文件列表失败，请重新打开重试");
  } finally {
    filesLoading.value = false;
  }
}

function errorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) return typeof error.response?.data?.message === "string" ? error.response.data.message : fallback;
  return error instanceof Error ? error.message : fallback;
}

async function selectFile(path: string) {
  if (path === selectedPath.value || saving.value) return;
  const previousPath = selectedPath.value;
  if (previousPath) {
    if (draft.value !== original.value) {
      drafts.set(previousPath, draft.value);
      dirtyPaths.value.add(previousPath);
    } else {
      drafts.delete(previousPath);
      dirtyPaths.value.delete(previousPath);
    }
  }
  selectedPath.value = path;
  const cached = drafts.get(path);
  draft.value = cached ?? "";
  original.value = "";
  fileError.value = "";
  fileLoading.value = true;
  controller.abort();
  const requestController = new AbortController();
  controller = requestController;
  try {
    const { data } = await axios.get("/api/skills/read", {
      params: path === mainPath.value ? { name: skill.name } : { name: skill.name, path },
      headers,
      signal: requestController.signal,
    });
    if (requestController.signal.aborted || selectedPath.value !== path) return;
    if (data.code !== 200 || typeof data.data?.content !== "string") throw new Error(data.message || "技能内容格式错误");
    original.value = data.data.content;
    if (cached === undefined) draft.value = data.data.content;
  } catch (error) {
    if (!requestController.signal.aborted && selectedPath.value === path) fileError.value = errorMessage(error, "读取文件失败，请重新选择重试");
  } finally {
    if (selectedPath.value === path) fileLoading.value = false;
  }
}

function handleNodeClick(data: TreeNode) {
  if (data.type === "file") selectFile(data.key);
}

function allowDrag(node: { data: Record<string, unknown> }) {
  const data = node.data as unknown as TreeNode;
  return data.type === "file" && data.key !== mainPath.value && !saving.value && !moving.value;
}

function parentOf(path: string) {
  return path.includes("/") ? path.slice(0, path.lastIndexOf("/")) : "";
}

function allowDrop(draggingNode: { data: Record<string, unknown> }, dropNode: { data: Record<string, unknown> }, type: string) {
  const drop = dropNode.data as unknown as TreeNode;
  if (type === "inner") return drop.type === "directory";
  // 仅允许拖到同目录内的兄弟文件前后调整顺序；跨目录移动统一走拖入目录节点。
  if (drop.type !== "file") return false;
  const dragging = draggingNode.data as unknown as TreeNode;
  return parentOf(dragging.key) === parentOf(drop.key);
}

async function handleNodeDrop(draggingNode: { data: Record<string, unknown> }, dropNode: { data: Record<string, unknown> }, dropType: string) {
  if (moving.value) return;
  const dragging = draggingNode.data as unknown as TreeNode;
  const drop = dropNode.data as unknown as TreeNode;
  const sourcePath = dragging.key;
  if (dropType === "inner") {
    const fileName = sourcePath.split("/").pop()!;
    const targetPath = drop.key ? `${drop.key}/${fileName}` : fileName;
    if (targetPath === sourcePath) { treeVersion.value++; return; }
    moving.value = true;
    try {
      const { data } = await axios.put("/api/skills/move", { name: skill.name, path: sourcePath, target: targetPath }, { headers });
      if (data.code !== 200) throw new Error(data.message || "移动文件失败");
      if (drafts.has(sourcePath)) { drafts.set(targetPath, drafts.get(sourcePath)!); drafts.delete(sourcePath); }
      if (dirtyPaths.value.has(sourcePath)) { dirtyPaths.value.add(targetPath); dirtyPaths.value.delete(sourcePath); }
      if (selectedPath.value === sourcePath) selectedPath.value = targetPath;
      await loadFiles();
    } catch (error) {
      toast.error(errorMessage(error, "移动文件失败，请重试"));
      treeVersion.value++;
    } finally {
      moving.value = false;
    }
    return;
  }
  // 同目录内调整顺序（dropType 为 before/after），不改变文件路径。
  const siblings = files.value.filter(path => path !== mainPath.value && path !== sourcePath);
  const dropIndex = siblings.indexOf(drop.key);
  const insertIndex = dropIndex < 0 ? siblings.length : dropType === "before" ? dropIndex : dropIndex + 1;
  siblings.splice(insertIndex, 0, sourcePath);
  moving.value = true;
  try {
    const { data } = await axios.put("/api/skills/order", { name: skill.name, order: siblings }, { headers });
    if (data.code !== 200) throw new Error(data.message || "保存顺序失败");
    await loadFiles();
  } catch (error) {
    toast.error(errorMessage(error, "保存顺序失败，请重试"));
    treeVersion.value++;
  } finally {
    moving.value = false;
  }
}

async function createFile() {
  if (creating.value || saving.value || !isDirectorySkill.value) return;
  const directory = selectedPath.value.includes("/") ? selectedPath.value.slice(0, selectedPath.value.lastIndexOf("/")) : "";
  let fileName: string;
  try {
    const { value } = await messageBox.prompt(directory ? `新文件将创建在“${directory}”目录` : "新文件将创建在技能根目录", "新建文件", {
      inputPattern: /^[^\\/]+$/,
      inputValidator: value => !!value?.trim() || "请输入文件名称",
      inputErrorMessage: "名称不能包含斜杠",
      confirmButtonText: "创建",
      cancelButtonText: "取消",
    });
    fileName = value.trim();
  } catch { return; }
  const path = directory ? `${directory}/${fileName}` : fileName;
  creating.value = true;
  try {
    const { data } = await axios.post("/api/skills/create", { name: skill.name, path }, { headers });
    if (data.code !== 200) throw new Error(data.message || "创建文件失败");
    await loadFiles();
    await selectFile(path);
  } catch (error) {
    toast.error(errorMessage(error, "创建文件失败，请重试"));
  } finally {
    creating.value = false;
  }
}

// 关闭入口（关闭按钮、右上角、遮罩、Esc）都经过此守卫，有未保存修改时须确认后才关闭。
async function close() {
  if (saving.value || confirming.value) return;
  if (draft.value !== original.value || dirtyPaths.value.size) {
    confirming.value = true;
    try {
      await messageBox.confirm("修改尚未保存，确定放弃修改并关闭吗？", "未保存的修改", { confirmButtonText: "放弃修改", cancelButtonText: "继续编辑", type: "warning" });
    } catch { return; }
    finally { confirming.value = false; }
  }
  visible.value = false;
}

async function save() {
  if (fileLoading.value || saving.value || fileError.value || confirming.value || draft.value === original.value) return;
  saving.value = true;
  const path = selectedPath.value;
  const content = draft.value;
  try {
    const { data } = await axios.put("/api/skills/save", { name: skill.name, ...(path === mainPath.value ? {} : { path }), content }, { headers });
    if (data.code !== 200) throw new Error(data.message || "保存文件失败");
    if (selectedPath.value === path) original.value = content;
    drafts.delete(path);
    dirtyPaths.value.delete(path);
    emit("saved");
    toast.success("已保存");
  } catch (error) {
    toast.error(errorMessage(error, "保存文件失败，请重试"));
  } finally {
    saving.value = false;
  }
}
</script>

<style lang="scss" scoped>
.skillEditor {
  display: flex;
  gap: 16px;
  min-height: min(60vh, 560px);

  .fileTree {
    display: flex;
    flex: none;
    flex-direction: column;
    gap: 8px;
    width: 220px;

    .newFileButton {
      width: 100%;
    }

    .tree {
      overflow-y: auto;
    }

    .treeItem {
      display: flex;
      align-items: center;
      gap: 6px;
      min-width: 0;
      font-size: 13px;
      overflow-wrap: anywhere;

      svg {
        flex-shrink: 0;
        color: var(--muted-foreground);
      }

      .treeLabel {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .dirtyMark {
        flex-shrink: 0;
        color: var(--el-color-warning);
      }
    }
  }

  .fileEditor {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 8px;
    min-width: 0;

    .fileHint {
      margin: 0;
      color: var(--muted-foreground);
      font-size: 12px;
    }

    .sourceInput {
      flex: 1;
      min-height: min(56vh, 520px);
      resize: none;
      field-sizing: fixed;
      font-family: ui-monospace, Consolas, monospace;
      line-height: 1.6;
      tab-size: 2;
    }
  }
}
</style>
