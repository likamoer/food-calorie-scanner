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

async function comprehensiveDiagnosis() {
    const env = loadEnvFile();
    const API_KEY = env.BAIDU_API_KEY;
    const SECRET_KEY = env.BAIDU_SECRET_KEY;
    
    console.log('🔍 开始全面诊断百度AI API问题...\n');
    
    // 第1步：验证密钥格式
    console.log('📋 第1步：验证API密钥格式');
    console.log(`API_KEY 长度: ${API_KEY ? API_KEY.length : 0} (标准长度: 24)`);
    console.log(`SECRET_KEY 长度: ${SECRET_KEY ? SECRET_KEY.length : 0} (标准长度: 32)`);
    console.log(`API_KEY 预览: ${API_KEY ? API_KEY.substring(0, 8) + '***' : '未设置'}`);
    console.log(`SECRET_KEY 预览: ${SECRET_KEY ? SECRET_KEY.substring(0, 8) + '***' : '未设置'}\n`);
    
    if (!API_KEY || !SECRET_KEY) {
        console.log('❌ API密钥未正确设置');
        return;
    }
    
    try {
        // 第2步：测试Token获取
        console.log('🔑 第2步：测试Access Token获取...');
        const tokenStartTime = Date.now();
        
        const tokenResponse = await axios.post(
            'https://aip.baidubce.com/oauth/2.0/token',
            null,
            {
                params: {
                    grant_type: 'client_credentials',
                    client_id: API_KEY,
                    client_secret: SECRET_KEY
                },
                timeout: 10000
            }
        );
        
        const tokenTime = Date.now() - tokenStartTime;
        console.log(`Token请求耗时: ${tokenTime}ms`);
        
        if (tokenResponse.data.error) {
            console.log(`❌ Token获取失败: ${tokenResponse.data.error}`);
            console.log(`错误描述: ${tokenResponse.data.error_description}`);
            return;
        }
        
        const accessToken = tokenResponse.data.access_token;
        console.log(`✅ Token获取成功`);
        console.log(`Token类型: ${tokenResponse.data.token_type}`);
        console.log(`Token有效期: ${tokenResponse.data.expires_in}秒 (${Math.round(tokenResponse.data.expires_in/3600)}小时)`);
        console.log(`Token预览: ${accessToken.substring(0, 20)}...\n`);
        
        // 第3步：检查账户权限和配额
        console.log('👤 第3步：检查账户权限和配额...');
        
        // 尝试调用一个简单的API来检查权限
        try {
            console.log('尝试调用菜品识别API...');
            
            // 使用一个很小的测试图片（1x1像素PNG）
            const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
            
            const apiStartTime = Date.now();
            const recognitionResponse = await axios.post(
                'https://aip.baidubce.com/rest/2.0/image-classify/v2/dish',
                `image=${encodeURIComponent(testImageBase64)}&top_num=1`,
                {
                    params: {
                        access_token: accessToken
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    timeout: 15000
                }
            );
            
            const apiTime = Date.now() - apiStartTime;
            console.log(`API请求耗时: ${apiTime}ms`);
            console.log('完整API响应:', JSON.stringify(recognitionResponse.data, null, 2));
            
            if (recognitionResponse.data.error_code) {
                console.log(`❌ API调用失败:`);
                console.log(`错误代码: ${recognitionResponse.data.error_code}`);
                console.log(`错误消息: ${recognitionResponse.data.error_msg}`);
                
                // 详细的错误代码分析
                switch (recognitionResponse.data.error_code) {
                    case 4:
                        console.log(`\n🔧 错误分析: 请求频率超限`);
                        console.log(`解决方案: 请等待一段时间后再试，或检查QPS限制`);
                        break;
                    case 6:
                        console.log(`\n🔧 错误分析: 服务配额不足`);
                        console.log(`可能原因:`);
                        console.log(`1. 免费额度已用完 (每月500次)`);
                        console.log(`2. 服务虽然开通但未激活`);
                        console.log(`3. 账户余额不足`);
                        break;
                    case 17:
                        console.log(`\n🔧 错误分析: 服务未开通`);
                        console.log(`解决方案: 确认在百度AI控制台中已开通"菜品识别"服务`);
                        break;
                    case 18:
                        console.log(`\n🔧 错误分析: QPS超限`);
                        console.log(`解决方案: 降低请求频率到每秒2次以下`);
                        break;
                    case 110:
                        console.log(`\n🔧 错误分析: Access Token无效或过期`);
                        console.log(`解决方案: 重新获取Access Token`);
                        break;
                    case 216015:
                        console.log(`\n🔧 错误分析: 模块关闭`);
                        console.log(`解决方案: 在控制台检查服务状态并重新启用`);
                        break;
                    case 216100:
                        console.log(`\n🔧 错误分析: 图片质量过低或格式不支持`);
                        break;
                    case 216101:
                        console.log(`\n🔧 错误分析: 图片中没有检测到菜品`);
                        break;
                    case 282000:
                        console.log(`\n🔧 错误分析: 服务未开通或已过期`);
                        console.log(`解决方案: 在百度AI控制台中重新开通菜品识别服务`);
                        break;
                    default:
                        console.log(`\n🔧 未知错误代码: ${recognitionResponse.data.error_code}`);
                        console.log(`请查看百度AI官方文档获取更多信息`);
                }
                
                console.log(`\n📚 参考文档:`);
                console.log(`- 百度AI控制台: https://console.bce.baidu.com/ai/`);
                console.log(`- 菜品识别文档: https://ai.baidu.com/ai-doc/IMAGERECOGNITION/Xk3bcxe21`);
                console.log(`- 错误代码参考: https://ai.baidu.com/ai-doc/REFERENCE/Ck3dwjgev`);
                
            } else {
                console.log(`✅ API调用成功!`);
                console.log(`识别结果数量: ${recognitionResponse.data.result_num || 0}`);
                if (recognitionResponse.data.result && recognitionResponse.data.result.length > 0) {
                    console.log(`识别结果:`, recognitionResponse.data.result[0]);
                }
            }
            
        } catch (apiError) {
            console.log(`❌ API调用异常: ${apiError.message}`);
            if (apiError.response) {
                console.log(`HTTP状态码: ${apiError.response.status}`);
                console.log(`HTTP状态消息: ${apiError.response.statusText}`);
                console.log(`响应头:`, apiError.response.headers);
                console.log(`响应数据:`, apiError.response.data);
            }
            if (apiError.code) {
                console.log(`错误代码: ${apiError.code}`);
            }
        }
        
        // 第4步：检查应用配置建议
        console.log(`\n🛠️ 第4步：应用配置检查建议`);
        console.log(`请确认以下设置:`);
        console.log(`1. 百度AI控制台 -> 应用列表 -> 你的应用`);
        console.log(`2. 确认"菜品识别"服务已开通并激活`);
        console.log(`3. 检查服务配额和余额情况`);
        console.log(`4. 确认API Key和Secret Key复制正确`);
        console.log(`5. 检查应用状态是否正常`);
        
    } catch (error) {
        console.log(`❌ 诊断过程中发生错误: ${error.message}`);
        if (error.response) {
            console.log(`HTTP状态码: ${error.response.status}`);
            console.log(`响应数据:`, error.response.data);
        }
        if (error.code === 'ENOTFOUND') {
            console.log(`网络连接问题: 无法连接到百度AI服务器`);
        } else if (error.code === 'ETIMEDOUT') {
            console.log(`请求超时: 网络连接缓慢或服务器响应慢`);
        }
    }
}

// 运行诊断
comprehensiveDiagnosis().catch(error => {
    console.error('脚本执行错误:', error);
    process.exit(1);
});
