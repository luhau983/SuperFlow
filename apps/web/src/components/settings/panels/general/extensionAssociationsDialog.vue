<template>
  <uiDialog :open="visible" @update:open="open => { if (!open) { visible = false; } }" :unmountOnHide="false">
    <uiDialogContent
      :aria-describedby="undefined"
      v-if="dialogRendered1"
      class="uiDialogPanel"
      :style="{ width: 'min(660px, calc(100vw - 32px))', maxWidth: 'calc(100vw - 32px)' }">
      <uiDialogHeader class="dialogHeader">
        <uiDialogTitle>默认打开方式</uiDialogTitle>
      </uiDialogHeader>
      <div class="dialogBody">
        <div class="extensionAssociations portLoading" :aria-busy="loading">
          <p>按文件类型选择默认扩展。清除后，有多个可用扩展时会再次询问打开方式。</p>
          <uiAlert v-if="error" variant="destructive">
            <uiAlertTitle class="whitespace-normal overflow-visible line-clamp-none">{{ error }}</uiAlertTitle>
          </uiAlert>
          <div class="tableViewport" :style="{ maxHeight: '420', height: undefined }">
            <uiTable>
              <uiTableHeader>
                <uiTableRow>
                  <uiTableHead :style="{ minWidth: '140px', textAlign: 'left' }">文件类型</uiTableHead>
                  <uiTableHead :style="{ minWidth: '0px', textAlign: 'left' }">默认扩展</uiTableHead>
                </uiTableRow>
              </uiTableHeader>
              <uiTableBody>
                <uiTableRow v-for="(row, $index) in rows" :key="$index">
                  <uiTableCell :style="{ textAlign: 'left' }">{{ row.suffix === 'canvasNode' ? '画布节点' : `.${row.suffix}` }}</uiTableCell>
                  <uiTableCell :style="{ textAlign: 'left' }">
                    <uiSelect
                      :disabled="saving"
                      :modelValue="String(extensionAssociations[row.suffix] ?? '') === '' ? '__empty__' : (extensionAssociations[row.suffix] ?? '')"
                      @update:modelValue="selected => { const value = selected === '__empty__' ? '' : selected; (id => save(row.suffix, String(id)))(value); }">
                      <uiSelectTrigger :aria-label="`${row.suffix} 默认扩展`">
                        <uiSelectValue placeholder="自动选择 / 每次询问" />
                      </uiSelectTrigger>
                      <uiSelectContent>
                        <uiSelectItem value="__empty__">自动选择 / 每次询问</uiSelectItem>
                        <uiSelectItem v-if="row.unavailable" :value="row.unavailable" disabled>{{ `${row.unavailable}（不可用）` }}</uiSelectItem>
                        <uiSelectItem v-for="extension in row.candidates" :key="extension.id" :value="extension.id">{{ `${extension.displayName} · ${extension.id}` }}</uiSelectItem>
                      </uiSelectContent>
                    </uiSelect>
                  </uiTableCell>
                </uiTableRow>
                <uiTableEmpty v-if="!(rows)?.length" :colspan="2">暂无已安装的文件扩展或默认关联</uiTableEmpty>
              </uiTableBody>
            </uiTable>
          </div>
          <div v-if="loading" class="portLoadingMask" aria-hidden="true">
            <icon-loader-2 class="animate-spin" />
          </div>
        </div>
        <uiDialogFooter class="dialogFooter">
          <uiButton @click="visible = false" variant="outline" type="button">完成</uiButton>
        </uiDialogFooter>
      </div>
    </uiDialogContent>
  </uiDialog>
</template>

<script setup lang="ts">
import { uiButton } from "@/components/ui/button";
import { uiSelect, uiSelectTrigger, uiSelectValue, uiSelectContent, uiSelectItem } from "@/components/ui/select";
import { uiTable, uiTableHeader, uiTableHead, uiTableBody, uiTableRow, uiTableCell, uiTableEmpty } from "@/components/ui/table";
import { uiAlert, uiAlertTitle } from "@/components/ui/alert";
import { uiDialog, uiDialogContent, uiDialogHeader, uiDialogTitle, uiDialogFooter } from "@/components/ui/dialog";
import { computed, ref, shallowRef, watch } from "vue";
import { toast } from "vue-sonner";
import { extensionAssociations, listExtensions, setExtensionAssociation, type InstalledExtension } from "@/pages/workspace/panels/document/extensions";

const visible = defineModel<boolean>({ required: true });
const extensions = shallowRef<InstalledExtension[]>([]);
const loading = ref(false);
const saving = ref(false);
const error = ref("");
const rows = computed(() => {
  const available = extensions.value.filter(extension => extension.enabled && !extension.loadError);
  const suffixes = new Set([...Object.keys(extensionAssociations.value), ...available.flatMap(extension => extension.resourceKind === "canvasNode" ? ["canvasNode"] : extension.extensions)]);
  return [...suffixes].sort().map(suffix => {
    const candidates = available.filter(extension => suffix === "canvasNode" ? extension.resourceKind === "canvasNode" : extension.resourceKind === "file" && extension.extensions.includes(suffix));
    const selected = extensionAssociations.value[suffix];
    return { suffix, candidates, unavailable: selected && !candidates.some(extension => extension.id === selected) ? selected : undefined };
  });
});

watch(visible, async value => {
  if (!value) return;
  loading.value = true;
  error.value = "";
  try { extensions.value = await listExtensions(); }
  catch (cause) { error.value = cause instanceof Error ? cause.message : "读取文件扩展失败"; }
  finally { loading.value = false; }
}, { immediate: true });

async function save(suffix: string, id: string) {
  saving.value = true;
  try { await setExtensionAssociation(suffix, id || undefined); }
  catch (cause) { toast.error(cause instanceof Error ? cause.message : "保存默认打开方式失败"); }
  finally { saving.value = false; }
}
const dialogRendered1 = ref(visible.value);
watch(visible, open => { if (open) dialogRendered1.value = true; });
</script>

<style scoped lang="scss">
.extensionAssociations {
  p { margin: 0 0 16px; color: var(--el-text-color-secondary); line-height: 1.6; }
  :deep(:is(.el-select, [data-slot="select-trigger"])) { width: 100%; }
}
</style>
