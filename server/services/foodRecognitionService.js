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

            // 这里可以集成真实的AI识别API
            // 目前使用模拟数据进行演示
            const result = await this.callMockRecognitionAPI(imagePath);
            
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

            // 模拟分析过程
            const result = await this.callMockRecognitionAPI();
            
            console.log(`Base64分析完成: ${result.name}, 置信度: ${result.confidence}`);
            
            return result;

        } catch (error) {
            console.error('Base64图片分析失败:', error);
            throw new Error(`图片识别失败: ${error.message}`);
        }
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
     * 集成百度AI食物识别API的示例方法
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
            console.error('百度API调用失败:', error);
            // 降级到模拟数据
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
