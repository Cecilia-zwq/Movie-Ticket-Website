<template>
  <el-form :model="dataModel" label-width="70px" enctype="multipart/form-data">
    <el-form-item
      v-for="field in formFields"
      :key="field.name"
      :label="field.label"
    >
      <template v-if="field.type === 'string'">
        <el-input
          v-model="dataModel[field.name]"
          @change="handleChange(field.name, dataModel[field.name])"
        />
      </template>
      <template v-if="field.type === 'read'">
        <el-input v-model="dataModel[field.name]" :readonly="true" />
      </template>
      <template v-if="field.type === 'text'">
        <el-input
          v-model="dataModel[field.name]"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 6 }"
        />
      </template>
      <template v-if="field.type === 'select'">
        <el-select
          v-model="dataModel[field.name]"
          placeholder="Select"
          @change="handleChange(field.name, dataModel[field.name])"
        >
          <el-option
            v-for="item in selectOptions[field.name]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
          <!--value是id，label是id对应title-->
        </el-select>
      </template>
      <template v-if="field.type === 'date'">
        <el-date-picker
          v-model="dataModel[field.name]"
          type="date"
          placeholder="选择日期"
          :disabledDate="disabledDate"
          @change="handleChange(field.name, dataModel[field.name])"
        />
      </template>
      <template v-if="field.type === 'time'">
        <el-time-select
          v-model="dataModel[field.name]"
          start="08:00"
          step="00:15"
          end="23:59"
          placeholder="Select time"
          @change="handleChange(field.name, dataModel[field.name])"
        />
      </template>
    </el-form-item>
  </el-form>
</template>

<script>
function makeRange(start, end) {
  const result = [];
  for (let i = start; i <= end; i++) {
    result.push(i);
  }
  return result;
}

export default {
  props: {
    formFields: Array, // 表单字段配置，包含name label type
    formModel: Object, // 表单数据对象
    selectOptions: Object,
    disabledDate: Function,
  },
  data() {
    return {
      dataModel: this.formModel,
    };
  },
  methods: {
    disabledSeconds() {
      return makeRange(1, 59);
    },
    disabledHours() {
      return makeRange(2, 7);
    },
    handleChange(fieldName, fieldValue) {
      this.$emit("formChange", fieldName, fieldValue);
    },
  },
};
</script>

<style lang="scss" scoped>
form {
  max-width: 600px;
}
</style>
