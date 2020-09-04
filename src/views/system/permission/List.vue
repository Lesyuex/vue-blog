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
      :expand-all="false"
      :table-operate-array="tableOperateArray"
      :tabel-max-height="500"
    />
  </div>
</template>

<script>
  import TablePagination from '@/components/TablePagination/TablePagination'
  import { listTreePermission } from '@/api/system/system'

  export default {
    name: 'List',
    components: {
      TablePagination
    },
    data() {
      return {
        queryParam: {
          name: '',
          type: 0
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
            label: 'Api名称',
            minWidth: '15%'
          },
          {
            prop: 'name',
            label: 'Api url'
          },
          {
            prop: 'path',
            label: '匹配路径'
          },
          {
            prop: 'method',
            label: '请求方式',
            center: true,
            minWidth: '5%'
          },
          {
            prop: 'perm',
            label: '权限标识'
          },
          {
            prop: 'remark',
            label: '备注'
          }
        ]
        this.tableOperateArray = [
          {
            label: '操作',
            type: 'link',
            minWidth: '6%',
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
