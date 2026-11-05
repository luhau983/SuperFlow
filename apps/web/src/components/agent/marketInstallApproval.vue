<template>
  <uiCard v-if="tool.status === 'running' && tool.question" class="marketInstallApproval">
    <strong>{{ tool.question.title }}</strong>
    <p>{{ tool.question.question }}</p>
    <div class="approvalActions">
      <uiButton variant="outline" size="sm" :disabled="!directory || submitted === tool.question.callId" @click="answer(false)">取消</uiButton>
      <uiButton size="sm" :disabled="!directory || submitted === tool.question.callId" @click="answer(true)">确认安装</uiButton>
    </div>
  </uiCard>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { toast } from "vue-sonner";
import type { AgentToolCall } from "@toonflow/server/agent/types";
import http from "@/lib/http";
import { uiButton } from "@/components/ui/button";
import { uiCard } from "@/components/ui/card";

const { tool, directory } = defineProps<{ tool: AgentToolCall; directory?: string }>();
const submitted = ref("");

async function answer(approved: boolean) {
  const callId = tool.question?.callId;
  if (!directory || tool.status !== "running" || !callId || submitted.value === callId) return;
  submitted.value = callId;
  try {
    await http({ method: "POST", url: "/api/agent/answer", data: { directory, callId, values: { approved } } });
  } catch (error) {
    if (submitted.value === callId) submitted.value = "";
    toast.error(error instanceof Error ? error.message : "请求失败");
  }
}
</script>

<style scoped lang="scss">
.marketInstallApproval {
  gap: 0;
  padding: 16px;
  box-shadow: none;

  p {
    margin: 8px 0 12px;
    white-space: pre-line;
    overflow-wrap: anywhere;
  }

  .approvalActions { display: flex; gap: 8px; }
}
</style>
