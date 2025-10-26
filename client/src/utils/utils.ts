import { useNavigate } from 'react-router';

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
            alert('进入桥能力');
            // @ts-ignore
            return window.cameraBridge?.postMessage(params);
        }
        alert('当前环境不支持调用相机拍照');
    };
}

// 缓存get


// 缓存set
