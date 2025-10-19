import React, { useEffect, useRef, useState } from 'react';
import img1 from '../../assets/img1.webp';
import img2 from '../../assets/img2.avif';
import img3 from '../../assets/img3.avif';
import img4 from '../../assets/img4.avif';
import img5 from '../../assets/img5.avif';
import img6 from '../../assets/img6.webp';
import img7 from '../../assets/img7.avif';
import img8 from '../../assets/img8.avif';
import img9 from '../../assets/img9.avif';
import img10 from '../../assets/img10.avif';
import { useJump } from '../../utils/utils';
import './index.less';

export default function Home() {
    const textElementRef = useRef<any>(null);
    // 维护图片信息
    const [imageInfo, setImageInfo] = useState<any>(
        [
            {
                src: img1,
                name: 'img1',
                style: {
                    top: 0,
                    left: '0.2rem'
                }
            },
            {
                src: img2,
                name: 'img2',
                style: {
                    top: 0,
                    right: '0.4rem'
                }
            },
            {
                src: img3,
                name: 'img3',
                style: {
                    top: '3.2rem',
                    left: '0.2rem'
                }
            },
            {
                src: img4,
                name: 'img4',
                style: {
                    top: '7rem',
                    right: '2.2rem'
                }
            },
            {
                src: img5,
                name: 'img5',
                style: {
                    top: '8rem',
                    left: '0.6rem'
                }
            },
            {
                src: img6,
                name: 'img6',
                style: {
                    top: '2.4rem',
                    right: '0.4rem'
                }
            },
            {
                src: img7,
                name: 'img6',
                style: {
                    top: '4.3rem',
                    left: '2.6rem'
                }
            },
            {
                src: img8,
                name: 'img8',
                style: {
                    top: '5rem',
                    right: '0.2rem'
                }
            },
            {
                src: img9,
                name: 'img9',
                style: {
                    top: '5.8rem',
                    left: '0.2rem'
                }
            },
            {
                src: img10,
                name: 'img6',
                style: {
                    top: '7.6rem',
                    right: '0.4rem'
                }
            },
        ]
    );
    
    let navigate = useJump();

    function clickGetStart() {
        navigate('/home');
    }

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
                {
                    imageInfo.map((item: any,) => (
                        <img
                            className={`circle-image ${item.name}`}
                            src={item.src}
                            style={item.style}
                        />
                    ))
                }
                <div className="center-icon"></div>
            </div>

            <div className="text-content">
                <h1>扫描食物，获知热量！</h1>
                <p id="typewriter-text" ref={textElementRef}>一键拍照，快速分析食物营养成分，轻松掌握每日摄入热量，科学管理健康饮食。</p>
            </div>
            <button className="start-button" onClick={clickGetStart}>快速开始</button>
        </div>
    </div>
}