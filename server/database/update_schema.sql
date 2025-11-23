-- 更新users表，添加onlineStatus字段
ALTER TABLE users ADD COLUMN onlineStatus INTEGER DEFAULT 0 CHECK(onlineStatus IN (0, 1));