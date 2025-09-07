import React from 'react';
import { 
  ResultsContainer, 
  FoodInfo, 
  NutritionGrid, 
  NutritionItem, 
  ConfidenceScore, 
  Button 
} from './styles';
import { FoodAnalysisResult } from '../types';

interface ResultsDisplayProps {
  result: FoodAnalysisResult;
  onRetry: () => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, onRetry }) => {
  const nutritionLabels = {
    protein: '蛋白质',
    carbs: '碳水化合物', 
    fat: '脂肪',
    fiber: '纤维'
  };

  const formatConfidence = (confidence: number) => {
    return Math.round(confidence * 100);
  };

  return (
    <ResultsContainer>
      <FoodInfo>
        <div className="food-name">{result.name}</div>
        <div className="calorie-display">
          <div className="calorie-number">{result.calories}</div>
          <div className="calorie-unit">卡路里</div>
        </div>
      </FoodInfo>

      <ConfidenceScore>
        <span className="confidence-label">识别准确度:</span>
        <span className="confidence-value">{formatConfidence(result.confidence)}%</span>
      </ConfidenceScore>

      <NutritionGrid>
        {Object.entries(result.nutrition).map(([key, value]) => (
          <NutritionItem key={key}>
            <span className="nutrition-label">
              {nutritionLabels[key as keyof typeof nutritionLabels]}
            </span>
            <span className="nutrition-value">{value}</span>
          </NutritionItem>
        ))}
      </NutritionGrid>

      {result.description && (
        <div style={{ 
          padding: '15px', 
          background: '#f8f9fa', 
          borderRadius: '8px', 
          marginBottom: '20px',
          fontSize: '0.95rem',
          color: '#6c757d',
          lineHeight: '1.5'
        }}>
          <strong>食物说明：</strong>{result.description}
        </div>
      )}

      <Button onClick={onRetry} variant="secondary">
        🔄 重新上传
      </Button>

      <div style={{ 
        textAlign: 'center', 
        marginTop: '20px', 
        fontSize: '0.85rem', 
        color: '#6c757d' 
      }}>
        <p>分析ID: {result.analysisId}</p>
        <p>分析时间: {new Date(result.timestamp).toLocaleString('zh-CN')}</p>
        <p style={{ marginTop: '10px', fontStyle: 'italic' }}>
          ⚠️ 营养数据仅供参考，实际含量可能因制作方式而异
        </p>
      </div>
    </ResultsContainer>
  );
};

export default ResultsDisplay;
