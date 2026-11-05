<template>
  <section class="taskRecords" aria-label="任务记录" :aria-busy="loading">
    <div class="recordsToolbar">
      <form class="searchForm uiForm" @submit.prevent="submitSearch">
        <fieldset class="formFields">
          <div class="inputGroup">
            <component :is="IconSearch" aria-hidden="true" />
            <uiInput v-model="search" class="taskSearch" placeholder="搜索任务 ID" aria-label="搜索任务 ID"></uiInput>
            <uiButton
              @mousedown.prevent
              v-if="search"
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="清除"
              @click="search = ''; clearSearch(); ($event.currentTarget as HTMLElement).closest('.inputGroup')?.querySelector('input')?.focus()">
              <icon-x />
            </uiButton>
          </div>
          <uiButton variant="default" type="submit" :disabled="(loading)">查询</uiButton>
          <uiButton @click="clearSearch" variant="outline" type="button" :disabled="(loading || (!search && !activeSearch))">清除</uiButton>
        </fieldset>
      </form>
      <uiButton @click="consumptionVisible = true" variant="outline" type="button"><component :is="IconChartBar" aria-hidden="true" />消耗查询</uiButton>
    </div>
    <uiAlert v-if="errorMessage" variant="destructive">
      <uiAlertTitle class="whitespace-normal overflow-visible line-clamp-none">{{ errorMessage }}</uiAlertTitle>
      <uiButton @click="refresh" variant="outline" type="button" size="sm">重试</uiButton>
    </uiAlert>
    <div :aria-busy="loading" class="recordsList portLoading">
      <div class="tableViewport" :style="{ maxHeight: undefined, height: undefined }">
        <uiTable>
          <uiTableHeader>
            <uiTableRow>
              <uiTableHead :style="{ minWidth: '220px', textAlign: 'left' }">任务</uiTableHead>
              <uiTableHead :style="{ minWidth: '100px', textAlign: 'left' }">状态</uiTableHead>
              <uiTableHead :style="{ minWidth: '110px', textAlign: 'left' }">消费 / 耗时</uiTableHead>
              <uiTableHead :style="{ minWidth: '165px', textAlign: 'left' }">创建 / 完成时间</uiTableHead>
              <uiTableHead :style="{ minWidth: '65px', textAlign: 'right' }">详情</uiTableHead>
            </uiTableRow>
          </uiTableHeader>
          <uiTableBody>
            <uiTableRow v-for="(row, $index) in records" :key="row.id">
              <uiTableCell :style="{ textAlign: 'left' }">
                <div class="taskIdentity">
                  <div class="modelHeading">
                    <div class="modelAvatar" aria-hidden="true">
                      <modelIcon :model="row.modelName" :size="24" />
                    </div>
                    <div class="modelLabels">
                      <strong>{{ row.modelName }}</strong>
                      <span v-if="row.keyName" class="keyName">凭证名称{{ row.keyName }}</span>
                    </div>
                  </div>
                  <span class="taskId">{{ row.taskId }}</span>
                </div>
              </uiTableCell>
              <uiTableCell :style="{ textAlign: 'left' }">
                <uiBadge variant="secondary">{{ statusLabel(row.status) }}</uiBadge>
              </uiTableCell>
              <uiTableCell :style="{ textAlign: 'left' }">
                <div class="recordMetrics">
                  <span>{{ formatAmount(row.amount) }}</span>
                  <span v-if="row.duration !== null" class="duration">{{ numberFormat.format(row.duration) }}秒</span>
                </div>
              </uiTableCell>
              <uiTableCell :style="{ textAlign: 'left' }">
                <div class="recordTimes">
                  <time>{{ formatTime(row.createdAt) }}</time>
                  <time v-if="row.completedAt !== null" class="completedTime">{{ formatTime(row.completedAt) }}</time>
                </div>
              </uiTableCell>
              <uiTableCell :style="{ textAlign: 'right' }">
                <uiButton :aria-label="`查看任务 ${row.taskId} 的详情`" @click="openDetails(row as TaskRecord)" variant="link" type="button">查看</uiButton>
              </uiTableCell>
            </uiTableRow>
            <uiTableEmpty v-if="!(records)?.length" :colspan="5"></uiTableEmpty>
          </uiTableBody>
        </uiTable>
      </div>
      <div v-if="loading" class="portLoadingMask" aria-hidden="true">
        <icon-loader-2 class="animate-spin" />
      </div>
    </div>
    <el-pagination
      v-if="!errorMessage"
      class="recordsPagination"
      :currentPage="page"
      :pageSize="pageSize"
      :pageSizes="[10, 20, 50]"
      :total="total"
      :disabled="loading"
      :pagerCount="5"
      layout="total, sizes, prev, pager, next"
      size="small"
      @update:currentPage="changePage"
      @update:pageSize="changePageSize" />
    <uiDialog :open="detailsVisible" @update:open="open => { if (!open) { detailsVisible = false; } }">
      <uiDialogContent
        :aria-describedby="undefined"
        class="uiDialogPanel"
        :style="{ width: 'min(640px, calc(100vw - 32px))', maxWidth: 'calc(100vw - 32px)' }">
        <uiDialogHeader class="dialogHeader">
          <uiDialogTitle>任务详情</uiDialogTitle>
        </uiDialogHeader>
        <div class="dialogBody">
          <div v-if="selectedRecord" class="taskDetails">
            <div class="detailHeading">
              <div class="modelAvatar" aria-hidden="true">
                <modelIcon :model="selectedRecord.modelName" :size="28" />
              </div>
              <h3>{{ selectedRecord.modelName }}</h3>
              <uiBadge variant="secondary">{{ statusLabel(selectedRecord.status) }}</uiBadge>
            </div>
            <dl class="detailFields">
              <div class="fullWidth">
                <dt>任务 ID</dt>
                <dd>{{ selectedRecord.taskId }}</dd>
              </div>
              <div v-if="selectedRecord.keyName">
                <dt>凭证名称</dt>
                <dd>{{ selectedRecord.keyName }}</dd>
              </div>
              <div>
                <dt>消费金额</dt>
                <dd>{{ formatAmount(selectedRecord.amount) }}</dd>
              </div>
              <div>
                <dt>耗时</dt>
                <dd>{{ selectedRecord.duration === null ? "" : `${numberFormat.format(selectedRecord.duration)} 秒` }}</dd>
              </div>
              <div>
                <dt>创建时间</dt>
                <dd>{{ formatTime(selectedRecord.createdAt) }}</dd>
              </div>
              <div>
                <dt>完成时间</dt>
                <dd>{{ formatTime(selectedRecord.completedAt) }}</dd>
              </div>
              <div v-if="selectedRecord.errorReason" class="fullWidth failureReason">
                <dt>失败原因</dt>
                <dd>{{ selectedRecord.errorReason }}</dd>
              </div>
            </dl>
            <uiButton v-if="resultUrl" class="resultButton" variant="default" type="button" asChild>
              <a :href="resultUrl" target="_blank" rel="noopener noreferrer"><component :is="IconExternalLink" aria-hidden="true" />查看结果</a>
            </uiButton>
            <section v-else-if="resultText" class="resultData">
              <h4>结果数据</h4>
              <pre>{{ resultText }}</pre>
            </section>
          </div>
        </div>
      </uiDialogContent>
    </uiDialog>
    <uiDialog :open="consumptionVisible" @update:open="open => { if (!open) { consumptionVisible = false; } }">
      <uiDialogContent
        :aria-describedby="undefined"
        class="uiDialogPanel"
        :style="{ width: 'min(560px, calc(100vw - 32px))', maxWidth: 'calc(100vw - 32px)' }">
        <uiDialogHeader class="dialogHeader">
          <uiDialogTitle>消耗查询</uiDialogTitle>
        </uiDialogHeader>
        <div class="dialogBody">
          <form :id="consumptionFormId" class="consumptionForm uiForm" @submit.prevent="queryConsumption">
            <fieldset class="formFields" :disabled="consumptionLoading">
              <div class="formField">
                <uiLabel>时间范围</uiLabel>
                <el-date-picker
                  v-model="dateRange"
                  class="dateRange"
                  type="datetimerange"
                  format="YYYY-MM-DD HH:mm:ss"
                  :startPlaceholder="translate('开始时间')"
                  :endPlaceholder="translate('结束时间')"
                  :rangeSeparator="translate('至')" />
                <p v-if="rangeError" class="text-destructive text-sm" role="alert">{{ rangeError }}</p>
              </div>
              <div class="formField">
                <uiLabel :for="portFieldId + '-1'">凭证（选填）</uiLabel>
                <div class="inputGroup">
                  <uiInput
                    :id="portFieldId + '-1'"
                    v-model="accountCredential"
                    autocomplete="off"
                    placeholder="输入凭证，留空查询全部"
                    :disabled="(consumptionLoading) || (false)"
                    :type="passwordVisible1 ? 'text' : 'password'"></uiInput>
                  <uiButton
                    @mousedown.prevent
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    :aria-label="passwordVisible1 ? '隐藏密码' : '显示密码'"
                    :disabled="consumptionLoading"
                    @click="passwordVisible1 = !passwordVisible1">
                    <icon-eye-off v-if="passwordVisible1" />
                    <icon-eye v-else />
                  </uiButton>
                </div>
              </div>
            </fieldset>
          </form>
          <uiAlert v-if="consumptionError" variant="destructive">
            <uiAlertTitle class="whitespace-normal overflow-visible line-clamp-none">{{ consumptionError }}</uiAlertTitle>
          </uiAlert>
          <dl v-if="consumption" class="consumptionResult" aria-live="polite">
            <div>
              <dt>消费金额</dt>
              <dd>{{ formatAmount(consumption.total) }}</dd>
            </div>
            <div>
              <dt>请求次数</dt>
              <dd>{{ numberFormat.format(consumption.count) }}</dd>
            </div>
          </dl>
          <uiDialogFooter class="dialogFooter">
            <uiButton @click="consumptionVisible = false" variant="outline" type="button">关闭</uiButton>
            <uiButton :form="consumptionFormId" variant="default" type="submit" :disabled="(!consumptionReady) || (consumptionLoading)"><icon-loader-2 v-if="consumptionLoading" class="animate-spin" aria-hidden="true" />查询</uiButton>
          </uiDialogFooter>
        </div>
      </uiDialogContent>
    </uiDialog>
  </section>
</template>

<script setup lang="ts">
import { uiLabel } from "@/components/ui/label";
import { uiDialog, uiDialogContent, uiDialogHeader, uiDialogTitle, uiDialogFooter } from "@/components/ui/dialog";
import { uiBadge } from "@/components/ui/badge";
import { uiTable, uiTableHeader, uiTableHead, uiTableBody, uiTableRow, uiTableCell, uiTableEmpty } from "@/components/ui/table";
import { uiAlert, uiAlertTitle } from "@/components/ui/alert";
import { uiButton } from "@/components/ui/button";
import { uiInput } from "@/components/ui/input";
import { computed, onBeforeUnmount, ref, useId, watch } from "vue";
import { t, translate } from "@toonflow/i18n/vue";
import { IconChartBar, IconExternalLink, IconSearch } from "@tabler/icons-vue";
import { modelIcon } from "@toonflow/model-icons";
import type { PointsConsumption, TaskRecord, TaskRecordsPage } from "@toonflow/server/channel";
import http from "@/lib/http";

const props = defineProps<{ visible: boolean; token: string }>();
const loading = defineModel<boolean>("loading", { default: false });
const search = ref("");
const activeSearch = ref("");
const page = ref(1);
const pageSize = ref(10);
const records = ref<TaskRecord[]>([]);
const total = ref(0);
const errorMessage = ref("");
const selectedRecord = ref<TaskRecord>();
const detailsVisible = ref(false);
const consumptionVisible = ref(false);
const consumptionLoading = ref(false);
const consumptionError = ref("");
const consumption = ref<PointsConsumption>();
const consumptionFormId = useId();
const dateRange = ref<[Date, Date] | null>(null);
const accountCredential = ref("");
const numberFormat = new Intl.NumberFormat("zh-CN", { maximumFractionDigits: 6 });
const timeFormat = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
});
const rangeError = computed(() => dateRange.value && dateRange.value[0].getTime() > dateRange.value[1].getTime() ? translate("结束时间不能早于开始时间") : "");
const consumptionReady = computed(() => !!dateRange.value && dateRange.value.every(date => Number.isFinite(date.getTime())) && !rangeError.value && !consumptionLoading.value);
const resultUrl = computed(() => {
  const value = selectedRecord.value?.resultUrl;
  if (!value || !URL.canParse(value)) return "";
  const url = new URL(value);
  return ["http:", "https:"].includes(url.protocol) && !url.username && !url.password ? url.href : "";
});
const resultText = computed(() => {
  const result = selectedRecord.value?.result ?? "";
  try {
    return JSON.stringify(JSON.parse(result), null, 2);
  } catch {
    return result;
  }
});
let recordsRequest: AbortController | undefined;
let consumptionRequest: AbortController | undefined;

function statusLabel(status: number) {
  return ({ [-1]: translate("失败"), 1: translate("进行中"), 2: translate("已完成") } as Record<number, string>)[status] ?? t`状态 ${status}`;
}

function statusType(status: number) {
  return status === 2 ? "success" : status === -1 ? "danger" : status === 1 ? "warning" : "info";
}

function formatAmount(value: number | null) {
  return value === null ? "" : `¥${numberFormat.format(value)}`;
}

function formatTime(value: number | null) {
  return value === null ? "" : timeFormat.format(value);
}

function requestError(error: unknown, fallback: string) {
  if (error instanceof Error && "status" in error && error.status === 401) return translate("账号登录已失效，请重新登录");
  return error instanceof Error ? error.message : fallback;
}

function openDetails(record: TaskRecord) {
  selectedRecord.value = record;
  detailsVisible.value = true;
}

function submitSearch() {
  activeSearch.value = search.value.trim();
  page.value = 1;
  void refresh();
}

function clearSearch() {
  search.value = "";
  submitSearch();
}

function changePage(value: number) {
  if (page.value === value) return;
  page.value = value;
  void refresh();
}

function changePageSize(value: number) {
  pageSize.value = value;
  page.value = 1;
  void refresh();
}

async function refresh() {
  recordsRequest?.abort();
  loading.value = false;
  errorMessage.value = "";
  records.value = [];
  detailsVisible.value = false;
  selectedRecord.value = undefined;
  const token = props.token;
  if (!props.visible || !token) return;
  const request = new AbortController();
  recordsRequest = request;
  loading.value = true;
  try {
    const result = await http<TaskRecordsPage>({
      method: "GET", url: "/api/channel/account/getTaskRecords", signal: request.signal,
      headers: { Authorization: `Bearer ${token}` },
      params: { page: page.value, limit: pageSize.value, ...(activeSearch.value ? { taskId: activeSearch.value } : {}) },
    });
    if (request.signal.aborted || props.token !== token) return;
    records.value = result.list;
    total.value = result.total;
  } catch (error) {
    if (!request.signal.aborted) errorMessage.value = requestError(error, translate("获取任务记录失败"));
  } finally {
    if (recordsRequest === request) loading.value = false;
  }
}

async function queryConsumption() {
  const token = props.token;
  if (!props.visible || !token || !consumptionVisible.value || !consumptionReady.value || !dateRange.value) return;
  consumptionRequest?.abort();
  const request = new AbortController();
  consumptionRequest = request;
  consumptionLoading.value = true;
  consumption.value = undefined;
  consumptionError.value = "";
  try {
    const result = await http<PointsConsumption>({
      method: "POST", url: "/api/channel/account/getPointsConsumption", signal: request.signal,
      headers: { Authorization: `Bearer ${token}` },
      data: { key: accountCredential.value.trim(), startTime: dateRange.value[0].getTime(), finishTime: dateRange.value[1].getTime() },
    });
    if (!request.signal.aborted && props.token === token) consumption.value = result;
  } catch (error) {
    if (!request.signal.aborted) consumptionError.value = requestError(error, translate("查询消耗失败"));
  } finally {
    if (consumptionRequest === request) consumptionLoading.value = false;
  }
}

watch(consumptionVisible, visible => {
  consumptionRequest?.abort();
  consumptionLoading.value = false;
  consumption.value = undefined;
  consumptionError.value = "";
  accountCredential.value = "";
  const now = new Date();
  dateRange.value = visible ? [new Date(now.getTime() - 3600000), now] : null;
}, { flush: "sync" });

watch([accountCredential, dateRange], () => {
  consumption.value = undefined;
  consumptionError.value = "";
});

watch([() => props.visible, () => props.token], ([visible, token], previous) => {
  if (token !== previous?.[1]) {
    search.value = "";
    activeSearch.value = "";
    page.value = 1;
    total.value = 0;
  }
  if (!visible || token !== previous?.[1]) consumptionVisible.value = false;
  void refresh();
}, { immediate: true, flush: "sync" });

onBeforeUnmount(() => {
  recordsRequest?.abort();
  consumptionRequest?.abort();
  loading.value = false;
});

defineExpose({ refresh });

const passwordVisible1 = ref(false);
const portFieldId = useId();
</script>

<style lang="scss" scoped>
.taskRecords {
  display: grid;
  gap: 16px;
  min-width: 0;

  .recordsToolbar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px;

    .searchForm {
      display: flex;
      flex: 1;
      align-items: center;
      gap: 8px;
      min-width: 0;

      .taskSearch { min-width: 120px; max-width: 300px; }
      [data-slot="button"] { margin: 0; }
    }
  }

  .recordsList {
    min-width: 0;
    min-height: 120px;

    .taskIdentity {
      display: grid;
      gap: 6px;
      min-width: 0;
      padding: 4px 0;

      .modelHeading {
        display: flex;
        align-items: center;
        gap: 10px;
        min-width: 0;

        .modelAvatar {
          display: grid;
          place-items: center;
          flex-shrink: 0;
          width: 34px;
          height: 34px;
          border: 1px solid var(--el-border-color-lighter);
          border-radius: var(--ui-radius);
          background: var(--el-fill-color-extra-light);
        }
        .modelLabels {
          display: grid;
          gap: 2px;
          min-width: 0;

          strong { color: var(--el-text-color-primary); font-size: 13px; font-weight: 600; line-height: 1.5; overflow-wrap: anywhere; }
          .keyName { color: var(--el-text-color-secondary); font-size: 11px; line-height: 1.5; overflow-wrap: anywhere; }
        }
      }
      .taskId { color: var(--el-text-color-secondary); font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-size: 11px; line-height: 1.5; overflow-wrap: anywhere; }
    }
    .recordMetrics, .recordTimes {
      display: grid;
      gap: 4px;
      font-size: 12px;
      font-variant-numeric: tabular-nums;

      .duration, .completedTime { color: var(--el-text-color-secondary); }
    }
  }
  .recordsPagination { flex-wrap: wrap; gap: 8px; justify-content: flex-end; }
}

.taskDetails {
  display: grid;
  gap: 20px;

  .detailHeading {
    display: flex;
    align-items: center;
    gap: 12px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--el-border-color-lighter);

    .modelAvatar {
      display: grid;
      place-items: center;
      flex-shrink: 0;
      width: 44px;
      height: 44px;
      border: 1px solid var(--el-border-color-lighter);
      border-radius: var(--ui-radius);
      background: var(--el-fill-color-extra-light);
    }
    h3 { flex: 1; min-width: 0; margin: 0; overflow-wrap: anywhere; color: var(--el-text-color-primary); font-size: 15px; line-height: 1.5; }
    .el-tag { flex-shrink: 0; }
  }
  .detailFields {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
    margin: 0;

    > div {
      display: grid;
      align-content: start;
      gap: 6px;

      dt { color: var(--el-text-color-secondary); font-size: 12px; }
      dd { margin: 0; color: var(--el-text-color-regular); white-space: pre-wrap; overflow-wrap: anywhere; font-variant-numeric: tabular-nums; }
      &.fullWidth { grid-column: 1 / -1; }
      &.failureReason dd { color: var(--el-color-danger); }
    }
  }
  .resultButton { justify-self: start; }
  .resultData {
    min-width: 0;

    h4 { margin: 0 0 10px; color: var(--el-text-color-primary); font-size: 13px; }
    pre { max-height: 320px; margin: 0; padding: 12px; overflow: auto; white-space: pre-wrap; overflow-wrap: anywhere; border-radius: var(--ui-radius); background: var(--el-fill-color-light); font-size: 12px; line-height: 1.6; }
  }
}

.consumptionForm {
  .dateRange { width: 100%; }
}

.consumptionResult {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin: 20px 0 0;
  padding: 16px;
  border-radius: var(--ui-radius);
  background: var(--el-fill-color-light);

  > div {
    display: grid;
    gap: 8px;

    dt { color: var(--el-text-color-secondary); font-size: 12px; }
    dd { margin: 0; color: var(--el-text-color-primary); font-size: 20px; font-weight: 600; font-variant-numeric: tabular-nums; overflow-wrap: anywhere; }
  }
}
</style>
