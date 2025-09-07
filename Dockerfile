# 多阶段构建Docker镜像
# 阶段1: 构建前端
FROM node:18-alpine AS frontend-build

WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci --only=production

COPY client/ .
RUN npm run build

# 阶段2: 准备后端
FROM node:18-alpine AS backend-build

WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci --only=production

COPY server/ .

# 阶段3: 生产镜像
FROM node:18-alpine AS production

WORKDIR /app

# 安装必要的系统依赖
RUN apk add --no-cache \
    tini \
    && addgroup -g 1001 -S nodejs \
    && adduser -S nextjs -u 1001

# 创建必要的目录
RUN mkdir -p server/uploads && \
    chown -R nextjs:nodejs server/uploads

# 复制后端文件
COPY --from=backend-build --chown=nextjs:nodejs /app/server ./server
COPY --from=frontend-build --chown=nextjs:nodejs /app/client/build ./client/build

# 切换到非特权用户
USER nextjs

# 暴露端口
EXPOSE 3001

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=3001

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# 使用tini作为init进程
ENTRYPOINT ["/sbin/tini", "--"]

# 启动应用
CMD ["node", "server/server.js"]
