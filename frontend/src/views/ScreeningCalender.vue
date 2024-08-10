<template>
  <div class="page-container">
    <div class="calender-container">
      <el-select
        v-model="theaterId"
        placeholder="Select"
        size="large"
        @change="renderTimeLineEvents"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <time-line :screeningEvents="events"></time-line>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, inject, onMounted, handleError } from "vue";
import { UserStore } from "../stores/UserStore";
import { CalculateEndDateTime } from "../utils/utils";

import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();

const axios = inject("axios");
const userStore = UserStore();
const message = inject("message");

const options = [
  { value: 1, label: "1号厅" },
  { value: 2, label: "2号厅" },
  { value: 3, label: "3号厅" },
];
const events = ref([]);
const theaterEvents = ref([]);
const theaterId = ref(1);

onMounted(async () => {
  await fetchTheaterScreenings();
  if (theaterId) {
    renderTimeLineEvents();
  }
});

const fetchTheaterScreenings = async () => {
  try {
    for (let i = 1; i <= 3; i++) {
      let reasult = await axios.get("/screenings?theaterId=" + i);
      const newEvents = [];
      for (let s of reasult.data.screenings) {
        const startTime = s.date + "T" + s.start_time;
        const event = {
          title: s.Movie.title,
          start: startTime,
          end: CalculateEndDateTime(startTime, s.duration),
          backgroundColor: "#409EFF",
        };
        newEvents.push(event);
      }
      theaterEvents.value.push({
        theaterId: i,
        events: newEvents,
      });
    }
    console.log(theaterEvents.value);
  } catch (error) {
    console.log(error);
    message.error("获取放映厅排片失败");
  }
};

const renderTimeLineEvents = () => {
  console.log("选择放映厅" + theaterId.value);
  events.value = theaterEvents.value.find(
    (e) => e.theaterId === theaterId.value
  ).events;
  //console.log(events.value);
};
</script>

<style lang="scss" scoped>
.calender-container {
  width: auto;
  display: flex;
  flex-flow: column wrap;
  align-items: center;
  gap: 30px;
}
</style>
