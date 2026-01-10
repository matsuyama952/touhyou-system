import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { theme } from './theme';
import { VoteGuardProvider } from './contexts/VoteGuardContext';
import { PAGE_ROUTES } from './types';

// ページコンポーネント
import EvaluationPage from './pages/EvaluationPage';
import ResultsPage from './pages/ResultsPage';
import DepartmentDetailPage from './pages/DepartmentDetailPage';

// React Query クライアント
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 5秒間隔でリフェッチ（結果表示のリアルタイム更新用）
      refetchInterval: 5000,
      // エラー時は3回までリトライ
      retry: 3,
      // ウィンドウフォーカス時にリフェッチ
      refetchOnWindowFocus: true,
      // 古いデータを表示しつつバックグラウンドでリフェッチ
      staleTime: 3000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <VoteGuardProvider>
          <BrowserRouter>
            <Routes>
              {/* P-001: 評価ページ */}
              <Route path={PAGE_ROUTES.EVALUATION} element={<EvaluationPage />} />

              {/* P-002: 結果表示ページ */}
              <Route path={PAGE_ROUTES.RESULTS} element={<ResultsPage />} />

              {/* P-003: 項目別詳細ページ */}
              <Route path="/results/:departmentId" element={<DepartmentDetailPage />} />
            </Routes>
          </BrowserRouter>
        </VoteGuardProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
