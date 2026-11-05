<template>
  <uiButton
    data-sidebar="trigger"
    data-slot="sidebar-trigger"
    variant="ghost"
    size="icon"
    :class="cn('h-7 w-7', props.class)"
    @click="toggleSidebar"
  >
    <icon-layout-sidebar />
    <span class="sr-only">切换侧栏</span>
  </uiButton>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { IconLayoutSidebar } from "@tabler/icons-vue"
import { cn } from "@/lib/utils"
import { uiButton } from '@/components/ui/button'
import { useSidebar } from "./utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()

const { toggleSidebar } = useSidebar()
</script>
