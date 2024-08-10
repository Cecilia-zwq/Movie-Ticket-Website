export function TimestampToDate(Timestamp) {
    let now = new Date(Timestamp),
      y = now.getFullYear(),
      m = now.getMonth() + 1,
      d = now.getDate();
    return y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d);
}
  
export function TimestampToTime(Timestamp) {
    let now = new Date(Timestamp);
    return now.toTimeString().substr(0, 8);
}

export function CalculateEndDateTime(start, durationMinutes ) {
  const startDateTime = new Date(start);
  const endDateTime = new Date(startDateTime.getTime() + durationMinutes * 60000);
  // 获取结束时间的年、月、日、小时、分钟和秒
  const year = endDateTime.getFullYear();
  const month = String(endDateTime.getMonth() + 1).padStart(2, '0');
  const day = String(endDateTime.getDate()).padStart(2, '0');
  const hours = String(endDateTime.getHours()).padStart(2, '0');
  const minutes = String(endDateTime.getMinutes()).padStart(2, '0');
  const seconds = String(endDateTime.getSeconds()).padStart(2, '0');
  // 构建最终的格式化字符串
  const formattedEndTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  //console.log(endDateTime, formattedEndTime);
  return formattedEndTime;
}

export function formatDateTime(dateTimeString) {
  const date = new Date(dateTimeString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export const screeningFields = [
  { name: "movieTitle", label: "电影名称", type: "read" },
  { name: "theaterId", label: "放映厅", type: "select" },
  { name: "date", label: "排片日期", type: "date" },
  { name: "start_time", label: "时间", type: "time" },
  { name: "duration", label: "时长", type: "read" },
  { name: "language", label: "语言", type: "string" },
  { name: "version", label: "版本", type: "string" },
  { name: "price", label: "价格", type: "string" },
]

export const movieFields = [
  { name: "title", label: "电影名称", type: "string" },
  { name: "genre", label: "电影类型", type: "string" },
  { name: "release_date", label: "上映日期", type: "date" },
  { name: "duration", label: "片长", type: "string" },
  { name: "average_rating", label: "评分", type: "string" },
  { name: "director", label: "导演", type: "string" },
  { name: "cast", label: "演员", type: "string" },
  { name: "synopsis", label: "简介", type: "text" },
]

export function isEventOverlapping (event1, event2) {
  // 检查两个事件的时间是否有重叠
  console.log("testing overlap")
  const start1 = new Date(event1.start);
  const end1 = new Date(event1.end);
  const start2 = new Date(event2.start);
  const end2 = new Date(event2.end);
  return (
    start1 < end2 && end1 > start2 // 如果有重叠，返回 true
  );
};