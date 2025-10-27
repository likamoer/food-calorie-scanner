const { getDatabase } = require('../database/db');
const UserService = require('./userService');

/**
 * 支付服务类
 * 处理订单创建、支付和回调
 */
class PaymentService {
    constructor() {
        this.db = getDatabase();
        this.userService = new UserService();
        this.paymentMode = process.env.PAYMENT_MODE || 'mock';
    }

    /**
     * 创建订单
     * @param {number} userId - 用户ID
     * @param {number} frequency - 购买次数
     * @param {string} paymentMethod - 支付方式(alipay/wechat)
     * @returns {Promise<Object>} 订单信息
     */
    async createOrder(userId, frequency, paymentMethod) {
        if (!userId || typeof userId !== 'number' || userId <= 0) {
            throw new Error('无效的用户ID');
        }

        if (!frequency || typeof frequency !== 'number' || frequency <= 0) {
            throw new Error('购买次数必须大于0');
        }

        if (!paymentMethod || !['alipay', 'wechat'].includes(paymentMethod)) {
            throw new Error('无效的支付方式');
        }

        // 检查用户是否存在
        await this.userService.getUserById(userId);

        // 生成订单号
        const orderId = this.generateOrderId();

        // 计算总金额(每次0.99元)
        const pricePerFrequency = 0.99;
        const totalAmount = frequency * pricePerFrequency;

        // 插入订单
        const sql = `
            INSERT INTO orders (orderId, userId, frequency, totalAmount, paymentMethod, orderStatus, createTime, updateTime)
            VALUES (?, ?, ?, ?, ?, 'pending', datetime('now'), datetime('now'))
        `;

        const result = await this.db.run(sql, [orderId, userId, frequency, totalAmount, paymentMethod]);

        return {
            orderId,
            totalAmount,
            frequency,
            paymentMethod,
            orderStatus: 'pending',
            id: result.lastID
        };
    }

    /**
     * Mock支付
     * @param {string} orderId - 订单ID
     * @returns {Promise<Object>} 支付结果
     */
    async mockPay(orderId) {
        if (!orderId) {
            throw new Error('订单ID不能为空');
        }

        // 查询订单
        const order = await this.getOrderByOrderId(orderId);
        if (!order) {
            throw new Error('订单不存在');
        }

        if (order.orderStatus !== 'pending') {
            throw new Error('订单状态不正确');
        }

        // Mock支付: 直接标记为已支付
        await this.updateOrderStatus(orderId, 'paid');

        // 增加用户的扫描次数
        await this.userService.updateScanCount(order.userId, order.frequency);

        return {
            success: true,
            message: '支付成功',
            orderId,
            totalAmount: order.totalAmount,
            frequency: order.frequency
        };
    }

    /**
     * 支付宝真实支付集成(预留接口)
     * @param {string} orderId - 订单ID
     * @returns {Promise<Object>} 支付链接
     */
    async alipayIntegration(orderId) {
        // TODO: 集成支付宝SDK
        // 1. 查询订单信息
        // 2. 调用支付宝统一下单接口
        // 3. 返回支付链接或支付二维码
        throw new Error('支付宝支付功能暂未实现');
    }

    /**
     * 微信支付真实支付集成(预留接口)
     * @param {string} orderId - 订单ID
     * @returns {Promise<Object>} 支付信息
     */
    async wechatPayIntegration(orderId) {
        // TODO: 集成微信支付SDK
        // 1. 查询订单信息
        // 2. 调用微信统一下单接口
        // 3. 返回支付链接或支付二维码
        throw new Error('微信支付功能暂未实现');
    }

    /**
     * 更新订单状态
     * @param {string} orderId - 订单ID
     * @param {string} status - 订单状态(pending/paid/cancelled)
     * @returns {Promise<void>}
     */
    async updateOrderStatus(orderId, status) {
        if (!['pending', 'paid', 'cancelled'].includes(status)) {
            throw new Error('无效的订单状态');
        }

        const sql = `
            UPDATE orders 
            SET orderStatus = ?, updateTime = datetime('now')
            WHERE orderId = ?
        `;

        const result = await this.db.run(sql, [status, orderId]);
        if (result.changes === 0) {
            throw new Error('订单不存在或状态未更新');
        }
    }

    /**
     * 处理支付回调
     * @param {Object} callbackData - 回调数据
     * @returns {Promise<Object>} 处理结果
     */
    async handlePaymentCallback(callbackData) {
        const { orderId, status, ...otherData } = callbackData;

        if (!orderId || !status) {
            throw new Error('缺少必要的回调参数');
        }

        if (!['paid', 'cancelled'].includes(status)) {
            throw new Error('无效的回调状态');
        }

        // 更新订单状态
        await this.updateOrderStatus(orderId, status);

        // 如果是支付成功，增加扫描次数
        if (status === 'paid') {
            const order = await this.getOrderByOrderId(orderId);
            if (order) {
                await this.userService.updateScanCount(order.userId, order.frequency);
            }
        }

        return {
            success: true,
            message: '支付回调处理成功',
            orderId,
            status
        };
    }

    /**
     * 根据订单ID查询订单
     * @param {string} orderId - 订单ID
     * @returns {Promise<Object>} 订单信息
     */
    async getOrderByOrderId(orderId) {
        const sql = 'SELECT * FROM orders WHERE orderId = ?';
        return await this.db.get(sql, [orderId]);
    }

    /**
     * 获取用户的所有订单
     * @param {number} userId - 用户ID
     * @param {number} page - 页码
     * @param {number} pageSize - 每页大小
     * @returns {Promise<Object>} 订单列表
     */
    async getUserOrders(userId, page = 1, pageSize = 10) {
        if (!userId || typeof userId !== 'number' || userId <= 0) {
            throw new Error('无效的用户ID');
        }

        const offset = (page - 1) * pageSize;

        // 查询总数
        const countSql = 'SELECT COUNT(*) as total FROM orders WHERE userId = ?';
        const countResult = await this.db.get(countSql, [userId]);
        const total = countResult.total;

        // 查询订单列表
        const listSql = `
            SELECT * FROM orders 
            WHERE userId = ?
            ORDER BY createTime DESC
            LIMIT ? OFFSET ?
        `;
        const orders = await this.db.all(listSql, [userId, pageSize, offset]);

        return {
            total,
            page,
            pageSize,
            list: orders
        };
    }

    /**
     * 生成订单ID
     * @returns {string} 订单ID
     */
    generateOrderId() {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substr(2, 9);
        return `ORDER_${timestamp}_${random}`;
    }
}

module.exports = PaymentService;

