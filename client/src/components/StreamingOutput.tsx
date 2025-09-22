import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

interface StreamingOutputProps {
  text: string;
}

// 打字机效果动画
const typewriter = keyframes`
  from { width: 0; }
  to { width: 100%; }
`;

const blink = keyframes`
  0%, 50% { border-color: transparent; }
  51%, 100% { border-color: #667eea; }
`;

// 流式输出容器
const StreamingContainer = styled.div`
  margin-top: 20px;
  padding: 25px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  border: 2px solid rgba(102, 126, 234, 0.2);
  border-radius: 16px;
  color: #2c3e50;
  font-size: 1rem;
  line-height: 1.7;
  white-space: pre-wrap;
  position: relative;
  overflow: hidden;
  animation: fadeIn 0.6s ease;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #667eea, #764ba2, #f093fb);
    background-size: 200% 100%;
    animation: shimmer 3s ease-in-out infinite;
  }
`;

const StreamingHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 15px;
  font-weight: 700;
  color: #667eea;
  font-size: 1.1rem;

  .icon {
    font-size: 1.3rem;
    animation: pulse 2s ease-in-out infinite;
  }

  .title {
    position: relative;
    overflow: hidden;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background: linear-gradient(90deg, #667eea, #764ba2);
      animation: typewriter 2s ease-in-out;
    }
  }
`;

const StreamingContent = styled.div`
  position: relative;
  min-height: 60px;

  .typing-cursor {
    display: inline-block;
    width: 2px;
    height: 1.2em;
    background: #667eea;
    margin-left: 2px;
    animation: ${blink} 1s infinite;
  }
`;

const ProgressBar = styled.div<{ progress: number }>`
  width: 100%;
  height: 4px;
  background: rgba(102, 126, 234, 0.2);
  border-radius: 2px;
  margin-top: 15px;
  overflow: hidden;

  &::after {
    content: '';
    display: block;
    width: ${props => props.progress}%;
    height: 100%;
    background: linear-gradient(90deg, #667eea, #764ba2);
    border-radius: 2px;
    transition: width 0.3s ease;
    animation: shimmer 2s ease-in-out infinite;
  }
`;

const StreamingOutput: React.FC<StreamingOutputProps> = ({ text }) => {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!text) {
      setDisplayText('');
      setIsTyping(false);
      return;
    }

    setIsTyping(true);
    let currentIndex = 0;
    const typingSpeed = 30; // 毫秒

    const typeInterval = setInterval(() => {
      if (currentIndex <= text.length) {
        setDisplayText(text.slice(0, currentIndex));
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typeInterval);
      }
    }, typingSpeed);

    return () => clearInterval(typeInterval);
  }, [text]);

  if (!text) return null;

  const progress = text.length > 0 ? Math.min((displayText.length / text.length) * 100, 100) : 0;

  return (
    <StreamingContainer>
      <StreamingHeader>
        <span className="icon">🤖</span>
        <span className="title">AI 实时分析过程</span>
      </StreamingHeader>
      
      <StreamingContent>
        {displayText}
        {isTyping && <span className="typing-cursor" />}
      </StreamingContent>

      <ProgressBar progress={progress} />
    </StreamingContainer>
  );
};

export default StreamingOutput;
