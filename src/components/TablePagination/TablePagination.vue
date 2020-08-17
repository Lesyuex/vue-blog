<template>
  <div class="app-container">
    <el-table
      :data="tableData"
      size="mini"
      :row-class-name="tableRowClassName"
      border
      style="width: 100%">
      <el-table-column v-for="(col,key) in column"
                       align="center"
                       :key="key"
                       :prop="col.prop"
                       :label="col.label"
                       :min-width="col.width?col.width:columnWidth"
                       show-overflow-tooltip="true"/>
    </el-table>
    <el-pagination v-if="showPagination" align="right"
                   @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   :current-page="paginationInfo.current"
                   :page-sizes="paginationInfo.sizes"
                   :page-size="paginationInfo.size"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="paginationInfo.total">
    </el-pagination>
  </div>
</template>

<script>
  export default {
    name: "TablePagination",
    props: {
      column: {
        type: Array,
        required: true
      },
      loadDataMethod: {
        type: Function,
        required: true
      },
      showPagination: {
        type: Boolean,
        required: false,
        default: false
      },
      paginationInfoSizes: {
        type: Array,
        required: false,
        default: () => [10, 30, 50, 80]
      }
    },
    data() {
      return {
        tableData: [],
        columnWidth: (100 / this.column.length) + '%',
        paginationInfo: {
          current: 1,
          size: 10,
          total: 0,
          sizes: this.paginationInfoSizes
        },
      }
    },
    created() {

    },
    mounted() {
      this.loadTableData()
    },
    methods: {
      loadTableData() {
        const that = this
        let params = {}
        //拼接参数
        if (that.showPagination) {
          params.current = that.paginationInfo.current
          params.size = that.paginationInfo.size
        }
        that.loadDataMethod(params).then(res => {
          that.tableData = res.data.records
          if (that.showPagination) {
            that.paginationInfo.current = res.data.current
            that.paginationInfo.size = res.data.size
            that.paginationInfo.total = res.data.total
          }
        })
      },
      handleCurrentChange(current) {
        const that = this
        that.initPaginationInfo(current, that.paginationInfo.size)
        that.loadTableData()
      },
      handleSizeChange(size) {
        const that = this
        that.initPaginationInfo(that.paginationInfo.current, size)
        that.loadTableData()
      },
      initPaginationInfo(current, size) {
        const that = this
        that.paginationInfo.current = current
        that.paginationInfo.size = size
      },
      tableRowClassName({row, rowIndex}) {
        if (rowIndex === 1) {
          return 'warning-row';
        } else if (rowIndex === 3) {
          return 'success-row';
        }
        return '';
      }
    }
  }
</script>
<style>
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }

  body .el-table th.gutter {
    display: table-cell !important;
  }
</style>
