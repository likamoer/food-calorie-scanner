import React, { useState } from 'react';
import FooterBar from '../../components/FooterBar';
import { useJump } from '../../utils/utils';
import './index.css';

// 计算当前周的日期数组（周一到周日），包含日期和星期几
interface WeekDateInfo {
  date: string; // MM.DD格式
  dayOfWeek: string; // 星期几
  isToday: boolean; // 是否是今天
}

const getCurrentWeekDates = (): WeekDateInfo[] => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0是周日，1-6是周一到周六
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
  
  // 计算本周一的日期（如果今天是周日，则周一为6天前）
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset);
  
  // 生成今天的日期字符串，用于比较
  const todayStr = `${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;
  
  // 生成周一到周日的日期数组，包含日期、星期几和是否是今天
  const weekDates: WeekDateInfo[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    
    // 格式化为MM.DD
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${month}.${day}`;
    
    // 获取星期几（周一到周日对应数组索引1-7）
    const dayIndex = date.getDay();
    
    weekDates.push({
      date: dateStr,
      dayOfWeek: weekDays[dayIndex],
      isToday: dateStr === todayStr // 判断是否是今天
    });
  }
  
  return weekDates;
};

export default function Home() {
      const [useInfo, setUseInfo] = useState({
          username: '燃脂每一天',
      });
      const [weekDates, setWeekDates] = useState<WeekDateInfo[]>(getCurrentWeekDates());
      
      // 在组件顶层调用Hook，符合React Hooks规则
      const navigate = useJump();

      // 选择日期
      const handleSelectDate = (date: string) => {
          setWeekDates(weekDates.map(item => ({
              ...item,
              isToday: item.date === date
          })));
      }
      // 底部蓝点击事件
      const handleClickFooterBar = (key: string) => {
        // 直接使用顶层定义的navigate函数
        navigate(`/${key}`);
      }
    return (
        <div className="home-box">
            <div className='main-content'>
                {/* 用户信息头部 */}
                <div className="header">
                    <div className="user-info">
                        <div className="avatar"></div>
                        <h2 className="username">{useInfo.username}</h2>
                    </div>
                </div>

                {/* 标题和时间筛选器 */}
                <div className="content-section">
                    <h1 className="page-title">追踪你的卡路里</h1>
                    <div className="time-filter">
                        {
                            weekDates.map((item, index) => (
                                <div 
                                    onClick={() => handleSelectDate(item.date)}
                                    className={item.isToday ? "filter-btn-day-item filter-btn-day-item-active" : "filter-btn-day-item"}
                                >
                                    <div className='date-item'>{item.date.split('.')[1]}</div>
                                    <div className='weekday-item'>{item.dayOfWeek}</div>
                                </div>
                            ))
                        }
                    </div>
                </div>

                {/* 日常结果卡片 */}
                <div className="daily-result-card">
                    <div className="card-header">
                        <div className="card-icon time-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                        </div>
                        <h3 className="card-title">Daily Result</h3>
                    </div>
                    
                    <div className="progress-section">
                        <div className="percentage">78%</div>
                        
                        {/* 环形进度条和卡路里信息 */}
                        <div className="circular-progress">
                            <svg className="progress-ring" viewBox="0 0 100 100">
                                {/* 背景圆环 */}
                                <circle className="progress-ring-bg" cx="50" cy="50" r="45" />
                                {/* 进度圆环 */}
                                <circle className="progress-ring-fill" cx="50" cy="50" r="45" />
                            </svg>
                            <div className="progress-text">
                                <span className="current-calories">1155</span>
                                <span className="total-calories">1850</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 底部导航栏 */}
            <FooterBar
                defaultTab='home'
                className='footer-bar-box'
                afterTabChanged={handleClickFooterBar}
            />

        </div>
    );
}
