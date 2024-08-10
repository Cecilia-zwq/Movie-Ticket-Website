<template>
  <div class="page-container">
    <div class="movies-container">
      <div class="search-field">
        <!-- 模糊搜索 -->
        <el-input
          class="input-field"
          placeholder="请输入电影名或类型名"
          :prefix-icon="Search"
          v-model="searchKeyword"
          @keyup.enter="searchMovies"
        />
        <el-button
          v-if="userStore.is_admin"
          :icon="CirclePlusFilled"
          circle
          @click="createMovie"
          class="create-option"
        />
        <el-button
          v-if="false"
          :icon="DeleteFilled"
          circle
          @click="deleteMovie"
          class="create-option"
        />
        <!-- 排序选择 -->
        <n-dropdown trigger="click" :options="options" @select="sortMovies">
          <n-button class="sort-option">排序方式</n-button>
        </n-dropdown>
      </div>
      <div class="list-field">
        <!-- 显示电影信息，例如电影名称、导演等 -->
        <li v-for="movie in movies" :key="movie.id" class="movie-item">
          <div class="movie-poster">
            <img :src="movie.url" alt="Movie Poster" />
          </div>
          <!-- 电影信息 -->
          <div class="movie-info">
            <div class="movie-title">{{ movie.title }}</div>
            <div class="movie-details">
              <span>{{ movie.genre }}</span>
            </div>
            <div class="movie-details">
              <span>{{ movie.release_date }}/</span>
              <span>{{ movie.duration }}分钟</span>
            </div>
            <div class="movie-rating">
              <n-rate
                allow-half
                readonly
                :default-value="movie.average_rating / 2"
              />
              {{ movie.average_rating }}分
            </div>
            <!-- 第三行：场次按钮 -->
            <div class="my-button">
              <el-button
                class="screening-button"
                @click="showScreening(movie.id)"
                >查看场次</el-button
              >
              <el-button
                v-if="userStore.is_admin"
                class="movie-button"
                @click="alterMovie(movie.id)"
                >修改电影信息</el-button
              >
              <!-- <div class="rate-block" v-if="!userStore.is_admin">
                <el-space direction="vertical">
                  <el-row>
                    <el-text>评价&nbsp;</el-text>
                    <el-rate @change="dialogVisible = true" />
                  </el-row>
                </el-space>
              </div> -->
              <el-dialog v-model="dialogVisible" title="Shipping address">
              </el-dialog>
            </div>
          </div>
        </li>
      </div>
      <div class="pagination-field">
        <!-- 分页 -->
        <n-pagination
          class="pagination-container"
          v-model:page="pagination.currentPage"
          :page-size="pagination.pageSize"
          :page-count="pagination.total"
          :on-update:page="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, inject, onMounted } from "vue";
import { UserStore } from "../stores/UserStore";

import {
  Search,
  DeleteFilled,
  CirclePlusFilled,
} from "@element-plus/icons-vue";

import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();

const axios = inject("axios");
const userStore = UserStore();
const message = inject("message");

const score = ref([]); //电影评分
const dialogVisible = ref(false);

// 定义电影列表和分页信息
const movies = ref([]); // 电影列表
const pagination = ref({
  // 分页
  currentPage: 1,
  pageSize: 3,
  total: 0,
});
const searchKeyword = ref(""); // 搜索关键词
var sortKeyword = ""; //排序关键词

// 获取电影列表的方法
const fetchMovies = async () => {
  try {
    const response = await axios.get(
      `/movies?currentPage=${pagination.currentPage}&search=${searchKeyword.value}&sort=${sortKeyword}`
    );
    movies.value = response.data.movies;
    pagination.value = response.data.pagination;
  } catch (error) {
    message.error("获取电影列表失败");
  }
};

onMounted(() => {
  fetchMovies();
});

// 处理搜索信息

const searchMovies = () => {
  console.log("searchMovies called with searchKeyword:", searchKeyword);
  fetchMovies();
};

// 处理排序方式

const options = [
  {
    label: "电影名",
    key: "title",
  },
  {
    label: "上映时间",
    key: "release_date",
  },
  {
    label: "评分",
    key: "average_rating",
  },
];

const sortMovies = (key) => {
  sortKeyword = key;
  console.log(sortKeyword);
  fetchMovies();
};

// 处理分页变化
const handlePageChange = (page) => {
  pagination.currentPage = page; // 更新当前页码
  fetchMovies(); // 获取电影列表
};

// 查看场次
const showScreening = (id) => {
  router.push("/movies/" + id);
};

// 编辑电影
const alterMovie = (id) => {
  router.push("/movies/alter/" + id);
};

// 添加新电影
const createMovie = () => {
  router.push("/movies/create");
};

// 删除电影
const deleteMovie = () => {};

// 评分评价
const handleRate = () => {};
</script>

<style lang="scss" scoped>
//页面
.movies-container {
  width: 1200px;
  display: flex;
  flex-flow: column wrap;
  gap: 20px;
  line-height: 2;
}
//表头
.search-field {
  display: flex;
  align-items: center;
}
.sort-option {
  margin-right: 0;
  margin-left: auto;
}
.input-field {
  width: 200px;
  margin-right: 10px;
}
// 电影列表

.movie-item {
  display: flex;
  gap: 15px;
}
.movie-info {
  display: flex;
  flex-flow: column wrap;
  margin-top: 5px;
}
img {
  max-width: 150px;
  height: auto;
}
.movie-rating {
  margin-top: 5px;
}
.my-button {
  display: flex;
  margin-top: auto;
  margin-bottom: 20px;
  gap: 10px;
}
</style>
