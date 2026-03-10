import Pagination from '@/components/Pagination' // secondary package based on el-pagination


export const pagination = {
  components: { Pagination },
  data() {
    return {
      layout: 'total, sizes, prev, pager, next',
      listQuery: {
        page: 1,
        limit: 20
      },
      total: 0
    }
  }
}
