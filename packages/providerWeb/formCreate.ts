import formCreate from "@form-create/element-ui";
import { translate } from "@toonflow/i18n/vue";
import {
  ElForm, ElFormItem, ElRow, ElCol, ElInput, ElInputNumber, ElSwitch,
  ElSelect, ElOption, ElCheckbox, ElCheckboxGroup, ElRadio, ElRadioGroup,
} from "element-plus";
import "element-plus/es/components/form/style/css";
import "element-plus/es/components/form-item/style/css";
import "element-plus/es/components/row/style/css";
import "element-plus/es/components/col/style/css";
import "element-plus/es/components/input/style/css";
import "element-plus/es/components/input-number/style/css";
import "element-plus/es/components/switch/style/css";
import "element-plus/es/components/select/style/css";
import "element-plus/es/components/option/style/css";
import "element-plus/es/components/checkbox/style/css";
import "element-plus/es/components/checkbox-group/style/css";
import "element-plus/es/components/radio/style/css";
import "element-plus/es/components/radio-group/style/css";

for (const [name, component] of Object.entries({
  "el-form": ElForm, "el-form-item": ElFormItem, "el-row": ElRow, "el-col": ElCol,
  "el-input": ElInput, "el-input-number": ElInputNumber, "el-switch": ElSwitch,
  "el-select": ElSelect, "el-option": ElOption, "el-checkbox": ElCheckbox,
  "el-checkbox-group": ElCheckboxGroup, "el-radio": ElRadio, "el-radio-group": ElRadioGroup,
})) formCreate.component(name, component);

export type { Api, Options, Rule } from "@form-create/element-ui";

export function translateProviderRules(rules: Parameters<typeof formCreate.copyRules>[0]) {
  const copied = formCreate.copyRules(rules);
  function visit(value: unknown) {
    if (Array.isArray(value)) return value.forEach(visit);
    if (!value || typeof value !== "object") return;
    const record = value as Record<string, unknown>;
    for (const [key, item] of Object.entries(record)) {
      if (["title", "label", "info", "description", "placeholder", "message"].includes(key) && typeof item === "string") {
        record[key] = translate(item);
      } else if (["children", "control", "rule", "props", "options", "validate"].includes(key)) visit(item);
    }
  }
  visit(copied);
  return copied;
}

export default formCreate;
