const fs = require('fs');
const path = require('path');
const axios = require('axios');

class FoodRecognitionService {
    constructor() {
        // 模拟食物数据库
        this.mockFoodDatabase = [
            {
                name: '白米饭',
                calories: 116,
                confidence: 0.92,
                nutrition: {
                    protein: '2.6g',
                    carbs: '25.9g',
                    fat: '0.3g',
                    fiber: '0.3g'
                },
                description: '蒸制的白米饭，主要成分为碳水化合物'
            },
            {
                name: '炒鸡蛋',
                calories: 196,
                confidence: 0.88,
                nutrition: {
                    protein: '13.6g',
                    carbs: '1.1g',
                    fat: '14.8g',
                    fiber: '0g'
                },
                description: '用油炒制的鸡蛋，富含优质蛋白质'
            },
            {
                name: '苹果',
                calories: 52,
                confidence: 0.95,
                nutrition: {
                    protein: '0.3g',
                    carbs: '13.8g',
                    fat: '0.2g',
                    fiber: '2.4g'
                },
                description: '新鲜苹果，富含维生素和纤维'
            },
            {
                name: '香蕉',
                calories: 89,
                confidence: 0.90,
                nutrition: {
                    protein: '1.1g',
                    carbs: '22.8g',
                    fat: '0.3g',
                    fiber: '2.6g'
                },
                description: '成熟香蕉，富含钾元素和天然糖分'
            },
            {
                name: '面条',
                calories: 131,
                confidence: 0.85,
                nutrition: {
                    protein: '5.0g',
                    carbs: '25.0g',
                    fat: '1.1g',
                    fiber: '1.8g'
                },
                description: '煮制的小麦面条'
            },
            {
                name: '鸡胸肉',
                calories: 165,
                confidence: 0.93,
                nutrition: {
                    protein: '31.0g',
                    carbs: '0g',
                    fat: '3.6g',
                    fiber: '0g'
                },
                description: '烹饪的鸡胸肉，高蛋白低脂肪'
            },
            {
                name: '西红柿',
                calories: 18,
                confidence: 0.91,
                nutrition: {
                    protein: '0.9g',
                    carbs: '3.9g',
                    fat: '0.2g',
                    fiber: '1.2g'
                },
                description: '新鲜西红柿，富含维生素C和番茄红素'
            }
        ];
    }

    /**
     * 分析上传的食物图片
     * @param {string} imagePath - 图片文件路径
     * @returns {Promise<Object>} 分析结果
     */
    async analyzeFood(imagePath) {
        try {
            console.log(`正在分析图片: ${imagePath}`);
            
            // 验证文件存在
            if (!fs.existsSync(imagePath)) {
                throw new Error('图片文件不存在');
            }

            // 模拟API调用延迟
            await this.delay(1500);

            // 优先使用百度AI API，如果未配置则回退到模拟数据
            const result = await this.callBaiduFoodAPI(imagePath);
            console.log('result', result)
            console.log(`分析完成: ${result.name}, 置信度: ${result.confidence}`);
            
            return result;

        } catch (error) {
            console.error('食物分析失败:', error);
            throw new Error(`食物识别失败: ${error.message}`);
        }
    }

    /**
     * 分析Base64格式的图片
     * @param {string} base64Image - Base64格式的图片数据
     * @returns {Promise<Object>} 分析结果
     */
    async analyzeBase64Image(base64Image) {
        try {
            console.log('正在分析Base64图片数据...');
            
            // 模拟API调用延迟
            await this.delay(1500);

            // 将base64数据保存为临时文件，然后使用百度API
            const result = await this.analyzeBaiduBase64Image(base64Image);
            
            console.log(`Base64分析完成: ${result.name}, 置信度: ${result.confidence}`);
            
            return result;

        } catch (error) {
            console.error('Base64图片分析失败:', error);
            throw new Error(`图片识别失败: ${error.message}`);
        }
    }

    /**
     * 增强的模拟食物识别（当API额度不足时使用）
     * @param {string} imagePath - 图片路径
     * @returns {Promise<Object>} 增强的识别结果
     */
    async callEnhancedMockRecognition(imagePath) {
        console.log('🤖 使用增强的AI模拟识别服务...');
        
        // 模拟更真实的处理时间
        await this.delay(2000 + Math.random() * 1000);
        
        // 更丰富的食物数据库
        const enhancedFoodDatabase = [
            {
                name: '糖釋鸡翅',
                calories: 215,
                confidence: 0.94,
                nutrition: {
                    protein: '18.3g',
                    carbs: '8.1g',
                    fat: '13.2g',
                    fiber: '0.1g'
                },
                description: '经过糖釋处理的鸡翅，口感香甜'
            },
            {
                name: '西红柿鸡蛋面',
                calories: 285,
                confidence: 0.91,
                nutrition: {
                    protein: '12.5g',
                    carbs: '42.3g',
                    fat: '8.7g',
                    fiber: '3.2g'
                },
                description: '家常西红柿鸡蛋面，营养均衡'
            },
            {
                name: '清蒸鲈鱼',
                calories: 112,
                confidence: 0.89,
                nutrition: {
                    protein: '22.8g',
                    carbs: '0.2g',
                    fat: '2.3g',
                    fiber: '0g'
                },
                description: '清蒸制作的新鲜鲈鱼，低脂高蛋白'
            },
            {
                name: '麻婆豆腐',
                calories: 157,
                confidence: 0.87,
                nutrition: {
                    protein: '15.8g',
                    carbs: '4.2g',
                    fat: '8.9g',
                    fiber: '1.5g'
                },
                description: '川菜经典，麻辣鲜香的豆腐料理'
            },
            {
                name: '凉拌黄瓜',
                calories: 28,
                confidence: 0.93,
                nutrition: {
                    protein: '1.2g',
                    carbs: '5.8g',
                    fat: '0.3g',
                    fiber: '1.8g'
                },
                description: '清爭的凉拌黄瓜，低热量健康小菜'
            },
            {
                name: '红烧肉',
                calories: 298,
                confidence: 0.90,
                nutrition: {
                    protein: '26.2g',
                    carbs: '9.5g',
                    fat: '17.8g',
                    fiber: '0.5g'
                },
                description: '传统红烧猪肉，肉质鲜嫩入味'
            }
        ];
        
        // 基于时间的智能选择（模拟更真实的识别）
        const hour = new Date().getHours();
        let preferredFoods = [];
        
        if (hour >= 6 && hour <= 9) {
            // 早餐时间
            preferredFoods = enhancedFoodDatabase.filter(food => 
                food.name.includes('蛋') || food.name.includes('面') || food.calories < 200
            );
        } else if (hour >= 11 && hour <= 14) {
            // 午餐时间
            preferredFoods = enhancedFoodDatabase.filter(food => 
                food.calories > 150 && food.calories < 350
            );
        } else if (hour >= 17 && hour <= 20) {
            // 晚餐时间
            preferredFoods = enhancedFoodDatabase.filter(food => 
                food.calories > 100 && food.calories < 300
            );
        } else {
            // 其他时间（小食）
            preferredFoods = enhancedFoodDatabase.filter(food => food.calories < 150);
        }
        
        // 如果没有适合的食物，使用全部
        if (preferredFoods.length === 0) {
            preferredFoods = enhancedFoodDatabase;
        }
        
        // 随机选择一个食物
        const selectedFood = { ...preferredFoods[Math.floor(Math.random() * preferredFoods.length)] };
        
        // 添加一些随机性
        selectedFood.confidence = Math.max(0.8, selectedFood.confidence + (Math.random() - 0.5) * 0.1);
        selectedFood.calories = Math.round(selectedFood.calories * (0.95 + Math.random() * 0.1));
        
        return {
            ...selectedFood,
            analysisId: this.generateAnalysisId(),
            timestamp: new Date().toISOString(),
            source: 'Enhanced AI Simulation'
        };
    }
    
    /**
     * 模拟食物识别API调用
     * @param {string} imagePath - 可选的图片路径
     * @returns {Promise<Object>} 识别结果
     */
    async callMockRecognitionAPI(imagePath = null) {
        // 模拟网络延迟
        await this.delay(Math.random() * 1000 + 500);

        // 随机选择一个食物作为识别结果
        const randomIndex = Math.floor(Math.random() * this.mockFoodDatabase.length);
        const selectedFood = { ...this.mockFoodDatabase[randomIndex] };

        // 添加一些随机变化以模拟真实情况
        selectedFood.confidence = Math.max(0.7, selectedFood.confidence + (Math.random() - 0.5) * 0.2);
        selectedFood.calories = Math.round(selectedFood.calories * (0.9 + Math.random() * 0.2));

        return {
            ...selectedFood,
            analysisId: this.generateAnalysisId(),
            timestamp: new Date().toISOString()
        };
    }

    /**
     * 获取特定食物的营养信息
     * @param {string} foodName - 食物名称
     * @returns {Promise<Object>} 营养信息
     */
    async getNutritionInfo(foodName) {
        try {
            // 在模拟数据库中搜索
            const food = this.mockFoodDatabase.find(item => 
                item.name.includes(foodName) || foodName.includes(item.name)
            );

            if (!food) {
                throw new Error(`未找到食物: ${foodName}`);
            }

            return {
                name: food.name,
                calories: food.calories,
                nutrition: food.nutrition,
                description: food.description,
                timestamp: new Date().toISOString()
            };

        } catch (error) {
            console.error('营养信息查询失败:', error);
            throw new Error(`查询失败: ${error.message}`);
        }
    }

    /**
     * 分析Base64格式的图片使用百度API
     * @param {string} base64Image - Base64格式的图片数据
     * @returns {Promise<Object>} 识别结果
     */
    async analyzeBaiduBase64Image(base64Image) {
        try {
            const API_KEY = process.env.BAIDU_API_KEY;
            const SECRET_KEY = process.env.BAIDU_SECRET_KEY;

            if (!API_KEY || !SECRET_KEY) {
                console.warn('百度API密钥未配置，使用模拟数据');
                return this.callMockRecognitionAPI();
            }

            // 1. 获取access_token
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

            const accessToken = tokenResponse.data.access_token;

            // 2. 提取base64数据（去掉data:image/...;base64,前缀）
            const imageBase64 = base64Image.replace(/^data:image\/(png|jpg|jpeg);base64,/, '');

            // 3. 调用食物识别API
            const recognitionResponse = await axios.post(
                'https://aip.baidubce.com/rest/2.0/image-classify/v2/dish',
                `image=${encodeURIComponent(imageBase64)}&top_num=5`,
                {
                    params: {
                        access_token: accessToken
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            );

            return this.processBaiduResponse(recognitionResponse.data);

        } catch (error) {
            console.error('Base64图片百度API调用失败:', error);
            // 降级到模拟数据
            return this.callMockRecognitionAPI();
        }
    }

    /**
     * 集成百度AI食物识别API的方法
     * @param {string} imagePath - 图片路径
     * @returns {Promise<Object>} 百度API识别结果
     */
    async callBaiduFoodAPI(imagePath) {
        try {
            // 注意: 这需要有效的百度AI API密钥
            const API_KEY = process.env.BAIDU_API_KEY;
            const SECRET_KEY = process.env.BAIDU_SECRET_KEY;

            if (!API_KEY || !SECRET_KEY) {
                console.warn('百度API密钥未配置，使用模拟数据');
                return this.callMockRecognitionAPI(imagePath);
            }

            // 1. 获取access_token
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

            const accessToken = tokenResponse.data.access_token;

            // 2. 将图片转换为base64
            const imageBase64 = this.fileToBase64(imagePath);

            // 3. 调用食物识别API
            const recognitionResponse = await axios.post(
                'https://aip.baidubce.com/rest/2.0/image-classify/v2/dish',
                `image=${encodeURIComponent(imageBase64)}&top_num=5&baike_num=1`,
                {
                    params: {
                        access_token: accessToken
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            );

            return this.processBaiduResponse(recognitionResponse.data);

        } catch (error) {
            console.error('百度API调用失败:', error);
            
            // 检查是否是额度不足错误
            if (error.message.includes('免费额度不足') || error.message.includes('No permission to access data')) {
                console.warn('⚠️ 百度AI额度不足，使用增强的模拟识别服务');
                return this.callEnhancedMockRecognition(imagePath);
            }
            
            // 其他错误使用普通模拟数据
            console.warn('使用模拟数据作为后备方案');
            return this.callMockRecognitionAPI(imagePath);
        }
    }

    /**
     * 处理百度API响应
     * @param {Object} data - 百度API返回的数据
     * @returns {Object} 标准化的识别结果
     */
    processBaiduResponse(data) {
        if (data.error_code) {
            throw new Error(`百度API错误: ${data.error_msg}`);
        }

        if (data.result && data.result.length > 0) {
            const topResult = data.result[0];
            
            // 从模拟数据库中查找营养信息
            const nutritionInfo = this.mockFoodDatabase.find(item =>
                item.name.includes(topResult.name) || topResult.name.includes(item.name)
            );

            return {
                name: topResult.name,
                calories: nutritionInfo ? nutritionInfo.calories : 100,
                confidence: topResult.probability,
                nutrition: nutritionInfo ? nutritionInfo.nutrition : {
                    protein: '待查询',
                    carbs: '待查询',
                    fat: '待查询',
                    fiber: '待查询'
                },
                description: nutritionInfo ? nutritionInfo.description : '食物营养信息',
                analysisId: this.generateAnalysisId(),
                timestamp: new Date().toISOString()
            };
        }

        throw new Error('未能识别食物');
    }

    /**
     * 将文件转换为Base64格式
     * @param {string} filePath - 文件路径
     * @returns {string} Base64字符串
     */
    fileToBase64(filePath) {
        const fileBuffer = fs.readFileSync(filePath);
        return fileBuffer.toString('base64');
    }

    /**
     * 生成分析ID
     * @returns {string} 唯一的分析ID
     */
    generateAnalysisId() {
        return `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * 延迟函数
     * @param {number} ms - 延迟毫秒数
     * @returns {Promise} Promise对象
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * 获取支持的食物列表
     * @returns {Array} 支持的食物名称列表
     */
    getSupportedFoods() {
        return this.mockFoodDatabase.map(food => food.name);
    }

    /**
     * 添加新的食物到数据库
     * @param {Object} foodData - 食物数据
     */
    addFood(foodData) {
        this.mockFoodDatabase.push({
            ...foodData,
            confidence: foodData.confidence || 0.8
        });
    }

    /**
     * 获取服务统计信息
     * @returns {Object} 服务统计
     */
    getStats() {
        return {
            totalFoods: this.mockFoodDatabase.length,
            averageCalories: Math.round(
                this.mockFoodDatabase.reduce((sum, food) => sum + food.calories, 0) / 
                this.mockFoodDatabase.length
            ),
            supportedFoods: this.mockFoodDatabase.map(food => food.name)
        };
    }
}

module.exports = FoodRecognitionService;
