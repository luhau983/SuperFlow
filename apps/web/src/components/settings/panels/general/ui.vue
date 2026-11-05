<template>
  <div class="ui">
    <p class="intro">让创作空间更合你的习惯，修改会自动保存。</p>
    <section v-if="isMobile" class="settingSection" aria-labelledby="mobileScaleTitle">
      <div class="settingHeader">
        <h3 id="mobileScaleTitle">界面缩放</h3>
        <span class="settingValue">{{ mobileScale }}%</span>
      </div>
      <p class="description">缩小后可显示更多内容，字体大小仍可单独调整。</p>
      <div class="settingSlider">
        <uiSlider
          :modelValue="[mobileScale]"
          :min="50"
          :max="100"
          :step="5"
          aria-label="界面缩放"
          @update:modelValue="(value) => value && (mobileScale = value[0]!)"
          @valueCommit="(value) => updateUiSettings({ mobileScale: value[0]! })" />
        <div class="sliderMarks" aria-hidden="true">
          <span v-for="mark in mobileScaleLabels" :key="mark.value" :style="{ left: markOffset(mark.value, 50, 100) }">{{ mark.label }}</span>
        </div>
      </div>
    </section>
    <section class="settingSection" aria-labelledby="languageTitle">
      <h3 id="languageTitle"><icon-language :size="18" />语言</h3>
      <p class="description">界面语言立即生效，默认跟随电脑语言。</p>
      <languageSelect class="languageCards" />
    </section>
    <section class="settingSection" aria-labelledby="themeTitle">
      <h3 id="themeTitle"><icon-sun-moon :size="18" />外观模式</h3>
      <!-- ACT: reka 在单选项 click 中同步改值，捕获阶段先记录点击坐标，保持原先 click 早于 change 的顺序。 -->
      <uiRadioGroup
        class="themeOptions"
        :modelValue="uiSettings.theme"
        aria-label="外观模式"
        @click.capture="captureThemeClickPoint"
        @update:modelValue="(value) => changeTheme(String(value))">
        <label v-for="item in themes" :key="item.value" class="themeOption" :class="{ checked: uiSettings.theme === item.value }">
          <uiRadioGroupItem class="themeRadio" :value="item.value" />
          <span class="themeLabel">
            <component :is="item.icon" :size="22" />
            <strong>{{ item.label }}</strong>
            <small>{{ item.description }}</small>
          </span>
        </label>
      </uiRadioGroup>
    </section>
    <section class="settingSection" aria-labelledby="colorTitle">
      <div class="settingHeader">
        <h3 id="colorTitle"><icon-palette :size="18" />主题颜色</h3>
        <span class="settingValue">{{ uiSettings.primaryColor.toUpperCase() }}</span>
      </div>
      <p class="description">用于按钮、选中状态与创作背景。</p>
      <div class="colorOptions">
        <uiButton
          v-for="color in colors"
          :key="color.value"
          class="colorSwatch"
          size="icon"
          :style="{ '--swatchColor': color.value }"
          :aria-label="color.label"
          :aria-pressed="uiSettings.primaryColor.toLowerCase() === color.value"
          :title="color.label"
          @click="updateUiSettings({ primaryColor: color.value })">
          <icon-check v-if="uiSettings.primaryColor.toLowerCase() === color.value" :size="18" />
        </uiButton>
        <el-color-picker :modelValue="uiSettings.primaryColor" colorFormat="hex" aria-label="自定义主题颜色" @change="changeColor" />
        <span class="description">自定义</span>
      </div>
    </section>
    <section class="settingSection" aria-labelledby="fontTitle">
      <div class="settingHeader">
        <h3 id="fontTitle"><icon-text-size :size="18" />字体大小</h3>
        <span class="settingValue">{{ fontScale }}%</span>
      </div>
      <p class="description">统一调整界面、聊天和节点中的文字大小。</p>
      <div class="settingSlider">
        <uiSlider
          :modelValue="[fontScale]"
          :min="85"
          :max="125"
          :step="5"
          aria-label="字体大小"
          @update:modelValue="(value) => value && (fontScale = value[0]!)"
          @valueCommit="(value) => updateUiSettings({ fontScale: value[0]! })" />
        <div class="sliderMarks" aria-hidden="true">
          <span v-for="mark in fontScaleLabels" :key="mark.value" :style="{ left: markOffset(mark.value, 85, 125) }">{{ mark.label }}</span>
        </div>
      </div>
    </section>
    <section class="settingSection" aria-labelledby="radiusTitle">
      <div class="settingHeader">
        <h3 id="radiusTitle"><icon-border-radius :size="18" />界面圆角</h3>
        <span class="settingValue">{{ radius }}px</span>
      </div>
      <div class="settingSlider">
        <uiSlider
          :modelValue="[radius]"
          :min="0"
          :max="16"
          :step="2"
          aria-label="界面圆角"
          @update:modelValue="(value) => value && (radius = value[0]!)"
          @valueCommit="(value) => updateUiSettings({ radius: value[0]! })" />
        <div class="sliderMarks" aria-hidden="true">
          <span v-for="mark in radiusLabels" :key="mark.value" :style="{ left: markOffset(mark.value, 0, 16) }">{{ mark.label }}</span>
        </div>
      </div>
    </section>
    <uiCard class="appearancePreview">
      <div class="previewIcon">
        <icon-sparkles :size="20" />
      </div>
      <div class="previewText">
        <strong>SuperFlow 每一个灵感，都值得被看见</strong>
        <p>这是当前颜色、字体与圆角的实际效果。</p>
      </div>
      <uiBadge class="previewBadge" variant="secondary">预览</uiBadge>
    </uiCard>
    <div class="settingsFooter">
      <uiButton
        variant="outline"
        @click="updateUiSettings({ ...defaultUiSettings, language: uiSettings.language, startupAnimation: uiSettings.startupAnimation })"><icon-restore />恢复界面默认设置</uiButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref, watchEffect } from "vue";
import {
  IconSun,
  IconMoon,
  IconDeviceDesktop,
} from "@tabler/icons-vue";
import { defaultUiSettings, uiSettings, updateUiSettings } from "@/stores/settings";
import { isMobile } from "@/lib/platform";
import languageSelect from "@/components/languageSelect.vue";
import { uiBadge } from "@/components/ui/badge";
import { uiButton } from "@/components/ui/button";
import { uiCard } from "@/components/ui/card";
import { uiRadioGroup, uiRadioGroupItem } from "@/components/ui/radioGroup";
import { uiSlider } from "@/components/ui/slider";

const mobileScale = ref(uiSettings.value.mobileScale);
const fontScale = ref(uiSettings.value.fontScale);
const radius = ref(uiSettings.value.radius);
watchEffect(() => {
  mobileScale.value = uiSettings.value.mobileScale;
  fontScale.value = uiSettings.value.fontScale;
  radius.value = uiSettings.value.radius;
});

const themes = [
  { value: "light", label: "浅色", description: "明亮清晰", icon: IconSun },
  { value: "dark", label: "深色", description: "沉浸创作", icon: IconMoon },
  { value: "system", label: "跟随系统", description: "自动切换", icon: IconDeviceDesktop },
];
const colors = [
  { value: "#409eff", label: "天空蓝" },
  { value: "#6366f1", label: "鸢尾紫" },
  { value: "#a855f7", label: "薰衣紫" },
  { value: "#e34b83", label: "蔷薇粉" },
  { value: "#e89524", label: "琥珀橙" },
  { value: "#18a17c", label: "松石绿" },
];
// ACT: 原 el-slider 的刻度文案；uiSlider 不带刻度，按位置自行绘制。
const mobileScaleLabels = [
  { value: 50, label: "50%" },
  { value: 75, label: "75%（默认）" },
  { value: 100, label: "100%" },
];
const fontScaleLabels = [
  { value: 85, label: "较小" },
  { value: 100, label: "默认" },
  { value: 125, label: "较大" },
];
const radiusLabels = [
  { value: 0, label: "直角" },
  { value: 8, label: "默认" },
  { value: 16, label: "圆润" },
];
function markOffset(value: number, min: number, max: number) {
  return `${((value - min) / (max - min)) * 100}%`;
}

function changeColor(value: string | null) {
  if (value) updateUiSettings({ primaryColor: value });
}

// ACT: 圆心固定用视口中心，实际点击坐标由 captureThemeClickPoint 在 change 前写入。
let themeClickPoint = { x: innerWidth / 2, y: innerHeight / 2 };
function captureThemeClickPoint(event: MouseEvent) {
  themeClickPoint = { x: event.clientX, y: event.clientY };
}
function changeTheme(value: string) {
  const { x, y } = themeClickPoint;
  const root = document.documentElement;
  root.style.setProperty("--themeX", `${x}px`);
  root.style.setProperty("--themeY", `${y}px`);
  root.style.setProperty("--themeR", `${Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))}px`);
  if (!document.startViewTransition) {
    updateUiSettings({ theme: value });
    return;
  }
  document.startViewTransition(async () => {
    updateUiSettings({ theme: value });
    await nextTick();
  });
}
</script>

<style lang="scss" scoped>
.ui {
  display: flex;
  flex-direction: column;
  gap: 24px;

  .intro,
  .description {
    margin: 0;
    color: var(--muted-foreground);
    font-size: 13px;
    line-height: 1.6;
  }

  .settingSection {
    min-width: 0;

    h3 {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0 0 12px;
      color: var(--foreground);
      font-size: 14px;
      font-weight: 600;
    }

    .settingHeader {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 12px;

      h3 {
        margin-bottom: 6px;
      }
      .settingValue {
        color: var(--muted-foreground);
        font-size: 12px;
        font-variant-numeric: tabular-nums;
      }
    }

    .languageCards { margin-top: 14px; }

    .themeOptions {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 10px;
      width: 100%;

      .themeOption {
        display: flex;
        align-items: flex-start;
        gap: 8px;
        min-width: 0;
        padding: 14px 10px;
        border: 1px solid var(--border);
        border-radius: var(--radius);
        background: var(--card);
        cursor: pointer;
        transition: border-color 0.15s, background-color 0.15s;

        &:hover {
          background: var(--accent);
        }

        &.checked {
          border-color: var(--primary);
          background: color-mix(in oklab, var(--primary) 8%, transparent);
        }

        .themeRadio {
          margin-top: 4px;
        }

        .themeLabel {
          display: flex;
          flex-direction: column;
          gap: 8px;
          min-width: 0;
          white-space: normal;

          strong {
            font-size: 13px;
            font-weight: 500;
          }
          small {
            color: var(--muted-foreground);
            font-size: 12px;
          }
        }
      }
    }

    .colorOptions {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 14px;

      .colorSwatch {
        width: 30px;
        height: 30px;
        border: 0;
        border-radius: 50%;
        color: #fff;
        background: var(--swatchColor);

        &:hover {
          background: var(--swatchColor);
          opacity: 0.9;
        }
        &[aria-pressed="true"] {
          outline: 2px solid var(--swatchColor);
          outline-offset: 3px;
        }
        &:focus-visible {
          outline: 2px solid var(--foreground);
          outline-offset: 3px;
        }
      }
    }

    .settingSlider {
      width: calc(100% - 48px);
      margin: 14px 24px 28px;

      .sliderMarks {
        position: relative;
        height: 18px;
        margin-top: 10px;

        span {
          position: absolute;
          top: 0;
          transform: translateX(-50%);
          color: var(--muted-foreground);
          font-size: 12px;
          white-space: nowrap;
        }
      }
    }
  }

  .appearancePreview {
    flex-direction: row;
    align-items: center;
    gap: 14px;
    padding: 18px;
    background: var(--muted);
    box-shadow: none;

    .previewIcon {
      display: grid;
      place-items: center;
      flex-shrink: 0;
      width: 40px;
      height: 40px;
      border-radius: var(--radius);
      background: color-mix(in oklab, var(--primary) 12%, transparent);
      color: var(--primary);
    }
    .previewText {
      flex: 1;
      min-width: 0;
      strong {
        font-size: 15px;
        font-weight: 500;
        color: var(--foreground);
      }
      p {
        margin: 6px 0 0;
        color: var(--muted-foreground);
        font-size: 12px;
        line-height: 1.6;
      }
    }
    .previewBadge {
      background: color-mix(in oklab, var(--primary) 12%, transparent);
      color: var(--primary);
    }
  }

  .settingsFooter {
    display: flex;
    justify-content: flex-end;
  }

  @media (max-width: 700px) {
    .settingSection .themeOptions .themeOption .themeLabel {
      flex-direction: row;
      align-items: center;
      flex-wrap: wrap;
    }
    .settingSection .themeOptions {
      grid-template-columns: 1fr;
    }
    .appearancePreview {
      flex-wrap: wrap;
      padding: 12px;
    }
  }
}
</style>
