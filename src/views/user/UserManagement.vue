<template>
  <section class="app-container">
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" >
        <el-form-item>
          <el-input  v-model="search" placeholder="搜索用户昵称"></el-input>
        </el-form-item>
      </el-form>
    </el-col>

    <el-table
      :data="users_data.filter(data => !search || data.profile.reserved2.toLowerCase().includes(search.toLowerCase()))"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      max-height="700"
    >
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="用户名称:">
              <span>{{ scope.row.profile.person_name}}</span>
            </el-form-item>
            <el-form-item label="创建时间:">
              <span>{{ scope.row.date_joined}}</span>
            </el-form-item>
            <el-form-item label="最后登录:">
              <span>{{ scope.row.last_login}}</span>
            </el-form-item>
          </el-form>
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="地址:">
              <span>{{ scope.row.profile.street}} {{ scope.row.profile.hausnr}}, {{ scope.row.profile.postcode}} {{ scope.row.profile.city}}</span>
            </el-form-item>
            <el-form-item label="电话:">
              <span>{{ scope.row.profile.tel}}</span>
            </el-form-item>
            <el-form-item label="积分:">
              <span>{{ scope.row.profile.points}}</span>
            </el-form-item>
            <el-form-item label="积分码:">
              <span>{{ scope.row.profile.self_coupon_code}}</span>
            </el-form-item>
            <el-form-item label="推荐人积分码:">
              <span>{{ scope.row.profile.other_coupon_code}}</span>
            </el-form-item>
          </el-form>
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="公司名称:">
              <span>{{ scope.row.profile.company_name}}</span>
            </el-form-item>
            <el-form-item label="公司税号:">
              <span>{{ scope.row.profile.company_tax_code}}</span>
            </el-form-item>
          </el-form>
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="已开通物流线路:">
              <span>{{ computeLogisticNames(scope.row.profile.reserved1.split(','))}}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="profile.reserved2" label="客户名称(客服备注)"/>
      <el-table-column prop="username" label="用户账号"/>
      <el-table-column label="用户类型">
        <template slot-scope="scope">
          <span>{{ scope.row.profile.type === '0' ? '个人' :  '公司'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <span>{{ scope.row.is_active ? '已激活' :  '未激活'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="自动扣款">
        <template slot-scope="scope">
          <span>{{ scope.row.profile.is_auto_to_pay ? '是' :  '否'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="handleUserUpdate(scope.row)"
          >
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="selected_user.data.profile.person_name" :visible.sync="selected_user.visible">
      <el-form  :model="selected_user.data"  :rules="userFormRules" ref="userForm" label-position="left" label-width="110px" >
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="客户名称(客服备注)" label-width="150px" prop="reserved2">
              <el-input v-model="selected_user.data.profile.reserved2" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态" label-width="50px">
              <el-select v-model="selected_user.data.is_active" >
                <el-option label="已激活" :value="true"></el-option>
                <el-option label="未激活" :value="false"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="自动扣款" label-width="80px">
              <el-select v-model="selected_user.data.profile.is_auto_to_pay" >
                <el-option label="是" :value="true"></el-option>
                <el-option label="否" :value="false"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row >
          <el-col :span="24">
            <el-form-item label="物流线路" prop="name">
              <el-checkbox :indeterminate="selected_user.isIndeterminate" v-model="selected_user.checkAll" @change="handleCheckAllLogisticsChange">全选</el-checkbox>
              <div style="margin: 15px 0;"></div>
              <el-checkbox-group v-model="selected_user.checkedLogistics" @change="handleCheckedLogisticsChange">
                <el-checkbox v-for="logistic in logistics_data" :label="logistic.cagte_label" :key="logistic.cagte_label">{{logistic.name}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetUserTemp">
          Cancel
        </el-button>
        <el-button type="primary" @click="submitUserForm">
          Confirm
        </el-button>
      </div>
    </el-dialog>
  </section>

</template>

<script>

import { getUsersAdmin, updateUserAdmin } from '@/api/user'
import { getLogistics } from '@/api/logistic'

export default {
  name: 'UserManagement',
  data () {
    return {
      users_data: [],
      logistics_data: [],
      selected_user: {
        visible: false,
        checkAll: false,
        checkedLogistics: [],
        isIndeterminate: true,
        data: {
          id: 0,
          is_active: true,
          profile: {
            company_name: '',
            company_tax_code: '',
            other_coupon_code: '',
            ext_info: '',
            reserved1: '',
            reserved2: '',
            points: 0,
            type: 0,
            country: '',
            street: '',
            hausnr: '',
            postcode: '',
            city: '',
            tel: '',
            person_name: '',
            self_coupon_code: '',
            level: '1',
            is_auto_to_pay: false
          }
        }
      },
      search: '',
      userFormRules: {
      }
    }
  },
  created () {
    this.loadUsers()
    this.loadLogistics()
  },
  methods: {
    loadUsers () {
      getUsersAdmin().then(response => {
        this.users_data = response.data.results
      }).catch(err => {
        console.log(err)
      })
    },
    loadLogistics () {
      getLogistics().then(response => {
        this.logistics_data = response.data.results.filter(logistic => logistic.isactived === true)
      }).catch(err => {
        console.log(err)
      })
    },
    computeLogisticNames (logisticCodes) {
      let logisticNames = ''
      if (logisticCodes.length < 2) {
        return '未分配物流线路'
      }
      for (let index in logisticCodes) {
        let logisitc_info = this.logistics_data.filter(logistic_data => logistic_data.cagte_label === logisticCodes[index])[0]
        if (!logisitc_info) {
          console.log(logisticCodes)
          logisticNames += logisticCodes[index] + '(不存在或已禁用), '
        } else {
          logisticNames += logisitc_info.name + ', '
        }
      }
      return logisticNames
    },
    handleUserUpdate: function (user_data) {
      this.resetUserTemp()
      this.selected_user.visible = true
      this.selected_user.data = user_data
      let checkedLogistics = user_data.profile.reserved1.split(',')

      if (checkedLogistics.length > 1) {
        for (let index in checkedLogistics) {
          let cagte_label = this.logistics_data.find(logistic_data => logistic_data.cagte_label === checkedLogistics[index]).cagte_label
          if (cagte_label) {
            this.selected_user.checkedLogistics.push(cagte_label)
          }
        }
      }
    },

    handleCheckedLogisticsChange: function (value) {
      let checkedCount = value.length
      this.selected_user.checkAll = checkedCount === this.logistics_data.length
      this.selected_user.isIndeterminate = checkedCount > 0 && checkedCount < this.logistics_data.length
    },
    handleCheckAllLogisticsChange: function (value) {
      let LogisticsOptions = this.logistics_data.map(logistic => logistic.cagte_label)
      this.selected_user.checkedLogistics = value ? LogisticsOptions : []
      this.selected_user.isIndeterminate = false
    },
    submitUserForm: function () {
      this.selected_user.data.profile.reserved1 = this.selected_user.checkedLogistics.join()

      this.$refs['userForm'].validate((valid) => {
        if (valid) {
          updateUserAdmin(this.selected_user.data).then(respone => {
            this.$message({
              type: 'success',
              message: '更新成功！'
            })
          }).catch(err => {
            this.$message({
              type: 'error',
              message: err
            })
          })
        }
      })
    },
    resetUserTemp: function () {
      this.selected_user = {
        visible: false,
        checkAll: false,
        checkedLogistics: [],
        isIndeterminate: true,
        data: {
          id: 0,
          is_active: true,
          profile: {
            company_name: '',
            company_tax_code: '',
            other_coupon_code: '',
            ext_info: '',
            reserved1: '',
            reserved2: '',
            points: 0,
            type: 0,
            country: '',
            street: '',
            hausnr: '',
            postcode: '',
            city: '',
            tel: '',
            person_name: '',
            self_coupon_code: '',
            level: '1',
            is_auto_to_pay: false
          }
        }
      }
    }
  }

}
</script>

<style scoped>

</style>
