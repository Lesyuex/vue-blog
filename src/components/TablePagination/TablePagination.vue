<template>

  <div class="app-container my-app-container">
    <!--表格-->
    <el-table
      :data="tableData"
      ref="elementuiTable"
      size="mini"
      :row-class-name="tableRowClassName"
      :max-height="tabelMaxHeight"
      row-key="id"
      border
      :default-expand-all="expandAll"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <!--数据列-->
      <el-table-column
        v-for="(col,key) in this.$props.columns"
        :key="key"
        :prop="col.prop"
        :label="col.label"
        :show-overflow-tooltip="true"
        :min-width="col.minWidth?col.minWidth:columnMinWidth"
        :align="col.center?'center':'left'"
        :fixed="col.fixed?col.fixed:false"
      >
        <template slot-scope="scope">
          <span v-if="col.useSwitch">
            <el-switch
              v-model="scope.row[col.prop]"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="emitOperate(col.method,scope.row)"
            />
          </span>
          <span v-else-if="col.render">
            {{ col.render(scope.row) }}
          </span>
          <span v-else>{{ scope.row[col.prop] }}</span>
        </template>
      </el-table-column>
      <!--操作列-->
      <el-table-column
        class-name="small-padding fixed-width"
        :align="col.center?'center':'left'"
        v-for="(col,colIndex) in this.$props.tableOperateArray"
        :min-width="col.minWidth?col.minWidth:columnMinWidth"
        :key="col.label"
        :label="col.label">
        :fixed="col.fixed?col.fixed:false"
        <template slot-scope="scope">
          <!--链接类型-->
          <span v-if="col.type==='link'">
            <el-link
              v-for="(item,index) in col.options"
              :key="index"
              style="padding: 5px"
              :type="item.type"
              :icon="item.icon"
              :underline="false"
              @click="emitOperate(item.method,scope.row)">
              {{ item.label }}
            </el-link>
          </span>
          <!--button类型-->
          <span v-else-if="col.type==='button'">
            <el-button
              v-for="(item,index) in col.options"
              :key="index"
              :type="item.type"
              :icon="item.icon"
              :size="item.size"
              @click="emitOperate(item.method,scope.row)"
              :circle="item.circle"
              :plain="item.plain"
              :round="item.round"
            >
              {{ item.label }}
            </el-button>
          </span>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <el-pagination
      v-if="showPagination"
      align="right"
      :current-page="paginationInfo.current"
      :page-sizes="paginationInfo.sizes"
      :page-size="paginationInfo.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="paginationInfo.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>

  const documentWidth = document.body.clientWidth
  export default {
    name: 'TablePagination',
    props: {
      columns: {
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
      tableOperateArray: {
        type: Array,
        required: false,
        default: () => []
      },
      expandAll: {
        type: Boolean,
        required: false,
        default: () => false
      },
      tabelMaxHeight: {
        type: String,
        required: false,
        default: () => 500
      }
    },
    data() {
      return {
        user: {
          switch: true
        },
        tableData: [],
        columnWidth: 0,
        columnMinWidth: 0,
        paginationInfo: {
          current: 1,
          size: 12,
          total: 0,
          sizes: [12, 20, 30, 50]
        }
      }
    },
    //created执行时挂载阶段还没有开始，模版还没有渲染成html，所以无法获取元素。created钩子函数主要用来初始化数据。可用data和prop中的数据
    created() {
      let sumMinWidth = 0
      let sumNoMinWidth = 0
      this.$props.columns.forEach(col => {
        if (col.minWidth) {
          let num = col.minWidth.replace('%', '')
          console.log(num)
          sumMinWidth = sumMinWidth + num
        } else {
          sumNoMinWidth = sumNoMinWidth + 1
        }
      })
      this.$props.tableOperateArray.forEach(item => {
        if (item.minWidth) {
          let num = item.minWidth.replace('%', '')
          sumMinWidth = sumMinWidth + num
        } else {
          sumNoMinWidth = sumNoMinWidth + 1
        }
      })
      let columnMinWidth = 100 - sumMinWidth
      if (columnMinWidth > 0 && sumNoMinWidth !== 0) {
        this.columnMinWidth = columnMinWidth / sumNoMinWidth + '%'
      } else {
        this.columnMinWidth = 100 / (this.$props.columns.length + this.$props.tableOperateArray.length) + '%'
      }
      this.refreshTable()
    },
    //computed是在DOM执行完成后立马执行（如：赋值）
    //该函数在模版渲染完成后才被调用
    mounted() {
      // 计算列宽
      let sumWidth = 0
      let sumNoWidth = 0
      this.$props.columns.forEach(col => {
        if (col.width) {
          sumWidth = sumWidth + col.width
        } else {
          sumNoWidth = sumNoWidth + 1
        }
      })
      this.$props.tableOperateArray.forEach(item => {
        if (item.width) {
          sumWidth = sumWidth + item.width
        } else {
          sumNoWidth = sumNoWidth + 1
        }
      })
      let el = document.getElementsByClassName('el-table')
      let app = document.getElementsByClassName('app-container')
      console.log(app)
      if (sumNoWidth !== 0) {
        this.columnWidth = (el[0].offsetWidth - sumWidth) / (sumNoWidth)
      }

    },
    methods: {
      loadTableData() {
        const that = this
        // 拼接参数
        let params = Object.assign({})
        if (that.showPagination) {
          params = Object.assign(params, {
            current: that.paginationInfo.current,
            size: params.size = that.paginationInfo.size
          })
        }
        that.loadDataMethod(params).then(res => {
          if (res.data.records) {
            that.tableData = res.data.records
          } else {
            that.tableData = res.data
          }
          if (that.showPagination) {
            if (res.data.records.length === 0) {
              if (that.paginationInfo.current > 1) {
                that.handleCurrentChange(that.paginationInfo.current - 1)
              }
            }
            that.paginationInfo.total = res.data.total
          }
        })
      },
      refreshTable() {
        this.loadTableData()
      },
      emitOperate(parentMethodName, data) {
        this.$bus.emit(parentMethodName, data) // 调用父组件方法
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
