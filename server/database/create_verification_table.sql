-- 创建验证码表
CREATE TABLE IF NOT EXISTS verification_codes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phoneNumber TEXT NOT NULL,
    code TEXT NOT NULL,
    expireTime TEXT NOT NULL,
    createTime TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    isUsed INTEGER DEFAULT 0 CHECK(isUsed IN (0, 1)),
    requestCount INTEGER DEFAULT 1 CHECK(requestCount > 0)
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_verification_phone ON verification_codes(phoneNumber);
CREATE INDEX IF NOT EXISTS idx_verification_expire ON verification_codes(expireTime);
CREATE INDEX IF NOT EXISTS idx_verification_create ON verification_codes(createTime DESC);