const bcrypt = require('bcryptjs');
const { getDatabase } = require('../database/db');
const { createError } = require('../utils/index');

// node写服务真的太难受了，一不小心就回调地狱

/**
 * 用户服务类
 * 处理用户相关的业务逻辑
 */
class UserService {
    constructor() {
        this.db = getDatabase();
    }

    /**
     * 创建用户
     * @param {string} username - 用户名(2-20位字符)
     * @param {string} phoneNumber - 手机号(11位数字)
     * @param {string} password - 密码(6-20位字符)
     * @returns {Promise<Object>} 创建的用户信息
     */
    async createUser(username, phoneNumber, password) {
        // 参数校验
        this.validateUserInput(username, phoneNumber, password);

        // 检查手机号是否已存在
        const existingUser = await this.getUserByPhone(phoneNumber);
        if (existingUser) {
            throw createError('PHONE_EXIST', '手机号已存在');
        }

        // 检查用户名是否已存在
        const existingUserByUsername = await this.getUserByUsername(username);
        if (existingUserByUsername) {
            throw createError('USERNAME_EXIST', '用户名已存在');
        }

        // 加密密码
        const hashedPassword = await bcrypt.hash(password, 10);

        // 插入用户
        const sql = `
            INSERT INTO users (username, phoneNumber, password, scanCount, createTime, updateTime, onlineStatus)
            VALUES (?, ?, ?, 10, datetime('now'), datetime('now'), 1)
        `;

        try {
            const result = await this.db.run(sql, [username, phoneNumber, hashedPassword]);
            const user = await this.getUserById(result.lastID);

            return {
                id: user.id,
                username: user.username,
                phoneNumber: user.phoneNumber,
                createTime: user.createTime
            };
        } catch (error) {
            if (error.message.includes('UNIQUE constraint failed')) {
                throw createError('PHONE_EXIST', '手机号已存在');
            }
            throw createError('CREATE_USER_FAILED', `创建用户失败: ${error.message}`);
        }
    }

    /**
     * 根据ID查询用户
     * @param {number} id - 用户ID
     * @returns {Promise<Object>} 用户信息
     */
    async getUserById(id) {
        if (!id || typeof id !== 'number' || id <= 0) {
            throw createError('INVALID_USER_ID', '无效的用户ID');
        }

        const sql = 'SELECT * FROM users WHERE id = ?';
        const user = await this.db.get(sql, [id]);

        if (!user) {
            throw createError('USER_NOT_FOUND', '用户不存在');
        }

        return user;
    }

    /**
     * 根据手机号查询用户
     * @param {string} phoneNumber - 手机号
     * @returns {Promise<Object|null>} 用户信息
     */
    async getUserByPhone(phoneNumber) {
        if (!phoneNumber || typeof phoneNumber !== 'string' || phoneNumber.length !== 11) {
            throw createError('INVALID_PHONE', '无效的手机号');
        }

        const sql = 'SELECT * FROM users WHERE phoneNumber = ?';
        return await this.db.get(sql, [phoneNumber]);
    }

    /**
     * 根据用户名查询用户
     * @param {string} username - 用户名
     * @returns {Promise<Object|null>} 用户信息
     */
    async getUserByUsername(username) {
        if (!username || typeof username !== 'string' || username.trim().length === 0) {
            throw createError('INVALID_USERNAME', '无效的用户名');
        }

        const sql = 'SELECT * FROM users WHERE username = ?';
        return await this.db.get(sql, [username]);
    }

    /**
     * 更新用户的扫描次数
     * @param {number} userId - 用户ID
     * @param {number} count - 增加的次数(可以为负数)
     * @returns {Promise<Object>} 更新后的用户信息
     */
    async updateScanCount(userId, count) {
        if (!userId || typeof userId !== 'number' || userId <= 0) {
            throw createError('INVALID_USER_ID', '无效的用户ID');
        }

        if (typeof count !== 'number') {
            throw createError('INVALID_SCAN_COUNT', '无效的扫描次数');
        }

        // 使用事务确保数据一致性
        return await this.db.transaction(async (db) => {
            // 获取当前扫描次数
            const user = await db.get('SELECT scanCount FROM users WHERE id = ?', [userId]);
            if (!user) {
                throw createError('USER_NOT_FOUND', '用户不存在');
            }

            const newScanCount = user.scanCount + count;
            if (newScanCount < 0) {
                throw createError('INSUFFICIENT_SCAN_COUNT', '扫描次数不足');
            }

            // 更新扫描次数
            const updateSql = `
                UPDATE users 
                SET scanCount = ?, updateTime = datetime('now')
                WHERE id = ?
            `;
            await db.run(updateSql, [newScanCount, userId]);

            // 返回更新后的用户信息
            return await this.getUserById(userId);
        });
    }

    /**
     * 校验用户输入参数
     * @param {string} username - 用户名
     * @param {string} phoneNumber - 手机号
     * @param {string} password - 密码
     */
    validateUserInput(username, phoneNumber, password) {
        // 校验用户名
        if (!username || typeof username !== 'string' || username.trim().length === 0) {
            throw createError('EMPTY_USERNAME', '用户名不能为空');
        }
        if (username.length < 2 || username.length > 20) {
            throw createError('INVALID_USERNAME_LENGTH', '用户名长度为2-20位字符');
        }

        // 校验手机号
        if (!phoneNumber || typeof phoneNumber !== 'string') {
            throw createError('EMPTY_PHONE', '手机号不能为空');
        }
        if (phoneNumber.length !== 11 || !/^\d{11}$/.test(phoneNumber)) {
            throw createError('INVALID_PHONE_FORMAT', '手机号必须为11位数字');
        }

        // 校验密码
        if (!password || typeof password !== 'string') {
            throw createError('EMPTY_PASSWORD', '密码不能为空');
        }
        if (password.length < 6 || password.length > 20) {
            throw createError('INVALID_PASSWORD_LENGTH', '密码长度为6-20位字符');
        }
    }

    /**
     * 验证密码
     * @param {string} plainPassword - 明文密码
     * @param {string} hashedPassword - 加密后的密码
     * @returns {Promise<boolean>} 密码是否匹配
     */
    async verifyPassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    /**
     * 更新用户在线状态
     * @param {number} userId - 用户ID
     * @param {number} status - 在线状态 (0: 离线, 1: 在线)
     * @returns {Promise<void>}
     */
    async updateOnlineStatus(userId, status) {
        const sql = `
            UPDATE users 
            SET onlineStatus = ?, updateTime = datetime('now') 
            WHERE id = ?
        `;
        
        try {
            await this.db.run(sql, [status, userId]);
        } catch (error) {
            throw createError('UPDATE_STATUS_FAILED', `错误码: ${error.code} ; 更新在线状态失败: ${error.message}`);
        }
    }

    /**
     * 验证手机号存在性和在线状态
     * @param {string} phoneNumber - 手机号
     * @returns {Promise<Object>} 验证结果，包含用户信息和验证状态
     */
    async validatePhoneAndOnlineStatus(phoneNumber) {
        // 验证手机号格式
        if (!phoneNumber || typeof phoneNumber !== 'string' || phoneNumber.length !== 11) {
            throw createError('INVALID_PHONE', '无效的手机号');
        }

        // 查询用户
        const user = await this.getUserByPhone(phoneNumber);
        if (!user) {
            return { exists: false, online: false, user: null };
        }

        // 检查在线状态
        const isOnline = user.onlineStatus === 1;
        
        return { exists: true, online: isOnline, user: user };
    }
}

module.exports = UserService;

