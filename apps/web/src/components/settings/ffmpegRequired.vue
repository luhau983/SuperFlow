<template>
  <uiDialog :open="visible" @update:open="open => { if (!open) { visible = false; } }">
    <uiDialogContent
      :aria-describedby="undefined"
      class="uiDialogPanel"
      :style="{ width: 'min(680px, calc(100vw - 32px))', maxWidth: 'calc(100vw - 32px)' }">
      <uiDialogHeader class="dialogHeader">
        <uiDialogTitle>FFmpeg</uiDialogTitle>
      </uiDialogHeader>
      <div class="dialogBody">
        <uiAlert class="installationHint">
          <uiAlertTitle class="whitespace-normal overflow-visible line-clamp-none">安装完成后，请重新发起刚才的操作。</uiAlertTitle>
        </uiAlert>
        <ffmpeg v-if="visible" :downloadOnOpen="true" />
      </div>
    </uiDialogContent>
  </uiDialog>
</template>

<script setup lang="ts">
import { uiAlert, uiAlertTitle } from "@/components/ui/alert";
import { uiDialog, uiDialogContent, uiDialogHeader, uiDialogTitle } from "@/components/ui/dialog";
import { onBeforeUnmount, ref } from "vue";
import { toast } from "vue-sonner";
import messageBox from "@/lib/messageBox";
import { actualPlatform } from "@/lib/platform";
import ffmpeg from "./panels/pluginMarket/ffmpeg.vue";

const visible = ref(false);
let pending = false;
const events = new EventSource("/api/ffmpeg/events");
events.onmessage = async event => {
  let data: { type?: string };
  try { data = JSON.parse(event.data); }
  catch { return; }
  if (data?.type !== "required" || pending || visible.value) return;
  if (actualPlatform.isLocalMobile) {
    toast.warning("未检测到可用的 FFmpeg，无法继续这项音视频处理。当前移动端版本暂不支持在应用内安装 FFmpeg。");
    return;
  }
  pending = true;
  try {
    await messageBox.confirm("这项音视频处理需要 FFmpeg，但尚未检测到可用版本。现在下载并安装吗？", "需要 FFmpeg", {
      confirmButtonText: "下载并安装", cancelButtonText: "暂不下载", closeOnClickModal: false,
    });
    if (events.readyState !== EventSource.CLOSED) visible.value = true;
  } catch {
    // 用户取消后保留当前操作的失败结果，不自动重新生成媒体。
  } finally {
    pending = false;
  }
};
onBeforeUnmount(() => events.close());
</script>

<style scoped>
.installationHint { margin-bottom: 12px; }
</style>
