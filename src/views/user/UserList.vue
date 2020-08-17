<template>
  <table-pagination
    :load-data-method="loadData"
    :column="column"
    :show-pagination="true"
  />
</template>

<script>
  import TablePagination from "@/components/TablePagination/TablePagination";
  import {list} from '@/api/user'

  export default {
    name: "UserList",
    components: {TablePagination},
    data() {
      return {
        queryParam: {},
        column: [
          {
            prop: 'id',
            label: '#Id'
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
            prop: 'status',
            label: '账户状态'
          },
          ],
        loadData: params => {
          return list(Object.assign(params, this.queryParam)).then(res => {
            return res
          })
        },
      }
    }
  }
</script>

<style scoped>

</style>
