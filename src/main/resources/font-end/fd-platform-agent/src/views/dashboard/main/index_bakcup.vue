<template>
  <div class="container">
    <el-card>
      <h3 class="h3Color">
        <span>账户汇总: 11</span>
      
      </h3>
      <div style="margin-bottom: 15px;" >
        <span>选择平台:</span> <el-select v-model="currTenant" placeholder="选择平台" :popper-append-to-body="false" style="width:120px; margin: 0 15px; ">
          <el-option
            v-for="i in 10"
            :key="i"
            :value="i"
            :label="'租户'+i"
          >
            <span>租户{{ i }}</span>
          </el-option>
        </el-select>

        <el-button type="primary" plain class="ml-10">刷新</el-button>
      </div>
      <el-row :gutter="20" class="panel-group huizong">
        <!-- <div class="tongji-body"> -->
        <el-col
          :xs="12"
          :sm="8"
          :lg="6"
          class="card-panel-col"
          v-for="(item, id) of topList"
          :key="id"
        >
          <div class="card-panel">
            <div class="card-panel-icon" :style="'background:' + item.bg">
              <svg-icon :icon-class="item.icon" />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">{{ item.label }}:</div>
              <div class="card-panel-num">
                <span>
                  {{ item.num }}
                  <!-- <count-to :start-val="0" :end-val="parseInt(item.num)" :duration="1500" class="card-panel-num" /> -->
                </span>
                {{ item.unit }}
              </div>
            </div>
          </div>
        </el-col>
        <!-- </div> -->
      </el-row>
    </el-card>

    <div class="btn-change">
      <el-radio-group v-model="flag" @input="radioChange">
        <el-radio-button label="1">代收</el-radio-button>
        <el-radio-button label="2">代付</el-radio-button>
      </el-radio-group>
    </div>

    <div class="panel-group">
      <h3 class="h3Color">今日统计:</h3>
      <div class="tongji-body">
        <el-card class="card-panel-col" v-for="(item, id) of itemList[0]" :key="id">
          <div class="card-panel">
            <div class="card-panel-icon" :style="'background:' + item.bg">
              <svg-icon :icon-class="item.icon" />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">{{ item.label }}:</div>
              <div class="card-panel-num">
                <span>
                  {{ item.num }}
                  <!-- <count-to :start-val="0" :end-val="parseInt(item.num)" :duration="1500" class="card-panel-num" /> -->
                </span>
                {{ item.unit }}
              </div>
            </div>
          </div>
        </el-card>
      </div>
    </div>

    <div class="panel-group">
      <h3 class="h3Color">昨日统计:</h3>
      <div class="tongji-body">
        <el-card class="card-panel-col" v-for="(item, id) of itemList[1]" :key="id">
          <div class="card-panel">
            <div class="card-panel-icon" :style="'background:' + item.bg">
              <svg-icon :icon-class="item.icon" />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">{{ item.label }}:</div>
              <div class="card-panel-num">
                <span>
                  {{ item.num }}
                  <!-- <count-to :start-val="0" :end-val="parseInt(item.num)" :duration="1500" class="card-panel-num" /> -->
                </span>
                {{ item.unit }}
              </div>
            </div>
          </div>
        </el-card>
      </div>
    </div>

    <!-- <h3 class="h3Color">昨日统计:</h3>
    <el-row :gutter="20" class="panel-group">
      <el-col
        :xs="12"
        :sm="8"
        :lg="6"
        class="card-panel-col"
        v-for="(item, id) of itemList[1]"
        :key="id"
      >
        <div class="card-panel">
          <div class="card-panel-icon" :style="'background:' + item.bg">
            <svg-icon :icon-class="item.icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">{{ item.label }}:</div>
            <div class="card-panel-num">
              <span>
                {{ item.num }}
              </span>
              {{ item.unit }}
            </div>
          </div>
        </div>
      </el-col>
    </el-row> -->
  </div>
</template>

<script>
import CountTo from 'vue-count-to'
// import { getDashBoard } from '@/api/user'
import mockDb from '@/utils/mockdb'

export default {
  components: {
    CountTo
  },
  data() {
    return {
      currTenant: 1,
      flag: '1',
      allData: [], //全部数据
      itemList: [], //代收数据/代付数据
      topList: [
        {
          id: '1',
          label: '商户可用余额',
          num: '4393',
          unit: '元',
          bg: '#cccccc',
          icon: 'dingdan'
        },
        {
          id: '2',
          label: '商户冻结金额',
          num: '36544',
          unit: '元',
          bg: '#FF8247',
          icon: 'dingdanjine'
        },
        {
          id: '3',
          label: '商户代收押金',
          num: '368',
          unit: '元',
          bg: '#548B54',
          icon: 'a-chenggongshuai1x'
        },
        {
          id: '4',
          label: '码商可用余额',
          num: '14587',
          unit: '元',
          bg: '#43CD80',
          icon: 'a-shourulirunzhuanqiantourubaochougongzi'
        },
        {
          id: '5',
          label: '码商冻结金额',
          num: '9658',
          unit: '元',
          bg: '#EEDC82',
          icon: 'hetong-dingdanshuliang'
        },
        {
          id: '7',
          label: '码商代付处理中金额',
          num: '1254',
          unit: '元',
          bg: '#828282',
          icon: 'hetong-dingdanshuliang'
        },
        {
          id: '6',
          label: '总金额',
          num: '25468',
          unit: '元',
          bg: '#7A378B',
          icon: 'chengjiaodingdanjine'
        }
      ] //顶部数据
    }
  },
  created() {
    this.getDashBoard()
  },
  methods: {
    async getDashBoard() {
      // 加载框自动显示，如需修改文字，也可手动调用
      // this.showLoading('加载中，请稍候..')
      // let ret = await getDashBoard()
      let ret = mockDb.dashBoardData
      // console.log(ret.data, '----dashBoardData----')
      this.allData = ret
      this.itemList = ret.income
      // this.hideLoading() // 会自动隐藏，也可手动隐藏
    },
    radioChange(e) {
      this.flag = e !== undefined ? e : '1'
      this.itemList = this.flag == '1' ? this.allData.income : this.allData.pay
    }
  },
  mounted() {}
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
    margin-top: 20px;
  }
  .h3Color {
    color: #333;
  }

  .panel-group {
    // margin-top: 18px;
    margin-left: 0 !important;
    margin-right: 0 !important;

    &.huizong {
      margin-left: 100px !important;
    }
    .tongji-body {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-evenly;

      ::v-deep .el-card__body {
        padding: 0;
      }
    }

    .card-panel-col {
      margin-bottom: 20px;
      width: 30%;
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
      // padding: 0 40px 0 0;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      border-radius: 3px;

      &:hover {
        .card-panel-icon-wrapper {
          color: #fff;
        }

        .icon-people {
          background: #63b8ff;
        }
      }
      .card-panel-icon {
        width: 140px;
        // color: #fff  !important;
        background: #63b8ff;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .icon-people {
        color: #40c9c6;
      }
      ::v-deep .svg-icon {
        font-size: 56px;
        color: #fff !important;
      }
      .card-panel-icon-wrapper {
        float: left;
        //   margin: 14px 0 0 14px;
        padding: 16px;
        transition: all 0.38s ease-out;
        border-radius: 6px;
      }

      // .card-panel-icon {
      //   float: left;
      //   font-size: 48px;
      // }

      .card-panel-description {
        font-weight: bold;
        display: flex;
        flex: 1;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        // margin: 0 30px;
        .card-panel-text {
          line-height: 22px;
          color: #333;
          font-size: 18px;
        }

        .card-panel-num {
          text-align: center;
          font-size: 20px;
          display: flex;
          // justify-content: right;
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

.dark {
  .container .panel-group .card-panel {
    background: #111;
  }
}
</style>
