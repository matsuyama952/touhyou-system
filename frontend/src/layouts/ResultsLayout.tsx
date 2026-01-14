import type { ReactNode } from 'react';
import { Box, Container, Typography } from '@mui/material';

interface ResultsLayoutProps {
  children: ReactNode;
  /** ページタイトル */
  title?: string;
  /** 評価済み人数 */
  totalEvaluators?: number;
}

// 高級デザイン用カラーパレット（スクリーン投影用）
const luxuryColors = {
  background: '#F5F5F5',
  backgroundAlt: '#FAF9F7',
  text: '#000000',
  textSecondary: '#333333',
  gold: '#D4AF37',
  goldLight: '#E8D5A3',
  border: '#CCCCCC',
};

/**
 * 結果表示ページ用レイアウト
 * スクリーン投影用・60m離れても見やすい大きなデザイン
 */
export function ResultsLayout({
  children,
  title = '評価結果',
  totalEvaluators = 0,
}: ResultsLayoutProps) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: luxuryColors.background,
      }}
    >
      {/* ヘッダー - スクリーン投影用大きめ */}
      <Box
        component="header"
        sx={{
          borderBottom: `2px solid ${luxuryColors.border}`,
          bgcolor: luxuryColors.backgroundAlt,
          py: 5,
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            {/* ゴールドのアクセントライン */}
            <Box
              sx={{
                width: 100,
                height: 2,
                bgcolor: luxuryColors.gold,
                mx: 'auto',
                mb: 3,
              }}
            />
            <Typography
              variant="h1"
              component="h1"
              sx={{
                fontFamily: '"Playfair Display", "Times New Roman", serif',
                fontWeight: 500,
                color: luxuryColors.text,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                fontSize: { xs: '2.5rem', md: '4rem' },
              }}
            >
              {title}
            </Typography>
            <Box
              sx={{
                width: 100,
                height: 2,
                bgcolor: luxuryColors.gold,
                mx: 'auto',
                mt: 3,
              }}
            />
          </Box>

          {/* 評価人数 */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              sx={{
                fontFamily: '"Playfair Display", serif',
                color: luxuryColors.gold,
                fontWeight: 600,
                fontSize: '5rem',
              }}
            >
              {totalEvaluators}
            </Typography>
            <Typography
              sx={{
                fontFamily: '"Playfair Display", serif',
                color: luxuryColors.textSecondary,
                letterSpacing: '0.2em',
                fontSize: '1.5rem',
                mt: 1,
              }}
            >
              EVALUATORS
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* メインコンテンツ */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Container
          maxWidth="xl"
          sx={{
            py: 6,
            flexGrow: 1,
          }}
        >
          {children}
        </Container>
      </Box>

      {/* フッター */}
      <Box
        component="footer"
        sx={{
          borderTop: `2px solid ${luxuryColors.border}`,
          py: 4,
          textAlign: 'center',
        }}
      >
        <Typography
          sx={{
            color: luxuryColors.textSecondary,
            letterSpacing: '0.15em',
            fontFamily: '"Playfair Display", serif',
            fontSize: '1.2rem',
          }}
        >
          VOTING SYSTEM
        </Typography>
      </Box>
    </Box>
  );
}

export default ResultsLayout;
