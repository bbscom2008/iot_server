
import { ColumnType } from '@/views/my-tools/constant-gcode'

export const columnList =  [
    {
      title: '多选框',
      type: ColumnType.selection,
      key: '',
      isSearch: false,
      width: '55'
    },
    {
      title: '序号',
      type: ColumnType.index,
      key: '',
      isSearch: false,
      width: ''
    },
    {
      title: '姓名',
      type: ColumnType.string,
      key: 'name',
      isSearch: true,
      width: ''
    },
    {
      title: '年龄',
      type: ColumnType.number,
      key: 'age',
      isSearch: true,
      width: ''
    },
    {
      title: '姓别',
      type: ColumnType.select,
      isSearch: true,
      key: 'gender',
      options: [
        {
          label: '男',
          value: '1'
        },
        {
          label: '女',
          value: '2'
        }
      ],
      optionsName: 'genderOptions',
      width: ''
    },
    {
      title: '是否启用',
      isSearch: true,
      type: ColumnType.boolean,
      key: 'isEnable'
    },
    {
      title: '出生日期',
      type: ColumnType.date,
      isSearch: true,
      key: 'date',
      width: ''
    },
    {
      title: '操作',
      type: ColumnType.operate,
      isSearch: false,
      key: '',
      width: ''
    }
  ]