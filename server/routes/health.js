const express = require('express');
const router = express.Router();

// 健康检查端点
router.get('/', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        service: 'food-calorie-scanner-api',
        version: '1.0.0'
    });
});

// 详细健康信息
router.get('/detailed', (req, res) => {
    const memoryUsage = process.memoryUsage();
    
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: {
            rss: `${Math.round(memoryUsage.rss / 1024 / 1024 * 100) / 100} MB`,
            heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024 * 100) / 100} MB`,
            heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024 * 100) / 100} MB`,
            external: `${Math.round(memoryUsage.external / 1024 / 1024 * 100) / 100} MB`
        },
        cpu: {
            loadAverage: require('os').loadavg(),
            uptime: require('os').uptime()
        },
        service: 'food-calorie-scanner-api',
        version: '1.0.0',
        node_version: process.version
    });
});

module.exports = router;
