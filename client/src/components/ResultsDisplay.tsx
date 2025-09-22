import React from 'react';
import { 
  ResultsContainer, 
  FoodInfo, 
  NutritionGrid, 
  NutritionItem, 
  ConfidenceScore, 
  Button 
} from './styles';
import NutritionChart from './NutritionChart';
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

      {/* 添加营养图表 */}
      <NutritionChart 
        nutrition={result.nutrition} 
        calories={result.calories} 
      />

      <NutritionGrid>
        {Object.entries(result.nutrition).map(([key, value]) => (
          <NutritionItem key={key}>
            <span className="nutrition-label">
              {nutritionLabels[key as keyof typeof nutritionLabels]}
            </span>
            <span className="nutrition-value">{value}g</span>
          </NutritionItem>
        ))}
      </NutritionGrid>

      {result.description && (
        <div style={{ 
          padding: '20px', 
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)', 
          borderRadius: '16px', 
          marginBottom: '25px',
          fontSize: '1rem',
          color: '#2c3e50',
          lineHeight: '1.6',
          border: '2px solid rgba(102, 126, 234, 0.1)',
          animation: 'fadeInUp 0.8s ease 0.8s both'
        }}>
          <strong style={{ 
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            💡 食物说明：
          </strong>
          <div style={{ marginTop: '8px' }}>{result.description}</div>
        </div>
      )}

      <Button onClick={onRetry} variant="secondary" className="touchable">
        🔄 重新上传
      </Button>

      <div style={{ 
        textAlign: 'center', 
        marginTop: '25px', 
        fontSize: '0.9rem', 
        color: '#6c757d',
        padding: '15px',
        background: 'rgba(255, 255, 255, 0.5)',
        borderRadius: '12px',
        border: '1px solid rgba(102, 126, 234, 0.1)'
      }}>
        <p><strong>分析ID:</strong> {result.analysisId}</p>
        <p><strong>分析时间:</strong> {new Date(result.timestamp).toLocaleString('zh-CN')}</p>
        <p style={{ 
          marginTop: '12px', 
          fontStyle: 'italic',
          color: '#e74c3c',
          fontWeight: '500'
        }}>
          ⚠️ 营养数据仅供参考，实际含量可能因制作方式而异
        </p>
      </div>
    </ResultsContainer>
  );
};

export default ResultsDisplay;
