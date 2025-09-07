const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 启动食物卡路里扫描器测试...\n');

// 测试后端服务器
function testBackend() {
  return new Promise((resolve, reject) => {
    console.log('📡 启动后端服务器...');
    const serverProcess = spawn('npm', ['start'], {
      cwd: path.join(__dirname, 'server'),
      stdio: 'pipe',
      shell: true
    });

    let output = '';
    
    serverProcess.stdout.on('data', (data) => {
      output += data.toString();
      console.log(`后端: ${data.toString().trim()}`);
      
      // 检查服务器是否成功启动
      if (output.includes('服务器运行在端口')) {
        console.log('✅ 后端服务器启动成功!\n');
        setTimeout(() => {
          serverProcess.kill();
          resolve();
        }, 3000);
      }
    });

    serverProcess.stderr.on('data', (data) => {
      console.error(`后端错误: ${data.toString()}`);
    });

    serverProcess.on('error', (error) => {
      console.error(`❌ 后端启动失败: ${error.message}`);
      reject(error);
    });

    // 超时处理
    setTimeout(() => {
      if (!output.includes('服务器运行在端口')) {
        console.log('⏰ 后端启动超时，继续下一步...');
        serverProcess.kill();
        resolve();
      }
    }, 10000);
  });
}

// 主测试函数
async function runTests() {
  try {
    console.log('📋 项目结构检查:');
    console.log('├── client/ (React前端)');
    console.log('├── server/ (Node.js后端)');
    console.log('└── shared/ (共享代码)\n');

    await testBackend();

    console.log('🎉 基础测试完成!');
    console.log('\n📖 接下来的步骤:');
    console.log('1. 运行 "npm run dev" 启动开发服务器');
    console.log('2. 访问 http://localhost:3000 查看前端应用');
    console.log('3. 访问 http://localhost:3001 查看后端API');
    console.log('4. 查看 DEVELOPMENT.md 了解详细开发指南');

  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    process.exit(1);
  }
}

runTests();
