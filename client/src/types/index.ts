// 食物识别结果接口
export interface FoodAnalysisResult {
  name: string;
  calories: number;
  confidence: number;
  nutrition: NutritionInfo;
  description?: string;
  analysisId: string;
  timestamp: string;
  imageUrl?: string;
}

// 营养信息接口
export interface NutritionInfo {
  protein: string;
  carbs: string;
  fat: string;
  fiber: string;
}

// API响应接口
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// 文件上传结果接口
export interface UploadResult {
  filename: string;
  originalName: string;
  size: number;
  mimetype: string;
  url: string;
}

// 上传状态枚举
export enum UploadStatus {
  IDLE = 'idle',
  UPLOADING = 'uploading',
  ANALYZING = 'analyzing',
  SUCCESS = 'success',
  ERROR = 'error'
}

// 应用状态接口
export interface AppState {
  currentImage: File | null;
  imagePreview: string | null;
  uploadStatus: UploadStatus;
  analysisResult: FoodAnalysisResult | null;
  error: string | null;
  isLoading: boolean;
}

// 健康检查响应接口
export interface HealthCheckResponse {
  status: string;
  timestamp: string;
  uptime: number;
  service: string;
  version: string;
}
