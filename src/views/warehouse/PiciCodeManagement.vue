<template>
  <div class="app-container">
    <el-table
      :data="pici_data.filter(data => !pici_code_search || data.pici_code  === parseInt(pici_code_search))"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column prop="pici_code" label="批次号"></el-table-column>
      <el-table-column prop="status" label="包裹状态" sortable :formatter="statusformatter" />
      <el-table-column prop="dcount" label="内含包裹数"></el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="400"
        class-name="small-padding fixed-width"
      >
        <template slot="header" slot-scope="scope">
          <el-input
            v-model="pici_code_search"
            size="mini"
            type="number"
            placeholder="输入批次号搜索"/>
        </template>
        <template slot-scope="{ row }">
          <el-button
            type="info"
            size="mini"
            @click="handlePiciCodeDetailShow(row)"
          >
            查看
          </el-button>
          <el-button type="primary" size="mini" @click="handlePiciEdit(row)">
            编辑
          </el-button>
          <el-button
            size="small"
            type="warning"
            @click="handleExchangePiciAndMainPlate(row)"
          >
            转换主单号
          </el-button>
          <el-button size="mini" type="danger" @click="handlePiciDel(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-drawer
      :title="pici_code_detail.title"
      :visible.sync="pici_code_detail.show"
      direction="rtl"
      size="50%"
      :before-close="handleClose">
      <el-table :data="pici_code_detail.data" style="width: 100%" height="700">
        <el-table-column property="sender_name" label="发件人" ></el-table-column>
        <el-table-column property="receiver_name" label="收件人" ></el-table-column>
        <el-table-column property="receiver_city" label="收件人城市"></el-table-column>
        <el-table-column property="logistic_category" label="物流线路"></el-table-column>
        <el-table-column property="inland_code" label="物流单号"></el-table-column>
        <el-table-column property="package_real_weight" label="包裹重量"></el-table-column>
      </el-table>
    </el-drawer>
  </div>
</template>

<script>
import {
  get_pici_info,
  packhouse_action
} from '@/api/warehouse'

import { getPackageStatus, getPackagesInPiciCode } from '@/api/package'

import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'MainPlateManagement',
  components: { Pagination },
  data () {
    return {
      pici_data: [],
      importanceOptions: [],
      package_status: {},
      pici_code_search: '',
      pici_code_detail: {
        show: false,
        title: '',
        data: []
      }

    }
  },
  created () {
    this.fetchPackageStatus()
    this.fetchPiciParcels()
  },
  methods: {
    statusformatter (row, column) {
      return this.package_status[row.status]
    },
    fetchPackageStatus () {
      getPackageStatus().then(response => {
        this.package_status = response.data
      }).catch(err => {
        console.log(err)
      })
    },
    fetchPiciParcels () {
      get_pici_info()
        .then(response => {
          this.pici_data = response.data
        })
        .catch(err => {
          console.log(err)
        })
    },
    handlePiciEdit (row) {
      this.$prompt(
        '当前批次号为 ' + row.pici_code + ', 请输入新的批次号',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^[1-9][0-9]*$/,
          inputErrorMessage: '批次号格式不正确, 至接受数字'
        }
      )
        .then(({ value }) => {
          if (value.localeCompare(row.pici_code) === 0) {
            this.$message({
              type: 'info',
              message: '批次号未改变！'
            })
          } else {
            let data = { action: 'change_pici_code', new_pici_code: value, old_pici_code: row.pici_code }
            packhouse_action(data).then(response => {
              this.$message({
                type: 'success',
                message: response.msg
              })
              this.fetchPiciParcels()
            })
          }
        })
        .catch(err => {
          console.log(err)
          this.$message({
            type: 'info',
            message: '取消输入'
          })
        })
    },
    handleExchangePiciAndMainPlate (row) {
      this.$prompt('当前批次号为 ' + row.pici_code + ', 请输入主单号', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(({ value }) => {
          let data = { action: 'exchange_pici_code_to_main_plate_code', pici_code: row.pici_code, main_plate_code: value }
          packhouse_action(data).then(
            response => {
              this.$message({
                type: 'success',
                message: response.msg
              })
              this.fetchPiciParcels()
              this.fetchMainPlateParcels()
            }
          )
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          })
        })
    },
    handlePiciDel (row) {
      this.$confirm(
        '此操作将删除批次号: ' + row.pici_code + ', 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          let data = { action: 'del_pici_code', pici_code: row.pici_code }
          packhouse_action(data).then(response => {
            this.$message({
              type: 'success',
              message: response.msg
            })
            this.fetchPiciParcels()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },

    handlePiciCodeDetailShow (row) {
      this.pici_code_detail.show = true
      if (row.pici_code) {
        getPackagesInPiciCode(row.pici_code).then(response => {
          this.pici_code_detail.title = row.pici_code
          this.pici_code_detail.data = response.data
        }).catch(err => {
          this.$message({
            type: 'error',
            message: err
          })
        })
      } else {
        this.$message({
          type: 'error',
          message: 'no main plate code'
        })
      }
    },
    handleClose (done) {
      this.pici_code_detail.title = ''
      this.pici_code_detail.data = []
      done()
    }

  }
}
</script>
