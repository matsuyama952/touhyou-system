import type { ReactNode } from 'react';
import { Box, Container, AppBar, Toolbar, Typography } from '@mui/material';
import { gradients } from '../theme';

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

/**
 * 公開ページ用レイアウト
 * 認証不要のページで使用
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
        background: gradients.softWhite,
      }}
    >
      {showHeader && (
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            background: gradients.neonPrimary,
          }}
        >
          <Toolbar>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                width: '100%',
                textAlign: 'center',
                fontWeight: 700,
                color: 'common.white',
                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              {title}
            </Typography>
          </Toolbar>
        </AppBar>
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
            py: 3,
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
    </Box>
  );
}

export default PublicLayout;
