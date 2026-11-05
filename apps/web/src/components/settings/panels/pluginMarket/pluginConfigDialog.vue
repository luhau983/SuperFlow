<template>
  <uiDialog v-model:open="visible">
    <uiDialogContent
      class="sm:max-w-[520px]"
      :showCloseButton="!saving"
      :aria-describedby="undefined"
      @interactOutside="(event: Event) => event.preventDefault()"
      @escapeKeyDown="(event: Event) => saving && event.preventDefault()"
      @closeAutoFocus="formApi = undefined">
      <uiDialogHeader>
        <uiDialogTitle>{{ plugin.displayName }}配置</uiDialogTitle>
      </uiDialogHeader>
      <form-create v-model="formValues" v-model:api="formApi" :rule="formRules" :option="formOptions" />
      <uiAlert v-if="configError" variant="destructive">
        <icon-alert-circle aria-hidden="true" />
        <uiAlertTitle class="line-clamp-none">{{ configError }}</uiAlertTitle>
      </uiAlert>
      <uiDialogFooter>
        <uiButton variant="outline" :disabled="saving" @click="visible = false">取消</uiButton>
        <uiButton :disabled="saving || !canManage || !formApi" @click="saveConfig"><icon-loader-2 v-if="saving" class="animate-spin" aria-hidden="true" />保存</uiButton>
      </uiDialogFooter>
    </uiDialogContent>
  </uiDialog>
</template>

<script setup lang="ts">
import axios from "axios";
import { computed, ref, shallowRef, toRaw, watch } from "vue";
import formCreate, { type Api, type Options } from "@toonflow/provider-web/formCreate";
import { toast } from "vue-sonner";
import type { Plugin } from "./types";
import { uiAlert, uiAlertTitle } from "@/components/ui/alert";
import { uiButton } from "@/components/ui/button";
import { uiDialog, uiDialogContent, uiDialogFooter, uiDialogHeader, uiDialogTitle } from "@/components/ui/dialog";
import { extensionConfig, saveExtensionConfig } from "@/pages/workspace/panels/document/extensions";

const { plugin, canManage } = defineProps<{ plugin: Plugin; canManage: boolean }>();
const visible = defineModel<boolean>({ default: false });
const formApi = shallowRef<Api>();
const formRules = shallowRef<ReturnType<typeof formCreate.copyRules>>([]);
const formValues = ref<Record<string, unknown>>({});
const saving = ref(false);
const configError = ref("");
const formOptions = computed<Options>(() => ({ form: { labelPosition: "top", size: "small", disabled: saving.value }, submitBtn: false, resetBtn: false }));

watch(() => [visible.value, plugin], () => {
  if (!visible.value) return;
  formApi.value = undefined;
  formRules.value = formCreate.copyRules(plugin.configRules ?? []);
  formValues.value = structuredClone(toRaw(plugin.config ?? {}));
  configError.value = "";
}, { immediate: true });

async function saveConfig() {
  if (!canManage || saving.value || !formApi.value) return;
  saving.value = true;
  configError.value = "";
  try {
    if (!(await formApi.value.validate().catch(() => false))) return;
    const path = plugin.type === "ext" ? "ext" : plugin.type === "node" ? "nodes" : "tools";
    if (plugin.type === "ext") {
      await saveExtensionConfig(plugin.name, formApi.value.formData());
      plugin.config = extensionConfig(plugin.name);
    } else {
      const { data } = await axios.put(`/api/${path}/save`, { name: plugin.name, config: formApi.value.formData() }, { headers: { "x-toonflow-workspace": "1" } });
      if (data.code !== 200) throw new Error(data.message || "保存插件配置失败");
      plugin.config = data.data;
    }
    if (plugin.type === "node") window.dispatchEvent(new Event("toonflow:node-config-updated"));
    visible.value = false;
    toast.success("插件配置已保存");
  } catch (error) {
    configError.value = axios.isAxiosError(error)
      ? error.response?.data?.message || "保存失败，请重试；当前填写的内容已保留"
      : error instanceof Error ? error.message : "保存失败，请重试";
  } finally { saving.value = false; }
}
</script>
