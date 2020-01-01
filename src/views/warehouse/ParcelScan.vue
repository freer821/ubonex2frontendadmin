<template>
  <div style="padding:10px">
    <el-row :gutter="20">
      <el-col :span="14">
        <el-form
          label-position="top"
          label-width="100px"
          :model="package_info"
          class="form-container"
        >
          <el-form-item>
            <el-radio-group v-model="package_info.scan_type">
              <el-radio-button label="auto" > 自动获取批次号</el-radio-button>
              <el-radio-button label="manual"> 手动填写主单号</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="package_info.scan_type=='manual'">
            <span slot="label" class="ps-label">主单号</span>
            <input
              v-model="package_info.main_plate_code"
              type="text"
              class="ps_input"
            />
            </el-form-item>
            <el-form-item>
            <span slot="label" class="ps-label">包裹单号</span>
            <input
              v-model="package_info.inland_code"
              ref="inland_code"
              type="text"
              class="ps_input"
              @keyup.enter="jumpToWeightInput"
              autofocus
            />
          </el-form-item>
          <el-form-item>
            <span slot="label" class="ps-label">包裹重量</span>
            <input
              v-model="package_info.real_weight"
              ref="real_weight"
              type="text"
              class="ps_input"
              @keyup.enter="package_request_submit"
            />
          </el-form-item>
        </el-form>
        <div class="ps_packageinfo_box">
          <div class="ps_packageinfo_titel">
            <h2 style="font-weight: 600; font-size: 26px;">扫描包裹信息</h2>
          </div>
        </div>
        <div class="parcel_info">
          <el-row :gutter="20">
            <el-col :span="12">
              包裹单号：{{ package_response.inland_code }}
            </el-col>
            <el-col :span="12">
              收件人： {{ package_response.receiver_name }}
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              发件人：{{ package_response.sender_name }}
            </el-col>
            <el-col :span="12">
              收件城市：{{ package_response.receiver_city }}
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              登记重量(KG)：{{ package_response.package_weight }}
            </el-col>
            <el-col :span="12">
              收件人身份证：{{ package_response.receiver_identity }}
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              实际重量(KG)： {{ package_response.package_real_weight }}
            </el-col>
            <el-col :span="12">
              物流线路：{{ package_response.logistic_category }}
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="10">
        <div style="font-size: 20px;font-weight: 800;">
          系统获取批次号:
        </div>
        <div class="ps_big_pici">
          <span ref="pici_code_result">{{ package_response.pici_code }}</span>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="10">
        <div class="ps_status" v-if="package_response.status_no" ref="package_status_result">
          <span>{{ package_response.status }}</span>
        </div>
        <div class="ps_status" v-else><span>等待扫描</span></div>
      </el-col>
      <el-col :span="7">
        <div class="ps_status2">
          <el-popover placement="top" width="160" v-model="pop_visible">
            <p>确定清除扫描成功数据？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="pop_visible = false"
                >取消</el-button>
              <el-button
                type="primary"
                size="mini"
                @click="resetscanresult('success')"
                >确定</el-button>
            </div>
            <span
              style="display:inline-block;height:100%;vertical-align:middle"
              slot="reference"
            >
              扫描成功：{{ scan_result_successed }}
            </span>
          </el-popover>
        </div>
      </el-col>
      <el-col :span="7">
        <div class="ps_status2">
          <el-popover placement="top" width="160" v-model="pop_failed_visible">
            <p>确定清除扫描失败数据？</p>
            <div style="text-align: right; margin: 0">
              <el-button
                size="mini"
                type="text"
                @click="pop_failed_visible = false"
                >取消</el-button
              >
              <el-button
                type="primary"
                size="mini"
                @click="resetscanresult('failed')"
                >确定</el-button
              >
            </div>
            <span
              style="display:inline-block;height:100%;vertical-align:middle;"
              slot="reference"
              >扫描失败：{{ scan_result_failed }}</span
            >
          </el-popover>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// eslint-disable-next-line camelcase
import { package_scan } from '@/api/warehouse'
import {
  setScanSuccessed,
  setScanFailed
} from '@/utils/cookies'

export default {
  name: 'ParcelScan',
  data () {
    return {
      package_info: {
        scan_type: '',
        main_plate_code: '',
        inland_code: '',
        real_weight: ''
      },
      package_response: {},
      scan_result_successed: 0,
      scan_result_failed: 0,
      pop_visible: false,
      pop_failed_visible: false
    }
  },
  methods: {

    jumpToWeightInput: function (event) {
      this.$refs.real_weight.focus()
    },
    package_request_submit () {
      this.package_response = {}
      package_scan(this.package_info)
        .then(response => {
          this.package_response = response.msg
          if (this.package_response.status_no === '41') {
            this.package_response.status = '复重成功！'
            this.scan_result_successed = parseInt(this.scan_result_successed) + 1
            //setScanSuccessed(this.scan_result_successed)
          } else {
            this.package_response.status = '复重失败！'
            this.scan_result_failed = parseInt(this.scan_result_failed) + 1
            setScanFailed(this.scan_result_failed)
          }
        })
        .catch(err => {
          console.log(err)
          this.scan_result_failed = parseInt(this.scan_result_failed) + 1
          //setScanFailed(this.scan_result_failed)
        })
        .finally(() => {
          console.log('call finally')
          this.package_info.inland_code = ''
          this.package_info.real_weight = ''
          this.$refs.inland_code.focus()
          this.changeBackgroundColor()
        })
    },

    resetscanresult (type) {
      if (type === 'success') {
        this.scan_result_successed = 0
        //setScanSuccessed(this.scan_result_successed)
      } else {
        this.scan_result_failed = 0
        //setScanFailed(this.scan_result_failed)
      }
      this.pop_visible = false
      this.pop_failed_visible = false
    },

    changeBackgroundColor () {
      if (this.package_response && this.package_response.status_no === '41') {
        this.$refs.pici_code_result.style.color = 'green'
        this.$refs.package_status_result.style.background = 'green'
      } else {
        this.$refs.pici_code_result.style.color = 'red'
        this.$refs.package_status_result.style.background = 'red'
      }
      setTimeout(() => {
        this.$refs.pici_code_result.style.color = 'black'
        this.$refs.package_status_result.style.background = '#009977'
      }, 1000)
    }
  }
}
</script>

<style scoped>
.ps-label {
  font-size: 32px;
  color: #787878;
}
.ps_input {
  width: 100%;
  font-size: 50px;
  border-style: solid;
  border-width: 1px;
  border-color: #5e5e5e;
  padding-left: 10px;
}

.ps_input:focus {
  border-style: solid;
  border-color: #03a9f4;
  box-shadow: 0 0 10px #03a9f4;
}

.ps_packageinfo_titel {
  font-size: 32px;
  color: #f74902;
  text-align: center;
  font-weight: 600;
  position: relative;
}

.ps_packageinfo_box {
  width: 100%;
  margin-top: 5px;
  margin-bottom: 5px;
}

.ps_packageinfo_titel h2:before,
.ps_packageinfo_titel h2:after {
  position: absolute;
  background: #f74902;
  content: "";
  height: 1px;
  top: 50%;
  width: 25%;
}

.ps_packageinfo_titel h2:before {
  left: 0px;
}

.ps_packageinfo_titel h2:after {
  right: 0px;
}

.ps_big_pici {
  text-align: center;
  font-size: 120px;
  font-weight: 800;
  padding-top: 100px;
  height: 100%;
}

.ps_status {
  font-size: 82px;
  text-align: center;
  font-weight: 600;
  background-color: rgb(0, 153, 119);
  min-width: 100%;
}

.ps_status2 {
  font-size: 48px;
  text-align: left;
  font-weight: 600;
  line-height: 117px;
  height: 117px;
}
.parcel_info {
  margin-bottom: 20px;
  font-size: large;
}
.parcel_info .el-row {
  margin-bottom: 15px;
}
</style>
