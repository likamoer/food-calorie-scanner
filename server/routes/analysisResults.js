const express = require('express');
const AnalysisService = require('../services/analysisService');
const authMiddleware = require('../middleware/auth');
const { validateStoreAnalysisResult, validatePagination } = require('../middleware/validator');

const router = express.Router();
const analysisService = new AnalysisService();

/**
 * 存储分析结果接口
 * POST /api/analyzeResults/store
 */
router.post('/store', authMiddleware, validateStoreAnalysisResult, async (req, res) => {
    try {
        const { imageData, foodType, analyzeResult } = req.body;
        const userId = req.user.userId;

        const result = await analysisService.storeAnalysisResult(
            userId,
            imageData,
            foodType,
            analyzeResult
        );

        res.json({
            code: 200,
            message: '分析结果保存成功',
            data: {
                recordId: result.recordId,
                analyzeTime: result.analyzeTime
            }
        });
    } catch (error) {
        console.error('存储分析结果失败:', error);

        let code = 500;
        let message = '存储失败';

        if (error.message.includes('无效')) {
            code = 400;
            message = error.message;
        }

        res.status(code).json({
            code,
            message,
            data: null
        });
    }
});

/**
 * 历史分析结果记录列表
 * GET /api/analysisResults/history
 */
router.get('/history', authMiddleware, validatePagination, async (req, res) => {
    try {
        const { userId, page, pageSize } = req.parsedQuery;

        const result = await analysisService.getHistoryList(userId, page, pageSize);

        res.json({
            code: 200,
            message: 'success',
            data: result
        });
    } catch (error) {
        console.error('查询历史记录失败:', error);

        res.status(500).json({
            code: 500,
            message: '查询失败',
            data: null
        });
    }
});

module.exports = router;

