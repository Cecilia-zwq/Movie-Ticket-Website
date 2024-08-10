<template>
  <div class="page-container">
    <el-card class="box-card">
      <template #header>
        <div v-if="action === 'create'" class="card-header">创建电影条目</div>
        <div v-if="action === 'alter'" class="card-header">修改电影条目</div>
      </template>
      <Form :formModel="movie" :formFields="fields" />
      <el-form label-width="70px">
        <el-form-item label="">
          <el-upload
            ref="upload"
            action="http://localhost:3000/api/poster"
            :auto-upload="false"
            :data="uploadData"
          >
            <template #trigger>
              <el-button type="primary">选择海报</el-button>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button
            v-if="action === 'create'"
            type="primary"
            @click="createMovie"
            >创建</el-button
          >
          <el-button
            v-if="action === 'alter'"
            type="primary"
            @click="alterMovie"
            >修改</el-button
          >
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, inject, onMounted } from "vue";
import { UserStore } from "../stores/UserStore";
import { TimestampToDate, movieFields } from "../utils/utils";
import { ElMessage, ElMessageBox } from "element-plus";

import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();

const axios = inject("axios");
const userStore = UserStore();
const message = inject("message");

const action = route.path.split("/")[2];

const upload = ref(null);

const uploadData = ref({
  fileName: "",
});

const fields = movieFields;

const movie = reactive({
  title: "",
  genre: "",
  release_date: "",
  duration: "",
  average_rating: "",
  director: "",
  cast: "",
  synopsis: "",
});

onMounted(() => {
  if (action === "alter") {
    fetchMovie();
  }
});

const fetchMovie = async () => {
  try {
    const route = useRoute();
    const response = await axios.get(`/movies/${route.params.id}`);
    movie.title = response.data.movie.title;
    movie.genre = response.data.movie.genre;
    movie.release_date = response.data.movie.release_date;
    movie.duration = response.data.movie.duration;
    movie.average_rating = response.data.movie.average_rating;
    movie.director = response.data.movie.director;
    movie.cast = response.data.movie.cast;
    movie.synopsis = response.data.movie.synopsis;
    console.log(movie);
  } catch (error) {
    message.error("获取电影信息失败");
  }
};

const createMovie = async () => {
  if (!validate()) {
    return;
  }
  ElMessageBox.confirm("确定创建新条目", "确认", {
    cancelButtonText: "取消",
    confirmButtonText: "确认",
  })
    .then(async () => {
      try {
        if (validate()) {
          let reasult = await axios.post("/movies", {
            title: movie.title,
            genre: movie.genre,
            release_date: TimestampToDate(movie.release_date),
            duration: movie.duration,
            average_rating: movie.average_rating,
            director: movie.director,
            cast: movie.cast,
            synopsis: movie.synopsis,
          });
          if (reasult.status === 200) {
            console.log(reasult.data);
            message.info("创建成功");
            // fileName.value = reasult.data.movie.id + ".png";
            // reasult = upload.value?.submit();
            uploadData.value.fileName = reasult.data.movie.id + ".png";
            upload.value?.submit();
            console.log(reasult);
            router.push("/movies");
          }
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
        message: "取消新建",
      });
    });
};

const alterMovie = async () => {
  if (!validate()) {
    return;
  }
  ElMessageBox.confirm("确定修改条目", "确认", {
    cancelButtonText: "取消",
    confirmButtonText: "确认",
  })
    .then(async () => {
      try {
        // console.log("test:press bottom alter");
        // uploadData.value.fileName = "test.png";
        // console.log(upload.value);
        // reasult = upload.value?.submit();
        if (validate()) {
          console.log(movie);
          let reasult = await axios.put(`/movies/${route.params.id}`, {
            title: movie.title,
            genre: movie.genre,
            release_date: TimestampToDate(movie.release_date),
            duration: movie.duration,
            average_rating: movie.average_rating,
            director: movie.director,
            cast: movie.cast,
            synopsis: movie.synopsis,
          });
          if (reasult.status === 200) {
            console.log(reasult.data);
            message.info("修改成功");
            uploadData.value.fileName = reasult.data.movie.id + ".png";
            console.log(upload);
            reasult = upload.value?.submit();
            router.push("/movies");
          }
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
        message: "取消修改",
      });
    });
};

const cancel = () => {
  router.push("/movies");
};

function validate() {
  if (
    !movie.title ||
    !movie.genre ||
    !movie.director ||
    !movie.cast ||
    !movie.synopsis
  ) {
    message.error("不能有空");
    return false;
  }
  return true;
}
</script>

<style lang="scss" scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 20px;
}
.box-card {
  width: 1200px;
  display: flex;
  flex-flow: column wrap;
}
</style>
