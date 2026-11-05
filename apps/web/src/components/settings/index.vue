<template>
  <uiDialog v-model:open="visible" :unmountOnHide="false">
    <uiDialogContent
      v-if="rendered"
      class="flex w-[min(1080px,calc(100vw-32px))] max-w-[min(1080px,calc(100vw-32px))] flex-col gap-0 p-0 sm:max-w-[min(1080px,calc(100vw-32px))]"
      :aria-describedby="undefined">
      <uiDialogHeader class="settingsHeader">
        <uiDialogTitle>设置</uiDialogTitle>
      </uiDialogHeader>
      <uiSeparator />
      <div class="settings">
        <nav class="sidebar" aria-label="设置分类">
          <template v-for="item in settingsPanels" :key="item.id">
            <h3 v-if="item.groupLabel" class="settingsGroupLabel">{{ item.groupLabel }}</h3>
            <uiButton
              class="settingsItem"
              :class="{ active: activePanel.id === item.id }"
              variant="ghost"
              type="button"
              :aria-label="item.id === 'about' && hasDesktopUpdate ? `${item.label}，有新版本可用` : item.label"
              :aria-pressed="activePanel.id === item.id"
              @click="activePanel = item">
              <span class="panelIcon">
                <component :is="item.icon" :size="18" aria-hidden="true" />
                <span v-if="item.id === 'about' && hasDesktopUpdate" class="updateDot" />
              </span>
              <span class="itemLabel">{{ item.label }}</span>
            </uiButton>
          </template>
        </nav>
        <section class="content" :aria-label="activePanel.label" tabindex="0">
          <h2 class="panelTitle">{{ activePanel.label }}</h2>
          <uiSeparator class="panelSeparator" />
          <div class="panelContent">
            <transition name="panelFade" mode="out-in">
              <keep-alive include="personalization">
                <userAccount
                  v-if="publicWeb && activePanel.id === 'account'"
                  :request="http"
                  :userName="currentUser?.userName ?? ''"
                  :role="currentUser?.role"
                  @loggedOut="loggedOut" />
                <component
                  v-else
                  :is="activePanel.component"
                  v-bind="
                    ['account', 'pluginMarket', 'languageModel', 'mediaModel', 'personalization', 'deviceLink'].includes(activePanel.id) ? { visible } : {}
                  " />
              </keep-alive>
            </transition>
          </div>
        </section>
      </div>
    </uiDialogContent>
  </uiDialog>
</template>

<script setup lang="ts">
import { translate } from "@toonflow/i18n/vue";
import { computed, defineAsyncComponent, ref, shallowRef, watch } from "vue";
import userAccount from "@toonflow/multi-tenant-user-web/account";
import { hasDesktopUpdate } from "@/stores/desktopUpdate";
import { multiTenantEnabled } from "@/stores/settings";
import { currentUser, publicWeb } from "@/stores/multiTenant";
import http from "@/lib/http";
import { isMobile } from "@/lib/platform";
import { uiButton } from "@/components/ui/button";
import { uiDialog, uiDialogContent, uiDialogHeader, uiDialogTitle } from "@/components/ui/dialog";
import { uiSeparator } from "@/components/ui/separator";
import {
  IconSettings,
  IconPhotoVideo,
  IconBuildingStore,
  IconInfoCircle,
  IconCode,
  IconPlugConnected,
  IconUserCog,
  IconSubtitlesAi,
  IconDevices,
  IconNetwork,
  IconUserCircle,
  IconUsersGroup,
} from "@tabler/icons-vue";

const allSettingsPanels = [
  { id: "account", label: "账号与余额", icon: IconUserCircle, component: defineAsyncComponent(() => import("./panels/account/index.vue")) },
  { id: "general", label: "通用设置", icon: IconSettings, component: defineAsyncComponent(() => import("./panels/general/index.vue")) },
  {
    id: "languageModel",
    label: "文本模型",
    icon: IconSubtitlesAi,
    groupLabel: "第三方模型",
    component: defineAsyncComponent(() => import("./panels/languageModel/index.vue")),
  },
  { id: "mediaModel", label: "媒体模型", icon: IconPhotoVideo, component: defineAsyncComponent(() => import("./panels/mediaModel/index.vue")) },
  {
    id: "pluginMarket",
    label: "插件市场",
    icon: IconBuildingStore,
    groupLabel: "市场",
    component: defineAsyncComponent(() => import("./panels/pluginMarket/index.vue")),
  },
  { id: "mcp", label: "MCP", icon: IconPlugConnected, groupLabel: "通讯", component: defineAsyncComponent(() => import("./panels/mcp/index.vue")) },
  { id: "network", label: "网络设置", icon: IconNetwork, component: defineAsyncComponent(() => import("./panels/network/index.vue")) },
  ...(!isMobile
    ? [{ id: "deviceLink", label: "设备互联", icon: IconDevices, component: defineAsyncComponent(() => import("./panels/deviceLink/index.vue")) }]
    : []),
  {
    id: "personalization",
    label: "个性化",
    icon: IconUserCog,
    groupLabel: "其他",
    component: defineAsyncComponent(() => import("./panels/personalization/index.vue")),
  },
  { id: "developer", label: "开发者选项", icon: IconCode, component: defineAsyncComponent(() => import("./panels/developer/index.vue")) },
  { id: "multiTenant", label: "多租户能力", icon: IconUsersGroup, component: defineAsyncComponent(() => import("./panels/multiTenant/developmentNotice.vue")) },
  { id: "about", label: "关于", icon: IconInfoCircle, component: defineAsyncComponent(() => import("./panels/about/index.vue")) },
];
const publicAccountPanel = { ...allSettingsPanels[0]!, get label() { return translate("账号"); } };
const settingsPanels = computed(() => allSettingsPanels.filter(item => {
  if (publicWeb.value && currentUser.value?.role === "user") return ["account", "general", "about"].includes(item.id);
  if (publicWeb.value && ["multiTenant", "deviceLink", "network", "mcp", "developer", "pluginMarket"].includes(item.id)) return false;
  return !multiTenantEnabled.value || !["languageModel", "mediaModel", "developer"].includes(item.id);
}).map(item => publicWeb.value && item.id === "account" ? publicAccountPanel : item));
const activePanel = shallowRef(settingsPanels.value[0]!);
const visible = defineModel<boolean>({ default: false });
// ACT: 与原 el-dialog 一致：首次打开才渲染，关闭后保持挂载（unmountOnHide=false），面板状态不丢失。
const rendered = ref(visible.value);

watch(visible, value => {
  if (value) rendered.value = true;
});

watch(settingsPanels, panels => {
  activePanel.value = panels.find(item => item.id === activePanel.value.id) ?? panels[0]!;
});

function loggedOut() { window.location.reload(); }

function openPanel(id: string) {
  const panel = settingsPanels.value.find(item => item.id === id);
  if (!panel) return false;
  activePanel.value = panel;
  visible.value = true;
  return true;
}

defineExpose({ openPanel });
</script>

<style lang="scss" scoped>
.settingsHeader {
  padding: 20px 24px 16px;
}

.settings {
  display: grid;
  grid-template-columns: 200px minmax(0, 1fr);
  height: min(72vh, calc(100dvh - 140px));
  overflow: hidden;

  .sidebar {
    display: flex;
    flex-direction: column;
    min-height: 0;
    overflow-y: auto;
    padding: 12px;
    border-inline-end: 1px solid var(--border);

    .settingsGroupLabel {
      margin: 14px 8px 6px;
      color: var(--muted-foreground);
      font-size: 12px;
      font-weight: 500;
      line-height: 1.5;
    }

    .settingsItem {
      justify-content: flex-start;
      gap: 10px;
      width: 100%;
      height: auto;
      min-height: 36px;
      padding: 8px 10px;
      margin-bottom: 2px;
      color: var(--muted-foreground);
      font-weight: 500;
      text-align: start;
      white-space: normal;

      .panelIcon {
        position: relative;
        display: inline-flex;
        flex-shrink: 0;

        .updateDot {
          position: absolute;
          top: -2px;
          right: -2px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--destructive);
        }
      }

      .itemLabel {
        min-width: 0;
        overflow-wrap: anywhere;
      }

      &:hover {
        color: var(--foreground);
      }

      &.active {
        background: var(--muted);
        color: var(--foreground);
      }
    }
  }

  .content {
    display: flex;
    flex-direction: column;
    min-height: 0;
    padding: 16px 20px 0 24px;
    overflow: hidden;
    outline: none;

    .panelTitle {
      flex-shrink: 0;
      margin: 0 0 12px;
      font-size: 18px;
      font-weight: 600;
    }

    .panelSeparator {
      flex-shrink: 0;
      margin-bottom: 20px;
    }

    .panelContent {
      flex: 1;
      min-height: 0;
      overflow-x: hidden;
      overflow-y: auto;
      overscroll-behavior: contain;
      padding-left: 5px;
      padding-right: 5px;
      padding-bottom: 50px;

      > .panelFade-enter-active,
      > .panelFade-leave-active {
        transition: opacity 100ms linear;
      }

      > .panelFade-enter-from,
      > .panelFade-leave-to {
        opacity: 0;
      }
    }
  }

  @media (max-width: 700px) {
    grid-template-columns: 56px minmax(0, 1fr);

    .sidebar {
      padding: 8px 6px;

      .settingsGroupLabel {
        margin: 12px 0 6px;
        text-align: center;
      }

      .settingsItem {
        justify-content: center;
        padding: 10px;

        .itemLabel {
          display: none;
        }
      }
    }

    .content {
      padding: 12px 8px 0 16px;
    }
  }
}
</style>
