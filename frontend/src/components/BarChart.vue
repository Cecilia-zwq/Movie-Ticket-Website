<template>
  <v-chart :option="option" class="chart" />
</template>

<script>
import { ref, provide, onMounted } from "vue";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from "echarts/components";

use([
  CanvasRenderer,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
]);

export default {
  props: {
    option: Object, // 图表的配置选项
  },
};
</script>

<style lang="scss" scoped>
.chart {
  height: 400px;
  width: 100%;
}
</style>
