<template>
  <!-- ACT: 素材库内仍有 Element Plus 弹窗、图片预览和菜单；模态 Dialog 的焦点锁定与 body pointer-events 会让它们无法操作，
    因此使用非模态 Dialog 加自绘遮罩，并在 Element Plus 弹层内交互时不关闭。素材库全部迁移到 shadcn 后改回默认模态。 -->
  <uiDialog v-model:open="visible" :modal="false">
    <teleport to="body">
      <div v-if="visible" class="homeAssetLibraryOverlay" :style="{ zIndex: overlayZIndex }" aria-hidden="true" />
    </teleport>
    <uiDialogContent
      :aria-describedby="undefined"
      class="homeAssetLibraryDialog"
      @interactOutside="keepForElementLayer"
      @escapeKeyDown="keepForElementLayer">
      <uiDialogHeader class="libraryHeader">
        <uiDialogTitle>素材库</uiDialogTitle>
      </uiDialogHeader>
      <div class="libraryBody">
        <assetLibrary v-model="visible" expanded />
      </div>
    </uiDialogContent>
  </uiDialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useZIndex } from "element-plus";
import assetLibrary from "@/pages/workspace/panels/canvas/components/assetLibrary.vue";
import { uiDialog, uiDialogContent, uiDialogHeader, uiDialogTitle } from "@/components/ui/dialog";

const visible = defineModel<boolean>({ default: false });
const { nextZIndex } = useZIndex();
const overlayZIndex = ref(0);
const elementLayers = ".el-overlay, .el-popper, .el-image-viewer__wrapper";

// 遮罩在内容挂载前取层级，内容随后取更高的层级。
watch(visible, open => { if (open) overlayZIndex.value = nextZIndex(); }, { immediate: true, flush: "pre" });

function keepForElementLayer(event: Event) {
  const target = (event as CustomEvent<{ originalEvent?: Event }>).detail?.originalEvent?.target ?? event.target;
  const insideLayer = target instanceof Element && !!target.closest(elementLayers);
  const layerOpen = [...document.querySelectorAll(elementLayers)].some(layer => layer.getClientRects().length > 0);
  if (insideLayer || (event instanceof KeyboardEvent && layerOpen)) event.preventDefault();
}
</script>

<style lang="scss">
.homeAssetLibraryOverlay {
  position: fixed;
  inset: 0;
  background: rgb(0 0 0 / 50%);
}

.homeAssetLibraryDialog {
  display: flex;
  flex-direction: column;
  gap: 0;
  width: min(1440px, 88vw);
  max-width: min(1440px, 88vw);
  height: 84dvh;
  max-height: calc(100dvh - 32px);
  padding: 0;
  overflow: hidden;

  .libraryHeader { flex-shrink: 0; padding: 20px 24px 16px; }

  .libraryBody { display: flex; flex: 1; min-width: 0; min-height: 0; overflow: hidden; }

  @media (max-width: 700px) {
    width: calc(100vw - 24px);
    height: calc(100dvh - 32px);
    max-width: calc(100vw - 24px);
  }
}
</style>
