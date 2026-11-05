<template>
  <div class="modelPopover">
    <uiPopover v-model:open="visible">
      <uiPopoverTrigger asChild>
        <uiButton class="modelButton" variant="ghost" size="sm" :disabled="disabled" aria-label="模型与思考强度设置">
          <modelIcon v-if="selectedModelChoice" :model="selectedModelChoice.modelId" :size="14" />
          <modelLabel class="modelName" :label="selectedModelChoice?.label ?? '选择模型'" :providerId="selectedModelChoice?.providerId" />
          <template v-if="reasoningLevels.length">·<span class="reasoningLabel">{{ reasoningLabel }}</span></template>
          <component :is="visible ? IconChevronUp : IconChevronDown" :size="14" aria-hidden="true" />
        </uiButton>
      </uiPopoverTrigger>
      <uiPopoverContent class="agentModelPopover w-[340px] max-w-[calc(100vw-24px)] p-5" side="top" align="start" :sideOffset="10">
        <div class="modelOptions">
          <div class="optionField">
            <uiLabel class="optionLabel">模型</uiLabel>
            <!-- ACT: 需要按名称筛选模型，shadcn Select 不支持筛选，暂保留 Element Plus 下拉。 -->
            <el-select
              :modelValue="selectedModelChoice ? selectedModel : ''"
              filterable
              :disabled="disabled"
              :teleported="false"
              placeholder="选择模型"
              aria-label="选择模型"
              noDataText="请先在设置中添加模型"
              @update:modelValue="selectedModel = $event"
              @change="reasoningEffort = ''">
              <template #prefix>
                <modelIcon v-if="selectedModelChoice" :model="selectedModelChoice.modelId" :size="18" />
              </template>
              <template #label="{ label }">
                <modelLabel :label="label" :providerId="selectedModelChoice?.providerId" />
              </template>
              <el-option-group v-for="provider in modelGroups" :key="provider.id" :label="provider.label">
                <el-option v-for="model in provider.models" :key="model.value" :label="model.label" :value="model.value">
                  <div class="modelOption">
                    <modelIcon :model="model.modelId" :size="16" />
                    <modelLabel class="modelOptionLabel" :label="model.label" :providerId="provider.id" />
                  </div>
                </el-option>
              </el-option-group>
            </el-select>
          </div>
          <div v-if="reasoningLevels.length" class="optionField">
            <uiLabel class="optionLabel" as="div">思考强度</uiLabel>
            <div class="reasoningSettings">
              <div
                class="reasoningGrid"
                role="radiogroup"
                aria-label="思考强度"
                :aria-describedby="`${reasoningId}Hint`"
                :style="{ gridTemplateColumns: `repeat(${reasoningColumns}, minmax(0, 1fr))` }">
                <label v-for="option in reasoningOptions" :key="option.value" class="reasoningOption">
                  <input v-model="reasoningEffort" type="radio" :name="reasoningId" :value="option.value" :disabled="disabled" />
                  <span class="reasoningOptionLabel">{{ option.label }}</span>
                </label>
              </div>
              <div :id="`${reasoningId}Hint`" class="reasoningHint">默认由模型决定</div>
            </div>
          </div>
        </div>
      </uiPopoverContent>
    </uiPopover>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useId, watch } from "vue";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-vue";
import { modelIcon } from "@toonflow/model-icons";
import { useNodeModelSelection } from "@toonflow/nodes-scaffold/nodeAi";
import modelLabel from "@toonflow/node-shared/modelLabel";
import type { ThinkingLevel } from "@toonflow/server/modelReasoning";
import { modelChoices, refreshModelChoices } from "@/stores/settings";
import { uiButton } from "@/components/ui/button";
import { uiLabel } from "@/components/ui/label";
import { uiPopover, uiPopoverContent, uiPopoverTrigger } from "@/components/ui/popover";

const selectedModel = defineModel<string>({ default: "" });
const reasoningEffort = defineModel<string>("reasoningEffort", { default: "" });
const props = withDefaults(defineProps<{ active?: boolean; disabled?: boolean }>(), { active: true, disabled: false });
const visible = ref(false);
const reasoningId = useId();
const reasoningLabels: Record<ThinkingLevel, string> = { off: "关闭", minimal: "最小", low: "低", medium: "中", high: "高", xhigh: "极高", max: "最高" };
const selectedModelChoice = useNodeModelSelection(modelChoices, selectedModel);
const modelGroups = computed(() => {
  const groups = new Map<string, { id: string; label: string; models: Array<(typeof modelChoices.value)[number]> }>();
  for (const model of modelChoices.value) {
    const group = groups.get(model.providerId);
    if (group) group.models.push(model);
    else groups.set(model.providerId, { id: model.providerId, label: model.providerLabel, models: [model] });
  }
  return [...groups.values()];
});
const reasoningLevels = computed(() => selectedModelChoice.value?.reasoningLevels ?? []);
const reasoningOptions = computed(() => [{ label: "默认", value: "" }, ...reasoningLevels.value.map(value => ({ label: reasoningLabels[value], value }))]);
const reasoningColumns = computed(() => Math.min(4, reasoningOptions.value.length > 4 ? Math.ceil(reasoningOptions.value.length / 2) : reasoningOptions.value.length));
const reasoningLabel = computed(() => reasoningOptions.value.find(item => item.value === reasoningEffort.value)?.label ?? "默认");
watch(modelChoices, items => {
  if (!selectedModel.value) selectedModel.value = items[0]?.value ?? "";
}, { immediate: true });
watch([() => selectedModelChoice.value?.reasoningLevels, reasoningEffort], ([levels, effort]) => {
  if (levels && effort && !levels.includes(effort as ThinkingLevel)) reasoningEffort.value = "";
}, { immediate: true, flush: "post" });
watch(() => !props.active || props.disabled, close => { if (close) visible.value = false; });
watch(visible, value => { if (value) void refreshModelChoices().catch(() => {}); });
</script>

<style lang="scss">
.modelPopover {
  display: inline-flex;
  min-width: 0;
  max-width: 100%;

  .modelButton {
    max-width: 100%;
    min-width: 0;
    height: 28px;
    gap: 6px;
    padding: 0 8px;
    color: var(--foreground);
    font-weight: 400;

    svg {
      flex-shrink: 0;
    }

    .reasoningLabel {
      flex-shrink: 0;
      color: var(--muted-foreground);
      font-size: 12px;
    }

    .modelName {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: left;
    }
  }
}

.agentModelPopover {
  .modelOptions {
    display: flex;
    flex-direction: column;
    gap: 20px;

    .optionField {
      display: grid;
      gap: 8px;

      :is(.el-select, [data-slot="select-trigger"]) {
        width: 100%;

        .modelOption {
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 0;

          .modelOptionLabel {
            flex: 1;
          }
        }
      }
      .reasoningSettings {
        width: 100%;

        .reasoningGrid {
          display: grid;
          gap: 6px;

          .reasoningOption {
            position: relative;
            min-width: 0;

            input {
              position: absolute;
              width: 1px;
              height: 1px;
              overflow: hidden;
              clip-path: inset(50%);

              &:checked + .reasoningOptionLabel {
                border-color: color-mix(in oklch, var(--primary) 50%, transparent);
                background: color-mix(in oklch, var(--primary) 10%, transparent);
                color: var(--primary);
                font-weight: 600;
              }
              &:focus-visible + .reasoningOptionLabel {
                outline: 2px solid var(--ring);
                outline-offset: 2px;
              }
              &:disabled + .reasoningOptionLabel {
                opacity: .5;
                cursor: not-allowed;
              }
            }
            .reasoningOptionLabel {
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 32px;
              padding: 4px 8px;
              border: 1px solid var(--border);
              border-radius: var(--radius);
              background: var(--muted);
              color: var(--foreground);
              font-size: 12px;
              line-height: 20px;
              cursor: pointer;
              transition: background-color .15s, border-color .15s, color .15s;
            }
            &:hover input:not(:disabled) + .reasoningOptionLabel {
              border-color: color-mix(in oklch, var(--primary) 50%, transparent);
              color: var(--primary);
            }
          }
        }
        .reasoningHint {
          margin-top: 8px;
          color: var(--muted-foreground);
          font-size: 12px;
          line-height: 18px;
        }
      }
    }
  }
}
</style>
