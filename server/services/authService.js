const jwt = require('jsonwebtoken');
const Dypnsapi20170525 = require('@alicloud/dypnsapi20170525');
const OpenApi = require('@alicloud/openapi-client');
const Util = require('@alicloud/tea-util');
const Credential = require('@alicloud/credentials');
const Tea = require('@alicloud/tea-typescript');
const { getDatabase } = require('../database/db');
const UserService = require('./userService');
const { createError } = require('../utils/index');
const { phoneVerifyCodeAccessKeyId, phoneVerifyCodeAccessKeySecret } = require('../utils/secret');

/**
 * 认证服务类
 * 处理用户认证和Token管理
 * 过期时间的值要统一
 */
class AuthService {
    constructor() {
        this.db = getDatabase();
        this.userService = new UserService();
        this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
        this.jwtExpireTime = '24h';
    }

    /**
     * 手机号验证码登录
     * @param {string} phoneNumber - 手机号
     * @param {string} verifyCode - 验证码
     * @returns {Promise<Object>} 登录信息(Token和用户信息)
     */
    async loginBySms(phoneNumber, verifyCode) {

        // 验证手机号
        const user = await this.userService.getUserByPhone(phoneNumber);
        if (!user) {
            throw new Error('手机号不存在');
        }

        // 验证验证码
        console.log('verifyCode-39:', verifyCode, phoneNumber);
        const isValid = await this.verifyVerificationCode(phoneNumber, verifyCode);
        if (!isValid) {
            throw new Error('验证码错误或已过期');
        }

        // 设置用户在线状态为在线
        await this.userService.updateOnlineStatus(user.id, 1);

        // 生成Token
        const token = await this.generateToken(user.id);

        return {
            token,
            userId: user.id,
            expireTime: this.calculateExpireTime()
        };
    }

    /**
     * 验证验证码
     * @param {string} phoneNumber - 手机号
     * @param {string} verifyCode - 验证码
     * @returns {Promise<boolean>} 验证结果
     */
    async verifyVerificationCode(phoneNumber, verifyCode) {
        const sql = `
            SELECT * FROM verification_codes 
            WHERE phoneNumber = ? AND code = ? AND isUsed = 0 AND expireTime > datetime('now')
            ORDER BY createTime DESC LIMIT 1
        `;
        
        try {
            const codeRecord = await this.db.get(sql, [phoneNumber, verifyCode]);
            
            if (!codeRecord) {
                return false;
            }
            
            // 标记验证码为已使用
            const updateSql = `
                UPDATE verification_codes SET isUsed = 1 WHERE id = ?
            `;
            await this.db.run(updateSql, [codeRecord.id]);
            
            return true;
        } catch (error) {
            console.error('验证验证码失败:', error);
            return false;
        }
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

        // 设置用户在线状态为在线
        await this.userService.updateOnlineStatus(user.id, 1);

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
     * 通过手机号登录
     * @param {string} phone - 手机号
     * @param {string} password - 密码
     * @returns {Promise<Object>} 登录信息(Token和用户信息)
     */
    async loginByUsername(phone, password) {
        // 查询用户
        const user = await this.userService.getUserByPhone(phone);
        if (!user) {
            throw createError('USER_NOT_EXIST', '当前用户不存在');
        }

        // 验证密码
        const isPasswordValid = await this.userService.verifyPassword(password, user.password);
        if (!isPasswordValid) {
            throw new Error('手机号或密码错误');
        }

        // 设置用户在线状态为在线
        await this.userService.updateOnlineStatus(user.id, 1);

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
     * @param {string} token - 要验证的Token
     * @param {boolean} checkDb - 是否检查数据库中的Token记录，默认为true
     * @returns {Promise<Object>} 解码后的Token信息
     */
    async verifyToken(token, checkDb = true) {

        // 验证Token格式
        if (!token || typeof token !== 'string') {
            throw new Error('无效的Token');
        }

        // 检查Token是否在数据库中存在且未过期
        if (checkDb) {
            const tokenInDb = await this.getToken(token);
            if (!tokenInDb) {
                throw createError('USER_NOT_EXIST', '当前用户不存在');
            }

            // 检查Token是否已过期
            const now = new Date();
            const expireTime = new Date(tokenInDb.expireTime);
            if (now > expireTime) {
                // 如果已过期，从数据库中移除
                await this.revokeToken(token);
                throw new Error('登陆过期, 请重新登陆');
            }
        }

        let decoded;
        try {
            // 验证Token签名和有效期
            decoded = jwt.verify(token, this.jwtSecret);
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new Error('登陆过期, 请重新登陆');
            }
            throw new Error('无效的Token');
        }

        return decoded;
    }

    /**
     * 刷新Token
     * @param {string} oldToken - 旧的Token
     * @returns {Promise<string>} 新的Token
     */
    /**
     * 从数据库获取Token记录
     * @param {string} token - Token字符串
     * @returns {Promise<Object|null>} Token记录或null
     */
    async getToken(token) {
        const sql = 'SELECT * FROM tokens WHERE token = ?';
        try {
            const result = await this.db.get(sql, [token]);
            return result;
        } catch (error) {
            console.error('获取Token失败:', error);
            console.error('错误详情:', error.message, error.stack);
            return null;
        }
    }

    async refreshToken(oldToken) {
        try {
            // 验证旧Token
            const decoded = await this.verifyToken(oldToken);

            // 撤销旧Token
            await this.revokeToken(oldToken);
            
            // 生成新Token
            const newToken = await this.generateToken(decoded.userId);

            return {
                token: newToken,
                expireTime: this.calculateExpireTime()
            };
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
        let expireMs = 0;

        // 确保this.jwtExpireTime存在且有效
        if (!this.jwtExpireTime) {
            // 如果未配置，使用默认24小时
            expireMs = 24 * 60 * 60 * 1000;
        } else {
            const timeStr = this.jwtExpireTime.toString();
            
            // 解析JWT过期时间配置（仅支持h小时、d天、min分钟三种单位）
            const hourMatch = timeStr.match(/^(\d+(?:\.\d+)?)(h)$/);
            const dayMatch = timeStr.match(/^(\d+(?:\.\d+)?)(d)$/);
            const minuteMatch = timeStr.match(/^(\d+(?:\.\d+)?)(min)$/);
            
            // 如果是纯数字，默认为小时单位
            if (!hourMatch && !dayMatch && !minuteMatch) {
                const numericValue = parseFloat(timeStr);
                if (!isNaN(numericValue)) {
                    expireMs = numericValue * 60 * 60 * 1000; // 默认为小时
                } else {
                    // 格式错误，使用默认24小时
                    expireMs = 24 * 60 * 60 * 1000;
                }
            } else if (hourMatch) {
                // 解析小时格式
                expireMs = parseFloat(hourMatch[1]) * 60 * 60 * 1000;
            } else if (dayMatch) {
                // 解析天格式
                expireMs = parseFloat(dayMatch[1]) * 24 * 60 * 60 * 1000;
            } else if (minuteMatch) {
                // 解析分钟格式
                expireMs = parseFloat(minuteMatch[1]) * 60 * 1000;
            }
        }
        
        // 确保过期时间有效
        if (expireMs <= 0) {
            expireMs = 24 * 60 * 60 * 1000; // 确保至少有24小时有效期
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
        try {
            // 验证Token获取用户ID
            const decoded = await this.verifyToken(token, false);
            
            // 设置用户在线状态为离线
            await this.userService.updateOnlineStatus(decoded.userId, 0);
            
            // 撤销Token
            await this.revokeToken(token);
            
            return { message: '登出成功' };
        } catch (error) {
            throw new Error(`登出失败: ${error.message}`);
        }
    }

    static createClient() {
        let config = new OpenApi.Config({
            accessKeyId: phoneVerifyCodeAccessKeyId,
            // 您的 AccessKey Secret
            accessKeySecret: phoneVerifyCodeAccessKeySecret,
        });
        config.endpoint = `dypnsapi.aliyuncs.com`;
        return new Dypnsapi20170525.default(config);
    }

    /**
     * 生成随机验证码
     * @param {number} length - 验证码长度，默认6位
     * @returns {string} 随机验证码
     */
    async generateVerificationCode(phoneNumber) {
        let client = AuthService.createClient();
        let sendSmsVerifyCodeRequest = new Dypnsapi20170525.SendSmsVerifyCodeRequest({
            signName: '速通互联验证码',
            templateCode: '100001',
            phoneNumber,
            templateParam: '{"code":"##code##","min":"1"}',
            returnVerifyCode: true,
            validTime: 60
        });
        let runtime = new Util.RuntimeOptions({ });
        let result = {};
        try {
            result = await client.sendSmsVerifyCodeWithOptions(sendSmsVerifyCodeRequest, runtime);
            return result?.body?.model?.verifyCode || '';
        } catch (error) {
            console.log('发送验证码失败:', error);
            throw new Error(`发送验证码失败: ${error.message}`);
        }
    }

    /**
     * 检查手机号今日发送验证码次数
     * @param {string} phoneNumber - 手机号
     * @param {number} maxCount - 最大允许次数，默认5次
     * @returns {Promise<{canSend: boolean, count: number}>} 检查结果
     */
    async checkDailySendCount(phoneNumber, maxCount = 5) {
        const today = new Date().toISOString().split('T')[0];
        const sql = `
            SELECT COUNT(*) as count 
            FROM verification_codes 
            WHERE phoneNumber = ? AND date(createTime) = ?
        `;
        
        try {
            const result = await this.db.get(sql, [phoneNumber, today]);
            const count = parseInt(result.count) || 0;
            return { canSend: count < maxCount, count };
        } catch (error) {
            console.error('检查发送次数失败:', error);
            throw new Error('系统异常，请稍后重试');
        }
    }

    /**
     * 保存验证码到数据库
     * @param {string} phoneNumber - 手机号
     * @param {string} code - 验证码
     * @param {number} expireMinutes - 过期时间（分钟），默认5分钟
     * @returns {Promise<Object>} 保存的验证码记录
     * @TODO： 如何减少时间损耗？即前端倒计时的准确率能准确一点
     */
    async saveVerificationCode(phoneNumber, code, expireMinutes = 1) {
        // 计算过期时间
        const now = new Date();
        const expireTime = new Date(now.getTime() + expireMinutes * 60000).toISOString();
        const createTime = now.toISOString();
        
        const sql = `
            INSERT INTO verification_codes (phoneNumber, code, expireTime, createTime, isUsed, requestCount)
            VALUES (?, ?, ?, ?, 0, 1)
        `;
        
        try {
            const result = await this.db.run(sql, [phoneNumber, code, expireTime, createTime]);
            return { id: result.lastID, phoneNumber, code, expireTime, createTime };
        } catch (error) {
            console.error('保存验证码失败:', error);
            throw new Error('保存验证码失败');
        }
    }

    /**
     * 获取验证码并发送
     * @param {string} phoneNumber - 手机号
     * @returns {Promise<Object>} 操作结果
     */
    async requestVerificationCode(phoneNumber) {
        // 验证手机号和在线状态
        const validationResult = await this.userService.validatePhoneAndOnlineStatus(phoneNumber);
        
        // 检查手机号是否存在
        if (!validationResult.exists) {
            throw new Error('当前手机号不存在，请登陆/注册');
        }
        
        // 检查在线状态
        if (!validationResult.online) {
            throw new Error('登陆异常');
        }
        
        // 检查每日调用次数限制
        const dailyCountResult = await this.checkDailySendCount(phoneNumber);
        if (!dailyCountResult.canSend && phoneNumber !== '18500949050') {
            throw new Error('今日手机号登陆次数已用完，请换个方式登陆');
        }
        
        // 生成验证码
        const code = await this.generateVerificationCode(phoneNumber);
        
        // 保存验证码
        const savedCode = await this.saveVerificationCode(phoneNumber, code);
        
        return { 
            success: true, 
            message: '验证码发送成功',
            // 注意：生产环境不应返回验证码
            code: 200 // 仅用于开发测试
        };
    }
}

module.exports = AuthService;

