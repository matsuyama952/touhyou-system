/**
 * ===== 型定義同期ルール =====
 *
 * 【基本原則】一方の/types/index.tsを更新したら、もう一方の/types/index.tsも必ず同じ内容に更新する
 *
 * 【変更の責任】
 * - 型定義を変更した開発者は、両方のファイルを即座に同期させる
 * - 1つのtypes/index.tsの更新は禁止。必ず1つを更新したらもう一つも更新その場で行う。
 *
 * 【絶対に守るべき原則】
 * 1. フロントエンドとバックエンドで異なる型を作らない
 * 2. 同じデータ構造に対して複数の型を作らない
 * 3. 新しいプロパティは必ずオプショナルとして追加
 * 4. APIパスは必ずこのファイルで一元管理する
 * 5. コード内でAPIパスをハードコードしない
 * 6. 2つの同期されたtypes/index.tsを単一の真実源とする
 * 7. 大規模リファクタリングの時は型変更を最初に行い早期に問題検出
 */

// ============================================================
// APIパス定義（ハードコード禁止）
// ============================================================

export const API_PATHS = {
  /** 部署一覧取得 */
  DEPARTMENTS: '/api/departments',
  /** 評価項目一覧取得 */
  CRITERIA: '/api/criteria',
  /** 評価送信 */
  VOTE: '/api/vote',
  /** 評価結果取得 */
  RESULTS: '/api/results',
  /** 項目別詳細結果取得（departmentIdをパスに埋め込む） */
  RESULTS_DETAIL: (departmentId: string) => `/api/results/${departmentId}`,
  /** ヘルスチェック */
  HEALTH: '/api/health',
} as const;

// ============================================================
// ページルート定義
// ============================================================

export const PAGE_ROUTES = {
  /** P-001: 評価ページ */
  EVALUATION: '/',
  /** P-002: 結果表示ページ */
  RESULTS: '/results',
  /** P-003: 項目別詳細ページ */
  RESULTS_DETAIL: (departmentId: string) => `/results/${departmentId}`,
} as const;

// ============================================================
// エンティティ型定義
// ============================================================

/**
 * 部署
 * DB: departments テーブル
 */
export interface Department {
  /** 部署ID（主キー） */
  id: string;
  /** 部署名 */
  name: string;
  /** 部署画像URL（Cloudinary） */
  imageUrl: string;
  /** 表示順 */
  displayOrder: number;
  /** 作成日時 */
  createdAt?: string;
  /** 更新日時 */
  updatedAt?: string;
}

/**
 * 評価項目
 * DB: evaluation_criteria テーブル
 */
export interface EvaluationCriteria {
  /** 評価項目ID（主キー） */
  id: string;
  /** 評価項目名 */
  name: string;
  /** 表示順 */
  displayOrder: number;
  /** 有効フラグ */
  isActive: boolean;
  /** 作成日時 */
  createdAt?: string;
  /** 更新日時 */
  updatedAt?: string;
}

/**
 * 評価データ（送信用）
 * 1人×1部署×1項目で1件
 */
export interface EvaluationInput {
  /** 評価対象部署ID */
  departmentId: string;
  /** 評価項目ID */
  criteriaId: string;
  /** 点数（1〜10） */
  score: number;
}

/**
 * 評価送信リクエスト
 */
export interface VoteRequest {
  /** 評価データ配列（全部署×全項目分） */
  evaluations: EvaluationInput[];
  /** 端末識別子（FingerprintJS） */
  fingerprint: string;
  /** 評価年度 */
  eventYear: number;
}

/**
 * 評価送信レスポンス
 */
export interface VoteResponse {
  /** 成功フラグ */
  success: boolean;
  /** メッセージ */
  message: string;
}

/**
 * 項目別得点（結果表示用・簡易版）
 */
export interface CriteriaScore {
  /** 評価項目ID */
  criteriaId: string;
  /** 評価項目名 */
  criteriaName: string;
  /** 合計点 */
  totalPoints: number;
}

/**
 * 部署別評価結果（総合得点）
 */
export interface DepartmentResult {
  /** 部署ID */
  departmentId: string;
  /** 部署名 */
  departmentName: string;
  /** 部署画像URL */
  imageUrl?: string;
  /** 総合得点（全評価者の4項目合計点の合計） */
  totalScore: number;
  /** 順位 */
  rank?: number;
  /** 項目別得点 */
  criteriaResults?: CriteriaScore[];
}

/**
 * 評価項目ヘッダー（短縮名）
 */
export interface CriteriaHeader {
  /** 評価項目ID */
  id: string;
  /** 評価項目名（短縮名） */
  name: string;
}

/**
 * 結果表示レスポンス
 */
export interface ResultsResponse {
  /** 部署別結果一覧 */
  results: DepartmentResult[];
  /** 評価項目ヘッダー */
  criteriaHeaders?: CriteriaHeader[];
  /** 評価済み人数 */
  totalEvaluators: number;
  /** 対象者数 */
  targetEvaluators: number;
}

/**
 * 項目別評価結果
 */
export interface CriteriaResult {
  /** 評価項目ID */
  criteriaId: string;
  /** 評価項目名 */
  criteriaName: string;
  /** 合計点 */
  totalPoints: number;
  /** 平均点 */
  averageScore: number;
  /** 評価人数 */
  evaluatorCount: number;
}

/**
 * 項目別詳細レスポンス
 */
export interface DepartmentDetailResponse {
  /** 部署ID */
  departmentId: string;
  /** 部署名 */
  departmentName: string;
  /** 総合得点 */
  totalScore: number;
  /** 項目別集計 */
  criteriaResults: CriteriaResult[];
  /** 評価済み人数 */
  totalEvaluators: number;
}

/**
 * イベント設定
 */
export interface EventConfig {
  /** 設定ID */
  id: string;
  /** 年度 */
  year: number;
  /** 対象者数 */
  targetEvaluators: number;
  /** 有効フラグ */
  isActive: boolean;
}

/**
 * ヘルスチェックレスポンス
 */
export interface HealthResponse {
  /** ステータス */
  status: 'ok' | 'error';
  /** タイムスタンプ */
  timestamp: string;
  /** DB接続状態 */
  database?: 'connected' | 'disconnected';
}

// ============================================================
// フロントエンド固有の型定義
// ============================================================

/**
 * 評価ページの画面ステップ
 * - intro: イントロ画面（投票の流れ・評価項目説明）
 * - evaluation: 評価画面（部署ごとに3項目評価）
 * - confirmation: 確認画面（全評価のサマリー）
 * - completed: 完了画面
 */
export type EvaluationStep = 'intro' | 'evaluation' | 'confirmation' | 'completed';

/**
 * 評価状態（フロントエンドのみ）
 * 1人が全部署を評価する際の進捗管理
 */
export interface EvaluationState {
  /** 現在の画面ステップ */
  currentStep: EvaluationStep;
  /** 現在評価中の部署インデックス（0から開始） */
  currentDepartmentIndex: number;
  /** 全部署の評価データ */
  evaluations: {
    [departmentId: string]: {
      [criteriaId: string]: number;
    };
  };
  /** 評価完了フラグ */
  isCompleted: boolean;
}

/**
 * 二重評価防止の状態
 */
export interface VoteGuardState {
  /** 端末フィンガープリント */
  fingerprint: string | null;
  /** 評価済みフラグ */
  hasVoted: boolean;
  /** 評価年度 */
  eventYear: number | null;
}
