import React from 'react';
import { ImagePreview as StyledImagePreview, Button } from './styles';

interface ImagePreviewProps {
  imageUrl: string;
  onRemove: () => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  imageUrl,
  onRemove,
  onAnalyze,
  isAnalyzing
}) => {
  return (
    <div>
      <StyledImagePreview>
        <img src={imageUrl} alt="预览图片" />
        <button className="remove-btn" onClick={onRemove} title="移除图片">
          ✕
        </button>
      </StyledImagePreview>
      
      <Button 
        onClick={onAnalyze} 
        disabled={isAnalyzing}
        size="lg"
      >
        {isAnalyzing ? (
          <>
            <span>🔍</span>
            正在分析食物...
          </>
        ) : (
          <>
            <span>🔍</span>
            开始分析食物
          </>
        )}
      </Button>
    </div>
  );
};

export default ImagePreview;
