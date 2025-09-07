import styled, { keyframes } from 'styled-components';

// 主题颜色
export const theme = {
  primary: '#4A90E2',
  secondary: '#667eea',
  accent: '#ff6b6b',
  success: '#28a745',
  warning: '#ffc107',
  danger: '#dc3545',
  light: '#f8f9fa',
  dark: '#343a40',
  white: '#ffffff',
  gray: '#6c757d',
  lightGray: '#e9ecef',
};

// 动画
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

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

// 容器组件
export const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%);
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

export const MainContent = styled.main`
  max-width: 600px;
  margin: 0 auto;
  width: 100%;
  flex: 1;
`;

export const Card = styled.div`
  background: ${theme.white};
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 30px;
  margin-bottom: 20px;
  animation: ${fadeIn} 0.5s ease;

  @media (max-width: 768px) {
    padding: 20px;
    margin: 10px;
  }
`;

// 头部组件
export const Header = styled.header`
  text-align: center;
  color: ${theme.white};
  margin-bottom: 30px;

  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 10px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }

  p {
    font-size: 1.2rem;
    opacity: 0.9;
    font-weight: 300;

    @media (max-width: 768px) {
      font-size: 1rem;
    }
  }
`;

// 上传区域组件
export const UploadArea = styled.div<{ isDragActive?: boolean; hasImage?: boolean }>`
  border: 3px dashed ${props => props.isDragActive ? theme.primary : theme.lightGray};
  border-radius: 12px;
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.isDragActive ? `${theme.primary}10` : 'transparent'};
  position: relative;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &:hover {
    border-color: ${theme.primary};
    background: ${theme.primary}05;
  }

  .upload-icon {
    font-size: 3rem;
    color: ${theme.gray};
    margin-bottom: 20px;
  }

  .upload-text {
    font-size: 1.2rem;
    font-weight: 600;
    color: ${theme.dark};
    margin-bottom: 8px;
  }

  .upload-hint {
    font-size: 0.9rem;
    color: ${theme.gray};
  }

  input[type="file"] {
    display: none;
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
      case 'danger': return theme.danger;
      case 'secondary': return theme.gray;
      default: return theme.primary;
    }
  }};
  color: white;
  border: none;
  border-radius: 8px;
  padding: ${props => {
    switch (props.size) {
      case 'sm': return '8px 16px';
      case 'lg': return '16px 32px';
      default: return '12px 24px';
    }
  }};
  font-size: ${props => {
    switch (props.size) {
      case 'sm': return '0.9rem';
      case 'lg': return '1.2rem';
      default: return '1rem';
    }
  }};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  margin-bottom: 10px;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    animation: ${pulse} 0.3s ease;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  &:active {
    transform: translateY(0);
  }
`;

// 加载动画组件
export const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid ${theme.lightGray};
  border-top: 4px solid ${theme.primary};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin: 20px auto;
`;

export const LoadingContainer = styled.div`
  text-align: center;
  padding: 40px 20px;

  p {
    margin-top: 20px;
    font-size: 1.1rem;
    color: ${theme.gray};
  }
`;

// 结果显示组件
export const ResultsContainer = styled.div`
  animation: ${fadeIn} 0.5s ease;
`;

export const FoodInfo = styled.div`
  text-align: center;
  margin-bottom: 30px;

  .food-name {
    font-size: 2rem;
    font-weight: 700;
    color: ${theme.dark};
    margin-bottom: 15px;
  }

  .calorie-display {
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: 10px;
    margin-bottom: 20px;

    .calorie-number {
      font-size: 3.5rem;
      font-weight: 800;
      color: ${theme.primary};
      line-height: 1;
    }

    .calorie-unit {
      font-size: 1.2rem;
      color: ${theme.gray};
      font-weight: 500;
    }
  }
`;

export const NutritionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
`;

export const NutritionItem = styled.div`
  background: ${theme.light};
  border-radius: 8px;
  padding: 15px;
  text-align: center;

  .nutrition-label {
    font-size: 0.9rem;
    color: ${theme.gray};
    margin-bottom: 5px;
    display: block;
  }

  .nutrition-value {
    font-size: 1.2rem;
    font-weight: 700;
    color: ${theme.dark};
  }
`;

export const ConfidenceScore = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 15px;
  background: ${theme.light};
  border-radius: 8px;
  margin-bottom: 20px;

  .confidence-label {
    font-size: 1rem;
    color: ${theme.gray};
  }

  .confidence-value {
    font-size: 1.2rem;
    font-weight: 700;
    color: ${theme.success};
  }
`;

// 错误消息组件
export const ErrorMessage = styled.div`
  background: ${theme.danger};
  color: white;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
  font-weight: 500;
  animation: ${fadeIn} 0.3s ease;
`;

// 页脚组件
export const Footer = styled.footer`
  text-align: center;
  color: white;
  margin-top: 40px;
  padding: 20px;
  opacity: 0.8;

  p {
    font-size: 0.9rem;
  }
`;

// 响应式断点
export const breakpoints = {
  mobile: '768px',
  tablet: '1024px',
  desktop: '1200px',
};
