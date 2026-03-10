<template>
  <div class="container">
    <!-- <div class="tt">自定义收银台模板</div> -->
    <div class="body">
      <div class="preview" style="display: none">
        <div class="tip" style="color: green; margin: 20px auto">
          该效果仅供大致预览，具体效果请前往收银台查看
        </div>

        <div class="main">
          <!-- <div class="logo" :style="{ background: baseInfo.themeColor }"> -->
          <div class="logo" :style="{ background: `#42b983` }">
            <!-- <img
              style="height: 50px; margin-right: 15px"
              :src="
                require('@/assets/img_bank/' +
                  this.logoUrl[+this.baseInfo.templateTitleLogoUrl].icon)
              "
              alt=""
            /> -->
            <span class="title">{{ baseInfo.templateTitleName }}</span>
          </div>

          <!-- 基础信息卡片 -->
          <el-card class="base-info mt-20">
            <div class="order-money">订单金额：￥100</div>
            <span class="hr"></span>
            <div style="line-height: 26px" v-if="baseInfo.isShowTransferRemark">
              {{ baseInfo.transferRemarkTitle }}：88888
            </div>
            <div style="line-height: 26px" v-if="baseInfo.isShowMerchantOrderNo">订单号：xxxx</div>
            <div style="line-height: 26px">请在 <span style="color: blue">xxx</span> 秒内支付</div>
          </el-card>

          <!-- 文本信息卡片 -->
          <el-card
            class="text-info mt-20"
            v-if="textConfigInfo.texts.filter((el) => el.isShow).length > 0"
          >
            <div
              class="txt-info-item"
              style="line-height: 26px; text-align: center"
              v-for="info in textConfigInfo.texts.filter((el) => el.isShow)"
              :key="info.id"
            >
              <span style="text-align: right"
                >{{ info.textTitle }} <span v-if="info.textTitle.length > 0">：</span></span
              >
              <span style="text-align: left"
                ><span style="margin-right: 20px">文本值</span>
                <el-button type="text">复制</el-button></span
              >
            </div>
          </el-card>

          <!-- 二维码卡片 -->
          <el-card class="text-info mt-20" v-if="qrConfig.isActive && qrConfig.isShow">
            <div style="text-align: center">
              <img src="@/assets/img/qr-code.png" width="160" alt="" class="mt-10" />
            </div>
          </el-card>

          <!-- 提交信息卡片 -->
          <el-card class="submit-info mt-20" v-if="submitConfigInfo.submitConfigs.length > 0">
            <div
              class="submit-info-item"
              v-for="info in submitConfigInfo.submitConfigs"
              :key="info.id"
              style="margin-bottom: 20px"
            >
              <div class="mr-10" style="width: 30%; text-align: right">
                <span>{{ info.submitTitle }}</span>
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

          <!-- 银行组件卡片 -->
          <el-card class="mt-20" v-if="componentsConfig.components.length > 0">
            <div class="bank-box">
              <div class="btn-info" v-for="bank in componentsConfig.components" :key="bank.id">
                <div class="btn-info-item">
                  <!-- <img
                    style="height: 80px; margin: 10px"
                    :src="require('@/assets/img_bank/' + logoUrl[+bank.buttonLogoUrl].icon)"
                    alt=""
                  /> -->
                  <!-- <div id="qrcode"></div> -->
                  <span style="font-size: 18px">{{ bank.buttonTitle }}</span>
                </div>
              </div>
            </div>
          </el-card>

          <!-- 按钮信息卡片 -->
          <el-card class="mt-20" v-if="buttonConfigInfo.buttons.length > 0">
            <div class="btn-info" v-for="info in buttonConfigInfo.buttons" :key="info.id">
              <div class="btn-info-item">
                <img
                  v-if="info.showType == 1 || info.showType == 2"
                  src="@/assets/img/qr-code.png"
                  width="90"
                  alt=""
                  class="mt-10"
                />
                <span v-if="info.showType == 2" style="color: red; font-size: 10px; margin: 8px"
                  >点击跳转，或者 扫码跳转</span
                >
                <el-button
                  v-if="info.showType == 0 || info.showType == 2"
                  type="primary"
                  style="width: 30%; margin-bottom: 10px"
                  >{{ info.buttonTitle }}</el-button
                >
              </div>
            </div>
          </el-card>

          <el-card class="mt-20" v-if="baseInfo.isOnlineService">
            <div class="btn-info">
              <div class="btn-info-item">
                <el-button type="success" style="width: 30%; margin-bottom: 10px"
                  >在线客服</el-button
                >
              </div>
            </div>
          </el-card>

          <el-card class="mt-20 pay-course" v-if="baseInfo.isPaymentTutorial">
            <div class="title">支付教程:</div>
            <div class="content" v-html="baseInfo.paymentTutorialUrl"></div>
          </el-card>
        </div>
      </div>

      <div class="config">
        <el-tabs
          v-model="activeName"
          @tab-click="handleClick"
          type="border-card"
          :before-leave="beforeTabSwitch"
        >
          <!----------------- tab1 ------基础信息配置------ -->

          <el-tab-pane label="基础信息配置" name="tab1">
            <div style="margin-left: 130px">
              <el-button @click="saveTemplate" type="primary">保存</el-button>
              <!-- <el-button>取消</el-button> -->
            </div>
            <div class="mt-20 base-config">
              <el-form
                ref="baseInfoRef"
                :rules="rules"
                :model="baseInfo"
                label-width="130px"
                :inline="true"
              >
                <el-form-item label="模板名称:" prop="templateName" :rules="templateNameRules">
                  <el-input v-model="baseInfo.templateName" placeholder="输入模板名称"></el-input>
                </el-form-item>

                <el-form-item label="模板标题:" prop="templateTitleName">
                  <el-input
                    v-model="baseInfo.templateTitleName"
                    placeholder="输入模板标题"
                  ></el-input>
                </el-form-item>

                <el-form-item label="模板logo:" prop="templateTitleLogoUrl">
                  <el-select
                    filterable
                    v-model="baseInfo.templateTitleLogoUrl"
                    placeholder="请选择"
                    :popper-append-to-body="false"
                  >
                    <el-option
                      v-for="(item, index) in logoUrl"
                      :key="index"
                      :value="item.value"
                      :label="item.name"
                    >
                      <img
                        class="mr-5"
                        v-if="item.icon"
                        style="height: 100%"
                        :src="require('@/assets/img_bank/' + logoUrl[index].icon)"
                        alt=""
                      />
                      <div
                        :style="{
                          textAlign: item.icon ? 'left' : 'center',
                          width: item.icon ? 'auto' : '100%'
                        }"
                      >
                        {{ item.name }}
                      </div>
                    </el-option>
                  </el-select>
                </el-form-item>

                <el-form-item
                  label="上传logo："
                  prop="userLogoFile"
                  :rules="userLogoFileRules"
                  v-if="baseInfo.templateTitleLogoUrl == 'user'"
                >
                  <div style="width: 100px">
                    <el-upload
                      class="uploadLogo"
                      :on-preview="handlePictureCardPreview"
                      :on-remove="handleRemoveLogo"
                      :on-success="handleSuccessLogo"
                      :before-upload="beforeUpload"
                      :auto-upload="true"
                      :http-request="uploadImage"
                      accept="image/*"
                      :limit="1"
                      action="#"
                      list-type="picture-card"
                      :file-list="baseInfo.userLogoFile"
                    >
                      <!-- <el-button slot="trigger" size="small" type="primary">选取文件</el-button> -->
                      <i v-if="baseInfo.userLogoFile.length == 0" class="el-icon-plus"></i>
                      <!-- <div v-if="baseInfo.userLogoFile.length == 0" slot="tip" class="el-upload__tip">上传logo图片</div> -->
                    </el-upload>
                  </div>
                </el-form-item>

                <el-form-item label="选择主题：" prop="themeColor">
                  <div style="width: 150px">
                    <!-- <el-color-picker
                      v-model="baseInfo.themeColor"
                      :show-alpha="false"
                      color-format="hex"
                      :predefine="predefineColors"
                    >
                    </el-color-picker> -->
                    <el-select filterable v-model="baseInfo.themeColor" placeholder="请选择主题">
                      <el-option value="0" label="默认主题"> </el-option>
                      <el-option value="1" label="支付宝主题"> </el-option>
                      <el-option value="7" label="支付宝无框主题"> </el-option>
                      <el-option value="8" label="支付宝名片"> </el-option>
                      <el-option value="19" label="支付宝复制转账无跳转"> </el-option>
                      <el-option value="20" label="支付宝转卡"> </el-option>
                      <el-option value="2" label="微信主题"> </el-option>
                      <el-option value="9" label="微信无框主题"> </el-option>
                      <el-option value="22" label="微信加好友"> </el-option>
                      <el-option value="21" label="微信无框XY"> </el-option>
                      <el-option value="10" label="抖音红包"> </el-option>
                      <el-option value="18" label="淘宝代付直接付"> </el-option>
                      <el-option value="11" label="鸿蒙主题"> </el-option>
                      <el-option value="3" label="QQ主题"> </el-option>
                      <el-option value="4" label="数字人民币主题"> </el-option>
                      <el-option value="5" label="宝盛主题"> </el-option>
                      <el-option value="6" label="USDT主题"> </el-option>
                      <el-option value="17" label="USDT人民币主题"> </el-option>
                      <el-option value="12" label="链接自动跳转"> </el-option>
                      <el-option value="13" label="聊天室自动跳转"> </el-option>
                      <el-option value="15" label="聊天室频道列表"> </el-option>
                      <el-option value="14" label="聚合支付"> </el-option>
                      <el-option value="16" label="亮点主题"> </el-option>
                      <el-option value="23" label="支付宝邮箱回执"> </el-option>
                    </el-select>
                  </div>
                </el-form-item>

                <span class="hr"></span>

                <el-form-item label="教程弹窗：">
                  <el-switch
                    v-model="baseInfo.isTutorialPopup"
                    active-text="开启"
                    inactive-text="关闭"
                  >
                  </el-switch>
                </el-form-item>

                <el-form-item
                  label="教程按钮名称："
                  v-if="baseInfo.isTutorialPopup"
                  prop="tutorialButtonName"
                >
                  <el-input v-model="baseInfo.tutorialButtonName" placeholder="输入名称">
                  </el-input>
                </el-form-item>

                <div>
                  <el-form-item
                    label="添加教程："
                    v-if="baseInfo.isTutorialPopup"
                    prop="tutorialFilesUrl"
                  >
                    <!-- :on-change="handleChange" -->
                    <el-upload
                      :on-preview="handlePictureCardPreview"
                      :on-remove="handleRemove"
                      :on-exceed="handleExceed"
                      :on-success="handleSuccess"
                      :before-upload="beforeUpload"
                      :auto-upload="true"
                      :http-request="uploadImage"
                      accept="image/*"
                      multiple
                      :limit="5"
                      action="#"
                      list-type="picture-card"
                      :file-list="baseInfo.tutorialFilesUrl"
                    >
                      <!-- <el-button slot="trigger" size="small" type="primary">选取文件</el-button> -->
                      <i class="el-icon-plus"></i>
                      <div slot="tip" class="el-upload__tip">只能上传图片，1-5 张</div>
                    </el-upload>
                  </el-form-item>
                </div>

                <i class="hr"></i>

                <el-form-item label="提交弹窗：">
                  <el-switch v-model="baseInfo.submitPopup" active-text="开启" inactive-text="关闭">
                  </el-switch>
                </el-form-item>
                <el-form-item label="提交标题：" v-if="baseInfo.submitPopup" prop="submitTitle">
                  <el-input v-model="baseInfo.submitTitle" placeholder="输入标题"> </el-input>
                </el-form-item>
                <el-form-item
                  label="提交检验格式："
                  v-if="baseInfo.submitPopup"
                  prop="submitCheckType"
                >
                  <el-select
                    filterable
                    style="width: 120px"
                    v-model="baseInfo.submitCheckType"
                    placeholder="请选择提交检验格式"
                    size="small"
                  >
                    <el-option label="不检测" :value="0"></el-option>
                    <el-option label="数字" :value="1"></el-option>
                    <el-option label="中文" :value="2"></el-option>
                    <el-option label="字母" :value="3"></el-option>
                    <el-option label="邮箱" :value="4"></el-option>
                  </el-select>
                </el-form-item>
                <!-- <el-form-item  label="敏感词过滤：" v-if="baseInfo.isShowPopup">
                  <el-input v-model="baseInfo.popupFilterWord"> </el-input>
                </el-form-item> -->

                <i class="hr"></i>

                <el-form-item label="展示转账备注：">
                  <el-switch
                    v-model="baseInfo.isShowTransferRemark"
                    active-text="开启"
                    inactive-text="关闭"
                  >
                  </el-switch>
                </el-form-item>

                <el-form-item
                  label="文本标题："
                  v-if="baseInfo.isShowTransferRemark"
                  prop="transferRemarkTitle"
                >
                  <el-input v-model="baseInfo.transferRemarkTitle" placeholder="输入标题">
                  </el-input>
                </el-form-item>

                <i class="hr"></i>
                <el-form-item label="展示订单号：" style="margin-bottom: 0">
                  <el-switch
                    v-model="baseInfo.isShowMerchantOrderNo"
                    active-text="开启"
                    inactive-text="关闭"
                  >
                  </el-switch>
                </el-form-item>
                <i class="hr"></i>
                <el-form-item label="在线客服：" style="margin-bottom: 0">
                  <el-switch
                    v-model="baseInfo.isOnlineService"
                    active-text="开启"
                    inactive-text="关闭"
                  >
                  </el-switch>
                </el-form-item>

                <i class="hr"></i>

                <el-form-item label="支付教程：">
                  <el-switch
                    v-model="baseInfo.isPaymentTutorial"
                    active-text="开启"
                    inactive-text="关闭"
                  >
                  </el-switch>
                </el-form-item>

                <el-form-item
                  v-if="baseInfo.isPaymentTutorial"
                  label=""
                  style="width: 100%; padding: 0 20px"
                  label-width="0"
                  class="rich-txt"
                  prop="paymentTutorialUrl"
                >
                  <MyRichText v-model="baseInfo.paymentTutorialUrl"></MyRichText>
                </el-form-item>
              </el-form>
            </div>
          </el-tab-pane>

          <!--------------- tab2 --------组件配置------------>

          <el-tab-pane label="组件配置" name="tab2">
            <div style="margin-left: 130px">
              <el-button type="primary" plain @click="addBankConfig">添加组件</el-button>
              <el-button @click="saveTemplate" type="primary">保存配置</el-button>

              <!-- <el-button @click="resetConfig()">重置</el-button> -->
            </div>

            <div class="mt-20 bankconfig">
              <el-form
                ref="componentsConfigRef"
                :rules="rules"
                :model="componentsConfig"
                label-width="110px"
                :inline="true"
              >
                <template v-if="componentsConfig.components.length > 0">
                  <div :key="index" v-for="(bank, index) in componentsConfig.components">
                    <!-- :rules="[
                        {required: true, message: '请输入组件名称', trigger: 'blur'},
                        {min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur'}
                      ]" -->
                    <el-form-item
                      label="组件名称："
                      :prop="`components.${index}.buttonTitle`"
                      :rules="rules.buttonTitle"
                    >
                      <el-input v-model="bank.buttonTitle" placeholder="组件名称"></el-input>
                    </el-form-item>

                    <el-form-item
                      label="组件地址："
                      :prop="`components.${index}.buttonUrl`"
                      :rules="rules.buttonUrl"
                    >
                      <el-input v-model="bank.buttonUrl" placeholder="组件地址"></el-input>
                    </el-form-item>

                    <el-form-item
                      label="组件图标:"
                      :prop="`components.${index}.buttonLogoUrl`"
                      :rules="rules.buttonLogoUrl"
                    >
                      <el-select filterable v-model="bank.buttonLogoUrl" placeholder="请选择">
                        <el-option value="0" label="银行卡组件"></el-option>
                        <!-- <el-option
                          v-for="(item, index) in logoUrl"
                          :key="index"
                          :value="'' + index"
                          :label="item.name"
                        >
                          <img
                            class="mr-5"
                            style="height: 100%"
                            :src="require('@/assets/img_bank/' + logoUrl[index].icon)"
                            alt=""
                          />
                          <span>{{ item.name }}</span>
                        </el-option> -->
                      </el-select>
                    </el-form-item>
                    <el-button
                      type="danger"
                      style="margin: 0 30px"
                      plain
                      @click="deleteBankInfo(index)"
                      >删除</el-button
                    >
                    <i class="hr"></i>
                  </div>
                </template>
              </el-form>
            </div>
          </el-tab-pane>

          <!--------------- tab3 --------提交信息配置------------>
          <el-tab-pane label="提交信息配置" name="tab3">
            <div style="margin-left: 130px">
              <el-button type="primary" plain @click="addSubmitInfo">添加行</el-button>
              <el-button @click="saveTemplate" type="primary">保存配置</el-button>
              <!-- <el-button @click="resetConfig()">重置</el-button> -->
            </div>
            <div class="mt-20">
              <el-form
                ref="submitConfigInfoRef"
                :model="submitConfigInfo"
                :rules="rules"
                label-width="110px"
                :inline="true"
              >
                <div :key="index" v-for="(submitInfo, index) in submitConfigInfo.submitConfigs">
                  <el-form-item
                    label="标题："
                    :prop="`submitConfigs.${index}.submitTitle`"
                    :rules="rules.submitTitle"
                  >
                    <el-input v-model="submitInfo.submitTitle" placeholder="标题"></el-input>
                  </el-form-item>

                  <el-form-item
                    label="显示类型："
                    :prop="`submitConfigs.${index}.showType`"
                    :rules="rules.showType"
                  >
                    <el-select
                      filterable
                      v-model="submitInfo.showType"
                      placeholder="请选择显示类型"
                      size="small"
                    >
                      <el-option label="文本框" :value="0"></el-option>
                      <el-option label="图片上传" :value="1"></el-option>
                      <!-- <el-option label="邮箱" :value="2"></el-option> -->
                    </el-select>
                  </el-form-item>

                  <el-form-item
                    label="校验规则："
                    :prop="`submitConfigs.${index}.checkType`"
                    :rules="rules.checkType"
                  >
                    <el-select
                      filterable
                      v-model="submitInfo.checkType"
                      placeholder="请选择校验规则"
                      size="small"
                    >
                      <!-- （0-不校验、1-数值、2-中文、3、字母、4-邮箱） -->
                      <el-option label="不校验" :value="0"></el-option>
                      <el-option label="数值" :value="1"></el-option>
                      <el-option label="中文" :value="2"></el-option>
                      <el-option label="字母" :value="3"></el-option>
                      <el-option label="邮箱" :value="4"></el-option>
                    </el-select>
                  </el-form-item>

                  <el-button type="danger" plain @click="deleteSubmitInfo(index)">删除</el-button>
                  <i class="hr"></i>
                </div>
              </el-form>
            </div>
          </el-tab-pane>

          <!----------------- tab4 -----文本信息配置------- -->

          <el-tab-pane label="文本信息配置" name="tab4">
            <div style="margin-left: 130px">
              <el-button type="primary" plain @click="addText">添加行</el-button>
              <el-button @click="saveTemplate" type="primary">保存配置</el-button>
              <!-- <el-button @click="resetConfig()">重置</el-button> -->
            </div>
            <div class="mt-20">
              <el-form
                ref="textConfigInfoRef"
                :model="textConfigInfo"
                label-width="80px"
                :inline="true"
              >
                <div :key="index" v-for="(textInfo, index) in textConfigInfo.texts">
                  <el-form-item
                    label="标题："
                    :prop="`texts.${index}.textTitle`"
                    :rules="rules.textTitle"
                  >
                    <el-input v-model="textInfo.textTitle" placeholder="标题"></el-input>
                  </el-form-item>

                  <el-form-item
                    label="支付页面显示："
                    label-width="120px"
                    :prop="`texts.${index}.isShow`"
                    :rules="rules.isShow"
                  >
                    <el-switch v-model="textInfo.isShow" active-text="开启" inactive-text="关闭">
                    </el-switch>
                  </el-form-item>

                  <el-form-item label="参数：">
                    <el-input v-model="textInfo.textCode" placeholder="参数"></el-input>
                  </el-form-item>

                  <el-form-item label="说明" :prop="`texts.${index}.remark`" :rules="rules.remark">
                    <el-input v-model="textInfo.remark" placeholder="说明"> </el-input>
                  </el-form-item>

                  <!-- <el-form-item  label="显示类型：">
                    <el-select
                      v-model="textInfo.showType"
                      placeholder="请选择显示类型"
                      size="small"
                    >
                      <el-option label="文本框" value="0"></el-option>
                      <el-option label="邮箱" value="1"></el-option>
                    </el-select>
                  </el-form-item> -->

                  <!-- <el-form-item  label="参数名称：">
                    <el-input v-model="textInfo.paramTitle" placeholder="参数"> </el-input>
                  </el-form-item>

                  <el-form-item  label="长度限制：">
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
                    <el-checkbox v-model="textInfo.isRequired" :true-label="1" :false-label="0"
                      >必填</el-checkbox
                    >
                  </el-form-item>

                  <el-button type="danger" plain @click="deleteText(index)">删除</el-button>
                  <i class="hr"></i>
                </div>
              </el-form>
            </div>
          </el-tab-pane>

          <!----------- tab5 -------------按钮配置---------------->

          <el-tab-pane label="按钮配置" name="tab5">
            <div style="margin-left: 130px">
              <el-button type="primary" plain @click="addBtnInfo">添加按钮</el-button>
              <el-button @click="saveTemplate()" type="primary">保存配置</el-button>
              <!-- <el-button @click="resetConfig()">重置</el-button> -->
            </div>
            <div class="mt-20">
              <el-form
                ref="buttonConfigInfoRef"
                :model="buttonConfigInfo"
                label-width="110px"
                :inline="true"
              >
                <!-- <div>
                  <el-form-item  label="按钮开关：">
                    <el-switch
                      v-model="buttonConfigInfo.isActive"
                      active-text="开启"
                      inactive-text="关闭"
                    >
                    </el-switch>
                  </el-form-item>
                </div> -->

                <template v-if="buttonConfigInfo.buttons.length > 0">
                  <div :key="index1" v-for="(btnInfo, index1) in buttonConfigInfo.buttons">
                    <i class="hr"></i>
                    <el-form-item
                      label="按钮名称："
                      :prop="`buttons.${index1}.buttonTitle`"
                      :rules="rules.buttonTitle"
                    >
                      <el-input v-model="btnInfo.buttonTitle" placeholder="按钮名称"></el-input>
                    </el-form-item>

                    <el-form-item label="跳转地址：">
                      <!-- :rules="rules.buttonUrl" -->
                      <!-- :prop="`buttons.${index1}.buttonUrl`" -->
                      <el-input v-model="btnInfo.buttonUrl" placeholder="跳转地址"></el-input>
                    </el-form-item>

                    <el-form-item
                      label="显示形态："
                      :prop="`buttons.${index1}.showType`"
                      :rules="rules.showType"
                    >
                      <el-radio-group v-model="btnInfo.showType">
                        <el-radio :label="2">全部</el-radio>
                        <el-radio :label="0">按钮</el-radio>
                        <el-radio :label="1">二维码</el-radio>
                      </el-radio-group>
                    </el-form-item>

                    <el-button
                      type="danger"
                      style="margin: 0 30px"
                      plain
                      @click="deleteBtnInfo(index1)"
                      >删除按钮</el-button
                    >

                    <el-button type="success" plain @click="addParams(btnInfo)">添加参数</el-button>
                    <!-- <div v-if="btnInfo.buttonParamList.length == 0" class="help-tip">
                      说明：不包含参数的按钮配置，请直接使用组件
                    </div> -->
                    <div v-for="(item, index) in btnInfo.buttonParamList" :key="index">
                      <el-form-item
                        label="参数："
                        :prop="`buttons.${index1}.buttonParamList.${index}.paramCode`"
                        :rules="rules.paramCode"
                      >
                        <el-input
                          size="small"
                          v-model="item.paramCode"
                          placeholder="参数"
                        ></el-input>
                      </el-form-item>

                      <el-form-item
                        label="参数名称："
                        :prop="`buttons.${index1}.buttonParamList.${index}.paramTitle`"
                        :rules="rules.paramTitle"
                      >
                        <el-input
                          size="small"
                          v-model="item.paramTitle"
                          placeholder="参数名称"
                        ></el-input>
                      </el-form-item>

                      <el-form-item label="说明：">
                        <el-input
                          size="small"
                          v-model="item.remark"
                          placeholder="说明文字"
                        ></el-input>
                      </el-form-item>

                      <el-form-item label="">
                        <el-checkbox v-model="item.isShow" :true-label="1" :false-label="0"
                          >是否展示</el-checkbox
                        >
                      </el-form-item>

                      <el-button type="danger" @click="deleteParams(btnInfo, index)"
                        >删除参数</el-button
                      >
                      <!-- <i class="hr"></i> -->
                    </div>
                  </div>
                </template>
              </el-form>
            </div>
          </el-tab-pane>

          <!----------- tab6 -------------二维码配置---------------->

          <el-tab-pane label="二维码配置" name="tab6">
            <div style="margin-left: 130px">
              <el-button @click="saveTemplate" type="primary">保存配置</el-button>
              <!-- <el-button>取消</el-button> -->
            </div>
            <div class="mt-20" style="margin-left: 30px">
              <el-form :model="qrConfig" label-width="110px" :inline="true">
                <el-form-item label="开关状态：">
                  <el-switch v-model="qrConfig.isActive" active-text="开启" inactive-text="关闭">
                  </el-switch>
                </el-form-item>

                <el-form-item label="显示系统二维码：" v-if="qrConfig.isActive" label-width="150" >
                  <el-switch v-model="qrConfig.isShow" active-text="开启" inactive-text="关闭">
                  </el-switch>
                </el-form-item>
                
              </el-form>
            </div>
          </el-tab-pane>

          <!----------- tab7 -------------文件配置---------------->

          <el-tab-pane label="文件配置" name="tab7">
            <div style="margin-left: 130px">
              <el-button type="primary" plain @click="addFileInfo">添加行</el-button>
              <el-button @click="saveTemplate" type="primary">保存配置</el-button>
              <!-- <el-button @click="resetConfig()">重置</el-button> -->
            </div>
            <div class="mt-20">
              <el-form
                ref="fileConfigInfoRef"
                :model="fileConfigInfo"
                label-width="110px"
                :inline="true"
              >
                <div :key="index" v-for="(fileInfo, index) in fileConfigInfo.files">
                  <i class="hr"></i>
                  <el-form-item
                    label="标题："
                    :prop="`files.${index}.fileTitle`"
                    :rules="rules.fileTitle"
                  >
                    <el-input v-model="fileInfo.fileTitle" placeholder="输入标题"></el-input>
                  </el-form-item>

                  <el-form-item
                    label="文件编码："
                    :prop="`files.${index}.fileCode`"
                  >
                    <el-input v-model="fileInfo.fileCode" placeholder="输入文件编码" maxlength="64"></el-input>
                  </el-form-item>

                  <el-form-item label="说明：">
                    <el-input v-model="fileInfo.remark" placeholder="文件说明"></el-input>
                  </el-form-item>

                  <el-form-item label="是否必填：">
                    <el-switch v-model="fileInfo.isRequired" :active-value="1" :inactive-value="0" active-text="是" inactive-text="否">
                    </el-switch>
                  </el-form-item>

                  <el-form-item label="是否显示：">
                    <el-switch v-model="fileInfo.isShow" :active-value="1" :inactive-value="0" active-text="是" inactive-text="否">
                    </el-switch>
                  </el-form-item>

                  <el-button type="danger" plain @click="deleteFileInfo(index)">删除</el-button>
                </div>
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
import { mapMutations } from 'vuex'

import { BankInfoList } from '@/utils/constants'

import MyRichText from '@/components/MyRichText/MyRichText.vue'

import { imageUploadServer } from '@/settings'

import { templateRules } from './rules'

import { deepCopy } from '@/utils/'

import { getFileById, uploadFileToServer } from '@/api/upload'

import {
  createTemplate,
  updateTemplate,
  checkTemplateNameUnique,
  getTemplateInfo
} from '@/api/template-create.js'

export default {
  name: 'TemplateCreate',
  components: { MyRichText },
  computed: {
    imageUploadServer() {
      return imageUploadServer
    }
  },
  data() {
    return {
      rules: templateRules,

      userLogoFileRules: [
        // { required: true, message: '请选择logo11', trigger: 'change' },
        {
          required: true,
          validator: async (rules, value, callback) => {
            if (this.baseInfo.userLogoFile.length > 0) {
              return callback()
            } else {
              callback(new Error('请选择logo'))
            }
          },
          trigger: 'change'
        }
      ],

      templateNameRules: [
        { required: true, message: '请输入名称', trigger: 'blur' },
        { min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur' },
        {
          validator: async (rules, value, callback) => {
            // 在新增加状态，或者，编辑时，新旧名不一样，才会去验证
            console.log('--this.oldTemplateName---', this.oldTemplateName)
            console.log('--this.baseInfo.templateName---', this.baseInfo.templateName)
            console.log('--this.cashTemplateId---', this.cashTemplateId)
            if (!this.cashTemplateId || this.oldTemplateName != this.baseInfo.templateName) {
              // 模板名称发生改变， 校验模板名称是否唯一
              try {
                console.log('--联网检查名称是否存在---')
                let res = await checkTemplateNameUnique(this.baseInfo.templateName)

                if (res.data) {
                  // 已经存在，返回 true
                  callback(new Error('模板名称已存在'))
                } else {
                  callback()
                }
              } catch (e) {
                callback()
              } finally {
                callback()
              }
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }
      ],

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
        '#c71585'
      ],

      cashTemplateId: '', // 当前模板  id

      oldTemplateName: null, // 编辑模板时， 模板名称
      baseInfo: {
        templateName: '', // 	模板名称
        tutorialFilesUrl: [], // 教程文件地址
        templateTitleName: '', // 	模板标题名称
        templateTitleLogoUrl: '0',

        userLogoFile: [], // 用户自定义的logo
        //预定义颜色
        isShowMerchantOrderNo: 0,
        themeColor: '0',

        isTutorialPopup: 0, // 是否开启教程弹窗
        tutorialButtonName: '',

        submitPopup: 0, // 是否显示提交弹窗
        submitTitle: '',
        submitCheckType: 0, // 提交检验类型（0 - 不校验、1 - 数值、2 - 中文、3 - 字母、4 - 邮箱）

        isShowTransferRemark: 0, // 是否展示转账备注
        transferRemarkTitle: '',

        isOnlineService: 0, // 是否显示在线客服

        isPaymentTutorial: 0, // 是否显示教程按钮
        paymentTutorialUrl: '', // 教程内容
        isDefault: 1 // 超管创建的 模板为 默认模板  ， 其他用户创建的模板为 非默认模板
      },

      componentsConfig: {
        components: [
          // components
          // {
          //   id: 'bank' + Date.now(),
          //   buttonTitle: '',
          //   buttonLogoUrl: 1,
          //   buttonUrl: 'http://www.qq.com'
          // }
        ]
      },

      // 提交信息
      submitConfigInfo: {
        submitConfigs: [
          // {
          //   submitTitle: '标题',
          //   showType: 0,
          //   checkType: 0,
          //   id: 'text' + Date.now()
          // }
        ]
      },

      // 文本配置
      textConfigInfo: {
        texts: [
          // {
          //   textTitle: '标题',
          //   isShow: 1,
          //   showType: '0',
          //   remark: '',
          //   isRequired: 1, // 是否必填
          //   id: 'text' + Date.now()
          // }
        ]
      },

      // 按钮配置
      buttonConfigInfo: {
        buttons: [
          // {
          //   buttonTitle: '',
          //   showType: 2, // 支付页面显示形式（0 - 按钮、1 - 二维码、2 - 全部）
          //   buttonUrl: '',
          //   buttonParamList: [
          //     {
          //       paramCode: '',
          //       paramTitle: '',
          //       remark: '',
          //       id: 'para' + Date.now()
          //     }
          //   ],
          //   id: 'text' + Date.now()
          // }
        ]
        // id: 'text' + Date.now()
      },

      // 二维码配置
      qrConfig: {
        isActive: 1,
        isShow: 0
        // parseMode: 1
      },

      // 二维码配置
      fileConfigInfo: {
        files: [
          // {
          //   fileTitle: '',
          //   remark: '',
          //   fileCode: '',
          //   isRequired: 0,
          //   isShow: 1,
          //   id: 'file' + Date.now()
          // }
        ]
      },

      logoUrl: BankInfoList,

      backupData: {} // 备份数据
    }
  },
  watch: {
    // 'baseInfo.isPaymentTutorial'(val) {
    //   console.log('isPaymentTutorial : ' + val)
    //   if (val) {
    //     this.$nextTick(() => {
    //       this.$refs.tinymceRef.init({
    //         selector: '#textarea_tiny',
    //         branding: 0,
    //         elementpath: 0,
    //         menubar: 0,
    //         plugins: 'autoresize',
    //         toolbar:
    //           'undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image'
    //       })
    //     })
    //   }
    // }
  },
  methods: {
    beforeTabSwitch(activeName, oldActiveName) {
      if (!this.cashTemplateId) {
        this.$message.error('请先保存模板基础信息配置')
        return false
      }
      return true
    },
    resetConfig() {
      let templateData =
        this.$store.state['gcode-state'].templateList[
          this.$store.state['gcode-state'].currEditTemplateId
        ]
      console.log('-----templateData------')
      console.log(templateData)
      switch (this.activeName) {
        case 'tab1':
          //  this.$refs.baseInfoRef.resetFields()
          // this.baseInfo = templateData.baseInfo
          break
        case 'tab2':
          this.componentsConfig = deepCopy(this.backupData.componentsConfig)
          this.$refs.componentsConfigRef.resetFields()
          break
        case 'tab3':
          this.submitConfigInfo = deepCopy(this.backupData.submitConfigInfo)
          this.$refs.submitConfigInfoRef.resetFields()
          break
        case 'tab4':
          this.textConfigInfo = deepCopy(this.backupData.textConfigInfo)
          this.$refs.textConfigInfoRef.resetFields()
          break
        case 'tab5':
          this.buttonConfigInfo = deepCopy(this.backupData.buttonConfigInfo)
          this.$refs.buttonConfigInfoRef.resetFields()
          break
        case 'tab6':
          // this.submitConfigInfo = this.backupData.submitConfigInfo
          //  this.$refs.textConfigInfoRef.resetFields()
          break
        case 'tab7':
          this.fileConfigInfo = deepCopy(this.backupData.fileConfigInfo)
          this.$refs.fileConfigInfoRef.resetFields()
          break
      }
    },

    deleteBankInfo(index) {
      this.componentsConfig.components.splice(index, 1)
    },
    addBankConfig() {
      console.log('--添加组件--')

      this.componentsConfig.components.push({
        // id: 'bank' + Date.now(),
        buttonTitle: '银行组件',
        buttonLogoUrl: '0',
        buttonUrl: 'http://www.bankcomps.com'
      })
    },
    handleExceed(file, fileList) {
      console.log('--handleExceed---')
      console.log(fileList)
      this.$message({
        message: '最多只能选择5张图片',
        type: 'error'
      })
    },

    async uploadImage(action) {
      try {
        console.log('----uploadImage------', action)
        let res = await uploadFileToServer(action.file)
        console.log('uploadImage - ', res)
        return res
      } catch (e) {
        console.log(e)
      }
    },

    handleChange(file, fileList) {
      console.log('----handleChange------', fileList)
      this.baseInfo.tutorialFilesUrl = fileList
      // 校验 上传
      this.$refs.baseInfoRef.validateField('tutorialFilesUrl')
    },
    async handleSuccess(response, file, fileList) {
      console.log('----handleSuccess------', response)
      console.log('----handleSuccess------', file)
      console.log('----handleSuccess------', fileList)
      this.baseInfo.tutorialFilesUrl = fileList
      const index = this.baseInfo.tutorialFilesUrl.findIndex((ele) => ele.uid == file.uid)

      if (response && response.data) {
        let res = await getFileById(response.data)
        console.log(res)
        // fileList[index].response.url = response.data // data 中 是  ID
        fileList[index].fileId = response.data
        // fileList[index].response.name = res.data.originalName
      } else {
        console.error('上传文件出错，data 为空')

        this.baseInfo.tutorialFilesUrl.splice(index, 1)
      }
      this.$refs.baseInfoRef.validateField('tutorialFilesUrl')
    },

    beforeUpload(file) {
      console.log('----beforeUpload------', file)
      const isImage = file.type.indexOf('image') !== -1
      if (!isImage) {
        this.$message.error('只能上传图片类型的文件！')
        return false
      }
      const isGt4M = file.size > 1024 * 1024 * 4
      if (isGt4M) {
        this.$message.error('上传图片大小不能超过 4MB！')
        return false
      }
      return true
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
      this.baseInfo.tutorialFilesUrl = fileList

      this.$refs.baseInfoRef.validateField('tutorialFilesUrl')
    },

    handleRemoveLogo(file, fileList) {
      console.log(file, fileList)
      this.baseInfo.userLogoFile = fileList
      this.$forceUpdate()
      this.$refs.baseInfoRef.validateField('userLogoFile')
    },
    async handleSuccessLogo(response, file, fileList) {
      console.log('----handleSuccess------', response)
      console.log('----handleSuccess------', file)
      console.log('----handleSuccess------', fileList)
      this.baseInfo.userLogoFile = fileList

      if (response && response.data) {
        let res = await getFileById(response.data)
        this.baseInfo.userLogoFile[0].fileId = response.data
      } else {
        console.error('上传文件出错，data 为空')
        this.baseInfo.userLogoFile.splice(0, 1)
      }
      this.$refs.baseInfoRef.validateField('userLogoFile')
      this.$forceUpdate()
    },

    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },

    addParams(btnInfo) {
      btnInfo.buttonParamList.push({
        paramCode: '',
        paramTitle: '',
        isShow: 1, // 默认展示
        remark: ''
      })
    },

    deleteParams(btnInfo, index) {
      btnInfo.buttonParamList.splice(index, 1)
    },

    addFileInfo() {
      this.fileConfigInfo.files.push({
        fileTitle: '',
        remark: '',
        fileCode: '',
        isRequired: 0,
        isShow: 1
      })
    },
    deleteFileInfo(index) {
      this.fileConfigInfo.files.splice(index, 1)
    },
    //------ 按钮配置信息
    addBtnInfo() {
      this.buttonConfigInfo.buttons.push({
        buttonTitle: '',
        showType: 2, // 1 按钮 2 二维码
        buttonUrl: '',
        buttonParamList: [
          // {
          //   paramCode: '',
          //   paramTitle: '',
          //   remark: ''
          // }
        ]
        // id: 'text' + Date.now()
      })
    },
    deleteBtnInfo(index) {
      this.buttonConfigInfo.buttons.splice(index, 1)
    },

    // ----- 文本配置
    addText() {
      this.textConfigInfo.texts.push({
        textTitle: '',
        isShow: 1,
        // showType: 0,
        remark: '',

        isRequired: 1 // 是否必填
      })
    },
    deleteText(index) {
      this.textConfigInfo.texts.splice(index, 1)
    },

    //------ 提交信息
    addSubmitInfo() {
      this.submitConfigInfo.submitConfigs.push({
        submitTitle: '',
        showType: 0,
        checkType: 0
      })
    },
    deleteSubmitInfo(index) {
      this.submitConfigInfo.submitConfigs.splice(index, 1)
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
    //   this.isShowQrCode = 1
    // },
    // deleteQrCode() {
    //   this.isShowQrCode = 0
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
    //     isPlain: 0,
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
    async saveTemplate() {
      // 保存模板

      try {
        // 校验
        let type = ''

        let putData = {}

        const fileListBackup = this.baseInfo.tutorialFilesUrl
        console.log('fileListBackup : ', JSON.stringify(fileListBackup))

        switch (this.activeName) {
          case 'tab1':
            type = 'base'
            await this.$refs.baseInfoRef.validate()

            // 将 fileId 做为  templateTitleLogoUrl 的值
            if (this.baseInfo.templateTitleLogoUrl == 'user') {
              this.baseInfo.templateTitleLogoUrl = this.baseInfo.userLogoFile[0].fileId
            }

            break
          case 'tab2':
            type = 'component'
            await this.$refs.componentsConfigRef.validate()

            break
          case 'tab3':
            type = 'submit'
            await this.$refs.submitConfigInfoRef.validate()

            break
          case 'tab4':
            type = 'text'
            await this.$refs.textConfigInfoRef.validate()

            break
          case 'tab5':
            type = 'button'

            // 如果有按钮，没有参数，提示，
            // if (this.buttonConfigInfo.buttons.length > 0) {
            // let btnWithoutPara = this.buttonConfigInfo.buttons.filter(
            //   (item) => item.buttonParamList.length == 0
            // )
            // if (btnWithoutPara.length > 0) {
            //   this.$message.error('不包含参数的按钮配置，请直接使用组件!')
            //   return
            // }
            // }

            // if (this.buttonConfigInfo.buttons.length == 0){
            //     this.$message.error('请先添加按钮!')
            //     return
            // }

            await this.$refs.buttonConfigInfoRef.validate()

            break
          case 'tab6':
            type = 'qr'
            // await this.$refs.textConfigInfoRef.validate()

            break
          case 'tab7':
            type = 'file'
            await this.$refs.fileConfigInfoRef.validate()

            break
        }

        //  为  components 添加 sort
        this.componentsConfig.components.forEach((item, index) => {
          item.sort = index
        })
        this.submitConfigInfo.submitConfigs.forEach((item, index) => {
          item.sort = index
        })
        this.textConfigInfo.texts.forEach((item, index) => {
          item.sort = index
        })
        this.buttonConfigInfo.buttons.forEach((item, index) => {
          item.sort = index
          if (item.buttonParamList) {
            item.buttonParamList.forEach((item, index) => {
              item.sort = index
            })
          }
        })
        this.fileConfigInfo.files.forEach((item, index) => {
          item.sort = index
        })

        // 不管更新还是创建，都没有该字段
        delete this.baseInfo.userLogoFile // 接口中没有该字段

        // 提交数据
        if (!this.cashTemplateId) {
          // 创建
          const createData = {
            baseInfo: {
              tenantId: this.$store.state.tenant.currTenantId,
              ...this.baseInfo,
              isDefault: 1, // 超管端为  1
              tutorialFilesUrl:
                fileListBackup && fileListBackup.length > 0
                  ? fileListBackup.map((item) => item.fileId).join(',')
                  : ''
            },
            components: this.componentsConfig.components,
            submitConfigs: this.submitConfigInfo.submitConfigs,
            texts: this.textConfigInfo.texts,
            buttons: this.buttonConfigInfo.buttons,
            qrConfig: this.qrConfig,
            files: this.fileConfigInfo.files
          }

          this.baseInfo.tutorialFilesUrl = fileListBackup

          let res = await createTemplate(createData)

          console.log(res)

          this.cashTemplateId = res.data
          // 保存ID ，以防刷新时丢失
          this.$store.state['gcode-state'].currEditTemplateId = this.cashTemplateId

          this.$message.success('添加成功')

          this.getTemplateDetail()
        } else {
          // 编辑

          putData = {
            baseInfo: {
              tenantId: this.$store.state.tenant.currTenantId,
              ...this.baseInfo,
              cashTemplateId: this.cashTemplateId,
              tutorialFilesUrl:
                fileListBackup && fileListBackup.length > 0
                  ? fileListBackup.map((item) => item.fileId).join(',')
                  : ''
            },
            components: this.componentsConfig.components,
            submitConfigs: this.submitConfigInfo.submitConfigs,
            texts: this.textConfigInfo.texts,
            buttons: this.buttonConfigInfo.buttons,
            qrConfig: {
              ...this.qrConfig
            },
            files: this.fileConfigInfo.files
          }

          this.baseInfo.tutorialFilesUrl = fileListBackup

          await updateTemplate(this.cashTemplateId, putData, type)
          this.$message.success('更新成功')
          this.$confirm(
            '您已对收银台模板进行修改，原收款信息已失效，请重新配置收款信息以确保正常使用。',
            '【系统提示】',
            {
              confirmButtonText: '确定',
              type: 'warning',
              showCancelButton: false
            }
          )
            .then(() => {})
            .catch(() => {})

          this.getTemplateDetail()
        }
      } catch (e) {
        console.log('----校验失败----', e)
        return
      }

      // console.log('----校验通过----')

      // 预览页面
      // let templateData = {
      //   id: this.id,
      //   baseInfo: this.baseInfo,
      //   componentsConfig: this.componentsConfig,
      //   textConfigInfo: this.textConfigInfo,
      //   submitConfigInfo: this.submitConfigInfo,
      //   buttonConfigInfo: this.buttonConfigInfo,
      //   qrConfig: this.qrConfig,
      //   fileConfigInfo: this.fileConfigInfo
      // }

      // this.addTemplate(templateData)

      // this.$message({
      //   type: 'success',
      //   message: '保存成功'
      // })
    },
    // preview() {
    //   // 预览页面
    //   let templateData = {
    //     id: this.id,
    //     baseInfo: this.baseInfo,
    //     componentsConfig: this.componentsConfig,
    //     textConfigInfo: this.textConfigInfo,
    //     submitConfigInfo: this.submitConfigInfo,
    //     buttonConfigInfo: this.buttonConfigInfo,
    //     qrConfig: this.qrConfig,
    //     fileConfigInfo: this.fileConfigInfo
    //   }
    //   localStorage.setItem('templateData', JSON.stringify(templateData))
    //   window.open('http://localhost:9527/#/template-preview', '_blank')
    // },
    removeIdWhenCopy() {
      // 如果是复制，先清空不必要的ID
      delete this.baseInfo.cashTemplateId
      delete this.qrConfig.qrConfigId
      this.componentsConfig.components.forEach((item) => {
        delete item.componentConfigId
      })

      this.buttonConfigInfo.buttons.forEach((item) => {
        delete item.buttonConfigId
        if (item.buttonParamList) {
          item.buttonParamList.forEach((item) => {
            delete item.buttonConfigId
            delete item.buttonParamId
          })
        }
      })

      this.submitConfigInfo.submitConfigs.forEach((item) => {
        delete item.submitConfigId
      })
      this.fileConfigInfo.files.forEach((item) => {
        delete item.fileConfigId
      })

      this.textConfigInfo.texts.forEach((item) => {
        delete item.textConfigId
      })
    },
    async getTemplateDetail() {
      let res = await getTemplateInfo(this.cashTemplateId)
      console.log(res)
      this.baseInfo = res.data.baseInfo
      this.baseInfo.userLogoFile = [] // 先置空

      // 处理logo 图标 ,如果 templateTitleLogoUrl 长度小于 3  ,是下标，否则是  fileId
      if (this.baseInfo.templateTitleLogoUrl.length < 3) {
      } else {
        getFileById(this.baseInfo.templateTitleLogoUrl).then((res) => {
          this.baseInfo.userLogoFile.push({
            url: res.data.fileUrl,
            name: res.data.originalName,
            fileId: this.baseInfo.templateTitleLogoUrl
          })

          this.baseInfo.templateTitleLogoUrl = 'user'
        })

        this.baseInfo.templateTitleLogoUrl = '0' // 临时值，显示第一个条目
      }

      // 处理文件
      if (!res.data.baseInfo.tutorialFilesUrl) {
        res.data.baseInfo.tutorialFilesUrl = []
      } else {
        // 对数据解析
        const imgList = []
        const fileIds = res.data.baseInfo.tutorialFilesUrl.split(',')
        res.data.baseInfo.tutorialFilesUrl = []

        for (let index = 0; index < fileIds.length; index++) {
          const item = fileIds[index]
          let res = await getFileById(item)
          imgList.push({
            url: res.data.fileUrl,
            name: res.data.originalName,
            fileId: item
          })
        }
        console.log('----imgList----', imgList)
        this.baseInfo.tutorialFilesUrl = imgList
      }

      this.oldTemplateName = res.data.baseInfo.templateName // 保存模板名称

      // this.cashTemplateId = res.data.cashTemplateId
      this.componentsConfig.components = res.data.components ? res.data.components : []
      this.submitConfigInfo.submitConfigs = res.data.submitConfigs ? res.data.submitConfigs : []
      this.textConfigInfo.texts = res.data.texts ? res.data.texts : []
      this.buttonConfigInfo.buttons = res.data.buttons ? res.data.buttons : []

      // 对按钮的参数进行过滤，如果  buttonParamId 为 null 过滤掉不要
      this.buttonConfigInfo.buttons = this.buttonConfigInfo.buttons.map((item) => {
        if (item.buttonParamList && item.buttonParamList.length > 0) {
          item.buttonParamList = item.buttonParamList.filter((ele) => ele.buttonParamId)
        }

        return item
      })

      this.qrConfig = res.data.qrConfig || {}
      this.fileConfigInfo.files = res.data.files ? res.data.files : []

      // 复制模板时清除标记
      console.log(
        '======sessionStorage.getItem(is-copy-template)=========',
        sessionStorage.getItem('is-copy-template')
      )

      if (sessionStorage.getItem('is-copy-template') == 'true') {
        this.cashTemplateId = ''
        this.baseInfo.templateName = ''
        this.removeIdWhenCopy()
        sessionStorage.setItem('is-copy-template', 'null')
      }

      // 富文本内容：
      console.log('----paymentTutorialUrl------', this.baseInfo.paymentTutorialUrl)
    }
  },
  mounted() {
    // console.log(
    //   '-----this.$store.state[gcode-state].currEditTemplateId------',
    //   this.$store.state['gcode-state'].currEditTemplateId
    // )

    console.log('this.$router -- ', this.$router)
    console.log('this.$route -- ', this.$route)

    if (
      this.$store.state['gcode-state'].currEditTemplateId &&
      this.$store.state['gcode-state'].currEditTemplateId != -1
    ) {
      this.cashTemplateId = this.$store.state['gcode-state'].currEditTemplateId
      console.log('----编辑模板----cashTemplateId---', this.cashTemplateId)

      this.getTemplateDetail()
    } else {
      console.log('-----新建模板----this.cashTemplateId----', this.cashTemplateId)
    }

    if (this.cashTemplateId) {
      console.log('this.$route--', this.$route)

      setTimeout(() => {
        this.$route.meta.title = '编辑收银台模板'
        this.$store.commit('tagsView/update_template_edit', this.$route)
      }, 500)
    } else {
      setTimeout(() => {
        this.$route.meta.title = '创建收银台模板'
        this.$store.commit('tagsView/update_template_edit', this.$route)
      }, 500)
    }
  }
}
</script>

<style lang="scss">
.el-select-dropdown__item {
  display: flex;
  align-items: center;
  height: 40px;
  text-align: left;
  padding-left: 10px;
  margin: 5px;
}
</style>

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
      .bank-box {
        display: flex;
        flex-wrap: wrap;
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

    .bankconfig,
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
.pay-course {
  .title {
    text-align: left;
    font-weight: bold;
  }
}
// ::v-deep .upload-container.editor-upload-btn .el-button {
//   display: none;
// }
// ::v-deep .mce-container-body {
//   [aria-label='Preview'] {
//     display: none;
//   }
// }
</style>

<style lang="scss">
.pay-course {
  blockquote {
    background-color: var(--w-e-textarea-slight-bg-color);
    border-left: 8px solid var(--w-e-textarea-selected-border-color);
    display: block;
    font-size: 100%;
    line-height: 1.5;
    margin: 10px 0;
    padding: 10px;
  }
}

.uploadLogo {
  max-height: 150px;
  .el-upload--picture-card {
    width: auto !important;
    height: auto !important;
    border: none !important;
    background-color: transparent !important;
    line-height: 50px;

    .el-icon-plus {
      width: 50px;
      height: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #fbfdff;
      border: 1px dashed #c0ccda;
      border-radius: 6px;
      background-color: #fbfdff;
    }
  }
}
</style>
