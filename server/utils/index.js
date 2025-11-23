// 协议接口status集合
const STATUS_CODES = {
    SUCCESS: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500
};

// 业务异常码code集合
const ERROR_CODES = {
    USER_NOT_EXIST: 'USER_NOT_EXIST',
    TOKEN_EXPIRED: 'TOKEN_EXPIRED',
    INVALID_TOKEN: 'INVALID_TOKEN',
    UNAUTHORIZED: 'UNAUTHORIZED',
    INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
    PHONE_EXIST: 'PHONE_EXIST',
    USERNAME_EXIST: 'USERNAME_EXIST'
};

// 异常message集合
const ERROR_MESSAGES = {
    UNAUTHORIZED: '未提供认证Token',
    USER_NOT_EXIST: '用户不存在',
    TOKEN_EXPIRED: '登陆失效',
    INVALID_TOKEN: '无效的Token',
    PHONE_EXIST: '手机号已存在',
    USERNAME_EXIST: '用户名已存在'
};

// 创建错误对象
const createError = (code, message) => {
    const error = new Error(message);
    error.code = code;
    return error;
};


module.exports = {
    STATUS_CODES,
    ERROR_CODES,
    ERROR_MESSAGES,
    createError
};