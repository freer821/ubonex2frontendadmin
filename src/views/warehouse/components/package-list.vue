<template>
  <div>
    <el-input
      placeholder="扫入新包裹单号，然后回车"
      style="width: 60%; padding: 20px"
      v-model="new_inland_code"
      @keyup.enter.native="scan_new_code"
      clearable>
    </el-input>
    <el-table
      :data="tabledata.filter(data => !data.inland_code || !search || data.inland_code.toLowerCase().includes(search.toLowerCase()))"
      style="height: calc(100vh - 150px); overflow: auto;"
      >
      <el-table-column property="sender_name" label="发件人"></el-table-column>
      <el-table-column property="receiver_name" label="收件人"></el-table-column>
      <el-table-column property="receiver_city" label="收件人城市"></el-table-column>
      <el-table-column property="logistic_category" label="物流线路"></el-table-column>
      <el-table-column property="inland_code" label="物流单号"></el-table-column>
      <el-table-column property="package_real_weight" label="包裹重量(Kg)"></el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="150"
        class-name="small-padding fixed-width"
      >
        <template slot="header" slot-scope="scope">
          <el-input
            v-model="search"
            size="mini"
            placeholder="输入包裹单号"/>
        </template>
        <template slot-scope="scope">
          <el-button type="danger" @click.native.prevent="removePackage(scope.$index, scope.row)">
            移除此包裹
          </el-button>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import { packhouse_action } from '@/api/warehouse'

export default {
  name: 'package-list',
  props: {
    tabledata: Array,
    table_type: String,
    assigned_code: String
  },
  data () {
    return {
      search: '',
      new_inland_code: ''
    }
  },
  methods: {
    scan_new_code () {
      console.log('scan_new_code')
      if (this.new_inland_code) {
        console.log(this.new_inland_code)
        let data = { action: 'add_package_into_main_plate_or_pici_code', code_type: this.table_type, assigned_code: this.assigned_code, inland_code: this.new_inland_code }
        packhouse_action(data).then(response => {
          this.$message({
            type: 'success',
            message: '包裹添加成功！'
          })
          this.tabledata.push(response.msg)
          this.$emit('refresh-event')
        })
      }
    },
    removePackage (index, row) {
      this.$confirm(
        '确定将此包裹从单号: ' + (this.table_type === 'main_plate_code' ? row.main_plate_code : row.pici_code) + ' 中移除?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          let data = { action: (this.table_type === 'main_plate_code' ? 'remove_package_from_mainplate_code' : 'remove_package_from_pici_code'), package_id: row.id }
          packhouse_action(data).then(response => {
            this.$emit('refresh-event')
            this.$message({
              type: 'success',
              message: response.msg
            })
            this.tabledata.splice(index, 1)
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消移除'
          })
        })
    }
  }

}
</script>

<style scoped>

</style>
