<template>
  <FullCalendar :options="calendarOptions" />
</template>

<script>
import FullCalendar from "@fullcalendar/vue3";
import timeGridPlugin from "@fullcalendar/timegrid";

export default {
  components: {
    FullCalendar, // make the <FullCalendar> tag available
  },
  props: {
    screeningEvents: Array,
  },
  watch: {
    screeningEvents(newVal) {
      this.calendarOptions.events = newVal;
    },
  },
  data: function () {
    return {
      calendarOptions: {
        plugins: [timeGridPlugin],
        locale: "zh-cn",
        height: "auto",
        contentHeight: 5,
        initialView: "timeGridWeek",
        allDaySlot: false,
        headerToolbar: {
          left: "prev,next",
          center: "title",
          right: "timeGridWeek,timeGridDay", // user can switch between the two
        },
        buttonText: {
          today: "今天",
          month: "月",
          week: "周",
          day: "日",
        },
        slotDuration: "00:30:00",
        slotLabelFormat: {
          hour: "numeric",
          minute: "2-digit",
          hour12: false,
        },
        slotLabelInterval: { hours: 1 },
        slotMinTime: "08:00:00",
        slotMaxTime: "24:00:00",
        events: [],
      },
    };
  },
};
</script>

<style lang="scss" scoped></style>
