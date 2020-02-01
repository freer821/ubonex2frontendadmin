<template>
  <el-container>
    <el-header>
      <el-button type="warning">添加新用户等级</el-button>
    </el-header>
    <el-main>
      <el-button type="primary" icon="el-icon-plus">添加新一行</el-button>

      <el-table
        :data="gridData"
        style="width: 100%">

        <el-table-column
          label="Name"
          min-width="100">
          <editable-cell :show-input="row.editMode" slot-scope="{row}" v-model="row.name">
            <span slot="content">{{row.name}}</span>
          </editable-cell>
        </el-table-column>

        <el-table-column
          min-wwidth="150"
          label="Gender">

          <editable-cell
            :show-input="row.editMode"
            slot-scope="{row}"
            editable-component="el-select"
            close-event="change"
            v-model="row.gender">

            <el-tag size="medium"
                    :type="row.gender === 'M' ? 'primary' : 'danger'"
                    slot="content">
              {{row.gender === 'M' ? 'Male': 'Female'}}
            </el-tag>

            <template slot="edit-component-slot">
              <el-option value="M" label="Male"></el-option>
              <el-option value="F" label="Female"></el-option>
            </template>
          </editable-cell>
        </el-table-column>

        <el-table-column
          label="Operations"
          min-width="180">
          <template slot-scope="{row, index}">
            <el-button icon="el-icon-edit"
                       @click="setEditMode(row, index)">
            </el-button>
            <el-button type="success" icon="el-icon-check"
                       @click="saveRow(row, index)">
            </el-button>
            <el-button type="danger" icon="el-icon-delete"
                       @click="delRow(row, index)">
            </el-button>
          </template>
        </el-table-column>

      </el-table>
    </el-main>
  </el-container>
</template>

<script>
import EditableCell from '@/components/EditableCell'

export default {
  name: 'LogisticPriceManagement',
  components: {
    EditableCell
  },
  data () {
    return {
      gridData: [
        {
          date: '2016-05-03',
          name: 'Tom',
          gender: 'M'
        },
        {
          date: '2016-05-02',
          name: 'Lisa',
          gender: 'F'
        },
        {
          date: '2016-05-04',
          name: 'Jon',
          gender: 'M'
        },
        {
          date: '2016-05-01',
          name: 'Mary',
          gender: 'F'
        }
      ]
    }
  },
  methods: {
    setEditMode (row, index) {
      row.editMode = true
    },
    saveRow (row, index) {
      row.editMode = false
    }
  },
  mounted () {
    this.gridData = this.gridData.map(row => {
      return {
        ...row,
        editMode: false
      }
    })
  }
}
</script>

<style>
  .el-container {
    margin: 20px;
  }

</style>
