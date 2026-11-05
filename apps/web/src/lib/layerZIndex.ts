import { useZIndex } from "element-plus";

/**
 * ACT: 与 Element Plus 共存期间，shadcn 弹层在挂载（即每次打开）时取 Element Plus 的下一个层级，
 * 保证后打开的弹层始终在上，无论外层是哪套组件。全部移除 Element Plus 后删除此函数，改回 Tailwind 的 z-50。
 */
export function useLayerZIndex() {
  return useZIndex().nextZIndex();
}
