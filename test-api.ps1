# API接口测试脚本
# 使用PowerShell进行接口测试

$baseUrl = "http://localhost:3001"
$headers = @{
    "Content-Type" = "application/json"
}

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "开始测试 AI卡路里用户体系接口" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# 1. 测试创建用户接口
Write-Host "1. 测试创建用户接口..." -ForegroundColor Yellow
$createUserBody = @{
    username = "Test User"
    phoneNumber = "13800138000"
    password = "123456"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/users/create" -Method POST -Body $createUserBody -Headers $headers
    Write-Host "✅ 创建用户成功!" -ForegroundColor Green
    Write-Host "用户ID: $($response.data.id)" -ForegroundColor Green
    Write-Host "用户名: $($response.data.username)" -ForegroundColor Green
    $userId = $response.data.id
    
    # 保存用户ID和手机号供后续使用
    $global:testUserId = $userId
    $global:testPhoneNumber = "13800138000"
    
    Write-Host ""
} catch {
    if ($_.Exception.Response.StatusCode -eq 400) {
        Write-Host "⚠️ 用户可能已存在，尝试登录..." -ForegroundColor Yellow
        $global:testUserId = 1
        $global:testPhoneNumber = "13800138000"
    } else {
        Write-Host "❌ 创建用户失败: $($_.Exception.Message)" -ForegroundColor Red
        exit
    }
}

# 2. 测试用户登录接口
Write-Host "2. 测试用户登录接口..." -ForegroundColor Yellow
$loginBody = @{
    phoneNumber = $global:testPhoneNumber
    password = "123456"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method POST -Body $loginBody -Headers $headers
    Write-Host "✅ 登录成功!" -ForegroundColor Green
    Write-Host "用户ID: $($response.data.userId)" -ForegroundColor Green
    Write-Host "用户名: $($response.data.username)" -ForegroundColor Green
    Write-Host "Token: $($response.data.token.Substring(0, 50))..." -ForegroundColor Green
    $global:testToken = $response.data.token
    $headers["Authorization"] = "Bearer $($response.data.token)"
    Write-Host ""
} catch {
    Write-Host "❌ 登录失败: $($_.Exception.Message)" -ForegroundColor Red
    exit
}

# 3. 测试查询用户接口
Write-Host "3. 测试查询用户接口..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/users/$($global:testUserId)" -Method GET
    Write-Host "✅ 查询用户成功!" -ForegroundColor Green
    Write-Host "用户名: $($response.data.username)" -ForegroundColor Green
    Write-Host "手机号: $($response.data.phoneNumber)" -ForegroundColor Green
    Write-Host "扫描次数: $($response.data.scanCount)" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "❌ 查询用户失败: $($_.Exception.Message)" -ForegroundColor Red
}

# 4. 测试购买扫描次数接口
Write-Host "4. 测试购买扫描次数接口..." -ForegroundColor Yellow
$buyBody = @{
    frequency = 10
    paymentMethod = "alipay"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/buy/scanFrequency" -Method POST -Body $buyBody -Headers $headers
    Write-Host "✅ 购买成功!" -ForegroundColor Green
    Write-Host "订单ID: $($response.data.orderId)" -ForegroundColor Green
    Write-Host "总金额: $($response.data.totalAmount)" -ForegroundColor Green
    Write-Host "购买次数: $($response.data.frequency)" -ForegroundColor Green
    Write-Host "订单状态: $($response.data.orderStatus)" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "❌ 购买失败: $($_.Exception.Message)" -ForegroundColor Red
}

# 5. 测试存储分析结果接口
Write-Host "5. 测试存储分析结果接口..." -ForegroundColor Yellow
$storeAnalysisBody = @{
    imageData = "data:image/jpeg;base64,/9j/4AAQSkZJRg"
    foodType = "水果"
    analyzeResult = @{
        foodName = "苹果"
        calories = 52
        protein = 0.3
        carbohydrate = 14
        fat = 0.2
    }
} | ConvertTo-Json -Depth 10

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/analyzeResults/store" -Method POST -Body $storeAnalysisBody -Headers $headers
    Write-Host "✅ 存储分析结果成功!" -ForegroundColor Green
    Write-Host "记录ID: $($response.data.recordId)" -ForegroundColor Green
    Write-Host "分析时间: $($response.data.analyzeTime)" -ForegroundColor Green
    $global:testRecordId = $response.data.recordId
    Write-Host ""
} catch {
    Write-Host "❌ 存储分析结果失败: $($_.Exception.Message)" -ForegroundColor Red
}

# 6. 测试查询历史记录接口
Write-Host "6. 测试查询历史记录接口..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/analysisResults/history?userId=$($global:testUserId)&page=1&pageSize=10" -Method GET -Headers $headers
    Write-Host "✅ 查询历史记录成功!" -ForegroundColor Green
    Write-Host "总记录数: $($response.data.total)" -ForegroundColor Green
    Write-Host "当前页: $($response.data.page)" -ForegroundColor Green
    Write-Host "每页大小: $($response.data.pageSize)" -ForegroundColor Green
    Write-Host "记录列表:" -ForegroundColor Green
    foreach ($record in $response.data.list) {
        Write-Host "  - $($record.foodName), 卡路里: $($record.calories)" -ForegroundColor Green
    }
    Write-Host ""
} catch {
    Write-Host "❌ 查询历史记录失败: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "✅ 所有接口测试完成!" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
