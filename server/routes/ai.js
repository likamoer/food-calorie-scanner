const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const AIFoodAnalysisService = require('../services/aiFoodAnalysisService');

const router = express.Router();

// 复用与 food.js 一致的上传策略
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, path.join(__dirname, '../uploads/'));
	},
	filename: (req, file, cb) => {
		const uniqueName = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
		cb(null, uniqueName);
	}
});

const fileFilter = (req, file, cb) => {
	const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
	if (allowedTypes.includes(file.mimetype)) {
		cb(null, true);
		return;
	}
	cb(new Error('不支持的文件类型。请上传 JPG 或 PNG 格式的图片。'), false);
};

const upload = multer({
	storage,
	limits: { fileSize: 5 * 1024 * 1024, files: 1 },
	fileFilter
});

const aiService = new AIFoodAnalysisService();

// 新的 AI 分析端点：POST /api/ai/analyze
router.post('/analyze', upload.single('image'), async (req, res) => {
	try {
		if (!req.file) {
			res.status(400).json({ error: '没有上传文件', message: '请选择一个图片文件' });
			return;
		}

		const imagePath = req.file.path;
		const result = await aiService.analyzeWithAI(imagePath);

		// 可选清理
		if (process.env.CLEANUP_UPLOADS !== 'false') {
			setTimeout(() => {
				fs.unlink(imagePath, () => {});
			}, 5 * 60 * 1000);
		}

		res.json({
			success: true,
			message: 'AI食物分析完成',
			data: {
				...result,
				imageUrl: `/uploads/${req.file.filename}`
			}
		});
		return;
	} catch (error) {
		console.error('AI 分析错误:', error);
		if (req.file && fs.existsSync(req.file.path)) {
			fs.unlink(req.file.path, () => {});
		}
		res.status(500).json({ error: '分析失败', message: error.message || '服务器内部错误' });
	}
});

module.exports = router;

// 流式输出：SSE 版本
router.post('/analyze-stream', upload.single('image'), async (req, res) => {
	// 设置 Server-Sent Events 头部
	res.setHeader('Content-Type', 'text/event-stream');
	res.setHeader('Cache-Control', 'no-cache');
	res.setHeader('Connection', 'keep-alive');
	res.flushHeaders?.();

	const send = (obj) => {
		try {
			res.write(`data: ${JSON.stringify(obj)}\n\n`);
		} catch (_) {}
	};

	const keepAlive = setInterval(() => {
		try { res.write(': ping\n\n'); } catch (_) {}
	}, 15000);

	try {
		if (!req.file) {
			send({ type: 'error', error: '没有上传文件', message: '请选择一个图片文件' });
			res.end();
			return;
		}

		const imagePath = req.file.path;

		// 构造多模态消息（优先视觉）
		const OpenAI = require('openai');
		const apiKey = process.env.ARK_API_KEY;
		const baseURL = process.env.ARK_BASE_URL || 'https://ark.cn-beijing.volces.com/api/v3';
		if (!apiKey) {
			send({ type: 'error', error: '缺少 ARK_API_KEY 环境变量' });
			res.end();
			return;
		}
		const openai = new OpenAI({ apiKey, baseURL, timeout: Number(process.env.ARK_TIMEOUT_MS || 30000) });

		// 使用已有服务将图片转为 dataURL
		const AIFoodAnalysisService = require('../services/aiFoodAnalysisService');
		const aiService = new AIFoodAnalysisService();
		const dataUrl = aiService.imagePathToDataUrl(imagePath);

		const SYSTEM_PROMPT = '你是营养与运动膳食专家。基于输入的食物（可包含图片）与营养信息，返回卡路里与营养评估，并给出健身人群（增肌/减脂/维持）的中文建议。严格要求：只输出一个合法 JSON，不要任何额外文字、解释或代码块标记。';
		const messages = [
			{ role: 'system', content: SYSTEM_PROMPT },
			{
				role: 'user',
				content: [
					{ type: 'image_url', image_url: { url: dataUrl } },
					{ type: 'text', text: '步骤：先逐步思考与分析（可多段文字），最后一行只输出 JSON，并用 <JSON> 和 </JSON> 包裹。JSON 结构：{"name": string, "calories": number, "nutrition": {"protein": string, "carbs": string, "fat": string, "fiber": string}, "fitnessAdvice": {"summary": string, "forBulking": string, "forCutting": string, "forMaintenance": string}}。除最后一行 JSON 外，其余为你的思考过程。' }
				]
			}
		];

		const model = process.env.ARK_VISION_MODEL_ID || process.env.ARK_MODEL_ID || '{TEMPLATE_ENDPOINT_ID}';
		const stream = await openai.chat.completions.create({ model, messages, stream: true });

		let aggregated = '';
		for await (const part of stream) {
			const delta = part?.choices?.[0]?.delta?.content || '';
			if (delta) {
				aggregated += delta;
				send({ type: 'delta', content: delta });
			}
		}

		const parseJSON = (text) => {
			try { return JSON.parse(text); } catch (_) {}
			const fence = text.match(/```json\s*([\s\S]*?)\s*```/i);
			if (fence && fence[1]) { try { return JSON.parse(fence[1]); } catch (_) {} }
			const match = text.match(/\{[\s\S]*\}/);
			if (match) { try { return JSON.parse(match[0]); } catch (_) {} }
			return null;
		};

		let jsonBlock = null;
		const tagMatch = aggregated.match(/<JSON>[\s\S]*?<\/JSON>/i);
		if (tagMatch) {
			jsonBlock = tagMatch[0].replace(/<\/?JSON>/gi, '');
		}
		const json = parseJSON(jsonBlock || aggregated) || {};
		const finalData = {
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
			analysisId: aiService.foodRecognitionService.generateAnalysisId(),
			timestamp: new Date().toISOString(),
			imageUrl: `/uploads/${req.file.filename}`,
			fitnessAdvice: json.fitnessAdvice || undefined
		};

		send({ type: 'final', data: finalData });
		send({ type: 'done' });
		res.end();

		// 延迟清理
		if (process.env.CLEANUP_UPLOADS !== 'false') {
			setTimeout(() => { fs.unlink(imagePath, () => {}); }, 5 * 60 * 1000);
		}
		return;
	} catch (error) {
		send({ type: 'error', error: '分析失败', message: error.message || '服务器内部错误' });
		res.end();
	} finally {
		clearInterval(keepAlive);
	}
});