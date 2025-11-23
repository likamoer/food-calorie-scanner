import { useNavigate } from 'react-router';
import store from '../store';

// 统一的页面跳转方法
export function useJump() {
    const navigate = useNavigate();
    return (route: any) => navigate(route);
}

// 调用相机拍照功能
export function useCamera() {
    return (params: any) => {
        // @ts-ignore
        if (window.cameraBridge) {
            // @ts-ignore
            return window.cameraBridge?.postMessage(params);
        }
        return false;
    };
}

// 缓存get
export function getCacheUserInfo() {
    if (store.getState().userInfo?.token?.length > 0) {
        return store.getState().userInfo;
    }
    try {
        const value = localStorage.getItem('userInfo');
        if (value === null) return null;
        
        // 尝试解析JSON格式的值
        try {
            return JSON.parse(value);
        } catch {
            // 如果不是JSON，则直接返回字符串值
            return value;
        }
    } catch (error) {
        console.error('从localStorage读取失败:', error);
        return null;
    }
}

// 缓存set
export function setCacheUserInfo(value: any) {
    // 1. 将token存储到Redux中
    store.dispatch({
        type: 'userInfo/setUserInfo',
        payload: value
    });
    
    // 2. 将所有key-value存储到localStorage中
    try {
        // 确保value可以被序列化
        const serializedValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
        localStorage.setItem('userInfo', serializedValue);
    } catch (error) {
        console.error('存储到localStorage失败:', error);
    }
}

// 后端返回的状态码
export function serverStatusToMessage(status: number) {
    switch (status) {
        case 400:
            return '请求出错，请稍后重试';
        case 401:
            return '未授权，请重新登录';
        case 403:
            return '拒绝访问';
        case 404:
            return '请求资源不存在';
        case 500:
            return '服务器内部错误，请稍后重试';
        default:
            return '未知错误';
    }
}
