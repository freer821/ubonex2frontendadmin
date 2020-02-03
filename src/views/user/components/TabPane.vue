<template>
  <el-table :data="list" border fit highlight-current-row style="width: 100%">
    <el-table-column class-name="status-col" label="重量(KG)">
      <template slot-scope="{row}">
        <span>{{ row.title }}</span>
      </template>
    </el-table-column>

    <el-table-column class-name="status-col" label="价格(EURO)">
      <template slot-scope="{row}">
        <el-tag :type="row.status | statusFilter">
          {{ row.status }}
        </el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>

export default {
  filters: {
    statusFilter (status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  props: {
    type: {
      type: String,
      default: 'CN'
    }
  },
  data () {
    return {
      list: null,
      listQuery: {
        page: 1,
        limit: 5,
        type: this.type,
        sort: '+id'
      },
      loading: false
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      this.loading = true
      this.$emit('create') // for test
    }
  }
}
</script>
