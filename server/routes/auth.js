const express = require('express');
const AuthService = require('../services/authService');
const { validateLogin } = require('../middleware/validator');
const authMiddleware = require('../middleware/auth');
const { handleTokenVerification } = require('../utils/authUtils');

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
 * POST /api/auth/verify
 * 复用认证中间件逻辑，提供token有效性检查
 */
router.post('/verify', (req, res) => handleTokenVerification(req, res, authMiddleware));

/**
 * 发送验证码接口
 * POST /api/auth/send-code
 */
router.post('/send-code', async (req, res) => {
    try {
        const { phoneNumber } = req.body;

        // 验证手机号参数
        if (!phoneNumber || typeof phoneNumber !== 'string') {
            return res.status(400).json({
                code: 400,
                message: '手机号参数错误',
                data: null
            });
        }
        
        // 使用正则表达式验证中国大陆手机号格式
        // 格式：以1开头，第二位为3-9，后面跟着9位数字
        const phoneRegex = /^1[3-9]\d{9}$/;
        if (!phoneRegex.test(phoneNumber)) {
            return res.status(400).json({
                code: 400,
                message: '无效的手机号格式，请输入正确的中国大陆手机号',
                data: null
            });
        }

        // 调用服务层发送验证码
        const result = await authService.requestVerificationCode(phoneNumber);

        res.json({
            code: 200,
            message: result.message,
            data: {
                // 注意：生产环境不应返回验证码
                code: result.code, // 仅用于开发测试
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('发送验证码失败:', error);

        let code = 400;
        let message = error.message || '发送验证码失败';

        // 根据错误信息设置不同的状态码
        if (message.includes('不存在') || message.includes('修改/注册')) {
            code = 404;
        } else if (message.includes('登陆异常')) {
            code = 401;
        }

        res.status(code).json({
            code,
            message,
            data: null
        });
    }
});

/**
 * 用户登录接口（用户名+密码）
 * POST /api/auth/loginByUsername
 */
router.post('/loginByUsername', async (req, res) => {
    try {
        const { phone, password } = req.body;
        
        // 验证请求参数
        if (!phone || !password) {
            return res.status(400).json({
                code: 400,
                message: '手机号和密码不能为空',
                data: null
            });
        }

        // 调用登录服务
        const result = await authService.loginByUsername(phone, password);
        
        res.json({
            code: 200,
            message: '登录成功',
            data: result
        });
    } catch (error) {
        console.error('登录失败:', error);
        
        let code = 401;
        let message = error.message || '登录失败';
        
        res.status(code).json({
            code,
            message,
            data: null
        });
    }
});

/**
 * 手机号验证码登录接口
 * POST /api/auth/loginBySms
 */
router.post('/loginBySms', async (req, res) => {
    try {
        const { phoneNumber, verifyCode } = req.body;
        
        // 验证请求参数
        if (!phoneNumber || !verifyCode) {
            return res.status(400).json({
                code: 400,
                message: '手机号和验证码不能为空',
                data: null
            });
        }
        
        // 验证手机号类型
        if (typeof phoneNumber !== 'string') {
            return res.status(400).json({
                code: 400,
                message: '手机号参数类型错误',
                data: null
            });
        }
        
        // 验证验证码类型
        if (typeof verifyCode !== 'string') {
            return res.status(400).json({
                code: 400,
                message: '验证码参数类型错误',
                data: null
            });
        }
        
        // 使用正则表达式验证中国大陆手机号格式
        const phoneRegex = /^1[3-9]\d{9}$/;
        if (!phoneRegex.test(phoneNumber)) {
            return res.status(400).json({
                code: 400,
                message: '无效的手机号格式，请输入正确的中国大陆手机号',
                data: null
            });
        }
        
        // 验证验证码格式（6位数字）
        const codeRegex = /^\d{4}$/;
        if (!codeRegex.test(verifyCode)) {
            return res.status(400).json({
                code: 400,
                message: '验证码格式错误，请输入4位数字验证码',
                data: null
            });
        }

        // 调用登录服务
        const result = await authService.loginBySms(phoneNumber, verifyCode);
        
        res.json({
            code: 200,
            message: '登录成功',
            data: result
        });
    } catch (error) {
        console.error('登录失败:', error);
        
        let code = 401;
        let message = error.message || '登录失败';
        
        res.status(code).json({
            code,
            message,
            data: null
        });
    }
});

module.exports = router;

