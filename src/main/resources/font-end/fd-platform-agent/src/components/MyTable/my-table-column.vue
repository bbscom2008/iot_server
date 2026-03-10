<template>
    <el-table-column
      :prop="prop"
      :label="label"
      :width="width"
      :align="align"
      :type="type"
      
    >
      <!-- 支持自定义列内容 -->
      <template v-if="$scopedSlots.default" #default="scope">
        <slot :row="scope.row"></slot>
      </template>
    </el-table-column>
  </template>
  
  <script>
  export default {
    name: 'MyTableColumn',
    props: {
      prop: String, // 列对应的字段名
      label: String, // 列标题
      width: String, // 列宽度
      align: String, // 列对齐方式
      type: String, // 列对齐方式
    },
  };
  </script>