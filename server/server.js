require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

// 创建上传目录
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// 安全中间件
app.use(helmet());

// CORS配置
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
}));

// 速率限制
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15分钟
    max: 100, // 限制每个IP 15分钟内最多100个请求
    message: { error: '请求过于频繁，请稍后再试' }
});
app.use('/api', limiter);

// 解析JSON数据
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 静态文件服务（用于展示上传的图片）
app.use('/uploads', express.static(uploadDir));

// 导入路由
const foodRoutes = require('./routes/food');
const healthRoutes = require('./routes/health');
const aiRoutes = require('./routes/ai');

// 使用路由
app.use('/api/food', foodRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/ai', aiRoutes);

// 根路径
app.get('/', (req, res) => {
    res.json({
        message: '食物卡路里扫描器 API 服务器',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            analyze: 'POST /api/food/analyze',
            upload: 'POST /api/food/upload',
            aiAnalyze: 'POST /api/ai/analyze'
        }
    });
});

// 404处理
app.use('*', (req, res) => {
    res.status(404).json({
        error: '接口不存在',
        message: `找不到路径: ${req.originalUrl}`
    });
});

// 全局错误处理
app.use((error, req, res, next) => {
    console.error('服务器错误:', error);
    
    // 如果是Multer错误
    if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
            error: '文件过大',
            message: '上传文件不能超过5MB'
        });
    }
    
    if (error.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({
            error: '文件数量过多',
            message: '一次只能上传一个文件'
        });
    }
    
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({
            error: '无效的文件字段',
            message: '请使用正确的文件上传字段名'
        });
    }
    
    // 通用错误处理
    res.status(error.status || 500).json({
        error: error.message || '服务器内部错误',
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
});

// 启动服务器并提升超时设置（允许AI分析更长响应时间）
const serverInstance = app.listen(PORT, () => {
    console.log(`🚀 服务器运行在端口 ${PORT}`);
    console.log(`📱 API文档: http://localhost:${PORT}/`);
    console.log(`🌍 环境: ${process.env.NODE_ENV || 'development'}`);
});

// Node.js HTTP 超时参数可调节
try {
    const headersTimeoutMs = Number(process.env.SERVER_HEADERS_TIMEOUT_MS || 65000); // 默认65s
    const requestTimeoutMs = Number(process.env.SERVER_REQUEST_TIMEOUT_MS || 120000); // 默认120s
    const keepAliveTimeoutMs = Number(process.env.SERVER_KEEPALIVE_TIMEOUT_MS || 60000); // 默认60s

    if (serverInstance && serverInstance.headersTimeout !== undefined) {
        serverInstance.headersTimeout = headersTimeoutMs;
    }
    if (serverInstance && serverInstance.requestTimeout !== undefined) {
        serverInstance.requestTimeout = requestTimeoutMs;
    }
    if (serverInstance && serverInstance.keepAliveTimeout !== undefined) {
        serverInstance.keepAliveTimeout = keepAliveTimeoutMs;
    }

    console.log(`🛠️ Server timeouts set: headersTimeout=${headersTimeoutMs}ms, requestTimeout=${requestTimeoutMs}ms, keepAliveTimeout=${keepAliveTimeoutMs}ms`);
} catch (e) {
    console.warn('无法设置服务器超时参数:', e?.message || e);
}

module.exports = app;
