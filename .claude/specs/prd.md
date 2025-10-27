AI卡路里用户体系接口文档

一、文档概述

本文档详细描述了AI卡路里用户管理系统的后端接口规范，包含用户注册、登录、信息管理、购买服务及分析记录等功能模块。

二、接口规范

1. 统一响应格式
所有接口响应均采用以下标准格式：
{
    "code": 200,
    "message": "success",
    "data": {}
}

2. 创建用户接口

接口地址：/api/users/create  
请求方法：POST  
Content-Type：application/json

请求参数：
参数名
类型
是否必填
描述
示例
username
string
是
用户昵称，2-20位字符
"John Doe"
phoneNumber
string
是
用户手机号，11位数字
"15101627659"
password
string
是
用户密码，6-20位字符
"123456"

请求示例：
{
    "username": "John Doe",
    "phoneNumber": "15101627659",
    "password": "123456"
}

响应参数：
参数名
类型
描述
id
number
用户ID
username
string
用户昵称
phoneNumber
string
用户手机号
createTime
string
创建时间

响应示例：
{
    "code": 200,
    "message": "用户创建成功",
    "data": {
        "id": 1,
        "username": "John Doe",
        "phoneNumber": "15101627659",
        "createTime": "2024-01-15 10:30:00"
    }
}

错误响应示例：
{
    "code": 400,
    "message": "手机号已存在",
    "data": null
}

3. 查询用户接口

接口地址：/api/users/{id}  
请求方法：GET  
Content-Type：application/json

路径参数：
参数名
类型
是否必填
描述
id
number
是
用户ID

响应参数：
参数名
类型
描述
id
number
用户ID
username
string
用户昵称
phoneNumber
string
用户手机号
scanCount
number
剩余扫描次数
createTime
string
创建时间
updateTime
string
更新时间

响应示例：
{
    "code": 200,
    "message": "success",
    "data": {
        "id": 1,
        "username": "John Doe",
        "phoneNumber": "15101627659",
        "scanCount": 5,
        "createTime": "2024-01-15 10:30:00",
        "updateTime": "2024-01-20 14:25:00"
    }
}

错误响应示例：
{
    "code": 404,
    "message": "用户不存在",
    "data": null
}

4. 购买扫描次数接口

接口地址：/api/buy/scanFrequency  
请求方法：POST  
Content-Type：application/json

请求参数：
参数名
类型
是否必填
描述
示例
userId
number
是
用户ID
1
frequency
number
是
购买次数
10
paymentMethod
string
是
支付方式
"alipay"

请求示例：
{
    "userId": 1,
    "frequency": 10,
    "paymentMethod": "alipay"
}

响应参数：
参数名
类型
描述
orderId
string
订单ID
totalAmount
number
总金额
frequency
number
购买次数
paymentUrl
string
支付链接
orderStatus
string
订单状态

响应示例：
{
    "code": 200,
    "message": "订单创建成功",
    "data": {
        "orderId": "ORDER_202401201430001",
        "totalAmount": 29.90,
        "frequency": 10,
        "paymentUrl": "https://payment.example.com/pay/ORDER_202401201430001",
        "orderStatus": "pending"
    }
}

5. 用户登录接口

接口地址：/api/auth/login  
请求方法：POST  
Content-Type：application/json

请求参数：
参数名
类型
是否必填
描述
示例
phoneNumber
string
是
用户手机号
"15101627659"
password
string
是
用户密码
"123456"

请求示例：
{
    "phoneNumber": "15101627659",
    "password": "123456"
}

响应参数：
参数名
类型
描述
token
string
认证令牌
userId
number
用户ID
username
string
用户昵称
expireTime
string
token过期时间

响应示例：
{
    "code": 200,
    "message": "登录成功",
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "userId": 1,
        "username": "John Doe",
        "expireTime": "2024-01-21 10:30:00"
    }
}

错误响应示例：
{
    "code": 401,
    "message": "手机号或密码错误",
    "data": null
}

6. AI分析结果存储接口

接口地址：/api/analyzeResults/store  
请求方法：POST  
Content-Type：application/json

请求参数：
参数名
类型
是否必填
描述
示例
userId
number
是
用户ID
1
imageData
string
是
图片数据(Base64)
"base64encodedstring..."
foodType
string
否
食物类型
"水果"
analyzeResult
object
是
分析结果
{}

请求示例：
{
    "userId": 1,
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

响应参数：
参数名
类型
描述
recordId
number
记录ID
analyzeTime
string
分析时间

响应示例：
{
    "code": 200,
    "message": "分析结果保存成功",
    "data": {
        "recordId": 1001,
        "analyzeTime": "2024-01-20 15:30:00"
    }
}

7. 历史分析结果记录列表

接口地址：/api/analysisResults/history  
请求方法：GET  
Content-Type：application/json

请求参数：
参数名
类型
是否必填
描述
示例
userId
number
是
用户ID
1
page
number
否
页码，默认1
1
pageSize
number
否
每页大小，默认10
10

响应参数：
参数名
类型
描述
total
number
总记录数
page
number
当前页码
pageSize
number
每页大小
list
array
分析记录列表

记录对象结构：
参数名
类型
描述
recordId
number
记录ID
foodName
string
食物名称
calories
number
卡路里
analyzeTime
string
分析时间
foodType
string
食物类型

响应示例：
{
    "code": 200,
    "message": "success",
    "data": {
        "total": 25,
        "page": 1,
        "pageSize": 10,
        "list": [
            {
                "recordId": 1001,
                "foodName": "苹果",
                "calories": 52,
                "analyzeTime": "2024-01-20 15:30:00",
                "foodType": "水果"
            },
            {
                "recordId": 1000,
                "foodName": "鸡胸肉",
                "calories": 165,
                "analyzeTime": "2024-01-19 12:15:00",
                "foodType": "肉类"
            }
        ]
    }
}

三、错误码说明

错误码
描述
200
成功
400
请求参数错误
401
认证失败
403
权限不足
404
资源不存在
500
服务器内部错误

四、注意事项

1. 所有接口请求需携带认证Token（登录接口除外）
2. Token需在请求头中设置：Authorization: Bearer {token}
3. 图片上传限制：最大5MB，支持JPG、PNG格式
4. 接口请求频率限制：每秒10次