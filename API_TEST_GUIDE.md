# API接口测试指南

## 环境配置

### 必需的环境变量

在 `server/.env` 或项目根目录的 `.env` 文件中添加：

```env
# JWT配置
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRE_TIME=24h

# 支付配置
PAYMENT_MODE=mock  # mock: 模拟支付, real: 真实支付

# 数据库配置
DATABASE_PATH=./database/database.sqlite
```

## 接口列表

### 1. 用户管理接口

#### 1.1 创建用户

**接口地址:** `POST /api/users/create`

**请求体:**
```json
{
  "username": "John Doe",
  "phoneNumber": "15101627659",
  "password": "123456"
}
```

**响应示例:**
```json
{
  "code": 200,
  "message": "用户创建成功",
  "data": {
    "id": 1,
    "username": "John Doe",
    "phoneNumber": "15101627659",
    "createTime": "2024-01-20 15:30:00"
  }
}
```

#### 1.2 查询用户

**接口地址:** `GET /api/users/:id`

**响应示例:**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "username": "John Doe",
    "phoneNumber": "15101627659",
    "scanCount": 10,
    "createTime": "2024-01-20 15:30:00",
    "updateTime": "2024-01-20 15:30:00"
  }
}
```

### 2. 认证接口

#### 2.1 用户登录

**接口地址:** `POST /api/auth/login`

**请求体:**
```json
{
  "phoneNumber": "15101627659",
  "password": "123456"
}
```

**响应示例:**
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "userId": 1,
    "username": "John Doe",
    "expireTime": "2024-01-21 15:30:00"
  }
}
```

### 3. 购买接口

#### 3.1 购买扫描次数

**接口地址:** `POST /api/buy/scanFrequency`

**请求头:**
```
Authorization: Bearer {token}
```

**请求体:**
```json
{
  "frequency": 10,
  "paymentMethod": "alipay"
}
```

**响应示例(Mock模式):**
```json
{
  "code": 200,
  "message": "订单创建成功",
  "data": {
    "orderId": "ORDER_1234567890_abc",
    "totalAmount": 9.9,
    "frequency": 10,
    "paymentUrl": null,
    "orderStatus": "paid"
  }
}
```

### 4. 分析结果接口

#### 4.1 存储分析结果

**接口地址:** `POST /api/analyzeResults/store`

**请求头:**
```
Authorization: Bearer {token}
```

**请求体:**
```json
{
  "imageData": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
  "foodType": "水果",
  "analyzeResult": {
    "foodName": "苹果",
    "calories": 52,
    "protein": 0.3,
    "carbohydrate": 14,
    "fat": 0.2
  }
}
```

**响应示例:**
```json
{
  "code": 200,
  "message": "分析结果保存成功",
  "data": {
    "recordId": 123456789,
    "analyzeTime": "2024-01-20 15:30:00"
  }
}
```

#### 4.2 查询历史记录

**接口地址:** `GET /api/analysisResults/history`

**请求头:**
```
Authorization: Bearer {token}
```

**查询参数:**
```
userId=1&page=1&pageSize=10
```

**响应示例:**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 25,
    "page": 1,
    "pageSize": 10,
    "list": [
      {
        "recordId": 123456789,
        "foodName": "苹果",
        "foodType": "水果",
        "calories": 52,
        "analyzeTime": "2024-01-20 15:30:00"
      }
    ]
  }
}
```

## 测试工具

### 使用 cURL 测试

#### 1. 创建用户
```bash
curl -X POST http://localhost:3001/api/users/create \
  -H "Content-Type: application/json" \
  -d '{"username":"John Doe","phoneNumber":"15101627659","password":"123456"}'
```

#### 2. 登录
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"15101627659","password":"123456"}'
```

#### 3. 查询用户(需要Token)
```bash
curl -X GET http://localhost:3001/api/users/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 使用 Postman 测试

1. 创建Collection: "AI卡路里用户体系API"
2. 设置环境变量:
   - `base_url`: http://localhost:3001
   - `token`: (登录后获取)
3. 按顺序测试:
   - 创建用户 → 登录 → 购买次数 → 存储分析结果 → 查询历史

## 错误码说明

| 错误码 | 描述 |
|--------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 认证失败 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

## 注意事项

1. 所有需要认证的接口必须在请求头中携带 `Authorization: Bearer {token}`
2. Token默认24小时有效
3. 图片数据必须是Base64格式，且以 `data:image/...;base64,` 开头
4. Mock支付模式下会自动标记订单为已支付并增加扫描次数
5. 真实支付模式需要配置相应的支付SDK

