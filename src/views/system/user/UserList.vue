<template>
  <div class="app-container">
    <div style="padding-left: 20px;">
      <el-form :inline="true" :model="queryParam" size="mini">
        <el-row :gutter="24">
          <el-col :span="6">
            <el-form-item label="用户名:" size="mini">
              <el-input v-model="queryParam.username" placeholder="用户名" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="用户状态:" size="mini">
              <el-select v-model="queryParam.enabled" placeholder="用户状态" clearable>
                <el-option label="启用" value="true"/>
                <el-option label="禁用" value="false"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" size="mini">
            <el-form-item>
              <el-button type="primary" @click="searchUser">查 询</el-button>
              <el-button type="danger" @click="resetQueryParam">清 空</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <table-pagination
      ref="table"
      :load-data-method="loadData"
      :show-pagination="true"
      :columns="columns"
      :table-operate-array="tableOperateArray"
    />
    <el-dialog :title="userModal.title" :visible.sync="userModal.dialogTableVisible" :width="dialogWidth"
               :close-on-click-modal="false">
      <el-form ref="form" :model="userModal.user" label-width="80px" size="mini" label-position="left">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="账号">
              <el-input v-model="userModal.user.username"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱">
              <el-input v-model="userModal.user.email"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="角色">
              <el-select style="width: 100%"
                         v-model="userModal.user.roleList"
                         multiple
                         filterable
                         allow-create
                         default-first-option
                         placeholder="选择用户角色">
                <el-option
                  v-for="item in systemRoleList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="启用状态">
              <el-switch
                v-model="userModal.user.enabled"
                active-color="#13ce66"
                inactive-color="#ff4949"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userModal.dialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEdit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { listUserByPage, deleteUserByUserId, updateUserByUser } from '@/api/user'
  import { listUserRole } from '@/api/system/system'
  import { Message, MessageBox } from 'element-ui'
  import TablePagination from '@/components/TablePagination/TablePagination'

  export default {
    name: 'UserList',
    components: {
      TablePagination
    },
    data() {
      return {
        systemRoleList: [],
        userModal: {
          dialogTableVisible: false,
          title: '编辑用户',
          user: {
            roleList: []
          }
        },
        queryParam: {
          username: '',
          enable: ''
        },
        columns: [],
        tableOperateArray: [],
        loadData: params => {
          return listUserByPage(Object.assign(params, this.queryParam)).then(res => {
            return res
          })
        },
        dialogWidth: document.body.clientWidth * 0.4 + 'px'
      }
    },
    created() {
      const that = this
      this.$bus.$off('updateCurrentUser')
      this.$bus.$off('editUser')
      this.$bus.$off('deleteUser')
      this.listColumnsInfo()
      listUserRole({}).then(res => {
        that.systemRoleList = res.data
      })
    },
    mounted() {
      this.$bus.$on('updateCurrentUser', (data) => {
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
      submitEdit() {
        this.updateUser(this.userModal.user)
        this.userModal.dialogTableVisible = false
      },
      editUser(data) {
        const that = this
        // 查找角色
        that.userModal.user = Object.assign({ roleList: [] }, data)
        listUserRole({ userId: data.id }).then(res => {
          for (let i = 0; i < res.data.length; i++) {
            that.userModal.user.roleList.push(res.data[i].value)
          }
          this.userModal.dialogTableVisible = true
        })
      },
      updateUser(data) {
        const that = this
        updateUserByUser(data).then(res => {
          Message({
            message: res.message,
            type: res.type,
            duration: 5 * 1000
          })
          that.$refs.table.refreshTable()
        })
      },
      deleteUser(data) {
        const that = this
        MessageBox.confirm('确认删除此用户吗？', '删除', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteUserByUserId(data).then(res => {
            Message({
              message: res.message,
              type: res.type,
              duration: 5 * 1000
            })
            that.$refs.table.refreshTable()
          })
        })
      },
      listColumnsInfo() {
        this.columns = [
          {
            prop: 'id',
            label: '#Id',
            minWidth: '4%',
            center: true
          },
          {
            prop: 'username',
            label: '用户名',
            center: true,
          },
          {
            prop: 'email',
            label: 'Email',
            center: true
          },
          {
            prop: 'createTime',
            label: '创建时间',
            center: true
          },
          {
            prop: 'updateTime',
            label: '更新时间',
            center: true
          },
          {
            prop: 'enabled',
            label: '账户状态',
            useSwitch: true,
            method: 'updateCurrentUser',
            minWidth: '4%',
            center: true
          }
        ]
        this.tableOperateArray = [
          /*   {
               label: '角色',
               type: 'link',
               width: 60,
               options: [
                 {
                   label: '',
                   type: 'success',
                   method: 'editUser',
                   icon: 'el-icon-s-check',
                   size: 'mini',
                   circle: true
                 }
               ]
             },*/
          {
            label: '操作',
            type: 'link',
            minWidth: '4%',
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
