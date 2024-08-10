<template>
  <div class="page-container">
    <div class="seat-container">
      <div class="left">
        <div class="seat-example">
          <span> <seat-item status="available"></seat-item>可选座位 </span>
          <span> <seat-item status="booked"></seat-item>已售座位 </span>
          <span> <seat-item status="selected"></seat-item>已选座位 </span>
        </div>
        <div class="seats-layout">
          <div class="rows" v-for="(row, rowIndex) in seats" :key="rowIndex">
            <span class="cols" v-for="(item, colIndex) in row" :key="colIndex">
              <seat-item
                :row="item.row"
                :col="item.col"
                :status="item.status"
                @toggle="selectSeats"
              ></seat-item>
            </span>
            {{ rowIndex + 1 }}
          </div>
        </div>
        <div class="confirm-info">
          <el-button v-if="!userStore.token" type="danger" @click="login"
            >登录</el-button
          >
          <el-button
            v-else-if="selectedSeats.length && !userStore.is_admin"
            type="danger"
            @click="book"
            >确认选座</el-button
          >
        </div>
      </div>
      <div class="right">
        <el-card class="stub">
          <div class="poster">
            <img :src="movie.url" alt="电影海报" />
          </div>
          <div class="movie-info" v-if="movie">
            <div class="dashed-line1"></div>
            <div class="content">
              <div class="movie-title">
                <b>{{ movie.title }}</b
                ><br />
              </div>
              <span class="value-text"
                >{{ movie.genre }}&#x0009;&#x0009;{{ movie.duration }}分钟</span
              >
            </div>
          </div>
          <div class="dashed-line2"></div>
          <div class="screening-info" v-if="screening">
            <span>影厅：</span
            ><span class="value-text">{{
              screening.seatLayout.theaterName
            }}</span>
            <br />
            <span>版本语言：</span
            ><span class="value-text"
              >{{ screening.language }}{{ screening.version }}</span
            >
            <br />
            <span>时间：</span
            ><span class="value-text"
              >{{ screening.date }}&nbsp;&nbsp;{{ screening.start_time }}</span
            >
            <br />
            <span>票价：</span
            ><span class="value-text">&#65509;{{ screening.price }}/张</span>
          </div>
          <div class="booking-info">
            <div v-if="selectedSeats.length === 0" class="no-selected">
              请在座位图上选座
            </div>
            <div v-else class="has-selected">
              选座：
              <span v-for="item in selectedSeats" class="booking"
                >{{ item.row }}排{{ item.col }}座</span
              >
            </div>
            <div class="total-price">
              <span>总价：</span
              ><span class="value-text">&#65509;{{ totalCost }}</span>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, inject, onMounted, watch } from "vue";
import { UserStore } from "../stores/UserStore";
import { ElMessage, ElMessageBox } from "element-plus";

import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();

const axios = inject("axios");
const userStore = UserStore();
const message = inject("message");

const screening = ref();
const movie = ref({
  title: 0,
  genre: "",
  release_date: "",
  duration: 0,
  average_rating: 0.0,
  director: "",
  cast: "",
  synopsis: "",
  url: "",
});
const seatLayout = ref();
const seats = ref();
const selectedSeats = ref([]);
const totalCost = ref(0.0);

const newBooking = ref({
  userId: 0,
  screeningId: 0,
  seats: [],
});

onMounted(async () => {
  await fetchSeatLayout(); // 等待 fetchSeatLayout 完成
  await fetchMovie(); // 调用 fetchMovie
  console.log(movie.url);
});

const fetchSeatLayout = async () => {
  try {
    var response = await axios.get(`screenings/${route.query.screeningId}`);
    screening.value = response.data.screening;
    seatLayout.value = screening.value.seatLayout;
    //console.log(seatLayout.value);
    seats.value = convertArray(
      seatLayout.value.seats,
      seatLayout.value.rows,
      seatLayout.value.columns
    );
    console.log(seats.value);
    console.log(screening.value);
    console.log(screening.value.movieId);
  } catch (error) {
    message.error("获取座位信息失败");
  }
};

const fetchMovie = async () => {
  try {
    console.log(screening.value.movieId);
    var response = await axios.get(`/movies/${screening.value.movieId}`);
    movie.value = response.data.movie;
    console.log(movie.value);
  } catch (error) {
    message.error("获取电影信息失败");
  }
};

const selectSeats = (row, col) => {
  console.log("selectSeats called");
  console.log(row, col);
  console.log(seats.value[row - 1][col - 1]);
  if (seats.value[row - 1][col - 1].status === "selected") {
    seats.value[row - 1][col - 1].status = "available";
    for (let i = 0; i < selectedSeats.value.length; i++) {
      if (
        selectedSeats.value[i].col === col &&
        selectedSeats.value[i].row === row
      ) {
        selectedSeats.value.splice(i, 1);
        break;
      }
    }
    message.info("取消" + row + "排" + col + "座");
    totalCost.value = totalCost.value - parseFloat(screening.value.price);
  } else if (seats.value[row - 1][col - 1].status === "available") {
    if (selectedSeats.value.length >= 6) {
      message.warning("最多只能选座6个座位");
    } else {
      seats.value[row - 1][col - 1].status = "selected";
      selectedSeats.value.push({ row: row, col: col });
      message.info("选择" + row + "排" + col + "座");
      totalCost.value = totalCost.value + parseFloat(screening.value.price);
    }
  }
};

const login = () => {
  console.log("登录");
  router.push({
    path: "/login",
    query: { previousRoute: router.currentRoute.value.fullPath },
  });
};

const book = () => {
  console.log("订座");
  newBooking.value.userId = userStore.id;
  newBooking.value.screeningId = screening.value.id;
  newBooking.value.seats = selectedSeats.value;
  console.log(newBooking.value);
  ElMessageBox.confirm("确定选座", "确认", {
    cancelButtonText: "取消",
    confirmButtonText: "确认",
  })
    .then(async () => {
      try {
        let result = await axios.post("/bookings", {
          userId: userStore.id,
          screeningId: screening.value.id,
          seats: selectedSeats.value,
        });
        if (result.status === 200) {
          console.log(result.data.booking);
          message.info(result.data.msg);
          // 跳转到个人订单界面
          router.push("/profile");
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          message.error(error.response.data.msg);
        }
      }
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消订座",
      });
    });
};

function convertArray(arr, rows, columns) {
  return arr.reduce(function (result, item, index) {
    var rowIndex = Math.floor(index / columns);
    var colIndex = index % columns;
    if (!result[rowIndex]) {
      result[rowIndex] = [];
    }
    result[rowIndex][colIndex] = item;
    return result;
  }, []);
}
</script>
<style lang="scss" scoped>
// 页面
.seat-container {
  width: 1200px;
  border: 1px solid #dedfe0;
  border-radius: 10px;
  display: grid;
  grid-template-columns: 3fr 1fr;
  grid-gap: 20px;
  padding: 20px;
}

// 座位信息
.left {
  display: grid;
  justify-content: center;
  align-items: center;
  grid-template-rows: 1fr 8fr 1fr;
}
.seat-example {
  padding-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.seats-layout {
  justify-content: center;
  align-items: center;
}
.confirm-info {
  display: flex;
  justify-content: center;
  align-items: center;
}

//订单信息
.right {
  display: flex;
}
.stub {
  display: flex;
  flex-flow: column wrap;
  color: #3d2014;
  font-weight: 200;
  width: 250px;
}
.movie-title {
  font-size: 1.2em;
}
.value-text {
  color: black;
  font-weight: 500;
}
.movie-info {
  display: flex;
  flex-flow: column wrap;
}
img {
  width: 100%; /* 图片宽度占据整个容器宽度 */
  height: auto;
}

.dashed-line1 {
  border: 1.5px dashed #321c11;
  margin-top: 3px;
  margin-bottom: 3px;
}
.dashed-line2 {
  border: 1.15px dashed #3d2014;
  margin-top: 3px;
  margin-bottom: 3px;
}
.booking {
  background-color: #3d2014;
  color: white;
  padding-top: 2px;
  padding-bottom: 2px;
  padding-right: 4px;
  padding-left: 4px;
  border-radius: 2px;
  margin: 1px;
}
</style>
