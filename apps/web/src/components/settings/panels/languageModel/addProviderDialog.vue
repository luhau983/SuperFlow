<template>
  <uiDialog :open="visible" @update:open="open => { if (!open) { visible = false; } }">
    <uiDialogContent
      :aria-describedby="undefined"
      class="uiDialogPanel"
      :style="{ width: 'min(860px, 94vw)', maxWidth: 'calc(100vw - 32px)' }"
      :showCloseButton="!saving"
      @interactOutside="event => { if (!(false)) event.preventDefault(); }"
      @escapeKeyDown="event => { if (!(!saving)) event.preventDefault(); }"
      @closeAutoFocus="() => { resetForm(); }">
      <uiDialogHeader class="dialogHeader">
        <uiDialogTitle>添加供应商</uiDialogTitle>
      </uiDialogHeader>
      <div class="dialogBody">
        <div class="providerPicker">
          <aside class="providerSidebar" aria-label="选择厂商">
            <button
              v-for="item in languageProviders"
              :key="item.id"
              class="providerItem"
              type="button"
              :disabled="saving"
              :aria-pressed="selectedProvider === item.id"
              @click="selectedProvider = item.id">
              <img v-if="item.icon" class="providerLogo" :src="item.icon" alt="" />
              <modelIcon v-else :model="item.id" :size="18" />
              <span>{{ item.label }}</span>
            </button>
          </aside>
          <div class="providerDetails" style="overflow:auto; overscroll-behavior:contain" :style="{ maxHeight: undefined, height: undefined }">
            <section v-if="activeProvider" :key="selectedProvider" class="providerContent" :aria-label="activeProvider.label">
              <div class="providerHeader">
                <h3>{{ activeProvider.label }}</h3>
                <uiBadge v-if="activeProvider.version" variant="outline">v{{ activeProvider.version }}</uiBadge>
              </div>
              <messageMarkdown v-if="providerReadme" class="providerReadme" :content="providerReadme" />
              <div class="dividerLabel"><span>连接配置</span><uiSeparator /></div>
              <form-create v-model="formValues" v-model:api="formApi" :rule="providerRules" :option="formOptions" />
              <div class="modelHeader">
                <strong data-ui-text="default">模型列表<span data-ui-text="info">{{ models.length }}</span></strong>
                <span v-if="fetching" data-ui-text="info">正在获取…</span>
                <uiButton v-else-if="modelError" @click="modelRefresh++" variant="ghost" type="button" size="sm"><component :is="IconRefresh" aria-hidden="true" />重试</uiButton>
              </div>
              <uiAlert v-if="modelError" variant="destructive">
                <uiAlertTitle class="whitespace-normal overflow-visible line-clamp-none">{{ modelError }}</uiAlertTitle>
              </uiAlert>
              <div v-else-if="models.length" class="modelList" :style="{ height: `${Math.min(280, models.length * 38 + 36)}px` }" aria-label="模型列表">
                <el-auto-resizer>
                  <template #default="{ height, width }">
                    <el-table-v2
                      :columns="modelColumns"
                      :data="models"
                      :width="width"
                      :height="height"
                      :rowHeight="38"
                      :headerHeight="36"
                      rowKey="id"
                      fixed />
                  </template>
                </el-auto-resizer>
              </div>
              <span v-else-if="!fetching" data-ui-text="info">{{ formValues.apiKey ? '未获取到模型' : '填写 API Key 后自动获取模型列表' }}</span>
              <uiAlert v-if="formError" variant="destructive">
                <uiAlertTitle class="whitespace-normal overflow-visible line-clamp-none">{{ formError }}</uiAlertTitle>
              </uiAlert>
            </section>
          </div>
        </div>
        <uiDialogFooter class="dialogFooter">
          <uiButton @click="visible = false" variant="outline" type="button" :disabled="(saving)">取消</uiButton>
          <uiButton @click="addProvider" variant="default" type="button" :disabled="(!activeProvider || fetching || !!modelError) || (saving)"><icon-loader-2 v-if="saving" class="animate-spin" aria-hidden="true" />确定添加供应商</uiButton>
        </uiDialogFooter>
      </div>
    </uiDialogContent>
  </uiDialog>
</template>

<script setup lang="ts">
import { uiAlert, uiAlertTitle } from "@/components/ui/alert";
import { uiButton } from "@/components/ui/button";
import { uiSeparator } from "@/components/ui/separator";
import { uiBadge } from "@/components/ui/badge";
import { uiDialog, uiDialogContent, uiDialogHeader, uiDialogTitle, uiDialogFooter } from "@/components/ui/dialog";
import { computed, ref, shallowRef, watch } from "vue";
import axios from "axios";
import { IconRefresh } from "@tabler/icons-vue";
import formCreate, { type Api, type Options } from "@toonflow/provider-web/formCreate";
import { languageProviders } from "@toonflow/providers";
import { modelIcon } from "@toonflow/model-icons";
import messageMarkdown from "@/components/messageMarkdown.vue";
import type { Column } from "element-plus";
import { saveSettings, type CustomProviderModel } from "@/stores/settings";

const visible = defineModel<boolean>({ default: false });
const selectedProvider = ref<string>(languageProviders[0]?.id ?? "");
const formApi = shallowRef<Api>();
const formValues = ref<Record<string, unknown>>({});
const models = shallowRef<CustomProviderModel[]>([]);
const fetching = ref(false);
const modelError = ref("");
const modelRefresh = ref(0);
const modelColumns: Column[] = [
  { key: "id", dataKey: "id", title: "模型 ID", width: 220, flexGrow: 1 },
  { key: "label", dataKey: "label", title: "显示名称", width: 180, flexGrow: 1 },
];
const saving = ref(false);
const formError = ref("");
watch(selectedProvider, () => {
  formError.value = "";
  formValues.value = {};
}, { flush: "sync" });
const activeProvider = computed(() => languageProviders.find(provider => provider.id === selectedProvider.value));
const providerReadme = computed(() => {
  const provider = activeProvider.value;
  return provider && "readme" in provider && typeof provider.readme === "string" ? provider.readme : "";
});
const formOptions = computed<Options>(() => ({ form: { labelPosition: "top", disabled: saving.value }, submitBtn: false, resetBtn: false }));
const providerRules = computed(() =>
  formCreate.copyRules(activeProvider.value?.rules ?? []),
);

watch(
  [visible, activeProvider, () => formValues.value.apiKey, modelRefresh],
  ([isVisible, provider, key], _previous, onCleanup) => {
    models.value = [];
    modelError.value = "";
    fetching.value = false;
    if (!isVisible || !provider) return;
    if (provider.models.length) {
      models.value = structuredClone(provider.models);
      return;
    }
    const apiKey = typeof key === "string" ? key.trim() : "";
    if (!apiKey) return;
    const controller = new AbortController();
    fetching.value = true;
    // ACT: 输入停顿后自动获取；输入变化时立即取消旧请求，避免逐字请求和结果串到新密钥。
    const timer = setTimeout(async () => {
      try {
        const { data } = await axios.post("/api/providers/models", {
          apiUrl: provider.apiUrl, protocol: provider.protocol, apiKey,
        }, { signal: controller.signal, timeout: 35000 });
        if (controller.signal.aborted) return;
        if (data.code !== 200 || !Array.isArray(data.data)) throw new Error(data.message || "获取模型列表失败");
        models.value = data.data;
      } catch (error) {
        if (!controller.signal.aborted) modelError.value = axios.isAxiosError(error)
          ? error.response?.data?.message || "获取模型列表失败，请检查 API Key 后重试"
          : error instanceof Error ? error.message : "获取模型列表失败";
      } finally {
        if (!controller.signal.aborted) fetching.value = false;
      }
    }, 500);
    onCleanup(() => {
      clearTimeout(timer);
      controller.abort();
    });
  },
  { immediate: true, flush: "sync" },
);

function resetForm() {
  selectedProvider.value = languageProviders[0]?.id ?? "";
  formError.value = "";
  formApi.value = undefined;
  formValues.value = {};
}

async function addProvider() {
  if (saving.value || fetching.value || modelError.value || !activeProvider.value || !formApi.value) return;
  formError.value = "";
  const provider = activeProvider.value;
  const values = formApi.value.formData();
  const apiKey = typeof values.apiKey === "string" ? values.apiKey.trim() : "";
  if (!apiKey) {
    formError.value = "请填写 API Key";
    return;
  }
  saving.value = true;
  try {
    const addedProvider = {
      id: provider.id,
      label: provider.label,
      icon: provider.icon,
      apiKey,
      apiUrl: "apiUrl" in provider ? provider.apiUrl : "",
      protocol: "protocol" in provider ? provider.protocol : "",
      models: models.value.map(model => ({ ...model })),
    };
    await saveSettings(settings => {
      const existing = settings.customProviders;
      if (existing !== undefined && !Array.isArray(existing)) throw new Error("已保存的供应商配置格式不正确");
      if (existing?.some(item => typeof item?.id === "string" && item.id.toLowerCase() === provider.id.toLowerCase())) {
        throw new Error("此供应商已添加，请在供应商列表中编辑");
      }
      return { customProviders: [...(existing ?? []), addedProvider] };
    });
    visible.value = false;
  } catch (error) {
    formError.value = error instanceof Error ? error.message : "保存失败，请重试；当前填写的内容已保留";
  } finally { saving.value = false; }
}
</script>

<style lang="scss" scoped>
.providerPicker {
  display: grid;
  grid-template-columns: 180px minmax(0, 1fr);
  height: min(560px, 70dvh);
  gap: 24px;

  .providerSidebar {
    overflow-y: auto;
    border-right: 1px solid var(--el-border-color-lighter);

    padding: 2px;

    .providerItem {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      padding: 10px 12px;
      margin-bottom: 4px;
      border: 0;
      border-radius: var(--el-border-radius-base);
      background: transparent;
      color: var(--el-text-color-regular);
      font: inherit;
      text-align: left;
      cursor: pointer;

      &:hover {
        background: var(--el-fill-color-light);
      }

      &[aria-pressed="true"] {
        background: var(--el-color-primary-light-9);
        color: var(--el-color-primary);
      }

      &:focus-visible {
        outline: 2px solid var(--el-color-primary);
      }

      .providerLogo {
        width: 18px;
        height: 18px;
        object-fit: contain;
      }
    }
  }

  .providerDetails {
    min-width: 0;

    .providerContent {
      padding-right: 12px;

      .providerHeader {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
        margin: 4px 0 24px;

        h3 {
          margin: 0;
          color: var(--el-text-color-primary);
          font-size: 18px;
          overflow-wrap: anywhere;
        }
      }

      .providerReadme {
        margin-bottom: 24px;
        overflow-wrap: anywhere;
      }

      .modelHeader {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin: 8px 0 12px;
      }

      .modelList {
        margin-bottom: 16px;
      }
    }
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto minmax(0, 1fr);
    gap: 16px;

    .providerSidebar {
      max-height: 128px;
      border-right: 0;
      border-bottom: 1px solid var(--el-border-color-lighter);
    }
  }
}
</style>
