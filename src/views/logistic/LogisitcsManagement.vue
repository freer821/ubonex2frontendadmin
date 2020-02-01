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
      <el-table-column label="关税">
        <template slot-scope="scope">
          <span>{{ scope.row.tariff === '0' ? '不包税' :  '包税'}}</span>
        </template>
      </el-table-column>
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
    <el-dialog :title="logistic_data_temp.is_new? '新增线路' : logistic_data_temp.data.name" :visible.sync="logistic_data_temp.visible">
      <el-form  :model="logistic_data_temp.data"  :rules="logisticFormRules" ref="logisticForm" label-position="left" label-width="110px" >
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="状态" label-width="50px">
              <el-select v-model="logistic_data_temp.data.isactived">
                <el-option label="使用中" :value="true"></el-option>
                <el-option label="未使用" :value="false"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!--el-col :span="6">
            <el-form-item label="属性" label-width="50px">
              <el-select v-model="logistic_data_temp.data.type" >
                <el-option label="CC" value="cc"></el-option>
                <el-option label="BC" value="bc"></el-option>
                <el-option label="BC杂物" value="bczw"></el-option>
                <el-option label="BC红酒" value="bchj"></el-option>
              </el-select>
            </el-form-item>
          </el-col-->
          <el-col :span="8">
            <el-form-item label="关税" label-width="50px">
              <el-select v-model="logistic_data_temp.data.tariff" >
                <el-option label="包税" value="1"></el-option>
                <el-option label="不包税" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="身份证" label-width="60px">
              <el-select v-model="logistic_data_temp.data.person_id" >
                <el-option label="号码" value="number"></el-option>
                <el-option label="图片" value="pic"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10" >
          <el-col :span="12">
            <el-form-item label="产品名称" prop="name">
              <el-input v-model="logistic_data_temp.data.name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品名称缩写" label-width="110px" prop="cagte_label">
              <el-input v-model="logistic_data_temp.data.cagte_label" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10" >
          <el-col :span="12">
            <el-form-item label="最大内物件数" prop="max_units">
              <el-input v-model="logistic_data_temp.data.max_units" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最大包裹重量" prop="max_weight">
              <el-input v-model="logistic_data_temp.data.max_weight" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10" >
          <el-col :span="12">
            <el-form-item label="最大金额" prop="max_value">
              <el-input v-model="logistic_data_temp.data.max_value" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="免费保险额度" prop="free_insurance">
              <el-input v-model="logistic_data_temp.data.free_insurance" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10" >
          <el-col :span="12">
            <el-form-item label="海关名称" prop="custom_name">
              <el-input v-model="logistic_data_temp.data.custom_name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="国内运单号" prop="inland_trans">
              <el-input v-model="logistic_data_temp.data.inland_trans" />
            </el-form-item>
          </el-col>
        </el-row>
        <!--el-row >
          <el-col :span="24">
            <el-form-item label="单号API" prop="postcode_type">
              <el-input type="textarea" v-model="logistic_data_temp.data.postcode_type" />
            </el-form-item>
          </el-col>
        </el-row-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetLogisticTemp">
          Cancel
        </el-button>
        <el-button type="primary" @click="submitLogisticForm">
          Confirm
        </el-button>
      </div>
    </el-dialog>
  </section>

</template>

<script>
import { getLogistics, delLogistic, createLogistic, updateLogistic } from '@/api/logistic'

export default {
  name: 'LogisticsManagement',
  data () {
    return {
      logistics_data: [],
      logistic_data_temp: {
        is_new: true,
        visible: false,
        data: {
          cagte_label: '',
          name: '0',
          type: 'bc',
          sale_unit: 0,
          max_units: 0,
          max_weight: 0,
          max_value: 0,
          free_insurance: 0,
          person_id: 'number',
          tariff: '',
          custom_name: '',
          inland_trans: '',
          isactived: true,
          postcode_type: ''
        }
      },
      search: '',
      logisticFormRules: {
        cagte_label: [
          { required: true, message: '请输入线路代码', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入线路名称', trigger: 'blur' }
        ],
        inland_trans: [
          { required: true, message: '请国内物流快递100缩写', trigger: 'blur' }
        ],
        max_units: [
          { required: true, message: '请输入最大内物件数', trigger: 'blur' }
        ],

        max_weight: [
          { required: true, message: '请输入最大包裹重量', trigger: 'blur' }
        ],
        max_value: [
          { required: true, message: '请输入包裹最大金额', trigger: 'blur' }
        ],
        free_insurance: [
          { required: true, message: '请输入免费保险额度', trigger: 'blur' }
        ],
        custom_name: [
          { required: true, message: '请输入线路海关名称', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.loadLogistics()
  },
  methods: {
    loadLogistics() {
      getLogistics().then(response => {
        this.logistics_data = response.data.results
      }).catch(err => {
        console.log(err)
      })
    },
    resetLogisticTemp: function () {
      this.logistic_data_temp.is_new = true
      this.logistic_data_temp.visible = false
      this.logistic_data_temp.data = {
        cagte_label: '',
        name: '',
        type: 'bc',
        sale_unit: 0,
        max_units: 0,
        max_weight: 0,
        max_value: 0,
        free_insurance: 0,
        person_id: 'number',
        tariff: '0',
        custom_name: '',
        inland_trans: '',
        isactived: true,
        postcode_type: ''
      }
    },
    handleLogisticCreate: function () {
      this.resetLogisticTemp()
      this.logistic_data_temp.visible = true
    },
    handleLogisticUpdate: function (logistic_data) {
      this.logistic_data_temp.is_new = false
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
    submitLogisticForm: function () {
      this.$refs['logisticForm'].validate((valid) => {
        if (valid) {
          if (this.logistic_data_temp.is_new) {
            createLogistic(this.logistic_data_temp.data).then(response => {
              this.$message({
                type: 'info',
                message: '创建成功!'
              })
              this.loadLogistics()
            })
          } else {
            updateLogistic(this.logistic_data_temp.data).then(response => {
              this.$message({
                type: 'info',
                message: '修改成功!'
              })
              this.loadLogistics()
            })
          }
          this.resetLogisticTemp()
          return true
        } else {
          this.$message({
            type: 'error',
            message: '表格验证错误!'
          })
          return false
        }
      })
    }
  }

}
</script>

<style scoped>

</style>
