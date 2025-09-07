import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ApiResponse, FoodAnalysisResult, UploadResult, HealthCheckResponse } from '../types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.REACT_APP_API_BASE_URL || '/api',
      timeout: 30000, // 30秒超时
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 请求拦截器
    this.api.interceptors.request.use(
      (config) => {
        console.log(`发送请求: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('请求错误:', error);
        return Promise.reject(error);
      }
    );

    // 响应拦截器
    this.api.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        console.log(`响应成功: ${response.config.url}`, response.data);
        return response;
      },
      (error) => {
        console.error('响应错误:', error);
        
        // 处理网络错误
        if (!error.response) {
          throw new Error('网络连接失败，请检查网络连接');
        }
        
        // 处理HTTP错误状态
        const message = error.response?.data?.message || error.response?.data?.error || error.message;
        throw new Error(message);
      }
    );
  }

  /**
   * 健康检查
   */
  async healthCheck(): Promise<HealthCheckResponse> {
    const response = await this.api.get<ApiResponse<HealthCheckResponse>>('/health');
    return response.data.data!;
  }

  /**
   * 上传图片文件
   */
  async uploadImage(file: File): Promise<UploadResult> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await this.api.post<ApiResponse<UploadResult>>(
      '/food/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.error || '上传失败');
    }

    return response.data.data!;
  }

  /**
   * 分析食物图片
   */
  async analyzeFood(file: File): Promise<FoodAnalysisResult> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await this.api.post<ApiResponse<FoodAnalysisResult>>(
      '/food/analyze',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.error || '分析失败');
    }

    return response.data.data!;
  }

  /**
   * 分析Base64格式的图片
   */
  async analyzeBase64Image(base64Data: string): Promise<FoodAnalysisResult> {
    const response = await this.api.post<ApiResponse<FoodAnalysisResult>>(
      '/food/analyze-base64',
      {
        image: base64Data,
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.error || '分析失败');
    }

    return response.data.data!;
  }

  /**
   * 获取营养信息
   */
  async getNutritionInfo(foodName: string): Promise<any> {
    const response = await this.api.get<ApiResponse>(
      `/food/nutrition/${encodeURIComponent(foodName)}`
    );

    if (!response.data.success) {
      throw new Error(response.data.error || '查询失败');
    }

    return response.data.data;
  }

  /**
   * 获取历史记录
   */
  async getHistory(): Promise<any[]> {
    const response = await this.api.get<ApiResponse<any[]>>('/food/history');

    if (!response.data.success) {
      throw new Error(response.data.error || '获取历史记录失败');
    }

    return response.data.data || [];
  }

  /**
   * 文件转Base64
   */
  fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  /**
   * 检查文件是否为有效的图片文件
   */
  isValidImageFile(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    return validTypes.includes(file.type);
  }

  /**
   * 检查文件大小是否在限制范围内
   */
  isValidFileSize(file: File, maxSizeMB: number = 5): boolean {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
  }

  /**
   * 验证文件
   */
  validateFile(file: File): { valid: boolean; error?: string } {
    if (!this.isValidImageFile(file)) {
      return {
        valid: false,
        error: '不支持的文件格式，请上传 JPG 或 PNG 格式的图片'
      };
    }

    if (!this.isValidFileSize(file)) {
      return {
        valid: false,
        error: '文件过大，请上传小于 5MB 的图片'
      };
    }

    return { valid: true };
  }
}

// 导出单例实例
export const apiService = new ApiService();
export default ApiService;
