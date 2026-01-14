import { createTheme } from '@mui/material/styles';
import { luxuryPalette, luxuryShadow, gradients } from './palette';
import { typography } from './typography';
import { components } from './components';

/**
 * Luxury Gold テーマ
 * ホワイト/クリームベース + ゴールドアクセント
 */
export const theme = createTheme({
  palette: luxuryPalette,
  typography,
  components,
  shape: {
    borderRadius: 0,
  },
  spacing: 8,
});

// カスタムプロパティのエクスポート
export { luxuryShadow, gradients };

export default theme;
