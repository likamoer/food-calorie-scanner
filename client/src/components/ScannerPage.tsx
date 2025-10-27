import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppContainer,
  MainContent,
  Header,
  Card,
  Footer,
  ErrorMessage,
  MobileOptimizations,
  GestureIndicator
} from './styles';
import FileUpload from './FileUpload';
import ImagePreview from './ImagePreview';
import LoadingState from './LoadingState';
import ResultsDisplay from './ResultsDisplay';
import StreamingOutput from './StreamingOutput';
import ParticleBackground from './ParticleBackground';
import CameraInterface from './CameraInterface';
import { apiService } from '../services/api';
import { FoodAnalysisResult, UploadStatus } from '../types';

const ScannerPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>(UploadStatus.IDLE);
  const [analysisResult, setAnalysisResult] = useState<FoodAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [streamText, setStreamText] = useState<string>('');
  const [isFlashOn, setIsFlashOn] = useState<boolean>(false);
  const [showCameraInterface, setShowCameraInterface] = useState<boolean>(false);

  const handleFileSelect = useCallback(async (file: File) => {
    try {
      setError(null);
      setUploadStatus(UploadStatus.UPLOADING);

      // 验证文件
      const validation = apiService.validateFile(file);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      // 创建预览
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setCurrentImage(file);
      setUploadStatus(UploadStatus.IDLE);

    } catch (err) {
      console.error('文件选择错误:', err);
      setError(err instanceof Error ? err.message : '文件处理失败');
      setUploadStatus(UploadStatus.ERROR);
    }
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!currentImage) {
      setError('请先选择一个图片文件');
      return;
    }

    try {
      setError(null);
      setUploadStatus(UploadStatus.ANALYZING);
      setStreamText('');

      console.log('开始分析食物图片(流式)...');
      const result = await apiService.analyzeFoodStream(currentImage, (delta) => {
        setStreamText(prev => prev + delta);
      });
      
      console.log('分析结果:', result);
      setAnalysisResult(result);
      setUploadStatus(UploadStatus.SUCCESS);

    } catch (err) {
      console.error('分析错误:', err);
      setError(err instanceof Error ? err.message : '分析失败');
      setUploadStatus(UploadStatus.ERROR);
    }
  }, [currentImage]);

  const handleRemoveImage = useCallback(() => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setCurrentImage(null);
    setImagePreview(null);
    setAnalysisResult(null);
    setError(null);
    setStreamText('');
    setUploadStatus(UploadStatus.IDLE);
    setShowCameraInterface(false);
  }, [imagePreview]);

  const handleRetry = useCallback(() => {
    handleRemoveImage();
  }, [handleRemoveImage]);

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleCameraCapture = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        handleFileSelect(target.files[0]);
        setShowCameraInterface(false);
      }
    };
    
    input.click();
  };

  const handleGallery = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        handleFileSelect(target.files[0]);
        setShowCameraInterface(false);
      }
    };
    
    input.click();
  };

  const handleSwitchCamera = () => {
    // 切换前后摄像头的逻辑
    console.log('切换摄像头');
  };

  const handleFlashToggle = () => {
    setIsFlashOn(!isFlashOn);
  };

  const isLoading = uploadStatus === UploadStatus.UPLOADING || uploadStatus === UploadStatus.ANALYZING;

  // 如果显示相机界面
  if (showCameraInterface) {
    return (
      <CameraInterface
        imageUrl={imagePreview || undefined}
        onCapture={handleCameraCapture}
        onGallery={handleGallery}
        onSwitchCamera={handleSwitchCamera}
        onBack={() => setShowCameraInterface(false)}
        onFlashToggle={handleFlashToggle}
        isFlashOn={isFlashOn}
      />
    );
  }

  return (
    <MobileOptimizations>
      <AppContainer>
        <ParticleBackground particleCount={60} />
        
        <Header>
          <button 
            onClick={handleBackToHome}
            style={{
              position: 'absolute',
              left: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              padding: '10px 15px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
            }}
          >
            ← 返回首页
          </button>
          <h1>🍎 食物卡路里扫描器</h1>
          <p>上传食物照片，智能识别并计算卡路里</p>
        </Header>

        <MainContent>
          <Card>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            
            {!imagePreview && (
              <FileUpload
                onFileSelect={handleFileSelect}
                isLoading={isLoading}
                error={null}
                onCameraMode={() => setShowCameraInterface(true)}
              />
            )}

            {imagePreview && !analysisResult && (
              <ImagePreview
                imageUrl={imagePreview}
                onRemove={handleRemoveImage}
                onAnalyze={handleAnalyze}
                isAnalyzing={uploadStatus === UploadStatus.ANALYZING}
              />
            )}

            {uploadStatus === UploadStatus.ANALYZING && (
              <>
                <LoadingState message="正在识别食物，请稍候..." />
                <StreamingOutput text={streamText} />
              </>
            )}

            {analysisResult && uploadStatus === UploadStatus.SUCCESS && (
              <ResultsDisplay
                result={analysisResult}
                onRetry={handleRetry}
              />
            )}
          </Card>
        </MainContent>

        <Footer>
          <p>&copy; 2024 食物卡路里扫描器. 数据仅供参考</p>
        </Footer>

        {/* 移动端手势指示器 */}
        <GestureIndicator>
          👆 点击或拖拽上传图片
        </GestureIndicator>
      </AppContainer>
    </MobileOptimizations>
  );
};

export default ScannerPage;