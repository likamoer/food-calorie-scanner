# 百度AI API配置指南 🔧

## 📝 获取百度AI API密钥

### 1. 注册百度AI开放平台账号
访问：https://ai.baidu.com/

### 2. 创建应用
1. 登录后进入控制台
2. 选择"图像识别"服务
3. 创建新应用
4. 选择"菜品识别"接口

### 3. 获取API密钥
在应用管理页面可以看到：
- **API Key**: 应用的唯一标识
- **Secret Key**: 应用的密钥

## 🔑 配置API密钥

### 方法1: 直接编辑环境变量文件
编辑 `server/.env` 文件：

```bash
# 百度AI API配置
BAIDU_API_KEY=你的实际API_KEY
BAIDU_SECRET_KEY=你的实际SECRET_KEY
```

### 方法2: 使用命令行配置（推荐）
```bash
# 进入服务器目录
cd server

# 设置API密钥（替换为你的实际密钥）
$env:BAIDU_API_KEY="你的API_KEY"
$env:BAIDU_SECRET_KEY="你的SECRET_KEY"

# 或者直接修改.env文件
echo "BAIDU_API_KEY=你的API_KEY" >> .env
echo "BAIDU_SECRET_KEY=你的SECRET_KEY" >> .env
```

## 🧪 测试API连接

配置完成后，可以使用以下方式测试：

### 1. 启动服务器
```bash
cd server
npm start
```

### 2. 测试API调用
使用任意食物图片测试上传和分析功能。

### 3. 查看日志
服务器会在控制台输出API调用状态：
- 如果API密钥有效，会显示"使用百度AI API进行识别"
- 如果API密钥无效，会回退到"使用模拟数据"

## 🔒 安全注意事项

1. **不要提交API密钥到Git**
   - `.env` 文件已在 `.gitignore` 中
   - 确保不要将真实密钥提交到代码库

2. **定期轮换密钥**
   - 建议定期更新API密钥
   - 在百度控制台可以重新生成

3. **限制API使用**
   - 设置合适的请求频率限制
   - 监控API使用量

## 📊 API使用限制

### 百度菜品识别API限制：
- **免费额度**: 每月500次调用
- **QPS限制**: 2次/秒
- **图片大小**: 最大4MB
- **支持格式**: JPG, PNG, BMP

### 收费标准：
- 超出免费额度后按次收费
- 具体价格查看百度AI开放平台

## 🛠️ API接口详情

### 请求格式
```http
POST https://aip.baidubce.com/rest/2.0/image-classify/v2/dish
Content-Type: application/x-www-form-urlencoded

access_token=ACCESS_TOKEN&image=BASE64_IMAGE&top_num=5
```

### 响应格式
```json
{
  "log_id": 1234567890,
  "result_num": 5,
  "result": [
    {
      "name": "蛋炒饭",
      "probability": "0.85",
      "calorie": "150"
    }
  ]
}
```

## 🔧 故障排除

### 常见错误：

1. **API Key 无效**
   ```
   错误: Invalid API Key
   解决: 检查API Key是否正确复制
   ```

2. **Secret Key 无效**
   ```
   错误: Invalid Secret Key  
   解决: 检查Secret Key是否正确
   ```

3. **Access Token 获取失败**
   ```
   错误: Failed to get access token
   解决: 检查网络连接和API密钥
   ```

4. **请求频率超限**
   ```
   错误: QPS limit exceeded
   解决: 降低请求频率或升级套餐
   ```

### 调试步骤：
1. 检查环境变量是否正确设置
2. 查看服务器控制台日志
3. 使用百度AI官方测试工具验证密钥
4. 检查网络防火墙设置

## 📚 相关文档

- [百度AI开放平台](https://ai.baidu.com/)
- [菜品识别API文档](https://ai.baidu.com/ai-doc/IMAGERECOGNITION/Xk3bcxe21)
- [获取Access Token](https://ai.baidu.com/ai-doc/REFERENCE/Ck3dwjhhu)

---

配置完成后，你的应用就可以使用百度AI进行真实的食物识别了！ 🎉
