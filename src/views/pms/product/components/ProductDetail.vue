<template> 
  <el-card class="form-container" shadow="never">
    <el-steps :active="active" finish-status="success" align-center>
      <el-step title="填写商品信息"></el-step>
    </el-steps>
    <product-info-detail
      v-show="showStatus[0]"
      v-model="productParam"
      :is-edit="isEdit"
      @finishCommit="finishCommit">
    </product-info-detail>
  </el-card>
</template>
<script>
  import ProductInfoDetail from './ProductInfoDetail';
  import {createProduct} from '@/api/product';

  const defaultProductParam = {
    name: '',
    outline: '',
    detail: '',
    press: '',
    author: '',
    publishDate: '',
    size: '',
    version: '',
    isbn: '',
    price: 0,
    marketPrice: 0,
    storeMount: 0,
  };
  export default {
    name: 'ProductDetail',
    components: {ProductInfoDetail},
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        active: 0,
        productParam: Object.assign({}, defaultProductParam),
        showStatus: [true, false, false, false]
      }
    },
    created() {
      /*if (this.isEdit) {
        getProduct(this.$route.query.id).then(response => {
          this.productParam = response.data;
        });
      }*/
    },
    methods: {
      hideAll() {
        for (let i = 0; i < this.showStatus.length; i++) {
          this.showStatus[i] = false;
        }
      },
      prevStep() {
        if (this.active > 0 && this.active < this.showStatus.length) {
          this.active--;
          this.hideAll();
          this.showStatus[this.active] = true;
        }
      },
      nextStep() {
        if (this.active < this.showStatus.length - 1) {
          this.active++;
          this.hideAll();
          this.showStatus[this.active] = true;
        }
      },
      finishCommit() {
        console.info(this.productParam)
        this.$confirm('是否要提交该产品', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          createProduct(this.productParam).then(response => {
            this.$message({
              type: 'success',
              message: '提交成功',
              duration: 1000
            });
            location.reload();
          }).catch(error => {
            this.$message({
              type: 'error',
              message: `提交失败：${error}`,
              duration: 5 * 1000
            })
          });
        })
      }
    }
  }
</script>
<style>
  .form-container {
    width: 800px;
  }
</style>


