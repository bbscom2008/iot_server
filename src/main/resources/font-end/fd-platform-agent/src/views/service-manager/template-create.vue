<template>
  <div class="container">
    <div class="tt">自定义收银台模板</div>
    <div class="body">
      <div class="preview">
        <div class="tip" style="color: green; margin: 20px auto">
          该效果仅供大致预览，具体效果请前往收银台查看
        </div>

        <div class="main">
          <div class="logo" :style="{ background: baseProp.headBgColor }">
            <img
              style="height: 50px; margin-right: 15px"
              :src="require('@/assets/img_bank/' + this.logoUrl[this.baseProp.logoIndex].icon)"
              alt=""
            />
            <span class="title">{{ baseProp.title }}</span>
          </div>

          <!-- 基础信息卡片 -->
          <el-card class="base-info mt-20">
            <div class="order-money">订单金额：￥100</div>
            <span class="hr"></span>
            <div style="line-height: 26px" v-if="baseProp.isHaveRemark">
              {{ baseProp.remarkText }}：88888
            </div>
            <div style="line-height: 26px" v-if="!baseProp.isHideOrderNum">订单号：xxxx</div>
            <div style="line-height: 26px">请在 <span style="color: blue">xxx</span> 秒内支付</div>
          </el-card>

          <!-- 文本信息卡片 -->
          <el-card
            class="text-info mt-20"
            v-if="textConfigInfo.textConfigInfoList.filter((el) => el.isShow).length > 0"
          >
            <div
              class="txt-info-item"
              style="line-height: 26px; text-align: center"
              v-for="info in textConfigInfo.textConfigInfoList.filter((el) => el.isShow)"
              :key="info.id"
            >
              <span style="text-align: right"
                >{{ info.label }} <span v-if="info.label.length > 0">：</span></span
              >
              <span style="text-align: left"
                ><span style="margin-right: 20px">文本值</span>
                <el-button type="text">复制</el-button></span
              >
            </div>
          </el-card>

          <!-- 二维码卡片 -->
          <el-card
            class="text-info mt-20"
            v-if="qrCodeConfigInfo.isEnable && qrCodeConfigInfo.isShow"
          >
            <div style="text-align: center">
              <img src="@/assets/img/qr-code.png" width="160" alt="" class="mt-10" />
            </div>
          </el-card>

          <!-- 提交信息卡片 -->
          <el-card
            class="submit-info mt-20"
            v-if="submitConfigInfo.submitConfigInfoList.length > 0"
          >
            <div
              class="submit-info-item"
              v-for="info in submitConfigInfo.submitConfigInfoList"
              :key="info.id"
              style="margin-bottom: 20px"
            >
              <div class="mr-10" style="width: 30%; text-align: right">
                <span>{{ info.label }}</span>
              </div>

              <div style="width: 60%">
                <el-button v-if="info.showType == 1" type="primary">选择图片</el-button>
                <el-input v-else></el-input>
              </div>
            </div>
            <div style="text-align: center" class="mt-10">
              <el-button type="primary">确定</el-button>
            </div>
          </el-card>

          <!-- 文件信息卡片 -->
          <!-- <el-card class="submit-info mt-20" v-if="fileConfigInfo.fileList.length > 0">
            <div
              class="submit-info-item"
              v-for="info in fileConfigInfo.fileList"
              :key="info.id"
              style="margin-bottom: 20px"
            >
              <div class="mr-10" style="width: 30%; text-align: right">
                <span>{{ info.label }}</span>
              </div>

              <div style="width: 60%">
                <el-button type="primary">选择文件</el-button>
              </div>
            </div>
          </el-card> -->

          <!-- 按钮信息卡片 -->
          <el-card class="mt-20" v-if="buttonConfigInfo.isEnable">
            <div class="btn-info" v-for="info in buttonConfigInfo.btnList" :key="info.id">
              <div class="btn-info-item">
                <img
                  v-if="info.showModes.includes('2')"
                  src="@/assets/img/qr-code.png"
                  width="90"
                  alt=""
                  class="mt-10"
                />
                <!-- <div id="qrcode"></div> -->
                <span
                  v-if="info.showModes.length == 2"
                  style="color: red; font-size: 10px; margin: 8px"
                  >点击跳转，或者 扫码跳转</span
                >
                <el-button
                  v-if="info.showModes.includes('1')"
                  type="primary"
                  style="width: 30%; margin-bottom: 10px"
                  >{{ info.label }}</el-button
                >
              </div>
            </div>
          </el-card>
        </div>
      </div>

      <div class="config">
        <el-tabs v-model="activeName" @tab-click="handleClick" type="border-card">
          <!----------------- tab1 ------基础信息配置------ -->

          <el-tab-pane label="基础信息配置" name="tab1">
            <div style="margin-left: 130px">
              <el-button @click="saveTemplate" type="primary">保存</el-button>
              <el-button>取消</el-button>
            </div>
            <div class="mt-20 base-config">
              <el-form :modal="baseProp" label-width="110px" :inline="true">
                <el-form-item label="通道名称:">
                  <el-input v-model="baseProp.title"></el-input>
                </el-form-item>

                <el-form-item label="通道logo:">
                  <el-select filterable 
                    v-model="baseProp.logoIndex"
                    placeholder="请选择"
                    :popper-append-to-body="false"
                  >
                    <el-option
                      v-for="(item, index) in logoUrl"
                      :key="index"
                      :value="index"
                      :label="item.name"
                    >
                      <img
                        class="mr-5"
                        style="height: 100%"
                        :src="require('@/assets/img_bank/' + logoUrl[index].icon)"
                        alt=""
                      />
                      <span>{{ item.name }}</span>
                    </el-option>
                  </el-select>
                </el-form-item>

                <el-form-item label="隐藏订单号：">
                  <el-switch
                    v-model="baseProp.isHideOrderNum"
                    active-text="开启"
                    inactive-text="关闭"
                  >
                  </el-switch>
                </el-form-item>
                <el-form-item label="主题颜色：">
                  <el-color-picker
                    v-model="baseProp.headBgColor"
                    show-alpha
                    :predefine="predefineColors"
                  >
                  </el-color-picker>
                </el-form-item>

                <span class="hr"></span>

                <el-form-item label="教程弹窗：">
                  <el-switch v-model="baseProp.isShowTeach" active-text="开启" inactive-text="关闭">
                  </el-switch>
                </el-form-item>

                <el-form-item label="教程按钮名称：" v-if="baseProp.isShowTeach">
                  <el-input v-model="baseProp.teachBtnTxt"> </el-input>
                </el-form-item>

                <el-form-item label="添加教程：" v-if="baseProp.isShowTeach">
                  <el-upload
                    :on-preview="handlePictureCardPreview"
                    :on-remove="handleRemove"
                    multiple
                    :auto-upload="false"
                    action="#"
                    list-type="picture-card"
                  >
                    <!-- <el-button slot="trigger" size="small" type="primary">选取文件</el-button> -->
                    <i class="el-icon-plus"></i>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，1-5 张</div>
                  </el-upload>
                </el-form-item>

                <i class="hr"></i>

                <el-form-item label="提交弹窗：">
                  <el-switch v-model="baseProp.isShowPopup" active-text="开启" inactive-text="关闭">
                  </el-switch>
                </el-form-item>
                <el-form-item label="提交标题：" v-if="baseProp.isShowPopup">
                  <el-input v-model="baseProp.popupTitle"> </el-input>
                </el-form-item>
                <el-form-item label="提交检验格式：" v-if="baseProp.isShowPopup">
                  <el-select filterable 
                    style="width: 120px"
                    v-model="baseProp.popFormat"
                    placeholder="请选择提交检验格式"
                    size="small"
                  >
                    <el-option label="不检测" value="0"></el-option>
                    <el-option label="数字" value="1"></el-option>
                    <el-option label="姓名" value="2"></el-option>
                    <el-option label="字母" value="3"></el-option>
                    <el-option label="邮箱" value="4"></el-option>
                  </el-select>
                </el-form-item>
                <!-- <el-form-item label="敏感词过滤：" v-if="baseProp.isShowPopup">
                  <el-input v-model="baseProp.popupFilterWord"> </el-input>
                </el-form-item> -->

                <i class="hr"></i>

                <el-form-item label="转账备注：">
                  <el-switch
                    v-model="baseProp.isHaveRemark"
                    active-text="开启"
                    inactive-text="关闭"
                  >
                  </el-switch>
                </el-form-item>

                <el-form-item label="文本标题：" v-if="baseProp.isHaveRemark">
                  <el-input v-model="baseProp.remarkText"> </el-input>
                </el-form-item>

                <i class="hr"></i>
                <el-form-item label="在线客服：">
                  <el-switch
                    v-model="baseProp.isOnlineServer"
                    active-text="开启"
                    inactive-text="关闭"
                  >
                  </el-switch>
                </el-form-item>

                <i class="hr"></i>

                <el-form-item label="支付教程：">
                  <el-switch
                    v-model="baseProp.isTeachEnable"
                    active-text="开启"
                    inactive-text="关闭"
                  >
                  </el-switch>
                </el-form-item>

                <el-form-item
                  v-if="baseProp.isTeachEnable"
                  label="教程："
                  style="width: 100%"
                  class="rich-txt"
                >
                  <tinymce v-model="baseProp.teachContent" :height="300" menubar="" />
                </el-form-item>
              </el-form>
            </div>
          </el-tab-pane>

          <!--------------- tab2 --------组件配置------------>

          <el-tab-pane label="组件配置" name="tab2">
            <el-form :model="componentsConfig" label-width="110px" :inline="true">
              <el-form-item label="银行组件：">
                <el-switch
                  v-model="componentsConfig.isBankEnable"
                  active-text="开启"
                  inactive-text="关闭"
                >
                </el-switch>
              </el-form-item>
            </el-form>
          </el-tab-pane>

          <!--------------- tab3 --------提交信息配置------------>
          <el-tab-pane label="提交信息配置" name="tab3">
            <div style="margin-left: 130px">
              <el-button type="primary" plain @click="addSubmitInfo">添加行</el-button>
              <el-button @click="saveTemplate" type="primary">保存</el-button>
              <el-button>取消</el-button>
            </div>
            <div class="mt-20">
              <el-form :model="submitConfigInfo" label-width="110px" :inline="true">
                <template v-for="(submitInfo, index) in submitConfigInfo.submitConfigInfoList">
                  <el-form-item label="标题：">
                    <el-input v-model="submitInfo.label" placeholder="标题"></el-input>
                  </el-form-item>

                  <el-form-item label="显示类型：">
                    <el-select filterable 
                      v-model="submitInfo.showType"
                      placeholder="请选择显示类型"
                      size="small"
                    >
                      <el-option label="文本框" value="0"></el-option>
                      <el-option label="图片上传" value="1"></el-option>
                      <el-option label="邮箱" value="2"></el-option>
                    </el-select>
                  </el-form-item>

                  <el-form-item label="校验规则：">
                    <!-- <el-checkbox-group v-model="submitInfo.checklist">
                      <el-checkbox label="1">数字</el-checkbox>
                      <el-checkbox label="2">字母</el-checkbox>
                      <el-checkbox label="3">中文</el-checkbox>
                    </el-checkbox-group> -->
                    <el-select filterable 
                      v-model="submitInfo.checklist"
                      placeholder="请选择校验规则"
                      size="small"
                    >
                    <!-- （0-不校验、1-数值、2-中文、3、字母、4-邮箱） -->
                      <el-option label="不校验" value="0"></el-option>
                      <el-option label="数值" value="1"></el-option>
                      <el-option label="中文" value="2"></el-option>
                      <el-option label="字母" value="3"></el-option>
                      <el-option label="邮箱" value="4"></el-option>
                    </el-select>


                  </el-form-item>

                  <el-button type="danger" plain @click="deleteSubmitInfo(index)">删除</el-button>
                  <i class="hr"></i>
                </template>
              </el-form>
            </div>
          </el-tab-pane>

          <!----------------- tab4 -----文本信息配置------- -->

          <el-tab-pane label="文本信息配置" name="tab4">
            <div style="margin-left: 130px">
              <el-button type="primary" plain @click="addText">添加行</el-button>
              <el-button @click="saveTemplate" type="primary">保存</el-button>
              <el-button>取消</el-button>
            </div>
            <div class="mt-20">
              <el-form :model="textConfigInfo" label-width="110px" :inline="true">
                <template v-for="(textInfo, index) in textConfigInfo.textConfigInfoList">
                  <el-form-item label="标题：">
                    <el-input v-model="textInfo.label" placeholder="标题"></el-input>
                  </el-form-item>

                  <el-form-item label="支付页面显示：">
                    <el-switch v-model="textInfo.isShow" active-text="开启" inactive-text="关闭">
                    </el-switch>
                  </el-form-item>

                  <el-form-item label="说明">
                    <el-input v-model="textInfo.paramsName" placeholder="说明"> </el-input>
                  </el-form-item>

                  <!-- <el-form-item label="显示类型：">
                    <el-select filterable 
                      v-model="textInfo.showType"
                      placeholder="请选择显示类型"
                      size="small"
                    >
                      <el-option label="文本框" value="0"></el-option>
                      <el-option label="邮箱" value="1"></el-option>
                    </el-select>
                  </el-form-item> -->

                  <!-- <el-form-item label="参数名称：">
                    <el-input v-model="textInfo.paramsName" placeholder="参数"> </el-input>
                  </el-form-item>

                  <el-form-item label="长度限制：">
                    <el-input-number
                      v-model="textInfo.length"
                      style="width: 120px"
                      @change="handleClick"
                      :min="1"
                      :max="10"
                      label="描述文字"
                    ></el-input-number>
                  </el-form-item>

                   -->

                  <el-form-item label="是否必填：">
                    <el-checkbox v-model="textInfo.isRequest">必填</el-checkbox>
                  </el-form-item>

                  <el-button type="danger" plain @click="deleteText(index)">删除</el-button>
                  <i class="hr"></i>
                </template>
              </el-form>
            </div>
          </el-tab-pane>

          <!----------- tab4 -------------按钮配置---------------->

          <el-tab-pane label="按钮配置" name="tab5">
            <div style="margin-left: 130px">
              <el-button type="primary" plain @click="addBtnInfo" v-if="buttonConfigInfo.isEnable"
                >添加按钮</el-button
              >
              <el-button @click="saveTemplate" type="primary">保存</el-button>

              <el-button>取消</el-button>
            </div>
            <div class="mt-20">
              <el-form :modal="buttonConfigInfo" label-width="110px" :inline="true">
                <div>
                  <el-form-item label="按钮开关：">
                    <el-switch
                      v-model="buttonConfigInfo.isEnable"
                      active-text="开启"
                      inactive-text="关闭"
                    >
                    </el-switch>
                  </el-form-item>
                </div>

                <template v-if="buttonConfigInfo.isEnable">
                  <template v-for="(btnInfo, index) in buttonConfigInfo.btnList">
                    <i class="hr"></i>
                    <el-form-item label="按钮名称：">
                      <el-input v-model="btnInfo.label" placeholder="按钮名称"></el-input>
                    </el-form-item>

                    <el-form-item label="跳转地址：">
                      <el-input v-model="btnInfo.jumpUrl" placeholder="按钮名称"></el-input>
                    </el-form-item>

                    <el-form-item label="显示形态：">
                      <el-checkbox-group :min="1" v-model="btnInfo.showModes">
                        <el-checkbox label="1">按钮</el-checkbox>
                        <el-checkbox label="2">二维码</el-checkbox>
                      </el-checkbox-group>
                    </el-form-item>

                    <el-button
                      type="danger"
                      style="margin: 0 30px"
                      plain
                      @click="deleteBtnInfo(index)"
                      >删除按钮</el-button
                    >

                    <el-button type="success" plain @click="addParams(btnInfo)">添加参数</el-button>

                    <div v-for="(item, index) in btnInfo.paramsList">
                      <el-form-item label="参数：">
                        <el-input size="small" v-model="item.params" placeholder="参数"></el-input>
                      </el-form-item>

                      <el-form-item label="参数名称：">
                        <el-input
                          size="small"
                          v-model="item.paramsName"
                          placeholder="参数名称"
                        ></el-input>
                      </el-form-item>

                      <el-form-item label="说明：">
                        <el-input size="small" v-model="item.remark" placeholder="说明"></el-input>
                      </el-form-item>

                      <el-button type="text" plain @click="deleteParams(btnInfo, index)"
                        >删除参数</el-button
                      >
                      <!-- <i class="hr"></i> -->
                    </div>
                  </template>
                </template>
              </el-form>
            </div>
          </el-tab-pane>

          <!----------- tab5 -------------二维码配置---------------->

          <el-tab-pane label="二维码配置" name="tab6">
            <div style="margin-left: 130px">
              <!-- <el-button type="primary" plain @click="addBtnInfo" v-if="buttonConfigInfo.isEnable"
                >添加行</el-button
              > -->
              <el-button @click="saveTemplate" type="primary">保存</el-button>
              <el-button>取消</el-button>
            </div>
            <div class="mt-20" style="margin-left: 30px">
              <el-form :modal="qrCodeConfigInfo" label-width="110px" :inline="true">
                <el-form-item label="开关状态：">
                  <el-switch
                    v-model="qrCodeConfigInfo.isEnable"
                    active-text="开启"
                    inactive-text="关闭"
                  >
                  </el-switch>
                </el-form-item>

                <el-form-item label="支付页面显示：">
                  <el-switch
                    v-model="qrCodeConfigInfo.isShow"
                    active-text="开启"
                    inactive-text="关闭"
                  >
                  </el-switch>
                </el-form-item>

                <!-- <div>
                  <el-form-item label="解析模式：">
                    <el-radio-group v-model="qrCodeConfigInfo.parseMode">
                      <el-radio :label="1">上传并解析</el-radio>
                      <el-radio :label="2">仅上传</el-radio>
                      <el-radio :label="3">直接配置数据</el-radio>
                      <el-radio :label="4">自定义选择</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </div> -->

                <div>
                  <el-form-item label="">
                    <div class="red_tip" style="margin-left: 30px; color: red">
                      说明：解析充值页面显示新的二维码，无解析直接显示原图。有些二维码不能解析！！！
                    </div>
                  </el-form-item>
                </div>
              </el-form>
            </div>
          </el-tab-pane>

          <!----------- tab6 -------------文件配置---------------->

          <el-tab-pane label="文件配置" name="tab7">
            <div style="margin-left: 130px">
              <el-button type="primary" plain @click="addFileInfo">添加行</el-button>
              <el-button @click="saveTemplate" type="primary">保存</el-button>
              <el-button>取消</el-button>
            </div>
            <div class="mt-20">
              <el-form :modal="fileConfigInfo" label-width="110px" :inline="true">
                <template v-for="(fileInfo, index) in fileConfigInfo.fileList">
                  <el-form-item label="标题：">
                    <el-input v-model="fileInfo.label" placeholder="按钮名称"></el-input>
                  </el-form-item>

                  <el-form-item label="说明：">
                    <el-input v-model="fileInfo.remark" placeholder="文件说明"></el-input>
                  </el-form-item>

                  <el-button type="danger" plain @click="deleteFileInfo(index)">删除</el-button>
                  <i class="hr"></i>
                </template>
              </el-form>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'

import { mapMutations } from 'vuex'

import { BankInfoList } from '@/utils/constants'

export default {
  name: 'TemplateCreate',
  components: { Tinymce },
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,

      id: '', // 表明当前是 新建的，还是 预览之前的
      activeName: 'tab1',

      predefineColors: [
        '#ff4500',
        '#ff8c00',
        '#ffd700',
        '#90ee90',
        '#00ced1',
        '#1e90ff',
        '#c71585',
        'rgba(255, 69, 0, 0.68)',
        'rgba(22, 212, 107, 1)',
        'rgb(255, 120, 0)',
        'hsv(51, 100, 98)',
        'hsva(120, 40, 94, 0.5)',
        'hsl(181, 100%, 37%)',
        'hsla(209, 100%, 56%, 0.73)',
        '#c7158577'
      ],

      baseProp: {
        title: '微信支付',
        logoIndex: 0,
        //预定义颜色
        headBgColor: '#16d46b',
        isHideOrderNum: false,
        isHaveRemark: true,
        remarkText: '验证码',

        isShowPopup: true, // 是否显示提示弹窗口
        popupTitle: '', // 提示窗口标题
        popFormat: '1',
        popupFilterWord: '', // 提示窗口过滤词

        isShowTeach: true, // 是否显示教程弹窗
        teachBtnTxt: '查看教程',
        teachContent: '', // 教程内容
        isTeachEnable: false, // 是否显示教程按钮
        isOnlineServer: false // 是否显示在线客服
      },

      componentsConfig: {
        isBankEnable: false // 银行组件
      },

      // 文本配置
      textConfigInfo: {
        textConfigInfoList: [
          {
            label: '标题',
            isShow: true,
            showType: '0',
            paramsName: '',
            length: 2,
            isRequest: true, // 是否必填
            id: 'text' + Date.now()
          }
        ]
      },

      // 提交信息
      submitConfigInfo: {
        submitConfigInfoList: [
          {
            label: '标题',
            showType: '0',
            checklist: '0',
            id: 'text' + Date.now()
          }
        ]
      },

      // 按钮配置
      buttonConfigInfo: {
        isEnable: true,
        btnList: [
          {
            label: '按钮',
            showModes: ['1'], // 1 按钮 2 二维码
            jumpUrl: '',
            paramsList: [
              {
                params: 'appId',
                paramsName: '应用ID',
                remark: 'remark',
                id: 'para' + Date.now()
              }
            ],
            id: 'text' + Date.now()
          }
        ],
        id: 'text' + Date.now()
      },

      // 二维码配置
      qrCodeConfigInfo: {
        isEnable: true,
        isShow: false,
        parseMode: 1
      },

      // 二维码配置
      fileConfigInfo: {
        fileList: [
          {
            label: '标题',
            remark: '说明',
            id: 'file' + Date.now()
          }
        ]
      },
      // 上传文件
      fileList: [],
      // logoUrl: [
      //   { name: 'weixin-pay.png', label: '微信支付' },
      //   { name: 'zhifu-pay.png', label: '支付宝支付' },
      //   { name: 'zhongguo-pay.png', label: '中国银行' },
      //   { name: 'gongshang-pay.png', label: '工商银行' }
      // ]
      logoUrl: BankInfoList
    }
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },

    addParams(btnInfo) {
      btnInfo.paramsList.push({
        params: 'appId',
        paramsName: '应用ID',
        remark: 'remark',
        id: 'para' + Date.now()
      })
    },

    deleteParams(btnInfo, index) {
      btnInfo.paramsList.splice(index, 1)
    },

    addFileInfo() {
      this.fileConfigInfo.fileList.push({
        label: '标题',
        id: 'file' + Date.now()
      })
    },
    deleteFileInfo(index) {
      this.fileConfigInfo.fileList.splice(index, 1)
    },
    //------ 按钮配置信息
    addBtnInfo() {
      this.buttonConfigInfo.btnList.push({
        label: '按钮',
        showModes: ['1'], // 1 按钮 2 二维码
        jumpUrl: '',
        paramsList: [
          {
            params: 'appId',
            paramsName: '应用ID',
            remark: 'remark',
            id: 'para' + Date.now()
          }
        ],
        id: 'text' + Date.now()
      })
    },
    deleteBtnInfo(index) {
      this.buttonConfigInfo.btnList.splice(index, 1)
    },

    // ----- 文本配置
    addText() {
      this.textConfigInfo.textConfigInfoList.push({
        label: '标题',
        isShow: true,
        showType: '0',
        paramsName: '',
        length: 2,
        isRequest: true, // 是否必填
        id: 'text' + Date.now()
      })
    },
    deleteText(index) {
      this.textConfigInfo.textConfigInfoList.splice(index, 1)
    },

    //------ 提交信息
    addSubmitInfo() {
      this.submitConfigInfo.submitConfigInfoList.push({
        label: '标题',
        showType: '0',
        checklist: '0',
        id: 'submit' + Date.now()
      })
    },
    deleteSubmitInfo(index) {
      this.submitConfigInfo.submitConfigInfoList.splice(index, 1)
    },

    handleClick(tab, event) {
      console.log(tab, event)
    },

    ...mapMutations({
      addTemplate: 'gcode-state/addTemplateList'
    }),

    // deleteUpFile(item) {
    //   let index = this.uploadFileList.findIndex((ele) => ele.id == item.id)
    //   this.uploadFileList.splice(index, 1)
    // },
    // addUpFile() {
    //   this.uploadFileList.push({
    //     id: Date.now() + 11,
    //     label: '',
    //     fileLabel: ''
    //   })
    // },

    // addImage() {
    //   this.imageCompList.push({
    //     type: 'image',
    //     text: '图片',
    //     file: null, // 图片文件
    //     url: null, // 图片地址
    //     id: 'image' + Date.now()
    //   })
    // },
    // addQrCode() {
    //   this.isShowQrCode = true
    // },
    // deleteQrCode() {
    //   this.isShowQrCode = false
    //   this.currSelectCompName = 'body'
    // },
    // addInputLine() {
    //   this.inputCompList.push({
    //     label: '提示',
    //     value: '',
    //     id: 'input' + Date.now()
    //   })
    // },
    // deleteInput(index) {
    //   this.inputCompList.splice(index, 1)
    //   if (this.inputCompList.length == 0) {
    //     this.currSelectCompName = 'body'
    //   }
    // },
    // addButton() {
    //   this.buttonCompList.push({
    //     label: '按钮',
    //     isPlain: false,
    //     buttonType: 'primary',
    //     id: 'button' + Date.now()
    //   })
    // },
    // deleteButton(index) {
    //   this.buttonCompList.splice(index, 1)
    //   if (this.buttonCompList.length == 0) {
    //     this.currSelectCompName = 'body'
    //   }
    // },
    saveTemplate() {
      // 保存模板
      // 预览页面
      let templateData = {
        id: this.id,
        baseProp: this.baseProp,
        componentsConfig: this.componentsConfig,
        textConfigInfo: this.textConfigInfo,
        submitConfigInfo: this.submitConfigInfo,
        buttonConfigInfo: this.buttonConfigInfo,
        qrCodeConfigInfo: this.qrCodeConfigInfo,
        fileConfigInfo: this.fileConfigInfo
      }

      this.addTemplate(templateData)

      this.$message({
        type: 'success',
        message: '保存成功'
      })
    },
    preview() {
      // 预览页面
      let templateData = {
        id: this.id ,
        baseProp: this.baseProp,
        componentsConfig: this.componentsConfig,
        textConfigInfo: this.textConfigInfo,
        submitConfigInfo: this.submitConfigInfo,
        buttonConfigInfo: this.buttonConfigInfo,
        qrCodeConfigInfo: this.qrCodeConfigInfo,
        fileConfigInfo: this.fileConfigInfo
      }
      localStorage.setItem('templateData', JSON.stringify(templateData))
      window.open('http://localhost:9527/#/template-preview', '_blank')
    },

    // deleteComp(item) {

    //   let currIndex = this.dynamicCompList.findIndex((item) => item.id === this.currSelectCompName)
    //   console.log('----deleteComp------' + currIndex)
    //   if (currIndex > -1) {
    //     this.dynamicCompList.splice(currIndex, 1)
    //   } else {
    //     console.error('找不到当前组件')
    //   }
    //   // 更新 currSelectCompName
    //   this.currSelectCompName = 'main-panel'
    // },
    // moveUp() {
    //   let currIndex = this.dynamicCompList.findIndex((item) => item.id === this.currSelectCompName)
    //   if (currIndex > 0) {
    //     let temp = this.dynamicCompList[currIndex - 1]
    //     this.dynamicCompList[currIndex - 1] = this.dynamicCompList[currIndex]
    //     this.dynamicCompList[currIndex] = temp
    //     this.$set(this.dynamicCompList, currIndex, temp)
    //   }
    // },
    // moveDown() {
    //   let currIndex = this.dynamicCompList.findIndex((item) => item.id === this.currSelectCompName)
    //   if (currIndex < this.dynamicCompList.length - 1) {
    //     // this.dynamicCompList.splice(currIndex, 1)
    //     // this.dynamicCompList.splice(currIndex + 1, 0, this.currSelectComp)
    //     // [this.dynamicCompList[currIndex], this.dynamicCompList[currIndex + 1]] = [this.dynamicCompList[currIndex + 1], this.dynamicCompList[currIndex]]

    //     let temp = this.dynamicCompList[currIndex]
    //     this.dynamicCompList[currIndex] = this.dynamicCompList[currIndex + 1]
    //     this.dynamicCompList[currIndex + 1] = temp
    //     this.$set(this.dynamicCompList, currIndex + 1, temp)

    //   }
    // },
    onImageChange(file, filelist) {
      let currIndex = this.imageCompList.findIndex((item) => item.id === this.currSelectCompName)
      if (currIndex > -1) {
        let currItem = this.imageCompList[currIndex]
        currItem.file = file

        if (file) {
          const reader = new FileReader()
          reader.onload = (e) => {
            currItem.url = e.target.result
          }
          reader.readAsDataURL(file.raw)
        }
      } else {
        console.error('找不到当前图片')
      }
    },
    onImageRemove() {
      let currIndex = this.imageCompList.findIndex((item) => item.id === this.currSelectCompName)
      this.imageCompList[currIndex].file = null
    }
  },
  created() {
    console.log('this.$store.state[gcode-state].currEditIndex : ' + this.$store.state['gcode-state'].currEditIndex);
    
    if (this.$store.state['gcode-state'].currEditIndex != -1) {
      let templateData =
        this.$store.state['gcode-state'].templateList[
          this.$store.state['gcode-state'].currEditIndex
        ]
        console.log('-----templateData------');
        console.log(templateData);
        
        
      if (templateData) {
        // this.id = templateData.id
        // this.baseProp = templateData.baseProp
        // this.componentsConfig = templateData.componentsConfig
        // this.textConfigInfo = templateData.textConfigInfo
        // this.submitConfigInfo = templateData.submitConfigInfo
        // this.buttonConfigInfo = templateData.buttonConfigInfo
        // this.qrCodeConfigInfo = templateData.qrCodeConfigInfo
        // this.fileConfigInfo = templateData.fileConfigInfo
        Object.assign(this, templateData)
      }
    }else{
      // 新建模板
      this.id = Date.now()
    }
  }
}
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}

.container {
  width: 100%;
  min-height: calc(100vh - 180px);
  // background-color: aquamarine;
  padding: 20px;

  .tt {
    font-size: 16px;
    margin-bottom: 20px;
  }

  .body {
    display: flex;
    align-items: stretch;
    min-height: calc(100vh - 165px);
  }
  .preview {
    width: 500px;
    // height: 400px;
    background-color: #f1f1f1;
    padding-bottom: 30px;

    .tip {
      text-align: center;
    }
    .main {
      width: 400px;
      min-height: 400px;
      margin: 0 auto;
      margin-top: 10px;

      .logo {
        width: 100%;
        height: 100px;
        background-color: #16d46b;
        border-radius: 20px 20px 0 0;
        display: flex;
        justify-content: center;
        align-items: center;
        .title {
          font-size: 20px;
          color: #fff;
        }
      }

      .base-info {
        text-align: center;
        .order-money {
          color: red;
          font-weight: bold;
          padding-bottom: 15px;
        }
      }

      .txt-info-item {
        display: flex;
        align-items: center;
        span {
          flex: 1;
        }
      }
      .submit-info-item {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .btn-info {
        // display: flex;
        // width: 100%;
        // justify-content: center;
        text-align: center;
        .btn-info-item {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
      }
    }
  }
  .config {
    flex: 1;
    // height: 100%;
    // background-color: #f1f1f1;
    margin: 0 15px 0 20px;
    padding: 0 30px;

    .rich-txt {
      ::v-deep .el-form-item__content {
        width: calc(100% - 130px);
      }
    }

    .base-config {
      ::v-deep .el-select-dropdown__item {
        display: flex;
        align-items: center;
        height: 40px;
        text-align: left;
        padding-left: 10px;
        margin: 5px;
      }
    }
  }
}
</style>
