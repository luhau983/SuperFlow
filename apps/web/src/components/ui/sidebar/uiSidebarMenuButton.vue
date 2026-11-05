<template>
  <sidebar-menu-button-child v-if="!tooltip" v-bind="{ ...delegatedProps, ...$attrs }">
    <slot />
  </sidebar-menu-button-child>

  <uiTooltip v-else>
    <uiTooltipTrigger asChild>
      <sidebar-menu-button-child v-bind="{ ...delegatedProps, ...$attrs }">
        <slot />
      </sidebar-menu-button-child>
    </uiTooltipTrigger>
    <uiTooltipContent
      side="right"
      align="center"
      :hidden="state !== 'collapsed' || isMobile"
    >
      <template v-if="typeof tooltip === 'string'">
        {{ tooltip }}
      </template>
      <component :is="tooltip" v-else />
    </uiTooltipContent>
  </uiTooltip>
</template>

<script setup lang="ts">
import type { Component } from "vue"
import type { SidebarMenuButtonProps } from "./uiSidebarMenuButtonChild.vue"
import { reactiveOmit } from "@vueuse/core"
import { uiTooltip, uiTooltipContent, uiTooltipTrigger } from '@/components/ui/tooltip'
import SidebarMenuButtonChild from "./uiSidebarMenuButtonChild.vue"
import { useSidebar } from "./utils"

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<SidebarMenuButtonProps & {
  tooltip?: string | Component
}>(), {
  as: "button",
  variant: "default",
  size: "default",
})

const { isMobile, state } = useSidebar()

const delegatedProps = reactiveOmit(props, "tooltip")
</script>
