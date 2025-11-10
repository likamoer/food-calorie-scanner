import axios from 'axios';
import { Toast } from 'antd-mobile';

let baseUrl = window.location.origin

// if (baseUrl.includes('localhost')) {
//     baseUrl = 'http://154.8.136.162:3001'
// }

// 创建axios实例
const apiClient = axios.create({
    baseURL: `${baseUrl}/api`,
    headers: {
        'Content-Type': 'application/json'
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
        if (error?.response?.status === 400) {
            Toast.show({
                icon: 'fail',
                content: error?.response?.data?.message || '请求出错，请稍后重试',
                duration: 2000
            });
        }
        // 可以在这里添加统一的网络错误处理逻辑
        return Promise.reject(error);
    }
);

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