import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

// 动画效果
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

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(255, 255, 255, 0.1); }
  50% { box-shadow: 0 0 40px rgba(255, 255, 255, 0.2), 0 0 60px rgba(255, 255, 255, 0.1); }
`;

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

// 主容器
const HomeContainer = styled.div`
  min-height: 100vh;
  min-height: calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom));
  background: linear-gradient(135deg, #000000 0%, #111111 50%, #000000 100%);
  background-attachment: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 20px;
  padding-top: calc(20px + env(safe-area-inset-top));
  padding-bottom: calc(20px + env(safe-area-inset-bottom));
  padding-left: calc(20px + env(safe-area-inset-left));
  padding-right: calc(20px + env(safe-area-inset-right));

  /* 动态背景粒子效果 */
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.03) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.02) 0%, transparent 50%);
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

// 毛玻璃卡片容器
const GlassCard = styled.div`
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(30px);
  border-radius: 32px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 60px 40px;
  text-align: center;
  max-width: 500px;
  width: 100%;
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.8),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  animation: ${fadeInUp} 1s ease, ${glow} 3s ease-in-out infinite;
  position: relative;
  overflow: hidden;

  /* 光泽效果 */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    animation: ${shimmer} 4s infinite;
  }

  @media (max-width: 768px) {
    padding: 40px 30px;
    margin: 20px;
    border-radius: 24px;
  }
`;

// 标题样式
const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: 900;
  background: linear-gradient(135deg, #ffffff 0%, #e0e0e0 50%, #ffffff 100%);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 20px;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  animation: ${pulse} 2s ease-in-out infinite;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 2px;
    animation: ${pulse} 2s ease-in-out infinite;
  }

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

// 副标题
const Subtitle = styled.p`
  font-size: 1.4rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 50px;
  font-weight: 400;
  line-height: 1.6;
  animation: ${fadeInUp} 1.2s ease 0.3s both;

  @media (max-width: 768px) {
    font-size: 1.2rem;
    margin-bottom: 40px;
  }
`;

// 悬浮按钮
const FloatingButton = styled.button`
  background: linear-gradient(135deg, #ffffff 0%, #cccccc 100%);
  color: #000000;
  border: none;
  border-radius: 25px;
  padding: 20px 50px;
  font-size: 1.3rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  position: relative;
  overflow: hidden;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 
    0 15px 35px rgba(255, 255, 255, 0.1),
    0 5px 15px rgba(0, 0, 0, 0.8);
  border: 2px solid rgba(255, 255, 255, 0.2);
  animation: ${float} 3s ease-in-out infinite;

  /* 光泽效果 */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.6s ease;
  }

  &:hover {
    transform: translateY(-8px) scale(1.05);
    box-shadow: 
      0 25px 50px rgba(255, 255, 255, 0.2),
      0 10px 25px rgba(0, 0, 0, 0.8);
    animation: ${pulse} 0.6s ease;

    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(-4px) scale(1.02);
    transition: all 0.1s ease;
  }

  .icon {
    font-size: 1.5rem;
    animation: ${float} 2s ease-in-out infinite;
  }

  @media (max-width: 768px) {
    padding: 18px 40px;
    font-size: 1.1rem;
    border-radius: 20px;
  }
`;

// 功能特性列表
const FeaturesList = styled.div`
  margin-top: 40px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  animation: ${fadeInUp} 1.4s ease 0.6s both;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    margin-top: 30px;
  }
`;

const FeatureItem = styled.div`
  background: rgba(255, 255, 255, 0.01);
  border-radius: 16px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.03);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    transform: translateY(-5px);
    border-color: rgba(255, 255, 255, 0.08);
  }

  .feature-icon {
    font-size: 2rem;
    margin-bottom: 10px;
    display: block;
  }

  .feature-text {
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.9rem;
    font-weight: 500;
  }
`;

// 页脚
const Footer = styled.footer`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
  animation: ${fadeInUp} 1.6s ease 0.8s both;

  @media (max-width: 768px) {
    bottom: 10px;
    font-size: 0.8rem;
  }
`;

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleStartScanning = () => {
    navigate('/scanner');
  };

  return (
    <HomeContainer>
      <GlassCard>
        <Title>🍎 智能卡路里扫描</Title>
        <Subtitle>
          上传食物照片，AI智能识别营养成分<br />
          精准计算卡路里，健康饮食从今天开始
        </Subtitle>
        
        <FloatingButton onClick={handleStartScanning}>
          <span className="icon">📸</span>
          开始扫描
        </FloatingButton>

        <FeaturesList>
          <FeatureItem>
            <span className="feature-icon">🤖</span>
            <div className="feature-text">AI智能识别</div>
          </FeatureItem>
          <FeatureItem>
            <span className="feature-icon">⚡</span>
            <div className="feature-text">快速分析</div>
          </FeatureItem>
          <FeatureItem>
            <span className="feature-icon">📊</span>
            <div className="feature-text">详细营养</div>
          </FeatureItem>
        </FeaturesList>
      </GlassCard>

      <Footer>
        &copy; 2024 智能卡路里扫描器 · 让健康更简单
      </Footer>
    </HomeContainer>
  );
};

export default HomePage;