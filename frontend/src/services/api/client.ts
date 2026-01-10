import axios from 'axios';

/**
 * APIクライアントのベースインスタンス
 * 環境変数からベースURLを取得
 */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// レスポンスインターセプター（エラーハンドリング）
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // エラーログ（本番環境では適切なロギングサービスに送信）
    if (import.meta.env.DEV) {
      // 開発環境でのみコンソール出力
    }
    return Promise.reject(error);
  },
);

export default apiClient;
