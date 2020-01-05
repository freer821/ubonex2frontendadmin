<template>
  <div class="app-container">
    <el-row :gutter="20" style="margin-bottom: 20px">
      <el-col :span="3" :offset="21"><el-button type="primary" icon="el-icon-refresh" @click="fetchTableData">刷新</el-button></el-col>
    </el-row>

    <el-table
      :data="main_plate_data.filter(data => !main_plate_code_search || data.main_plate_code.toLowerCase().includes(main_plate_code_search.toLowerCase()))"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <!--el-table-column type="selection" width="55"></el-table-column-->
      <el-table-column prop="main_plate_code" label="主单号"></el-table-column>
      <el-table-column prop="status" label="包裹状态" sortable :formatter="statusformatter"/>
      <el-table-column prop="dcount" label="内含包裹数"></el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="300"
        class-name="small-padding fixed-width"
      >
        <template slot="header" slot-scope="scope">
          <el-input
            v-model="main_plate_code_search"
            size="mini"
            placeholder="输入主单号搜索"/>
        </template>
        <template slot-scope="{ row }">
          <el-button
            type="info"
            size="mini"
            @click="handleMainPlateCodeDetailShow(row)"
          >
            查看
          </el-button>

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

    <el-drawer
      :title="main_plate_code_detail.title"
      :visible.sync="main_plate_code_detail.show"
      direction="rtl"
      size="70%"
      :before-close="handleClose">
      <Packagelist :tabledata="main_plate_code_detail.data" table_type="main_plate_code" :assigned_code="main_plate_code_detail.title" @refresh-event="fetchTableData"/>
    </el-drawer>
  </div>
</template>

<script>
import { get_main_plate_info, packhouse_action } from '@/api/warehouse'
import { getPackagesInMainPlateCode, getPackageStatus } from '@/api/package'
import Packagelist from './components/package-list'

export default {
  name: 'MainPlateManagement',
  components: {
    Packagelist
  },
  data () {
    return {
      main_plate_data: [],
      importanceOptions: [],
      package_status: {},
      main_plate_code_search: '',
      main_plate_code_detail: {
        show: false,
        title: '',
        data: []
      }
    }
  },
  created () {
    this.fetchPackageStatus()
    this.fetchTableData()
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
    fetchTableData () {
      console.log('get_main_plate_info')
      get_main_plate_info()
        .then(response => {
          this.main_plate_data = response.data
        })
        .catch(err => {
          console.log(err)
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
            let data = {
              action: 'update_main_plate_code',
              new_main_plate_code: value,
              old_main_plate_code: row.main_plate_code
            }
            packhouse_action(data).then(
              response => {
                this.$message({
                  type: 'success',
                  message: response.msg
                })
                this.fetchTableData()
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
          let data = { action: 'del_main_plate_code', main_plate_code: row.main_plate_code }
          packhouse_action(data).then(response => {
            this.$message({
              type: 'success',
              message: response.msg
            })
            this.fetchTableData()
          })
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '已取消删除'
          })
        })
    },
    handleMainPlateCodeDetailShow (row) {
      this.main_plate_code_detail.show = true
      if (row.main_plate_code.trim()) {
        getPackagesInMainPlateCode(row.main_plate_code).then(response => {
          this.main_plate_code_detail.title = row.main_plate_code
          this.main_plate_code_detail.data = response.data
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
      this.main_plate_code_detail.title = ''
      this.main_plate_code_detail.data = []
      done()
    }
  }
}
</script>
