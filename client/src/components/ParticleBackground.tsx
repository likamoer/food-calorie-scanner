import React, { useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

// 粒子动画
const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-20px) rotate(120deg); }
  66% { transform: translateY(10px) rotate(240deg); }
`;

const drift = keyframes`
  0% { transform: translateX(0px) translateY(0px); }
  25% { transform: translateX(20px) translateY(-10px); }
  50% { transform: translateX(-10px) translateY(20px); }
  75% { transform: translateX(-20px) translateY(-5px); }
  100% { transform: translateX(0px) translateY(0px); }
`;

const twinkle = keyframes`
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
`;

// 粒子背景容器
const ParticleContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
`;

// 粒子样式
const Particle = styled.div<{ 
  size: number; 
  delay: number; 
  duration: number;
  x: number;
  y: number;
  color: string;
}>`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background: ${props => props.color};
  border-radius: 50%;
  left: ${props => props.x}%;
  top: ${props => props.y}%;
  animation: ${float} ${props => props.duration}s ease-in-out infinite,
             ${drift} ${props => props.duration * 1.5}s ease-in-out infinite,
             ${twinkle} ${props => props.duration * 0.8}s ease-in-out infinite;
  animation-delay: ${props => props.delay}s;
  opacity: 0.6;
  filter: blur(0.5px);
`;

interface ParticleBackgroundProps {
  particleCount?: number;
}

const ParticleBackground: React.FC<ParticleBackgroundProps> = ({ 
  particleCount = 50 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // 清理现有粒子
    containerRef.current.innerHTML = '';

    // 创建粒子
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      
      // 随机属性
      const size = Math.random() * 4 + 1; // 1-5px
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const delay = Math.random() * 5;
      const duration = Math.random() * 10 + 5; // 5-15秒
      
      // 随机颜色
      const colors = [
        'rgba(102, 126, 234, 0.3)',
        'rgba(118, 75, 162, 0.3)',
        'rgba(240, 147, 251, 0.3)',
        'rgba(79, 172, 254, 0.3)',
        'rgba(67, 233, 123, 0.3)',
        'rgba(250, 112, 154, 0.3)'
      ];
      const color = colors[Math.floor(Math.random() * colors.length)];

      // 设置样式
      particle.style.position = 'absolute';
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.background = color;
      particle.style.borderRadius = '50%';
      particle.style.left = `${x}%`;
      particle.style.top = `${y}%`;
      particle.style.animation = `float ${duration}s ease-in-out infinite, drift ${duration * 1.5}s ease-in-out infinite, twinkle ${duration * 0.8}s ease-in-out infinite`;
      particle.style.animationDelay = `${delay}s`;
      particle.style.opacity = '0.6';
      particle.style.filter = 'blur(0.5px)';
      particle.style.pointerEvents = 'none';

      containerRef.current.appendChild(particle);
    }
  }, [particleCount]);

  return <ParticleContainer ref={containerRef} />;
};

export default ParticleBackground;
