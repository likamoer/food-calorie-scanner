const express = require('express');
const AuthService = require('../services/authService');
const { validateLogin } = require('../middleware/validator');

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

module.exports = router;

