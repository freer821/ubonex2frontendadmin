<template>
  <el-container>
    <el-header>
      <el-select v-model="selected_logistic_id" filterable placeholder="请选择" style="margin-right: 40px">
        <el-option
          v-for="item in logistic_apis"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>

      <el-button type="warning" round @click="updateLogisticApi">更新此API</el-button>
    </el-header>
    <el-main>
      <div class="json-editor">
        <textarea ref="textarea" />
      </div>
    </el-main>
  </el-container>
</template>

<script>
import CodeMirror from 'codemirror'
import 'codemirror/addon/lint/lint.css'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/rubyblue.css'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/addon/lint/lint'
import 'codemirror/addon/lint/json-lint'
import { getLogisticApis, updateLogisticApis } from '@/api/logistic'

require('script-loader!jsonlint')

export default {
  name: 'LogisticApis',
  data () {
    return {
      value: '',
      jsonEditor: false,
      logistic_apis: [],
      selected_logistic_id: '',
      selected_logistic: ''
    }
  },
  watch: {
    selected_logistic_id (val) {
      this.selected_logistic = this.logistic_apis.filter(logistic => logistic.id === val)[0]
      this.value = JSON.parse(this.selected_logistic.postcode_type)
    },
    value (val) {
      const editorValue = this.jsonEditor.getValue()
      if (val !== editorValue) {
        this.jsonEditor.setValue(JSON.stringify(val, null, 2))
      }

      this.selected_logistic.postcode_type = val
    }
  },
  created () {
    this.getLogisticApis()
  },
  mounted () {
    this.jsonEditor = CodeMirror.fromTextArea(this.$refs.textarea, {
      lineNumbers: true,
      mode: 'application/json',
      gutters: ['CodeMirror-lint-markers'],
      theme: 'rubyblue',
      lint: true
    })

    this.jsonEditor.setValue(JSON.stringify(this.value, null, 2))
    this.jsonEditor.on('change', cm => {
      this.value = cm.getValue()
    })
  },
  methods: {
    getLogisticApis () {
      getLogisticApis().then(response => {
        this.logistic_apis = response.data.results
      }).catch(err => {
        console.log(err)
      })
    },
    updateLogisticApi () {
      updateLogisticApis(this.selected_logistic).then(response => {
        this.$message({
          type: 'info',
          message: '更新成功!'
        })
      }).catch(err => {
        this.$message({
          type: 'error',
          message: err
        })
      })
    },
    getValue () {
      return this.jsonEditor.getValue()
    }
  }
}
</script>

<style scoped>
  .el-container {
    margin: 20px;
  }

  .json-editor{
    height: 100%;
    position: relative;
  }
  .json-editor >>> .CodeMirror {
    height: auto;
    min-height: 300px;
  }
  .json-editor >>> .CodeMirror-scroll{
    min-height: 300px;
  }
  .json-editor >>> .cm-s-rubyblue span.cm-string {
    color: #F08047;
  }
</style>
