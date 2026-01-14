import type { ReactNode } from 'react';
import { Box, Container, Typography } from '@mui/material';

interface PublicLayoutProps {
  children: ReactNode;
  /** ヘッダーを表示するか（デフォルト: true） */
  showHeader?: boolean;
  /** コンテナの最大幅（デフォルト: 'sm'） */
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  /** 中央配置するか（デフォルト: false） */
  centerContent?: boolean;
  /** ページタイトル */
  title?: string;
}

// 高級デザイン用カラーパレット
const luxuryColors = {
  background: '#F5F5F5',
  backgroundAlt: '#FAF9F7',
  text: '#000000',
  textSecondary: '#333333',
  gold: '#D4AF37',
  goldLight: '#E8D5A3',
  border: '#E0E0E0',
  cream: '#FFFEF9',
};

/**
 * 公開ページ用レイアウト
 * 高級ファッション風デザイン
 */
export function PublicLayout({
  children,
  showHeader = true,
  maxWidth = 'sm',
  centerContent = false,
  title = '投票',
}: PublicLayoutProps) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: luxuryColors.background,
      }}
    >
      {showHeader && (
        <Box
          component="header"
          sx={{
            borderBottom: `1px solid ${luxuryColors.border}`,
            bgcolor: luxuryColors.backgroundAlt,
            py: 3,
          }}
        >
          <Container maxWidth={maxWidth}>
            <Box sx={{ textAlign: 'center' }}>
              {/* ゴールドのアクセントライン */}
              <Box
                sx={{
                  width: 40,
                  height: 1,
                  bgcolor: luxuryColors.gold,
                  mx: 'auto',
                  mb: 2,
                }}
              />
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontFamily: '"Playfair Display", "Times New Roman", serif',
                  fontWeight: 500,
                  color: luxuryColors.text,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                }}
              >
                {title}
              </Typography>
              <Box
                sx={{
                  width: 40,
                  height: 1,
                  bgcolor: luxuryColors.gold,
                  mx: 'auto',
                  mt: 2,
                }}
              />
            </Box>
          </Container>
        </Box>
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          ...(centerContent && {
            justifyContent: 'center',
            alignItems: 'center',
          }),
        }}
      >
        <Container
          maxWidth={maxWidth}
          sx={{
            py: 4,
            ...(centerContent && {
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }),
          }}
        >
          {children}
        </Container>
      </Box>

      {/* フッター */}
      <Box
        component="footer"
        sx={{
          borderTop: `1px solid ${luxuryColors.border}`,
          py: 2,
          textAlign: 'center',
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: luxuryColors.textSecondary,
            letterSpacing: '0.1em',
            fontFamily: '"Playfair Display", serif',
          }}
        >
          VOTING SYSTEM
        </Typography>
      </Box>
    </Box>
  );
}

export default PublicLayout;
