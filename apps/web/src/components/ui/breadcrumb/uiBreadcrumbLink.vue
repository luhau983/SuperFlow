<template>
  <primitive
    data-slot="breadcrumb-link"
    :as="as"
    :asChild="asChild"
    :class="cn('hover:text-foreground transition-colors', props.class)"
  >
    <slot />
  </primitive>
</template>

<script lang="ts" setup>
import type { PrimitiveProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import { cn } from "@/lib/utils"
import { Primitive } from "reka-ui"

const props = withDefaults(defineProps<PrimitiveProps & { class?: HTMLAttributes["class"] }>(), {
  as: "a",
})
</script>
