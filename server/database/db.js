const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { DB_PATH } = require('./init');

/**
 * 数据库工具类
 * 封装数据库连接和基础CRUD操作
 */
class Database {
    constructor() {
        this.db = null;
        this.isConnected = false;
    }

    /**
     * 连接数据库
     * @returns {Promise<void>}
     */
    async connect() {
        if (this.isConnected && this.db) {
            return;
        }

        return new Promise((resolve, reject) => {
            this.db = new sqlite3.Database(DB_PATH, (err) => {
                if (err) {
                    console.error('❌ 数据库连接失败:', err.message);
                    reject(err);
                    return;
                }
                this.isConnected = true;
                console.log('✅ 数据库连接成功');
                
                // 启用外键约束
                this.db.run('PRAGMA foreign_keys = ON', (err) => {
                    if (err) {
                        console.error('❌ 启用外键约束失败:', err.message);
                    }
                    resolve();
                });
            });
        });
    }

    /**
     * 关闭数据库连接
     * @returns {Promise<void>}
     */
    async close() {
        if (!this.isConnected || !this.db) {
            return;
        }

        return new Promise((resolve, reject) => {
            this.db.close((err) => {
                if (err) {
                    console.error('❌ 关闭数据库连接失败:', err.message);
                    reject(err);
                    return;
                }
                this.isConnected = false;
                console.log('✅ 数据库连接已关闭');
                resolve();
            });
        });
    }

    /**
     * 执行SELECT查询
     * @param {string} sql - SQL查询语句
     * @param {Array} params - 查询参数
     * @returns {Promise<Array>} 查询结果
     */
    async get(sql, params = []) {
        await this.connect();
        
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(row);
            });
        });
    }

    /**
     * 执行SELECT查询(返回多条记录)
     * @param {string} sql - SQL查询语句
     * @param {Array} params - 查询参数
     * @returns {Promise<Array>} 查询结果
     */
    async all(sql, params = []) {
        await this.connect();
        
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(rows || []);
            });
        });
    }

    /**
     * 执行INSERT/UPDATE/DELETE语句
     * @param {string} sql - SQL语句
     * @param {Array} params - 参数
     * @returns {Promise<{lastID: number, changes: number}>}
     */
    async run(sql, params = []) {
        await this.connect();
        
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function(err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve({
                    lastID: this.lastID,
                    changes: this.changes
                });
            });
        });
    }

    /**
     * 执行事务
     * @param {Function} callback - 包含事务逻辑的回调函数
     * @returns {Promise}
     */
    async transaction(callback) {
        await this.connect();
        
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.run('BEGIN TRANSACTION', (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    // 执行事务逻辑
                    callback(this)
                        .then((result) => {
                            this.db.run('COMMIT', (err) => {
                                if (err) {
                                    reject(err);
                                    return;
                                }
                                resolve(result);
                            });
                        })
                        .catch((err) => {
                            // 回滚事务
                            this.db.run('ROLLBACK', () => {
                                reject(err);
                            });
                        });
                });
            });
        });
    }

    /**
     * 批量执行SQL语句
     * @param {string} sql - SQL语句模板
     * @param {Array<Array>} paramsArray - 参数数组
     * @returns {Promise<Array>}
     */
    async runBatch(sql, paramsArray) {
        await this.connect();
        
        return new Promise((resolve, reject) => {
            const results = [];
            let completed = 0;
            const total = paramsArray.length;

            if (total === 0) {
                resolve(results);
                return;
            }

            const stmt = this.db.prepare(sql);
            
            paramsArray.forEach((params, index) => {
                stmt.run(params, function(err) {
                    if (err) {
                        stmt.finalize();
                        reject(err);
                        return;
                    }
                    
                    results.push({
                        lastID: this.lastID,
                        changes: this.changes
                    });

                    completed++;
                    if (completed === total) {
                        stmt.finalize((err) => {
                            if (err) {
                                reject(err);
                                return;
                            }
                            resolve(results);
                        });
                    }
                });
            });
        });
    }
}

// 创建单例
let dbInstance = null;

/**
 * 获取数据库实例
 * @returns {Database}
 */
const getDatabase = () => {
    if (!dbInstance) {
        dbInstance = new Database();
    }
    return dbInstance;
};

module.exports = {
    Database,
    getDatabase
};

