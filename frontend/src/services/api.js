import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// リクエストインターセプター
apiClient.interceptors.request.use(
  (config) => {
    // 認証トークンを追加（必要に応じて）
    return config
  },
  (error) => Promise.reject(error)
)

// レスポンスインターセプター
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

// ルート最適化API
export const routeApi = {
  // ルート最適化を実行
  optimize: (data) => apiClient.post('/routes/optimize', data),

  // ルート一覧を取得
  getRoutes: () => apiClient.get('/routes'),

  // ルート詳細を取得
  getRoute: (id) => apiClient.get(`/routes/${id}`),

  // ルートを削除
  deleteRoute: (id) => apiClient.delete(`/routes/${id}`),

  // ルートを更新
  updateRoute: (id, data) => apiClient.put(`/routes/${id}`, data),
}

export default apiClient
