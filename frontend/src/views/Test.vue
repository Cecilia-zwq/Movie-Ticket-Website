<!--scr/views/Test.vue-->
<template>
  <div>Test</div>
  <div>
    <statistic-chart :barChartOption="barChartOption"></statistic-chart>
  </div>
</template>

<script setup>
import { ref, reactive, inject, onMounted, watch } from "vue";

import { UserStore } from "../stores/UserStore";
const userStore = UserStore();

const barChartOption = ref({
  xAxis: {
    data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  yAxis: {},
  series: [
    {
      type: "bar",
      data: [23, 24, 18, 25, 27, 28, 25],
    },
  ],
});
const lineChartOption = ref({
  xAxis: {
    type: "category",
    data: ["A", "B", "C"],
  },
  yAxis: {
    type: "value",
  },
  series: [
    {
      data: [120, 200, 150],
      type: "line",
    },
  ],
});
</script>

<style lang="scss"></style>
