import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  AlertTitle,
  Paper,
  Button,
  Card,
  CardContent,
  IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RefreshIcon from '@mui/icons-material/Refresh';
import { ResultsLayout } from '../layouts/ResultsLayout';
import { getDepartmentDetail, getResults } from '../services/api';
import { PAGE_ROUTES } from '../types';

/**
 * P-003: 項目別詳細ページ
 * 特定の部署に対する評価項目別の詳細結果を表示する
 */
function DepartmentDetailPage() {
  const { departmentId } = useParams<{ departmentId: string }>();
  const navigate = useNavigate();

  // 部署詳細を取得（5秒間隔でポーリング）
  const {
    data: detailData,
    isLoading: isDetailLoading,
    error: detailError,
    refetch: refetchDetail,
  } = useQuery({
    queryKey: ['departmentDetail', departmentId],
    queryFn: () => getDepartmentDetail(departmentId!),
    enabled: !!departmentId,
    refetchInterval: 5000,
  });

  // 全体の評価状況も取得（ヘッダー表示用）
  const { data: resultsData } = useQuery({
    queryKey: ['results'],
    queryFn: getResults,
    refetchInterval: 5000,
  });

  const handleBack = () => {
    navigate(PAGE_ROUTES.RESULTS);
  };

  // ローディング中
  if (isDetailLoading && !detailData) {
    return (
      <ResultsLayout
        title="項目別詳細"
        totalEvaluators={resultsData?.totalEvaluators}
        targetEvaluators={resultsData?.targetEvaluators}
        isLoading
      >
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <CircularProgress size={48} sx={{ mb: 2 }} />
          <Typography variant="body1" color="text.secondary">
            詳細を読み込み中...
          </Typography>
        </Box>
      </ResultsLayout>
    );
  }

  // APIエラーの場合
  if (detailError) {
    return (
      <ResultsLayout title="項目別詳細">
        <Box sx={{ mb: 2 }}>
          <IconButton onClick={handleBack}>
            <ArrowBackIcon />
          </IconButton>
        </Box>

        <Alert
          severity="info"
          sx={{ mb: 3 }}
          action={
            <Button
              color="inherit"
              size="small"
              startIcon={<RefreshIcon />}
              onClick={() => refetchDetail()}
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
            項目別詳細ページ（P-003）
          </Typography>
          <Typography variant="body2" color="text.secondary">
            このページでは、特定の部署に対する評価項目別の詳細結果を表示します。
          </Typography>
        </Paper>
      </ResultsLayout>
    );
  }

  if (!detailData) {
    return null;
  }

  const { departmentName, totalScore, criteriaResults, totalEvaluators } = detailData;

  // 最高得点を取得（グラフのスケーリング用）
  const maxPoints = Math.max(...criteriaResults.map((r) => r.totalPoints), 1);

  return (
    <ResultsLayout
      title={departmentName}
      totalEvaluators={resultsData?.totalEvaluators ?? totalEvaluators}
      targetEvaluators={resultsData?.targetEvaluators ?? 150}
    >
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mb: 2 }}
        >
          結果一覧に戻る
        </Button>

        <Paper elevation={2} sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {departmentName}
            </Typography>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="caption" color="text.secondary">
                総合得点
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {totalScore.toLocaleString()}
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>

      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        評価項目別得点
      </Typography>

      {criteriaResults.map((criteria) => {
        const barWidth = (criteria.totalPoints / maxPoints) * 100;

        return (
          <Card key={criteria.criteriaId} sx={{ mb: 2 }}>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 1,
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  {criteria.criteriaName}
                </Typography>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {criteria.totalPoints.toLocaleString()}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    平均: {criteria.averageScore.toFixed(1)}点
                  </Typography>
                </Box>
              </Box>

              {/* スコアバー */}
              <Box
                sx={{
                  height: 8,
                  bgcolor: 'grey.200',
                  borderRadius: 2,
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    height: '100%',
                    width: `${barWidth}%`,
                    background: 'linear-gradient(90deg, #00D4FF 0%, #FF0080 100%)',
                    borderRadius: 2,
                    transition: 'width 0.5s ease',
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        );
      })}
    </ResultsLayout>
  );
}

export default DepartmentDetailPage;
