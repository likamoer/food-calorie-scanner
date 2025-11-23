import React from 'react';
import './index.less';


const ResultCard = (props: any) => {
  const { img = '' } = props;
  // 点击缩放交互效果
  const handleButtonClick = (e: any) => {
    e.currentTarget.classList.add('scale-95');
    setTimeout(() => e.currentTarget.classList.remove('scale-95'), 200);
  };

  return (
    <div className="result-card min-h-screen font-sans bg-gray-100">

      {/* 主内容卡片 */}
      <main className="max-w-md mx-auto pt-16 pb-20">
        {/* 顶部图片区域 */}
        <div className="result-img-box">
          <div className='result-img' style={{ backgroundImage: `url(${img})` }}></div>
          {/* 顶部图片底部渐变遮罩 */}
          <div className="bottom-transparent"></div>
        </div>

        {/* 卡片内容（毛玻璃效果） */}
        <div className="result-content-box">
          {/* 标题和热量 */}
          <div className="title">
            <h2 className="text-[clamp(1.5rem,5vw,2rem)] font-bold text-primary">Panna Cotta</h2>
            <div className="all-kcal">
              {/* @ts-ignore */}
              <svg t="1763913386437" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5084" width="200" height="200"><path d="M632.738909 216.901818s22.016 103.517091-67.188364 99.118546c-71.493818-3.537455-29.742545-165.259636-137.658181-209.314909 0 0 21.387636 106.589091-61.672728 163.072-110.126545 74.891636-235.682909 193.838545-156.392727 384.744727 71.354182 171.776 292.026182 262.795636 292.026182 262.795636s-184.087273-203.845818-23.319273-321.582545c191.371636-140.125091 270.917818 103.517091 189.416727 277.527272 0.046545 0 407.505455-431.895273-35.211636-656.360727z" fill="#FF8E7B" p-id="5085"></path></svg>
              <span className="value">260 kcal</span>
            </div>
          </div>

          {/* 营养成分标签 */}
          <div className="all-tag-box">
            <div className="tag-item">
              Protein: <span className="font-bold text-primary">12g</span>
            </div>
            <div className="tag-item">
              Carbs: <span className="font-bold text-primary">24g</span>
            </div>
            <div className="tag-item">
              Fat: <span className="font-bold text-primary">20g</span>
            </div>
          </div>

          {/* 描述文本 */}
          <p className="text-[#333333] mb-8 leading-relaxed">
            Chocolate panna cotta is a smooth and creamy Italian dessert made with cream, sugar, and rich dark chocolate...
            <span className="text-[#FF6B35] font-medium cursor-pointer hover:underline">Read more</span>
          </p>

          {/* 底部按钮 */}
          <div className="result-card-footer">
            <div
              className="primary-btn"
              onClick={handleButtonClick}
            >
              Add meal
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResultCard;