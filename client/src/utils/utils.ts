import { useNavigate } from 'react-router';

export function useJump() {
    const navigate = useNavigate();
    return (route: string) => navigate(route);
}
