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
          <el-table :data="selected_user_price_list" border fit stripe highlight-current-row style="width: 100%">
            <el-table-column class-name="status-col" label="重量(KG)">
              <template slot-scope="{row}">
                <span>{{ row.weight }}</span>
              </template>
            </el-table-column>

            <el-table-column class-name="status-col" label="价格(EURO)">
              <template slot-scope="{row}">
                <span>{{ row.price }}</span>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="120">
              <template slot-scope="scope">
                <el-button
                  @click.native.prevent="deleteRow(scope.$index, selected_user_price_list)"
                  type="text"
                  size="small">
                  移除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
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
import { getUserPricesAdmin, updateUserPricesAdmin } from '@/api/user'

export default {
  name: 'UserPriceManagement',
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
      }
    },
    addPrice () {
      if (this.selected_user_id && this.price_type) {
        this.selected_user_price_list.push(this.priceform)
        this.updatePrice()
      } else {
        this.$message({
          type: 'error',
          message: '请先选择用户名'
        })

      }
      this.dialogFormVisible = false
      this.resetPriceForm()
    },
    updatePrice () {
      if (this.selected_user_id && this.price_type) {
        updateUserPricesAdmin(this.selected_user_id, this.price_type, this.selected_user_price_list).then(response => {
          console.log(response.data)
        }).catch(err => {
          this.$message({
            type: 'error',
            message: err
          })
        })
      }
    },
    resetPriceForm () {
      this.priceform = {
        price: '',
        weight: ''
      }
    },
    deleteRow (index, rows) {
      this.$confirm(
        '确定删除此价格项?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          rows.splice(index, 1)
          this.updatePrice()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>

<style scoped>
  .tab-container {
    margin: 30px;
  }
</style>
