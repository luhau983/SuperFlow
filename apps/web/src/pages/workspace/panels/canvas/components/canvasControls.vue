<template>
  <mini-map
    v-if="showMap"
    class="canvasMiniMap"
    position="bottom-left"
    :pannable="true"
    :zoomable="true"
    nodeColor="var(--el-fill-color-dark)"
    maskColor="var(--el-mask-color-extra-light)"
    @click="({ position }) => setCenter(position.x, position.y, { zoom: viewport.zoom, duration: 250 })" />
  <panel class="canvasControlsPanel" position="bottom-left">
    <uiCard class="canvasControlsCard">
      <div class="canvasControls">
        <uiTooltip v-if="currentUser?.role !== 'user'" disableHoverableContent>
          <uiTooltipTrigger asChild>
            <uiButton
              class="toolButton"
              :class="{ active: assetsVisible }"
              variant="ghost"
              size="icon-sm"
              :aria-pressed="assetsVisible"
              aria-label="素材库"
              @click="assetsVisible = !assetsVisible">
              <icon-folders :size="18" />
            </uiButton>
          </uiTooltipTrigger>
          <uiTooltipContent side="top">{{ assetsVisible ? '关闭素材库' : '打开素材库' }}</uiTooltipContent>
        </uiTooltip>
        <!-- 撤销整理弹层用锚点而非触发器，只由 arrangeNodes 控制打开，点击外部仍自动关闭 -->
        <uiPopover v-model:open="undoPopoverVisible">
          <uiTooltip disableHoverableContent :disabled="undoPopoverVisible">
            <uiTooltipTrigger asChild>
              <span class="toolTrigger">
                <uiPopoverAnchor asChild>
                  <uiButton class="toolButton" variant="ghost" size="icon-sm" :disabled="!canArrange" aria-label="整理画布" @click="arrangeNodes">
                    <icon-sitemap :size="18" />
                  </uiButton>
                </uiPopoverAnchor>
              </span>
            </uiTooltipTrigger>
            <uiTooltipContent side="top">整理画布</uiTooltipContent>
          </uiTooltip>
          <uiPopoverContent class="w-[180px] p-0" side="top" align="start" @openAutoFocus.prevent>
            <div class="zoomMenu">
              <uiButton class="zoomAction" variant="ghost" size="sm" @click="undoArrange">撤销整理</uiButton>
            </div>
          </uiPopoverContent>
        </uiPopover>
        <uiTooltip disableHoverableContent>
          <uiTooltipTrigger asChild>
            <uiButton
              class="toolButton"
              :class="{ active: showMap }"
              variant="ghost"
              size="icon-sm"
              :aria-pressed="showMap"
              aria-label="显示或隐藏地图"
              @click="showMap = !showMap">
              <icon-map :size="18" />
            </uiButton>
          </uiTooltipTrigger>
          <uiTooltipContent side="top">{{ showMap ? '隐藏地图' : '显示地图' }}</uiTooltipContent>
        </uiTooltip>
        <uiTooltip disableHoverableContent>
          <uiTooltipTrigger asChild>
            <uiButton
              class="toolButton"
              :class="{ active: snapEnabled }"
              variant="ghost"
              size="icon-sm"
              :aria-pressed="snapEnabled"
              aria-label="网格吸附"
              @click="snapEnabled = !snapEnabled">
              <icon-magnet :size="18" />
            </uiButton>
          </uiTooltipTrigger>
          <uiTooltipContent side="top">{{ snapEnabled ? '关闭网格吸附' : '开启网格吸附' }}</uiTooltipContent>
        </uiTooltip>
        <uiTooltip disableHoverableContent>
          <uiTooltipTrigger asChild>
            <uiButton
              class="toolButton"
              :class="{ active: showEdges }"
              variant="ghost"
              size="icon-sm"
              :aria-pressed="showEdges"
              aria-label="显示或隐藏连线"
              @click="showEdges = !showEdges">
              <icon-arrow-guide :size="18" />
            </uiButton>
          </uiTooltipTrigger>
          <uiTooltipContent side="top">{{ showEdges ? '隐藏连线' : '显示连线' }}</uiTooltipContent>
        </uiTooltip>
        <uiTooltip disableHoverableContent>
          <uiTooltipTrigger asChild>
            <uiButton class="toolButton" variant="ghost" size="icon-sm" aria-label="适应视图" @click="fitView({ duration: 250 })">
              <icon-focus-centered :size="18" />
            </uiButton>
          </uiTooltipTrigger>
          <uiTooltipContent side="top">适应视图</uiTooltipContent>
        </uiTooltip>
        <uiPopover v-model:open="zoomMenuVisible">
          <uiTooltip disableHoverableContent :disabled="zoomMenuVisible">
            <uiTooltipTrigger asChild>
              <span class="toolTrigger">
                <uiPopoverTrigger asChild>
                  <uiButton
                    class="toolButton zoomButton"
                    variant="ghost"
                    size="sm"
                    aria-label="缩放菜单"
                    @wheel.stop.prevent="$event.deltaY && applyZoom(Math.min(800, Math.max(20, zoomPercent - Math.sign($event.deltaY))))">{{ zoomPercent }}%</uiButton>
                </uiPopoverTrigger>
              </span>
            </uiTooltipTrigger>
            <uiTooltipContent side="top">缩放菜单（滚轮调整缩放）</uiTooltipContent>
          </uiTooltip>
          <uiPopoverContent class="w-[216px] p-0" side="top" align="start" @openAutoFocus.prevent>
            <div class="zoomMenu">
              <uiNumberField class="zoomInput numberField" :modelValue="zoomPercent" :min="20" :max="800" @update:modelValue="applyZoom">
                <uiNumberFieldContent>
                  <uiNumberFieldInput class="zoomValue" aria-label="缩放百分比" />
                  <span class="zoomSuffix" aria-hidden="true">%</span>
                </uiNumberFieldContent>
              </uiNumberField>
              <uiButton class="zoomAction" variant="ghost" size="sm" @click="zoomIn()">放大</uiButton>
              <uiButton class="zoomAction" variant="ghost" size="sm" @click="zoomOut()">缩小</uiButton>
              <uiButton class="zoomAction" variant="ghost" size="sm" @click="fitView({ duration: 250 })">适合屏幕</uiButton>
            </div>
          </uiPopoverContent>
        </uiPopover>
      </div>
    </uiCard>
  </panel>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { Panel, useVueFlow, type XYPosition } from "@vue-flow/core";
import { MiniMap } from "@vue-flow/minimap";
import { IconMap, IconMagnet, IconFocusCentered } from "@tabler/icons-vue";
import { toast } from "vue-sonner";
import { uiButton } from "@/components/ui/button";
import { uiCard } from "@/components/ui/card";
import { uiNumberField, uiNumberFieldContent, uiNumberFieldInput } from "@/components/ui/numberField";
import { uiPopover, uiPopoverAnchor, uiPopoverContent, uiPopoverTrigger } from "@/components/ui/popover";
import { uiTooltip, uiTooltipContent, uiTooltipTrigger } from "@/components/ui/tooltip";
import { currentUser } from "@/stores/multiTenant";
import { arrangeCanvas } from "../arrangeCanvas";

const props = defineProps<{
  canvasId: string;
  directory: string | undefined;
  batchHistory: (action: () => Promise<void>) => Promise<void>;
}>();
const snapEnabled = defineModel<boolean>("snapEnabled", { required: true });
const showEdges = defineModel<boolean>("showEdges", { required: true });
const assetsVisible = defineModel<boolean>("assetsVisible", { default: false });
const showMap = ref(false);
const zoomMenuVisible = ref(false);
const flow = useVueFlow();
const { viewport, zoomTo, zoomIn, zoomOut, fitView, setCenter, getNodes, updateNode } = flow;
const zoomPercent = computed(() => Math.round(viewport.value.zoom * 100));
const layoutSnapshot = ref<{ id: string; position: XYPosition }[]>();
const undoPopoverVisible = ref(false);
const arranging = ref(false);
let arrangeController: AbortController | undefined;
const canArrange = computed(() => {
  const nodes = getNodes.value.filter((node) => !node.parentNode);
  return (
    !!props.canvasId &&
    !!props.directory &&
    !arranging.value &&
    nodes.length > 0 &&
    nodes.every((node) => node.dimensions.width > 0 && node.dimensions.height > 0)
  );
});
defineExpose({ arrangeNodes });

watch(
  () => [props.canvasId, props.directory],
  () => {
    arrangeController?.abort();
    layoutSnapshot.value = undefined;
    undoPopoverVisible.value = false;
  },
  { flush: "sync" }
);
onBeforeUnmount(() => arrangeController?.abort());

function applyZoom(value: number | null | undefined) {
  if (typeof value === "number" && Number.isFinite(value)) void zoomTo(value / 100);
}

async function arrangeNodes() {
  if (!canArrange.value) return;
  const controller = new AbortController();
  arrangeController = controller;
  arranging.value = true;
  try {
    await props.batchHistory(async () => {
      const { snapshot, arrangedNodeIds } = await arrangeCanvas(flow, controller.signal);
      controller.signal.throwIfAborted();
      if (!arrangedNodeIds.length) return;
      layoutSnapshot.value = snapshot;
      undoPopoverVisible.value = true;
    });
  } catch (error) {
    if (!controller.signal.aborted) toast.error(error instanceof Error ? error.message : "整理画布失败");
  } finally {
    arrangeController = undefined;
    arranging.value = false;
  }
}

async function undoArrange() {
  const snapshot = layoutSnapshot.value;
  if (!snapshot) return;
  try {
    await props.batchHistory(async () => {
      const nodeIds = new Set(getNodes.value.map((node) => node.id));
      snapshot.forEach(({ id, position }) => {
        if (nodeIds.has(id)) updateNode(id, { position });
      });
      layoutSnapshot.value = undefined;
      undoPopoverVisible.value = false;
    });
  } catch (error) {
    toast.error(error instanceof Error ? error.message : "撤销整理失败");
  }
}
</script>

<style lang="scss" scoped>
.canvasMiniMap.vue-flow__minimap { bottom: 46px; }

@container canvasWorkspace (max-width: 1040px) {
  .canvasControlsPanel.vue-flow__panel { bottom: 46px; }
  .canvasMiniMap.vue-flow__minimap { bottom: 92px; }
}

.canvasControlsCard {
  justify-content: center;
  gap: 0;
  height: 34px;
  box-sizing: border-box;
  padding: 2px 4px;
  border-radius: var(--ui-radius-large);
  box-shadow: none;
}

.canvasControls {
  display: flex;
  align-items: center;
  gap: 2px;

  .toolTrigger {
    display: inline-flex;
  }

  .toolButton {
    width: 28px;
    height: 28px;
    flex-shrink: 0;
    margin-left: 0;
    padding: 0;
    font-size: 12px;
    font-variant-numeric: tabular-nums;

    &.active { color: var(--primary); }
    &.zoomButton { width: auto; min-width: 28px; padding: 0 4px; }
  }
}

.zoomMenu {
  display: flex;
  flex-direction: column;
  padding: 6px;

  .zoomInput {
    width: 100%;
    margin-bottom: 4px;

    .zoomValue { padding-right: 24px; padding-left: 12px; text-align: left; }
    .zoomSuffix { position: absolute; top: 50%; right: 10px; color: var(--muted-foreground); font-size: 12px; transform: translateY(-50%); pointer-events: none; }
  }

  .zoomAction {
    justify-content: flex-start;
  }
}
</style>
