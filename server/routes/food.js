const express = require('express');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const FoodRecognitionService = require('../services/foodRecognitionService');

const router = express.Router();

// 配置multer用于文件上传
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads/'));
    },
    filename: (req, file, cb) => {
        const uniqueName = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

// 文件过滤器
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('不支持的文件类型。请上传 JPG 或 PNG 格式的图片。'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
        files: 1 // 只允许上传一个文件
    },
    fileFilter: fileFilter
});

// 初始化食物识别服务
const foodService = new FoodRecognitionService();

// 图片上传接口
router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                error: '没有上传文件',
                message: '请选择一个图片文件'
            });
        }

        // 返回文件信息
        res.json({
            success: true,
            message: '图片上传成功',
            data: {
                filename: req.file.filename,
                originalName: req.file.originalname,
                size: req.file.size,
                mimetype: req.file.mimetype,
                url: `/uploads/${req.file.filename}`
            }
        });

    } catch (error) {
        console.error('上传错误:', error);
        res.status(500).json({
            error: '上传失败',
            message: error.message
        });
    }
});

// 分析食物接口
router.post('/analyze', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                error: '没有上传文件',
                message: '请选择一个图片文件'
            });
        }

        console.log(`开始分析食物图片: ${req.file.filename}`);

        // 使用食物识别服务分析图片
        const analysisResult = await foodService.analyzeFood(req.file.path);

        // 清理上传的临时文件（可选）
        if (process.env.CLEANUP_UPLOADS !== 'false') {
            setTimeout(() => {
                fs.unlink(req.file.path, (err) => {
                    if (err) console.error('删除临时文件失败:', err);
                });
            }, 5 * 60 * 1000); // 5分钟后删除
        }

        res.json({
            success: true,
            message: '食物分析完成',
            data: {
                ...analysisResult,
                imageUrl: `/uploads/${req.file.filename}`,
                timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('分析错误:', error);
        
        // 清理文件
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error('删除错误文件失败:', err);
            });
        }

        res.status(500).json({
            error: '分析失败',
            message: error.message || '服务器内部错误'
        });
    }
});

// Base64图片分析接口（适用于相机拍照）
router.post('/analyze-base64', async (req, res) => {
    try {
        const { image, filename } = req.body;
        
        if (!image) {
            return res.status(400).json({
                error: '缺少图片数据',
                message: '请提供base64格式的图片数据'
            });
        }

        // 验证base64格式
        if (!image.startsWith('data:image/')) {
            return res.status(400).json({
                error: '无效的图片格式',
                message: '请提供有效的base64图片数据'
            });
        }

        console.log('开始分析base64图片数据');

        // 使用食物识别服务分析base64图片
        const analysisResult = await foodService.analyzeBase64Image(image);

        res.json({
            success: true,
            message: '食物分析完成',
            data: {
                ...analysisResult,
                timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('Base64分析错误:', error);
        res.status(500).json({
            error: '分析失败',
            message: error.message || '服务器内部错误'
        });
    }
});

// 获取营养信息
router.get('/nutrition/:foodName', async (req, res) => {
    try {
        const { foodName } = req.params;
        
        if (!foodName) {
            return res.status(400).json({
                error: '缺少食物名称',
                message: '请提供要查询的食物名称'
            });
        }

        const nutritionData = await foodService.getNutritionInfo(foodName);

        res.json({
            success: true,
            message: '营养信息查询成功',
            data: nutritionData
        });

    } catch (error) {
        console.error('营养信息查询错误:', error);
        res.status(500).json({
            error: '查询失败',
            message: error.message || '服务器内部错误'
        });
    }
});

// 获取食物历史记录
router.get('/history', (req, res) => {
    // TODO: 实现用户历史记录功能
    res.json({
        success: true,
        message: '历史记录功能开发中',
        data: []
    });
});

module.exports = router;
