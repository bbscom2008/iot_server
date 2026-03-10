<template>
    <div>
      <my-table :table-data="tableData" :page-size="10"
      :loadData="handleDelete"
      >
        <my-table-column prop="name" label="姓名"  />
        <my-table-column prop="age" label="年龄" />
        <my-table-column prop="address" label="地址" />
        <!-- 自定义列内容 -->
        <my-table-column label="操作">
          <template #default="{ row }">
            <el-button type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </my-table-column>
      </my-table>
    </div>
  </template>
  
  <script>
  
  export default {
    data() {
      return {
        tableData: [
          { name: '张三', age: 25, address: '北京市' },
          { name: '李四', age: 30, address: '上海市' },
          { name: '王五', age: 28, address: '广州市' },
          // 更多数据...
        ],
      };
    },
    methods: {
      handleEdit(row) {
        console.log('编辑', row);
      },
      handleDelete(row) {
        console.log('删除', row);
      },
    },
  };
  </script>