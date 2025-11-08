import React, { useState, useEffect, useRef } from 'react';
import { Input, Toast } from 'antd-mobile'
import { registryUserInfo } from '../../utils/api'
import './register.less'

export default function Register(){
  const [curTab, setCurTab] = useState('register');
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [registryFormData, setRegistryFormData] = useState({
    username: '',
    password: '',
    phone: '',
  });

  const timerRef = useRef<any>(null);

  // 处理获取验证码
  const handleGetVerificationCode = () => {
    // 这里可以添加验证手机号是否有效的逻辑
    setIsCountingDown(true);
    setCountdown(60);
  };

  // 保存 注册表单字段逻辑
  const handleRegistryFormChange = (key: string, value: any) => {
    console.log(key, value, typeof value);
    setRegistryFormData({
      ...registryFormData,
      [key]: value,
    });
  };

  // 点击注册
  const handleRegistryClick = async () => {
    const { username, password, phone } = registryFormData;
    if (!username?.trim() || !password?.trim() || !phone?.trim()) {
      Toast?.show({
        icon: 'fail',
        content: '请填写完整信息'
      })
      return;
    }
    try {
      const res = await registryUserInfo({ username, password, phone });
    } catch (error) {
      console.error('注册失败:', error);
    }
  };

  // 倒计时效果
  useEffect(() => {
    if (isCountingDown && countdown > 0) {
      timerRef.current = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setIsCountingDown(false);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isCountingDown, countdown]);

  return <div className='register-or-login-box'>
    <div className='tab-box'>
      <div className={`tab-item ${curTab === 'register' ? 'active' : ''}`} onClick={() => setCurTab('register')}>注册</div>
      <div className={`tab-item ${curTab === 'login' ? 'active' : ''}`} onClick={() => setCurTab('login')}>登录</div>
    </div>
    {
      curTab === 'register' && <div className='register-content'>
        <div className='registry-content-item'>
          <div className='registry-username-box-label'>用户名</div>
          <Input placeholder='请输入用户名' onChange={(value) => handleRegistryFormChange('username', value)} clearable/>
        </div>
        <div className='registry-content-item'>
          <div className='registry-username-box-label'>密码</div>
          <Input placeholder='请输入密码' onChange={(value) => handleRegistryFormChange('password', value)} type='password' clearable/>
        </div>
        <div className='registry-content-item'>
          <div className='registry-username-box-label'>手机号</div>
          <Input placeholder='请输入手机号' onChange={(value) => handleRegistryFormChange('phone', value)} type='number' clearable/>
        </div>
        {false && <div className='registry-content-item'>
          <div className='registry-username-box-label'>短信验证码</div>
          <div className='verification-code-box'>
            <Input placeholder='请输入验证码' type='number' clearable/>
            <div 
              className={`registry-get-verification-code ${isCountingDown ? 'disabled-registry-get-verification-code' : ''}`}
              onClick={handleGetVerificationCode}
              style={{ pointerEvents: isCountingDown ? 'none' : 'auto' }}
            >
              {isCountingDown ? `获取验证码 ${countdown}s` : '获取验证码'}
            </div>
          </div>
        </div>}
        <div className='registry-button' onClick={handleRegistryClick}>注册</div>
      </div>
    }
  </div>
}