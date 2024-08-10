<template>
  <div class="statistic-chart">
    <bar-chart v-if="barChartOption" :option="barChartOption"></bar-chart>
    <line-chart v-if="lineChartOption" :option="lineChartOption"></line-chart>
  </div>
</template>

<script>
import { ref, onMounted, nextTick } from "vue";
export default {
  props: {
    barChartOption: Object,
    lineChartOption: Object, // 图表的配置选项
  },
};
</script>

<style lang="scss" scoped></style>
