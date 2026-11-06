<template>
  <el-card v-if="status?.supported" class="codexProvider" shadow="never">
    <div class="providerContent">
      <div class="providerMark" aria-hidden="true"><icon-brand-openai :size="34" /></div>
      <div class="providerInfo">
        <div class="providerHeading">
          <el-text class="providerName" tag="strong">Codex</el-text>
          <el-tag size="small" type="info" effect="plain">ChatGPT</el-tag>
        </div>
        <el-text class="providerStatus" size="small" type="info">{{ statusText }}</el-text>
        <el-link v-if="status.loginUrl" class="loginLink" :href="status.loginUrl" target="_blank" type="primary">未自动打开浏览器时点击这里登录</el-link>
      </div>
      <el-button v-if="status.linked" plain :loading="busy" @click="unlink">取消链接</el-button>
      <el-button v-else type="primary" :loading="busy || status.loggingIn" :disabled="!status.installed && !status.hasApiKey" @click="link">
        {{ status.loggingIn ? "等待登录" : "链接 Codex" }}
      </el-button>
    </div>
    <details class="advancedSettings">
      <summary>高级设置</summary>
      <el-form class="advancedForm" labelPosition="top" @submit.prevent="save">
        <el-form-item label="接口地址">
          <el-input v-model="apiUrl" :placeholder="status.defaultApiUrl" clearable />
        </el-form-item>
        <el-form-item label="访问令牌">
          <el-input v-model="apiKey" type="password" showPassword autocomplete="off"
            :placeholder="status.hasApiKey ? '已保存，留空保持不变' : '留空则使用本机 Codex 登录'" />
          <el-text class="fieldHint" size="small" type="info">需为包含 ChatGPT 账号信息的 Codex 访问令牌（JWT）；普通 API Key 请使用“添加自定义供应商”。图片生成始终使用本机 Codex。</el-text>
        </el-form-item>
        <el-space>
          <el-button type="primary" nativeType="submit" :loading="saving">保存</el-button>
          <el-button v-if="status.hasApiKey" :disabled="saving" @click="clearKey">清除访问令牌</el-button>
        </el-space>
      </el-form>
    </details>
  </el-card>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import http from "@/lib/http";
import { ElMessage } from "element-plus";
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
    ElMessage.error(error instanceof Error ? error.message : "读取 Codex 状态失败");
  }
}

function showError(error: unknown) {
  ElMessage.error(error instanceof Error ? error.message : "操作失败");
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
    ElMessage.success("Codex 设置已保存");
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
