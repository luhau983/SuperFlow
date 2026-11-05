<template>
  <div class="multiTenant">
    <div v-if="loading" class="loadingSkeleton" aria-busy="true">
      <uiSkeleton class="h-4 w-2/5" />
      <uiSkeleton class="h-4 w-full" />
      <uiSkeleton class="h-4 w-full" />
      <uiSkeleton class="h-4 w-3/5" />
    </div>
    <div v-else-if="status?.configured" class="configuredSettings">
      <div class="enabledRow">
        <div class="settingInfo">
          <uiLabel for="configuredMultiTenantEnabled">开启多租户</uiLabel>
          <uiBadge :variant="status.enabled ? 'default' : 'secondary'">{{ status.enabled ? translate("已开启") : translate("未开启") }}</uiBadge>
        </div>
        <uiSwitch
          id="configuredMultiTenantEnabled"
          :modelValue="status.enabled"
          :disabled="saving || credentialsVisible"
          aria-label="开启多租户"
          @update:modelValue="changeEnabled" />
      </div>
      <div class="formActions">
        <uiButton :disabled="saving || credentialsVisible" @click="openAdmin">进入超管后台</uiButton>
      </div>
    </div>
    <form v-else-if="status?.canSetup" class="setupForm" @submit.prevent="save">
      <fieldset class="credentialsGroup" :disabled="saving">
        <legend>超级管理员</legend>
        <div class="formField accountField">
          <uiLabel for="setupAdminUserName">超级管理员账号<span class="requiredMark" aria-hidden="true">*</span></uiLabel>
          <uiInput
            id="setupAdminUserName"
            ref="userNameInput"
            v-model="userName"
            autocomplete="username"
            :maxlength="64"
            required
            :aria-invalid="!!userNameError || undefined" />
          <p v-if="userNameError" class="fieldError" role="alert">{{ userNameError }}</p>
        </div>
        <div class="formField">
          <uiLabel for="setupAdminPassword">超级管理员密码<span class="requiredMark" aria-hidden="true">*</span></uiLabel>
          <div class="passwordField">
            <uiInput
              id="setupAdminPassword"
              ref="passwordInput"
              v-model="password"
              :type="visiblePasswords.setup ? 'text' : 'password'"
              autocomplete="new-password"
              :minlength="8"
              :maxlength="128"
              required
              :aria-invalid="!!passwordError || undefined" />
            <uiButton
              type="button"
              class="passwordToggle"
              variant="ghost"
              size="icon-sm"
              :aria-label="visiblePasswords.setup ? translate('隐藏密码') : translate('显示密码')"
              :aria-pressed="visiblePasswords.setup"
              @click="visiblePasswords.setup = !visiblePasswords.setup">
              <icon-eye-off v-if="visiblePasswords.setup" aria-hidden="true" />
              <icon-eye v-else aria-hidden="true" />
            </uiButton>
          </div>
          <p v-if="passwordError" class="fieldError" role="alert">{{ passwordError }}</p>
        </div>
        <div class="formField">
          <uiLabel for="setupAdminPasswordConfirm">确认密码<span class="requiredMark" aria-hidden="true">*</span></uiLabel>
          <div class="passwordField">
            <uiInput
              id="setupAdminPasswordConfirm"
              ref="confirmationInput"
              v-model="passwordConfirm"
              :type="visiblePasswords.confirm ? 'text' : 'password'"
              autocomplete="new-password"
              :minlength="8"
              :maxlength="128"
              required
              :aria-invalid="!!confirmationError || undefined" />
            <uiButton
              type="button"
              class="passwordToggle"
              variant="ghost"
              size="icon-sm"
              :aria-label="visiblePasswords.confirm ? translate('隐藏密码') : translate('显示密码')"
              :aria-pressed="visiblePasswords.confirm"
              @click="visiblePasswords.confirm = !visiblePasswords.confirm">
              <icon-eye-off v-if="visiblePasswords.confirm" aria-hidden="true" />
              <icon-eye v-else aria-hidden="true" />
            </uiButton>
          </div>
          <p v-if="confirmationError" class="fieldError" role="alert">{{ confirmationError }}</p>
        </div>
      </fieldset>
      <div class="enabledRow">
        <uiLabel for="setupMultiTenantEnabled">开启多租户</uiLabel>
        <uiSwitch id="setupMultiTenantEnabled" v-model="enabled" :disabled="saving" aria-label="开启多租户" />
      </div>
      <div class="formActions">
        <uiButton type="submit" :disabled="saving"><icon-loader-2 v-if="saving" class="animate-spin" aria-hidden="true" />保存</uiButton>
      </div>
    </form>
    <uiAlert v-else-if="status" variant="destructive">
      <icon-alert-circle aria-hidden="true" />
      <uiAlertTitle class="alertText">请在服务端本机设置超级管理员账号和密码</uiAlertTitle>
    </uiAlert>
    <uiAlert v-if="requestError" variant="destructive">
      <icon-alert-circle aria-hidden="true" />
      <uiAlertTitle class="alertText">{{ requestError }}</uiAlertTitle>
    </uiAlert>
    <uiButton v-if="!loading && !status" class="retryButton" variant="outline" @click="loadStatus">重新读取</uiButton>
    <uiDialog v-model:open="credentialsVisible">
      <uiDialogContent
        :aria-describedby="undefined"
        class="credentialsDialog sm:max-w-[420px]"
        :showCloseButton="!saving"
        @interactOutside="(event) => event.preventDefault()"
        @escapeKeyDown="(event) => saving && event.preventDefault()">
        <uiDialogHeader>
          <uiDialogTitle>验证超级管理员</uiDialogTitle>
        </uiDialogHeader>
        <form id="multiTenantCredentialsForm" class="credentialsForm" @submit.prevent="confirmEnabled">
          <fieldset class="credentialsFields" :disabled="saving">
            <div class="formField">
              <uiLabel for="verifyAdminUserName">超级管理员账号<span class="requiredMark" aria-hidden="true">*</span></uiLabel>
              <uiInput
                id="verifyAdminUserName"
                ref="userNameInput"
                v-model="userName"
                autocomplete="username"
                :maxlength="64"
                required
                :aria-invalid="!!userNameError || undefined" />
              <p v-if="userNameError" class="fieldError" role="alert">{{ userNameError }}</p>
            </div>
            <div class="formField">
              <uiLabel for="verifyAdminPassword">超级管理员密码<span class="requiredMark" aria-hidden="true">*</span></uiLabel>
              <div class="passwordField">
                <uiInput
                  id="verifyAdminPassword"
                  ref="passwordInput"
                  v-model="password"
                  :type="visiblePasswords.verify ? 'text' : 'password'"
                  autocomplete="current-password"
                  :minlength="8"
                  :maxlength="128"
                  required
                  :aria-invalid="!!passwordError || undefined" />
                <uiButton
                  type="button"
                  class="passwordToggle"
                  variant="ghost"
                  size="icon-sm"
                  :aria-label="visiblePasswords.verify ? translate('隐藏密码') : translate('显示密码')"
                  :aria-pressed="visiblePasswords.verify"
                  @click="visiblePasswords.verify = !visiblePasswords.verify">
                  <icon-eye-off v-if="visiblePasswords.verify" aria-hidden="true" />
                  <icon-eye v-else aria-hidden="true" />
                </uiButton>
              </div>
              <p v-if="passwordError" class="fieldError" role="alert">{{ passwordError }}</p>
            </div>
            <uiAlert v-if="credentialsError" variant="destructive">
              <icon-alert-circle aria-hidden="true" />
              <uiAlertTitle class="alertText">{{ credentialsError }}</uiAlertTitle>
            </uiAlert>
          </fieldset>
        </form>
        <uiDialogFooter>
          <uiButton variant="outline" :disabled="saving" @click="credentialsVisible = false">取消</uiButton>
          <uiButton type="submit" form="multiTenantCredentialsForm" :disabled="saving"><icon-loader-2 v-if="saving" class="animate-spin" aria-hidden="true" />确认</uiButton>
        </uiDialogFooter>
      </uiDialogContent>
    </uiDialog>
  </div>
</template>

<script setup lang="ts">
import { translate } from "@toonflow/i18n/vue";
import { onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
import http from "@/lib/http";
import { actualPlatform } from "@/lib/platform";
import { applyMultiTenantEnabled } from "@/stores/settings";
import { uiAlert, uiAlertTitle } from "@/components/ui/alert";
import { uiBadge } from "@/components/ui/badge";
import { uiButton } from "@/components/ui/button";
import { uiDialog, uiDialogContent, uiDialogFooter, uiDialogHeader, uiDialogTitle } from "@/components/ui/dialog";
import { uiInput } from "@/components/ui/input";
import { uiLabel } from "@/components/ui/label";
import { uiSkeleton } from "@/components/ui/skeleton";
import { uiSwitch } from "@/components/ui/switch";

const router = useRouter();
const hostWindow = window as Window & { __electrobunSendToHost?: (message: { type: "openExternal"; url: string }) => void };
const status = ref<{ configured: boolean; enabled: boolean; canSetup: boolean } | null>(null);
const loading = ref(true);
const saving = ref(false);
const userName = ref("");
const password = ref("");
const passwordConfirm = ref("");
const enabled = ref(false);
const userNameError = ref("");
const passwordError = ref("");
const confirmationError = ref("");
const requestError = ref("");
const credentialsVisible = ref(false);
const credentialsError = ref("");
const pendingEnabled = ref<boolean | null>(null);
const userNameInput = ref<{ $el: HTMLInputElement }>();
const passwordInput = ref<{ $el: HTMLInputElement }>();
const confirmationInput = ref<{ $el: HTMLInputElement }>();
const visiblePasswords = reactive({ setup: false, confirm: false, verify: false });
const controller = new AbortController();
let readingStatus = false;

watch([userName, password, passwordConfirm], () => {
  userNameError.value = "";
  passwordError.value = "";
  confirmationError.value = "";
  requestError.value = "";
  credentialsError.value = "";
});

// 替代 el-dialog 的 @closed：对话框关闭后清空凭据
watch(credentialsVisible, (visible) => {
  if (!visible) clearCredentials();
});

function openAdmin() {
  const url = new URL(router.resolve("/multiTenant").href, window.location.origin);
  if (actualPlatform.isDesktop && hostWindow.__electrobunSendToHost) {
    hostWindow.__electrobunSendToHost({ type: "openExternal", url: url.href });
    return;
  }
  window.open(url.href, "_blank", "noopener,noreferrer,popup,width=1100,height=800");
}

async function loadStatus() {
  if (readingStatus || saving.value || credentialsVisible.value) return;
  readingStatus = true;
  const previous = status.value;
  if (!previous) loading.value = true;
  requestError.value = "";
  try {
    const loaded = await http<NonNullable<typeof status.value>>({ method: "GET", url: "/api/multiTenant/status", signal: controller.signal });
    if (status.value !== previous || saving.value || credentialsVisible.value || controller.signal.aborted) return;
    status.value = loaded;
    enabled.value = status.value.enabled;
    applyMultiTenantEnabled(status.value.enabled);
  } catch (cause) {
    if (!controller.signal.aborted) requestError.value = cause instanceof Error ? cause.message : translate("读取多租户状态失败");
  } finally { readingStatus = false; loading.value = false; }
}

function validateCredentials() {
  const name = userName.value.trim();
  if (!name || name.length > 64) {
    userNameError.value = translate("账号长度应为 1 到 64 个字符");
    userNameInput.value?.$el.focus();
    return false;
  }
  if (/[\s\u0000-\u001f\u007f]/.test(name)) {
    userNameError.value = translate("账号不能包含空白或控制字符");
    userNameInput.value?.$el.focus();
    return false;
  }
  if (password.value.length < 8 || password.value.length > 128) {
    passwordError.value = translate("密码长度应为 8 到 128 个字符");
    passwordInput.value?.$el.focus();
    return false;
  }
  return true;
}

async function save() {
  if (saving.value || !status.value?.canSetup || status.value.configured || !validateCredentials()) return;
  if (password.value !== passwordConfirm.value) {
    confirmationError.value = translate("两次输入的密码不一致");
    confirmationInput.value?.$el.focus();
    return;
  }
  saving.value = true;
  requestError.value = "";
  try {
    const saved = await http<{ configured: boolean; enabled: boolean }>({
      method: "POST", url: "/api/multiTenant/setup", data: { userName: userName.value.trim(), password: password.value, enabled: enabled.value }, signal: controller.signal,
    });
    status.value = { ...saved, canSetup: false };
    applyMultiTenantEnabled(saved.enabled);
    password.value = "";
    passwordConfirm.value = "";
  } catch (cause) {
    if (!controller.signal.aborted) requestError.value = cause instanceof Error ? cause.message : translate("保存多租户设置失败");
  } finally { saving.value = false; }
}

function changeEnabled(value: boolean | string | number) {
  if (saving.value || credentialsVisible.value || !status.value?.configured || typeof value !== "boolean" || value === status.value.enabled) return;
  pendingEnabled.value = value;
  credentialsError.value = "";
  requestError.value = "";
  credentialsVisible.value = true;
}

async function confirmEnabled() {
  if (saving.value || !status.value?.configured || pendingEnabled.value === null || !validateCredentials()) return;
  const value = pendingEnabled.value;
  saving.value = true;
  credentialsError.value = "";
  try {
    const { token } = await http<{ token: string }>({
      method: "POST", url: "/api/multiTenant/login", data: { userName: userName.value.trim(), password: password.value }, signal: controller.signal,
    });
    const saved = await http<{ enabled: boolean }>({
      method: "PUT", url: "/api/multiTenant/enabled", data: { enabled: value },
      headers: { Authorization: `Bearer ${token}` }, signal: controller.signal,
    });
    status.value = { ...status.value, enabled: saved.enabled };
    applyMultiTenantEnabled(saved.enabled);
    credentialsVisible.value = false;
    password.value = "";
  } catch (cause) {
    if (!controller.signal.aborted) credentialsError.value = cause instanceof Error ? cause.message : translate("保存多租户设置失败");
  } finally { saving.value = false; }
}

function clearCredentials() {
  userName.value = "";
  password.value = "";
  userNameError.value = "";
  passwordError.value = "";
  credentialsError.value = "";
  pendingEnabled.value = null;
  visiblePasswords.verify = false;
}

onMounted(() => {
  window.addEventListener("focus", loadStatus);
  void loadStatus();
});
onBeforeUnmount(() => {
  window.removeEventListener("focus", loadStatus);
  controller.abort();
  clearCredentials();
  passwordConfirm.value = "";
});
</script>

<style lang="scss" scoped>
.multiTenant {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  min-width: 0;
  color: var(--foreground);

  .loadingSkeleton {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .alertText {
    line-clamp: none;
    -webkit-line-clamp: none;
    white-space: normal;
    overflow-wrap: anywhere;
  }

  .configuredSettings,
  .setupForm {
    width: 100%;
    min-width: 0;

    .enabledRow {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
      min-height: 76px;
      padding: 20px 0;
      box-sizing: border-box;
      border-bottom: 1px solid var(--border);

      .settingInfo {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 10px;
        min-width: 0;
      }

      label {
        min-width: 0;
        font-size: 14px;
        font-weight: 500;
        line-height: 1.6;
        overflow-wrap: anywhere;
      }
    }

    .formActions {
      display: flex;
      padding-top: 24px;

      button {
        min-width: 140px;
        min-height: 44px;
        margin: 0;
        font-weight: 500;
      }
    }
  }

  .setupForm {
    .credentialsGroup {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      column-gap: 20px;
      min-width: 0;
      padding: 0;
      margin: 0;
      border: 0;

      legend {
        padding: 0;
        margin-bottom: 20px;
        color: var(--foreground);
        font-size: 15px;
        font-weight: 600;
        line-height: 1.6;
      }

      .accountField { grid-column: 1 / -1; }
    }

    .enabledRow { border-top: 1px solid var(--border); }
  }

  .formField {
    display: grid;
    gap: 8px;
    min-width: 0;
    margin-bottom: 24px;

    input { height: 44px; }

    .requiredMark { margin-inline-start: -4px; color: var(--destructive); }

    .passwordField {
      position: relative;

      input { padding-inline-end: 40px; }

      .passwordToggle {
        position: absolute;
        top: 50%;
        inset-inline-end: 6px;
        transform: translateY(-50%);
        color: var(--muted-foreground);
      }
    }

    .fieldError {
      margin: 0;
      color: var(--destructive);
      font-size: 13px;
      line-height: 1.5;
    }
  }

  .retryButton { align-self: flex-start; margin-left: 0; }

  @media (max-width: 680px) {
    .setupForm .credentialsGroup { grid-template-columns: minmax(0, 1fr); }

    .configuredSettings,
    .setupForm {
      .enabledRow { gap: 16px; }
      .formActions button { width: 100%; }
    }
  }
}

.credentialsDialog {
  .credentialsForm {
    padding-top: 8px;

    .credentialsFields {
      min-width: 0;
      padding: 0;
      margin: 0;
      border: 0;
    }

    .formField {
      display: grid;
      gap: 8px;
      min-width: 0;
      margin-bottom: 24px;

      input { height: 44px; }

      .requiredMark { margin-inline-start: -4px; color: var(--destructive); }

      .passwordField {
        position: relative;

        input { padding-inline-end: 40px; }

        .passwordToggle {
          position: absolute;
          top: 50%;
          inset-inline-end: 6px;
          transform: translateY(-50%);
          color: var(--muted-foreground);
        }
      }

      .fieldError {
        margin: 0;
        color: var(--destructive);
        font-size: 13px;
        line-height: 1.5;
      }
    }

    .alertText {
      line-clamp: none;
      -webkit-line-clamp: none;
      white-space: normal;
      overflow-wrap: anywhere;
    }
  }
}
</style>
