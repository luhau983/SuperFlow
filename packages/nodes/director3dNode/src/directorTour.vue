<template>
  <el-tour v-model="open" :targetAreaClickable="false" :contentStyle="{ maxWidth: 'calc(100vw - 32px)' }" @close="complete">
    <el-tour-step
      v-for="(step, index) in steps"
      :key="step.target"
      :target="() => root?.querySelector<HTMLElement>(step.target) ?? null"
      :title="step.title"
      :description="step.description"
      :prevButtonProps="{ children: 'Bước trước' }"
      :nextButtonProps="{ children: index === steps.length - 1 ? 'Bắt đầu sử dụng' : 'Bước tiếp' }" />
    <template #indicators="{ current, total }">{{ current + 1 }} / {{ total }}</template>
  </el-tour>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ElTour, ElTourStep } from "element-plus";

defineProps<{ root?: HTMLElement }>();
const storageKey = "toonflow.director3dTour";
const open = ref(localStorage.getItem(storageKey) !== "true");
const steps = [
  {
    target: ".chatFooter",
    title: "Tạo cảnh và phương án",
    description: "Mô tả mô hình cảnh, chuyển động nhân vật và yêu cầu góc máy, rồi nhấp “Tạo phương án”. Dùng @ để tham chiếu văn bản, hình ảnh và video đã kết nối trên bảng vẽ.",
  },
  {
    target: ".planContent",
    title: "Xem và chuyển phương án",
    description: "Các phương án đã tạo xuất hiện ở đây. Nhấp để xem hoạt ảnh từ đầu và câu lệnh đã dùng. Bạn có thể nhập yêu cầu để tạo phương án mới. Các phương án dùng chung cảnh và mô hình nền.",
  },
  {
    target: ".viewport",
    title: "Góc nhìn thứ nhất",
    description: "Nhấp vào cảnh 3D rồi dùng chuột đổi hướng nhìn. WASD để di chuyển, Space để lên, Shift để xuống, cuộn chuột để chỉnh tiêu cự; chuột trái hoặc Esc để thoát.",
  },
  {
    target: ".stagePanel .referenceList",
    title: "Ghi khung hình chính",
    description: "Nhấn chuột phải khi chọn góc máy hoặc nhấp “Thêm khung hình chính” để ghi góc máy hiện tại. Kéo để sắp xếp, nhấp để xem lại hoặc xóa. Khi tạo phương án mới, AI dùng các góc máy và thứ tự này để thiết kế chuyển động. Nút xuất cho phép xuất ảnh khung hình chính.",
  },
  {
    target: ".playbackBar",
    title: "Phát và cài đặt hình ảnh",
    description: "Dùng nút phát và thanh tiến trình để xem hoạt ảnh. Điều chỉnh tỷ lệ hình ảnh, lưới, bầu trời và ánh sáng để cảnh xem trước phù hợp với ý tưởng của bạn.",
  },
  {
    target: '[aria-label="Xuất nút video"]',
    title: "Xuất ra bảng vẽ",
    description: "Chọn phương án rồi nhấp đây để xuất nút video. Nút xuất trên ảnh thu nhỏ khung hình chính tạo nút hình ảnh. Giữ cửa sổ hiển thị trong lúc xuất video, rồi quay lại bảng vẽ để xem kết quả.",
  },
];

function complete() {
  localStorage.setItem(storageKey, "true");
}
</script>
