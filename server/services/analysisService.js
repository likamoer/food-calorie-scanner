const { getDatabase } = require('../database/db');

/**
 * 分析记录服务类
 * 处理分析结果的存储和查询
 */
class AnalysisService {
    constructor() {
        this.db = getDatabase();
    }

    /**
     * 存储分析结果
     * @param {number} userId - 用户ID
     * @param {string} imageData - 图片数据(Base64)
     * @param {string} foodType - 食物类型
     * @param {Object} analyzeResult - 分析结果
     * @returns {Promise<Object>} 存储的记录信息
     */
    async storeAnalysisResult(userId, imageData, foodType, analyzeResult) {
        if (!userId || typeof userId !== 'number' || userId <= 0) {
            throw new Error('无效的用户ID');
        }

        if (!imageData || typeof imageData !== 'string') {
            throw new Error('图片数据不能为空');
        }

        if (!analyzeResult || typeof analyzeResult !== 'object') {
            throw new Error('分析结果不能为空');
        }

        // 提取食物名称（优先使用name，然后是foodName）
        const foodName = analyzeResult.name || analyzeResult.foodName || '未知食物';
        
        // 生成记录ID
        const recordId = this.generateRecordId();

        // 将分析结果转换为JSON字符串存储
        const analyzeResultJson = JSON.stringify(analyzeResult);

        // 插入记录
        const sql = `
            INSERT INTO analysis_records (recordId, userId, imageData, foodName, foodType, analyzeResult, analyzeTime)
            VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
        `;

        const result = await this.db.run(sql, [
            recordId,
            userId,
            imageData,
            foodName,
            foodType || '',
            analyzeResultJson
        ]);

        return {
            recordId,
            analyzeTime: new Date().toISOString()
        };
    }

    /**
     * 获取历史记录列表
     * @param {number} userId - 用户ID
     * @param {number} page - 页码
     * @param {number} pageSize - 每页大小
     * @returns {Promise<Object>} 记录列表
     */
    async getHistoryList(userId, page = 1, pageSize = 10) {
        if (!userId || typeof userId !== 'number' || userId <= 0) {
            throw new Error('无效的用户ID');
        }

        const offset = (page - 1) * pageSize;

        // 查询总数
        const countSql = 'SELECT COUNT(*) as total FROM analysis_records WHERE userId = ?';
        const countResult = await this.db.get(countSql, [userId]);
        const total = countResult.total;

        // 查询记录列表
        const listSql = `
            SELECT 
                recordId,
                foodName,
                foodType,
                analyzeResult,
                analyzeTime
            FROM analysis_records 
            WHERE userId = ?
            ORDER BY analyzeTime DESC
            LIMIT ? OFFSET ?
        `;
        const records = await this.db.all(listSql, [userId, pageSize, offset]);

        // 处理记录数据
        const processedRecords = records.map(record => {
            try {
                const analyzeResult = JSON.parse(record.analyzeResult);
                return {
                    recordId: record.recordId,
                    foodName: record.foodName,
                    foodType: record.foodType || '',
                    calories: analyzeResult.calories || 0,
                    analyzeTime: record.analyzeTime
                };
            } catch (error) {
                console.error('解析分析结果失败:', error);
                return {
                    recordId: record.recordId,
                    foodName: record.foodName,
                    foodType: record.foodType || '',
                    calories: 0,
                    analyzeTime: record.analyzeTime
                };
            }
        });

        return {
            total,
            page,
            pageSize,
            list: processedRecords
        };
    }

    /**
     * 根据记录ID获取记录详情
     * @param {number} recordId - 记录ID
     * @returns {Promise<Object>} 记录详情
     */
    async getRecordById(recordId) {
        if (!recordId) {
            throw new Error('记录ID不能为空');
        }

        const sql = 'SELECT * FROM analysis_records WHERE recordId = ?';
        const record = await this.db.get(sql, [recordId]);

        if (!record) {
            throw new Error('记录不存在');
        }

        // 解析分析结果
        let analyzeResult = {};
        try {
            analyzeResult = JSON.parse(record.analyzeResult);
        } catch (error) {
            console.error('解析分析结果失败:', error);
        }

        return {
            recordId: record.recordId,
            userId: record.userId,
            foodName: record.foodName,
            foodType: record.foodType,
            analyzeResult,
            imageData: record.imageData,
            analyzeTime: record.analyzeTime
        };
    }

    /**
     * 生成记录ID
     * @returns {number} 记录ID
     */
    generateRecordId() {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 10000);
        return parseInt(`${timestamp}${random}`.slice(-15));
    }
}

module.exports = AnalysisService;

