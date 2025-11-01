const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

/**
 * 数据库初始化脚本
 * 创建所有必要的数据库表
 */

// 数据库文件路径
const DB_PATH = path.join(__dirname, '..', 'database.sqlite');

/**
 * 初始化数据库
 * @returns {Promise<sqlite3.Database>}
 */
const initDatabase = () => {
    return new Promise((resolve, reject) => {
        // 创建database目录(如果不存在)
        const dbDir = path.dirname(DB_PATH);
        if (!fs.existsSync(dbDir)) {
            fs.mkdirSync(dbDir, { recursive: true });
        }

        // 创建数据库连接
        const db = new sqlite3.Database(DB_PATH, (err) => {
            if (err) {
                console.error('❌ 数据库连接失败:', err.message);
                reject(err);
                return;
            }
            console.log('✅ 数据库连接成功');
        });

        // 启用外键约束
        db.run('PRAGMA foreign_keys = ON', (err) => {
            if (err) {
                console.error('❌ 启用外键约束失败:', err.message);
                reject(err);
                return;
            }
        });

        // 创建表
        createTables(db)
            .then(() => {
                console.log('✅ 数据库表创建成功');
                resolve(db);
            })
            .catch(reject);
    });
};

/**
 * 创建所有数据库表
 * @param {sqlite3.Database} db
 * @returns {Promise<void>}
 */
const createTables = (db) => {
    return new Promise((resolve, reject) => {
        const tables = [
            // 用户表
            `CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL CHECK(length(username) >= 2 AND length(username) <= 20),
                phoneNumber TEXT NOT NULL UNIQUE CHECK(length(phoneNumber) = 11),
                password TEXT NOT NULL CHECK(length(password) >= 6),
                scanCount INTEGER DEFAULT 10 CHECK(scanCount >= 0),
                createTime TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updateTime TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            )`,
            
            // Token表
            `CREATE TABLE IF NOT EXISTS tokens (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId INTEGER NOT NULL,
                token TEXT NOT NULL UNIQUE,
                expireTime TEXT NOT NULL,
                createTime TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
            )`,
            
            // 订单表
            `CREATE TABLE IF NOT EXISTS orders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                orderId TEXT NOT NULL UNIQUE,
                userId INTEGER NOT NULL,
                frequency INTEGER NOT NULL CHECK(frequency > 0),
                totalAmount REAL NOT NULL CHECK(totalAmount >= 0),
                paymentMethod TEXT NOT NULL,
                orderStatus TEXT NOT NULL DEFAULT 'pending' CHECK(orderStatus IN ('pending', 'paid', 'cancelled')),
                createTime TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updateTime TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
            )`,
            
            // 分析记录表
            `CREATE TABLE IF NOT EXISTS analysis_records (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                recordId INTEGER NOT NULL UNIQUE,
                userId INTEGER NOT NULL,
                imageData TEXT NOT NULL,
                foodName TEXT,
                foodType TEXT,
                analyzeResult TEXT NOT NULL,
                analyzeTime TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
            )`
        ];

        // 创建索引
        const indexes = [
            'CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phoneNumber)',
            'CREATE INDEX IF NOT EXISTS idx_tokens_user ON tokens(userId)',
            'CREATE INDEX IF NOT EXISTS idx_tokens_expire ON tokens(expireTime)',
            'CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(userId)',
            'CREATE INDEX IF NOT EXISTS idx_orders_orderId ON orders(orderId)',
            'CREATE INDEX IF NOT EXISTS idx_analysis_user ON analysis_records(userId)',
            'CREATE INDEX IF NOT EXISTS idx_analysis_time ON analysis_records(analyzeTime DESC)'
        ];

        // 先创建所有表
        let tableCompleted = 0;
        const totalTables = tables.length;

        const checkTablesComplete = () => {
            tableCompleted++;
            if (tableCompleted === totalTables) {
                console.log('✅ 所有表创建完成');
                
                // 表创建完成后，再创建索引
                let indexCompleted = 0;
                const totalIndexes = indexes.length;

                const checkIndexesComplete = () => {
                    indexCompleted++;
                    if (indexCompleted === totalIndexes) {
                        console.log('✅ 所有索引创建完成');
                        resolve();
                    }
                };

                indexes.forEach((sql) => {
                    db.run(sql, (err) => {
                        if (err) {
                            console.error('❌ 创建索引失败:', err.message);
                            reject(err);
                            return;
                        }
                        checkIndexesComplete();
                    });
                });
            }
        };

        // 创建表
        tables.forEach((sql) => {
            db.run(sql, (err) => {
                if (err) {
                    console.error('❌ 创建表失败:', err.message);
                    reject(err);
                    return;
                }
                checkTablesComplete();
            });
        });
    });
};

// 如果直接运行此文件，则初始化数据库
if (require.main === module) {
    initDatabase()
        .then((db) => {
            db.close((err) => {
                if (err) {
                    console.error('❌ 关闭数据库连接失败:', err.message);
                    process.exit(1);
                }
                console.log('✅ 数据库初始化完成');
                process.exit(0);
            });
        })
        .catch((err) => {
            console.error('❌ 数据库初始化失败:', err);
            process.exit(1);
        });
}

module.exports = {
    initDatabase,
    DB_PATH
};

