<template>
  <div class="app-container">
    <el-row>
      <el-card>
        <div slot="header" class="clearfix">
          <span>购书转化率</span>
        </div>
        <el-col :span="8">
          <ve-pie :data="purchaseRate"></ve-pie>
        </el-col>
      </el-card>
    </el-row>
    <div class="statistics-layout" v-for="item in lineChartModules">
      <div class="layout-title">{{item.title}}</div>
      <el-row>
        <el-col :span="20">
          <div style="padding: 10px;border-left:1px solid #DCDFE6">

            <div>
              <ve-line
                :data="item.chartData"
                :legend-visible="false"
                :loading="loading"
                :data-empty="dataEmpty"
                :settings="chartSettings"></ve-line>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import img_home_order from '@/assets/images/home_order.png';
  import img_home_today_amount from '@/assets/images/home_today_amount.png';
  import img_home_yesterday_amount from '@/assets/images/home_yesterday_amount.png';
  import {Message} from "element-ui";
  import request from '@/utils/request'

  /*const DATA_FROM_BACKEND = {
    columns: ['date', 'orderCount', 'orderAmount'],
    rows: [
      {date: '2018-11-01', orderCount: 10, orderAmount: 1093},
      {date: '2018-11-02', orderCount: 20, orderAmount: 2230},
      {date: '2018-11-03', orderCount: 33, orderAmount: 3623},
      {date: '2018-11-04', orderCount: 50, orderAmount: 6423},
      {date: '2018-11-05', orderCount: 80, orderAmount: 8492},
      {date: '2018-11-06', orderCount: 60, orderAmount: 6293},
      {date: '2018-11-07', orderCount: 20, orderAmount: 2293},
      {date: '2018-11-08', orderCount: 60, orderAmount: 6293},
      {date: '2018-11-09', orderCount: 50, orderAmount: 5293},
      {date: '2018-11-10', orderCount: 30, orderAmount: 3293},
      {date: '2018-11-11', orderCount: 20, orderAmount: 2293},
      {date: '2018-11-12', orderCount: 80, orderAmount: 8293},
      {date: '2018-11-13', orderCount: 100, orderAmount: 10293},
      {date: '2018-11-14', orderCount: 10, orderAmount: 1293},
      {date: '2018-11-15', orderCount: 40, orderAmount: 4293}
    ]
  };*/
  export default {
    name: 'home',
    data() {
      return {
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              let start = new Date();
              start.setFullYear(2018);
              start.setMonth(10);
              start.setDate(1);
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一月',
            onClick(picker) {
              const end = new Date();
              let start = new Date();
              start.setFullYear(2018);
              start.setMonth(10);
              start.setDate(1);
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        orderCountDate: '',
        chartSettings: {
          xAxisType: 'value',
          area: true,
          axisSite: {right: ['orderAmount']},
          labelMap: {'orderCount': '订单数量', 'orderAmount': '订单金额'}
        },
        chartData: {
          columns: [],
          rows: []
        },
        loading: false,
        dataEmpty: false,
        img_home_order,
        img_home_today_amount,
        img_home_yesterday_amount,

        lineChartModules: [
          {
            title: '',
            chartData: {
              columns: ['xAxisName', 'yAxisName'],
              rows: [
                {'x': 1, 'y': 1},
              ]
            }
          },
        ],
        salesChart: {
          title: '销售额',
          loading: false,
          data: {
            columns: [],
            rows: []
          },
          shownDataRows: []
        },
        userViewsChart: {
          title: '用户访问量',
          loading: false,
          data: {
            columns: [],
            rows: []
          },
          shownDataRows: []
        },

        purchaseRate: {
          columns: ['name', 'rate'],
          rows: [
            {'name': '购书率', 'rate': 0},
            {'name': '未购书', 'rate': 0}
          ]
        }
      }
    },
    created() {
      this.initOrderCountDate();
      //this.loadSalesChart()
      //this.loadUserViews()
      this.loadModulesChart()
      this.loadPurchaseRate()
    },
    methods: {
      loadPurchaseRate() {
        request.get('/admin/purchaseRate').then(response => {
          this.purchaseRate.rows[0].rate = response.data
          this.purchaseRate.rows[1].rate = 1 - this.purchaseRate.rows[0].rate
          this.purchaseRate.rows[0].name = `${this.purchaseRate.rows[0].name}-${response.data}`
        }).catch(error => {
          Message.error(`购书转化率拉取失败: ${error}`)
        })
      },
      handleDateChange() {
        this.getData();
      },
      initOrderCountDate() {
        let start = new Date();
        start.setFullYear(2018);
        start.setMonth(10);
        start.setDate(1);
        const end = new Date();
        end.setTime(start.getTime() + 1000 * 60 * 60 * 24 * 7);
        this.orderCountDate = [start, end];
      },
      loadModulesChart() {
        request.get('/admin/index/module').then(data => {
          this.lineChartModules = data.data
        }).catch(error => {
          Message.error(`数据加载失败：${error.error}`)
        })
      },
      loadSalesChart() {
        request.get('/admin/index/sales').then(data => {
          this.lineChartModules.push(data.data)
          this.salesChart = data.data
        }).catch(error => {
          Message.error(`销售额数据加载失败：${error.error}`)
        })
      },
      loadUserViews() {
        request.get('/admin/index/userViews').then(data => {
          this.lineChartModules.push(data.data)
          this.userViewsChart = data.data
        }).catch(error => {
          Message.error(`用户访问数据加载失败：${error.error}`)
        })
      },
    }
  }
</script>

<style scoped>
  .app-container {
    margin-top: 40px;
    margin-left: 120px;
    margin-right: 120px;
  }

  .address-layout {
  }

  .total-layout {
    margin-top: 20px;
  }

  .total-frame {
    border: 1px solid #DCDFE6;
    padding: 20px;
    height: 100px;
  }

  .total-icon {
    color: #409EFF;
    width: 60px;
    height: 60px;
  }

  .total-title {
    position: relative;
    font-size: 16px;
    color: #909399;
    left: 70px;
    top: -50px;
  }

  .total-value {
    position: relative;
    font-size: 18px;
    color: #606266;
    left: 70px;
    top: -40px;
  }

  .un-handle-layout {
    margin-top: 20px;
    border: 1px solid #DCDFE6;
  }

  .layout-title {
    color: #606266;
    padding: 15px 20px;
    background: #F2F6FC;
    font-weight: bold;
  }

  .un-handle-content {
    padding: 20px 40px;
  }

  .un-handle-item {
    border-bottom: 1px solid #EBEEF5;
    padding: 10px;
  }

  .overview-layout {
    margin-top: 20px;
  }

  .overview-item-value {
    font-size: 24px;
    text-align: center;
  }

  .overview-item-title {
    margin-top: 10px;
    text-align: center;
  }

  .out-border {
    border: 1px solid #DCDFE6;
  }

  .statistics-layout {
    margin-top: 20px;
    border: 1px solid #DCDFE6;
  }

  .mine-layout {
    position: absolute;
    right: 140px;
    top: 107px;
    width: 250px;
    height: 235px;
  }

  .address-content {
    padding: 20px;
    font-size: 18px
  }
</style>
