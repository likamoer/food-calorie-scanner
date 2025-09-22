import styled, { keyframes } from 'styled-components';

// 主题颜色 - 现代渐变配色
export const theme = {
  primary: '#667eea',
  secondary: '#764ba2',
  accent: '#f093fb',
  success: '#4facfe',
  warning: '#f6d365',
  danger: '#ff6b6b',
  light: '#f8f9fa',
  dark: '#2c3e50',
  white: '#ffffff',
  gray: '#6c757d',
  lightGray: '#e9ecef',
  // 新增渐变色彩
  gradient1: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  gradient2: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  gradient3: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  gradient4: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  gradient5: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  // 深色模式色彩
  darkGradient: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
  darkCard: 'rgba(255, 255, 255, 0.1)',
  darkText: '#ecf0f1',
};

// 动画效果
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const slideInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const bounce = keyframes`
  0%, 20%, 53%, 80%, 100% {
    transform: translate3d(0,0,0);
  }
  40%, 43% {
    transform: translate3d(0, -8px, 0);
  }
  70% {
    transform: translate3d(0, -4px, 0);
  }
  90% {
    transform: translate3d(0, -2px, 0);
  }
`;

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
  20%, 40%, 60%, 80% { transform: translateX(2px); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 5px rgba(102, 126, 234, 0.5); }
  50% { box-shadow: 0 0 20px rgba(102, 126, 234, 0.8), 0 0 30px rgba(102, 126, 234, 0.6); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const rotateIn = keyframes`
  from {
    opacity: 0;
    transform: rotate(-180deg) scale(0.5);
  }
  to {
    opacity: 1;
    transform: rotate(0deg) scale(1);
  }
`;

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

// 容器组件
export const AppContainer = styled.div`
  min-height: 100vh;
  background: ${theme.gradient1};
  background-attachment: fixed;
  padding: 20px;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-x: hidden;

  /* 添加动态背景粒子效果 */
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.3) 0%, transparent 50%);
    animation: ${float} 20s ease-in-out infinite;
    pointer-events: none;
    z-index: 0;
  }

  /* 确保内容在背景之上 */
  > * {
    position: relative;
    z-index: 1;
  }
`;

export const MainContent = styled.main`
  max-width: 600px;
  margin: 0 auto;
  width: 100%;
  flex: 1;
  animation: ${fadeInUp} 0.8s ease;
`;

export const Card = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1), 
              0 0 0 1px rgba(255, 255, 255, 0.2);
  padding: 40px;
  margin-bottom: 20px;
  animation: ${scaleIn} 0.6s ease;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

  /* 添加光泽效果 */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
    animation: ${shimmer} 3s infinite;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15), 
                0 0 0 1px rgba(255, 255, 255, 0.3);
  }

  @media (max-width: 768px) {
    padding: 25px;
    margin: 10px;
    border-radius: 20px;
  }
`;

// 头部组件
export const Header = styled.header`
  text-align: center;
  color: ${theme.white};
  margin-bottom: 40px;
  animation: ${fadeInUp} 1s ease;

  h1 {
    font-size: 3rem;
    font-weight: 800;
    margin-bottom: 15px;
    background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 50%, #ffffff 100%);
    background-size: 200% 200%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    animation: ${glow} 3s ease-in-out infinite, ${shimmer} 4s ease-in-out infinite;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: -5px;
      left: 50%;
      transform: translateX(-50%);
      width: 60px;
      height: 3px;
      background: ${theme.gradient3};
      border-radius: 2px;
      animation: ${pulse} 2s ease-in-out infinite;
    }

    @media (max-width: 768px) {
      font-size: 2.2rem;
    }
  }

  p {
    font-size: 1.3rem;
    opacity: 0.95;
    font-weight: 400;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    animation: ${fadeInUp} 1.2s ease 0.3s both;

    @media (max-width: 768px) {
      font-size: 1.1rem;
    }
  }
`;

// 上传区域组件
export const UploadArea = styled.div<{ isDragActive?: boolean; hasImage?: boolean }>`
  border: 3px dashed ${props => props.isDragActive ? theme.primary : theme.lightGray};
  border-radius: 20px;
  padding: 50px 30px;
  text-align: center;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  background: ${props => props.isDragActive ? 
    `linear-gradient(135deg, ${theme.primary}15 0%, ${theme.accent}15 100%)` : 
    'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)'};
  position: relative;
  min-height: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  backdrop-filter: blur(10px);

  /* 添加动态边框效果 */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 20px;
    padding: 3px;
    background: ${props => props.isDragActive ? 
      `linear-gradient(45deg, ${theme.primary}, ${theme.accent}, ${theme.success})` : 
      'transparent'};
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: exclude;
    animation: ${props => props.isDragActive ? glow : 'none'} 1.5s ease-in-out infinite;
  }

  &:hover {
    border-color: ${theme.primary};
    background: linear-gradient(135deg, ${theme.primary}10 0%, ${theme.accent}10 100%);
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(102, 126, 234, 0.2);
  }

  .upload-icon {
    font-size: 4rem;
    color: ${props => props.isDragActive ? theme.primary : theme.gray};
    margin-bottom: 25px;
    animation: ${props => props.isDragActive ? bounce : float} 2s ease-in-out infinite;
    transition: all 0.3s ease;
  }

  .upload-text {
    font-size: 1.4rem;
    font-weight: 700;
    color: ${theme.dark};
    margin-bottom: 12px;
    transition: all 0.3s ease;
    background: ${props => props.isDragActive ? 
      `linear-gradient(135deg, ${theme.primary}, ${theme.accent})` : 
      'none'};
    -webkit-background-clip: ${props => props.isDragActive ? 'text' : 'initial'};
    -webkit-text-fill-color: ${props => props.isDragActive ? 'transparent' : 'initial'};
    background-clip: ${props => props.isDragActive ? 'text' : 'initial'};
  }

  .upload-hint {
    font-size: 1rem;
    color: ${theme.gray};
    font-weight: 500;
  }

  input[type="file"] {
    display: none;
  }

  /* 添加粒子效果 */
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100px;
    height: 100px;
    background: radial-gradient(circle, ${theme.primary}20 0%, transparent 70%);
    border-radius: 50%;
    transform: translate(-50%, -50%) scale(0);
    animation: ${props => props.isDragActive ? scaleIn : 'none'} 0.6s ease-out;
    pointer-events: none;
  }
`;

// 图片预览组件
export const ImagePreview = styled.div`
  position: relative;
  max-width: 100%;
  margin-bottom: 20px;

  img {
    width: 100%;
    max-height: 400px;
    object-fit: cover;
    border-radius: 12px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }

  .remove-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: ${theme.danger};
    color: white;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    transition: transform 0.2s ease;

    &:hover {
      transform: scale(1.1);
    }
  }
`;

// 按钮组件
export const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger'; size?: 'sm' | 'md' | 'lg' }>`
  background: ${props => {
    switch (props.variant) {
      case 'danger': return theme.gradient2;
      case 'secondary': return theme.gradient5;
      default: return theme.gradient1;
    }
  }};
  color: white;
  border: none;
  border-radius: 16px;
  padding: ${props => {
    switch (props.size) {
      case 'sm': return '12px 24px';
      case 'lg': return '20px 40px';
      default: return '16px 32px';
    }
  }};
  font-size: ${props => {
    switch (props.size) {
      case 'sm': return '1rem';
      case 'lg': return '1.3rem';
      default: return '1.1rem';
    }
  }};
  font-weight: 700;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  margin-bottom: 15px;
  position: relative;
  overflow: hidden;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);

  /* 添加光泽效果 */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.5s ease;
  }

  &:hover:not(:disabled) {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.25);
    animation: ${pulse} 0.6s ease;

    &::before {
      left: 100%;
    }
  }

  &:active:not(:disabled) {
    transform: translateY(-1px) scale(0.98);
    transition: all 0.1s ease;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }

  /* 添加加载状态动画 */
  &.loading {
    pointer-events: none;
    
    &::after {
      content: '';
      position: absolute;
      width: 20px;
      height: 20px;
      border: 2px solid transparent;
      border-top: 2px solid white;
      border-radius: 50%;
      animation: ${spin} 1s linear infinite;
    }
  }
`;

// 加载动画组件
export const LoadingSpinner = styled.div`
  width: 60px;
  height: 60px;
  border: 4px solid transparent;
  border-top: 4px solid ${theme.primary};
  border-right: 4px solid ${theme.accent};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin: 30px auto;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: -4px;
    left: -4px;
    right: -4px;
    bottom: -4px;
    border: 2px solid transparent;
    border-top: 2px solid ${theme.success};
    border-radius: 50%;
    animation: ${spin} 2s linear infinite reverse;
  }
`;

export const LoadingContainer = styled.div`
  text-align: center;
  padding: 50px 30px;
  animation: ${fadeIn} 0.6s ease;

  p {
    margin-top: 25px;
    font-size: 1.2rem;
    color: ${theme.gray};
    font-weight: 500;
    animation: ${pulse} 2s ease-in-out infinite;
  }
`;

// 结果显示组件
export const ResultsContainer = styled.div`
  animation: ${fadeIn} 0.8s ease;
`;

export const FoodInfo = styled.div`
  text-align: center;
  margin-bottom: 40px;
  animation: ${slideInLeft} 0.8s ease 0.2s both;

  .food-name {
    font-size: 2.5rem;
    font-weight: 800;
    background: ${theme.gradient1};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 20px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .calorie-display {
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: 15px;
    margin-bottom: 25px;
    padding: 20px;
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
    border-radius: 20px;
    border: 2px solid rgba(102, 126, 234, 0.2);

    .calorie-number {
      font-size: 4rem;
      font-weight: 900;
      background: ${theme.gradient3};
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      line-height: 1;
      animation: ${pulse} 2s ease-in-out infinite;
    }

    .calorie-unit {
      font-size: 1.4rem;
      color: ${theme.gray};
      font-weight: 600;
    }
  }
`;

export const NutritionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
  animation: ${fadeInUp} 0.8s ease 0.4s both;
`;

export const NutritionItem = styled.div`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 249, 250, 0.9) 100%);
  border-radius: 16px;
  padding: 20px;
  text-align: center;
  border: 1px solid rgba(102, 126, 234, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${theme.gradient4};
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);

    &::before {
      transform: scaleX(1);
    }
  }

  .nutrition-label {
    font-size: 1rem;
    color: ${theme.gray};
    margin-bottom: 8px;
    display: block;
    font-weight: 500;
  }

  .nutrition-value {
    font-size: 1.4rem;
    font-weight: 800;
    background: ${theme.gradient1};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

export const ConfidenceScore = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  padding: 20px;
  background: linear-gradient(135deg, rgba(79, 172, 254, 0.1) 0%, rgba(0, 242, 254, 0.1) 100%);
  border-radius: 16px;
  margin-bottom: 25px;
  border: 2px solid rgba(79, 172, 254, 0.2);
  animation: ${slideInRight} 0.8s ease 0.6s both;

  .confidence-label {
    font-size: 1.1rem;
    color: ${theme.gray};
    font-weight: 500;
  }

  .confidence-value {
    font-size: 1.4rem;
    font-weight: 800;
    background: ${theme.gradient3};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: ${pulse} 2s ease-in-out infinite;
  }
`;

// 错误消息组件
export const ErrorMessage = styled.div`
  background: ${theme.gradient2};
  color: white;
  padding: 20px;
  border-radius: 16px;
  margin-bottom: 25px;
  text-align: center;
  font-weight: 600;
  animation: ${shake} 0.5s ease, ${fadeIn} 0.3s ease;
  box-shadow: 0 8px 20px rgba(255, 107, 107, 0.3);
  border: 2px solid rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    animation: ${shimmer} 2s infinite;
  }
`;

// 页脚组件
export const Footer = styled.footer`
  text-align: center;
  color: white;
  margin-top: 50px;
  padding: 30px 20px;
  opacity: 0.9;
  animation: ${fadeInUp} 1s ease 0.8s both;

  p {
    font-size: 1rem;
    font-weight: 400;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
`;

// 响应式断点
export const breakpoints = {
  mobile: '768px',
  tablet: '1024px',
  desktop: '1200px',
};

// 移动端优化样式
export const MobileOptimizations = styled.div`
  @media (max-width: 768px) {
    /* 触摸优化 */
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    user-select: none;

    /* 防止iOS缩放 */
    input[type="text"],
    input[type="email"],
    input[type="password"],
    textarea {
      font-size: 16px;
    }

    /* 手势反馈 */
    .touchable {
      transition: transform 0.1s ease;
      
      &:active {
        transform: scale(0.95);
      }
    }

    /* 滚动优化 */
    .scroll-container {
      -webkit-overflow-scrolling: touch;
      overscroll-behavior: contain;
    }

    /* 安全区域适配 */
    .safe-area-top {
      padding-top: env(safe-area-inset-top);
    }

    .safe-area-bottom {
      padding-bottom: env(safe-area-inset-bottom);
    }

    .safe-area-left {
      padding-left: env(safe-area-inset-left);
    }

    .safe-area-right {
      padding-right: env(safe-area-inset-right);
    }
  }
`;

// 手势指示器
export const GestureIndicator = styled.div`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.8rem;
  z-index: 1000;
  animation: ${fadeIn} 0.5s ease, ${pulse} 2s ease-in-out infinite;
  pointer-events: none;

  @media (min-width: 769px) {
    display: none;
  }
`;
