<template>
  <uiCard v-if="status?.supported" class="codexProvider" style="gap:0; padding:0">
    <div class="cardBody" :style="{ padding: '20px' }">
      <div class="providerContent">
        <div class="providerMark" aria-hidden="true">
          <icon-brand-openai :size="34" />
        </div>
        <div class="providerInfo">
          <div class="providerHeading">
            <strong class="providerName" data-ui-text="default">Codex</strong>
            <uiBadge variant="outline">ChatGPT</uiBadge>
          </div>
          <span class="providerStatus" data-ui-text="info">{{ statusText }}</span>
          <a v-if="status.loginUrl" class="loginLink uiLink" :href="status.loginUrl" target="_blank">未自动打开浏览器时点击这里登录</a>
        </div>
        <uiButton v-if="status.linked" @click="unlink" variant="outline" type="button" :disabled="(busy)"><icon-loader-2 v-if="busy" class="animate-spin" aria-hidden="true" />取消链接</uiButton>
        <uiButton
          v-else
          @click="link"
          variant="default"
          type="button"
          :disabled="(!status.installed && !status.hasApiKey) || (busy || status.loggingIn)"><icon-loader-2 v-if="busy || status.loggingIn" class="animate-spin" aria-hidden="true" />{{ status.loggingIn ? "等待登录" : "链接 Codex" }}</uiButton>
      </div>
      <details class="advancedSettings">
        <summary>高级设置</summary>
        <form class="advancedForm uiForm" @submit.prevent="save">
          <fieldset class="formFields">
            <div class="formField">
              <uiLabel :for="portFieldId + '-1'">接口地址</uiLabel>
              <div class="inputGroup">
                <uiInput :id="portFieldId + '-1'" v-model="apiUrl" :placeholder="status.defaultApiUrl"></uiInput>
                <uiButton
                  @mousedown.prevent
                  v-if="apiUrl"
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="清除"
                  @click="apiUrl = ''; ($event.currentTarget as HTMLElement).closest('.inputGroup')?.querySelector('input')?.focus()">
                  <icon-x />
                </uiButton>
              </div>
            </div>
            <div class="formField">
              <uiLabel :for="portFieldId + '-2'">访问令牌</uiLabel>
              <div class="inputGroup">
                <uiInput
                  :id="portFieldId + '-2'"
                  v-model="apiKey"
                  autocomplete="off"
                  :placeholder="status.hasApiKey ? '已保存，留空保持不变' : '留空则使用本机 Codex 登录'"
                  :type="passwordVisible1 ? 'text' : 'password'"></uiInput>
                <uiButton
                  @mousedown.prevent
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  :aria-label="passwordVisible1 ? '隐藏密码' : '显示密码'"
                  @click="passwordVisible1 = !passwordVisible1">
                  <icon-eye-off v-if="passwordVisible1" />
                  <icon-eye v-else />
                </uiButton>
              </div>
              <span class="fieldHint" data-ui-text="info">需为包含 ChatGPT 账号信息的 Codex 访问令牌（JWT）；普通 API Key 请使用“添加自定义供应商”。图片生成始终使用本机 Codex。</span>
            </div>
            <div style="display:flex; flex-wrap:wrap; align-items:center; gap:8px">
              <uiButton variant="default" type="submit" :disabled="(saving)"><icon-loader-2 v-if="saving" class="animate-spin" aria-hidden="true" />保存</uiButton>
              <uiButton v-if="status.hasApiKey" @click="clearKey" variant="outline" type="button" :disabled="(saving)">清除访问令牌</uiButton>
            </div>
          </fieldset>
        </form>
      </details>
    </div>
  </uiCard>
</template>

<script setup lang="ts">
import { uiInput } from "@/components/ui/input";
import { uiLabel } from "@/components/ui/label";
import { uiButton } from "@/components/ui/button";
import { uiBadge } from "@/components/ui/badge";
import { uiCard } from "@/components/ui/card";
import { computed, onBeforeUnmount, onMounted, ref, useId } from "vue";
import http from "@/lib/http";
import { toast } from "vue-sonner";
import { IconBrandOpenai } from "@tabler/icons-vue";
import { t, translate } from "@toonflow/i18n/vue";
import { invalidateNodeModels } from "@toonflow/nodes-scaffold/nodeAi";

type CodexStatus = {
  supported: boolean; installed: boolean; loggedIn: boolean; email: string; linked: boolean; loggingIn: boolean; loginUrl: string;
  apiUrl: string; defaultApiUrl: string; hasApiKey: boolean;
};

const status = ref<CodexStatus>();
const busy = ref(false);
const saving = ref(false);
const apiUrl = ref("");
const apiKey = ref("");
let pollTimer: ReturnType<typeof setTimeout> | undefined;

const statusText = computed(() => {
  const value = status.value;
  if (!value) return "";
  if (value.linked && value.hasApiKey) return translate("已链接（自定义访问令牌）");
  if (value.linked) return value.email ? t`已链接：${value.email}` : translate("已链接");
  if (!value.installed && !value.hasApiKey) return translate("未检测到 Codex CLI，请先安装，或在高级设置中填写访问令牌");
  if (value.loggingIn) return translate("请在打开的浏览器中登录 ChatGPT 账号");
  return translate("链接后可使用 Codex 编写剧本和生成图片");
});

function applyStatus(next: CodexStatus) {
  const previous = status.value;
  const modelsChanged = previous !== undefined && (previous.linked !== next.linked || previous.apiUrl !== next.apiUrl || previous.hasApiKey !== next.hasApiKey);
  status.value = next;
  if (!previous || previous.apiUrl !== next.apiUrl) apiUrl.value = next.apiUrl === next.defaultApiUrl ? "" : next.apiUrl;
  if (modelsChanged) {
    invalidateNodeModels("language");
    invalidateNodeModels("media");
  }
  clearTimeout(pollTimer);
  // 登录进行中时轮询状态，浏览器授权完成后自动刷新为已链接。
  if (next.loggingIn) pollTimer = setTimeout(() => void loadStatus(), 2000);
}

async function loadStatus() {
  try {
    applyStatus(await http<CodexStatus>({ method: "GET", url: "/api/codex/status" }));
  } catch (error) {
    toast.error(error instanceof Error ? error.message : "读取 Codex 状态失败");
  }
}

function showError(error: unknown) {
  toast.error(error instanceof Error ? error.message : "操作失败");
}

async function request(path: "link" | "unlink") {
  busy.value = true;
  try {
    applyStatus(await http<CodexStatus>({ method: "POST", url: `/api/codex/${path}` }));
  } catch (error) {
    showError(error);
  } finally {
    busy.value = false;
  }
}

async function saveSettings(key?: string) {
  saving.value = true;
  try {
    applyStatus(await http<CodexStatus>({
      method: "PUT", url: "/api/codex/save", data: { apiUrl: apiUrl.value.trim(), ...(key === undefined ? {} : { apiKey: key }) },
    }));
    apiKey.value = "";
    toast.success("Codex 设置已保存");
  } catch (error) {
    showError(error);
  } finally {
    saving.value = false;
  }
}

// 访问令牌输入框留空表示保持已保存的值，只有“清除”按钮会删除令牌。
const save = () => saveSettings(apiKey.value.trim() || undefined);
const clearKey = () => saveSettings("");

const link = () => request("link");
const unlink = () => request("unlink");

onMounted(loadStatus);
onBeforeUnmount(() => clearTimeout(pollTimer));

const passwordVisible1 = ref(false);
const portFieldId = useId();
</script>

<style lang="scss" scoped>
.codexProvider {
  --el-card-padding: 20px 24px;
  margin-bottom: 16px;

  .providerContent {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 16px 20px;

    .providerMark {
      display: grid;
      place-items: center;
      flex: 0 0 60px;
      height: 60px;
      border-radius: var(--ui-radius-large);
      background: var(--el-fill-color-light);
      color: var(--el-text-color-primary);
    }

    .providerInfo {
      display: flex;
      flex: 1;
      flex-direction: column;
      gap: 4px;
      min-width: 160px;

      .providerHeading {
        display: flex;
        align-items: center;
        gap: 10px;

        .providerName {
          color: var(--el-text-color-primary);
          font-size: 18px;
          font-weight: 600;
        }
      }

      .loginLink { align-self: flex-start; }
    }
  }

  .advancedSettings {
    margin-top: 16px;

    summary {
      cursor: pointer;
      color: var(--el-text-color-secondary);
      font-size: 13px;
    }

    .advancedForm {
      margin-top: 12px;

      .fieldHint {
        display: block;
        margin-top: 4px;
        line-height: 1.5;
      }
    }
  }
}
</style>
