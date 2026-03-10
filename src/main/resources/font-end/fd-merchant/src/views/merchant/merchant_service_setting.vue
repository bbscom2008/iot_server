<template>
  <div class="container">
    <el-dialog :visible.sync="serviceDialogVisible" title="指定码商" width="600px">
      <el-card>
        <!-- <el-input placeholder="输入关键字进行搜索" v-model="filterText"> </el-input> -->
        <el-form :inline="true" :model="queryFormData" class="demo-form-inline">
          <el-form-item label="码商账号：" prop="service_name">
            <el-input
              v-model="queryFormData.service_name"
              placeholder="请输入码商用户名"
              size="small"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" icon="el-icon-search" @click="queryTableData"
              >搜索</el-button
            >
            <el-button size="small" icon="el-icon-refresh" @click="resetQueryForm">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <el-card class="mt-10">

        <el-checkbox-group v-model="autoCheckList" @change="checkGroupChange">
          <el-checkbox :label="1">全选</el-checkbox>
          <el-checkbox :label="0">全不选</el-checkbox>
        </el-checkbox-group>

        <el-tree
          class="filter-tree"
          :data="data"
          :props="defaultProps"
          :filter-node-method="filterNode"
          ref="tree"
          show-checkbox
          node-key="id"
          @check-change="handleCheckChange"
        >
        </el-tree>
      </el-card>
      <div class="footer">
        <el-button type="primary" @click="onDialogBtnOk()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    currItem: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      queryFormData: {
        service_name: ''
      },
      filterText: '',
      serviceDialogVisible: false,
      selectionRows: {},
      data: [
        {
          id: 1,
          label: '一级码商 1',
          children: [
            {
              id: 9,
              label: '二级码商 1-1',
              children: [
                {
                  id: 24,
                  label: '三级码商 1-1-1'
                },
                {
                  id: 25,
                  label: '三级码商 1-1-2'
                },
                {
                  id: 26,
                  label: '三级码商 1-1-3'
                },
                {
                  id: 27,
                  label: '三级码商 1-1-4'
                },
                {
                  id: 28,
                  label: '三级码商 1-1-5'
                },
                {
                  id: 29,
                  label: '三级码商 1-1-6'
                },
                {
                  id: 30,
                  label: '三级码商 1-1-7'
                }
              ]
            }
          ]
        },
        {
          id: 2,
          label: '一级码商 2',
          children: [
            {
              id: 10,
              label: '二级码商 2-1'
            },
            {
              id: 11,
              label: '二级码商 2-2'
            }
          ]
        },
        {
          id: 3,
          label: '一级码商 3',
          children: [
            {
              id: 12,
              label: '二级码商 3-1'
            },
            {
              id: 13,
              label: '二级码商 3-2'
            }
          ]
        },
        {
          id: 4,
          label: '一级码商 4',
          children: [
            {
              id: 14,
              label: '二级码商 4-1'
            },
            {
              id: 15,
              label: '二级码商 4-2'
            }
          ]
        },
        {
          id: 5,
          label: '一级码商 5',
          children: [
            {
              id: 16,
              label: '二级码商 5-1'
            },
            {
              id: 17,
              label: '二级码商 5-2'
            }
          ]
        },
        {
          id: 6,
          label: '一级码商 6',
          children: [
            {
              id: 18,
              label: '二级码商 6-1'
            },
            {
              id: 19,
              label: '二级码商 6-2'
            }
          ]
        },
        {
          id: 7,
          label: '一级码商 7',
          children: [
            {
              id: 20,
              label: '二级码商 7-1'
            },
            {
              id: 21,
              label: '二级码商 7-2'
            }
          ]
        },
        {
          id: 8,
          label: '一级码商 8',
          children: [
            {
              id: 22,
              label: '二级码商 8-1'
            },
            {
              id: 23,
              label: '二级码商 8-2'
            }
          ]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      autoCheckList: [],
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    checkGroupChange(ele) {
      if (ele.length > 0) {
        this.autoCheckList = [ele[ele.length - 1]]

        if (ele[ele.length - 1] === 1) {
         // 全选 
         console.log('全选');
         let arr = Array(30).fill(0).map((item,index)=>index+1);
         this.$refs.tree.setCheckedKeys(arr);
        }else{
          // 全不选
          console.log('全不选');
          this.$refs.tree.setCheckedKeys([]);
        }


      } else {
      }
    },

    queryTableData() {
      console.log(this.queryFormData)
    },
    resetQueryForm() {
      this.queryFormData = {
        service_name: ''
      }
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    onDialogBtnOk() {
      console.log(this.selectionRows, 'this.selectionRows', '提交')
      this.serviceDialogVisible = false
    },
    handleCheckChange(data, checked, indeterminate) {
      console.log(data, checked, indeterminate)
      this.selectionRows = data

      // this.autoCheckList=[]
    }
  },
  mounted() {}
}
</script>

<style lang="scss" scoped>
.footer {
  margin-top: 20px;
  display: flex;
  justify-content: right;
}
</style>
