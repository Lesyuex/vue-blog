<template>
  <div class="app-container">
    <el-table
      :data="tableData"
      size="mini"
      :row-class-name="tableRowClassName"
      border
      style="width: 100%">
      <el-table-column
        v-for="(col,key) in column"
        :key="key"
        :prop="col.prop"
        :label="col.label"
        :min-width="col.width?col.width:columnWidth"
        :show-overflow-tooltip=true
        align="center">
        <template slot-scope="scope">
          <span v-if="col.useSwitch">
            <el-switch
              v-model="scope.row[col.prop]"
              @change="emitSwitch(col.method,scope.row)"
              active-color="#13ce66"
              inactive-color="#ff4949"/>
          </span>
          <span v-else-if="col.render">
            {{col.render(scope.row)}}
          </span>
          <span v-else>{{scope.row[col.prop]}}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="tableOperate.label"
                       :width="tableOperate.width?tableOperate.width:columnWidth"
                       :label="tableOperate.label"
                       class-name="small-padding fixed-width"
                       align="center">
        <template slot-scope="scope">
          <span v-if="tableOperate.type==='link'">
          <el-link style="margin: 3px"
            v-for="(item,index) in tableOperate.options"
            :key="index"
            :type="item.type"
            :icon="item.icon"
            :underline="false"
            @click="emitOperate(item.method,scope.row)">
            {{item.label}}
          </el-link>

          </span>
          <span v-else-if="tableOperate.type==='button'">
               <el-button
                 v-for="(item,index) in tableOperate.options"
                 :key="index"
                 :type="item.type"
                 :icon="item.icon"
                 :size="item.size"
                 @click="emitOperate(item.method,scope.row)">
            {{item.label}}
          </el-button>
          </span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-if="showPagination"
                   align="right"
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
    name: 'TablePagination',
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
        default: () => [10, 15, 20, 50]
      },
      tableOperate: {
        type: Object,
        required: false,
        default: () => {
        }
      }
    },
    data() {
      return {
        user: {
          switch: true
        },
        tableData: [],
        columnWidth: (100 / (this.column.length + this.tableOperate.length)) + '%',
        paginationInfo: {
          current: 1,
          size: 12,
          total: 0,
          sizes: [12, 20, 30, 50]
        }
      }
    },
    created() {

    },
    mounted() {
      this.loadTableData()
    },
    methods: {
      refresh(bool = false) {
        if (bool) {
          this.loadTableData()
        }
      },
      emitSwitch(parentMethodName, data) {
        console.log('emitSwitch')
        this.$bus.emit(parentMethodName, data)  //调用父组件方法
      },
      emitOperate(parentMethodName, data) {
        this.$bus.emit(parentMethodName, data) //调用父组件方法
      },
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
          if (that.showPagination && res.data.records.length === 0 && that.paginationInfo.current > 1) {
            this.handleCurrentChange(that.paginationInfo.current - 1)
          } else {
            if (that.showPagination) {
              that.paginationInfo.total = res.data.total
            }
          }
        })
      },
      showItem(item) {
        console.log(item)
      },
      handleCurrentChange(current) {
        const that = this
        that.paginationInfo.current = current
        that.loadTableData()
      },
      handleSizeChange(size) {
        const that = this
        that.paginationInfo.size = size
        that.loadTableData()
      },
      tableRowClassName({ row, rowIndex }) {
        if (rowIndex === 1) {
          return 'warning-row'
        } else if (rowIndex === 3) {
          return 'success-row'
        }
        return ''
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
</style>
