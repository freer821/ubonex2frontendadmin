<template>
  <div class="app-container">
    <el-divider>批次号管理</el-divider>
    <el-table
      :data="pici_data"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      height="250"
    >
      <el-table-column prop="pici_code" label="批次号"></el-table-column>
      <el-table-column prop="parcel_num" label="内含包裹数"></el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="300"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
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
    <div class="filter-container" style="padding-top: 20px">
      <el-divider>主单号管理</el-divider>
      <!--el-input
        placeholder="Title"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        Search
      </el-button>
      <el-select
        placeholder="Imp"
        clearable
        style="width: 150px; margin-left: 180px"
        class="filter-item"
      >
        <el-option
          v-for="item in importanceOptions"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >
        Export
      </el-button-->
    </div>

    <el-table
      :data="main_plate_data"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      height="250"
    >
      <!--el-table-column type="selection" width="55"></el-table-column-->
      <el-table-column prop="main_plate_code" label="主单号"></el-table-column>
      <el-table-column prop="parcel_num" label="内含包裹数"></el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="300"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button
            type="primary"
            size="mini"
            @click="handleMainPlateUpdate(row)"
          >
            编辑
          </el-button>
          <el-button size="mini" type="danger" @click="handleMainPlateDel(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {
  get_pici_info,
  get_main_plate_info,
  exchange_pici_code_to_main_plate_code,
  del_pici_code,
  change_pici_code,
  del_main_plate_code,
  update_main_plate_code
} from '@/api/warehouse'

import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'MainPlateManagement',
  components: { Pagination },
  data () {
    return {
      pici_data: [],
      main_plate_data: [],
      importanceOptions: []
    }
  },
  created () {
    this.fetchPiciParcels()
    this.fetchMainPlateParcels()
  },
  methods: {
    fetchPiciParcels () {
      get_pici_info()
        .then(response => {
          this.pici_data = response.msg
        })
        .catch(err => {
          console.log(err)
        })
    },
    fetchMainPlateParcels () {
      get_main_plate_info()
        .then(response => {
          this.main_plate_data = response.msg
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
            change_pici_code(value, row.pici_code).then(response => {
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
          exchange_pici_code_to_main_plate_code(value, row.pici_code).then(
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
          del_pici_code(row.pici_code).then(response => {
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

    handleMainPlateUpdate (row) {
      this.$prompt(
        '当前主单号为 ' + row.main_plate_code + ', 请输入新的主单号',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }
      )
        .then(({ value }) => {
          if (value.localeCompare(row.main_plate_code) === 0) {
            this.$message({
              type: 'info',
              message: '主单号未改变！'
            })
          } else {
            update_main_plate_code(value, row.main_plate_code).then(
              response => {
                this.$message({
                  type: 'success',
                  message: response.msg
                })
                this.fetchMainPlateParcels()
              }
            )
          }
        })
        .catch(err => {
          console.log(err)
          this.$message({
            type: 'error',
            message: '取消输入'
          })
        })
    },
    handleMainPlateDel (row) {
      this.$confirm(
        '此操作将删除主单号: ' + row.main_plate_code + ', 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          del_main_plate_code(row.main_plate_code).then(response => {
            this.$message({
              type: 'success',
              message: response.msg
            })
            this.fetchMainPlateParcels()
          })
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>
