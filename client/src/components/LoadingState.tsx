import React from 'react';
import { LoadingContainer, LoadingSpinner } from './styles';

interface LoadingStateProps {
  message?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = '正在处理中...' 
}) => {
  return (
    <LoadingContainer>
      <LoadingSpinner />
      <p>{message}</p>
    </LoadingContainer>
  );
};

export default LoadingState;
