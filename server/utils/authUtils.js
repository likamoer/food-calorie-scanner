// 认证相关的工具函数

/**
 * 处理Token验证的主函数
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} authMiddleware - 认证中间件
 */
function handleTokenVerification(req, res, authMiddleware) {
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

module.exports = {
    handleTokenVerification,
    handleVerificationSuccess,
    transformResponseFormat,
    determineErrorType
};
