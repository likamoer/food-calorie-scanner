/**
 * 参数校验中间件
 * 校验用户名、手机号、密码等通用参数
 */

/**
 * 校验用户创建参数
 */
const validateCreateUser = (req, res, next) => {
    const { username, phoneNumber, password } = req.body;
    console.log('校验用户创建参数:', req.body);

    // 校验用户名
    if (!username || typeof username !== 'string' || username.trim().length === 0) {
        return res.status(400).json({
            code: 400,
            message: '用户名不能为空',
            data: null
        });
    }

    if (username.length < 2 || username.length > 20) {
        return res.status(400).json({
            code: 400,
            message: '用户名长度为2-20位字符',
            data: null
        });
    }

    // 校验手机号
    if (!phoneNumber || typeof phoneNumber !== 'string') {
        return res.status(400).json({
            code: 400,
            message: '手机号不能为空',
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

    // 校验密码
    if (!password || typeof password !== 'string') {
        return res.status(400).json({
            code: 400,
            message: '密码不能为空',
            data: null
        });
    }

    if (password.length < 6 || password.length > 20) {
        return res.status(400).json({
            code: 400,
            message: '密码长度为6-20位字符',
            data: null
        });
    }

    next();
};

/**
 * 校验登录参数
 */
const validateLogin = (req, res, next) => {
    const { phoneNumber, password } = req.body;

    // 校验手机号
    if (!phoneNumber || typeof phoneNumber !== 'string') {
        return res.status(400).json({
            code: 400,
            message: '手机号不能为空',
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

    // 校验密码
    if (!password || typeof password !== 'string') {
        return res.status(400).json({
            code: 400,
            message: '密码不能为空',
            data: null
        });
    }

    next();
};

/**
 * 校验购买扫描次数参数
 */
const validateBuyScanFrequency = (req, res, next) => {
    const { frequency, paymentMethod } = req.body;
    const userId = req.user?.userId || req.body.userId;

    // 校验用户ID
    if (!userId || typeof userId !== 'number' || userId <= 0) {
        return res.status(400).json({
            code: 400,
            message: '无效的用户ID',
            data: null
        });
    }

    // 校验购买次数
    if (!frequency || typeof frequency !== 'number' || frequency <= 0) {
        return res.status(400).json({
            code: 400,
            message: '购买次数必须大于0',
            data: null
        });
    }

    // 校验支付方式
    if (!paymentMethod || !['alipay', 'wechat'].includes(paymentMethod)) {
        return res.status(400).json({
            code: 400,
            message: '支付方式必须为alipay或wechat',
            data: null
        });
    }

    next();
};

/**
 * 校验分析结果存储参数
 */
const validateStoreAnalysisResult = (req, res, next) => {
    const { imageData, foodType, analyzeResult } = req.body;
    const userId = req.user?.userId || req.body.userId;

    // 校验用户ID
    if (!userId || typeof userId !== 'number' || userId <= 0) {
        return res.status(400).json({
            code: 400,
            message: '无效的用户ID',
            data: null
        });
    }

    // 校验图片数据
    if (!imageData || typeof imageData !== 'string') {
        return res.status(400).json({
            code: 400,
            message: '图片数据不能为空',
            data: null
        });
    }

    if (!imageData.startsWith('data:image/')) {
        return res.status(400).json({
            code: 400,
            message: '无效的图片格式',
            data: null
        });
    }

    // 校验分析结果
    if (!analyzeResult || typeof analyzeResult !== 'object') {
        return res.status(400).json({
            code: 400,
            message: '分析结果不能为空',
            data: null
        });
    }

    next();
};

/**
 * 校验分页参数
 */
const validatePagination = (req, res, next) => {
    const { page = 1, pageSize = 10 } = req.query;
    const userId = req.user?.userId || req.query.userId;

    // 校验用户ID
    if (!userId) {
        return res.status(400).json({
            code: 400,
            message: '无效的用户ID',
            data: null
        });
    }

    // 校验页码
    const pageNum = parseInt(page);
    if (isNaN(pageNum) || pageNum < 1) {
        return res.status(400).json({
            code: 400,
            message: '无效的页码',
            data: null
        });
    }

    // 校验每页大小
    const size = parseInt(pageSize);
    if (isNaN(size) || size < 1 || size > 100) {
        return res.status(400).json({
            code: 400,
            message: '每页大小必须在1-100之间',
            data: null
        });
    }

    req.parsedQuery = {
        userId: parseInt(userId),
        page: pageNum,
        pageSize: size
    };

    next();
};

module.exports = {
    validateCreateUser,
    validateLogin,
    validateBuyScanFrequency,
    validateStoreAnalysisResult,
    validatePagination
};

