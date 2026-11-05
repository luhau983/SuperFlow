<template>
  <collapsible-trigger
    data-slot="collapsible-trigger"
    v-bind="props"
  >
    <slot />
  </collapsible-trigger>
</template>

<script setup lang="ts">
import type { CollapsibleTriggerProps } from "reka-ui"
import { CollapsibleTrigger } from "reka-ui"

const props = defineProps<CollapsibleTriggerProps>()
</script>
