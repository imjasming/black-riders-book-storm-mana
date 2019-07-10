<template>
  <div style="margin-top: 50px">
    <el-form :model="value" :rules="rules" ref="productInfoForm" label-width="120px" style="width: 600px" size="small">
      <el-form-item label="商品分类：" prop="bookCategoryId">
        <el-cascader
          v-model="selectProductCateValue"
          :options="productCateOptions">
        </el-cascader>
      </el-form-item>

      <el-form-item label="图书名称：" prop="name">
        <el-input v-model="value.name"></el-input>
      </el-form-item>
      <el-form-item label="图书概述：" prop="outline">
        <el-input v-model="value.outline"></el-input>
      </el-form-item>
      <el-form-item label="图书详情：">
        <el-input
          :autoSize="true"
          v-model="value.detail"
          type="textarea"
          placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="出版社：" prop="press">
        <el-input
          v-model="value.press">
        </el-input>
      </el-form-item>
      <el-form-item label="作者：">
        <el-input v-model="value.author"></el-input>
      </el-form-item>
      <el-form-item label="出版日期">
        <el-input v-model="value.publishDate"></el-input>
      </el-form-item>
      <el-form-item label="图书大小：">
        <el-input v-model="value.size" style="width: 300px"></el-input>
      </el-form-item>
      <el-form-item label="版本号：">
        <el-input v-model="value.version"></el-input>
      </el-form-item>
      <el-form-item label="Isbn号：">
        <el-input v-model="value.isbn"></el-input>
      </el-form-item>
      <el-form-item label="价格：">
        <el-input v-model="value.price"></el-input>
      </el-form-item>
      <el-form-item label="市场价：">
        <el-input v-model="value.marketPrice"></el-input>
      </el-form-item>
      <el-form-item label="库存：">
        <el-input v-model="value.storeMount"></el-input>
      </el-form-item>
      <!---------------------------------------------------------->
      <el-form-item style="text-align: center">
        <el-button type="primary" size="medium" @click="handleCommit('productInfoForm')">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {fetchListWithChildren} from '@/api/productCate'
  import {fetchList as fetchBrandList} from '@/api/brand'

  export default {
    name: "ProductInfoDetail",
    props: {
      value: Object,
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        hasEditCreated: false,
        //选中商品分类的值
        selectProductCateValue: [],
        productCateOptions: [],
        brandOptions: [],
        rules: {
          name: [
            {required: true, message: '请输入商品名称', trigger: 'blur'},
            {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
          ],
          outline: [{required: true, message: '请输入图书概述', trigger: 'blur'}],
          bookCategoryId: [{required: false, message: '请选择分类', trigger: 'blur'}],
          author: [{required: true, message: '请选择图书作者', trigger: 'blur'}],
          detail: [{required: true, message: '请输入图书详情', trigger: 'blur'}],
          requiredProp: [{required: true, message: '该项为必填项', trigger: 'blur'}]
        }
      };
    },
    created() {
      this.getProductCateList();
      //this.getBrandList();
    },
    computed: {
      //商品的编号
      productId() {
        return this.value.id;
      }
    },
    watch: {
      productId: function (newValue) {
        if (!this.isEdit) return;
        if (this.hasEditCreated) return;
        if (newValue === undefined || newValue == null || newValue === 0) return;
        this.handleEditCreated();
      },
      selectProductCateValue: function (newValue) {
        if (newValue != null && newValue.length === 2) {
          this.value.bookCategoryId = newValue[1];
          this.value.bookCategoryName = this.getCateNameById(this.value.bookCategoryId);
        } else {
          this.value.bookCategoryId = null;
          this.value.bookCategoryName = null;
        }
      }
    },
    methods: {
      //处理编辑逻辑
      handleEditCreated() {
        if (this.value.bookCategoryId != null) {
          this.selectProductCateValue.push(this.value.cateParentId);
          this.selectProductCateValue.push(this.value.bookCategoryId);
        }
        this.hasEditCreated = true;
      },
      getProductCateList() {
        fetchListWithChildren().then(response => {
          let list = response.data.list;
          this.productCateOptions = [];
          for (let i = 0; i < list.length; i++) {
            let children = [];
            if (list[i].children != null && list[i].children.length > 0) {
              for (let j = 0; j < list[i].children.length; j++) {
                children.push({label: list[i].children[j].name, value: list[i].children[j].id});
              }
            }
            this.productCateOptions.push({label: list[i].name, value: list[i].id, children: children});
          }
        });
      },
      getBrandList() {
        fetchBrandList({pageNum: 1, pageSize: 100}).then(response => {
          this.brandOptions = [];
          let brandList = response.data.list;
          for (let i = 0; i < brandList.length; i++) {
            this.brandOptions.push({label: brandList[i].name, value: brandList[i].id});
          }
        });
      },
      getCateNameById(id) {
        let name = null;
        for (let i = 0; i < this.productCateOptions.length; i++) {
          for (let j = 0; i < this.productCateOptions[i].children.length; j++) {
            if (this.productCateOptions[i].children[j].value === id) {
              name = this.productCateOptions[i].children[j].label;
              return name;
            }
          }
        }
        return name;
      },
      handleCommit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$emit('finishCommit');
          } else {
            this.$message({
              message: '验证失败',
              type: 'error',
              duration: 1000
            });
            return false;
          }
        });
      },
      handleBrandChange(val) {
        let brandName = '';
        for (let i = 0; i < this.brandOptions.length; i++) {
          if (this.brandOptions[i].value === val) {
            brandName = this.brandOptions[i].label;
            break;
          }
        }
        this.value.brandName = brandName;
      }
    }
  }
</script>

<style scoped>
</style>
