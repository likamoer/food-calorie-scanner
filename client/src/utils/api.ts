import axios from 'axios';
import { Toast } from 'antd-mobile';
import { getCacheUserInfo, serverStatusToMessage } from './utils';

let baseUrl = window.location.origin;

// 创建axios实例
const apiClient = axios.create({
    baseURL: `${baseUrl}/api`,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getCacheUserInfo()?.token || ''}`
    },
    timeout: 5000 // 5秒超时
});

// 添加响应拦截器
apiClient.interceptors.response.use(
    // 响应成功的处理
    (response) => {
        return response;
    },
    // 响应错误的处理
    (error) => {
        if (error?.code === 'ERR_NETWORK') {
            Toast.show({
                icon: 'fail',
                content: '网络连接失败，请检查网络设置',
                duration: 2000
            });
        }
        Toast.show({
            icon: 'fail',
            content: error?.response?.data?.message || serverStatusToMessage(error?.response?.status),
            duration: 2000
        });
        // 可以在这里添加统一的网络错误处理逻辑
        return Promise.reject(error);
    }
);

// 注册接口
export const registryUserInfo = async function (params: {
    username: string,
    password: string,
    phone: string,
}) {
    const { username, password, phone } = params;
    
    try {
        const response = await apiClient.post('/users/create', {
            username,
            password,
            phoneNumber: phone,
        });
        
        const data = response.data;
        return data; // 返回处理后的数据供调用方使用
    } catch (error) {
        throw error; // 重新抛出错误，让调用方处理
    }
}

// 验证token是否过期
export const verifyToken = async function () {
    try {
        const response = await apiClient.post('/auth/verify');
        const data = response.data;
        return data; // 返回处理后的数据供调用方使用
    } catch (error) {
        return {
            // @ts-ignore
            message: error?.message || 'token验证失败',
            // @ts-ignore
            status: error?.response?.status,
            // @ts-ignore
            code: error?.code || 500
        }
    }
}

// 获取短信验证码
export const getSmsCode = async function (params: {
    phone: string,
}) {
    const { phone } = params;
    
    try {
        const response = await apiClient.post('/auth/send-code', {
            phoneNumber: phone,
        });
        const data = response.data;
        return data; // 返回处理后的数据供调用方使用
    } catch (error) {
        throw error; // 重新抛出错误，让调用方处理
    }
}

// 登陆接口
export const loginByUsername = async function (params: {
    phone: string,
    password: string,
}) {
    const { phone, password } = params;
    
    try {
        const response = await apiClient.post('/auth/loginByUsername', {
            phone,
            password,
        });
        const data = response.data;
        return data; // 返回处理后的数据供调用方使用
    } catch (error) {
        throw error; // 重新抛出错误，让调用方处理
    }
}

// 手机号验证码登录接口
export const loginByPhone = async function (params: {
    phone: string,
    verifyCode: string,
}) {
    const { phone, verifyCode } = params;
    
    try {
        const response = await apiClient.post('/auth/loginBySms', {
            phoneNumber: phone,
            verifyCode,
        });
        const data = response.data;
        return data; // 返回处理后的数据供调用方使用
    } catch (error) {
        throw error; // 重新抛出错误，让调用方处理
    }
}

// 更新用户在线状态
export const updateUserOnlineStatus = async function (params: {
    isOnline?: boolean,
}) {
    const { isOnline = false } = params;
    
    try {
        const response = await apiClient.put('/users/onlineStatus', params);
        const data = response.data;
        return data; // 返回处理后的数据供调用方使用
    } catch (error) {
        throw error; // 重新抛出错误，让调用方处理
    }
}
