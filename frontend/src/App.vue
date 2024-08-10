<template>
  <div>
    <Menu
      :token="userStore.token"
      :isAdmin="userStore.is_admin"
      @select="handleMenuSelect"
      class="my-menu"
    />
    <router-view></router-view>
  </div>
</template>

<script setup>
import { ref, reactive, inject, onMounted, watch } from "vue";
import { UserStore } from "./stores/UserStore";

import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();

const axios = inject("axios");
const message = inject("message");

const userStore = UserStore();
function restoreUserFromCookie() {
  const userDataCookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("userData="));
  if (userDataCookie) {
    const userData = JSON.parse(userDataCookie.split("=")[1]);
    userStore.id = userData.id;
    userStore.user_name = userData.user_name;
    userStore.is_admin = userData.is_admin;
    userStore.full_name = userData.full_name;
    userStore.phone_no = userData.phone_no;
    userStore.token = userData.token;
  }
}

const handleMenuSelect = (index) => {
  console.log(index);
  switch (index) {
    case "0":
      console.log("首页");
      router.push("/movies");
      break;
    case "1":
      console.log("电影");
      router.push("/movies");
      break;
    case "2-1":
      console.log("登录");
      router.push("/login");
      break;
    case "2-2":
      console.log("注册");
      router.push("/signup");
      break;
    case "2-3":
      console.log("个人信息");
      router.push("/profile");
      break;
    case "2-4":
      console.log("注销");
      userStore.clearUserInfo();
      router.push("/movies");
      break;
    case "3":
      router.push("/calender");
      break;
    case "4":
      router.push("/statistic");
      break;
  }
};

onMounted(async () => {
  restoreUserFromCookie();
});
</script>

<style scoped></style>
