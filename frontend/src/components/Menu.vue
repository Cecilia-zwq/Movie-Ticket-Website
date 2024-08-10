<template>
  <el-menu
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    :ellipsis="false"
  >
    <el-menu-item index="0" class="menu-item">LOGO</el-menu-item>
    <div class="flex-grow" />
    <el-menu-item index="4" v-if="isAdmin">统计信息</el-menu-item>
    <el-menu-item index="3" v-if="isAdmin">排片日历</el-menu-item>
    <el-menu-item index="1">电影</el-menu-item>
    <el-sub-menu class="sub-menu" index="2">
      <template #title>个人信息</template>
      <el-menu-item index="2-1" v-if="!token">登录</el-menu-item>
      <el-menu-item index="2-2" v-if="!token">注册</el-menu-item>
      <el-menu-item index="2-3" v-if="token">个人信息</el-menu-item>
      <el-menu-item index="2-4" v-if="token">注销</el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<script>
export default {
  props: {
    token: String,
    isAdmin: Boolean,
  },
  data() {
    return {
      activeIndex: "0",
    };
  },
  methods: {
    handleSelect(index) {
      // 处理菜单项的选中事件
      //this.$emit("select", index);
    },
  },
};
</script>

<style lang="scss" scoped>
.flex-grow {
  flex-grow: 1;
}
.el-menu-demo {
  height: 60px;
}
.sub-menu {
  height: 60px;
}
.menu-item {
  height: 60px;
}
</style>
