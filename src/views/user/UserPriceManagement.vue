<template>
  <div class="tab-container">
    <el-select v-model="selected_user_id" placeholder="请选择用户名">
      <el-option
        v-for="item in users_prices"
        :key="item.id"
        :label="item.username"
        :value="item.id">
      </el-option>
    </el-select>

    <el-tabs v-model="price_type" style="width:600px; margin-top: 40px " type="border-card">
      <el-button type="primary" icon="el-icon-circle-plus-outline" @click="dialogFormVisible = true">添加价格</el-button>
      <el-tab-pane v-for="item in tabMapOptions" :key="item.key" :label="item.label" :name="item.key" style="padding-top: 20px">
        <keep-alive>
          <tab-pane :list="selected_user_price_list" />
        </keep-alive>
      </el-tab-pane>
    </el-tabs>

    <el-dialog :visible.sync="dialogFormVisible" >
      <el-form :inline="true" :model="priceform" label-position="left" label-width="120px">
        <el-form-item label="重量:">
          <el-input v-model="priceform.weight" ></el-input>
        </el-form-item>
        <el-form-item label="价格(EURO):">
          <el-input v-model="priceform.price" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addPrice">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import tabPane from './components/TabPane'
import { getUserPricesAdmin, updateUserPricesAdmin } from '@/api/user'

export default {
  name: 'UserPriceManagement',
  components: { tabPane },
  data () {
    return {
      tabMapOptions: [
        { label: '包税价格表', key: 'withtax' },
        { label: '不包税价格表', key: 'withouttax' }
      ],
      price_type: 'withtax',
      users_prices: [],
      selected_user_id: '',
      selected_user_price_list: [],
      dialogFormVisible: false,
      priceform: {
        price: '',
        weight: ''
      }
    }
  },
  watch: {
    price_type (val) {
      this.updateUserPriceList()
    },
    selected_user_id (val) {
      this.updateUserPriceList()
    }
  },
  created () {
    this.initUserPrices()
  },
  methods: {
    initUserPrices () {
      getUserPricesAdmin().then(response => {
        this.users_prices = response.data
      }).catch(err => {
        this.$message({
          type: 'error',
          message: err
        })
      })
    },
    updateUserPriceList () {
      console.log(this.price_type)
      if (this.selected_user_id) {
        this.selected_user_price_dict = this.users_prices.find(user_price => user_price.id === this.selected_user_id)
        if (this.selected_user_price_dict.pricelist) {
          let pricelist = JSON.parse(this.selected_user_price_dict.pricelist)
          if (this.price_type === 'withtax') {
            this.selected_user_price_list = pricelist.withtax
          } else {
            this.selected_user_price_list = pricelist.withouttax
          }
        } else {
          this.selected_user_price_list = []
        }
        console.log(this.selected_user_price_list)

      }
    },
    addPrice () {
      if (this.selected_user_id && this.price_type) {
        this.selected_user_price_list.push(this.priceform)
        updateUserPricesAdmin(this.selected_user_id, this.price_type, this.selected_user_price_list).then(response => {
          console.log(response.data)
        }).catch(err => {
          this.$message({
            type: 'error',
            message: err
          })
        })
      }
      this.dialogFormVisible = false
    }
  }
}
</script>

<style scoped>
  .tab-container {
    margin: 30px;
  }
</style>
