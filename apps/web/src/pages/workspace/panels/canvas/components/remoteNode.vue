<template>
  <nodeSkeleton v-if="loading" loading :label="node.data.label || node.type" :handles="node.data.handles" :outputs="node.data.outputs" />
  <component v-else-if="component && !error && !runtimeError" :is="component" v-bind="$attrs" />
  <uiCard v-else class="remoteNodeState failed" role="alert">
    <div class="stateHeader">
      <strong>{{ node.data.label || node.type }}</strong>
      <span class="stateLabel">error</span>
      <div class="stateActions nodrag nopan" @pointerdown.stop @mousedown.stop @dblclick.stop>
        <uiButton variant="ghost" size="icon-sm" :disabled="reloading" title="重新加载节点" aria-label="重新加载节点" @click.stop="retry">
          <icon-loader-2 v-if="reloading" class="animate-spin" aria-hidden="true" />
          <icon-refresh v-else aria-hidden="true" />
        </uiButton>
        <uiButton variant="ghost" size="icon-sm" title="移除节点" aria-label="移除节点" @click.stop="removeNodes(node.id)">
          <icon-trash aria-hidden="true" />
        </uiButton>
      </div>
    </div>
    <p>{{ error || runtimeError || "远程节点未加载，请确认插件已安装并启用" }}</p>
  </uiCard>
</template>

<script setup lang="ts">
import { inject, onErrorCaptured, ref, watch, type Component } from "vue";
import { useNode, useVueFlow } from "@vue-flow/core";
import { IconLoader2, IconRefresh, IconTrash } from "@tabler/icons-vue";
import { uiButton } from "@/components/ui/button";
import { uiCard } from "@/components/ui/card";
import { nodeSkeleton, type NodeData } from "@toonflow/nodes-scaffold/runtime";

defineOptions({ inheritAttrs: false });
const props = defineProps<{ component?: Component | string; error?: string; loading?: boolean }>();
const { node } = useNode<NodeData>();
const { removeNodes } = useVueFlow();
const reload = inject<((type: string) => Promise<void>)>("reloadRemoteNode");
const runtimeError = ref("");
const reloading = ref(false);

onErrorCaptured(error => {
  runtimeError.value = error instanceof Error ? error.message : String(error);
  console.error(`远程节点 ${node.type} (${node.id}) 运行失败`, error);
  return false;
});
watch(() => props.component, () => { runtimeError.value = ""; });

async function retry() {
  if (!reload || reloading.value) return;
  reloading.value = true;
  try { await reload(node.type); }
  catch (error) { runtimeError.value = error instanceof Error ? error.message : String(error); }
  finally { reloading.value = false; }
}
</script>

<style scoped lang="scss">
.remoteNodeState {
  width: 320px;
  gap: 0;
  padding: 16px;
  border-radius: var(--ui-radius-large);
  &.failed { border-color: var(--destructive); }
  .stateHeader {
    display: flex;
    align-items: center;
    gap: 8px;
    strong { flex: 1; min-width: 0; overflow-wrap: anywhere; }
    .stateLabel { font-size: 12px; color: var(--muted-foreground); }
    .stateActions {
      display: flex;
      button { width: 28px; height: 28px; }
    }
  }
  &.failed .stateLabel { color: var(--destructive); }
  p { margin: 10px 0 0; font-size: 12px; color: var(--muted-foreground); white-space: pre-wrap; overflow-wrap: anywhere; }
}
</style>
