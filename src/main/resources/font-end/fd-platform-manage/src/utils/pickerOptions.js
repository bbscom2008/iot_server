export const pickerOptions = {
    shortcuts: [
        {
          text: '今天',
          onClick(picker) {
            const end = new Date()
            const start = new Date(end.getFullYear(), end.getMonth(), end.getDate(), 0, 0, 0);
            picker.$emit('pick', [start, end])
          }
        },
        {
          text: '昨天',
          onClick(picker) {
            const now = new Date()
            const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
            const start = new Date(end.getTime() - 3600 * 1000 * 24 * 1)
            picker.$emit('pick', [start, end])
          }
        },
        {
          text: '近3天',
          onClick(picker) {
            const now = new Date()
            const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
            const start = new Date(end.getTime() - 3600 * 1000 * 24 * 3)
            picker.$emit('pick', [start, now])
          }
        },
        {
          text: '近7天',
          onClick(picker) {
            const now = new Date()
            const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
            const start = new Date(end.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, now])
          }
        },
        {
          text: '近15天',
          onClick(picker) {
            const now = new Date()
            const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
            const start = new Date(end.getTime() - 3600 * 1000 * 24 * 15)
            picker.$emit('pick', [start, now])
          }
        },
        {
          text: '近30天',
          onClick(picker) {
            const now = new Date()
            const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
            const start = new Date(end.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, now])
          }
        }
      ]
}