# IoT后端API接口清单

根据前端代码分析，需要实现以下接口：

## 1. 用户模块 (User)

| 接口 | 方法 | 路径 | 参数 | 响应 | 说明 |
|------|------|------|------|------|------|
| 用户登录 | POST | `/user/login` | `{phone, password}` | `{token, user}` | 返回token和用户信息 |
| 获取用户信息 | GET | `/user/info` | - | `{data: {id, phone, nikeName, address, icon}}` | 需要token |
| 更新用户信息 | POST | `/user/updateInfo` | `{nikeName, address, icon}` | `{msg: "success"}` | 需要token |

## 2. 设备模块 (Device)

| 接口 | 方法 | 路径 | 参数 | 响应 | 说明 |
|------|------|------|------|------|------|
| 获取设备列表 | GET | `/device/list` | `{pageNum, pageSize, search, type, breedType}` | `{list: [], total}` | 分页查询 |
| 获取设备统计 | GET | `/device/statistics` | - | `{allDevice, lineDevice, warningDevice}` | 统计数据 |
| 获取设备详情 | GET | `/device/{id}` | - | `{data: device}` | 单个设备详情 |
| 绑定设备 | POST | `/device/bind` | `{deviceNum, deviceName}` | `{msg: "success"}` | 扫码绑定 |
| 解绑设备 | PUT | `/device/un/bind` | `{deviceId}` | `{msg: "success"}` | 删除设备 |

## 3. 报警模块 (Warning)

| 接口 | 方法 | 路径 | 参数 | 响应 | 说明 |
|------|------|------|------|------|------|
| 获取报警列表 | GET | `/device/warning/list` | `{pageNum, pageSize}` | `{list: [], total}` | 分页查询 |
| 消除报警 | POST | `/device/warning/read` | `?deviceNum=xxx` | `{msg: "success"}` | 标记已读 |
| 消除环控仪报警 | POST | `/device/hkyWarningRead/read` | `?deviceNum=xxx` | `{msg: "success"}` | 环控仪专用 |

## 4. 字典模块 (Dict)

| 接口 | 方法 | 路径 | 参数 | 响应 | 说明 |
|------|------|------|------|------|------|
| 获取字典数据 | GET | `/user/dict/data/list` | `{dictType}` | `{data: []}` | 养殖类型、设备类型等 |

## 数据库表设计

### 1. users 表
```sql
- id (主键)
- phone (手机号，唯一)
- password (密码)
- nike_name (昵称)
- address (地址)
- icon (头像)
- created_at (创建时间)
- updated_at (更新时间)
```

### 2. devices 表
```sql
- id (主键)
- user_id (用户ID)
- device_num (设备编号，唯一)
- device_name (设备名称)
- device_type (设备类型：0-报警器 1-环控仪 2-变频器)
- breed_type (养殖类型)
- device_line_state (在线状态：0-离线 1-在线)
- signal (信号强度)
- ta, tb (温度A/B)
- humidity (湿度)
- gas_con (气体浓度)
- warning_status (报警状态)
- outage_state (断电状态)
- gas_con_status (气体报警状态)
- created_at, updated_at
```

### 3. device_warnings 表
```sql
- id (主键)
- device_id (设备ID)
- device_num (设备编号)
- user_id (用户ID)
- warning_type (报警类型)
- warning_msg (报警信息)
- is_read (是否已读：0-未读 1-已读)
- created_at
```

### 4. dict_data 表（字典数据）
```sql
- id (主键)
- dict_type (字典类型：breed_type, device_type)
- dict_label (显示名称)
- dict_value (值)
- dict_sort (排序)
```

## 响应格式

统一响应格式（参考Swagger文档）：
```json
{
  "code": 200,
  "msg": "success",
  "data": {...}
}
```

或根据前端实际需求调整为：
```json
{
  "success": true,
  "message": "操作成功",
  "data": {...}
}
```

