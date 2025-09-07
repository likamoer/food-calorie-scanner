# 开发指南 🚀

本文档提供食物卡路里扫描器的详细开发指南。

## 项目架构

### 前后端分离架构
- **前端**: React + TypeScript + Styled Components
- **后端**: Node.js + Express + Multer
- **通信**: RESTful API + JSON
- **开发**: 前端运行在 3000 端口，后端运行在 3001 端口

### 目录结构说明

```
├── client/           # React前端应用
│   ├── src/
│   │   ├── components/   # 可复用组件
│   │   │   ├── FileUpload.tsx     # 文件上传组件
│   │   │   ├── ImagePreview.tsx   # 图片预览组件
│   │   │   ├── LoadingState.tsx   # 加载状态组件
│   │   │   ├── ResultsDisplay.tsx # 结果显示组件
│   │   │   └── styles.ts          # 样式组件
│   │   ├── services/     # API服务
│   │   │   └── api.ts            # API客户端
│   │   ├── types/        # TypeScript类型
│   │   │   └── index.ts          # 类型定义
│   │   ├── App.tsx       # 主应用组件
│   │   └── index.tsx     # 应用入口
├── server/           # Node.js后端服务
│   ├── routes/       # API路由
│   │   ├── food.js           # 食物相关API
│   │   └── health.js         # 健康检查API
│   ├── services/     # 业务服务
│   │   └── foodRecognitionService.js  # 食物识别服务
│   ├── uploads/      # 文件上传目录
│   └── server.js     # Express服务器
└── shared/           # 共享代码（未来扩展）
```

## API接口设计

### 后端API端点

| 端点 | 方法 | 功能 | 请求格式 |
|-----|------|------|----------|
| `/api/health` | GET | 健康检查 | - |
| `/api/food/upload` | POST | 上传图片 | multipart/form-data |
| `/api/food/analyze` | POST | 分析食物 | multipart/form-data |
| `/api/food/analyze-base64` | POST | 分析Base64图片 | JSON |
| `/api/food/nutrition/:name` | GET | 获取营养信息 | - |

### 请求/响应格式

**标准响应格式:**
```json
{
  "success": true,
  "message": "操作成功",
  "data": { ... }
}
```

**错误响应格式:**
```json
{
  "success": false,
  "error": "错误信息",
  "message": "详细描述"
}
```

## 开发环境设置

### 1. 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0

### 2. 安装步骤
```bash
# 1. 克隆项目
git clone <repository-url>
cd food-calorie-scanner

# 2. 安装所有依赖
npm install
cd server && npm install
cd ../client && npm install
cd ..

# 3. 配置环境变量
cp server/.env.example server/.env
# 编辑 server/.env 文件，配置必要的参数

# 4. 启动开发服务器
npm run dev
```

### 3. 开发命令

```bash
# 同时启动前后端开发服务器
npm run dev

# 分别启动
npm run dev:server  # 启动后端 (localhost:3001)
npm run dev:client  # 启动前端 (localhost:3000)

# 生产构建
npm run build

# 运行测试
npm run test
```

## 核心功能实现

### 1. 文件上传处理

**前端 (FileUpload.tsx)**
- 使用 react-dropzone 处理拖拽上传
- 支持相机拍照和文件选择
- 文件类型和大小验证

**后端 (routes/food.js)**
- 使用 multer 中间件处理文件上传
- 文件类型过滤和大小限制
- 安全文件名生成

### 2. 食物识别服务

**服务层 (services/foodRecognitionService.js)**
- 模拟食物识别API调用
- 支持百度AI API集成
- 营养信息数据库管理

### 3. 状态管理

**前端状态管理**
- 使用 React Hooks (useState, useCallback)
- 图片预览状态管理
- 上传和分析状态跟踪

## 样式系统

### Styled Components
- 使用 styled-components 进行CSS-in-JS
- 主题色彩系统
- 响应式设计支持
- 动画效果

### 主题配置
```typescript
export const theme = {
  primary: '#4A90E2',
  secondary: '#667eea',
  accent: '#ff6b6b',
  // ...
};
```

## 错误处理

### 前端错误处理
- API请求拦截器
- 用户友好的错误提示
- 表单验证

### 后端错误处理
- 全局错误处理中间件
- HTTP状态码标准化
- 详细错误日志

## 安全考虑

### 文件上传安全
- 文件类型白名单
- 文件大小限制
- 安全文件名生成
- 上传目录隔离

### API安全
- CORS配置
- 请求频率限制
- 文件大小限制
- 输入验证

## 性能优化

### 前端优化
- 图片懒加载
- 组件按需加载
- 状态优化
- 构建优化

### 后端优化
- 文件临时存储管理
- API响应缓存
- 请求并发控制

## 测试策略

### 单元测试
- 前端组件测试
- 后端API测试
- 服务层测试

### 集成测试
- 前后端通信测试
- 文件上传测试
- 端到端流程测试

## 部署指南

### 开发环境
```bash
npm run dev
```

### 生产环境
```bash
# 构建前端
npm run build

# 启动生产服务器
npm start
```

### Docker部署（可选）
```dockerfile
# 可以创建 Dockerfile 进行容器化部署
FROM node:16
# ... 配置步骤
```

## 扩展功能

### 可能的扩展方向
1. 用户系统和历史记录
2. 营养目标跟踪
3. 多种AI模型支持
4. 批量图片处理
5. PWA功能
6. 移动端原生应用

### API集成
- 百度AI食物识别API
- 腾讯云图像识别
- Google Vision API
- 营养数据库API

## 故障排除

### 常见问题

1. **端口占用**
   ```bash
   # 检查端口占用
   netstat -an | findstr :3000
   netstat -an | findstr :3001
   ```

2. **依赖安装失败**
   ```bash
   # 清理缓存重新安装
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **CORS问题**
   - 检查后端CORS配置
   - 确认前端proxy设置

4. **文件上传失败**
   - 检查uploads目录权限
   - 确认文件大小限制
   - 验证文件类型

## 贡献指南

1. Fork项目
2. 创建功能分支
3. 编写测试
4. 提交Pull Request
5. 代码审查

## 版本控制

- 使用语义化版本控制
- 维护CHANGELOG.md
- 标记重要版本

---

如有疑问，请查看项目README.md或创建Issue。
