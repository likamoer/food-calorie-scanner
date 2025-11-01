const express = require('express');
const PaymentService = require('../services/paymentService');
const authMiddleware = require('../middleware/auth');
const { validateBuyScanFrequency } = require('../middleware/validator');

const router = express.Router();
const paymentService = new PaymentService();

/**
 * 购买扫描次数接口
 * POST /api/buy/scanFrequency
 */
router.post('/scanFrequency', authMiddleware, validateBuyScanFrequency, async (req, res) => {
    try {
        const { frequency, paymentMethod } = req.body;
        const userId = req.user.userId;

        // 创建订单
        const order = await paymentService.createOrder(userId, frequency, paymentMethod);

        // 根据支付模式处理支付
        let paymentResult;
        if (paymentService.paymentMode === 'mock') {
            // Mock支付
            paymentResult = await paymentService.mockPay(order.orderId);
            
            res.json({
                code: 200,
                message: '订单创建成功',
                data: {
                    orderId: order.orderId,
                    totalAmount: order.totalAmount,
                    frequency: order.frequency,
                    paymentUrl: null, // Mock支付不需要支付链接
                    orderStatus: paymentResult.success ? 'paid' : 'pending'
                }
            });
        } else {
            // 真实支付
            let paymentUrl = null;
            if (paymentMethod === 'alipay') {
                paymentUrl = await paymentService.alipayIntegration(order.orderId);
            } else if (paymentMethod === 'wechat') {
                paymentUrl = await paymentService.wechatPayIntegration(order.orderId);
            }

            res.json({
                code: 200,
                message: '订单创建成功',
                data: {
                    orderId: order.orderId,
                    totalAmount: order.totalAmount,
                    frequency: order.frequency,
                    paymentUrl,
                    orderStatus: 'pending'
                }
            });
        }

    } catch (error) {
        console.error('购买失败:', error);

        let code = 500;
        let message = '购买失败';

        if (error.message.includes('无效')) {
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
 * 支付回调接口
 * POST /api/buy/callback
 */
router.post('/callback', async (req, res) => {
    try {
        const callbackData = req.body;

        const result = await paymentService.handlePaymentCallback(callbackData);

        res.json({
            code: 200,
            message: '支付回调处理成功',
            data: result
        });
    } catch (error) {
        console.error('支付回调失败:', error);

        res.status(500).json({
            code: 500,
            message: error.message || '支付回调处理失败',
            data: null
        });
    }
});

module.exports = router;

