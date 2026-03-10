<template>
  <div class="app-container">
    <el-dialog :visible.sync="dialogVisible" title="新建" width="600px">
      <el-form
        ref="form"
        :rules="rules"
        :model="form"
        label-position="right"
        label-width="140px"
        style="width: 500px; margin-left: 30px"
      >
        <el-tabs type="border-card" v-model="activeName">
          <el-tab-pane label="基本配置" name="basic">
            <el-form-item label="收款码名称：" prop="collect_info_name">
              <el-input v-model="form.collect_info_name" placeholder="请输入" size="small" />
            </el-form-item>
            <el-form-item label="金额限制类型：" prop="limit_type">
              <el-select filterable 
                v-model="form.limit_type"
                placeholder="请选择"
                size="small"
                @change="selectChange"
              >
                <el-option label="无限制" value="0" />
                <el-option label="固定金额" value="1" />
                <el-option label="范围金额" value="2" />
              </el-select>
            </el-form-item>
            <el-form-item label="固定金额：" prop="fixed_amount" v-if="whichLimit == '1'">
              <el-input
                v-model="form.fixed_amount"
                placeholder="请输入"
                size="small"
              />
            </el-form-item>
            <div style="display: flex">
              <el-form-item label="范围金额：" prop="min_amount" v-if="whichLimit == '2'">
                <el-input
                  v-model="form.min_amount"
                  placeholder="请输入"
                  size="small"
                  style="width: 80px"
                />
              </el-form-item>
              <el-form-item label="" prop="max_amount" v-if="whichLimit == '2'" label-width="0">
                <span class="symbol">~</span>
                <el-input
                  v-model="form.max_amount"
                  placeholder="请输入"
                  size="small"
                  style="width: 80px"
                />
              </el-form-item>
            </div>
            <el-form-item label="当日最大金额：" prop="daily_max_amount">
              <el-input v-model="form.daily_max_amount" placeholder="请输入" size="small" />
            </el-form-item>
            <el-form-item label="当日最大订单数：" prop="daily_max_count">
              <el-input v-model="form.daily_max_count" placeholder="请输入" size="small" />
            </el-form-item>
            <el-form-item label="是否启用：" prop="is_active">
              <el-switch
                active-text="是"
                inactive-text="否"
                v-model="form.is_active"
                active-color="#13ce66"
                inactive-color="#999"
                size="small"
              ></el-switch>
            </el-form-item>
            <el-form-item label="备注：" prop="remark">
              <el-input v-model="form.remark" placeholder="请输入" size="small" type="textarea" />
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="核心配置" name="core">
            <el-form-item label="选择产品：" prop="product">
              <el-select filterable 
                v-model="form.product"
                placeholder="请选择"
                size="small"
                @change="productChange"
              >
                <el-option label="产品1" value="1" />
                <el-option label="产品2" value="2" />
                <el-option label="产品3" value="3" />
              </el-select>
            </el-form-item>
            <el-form-item label="输入:" prop="test1" v-if="whichProduct == '1'">
              <el-input v-model="form.test1" placeholder="请输入" size="small" />
            </el-form-item>
            <el-form-item label="上传照片：" prop="test2" v-if="whichProduct == '2'">
              <el-upload
                action="#"
                list-type="picture-card"
                :auto-upload="false"
                :limit="1"
                v-model="form.test2"
              >
                <i slot="default" class="el-icon-plus"></i>
                <div slot="file" slot-scope="{ file }">
                  <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                  <span class="el-upload-list__item-actions">
                    <span
                      class="el-upload-list__item-preview"
                      @click="handlePictureCardPreview(file)"
                    >
                      <i class="el-icon-zoom-in"></i>
                    </span>
                    <span
                      v-if="!disabled"
                      class="el-upload-list__item-delete"
                      @click="handleDownload(file)"
                    >
                      <i class="el-icon-download"></i>
                    </span>
                    <span
                      v-if="!disabled"
                      class="el-upload-list__item-delete"
                      @click="handleRemove(file)"
                    >
                      <i class="el-icon-delete"></i>
                    </span>
                  </span>
                </div>
              </el-upload>
            </el-form-item>
            <el-form-item label="上传文件：" prop="test3" v-if="whichProduct == '3'">
              <el-upload
                class="upload-demo"
                action=" http://192.168.12.101:9527/"
                :on-change="handleChange"
                :show-file-list="true"
                :file-list="fileList"
                :limit="3"
                :on-exceed="handleExceed"
                v-model="form.test3"
              >
                <el-button size="small" type="primary">点击上传</el-button>
                <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
              </el-upload>
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false" size="small"> 取消 </el-button>
        <el-button type="primary" @click="handleSubmit()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisibleUpload">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    const validatetest3 = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error('请上传'))
      } else {
        callback()
      }
    }
    return {
      fileList: [],
      activeName: 'basic',
      dialogVisible: false,
      dialogVisibleUpload: false,
      dialogImageUrl: '',
      disabled: false,
      whichLimit: '',
      whichProduct: '',
      form: {
        product: '',
        collect_info_name: '',
        limit_type: '',
        fixed_amount: '',
        min_amount: '',
        max_amount: '',
        daily_max_amount: '',
        daily_max_count: '',
        is_active: 0,
        test1: '',
        test2: '',
        test3: '',
        remark: ''
      },
      rules: {
        product: [{ required: true, trigger: 'change', message: '请选择' }],
        collect_info_name: [{ required: true, trigger: 'blur', message: '请输入' }],
        limit_type: [{ required: true, trigger: 'change', message: '请选择' }],
        fixed_amount: [{ required: true, trigger: 'blur', message: '请输入' }],
        min_amount: [{ required: true, trigger: 'blur', message: '请输入' }],
        max_amount: [{ required: true, trigger: 'blur', message: '请输入' }],
        daily_max_amount: [{ required: true, trigger: 'blur', message: '请输入' }],
        daily_max_count: [{ required: true, trigger: 'blur', message: '请输入' }],
        remark: [{ required: false, trigger: 'blur', message: '请输入' }],
        is_active: [{ required: true, trigger: 'change', message: '请选择' }],
        test1: [{ required: true, trigger: 'blur', message: '请选择' }],
        test2: [{ required: true, trigger: 'blur', message: '请选择' }],
        test3: [{ required: true, trigger: 'blur', validator: validatetest3 }]
      }
    }
  },
  watch: {},
  methods: {
    selectChange(e) {
      this.whichLimit = e
    },
    productChange(e) {
      this.whichProduct = e
    },
    handleRemove(file) {
      console.log(file)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisibleUpload = true
    },
    handleDownload(file) {
      console.log(file)
    },
    handleChange(file, fileList) {
      console.log(file, fileList)
      this.fileList = fileList
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件`)
    },
    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.dialogVisible = false
        } else {
          return false
        }
      })
    }
  }
}
</script>
