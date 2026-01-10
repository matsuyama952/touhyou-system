import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  AlertTitle,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  CardActionArea,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { ResultsLayout } from '../layouts/ResultsLayout';
import { getResults } from '../services/api';
import { PAGE_ROUTES } from '../types';
import { neonGlow } from '../theme';

/**
 * P-002: 結果表示ページ
 * リアルタイム評価結果（総合得点）をスクリーンに投影する
 */
function ResultsPage() {
  const navigate = useNavigate();

  // 評価結果を取得（5秒間隔でポーリング）
  const {
    data: resultsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['results'],
    queryFn: getResults,
    // 5秒間隔でリフェッチ
    refetchInterval: 5000,
  });

  // ローディング中（初回のみ）
  if (isLoading && !resultsData) {
    return (
      <ResultsLayout isLoading>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <CircularProgress size={48} sx={{ mb: 2 }} />
          <Typography variant="body1" color="text.secondary">
            結果を読み込み中...
          </Typography>
        </Box>
      </ResultsLayout>
    );
  }

  // APIエラーの場合（バックエンド未接続を含む）
  if (error) {
    return (
      <ResultsLayout>
        <Alert
          severity="info"
          sx={{ mb: 3 }}
          action={
            <Button
              color="inherit"
              size="small"
              startIcon={<RefreshIcon />}
              onClick={() => refetch()}
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
            結果表示ページ（P-002）
          </Typography>
          <Typography variant="body2" color="text.secondary">
            このページでは、評価結果（総合得点）を棒グラフで表示します。
            5秒間隔で自動更新されます。
          </Typography>
        </Paper>
      </ResultsLayout>
    );
  }

  const { results, totalEvaluators, targetEvaluators } = resultsData || {
    results: [],
    totalEvaluators: 0,
    targetEvaluators: 150,
  };

  // 最高得点を取得（グラフのスケーリング用）
  const maxScore = Math.max(...results.map((r) => r.totalScore), 1);

  return (
    <ResultsLayout
      totalEvaluators={totalEvaluators}
      targetEvaluators={targetEvaluators}
    >
      {results.length === 0 ? (
        <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            まだ評価データがありません
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            社員の皆さんの評価をお待ちしています。
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {results.map((result, index) => {
            const isFirst = result.rank === 1;
            const barWidth = (result.totalScore / maxScore) * 100;

            return (
              <Grid size={12} key={result.departmentId}>
                <Card
                  sx={{
                    ...(isFirst && {
                      border: '2px solid',
                      borderColor: 'secondary.main',
                      boxShadow: neonGlow.magenta,
                    }),
                  }}
                >
                  <CardActionArea
                    onClick={() =>
                      navigate(PAGE_ROUTES.RESULTS_DETAIL(result.departmentId))
                    }
                  >
                    <CardContent>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          mb: 2,
                        }}
                      >
                        {isFirst && (
                          <EmojiEventsIcon
                            sx={{ color: 'secondary.main', fontSize: 32 }}
                          />
                        )}
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: isFirst ? 700 : 500,
                              color: isFirst ? 'secondary.main' : 'text.primary',
                            }}
                          >
                            {index + 1}. {result.departmentName}
                          </Typography>
                        </Box>
                        <Typography
                          variant="h4"
                          sx={{
                            fontWeight: 700,
                            color: isFirst ? 'secondary.main' : 'primary.main',
                          }}
                        >
                          {result.totalScore.toLocaleString()}
                        </Typography>
                      </Box>

                      {/* スコアバー */}
                      <Box
                        sx={{
                          height: 12,
                          bgcolor: 'grey.200',
                          borderRadius: 2,
                          overflow: 'hidden',
                        }}
                      >
                        <Box
                          sx={{
                            height: '100%',
                            width: `${barWidth}%`,
                            background: isFirst
                              ? 'linear-gradient(90deg, #FF0080 0%, #FF4DA6 100%)'
                              : 'linear-gradient(90deg, #00D4FF 0%, #66E5FF 100%)',
                            borderRadius: 2,
                            transition: 'width 0.5s ease',
                          }}
                        />
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </ResultsLayout>
  );
}

export default ResultsPage;
