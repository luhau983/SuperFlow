<template>
  <div class="providerList">
    <div class="itemList">
      <toonflowProviderCard scope="media" :provider="providers.find(item => item.id === 'toonflow')" />
      <uiCard v-for="item in visibleProviders" :key="item.fileName" class="providerItem" style="gap:0; padding:0">
        <div class="cardBody" :style="{ padding: '20px' }">
          <div class="providerHeader">
            <div v-if="item.icon" class="providerMark" aria-hidden="true">
              <img class="providerLogo" :src="item.icon" alt="" />
            </div>
            <div class="providerInfo">
              <div class="providerHeading">
                <strong class="providerName" data-ui-text="default">{{ item.label }}</strong>
              </div>
              <span class="providerId" :title="item.fileName" data-ui-text="info">{{ item.fileName }}</span>
            </div>
          </div>
          <uiAlert v-if="item.loadError" variant="destructive">
            <uiAlertTitle class="whitespace-normal overflow-visible line-clamp-none">{{ item.loadError }}</uiAlertTitle>
          </uiAlert>
          <div class="providerFooter">
            <div class="providerMeta">
              <uiBadge v-if="item.version" variant="outline">v{{ item.version }}</uiBadge>
              <span data-ui-text="info">{{ item.models.length }}个模型</span>
            </div>
            <div class="itemActions" style="display:flex; flex-wrap:wrap; align-items:center; gap:8px">
              <uiButton
                v-if="item.modelsUrl"
                @click="fetchModels(item)"
                variant="ghost"
                type="button"
                :disabled="(!!fetchingFile || !!deletingFile || !!item.loadError || !item.revision) || (fetchingFile === item.fileName)"><icon-loader-2 v-if="fetchingFile === item.fileName" class="animate-spin" aria-hidden="true" /><component :is="IconDownload" aria-hidden="true" />获取模型</uiButton>
              <uiButton @click="editProvider(item)" variant="ghost" type="button" :disabled="(!!fetchingFile || !!deletingFile || !!item.loadError)"><component :is="IconEdit" aria-hidden="true" />编辑模型</uiButton>
              <uiButton
                @click="editProviderCode(item)"
                variant="ghost"
                type="button"
                :disabled="(!!fetchingFile || !!deletingFile || !item.revision)"><component :is="IconCode" aria-hidden="true" />编辑代码</uiButton>
              <uiPopover v-model:open="confirmVisible1[String(item.fileName)]">
                <uiPopoverTrigger asChild>
                  <uiButton
                    variant="ghost"
                    type="button"
                    :disabled="(!!fetchingFile || !!deletingFile || !item.revision) || (deletingFile === item.fileName)"><icon-loader-2 v-if="deletingFile === item.fileName" class="animate-spin" aria-hidden="true" /><component :is="IconTrash" aria-hidden="true" />删除</uiButton>
                </uiPopoverTrigger>
                <uiPopoverContent class="w-[280px]">
                  <p>确定删除此供应商及其模型？</p>
                  <div class="confirmActions">
                    <uiButton type="button" variant="outline" size="sm" @click="confirmVisible1[String(item.fileName)] = false; ">取消</uiButton>
                    <uiButton type="button" size="sm" @click="confirmVisible1[String(item.fileName)] = false; deleteProvider(item)">删除</uiButton>
                  </div>
                </uiPopoverContent>
              </uiPopover>
            </div>
          </div>
        </div>
      </uiCard>
    </div>
    <div class="providerActions">
      <uiButton class="addButton" @click="openAdd('builtin')" variant="outline" type="button"><component :is="IconPlus" aria-hidden="true" />添加供应商</uiButton>
      <uiButton class="addButton" @click="openAdd('custom')" variant="outline" type="button"><component :is="IconSettings" aria-hidden="true" />添加自定义供应商</uiButton>
    </div>
    <component
      :is="mediaProviderDialog"
      v-model="providerDialogVisible"
      :mode="addMode"
      :provider="editingSourceProvider"
      @added="saveProviderItem"
      @saved="saveProviderItem" />
    <component :is="editProviderDialog" v-model="editorVisible" :provider="editingProvider" @saved="saveProviderItem" />
  </div>
</template>

<script setup lang="ts">
import { uiPopover, uiPopoverTrigger, uiPopoverContent } from "@/components/ui/popover";
import { uiButton } from "@/components/ui/button";
import { uiBadge } from "@/components/ui/badge";
import { uiAlert, uiAlertTitle } from "@/components/ui/alert";
import { uiCard } from "@/components/ui/card";
import { translate } from "@toonflow/i18n/vue";
import axios from "axios";
import { computed, defineAsyncComponent, onMounted, onBeforeUnmount, ref, shallowRef, type Component } from "vue";
import { toast } from "vue-sonner";
import { IconPlus, IconSettings, IconEdit, IconTrash, IconDownload, IconCode } from "@tabler/icons-vue";
import type { MediaProvider } from "@toonflow/provider-web/types";
import { saveSettings } from "@/stores/settings";
import { invalidateNodeModels } from "@toonflow/nodes-scaffold/nodeAi";
import toonflowProviderCard from "../../toonflowProviderCard.vue";

defineProps<{ visible?: boolean }>();
const mediaProviderDialog = shallowRef<Component>();
const editProviderDialog = shallowRef<Component>();
const providers = ref<MediaProvider[]>([]);
const visibleProviders = computed(() => providers.value.filter(item => item.id !== "toonflow"));
const providerDialogVisible = ref(false);
const editorVisible = ref(false);
const addMode = ref<"builtin" | "custom">("builtin");
const editingProvider = ref<MediaProvider>();
const editingSourceProvider = ref<MediaProvider>();
const deletingFile = ref("");
const fetchingFile = ref("");
let loadRequest = 0;

function refreshInstalled(event: WindowEventMap["toonflow:plugin-installed"]) {
  if (event.detail.type === "provider") void loadProviders();
}
onMounted(() => {
  void loadProviders();
  window.addEventListener("toonflow:plugin-installed", refreshInstalled);
});
onBeforeUnmount(() => {
  loadRequest++;
  window.removeEventListener("toonflow:plugin-installed", refreshInstalled);
});

async function loadProviders() {
  const request = ++loadRequest;
  try {
    const { data } = await axios.get<{ data: MediaProvider[] }>("/api/providers/media/list");
    if (request === loadRequest) providers.value = data.data;
  } catch (error) {
    if (request === loadRequest) toast.error(axios.isAxiosError(error) ? error.response?.data?.message || error.message : "读取媒体供应商失败");
  }
}

function openAdd(mode: "builtin" | "custom") {
  mediaProviderDialog.value ??= defineAsyncComponent(() => import("./addCustomProviderDialog.vue"));
  editingSourceProvider.value = undefined;
  addMode.value = mode;
  providerDialogVisible.value = true;
}

function editProviderCode(provider: MediaProvider) {
  if (provider.id === "toonflow" || fetchingFile.value || deletingFile.value || !provider.revision) return;
  openAdd("custom");
  editingSourceProvider.value = provider;
}

function editProvider(provider: MediaProvider) {
  if (provider.id === "toonflow" || fetchingFile.value || deletingFile.value || provider.loadError) return;
  editProviderDialog.value ??= defineAsyncComponent(() => import("./editProviderDialog.vue"));
  editingProvider.value = provider;
  editorVisible.value = true;
}

async function fetchModels(provider: MediaProvider) {
  if (provider.id === "toonflow" || fetchingFile.value || deletingFile.value || !provider.modelsUrl || !provider.revision || provider.loadError) return;
  fetchingFile.value = provider.fileName;
  try {
    const { data } = await axios.post<{ code: number; data: MediaProvider; message: string }>("/api/providers/media/models", {
      fileName: provider.fileName, revision: provider.revision,
    }, { timeout: 35000 });
    if (data.code !== 200 || !data.data) throw new Error(data.message || "获取模型失败");
    saveProviderItem(data.data);
    invalidateNodeModels("media");
    toast.success("模型列表已更新");
  } catch (error) {
    toast.error(axios.isAxiosError(error) ? error.response?.data?.message || error.message : error instanceof Error ? error.message : "获取模型失败，请重试");
  } finally { fetchingFile.value = ""; }
}

async function deleteProvider(provider: MediaProvider) {
  if (provider.id === "toonflow" || fetchingFile.value || deletingFile.value || !provider.revision) return;
  deletingFile.value = provider.fileName;
  let deleted = false;
  try {
    await axios.delete("/api/providers/media/delete", { data: { fileName: provider.fileName, revision: provider.revision } });
    deleted = true;
    loadRequest++;
    invalidateNodeModels("media");
    providers.value = providers.value.filter(item => item.fileName !== provider.fileName);
    await saveSettings(settings => {
      const configs = settings.mediaProviderConfigs;
      if (!configs || typeof configs !== "object" || Array.isArray(configs) || !Object.hasOwn(configs, provider.id)) return;
      const current = { ...configs } as Record<string, unknown>;
      delete current[provider.id];
      return { mediaProviderConfigs: current };
    });
  } catch (error) {
    const message = axios.isAxiosError(error) ? error.response?.data?.message || error.message : error instanceof Error ? error.message : translate("删除失败，请重试");
    toast.error(deleted ? `供应商已删除，但相关连接配置清理失败：${message}` : message);
  } finally { deletingFile.value = ""; }
}

function saveProviderItem(provider: MediaProvider) {
  loadRequest++;
  const index = providers.value.findIndex(item => item.fileName === provider.fileName);
  if (index < 0) providers.value.push(provider);
  else providers.value.splice(index, 1, provider);
}

const confirmVisible1 = ref<Record<string, boolean>>({});
</script>

<style lang="scss" scoped src="../../providerList.scss"></style>
