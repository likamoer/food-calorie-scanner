import { useNavigate } from 'react-router';

// 统一的页面跳转方法
export function useJump() {
    const navigate = useNavigate();
    return (route: any) => navigate(route);
}

// 缓存get


// 缓存set
