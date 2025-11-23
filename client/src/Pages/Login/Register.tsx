import React, { useState, useEffect, useRef } from 'react';
import { Input, Toast } from 'antd-mobile';
import { EyeInvisibleOutline, EyeOutline } from 'antd-mobile-icons';
import { registryUserInfo, getSmsCode, loginByUsername, loginByPhone } from '../../utils/api'
import { useJump, setCacheUserInfo } from '../../utils/utils';
import './register.less';

// 定义登录注册标签枚举
enum TabType {
  REGISTER = 'register',
  LOGIN = 'login',
  VERIFY_CODE_LOGIN = 'verify-code-login'
}

export default function Register(){
  const [curTab, setCurTab] = useState<TabType>(TabType.REGISTER);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [visible, setVisible] = useState(false);  // 密码是否可见
  const [countdown, setCountdown] = useState(60);
  // 注册表单
  const [registryFormData, setRegistryFormData] = useState({
    username: '',
    password: '',
    phone: '',
  });

  // 用户/密码表单
  const [loginFormData, setLoginFormData] = useState({
    phone: '',
    password: '',
  });

  // 手机/验证码表单
  const [verifyCodeFormData, setVerifyCodeFormData] = useState({
    phone: '',
    verifyCode: '',
  });

  const timerRef = useRef<any>(null);
  const jump = useJump();

  // 点击“验证码”时触发
  const handleGetVerificationCode = () => {
    if (!verifyCodeFormData.phone?.trim()) {
      Toast?.show({
        icon: 'fail',
        content: '请输入手机号'
      })
      return;
    }
    getSmsCode({ phone: verifyCodeFormData.phone }).then(res => {
      if (res?.code === 200) {
        Toast?.show({
          icon: 'success',
          content: '验证码发送成功'
        })
      }
      // 这里可以添加验证手机号是否有效的逻辑
      setIsCountingDown(true);
      setCountdown(60);
    }).catch(error => {
      Toast?.show({
        icon: 'fail',
        content: error?.message || '验证码发送失败'
      })
    })
  };

  // 保存 手机/验证码表单字段逻辑
  const handleVerifyCodeFormChange = (key: string, value: any) => {
    setVerifyCodeFormData({
      ...verifyCodeFormData,
      [key]: value,
    });
  };

  // 保存 用户/密码表单字段逻辑
  const handleLoginFormChange = (key: string, value: any) => {
    setLoginFormData({
      ...loginFormData,
      [key]: value,
    });
  };


  // 保存 注册表单字段逻辑
  const handleRegistryFormChange = (key: string, value: any) => {
    setRegistryFormData({
      ...registryFormData,
      [key]: value,
    });
  };

  // 验证手机号格式
  const validatePhone = (phone: string): boolean => {
    // 中国大陆手机号验证规则：1开头的11位数字
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phone?.trim() || '');
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
    
    // 验证手机号格式
    if (!validatePhone(phone)) {
      Toast?.show({
        icon: 'fail',
        content: '请输入正确的手机号'
      })
      return;
    }
    try {
      const res = await registryUserInfo({ username, password, phone });
      if (res?.data?.token) {
        // 跳转首页并缓存用户信息
        setCacheUserInfo(res?.data);
        Toast?.show({
          icon: 'success',
          content: '注册成功，即将跳转首页'
        })
        setTimeout(() => {
          jump('/home');
        }, 1000);
      }
    } catch (error) {
      console.error('注册失败:', error);
    }
  };

  // 点击登录
  const handleLoginClick = async () => {
    if (curTab === TabType.LOGIN){
      // 如果是用户名/密码登陆
      const { phone, password } = loginFormData;
      if (!phone?.trim() || !password?.trim()) {
        Toast?.show({
          icon: 'fail',
          content: '请填写完整信息'
        })
        return;
      }
      try {
        const res = await loginByUsername({ phone, password });
        if (res?.data?.token) {
          // 跳转首页并缓存用户信息
          setCacheUserInfo({ ...res?.data || {}, phoneNumber: phone });
          jump('/home');
        }
      } catch (error) {
        console.error('登录失败:', error);
      }
    } else if (curTab === TabType.VERIFY_CODE_LOGIN){
      // 如果是手机号/验证码登陆
      const { phone, verifyCode } = verifyCodeFormData;
      if (!phone?.trim() || !verifyCode?.trim()) {
        Toast?.show({
          icon: 'fail',
          content: '请填写完整信息'
        })
        return;
      }
      if (!isCountingDown) {
        Toast?.show({
          icon: 'fail',
          content: '验证码已失效, 请重新获取'
        })
        return;
      }
      try {
        const res = await loginByPhone({ phone, verifyCode });
        if (res?.data?.token) {
          // 跳转首页并缓存用户信息
          setCacheUserInfo({
            ...res?.data || {},
            phoneNumber: phone
          });
          jump('/home');
        }
      } catch (error) {
        console.error('登录失败:', error);
      }
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

  // 监听tab变化，密码框处于不可见密码状态
  useEffect(() => {
    setVisible(false);
  }, [curTab]);

  return <div className='register-or-login-box'>
    <div className='tab-box'>
        <div className={`tab-item ${curTab === TabType.REGISTER ? 'active' : ''}`} onClick={() => setCurTab(TabType.REGISTER)}>注册</div>
        <div className={`tab-item ${curTab !== TabType.REGISTER ? 'active' : ''}`} onClick={() => setCurTab(TabType.LOGIN)}>登录</div>
      </div>
      {
        // 注册页面
        curTab === TabType.REGISTER && <div className='register-content'>
          <div className='registry-content-item'>
            <div className='registry-username-box-label'>用户名</div>
            <Input placeholder='请输入用户名' onChange={(value) => handleRegistryFormChange('username', value)} clearable/>
          </div>
          <div className='registry-content-item'>
            <div className='registry-username-box-label'>密码</div>
            <div className='password-box'>
              <Input 
                placeholder='请输入密码' 
                onChange={(value) => handleRegistryFormChange('password', value)} 
                // type='password' 
                type={visible ? 'text' : 'password'}
                clearable
              />
              <div className='password-eye-icon' onClick={() => setVisible(!visible)}>
                {!visible ? <EyeInvisibleOutline /> : <EyeOutline />}
              </div>
            </div>
          </div>
          <div className='registry-content-item'>
            <div className='registry-username-box-label'>手机号</div>
            <Input placeholder='请输入手机号' onChange={(value) => handleRegistryFormChange('phone', value)} type='number' clearable/>
          </div>
          <div className='registry-button' onClick={handleRegistryClick}>注册</div>
        </div>
    }
    {
      curTab !== TabType.REGISTER && <div className='register-content'>
        {
          // 密码登陆
          curTab === TabType.LOGIN && <>
            <div className='registry-content-item'>
              <div className='registry-username-box-label'>手机号</div>
              <Input placeholder='请输入手机号' type='number' onChange={(value) => handleLoginFormChange('phone', value)} clearable/>
            </div>
            <div className='registry-content-item'>
              <div className='registry-username-box-label'>密码</div>
              <div className='password-box'>
                <Input 
                  placeholder='请输入密码' 
                  onChange={(value) => handleLoginFormChange('password', value)} 
                  type={visible ? 'text' : 'password'}
                  clearable
                />
                <div className='password-eye-icon' onClick={() => setVisible(!visible)}>
                  {!visible ? <EyeInvisibleOutline /> : <EyeOutline />}
                </div>
              </div>
            </div>
          </>
        }
        {
          // 验证码登陆
          curTab === TabType.VERIFY_CODE_LOGIN && <>
            <div className='registry-content-item'>
              <div className='registry-username-box-label'>手机号</div>
              <div className='verification-code-box'>
                <Input placeholder='请输入手机号' onChange={(value) => handleVerifyCodeFormChange('phone', value)} type='number' clearable/>
                <div 
                  className={`registry-get-verification-code ${isCountingDown ? 'disabled-registry-get-verification-code' : ''}`}
                  onClick={handleGetVerificationCode}
                  style={{ pointerEvents: isCountingDown ? 'none' : 'auto' }}
                >
                  {isCountingDown ? `获取验证码 ${countdown}s` : '获取验证码'}
                </div>
              </div>
            </div>
            <div className='registry-content-item'>
              <div className='registry-username-box-label'>短信验证码</div>
              <Input 
                placeholder='请输入验证码' 
                onChange={(value) => handleVerifyCodeFormChange('verifyCode', value)} 
                type='number' 
                clearable
              />
            </div>
          </>
        }
        {
          // 按钮组
          curTab === TabType.LOGIN && <div className='login-verfycode' onClick={() => setCurTab(TabType.VERIFY_CODE_LOGIN)}>验证码登陆?</div>
        }
        {
          // 按钮组
          curTab === TabType.VERIFY_CODE_LOGIN && <div className='login-verfycode' onClick={() => setCurTab(TabType.LOGIN)}>密码登陆?</div>
        }
        <div className='registry-button' onClick={handleLoginClick}>登录</div>
      </div>
    }
  </div>
}