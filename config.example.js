// API配置文件模板
// 复制此文件为 config.js 并填入您的API密钥

const API_CONFIG = {
    // 百度AI食物识别API配置
    BAIDU: {
        API_KEY: 'uJVV8gNTgQG5fhLt3srNFI8m',
        SECRET_KEY: 'a0vBiJ6WvNm9jCFzOROEp2hNwZx4YMez',
        // API端点
        TOKEN_URL: 'https://aip.baidubce.com/oauth/2.0/token',
        DISH_URL: 'https://aip.baidubce.com/rest/2.0/image-classify/v2/dish',
        INGREDIENT_URL: 'https://aip.baidubce.com/rest/2.0/image-classify/v1/classify/ingredient'
    },

    // 腾讯云食物识别API配置
    TENCENT: {
        SECRET_ID: 'your_tencent_secret_id_here',
        SECRET_KEY: 'your_tencent_secret_key_here',
        REGION: 'ap-beijing',
        SERVICE: 'tiia',
        VERSION: '2019-05-29',
        ACTION: 'RecognizeFood'
    },

    // 阿里云视觉智能API配置
    ALIYUN: {
        ACCESS_KEY_ID: 'your_aliyun_access_key_id_here',
        ACCESS_KEY_SECRET: 'your_aliyun_access_key_secret_here',
        ENDPOINT: 'https://objectdet.cn-shanghai.aliyuncs.com',
        VERSION: '2019-12-30',
        ACTION: 'RecognizeFood'
    },

    // Google Cloud Vision API配置
    GOOGLE: {
        API_KEY: 'your_google_api_key_here',
        PROJECT_ID: 'your_project_id_here',
        ENDPOINT: 'https://vision.googleapis.com/v1/images:annotate'
    },

    // Azure Computer Vision API配置
    AZURE: {
        SUBSCRIPTION_KEY: 'your_azure_subscription_key_here',
        ENDPOINT: 'https://your-resource-name.cognitiveservices.azure.com/',
        API_VERSION: '2023-02-01-preview'
    },

    // 应用设置
    APP_SETTINGS: {
        // 默认使用的API服务商
        DEFAULT_PROVIDER: 'BAIDU',
        
        // 支持的图片格式
        SUPPORTED_FORMATS: ['image/jpeg', 'image/jpg', 'image/png'],
        
        // 最大文件大小 (字节)
        MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
        
        // API超时时间 (毫秒)
        API_TIMEOUT: 30000, // 30秒
        
        // 是否启用模拟模式（用于开发测试）
        MOCK_MODE: true
    },

    // 营养数据库配置
    NUTRITION_DB: {
        // 食物营养数据来源
        DATA_SOURCE: 'USDA', // USDA, Chinese_Food_DB, Custom
        
        // 自定义营养数据
        CUSTOM_FOODS: {
            '白米饭': {
                calories: 116,
                protein: 2.6,
                carbs: 25.9,
                fat: 0.3,
                fiber: 0.3,
                unit: '每100克'
            },
            '苹果': {
                calories: 52,
                protein: 0.3,
                carbs: 13.8,
                fat: 0.2,
                fiber: 2.4,
                unit: '每100克'
            }
            // 可以添加更多自定义食物数据
        }
    }
};

// 导出配置
if (typeof module !== 'undefined' && module.exports) {
    // Node.js环境
    module.exports = API_CONFIG;
} else {
    // 浏览器环境
    window.API_CONFIG = API_CONFIG;
}

/* 
使用说明：
1. 复制此文件为 config.js
2. 填入您的API密钥和配置
3. 在app.js中导入配置：
   - 浏览器: <script src="config.js"></script>
   - Node.js: const config = require('./config.js');

注意事项：
- 不要将包含真实API密钥的config.js文件提交到版本控制系统
- config.js已在.gitignore中被忽略
- 生产环境建议使用环境变量来管理API密钥
*/
