import React, { useState } from 'react';
import { AppstoreOutline, CameraOutline, UserOutline } from 'antd-mobile-icons';
import './index.less';


export default function FooterBar(props: any) {
    const { 
        defaultTab = 'home', className, 
        beforeTabChange = () => {
            return true;
        },
        afterTabChanged = () => {},
    } = props;
    const [FooterBarArr, setFooterBarArr] = useState([
        {
            name: '首页',
            key: 'home',
            path: '/home',
            icon: <AppstoreOutline fontSize={24}/>
        },
        {
            name: '拍照',
            key: 'photo',
            icon: <CameraOutline fontSize={24}/>,
            style: {
                top: '-20px',
                background: 'white',
                color: 'black',
                width: '1.2rem',
                height: '1.2rem'
            }
        },
        {
            name: '我的',
            key: 'user',
            path: '/user',
            icon: <UserOutline fontSize={24}/>
        },
    ]);
    const [activeKey, setActiveKey] = useState(defaultTab);

    // 切换底部bar时触发
    function clickTabItem(key: string) {
        if (!beforeTabChange(activeKey)){
            return;
        }
        setActiveKey(key);
        afterTabChanged(key);
    }

    return (
        <div className={`footer-bar ${className || ''}`}>
            {
                FooterBarArr.map((item, index) => (
                    <div 
                        key={item.key}
                        onClick={() => clickTabItem(item.key)}
                        className={`footer-bar-item ${item.key === activeKey ? 'footer-bar-item-active' : ''}`}
                        style={item.style || {}}
                    >
                        {item.icon}
                    </div>
                ))
            }
        </div>
    );
}
