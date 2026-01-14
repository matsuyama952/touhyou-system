/**
 * Luxury Gold テーマ - カラーパレット
 * ホワイト/クリームベース + ゴールドアクセント
 */

export const luxuryPalette = {
  primary: {
    main: '#D4AF37',      // ゴールド（メインアクセント）
    light: '#E8D5A3',
    dark: '#B8952F',
    contrastText: '#000000',
  },
  secondary: {
    main: '#333333',      // ダークグレー（サブアクセント）
    light: '#666666',
    dark: '#1A1A1A',
    contrastText: '#FFFFFF',
  },
  background: {
    default: '#F5F5F5',   // ライトグレー
    paper: '#FFFEF9',     // クリームホワイト
  },
  text: {
    primary: '#000000',   // ブラック
    secondary: '#333333', // ダークグレー
    disabled: '#999999',
  },
  divider: 'rgba(0, 0, 0, 0.12)',
  action: {
    hover: 'rgba(212, 175, 55, 0.08)',
    selected: 'rgba(212, 175, 55, 0.12)',
    disabled: 'rgba(0, 0, 0, 0.26)',
    disabledBackground: 'rgba(0, 0, 0, 0.12)',
  },
  success: {
    main: '#4CAF50',
    light: '#81C784',
    dark: '#388E3C',
    contrastText: '#FFFFFF',
  },
  warning: {
    main: '#D4AF37',      // ゴールド
    light: '#E8D5A3',
    dark: '#B8952F',
    contrastText: '#000000',
  },
  error: {
    main: '#D32F2F',
    light: '#EF5350',
    dark: '#C62828',
    contrastText: '#FFFFFF',
  },
  info: {
    main: '#D4AF37',      // ゴールド
    light: '#E8D5A3',
    dark: '#B8952F',
    contrastText: '#000000',
  },
};

/**
 * ゴールド効果用のカスタムカラー
 */
export const luxuryShadow = {
  cyan: '0 4px 16px rgba(212, 175, 55, 0.3)',
  magenta: '0 4px 16px rgba(212, 175, 55, 0.3)',
  cyanStrong: '0 6px 24px rgba(212, 175, 55, 0.4)',
  magentaStrong: '0 6px 24px rgba(212, 175, 55, 0.4)',
};

/**
 * グラデーション定義
 */
export const gradients = {
  /** ゴールドグラデーション */
  goldPrimary: 'linear-gradient(135deg, #D4AF37 0%, #E8D5A3 50%, #D4AF37 100%)',
  /** 淡いゴールドグラデーション（背景用） */
  goldSubtle: 'linear-gradient(135deg, rgba(212, 175, 55, 0.05) 0%, rgba(232, 213, 163, 0.05) 100%)',
  /** ホワイトベースのソフトグラデーション */
  softWhite: 'linear-gradient(180deg, #FFFFFF 0%, #F5F5F5 100%)',
};
