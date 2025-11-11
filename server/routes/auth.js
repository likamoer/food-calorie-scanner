const express = require('express');
const AuthService = require('../services/authService');
const { validateLogin } = require('../middleware/validator');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
const authService = new AuthService();

/**
 * 用户登录接口
 * POST /api/auth/login
 */
router.post('/login', validateLogin, async (req, res) => {
    try {
        const { phoneNumber, password } = req.body;

        const result = await authService.login(phoneNumber, password);

        res.json({
            code: 200,
            message: '登录成功',
            data: result
        });
    } catch (error) {
        console.error('登录失败:', error);

        let code = 401;
        let message = '登录失败';

        if (error.message.includes('手机号或密码错误')) {
            message = '手机号或密码错误';
        }

        res.status(code).json({
            code,
            message,
            data: null
        });
    }
});

/**
 * 验证Token接口
 * GET /api/auth/verify
 * 复用认证中间件逻辑，提供token有效性检查
 */
router.post('/verify', handleTokenVerification);

/**
 * 处理Token验证的主函数
 */
function handleTokenVerification(req, res) {
    // 保存原始的res.json方法，用于后续恢复
    const originalResJson = res.json;
    
    // 重写res.json方法，转换错误响应格式
    res.json = transformResponseFormat(originalResJson);
    
    // 调用认证中间件进行token验证，并提供成功处理函数
    authMiddleware(req, res, handleVerificationSuccess(req, res, originalResJson));
}

/**
 * 创建成功处理函数
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} originalResJson - 原始的res.json方法
 * @returns {Function} 成功处理函数
 */
function handleVerificationSuccess(req, res, originalResJson) {
    return function() {
        // 恢复原始的res.json方法
        res.json = originalResJson;
        
        // 返回token有效信息
        res.json({
            code: 200,
            message: 'Token有效',
            data: {
                valid: true,
                userId: req.user?.userId || null,
                timestamp: new Date().toISOString()
            }
        });
    };
}

/**
 * 创建响应格式转换函数
 * @param {Function} originalResJson - 原始的res.json方法
 * @returns {Function} 转换后的res.json方法
 */
function transformResponseFormat(originalResJson) {
    return function(data) {
        // 检查是否是错误响应
        if (data.code && data.code >= 400) {
            // 转换认证中间件的错误响应为token验证格式
            return originalResJson.call(this, {
                code: data.code,
                message: data.message,
                data: {
                    valid: false,
                    errorType: determineErrorType(data.message),
                    timestamp: new Date().toISOString()
                }
            });
        }
        // 正常响应直接传递
        return originalResJson.call(this, data);
    };
}

/**
 * 确定错误类型
 * @param {string} message - 错误消息
 * @returns {string} 错误类型
 */
function determineErrorType(message) {
    return message.includes('过期') ? 'expired' : 'invalid';
}

module.exports = router;

