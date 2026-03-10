<template>
  <div class="container" :class="isShowUi ? 'isShowUi' : 'noUi'">
    <el-card>
      <el-form
        :rules="queryRules"
        ref="queryFormDataRef"
        :inline="true"
        :model="queryFormData"
        class="demo-form-inline"
      >
        <el-form-item label="产品名称" prop="productName">
          <el-select
            filterable
            v-model="queryFormData.productName"
            placeholder="请选择产品类型"
            size="small"
          >
            <el-option label="全部" value=""></el-option>
            <el-option
              v-for="item in productList"
              :key="item.productId"
              :label="item.productName"
              :value="item.productName"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="产品类型" prop="">
          <el-select
            filterable
            v-model="queryFormData.productTypeId"
            placeholder="请选择产品类型"
            size="small"
          >
            <el-option label="全部" value=""></el-option>
            <el-option
              v-for="item in productTypeList"
              :key="item.productTypeId"
              :label="item.productTypeName"
              :value="item.productTypeId"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="交易类型" prop="tradeType">
          <el-select v-model="queryFormData.tradeType" placeholder="请选择交易类型" size="small">
            <el-option label="全部" value=""></el-option>
            <el-option label="代收" :value="0"></el-option>
            <el-option label="代付" :value="1"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="是否启用" prop="isActive">
          <el-select
            filterable
            v-model="queryFormData.isActive"
            placeholder="请选择是否启用"
            size="small"
          >
            <el-option label="全部" value=""></el-option>
            <el-option label="启用" :value="1"></el-option>
            <el-option label="禁用" :value="0"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" size="small" icon="el-icon-search" @click="queryTableData"
            >搜索</el-button
          >
          <el-button size="small" icon="el-icon-refresh" @click="resetQueryForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="mt-10 my-card">
      <div class="tool-box">
        <div class="auto-flush">
          <el-dropdown trigger="click" style="margin-right: 10px; cursor: pointer">
            <span
              class="el-dropdown-link"
              style="display: flex; height: 100%; align-items: center; font-size: 24px"
            >
              <i class="el-icon-s-grid"></i>
            </span>
            <el-dropdown-menu slot="dropdown" style="padding: 10px; width: 200px">
              <el-checkbox
                v-model="allSelected"
                @change="handleAllSelectChange"
                style="display: block; margin-bottom: 8px"
                >全选</el-checkbox
              >
              <el-checkbox-group v-model="selectedItems" @change="handleItemChange">
                <el-checkbox  v-for="item in allItems" :key="item"
                 style="display: block" :label="item">{{
                  item
                }}</el-checkbox>
              </el-checkbox-group>
            </el-dropdown-menu>
          </el-dropdown>
        </div>

        <div class="btns">
          <el-button type="primary" plain icon="el-icon-plus" @click="showAddDialog()"
            >新增</el-button
          >
          <el-button type="success" plain icon="el-icon-download" @click="exportReport()"
            >导出</el-button
          >
        </div>
      </div>

      <my-table
        class="mt-10"
        :loadData="loadTableData"
        :tableData="tableData"
        ref="tableRef"
        style="width: 100%"
        border
      >
        <el-table-column
          label="序号"
          align="center"
          type="index"
          v-if="selectedItems.includes('序号')"
        />
        <el-table-column
          label="产品名称"
          align="center"
          prop="productName"
          v-if="selectedItems.includes('产品名称')"
        />
        <!-- <el-table-column label="产品类型编码" align="center" prop="productTypeId" /> -->

        <el-table-column label="产品类型" align="center" v-if="selectedItems.includes('产品类型')">
          <template slot-scope="{ row }">
            {{ row.productTypeName }}
          </template>
        </el-table-column>

        <el-table-column label="交易类型" align="center" v-if="selectedItems.includes('交易类型')">
          <template slot-scope="{ row }">
            <el-tag type="success" v-if="row.tradeType == 0" >代收</el-tag>
            <el-tag type="danger"  v-else >代付</el-tag>
          </template>
        </el-table-column>

        <el-table-column
          label="收银台模板"
          align="center"
          width="140"
          v-if="selectedItems.includes('收银台模板')"
        >
          <template slot-scope="{ row }">
            {{ row.templateName && row.tradeType == 0 ? row.templateName : '' }}
          </template>
        </el-table-column>

        <el-table-column
          label="码商"
          width="110"
          align="center"
          v-if="selectedItems.includes('码商数量')"
        >
          <template slot-scope="{ row }">
            <div class="ta-l ml-10">
              <div>
                总数<span>
                  {{ row.totalProviderCount }}
                </span>
              </div>
              <div>
                可用<span>
                  {{ row.activeProviderCount }}
                </span>
                <el-button type="text" size="mini" @click="showProviderDialog(row)">查看</el-button>
              </div>
            </div>
          </template>

          <!-- <el-table-column label="总数" align="center">
            <template slot-scope="{ row }">
              <div>
                <span>
                  {{ row.totalProviderCount }}
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="可用" align="center">
            <template slot-scope="{ row }">
              <div>
                <span>
                  {{ row.activeProviderCount }}
                </span>
                <el-button type="text" size="mini" @click="showProviderDialog(row)">查看</el-button>
              </div>
            </template>
          </el-table-column> -->
        </el-table-column>

        <el-table-column
          label="收款码"
          width="100"
          align="center"
          v-if="selectedItems.includes('收款信息数量')"
        >
          <!-- <el-table-column label="总数" align="center">
            <template slot-scope="{ row }">
              <div>
                <span>
                  {{ row.totalPayeeAccountCount }}
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="可用" align="center">
            <template slot-scope="{ row }">
              <div>
                <span>
                  {{ row.activePayeeAccountCount }}
                </span>
                <el-button type="text" size="mini" @click="showPayeeAccountDialog(row)"
                  >查看</el-button
                >
              </div>
            </template>
          </el-table-column> -->
          <template slot-scope="{ row }">
            <div class="ta-l ml-10">
              <div>
                总数<span>
                  {{ row.totalPayeeAccountCount }}
                </span>
              </div>
              <div>
                可用<span>
                  {{ row.activePayeeAccountCount }}
                </span>
                <el-button type="text" size="mini" @click="showPayeeAccountDialog(row)"
                  >查看</el-button
                >
              </div>
            </div>
          </template>
        </el-table-column>


        <el-table-column label="浮动金额" align="center" min-width="120" v-if="selectedItems.includes('浮动金额')">
          <!-- <template slot-scope="{ row }">
            <el-button type="text" size="small" @click="showFloatDialog(row, true)">详情</el-button>
          </template> -->
          <template slot-scope="{ row }">
            <div>
              <el-tag :type="row.isFloatEnable ? 'success' : 'danger'">{{
                row.isFloatEnable ? '开启' : '关闭'
              }}</el-tag>
            </div>

            <template v-if="row.isFloatEnable">
              <div class="ta-l">
                <div>最大值：{{ row.floatMax }}</div>
                <div>最小值：{{ row.floatMin }}</div>
                <div>排除值：{{ row.floatExclude ? row.floatExclude : '无' }}</div>
              </div>
              <div>
                <el-tag :type="row.floatAllowDuplicate ? 'success' : 'danger'">{{
                  row.floatAllowDuplicate ? '允许重复' : '不允许重复'
                }}</el-tag>
              </div>
            </template>
          </template>
        </el-table-column>
        <!-- 订单超时时间(6-2分钟、9-5分钟、14-10分钟、16-30分钟、17-1小时、18-2 小时) -->
        <el-table-column label="超时时间" align="center" v-if="selectedItems.includes('超时时间')">
          <template slot-scope="{ row }">
            {{
              orderExpireTimeOptions.find((item) => item.value === row.orderExpireTime)
                ? orderExpireTimeOptions.find((item) => item.value === row.orderExpireTime).label
                : ''
            }}
          </template>
        </el-table-column>
        <el-table-column label="超时限制" align="center" v-if="selectedItems.includes('超时限制')">
          <template slot-scope="{ row }">
            <div v-if="row.orderConsecutiveTimeoutLimit">
              <div style="text-align: center">连续超时</div>
              <div style="text-align: center">
                <span style="color: #c00">{{ row.orderConsecutiveTimeoutLimit }}</span> 次
              </div>
              <div style="text-align: center">强制下线</div>
            </div>
            <div v-else>无限制</div>
          </template>
        </el-table-column>

        <!-- 转账备注类型（0-空 1-随机6位数字 2-随机字符串 3-随机邮箱 4-随机手机号 5-随机QQ号） -->
        <el-table-column
          label="转账备注类型"
          align="center"
          v-if="selectedItems.includes('转账备注类型')"
        >
          <template slot-scope="{ row }">
            <span>
              {{
                transferRemarkTypeOptions.find((item) => item.value === row.transferRemarkType)
                  ? transferRemarkTypeOptions.find((item) => item.value === row.transferRemarkType)
                      .label
                  : ''
              }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="权重类型" align="center" v-if="selectedItems.includes('权重类型')">
          <template slot-scope="{ row }">
            <span>
              {{
                weightTypeOptions.find((item) => item.value === row.weightType)
                  ? weightTypeOptions.find((item) => item.value === row.weightType).label
                  : ''
              }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="自动类型" align="center" v-if="selectedItems.includes('自动类型')">
          <template slot-scope="{ row }">
            <span>{{ row.isAutoConfirmOrder == 1 ? '自动' : '手动' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否启用" align="center" v-if="selectedItems.includes('是否启用')">
          <template slot-scope="{ row }">
            <el-switch v-model="row.isActive" @change="onSwitchChange(row)" />
          </template>
        </el-table-column>
        <el-table-column
          label="接单模式"
          align="center"
          width="130"
          v-if="selectedItems.includes('接单模式')"
        >
          <template slot-scope="{ row }">
            <el-tag v-if="row.isOneTimeAccept == 1" type="danger">接单下码</el-tag>
            <div v-else-if="row.isOneTimeAccept == 0" type="danger">通用</div>
            <el-tag v-else-if="row.isOneTimeAccept == 2" type="danger">成功下码</el-tag>
            <el-tag v-else-if="row.isOneTimeAccept == 3" type="danger">同金额一码一单</el-tag>
            <el-tag v-else-if="row.isOneTimeAccept == 4" type="danger">一码一单</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="120">
          <template slot-scope="{ row }">
            <div class="opt">
              <div type="success" class="btn" @click="showPeizhiDialog(row)">
                <i class="el-icon-setting" /> 配置码商
              </div>
              <div
                type="success"
                v-if="row.tradeType == 0"
                class="btn"
                style="margin: 5px 0"
                @click="showFloatDialog(row)"
              >
                <i class="el-icon-edit" /> 设置浮动
              </div>
              <div type="success" class="btn" style="margin: 5px 0" @click="showEditDialog(row)">
                <i class="el-icon-edit" /> 修改
              </div>
              <div type="primary" class="btn" @click="showConfirmDelete(row)">
                <i class="el-icon-delete" /> 删除
              </div>
            </div>
          </template>
        </el-table-column>
      </my-table>
    </el-card>

    <el-dialog
      @close="onDialogBtnCancel()"
      :visible.sync="dialogVisible"
      :title="isEdit ? '修改产品' : '新增产品'"
      width="600px"
    >
      <el-form
        ref="formDataRef"
        :model="formData"
        :rules="productRules"
        label-position="right"
        label-width="150px"
        style="margin-left: 20px"
      >
        <el-form-item
          label="产品名称"
          :prop="isEdit ? '' : 'productName'"
          :rules="isEdit ? {} : productNameRules"
        >
          <el-input
            style="width: 225px"
            v-model="formData.productName"
            placeholder="请输入产品名称"
            size="small"
          />
        </el-form-item>

        <el-form-item label="交易类型" :prop="isEdit ? '' : 'tradeType'">
          <el-select
            filterable
            v-model="formData.tradeType"
            placeholder="请选择交易类型"
            @change="onTradeTypeChange()"
            :disabled="isEdit"
            size="small"
          >
            <el-option label="代收" :value="0"></el-option>
            <el-option label="代付" :value="1"></el-option>
          </el-select>
          <div class="help-tip2" v-if="formData.tradeType == 1">
            若需要使用代付自动审核功能，请确认产品类型开启自动确认订单、码商权限开启需要审核及延时回款
          </div>
        </el-form-item>

        <el-form-item label="产品类型" :prop="isEdit ? '' : 'productTypeId'">
          <el-select
            filterable
            v-model="formData.productTypeId"
            placeholder="请选择产品类型"
            @change="productTypeChange"
            size="small"
          >
            <el-option
              v-for="item in productTypeListFilter"
              :key="item.productTypeId"
              :label="item.productTypeName"
              :value="item.productTypeId"
            ></el-option>
          </el-select>
        </el-form-item>
        <template v-if="formData.tradeType == 0">
          <!-- <el-form-item label="交易类型">
            <div>代收</div>
          </el-form-item> -->
          <el-form-item label="收银台页面模板" prop="cashTemplateId">
            <el-select
              filterable
              v-model="formData.cashTemplateId"
              placeholder="请选择收银台页面模板"
              size="small"
            >
              <el-option
                v-for="item in templateList"
                :key="item.cashTemplateId"
                :label="item.templateName"
                :value="String(item.cashTemplateId)"
              ></el-option>
            </el-select>
          </el-form-item>

          <!-- <template v-if="!isEdit">
          <el-form-item label="是否开启浮动" prop="isFloatEnable">
            <el-switch v-model="formData.isFloatEnable" />
          </el-form-item>

          <el-form-item label="浮动最大值" prop="floatMax" v-if="formData.isFloatEnable">
            <el-input
              v-number-input type="number"
              v-model="formData.floatMax"
              placeholder="请输入浮动最大值"
              size="small"
            />
          </el-form-item>

          <el-form-item label="浮动最小值" prop="floatMin" v-if="formData.isFloatEnable">
            <el-input
              v-number-input type="number"
              v-model="formData.floatMin"
              placeholder="请输入浮动最小值"
              size="small"
            />
          </el-form-item>
          <el-form-item label="浮动排除值" prop="floatExclude" v-if="formData.isFloatEnable">
            <el-input v-model="formData.floatExclude" placeholder="请输入浮动排除值" size="small" />
          </el-form-item>
          <el-form-item
            label="是否允许浮动重复"
            prop="floatAllowDuplicate"
            v-if="formData.isFloatEnable"
          >
            <el-switch v-model="formData.floatAllowDuplicate" />
          </el-form-item>
          </template> -->

          <el-form-item label="转账备注类型" prop="transferRemarkType">
            <el-select
              filterable
              v-model="formData.transferRemarkType"
              placeholder="请选择备注类型"
              size="small"
            >
              <el-option
                v-for="item in transferRemarkTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="权重类型" prop="weightType">
            <el-select
              filterable
              v-model="formData.weightType"
              placeholder="请选择权重类型"
              size="small"
            >
              <el-option
                v-for="item in weightTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </template>

        <template v-if="formData.tradeType == 1">
          <!-- <el-form-item label="交易类型">
            <div>代付</div>
          </el-form-item> -->

          <!-- <el-form-item label="最大接单数" prop="maxDailyOrdersCount">
            <el-input
              v-input-int-positive  type="number"
              style="width: 225px"
              v-model="formData.maxDailyOrdersCount"
              placeholder="请输入最大接单数"
              size="small"
            />
          </el-form-item> -->
        </template>
        <el-form-item label="订单超时时间" prop="orderExpireTime">
          <el-select
            filterable
            v-model="formData.orderExpireTime"
            placeholder="请选择订单超时时间"
            size="small"
          >
            <el-option
              v-for="item in orderExpireTimeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="订单连续超时限制数"
          prop="orderConsecutiveTimeoutLimit"
          v-if="formData.tradeType == 0"
        >
          <el-input
            style="width: 225px"
            v-input-int-limit
            type="number"
            v-model="formData.orderConsecutiveTimeoutLimit"
            placeholder="请输入订单连续超时限制数"
            size="small"
          />
          <div class="help-tip2" style="width: 225px">
            该产品下的任意一个收款信息连续超时接单的次数，超过了设置的次数上限，那这个收款信息就不能用.设置为0将不限制
          </div>
        </el-form-item>

        <el-form-item label="是否启用" prop="isActive">
          <el-switch v-model="formData.isActive" />
        </el-form-item>
        <el-form-item label="接单模式" prop="isOneTimeAccept" v-if="formData.tradeType == 0">
          <!-- <el-switch v-model="formData.isOneTimeAccept" /> -->

          <el-select
            v-model="formData.isOneTimeAccept"
            filterable
            placeholder="请选择模式"
            size="small"
          >
            <el-option label="通用" :value="0" />
            <el-option label="接单下码" :value="1" />
            <el-option label="成功下码" :value="2" />
            <el-option label="同金额一码一单" :value="3" />
            <el-option label="一码一单" :value="4" />
          </el-select>

          <div class="help-tip2" style="width: 225px" v-if="formData.isOneTimeAccept == 1">
            在新增收款信息时，如果收款信息绑定了该产品，收款信息接单下线默认采用产品处的设置
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="onDialogBtnCancel()" size="small"> 取消 </el-button>
        <el-button type="primary" @click="onDialogBtnOk()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>

    <!-- 金额浮动动话框 -->
    <el-dialog
      :visible.sync="floatDdialogVisible"
      :title="`${floatReadOnly ? '查看' : '设置'}产品【 ${formData.productName} 】的浮动金额`"
      @close="onFloatBtnCancel()"
      width="600px"
    >
      <el-form
        ref="changeFlostRef"
        :model="formData"
        :rules="flostSettingRules"
        label-position="right"
        label-width="180px"
        style="margin-right: 80px"
      >
        <el-form-item label="产品名称：" prop="">
          <!-- <el-input
            v-model="formData.productName"
            :disabled="true"
            placeholder="请输入产品名称"
            size="small"
          /> -->
          <div>{{ formData.productName }}</div>
        </el-form-item>

        <template v-if="floatReadOnly">
          <el-form-item label="是否开启浮动：" prop="">
            <el-tag>{{ formData.isFloatEnable ? '开启' : '关闭' }}</el-tag>
          </el-form-item>

          <el-form-item label="浮动最大值：" v-if="formData.isFloatEnable" prop="">
            <div>{{ Number(formData.floatMax) }}</div>
          </el-form-item>

          <el-form-item label="浮动最小值：" v-if="formData.isFloatEnable" prop="">
            <div>{{ Number(formData.floatMin) }}</div>
          </el-form-item>
          <el-form-item label="浮动排除值：" v-if="formData.isFloatEnable" prop="">
            <div>{{ formData.floatExclude }}</div>
          </el-form-item>
          <el-form-item label="是否允许浮动重复：" v-if="formData.isFloatEnable" prop="">
            <el-tag>{{ formData.floatAllowDuplicate ? '允许' : '不允许' }}</el-tag>
          </el-form-item>
        </template>

        <template v-else>
          <el-form-item label="是否开启浮动：" prop="">
            <el-switch v-model="formData.isFloatEnable" @change="floatChange" />
          </el-form-item>

          <el-form-item label="浮动最大值：" prop="floatMax" v-if="formData.isFloatEnable">
            <el-input v-model="formData.floatMax" placeholder="请输入浮动最大值" size="small" />
          </el-form-item>

          <el-form-item label="浮动最小值：" prop="floatMin" v-if="formData.isFloatEnable">
            <el-input v-model="formData.floatMin" placeholder="请输入浮动最小值" size="small" />
          </el-form-item>
          <el-form-item label="浮动排除值：" prop="" v-if="formData.isFloatEnable">
            <el-input
              v-model="formData.floatExclude"
              placeholder="请输入排除值，多个值用,号隔开"
              size="small"
            />
            <div class="help-tip">浮动金额中不会出现的值</div>
          </el-form-item>
          <el-form-item label="是否允许浮动重复：" prop="floatAllowDuplicate">
            <el-switch v-model="formData.floatAllowDuplicate" />
          </el-form-item>
        </template>
      </el-form>
      <div slot="footer" :style="{ textAlign: floatReadOnly ? 'center' : 'right' }">
        <el-button @click="floatDdialogVisible = false" size="small">
          {{ floatReadOnly ? '关闭' : '取消' }}
        </el-button>
        <el-button v-if="!floatReadOnly" type="primary" @click="onFloatBtnOk()" size="small">
          确定
        </el-button>
      </div>
    </el-dialog>

    <!-- 该产品可用码商 -->
    <el-dialog
      :visible.sync="showAvailableProviderDialogVisible"
      :title="'可用码商'"
      @close="closeProviderDialog()"
      width="800px"
    >
      <my-table
        class="normal-pagination"
        v-if="showAvailableProviderDialogVisible"
        :loadData="loadAvalableProvideTableData"
        :tableData="showAvailableProviderList"
        style="width: 100%"
        :stripe="!isShowUi"
      >
        <!-- <el-table-column prop="providerId" label="码商ID" > </el-table-column> -->
        <el-table-column label="序号" align="center" type="index" />
        <el-table-column prop="userName" align="center" label="码商账号"> </el-table-column>
        <el-table-column prop="userNickName" align="center" label="码商名称"> </el-table-column>
        <el-table-column prop="weight" align="center" label="接单权重"> </el-table-column>
        <el-table-column prop="onlinePayeeAccountCount" align="center" label="可用收款码">
        </el-table-column>
        <el-table-column prop="availableBalance" align="center" label="码商可用余额">
        </el-table-column>
        <el-table-column prop="freezeBalance" align="center" label="处理中金额"> </el-table-column>
        <el-table-column prop="minAllowableCollectAmount" align="center" label="最低接单金额">
        </el-table-column>
      </my-table>
    </el-dialog>

    <el-dialog
      :visible.sync="showPayeeAccountDialogVisible"
      :title="'可用收款信息'"
      @close="closePayAccountDialog()"
      width="800px"
    >
    
      <div class="tips" style="margin-bottom: 10px;" >
          总数[{{limitSummaryData.total}}个]，{{limitSummaryList}}
        </div>

      <my-table
        class="normal-pagination"
        v-if="showPayeeAccountDialogVisible"
        :tableData="avaiablePayeeAccountList"
        :loadData="loadAvaiablePayeeTableData"
        style="width: 100%"
        :stripe="!isShowUi"
      >
        <!-- <el-table-column prop="providerId" label="码商ID" > </el-table-column> -->
        <el-table-column label="序号" align="center" type="index" />
        <el-table-column prop="userName" align="center" label="码商账户"> </el-table-column>
        <el-table-column prop="userNickName" align="center" label="码商名称"> </el-table-column>
        <el-table-column prop="payeeAccountName" align="center" label="收款码名称">
        </el-table-column>

         <el-table-column prop="dailyMaxCount" align="center" label="每日限数">
          <template slot-scope="{ row }">
            <span v-if="row.dailyMaxCount == 0">无限制</span>
            <span v-else>{{ row.dailyMaxCount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="dailyMaxAmount" align="center" label="每日限额">
          <template slot-scope="{ row }">
            <span v-if="row.dailyMaxAmount == 0">无限制</span>
            <span v-else>{{ row.dailyMaxAmount }}</span>
          </template>
        </el-table-column>
        
        <el-table-column label="接单金额范围" align="center" width="130">
          <template slot-scope="{ row }">
            <span v-if="row.limitAmountType == 0">无限制</span>
            <div
              v-if="row.limitAmountType == 1"
              style="display: flex; flex-wrap: wrap; gap: 5px; justify-content: center"
            >
              <span v-if="row.limitAmount">
                <el-tag
                  :key="index"
                  v-for="(item, index) in row.limitAmount.split(',')"
                  size="small"
                  >{{ item }}</el-tag
                >
              </span>
            </div>

            <span v-if="row.limitAmountType == 2">
              <el-tag size="small">{{ row.minAmount }}</el-tag> ~
              <el-tag size="small">{{ row.maxAmount }}</el-tag>
            </span>
          </template>
        </el-table-column>

        <el-table-column prop="" align="center" label="今日统计">
          <template slot-scope="{ row }">
            <div style="display: flex; flex-direction: column; align-items: flex-start">
              <div>
                <span>收款: </span>
                <span>{{
                  row.todayPayAmount ? row.todayPayAmount.toFixed(2) : row.todayPayAmount
                }}</span>
              </div>
              <div class="mt-5">
                <span>次数: </span>
                <span>{{ row.todayOrderCount }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
      </my-table>
    </el-dialog>

    <!-- 产品配置码商 -->
    <el-dialog
      :visible.sync="peizhiDialogVisible"
      :title="`配置产品【 ${formData.productName} 】的码商`"
      width="1100px"
    >
      <div v-if="peizhiDialogVisible" style="max-height: 600px; overflow: auto">
        <Peizhi :currItem="formData" :parentVisible="peizhiDialogVisible"></Peizhi>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getProductList,
  updateProductStatus,
  addProduct,
  updateProduct,
  getAllProductType,
  deleteProduct,
  getProductListByTenantIdContainsNotActive,
  getOnlinePayeeAccountByProductId,
  updateFloatAmount,
  checkProductName,
  getProductTypeById,
  getProvidersByProductId,
  getProductTypeByProductld,
  productExport
} from '@/api/service-product-mananger.js'

import { checkProductTypeCodeUnique } from '@/api/tenant-product-type.js'

import { productRules, queryRules } from './rules.js'

import { getAllTemplate } from '@/api/template-create.js'
import Peizhi from './service-product-manager-setting.vue'
import { floatExcludeCheckRule, amountCheck, userNickNameRules } from '@/utils/validate'
import { isEmpty } from '@/utils/index.js'
import FileSaver from 'file-saver'
export default {
  name: 'ServiceProductMananger',
  components: {
    Peizhi
  },
  computed: {
    // newProductTradeType() {
    //   if (
    //     this.productTypeList.length == 0 ||
    //     !this.dialogVisible ||
    //     this.formData.productTypeId == ''
    //   ) {
    //     return undefined
    //   }

    //   let ele = this.productTypeList.find((ele) => ele.productTypeId == this.formData.productTypeId)
    //   if (ele) {
    //     return ele.tradeType
    //   }
    //   return undefined
    // },

    productTypeListFilter() {
      return this.productTypeList.filter((ele) => ele.tradeType == this.formData.tradeType)
    }
  },

  data() {
    return {
      currentRow: '',
      selectedItems: [],
      allSelected: true,
      allItems: [
        '序号',
        '产品名称',
        '产品类型',
        '交易类型',
        '收银台模板',
        '浮动金额',
        '超时时间',
        '超时限制',
        '转账备注类型',
        '权重类型',
        '码商数量',
        '收款信息数量',
        '自动类型',
        '是否启用',
        '接单模式'
      ],
      rules: productRules,
      peizhiDialogVisible: false, // 配置通道
      productRules,
      flostSettingRules: {
        productName: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          ...userNickNameRules
        ],
        productTypeCode: [
          { required: true, message: '请输入编码', trigger: 'blur' },
          ...userNickNameRules
        ],

        cashTemplateId: [{ required: true, message: '请选择模板', trigger: 'change' }],
        productTypeId: [{ required: true, message: '请选择类型', trigger: 'change' }],

        isFloatEnable: [{ required: true, message: '请选择', trigger: 'blur' }],
        orderExpireTime: [{ required: true, message: '请选择过期时间', trigger: 'change' }],
        transferRemarkType: [{ required: true, message: '请选择类型', trigger: 'change' }],
        isActive: [{ required: true, message: '请选择状态', trigger: 'change' }],

        floatExclude: [
          { required: true, message: '请输入排除值', trigger: 'blur' },
          floatExcludeCheckRule
        ],
        floatMin: [
          { required: true, message: '请输入最小值', trigger: 'blur' },
          // { validator: amountCheck, trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (isEmpty(this.formData.floatMin) || isEmpty(this.formData.floatMax)) {
                return callback()
              }

              if (Number(this.formData.floatMin) >= Number(this.formData.floatMax)) {
                return callback(new Error('必须小于最大值'))
              }
              callback()
            },
            trigger: 'blur'
          }
        ],
        floatMax: [
          { required: true, message: '请输入最大值', trigger: 'blur' },
          // { validator: amountCheck, trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (isEmpty(this.formData.floatMin) || isEmpty(this.formData.floatMax)) {
                return callback()
              }

              if (Number(this.formData.floatMin) >= Number(this.formData.floatMax)) {
                return callback(new Error('必须大于最小值'))
              }
              callback()
            },
            trigger: 'blur'
          }
        ]
      },
      queryRules: queryRules,
      productNameRules: [
        { required: true, message: '请输入名称', trigger: 'blur' },
        // ...userNickNameRules,
        {
          validator: async (rules, value, callback) => {
            try {
              let ret = await checkProductName(value)
              if (ret.data) {
                callback(new Error('产品名称已存在'))
              } else {
                callback()
              }
            } catch (e) {
              callback()
            }
          },
          trigger: 'blur'
        }
      ],

      productTypeCodeRules: [
        { required: true, message: '请输入编码', trigger: 'blur' },
        ...userNickNameRules,
        {
          validator: async (rules, value, callback) => {
            try {
              let ret = await checkProductTypeCodeUnique(value)
              if (ret.data) {
                callback(new Error('产品编码已存在'))
              } else {
                callback()
              }
            } catch (error) {
              callback()
            }
          },
          trigger: 'blur'
        }
      ],
      tableData: [],
      dialogVisible: false,
      isNotEnable: '',
      formData: {},
      queryFormData: this.getQueryForm(),
      isEdit: false, // 是否是编辑状态
      cashTemplateIdIsEdit: '',
      // 添加扩展数据，如 options 所需要的数据
      floatDdialogVisible: false,
      templateList: [],
      orderExpireTimeOptions: [
        { value: 6, label: '2分钟' },
        { value: 7, label: '3分钟' },
        { value: 9, label: '5分钟' },
        { value: 11, label: '7分钟' },
        { value: 14, label: '10分钟' },
        { value: 15, label: '20分钟' },
        { value: 16, label: '30分钟' },
        { value: 17, label: '1小时' },
        { value: 18, label: '2小时' }
      ],
      transferRemarkTypeOptions: [
        { value: 0, label: '无' },
        { value: 1, label: '随机6位数字' },
        { value: 2, label: '随机字符串' },
        { value: 3, label: '随机邮箱' },
        { value: 4, label: '随机手机号' },
        { value: 5, label: '随机QQ号' }
      ],
      weightTypeOptions: [
        { value: 0, label: '加权轮询' },
        { value: 1, label: '加权随机' }
      ],
      productList: [],
      floatReadOnly: false, // 是否只读
      productTypeList: [],

      isProductTypeFloatEnable: false,
      showAvailableProviderList: [],
      showAvailableProviderDialogVisible: false,
      showPayeeAccountDialogVisible: false,
      avaiablePayeeAccountList: [], // 可用收款信息
      limitSummaryList: '',
      limitSummaryData: {}, 
    }
  },
  methods: {
    showPeizhiDialog(row) {
      this.formData = Object.assign({}, row)
      this.peizhiDialogVisible = true
    },

    async showPayeeAccountDialog(row) {
      this.showPayeeAccountDialogVisible = true
      this.currentRow = row
    },

    async loadAvaiablePayeeTableData(page) {
      let ret = await getOnlinePayeeAccountByProductId(page, this.currentRow.productId)
      this.avaiablePayeeAccountList = ret.data.pageInfo.list
      this.limitSummaryList = ret.data.limitSummaryList
      this.limitSummaryData = ret.data.pageInfo
      ret.data.total = ret.data.pageInfo.total
      return ret
    },

    closePayAccountDialog() {
      this.showPayeeAccountDialogVisible = false
      this.avaiablePayeeAccountList = []
    },
    handleAllSelectChange(val) {
      if (val) {
        this.selectedItems = [...this.allItems]
      } else {
        this.selectedItems = []
      }
    },
    handleItemChange(val) {
      this.allSelected = val.length === this.allItems.length
    },
    closeProviderDialog() {
      this.showAvailableProviderDialogVisible = false
      this.showAvailableProviderList = []
    },
    async showProviderDialog(row) {
      this.showAvailableProviderDialogVisible = true
      this.currentRow = row
    },

    async loadAvalableProvideTableData(page) {
      let ret = await getProvidersByProductId(page, this.currentRow.productId)
      console.log(ret)
      this.showAvailableProviderList = ret.data.list
      return ret
    },
    async productTypeChange(e) {
      let res = await getProductTypeById(e)
      this.isProductTypeFloatEnable = res.data.isEnableFloating == 1

      this.$set(this.formData, 'cashTemplateId', res.data.cashTemplateId)

      this.$nextTick(() => {
        this.$refs.formDataRef.clearValidate()
      })
    },
    async exportReport() {
      let params = {
        tenantId: this.tenantId
      }
      Object.keys(this.queryFormData).forEach((key) => {
        if (
          this.queryFormData[key] !== '' &&
          this.queryFormData[key] !== undefined &&
          this.queryFormData[key] !== null
        ) {
          if (key == 'createTime') {
            params['startTime'] = this.queryFormData['createTime'][0]
            params['endTime'] = this.queryFormData['createTime'][1]
          } else {
            params[key] = this.queryFormData[key]
          }
        }
      })
      let res = await productExport(params)
      FileSaver.saveAs(res, '产品管理列表.xlsx')
    },
    onTradeTypeChange() {
      this.formData.productTypeId = ''
      this.formData.cashTemplateId = ''
      this.formData.transferRemarkType = ''
      this.formData.orderExpireTime = ''
      this.formData.orderConsecutiveTimeoutLimit = 0
      this.$nextTick(() => {
        this.$refs.formDataRef.clearValidate()
      })
    },

    showFloatDialog(row, type) {
      this.floatReadOnly = type

      this.floatDdialogVisible = true
      this.formData = {
        productId: row.productId,
        productName: row.productName,
        isFloatEnable: row.isFloatEnable,
        floatMax: Number(row.floatMax),
        floatMin: Number(row.floatMin),
        floatExclude: row.floatExclude,
        floatAllowDuplicate: row.floatAllowDuplicate
      }
    },

    // showFloatDetailDialog(row){
    //   this.currRow = row
    //   this.floatDetailVisible = true

    // },
    onFloatBtnCancel() {
      this.$refs.changeFlostRef.resetFields()
      this.floatDdialogVisible = false
    },
    onFloatBtnOk() {
      this.$refs.changeFlostRef.validate(async (valid) => {
        if (valid) {
          await updateFloatAmount({
            // ...this.formData,
            productId: this.formData.productId,
            isFloatEnable: this.formData.isFloatEnable,
            floatMax: Number(this.formData.floatMax),
            floatMin: Number(this.formData.floatMin),
            floatAllowDuplicate: this.formData.floatAllowDuplicate,
            floatExclude: this.formData.floatExclude
          })

          this.$message.success('修改成功')
          this.onFloatBtnCancel()
          this.flushPage()
        }
      })
    },
    async showConfirmDelete(row) {
      try {
        let ret = await this.$confirm(`确定删除产品【 ${row.productName} 】 吗？`)

        await deleteProduct(row.productId)

        this.$message.success('删除成功')
        this.flushPage()
      } catch (e) {
        console.log('取消删除')
      }
    },

    async showEditDialog(row) {
      this.isEdit = true
      this.dialogVisible = true
      this.formData = Object.assign({}, row)
      this.cashTemplateIdIsEdit = row.cashTemplateId
      let res = await getProductTypeByProductld(row.productId)
      this.isNotEnable = res.data.isEnableFloating == 1 ? true : false
      this.$nextTick(() => {
        this.$refs.formDataRef.clearValidate()
      })
    },

    showAddDialog() {
      this.isEdit = false
      this.formData = {
        productTypeId: '',
        orderConsecutiveTimeoutLimit: 0,
        isOneTimeAccept: 0,
        orderExpireTime: 11,
        transferRemarkType: 1,
        weightType: 0,
        tradeType: 0,
        isActive: 1
      }
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.formDataRef.clearValidate()
      })
    },

    onDialogBtnCancel() {
      this.$refs.formDataRef.resetFields()
      this.dialogVisible = false
    },
    floatChange(e) {
      this.formData.floatMax = ''
      this.formData.floatMin = ''
      this.formData.floatExclude = ''
      this.formData.floatAllowDuplicate = 0
    },
    onDialogBtnOk() {
      this.$refs.formDataRef.validate(async (valid) => {
        if (valid) {
          if (this.isEdit) {
            // 编辑

            await updateProduct({
              // ...this.formData
              tenantId: this.tenantId,
              productId: this.formData.productId,
              productName: this.formData.productName,
              productTypeId: this.formData.productTypeId,
              cashTemplateId: this.formData.cashTemplateId,
              orderExpireTime: this.formData.orderExpireTime,
              transferRemarkType: this.formData.transferRemarkType,
              weightType: this.formData.weightType,
              isOneTimeAccept: this.formData.isOneTimeAccept,
              orderConsecutiveTimeoutLimit: this.formData.orderConsecutiveTimeoutLimit,
              isActive: this.formData.isActive
            })

            this.$message.success('修改成功')
            if (this.cashTemplateIdIsEdit != this.formData.cashTemplateId) {
              this.$alert(`请重新配置收款信息！！`)
            }
          } else {
            // 新增
            await addProduct({
              tenantId: this.tenantId,
              productName: this.formData.productName,
              productTypeId: this.formData.productTypeId,
              cashTemplateId: this.formData.cashTemplateId,
              tradeType: this.formData.tradeType,
              orderExpireTime: this.formData.orderExpireTime,
              transferRemarkType: this.formData.transferRemarkType,
              weightType: this.formData.weightType,
              orderConsecutiveTimeoutLimit: this.formData.orderConsecutiveTimeoutLimit,
              isOneTimeAccept: this.formData.isOneTimeAccept,
              isActive: this.formData.isActive
              // isFloatEnable: this.formData.isFloatEnable,
              // floatMax: this.formData.floatMax,
              // floatMin: this.formData.floatMin,
              // floatAllowDuplicate: this.formData.floatAllowDuplicate,
              // floatExclude: this.formData.floatExclude
            })
            this.$message.success('添加成功')

            if (this.isProductTypeFloatEnable) {
              this.$alert(`该产品类型建议开启浮动，请及时前往设置!`)
            }
          }

          this.onDialogBtnCancel()
          this.flushPage()
        }
      })
    },

    async onSwitchChange(row) {
      try {
        let res = await updateProductStatus(row.productId, row.isActive)
        console.log(res)
      } catch (e) {
        console.log(e)
      }
      this.$refs.tableRef.getTableData()
    },
    async loadTableData(page) {
      let params = {}
      Object.keys(this.queryFormData).forEach((key) => {
        if (
          this.queryFormData[key] !== '' &&
          this.queryFormData[key] !== undefined &&
          this.queryFormData[key] !== null
        ) {
          if (key == 'createTime') {
            params['startTime'] = this.queryFormData['createTime'][0]
            params['endTime'] = this.queryFormData['createTime'][1]
          } else {
            params[key] = this.queryFormData[key]
          }
        }
      })

      let res = await getProductList(page, params)
      this.tableData = res.data.list
      console.log(res)
      return res
    },

    resetQueryForm() {
      this.queryFormData = this.getQueryForm()
      this.$refs.queryFormDataRef.resetFields()
      this.$refs.tableRef.getTableData(1)
    },
    getQueryForm() {
      return {
        productTypeId: '',
        productName: '',
        tradeType: '',
        isActive: ''
      }
    },

    queryTableData() {
      this.$refs.queryFormDataRef.validate((valid) => {
        if (valid) {
          this.$refs.tableRef.getTableData(1)
        }
      })
    },
    flushPage() {
      this.queryTableData()

      // 同步刷新 产品缓存
      getProductListByTenantIdContainsNotActive(this.$store.state.tenant.currTenantId).then(
        (res) => {
          if (res.data && res.data.length > 0) {
            this.productList = res.data
            this.$store.state.order.productList = res.data
          }
        }
      )
    }
  },
  watch: {
    selectedItems(newV) {
      this.$store.commit('settings/SET_productManageColumns', newV)
    }
  },

  mounted() {
    this.selectedItems = this.$store.state.settings.productManageColumns
    this.allSelected = this.selectedItems.length == this.allItems.length

    getAllTemplate(this.$store.getters.tenantId).then((res) => {
      console.log(res)
      this.templateList = res.data
    })
    // 所有产品列表明
    getProductListByTenantIdContainsNotActive(this.$store.state.tenant.currTenantId).then((res) => {
      if (res.data && res.data.length > 0) {
        this.productList = res.data
        this.$store.state.order.productList = res.data
      }
    })

    getAllProductType(this.$store.getters.tenantId).then((res) => {
      console.log(res)
      this.productTypeList = res.data
    })
  }
}
</script>

<style lang="scss" scoped>
.help-tip2 {
  font-size: 12px;
  line-height: 16px;
  color: #cc0000;
}

.noUi {
  .tool-box {
    display: flex;
    justify-content: space-between;
    flex-direction: row-reverse;
  }
}

.isShowUi {
  .my-card {
    position: relative;
    margin-top: 80px;
    .tool-box {
      position: absolute;
      display: flex;
      flex-direction: row-reverse;
      justify-content: space-between;
      top: -50px;
      left: 0;
      width: 100%;

      .auto-flush {
        // .mr-10 {
        //   font-size: 16px;
        //   color: #2b3674;
        //   font-weight: 600;
        // }
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .btns {
        position: relative;
        padding-left: 130px;
      }
      .btns::after {
        position: absolute;
        left: 0;
        top: 50%;
        transform: translate(0, -50%);
        content: '产品管理';
        font-size: 18px;
        font-weight: 600;
        color: #2b3674;
        margin-left: 20px;
      }
      .btns::before {
        position: absolute;
        left: 0;
        top: 20%;
        content: '';
        background-color: #5258f4;
        width: 8px;
        height: 60%;
        border-radius: 4px;
      }
    }
  }
  ::v-deep .normal-pagination.table-box .pagination {
    position: static;
    margin-top: 10px;
  }
}
</style>
