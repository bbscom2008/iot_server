
import request from '@/utils/request'

/**
 * 平台日报表
 * @returns 
 */
export function getPlatformReportPage() {
  return request({
    url: '/report/dailyPlatformReport/getPlatformReportPage',
    method: 'post',
  })
}
