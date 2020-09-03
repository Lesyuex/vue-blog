<template>
  <table-pagination
    :column="column"
    :load-data-method="loadDataMethod"
    :show-pagination="true"
  />
</template>

<script>
  import TablePagination from '@/components/TablePagination/TablePagination'
  import { listPermissionByPage } from '@/api/system/system'

  export default {
    name: 'List',
    components: {
      TablePagination
    },
    data() {
      return {
        queryParam: {
          name: ''
        },
        column: [
          {
            prop: 'name',
            label: '名字'
          },
          {
            prop: 'perm',
            label: '权限'
          }
        ],
        loadDataMethod: params => {
          return listPermissionByPage(Object.assign(params, this.queryParam)).then(res => {
            return res
          })
        }
      }
    }
  }
</script>

<style scoped>

</style>
