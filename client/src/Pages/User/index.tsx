import React, { useState } from 'react';
import { LeftOutline, UserOutline, ExclamationCircleOutline } from 'antd-mobile-icons'
import store from '../../store';
import './index.less';
import { useJump } from '../../utils/utils';

export default function User() {
    const userInfo = store.getState().userInfo;
    const navigate = useJump();
    const [arr, setArr] = useState([
        { name: '个人信息', icon: <UserOutline fontSize={24} /> },
        { name: '免责声明', icon: <ExclamationCircleOutline fontSize={24} /> },
    ]);
    // 点击返回
    function goBack() {
        navigate(-1);
    }
    return (
        <div className='user-box'>
            {/* 返回上一页的图标 */}
            <div className='go-back-icon' onClick={goBack}>
                <LeftOutline fontSize={24}/>
            </div>
            {/* 用户信息 */}
            <div className='user-info'>
                <div className='user-info-icon'>
                    <UserOutline fontSize={24}/>
                </div>
                <div className='user-info-name'>{userInfo.username}</div>
            </div>
            {/* 功能列表 */}
            <div className='user-option'>
                {
                    arr.map((item, index) => (
                        <div key={index} className='user-option-item'>
                            {item.icon}
                            <div className='user-option-item-name'>{item.name}</div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}
