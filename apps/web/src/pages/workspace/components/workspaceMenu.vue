<template>
  <div class="workspaceMenu">
    <uiCard class="menuCard">
      <div class="menuContent">
        <uiButton class="toolButton" variant="ghost" size="icon-sm" aria-label="退出项目" title="退出项目" @click="exitVisible = true">
          <icon-logout :size="18" aria-hidden="true" />
        </uiButton>
        <uiButton
          class="toolButton"
          variant="ghost"
          size="icon-sm"
          :aria-label="hasDesktopUpdate ? '设置，有新版本可用' : '设置'"
          title="设置"
          @click="emit('openSettings')">
          <span class="settingsIcon">
            <icon-settings :size="18" aria-hidden="true" />
            <span v-if="hasDesktopUpdate" class="updateDot" aria-hidden="true" />
          </span>
        </uiButton>
      </div>
    </uiCard>
    <uiDialog v-model:open="exitVisible">
      <uiDialogContent class="sm:max-w-[360px]">
        <uiDialogHeader>
          <uiDialogTitle>退出项目</uiDialogTitle>
          <uiDialogDescription>是否退出当前项目并返回首页？</uiDialogDescription>
        </uiDialogHeader>
        <uiDialogFooter>
          <uiButton variant="outline" @click="exitVisible = false">取消</uiButton>
          <uiButton :disabled="leaving" @click="exitProject"><icon-loader-2 v-if="leaving" class="animate-spin" aria-hidden="true" />退出项目</uiButton>
        </uiDialogFooter>
      </uiDialogContent>
    </uiDialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { hasDesktopUpdate } from "@/stores/desktopUpdate";
import { uiButton } from "@/components/ui/button";
import { uiCard } from "@/components/ui/card";
import { uiDialog, uiDialogContent, uiDialogDescription, uiDialogFooter, uiDialogHeader, uiDialogTitle } from "@/components/ui/dialog";

const emit = defineEmits<{ openSettings: [] }>();
const router = useRouter();
const exitVisible = ref(false);
const leaving = ref(false);

async function exitProject() {
  if (leaving.value) return;
  leaving.value = true;
  try {
    await router.push("/home");
  } finally {
    leaving.value = false;
  }
}
</script>

<style scoped lang="scss">
.workspaceMenu {
  .menuCard {
    gap: 0;
    padding: 2px 4px;
    border-radius: var(--radius);
    box-shadow: none;

    .menuContent {
      display: flex;
      align-items: center;
      gap: 2px;

      .toolButton {
        width: 28px;
        height: 28px;

        .settingsIcon {
          position: relative;
          display: inline-flex;

          .updateDot {
            position: absolute;
            top: -2px;
            right: -2px;
            width: 7px;
            height: 7px;
            border: 1px solid var(--card);
            border-radius: 50%;
            background: var(--destructive);
          }
        }
      }
    }
  }
}
</style>
