<template>
  <uiSeparator
    data-slot="sidebar-separator"
    data-sidebar="separator"
    :class="cn('bg-sidebar-border mx-2 w-auto', props.class)"
  >
    <slot />
  </uiSeparator>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from "@/lib/utils"
import { uiSeparator } from '@/components/ui/separator'

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()
</script>
