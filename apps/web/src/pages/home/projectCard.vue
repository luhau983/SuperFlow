<template>
  <uiCard class="projectCard">
    <button class="projectEntry" type="button" :disabled="disabled" :title="project.directory" :aria-label="`${translate(actionLabel)} ${project.name}`" @click="emit('select')">
      <projectCover :directory="project.directory" />
      <span class="projectInfo">
        <span class="projectName" :title="project.name">{{ project.name }}</span>
        <span class="projectTime">最近打开 {{ new Date(project.lastOpenedAt).toLocaleString(locale, { hour12: false }) }}</span>
      </span>
    </button>
    <uiDropdownMenu v-if="$slots.actions" v-model:open="menuVisible">
      <uiDropdownMenuTrigger asChild :disabled="disabled">
        <uiButton class="projectActions" :class="{ actionsVisible: menuVisible || actionsLoading }" variant="secondary" size="icon-sm" :disabled="disabled" :aria-busy="actionsLoading" aria-label="更多操作" title="更多操作">
          <icon-loader-2 v-if="actionsLoading" class="animate-spin" aria-hidden="true" />
          <icon-dots-vertical v-else aria-hidden="true" />
        </uiButton>
      </uiDropdownMenuTrigger>
      <uiDropdownMenuContent class="min-w-44" align="end" :aria-label="project.name">
        <uiDropdownMenuItem :disabled="disabled" @select="emit('select')">
          <icon-folder-open aria-hidden="true" />
          <span>打开</span>
        </uiDropdownMenuItem>
        <slot name="actions" />
      </uiDropdownMenuContent>
    </uiDropdownMenu>
  </uiCard>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { locale, translate } from "@toonflow/i18n/vue";
import type { Project } from "@/stores/workspace";
import projectCover from "./projectCover.vue";
import { uiButton } from "@/components/ui/button";
import { uiCard } from "@/components/ui/card";
import { uiDropdownMenu, uiDropdownMenuContent, uiDropdownMenuItem, uiDropdownMenuTrigger } from "@/components/ui/dropdownMenu";

withDefaults(defineProps<{
  project: Project;
  disabled?: boolean;
  actionLabel?: string;
  actionsLoading?: boolean;
}>(), { actionLabel: "打开项目" });
const emit = defineEmits<{ select: [] }>();
const menuVisible = ref(false);
</script>

<style lang="scss" scoped>
.projectCard {
  position: relative;
  gap: 0;
  padding: 0;
  overflow: hidden;
  border-radius: calc(var(--radius) * 2);
  background: color-mix(in oklch, var(--card) 80%, transparent);
  transition: border-color 0.2s, box-shadow 0.2s;

  &:hover { box-shadow: 0 4px 16px rgb(0 0 0 / 8%); }
  &:focus-within { border-color: var(--ring); }

  .projectEntry {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    min-height: 240px;
    padding: 0;
    border: 0;
    background: transparent;
    color: inherit;
    font: inherit;
    text-align: start;
    cursor: pointer;

    &:focus-visible { outline: 2px solid var(--ring); outline-offset: -2px; }
    &:disabled { cursor: wait; opacity: 0.6; }

    .projectInfo {
      display: flex;
      flex-direction: column;
      gap: 4px;
      width: 100%;
      min-width: 0;
      margin-top: auto;
      padding: 12px 16px;
      border-top: 1px solid var(--border);

      .projectName {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 14px;
        font-weight: 600;
        line-height: 1.5;
      }

      .projectTime { color: var(--muted-foreground); font-size: 12px; line-height: 1.6; }
    }
  }

  .projectActions {
    position: absolute;
    top: 12px;
    inset-inline-end: 12px;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s;
  }

  &:hover .projectActions, &:focus-within .projectActions, .projectActions.actionsVisible { opacity: 1; pointer-events: auto; }

  @media (hover: none), (any-pointer: coarse) {
    .projectActions { opacity: 1; pointer-events: auto; }
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    .projectActions { transition: none; }
  }
}
</style>
