<template>
  <div class="app-container">
    <el-table
      :data="logistics_data"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      max-height="700"
    >
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="关税:">
              <span>{{ scope.row.tariff === '0' ? '不包税' :  '包税'}}</span>
            </el-form-item>
            <el-form-item label="身份证信息:">
              <span>{{ scope.row.person_id === 'number' ? '号码' :  '图片'}}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="产品名称"/>
      <el-table-column prop="cagte_label" label="产品代码"/>
      <el-table-column prop="custom_name" label="海关口岸"/>
      <el-table-column prop="max_units" label="包裹内最大件数"/>
      <el-table-column prop="max_weight" label="包裹最大重量(KG)"/>
      <el-table-column prop="max_value" label="包裹最高货值(RMB)"/>
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
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="Type" prop="type">
          <el-select v-model="temp.type" class="filter-item" placeholder="Please select">
            <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="Date" prop="timestamp">
          <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="Please pick a date" />
        </el-form-item>
        <el-form-item label="Title" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>
        <el-form-item label="Status">
          <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="Imp">
          <el-rate v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="3" style="margin-top:8px;" />
        </el-form-item>
        <el-form-item label="Remark">
          <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import { getLogistics } from '@/api/logistic'

export default {
  name: 'LogisticsManagement',
  data () {
    return {
      logistics_data: []
    }
  },
  created () {
    getLogistics().then(response => {
      this.logistics_data = response.data.results
    })
  }

}
</script>

<style scoped>

</style>
