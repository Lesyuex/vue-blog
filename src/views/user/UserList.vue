<template>
  <div class="app-container">
    <div style="padding-left: 20px;">
      <el-form :inline="true" :model="queryParam" class="demo-form-inline" size="mini">
        <el-form-item label="用户名:">
          <el-input v-model="queryParam.username" placeholder="用户名" clearable />
        </el-form-item>
        <el-form-item label="用户状态:">
          <el-select v-model="queryParam.status" placeholder="用户状态" clearable>
            <el-option label="启用" value="1" />
            <el-option label="禁用" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchUser">查 询</el-button>
          <el-button type="danger" @click="resetQueryParam">清 空</el-button>
        </el-form-item>
      </el-form>
    </div>
    <table-pagination
      ref="table"
      :load-data-method="loadData"
      :show-pagination="true"
      :column="column"
      :table-operate="tableOperate"
    />
    <el-dialog :title="userModal.title" :visible.sync="userModal.dialogTableVisible" :width="dialogWidth">
      <el-form ref="form" :model="userModal.user" label-width="80px">
        <el-form-item label="账号:">
          <el-input v-model="userModal.user.username" />
        </el-form-item>
        <el-form-item label="邮箱:">
          <el-input v-model="userModal.user.email" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userModal.dialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="userModal.dialogTableVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { list, deleteUserByUserId, updateUserByUser } from '@/api/user'
  import { Message } from 'element-ui'
  import TablePagination from '@/components/TablePagination/TablePagination'

  export default {
    name: 'UserList',
    components: {
      TablePagination
    },
    data() {
      return {
        userModal: {
          dialogTableVisible: false,
          title: '编辑用户',
          user: {}
        },
        queryParam: {
          username: '',
          status: ''
        },
        column: [
          {
            prop: 'id',
            label: '#Id',
            width: '20'
          },
          {
            prop: 'username',
            label: '用户名'
          },
          {
            prop: 'email',
            label: 'Email'
          },
          {
            prop: 'createTime',
            label: '创建时间'
          },
          {
            prop: 'updateTime',
            label: '更新时间'
          },
          {
            prop: 'enable',
            label: '账户状态',
            width: '30',
            useSwitch: true,
            method: 'updateUser'
          }
        ],
        tableOperate: {
          label: '操作',
          type: 'link',
          width: '100',
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
        loadData: params => {
          return list(Object.assign(params, this.queryParam)).then(res => {
            return res
          })
        },
        dialogWidth: document.body.clientWidth * 0.4 + 'px'
      }
    },
    mounted() {
      this.$bus.$on('updateUser', (data) => {
        this.updateUser(data)
      })
      this.$bus.$on('editUser', (data) => {
        this.editUser(data)
      })
      this.$bus.$on('deleteUser', (data) => {
        this.deleteUser(data)
      })
    },
    methods: {
      resetQueryParam() {
        this.queryParam = Object.assign({})
      },
      searchUser() {
        this.$refs.table.refreshTable()
      },
      editUser(data) {
        console.log(data)
        this.userModal.user = data
        this.userModal.dialogTableVisible = true
      },
     async updateUser(data) {
        updateUserByUser(data).then(res => {
          if (res.code === 200) {
            Message({
              message: res.msg,
              type: 'success',
              duration: 1000
            })
          }
        })
      },
      async deleteUser(data) {
        deleteUserByUserId(data).then(res => {
          if (res.code === 200) {
            Message({
              message: res.msg,
              type: 'success',
              duration: 1000
            })
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
