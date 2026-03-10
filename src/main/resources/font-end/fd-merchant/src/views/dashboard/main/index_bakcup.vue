<template>
  <div class="container">


    <el-card>

      <h3 class="h3Color">账户汇总:  <button>刷新</button>  </h3>
    <el-row :gutter="20" class="panel-group">
      <el-col
        :xs="12"
        :sm="8"
        :lg="6"
        class="card-panel-col"
      >
        <div class="card-panel">
          <div class="card-panel-description">
            <div class="card-panel-text">
              商户可用余额:
            </div>
            <div class="card-panel-num">
              <span>
                {{this.itemList.length!==0?this.itemList[1].totalOrderCount :''}}
                <!-- <count-to :start-val="0" :end-val="parseInt(item.num)" :duration="1500" class="card-panel-num" /> -->
              </span> 
              个
            </div>
          </div>
        </div>
      </el-col>
      <el-col
        :xs="12"
        :sm="8"
        :lg="6"
        class="card-panel-col"
      >
        <div class="card-panel">
          <div class="card-panel-description">
            <div class="card-panel-text">
              商户冻结金额:
            </div>
            <div class="card-panel-num">
              <span>
                {{this.itemList.length!==0?this.itemList[1].totalOrderAmount:'' }}
                <!-- <count-to :start-val="0" :end-val="parseInt(item.num)" :duration="1500" class="card-panel-num" /> -->
              </span> 
              元
            </div>
          </div>
        </div>
      </el-col>
      <el-col
        :xs="12"
        :sm="8"
        :lg="6"
        class="card-panel-col"
      >
        <div class="card-panel">
          <div class="card-panel-description">
            <div class="card-panel-text">
              商户代收押金:
            </div>
            <div class="card-panel-num">
              <span>
                {{this.itemList.length!==0?this.itemList[1].successRate:'' }}
                <!-- <count-to :start-val="0" :end-val="parseInt(item.num)" :duration="1500" class="card-panel-num" /> -->
              </span> 
              %
            </div>
          </div>
        </div>
      </el-col>
      <el-col
        :xs="12"
        :sm="8"
        :lg="6"
        class="card-panel-col"
      >
        <div class="card-panel">
          <div class="card-panel-description">
            <div class="card-panel-text">
              码商可用余额:
            </div>
            <div class="card-panel-num">
              <span>
                {{this.itemList.length!==0?this.itemList[1].systemServiceCharge:'' }}
                <!-- <count-to :start-val="0" :end-val="parseInt(item.num)" :duration="1500" class="card-panel-num" /> -->
              </span> 
              元
            </div>
          </div>
        </div>
      </el-col>
      <el-col
        :xs="12"
        :sm="8"
        :lg="6"
        class="card-panel-col"
      >
        <div class="card-panel">
          <div class="card-panel-description">
            <div class="card-panel-text">
              码商冻结金额:
            </div>
            <div class="card-panel-num">
              <span>
                {{this.itemList.length!==0?this.itemList[1].finishOrderCount:'' }}
                <!-- <count-to :start-val="0" :end-val="parseInt(item.num)" :duration="1500" class="card-panel-num" /> -->
              </span> 
              个
            </div>
          </div>
        </div>
      </el-col>
      <el-col
        :xs="12"
        :sm="8"
        :lg="6"
        class="card-panel-col"
      >
        <div class="card-panel">
          <div class="card-panel-description">
            <div class="card-panel-text">
              码商代付处理中金额:
            </div>
            <div class="card-panel-num">
              <span>
                {{this.itemList.length!==0?this.itemList[1].finishOrderAmount:'' }}
                <!-- <count-to :start-val="0" :end-val="parseInt(item.num)" :duration="1500" class="card-panel-num" /> -->
              </span> 
              元
            </div>
          </div>
        </div>
      </el-col>
      <el-col
        :xs="12"
        :sm="8"
        :lg="6"
        class="card-panel-col"
      >
        <div class="card-panel">
          <div class="card-panel-description">
            <div class="card-panel-text">
              总金额:
            </div>
            <div class="card-panel-num">
              <span>
                {{this.itemList.length!==0?this.itemList[1].finishOrderAmount:'' }}
                <!-- <count-to :start-val="0" :end-val="parseInt(item.num)" :duration="1500" class="card-panel-num" /> -->
              </span> 
              元
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    </el-card>


    <div class="btn-change">
      <el-radio-group v-model="flag" @input="radioChange">
        <el-radio-button label="1">代收</el-radio-button>
        <el-radio-button label="2">代付</el-radio-button>
      </el-radio-group>
    </div>

    <el-row :gutter="20" class="panel-group">
      <h3 class="h3Color">今日统计:</h3>
      <el-col
        :xs="12"
        :sm="8"
        :lg="6"
        class="card-panel-col"
      >
        <div class="card-panel">
          <div class="card-panel-description">
            <div class="card-panel-text">
              订单数量:
            </div>
            <div class="card-panel-num">
              <span>
                {{this.itemList.length!==0?this.itemList[0].totalOrderCount :''}}
                <!-- <count-to :start-val="0" :end-val="parseInt(item.num)" :duration="1500" class="card-panel-num" /> -->
              </span> 
              个
            </div>
          </div>
        </div>
      </el-col>
      <el-col
        :xs="12"
        :sm="8"
        :lg="6"
        class="card-panel-col"
      >
        <div class="card-panel">
          <div class="card-panel-description">
            <div class="card-panel-text">
              订单金额:
            </div>
            <div class="card-panel-num">
              <span>
                {{this.itemList.length!==0?this.itemList[0].totalOrderAmount:'' }}
                <!-- <count-to :start-val="0" :end-val="parseInt(item.num)" :duration="1500" class="card-panel-num" /> -->
              </span> 
              元
            </div>
          </div>
        </div>
      </el-col>
      <el-col
        :xs="12"
        :sm="8"
        :lg="6"
        class="card-panel-col"
      >
        <div class="card-panel">
          <div class="card-panel-description">
            <div class="card-panel-text">
              成功率:
            </div>
            <div class="card-panel-num">
              <span>
                {{this.itemList.length!==0?this.itemList[0].successRate:'' }}
                <!-- <count-to :start-val="0" :end-val="parseInt(item.num)" :duration="1500" class="card-panel-num" /> -->
              </span> 
              %
            </div>
          </div>
        </div>
      </el-col>
      <el-col
        :xs="12"
        :sm="8"
        :lg="6"
        class="card-panel-col"
      >
        <div class="card-panel">
          <div class="card-panel-description">
            <div class="card-panel-text">
              利润:
            </div>
            <div class="card-panel-num">
              <span>
                {{this.itemList.length!==0?this.itemList[0].systemServiceCharge:'' }}
                <!-- <count-to :start-val="0" :end-val="parseInt(item.num)" :duration="1500" class="card-panel-num" /> -->
              </span> 
              元
            </div>
          </div>
        </div>
      </el-col>
      <el-col
        :xs="12"
        :sm="8"
        :lg="6"
        class="card-panel-col"
      >
        <div class="card-panel">
          <div class="card-panel-description">
            <div class="card-panel-text">
              成交订单数量:
            </div>
            <div class="card-panel-num">
              <span>
                {{this.itemList.length!==0?this.itemList[0].finishOrderCount :''}}
                <!-- <count-to :start-val="0" :end-val="parseInt(item.num)" :duration="1500" class="card-panel-num" /> -->
              </span> 
              个
            </div>
          </div>
        </div>
      </el-col>
      <el-col
        :xs="12"
        :sm="8"
        :lg="6"
        class="card-panel-col"
      >
        <div class="card-panel">
          <div class="card-panel-description">
            <div class="card-panel-text">
              成交订单金额:
            </div>
            <div class="card-panel-num">
              <span>
                {{this.itemList.length!==0?this.itemList[0].finishOrderAmount:'' }}
                <!-- <count-to :start-val="0" :end-val="parseInt(item.num)" :duration="1500" class="card-panel-num" /> -->
              </span> 
              元
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <h3 class="h3Color">昨日统计:</h3>
    <el-row :gutter="20" class="panel-group">
      <el-col
        :xs="12"
        :sm="8"
        :lg="6"
        class="card-panel-col"
      >
        <div class="card-panel">
          <div class="card-panel-description">
            <div class="card-panel-text">
              订单数量:
            </div>
            <div class="card-panel-num">
              <span>
                {{this.itemList.length!==0?this.itemList[1].totalOrderCount :''}}
                <!-- <count-to :start-val="0" :end-val="parseInt(item.num)" :duration="1500" class="card-panel-num" /> -->
              </span> 
              个
            </div>
          </div>
        </div>
      </el-col>
      <el-col
        :xs="12"
        :sm="8"
        :lg="6"
        class="card-panel-col"
      >
        <div class="card-panel">
          <div class="card-panel-description">
            <div class="card-panel-text">
              订单金额:
            </div>
            <div class="card-panel-num">
              <span>
                {{this.itemList.length!==0?this.itemList[1].totalOrderAmount:'' }}
                <!-- <count-to :start-val="0" :end-val="parseInt(item.num)" :duration="1500" class="card-panel-num" /> -->
              </span> 
              元
            </div>
          </div>
        </div>
      </el-col>
      <el-col
        :xs="12"
        :sm="8"
        :lg="6"
        class="card-panel-col"
      >
        <div class="card-panel">
          <div class="card-panel-description">
            <div class="card-panel-text">
              成功率:
            </div>
            <div class="card-panel-num">
              <span>
                {{this.itemList.length!==0?this.itemList[1].successRate:'' }}
                <!-- <count-to :start-val="0" :end-val="parseInt(item.num)" :duration="1500" class="card-panel-num" /> -->
              </span> 
              %
            </div>
          </div>
        </div>
      </el-col>
      <el-col
        :xs="12"
        :sm="8"
        :lg="6"
        class="card-panel-col"
      >
        <div class="card-panel">
          <div class="card-panel-description">
            <div class="card-panel-text">
              利润:
            </div>
            <div class="card-panel-num">
              <span>
                {{this.itemList.length!==0?this.itemList[1].systemServiceCharge:'' }}
                <!-- <count-to :start-val="0" :end-val="parseInt(item.num)" :duration="1500" class="card-panel-num" /> -->
              </span> 
              元
            </div>
          </div>
        </div>
      </el-col>
      <el-col
        :xs="12"
        :sm="8"
        :lg="6"
        class="card-panel-col"
      >
        <div class="card-panel">
          <div class="card-panel-description">
            <div class="card-panel-text">
              成交订单数量:
            </div>
            <div class="card-panel-num">
              <span>
                {{this.itemList.length!==0?this.itemList[1].finishOrderCount:'' }}
                <!-- <count-to :start-val="0" :end-val="parseInt(item.num)" :duration="1500" class="card-panel-num" /> -->
              </span> 
              个
            </div>
          </div>
        </div>
      </el-col>
      <el-col
        :xs="12"
        :sm="8"
        :lg="6"
        class="card-panel-col"
      >
        <div class="card-panel">
          <div class="card-panel-description">
            <div class="card-panel-text">
              成交订单金额:
            </div>
            <div class="card-panel-num">
              <span>
                {{this.itemList.length!==0?this.itemList[1].finishOrderAmount:'' }}
                <!-- <count-to :start-val="0" :end-val="parseInt(item.num)" :duration="1500" class="card-panel-num" /> -->
              </span> 
              元
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    
  </div>
</template>

<script>
import CountTo from 'vue-count-to'
import {getDashBoard} from '@/api/user'

export default {
  components: {
    CountTo
  },
  data() {
    return {
      flag: '1',
      allData:[],//全部数据
      itemList:[],//代收数据/代付数据
    }
  },
  created(){
      this.getDashBoard()
  },
  methods: {
    

    async getDashBoard(){
      // 加载框自动显示，如需修改文字，也可手动调用
      // this.showLoading('加载中，请稍候..')
      let ret= await getDashBoard()
      console.log(ret.data,'----dashBoardData----')
      this.allData=ret.data
      this.itemList=ret.data.agentIncomeData
      // this.hideLoading() // 会自动隐藏，也可手动隐藏

    },
    radioChange(e) {
      this.flag = e!==undefined ? e : '1'
      this.itemList=this.flag == '1'?this.allData.agentIncomeData:this.allData.agentPayData
    },
    
  },
  mounted() {
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 10px;

  ::v-deep .el-radio-button:first-child .el-radio-button__inner {
    border-radius: 2px 0 0 2px;
  }
  ::v-deep .el-radio-button:last-child .el-radio-button__inner {
    border-radius: 0 2px 2px 0;
  }
  ::v-deep .el-radio-button__orig-radio:checked + .el-radio-button__inner {
    background-color: #42b983;
    border-color: #42b983;
    box-shadow: -1px 0 0 0 #42b983;
  }
  ::v-deep .el-radio-button__inner:hover {
    color: #42b983;
  }
  .btn-change {
    padding: 0 10px;
  }
  .h3Color {
    color: #333;
  }

  .panel-group {
    // margin-top: 18px;
    margin-left: 0 !important;
    margin-right: 0 !important;

    .card-panel-col {
      margin-bottom: 20px;
    }

    .card-panel {
      height: 90px;
      cursor: pointer;
      font-size: 12px;
      position: relative;
      overflow: hidden;
      color: #333;
      background: #fff;
      box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.1);
      border-color: rgba(0, 0, 0, 0.05);
      padding: 0 40px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;

      &:hover {
        .card-panel-icon-wrapper {
          color: #fff;
        }

        .icon-people {
          background: #40c9c6;
        }
      }

      .icon-people {
        color: #40c9c6;
      }

      .card-panel-icon-wrapper {
        float: left;
        //   margin: 14px 0 0 14px;
        padding: 16px;
        transition: all 0.38s ease-out;
        border-radius: 6px;
      }

      .card-panel-icon {
        float: left;
        font-size: 48px;
      }

      .card-panel-description {
        font-weight: bold;
        display: flex;
        flex-direction: column;
        justify-content: space-around;

        .card-panel-text {
          line-height: 22px;
          color: #333;
          font-size: 18px;
          margin-bottom: 12px;
        }

        .card-panel-num {
          text-align: center;
          font-size: 20px;
          display: flex;
          justify-content: right;
          span {
            color: rgb(1, 114, 1);
            margin-right: 10px;
          }
        }
      }
    }
  }
}

@media (max-width: 550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
