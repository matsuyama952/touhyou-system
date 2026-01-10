import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import type { VoteGuardState } from '../types';

/**
 * 二重評価防止のコンテキスト値
 */
interface VoteGuardContextValue extends VoteGuardState {
  /** フィンガープリント読み込み中 */
  isLoading: boolean;
  /** 評価完了を記録 */
  markAsVoted: (eventYear: number) => void;
  /** 評価済み状態をリセット（開発用） */
  resetVoteStatus: () => void;
  /** 評価済みかどうかをチェック */
  checkVoteStatus: (eventYear: number) => boolean;
}

const VoteGuardContext = createContext<VoteGuardContextValue | null>(null);

/**
 * localStorageのキー
 */
const STORAGE_KEY = 'vote_guard_state';

/**
 * localStorageから状態を取得
 */
const getStoredState = (): Partial<VoteGuardState> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // パースエラー時は空オブジェクトを返す
  }
  return {};
};

/**
 * localStorageに状態を保存
 */
const saveState = (state: VoteGuardState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // 保存エラー時は何もしない
  }
};

interface VoteGuardProviderProps {
  children: ReactNode;
}

/**
 * 二重評価防止のプロバイダー
 */
export function VoteGuardProvider({ children }: VoteGuardProviderProps) {
  const [state, setState] = useState<VoteGuardState>({
    fingerprint: null,
    hasVoted: false,
    eventYear: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  // 初期化: FingerprintJSでデバイスフィンガープリントを取得
  useEffect(() => {
    const initFingerprint = async () => {
      try {
        // localStorageから保存済み状態を復元
        const storedState = getStoredState();

        // FingerprintJSを初期化
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        const fingerprint = result.visitorId;

        // 状態を更新
        setState({
          fingerprint,
          hasVoted: storedState.hasVoted ?? false,
          eventYear: storedState.eventYear ?? null,
        });
      } catch {
        // FingerprintJS取得失敗時はフォールバック
        // （ブラウザの情報から簡易的なIDを生成）
        const fallbackId = `fallback_${Date.now()}_${Math.random().toString(36).slice(2)}`;
        const storedState = getStoredState();

        setState({
          fingerprint: fallbackId,
          hasVoted: storedState.hasVoted ?? false,
          eventYear: storedState.eventYear ?? null,
        });
      } finally {
        setIsLoading(false);
      }
    };

    initFingerprint();
  }, []);

  /**
   * 評価完了を記録
   */
  const markAsVoted = (eventYear: number) => {
    const newState: VoteGuardState = {
      ...state,
      hasVoted: true,
      eventYear,
    };
    setState(newState);
    saveState(newState);
  };

  /**
   * 評価済み状態をリセット（開発・テスト用）
   */
  const resetVoteStatus = () => {
    const newState: VoteGuardState = {
      ...state,
      hasVoted: false,
      eventYear: null,
    };
    setState(newState);
    saveState(newState);
  };

  /**
   * 特定年度の評価済みかどうかをチェック
   */
  const checkVoteStatus = (eventYear: number): boolean => {
    return state.hasVoted && state.eventYear === eventYear;
  };

  const value: VoteGuardContextValue = {
    ...state,
    isLoading,
    markAsVoted,
    resetVoteStatus,
    checkVoteStatus,
  };

  return (
    <VoteGuardContext.Provider value={value}>
      {children}
    </VoteGuardContext.Provider>
  );
}

/**
 * 二重評価防止のカスタムフック
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useVoteGuard(): VoteGuardContextValue {
  const context = useContext(VoteGuardContext);
  if (!context) {
    throw new Error('useVoteGuard must be used within a VoteGuardProvider');
  }
  return context;
}
