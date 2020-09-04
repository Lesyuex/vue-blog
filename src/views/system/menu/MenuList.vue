<template>
  <div class="app-container">
    <div style="padding-left: 20px;">
      <el-form :inline="true" :model="queryParam" class="demo-form-inline" size="mini">
        <el-form-item label="名称:" size="mini">
          <el-input v-model="queryParam.username" placeholder="角色名" clearable/>
        </el-form-item>
        <el-form-item label="启用状态:" size="mini">
          <el-select v-model="queryParam.enabled" placeholder="状态" clearable>
            <el-option label="启用" value="true"/>
            <el-option label="禁用" value="false"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchRole">查 询</el-button>
          <el-button type="danger" @click="resetQueryParam">清 空</el-button>
        </el-form-item>
      </el-form>
    </div>
    <table-pagination
      ref="table"
      :load-data-method="loadDataMethod"
      :show-pagination="false"
      :columns="columns"
      :table-operate-array="tableOperateArray"
      :expand-all="false"
    />
  </div>
</template>

<script>
  import TablePagination from '@/components/TablePagination/TablePagination'
  import { listTreePermission } from '@/api/system/system'

  export default {
    name: 'MenuList',
    components: {
      TablePagination
    },
    data() {
      return {
        queryParam: {
          name: '',
          type: 1
        },
        columns: [],
        tableOperateArray: [],
        loadDataMethod: params => {
          return listTreePermission(Object.assign(params, this.queryParam)).then(res => {
            return res
          })
        }
      }
    },
    created() {
      this.listColumns()
    },
    methods: {
      listColumns() {
        this.columns = [
          {
            prop: 'title',
            label: '菜单名称',
            minWidth: '10%',
            fixed: 'left'
          },
          {
            prop: 'name',
            label: '路由名称'
          },
          {
            prop: 'path',
            label: '路由路径'
          },
          {
            prop: 'component',
            label: '组件路径'
          },
          {
            prop: 'sortId',
            label: '排序',
            minWidth: '3%',
            center: true
          }
        ]
        this.tableOperateArray = [
          {
            label: '操作',
            type: 'link',
            minWidth: '4%',
            options: [
              {
                label: '',
                type: 'primary',
                method: 'editRole',
                icon: 'el-icon-edit',
                size: 'mini'
              },
              {
                label: '',
                type: 'danger',
                method: 'deleteRole',
                icon: 'el-icon-delete',
                size: 'mini'
              }
            ],
            center: true
          }

        ]
      }
    }
  }
</script>

<style scoped>

</style>
