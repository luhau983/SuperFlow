<template>
  <div class="home" :inert="creating || opening || workspaceStore.projectLoadingVisible">
    <uiSidebarProvider class="homeLayout">
      <uiSidebar collapsible="icon" aria-label="首页侧栏">
        <uiSidebarHeader>
          <uiSidebarMenu>
            <uiSidebarMenuItem>
              <uiSidebarMenuButton size="lg" class="pointer-events-none">
                <img class="size-8 shrink-0" :src="logoUrl" alt="SuperFlow" />
                <span class="truncate text-lg font-semibold tracking-tight">SuperFlow</span>
              </uiSidebarMenuButton>
            </uiSidebarMenuItem>
          </uiSidebarMenu>
        </uiSidebarHeader>
        <uiSidebarContent>
          <uiSidebarGroup>
            <uiSidebarGroupLabel>导航</uiSidebarGroupLabel>
            <uiSidebarMenu aria-label="首页导航">
              <uiSidebarMenuItem v-for="section in homeSections" :key="section.id">
                <uiSidebarMenuButton :isActive="activeSection === section.id" :tooltip="translate(section.label)" :aria-current="activeSection === section.id ? 'location' : undefined" @click="scrollToSection(section.id)">
                  <component :is="section.icon" aria-hidden="true" />
                  <span>{{ translate(section.label) }}</span>
                </uiSidebarMenuButton>
              </uiSidebarMenuItem>
              <uiSidebarMenuItem v-if="currentUser?.role !== 'user'">
                <uiSidebarMenuButton :isActive="assetsVisible" tooltip="素材库" aria-haspopup="dialog" :aria-expanded="assetsVisible" @click="assetsVisible = true">
                  <icon-library-photo aria-hidden="true" />
                  <span>素材库</span>
                </uiSidebarMenuButton>
              </uiSidebarMenuItem>
            </uiSidebarMenu>
          </uiSidebarGroup>
        </uiSidebarContent>
        <uiSidebarFooter>
          <uiSidebarMenu>
            <uiSidebarMenuItem v-if="!publicWeb">
              <uiSidebarMenuButton :tooltip="mobileConnectionLabel" :class="{ 'text-green-600 dark:text-green-500': deviceHubEnabled || mobileConnection.online === true }" @click="mobileConnectVisible = true">
                <span class="relative inline-flex shrink-0">
                  <component :is="deviceHubEnabled || mobileConnection.mode === 'remote' ? IconDeviceDesktop : IconQrcode" class="size-4" aria-hidden="true" />
                  <span v-if="deviceHubEnabled || mobileConnection.online === true" class="statusDot bg-green-500" />
                </span>
                <span>{{ mobileConnectionLabel }}</span>
              </uiSidebarMenuButton>
            </uiSidebarMenuItem>
            <uiSidebarMenuItem>
              <uiSidebarMenuButton :tooltip="hasDesktopUpdate ? '设置，有新版本可用' : '设置'" @click="settingsVisible = true">
                <span class="relative inline-flex shrink-0">
                  <icon-settings class="size-4" aria-hidden="true" />
                  <span v-if="hasDesktopUpdate" class="statusDot bg-destructive" />
                </span>
                <span>设置</span>
              </uiSidebarMenuButton>
            </uiSidebarMenuItem>
            <uiSidebarMenuItem>
              <uiSidebarMenuButton asChild tooltip="GitHub">
                <a href="https://github.com/HBAI-Ltd/Toonflow-app" target="_blank" rel="noopener noreferrer">
                  <icon-brand-github aria-hidden="true" />
                  <span>GitHub</span>
                </a>
              </uiSidebarMenuButton>
            </uiSidebarMenuItem>
          </uiSidebarMenu>
        </uiSidebarFooter>
        <uiSidebarRail />
      </uiSidebar>
      <uiSidebarInset class="homeInset">
        <header class="homeHeader">
          <uiSidebarTrigger class="-ms-1" />
          <uiSeparator orientation="vertical" class="me-2 data-[orientation=vertical]:h-4" />
          <span class="text-sm font-medium">{{ translate(homeSections.find(section => section.id === activeSection)?.label ?? "首页") }}</span>
        </header>
        <div ref="pageScroll" class="pageScroll" @scroll.passive="updateActiveSection">
          <bg class="pageBackground" :scrollTop="backgroundScrollTop" />
          <main class="pageContent">
            <section class="creationPanel" data-home-section="home" aria-label="创建项目">
              <div class="brand">
                <img class="brandLogo" :src="logoUrl" alt="SuperFlow" />
                <h1>今天要做点什么？</h1>
              </div>
              <div class="promptArea">
                <uiCard class="promptCard" :class="{ draggingAttachments }" @dragenter.capture="dragEnterAttachments" @dragover.capture="dragOverAttachments" @dragleave.capture="dragLeaveAttachments" @drop.capture="dropAttachments">
                  <div v-if="draggingAttachments" class="attachmentDropOverlay" role="status" aria-live="polite">
                    <icon-paperclip :size="20" aria-hidden="true" />
                    <strong>松开添加附件</strong>
                    <span>图片、视频、文档或代码文件</span>
                  </div>
                  <input ref="attachmentInput" type="file" :accept="attachmentAccept" multiple hidden :disabled="creating || opening" @change="selectAttachments" />
                  <uiCardContent class="promptBody">
                    <attachmentList v-if="promptAttachments.length" class="promptAttachments" :attachments="promptAttachments" removable restorable :disabled="creating || opening" @remove="promptAttachments.splice($event, 1)" @restore="restoreAttachment" />
                    <uiTextarea ref="promptInput" v-model="prompt" class="promptTextarea" :disabled="creating || opening" :placeholder="promptPlaceholder" aria-label="创作描述" @paste.capture="pasteAttachments" />
                  </uiCardContent>
                  <uiCardFooter class="composerFooter">
                    <div class="composerTools">
                      <uiButton class="attachmentButton rounded-full" variant="secondary" size="icon" :disabled="creating || opening" aria-label="添加附件" title="添加附件" @click="attachmentInput?.click()">
                        <icon-paperclip aria-hidden="true" />
                      </uiButton>
                      <workspacePicker ref="promptWorkspacePicker" v-model="workspaceDirectory" :disabled="creating || opening" />
                    </div>
                    <div class="sendActions">
                      <modelPopover v-model="selectedModel" v-model:reasoningEffort="reasoningEffort" class="modelSelect" :disabled="creating || opening" />
                      <uiButton class="sendButton" :class="{ 'size-9 rounded-full p-0': !!workspaceDirectory }" :disabled="creating || opening" :aria-busy="creating" :aria-label="workspaceDirectory ? '发送' : '选择工作目录'" @click="workspaceDirectory ? createProject() : promptWorkspacePicker?.chooseDirectory()">
                        <icon-loader-2 v-if="creating" class="animate-spin" aria-hidden="true" />
                        <icon-arrow-up v-else-if="workspaceDirectory" aria-hidden="true" />
                        <icon-folder v-else aria-hidden="true" />
                        <span v-if="!workspaceDirectory">选择工作目录</span>
                      </uiButton>
                    </div>
                  </uiCardFooter>
                </uiCard>
                <p v-if="!workspaceDirectory" class="workspaceHint" role="status">请先选择一个空文件夹作为工作目录，画布和素材会保存在这里。</p>
              </div>
            </section>
            <section class="projectList" data-home-section="projects" aria-labelledby="projectListTitle">
              <h2 id="projectListTitle" class="sr-only">项目</h2>
              <uiTabs v-model="projectType">
                <uiTabsList class="projectTabs">
                  <uiTabsTrigger value="local">项目</uiTabsTrigger>
                  <uiTabsTrigger value="team">团队项目</uiTabsTrigger>
                </uiTabsList>
                <uiTabsContent value="local" class="projectItems">
                  <uiCard class="projectLaunchCard">
                    <button class="projectLaunch" type="button" :disabled="creating || opening || relocationPicker?.selecting" :aria-busy="creating || relocationPicker?.selecting" title="选择空文件夹新建，或打开已有项目" @click="createProject(false)">
                      <span class="launchIcon">
                        <icon-loader-2 v-if="creating || relocationPicker?.selecting" class="animate-spin" :size="24" aria-hidden="true" />
                        <icon-plus v-else :size="24" aria-hidden="true" />
                      </span>
                      <span class="launchText">
                        <span class="launchTitle">新建项目</span>
                        <span class="launchDescription">或打开已有项目</span>
                      </span>
                    </button>
                  </uiCard>
                  <projectCard v-for="project in sortedProjects" :key="project.directory" :project="project" :disabled="creating || opening" :actionsLoading="exportingDirectory === project.directory" @select="openProject(project)">
                    <template #actions>
                      <uiDropdownMenuItem :disabled="creating || opening || exportingDirectory === project.directory" @select="renameProject(project)">
                        <icon-edit aria-hidden="true" />
                        <span>重命名</span>
                      </uiDropdownMenuItem>
                      <uiDropdownMenuItem :disabled="creating || opening || !!exportingDirectory" @select="exportProject(project)">
                        <icon-file-zip aria-hidden="true" />
                        <span>打包导出 ZIP</span>
                      </uiDropdownMenuItem>
                      <uiDropdownMenuSeparator />
                      <uiDropdownMenuItem variant="destructive" :disabled="creating || opening || exportingDirectory === project.directory" title="从列表移除，不删除文件" @select="workspaceStore.removeProject(project.directory)">
                        <icon-trash aria-hidden="true" />
                        <span>移除项目</span>
                      </uiDropdownMenuItem>
                    </template>
                  </projectCard>
                </uiTabsContent>
                <uiTabsContent value="team" class="teamProjects" />
              </uiTabs>
            </section>
          </main>
        </div>
      </uiSidebarInset>
      <assetLibraryDialog v-if="currentUser?.role !== 'user'" v-model="assetsVisible" />
      <settings ref="settingsDialog" v-model="settingsVisible" />
      <mobileConnect v-if="!publicWeb" v-model="mobileConnectVisible" />
      <workspacePicker ref="relocationPicker" hideTrigger />
    </uiSidebarProvider>
  </div>
</template>

<script setup lang="ts">
import { locale, translate } from "@toonflow/i18n/vue";
import axios from "axios";
import { storeToRefs } from "pinia";
import { computed, defineAsyncComponent, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";
import messageBox from "@/lib/messageBox";
import { getReadableFileMimeType, readableFileAccept } from "@toonflow/server/documentFormats";
import { IconQrcode, IconDeviceDesktop, IconHome, IconFolder } from "@tabler/icons-vue";
import modelPopover from "@/components/modelPopover.vue";
import attachmentList from "@/components/agent/attachmentList.vue";
import { createPastedTextFile, readTextAttachment } from "@/components/agent/textAttachments";
import type { AgentAttachment } from "@/components/agent/types";
import logoUrl from "@toonflow/assets/logo.svg";
import { useWorkspaceStore, type Project } from "@/stores/workspace";
import { currentUser, publicWeb } from "@/stores/multiTenant";
import { hasDesktopUpdate } from "@/stores/desktopUpdate";
import { deviceHubEnabled, mobileConnection, mobileConnectionLabel } from "@/lib/mobile";
import useWorkspaceFiles from "@/lib/workspaceFiles";
import saveFile from "@/lib/saveFile";
import http from "@/lib/http";
import { waitForControlValue } from "@/lib/mcpControl";
import settings from "@/components/settings/index.vue";
import assetLibraryDialog from "./assetLibraryDialog.vue";
import bg from "./bg.vue";
import projectCard from "./projectCard.vue";
import workspacePicker from "./workspacePicker.vue";
import { uiButton } from "@/components/ui/button";
import { uiCard, uiCardContent, uiCardFooter } from "@/components/ui/card";
import { uiDropdownMenuItem, uiDropdownMenuSeparator } from "@/components/ui/dropdownMenu";
import { uiSeparator } from "@/components/ui/separator";
import { uiSidebar, uiSidebarContent, uiSidebarFooter, uiSidebarGroup, uiSidebarGroupLabel, uiSidebarHeader, uiSidebarInset, uiSidebarMenu, uiSidebarMenuButton, uiSidebarMenuItem, uiSidebarProvider, uiSidebarRail, uiSidebarTrigger } from "@/components/ui/sidebar";
import { uiTabs, uiTabsContent, uiTabsList, uiTabsTrigger } from "@/components/ui/tabs";
import { uiTextarea } from "@/components/ui/textarea";

const settingsVisible = ref(false);
const settingsDialog = ref<InstanceType<typeof settings>>();
const assetsVisible = ref(false);
const mobileConnectVisible = ref(false);
const pageScroll = ref<HTMLDivElement>();
const backgroundScrollTop = ref(0);
const activeSection = ref("home");
const projectType = ref<"local" | "team">("local");
const homeSections = [
  { id: "home", label: "首页", icon: IconHome },
  { id: "projects", label: "项目", icon: IconFolder },
];
const mobileConnect = defineAsyncComponent(() => import("@/components/mobileConnect.vue"));
const router = useRouter();
const pageLifetime = new AbortController();
const creating = ref(false);
const opening = ref(false);
const exportingDirectory = ref("");
const promptWorkspacePicker = ref<InstanceType<typeof workspacePicker>>();
const relocationPicker = ref<InstanceType<typeof workspacePicker>>();
const prompt = ref("");
const promptInput = ref<{ $el: HTMLTextAreaElement }>();
const promptAttachments = ref<AgentAttachment[]>([]);
const attachmentInput = ref<HTMLInputElement>();
const attachmentAccept = `image/*,video/*,${readableFileAccept}`;
const draggingAttachments = ref(false);
let attachmentDragDepth = 0;
const workspaceStore = useWorkspaceStore();
const { project, projectList } = storeToRefs(workspaceStore);
const workspaceDirectory = ref(project.value?.directory ?? "");
const placeholderPhrases = [
  "描述你想创作的内容，让灵感从这里开始…",
  "把一个故事灵感，变成一段精彩的短片…",
  "为你的主角设计独特的外形和性格…",
  "创作一段雨夜街头的电影感镜头…",
  "把这段文字拆解成连贯的分镜画面…",
  "为一场奇幻冒险生成场景和角色…",
  "为你的画面配上一段合适的音乐…",
  "写一段温暖的旁白，讲述这个故事…",
  "设计一支富有想象力的产品宣传片…",
  "从一句话开始，搭建你的创作工作流…",
];
const promptPlaceholder = ref(translate(placeholderPhrases[0]!));

onMounted(() => {
  window.addEventListener("dragend", clearAttachmentDrag, true);
  window.addEventListener("drop", clearAttachmentDrag, true);
  window.addEventListener("blur", clearAttachmentDrag);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let phraseIndex = 0;
  watch([() => !!prompt.value, locale], ([hasInput], _previous, onCleanup) => {
    if (reduceMotion) {
      promptPlaceholder.value = translate(placeholderPhrases[0]!);
      return;
    }
    if (hasInput) return;
    const segmenter = new Intl.Segmenter(locale.value, { granularity: "grapheme" });
    const phrases = placeholderPhrases.map(phrase => [...segmenter.segment(translate(phrase))].map(part => part.segment));
    let characterCount = 0;
    let deleting = false;
    let timer: ReturnType<typeof setTimeout>;
    promptPlaceholder.value = "";

    function typePlaceholder() {
      const phrase = phrases[phraseIndex]!;
      characterCount += deleting ? -1 : 1;
      promptPlaceholder.value = phrase.slice(0, characterCount).join("");
      let delay = deleting ? 35 : 85;
      if (characterCount === phrase.length) {
        deleting = true;
        delay = 1800;
      } else if (characterCount === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % placeholderPhrases.length;
        delay = 300;
      }
      timer = setTimeout(typePlaceholder, delay);
    }

    timer = setTimeout(typePlaceholder, 300);
    onCleanup(() => clearTimeout(timer));
  }, { immediate: true });
});

onUnmounted(() => {
  pageLifetime.abort();
  if (router.currentRoute.value.path !== "/workspace") workspaceStore.projectLoading = false;
  window.removeEventListener("dragend", clearAttachmentDrag, true);
  window.removeEventListener("drop", clearAttachmentDrag, true);
  window.removeEventListener("blur", clearAttachmentDrag);
});
watch([creating, opening], ([creating, opening]) => {
  if (creating || opening) {
    clearAttachmentDrag();
    workspaceStore.projectLoadingDrawn = false;
    workspaceStore.projectLoading = true;
  } else if (router.currentRoute.value.path !== "/workspace") {
    workspaceStore.projectLoading = false;
  }
}, { flush: "sync" });

const selectedModel = ref("");
const reasoningEffort = ref("");
const sortedProjects = computed(() => [...projectList.value].sort((left, right) => right.lastOpenedAt - left.lastOpenedAt));

function scrollToSection(section: string) {
  const wrap = pageScroll.value;
  const target = wrap?.querySelector<HTMLElement>(`[data-home-section="${section}"]`);
  if (!wrap || !target) return;
  activeSection.value = section;
  wrap.scrollTo({
    top: section === "home" ? 0 : wrap.scrollTop + target.getBoundingClientRect().top - wrap.getBoundingClientRect().top - 32,
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
  });
}

function updateActiveSection() {
  const wrap = pageScroll.value;
  if (!wrap) return;
  backgroundScrollTop.value = wrap.scrollTop;
  if (wrap.scrollTop > 0 && wrap.scrollTop + wrap.clientHeight >= wrap.scrollHeight - 2) {
    activeSection.value = homeSections.at(-1)!.id;
    return;
  }
  const top = wrap.getBoundingClientRect().top + 120;
  for (const section of wrap.querySelectorAll<HTMLElement>("[data-home-section]")) {
    if (section.getBoundingClientRect().top <= top) activeSection.value = section.dataset.homeSection!;
  }
}

function pasteAttachments(event: ClipboardEvent) {
  if (creating.value || opening.value) return;
  try {
    const files = Array.from(event.clipboardData?.files ?? []);
    if (!files.length) {
      const file = createPastedTextFile(event.clipboardData?.getData("text/plain") ?? "");
      if (file) files.push(file);
    }
    if (!files.length) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    addAttachments(files);
  } catch (error) {
    event.preventDefault();
    event.stopImmediatePropagation();
    toast.error(error instanceof Error ? error.message : "添加附件失败，请重试");
  }
}

function selectAttachments(event: Event) {
  const input = event.target as HTMLInputElement;
  addAttachments(Array.from(input.files ?? []));
  input.value = "";
}

function clearAttachmentDrag() {
  attachmentDragDepth = 0;
  draggingAttachments.value = false;
}

function dragEnterAttachments(event: DragEvent) {
  if (!event.dataTransfer?.types.includes("Files")) return;
  event.preventDefault();
  event.stopPropagation();
  if (creating.value || opening.value) return clearAttachmentDrag();
  attachmentDragDepth++;
  draggingAttachments.value = true;
}

function dragOverAttachments(event: DragEvent) {
  if (!event.dataTransfer?.types.includes("Files")) return;
  event.preventDefault();
  event.stopPropagation();
  event.dataTransfer.dropEffect = creating.value || opening.value ? "none" : "copy";
  if (creating.value || opening.value) return clearAttachmentDrag();
  attachmentDragDepth = Math.max(1, attachmentDragDepth);
  draggingAttachments.value = true;
}

function dragLeaveAttachments(event: DragEvent) {
  if (!draggingAttachments.value) return;
  attachmentDragDepth = Math.max(0, attachmentDragDepth - 1);
  const target = event.currentTarget;
  if (!attachmentDragDepth || (target instanceof Node && event.relatedTarget instanceof Node && !target.contains(event.relatedTarget))) clearAttachmentDrag();
}

function dropAttachments(event: DragEvent) {
  if (!event.dataTransfer?.types.includes("Files")) return;
  event.preventDefault();
  event.stopPropagation();
  clearAttachmentDrag();
  addAttachments(Array.from(event.dataTransfer.files));
}

function addAttachments(files: File[]) {
  if (creating.value || opening.value) return;
  for (const file of files) {
    const readableMimeType = getReadableFileMimeType(file.name, file.type);
    const mimeType = readableMimeType ?? file.type.split(";")[0]!.trim().toLowerCase();
    if (!readableMimeType && !/^(image|video)\//.test(mimeType)) {
      toast.warning("只支持图片、视频和受支持的文本或文档文件");
      continue;
    }
    if (!file.size || file.size > 100 * 1024 * 1024) {
      toast.warning("附件不能为空且不能超过 100 MB");
      continue;
    }
    if (mimeType === "text/plain" && file.size > 400000) {
      toast.warning("文本附件不能超过 400 KB（400000 字节），请缩减内容后重试。");
      continue;
    }
    if (promptAttachments.value.length >= 20) {
      toast.warning("每条消息最多添加 20 个附件");
      break;
    }
    promptAttachments.value.push({ name: file.name, path: "", mimeType, file });
  }
}

async function restoreAttachment(index: number) {
  const attachment = promptAttachments.value[index];
  if (attachment?.mimeType !== "text/plain" || creating.value || opening.value) return;
  try {
    const text = await readTextAttachment(attachment);
    const currentIndex = promptAttachments.value.indexOf(attachment);
    if (currentIndex < 0 || creating.value || opening.value) return;
    prompt.value += `${prompt.value ? "\n" : ""}${text}`;
    promptAttachments.value.splice(currentIndex, 1);
    await nextTick();
    promptInput.value?.$el.focus();
    promptInput.value?.$el.setSelectionRange(prompt.value.length, prompt.value.length);
  } catch (error) {
    toast.error(error instanceof Error ? error.message : "取回文本失败，请重试");
  }
}

async function enterWorkspace() {
  await waitForControlValue(() => workspaceStore.projectLoadingDrawn || undefined, pageLifetime.signal).catch(error => {
    if (!pageLifetime.signal.aborted) throw error;
  });
  if (pageLifetime.signal.aborted) return;
  if (!document.hidden) await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
  if (pageLifetime.signal.aborted) return;
  await router.push("/workspace");
}

async function openProject(project: Project) {
  if (creating.value || opening.value) return;
  opening.value = true;
  try {
    const directory = project.directory;
    try { await workspaceStore.openProject(directory); }
    catch (err) {
      if (!axios.isAxiosError(err) || err.response?.status !== 404) throw err;
      const reselect = await messageBox.confirm(`项目“${project.name}”的文件夹不存在，是否重新选择文件夹？`, "工作目录不存在", {
        confirmButtonText: "重新选择", cancelButtonText: "取消", type: "warning",
      }).then(() => true, () => false);
      if (!reselect) return;
      const directory = await relocationPicker.value?.chooseDirectory();
      if (!directory) return;
      await workspaceStore.openProject(directory, project.directory);
    }
    await enterWorkspace();
  } catch (err) {
    toast.error(axios.isAxiosError<{ message?: string }>(err)
      ? err.response?.data.message || "无法打开项目，请重试"
      : err instanceof Error ? err.message : "无法打开项目，请重试");
  } finally { opening.value = false; }
}

async function exportProject(project: Project) {
  if (creating.value || opening.value || exportingDirectory.value) return;
  const directory = project.directory;
  exportingDirectory.value = directory;
  try {
    let name = project.name.replace(/[<>:"/\\|?*\x00-\x1f\x7f-\x9f]/g, "_").slice(0, 120).replace(/[. ]+$/, "");
    if (!name || /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(name)) name = "SuperFlow";
    const files = useWorkspaceFiles(directory);
    await saveFile(() => files.exportZip(pageLifetime.signal), `${name}.zip`);
  } catch (error) {
    if (pageLifetime.signal.aborted) return;
    let message = error instanceof Error ? error.message : translate("导出项目失败，请重试");
    if (axios.isAxiosError(error)) {
      const data = error.response?.data instanceof Blob
        ? await error.response.data.text().then(JSON.parse).catch(() => null) : error.response?.data;
      if (typeof data?.message === "string") message = data.message;
    }
    toast.error(message);
  } finally { exportingDirectory.value = ""; }
}

async function renameProject(project: Project) {
  const result = await messageBox.prompt("请输入项目名称", "重命名项目", {
    inputValue: project.name, confirmButtonText: "保存", cancelButtonText: "取消",
    inputValidator: value => !!value?.trim() || "项目名称不能为空",
  }).catch(() => null);
  if (result) workspaceStore.renameProject(project.directory, result.value);
}

async function createProject(fromPrompt = true) {
  if (creating.value || opening.value || (fromPrompt && !workspaceDirectory.value)) return;
  const path = fromPrompt ? workspaceDirectory.value : await relocationPicker.value?.chooseDirectory();
  if (!path || creating.value || opening.value || pageLifetime.signal.aborted) return;
  creating.value = true;
  try {
    const { directory, empty } = await useWorkspaceFiles(path).list();
    if (fromPrompt && !empty) return toast.warning("该文件夹不为空，请重新选择空文件夹；已有项目请使用“新建项目”入口或点击项目列表打开。");
    if (empty) await useWorkspaceFiles(directory).writeJson("画布1.json", { toonflowCanvas: true, nodes: [], edges: [], viewport: { x: 0, y: 0, zoom: 1 } }, true);
    await workspaceStore.openProject(directory);
    if (fromPrompt && (prompt.value.trim() || promptAttachments.value.length)) {
      workspaceStore.pendingAgentMessage = { directory: workspaceStore.project!.directory, prompt: prompt.value, attachments: [...promptAttachments.value], model: selectedModel.value, reasoningEffort: reasoningEffort.value };
    }
    await enterWorkspace();
  } catch (err) {
    toast.error(axios.isAxiosError<{ message?: string }>(err)
      ? err.response?.data.message || "无法打开或创建项目，请重试"
      : err instanceof Error ? err.message : "无法打开或创建项目，请重试");
  } finally {
    creating.value = false;
  }
}
</script>

<style lang="scss" scoped>
.home {
  height: 100dvh;
  min-height: 0;
  overflow: hidden;
  color: var(--foreground);

  .homeLayout { height: 100%; min-height: 0; }

  .statusDot {
    position: absolute;
    top: -2px;
    inset-inline-end: -3px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    box-shadow: 0 0 0 2px var(--sidebar);
  }

  .homeInset {
    min-width: 0;
    min-height: 0;
    height: 100dvh;
    overflow: hidden;

    .homeHeader {
      display: flex;
      align-items: center;
      flex-shrink: 0;
      gap: 8px;
      height: 56px;
      padding: 0 16px;
      border-bottom: 1px solid var(--border);
    }

    .pageScroll {
      position: relative;
      flex: 1;
      min-height: 0;
      overflow-y: auto;

      .pageBackground {
        position: absolute;
        inset: 0;
      }

      .pageContent {
        position: relative;
        padding: 24px clamp(20px, 4vw, 56px) 56px;

        .creationPanel {
          max-width: 800px;
          margin: clamp(32px, 6vh, 64px) auto 56px;

          .brand {
            display: flex;
            align-items: center;
            gap: clamp(8px, 1vw, 12px);
            margin-bottom: 28px;

            .brandLogo {
              flex-shrink: 0;
              width: clamp(28px, 3.4vw, 44px);
              height: clamp(28px, 3.4vw, 44px);
            }

            h1 {
              margin: 0;
              font-size: clamp(22px, 3vw, 34px);
              font-weight: 600;
              line-height: 1.3;
              letter-spacing: -0.5px;
            }
          }

          .promptArea {
            position: relative;

            .promptCard {
              position: relative;
              gap: 0;
              padding: 0;
              border-radius: calc(var(--radius) * 2);
              background: color-mix(in oklch, var(--card) 80%, transparent);
              transition: border-color 0.2s, box-shadow 0.2s;

              &:focus-within, &.draggingAttachments {
                border-color: color-mix(in oklch, var(--ring) 60%, var(--border));
                box-shadow: 0 0 0 3px color-mix(in oklch, var(--ring) 20%, transparent);
              }

              .attachmentDropOverlay {
                position: absolute;
                inset: 0;
                z-index: 2;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 4px;
                border-radius: inherit;
                background: var(--background);
                pointer-events: none;

                > svg { color: var(--muted-foreground); }
                strong { font-size: 14px; font-weight: 500; }
                span { color: var(--muted-foreground); font-size: 12px; }
              }

              .promptBody {
                padding: 20px 22px 8px;

                .promptAttachments { margin-bottom: 12px; }

                .promptTextarea {
                  min-height: calc(1.9em * 3 + 8px);
                  max-height: calc(1.9em * 8 + 8px);
                  padding: 4px 0;
                  border: 0;
                  border-radius: 0;
                  background: transparent;
                  box-shadow: none;
                  font-size: 15px;
                  line-height: 1.9;
                  resize: none;

                  &:focus-visible { box-shadow: none; }
                }
              }

              .composerFooter {
                display: flex;
                align-items: center;
                justify-content: space-between;
                flex-wrap: wrap;
                gap: 10px;
                padding: 8px 14px 14px;

                .composerTools {
                  display: flex;
                  align-items: center;
                  flex: 1 1 160px;
                  min-width: 0;
                  gap: 6px;

                  .attachmentButton { flex-shrink: 0; }

                  :deep(.workspaceButton) {
                    max-width: calc(100% - 42px);
                    height: 36px;
                    margin: 0;
                    padding: 0 10px;
                    border-radius: calc(var(--radius) * 2);
                  }
                }

                .sendActions {
                  display: flex;
                  align-items: center;
                  justify-content: flex-end;
                  min-width: 0;
                  max-width: 100%;
                  margin-inline-start: auto;
                  gap: 8px;

                  .modelSelect {
                    min-width: 0;
                    max-width: 280px;

                    :deep(.modelButton) {
                      height: 36px;
                      border-radius: calc(var(--radius) * 2);
                    }
                  }

                  .sendButton { flex-shrink: 0; }
                }

                @media (max-width: 560px) {
                  .composerTools { flex-basis: 100%; }

                  .sendActions {
                    width: 100%;
                    justify-content: space-between;

                    .modelSelect { flex: 1; }
                  }
                }
              }

              @media (prefers-reduced-motion: reduce) { transition: none; }
            }

            .workspaceHint {
              margin: 12px 16px 0;
              color: var(--muted-foreground);
              font-size: 12px;
              line-height: 1.7;
            }
          }
        }

        .projectList {
          max-width: 1280px;
          margin: 0 auto;

          .projectTabs { margin-bottom: 20px; }

          .teamProjects { min-height: 240px; }

          .projectItems {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(min(100%, 220px), 1fr));
            grid-auto-rows: 1fr;
            gap: 20px;

            .projectLaunchCard {
              position: relative;
              padding: 0;
              border-style: dashed;
              border-radius: calc(var(--radius) * 2);
              background: color-mix(in oklch, var(--card) 80%, transparent);

              &:focus-within { border-color: var(--ring); }

              .projectLaunch {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 12px;
                width: 100%;
                height: 100%;
                min-height: 240px;
                padding: 20px;
                border: 0;
                border-radius: inherit;
                background: transparent;
                color: inherit;
                font: inherit;
                text-align: center;
                cursor: pointer;

                &:hover { background: var(--accent); }
                &:focus-visible { outline: 2px solid var(--ring); outline-offset: -2px; }
                &:disabled { cursor: wait; opacity: 0.6; }

                .launchIcon {
                  display: grid;
                  place-items: center;
                  width: 36px;
                  height: 36px;
                  border-radius: 50%;
                  background: var(--primary);
                  color: var(--primary-foreground);
                }

                .launchText {
                  display: flex;
                  flex-direction: column;
                  gap: 6px;

                  .launchTitle { font-size: 15px; font-weight: 500; line-height: 1.8; }
                  .launchDescription { color: var(--muted-foreground); font-size: 13px; line-height: 1.6; }
                }
              }
            }
          }
        }
      }
    }
  }

  @media (max-width: 560px) {
    .homeInset .pageScroll .pageContent { padding: 24px 16px 40px; }
  }
}
</style>
