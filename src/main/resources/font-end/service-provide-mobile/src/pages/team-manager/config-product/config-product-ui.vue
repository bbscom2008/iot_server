<template>
    <view class="container isShowUi" :style="{ paddingTop: $store.state.navBarHeight + 'rpx' }">
        <!-- 自定义标题栏 -->
        <custom-nav-bar :title="`配置【${userNickName}】的产品`">
            <view class="right" slot="right">
                <view class="nav-right" @click="showFilter = true">
                    <uni-icons type="search" color="#fff"></uni-icons>
                    <text class="query-text">搜索</text>
                </view>
            </view>
        </custom-nav-bar>

        <view class="sub-nav-bar">
            <view class="item" :class="{curr:queryFormData.isActive===''}" @click="onSubNavClick('')">全部</view>
            <view class="item" :class="{curr:queryFormData.isActive===1}" @click="onSubNavClick(1)">启用中</view>
            <view class="item" :class="{curr:queryFormData.isActive===0}" @click="onSubNavClick(0)">禁用中</view>
        </view>


        <!-- 订单列表 -->
        <scroll-view class="order-list" scroll-y @scroll="(e) => (oldScrollTop = e.detail.scrollTop)"
            :scroll-with-animation="true" :scroll-top="scrollTop" refresher-enabled
            :refresher-triggered="refreshTriggered" @refresherrefresh="onScrollRefresh()">
            <view class="opt-btn" v-if="!showCheckboxes" style="padding-top: 20rpx;">
                <u-button type="primary" :disabled="tableData.length == 0" @click="switchShowCheck()">
                    <image src="/static/imgs/copy.png" style="width: 38rpx; height: 38rpx;margin-right: 6rpx;" mode="">
                    </image>
                    {{ '批量操作' }}
                </u-button>

                <u-button type="primary" v-if="!showCheckboxes" @click="showAddDialog()">
                    <image src="/static/imgs/add.png" style="width: 38rpx; height: 38rpx;margin-right: 6rpx;" mode="">
                    </image>
                    新增
                </u-button>

                <u-button type="primary" plain v-if="!showCheckboxes" @click="updatePathch(true)">
                    <image src="/static/imgs/modify.png" style="width: 38rpx; height: 38rpx;margin-right: 6rpx;"
                        mode=""></image>

                    全部修改
                </u-button>
            </view>


            <view class="opt-btn modify-box" v-if="showCheckboxes" style="padding-top: 20rpx;">

                <u-checkbox-group v-model="isAllSelected" placement="column" @change="selectAll" style="width: 180rpx;">
                    <u-checkbox name="all" :label="isAllSelected.length > 0 ? '全不选' : '全选'"></u-checkbox>
                </u-checkbox-group>

                <u-button type="primary" class="btn" :disabled="selectRows.length == 0" @click="patchUnbindBtn">
                    批量解绑</u-button>

                <u-button type="primary" class="btn" :disabled="selectRows.length == 0"
                    @click="updatePathch(false)">批量修改</u-button>

                <u-button type="primary" class="exit" :disabled="tableData.length == 0" @click="switchShowCheck()">
                    {{ '退出' }}</u-button>


            </view>
            <!-- 全选复选框 -->

            <view class="no-data" v-if="tableData.length == 0">
                <uni-icons type="search" size="50"></uni-icons>
                <text>暂无相关数据</text>
            </view>
            <view class="main-content" v-else>
                <u-checkbox-group v-model="selectRows" placement="column" @change="selectChange">
                    <view v-for="(item, index) in tableData" :key="index" class="item-card">
                        <!-- 复选框 -->
                        <view v-if="showCheckboxes" class="checkbox-wrapper">
                            <u-checkbox :name="item.id"></u-checkbox>
                        </view>

                        <view class="order-card">
                            <view class="card-header">
                                <view class="order-id">产品名称:

                                    <text class="value">{{ item.productName }}</text>
                                </view>
                                <u-tag :text="
                    isActiveOptions.find((ele) => ele.value == item.isActive)
                      .label
                  " :type="
                    isActiveOptions.find((ele) => ele.value == item.isActive)
                      .type
                  "></u-tag>
                            </view>

                            <view class="balance">

                                <view class="item">
                                    <text class="info-value price">{{ item.providerRate }} %</text>
                                    <text class="info-label">码商费率:</text>
                                </view>

                                <view class="item">
                                    <text class="info-value price">¥{{ item.providerPerTransactionFee }}</text>
                                    <text class="info-label">单笔费用:</text>
                                </view>


                            </view>

                            <view class="card-footer">
                                <u-button class="modify" @click="showEditDialog(item)"> 修改 </u-button>
                                <u-button class="unlock" @click="unBindItem(item)"> 解绑 </u-button>
                            </view>
                        </view>
                    </view>
                </u-checkbox-group>

                <pagination @change="onPaginationChange" :total="total" :value="page.pageNum"></pagination>
            </view>
        </scroll-view>

        <!-- 搜索弹窗 -->
        <uni-popup ref="queryPopupRef" :show="showFilter" @maskClick="closeSearchModal()">
            <view class="query-popup">
                <view class="popup-header">
                    <text class="popup-title">搜索条件</text>
                    <uni-icons type="closeempty" class="close-icon" size="26" @click="closeSearchModal()"></uni-icons>
                </view>

                <scroll-view class="modal-content" scroll-y>
                    <uni-forms ref="queryFormDataRef" :model="queryFormData" :rules="queryRules" label-position="top"
                        label-width="200">
                        <!-- 查询的条目 -->
                        <uni-forms-item label="产品名称" name="productName">
                            <!-- <uni-easyinput
                v-model="queryFormData.productName"
                placeholder="请输入产品名称"
                @blur="$refs.queryFormDataRef.validateField('productName')"
            /> -->
                            <MySelect haveAll :options="allProductList" v-model="queryFormData.productId">
                            </MySelect>
                        </uni-forms-item>

                        <uni-forms-item label="是否启用" name="isActive">
                            <MySelect haveAll :options="isActiveOptions" v-model="queryFormData.isActive">
                            </MySelect>
                        </uni-forms-item>
                    </uni-forms>
                </scroll-view>

                <view class="query-buttons">
                    <u-button icon="reload" class="reset-btn" @click="resetQueryForm()">重置</u-button>
                    <u-button icon="search" class="search-btn" @click="btnSearchClick()">搜索</u-button>
                </view>
            </view>
        </uni-popup>

        <!-- 新增  和  修改  弹窗 -->
        <uni-popup ref="addPopupRef" :show="dialogVisible" @maskClick="onDialogBtnCancel()">
            <view class="query-popup">
                <view class="popup-header">
                    <text class="popup-title">{{
            isEdit ? '修改产品' : '新增产品'
          }}</text>
                    <uni-icons type="closeempty" class="close-icon" size="26" @click="onDialogBtnCancel()"></uni-icons>
                </view>

                <scroll-view class="modal-content" scroll-y>
                    <uni-forms ref="formDataRef" :model="formData" :rules="formDataRules" label-position="top"
                        label-width="200">
                        <uni-forms-item label="码商名称" name="">
                            <uni-easyinput v-model="userNickName" placeholder="请输入码商名称" disabled />
                        </uni-forms-item>

                        <uni-forms-item v-if="!isEdit" label="产品名称" name="productIds" required>
                            <MySelect :options="allProductList" v-model="formData.productIds" placeholder="请选择产品名称">
                            </MySelect>
                        </uni-forms-item>
                        <uni-forms-item v-if="isEdit" label="产品名称" name="">
                            <uni-easyinput v-model="formData.productName" disabled />
                        </uni-forms-item>

                        <uni-forms-item label="码商费率(%)" name="providerRate" required>
                            <uni-easyinput v-model="formData.providerRate" placeholder="请输入码商费率"
                                @blur="$refs.formDataRef.validateField('providerRate')" />
                        </uni-forms-item>

                        <uni-forms-item label="单笔费用" name="providerPerTransactionFee" required>
                            <uni-easyinput v-model="formData.providerPerTransactionFee" placeholder="请输入单笔费用" @blur="
                  $refs.formDataRef.validateField('providerPerTransactionFee')
                " />
                        </uni-forms-item>

                        <uni-forms-item label="是否启用" name="isActive" required>
                            <MySelect :options="isActiveOptions" v-model="formData.isActive">
                            </MySelect>
                        </uni-forms-item>
                    </uni-forms>
                </scroll-view>

                <view class="query-buttons">
                    <u-button @click="onDialogBtnCancel()">取消</u-button>
                    <u-button type="primary" @click="onDialogBtnOk()">确定</u-button>
                </view>
            </view>
        </uni-popup>

        <AllUpdate :isAll="isAll" :providerId="providerId" @flushPage="flushPage" :idList="selectRows"
            :updateVisible.sync="updateVisible"></AllUpdate>
    </view>
</template>

<script>
    import {
        formatDateTime
    } from '@/utils'

    import {
        queryRules,
        formDataRules,
        balanceRules
    } from './rules'

    import {
        amountCheck
    } from '@/utils/validate.js'

    import {
        refreshOptions,
        orderStateOptions,
        notifyStatusOptions,
        isActiveOptions,
        balanceTypeOptions,
        changeTypeOptions
    } from '@/utils/constants.js'

    import {
        getProviderListPage,
        masterProviderAdd,
        masterProviderCopy,
        getProviderOpenInfo,
        deleteProductProviderRelRelation,
        getProviderLevel,
        getProductProviderRel,
        batchDeleteProductProviderRelRelation,
        UpdateProductProviderRelationById,
        transferBalance,
        createProviderProductRelation
    } from '@/api/report-center'

    import {
        getProductListByProviderIdWhenConfigProduct
    } from '@/api/report-center'

    import {
        debounce
    } from '@/utils/index.js'

    import AllUpdate from './all-update.vue'

    export default {
        name: 'ReceiveOrder',
        components: {
            AllUpdate
        },
        data() {
            return {
                formDataRules,
                isActiveOptions,
                queryRules,
                userNickName: '',
                providerId: '',
                oldScrollTop: 0,
                scrollTop: 0,
                refreshTriggered: false,
                tableData: [],
                showFilter: false,
                queryFormData: this.getQueryForm(),
                total: 0,
                page: {
                    pageSize: 10,
                    pageNum: 1
                },
                dialogVisible: false,
                formData: {},
                isEdit: false, // true 复制  false 新增

                showCheckboxes: false, // 控制复选框的显示与隐藏
                isAllSelected: [], // 全选状态
                selectRows: [], // 选中的复选框的值
                updateVisible: false, // 控制弹窗的显示与隐藏
                isAll: false,
                idList: [],
                allProductList: []
            }
        },
        props: {
            options: {
                type: Object,
                default: {}
            }
        },
        created() {
            const options = this.options
            console.log('------options---', options)
            this.providerId = options.providerId
            this.userNickName = options.userNickName
            this.flushPage()
            getProductListByProviderIdWhenConfigProduct(this.providerId).then((res) => {
                this.allProductList = res.data.map((ele) => {
                    return {
                        label: ele.productName,
                        value: ele.productId
                    }
                })
            })
        },

        watch: {
            balanceDialogVisible(v) {
                if (this.$refs.balanceDialogRef) {
                    if (v) {
                        this.$refs.balanceDialogRef.open('bottom')
                    } else {
                        this.$refs.balanceDialogRef.close()
                    }
                }
            },
            showFilter(v) {
                if (this.$refs.queryPopupRef) {
                    if (v) {
                        this.$refs.queryPopupRef.open('bottom')
                    } else {
                        this.$refs.queryPopupRef.close()
                    }
                }
            },
            dialogVisible(v) {
                if (this.$refs.addPopupRef) {
                    if (v) {
                        this.$refs.addPopupRef.open('bottom')
                    } else {
                        this.$refs.addPopupRef.close()
                    }
                }
            },
            user_info_dialog(v) {
                if (this.$refs.user_info_ref) {
                    if (v) {
                        this.$refs.user_info_ref.open('bottom')
                    } else {
                        this.$refs.user_info_ref.close()
                    }
                }
            }
        },
        onUnload() {},
        methods: {
            onSubNavClick(v) {
                this.queryFormData.isActive = v
                this.queryTableData()
            },
            updatePathch(isAll) {
                this.isAll = isAll
                this.updateVisible = true
            },
            switchShowCheck() {
                this.showCheckboxes = !this.showCheckboxes
                this.selectRows = []
                this.isAllSelected = []
            },
            // 全选/全不选
            selectAll(e) {
                console.log('--select all --', e)
                if (e.length > 0) {
                    this.selectRows = this.tableData.map((item) => item.id) // 全选
                } else {
                    this.selectRows = [] // 全不选
                }
            },
            selectChange(row) {
                console.log('--select change --', row)
                if (row.length == this.tableData.length) {
                    this.isAllSelected = ['all'] // 全选
                } else {
                    this.isAllSelected = [] // 全不选
                }
                this.selectRows = row // 更新选中的复选框的值
                console.log('----this.selectRows----', this.selectRows)
            },
            patchUnbindBtn() {
                uni.showModal({
                    title: '确认解绑',
                    content: `确定要解绑选中的产品吗？`,
                    success: async (res) => {
                        if (res.confirm) {
                            await batchDeleteProductProviderRelRelation(this.selectRows)

                            this.$message.success('解绑成功')
                            this.flushPage()
                        }
                    }
                })
            },
            unBindItem(item) {
                uni.showModal({
                    title: '确认解绑',
                    content: `确定要解绑 ${item.productName} 吗？`,
                    success: async (res) => {
                        if (res.confirm) {
                            await deleteProductProviderRelRelation(item.id)
                            this.$message.success('解绑成功')
                            this.flushPage()
                        }
                    }
                })
            },
            onDialogBtnCancel() {
                this.$refs.formDataRef.clearValidate()
                this.dialogVisible = false
            },
            onDialogBtnOk() {
                this.$refs.formDataRef
                    .validate()
                    .then(async (ret) => {
                        try {
                            if (this.isEdit) {
                                await UpdateProductProviderRelationById({
                                    providerId: this.providerId,
                                    id: this.formData.id,
                                    productId: this.formData.productId,
                                    providerRate: this.formData.providerRate,
                                    providerPerTransactionFee: this.formData.providerPerTransactionFee,
                                    isActive: this.formData.isActive
                                })
                                this.$message.success('修改成功')
                            } else {
                                let res = await createProviderProductRelation({
                                    providerId: this.providerId,
                                    ...this.formData,
                                    productIds: [this.formData.productIds],
                                })
                                console.log(res, 'res')
                                this.$message.success('添加成功')
                            }

                            this.onDialogBtnCancel()
                            this.flushPage()

                        } catch (e) {
                            this.$message.error(e)
                        }




                    })
                    .catch((err) => {
                        this.$message.error('输入不正确，请检查')
                    })
            },
            flushPage() {
                this.queryTableData()
                this.showCheckboxes = false // 隐藏复选框
                this.isAllSelected = [] // 取消全选
                this.selectRows = [] // 清空选中的复选框的值
                this.queryFormData = this.getQueryForm()
            },
            showAddDialog() {
                this.isEdit = false
                this.dialogVisible = true
                this.formData = {
                    isActive: 1,
                }
            },
            showEditDialog(item) {
                this.isEdit = true
                this.dialogVisible = true
                this.formData = Object.assign({}, item)
            },
            onScrollRefresh() {
                console.log('---onScrollRefresh----')
                this.refreshTriggered = true
                this.queryTableData()
            },
            /**
			 分页器改变的监听 
			 */
            onPaginationChange(page) {
                this.page = page
                this.queryTableData()
            },
            // onLoadMore: debounce(function() {
            //   if (this.$store.state.isLoading) return
            //   this.page.pageNum += 1
            //   console.log('-----this.page.pageNum-----', this.page.pageNum);
            //   this.queryTableData()
            // }),
            closeSearchModal() {
                this.showFilter = false
                this.resetQueryForm()
                if (this.$refs.queryFormDataRef) {
                    this.$refs.queryFormDataRef.clearValidate()
                }
            },
            resetQueryForm() {
                this.queryFormData = this.getQueryForm()
            },
            btnSearchClick() {
                this.$refs.queryFormDataRef
                    .validate()
                    .then(async (ret) => {
                        console.log('验证通过', ret)
                        this.queryTableData()
                    })
                    .catch((err) => {
                        console.log('验证失败', err)
                        console.log(this.queryFormData)
                        this.$message.error('输入不正确，请检查')
                    })
            },
            // 确认搜索
            async queryTableData() {
                console.log('--this.queryFormData---', this.queryFormData)
                let params = {
                    providerId: this.providerId
                }
                Object.keys(this.queryFormData).forEach((key) => {
                    if (this.queryFormData[key] !== undefined) {
                        if (key == 'createTime') {
                            params['startTime'] = this.queryFormData['createTime'][0]
                            params['endTime'] = this.queryFormData['createTime'][1]
                        } else {
                            params[key] = this.queryFormData[key]
                        }
                    }
                })

                try {
                    let res = await getProductProviderRel(params, this.page)
                    console.log(res)
                    this.tableData = res.data.list
                    this.total = res.data.total
                } catch (e) {
                    console.log(e)
                } finally {}

                this.refreshTriggered = false
                this.scrollToTop()
                this.closeSearchModal()
            },
            scrollToTop() {
                this.scrollTop = this.oldScrollTop
                this.$nextTick(() => {
                    this.scrollTop = 0
                })
            },
            getQueryForm() {

                const lastOrderStatus = this.queryFormData != undefined && this.queryFormData.isActive != undefined ?
                    this
                    .queryFormData.isActive : ''

                return {
                    productId: '',
                    isActive: lastOrderStatus
                }
            },

            // 长按条目显示复选框
            onItemLongPress() {
                this.showCheckboxes = true
                this.isAllSelected = false
            }
        }
    }
</script>

<style lang="scss" scoped>
    ::v-deep .nav-bar.isShowUi {
        border-radius: 0;
    }

    .container {
        .order-list {
            height: calc(100% - 40px);
        }
    }

    .opt-btn {
        padding: 0 20rpx;
        align-items: center;

        .u-button--primary {
            border-radius: 40rpx !important;
            background-image: linear-gradient(to right, #AE9281 0%, #FFF6ED 50%, #EDD0BE 100%);
            color: #071A36;
            border: none;
        }

        .copy-btn::after,
        .add-btn::after {
            background-image: url(/static/imgs/add.png);
            background-size: contain;
            width: 36rpx;
            height: 36rpx;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            margin-left: -60rpx;
        }

        .copy-btn::after {
            background-image: url(/static/imgs/copy.png);
        }

    }

    .modify-box {
        font-size: 24rpx;
        padding: 0;

        ::v-deep .u-button {
            height: 50rpx;
        }

        .exit {
            width: 300rpx;
        }

        .btn {
            width: 400rpx;
        }
    }

    .nav-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 440rpx;
        height: 72rpx;
        border: 2rpx solid #FFFFFF26;
        border-radius: 36rpx;

        .left,
        .right {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 200rpx;
            height: 64rpx;
            border-radius: 32rpx;
        }

        .left {
            background-image: linear-gradient(to right, #AE9281 0%, #FFF6ED 50%, #EDD0BE 100%);
        }

        .right {
            color: #CFD5E3;
        }

    }


    .sub-nav-bar {
        display: flex;
        padding: 0 30rpx;
        background-color: #232738;
        border-radius: 0 0 40rpx 40rpx;
        justify-content: space-evenly;
        height: 80rpx;
        // align-items: center;

        .item {
            width: 25%;
            color: #CFD5E3;
            text-align: center;
            line-height: 80rpx;
        }

        .curr {
            color: #E0C4B2;
            border-bottom: 8rpx solid #E0C4B2;
            box-sizing: border-box;
        }
    }

    .main-content {
        background-color: #eff4ff;

        .order-card {
            padding: 0;
            margin: 20rpx 0;

            .card-header {
                display: flex;
                padding: 0 40rpx;
                align-items: center;
                height: 72rpx;
                background-image: linear-gradient(to right, #AE9281 0%, #FFF6ED 50%, #EDD0BE 100%);
                border-radius: 20rpx 20rpx 0 0;
                color: #071A36;

                .value {
                    font-weight: 600;
                }
            }

            .balance {
                display: flex;
                padding: 20rpx;
                justify-content: space-evenly;

                .item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;

                    .info-value {
                        font-weight: 700;
                    }

                    .info-label {
                        font-size: 24rpx;
                        color: #999999;
                    }
                }

            }

            .card-footer {
                padding-top: 0;

                .action-btn {
                    border-color: #EBEDF0 !important;
                    padding-left: 50rpx;
                    padding-right: 15rpx;
                    box-sizing: border-box;
                    font-size: 24rpx;
                }

                .modify::after,
                .unlock::after {
                    content: '';
                    width: 36rpx;
                    height: 36rpx;
                    background-image: url(/static/imgs/modify.png);
                    background-size: contain;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    margin-left: -60rpx;
                }

                .unlock::after {
                    background-image: url(/static/imgs/unlock.png);
                }

            }

            .footer {
                height: 60rpx;
                border-top: 2rpx dashed #EEEEEE;
                margin-bottom: 0;
                align-items: center;
            }
        }
    }

    ::v-deep .u-tag--success {
        background-image: linear-gradient(to top, #6BBCFF 0%, #0D92FF 100%) !important;

        .u-tag__text {
            color: #fff !important;
        }

    }

    ::v-deep .u-tag-- {
        background-image: linear-gradient(to top, #52CABC 0%, #41B5A8 100%) !important;

        .u-tag__text {
            color: #fff !important;
        }
    }


    .refresh-control {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10rpx 20rpx;
        margin: 20rpx;
        background-color: #d8dae0;
        border-radius: 10rpx;
        margin-bottom: 20rpx;
        box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
    }

    .refresh-select {
        flex: 1;
    }

    .refresh-select .picker {
        color: #333;
        font-size: 28rpx;
    }

    .refresh-timer {
        color: #666;
        font-size: 26rpx;
    }

    ::v-deep .uni-forms-item {
        flex: 1;
    }

    ::v-deep .no-label-title {
        margin-bottom: 0 !important;
    }

    ::v-deep .uni-date__x-input {
        font-size: 13px;
    }


    ::v-deep .card-footer .u-button {
        height: 60rpx;
    }
</style>