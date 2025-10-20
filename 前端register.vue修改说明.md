# 前端 register.vue 修改说明

## 🎯 需要修改的原因

数据库字段已改为整数类型：
- `breedingType` - 从字符串 "养猪" 改为整数 0
- `position` 改为 `role` - 从字符串 "老板" 改为整数 0

前端需要传递整数而不是字符串！

---

## 📝 修改内容

### 找到文件

**位置：** `C:\Users\Administrator\Desktop\server\dspace\src\pages\register\register.vue`

### 修改第 147-152 行

**之前：**
```javascript
const res = await request.post('user/register', {
    phone: this.phone,
    password: this.password,
    verifyCode: this.verifyCode,
    breedingType: this.breedingTypes[this.breedingTypeIndex],  // ❌ "养猪"（字符串）
    position: this.positions[this.positionIndex]  // ❌ "老板"（字符串），字段名也错了
})
```

**改为：**
```javascript
const res = await request.post('user/register', {
    phone: this.phone,
    password: this.password,
    verifyCode: this.verifyCode,
    breedingType: this.breedingTypeIndex,  // ✅ 0（整数）
    role: this.positionIndex  // ✅ 0（整数），字段名改为 role
})
```

---

## 🔢 数值映射关系

### 养殖类型

| 前端选项 | 数组索引 | 传递给后端 | 后端存储 |
|---------|---------|-----------|---------|
| 养猪 | 0 | 0 | 0 |
| 养鸭 | 1 | 1 | 1 |
| 养鸡 | 2 | 2 | 2 |
| 养兔 | 3 | 3 | 3 |
| 其他 | 4 | 4 | 4 |

**注意：** 前端数组顺序需要和后端字典一致！

### 角色

| 前端选项 | 数组索引 | 传递给后端 | 后端存储 |
|---------|---------|-----------|---------|
| 老板 | 0 | 0 | 0 |
| 饲养员 | 1 | 1 | 1 |
| 其他 | 2 | 2 | 2 |

---

## ⚠️ 重要：前端数组顺序要改

### 当前前端的数组（不正确）

```javascript
breedingTypes: ['养猪', '养鸭', '养鸡', '养兔', '其他']
```

### 后端字典的顺序

```sql
('breed_type', '猪', '0', 1)   -- 值 0
('breed_type', '羊', '1', 2)   -- 值 1
('breed_type', '牛', '2', 3)   -- 值 2
('breed_type', '鸡', '3', 4)   -- 值 3
('breed_type', '鸭', '4', 5)   -- 值 4
('breed_type', '其他', '5', 6) -- 值 5
```

### 建议修改前端数组（匹配后端）

```javascript
breedingTypes: ['养猪', '养羊', '养牛', '养鸡', '养鸭', '其他']
//              索引 0     1      2      3      4      5
```

这样索引就直接对应后端的值了！

---

## 📝 完整的修改方案

### 方案1：修改前端数组顺序（推荐）

**修改 register.vue 的 data：**

```javascript
data() {
    return {
        phone: '',
        password: '',
        verifyCode: '',
        countdown: 0,
        // 修改为与后端字典一致
        breedingTypes: ['养猪', '养羊', '养牛', '养鸡', '养鸭', '其他'],  // ← 改
        breedingTypeIndex: -1,
        // 角色顺序正确，不需要改
        positions: ['老板', '饲养员', '其他'],
        positionIndex: -1
    }
},
```

**修改注册方法：**

```javascript
async handleRegister() {
    // ... 前面的验证代码不变 ...
    
    try {
        const res = await request.post('user/register', {
            phone: this.phone,
            password: this.password,
            verifyCode: this.verifyCode,
            breedingType: this.breedingTypeIndex,  // ← 直接使用索引
            role: this.positionIndex  // ← 字段名改为 role，直接使用索引
        })
        
        uni.showToast({
            title: '注册成功',
            icon: 'success'
        })
        setTimeout(() => {
            uni.navigateBack()
        }, 1500)
    } catch (err) {
        uni.showToast({
            title: err.msg || '注册失败',
            icon: 'none'
        })
    }
},
```

### 方案2：保持前端数组不变，添加映射

**添加映射方法：**

```javascript
methods: {
    // 获取养殖类型值
    getBreedingTypeValue() {
        // 前端: ['养猪', '养鸭', '养鸡', '养兔', '其他']
        // 后端: [  0,      4,      3,     ?,      5   ]
        const map = {
            0: 0,  // 养猪 → 0
            1: 4,  // 养鸭 → 4
            2: 3,  // 养鸡 → 3
            3: -1, // 养兔 → 不存在，用户不应该选
            4: 5   // 其他 → 5
        }
        return map[this.breedingTypeIndex] || 0
    },
    
    // 注册
    async handleRegister() {
        // ...
        const res = await request.post('user/register', {
            phone: this.phone,
            password: this.password,
            verifyCode: this.verifyCode,
            breedingType: this.getBreedingTypeValue(),  // 使用映射
            role: this.positionIndex  // 角色不需要映射
        })
        // ...
    }
}
```

---

## 🎯 我的建议

**推荐使用方案1**（修改前端数组顺序），因为：

1. ✅ 代码更简洁
2. ✅ 数据一致性更好
3. ✅ 避免映射错误
4. ✅ 更易维护

**只需改两处：**

1. 数组顺序：`['养猪', '养羊', '养牛', '养鸡', '养鸭', '其他']`
2. 传递字段：`breedingType: this.breedingTypeIndex` 和 `role: this.positionIndex`

---

## ✅ 验证

### 测试数据

**用户选择：** 养猪 + 老板  
**前端传递：** `{breedingType: 0, role: 0}`  
**后端存储：** `breeding_type=0, role=0`  
**数据库查询时关联字典：** 显示"猪"和"老板"  

---

## 📋 修改清单

- [x] 后端 User.java
- [x] 后端 UserMapper.xml
- [x] 后端 RegisterRequest.java
- [x] 后端 UserService.java
- [ ] 前端 register.vue（需要修改）

---

## 🚀 立即修改

**打开前端文件：**
```
C:\Users\Administrator\Desktop\server\dspace\src\pages\register\register.vue
```

**修改两处：**
1. 第 81 行：数组改为 `['养猪', '养羊', '养牛', '养鸡', '养鸭', '其他']`
2. 第 147-152 行：传递索引值

**保存后重启前端，测试注册！**

