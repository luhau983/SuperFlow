import { ref, watchEffect } from "vue";
import { uiSettings } from "@/stores/settings";

/** 当前生效的暗色主题状态，供不读取 .dark 类的组件（如 Sonner）使用。 */
export const darkTheme = ref(false);

export function registerAppearance() {
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
  const systemDark = ref(systemTheme.matches);
  const updateSystemTheme = (event: MediaQueryListEvent) => { systemDark.value = event.matches; };
  systemTheme.addEventListener("change", updateSystemTheme);
  const stop = watchEffect(() => {
    const { theme, primaryColor, fontScale, radius } = uiSettings.value;
    const dark = theme === "system" ? systemDark.value : theme === "dark";
    darkTheme.value = dark;
    const root = document.documentElement;
    root.classList.toggle("dark", dark);
    root.setAttribute("theme-mode", dark ? "dark" : "light");
    root.style.colorScheme = dark ? "dark" : "light";
    root.style.fontSize = `${(16 * fontScale) / 100}px`;
    root.style.setProperty("--ui-radius", `${radius}px`);
    root.style.setProperty("--el-color-primary", primaryColor);
    for (let level = 1; level <= 9; level++) {
      root.style.setProperty(`--el-color-primary-light-${level}`,
        `color-mix(in srgb, ${primaryColor} ${100 - level * 10}%, var(--background))`);
    }
    root.style.setProperty("--el-color-primary-dark-2", `color-mix(in srgb, ${primaryColor} 80%, ${dark ? "#fff" : "#000"})`);
  });
  return () => {
    stop();
    systemTheme.removeEventListener("change", updateSystemTheme);
  };
}
