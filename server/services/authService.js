const jwt = require('jsonwebtoken');
const { getDatabase } = require('../database/db');
const UserService = require('./userService');

/**
 * 认证服务类
 * 处理用户认证和Token管理
 */
class AuthService {
    constructor() {
        this.db = getDatabase();
        this.userService = new UserService();
        this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
        this.jwtExpireTime = process.env.JWT_EXPIRE_TIME || '24h';
    }

    /**
     * 用户登录
     * @param {string} phoneNumber - 手机号
     * @param {string} password - 密码
     * @returns {Promise<Object>} 登录信息(Token和用户信息)
     */
    async login(phoneNumber, password) {
        // 查询用户
        const user = await this.userService.getUserByPhone(phoneNumber);
        if (!user) {
            throw new Error('手机号或密码错误');
        }

        // 验证密码
        const isPasswordValid = await this.userService.verifyPassword(password, user.password);
        if (!isPasswordValid) {
            throw new Error('手机号或密码错误');
        }

        // 生成Token
        const token = await this.generateToken(user.id);

        return {
            token,
            userId: user.id,
            username: user.username,
            expireTime: this.calculateExpireTime()
        };
    }

    /**
     * 生成JWT Token
     * @param {number} userId - 用户ID
     * @returns {Promise<string>} JWT Token
     */
    async generateToken(userId) {
        const payload = {
            userId,
            iat: Math.floor(Date.now() / 1000)
        };

        const token = jwt.sign(payload, this.jwtSecret, {
            expiresIn: this.jwtExpireTime
        });

        // 计算过期时间
        const expireTime = this.calculateExpireTime();

        // 存储Token到数据库
        const sql = `
            INSERT INTO tokens (userId, token, expireTime, createTime)
            VALUES (?, ?, ?, datetime('now'))
        `;
        await this.db.run(sql, [userId, token, expireTime]);

        return token;
    }

    /**
     * 验证Token
     * @param {string} token - JWT Token
     * @returns {Promise<Object>} Token中的payload信息
     */
    async verifyToken(token) {
        try {
            // 首先验证Token签名
            const decoded = jwt.verify(token, this.jwtSecret);

            // 检查Token是否在数据库中
            const sql = 'SELECT * FROM tokens WHERE token = ? AND expireTime > datetime("now")';
            const tokenRecord = await this.db.get(sql, [token]);

            if (!tokenRecord) {
                throw new Error('Token已过期或无效');
            }

            return decoded;
        } catch (error) {
            if (error.name === 'JsonWebTokenError') {
                throw new Error('无效的Token');
            }
            if (error.name === 'TokenExpiredError') {
                throw new Error('Token已过期');
            }
            throw error;
        }
    }

    /**
     * 刷新Token
     * @param {string} oldToken - 旧的Token
     * @returns {Promise<string>} 新的Token
     */
    async refreshToken(oldToken) {
        try {
            // 验证旧Token
            const decoded = await this.verifyToken(oldToken);

            // 生成新Token
            const newToken = await this.generateToken(decoded.userId);

            // 可选: 标记旧Token为已刷新
            // await this.revokeToken(oldToken);

            return newToken;
        } catch (error) {
            throw new Error(`Token刷新失败: ${error.message}`);
        }
    }

    /**
     * 撤销Token
     * @param {string} token - 要撤销的Token
     * @returns {Promise<void>}
     */
    async revokeToken(token) {
        const sql = 'DELETE FROM tokens WHERE token = ?';
        await this.db.run(sql, [token]);
    }

    /**
     * 清理过期的Token
     * @returns {Promise<number>} 删除的Token数量
     */
    async cleanExpiredTokens() {
        const sql = 'DELETE FROM tokens WHERE expireTime < datetime("now")';
        const result = await this.db.run(sql, []);
        return result.changes;
    }

    /**
     * 计算Token过期时间
     * @returns {string} 过期时间字符串
     */
    calculateExpireTime() {
        const now = new Date();
        let expireMs = 24 * 60 * 60 * 1000; // 默认24小时

        // 解析JWT过期时间配置
        if (this.jwtExpireTime.endsWith('h')) {
            const hours = parseInt(this.jwtExpireTime);
            expireMs = hours * 60 * 60 * 1000;
        } else if (this.jwtExpireTime.endsWith('d')) {
            const days = parseInt(this.jwtExpireTime);
            expireMs = days * 24 * 60 * 60 * 1000;
        }

        const expireDate = new Date(now.getTime() + expireMs);
        return expireDate.toISOString();
    }

    /**
     * 登出用户
     * @param {string} token - 要撤销的Token
     * @returns {Promise<void>}
     */
    async logout(token) {
        await this.revokeToken(token);
    }
}

module.exports = AuthService;

