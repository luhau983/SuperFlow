import type { VariantProps } from "class-variance-authority"
import type { HTMLAttributes } from "vue"
import { cva } from "class-variance-authority"

export interface SidebarProps {
  side?: "left" | "right"
  variant?: "sidebar" | "floating" | "inset"
  collapsible?: "offcanvas" | "icon" | "none"
  class?: HTMLAttributes["class"]
}

export { default as uiSidebar } from "./uiSidebar.vue"
export { default as uiSidebarContent } from "./uiSidebarContent.vue"
export { default as uiSidebarFooter } from "./uiSidebarFooter.vue"
export { default as uiSidebarGroup } from "./uiSidebarGroup.vue"
export { default as uiSidebarGroupAction } from "./uiSidebarGroupAction.vue"
export { default as uiSidebarGroupContent } from "./uiSidebarGroupContent.vue"
export { default as uiSidebarGroupLabel } from "./uiSidebarGroupLabel.vue"
export { default as uiSidebarHeader } from "./uiSidebarHeader.vue"
export { default as uiSidebarInput } from "./uiSidebarInput.vue"
export { default as uiSidebarInset } from "./uiSidebarInset.vue"
export { default as uiSidebarMenu } from "./uiSidebarMenu.vue"
export { default as uiSidebarMenuAction } from "./uiSidebarMenuAction.vue"
export { default as uiSidebarMenuBadge } from "./uiSidebarMenuBadge.vue"
export { default as uiSidebarMenuButton } from "./uiSidebarMenuButton.vue"
export { default as uiSidebarMenuItem } from "./uiSidebarMenuItem.vue"
export { default as uiSidebarMenuSkeleton } from "./uiSidebarMenuSkeleton.vue"
export { default as uiSidebarMenuSub } from "./uiSidebarMenuSub.vue"
export { default as uiSidebarMenuSubButton } from "./uiSidebarMenuSubButton.vue"
export { default as uiSidebarMenuSubItem } from "./uiSidebarMenuSubItem.vue"
export { default as uiSidebarProvider } from "./uiSidebarProvider.vue"
export { default as uiSidebarRail } from "./uiSidebarRail.vue"
export { default as uiSidebarSeparator } from "./uiSidebarSeparator.vue"
export { default as uiSidebarTrigger } from "./uiSidebarTrigger.vue"

export { useSidebar } from "./utils"

export const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline:
          "bg-background shadow-[0_0_0_1px_var(--sidebar-border)] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_var(--sidebar-accent)]",
      },
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-sm group-data-[collapsible=icon]:p-0!",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export type SidebarMenuButtonVariants = VariantProps<typeof sidebarMenuButtonVariants>
