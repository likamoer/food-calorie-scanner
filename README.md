# 食物卡路里扫描器 🍎📱

一款现代化的全栈食物图片识别与卡路里计算应用。采用React前端 + Node.js后端的架构，通过拍照或上传食物照片，智能识别食物种类并计算相应的卡路里含量。

## 🌟 功能特性

- 📸 **智能拍照识别** - 支持相机拍照和相册选择
- 🔍 **食物识别** - AI智能识别各种食物类型
- 🧮 **卡路里计算** - 自动计算食物卡路里含量
- 📊 **营养成分** - 显示蛋白质、碳水化合物、脂肪等营养信息
- 📱 **移动端优化** - 响应式设计，完美适配手机端
- 🎨 **优雅界面** - 现代化设计，良好的用户体验
- ⚡ **离线支持** - PWA应用，支持离线使用

## 🛠️ 技术栈

### 前端
- **框架**: React 18 + TypeScript
- **样式**: Styled Components + CSS-in-JS
- **状态管理**: React Hooks
- **文件上传**: React Dropzone
- **HTTP客户端**: Axios

### 后端
- **运行时**: Node.js
- **框架**: Express.js
- **文件处理**: Multer
- **安全**: Helmet, CORS, Rate Limiting
- **API集成**: 百度AI/腾讯云/阿里云食物识别API

### 开发工具
- **包管理**: npm
- **构建工具**: Create React App
- **开发服务器**: Nodemon
- **并发运行**: Concurrently

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0
- 现代浏览器（支持ES6+）

### 安装运行

1. **克隆项目**
```bash
git clone <repository-url>
cd food-calorie-scanner
```

2. **安装依赖**
```bash
# 安装所有依赖包（根目录、前端、后端）
npm run install:all
```

3. **配置环境变量**
```bash
# 复制后端环境配置文件
cp server/.env.example server/.env

# 编辑配置文件，添加API密钥等信息
# nano server/.env
```

4. **开发模式运行**
```bash
# 同时启动前端和后端开发服务器
npm run dev
```

或者分别启动：
```bash
# 终端1: 启动后端服务器 (http://localhost:3001)
npm run dev:server

# 终端2: 启动前端应用 (http://localhost:3000)
npm run dev:client
```

5. **访问应用**
- 前端应用: http://localhost:3000
- 后端 API: http://localhost:3001
- API文档: http://localhost:3001/

## 📁 项目结构

```
food-calorie-scanner/
├── client/                 # React前端应用
│   ├── public/
│   ├── src/
│   │   ├── components/     # React组件
│   │   ├── services/       # API服务
│   │   ├── types/          # TypeScript类型定义
│   │   ├── App.tsx         # 主应用组件
│   │   └── index.tsx       # 应用入口
│   ├── package.json
│   └── .env                # 前端环境配置
├── server/                 # Node.js后端服务
│   ├── routes/             # API路由
│   ├── services/           # 业务服务
│   ├── uploads/            # 文件上传目录
│   ├── server.js           # 服务器入口
│   ├── package.json
│   └── .env.example        # 环境配置示例
├── shared/                 # 共享代码和类型
├── package.json            # 根项目配置
├── README.md
└── .gitignore
```

## 🔧 API集成

### 百度AI食物识别API

1. 注册[百度AI开放平台](https://ai.baidu.com/)账号
2. 创建食物识别应用
3. 获取API Key和Secret Key
4. 在`app.js`中配置API密钥

```javascript
// 示例配置
const BAIDU_API_KEY = 'your_api_key';
const BAIDU_SECRET_KEY = 'your_secret_key';
```

### 其他API支持

- 腾讯云图像识别
- 阿里云视觉智能开放平台
- Google Cloud Vision API
- Azure Computer Vision

## 📱 PWA功能

本应用支持PWA（渐进式Web应用）功能：

- 可安装到手机桌面
- 支持离线访问
- 类似原生应用的体验

要启用PWA功能，需要配置Service Worker和Web App Manifest文件。

## 🎨 自定义样式

应用采用响应式设计，支持：

- 移动端优先设计
- 平板和桌面端适配
- 深色模式支持
- 自定义主题颜色

### 修改主题色

在`styles.css`中修改CSS变量：

```css
:root {
  --primary-color: #4A90E2;
  --secondary-color: #667eea;
  --accent-color: #ff6b6b;
}
```

## 🔍 使用方法

1. **上传照片**
   - 点击上传区域选择照片
   - 或拖拽照片到上传区域
   - 支持JPG、PNG格式

2. **分析食物**
   - 点击"开始分析食物"按钮
   - 等待AI识别结果

3. **查看结果**
   - 查看识别的食物名称
   - 了解卡路里含量
   - 查看详细营养成分

## 🧪 开发调试

### 调试模式

打开浏览器开发者工具，在控制台中可以访问：

```javascript
// 应用实例
window.foodScanner

// 手动触发识别（用于测试）
foodScanner.analyzeFood()
```

### 模拟数据

应用内置了模拟数据，无需API密钥即可测试基本功能。

## 🚀 部署

### GitHub Pages

1. 将代码推送到GitHub仓库
2. 在仓库设置中启用GitHub Pages
3. 选择主分支作为源

### Vercel/Netlify

1. 连接GitHub仓库
2. 配置构建设置（如需要）
3. 部署应用

## 🤝 贡献

欢迎贡献代码！请遵循以下步骤：

1. Fork本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建Pull Request

## 📄 许可证

本项目采用MIT许可证 - 查看[LICENSE](LICENSE)文件了解详情

## ⚠️ 免责声明

- 本应用提供的营养信息仅供参考
- 实际营养含量可能因食物制作方式、分量等因素而有所差异
- 如有特殊健康需求，请咨询专业营养师

## 📞 联系方式

- 邮箱: your.email@example.com
- GitHub: [@yourusername](https://github.com/yourusername)

## 🙏 致谢

- [Font Awesome](https://fontawesome.com/) - 图标库
- [百度AI开放平台](https://ai.baidu.com/) - 食物识别API
- 所有贡献者和用户的支持

---

**享受健康饮食生活！** 🥗✨
