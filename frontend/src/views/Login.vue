<template>
  <div class="login-panel">
    <n-card title="登录">
      <n-form :model="user" :rules="rules">
        <n-form-item label="用户名" path="username">
          <n-input v-model:value="user.username" placeholder="请输入用户名" />
        </n-form-item>
        <n-form-item label="密码" path="password">
          <n-input
            v-model:value="user.password"
            placeholder="请输入密码"
            type="password"
            show-password-on="mousedown"
          />
        </n-form-item>
      </n-form>
      <template #footer>
        <n-button @click="login">登录</n-button>
        <n-button @click="signup">注册</n-button>
      </template>
    </n-card>
  </div>
</template>

<script setup>
import { ref, reactive, inject } from "vue";
import { UserStore } from "../stores/UserStore";

import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();

const axios = inject("axios");
const userStore = UserStore();
const message = inject("message");

let rules = {
  username: [{ required: true, trigger: "blur", message: "请输入用户名" }],
  password: [{ required: true, trigger: "blur", message: "请输入密码" }],
};

const user = reactive({
  username: "",
  password: "",
  rember: false,
});

const login = async () => {
  try {
    let result = await axios.post("/users/login", {
      user_name: user.username,
      password: user.password,
    });
    console.log(result);
    if (result.status === 200) {
      userStore.id = result.data.user.id;
      userStore.user_name = result.data.user.user_name;
      userStore.is_admin = result.data.user.is_admin;
      userStore.full_name = result.data.user.full_name;
      userStore.phone_no = result.data.user.phone_no;
      userStore.token = result.data.token;
      console.log(userStore);

      // 存储用户信息到 Cookie
      const userData = {
        id: userStore.id,
        user_name: userStore.user_name,
        is_admin: userStore.is_admin,
        full_name: userStore.full_name,
        phone_no: userStore.phone_no,
        token: userStore.token,
      };
      const expires = 1; // 设置 Cookie 过期时间
      const date = new Date();
      date.setTime(date.getTime() + expires * 24 * 60 * 60 * 1000);
      const expiresString = `expires=${date.toUTCString()}`;
      document.cookie = `userData=${JSON.stringify(
        userData
      )}; ${expiresString}; path=/`;
      console.log(userStore);

      message.info("登录成功");
      if (route.query.previousRoute) {
        router.push(route.query.previousRoute);
      } else {
        router.push("/movies");
      }
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      message.error(error.response.data.msg);
    }
  }
};

const signup = () => {
  router.push("/signup");
};
</script>

<style lang="scss" scoped>
.login-panel {
  width: 500px;
  margin: 0 auto;
  margin-top: 130px;
}
</style>
