<template>
  <uiDialog :key="requestId" :open="visible" @update:open="open => { if (!open) { cancel(); } }" :unmountOnHide="false">
    <uiDialogContent
      :aria-describedby="undefined"
      v-if="dialogRendered1"
      class="uiDialogPanel"
      :style="{ width: 'min(420px, 92vw)', maxWidth: 'calc(100vw - 32px)' }"
      @interactOutside="event => { if (!(false)) event.preventDefault(); }"
      @openAutoFocus="event => { event.preventDefault(); focusCancel(); }">
      <uiDialogHeader class="dialogHeader">
        <uiDialogTitle>退出 SuperFlow</uiDialogTitle>
      </uiDialogHeader>
      <div class="dialogBody">退出后，正在运行的任务将被中断。确定要退出吗？<uiDialogFooter class="dialogFooter"><uiButton ref="cancelButton" @click="cancel" variant="outline" type="button">取消</uiButton><uiButton @click="finish(true)" variant="default" type="button">退出</uiButton></uiDialogFooter></div>
    </uiDialogContent>
  </uiDialog>
</template>

<script setup lang="ts">
import { uiButton } from "@/components/ui/button";
import { uiDialog, uiDialogContent, uiDialogHeader, uiDialogTitle, uiDialogFooter } from "@/components/ui/dialog";
import { onBeforeUnmount, onMounted, ref, watch } from "vue";

type QuitMessage = { type: "confirmQuit"; requestId: string; confirmed: boolean } | { type: "quitReady"; ready: boolean } | { type: "quitShown"; requestId: string };
const hostWindow = window as Window & { __electrobunSendToHost?: (message: QuitMessage) => void };
const visible = ref(false);
const requestId = ref("");
const cancelButton = ref<{ $el: HTMLButtonElement }>();
let pendingRequestId: string | undefined;

function finish(confirmed: boolean) {
  const pendingId = pendingRequestId;
  if (!pendingId) return;
  pendingRequestId = undefined;
  visible.value = false;
  hostWindow.__electrobunSendToHost?.({ type: "confirmQuit", requestId: pendingId, confirmed });
}

function cancel() { finish(false); }

function focusCancel() {
  if (visible.value) cancelButton.value?.$el.focus();
}

function confirmQuit(event: Event) {
  const detail: unknown = (event as CustomEvent<unknown>).detail;
  if (!detail || typeof detail !== "object" || !("requestId" in detail) || typeof detail.requestId !== "string" || !detail.requestId.trim()) return;
  if ("cancelled" in detail) {
    if (detail.cancelled === true && detail.requestId === pendingRequestId) finish(false);
    return;
  }
  if (detail.requestId === requestId.value) return;
  if (pendingRequestId) {
    hostWindow.__electrobunSendToHost?.({ type: "confirmQuit", requestId: detail.requestId, confirmed: false });
    return;
  }
  requestId.value = detail.requestId;
  pendingRequestId = detail.requestId;
  visible.value = true;
  hostWindow.__electrobunSendToHost?.({ type: "quitShown", requestId: detail.requestId });
}

onMounted(() => {
  window.addEventListener("toonflow:confirm-quit", confirmQuit);
  hostWindow.__electrobunSendToHost?.({ type: "quitReady", ready: true });
});

onBeforeUnmount(() => {
  window.removeEventListener("toonflow:confirm-quit", confirmQuit);
  cancel();
  hostWindow.__electrobunSendToHost?.({ type: "quitReady", ready: false });
});
const dialogRendered1 = ref(visible.value);
watch(visible, open => { if (open) dialogRendered1.value = true; });
</script>
