const AuthService = require('../services/authService');

/**
 * JWT认证中间件
 * 验证请求头中的Token并注入用户信息
 */
const authMiddleware = async (req, res, next) => {
    try {
        // 从请求头获取Token
        const authHeader = req.headers.authorization;
        console.log('authHeader', authHeader);
        
        if (!authHeader) {
            return res.status(401).json({
                code: 401,
                message: '未提供认证Token',
                data: null
            });
        }

        // 提取Token (Bearer {token})
        const token = authHeader.startsWith('Bearer ') 
            ? authHeader.slice(7) 
            : authHeader;

        // 验证Token
        const authService = new AuthService();
        const decoded = await authService.verifyToken(token);

        // 注入用户信息到请求对象
        req.user = decoded;
        req.token = token;

        next();
    } catch (error) {
        console.error('认证中间件错误:', error);
        
        // 根据错误类型返回不同的状态码
        let code = 401;
        let message = '认证失败';

        if (error.message.includes('过期')) {
            message = 'Token已过期';
            code = 401;
        } else if (error.message.includes('无效')) {
            message = '无效的Token';
            code = 401;
        } else if (error.message.includes('未提供')) {
            message = '未提供认证Token';
            code = 401;
        }

        return res.status(code).json({
            code,
            message,
            data: null
        });
    }
};

module.exports = authMiddleware;

