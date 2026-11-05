<template>
  <uiDialog :open="visible" @update:open="open => { if (!open) { visible = false; } }">
    <uiDialogContent
      :aria-describedby="undefined"
      class="uiDialogPanel"
      :style="{ width: 'min(440px, calc(100vw - 32px))', maxWidth: 'calc(100vw - 32px)' }"
      @interactOutside="event => { if (!(false)) event.preventDefault(); }">
      <uiDialogHeader class="dialogHeader">
        <uiDialogTitle>忘记密码</uiDialogTitle>
      </uiDialogHeader>
      <div class="dialogBody">
        <form :id="formId" class="forgotPasswordForm uiForm" @submit.prevent="submit">
          <fieldset class="formFields" :disabled="submitting">
            <div class="formField">
              <uiLabel :for="portFieldId + '-1'">手机号</uiLabel>
              <uiInput :id="portFieldId + '-1'" v-model="form.phone" autocomplete="tel" placeholder="请输入手机号" :disabled="(submitting) || (false)"></uiInput>
            </div>
            <div class="formField">
              <uiLabel :for="portFieldId + '-2'">短信验证码</uiLabel>
              <div class="verificationRow">
                <uiInput
                  :id="portFieldId + '-2'"
                  v-model="form.verificationCode"
                  autocomplete="one-time-code"
                  placeholder="请输入短信验证码"
                  :disabled="(submitting) || (false)"></uiInput>
                <smsCodeButton :phone="form.phone" :disabled="submitting" :visible="visible" isForget />
              </div>
            </div>
            <div class="formField">
              <uiLabel :for="portFieldId + '-3'">新密码</uiLabel>
              <div class="inputGroup">
                <uiInput
                  :id="portFieldId + '-3'"
                  v-model="form.newPassword"
                  autocomplete="new-password"
                  placeholder="请输入至少 6 位的新密码"
                  :disabled="(submitting) || (false)"
                  :type="passwordVisible1 ? 'text' : 'password'"></uiInput>
                <uiButton
                  @mousedown.prevent
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  :aria-label="passwordVisible1 ? '隐藏密码' : '显示密码'"
                  :disabled="submitting"
                  @click="passwordVisible1 = !passwordVisible1">
                  <icon-eye-off v-if="passwordVisible1" />
                  <icon-eye v-else />
                </uiButton>
              </div>
              <p v-if="form.newPassword && form.newPassword.length < 6 ? '新密码至少 6 位' : ''" class="text-destructive text-sm" role="alert">{{ form.newPassword && form.newPassword.length < 6 ? '新密码至少 6 位' : '' }}</p>
            </div>
            <div class="formField">
              <uiLabel :for="portFieldId + '-4'">确认密码</uiLabel>
              <div class="inputGroup">
                <uiInput
                  :id="portFieldId + '-4'"
                  v-model="form.confirmPassword"
                  autocomplete="new-password"
                  placeholder="请再次输入新密码"
                  :disabled="(submitting) || (false)"
                  :type="passwordVisible2 ? 'text' : 'password'"></uiInput>
                <uiButton
                  @mousedown.prevent
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  :aria-label="passwordVisible2 ? '隐藏密码' : '显示密码'"
                  :disabled="submitting"
                  @click="passwordVisible2 = !passwordVisible2">
                  <icon-eye-off v-if="passwordVisible2" />
                  <icon-eye v-else />
                </uiButton>
              </div>
              <p
                v-if="form.confirmPassword && form.confirmPassword !== form.newPassword ? '两次输入的密码不一致' : ''"
                class="text-destructive text-sm"
                role="alert">{{ form.confirmPassword && form.confirmPassword !== form.newPassword ? '两次输入的密码不一致' : '' }}</p>
            </div>
          </fieldset>
        </form>
        <uiDialogFooter class="dialogFooter">
          <uiButton @click="visible = false" variant="outline" type="button">取消</uiButton>
          <uiButton :form="formId" variant="default" type="submit" :disabled="(!ready) || (submitting)"><icon-loader-2 v-if="submitting" class="animate-spin" aria-hidden="true" />重置密码</uiButton>
        </uiDialogFooter>
      </div>
    </uiDialogContent>
  </uiDialog>
</template>

<script setup lang="ts">
import { uiButton } from "@/components/ui/button";
import { uiInput } from "@/components/ui/input";
import { uiLabel } from "@/components/ui/label";
import { uiDialog, uiDialogContent, uiDialogHeader, uiDialogTitle, uiDialogFooter } from "@/components/ui/dialog";
import { computed, onBeforeUnmount, reactive, ref, useId, watch } from "vue";
import { toast } from "vue-sonner";
import http from "@/lib/http";
import smsCodeButton from "./smsCodeButton.vue";

const props = defineProps<{ phone?: string }>();
const visible = defineModel<boolean>({ default: false });
const emit = defineEmits<{ reset: [phone: string] }>();
const formId = useId();
const form = reactive({ phone: "", verificationCode: "", newPassword: "", confirmPassword: "" });
const submitting = ref(false);
const ready = computed(() => !!form.phone.trim() && !!form.verificationCode.trim() && form.newPassword.length >= 6
  && form.confirmPassword === form.newPassword && !submitting.value);
let controller: AbortController | undefined;

async function submit() {
  if (!visible.value || !ready.value) return;
  const request = new AbortController();
  controller = request;
  submitting.value = true;
  const phone = form.phone.trim();
  try {
    const message = await http<string>({
      method: "POST", url: "/api/channel/user/forgotPassword", signal: request.signal,
      data: {
        phone, verificationCode: form.verificationCode.trim(),
        newPassword: form.newPassword, confirmPassword: form.confirmPassword,
      },
    });
    if (request.signal.aborted) return;
    toast.success(message || "密码重置成功，请重新登录");
    emit("reset", phone);
    visible.value = false;
  } catch (error) {
    if (!request.signal.aborted) toast.error(error instanceof Error ? error.message : "重置密码失败");
  } finally {
    if (controller === request) submitting.value = false;
  }
}

watch(visible, isVisible => {
  controller?.abort();
  controller = undefined;
  submitting.value = false;
  const phone = props.phone?.trim() ?? "";
  Object.assign(form, {
    phone: isVisible && /^\d+$/.test(phone) ? phone : "",
    verificationCode: "", newPassword: "", confirmPassword: "",
  });
}, { immediate: true, flush: "sync" });

onBeforeUnmount(() => controller?.abort());

const passwordVisible1 = ref(false);
const passwordVisible2 = ref(false);
const portFieldId = useId();
</script>

<style lang="scss" scoped>
.forgotPasswordForm {
  .verificationRow {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 116px;
    align-items: center;
    gap: 8px;
    width: 100%;

    :is(.el-input, [data-slot="input"], .inputGroup) { min-width: 0; }
  }
}
</style>
