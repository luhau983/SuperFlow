import type { ComputedRef, Ref } from "vue"
import { createContext } from "reka-ui"

export const sidebarCookieName = "sidebar_state"
export const sidebarCookieMaxAge = 60 * 60 * 24 * 7
export const sidebarWidth = "16rem"
export const sidebarWidthMobile = "18rem"
export const sidebarWidthIcon = "3rem"
export const sidebarKeyboardShortcut = "b"
export const sidebarMobileBreakpoint = 768

export const [useSidebar, provideSidebarContext] = createContext<{
  state: ComputedRef<"expanded" | "collapsed">
  open: Ref<boolean>
  setOpen: (value: boolean) => void
  isMobile: Ref<boolean>
  openMobile: Ref<boolean>
  setOpenMobile: (value: boolean) => void
  toggleSidebar: () => void
}>("Sidebar")
