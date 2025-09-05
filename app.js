// 食物卡路里扫描器 - 主要JavaScript功能
class FoodCalorieScanner {
    constructor() {
        this.currentImage = null;
        this.init();
    }

    init() {
        this.bindEvents();
        console.log('食物卡路里扫描器已初始化');
    }

    bindEvents() {
        // 获取DOM元素
        this.uploadArea = document.getElementById('uploadArea');
        this.fileInput = document.getElementById('fileInput');
        this.previewSection = document.getElementById('previewSection');
        this.previewImage = document.getElementById('previewImage');
        this.removeImage = document.getElementById('removeImage');
        this.analyzeBtn = document.getElementById('analyzeBtn');
        this.loadingSection = document.getElementById('loadingSection');
        this.resultsSection = document.getElementById('resultsSection');
        this.retrySection = document.getElementById('retrySection');
        this.retryBtn = document.getElementById('retryBtn');

        // 文件上传相关事件
        this.uploadArea.addEventListener('click', () => this.fileInput.click());
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        
        // 拖拽上传功能
        this.uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.uploadArea.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        this.uploadArea.addEventListener('drop', (e) => this.handleDrop(e));

        // 移除图片
        this.removeImage.addEventListener('click', () => this.removeImagePreview());

        // 分析按钮
        this.analyzeBtn.addEventListener('click', () => this.analyzeFood());

        // 重试按钮
        this.retryBtn.addEventListener('click', () => this.resetApp());

        // 阻止默认的拖拽行为
        document.addEventListener('dragover', (e) => e.preventDefault());
        document.addEventListener('drop', (e) => e.preventDefault());
    }

    // 处理文件选择
    handleFileSelect(event) {
        const file = event.target.files[0];
        if (file) {
            this.processFile(file);
        }
    }

    // 处理拖拽悬停
    handleDragOver(event) {
        event.preventDefault();
        this.uploadArea.classList.add('dragover');
    }

    // 处理拖拽离开
    handleDragLeave(event) {
        event.preventDefault();
        this.uploadArea.classList.remove('dragover');
    }

    // 处理拖拽放下
    handleDrop(event) {
        event.preventDefault();
        this.uploadArea.classList.remove('dragover');
        
        const files = event.dataTransfer.files;
        if (files.length > 0) {
            this.processFile(files[0]);
        }
    }

    // 处理文件
    processFile(file) {
        // 验证文件类型
        if (!this.isValidImageFile(file)) {
            this.showError('请上传有效的图片文件（JPG、PNG格式）');
            return;
        }

        // 验证文件大小 (最大5MB)
        if (file.size > 5 * 1024 * 1024) {
            this.showError('图片文件不能超过5MB');
            return;
        }

        this.currentImage = file;
        this.displayImagePreview(file);
    }

    // 验证图片文件类型
    isValidImageFile(file) {
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        return validTypes.includes(file.type);
    }

    // 显示图片预览
    displayImagePreview(file) {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            this.previewImage.src = e.target.result;
            this.previewSection.style.display = 'block';
            this.analyzeBtn.disabled = false;
            
            // 隐藏上传区域
            this.uploadArea.style.display = 'none';
        };
        
        reader.readAsDataURL(file);
    }

    // 移除图片预览
    removeImagePreview() {
        this.currentImage = null;
        this.previewSection.style.display = 'none';
        this.uploadArea.style.display = 'block';
        this.analyzeBtn.disabled = true;
        this.fileInput.value = '';
        
        // 隐藏结果区域
        this.hideResults();
    }

    // 分析食物
    async analyzeFood() {
        if (!this.currentImage) {
            this.showError('请先上传食物图片');
            return;
        }

        try {
            // 显示加载状态
            this.showLoading();
            
            // 模拟API调用 - 这里需要替换为实际的食物识别API
            const result = await this.callFoodRecognitionAPI(this.currentImage);
            
            // 显示结果
            this.displayResults(result);
            
        } catch (error) {
            this.hideLoading();
            this.showError('分析失败，请稍后重试: ' + error.message);
        }
    }

    // 调用食物识别API（模拟实现）
    async callFoodRecognitionAPI(imageFile) {
        // 模拟API延迟
        await this.delay(2000);
        
        // 这里是模拟数据，实际应该调用真实的食物识别API
        // 比如百度AI、腾讯云、阿里云的食物识别服务
        const mockResults = [
            {
                name: '白米饭',
                calories: 116,
                confidence: 0.92,
                nutrition: {
                    protein: '2.6g',
                    carbs: '25.9g',
                    fat: '0.3g',
                    fiber: '0.3g'
                }
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
                }
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
                }
            }
        ];

        // 随机选择一个结果
        const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
        
        return randomResult;
    }

    // 显示加载状态
    showLoading() {
        this.loadingSection.style.display = 'block';
        this.resultsSection.style.display = 'none';
        this.retrySection.style.display = 'none';
        this.analyzeBtn.disabled = true;
    }

    // 隐藏加载状态
    hideLoading() {
        this.loadingSection.style.display = 'none';
        this.analyzeBtn.disabled = false;
    }

    // 显示结果
    displayResults(result) {
        this.hideLoading();
        
        // 更新食物名称
        document.getElementById('foodName').textContent = result.name;
        
        // 更新卡路里
        document.getElementById('calorieNumber').textContent = result.calories;
        
        // 更新营养成分
        this.updateNutritionDetails(result.nutrition);
        
        // 更新信心度
        const confidencePercent = Math.round(result.confidence * 100);
        document.getElementById('confidenceValue').textContent = confidencePercent + '%';
        
        // 显示结果和重试按钮
        this.resultsSection.style.display = 'block';
        this.retrySection.style.display = 'block';
        
        // 添加动画效果
        this.resultsSection.style.animation = 'fadeIn 0.5s ease';
    }

    // 更新营养成分详情
    updateNutritionDetails(nutrition) {
        const nutritionContainer = document.getElementById('nutritionDetails');
        nutritionContainer.innerHTML = '';
        
        const nutritionLabels = {
            protein: '蛋白质',
            carbs: '碳水化合物',
            fat: '脂肪',
            fiber: '纤维'
        };
        
        for (const [key, value] of Object.entries(nutrition)) {
            const nutritionItem = document.createElement('div');
            nutritionItem.className = 'nutrition-item';
            
            nutritionItem.innerHTML = `
                <span class="nutrition-label">${nutritionLabels[key]}:</span>
                <span class="nutrition-value">${value}</span>
            `;
            
            nutritionContainer.appendChild(nutritionItem);
        }
    }

    // 隐藏结果
    hideResults() {
        this.resultsSection.style.display = 'none';
        this.retrySection.style.display = 'none';
    }

    // 重置应用
    resetApp() {
        this.removeImagePreview();
        this.hideLoading();
        this.hideResults();
    }

    // 显示错误信息
    showError(message) {
        alert(message);
        console.error('错误:', message);
    }

    // 延迟函数
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 实际API集成示例 - 百度AI食物识别API
    async callBaiduFoodAPI(imageFile) {
        // 注意：这需要有效的百度AI API密钥
        // 实际使用时需要：
        // 1. 注册百度AI开放平台账号
        // 2. 创建食物识别应用
        // 3. 获取API Key和Secret Key
        // 4. 实现OAuth 2.0认证流程
        
        try {
            // 1. 将图片转换为base64
            const base64Image = await this.fileToBase64(imageFile);
            
            // 2. 获取access_token（需要实现）
            // const accessToken = await this.getBaiduAccessToken();
            
            // 3. 调用食物识别API
            // const response = await fetch('https://aip.baidubce.com/rest/2.0/image-classify/v2/dish', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/x-www-form-urlencoded',
            //     },
            //     body: `access_token=${accessToken}&image=${encodeURIComponent(base64Image)}&top_num=5`
            // });
            
            // const data = await response.json();
            // return this.processBaiduResponse(data);
            
            // 暂时返回模拟数据
            throw new Error('API集成功能需要配置有效的API密钥');
            
        } catch (error) {
            throw new Error('API调用失败: ' + error.message);
        }
    }

    // 将文件转换为base64
    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const base64 = reader.result.split(',')[1];
                resolve(base64);
            };
            reader.onerror = error => reject(error);
        });
    }

    // 处理百度API响应
    processBaiduResponse(data) {
        if (data.error_code) {
            throw new Error('API错误: ' + data.error_msg);
        }
        
        if (data.result && data.result.length > 0) {
            const topResult = data.result[0];
            return {
                name: topResult.name,
                calories: topResult.calorie || 100, // 百度API可能不直接返回卡路里
                confidence: topResult.probability,
                nutrition: {
                    protein: '待查询',
                    carbs: '待查询',
                    fat: '待查询',
                    fiber: '待查询'
                }
            };
        }
        
        throw new Error('未能识别食物');
    }
}

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    const scanner = new FoodCalorieScanner();
    
    // 将实例暴露到全局作用域以便调试
    window.foodScanner = scanner;
});

// PWA支持 - Service Worker注册
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
