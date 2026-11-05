<template>
  <dialog-portal>
    <uiDialogOverlay :style="zIndex ? { zIndex } : undefined" />
    <dialog-content
      data-slot="dialog-content"
      v-bind="{ ...$attrs, ...forwarded }"
      :style="zIndex ? { zIndex } : undefined"
      :class="
        cn(
          'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg',
          props.class,
        )"
    >
      <slot />

      <dialog-close
        v-if="showCloseButton"
        data-slot="dialog-close"
        class="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
      >
        <icon-x />
        <span class="sr-only">关闭</span>
      </dialog-close>
    </dialog-content>
  </dialog-portal>
</template>

<script setup lang="ts">
import type { DialogContentEmits, DialogContentProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import { IconX } from "@tabler/icons-vue"
import { reactiveOmit } from "@vueuse/core"
import { cn } from "@/lib/utils"
import {
  DialogClose,
  DialogContent,
  DialogPortal,
  useForwardPropsEmits,
} from "reka-ui"
import uiDialogOverlay from "./uiDialogOverlay.vue"

defineOptions({
  inheritAttrs: false,
})

// ACT: zIndex 供与 Element Plus 弹层共存时传入 useZIndex 的层级；全部迁移后可移除。
const props = withDefaults(defineProps<DialogContentProps & { class?: HTMLAttributes["class"], showCloseButton?: boolean, zIndex?: number }>(), {
  showCloseButton: true,
})
const emits = defineEmits<DialogContentEmits>()

const delegatedProps = reactiveOmit(props, "class", "zIndex", "showCloseButton")

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>
