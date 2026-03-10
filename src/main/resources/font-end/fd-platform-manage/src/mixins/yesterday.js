
export const mixin_yesterday = {
    data() {
      const now = new Date()
      const today_start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
      const yesterday_start = new Date(today_start.getTime() - 3600 * 1000 * 24 * 1)
  
      return {
        yesterday: [yesterday_start, new Date(today_start.getTime() - 1000)]
      }
    },
    created() {
      this.queryFormData.statisticDate = this.yesterday
    },
  }
  