<template>
  <form class="network uiForm" @submit.prevent="saveNetwork">
    <fieldset class="formFields" :disabled="busy">
      <div class="networkHeader">
        <uiRadioGroup v-model="form.mode" class="proxyModes" aria-label="代理模式">
          <uiLabel class="radioField"><uiRadioGroupItem :value="'none'" />不使用代理</uiLabel>
          <uiLabel class="radioField"><uiRadioGroupItem :value="'system'" />使用系统代理设置</uiLabel>
          <uiLabel class="radioField"><uiRadioGroupItem :value="'custom'" />自定义代理</uiLabel>
        </uiRadioGroup>
        <div class="networkActions">
          <uiButton @click="testNetwork" variant="outline" type="button" :disabled="(busy) || (testing) || (busy)"><icon-loader-2 v-if="testing" class="animate-spin" aria-hidden="true" />测试</uiButton>
          <uiButton variant="default" type="submit" :disabled="(busy) || (saving) || (busy)"><icon-loader-2 v-if="saving" class="animate-spin" aria-hidden="true" />确定</uiButton>
        </div>
      </div>
      <p class="description">控制服务端 AI、媒体等网络请求，保存后生效。</p>
      <p v-if="form.mode === 'system'" class="description">使用服务端所在设备的系统 HTTP(S) 代理：Windows、macOS 读取静态代理，其他平台读取代理环境变量。暂不支持 PAC 自动配置。</p>
      <div v-if="form.mode === 'custom'" class="customProxy">
        <div class="formField">
          <uiLabel :for="portFieldId + '-1'">代理协议</uiLabel>
          <uiSelect
            :modelValue="String(form.protocol) === '' ? '__empty__' : (form.protocol)"
            @update:modelValue="selected => { const value = selected === '__empty__' ? '' : selected; form.protocol = value as typeof form.protocol; }">
            <uiSelectTrigger :id="portFieldId + '-1'" class="protocolSelect" aria-label="代理协议">
              <uiSelectValue />
            </uiSelectTrigger>
            <uiSelectContent>
              <uiSelectItem value="http">HTTP 代理</uiSelectItem>
              <uiSelectItem value="https">HTTPS 代理</uiSelectItem>
            </uiSelectContent>
          </uiSelect>
        </div>
        <div class="proxyFields">
          <div class="formField">
            <uiLabel :for="portFieldId + '-2'">服务器</uiLabel>
            <uiInput
              :id="portFieldId + '-2'"
              v-model="form.host"
              dir="ltr"
              placeholder="请输入 IP 或域名"
              autocomplete="off"
              :disabled="(busy) || (false)"></uiInput>
          </div>
          <div class="formField">
            <uiLabel :for="portFieldId + '-3'">端口</uiLabel>
            <uiNumberField class="numberField" v-model="form.port" :min="1" :max="65535" :formatOptions="{ maximumFractionDigits: 0, minimumFractionDigits: 0 }">
              <uiNumberFieldContent>
                <uiNumberFieldInput :id="portFieldId + '-3'" :aria-label="'代理端口'" />
              </uiNumberFieldContent>
            </uiNumberField>
          </div>
          <div class="formField">
            <uiLabel :for="portFieldId + '-4'">用户名</uiLabel>
            <uiInput :id="portFieldId + '-4'" v-model="form.username" autocomplete="off" :disabled="(busy) || (false)"></uiInput>
          </div>
          <div class="formField">
            <uiLabel :for="portFieldId + '-5'">密码</uiLabel>
            <div class="inputGroup">
              <uiInput
                :id="portFieldId + '-5'"
                v-model="form.password"
                autocomplete="off"
                :disabled="(busy) || (false)"
                :type="passwordVisible1 ? 'text' : 'password'"></uiInput>
              <uiButton
                @mousedown.prevent
                type="button"
                variant="ghost"
                size="icon-sm"
                :aria-label="passwordVisible1 ? '隐藏密码' : '显示密码'"
                :disabled="busy"
                @click="passwordVisible1 = !passwordVisible1">
                <icon-eye-off v-if="passwordVisible1" />
                <icon-eye v-else />
              </uiButton>
            </div>
          </div>
        </div>
      </div>
      <p class="description">测试地址：<span dir="ltr">https://www.baidu.com/robots.txt</span></p>
      <uiAlert v-if="requestError" variant="destructive">
        <uiAlertTitle class="whitespace-normal overflow-visible line-clamp-none">{{ requestError }}</uiAlertTitle>
      </uiAlert>
      <uiAlert v-else-if="testLatency !== null">
        <uiAlertTitle class="whitespace-normal overflow-visible line-clamp-none">{{ `连接成功，耗时 ${testLatency} ms` }}</uiAlertTitle>
      </uiAlert>
    </fieldset>
  </form>
</template>

<script setup lang="ts">
import { uiAlert, uiAlertTitle } from "@/components/ui/alert";
import { uiNumberField, uiNumberFieldContent, uiNumberFieldInput } from "@/components/ui/numberField";
import { uiInput } from "@/components/ui/input";
import { uiSelect, uiSelectTrigger, uiSelectValue, uiSelectContent, uiSelectItem } from "@/components/ui/select";
import { uiButton } from "@/components/ui/button";
import { uiLabel } from "@/components/ui/label";
import { uiRadioGroup, uiRadioGroupItem } from "@/components/ui/radioGroup";
import { translate } from "@toonflow/i18n/vue";
import axios from "axios";
import { computed, onBeforeUnmount, reactive, ref, watch, useId } from "vue";
import { toast } from "vue-sonner";
import { saveSettings, settings } from "@/stores/settings";

type NetworkSettings = {
  mode: "none" | "system" | "custom";
  protocol: "http" | "https";
  host: string;
  port: number;
  username: string;
  password: string;
};
const raw = settings.value.network;
const saved = raw && typeof raw === "object" && !Array.isArray(raw) ? raw as Partial<NetworkSettings> : {};
const form = reactive<NetworkSettings>({
  mode: saved.mode === "system" || saved.mode === "custom" ? saved.mode : "none",
  protocol: saved.protocol === "https" ? "https" : "http",
  host: typeof saved.host === "string" ? saved.host : "",
  port: typeof saved.port === "number" ? saved.port : 80,
  username: typeof saved.username === "string" ? saved.username : "",
  password: typeof saved.password === "string" ? saved.password : "",
});
const testing = ref(false);
const saving = ref(false);
const busy = computed(() => testing.value || saving.value);
const requestError = ref("");
const testLatency = ref<number | null>(null);
const controller = new AbortController();
onBeforeUnmount(() => controller.abort());
watch(form, () => {
  requestError.value = "";
  testLatency.value = null;
});

function readForm() {
  const network = { ...form, host: form.host.trim() };
  const validPort = Number.isInteger(network.port) && network.port >= 1 && network.port <= 65535;
  if (network.mode === "custom") {
    if (!network.host || /[\s/@?#]/.test(network.host)) throw new Error("请输入有效的代理服务器 IP 或域名，不包含协议和路径");
    if (!validPort) throw new Error("代理端口必须为 1 到 65535 的整数");
  } else if (!validPort) network.port = 80;
  return network;
}

function errorMessage(cause: unknown) {
  return axios.isAxiosError<{ message?: string }>(cause)
    ? cause.response?.data?.message || cause.message
    : cause instanceof Error ? cause.message : translate("网络设置操作失败");
}

async function testNetwork() {
  if (busy.value) return;
  testing.value = true;
  requestError.value = "";
  testLatency.value = null;
  try {
    const { data } = await axios.post<{ code: number; data: { latency: number }; message?: string }>(
      "/api/settings/network/test", { network: readForm() }, { headers: { "x-toonflow-workspace": "1" }, signal: controller.signal },
    );
    if (data.code !== 200) throw new Error(data.message || "代理连接测试失败");
    testLatency.value = Math.round(data.data.latency);
  } catch (cause) {
    if (!controller.signal.aborted) requestError.value = errorMessage(cause);
  } finally {
    testing.value = false;
  }
}

async function saveNetwork() {
  if (busy.value) return;
  saving.value = true;
  requestError.value = "";
  try {
    const network = readForm();
    await saveSettings(() => ({ network }));
    toast.success("网络设置已保存");
  } catch (cause) {
    requestError.value = errorMessage(cause);
    if (controller.signal.aborted) toast.error(requestError.value);
  } finally {
    saving.value = false;
  }
}

const passwordVisible1 = ref(false);
const portFieldId = useId();
</script>

<style lang="scss" scoped>
.network {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 0 4px 8px;

  .networkHeader {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;

    .proxyModes {
      gap: 4px 20px;

      :is(.el-radio, .radioField) { margin-right: 0; }
    }

    .networkActions {
      display: flex;
      flex-shrink: 0;
      gap: 8px;

      [data-slot="button"] { margin-left: 0; }
    }
  }

  .description {
    margin: 0;
    color: var(--el-text-color-secondary);
    font-size: 13px;
    line-height: 1.6;
    overflow-wrap: anywhere;
  }

  .customProxy {
    .protocolSelect { width: 200px; max-width: 100%; }

    .proxyFields {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0 20px;

      :is(.el-input-number, .numberField) { width: 100%; }

      @media (max-width: 700px) { grid-template-columns: minmax(0, 1fr); }
    }
  }
}
</style>
