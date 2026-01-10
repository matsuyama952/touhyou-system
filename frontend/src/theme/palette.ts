/**
 * Neon White テーマ - カラーパレット
 * ホワイトベース + シアン/マゼンタのネオンカラー
 */

export const neonWhitePalette = {
  primary: {
    main: '#00D4FF',      // シアン（メインアクセント）
    light: '#66E5FF',
    dark: '#00A3CC',
    contrastText: '#0A0A0A',
  },
  secondary: {
    main: '#FF0080',      // マゼンタ（サブアクセント）
    light: '#FF4DA6',
    dark: '#CC0066',
    contrastText: '#FFFFFF',
  },
  background: {
    default: '#FAFAFA',   // 明るいグレーホワイト
    paper: '#FFFFFF',     // 純白
  },
  text: {
    primary: '#1A1A1A',   // ほぼ黒
    secondary: '#666666', // グレー
    disabled: '#AAAAAA',
  },
  divider: 'rgba(0, 0, 0, 0.08)',
  action: {
    hover: 'rgba(0, 212, 255, 0.08)',
    selected: 'rgba(0, 212, 255, 0.12)',
    disabled: 'rgba(0, 0, 0, 0.26)',
    disabledBackground: 'rgba(0, 0, 0, 0.12)',
  },
  success: {
    main: '#00E676',
    light: '#69F0AE',
    dark: '#00C853',
    contrastText: '#0A0A0A',
  },
  warning: {
    main: '#FFAB00',
    light: '#FFD740',
    dark: '#FF8F00',
    contrastText: '#0A0A0A',
  },
  error: {
    main: '#FF1744',
    light: '#FF616F',
    dark: '#D50000',
    contrastText: '#FFFFFF',
  },
  info: {
    main: '#00D4FF',
    light: '#66E5FF',
    dark: '#00A3CC',
    contrastText: '#0A0A0A',
  },
};

/**
 * ネオングロー効果用のカスタムカラー
 */
export const neonGlow = {
  cyan: '0 0 20px rgba(0, 212, 255, 0.5)',
  magenta: '0 0 20px rgba(255, 0, 128, 0.5)',
  cyanStrong: '0 0 30px rgba(0, 212, 255, 0.7)',
  magentaStrong: '0 0 30px rgba(255, 0, 128, 0.7)',
};

/**
 * グラデーション定義
 */
export const gradients = {
  /** シアン→マゼンタのネオングラデーション */
  neonPrimary: 'linear-gradient(135deg, #00D4FF 0%, #FF0080 100%)',
  /** 淡いネオングラデーション（背景用） */
  neonSubtle: 'linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(255, 0, 128, 0.1) 100%)',
  /** ホワイトベースのソフトグラデーション */
  softWhite: 'linear-gradient(180deg, #FFFFFF 0%, #F5F5F5 100%)',
};
