<template>
  <div class="providerList">
    <div class="itemList">
      <toonflowProviderCard scope="text" :provider="customProviders.find(item => item.id.toLowerCase() === 'toonflow')" />
      <codexProviderCard />
      <uiCard v-for="item in visibleProviders" :key="item.id" class="providerItem" style="gap:0; padding:0">
        <div class="cardBody" :style="{ padding: '20px' }">
          <div class="providerHeader">
            <div v-if="item.icon" class="providerMark" aria-hidden="true">
              <img class="providerLogo" :src="item.icon" alt="" />
            </div>
            <div class="providerInfo">
              <div class="providerHeading">
                <strong class="providerName" data-ui-text="default">{{ item.label }}</strong>
              </div>
              <span class="providerId" :title="item.id" data-ui-text="info">{{ item.id }}</span>
            </div>
          </div>
          <div class="providerFooter">
            <div class="providerMeta">
              <uiBadge v-if="getProviderVersion(item)" variant="outline">v{{ getProviderVersion(item) }}</uiBadge>
              <span data-ui-text="info">{{ item.models.length }}个模型</span>
            </div>
            <div class="itemActions" style="display:flex; flex-wrap:wrap; align-items:center; gap:8px">
              <uiButton @click="openCustomProvider(item)" variant="ghost" type="button" :disabled="(!!deletingId)"><component :is="IconEdit" aria-hidden="true" />编辑</uiButton>
              <uiPopover v-model:open="confirmVisible1[String(item.id)]">
                <uiPopoverTrigger asChild>
                  <uiButton variant="ghost" type="button" :disabled="(!!deletingId) || (deletingId === item.id)"><icon-loader-2 v-if="deletingId === item.id" class="animate-spin" aria-hidden="true" /><component :is="IconTrash" aria-hidden="true" />删除</uiButton>
                </uiPopoverTrigger>
                <uiPopoverContent class="w-[280px]">
                  <p>确定删除此供应商及其模型？</p>
                  <div class="confirmActions">
                    <uiButton type="button" variant="outline" size="sm" @click="confirmVisible1[String(item.id)] = false; ">取消</uiButton>
                    <uiButton type="button" size="sm" @click="confirmVisible1[String(item.id)] = false; deleteProvider(item.id)">删除</uiButton>
                  </div>
                </uiPopoverContent>
              </uiPopover>
            </div>
          </div>
        </div>
      </uiCard>
    </div>
    <div class="providerActions">
      <uiButton class="addButton" @click="openProvider" variant="outline" type="button"><component :is="IconPlus" aria-hidden="true" />添加供应商</uiButton>
      <uiButton class="addButton" @click="openCustomProvider()" variant="outline" type="button"><component :is="IconSettings" aria-hidden="true" />添加自定义供应商</uiButton>
    </div>
    <component :is="addProviderDialog" v-model="providerDialogVisible" />
    <component :is="addCustomProviderDialog" v-model="customProviderDialogVisible" :provider="editingProvider" />
  </div>
</template>

<script setup lang="ts">
import { uiPopover, uiPopoverTrigger, uiPopoverContent } from "@/components/ui/popover";
import { uiButton } from "@/components/ui/button";
import { uiBadge } from "@/components/ui/badge";
import { uiCard } from "@/components/ui/card";
import { computed, defineAsyncComponent, ref, shallowRef, type Component } from "vue";
import { toast } from "vue-sonner";
import { customProviders, saveSettings, type CustomProvider } from "@/stores/settings";
import { IconPlus, IconSettings, IconEdit, IconTrash } from "@tabler/icons-vue";
import { languageProviders } from "@toonflow/providers";
import toonflowProviderCard from "../../toonflowProviderCard.vue";
import codexProviderCard from "../../codexProviderCard.vue";

defineProps<{ visible?: boolean }>();
const addProviderDialog = shallowRef<Component>();
const addCustomProviderDialog = shallowRef<Component>();
const providerDialogVisible = ref(false);
const customProviderDialogVisible = ref(false);
const editingProvider = ref<CustomProvider>();
const deletingId = ref("");
const visibleProviders = computed(() => customProviders.value.filter(item => item.id.toLowerCase() !== "toonflow"));

function getProviderVersion(provider: CustomProvider) {
  const version = languageProviders.find(item => item.id.toLowerCase() === provider.id.toLowerCase())?.version ?? provider.version;
  return typeof version === "string" ? version.trim() : "";
}

function openProvider() {
  addProviderDialog.value ??= defineAsyncComponent(() => import("./addProviderDialog.vue"));
  providerDialogVisible.value = true;
}

function openCustomProvider(provider?: CustomProvider) {
  if (provider?.id.toLowerCase() === "toonflow") return;
  addCustomProviderDialog.value ??= defineAsyncComponent(() => import("./addCustomProviderDialog.vue"));
  editingProvider.value = provider;
  customProviderDialogVisible.value = true;
}

async function deleteProvider(id: string) {
  if (id.toLowerCase() === "toonflow" || deletingId.value) return;
  deletingId.value = id;
  try {
    await saveSettings(settings => {
      const current = settings.customProviders;
      if (!Array.isArray(current)) throw new Error("配置格式错误");
      return { customProviders: current.filter(item => item?.id !== id) };
    });
  } catch { toast.error("删除失败，请重试"); }
  finally { deletingId.value = ""; }
}

const confirmVisible1 = ref<Record<string, boolean>>({});
</script>

<style lang="scss" scoped src="../../providerList.scss"></style>
