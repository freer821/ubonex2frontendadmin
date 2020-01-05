<template>
  <div>
    <el-table
      :data="tabledata.filter(data => !data.inland_code || !search || data.inland_code.toLowerCase().includes(search.toLowerCase()))"
      style="width: 100%"
      height="700">
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
    table_type: String
  },
  data () {
    return {
      search: ''
    }
  },
  methods: {
    removePackage (index, row) {
      console.log(this.table_type)
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
