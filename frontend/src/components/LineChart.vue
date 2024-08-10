<template>
  <v-chart :option="option" class="chart" />
</template>

<script>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from "echarts/components";

use([
  CanvasRenderer,
  LineChart,
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
