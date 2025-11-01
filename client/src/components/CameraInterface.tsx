import React, { useState, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';

// 动画效果
const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const focusAnimation = keyframes`
  0% { opacity: 0; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.1); }
  100% { opacity: 0; transform: scale(1.2); }
`;

// 相机界面容器
const CameraContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #E8F5E8 0%, #FFFFFF 100%);
  backdrop-filter: blur(20px);
  display: flex;
  flex-direction: column;
  z-index: 1000;
  overflow: hidden;
  
  /* iPhone 安全区域适配 */
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
  
  /* 防止iOS缩放 */
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
`;

const DynamicIsland = styled.div`
  position: absolute;
  top: calc(env(safe-area-inset-top) + 20px);
  left: 50%;
  transform: translateX(-50%);
  width: 126px;
  height: 37px;
  background: #000000;
  border-radius: 19px;
  z-index: 20;
`;

// 相机控制区域
const CameraControls = styled.div`
  position: absolute;
  top: calc(env(safe-area-inset-top) + 80px);
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  z-index: 10;
`;

const ControlButton = styled.button<{ variant?: 'back' | 'flash' }>`
  width: 44px;
  height: 44px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    background: rgba(255, 255, 255, 0.9);
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: scale(0.95);
  }
`;

// 取景框区域
const Viewfinder = styled.div`
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 20px;
  border-radius: 20px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.3);
`;

const FocusFrame = styled.div<{ isActive: boolean }>`
  position: absolute;
  width: 200px;
  height: 200px;
  pointer-events: none;
  
  /* 左上角L形 */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 30px;
    height: 30px;
    border-top: 3px solid ${props => props.isActive ? '#4CAF50' : 'rgba(255, 255, 255, 0.8)'};
    border-left: 3px solid ${props => props.isActive ? '#4CAF50' : 'rgba(255, 255, 255, 0.8)'};
    animation: ${props => props.isActive ? focusAnimation : 'none'} 1s ease-out;
  }
  
  /* 右上角L形 */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 30px;
    height: 30px;
    border-top: 3px solid ${props => props.isActive ? '#4CAF50' : 'rgba(255, 255, 255, 0.8)'};
    border-right: 3px solid ${props => props.isActive ? '#4CAF50' : 'rgba(255, 255, 255, 0.8)'};
    animation: ${props => props.isActive ? focusAnimation : 'none'} 1s ease-out;
  }
`;

const CameraImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 20px;
`;

const PlaceholderContent = styled.div`
  text-align: center;
  color: rgba(0, 0, 0, 0.6);
  
  .camera-icon {
    font-size: 80px;
    margin-bottom: 20px;
    animation: ${pulse} 2s ease-in-out infinite;
  }
  
  .placeholder-text {
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 10px;
    color: #333;
  }
  
  .placeholder-hint {
    font-size: 14px;
    opacity: 0.7;
    color: #666;
  }
`;

// 底部控制面板
const BottomControls = styled.div`
  position: absolute;
  bottom: env(safe-area-inset-bottom);
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
`;

const ZoomSlider = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #333;
  
  .zoom-line {
    width: 200px;
    height: 2px;
    background: rgba(0, 0, 0, 0.2);
    position: relative;
    border-radius: 1px;
  }
  
  .zoom-indicator {
    position: absolute;
    top: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 4px;
    height: 18px;
    background: #4CAF50;
    border-radius: 2px;
  }
  
  .zoom-label {
    font-size: 14px;
    font-weight: 600;
    min-width: 30px;
    text-align: center;
    color: #666;
  }
`;

const ControlButtons = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
`;

const GalleryButton = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(0, 0, 0, 0.1);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const ShutterButton = styled.button`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%);
  border: 3px solid rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: 0 8px 20px rgba(76, 175, 80, 0.3);
  
  &::before {
    content: '';
    width: 60px;
    height: 60px;
    border-radius: 30px;
    background: rgba(255, 255, 255, 0.2);
    border: 2px solid rgba(255, 255, 255, 0.4);
  }
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 12px 30px rgba(76, 175, 80, 0.4);
  }
  
  &:active {
    transform: scale(0.95);
    box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
  }
`;

const SwitchCameraButton = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background: rgba(255, 255, 255, 0.9);
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

interface CameraInterfaceProps {
  imageUrl?: string;
  onCapture: () => void;
  onGallery: () => void;
  onSwitchCamera: () => void;
  onBack: () => void;
  onFlashToggle: () => void;
  isFlashOn: boolean;
}

const CameraInterface: React.FC<CameraInterfaceProps> = ({
  imageUrl,
  onCapture,
  onGallery,
  onSwitchCamera,
  onBack,
  onFlashToggle,
  isFlashOn
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    setTimeout(() => setIsFocused(false), 1000);
  }, []);

  return (
    <CameraContainer>
      {/* Dynamic Island */}
      <DynamicIsland />

      {/* 相机控制 */}
      <CameraControls>
        <ControlButton variant="back" onClick={onBack}>
          ←
        </ControlButton>
        <ControlButton variant="flash" onClick={onFlashToggle}>
          {isFlashOn ? '⚡' : '⚡'}
        </ControlButton>
      </CameraControls>

      {/* 取景框 */}
      <Viewfinder onClick={handleFocus}>
        {imageUrl ? (
          <CameraImage src={imageUrl} alt="Camera preview" />
        ) : (
          <PlaceholderContent>
            <div className="camera-icon">📷</div>
            <div className="placeholder-text">点击拍照</div>
            <div className="placeholder-hint">或从相册选择</div>
          </PlaceholderContent>
        )}
        <FocusFrame isActive={isFocused} />
      </Viewfinder>

      {/* 底部控制面板 */}
      <BottomControls>
        {/* 变焦滑块 */}
        <ZoomSlider>
          <span className="zoom-label">0.5x</span>
          <div className="zoom-line">
            <div className="zoom-indicator" />
          </div>
          <span className="zoom-label">1x</span>
        </ZoomSlider>

        {/* 控制按钮 */}
        <ControlButtons>
          <GalleryButton onClick={onGallery}>
            {imageUrl ? (
              <img src={imageUrl} alt="Gallery" />
            ) : (
              <div style={{ 
                width: '100%', 
                height: '100%', 
                background: 'rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                color: '#666'
              }}>
                📁
              </div>
            )}
          </GalleryButton>

          <ShutterButton onClick={onCapture} />

          <SwitchCameraButton onClick={onSwitchCamera}>
            🔄
          </SwitchCameraButton>
        </ControlButtons>
      </BottomControls>
    </CameraContainer>
  );
};

export default CameraInterface;
