import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  AlertTitle,
  Paper,
  Button,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { PublicLayout } from '../layouts/PublicLayout';
import { useVoteGuard } from '../contexts/VoteGuardContext';
import { getDepartments, getCriteria } from '../services/api';

/**
 * P-001: 評価ページ
 * 社員がスマホから全部署の発表を3つの評価項目で10段階評価する
 */
function EvaluationPage() {
  const { isLoading: isGuardLoading, hasVoted, fingerprint } = useVoteGuard();

  // 部署一覧を取得
  const {
    data: departments,
    isLoading: isDepartmentsLoading,
    error: departmentsError,
    refetch: refetchDepartments,
  } = useQuery({
    queryKey: ['departments'],
    queryFn: getDepartments,
    // 評価ページではポーリング不要
    refetchInterval: false,
  });

  // 評価項目を取得
  const {
    data: criteria,
    isLoading: isCriteriaLoading,
    error: criteriaError,
    refetch: refetchCriteria,
  } = useQuery({
    queryKey: ['criteria'],
    queryFn: getCriteria,
    refetchInterval: false,
  });

  const isLoading = isGuardLoading || isDepartmentsLoading || isCriteriaLoading;
  const hasError = departmentsError || criteriaError;

  // ローディング中
  if (isLoading) {
    return (
      <PublicLayout centerContent>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <CircularProgress size={48} sx={{ mb: 2 }} />
          <Typography variant="body1" color="text.secondary">
            読み込み中...
          </Typography>
        </Box>
      </PublicLayout>
    );
  }

  // 評価済みの場合
  if (hasVoted) {
    return (
      <PublicLayout centerContent>
        <Paper
          elevation={2}
          sx={{
            p: 4,
            textAlign: 'center',
            maxWidth: 400,
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            評価完了
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            ご評価ありがとうございました。
          </Typography>
          <Typography variant="body2" color="text.secondary">
            結果は結果表示ページでご確認いただけます。
          </Typography>
        </Paper>
      </PublicLayout>
    );
  }

  // APIエラーの場合（バックエンド未接続を含む）
  if (hasError) {
    return (
      <PublicLayout>
        <Alert
          severity="info"
          sx={{ mb: 3 }}
          action={
            <Button
              color="inherit"
              size="small"
              startIcon={<RefreshIcon />}
              onClick={() => {
                refetchDepartments();
                refetchCriteria();
              }}
            >
              再試行
            </Button>
          }
        >
          <AlertTitle>バックエンド接続待ち</AlertTitle>
          <Typography variant="body2">
            バックエンドAPIに接続できません。バックエンド基盤構築が完了するまでお待ちください。
          </Typography>
        </Alert>

        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            評価ページ（P-001）
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            このページでは、各部署の発表を3項目×10段階で評価します。
          </Typography>

          <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary">
              デバイスフィンガープリント: {fingerprint?.slice(0, 16)}...
            </Typography>
          </Box>
        </Paper>
      </PublicLayout>
    );
  }

  // データ取得成功（バックエンド接続後）
  return (
    <PublicLayout>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
        部署評価
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        各部署の発表を3項目×10段階で評価してください。
      </Typography>

      {/* TODO: Phase 5でページ実装時に評価UIを追加 */}
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="body1">
          部署数: {departments?.length ?? 0}件
        </Typography>
        <Typography variant="body1">
          評価項目数: {criteria?.length ?? 0}件
        </Typography>
      </Paper>
    </PublicLayout>
  );
}

export default EvaluationPage;
