<template>
  <div class="page-container">
    <div class="screening-container">
      <!--显示电影详细信息-->
      <div class="movie">
        <!--电影标题-->
        <h1 class="movie-title">{{ movie.title }}</h1>
        <!--电影海报-->
        <div class="movie-info">
          <div class="movie-poster">
            <img :src="movie.url" alt="电影海报" />
          </div>
          <!--电影信息-->
          <div class="movie-details">
            <div class="movie-items">
              类型：{{ movie.genre }} <br />
              上映日期：{{ movie.release_date }} <br />
              片长：{{ movie.duration }}分钟 <br />
              导演：{{ movie.director }} <br />
              主演：{{ movie.cast }} <br />
            </div>
            <div class="movie-rating">
              <el-rate v-model="rating" disabled text-color="#ff9900" />
              {{ movie.average_rating }}分
            </div>
          </div>
        </div>
        <!--电影简介-->
        <div class="synopsis">
          <h2>简介</h2>
          <p>&emsp;{{ movie.synopsis }}</p>
        </div>
      </div>
      <!--显示排片信息-->
      <div class="screening">
        <!--日期选择-->
        <div class="option-field">
          <el-date-picker
            v-model="screeningDate"
            type="date"
            :disabledDate="disabledDate"
            @change="fetchScreenings"
          >
          </el-date-picker>
          <el-button @click="fetchAll">查看全部</el-button>
          <!--排片编辑-->
          <el-button-group v-if="userStore.is_admin" class="edit-option">
            <el-button
              type="primary"
              :icon="CirclePlus"
              circle
              @click="createScreening"
            />
            <el-button
              type="danger"
              :icon="Delete"
              circle
              @click="deleteScreening"
            />
          </el-button-group>
        </div>
        <!--排片表格-->
        <el-table
          :data="resultScreenings"
          @selection-change="handleSelectionChange"
          border
        >
          <el-table-column
            type="selection"
            width="50"
            v-if="userStore.is_admin"
          />
          <el-table-column sortable prop="date" label="放映日期" width="120" />
          <el-table-column
            sortable
            prop="start_time"
            label="放映时间"
            width="120"
          />
          <el-table-column prop="language" label="语言" width="60" />
          <el-table-column prop="version" label="版本" width="60" />
          <el-table-column prop="theaterId" label="放映厅" width="70" />
          <el-table-column sortable prop="price" label="价格" width="80" />
          <el-table-column v-if="!userStore.is_admin" label="选座订票">
            <template #default="scope">
              <el-button type="primary" round @click="bookSeat(scope.row)"
                >选座订票</el-button
              >
            </template>
          </el-table-column>
          <el-table-column v-if="userStore.is_admin">
            <template #default="scope">
              <el-button
                type="primary"
                :icon="Edit"
                circle
                @click="alterScreening(scope.row)"
              />
              <el-button
                type="primary"
                :icon="ZoomIn"
                circle
                @click="bookSeat(scope.row)"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, inject, onMounted } from "vue";
import { UserStore } from "../stores/UserStore";
import { TimestampToDate } from "../utils/utils";
import { ElMessage, ElMessageBox } from "element-plus";

import { Delete, Edit, CirclePlus, ZoomIn } from "@element-plus/icons-vue";

import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();

const axios = inject("axios");
const userStore = UserStore();
const message = inject("message");

const screeningSelections = ref([]);

const handleSelectionChange = (val) => {
  screeningSelections.value = val;
};

// 获取id下电影信息及排片
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
var rating = ref(3.5);
const screenings = ref([]); // 排片
const screeningDate = ref(Date.now()); // 排片日期
const resultScreenings = ref([]); // 筛选日期后的排片

const fetchMovie = async () => {
  try {
    const route = useRoute();
    const response = await axios.get(`/movies/${route.params.id}`);
    movie.value = response.data.movie;
    rating = parseFloat(movie.value.average_rating) / 2;
    screenings.value = response.data.movie.Screenings;
    screenings.value.forEach((s) => {
      const screeningDateTimeStr = `${s.date}T${s.start_time}`;
      s.screeningDateTime = new Date(screeningDateTimeStr);
      console.log(s.screeningDateTime);
    });
    screenings.value.sort((a, b) => a.screeningDateTime - b.screeningDateTime);
    console.log(screenings.value);
  } catch (error) {
    message.error("获取电影信息失败");
  }
};

// 只能选择7天内日期
const disabledDate = (time) => {
  if (!userStore.is_admin) {
    return (
      time.getTime() < Date.now() - 8.64e7 ||
      time.getTime() > Date.now() + 7 * 24 * 3600 * 1000
    );
  }
};

// 通过日期获取排片
const fetchScreenings = () => {
  const date = TimestampToDate(screeningDate.value);
  //console.log(date);
  const now = new Date();
  resultScreenings.value = screenings.value.filter((s) => {
    const screeningDateTimeStr = `${s.date}T${s.start_time}`;
    const screeningDateTime = new Date(screeningDateTimeStr);
    //console.log(screeningDateTime);
    return date.trim() === s.date.trim();
  });
  //console.log(resultScreenings);
};

const fetchAll = () => {
  if (userStore.is_admin) {
    resultScreenings.value = screenings.value;
  } else {
    // 取出screenings.value中date日期在今天及今天以后，如果date是今日，则要求放映时间start_time在现在的时间之后
    const now = new Date();
    resultScreenings.value = screenings.value.filter((s) => {
      const screeningDateTimeStr = `${s.date}T${s.start_time}`;
      s.screeningDateTime = new Date(screeningDateTimeStr);
      if (s.screeningDateTime > now) {
        return true;
      }
      return false;
    });
    resultScreenings.value.sort(
      (a, b) => a.screeningDateTime - b.screeningDateTime
    );
    console.log(resultScreenings);
  }
};

onMounted(async () => {
  await fetchMovie();
  fetchAll();
});

//　修改排片判断
const alterValidate = (s) => {
  const isBookedSeat = s.seatLayout.seats.some(
    (seat) => seat.status === "booked"
  );
  if (isBookedSeat) {
    message.error("不可修改已有订单的排片场次");
    return false;
  } else {
    return true;
  }
};

// 删除所选排片
const deleteScreening = async () => {
  for (let s of screeningSelections.value) {
    if (!alterValidate(s)) {
      return;
    }
  }
  ElMessageBox.confirm("确定删除条目", "确认", {
    cancelButtonText: "取消",
    confirmButtonText: "确认",
  })
    .then(async () => {
      try {
        for (let s of screeningSelections.value) {
          console.log(s.id);
          let res = await axios.delete(`/screenings/${s.id}`);
          console.log(res);
        }
        message.info("删除成功");
        window.location.reload();
      } catch (error) {
        message.error(error.response.data.msg);
      }
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消删除",
      });
    });
};

// 订票链接跳转
const bookSeat = (row) => {
  console.log(row);
  router.push("/seats?screeningId=" + row.id);
  // router.push("/login");
};

// 新增排片跳转
const createScreening = () => {
  router.push("/screenings/create?movieId=" + route.params.id);
};

// 修改排片跳转
const alterScreening = (row) => {
  console.log(row);
  if (!alterValidate(row)) {
    return;
  }
  router.push(
    "/screenings/alter?screeningId=" + row.id + "&movieId=" + row.movieId
  );
};
</script>

<style lang="scss" scoped>
//页面布局

.screening-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(600px, 1fr));
  padding: 20px;
}

//电影信息布局
.movie {
  display: flex;
  flex-flow: column wrap;
}
.movie-info {
  display: flex;
  gap: 20px;
}
img {
  max-width: 200px;
}

//排片信息布局
.screening {
  display: flex;
  flex-flow: column wrap;
  gap: 20px;
}
.option-field {
  display: flex;
  gap: 20px;
}
.edit-option {
  margin-right: 0;
  margin-left: auto;
}
</style>
