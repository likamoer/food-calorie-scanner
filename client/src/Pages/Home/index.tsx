import React, { useEffect, useRef } from 'react';
import img1 from '../../assets/img1.webp';
import img2 from '../../assets/img2.avif';
import img3 from '../../assets/img3.avif';
import img6 from '../../assets/img6.webp';
import img7 from '../../assets/img7.avif';
import img8 from '../../assets/img8.avif';
import img9 from '../../assets/img9.avif';
import './index.css';

export default function Home() {
    const textElementRef = useRef<any>(null);
    useEffect(() => {
        if (textElementRef?.current) {
            const textElement = textElementRef.current;
            console.dir(textElement);
            const originalText = textElement.innerText;
            
            // 清空文本内容，准备开始打字机效果
            // @ts-ignore
            textElement.textContent = '';
            
            let index = 0;
            const typingSpeed = 100; // 打字速度（毫秒）
            
            // @ts-ignore
            function typeWriter() {
                if (index < originalText.length) {
                    // @ts-ignore
                    textElement.textContent += originalText.charAt(index);
                    index++;
                    setTimeout(typeWriter, typingSpeed);
                }
            }
            
            // 启动打字机效果
            setTimeout(typeWriter, 500); // 延迟500毫秒开始，让页面加载更自然
        }
    }, []);
  return <div className="father">
        <div className="container">
            <div className="image-grid">
                <img 
                    className="circle-image img1" 
                    src={img1}
                    alt="Mountain view"
                />
                <img 
                    className="circle-image img2"
                    src={img2}
                    alt="Camping gear"
                />
                <img 
                    className="circle-image img3" 
                    src={img3}
                    alt="Tent"
                />
                <img 
                    className="circle-image img6"
                    src={img6}
                    alt="Cooking equipment"
                />

                <img 
                    className="circle-image img7"
                    src={img7}
                    alt="Cooking equipment"
                />

                <img 
                    className="circle-image img8"
                    src={img8}
                    alt="Cooking equipment"
                />

                <img 
                    className="circle-image img9"
                    src={img9}
                    alt="Cooking equipment"
                />
                <div className="center-icon"></div>
            </div>

            <div className="text-content">
                <h1>扫描食物，立即获知热量！</h1>
                <p id="typewriter-text" ref={textElementRef}>一键拍照，快速分析食物营养成分，轻松掌握每日摄入热量，科学管理健康饮食。</p>
            </div>
            <button className="start-button">快速开始</button>
        </div>
    </div>
}