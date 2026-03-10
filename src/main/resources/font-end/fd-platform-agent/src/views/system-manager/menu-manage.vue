<template>
  <div class="container">
    <!-- <div class="tips">
      <p>菜单管理 -- 配置菜单</p>
    </div> -->
    <el-table
      :data="tableData" stripe
      style="width: 100%; margin-bottom: 20px"
      :row-key="(row) => row.name + row.path"
      border
      default-expand-all
       @selection-change="handleSelectionChange"
      :tree-props="{ children: 'children' }"
    >
      <el-table-column type="selection" align="center" width="80"> </el-table-column>

      <el-table-column label="菜单名称" width="280">
        <template #default="{ row }">
          <span>{{ row.meta ? row.meta.title : '' }}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column label="图标" width="100" align="center">
        <template #default="{ row }">
          <template v-if="row.meta && row.meta.icon">
            <i v-if="row.meta.icon.includes('el-icon')" :class="row.meta.icon"></i>
            <svg-icon v-else :icon-class="row.meta.icon" />
          </template>
        </template>
      </el-table-column> -->

      <!-- <el-table-column prop="name" align="center" label="排序" width="100"> 
        <template #default="{ row,column,$index }">
          <span>{{ row.index }}</span>
        </template>
      </el-table-column> -->

      <el-table-column prop="name" align="center" label="权限标识符" > 
        <template #default="{ row,column,$index }">
          <span>{{ row.permission }}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column prop="name" align="center" label="是否启用" > 
        <template #default="{ row,column,$index }">
          <el-switch v-model="row.is_active" ></el-switch>
        </template>
      </el-table-column> -->

      <!-- <el-table-column label="路径" align="center">
        <template #default="{ row }">
          <span>{{ row.path }}</span>
        </template>
      </el-table-column> -->

      <!-- <el-table-column label="操作" align="center">
        <template #default="{ row }">

          <div class="opt-box">
              <div class="btn" @click="addSubItem(row)"><i class="el-icon-plus" />新增子条目</div>
              <div class="btn" @click="showItemDetail(row)"><i class="el-icon-edit" />修改</div>
              <div class="btn mt-5" @click="showItemDetail(row)">
                <i class="el-icon-delete" />删除
              </div>
            </div>

        </template>
      </el-table-column> -->
    </el-table>

    <!-- <el-dialog :visible.sync="dialogVisible" title="修改菜单" width="600px">
      <el-form :model="formData" label-width="100px">
        <el-form-item label="菜单名称:">
          <el-input v-model="formData.meta.title" size="small" placeholder="登录名"></el-input>
        </el-form-item>
        <el-form-item label="排序:">
          <el-input v-model="formData.index" size="small" placeholder="商户号"></el-input>
        </el-form-item>
        <el-form-item label="图标:">
          <el-popover placement="bottom" title="选择图标" width="500" trigger="click">
            <el-button slot="reference">
              <span v-if="formData.meta.icon">
                <i v-if="formData.meta.icon.includes('el-icon')" :class="formData.meta.icon"></i>
                <svg-icon v-else :icon-class="formData.meta.icon" />
              </span>
              <span v-else>请选择图标</span>
            </el-button>
            <div>
              <Icons :select="true" @selectIcon="onSelectIcon" />
            </div>
          </el-popover>
        </el-form-item>

        <el-form-item label="权限点">
          
          <el-input v-model="formData.permission" size="small" placeholder="备注"></el-input>
        </el-form-item>

        <el-form-item label="隐藏菜单">
          <el-switch v-model="formData.isHideMenu"> </el-switch>
        </el-form-item>
      </el-form>

      <div style="text-align: center">
        <el-button type="primary" @click="onSubmit()" size="small"> 确定 </el-button>
        <el-button type="primary" plain @click="onSubmit()" size="small"> 取消 </el-button>
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { deepClone } from '@/utils'
import Icons from '@/views/icons/SelectIcon.vue'

export default {
  name: 'MenuManage',
  components: {
    Icons
  },
  data() {
    return {
      tableData: [],
      dialogVisible: false,
      formData: {
        meta: {
          title: '', // 菜单名称
          name: '' // 名称
        },
        icon: '', // 图标
        path: '' // 地址
      },
      currEditItem: null
    }
  },
  computed: {
    ...mapGetters(['permission_routes'])
  },
  methods: {

    handleSelectionChange(val){
      console.log('--------handleSelectionChange')
      console.log(JSON.stringify(val))
    },


    addSubItem(row) {},
    onSelectIcon(icon) {
      this.formData.meta.icon = icon
      this.$forceUpdate()
    },
    showItemDetail(row) {
      console.log('---------showItemDetail')
      console.log(row)
      this.currEditItem = row
      this.formData = deepClone(row)
      this.dialogVisible = true
    },
    onSubmit() {
      this.dialogVisible = false
      Object.assign(this.currEditItem, this.formData)
      this.$store.commit('permission/SET_ROUTES', this.tableData)
    },
    prepareData(data, per){
      let index = 1
      let permission = ''
      if (per && per != '/') {
        permission = per
      }

      data.forEach((item) => {
        // 添加 isShowMenu 字段, 判断是否显示当前菜单
        item.isHideMenu = false
        item.index = index ++

        item.is_active = true


        let pp = item.path
        if (pp && pp.startsWith('/')) {
          pp = pp.substring(1)  
        }

        item.permission =  permission ? permission + ':' + pp : pp 

        if (item.children && item.children.length > 0) {
          this.prepareData(item.children, item.permission)
        }

      })
    }
  },
  mounted() {
    console.log('---------this.permission_routes')
    this.tableData = this.permission_routes.filter((item) => !item.hidden)
    console.log(this.tableData)


    // 预处理tableData
    this.prepareData(this.tableData)

    this.tableData = this.tableData.map((item) => {
      if (item.children && item.children.length == 1) {
        return item.children[0]
      } else {
        return item
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.tips {
  color: #8a6d3b;
  background-color: #fcf8e3;
  border: 1px solid #eee;
  padding: 15px;
  margin-bottom: 20px;
}
.text {
  line-height: 8px;
}
.textColor {
  color: #1a53ff;
}
.f-b {
  font-weight: bold;
}
.red {
  color: red;
}
.m-t-10 {
  margin-top: 10px;
}
</style>
