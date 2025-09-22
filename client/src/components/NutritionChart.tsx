import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

interface NutritionData {
  protein: string;
  carbs: string;
  fat: string;
  fiber: string;
}

interface NutritionChartProps {
  nutrition: NutritionData;
  calories: number;
}

// 动画效果 - 修复版本
const fillAnimation = keyframes`
  from { width: 0%; }
  to { width: var(--target-width, 100%); }
`;

const countUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// 图表容器
const ChartContainer = styled.div`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 249, 250, 0.9) 100%);
  border-radius: 20px;
  padding: 30px;
  margin: 20px 0;
  border: 2px solid rgba(102, 126, 234, 0.1);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  animation: ${countUp} 0.8s ease 0.6s both;
`;

const ChartTitle = styled.h3`
  text-align: center;
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 25px;
`;

const CalorieRing = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
  margin: 0 auto 30px;
  border-radius: 50%;
  background: conic-gradient(
    #667eea 0deg,
    #764ba2 120deg,
    #f093fb 240deg,
    #4facfe 360deg
  );
  padding: 10px;
  animation: ${countUp} 1s ease 0.8s both;

  &::before {
    content: '';
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    bottom: 10px;
    background: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const CalorieText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 1;

  .number {
    font-size: 2.5rem;
    font-weight: 900;
    background: linear-gradient(135deg, #667eea, #764ba2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1;
  }

  .unit {
    font-size: 1rem;
    color: #6c757d;
    font-weight: 600;
  }
`;

const NutritionBars = styled.div`
  display: grid;
  gap: 20px;
`;

const NutritionBar = styled.div<{ percentage: number; color: string; delay: number }>`
  animation: ${countUp} 0.6s ease ${props => props.delay}s both;

  .label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    font-weight: 600;
    color: #2c3e50;
  }

  .value {
    font-size: 1.1rem;
    color: ${props => props.color};
  }

  .bar-container {
    height: 12px;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 6px;
    overflow: hidden;
    position: relative;
  }

  .bar {
    height: 100%;
    background: linear-gradient(90deg, ${props => props.color}, ${props => props.color}cc);
    border-radius: 6px;
    width: ${props => props.percentage}%;
    position: relative;
    overflow: hidden;

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
      animation: shimmer 2s ease-in-out infinite;
    }
  }
`;


const NutritionChart: React.FC<NutritionChartProps> = ({ nutrition, calories }) => {
  const [animatedPercentages, setAnimatedPercentages] = useState({
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
  });

  // 将字符串转换为数字
  const proteinNum = parseFloat(nutrition.protein) || 0;
  const carbsNum = parseFloat(nutrition.carbs) || 0;
  const fatNum = parseFloat(nutrition.fat) || 0;
  const fiberNum = parseFloat(nutrition.fiber) || 0;
  
  // 计算总营养值
  const totalNutrition = proteinNum + carbsNum + fatNum + fiberNum;
  
  // 计算百分比
  const percentages = {
    protein: totalNutrition > 0 ? (proteinNum / totalNutrition) * 100 : 0,
    carbs: totalNutrition > 0 ? (carbsNum / totalNutrition) * 100 : 0,
    fat: totalNutrition > 0 ? (fatNum / totalNutrition) * 100 : 0,
    fiber: totalNutrition > 0 ? (fiberNum / totalNutrition) * 100 : 0,
  };

  // 触发动画
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPercentages(percentages);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [percentages]);

  // 调试信息
  console.log('营养数据:', nutrition);
  console.log('转换后数字:', { proteinNum, carbsNum, fatNum, fiberNum });
  console.log('总营养值:', totalNutrition);
  console.log('百分比:', percentages);

  const nutritionItems = [
    { key: 'protein', label: '蛋白质', value: nutrition.protein, color: '#667eea', delay: 0.1 },
    { key: 'carbs', label: '碳水化合物', value: nutrition.carbs, color: '#764ba2', delay: 0.2 },
    { key: 'fat', label: '脂肪', value: nutrition.fat, color: '#f093fb', delay: 0.3 },
    { key: 'fiber', label: '纤维', value: nutrition.fiber, color: '#4facfe', delay: 0.4 },
  ];

  return (
    <ChartContainer>
      <ChartTitle>📊 营养成分分析</ChartTitle>
      
      <CalorieRing>
        <CalorieText>
          <div className="number">{calories}</div>
          <div className="unit">卡路里</div>
        </CalorieText>
      </CalorieRing>

      <NutritionBars>
        {nutritionItems.map((item) => (
          <NutritionBar
            key={item.key}
            percentage={percentages[item.key as keyof typeof percentages]}
            color={item.color}
            delay={item.delay}
          >
            <div className="label">
              <span>{item.label}</span>
              <span className="value">{item.value}g</span>
            </div>
            <div className="bar-container">
              <div 
                className="bar"
                style={{ 
                  width: `${animatedPercentages[item.key as keyof typeof animatedPercentages]}%`,
                  transition: `width 1.5s ease ${item.delay + 0.2}s`
                } as React.CSSProperties}
              />
            </div>
          </NutritionBar>
        ))}
      </NutritionBars>
    </ChartContainer>
  );
};

export default NutritionChart;
