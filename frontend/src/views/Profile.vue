<template>
  <div class="page-container">
    <div class="profile-container">
      <el-descriptions title="个人信息" direction="vertical" :column="3">
        <el-descriptions-item label="用户名">{{
          userStore.user_name
        }}</el-descriptions-item>
        <el-descriptions-item label="手机号"
          >{{ userStore.phone_no }} <el-button :icon="Edit" circle></el-button
        ></el-descriptions-item>
        <el-descriptions-item label="权限">
          <el-tag v-if="!userStore.is_admin">用户</el-tag>
          <el-tag v-if="userStore.is_admin">管理员</el-tag>
        </el-descriptions-item>
        <el-descriptions-item v-if="!userStore.is_admin" label="影票订单">
          <el-table :data="mergedData" border style="width: 100%">
            <el-table-column type="expand">
              <template #default="props"> </template>
            </el-table-column>
            <el-table-column prop="movieTitle" label="电影名" />
            <el-table-column prop="screeningDate" label="时间" />
            <el-table-column prop="theaterName" label="放映厅" />
            <el-table-column prop="seat" label="座位" />
            <el-table-column prop="status" label="状态" />
            <el-table-column label="">
              <template #default="scope">
                <el-button
                  :icon="Delete"
                  size="small"
                  @click="handleDelete(scope.row)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, inject, onMounted, handleError } from "vue";
import { UserStore } from "../stores/UserStore";
import { formatDateTime } from "../utils/utils";
import { Edit, Delete } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";

import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();

const axios = inject("axios");
const userStore = UserStore();
const message = inject("message");

const bookingData = ref([]);
const mergedData = ref([]);

onMounted(() => {
  fetchBookings();
});

const fetchBookings = async () => {
  try {
    const headers = {
      Authorization: `Bearer ${userStore.token}`,
    };
    const res = await axios.get("/users/profile/bookings", { headers });
    //console.log(res.data);
    for (let b of res.data.bookings) {
      console.log(b);
      //console.log(b);
      const createdAt = formatDateTime(b.createdAt);
      let found = false;
      for (let i = 0; i < mergedData.value.length; i++) {
        if (mergedData.value[i].bookingDate === createdAt) {
          // 如果有相同的createdAt，将座位信息添加到该订单中
          mergedData.value[i].seat.push(`${b.seatRow}排${b.seatColumn}座`);
          mergedData.value[i].id.push(b.id);
          found = true;
          break;
        }
      }
      let statusText = "";
      if (b.status === "booked") {
        statusText = "订单完成";
      } else if (b.status === "canceled") {
        statusText = "订单取消";
      }
      if (!found) {
        mergedData.value.push({
          id: [b.id],
          bookingDate: createdAt,
          movieTitle: b.Screening.Movie.title,
          theaterName: b.Screening.Theater.name,
          screeningDate: `${b.Screening.date} ${b.Screening.start_time}`,
          seat: [`${b.seatRow}排${b.seatColumn}座`],
          status: statusText,
        });
      }
    }
    console.log(mergedData.value);
  } catch (error) {
    message.error("验证失败，请重新登录");
    console.log(error);
  }
};

const handleDelete = async (row) => {
  ElMessageBox.confirm("确定修改条目", "确认", {
    cancelButtonText: "取消",
    confirmButtonText: "确认",
  })
    .then(async () => {
      try {
        const res = await axios.put("/bookings", row.id);
        console.log(res);
        window.location.reload();
        message.info("取消成功");
      } catch (error) {
        message.error(error.response.data.msg);
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
</script>

<style lang="scss" scoped>
.profile-container {
  width: 1200px;
}
</style>
