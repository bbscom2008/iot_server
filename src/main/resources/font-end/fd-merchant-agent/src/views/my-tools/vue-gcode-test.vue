<template>
  <el-table
    :data="flattenedData"
    style="width: 100%"
    @row-click="toggleExpand"
  >
    <el-table-column type="selection" width="55" v-if="hasSelectionColumn" />
    <el-table-column prop="name" label="名称" width="180" />

    <!-- 动态渲染子节点列 -->
    <!-- <template v-for="column in dynamicColumns" :slot="column.prop" slot-scope="scope">
      <div v-if="scope.row.isExpanded">
        <el-table
          :data="scope.row.children"
          style="width: 100%"
          @row-click="toggleExpand"
        >
          <el-table-column type="selection" width="55" v-if="hasSelectionColumn" />
          <el-table-column prop="name" label="子节点名称" width="180" />
        </el-table>
      </div>
    </template> -->
  </el-table>
</template>

<script>

// 示例数据：每个节点包含 children 数组和展开状态
const tableData = [
  {
    id: 1,
    name: "父节点1",
    isExpanded: false,
    children: [
      { id: 4, name: "子节点1-1", children: [] },
      { id: 5, name: "子节点1-2", children: [] }
    ]
  },
  {
    id: 2,
    name: "父节点2",
    isExpanded: false,
    children: [
      { id: 6, name: "子节点2-1", children: [] }
    ]
  }
];


export default {
  data() {
    return {
      tableData: tableData,
      hasSelectionColumn: true, // 是否显示多选列
    };
  },
  computed: {
    flattenedData() {
      // 返回展开后的表格数据（仅展示第一层）
      return this.tableData.filter(node => !node.parentId);
    }
  },
  methods: {
    toggleExpand(row) {
      row.isExpanded = !row.isExpanded;
    }
  }
};
</script>
