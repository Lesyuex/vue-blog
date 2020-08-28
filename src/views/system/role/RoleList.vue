<template>
  <div class="app-container">
    <div style="padding-left: 20px;">
      <el-form :inline="true" :model="queryParam" class="demo-form-inline" size="mini">
        <el-form-item label="名称:" size="mini">
          <el-input v-model="queryParam.username" placeholder="用户名" clearable />
        </el-form-item>
        <el-form-item label="启用状态:" size="mini">
          <el-select v-model="queryParam.enabled" placeholder="用户状态" clearable>
            <el-option label="启用" value="true" />
            <el-option label="禁用" value="false" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="">查 询</el-button>
          <el-button type="danger" @click="">清 空</el-button>
        </el-form-item>
      </el-form>
    </div>
  <table-pagination
    ref="table"
    :load-data-method="loadDataMethod"
    :show-pagination="true"
    :columns="columns"
    :table-operate-array="tableOperateArray"
  />
  </div>
</template>

<script>
  import TablePagination from '@/components/TablePagination/TablePagination'
  import { listRole, listRoleByPage } from '@/api/system/system'

  export default {
    name: 'RoleList',
    components: {
      TablePagination
    },
    data() {
      return {
        queryParam: {
          name: ''
        },
        columns: [],
        tableOperateArray:[],
        loadDataMethod: params => {
          return listRoleByPage(Object.assign(params, this.queryParam)).then(res => {
            return res
          })
        }
      }
    },
    created() {
        this.listColumnsInfo()
    },
    methods:{
      listColumnsInfo(){
        this.columns =  [
          {
            prop: 'id',
            label: '#ID',
            width: 60
          },
          {
            prop: 'name',
            label: '角色'
          },
          {
            prop: 'remark',
            label: '权限'
          },
          {
            prop: 'createTime',
            label: '创建时间',
            width: 200
          },
          {
            prop: 'updateTime',
            label: '更新时间',
            width: 200
          },
          {
            prop: 'enabled',
            label: '启用状态',
            useSwitch: true,
            method: 'updateUser',
            width: 80
          }
        ]
        this.tableOperateArray=[
          {
            label: '权限',
            type: 'link',
            width: 60,
            options: [
              {
                label: '',
                type: 'success',
                method: 'editUser',
                icon: 'el-icon-collection-tag',
                size: 'mini',
                circle: true
              }
            ]
          },
          {
            label: '操作',
            type: 'link',
            width: 80,
            options: [
              {
                label: '',
                type: 'primary',
                method: 'editUser',
                icon: 'el-icon-edit',
                size: 'mini'
              },
              {
                label: '',
                type: 'danger',
                method: 'deleteUser',
                icon: 'el-icon-delete',
                size: 'mini'
              }
            ]
          },

        ]
  }
    }
  }
</script>

<style scoped>

</style>
