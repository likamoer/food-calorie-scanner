import React, { useState, useCallback } from 'react';
import {
  AppContainer,
  MainContent,
  Header,
  Card,
  Footer,
  ErrorMessage,
  MobileOptimizations,
  GestureIndicator
} from './components/styles';
import FileUpload from './components/FileUpload';
import ImagePreview from './components/ImagePreview';
import LoadingState from './components/LoadingState';
import ResultsDisplay from './components/ResultsDisplay';
import StreamingOutput from './components/StreamingOutput';
import ParticleBackground from './components/ParticleBackground';
import { apiService } from './services/api';
import { FoodAnalysisResult, UploadStatus } from './types';

function App() {
  const [currentImage, setCurrentImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>(UploadStatus.IDLE);
  const [analysisResult, setAnalysisResult] = useState<FoodAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [streamText, setStreamText] = useState<string>('');

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
  }, [imagePreview]);

  const handleRetry = useCallback(() => {
    handleRemoveImage();
  }, [handleRemoveImage]);

  const isLoading = uploadStatus === UploadStatus.UPLOADING || uploadStatus === UploadStatus.ANALYZING;

  return (
    <MobileOptimizations>
      <AppContainer>
        <ParticleBackground particleCount={60} />
        
        <Header>
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
}

export default App;
