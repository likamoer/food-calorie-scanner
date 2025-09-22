import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadArea, Button, ErrorMessage } from './styles';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
  error: string | null;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isLoading, error }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    open
  } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
    disabled: isLoading,
    noClick: true,
    onDropRejected: (fileRejections) => {
      fileRejections.forEach(rejection => {
        console.error('文件被拒绝:', rejection.errors);
      });
    }
  });

  const handleCameraCapture = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment'; // 使用后置摄像头
    
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        onFileSelect(target.files[0]);
      }
    };
    
    input.click();
  };

  return (
    <>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <UploadArea 
        {...getRootProps()} 
        isDragActive={isDragActive}
        style={{ opacity: isLoading ? 0.5 : 1 }}
        className="touchable"
      >
        <input {...getInputProps()} />
        
        <div className="upload-icon">
          📷
        </div>
        
        <div className="upload-text">
          {isDragActive ? '放下图片文件' : '拖拽或点击上传食物照片'}
        </div>
        
        <div className="upload-hint">
          支持 JPG、PNG 格式，最大 5MB
        </div>
      </UploadArea>

      <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
        <Button 
          onClick={open} 
          disabled={isLoading}
          style={{ flex: 1 }}
          className="touchable"
        >
          📁 选择文件
        </Button>
        
        <Button 
          onClick={handleCameraCapture} 
          disabled={isLoading}
          variant="secondary"
          style={{ flex: 1 }}
          className="touchable"
        >
          📷 拍照
        </Button>
      </div>
    </>
  );
};

export default FileUpload;
