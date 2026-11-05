<template>
  <main class="hello" :class="{ configuring: !multiTenantEnabled && view !== 'welcome' }">
    <div class="pageLanguage">
      <languageSelect popover />
    </div>
    <section class="welcomePanel" aria-labelledby="welcomeTitle">
      <div v-if="!multiTenantEnabled && view !== 'welcome'" class="providerContent">
        <header class="providerHeader">
          <uiButton @click="view = 'welcome'" variant="ghost" type="button" :disabled="(saving)"><component :is="IconArrowLeft" aria-hidden="true" />返回</uiButton>
          <h1 id="welcomeTitle">配置第三方模型</h1>
        </header>
        <div class="providerBody">
          <languageModel />
        </div>
        <uiButton
          @click="completeSetup"
          variant="default"
          type="button"
          :disabled="(!customProviders.some((provider) => provider.models.length)) || (saving)"><icon-loader-2 v-if="saving" class="animate-spin" aria-hidden="true" />开始使用</uiButton>
      </div>
      <div v-else class="welcomeContent">
        <h1 id="welcomeTitle">快速开始</h1>
        <p class="description">登录 SuperFlow 即可免配置快速开始，直接开启创作。</p>
        <accountPanel v-if="!loggedIn" class="accountContent" @loggedIn="startWithAccount" />
        <uiButton v-else class="startButton" type="button" :disabled="saving" @click="completeSetup"><icon-loader-2 v-if="saving" class="animate-spin" aria-hidden="true" />开始使用</uiButton>
        <div class="secondaryActions">
          <template v-if="!multiTenantEnabled">
            <uiButton class="secondaryButton" @click="view = 'custom'" variant="outline" type="button" :disabled="(saving)"><icon-key class="buttonIcon" />配置第三方模型</uiButton>
            <span class="separator">或</span>
          </template>
          <uiButton class="secondaryButton" @click="completeSetup" variant="outline" type="button" :disabled="(saving)"><icon-loader-2 v-if="saving" class="animate-spin" aria-hidden="true" />稍后配置</uiButton>
        </div>
      </div>
      <footer class="pageFooter">
        <uiButton class="deviceLink" @click="mobileConnectVisible = true" variant="outline" type="button" size="sm"><component :is="IconDevices" aria-hidden="true" />{{ mobileConnectionLabel }}</uiButton>
        <p>©{{ new Date().getFullYear() }}SuperFlow · 保留所有权利。</p>
      </footer>
    </section>
    <div class="artPanel" aria-hidden="true">
      <bg class="artBg" />
      <div class="artBrand">
        <span class="artLogo" v-html="logoSvg" />
        <span class="artName">SuperFlow</span>
      </div>
    </div>
    <mobileConnect v-model="mobileConnectVisible" />
  </main>
</template>

<script setup lang="ts">
import { uiButton } from "@/components/ui/button";
import { defineAsyncComponent, ref } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";
import { IconArrowLeft, IconDevices } from "@tabler/icons-vue";
import { customProviders, multiTenantEnabled, toonflowAccountToken } from "@/stores/settings";
import { useHelloStore } from "@/stores/hello";
import anonymousData from "@/lib/anonymousData";
import logoSvg from "@toonflow/assets/logo.svg?raw";
import bg from "./bg.vue";
import languageSelect from "@/components/languageSelect.vue";
import { mobileConnectionLabel } from "@/lib/mobile";

const accountPanel = defineAsyncComponent(() => import("@/components/settings/panels/account/index.vue"));
const languageModel = defineAsyncComponent(() => import("@/components/settings/panels/languageModel/index.vue"));
const mobileConnect = defineAsyncComponent(() => import("@/components/mobileConnect.vue"));
const mobileConnectVisible = ref(false);
const view = ref<"welcome" | "custom">("welcome");
const loggedIn = ref(!!toonflowAccountToken.value);
const saving = ref(false);
const router = useRouter();
const hello = useHelloStore();

function startWithAccount() {
  loggedIn.value = true;
  void completeSetup();
}

async function completeSetup() {
  if (saving.value) return;
  saving.value = true;
  try {
    await hello.complete();
    anonymousData.track(view.value === "custom" || toonflowAccountToken.value ? "onboarding.complete" : "onboarding.skip");
    await router.replace("/home");
  } catch {
    toast.error("保存引导状态失败，请重试");
  } finally {
    saving.value = false;
  }
}
</script>

<style lang="scss" scoped>
.hello {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 100svh;
  padding: 8px;
  background: var(--el-bg-color);
  color: var(--el-text-color-primary);
  font-family: var(--el-font-family);

  .pageLanguage {
    position: fixed;
    top: 16px;
    inset-inline-end: calc(50% + 8px);
    z-index: 2;
    max-width: calc(50% - 24px);
  }

  .welcomePanel {
    display: grid;
    grid-template-rows: 1fr auto;
    gap: 32px;
    min-width: 0;
    min-height: 544px;
    padding: 48px clamp(24px, 4.4vw, 64px);

    .providerContent {
      grid-row: 1;
      display: grid;
      grid-template-rows: auto minmax(0, 1fr) auto;
      gap: 24px;
      min-width: 0;
      min-height: 0;
      overflow: hidden;

      .providerHeader {
        h1 {
          margin: 16px 0 0;
          font-size: 28px;
          font-weight: 650;
        }
      }

      .providerBody {
        min-height: 0;
        overflow-y: auto;
        overscroll-behavior: contain;
        padding: 2px;
      }
    }

    .welcomeContent {
      grid-row: 1;
      align-self: center;
      justify-self: center;
      width: 100%;
      max-width: 420px;

      h1 {
        margin: 0 0 12px;
        font-size: clamp(32px, 3.4vw, 40px);
        font-weight: 650;
        line-height: 1.35;
        letter-spacing: -0.8px;
        text-align: center;
      }

      .description {
        margin: 0 0 24px;
        color: var(--el-text-color-secondary);
        font-size: 14px;
        line-height: 1.8;
        text-align: center;
      }

      .accountContent {
        padding: 0;

        :deep(.authHeader) {
          display: block;

          .authLogo, .authInfo {
            display: none;
          }

          .authTabs {
            width: 100%;
          }
        }
      }

      .startButton {
        width: 100%;
        min-height: 42px;
      }

      .buttonIcon {
        width: 18px;
        height: 18px;
        margin-inline-end: 8px;
      }

      .secondaryActions {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        gap: 10px;
        margin-top: 20px;

        .separator {
          color: var(--el-text-color-secondary);
          font-size: 13px;
        }

        .secondaryButton {
          height: auto;
          min-height: 36px;
          margin: 0;
          padding: 8px 16px;
          white-space: normal;
          font-size: 13px;
        }
      }
    }

    .pageFooter {
      grid-row: 2;
      align-self: end;
      color: var(--el-text-color-secondary);
      font-size: 12px;

      .deviceLink {
        margin: 0;
        padding: 6px 10px;
        color: var(--el-text-color-secondary);

        &:hover {
          color: var(--el-color-primary);
        }
      }

      p {
        margin: 10px 0 0;
        line-height: 1.6;
      }
    }
  }

  &.configuring {
    height: 100dvh;
    min-height: 0;
    overflow: hidden;

    .welcomePanel {
      grid-template-rows: minmax(0, 1fr) auto;
      gap: 24px;
      min-height: 0;

      .pageFooter {
        grid-row: 2;
      }
    }
  }

  .artPanel {
    position: relative;
    min-width: 0;
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
    padding: 28px;
    border-radius: calc(var(--ui-radius) * 1.125);
    overflow: hidden;
    background: radial-gradient(ellipse at 76% 82%, #f3dcb1 0%, transparent 46%), radial-gradient(ellipse at 25% 52%, #667ab5 0%, transparent 52%),
      radial-gradient(ellipse at 90% 18%, #369889 0%, transparent 48%), linear-gradient(145deg, #123f38, #467f72 48%, #a8c9ad);

    .artBg {
      z-index: 0;
    }

    .artBrand {
      position: relative;
      z-index: 1;
      display: flex;
      align-items: center;
      gap: 12px;
      color: #fff;

      .artLogo {
        width: 44px;
        height: 44px;
        line-height: 0;

        :deep(svg) {
          display: block;
          width: 100%;
          height: 100%;
        }      }

      .artName {
        font-size: 30px;
        font-weight: 600;
        letter-spacing: 0.4px;
      }
    }
  }

  @media (max-width: 700px) {
    grid-template-columns: 1fr;

    .pageLanguage {
      inset-inline-end: 16px;
      max-width: calc(100% - 32px);
    }

    .welcomePanel {
      padding: 32px 20px;
    }

    .artPanel {
      display: none;
    }
  }
}
</style>
