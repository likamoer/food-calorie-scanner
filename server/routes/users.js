const express = require('express');
const UserService = require('../services/userService');
const AuthService = require('../services/authService');
const { validateCreateUser } = require('../middleware/validator');
const authMiddleware = require('../middleware/auth');
const { getDatabase } = require('../database/db');

const router = express.Router();
const userService = new UserService();
const authService = new AuthService();

/**
 * 创建用户接口
 * POST /api/users/create
 */
router.post('/create', validateCreateUser, async (req, res) => {
    try {
        const { username, phoneNumber, password } = req.body;

        const user = await userService.createUser(username, phoneNumber, password);

        // 为新创建的用户生成token
        const token = await authService.generateToken(user.id);
        const expireTime = authService.calculateExpireTime();

        // 构建完整的用户认证信息返回给前端
        const userAuthInfo = {
            ...user,
            token,
            expireTime
        };

        res.json({
            code: 200,
            message: '用户创建成功',
            data: userAuthInfo
        });
    } catch (error) {
        console.error('创建用户失败:', error);

        // 判断错误类型
        let code = 500;
        let message = '用户创建失败';

        if (error.message.includes('手机号已存在')) {
            code = 400;
            message = '手机号已存在';
        } else if (error.message.includes('用户名已存在')) {
            code = 400;
            message = '用户名已存在';
        } else if (error.message.includes('长度')) {
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
 * 查询用户接口
 * GET /api/users/:id
 * 需要认证token
 */
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const userId = parseInt(req.params.id);

        if (isNaN(userId) || userId <= 0) {
            return res.status(400).json({
                code: 400,
                message: '无效的用户ID',
                data: null
            });
        }

        const user = await userService.getUserById(userId);

        res.json({
            code: 200,
            message: 'success',
            data: {
                id: user.id,
                username: user.username,
                phoneNumber: user.phoneNumber,
                scanCount: user.scanCount,
                createTime: user.createTime,
                updateTime: user.updateTime
            }
        });
    } catch (error) {
        console.error('查询用户失败:', error);

        let code = 500;
        let message = '查询失败';

        if (error.message.includes('不存在')) {
            code = 404;
            message = '用户不存在';
        }

        res.status(code).json({
            code,
            message,
            data: null
        });
    }
});

/**
 * 更新用户在线状态接口
 * PUT /api/users/onlineStatus
 * 需要认证token
 * 如果前端不传递在线状态，则默认将在线状态置为下线
 */
router.put('/onlineStatus', authMiddleware, async (req, res) => {
    try {
        // 从认证中间件注入的用户信息中获取用户ID
        const userId = req.user.userId;
        // 从请求体获取在线状态，如果未提供则默认为false（下线）
        const { isOnline = false } = req.body;
        
        // 确保isOnline是布尔值
        const onlineStatus = Boolean(isOnline);
        
        // 将布尔值转换为数字状态码 (0: 离线, 1: 在线)
        const statusCode = onlineStatus ? 1 : 0;
        await userService.updateOnlineStatus(userId, statusCode);
        
        res.json({
            code: 200,
            message: '用户在线状态更新成功',
            data: {
                userId,
                isOnline: onlineStatus,
                updateTime: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('更新用户在线状态失败:', error);
        
        res.status(500).json({
            code: 500,
            message: '更新用户在线状态失败',
            data: null
        });
    }
});

module.exports = router;