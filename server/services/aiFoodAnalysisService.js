const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');
const FoodRecognitionService = require('./foodRecognitionService');

// 该服务以 server/services/serverTelm.js 的 OpenAI 客户端为模板，调用火山方舟 Ark 模型
// 返回固定结构：与 FoodAnalysisResult 兼容，并增加 fitnessAdvice 字段

const getOpenAIClient = () => {
	const apiKey = process.env.ARK_API_KEY;
	const baseURL = process.env.ARK_BASE_URL || 'https://ark.cn-beijing.volces.com/api/v3';
	if (!apiKey) {
		throw new Error('缺少 ARK_API_KEY 环境变量');
	}
	// 为 Ark 请求增加默认超时与重试设置
	return new OpenAI({ apiKey, baseURL, timeout: Number(process.env.ARK_TIMEOUT_MS || 30000) });
};

const SYSTEM_PROMPT = '你是营养与运动膳食专家。基于输入的食物（可包含图片）与营养信息，返回卡路里与营养评估，并给出健身人群（增肌/减脂/维持）的中文建议。严格要求：只输出一个合法 JSON，不要任何额外文字、解释或代码块标记。';

const buildUserPrompt = (recognized) => {
	// recognized: { name, calories, nutrition: { protein, carbs, fat, fiber } }
	const safe = {
		name: String(recognized.name || ''),
		calories: Number(recognized.calories || 0),
		nutrition: {
			protein: String(recognized.nutrition?.protein || '0g'),
			carbs: String(recognized.nutrition?.carbs || '0g'),
			fat: String(recognized.nutrition?.fat || '0g'),
			fiber: String(recognized.nutrition?.fiber || '0g')
		}
	};

	return `请基于以下识别结果，输出固定 JSON：\n\n输入: ${JSON.stringify(safe, null, 2)}\n\n要求输出 JSON 结构如下（必须严格匹配字段名）：\n{\n  "name": string,\n  "calories": number,\n  "nutrition": { "protein": string, "carbs": string, "fat": string, "fiber": string },\n  "fitnessAdvice": {\n    "summary": string,\n    "forBulking": string,\n    "forCutting": string,\n    "forMaintenance": string\n  }\n}`;
};

const parseModelJson = (text) => {
	try {
		// 尝试直接解析
		return JSON.parse(text);
	} catch (e) {
		// 兜底1：提取 ```json ... ``` 代码块
		const fenceMatch = text.match(/```json\s*([\s\S]*?)\s*```/i);
		if (fenceMatch && fenceMatch[1]) {
			try { return JSON.parse(fenceMatch[1]); } catch (_) {}
		}
		// 兜底2：提取第一个大括号 JSON 片段
		const match = text.match(/\{[\s\S]*\}/);
		if (match) {
			try { return JSON.parse(match[0]); } catch (_) {}
		}
		throw new Error('模型返回非JSON，可读性错误');
	}
};

class AIFoodAnalysisService {
	constructor() {
		this.foodRecognitionService = new FoodRecognitionService();
	}

	createAbortSignal(timeoutMs) {
		const AbortController = global.AbortController || require('abort-controller');
		const controller = new AbortController();
		const timer = setTimeout(() => controller.abort(), timeoutMs);
		return { signal: controller.signal, cancel: () => clearTimeout(timer) };
	}

	async callArkChatWithRetry({ model, messages, timeoutMs, label, responseFormat }) {
		const maxAttempts = Number(process.env.ARK_RETRY || 2);
		let attempt = 0;
		let lastErr;
		while (attempt < maxAttempts) {
			attempt++;
			const { signal, cancel } = this.createAbortSignal(timeoutMs);
			try {
				console.log(`[Ark] ${label} attempt ${attempt}/${maxAttempts}, model=${model}, timeoutMs=${timeoutMs}`);
				const openai = getOpenAIClient();
				console.log(openai, '===openai===')
				const options = { model, messages };
				// 有些模型不支持 response_format，统一通过提示词约束
				const completion = await openai.chat.completions.create(options, { signal });
				console.log(completion, '===completion===')
				cancel();
				return completion;
			} catch (err) {
				cancel();
				lastErr = err;
				const isAbort = String(err?.message || '').toLowerCase().includes('aborted');
				console.warn(`[Ark] ${label} failed on attempt ${attempt}: ${err?.message}`);
				// 简单退避
				if (attempt < maxAttempts) {
					await new Promise(r => setTimeout(r, isAbort ? 500 : 1000 * attempt));
				}
			}
		}
		throw lastErr || new Error('Ark 请求失败');
	}

	imagePathToDataUrl(filePath) {
		const ext = path.extname(filePath).toLowerCase();
		let mime = 'image/jpeg';
		if (ext === '.png') mime = 'image/png';
		if (ext === '.jpg' || ext === '.jpeg') mime = 'image/jpeg';
		const buffer = fs.readFileSync(filePath);
		const base64 = buffer.toString('base64');
		return `data:${mime};base64,${base64}`;
	}

	async analyzeWithArkVision(imagePath) {
		const model = process.env.ARK_VISION_MODEL_ID || process.env.ARK_MODEL_ID || '{TEMPLATE_ENDPOINT_ID}';
		const dataUrl = this.imagePathToDataUrl(imagePath);

		const messages = [
			{ role: 'system', content: SYSTEM_PROMPT },
			{
				role: 'user',
				content: [
					{ type: 'text', text: '请识别图片中的食物，并分析其含有的营养物质，并按指定 JSON 严格输出（字段名必须一致）：\n{\n  "name": string,\n  "calories": number,\n  "nutrition": { "protein": string, "carbs": string, "fat": string, "fiber": string },\n  "fitnessAdvice": {\n    "summary": string,\n    "forBulking": string,\n    "forCutting": string,\n    "forMaintenance": string\n  }\n}' },
					{ type: 'image_url', image_url: { url: dataUrl } }
				]
			}
		];

		const arkVisionTimeoutMs = Number(process.env.ARK_VISION_TIMEOUT_MS || 45000);
		const completion = await this.callArkChatWithRetry({ model, messages, timeoutMs: arkVisionTimeoutMs, label: 'Vision', responseFormat: 'json' });
		console.log('[Ark] Vision response received');
		const content = completion?.choices?.[0]?.message?.content || '';
		console.log(content, '==== content')
		const json = parseModelJson(content);

		return {
			name: String(json.name || '').trim() || '未知食物',
			calories: Number(json.calories || 0),
			confidence: 0.9,
			nutrition: {
				protein: json?.nutrition?.protein || '0g',
				carbs: json?.nutrition?.carbs || '0g',
				fat: json?.nutrition?.fat || '0g',
				fiber: json?.nutrition?.fiber || '0g'
			},
			description: `AI建议：${json?.fitnessAdvice?.summary || '均衡饮食'}`,
			analysisId: this.foodRecognitionService.generateAnalysisId(),
			timestamp: new Date().toISOString(),
			fitnessAdvice: json.fitnessAdvice || undefined
		};
	}

	/**
	 * 使用本地识别 + Ark 大模型生成健身建议
	 * @param {string} imagePath 本地图片路径（或已存储路径）
	 * @returns {Promise<Object>} 固定结构对象，兼容前端 FoodAnalysisResult，并含 fitnessAdvice
	 */
	async analyzeWithAI(imagePath) {
		if (!imagePath || !fs.existsSync(imagePath)) {
			throw new Error('图片文件不存在');
		}

		// 1) 优先多模态
		// try {
			
		// } catch (visionErr) {
		// 	console.warn('Ark 多模态识别失败，回退到本地识别 + 文本建议:', visionErr.message);
		// }
		return await this.analyzeWithArkVision(imagePath);

		// 2) 回退：先百度/本地识别，再用文本模型生成建议
		const recognized = await this.foodRecognitionService.analyzeFood(imagePath);

		let modelOutput;
		try {
			const modelId = process.env.ARK_MODEL_ID || '{TEMPLATE_ENDPOINT_ID}';
			const arkTextTimeoutMs = Number(process.env.ARK_TEXT_TIMEOUT_MS || 40000);
			const completion = await this.callArkChatWithRetry({
				model: modelId,
				messages: [
					{ role: 'system', content: SYSTEM_PROMPT },
					{ role: 'user', content: buildUserPrompt(recognized) }
				],
				timeoutMs: arkTextTimeoutMs,
				responseFormat: 'json',
				label: 'Text'
			});
			console.log('[Ark] Text response received', completion);
			const content = completion?.choices?.[0]?.message?.content || '';
			console.log('[Ark] Text content received', content);
			modelOutput = parseModelJson(content);
		} catch (err) {
			console.warn('Ark 文本模型调用失败，使用降级建议:', err.message);
			modelOutput = {
				name: recognized.name,
				calories: recognized.calories,
				nutrition: recognized.nutrition,
				fitnessAdvice: {
					summary: '建议均衡饮食，控制总热量，优先摄入优质蛋白与蔬果。',
					forBulking: '适度增加碳水与总热量，保证每餐含优质蛋白。',
					forCutting: '控制碳水与脂肪摄入，提升蛋白质比例与蔬菜摄入。',
					forMaintenance: '维持当前摄入，遵循少油少盐，三餐均衡。'
				}
			};
		}

		return {
			name: recognized.name,
			calories: Number(recognized.calories) || Number(modelOutput.calories) || 0,
			confidence: Number(recognized.confidence || 0.9),
			nutrition: {
				protein: modelOutput?.nutrition?.protein || recognized.nutrition?.protein || '0g',
				carbs: modelOutput?.nutrition?.carbs || recognized.nutrition?.carbs || '0g',
				fat: modelOutput?.nutrition?.fat || recognized.nutrition?.fat || '0g',
				fiber: modelOutput?.nutrition?.fiber || recognized.nutrition?.fiber || '0g'
			},
			description: `AI建议：${modelOutput?.fitnessAdvice?.summary || '均衡饮食'}`,
			analysisId: this.foodRecognitionService.generateAnalysisId(),
			timestamp: new Date().toISOString(),
			fitnessAdvice: modelOutput.fitnessAdvice || undefined
		};
	}
}

module.exports = AIFoodAnalysisService;
