import React, { useState, useEffect, useRef } from 'react';
import { AppstoreOutline, CameraOutline, UserOutline, FileOutline } from 'antd-mobile-icons';
import { ImageUploader, Toast } from 'antd-mobile';
import { useCamera } from '../../utils/utils';
import './index.less';


export default function FooterBar(props: any) {
    const { 
        defaultTab = 'home', className, 
        beforeTabChange = () => {
            return true;
        },
        afterTabChanged = () => {},
        getImgFn = () => {},
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
            name: '记录',
            key: 'record',
            path: '/record',
            icon: <FileOutline fontSize={24}/>
        },
        {
            name: '我的',
            key: 'user',
            path: '/user',
            icon: <UserOutline fontSize={24}/>
        },
    ]);
    const [activeKey, setActiveKey] = useState(defaultTab);
    const [fileList, setFileList] = useState([]);
    const imageUploaderRef = useRef<any>(null);
    const [loading, setLoading] = useState(false);

    const callCameraFn = useCamera();

    // 模拟上传图片
    function mockUpload(file: any) {
        console.log('file-上传图片:', file);
        return {url: URL.createObjectURL(file)};
    }

    // 图片上传组件变化时触发
    function imgComponentChange(fileList: any) {
        console.log('fileList-图片上传组件变化时触发:', fileList);
        if (fileList.length === 0) {
            return;
        }
        getImgFn(fileList[0].url);
    }

    // 切换底部bar时触发
    function clickTabItem(key: string) {
        if (key === 'photo') {
            // @ts-ignore
            if (callCameraFn({}) === false) {
                // 如果是PC环境，则默认调用antd的组件
                imageUploaderRef.current?.nativeElement?.click();
            };
            return;
        }
        // 不能重复点击相同的tab
        if (activeKey === key) {
            return;
        }
        // 切换前事件
        if (!beforeTabChange(activeKey)){
            return;
        }
        setActiveKey(key);
        // 切换后事件
        afterTabChanged(key);
    }

    useEffect(
        () => {
            //@ts-ignore 监听相机返回的消息
            window.receiveCameraBridgeMessage = function(value) {
                alert(`相机返回的结果-base64: ${value}`);
            }
        },
        []
    )

    return (
        <div className={`footer-bar ${className || ''}`}>
            <div style={{display: 'none'}}>
                <ImageUploader
                    value={fileList}
                    maxCount={1}
                    // @ts-ignore
                    upload={mockUpload}
                    onChange={imgComponentChange}
                    // @ts-ignore
                    ref={imageUploaderRef}
                />
            </div>

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
