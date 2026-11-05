<template>
  <hover-card-root v-model:open="visible" :openDelay="0" :closeDelay="150">
    <hover-card-trigger asChild>
      <uiButton
        class="contextButton"
        :aria-label="usage?.tokens == null ? '查看上下文用量，暂无数据' : `查看上下文用量，已使用 ${contextPercent.toFixed(1)}%`"
        title="查看上下文用量"
        variant="ghost"
        type="button"
        :disabled="(disabled)"
        size="icon"
        style="border-radius: 9999px">
        <svg
          class="contextRing"
          width="14"
          height="14"
          viewBox="0 0 14 14"
          role="progressbar"
          :aria-valuenow="Math.min(100, contextPercent)"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-label="上下文用量">
          <circle cx="7" cy="7" r="6" fill="none" stroke="var(--muted)" stroke-width="2" />
          <circle
            cx="7"
            cy="7"
            r="6"
            fill="none"
            :stroke="contextColor"
            stroke-width="2"
            :stroke-dasharray="`${Math.min(100, contextPercent) / 100 * Math.PI * 12} ${Math.PI * 12}`"
            transform="rotate(-90 7 7)" />
        </svg>
      </uiButton>
    </hover-card-trigger>
    <hover-card-portal>
      <hover-card-content
        class="hoverPanel agentContextPopover"
        side="top"
        align="center"
        :sideOffset="10"
        :style="{ width: '280px', maxWidth: 'calc(100vw - 24px)', zIndex: hoverZIndex }">
        <div class="contextUsage">
          <div class="contextHeader">
            <span>上下文用量</span>
            <span class="contextHint">估算</span>
          </div>
          <template v-if="usage?.tokens != null">
            <div class="contextTokens">
              <span>{{ usage.tokens.toLocaleString() }}/{{ contextWindow.toLocaleString() }}tok</span>
              <span>{{ contextPercent.toFixed(1) }}%</span>
            </div>
            <uiProgress :style="{ '--primary': contextColor }" :modelValue="Math.min(100, contextPercent)"></uiProgress>
          </template>
          <span v-else class="contextHint">{{ usage ? "等待下一次回复更新用量" : "尚无用量数据" }}</span>
          <div v-if="stats" class="contextStats">
            <div class="contextHeader">对话累计用量</div>
            <div class="contextTokens">
              <span>输入</span>
              <span>{{ inputTokens.toLocaleString() }}tok</span>
            </div>
            <div class="contextTokens">
              <span>输出</span>
              <span>{{ stats.tokens.output.toLocaleString() }}tok</span>
            </div>
            <div v-if="inputTokens > 0" class="contextTokens">
              <span>缓存命中</span>
              <span>{{ (stats.tokens.cacheRead / inputTokens * 100).toFixed(1) }}%</span>
            </div>
            <div v-if="stats.tokensPerSecond !== undefined" class="contextTokens">
              <span>生成速度</span>
              <span>{{ stats.tokensPerSecond.toFixed(1) }}tok/s</span>
            </div>
          </div>
        </div>
      </hover-card-content>
    </hover-card-portal>
  </hover-card-root>
</template>

<script setup lang="ts">
import { useLayerZIndex } from "@/lib/layerZIndex";
import { HoverCardRoot, HoverCardTrigger, HoverCardPortal, HoverCardContent } from "reka-ui";
import { uiProgress } from "@/components/ui/progress";
import { uiButton } from "@/components/ui/button";
import { computed, ref, watch } from "vue";
import type { AgentContext, AgentStats } from "@toonflow/server/agent/types";

const props = defineProps<{ usage?: AgentContext; stats?: AgentStats; contextWindow: number; disabled: boolean }>();
const visible = defineModel<boolean>("visible", { default: false });
const contextPercent = computed(() => (props.usage?.tokens ?? 0) / props.contextWindow * 100);
const contextColor = computed(() => contextPercent.value >= 90 ? "var(--el-color-danger)" : contextPercent.value >= 75 ? "var(--el-color-warning)" : "var(--el-color-primary)");
const inputTokens = computed(() => props.stats ? props.stats.tokens.input + props.stats.tokens.cacheRead + props.stats.tokens.cacheWrite : 0);

const hoverZIndex = ref(useLayerZIndex());
watch(visible, open => { if (open) hoverZIndex.value = useLayerZIndex(); });
</script>

<style lang="scss">
.agentContextPopover {
  .contextUsage {
    display: flex;
    flex-direction: column;
    gap: 12px;

    .contextStats {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .contextHeader,
    .contextTokens {
      display: flex;
      justify-content: space-between;
      gap: 8px;
    }

    .contextHeader {
      color: var(--el-text-color-primary);
    }

    .contextTokens {
      font-size: 12px;
      font-variant-numeric: tabular-nums;
    }

    .contextHint {
      color: var(--el-text-color-secondary);
      font-size: 12px;
    }
  }
}
</style>
