import type { ReactNode } from 'react';
import { Box, Container, AppBar, Toolbar, Typography, LinearProgress, Chip } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import { gradients } from '../theme';

interface ResultsLayoutProps {
  children: ReactNode;
  /** ページタイトル */
  title?: string;
  /** 評価済み人数 */
  totalEvaluators?: number;
  /** 対象者数 */
  targetEvaluators?: number;
  /** 読み込み中 */
  isLoading?: boolean;
}

/**
 * 結果表示ページ用レイアウト
 * 大画面投影を想定したレイアウト
 */
export function ResultsLayout({
  children,
  title = '評価結果',
  totalEvaluators = 0,
  targetEvaluators = 150,
  isLoading = false,
}: ResultsLayoutProps) {
  const progressPercent = targetEvaluators > 0
    ? Math.min((totalEvaluators / targetEvaluators) * 100, 100)
    : 0;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: gradients.softWhite,
      }}
    >
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: gradients.neonPrimary,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography
            variant="h5"
            component="h1"
            sx={{
              fontWeight: 700,
              color: 'common.white',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            {title}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip
              icon={<PeopleIcon />}
              label={`${totalEvaluators} / ${targetEvaluators} 名`}
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                color: 'common.white',
                fontWeight: 600,
                fontSize: '1rem',
                height: 40,
                '& .MuiChip-icon': {
                  color: 'common.white',
                },
              }}
            />
          </Box>
        </Toolbar>

        {/* 評価進捗バー */}
        <Box sx={{ px: 2, pb: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              評価進捗
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              {progressPercent.toFixed(0)}%
            </Typography>
          </Box>
          <LinearProgress
            variant={isLoading ? 'indeterminate' : 'determinate'}
            value={progressPercent}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: 'rgba(255,255,255,0.2)',
              '& .MuiLinearProgress-bar': {
                bgcolor: 'common.white',
                borderRadius: 4,
              },
            }}
          />
        </Box>
      </AppBar>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            py: 3,
            flexGrow: 1,
          }}
        >
          {children}
        </Container>
      </Box>
    </Box>
  );
}

export default ResultsLayout;
