<template>
  <uiDialog v-model:open="visible">
    <uiDialogContent
      class="sm:max-w-[520px]"
      :showCloseButton="!saving"
      :aria-describedby="undefined"
      @interactOutside="(event: Event) => event.preventDefault()"
      @escapeKeyDown="(event: Event) => saving && event.preventDefault()"
      @closeAutoFocus="emit('closed')">
      <uiDialogHeader>
        <uiDialogTitle>连接远程 Agent</uiDialogTitle>
      </uiDialogHeader>
      <form class="connectForm" @submit.prevent="connect">
        <fieldset class="formFields" :disabled="saving">
          <div class="formItem">
            <uiLabel for="agentConnectName">标识</uiLabel>
            <uiInput id="agentConnectName" v-model="name" placeholder="例如 storyAgent" autocomplete="off" maxlength="96" />
          </div>
          <div class="formItem">
            <uiLabel for="agentConnectCardUrl">Agent Card URL</uiLabel>
            <uiInput id="agentConnectCardUrl" v-model="cardUrl" placeholder="https://example.com/.well-known/agent-card.json" autocomplete="off" />
          </div>
          <div class="formItem">
            <uiLabel for="agentConnectToken">访问令牌（可选）</uiLabel>
            <div class="passwordField">
              <uiInput id="agentConnectToken" v-model="token" :type="tokenVisible ? 'text' : 'password'" autocomplete="off" />
              <uiButton
                class="passwordToggle"
                type="button"
                variant="ghost"
                size="icon-sm"
                :aria-label="tokenVisible ? '隐藏' : '显示'"
                :aria-pressed="tokenVisible"
                @click="tokenVisible = !tokenVisible">
                <icon-eye-off v-if="tokenVisible" aria-hidden="true" />
                <icon-eye v-else aria-hidden="true" />
              </uiButton>
            </div>
          </div>
        </fieldset>
        <uiAlert v-if="error" variant="destructive">
          <icon-alert-circle aria-hidden="true" />
          <uiAlertTitle class="line-clamp-none">{{ error }}</uiAlertTitle>
        </uiAlert>
      </form>
      <uiDialogFooter>
        <uiButton variant="outline" :disabled="saving" @click="visible = false">取消</uiButton>
        <uiButton :disabled="saving || !name.trim() || !cardUrl.trim()" @click="connect"><icon-loader-2 v-if="saving" class="animate-spin" aria-hidden="true" />连接</uiButton>
      </uiDialogFooter>
    </uiDialogContent>
  </uiDialog>
</template>

<script setup lang="ts">
import axios from "axios";
import { ref } from "vue";
import { toast } from "vue-sonner";
import { uiAlert, uiAlertTitle } from "@/components/ui/alert";
import { uiButton } from "@/components/ui/button";
import { uiDialog, uiDialogContent, uiDialogFooter, uiDialogHeader, uiDialogTitle } from "@/components/ui/dialog";
import { uiInput } from "@/components/ui/input";
import { uiLabel } from "@/components/ui/label";

const emit = defineEmits<{ saved: []; closed: [] }>();
const visible = ref(true);
const name = ref("");
const cardUrl = ref("");
const token = ref("");
const tokenVisible = ref(false);
const saving = ref(false);
const error = ref("");

async function connect() {
  if (saving.value) return;
  error.value = "";
  if (!/^[a-z][a-zA-Z0-9]{0,95}$/.test(name.value.trim())) {
    error.value = "标识须以小写字母开头，仅包含字母和数字";
    return;
  }
  if (!URL.canParse(cardUrl.value.trim()) || !["http:", "https:"].includes(new URL(cardUrl.value.trim()).protocol)) {
    error.value = "请输入有效的 HTTP 或 HTTPS Agent Card 地址";
    return;
  }
  saving.value = true;
  try {
    const { data } = await axios.post("/api/agents/connect", {
      name: name.value.trim(), cardUrl: cardUrl.value.trim(), ...(token.value.trim() ? { token: token.value.trim() } : {}),
    }, { headers: { "x-toonflow-workspace": "1" } });
    if (data.code !== 200) throw new Error(data.message || "连接失败");
    emit("saved");
    toast.success("远程 Agent 已连接");
    visible.value = false;
  } catch (cause) {
    error.value = axios.isAxiosError(cause) ? cause.response?.data?.message || cause.message : cause instanceof Error ? cause.message : "连接失败";
  } finally { saving.value = false; }
}
</script>

<style scoped lang="scss">
.connectForm {
  display: grid;
  gap: 16px;
  min-width: 0;

  .formFields {
    display: grid;
    gap: 16px;
    min-width: 0;
    margin: 0;
    padding: 0;
    border: 0;

    .formItem {
      display: grid;
      gap: 8px;
      min-width: 0;
    }
  }

  .passwordField {
    position: relative;
    :deep(input) { padding-right: 40px; }
    .passwordToggle { position: absolute; top: 50%; right: 2px; transform: translateY(-50%); }
  }
}
</style>
