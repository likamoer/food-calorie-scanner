const AuthService = require('../services/authService');
const UserService = require('../services/userService');
const { ERROR_CODES, ERROR_MESSAGES, STATUS_CODES } = require('../utils/index');


/**
 * JWT认证中间件
 * 验证请求头中的Token并注入用户信息
 */
const authMiddleware = async (req, res, next) => {
    try {
        // 从请求头获取Token
        const authHeader = req.headers.authorization;
        // 1、校验token是否存在
        if (!authHeader) {
            return res.status(STATUS_CODES.UNAUTHORIZED).json({
                code: ERROR_CODES.UNAUTHORIZED,
                message: ERROR_MESSAGES.UNAUTHORIZED,
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
        
        // 2、校验token对应的用户是否存在
        const userService = new UserService();
        const user = await userService.getUserById(decoded.id);
        
        if (!user) {
            return res.status(STATUS_CODES.UNAUTHORIZED).json({
                code: ERROR_CODES.USER_NOT_EXIST,
                message: ERROR_MESSAGES.USER_NOT_EXIST,
                data: null
            });
        }

        // 注入用户信息到请求对象
        req.user = decoded;
        req.token = token;

        next();
    } catch (error) {
        console.error('认证中间件错误:', error.code, error.message);
        
        // 根据错误类型返回不同的状态码
        let code = 401;
        let message = '认证失败';

        if (error.message.includes('过期')) {
            message = '登陆失效';
            code = 401;
        } else if (error.message.includes('无效')) {
            message = '无效的Token';
            code = 401;
        } else if (error.message.includes('未提供')) {
            message = '未提供认证Token';
            code = 401;
        }

        if (error?.code?.includes(ERROR_CODES.USER_NOT_EXIST)) {
            message = ERROR_MESSAGES.USER_NOT_EXIST;
            code = STATUS_CODES.UNAUTHORIZED;
        }

        return res.status(STATUS_CODES.UNAUTHORIZED).json({
            code,
            message,
            data: null
        });
    }
};

module.exports = authMiddleware;

