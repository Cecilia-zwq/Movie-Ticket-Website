<template>
  <div class="container">
    <el-select
      v-model="index"
      placeholder="Select"
      size="large"
      class="slection-container"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </div>
  <statistic-chart
    v-if="index === 1"
    :lineChartOption="dateBookingRankOption"
  ></statistic-chart>
  <statistic-chart
    v-if="index === 2"
    :barChartOption="movieBookingRankOption"
  ></statistic-chart>
  <statistic-chart
    v-if="index === 2"
    :barChartOption="movieRatingRankOption"
  ></statistic-chart>
</template>

<script setup>
import { ref, reactive, inject, onMounted, watch } from "vue";
import { UserStore } from "../stores/UserStore";
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();

const axios = inject("axios");
const userStore = UserStore();
const message = inject("message");

const options = [
  { value: 1, label: "票房趋势" },
  { value: 2, label: "电影排名" },
];
const index = ref(1);

const movieBookingRankOption = ref();
const movieBookingCounts = ref();

const dateBookingRankOption = ref();
const dateBookingCounts = ref();

const movieRatingRankOption = ref();
const movieRatingRank = ref();

onMounted(async () => {
  await fetchMovieBookingRank();
  await fetchDateBookingRank();
  await fetchRatingRank();
  renderChart();
});

const renderChart = () => {
  renderMovieBookingChart();
  renderDateBookingChart();
  renderRatingChart();
};

const fetchMovieBookingRank = async () => {
  try {
    const res = await axios.get("/bookings?sta=movie");
    movieBookingCounts.value = res.data.movieBookingCounts;
    console.log(movieBookingCounts.value);
  } catch (error) {
    console.log(error);
  }
};

const fetchDateBookingRank = async () => {
  try {
    const res = await axios.get("/bookings?sta=date");
    dateBookingCounts.value = res.data.dateBookingCounts;
    console.log(dateBookingCounts.value);
  } catch (error) {
    console.log(error);
  }
};

const fetchRatingRank = async () => {
  try {
    const res = await axios.get("/movies?sta=rate");
    movieRatingRank.value = res.data.movieRatingRank;
    console.log(movieRatingRank.value);
  } catch (error) {
    console.log(error);
  }
};

const renderMovieBookingChart = () => {
  const xAxisData = movieBookingCounts.value.map((item) => item.title);
  const seriesData = movieBookingCounts.value.map((item) => item.bookingCount);
  movieBookingRankOption.value = {
    xAxis: {
      data: xAxisData,
      axisLabel: {
        formatter: (value) => {
          // 在这个函数中进行标签格式化
          // value 参数表示当前标签的原始值
          // 返回值将作为新的标签值
          const charsPerLine = 5; // 每行字符数
          const result = [];
          for (let i = 0; i < value.length; i += charsPerLine) {
            const chunk = value.substr(i, charsPerLine); // 截取每四个字符
            result.push(chunk);
          }
          return result.join("\n"); // 使用换行符连接每个部分
        },
      },
    },
    yAxis: {
      name: "票房（元）",
    },
    series: [
      {
        type: "bar",
        data: seriesData,
        label: {
          show: true, // 显示标签
          position: "top", // 标签位置，可以是 "top"、"insideTop" 等
        },
      },
    ],
  };
};

const renderDateBookingChart = () => {
  const xAxisData = dateBookingCounts.value.map((item) => item.date);
  const seriesData = dateBookingCounts.value.map((item) => item.bookingCount);
  dateBookingRankOption.value = {
    xAxis: {
      type: "category",
      data: xAxisData,
    },
    yAxis: {
      type: "value",
      name: "票房（元）",
    },
    series: [
      {
        data: seriesData,
        type: "line",
        label: {
          show: true, // 显示标签
          position: "top", // 标签位置，可以是 "top"、"insideTop" 等
        },
      },
    ],
  };
};

const renderRatingChart = () => {
  const xAxisData = movieRatingRank.value.map((item) => item.title);
  const seriesData = movieRatingRank.value.map((item) => item.averageRating);
  movieRatingRankOption.value = {
    xAxis: {
      data: xAxisData,
      axisLabel: {
        formatter: (value) => {
          // 在这个函数中进行标签格式化
          // value 参数表示当前标签的原始值
          // 返回值将作为新的标签值
          const charsPerLine = 5; // 每行字符数
          const result = [];
          for (let i = 0; i < value.length; i += charsPerLine) {
            const chunk = value.substr(i, charsPerLine); // 截取每四个字符
            result.push(chunk);
          }
          return result.join("\n"); // 使用换行符连接每个部分
        },
      },
    },
    yAxis: {
      name: "分数",
      min: 8,
    },
    series: [
      {
        type: "bar",
        data: seriesData,
        label: {
          show: true, // 显示标签
          position: "top", // 标签位置，可以是 "top"、"insideTop" 等
        },
      },
    ],
  };
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-flow: column wrap;
  align-items: center;
  padding: 20px;
}
</style>
