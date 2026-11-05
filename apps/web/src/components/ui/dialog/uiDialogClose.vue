<template>
  <dialog-close
    data-slot="dialog-close"
    v-bind="props"
  >
    <slot />
  </dialog-close>
</template>

<script setup lang="ts">
import type { DialogCloseProps } from "reka-ui"
import { DialogClose } from "reka-ui"

const props = defineProps<DialogCloseProps>()
</script>
