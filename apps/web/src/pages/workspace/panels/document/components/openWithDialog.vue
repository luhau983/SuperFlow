<template>
  <uiDialog :open="visible" @update:open="value => { if (!value) cancel(); }">
    <uiDialogContent :aria-describedby="undefined" class="sm:max-w-[520px]">
      <uiDialogHeader>
        <uiDialogTitle>选择打开方式</uiDialogTitle>
      </uiDialogHeader>
      <div class="openWithBody">
        <p class="resourceName" :title="resourceName">{{ resourceName }}</p>
        <uiRadioGroup :modelValue="selectedId" class="extensionOptions" aria-label="文件扩展" @update:modelValue="value => selectedId = String(value)">
          <uiLabel v-for="option in options" :key="option.id" class="extensionOption" :class="{ checked: selectedId === option.id }">
            <uiRadioGroupItem :value="option.id" />
            <span class="optionInfo">
              <span class="optionName">{{ option.displayName }}</span>
              <span class="optionDetails">{{ option.id }}<span v-if="option.version">· v{{ option.version }}</span></span>
            </span>
          </uiLabel>
        </uiRadioGroup>
        <uiLabel class="makeDefault"><uiCheckbox :modelValue="makeDefault" @update:modelValue="value => makeDefault = value === true" />对此类文件设为默认</uiLabel>
      </div>
      <uiDialogFooter>
        <uiButton variant="outline" @click="cancel">取消</uiButton>
        <uiButton :disabled="!selectedId" @click="confirm">打开</uiButton>
      </uiDialogFooter>
    </uiDialogContent>
  </uiDialog>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref, shallowRef } from "vue";
import { uiButton } from "@/components/ui/button";
import { uiCheckbox } from "@/components/ui/checkbox";
import { uiDialog, uiDialogContent, uiDialogFooter, uiDialogHeader, uiDialogTitle } from "@/components/ui/dialog";
import { uiLabel } from "@/components/ui/label";
import { uiRadioGroup, uiRadioGroupItem } from "@/components/ui/radioGroup";

type ExtensionOption = { id: string; displayName: string; version: string };
type ExtensionChoice = { id: string; makeDefault: boolean };
const visible = ref(false);
const resourceName = ref("");
const options = shallowRef<ExtensionOption[]>([]);
const selectedId = ref<string>();
const makeDefault = ref(true);
let resolveChoice: ((choice: ExtensionChoice | undefined) => void) | undefined;

function choose(resourceLabel: string, candidates: ExtensionOption[], defaultId?: string): Promise<ExtensionChoice | undefined> {
  resolveChoice?.(undefined);
  resourceName.value = resourceLabel;
  options.value = candidates;
  selectedId.value = candidates.some(option => option.id === defaultId) ? defaultId : undefined;
  makeDefault.value = true;
  visible.value = true;
  return new Promise(resolve => { resolveChoice = resolve; });
}

function finish(choice?: ExtensionChoice) {
  visible.value = false;
  const resolve = resolveChoice;
  resolveChoice = undefined;
  resolve?.(choice);
}

function cancel() { finish(); }
function confirm() {
  if (selectedId.value && options.value.some(option => option.id === selectedId.value)) finish({ id: selectedId.value, makeDefault: makeDefault.value });
}
onBeforeUnmount(cancel);
defineExpose({ choose });
</script>

<style scoped lang="scss">
.openWithBody {
  display: flex;
  flex-direction: column;
  gap: 16px;

  .resourceName {
    margin: 0;
    color: var(--foreground);
    overflow-wrap: anywhere;
  }

  .extensionOptions {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
    max-height: 360px;
    overflow: auto;

    .extensionOption {
      align-items: flex-start;
      gap: 10px;
      padding: 12px;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      font-weight: 400;
      line-height: 1.4;
      cursor: pointer;

      &.checked { border-color: var(--primary); }

      .optionInfo {
        display: flex;
        flex-direction: column;
        gap: 4px;
        overflow-wrap: anywhere;

        .optionName { font-weight: 500; }
        .optionDetails { color: var(--muted-foreground); font-size: 12px; }
      }
    }
  }

  .makeDefault { font-weight: 400; cursor: pointer; }
}
</style>
