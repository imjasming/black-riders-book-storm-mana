<template> 
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>发货列表</span>
    </el-card>
    <div class="table-container">
      <el-table ref="deliverOrderTable"
                style="width: 100%;"
                :data="list" border>
        <el-table-column label="订单编号" width="180" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="收货人" width="180" align="center">
          <template slot-scope="scope">{{scope.row.receiverName}}</template>
        </el-table-column>
        <el-table-column label="手机号码" width="160" align="center">
          <template slot-scope="scope">{{scope.row.phone}}</template>
        </el-table-column>
        <el-table-column label="邮政编码" width="160" align="center">
          <template slot-scope="scope">{{scope.row.zipCode}}</template>
        </el-table-column>
        <el-table-column label="收货地址" align="center">
          <template slot-scope="scope">{{scope.row.address}}</template>
        </el-table-column>
        <el-table-column label="配送方式" width="160" align="center">
          <template slot-scope="scope">
            <el-select placeholder="请选择物流公司"
                       v-model="scope.row.deliveryCompany"
                       size="small">
              <el-option v-for="item in companyOptions"
                         :key="item"
                         :label="item"
                         :value="item">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="物流单号" width="180" align="center">
          <template slot-scope="scope">
            <el-input size="small" v-model="scope.row.deliverySn"></el-input>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 15px;text-align: center">
        <el-button @click="cancel">取消</el-button>
        <el-button @click="confirm" type="primary">确定</el-button>
      </div>
    </div>
  </div>
</template>
<script>
  import {deliveryOrder} from '@/api/order'

  const defaultLogisticsCompanies = ["顺丰快递", "圆通快递", "中通快递", "韵达快递"];
  export default {
    name: 'deliverOrderList',
    data() {
      return {
        list: [],
        companyOptions: defaultLogisticsCompanies
      }
    },
    created() {
      this.initData()
    },
    methods: {
      initData() {
        let l = this.$store.getters.deliveryOrder
        this.list = l
        console.log(this.list)
      },
      cancel() {
        this.$router.back();
      },
      confirm() {
        this.$confirm('是否要进行发货操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const l = this.list[0]
          let bookId = this.list[0].bookId
          let list = {
            id: this.list[0].id,
            storeId: this.$store.getters.storeInfo.id,
            bookId: bookId,
            orderId: this.list[0].orderId,
            shippingName: this.list[0].deliveryCompany,
            shippingCode: this.list[0].deliverySn,
          }
          deliveryOrder(list).then(response => {
            this.$router.back();
            this.$message({
              type: 'success',
              message: '发货成功!'
            });
          }).catch(error => {
            this.$message({
              type: 'info',
              message: '已取消发货'
            });
          });
        })
      }
    }
  }
</script>
<style></style>


