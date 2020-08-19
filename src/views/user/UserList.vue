<template>
  <div class="app-container">
    <table-pagination
      :load-data-method="loadData"
      :show-pagination="true"
      :column="column"
      :table-operate="tableOperate"/>
    <el-dialog :title="userModal.title" :visible.sync="userModal.dialogTableVisible">
      <el-form ref="form" :model="userModal.user" label-width="80px">
        <el-form-item label="账号:">
          <el-input v-model="userModal.user.username"/>
        </el-form-item>
        <el-form-item label="邮箱:">
          <el-input v-model="userModal.user.email"/>
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
  import {list} from '@/api/user'
  import TablePagination from '@/components/TablePagination/TablePagination';

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
          user: {

          }
        },
        queryParam: {

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
            render: (enable) => {
              return enable ? '启用中' : '已停用'
            }
          },
        ],
        tableOperate: {
          label: '操作',
          type: 'button',
          width: '150',
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
        }
      }
    },
    mounted() {
        //监听
      this.$bus.$on('statusChange', (data) => {
        this.statusChange(data)
      });
        //监听
      this.$bus.$on('editUser', (data) => {
        this.editUser(data)
      });
    },
    methods: {
      statusChange(data) {
        data.enable = !data.enable
            //调用更新操作
      },
      editUser(data) {
        console.log(data)
        this.userModal.user = data
        this.userModal.dialogTableVisible = true
      },
    }
  }
</script>

<style scoped>

</style>
