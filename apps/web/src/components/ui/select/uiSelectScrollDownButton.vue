<template>
  <select-scroll-down-button
    data-slot="select-scroll-down-button"
    v-bind="forwardedProps"
    :class="cn('flex cursor-default items-center justify-center py-1', props.class)"
  >
    <slot>
      <icon-chevron-down class="size-4" />
    </slot>
  </select-scroll-down-button>
</template>

<script setup lang="ts">
import type { SelectScrollDownButtonProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import { IconChevronDown } from "@tabler/icons-vue"
import { reactiveOmit } from "@vueuse/core"
import { cn } from "@/lib/utils"
import { SelectScrollDownButton, useForwardProps } from "reka-ui"

const props = defineProps<SelectScrollDownButtonProps & { class?: HTMLAttributes["class"] }>()

const delegatedProps = reactiveOmit(props, "class")

const forwardedProps = useForwardProps(delegatedProps)
</script>
