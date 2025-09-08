# 百度AI API密钥配置脚本
# 使用方法: .\configure-baidu-api.ps1 -ApiKey "你的API密钥" -SecretKey "你的Secret密钥"

param(
    [Parameter(Mandatory=$true, HelpMessage="百度AI API Key")]
    [string]$ApiKey,
    
    [Parameter(Mandatory=$true, HelpMessage="百度AI Secret Key")]
    [string]$SecretKey,
    
    [Parameter(HelpMessage="是否测试API连接")]
    [switch]$TestConnection
)

Write-Host "🔧 配置百度AI API密钥..." -ForegroundColor Green

# 确保在正确的目录
$rootDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$serverDir = Join-Path $rootDir "server"
$envFile = Join-Path $serverDir ".env"

if (-not (Test-Path $serverDir)) {
    Write-Error "❌ 找不到server目录: $serverDir"
    exit 1
}

if (-not (Test-Path $envFile)) {
    Write-Error "❌ 找不到环境配置文件: $envFile"
    exit 1
}

try {
    # 读取现有的.env文件
    $envContent = Get-Content $envFile -Raw
    
    # 更新API密钥
    if ($envContent -match "BAIDU_API_KEY=.*") {
        $envContent = $envContent -replace "BAIDU_API_KEY=.*", "BAIDU_API_KEY=$ApiKey"
    } else {
        $envContent += "`nBAIDU_API_KEY=$ApiKey"
    }
    
    # 更新Secret密钥
    if ($envContent -match "BAIDU_SECRET_KEY=.*") {
        $envContent = $envContent -replace "BAIDU_SECRET_KEY=.*", "BAIDU_SECRET_KEY=$SecretKey"
    } else {
        $envContent += "`nBAIDU_SECRET_KEY=$SecretKey"
    }
    
    # 写入文件
    Set-Content -Path $envFile -Value $envContent -Encoding UTF8
    
    Write-Host "✅ API密钥配置成功!" -ForegroundColor Green
    Write-Host "📝 配置文件: $envFile" -ForegroundColor Cyan
    
    # 显示配置状态（隐藏敏感信息）
    $maskedApiKey = $ApiKey.Substring(0, 8) + "***"
    $maskedSecretKey = $SecretKey.Substring(0, 8) + "***"
    Write-Host "🔑 API Key: $maskedApiKey" -ForegroundColor Yellow
    Write-Host "🔐 Secret Key: $maskedSecretKey" -ForegroundColor Yellow
    
    if ($TestConnection) {
        Write-Host "`n🧪 测试API连接..." -ForegroundColor Blue
        
        # 切换到server目录并启动服务器测试
        Push-Location $serverDir
        try {
            # 设置环境变量
            $env:BAIDU_API_KEY = $ApiKey
            $env:BAIDU_SECRET_KEY = $SecretKey
            
            # 运行快速测试
            $testScript = @"
const axios = require('axios');
const API_KEY = process.env.BAIDU_API_KEY;
const SECRET_KEY = process.env.BAIDU_SECRET_KEY;

async function testBaiduAPI() {
    try {
        const response = await axios.post(
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
        
        if (response.data.access_token) {
            console.log('✅ API连接测试成功!');
            console.log('🔗 Access Token获取正常');
            process.exit(0);
        } else {
            console.log('❌ API连接测试失败: 未获取到access_token');
            process.exit(1);
        }
    } catch (error) {
        console.log('❌ API连接测试失败:', error.message);
        process.exit(1);
    }
}

testBaiduAPI();
"@
            
            $testScript | Out-File -FilePath "test-api.js" -Encoding UTF8
            $testResult = node "test-api.js"
            Write-Host $testResult
            Remove-Item "test-api.js" -Force
            
        } catch {
            Write-Host "❌ API测试失败: $_" -ForegroundColor Red
        } finally {
            Pop-Location
        }
    }
    
    Write-Host "`n📖 接下来的步骤:" -ForegroundColor Cyan
    Write-Host "1. 运行 'npm run dev' 启动应用"
    Write-Host "2. 访问 http://localhost:3000 测试食物识别"
    Write-Host "3. 查看服务器日志确认API调用状态"
    
} catch {
    Write-Error "❌ 配置失败: $_"
    exit 1
}
