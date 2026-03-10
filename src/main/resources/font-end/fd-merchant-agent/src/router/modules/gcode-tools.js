/**
 *  代码生成工具
 */

import Layout from '@/layout'

const gCodeTools = [
  {
      path: '/my-tools',
      redirect: '/my-tools/vue-gcode',
      component: Layout,
      meta: { title: '代码生成工具', icon: 'icon'},
      children: [
        {
          path: 'vue-gcode',
          component: () => import('@/views/my-tools/vue-gcode'),
          name: 'VueGcode',
          meta: { title: 'vue 工具', icon: 'icon'}
        },
        {
          path: 'vue-gcode-test',
          component: () => import('@/views/my-tools/vue-gcode-test'),
          name: 'VueGcodeTest',
          meta: { title: '代码预览', icon: 'icon'}
        }
      ]
    },
]
export default gCodeTools
