<template>
  <div class="page-container">
    <div class="container">
      <div class="left">
        <div>
          <h1 v-if="action === 'create'">创建排片</h1>
          <h1 v-if="action === 'alter'">修改排片</h1>
        </div>
        <Form
          :formModel="screening"
          :formFields="fields"
          :selectOptions="options"
          :disabledDate="disabledDate"
          @formChange="handleFormChange"
        />
        <el-form label-width="120px">
          <el-form-item>
            <el-button
              v-if="action === 'create'"
              type="primary"
              @click="createScreening"
              >创建</el-button
            >
            <el-button
              v-if="action === 'alter'"
              type="primary"
              @click="alterScreening"
              >修改</el-button
            >
            <el-button @click="cancel">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="right">
        <time-line :screeningEvents="events"></time-line>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, inject, onMounted, handleError } from "vue";
import { UserStore } from "../stores/UserStore";
import {
  TimestampToDate,
  TimestampToTime,
  screeningFields,
  CalculateEndDateTime,
  isEventOverlapping,
} from "../utils/utils";
import { ElMessage, ElMessageBox } from "element-plus";

import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();

const axios = inject("axios");
const userStore = UserStore();
const message = inject("message");

const action = route.path.split("/")[2];

const fields = screeningFields;
const options = {
  theaterId: [
    { value: 1, label: "1号厅" },
    { value: 2, label: "2号厅" },
    { value: 3, label: "3号厅" },
  ],
};

const events = ref([]);
const theaterEvents = ref([]);
const previewEnvent = ref();
const previousPreviewEvent = ref();

const screening = reactive({
  movieId: route.query.movieId,
  movieTitle: "",
  theaterId: "",
  date: "",
  start_time: "",
  duration: "",
  language: "",
  version: "",
  seatLayout: "",
  price: "",
});

const movie = reactive({
  title: "",
  genre: "",
  release_date: "",
  duration: "",
  average_rating: "",
  director: "",
  cast: "",
  synopsis: "",
  url: "",
});

onMounted(async () => {
  await fetchMovie();
  await fetchScreening();
  await fetchTheaterScreenings();
  if (screening.theaterId) {
    await renderTimeLineEvents();
    fetchEdittingEvent();
  }
});

const fetchMovie = async () => {
  try {
    if (route.query.movieId) {
      const response = await axios.get(`/movies/${route.query.movieId}`);
      movie.title = response.data.movie.title;
      movie.genre = response.data.movie.genre;
      movie.release_date = response.data.movie.release_date;
      movie.duration = response.data.movie.duration;
      movie.average_rating = response.data.movie.average_rating;
      movie.director = response.data.movie.director;
      movie.cast = response.data.movie.cast;
      movie.synopsis = response.data.movie.synopsis;
      //console.log(movie);
      screening.movieTitle = movie.title;
      screening.duration = movie.duration;
    }
  } catch (error) {
    message.error("获取电影信息失败");
  }
};

const fetchScreening = async () => {
  try {
    if (route.query.screeningId) {
      const response = await axios.get(
        `/screenings/${route.query.screeningId}`
      );
      screening.movieTitle = movie.title;
      screening.theaterId = response.data.screening.theaterId;
      screening.date = response.data.screening.date;
      screening.start_time = response.data.screening.start_time;
      screening.duration = movie.duration;
      screening.language = response.data.screening.language;
      screening.version = response.data.screening.version;
      screening.price = response.data.screening.price;
      //console.log(screening);
    }
  } catch (error) {
    message.error("获取排片信息失败");
  }
};

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
    //console.log(theaterEvents.value);
  } catch (error) {
    console.log(error);
    message.error("获取放映厅排片失败");
  }
};

const fetchEdittingEvent = () => {
  if (action === "alter") {
    const edittingIndex = events.value.findIndex((e) => {
      return (
        e.title === screening.movieTitle &&
        e.start ===
          `${TimestampToDate(screening.date)}T${screening.start_time}` &&
        e.end ===
          CalculateEndDateTime(
            `${TimestampToDate(screening.date)}T${screening.start_time}`,
            screening.duration
          )
      );
    });
    if (edittingIndex !== -1) {
      events.value[edittingIndex].backgroundColor = "#E6A23C";
      console.log("找到正在编辑的场次条目");
    }
  }
};

const handleFormChange = (fieldName, fieldValue) => {
  console.log(fieldName, screening[fieldName]);
  if (fieldName === "theaterId") {
    renderTimeLineEvents();
  }
  updatePreview();
};

const renderTimeLineEvents = (fieldName, fieldValue) => {
  console.log("选择放映厅" + screening.theaterId);
  events.value = theaterEvents.value.find(
    (e) => e.theaterId === screening.theaterId
  ).events;
  //console.log(events.value);
};

const updatePreview = () => {
  if (screening.date && screening.start_time && screening.duration) {
    // 先删除旧的编辑事件（如果存在）
    const oldPreviewIndex = events.value.findLastIndex(
      (event) => event.backgroundColor === "#E6A23C"
    );
    if (oldPreviewIndex !== -1) {
      previousPreviewEvent.value = events.value[oldPreviewIndex];
      events.value.splice(oldPreviewIndex, 1);
      console.log("取消该编辑");
    }
    previewEnvent.value = {
      title: screening.movieTitle,
      start: `${TimestampToDate(screening.date)}T${screening.start_time}`,
      end: CalculateEndDateTime(
        `${TimestampToDate(screening.date)}T${screening.start_time}`,
        screening.duration
      ),
      overlap: false,
      backgroundColor: "#E6A23C",
    };
    // 创建一个用于存储冲突事件的数组
    var hasConflict = false;
    for (const e of events.value) {
      if (isEventOverlapping(e, previewEnvent.value)) {
        message.error("时间冲突");
        //console.log("冲突");
        hasConflict = true;
        break; // 如果与任何一个事件有重叠，返回
      }
    }
    if (hasConflict) {
      if (previousPreviewEvent.value) {
        events.value.push(previousPreviewEvent.value);
        screening.start_time = TimestampToTime(
          previousPreviewEvent.value.start
        );
        return;
      } else {
        screening.start_time = "";
        return;
      }
    }
    events.value.push(previewEnvent.value);
    console.log("新增编辑预览");
  } else {
    // 如果日期、时间、时长不完整，则从 events 数组中删除预览事件
    const indexToRemove = events.value.findLastIndex(
      (event) => event.backgroundColor === "#E6A23C"
    );
    if (indexToRemove !== -1) {
      events.value.splice(indexToRemove, 1);
      console.log("取消该编辑");
    }
  }
};

const createScreening = () => {
  if (!validate()) {
    return;
  }
  ElMessageBox.confirm("确定创建新条目", "确认", {
    cancelButtonText: "取消",
    confirmButtonText: "确认",
  })
    .then(async () => {
      try {
        //console.log(TimestampToDate(screening.date));
        //console.log(screening.start_time);
        //console.log(screening);
        let reasult = await axios.post("/screenings", {
          movieId: screening.movieId,
          theaterId: screening.theaterId,
          date: TimestampToDate(screening.date),
          start_time: screening.start_time,
          duration: screening.duration,
          language: screening.language,
          version: screening.version,
          price: screening.price,
        });
        if (reasult.status === 200) {
          console.log(reasult.data);
          message.info("创建成功");
          router.push("/movies/" + screening.movieId);
        }
      } catch (error) {
        if (error.response) {
          message.error(error.response.data.msg);
        }
      }
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消新建",
      });
    });
};

const alterScreening = async () => {
  if (!validate()) {
    return;
  }
  ElMessageBox.confirm("确定修改条目", "确认", {
    cancelButtonText: "取消",
    confirmButtonText: "确认",
  })
    .then(async () => {
      console.log(route.query.screeningId);
      try {
        const reasult = await axios.put(
          `/screenings/${route.query.screeningId}`,
          {
            movieId: screening.movieId,
            theaterId: screening.theaterId,
            date: TimestampToDate(screening.date),
            start_time: screening.start_time,
            duration: screening.duration,
            language: screening.language,
            version: screening.version,
            price: screening.price,
          }
        );
        if (reasult.status === 200) {
          console.log(reasult.data);
          message.info("修改成功");
          router.push("/movies/" + screening.movieId);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          message.error(error.response.data.msg);
        }
        console.log(error);
      }
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消修改",
      });
    });
};

function validate() {
  if (
    !screening.theaterId ||
    !screening.date ||
    !screening.start_time ||
    !screening.duration ||
    !screening.language ||
    !screening.version ||
    !screening.price
  ) {
    message.error("不能有空");
    return false;
  }
  return true;
}

const cancel = () => {
  router.push("/movies/" + screening.movieId);
};

// 只能选择今天之后日期
const disabledDate = (time) => {
  return time.getTime() < Date.now() - 8.64e7;
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  gap: 40px;
  width: 1200px;
}
.left {
  display: flex;
  flex-flow: column wrap;
  align-items: center;
  width: 800px;
}

.right {
  display: flex;
  flex-flow: column wrap;
  align-items: center;
}
</style>
