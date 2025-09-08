const axios = require('axios');
const fs = require('fs');
const path = require('path');

// 手动读取.env文件
function loadEnvFile() {
    const envPath = path.join(__dirname, 'server', '.env');
    if (!fs.existsSync(envPath)) {
        return {};
    }
    
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envVars = {};
    
    envContent.split('\n').forEach(line => {
        line = line.trim();
        if (line && !line.startsWith('#')) {
            const [key, value] = line.split('=', 2);
            if (key && value) {
                envVars[key.trim()] = value.trim();
            }
        }
    });
    
    return envVars;
}

async function debugBaiduAPI() {
    const env = loadEnvFile();
    const API_KEY = env.BAIDU_API_KEY;
    const SECRET_KEY = env.BAIDU_SECRET_KEY;
    
    console.log('🔍 开始调试百度AI API...\n');
    
    // 检查环境变量
    console.log('📋 环境变量检查:');
    console.log(`API_KEY: ${API_KEY ? API_KEY.substring(0, 8) + '***' : '未设置'}`);
    console.log(`SECRET_KEY: ${SECRET_KEY ? SECRET_KEY.substring(0, 8) + '***' : '未设置'}\n`);
    
    if (!API_KEY || !SECRET_KEY) {
        console.log('❌ 环境变量未正确设置');
        return;
    }
    
    try {
        // 步骤1: 获取Access Token
        console.log('🔑 步骤1: 获取Access Token...');
        const tokenResponse = await axios.post(
            'https://aip.baidubce.com/oauth/2.0/token',
            null,
            {
                params: {
                    grant_type: 'client_credentials',
                    client_id: API_KEY,
                    client_secret: SECRET_KEY
                }
            }
        );
        
        if (tokenResponse.data.error) {
            console.log(`❌ 获取Token失败: ${tokenResponse.data.error}`);
            console.log(`错误描述: ${tokenResponse.data.error_description}`);
            return;
        }
        
        const accessToken = tokenResponse.data.access_token;
        console.log(`✅ Token获取成功: ${accessToken.substring(0, 20)}...`);
        console.log(`Token过期时间: ${tokenResponse.data.expires_in}秒\n`);
        
        // 步骤2: 测试菜品识别API权限
        console.log('🍽️ 步骤2: 检查菜品识别API权限...');
        
        // 创建一个简单的测试图片 (1x1像素的PNG，base64编码)
        const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
        
        try {
            const recognitionResponse = await axios.post(
                'https://aip.baidubce.com/rest/2.0/image-classify/v2/dish',
                `image=${encodeURIComponent(testImageBase64)}&top_num=5`,
                {
                    params: {
                        access_token: accessToken
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            );
            
            if (recognitionResponse.data.error_code) {
                console.log(`❌ API调用失败: ${recognitionResponse.data.error_msg}`);
                console.log(`错误代码: ${recognitionResponse.data.error_code}`);
                
                // 分析错误类型
                switch (recognitionResponse.data.error_code) {
                    case 4:
                        console.log(`\n🔧 解决方案: 请求频率超限，请降低请求频率`);
                        break;
                    case 6:
                        console.log(`\n🔧 解决方案: 免费额度不足，请在百度AI控制台充值或等待下月重置`);
                        break;
                    case 17:
                        console.log(`\n🔧 解决方案: 请在百度AI控制台开通"菜品识别"服务`);
                        break;
                    case 18:
                        console.log(`\n🔧 解决方案: 请求频率超限，QPS超限制`);
                        break;
                    case 110:
                        console.log(`\n🔧 解决方案: Access Token已过期，请重新获取`);
                        break;
                    case 216015:
                        console.log(`\n🔧 解决方案: 模块关闭，请在控制台开启对应服务`);
                        break;
                    case 282000:
                        console.log(`\n🔧 解决方案: 服务未开通，请在百度AI控制台开通菜品识别服务`);
                        break;
                    default:
                        console.log(`\n🔧 请参考百度AI文档查看错误代码: ${recognitionResponse.data.error_code}`);
                }
                
                console.log(`\n📖 详细步骤:`);
                console.log(`1. 访问 https://console.bce.baidu.com/ai/`);
                console.log(`2. 选择"图像识别" -> "菜品识别"`);
                console.log(`3. 确认服务已开通且有可用额度`);
                console.log(`4. 检查应用配置和权限设置`);
                
            } else {
                console.log(`✅ API调用成功!`);
                console.log(`识别结果数量: ${recognitionResponse.data.result_num || 0}`);
            }
            
        } catch (apiError) {
            console.log(`❌ API请求异常: ${apiError.message}`);
            if (apiError.response) {
                console.log(`HTTP状态码: ${apiError.response.status}`);
                console.log(`响应数据:`, apiError.response.data);
            }
        }
        
    } catch (error) {
        console.log(`❌ 调试过程中发生错误: ${error.message}`);
        if (error.response) {
            console.log(`HTTP状态码: ${error.response.status}`);
            console.log(`响应数据:`, error.response.data);
        }
    }
}

// 运行调试
debugBaiduAPI();
