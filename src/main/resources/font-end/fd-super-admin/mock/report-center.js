const mockDb = require('./mockdb.js')

module.exports = [
  {
    /**
     * 平台日报表
     */
    url: '/vue-element-admin/report-center/platform-daily-report',
    type: 'post',
    response: (config) => {
      let ret = {
        "code": 200,
        "message": "success",
        "total": 122,
        "data": mockDb.platformDailyReportList
      }
      
      return ret;
    }
  },
]
