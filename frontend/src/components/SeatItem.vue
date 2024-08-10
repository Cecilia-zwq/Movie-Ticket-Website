<template>
  <el-button
    class="seat"
    :type="buttonType"
    @click="toggleSeatStatus"
    :disabled="isBooked"
    size="small"
    >&nbsp;&nbsp;
  </el-button>
</template>
<script>
export default {
  props: {
    row: {
      type: Number,
    },
    col: {
      type: Number,
    },
    status: {
      type: String,
      required: true, // 座位状态：'available', 'booked', 'selected'
    },
  },
  computed: {
    buttonType() {
      if (this.status === "available") {
        return "default"; // 可选座位的颜色
      } else if (this.status === "selected") {
        return "primary"; // 已选座位的颜色
      } else if (this.status === "booked") {
        return "danger"; // 已预订座位的颜色
      } else {
        return "info"; // 其他状态的颜色
      }
    },
    isBooked() {
      return this.status === "booked";
    },
  },
  methods: {
    toggleSeatStatus() {
      if (!this.isBooked) {
        // console.log("toggleSeatStatus called");
        // console.log(this.row, this.col);
        this.$emit("toggle", this.row, this.col); // 触发父组件的事件，用于选座或取消选座
      }
    },
  },
};
</script>

<style>
.seat {
  margin: 5px;
  border: 1.5px solid;
}
</style>
