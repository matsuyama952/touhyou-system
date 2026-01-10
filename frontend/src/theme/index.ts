import { createTheme } from '@mui/material/styles';
import { neonWhitePalette, neonGlow, gradients } from './palette';
import { typography } from './typography';
import { components } from './components';

/**
 * Neon White テーマ
 * ホワイトベース + シアン/マゼンタのネオンカラー
 */
export const theme = createTheme({
  palette: neonWhitePalette,
  typography,
  components,
  shape: {
    borderRadius: 12,
  },
  spacing: 8,
});

// カスタムプロパティのエクスポート
export { neonGlow, gradients };

export default theme;
