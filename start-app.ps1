# 食物卡路里扫描器启动脚本
param(
    [switch]$Backend,
    [switch]$Frontend,
    [switch]$Both
)

Write-Host "🚀 启动食物卡路里扫描器..." -ForegroundColor Green

$rootDir = $PSScriptRoot
$serverDir = Join-Path $rootDir "server"
$clientDir = Join-Path $rootDir "client"

# 检查Node.js
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js 版本: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Error "❌ 未找到Node.js，请先安装Node.js"
    exit 1
}

# 终止已存在的node进程
try {
    Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
    Write-Host "🔄 已停止现有的Node.js进程" -ForegroundColor Yellow
} catch {
    # 忽略错误
}

if ($Backend -or $Both) {
    Write-Host "`n📡 启动后端服务器..." -ForegroundColor Cyan
    
    if (-not (Test-Path $serverDir)) {
        Write-Error "❌ 服务器目录不存在: $serverDir"
        exit 1
    }
    
    # 启动后端
    Start-Process -FilePath "node" -ArgumentList "server.js" -WorkingDirectory $serverDir -WindowStyle Hidden
    Write-Host "✅ 后端服务器已启动 (http://localhost:3001)" -ForegroundColor Green
    
    # 等待服务器启动
    Start-Sleep -Seconds 3
    
    # 测试后端连接
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:3001/api/health" -Method GET -TimeoutSec 5
        Write-Host "✅ 后端健康检查通过" -ForegroundColor Green
        Write-Host "   服务: $($response.service)" -ForegroundColor Gray
        Write-Host "   版本: $($response.version)" -ForegroundColor Gray
    } catch {
        Write-Warning "⚠️ 后端健康检查失败，但服务可能仍在启动中"
    }
}

if ($Frontend -or $Both) {
    Write-Host "`n🌐 启动前端应用..." -ForegroundColor Cyan
    
    if (-not (Test-Path $clientDir)) {
        Write-Error "❌ 客户端目录不存在: $clientDir"
        exit 1
    }
    
    # 启动前端
    Start-Process -FilePath "cmd" -ArgumentList "/c", "npm start" -WorkingDirectory $clientDir -WindowStyle Hidden
    Write-Host "✅ 前端应用已启动 (http://localhost:3000)" -ForegroundColor Green
    
    # 等待前端启动
    Start-Sleep -Seconds 5
    
    Write-Host "⏳ 前端应用正在启动，请稍候..." -ForegroundColor Yellow
}

if ($Both) {
    Write-Host "`n🎉 应用启动完成!" -ForegroundColor Green
    Write-Host "📱 前端应用: http://localhost:3000" -ForegroundColor Cyan
    Write-Host "🔧 后端API: http://localhost:3001" -ForegroundColor Cyan
    Write-Host "📊 API文档: http://localhost:3001/" -ForegroundColor Cyan
    
    Write-Host "`n📝 提示:" -ForegroundColor Yellow
    Write-Host "- 前端可能需要额外1-2分钟完全启动"
    Write-Host "- 如果百度API有问题，会自动使用增强模拟服务"
    Write-Host "- 查看服务器日志了解当前使用的识别服务"
    
    # 可选：打开浏览器
    $openBrowser = Read-Host "`n是否打开浏览器? (y/n)"
    if ($openBrowser -eq 'y' -or $openBrowser -eq 'Y') {
        Start-Process "http://localhost:3000"
    }
    
} elseif ($Backend) {
    Write-Host "`n✅ 后端服务器启动完成!" -ForegroundColor Green
    Write-Host "🔧 API地址: http://localhost:3001" -ForegroundColor Cyan
    
} elseif ($Frontend) {
    Write-Host "`n✅ 前端应用启动完成!" -ForegroundColor Green
    Write-Host "📱 应用地址: http://localhost:3000" -ForegroundColor Cyan
    Write-Host "⚠️  请确保后端服务器也在运行" -ForegroundColor Yellow
    
} else {
    Write-Host "`n使用方法:" -ForegroundColor Yellow
    Write-Host "  .\start-app.ps1 -Both      # 启动前后端"
    Write-Host "  .\start-app.ps1 -Backend   # 仅启动后端"
    Write-Host "  .\start-app.ps1 -Frontend  # 仅启动前端"
}

Write-Host "`n🔧 管理提示:" -ForegroundColor Gray
Write-Host "- 停止服务: Get-Process -Name 'node' | Stop-Process"
Write-Host "- 查看进程: Get-Process -Name 'node'"
Write-Host "- 重启应用: 重新运行此脚本"
