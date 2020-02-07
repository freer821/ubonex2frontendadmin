<template>
  <el-table :data="list" border fit highlight-current-row style="width: 100%">
    <el-table-column class-name="status-col" label="重量(KG)">
      <template slot-scope="{row}">
        <span>{{ row.weight }}</span>
      </template>
    </el-table-column>

    <el-table-column class-name="status-col" label="价格(EURO)">
      <template slot-scope="{row}">
        <span>{{ row.price }}</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>

export default {
  props: {
    list: Array
  }
}
</script>
