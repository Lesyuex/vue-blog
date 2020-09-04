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
      :show-pagination="true"
      :columns="columns"
      :table-operate-array="tableOperateArray"
    />
    <!--角色菜单-->
    <el-dialog :title="roleMenuModal.title"
               :visible.sync="roleMenuModal.showTreeMenu"
               :width="roleMenuModal.dialogWidth"
               :close-on-click-modal="true"
               :close-on-press-escape="true">
      <el-tree :data="roleMenuModal.options"
               show-checkbox
               default-expand-all
               node-key="id"
               ref="tree"
               highlight-current
               :props="roleMenuModal.defaultProps">
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleMenuModal.showTreeMenu = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleMenu(role)">确 定</el-button>
      </div>
    </el-dialog>

    <!--角色权限-->
    <el-dialog :title="treePermissionModal.title"
               :visible.sync="treePermissionModal.show"
               :width="treePermissionModal.dialogWidth"
               :close-on-click-modal="true"
               :close-on-press-escape="true">
      <el-tree :data="treePermissionModal.options"
               show-checkbox
               default-expand-all
               node-key="id"
               ref="permTree"
               highlight-current
               :props="treePermissionModal.defaultProps">
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="treePermissionModal.show = false">取 消</el-button>
        <el-button type="primary" @click="saveRolePerm(role)">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="roleModal.title"
               :visible.sync="roleModal.dialogTableVisible"
               :width="roleModal.dialogWidth"
               :close-on-click-modal="true"
               :close-on-press-escape="true">
      <el-form ref="form" :model="role" label-width="80px" size="mini" label-position="left">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="账号">
              <el-input v-model="role.name"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注">
              <el-input v-model="role.remark"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="启用状态">
              <el-switch
                v-model="role.enabled"
                active-color="#13ce66"
                inactive-color="#ff4949"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleModal.dialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateRole(role)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import TablePagination from '@/components/TablePagination/TablePagination'
  import {
    deleteRoleById,
    listRoleByPage,
    listTreePermission,
    updateRoleByRole
  } from '@/api/system/system'
  import { collectIdInArr, differentArr } from '@/utils/array-util'
  import { Message, MessageBox } from 'element-ui'

  export default {
    name: 'RoleList',
    components: {
      TablePagination
    },
    data() {
      return {
        role: {
          permIdList: [],
          menuIdList: []
        },
        roleModal: {
          dialogTableVisible: false,
          title: '编辑角色',
          dialogWidth: document.body.clientWidth * 0.5 + 'px'
        },
        roleMenuModal: {
          options: [],
          title: '角色菜单',
          showTreeMenu: false,
          defaultProps: {
            label: 'title'
          },
          checkedKeys: [],
          dialogWidth: document.body.clientWidth * 0.3 + 'px'
        },
        treePermissionModal: {
          show: false,
          title: 'API授权',
          dialogWidth: document.body.clientWidth * 0.3 + 'px',
          options: [],
          defaultProps: {
            label: 'title'
          },
          props: {
            multiple: true,
            label: 'title',
            value: 'id',
            expandTrigger: 'hover'
          }
        },
        queryParam: {
          name: '',
          enabled: ''
        },
        columns: [],
        tableOperateArray: [],
        loadDataMethod: params => {
          return listRoleByPage(Object.assign(params, this.queryParam)).then(res => {
            return res
          })
        }
      }
    },
    created() {
      const that = this
      this.$bus.$off('updateCurrentRole')
      this.$bus.$off('editRole')
      this.$bus.$off('editRoleMenu')
      this.$bus.$off('editRolePerm')

      this.$bus.$off('deleteRole')
      this.listColumnsInfo()
      //加载树状菜单
      listTreePermission({ type: 1 }).then((res) => {
        that.roleMenuModal.options = res.data
      })
      //加载系统权限
      listTreePermission({ type: 0 }).then(res => {
        that.treePermissionModal.options = res.data
        let filterPermission = function(arr) {
          return arr.filter(item => {
            if (item.children) {
              if (item.children.length <= 0) {
                delete item['children']
              } else {
                filterPermission(item.children)
              }
            }
            return true
          })
        }
        // that.treePermissionModal.options = filterPermission(res.data)
      })

    },
    mounted() {
      this.$bus.$on('updateCurrentRole', (data) => {
        this.updateRole(data)
      })
      this.$bus.$on('editRole', (data) => {
        this.editRole(data)
      })
      this.$bus.$on('editRoleMenu', (data) => {
        this.editRoleMenu(data)
      })
      this.$bus.$on('editRolePerm', (data) => {
        this.editRolePerm(data)
      })
      this.$bus.$on('deleteRole', (data) => {
        this.deleteRole(data)
      })
    },
    methods: {
      searchRole() {
        this.$refs.table.refreshTable()
      },
      resetQueryParam() {
        this.queryParam = Object.assign({})
      },
      editRole(data) {
        console.log(data)
        this.role = data
        this.roleModal.dialogTableVisible = true
      },
      editRolePerm(data) {
        console.log(data)
        this.role = data
        this.treePermissionModal.show = true
        this.$nextTick(() => {
          this.$refs.permTree.setCheckedKeys(this.role.permIdList)
        })
      },
      editRoleMenu(data) {
        console.log(data)
        this.role = data
        //解决回显问题 将总菜单跟用户菜单对比，没有的取消掉
        this.roleMenuModal.showTreeMenu = true
        //收集树状各个菜单的id
        let arr = collectIdInArr(this.roleMenuModal.options)
        //对比筛选没有的
        let noCheckedKeys = differentArr(this.role.menuIdList, arr)
        this.$nextTick(() => {
          this.$refs.tree.setCheckedKeys(this.role.menuIdList)
          //取消没有的
          noCheckedKeys.forEach(key => {
            this.$refs.tree.setChecked(key, false, false)
          })
        })
      },
      permissionChange(checkedArr) {
        console.log(checkedArr)
        this.role.permIdList = this.$refs.permCascader.getCheckedNodes().console.log(this.role)
      },
      saveRoleMenu(role) {
        this.role.menuIdList = this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys())
        this.updateRole(role)
        this.roleMenuModal.showTreeMenu = false
      },
      saveRolePerm(role) {
        this.role.permIdList = this.$refs.permTree.getCheckedKeys()
        this.updateRole(role)
        this.treePermissionModal.show = false
      },
      updateRole(data) {
        const that = this
        console.log(data)
        updateRoleByRole(data).then(res => {
          Message({
            message: res.message,
            type: res.type,
            duration: 5 * 1000
          })
          that.$refs.table.refreshTable()
        })
      },
      deleteRole(data) {
        const that = this
        console.log(data)
        MessageBox.confirm('确认删除此角色吗？', '删除', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteRoleById(data).then(res => {
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
            label: '#ID',
            minWidth: '4%',
            center:true
          },
          {
            prop: 'name',
            label: '角色',
            center:true
          },
          {
            prop: 'remark',
            label: '备注',
            center:true
          },
          {
            prop: 'createTime',
            label: '创建时间',
            center:true
          },
          {
            prop: 'updateTime',
            label: '更新时间',
            center:true
          },
          {
            prop: 'enabled',
            label: '启用状态',
            useSwitch: true,
            method: 'updateCurrentRole',
            minWidth: '4%',
            center:true
          }
        ]
        this.tableOperateArray = [
          {
            label: '菜单',
            type: 'link',
            minWidth: '3%',
            options: [
              {
                label: '',
                type: 'success',
                method: 'editRoleMenu',
                icon: 'el-icon-menu',
                size: 'mini',
                circle: true
              }
            ],
            center:true
          }, {
            label: 'API',
            type: 'link',
            minWidth: '3%',
            options: [
              {
                label: '',
                type: 'success',
                method: 'editRolePerm',
                icon: 'el-icon-lock',
                size: 'mini',
                circle: true
              }
            ],
            center:true
          },
          {
            label: '操作',
            type: 'link',
            minWidth: '5%',
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
            center:true
          }

        ]
      }
    }
  }
</script>

<style scoped>

</style>
