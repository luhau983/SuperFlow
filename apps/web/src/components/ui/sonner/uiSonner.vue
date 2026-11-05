<template>
  <sonner
    :class="cn('toaster group', props.class)"
    :style="{
      '--normal-bg': 'var(--popover)',
      '--normal-text': 'var(--popover-foreground)',
      '--normal-border': 'var(--border)',
      '--border-radius': 'var(--radius)',
    }"
    v-bind="props"
  >
    <template #success-icon>
      <icon-circle-check class="size-4" />
    </template>
    <template #info-icon>
      <icon-info-circle class="size-4" />
    </template>
    <template #warning-icon>
      <icon-alert-triangle class="size-4" />
    </template>
    <template #error-icon>
      <icon-alert-octagon class="size-4" />
    </template>
    <template #loading-icon>
      <div>
        <icon-loader2 class="size-4 animate-spin" />
      </div>
    </template>
    <template #close-icon>
      <icon-x class="size-4" />
    </template>
  </sonner>
</template>

<script lang="ts" setup>
import type { ToasterProps } from "vue-sonner"
import { IconCircleCheck, IconInfoCircle, IconLoader2, IconAlertOctagon, IconAlertTriangle, IconX } from "@tabler/icons-vue"
import { cn } from "@/lib/utils"
import { Toaster as Sonner } from "vue-sonner"

const props = defineProps<ToasterProps>()
</script>
