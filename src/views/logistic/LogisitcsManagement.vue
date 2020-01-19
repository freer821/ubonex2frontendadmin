<template>
  <section class="app-container">
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" >
        <el-form-item>
          <el-input  v-model="search" placeholder="搜索产品名称"></el-input>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button type="primary" @click="handleLogisticCreate">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <el-table
      :data="logistics_data.filter(data => !search || data.cagte_label.toLowerCase().includes(search.toLowerCase()))"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      max-height="700"
    >
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="产品代码:">
              <span>{{ scope.row.cagte_label}}</span>
            </el-form-item>
            <el-form-item label="关税:">
              <span>{{ scope.row.tariff === '0' ? '不包税' :  '包税'}}</span>
            </el-form-item>
            <el-form-item label="身份证信息:">
              <span>{{ scope.row.person_id === 'number' ? '号码' :  '图片'}}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="产品名称" width="200"/>
      <el-table-column prop="custom_name" label="海关口岸"/>
      <el-table-column prop="max_units" label="最大件数"/>
      <el-table-column prop="max_weight" label="最大重量(KG)"/>
      <el-table-column prop="max_value" label="高货值(RMB)"/>
      <el-table-column prop="postcode_type" label="单号获取方式"/>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <span>{{ scope.row.isactived  ? '使用中' : '未使用'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="200"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button
            type="primary"
            size="mini"
            @click="handleLogisticUpdate(row)"
          >
            编辑
          </el-button>
          <el-button size="mini" type="danger" @click="handleLogisticDel(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="logistic_data_temp.title" :visible.sync="logistic_data_temp.visible">
      <el-form  :model="logistic_data_temp.data" label-position="left" label-width="100px" >
        <el-row gutter="10">
          <el-col :span="6">
            <el-form-item label="状态" label-width="50px">
              <el-select v-model="logistic_data_temp.data.isactived">
                <el-option label="使用中" :value="true"></el-option>
                <el-option label="未使用" :value="false"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="属性" label-width="50px">
              <el-select v-model="logistic_data_temp.data.type" >
                <el-option label="CC" value="cc"></el-option>
                <el-option label="BC" value="bc"></el-option>
                <el-option label="BC杂物" value="bczw"></el-option>
                <el-option label="BC红酒" value="bchj"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="关税" label-width="50px">
              <el-select v-model="logistic_data_temp.data.tariff" >
                <el-option label="包税" value="1"></el-option>
                <el-option label="不包税" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="身份证" label-width="60px">
              <el-select v-model="logistic_data_temp.data.person_id" >
                <el-option label="号码" value="number"></el-option>
                <el-option label="图片" value="pic"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row gutter="10" >
          <el-col :span="12">
            <el-form-item label="产品名称" >
              <el-input v-model="logistic_data_temp.data.name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品名称缩写" >
              <el-input v-model="logistic_data_temp.data.cagte_label" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row gutter="10" >
          <el-col :span="12">
            <el-form-item label="最大内物件数" >
              <el-input v-model="logistic_data_temp.data.max_units" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最大包裹重量" >
              <el-input v-model="logistic_data_temp.data.max_weight" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row gutter="10" >
          <el-col :span="12">
            <el-form-item label="最大金额" >
              <el-input v-model="logistic_data_temp.data.max_value" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="免费保险额度" >
              <el-input v-model="logistic_data_temp.data.free_insurance" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row gutter="10" >
          <el-col :span="8">
            <el-form-item label="海关名称" label-width="90px">
              <el-input v-model="logistic_data_temp.data.custom_name" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="国际运单号" label-width="90px">
              <el-input v-model="logistic_data_temp.data.international_trans" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="国内运单号" label-width="90px">
              <el-input v-model="logistic_data_temp.data.inland_trans" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row >
          <el-col :span="24">
            <el-form-item label="单号API" >
              <el-input type="textarea" v-model="logistic_data_temp.data.postcode_type" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetLogisticTemp">
          Cancel
        </el-button>
        <el-button type="primary" >
          Confirm
        </el-button>
      </div>
    </el-dialog>
  </section>

</template>

<script>
import { getLogistics, delLogistic } from '@/api/logistic'

export default {
  name: 'LogisticsManagement',
  data () {
    return {
      logistics_data: [],
      logistic_data_temp: {
        title: '',
        visible: false,
        data: {
          cagte_label: '',
          name: '',
          type: '',
          country: '',
          sale_unit: '',
          max_units: '',
          max_weight: '',
          max_value: '',
          free_insurance: '',
          currency: '',
          person_id: '',
          tariff: '',
          custom_name: '',
          international_trans: '',
          inland_trans: '',
          isactived: '',
          postcode_type: ''
        }
      },
      search: ''
    }
  },
  created () {
    getLogistics().then(response => {
      this.logistics_data = response.data.results
    }).catch(err => {
      console.log(err)
    })
  },
  methods: {
    resetLogisticTemp: function () {
      this.logistic_data_temp = {
        title: '',
        visible: false,
        data: {
          cagte_label: '',
          name: '',
          type: '',
          country: '',
          sale_unit: '',
          max_units: '',
          max_weight: '',
          max_value: '',
          free_insurance: '',
          currency: '',
          person_id: '',
          tariff: '',
          custom_name: '',
          international_trans: '',
          inland_trans: '',
          isactived: '',
          postcode_type: ''
        }
      }
    },
    handleLogisticCreate: function () {
      this.resetLogisticTemp()
      this.logistic_data_temp.title = '添加新线路'
      this.logistic_data_temp.visible = true
    },
    handleLogisticUpdate: function (logistic_data) {
      this.logistic_data_temp.title = logistic_data.name
      this.logistic_data_temp.visible = true
      this.logistic_data_temp.data = logistic_data
    },
    handleLogisticDel: function (logistic_data) {
      this.$confirm(
        '确定刪除: ' + (logistic_data.name) + '?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          delLogistic(logistic_data.id).then(response => {
            this.$message({
              type: 'success',
              message: '刪除成功！'
            })
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消刪除'
          })
        })
    },

    filterByCagteLabel: function () {

    }

  }

}
</script>

<style scoped>

</style>
