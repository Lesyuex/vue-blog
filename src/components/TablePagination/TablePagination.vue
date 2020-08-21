<template>
  <div class="app-container">
    <!--表格-->
    <el-table
      :data="tableData"
      ref="elementuiTable"
      size="mini"
      :row-class-name="tableRowClassName"
      border
    >
     <!--数据列-->
      <el-table-column
        v-for="(col,key) in this.$props.columns"
        :key="key"
        :prop="col.prop"
        :label="col.label"
        :show-overflow-tooltip="true"
        :width="col.width?col.width:columnWidth"
        align="center"
      >
        <template slot-scope="scope">
          <span v-if="col.useSwitch">
            <el-switch
              v-model="scope.row[col.prop]"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="emitSwitch(col.method,scope.row)"
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
        align="center"
        v-for="(col,colIndex) in this.$props.tableOperateArray"
        :width="col.width?col.width:columnWidth"
        :key="col.label"
        :label="col.label">
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
      }
    },
    data() {
      return {
        user: {
          switch: true
        },
        tableData: [],
        columnWidth: 0,
        paginationInfo: {
          current: 1,
          size: 12,
          total: 0,
          sizes: [12, 20, 30, 50]
        },
      }
    },
    //created执行时挂载阶段还没有开始，模版还没有渲染成html，所以无法获取元素。created钩子函数主要用来初始化数据。可用data和prop中的数据
    created() {

    },
    //computed是在DOM执行完成后立马执行（如：赋值）
    //该函数在模版渲染完成后才被调用
    mounted() {
      // 计算列宽
      let sumWidth = 0
      let sumNoWidth = 0
      this.$props.columns.forEach(col=>{
        if (col.width) {
          sumWidth = sumWidth+col.width
        }else {
          sumNoWidth=sumNoWidth+1
        }
      })
      this.$props.tableOperateArray.forEach(item=>{
        if (item.width){
          sumWidth = sumWidth+item.width
        }else {
          sumNoWidth=sumNoWidth+1
        }
      })
      let el = document.getElementsByClassName('el-table')
      if (sumNoWidth!==0){
        this.columnWidth= (el[0].offsetWidth - sumWidth)/(sumNoWidth)
      }
      console.log(sumWidth)
      console.log(sumNoWidth)
      console.log(this.columnWidth)
      this.refreshTable()
    },
    methods: {
      loadTableData() {
        const that = this
        // 拼接参数
        let params=Object.assign({})
        if (that.showPagination) {
        params=Object.assign(params,{current:that.paginationInfo.current,size:params.size = that.paginationInfo.size})
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
      refreshTable() {
        this.loadTableData()
      },
      async emitSwitch(parentMethodName, data) {
        this.$bus.emit(parentMethodName, data) // 调用父组件方法
        console.log('emitSwitch')
        this.refreshTable()
      },
      async emitOperate(parentMethodName, data) {
        this.$bus.emit(parentMethodName, data) // 调用父组件方法
        console.log('emitOperate')
        this.refreshTable()
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
