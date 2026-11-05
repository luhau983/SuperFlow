<template>
  <uiAlertDialog :open="!!current" @update:open="closeCurrent">
    <uiAlertDialogContent v-if="current" :key="current.id" class="messageBox" @openAutoFocus="focusInitial">
      <uiAlertDialogHeader>
        <uiAlertDialogTitle class="flex items-center gap-2">
          <component :is="typeIcons[current.options.type]" v-if="current.options.type" class="size-5 shrink-0" :class="typeColors[current.options.type]" aria-hidden="true" />
          <span>{{ current.title || translate("提示") }}</span>
        </uiAlertDialogTitle>
        <uiAlertDialogDescription as="div" class="whitespace-pre-wrap [overflow-wrap:anywhere]">
          <component :is="contentNode" />
        </uiAlertDialogDescription>
      </uiAlertDialogHeader>
      <form v-if="current.kind === 'prompt'" class="grid gap-2" @submit.prevent="confirmCurrent">
        <uiInput ref="promptInput" v-model="inputValue" :placeholder="current.options.inputPlaceholder" :aria-invalid="!!inputError || undefined" @update:modelValue="inputError = ''" />
        <p v-if="inputError" class="text-destructive text-sm" role="alert">{{ inputError }}</p>
      </form>
      <uiAlertDialogFooter>
        <uiButton v-if="current.kind !== 'alert'" variant="outline" @click="current.settle('cancel')">{{ current.options.cancelButtonText || translate("取消") }}</uiButton>
        <uiButton ref="confirmButton" :variant="current.options.type === 'error' ? 'destructive' : 'default'" @click="confirmCurrent">{{ current.options.confirmButtonText || translate("确定") }}</uiButton>
      </uiAlertDialogFooter>
    </uiAlertDialogContent>
  </uiAlertDialog>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import { IconAlertTriangle, IconCircleCheck, IconCircleX, IconInfoCircle } from "@tabler/icons-vue";
import { translate } from "@toonflow/i18n/vue";
import { messageBoxQueue, validatePrompt } from "@/lib/messageBox";
import { uiAlertDialog, uiAlertDialogContent, uiAlertDialogDescription, uiAlertDialogFooter, uiAlertDialogHeader, uiAlertDialogTitle } from "@/components/ui/alertDialog";
import { uiButton } from "@/components/ui/button";
import { uiInput } from "@/components/ui/input";

const typeIcons = { success: IconCircleCheck, info: IconInfoCircle, warning: IconAlertTriangle, error: IconCircleX };
const typeColors = { success: "text-green-600", info: "text-muted-foreground", warning: "text-amber-500", error: "text-destructive" };

const current = computed(() => messageBoxQueue[0]);
const inputValue = ref("");
const inputError = ref("");
const promptInput = ref<{ $el: HTMLInputElement }>();
const confirmButton = ref<{ $el: HTMLButtonElement }>();

const contentNode = () => {
  const request = current.value;
  if (!request) return null;
  return typeof request.content === "string" ? request.content : request.content({ cancel: () => request.settle("cancel") });
};

watch(current, request => {
  if (!request) return;
  inputValue.value = request.options.inputValue ?? "";
  inputError.value = "";
}, { immediate: true });

function focusInitial(event: Event) {
  if (current.value?.options.autofocus === false) return;
  event.preventDefault();
  void nextTick(() => (current.value?.kind === "prompt" ? promptInput.value : confirmButton.value)?.$el.focus());
}

function closeCurrent(open: boolean) {
  if (!open) current.value?.settle("close");
}

function confirmCurrent() {
  const request = current.value;
  if (!request) return;
  if (request.kind === "prompt") {
    const error = validatePrompt(inputValue.value, request.options);
    if (error) {
      inputError.value = error;
      return;
    }
  }
  request.settle("confirm", inputValue.value);
}
</script>
