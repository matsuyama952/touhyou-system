import { useState, useCallback, useMemo } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  AlertTitle,
  Paper,
  Button,
  Card,
  CardContent,
  LinearProgress,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { PublicLayout } from '../layouts/PublicLayout';
import { useVoteGuard } from '../contexts/VoteGuardContext';
import { getDepartments, getCriteria, submitVote } from '../services/api';
import { neonGlow, gradients } from '../theme';
import type {
  EvaluationState,
  Department,
  EvaluationCriteria,
  VoteRequest,
} from '../types';

// ============================================================
// 初期状態
// ============================================================

const createInitialState = (): EvaluationState => ({
  currentStep: 'intro',
  currentDepartmentIndex: 0,
  evaluations: {},
  isCompleted: false,
});

// ============================================================
// サブコンポーネント
// ============================================================

/**
 * イントロ画面 - 投票の流れと評価項目の説明
 */
interface IntroScreenProps {
  criteria: EvaluationCriteria[];
  onStart: () => void;
}

function IntroScreen({ criteria, onStart }: IntroScreenProps) {
  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        各部署の発表を評価してください
      </Typography>

      {/* 投票の流れ */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, textAlign: 'left' }}>
        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={{ mb: 2, fontWeight: 600 }}
        >
          投票の流れ
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {[
            '各カンパニー・事業部を順番に評価する',
            '入力内容を確認',
            '送信して完了',
          ].map((text, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: gradients.neonPrimary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  flexShrink: 0,
                }}
              >
                {index + 1}
              </Box>
              <Typography variant="body1">{text}</Typography>
            </Box>
          ))}
        </Box>
      </Paper>

      {/* 評価項目の説明 */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, textAlign: 'left' }}>
        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={{ mb: 2, fontWeight: 600 }}
        >
          {criteria.length}つの評価項目
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {criteria.map((item) => (
            <Card
              key={item.id}
              variant="outlined"
              sx={{
                background: gradients.neonSubtle,
                border: '1px solid rgba(0, 0, 0, 0.08)',
              }}
            >
              <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {item.name}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Paper>

      {/* 投票開始ボタン */}
      <Button
        variant="contained"
        size="large"
        fullWidth
        onClick={onStart}
        sx={{
          py: 2,
          fontSize: '1.125rem',
          fontWeight: 600,
        }}
      >
        投票を始める
      </Button>
    </Box>
  );
}

/**
 * スコア選択ボタン
 */
interface ScoreSelectorProps {
  value: number | undefined;
  onChange: (score: number) => void;
}

function ScoreSelector({ value, onChange }: ScoreSelectorProps) {
  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
          justifyContent: 'center',
        }}
      >
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => {
          const isSelected = value === score;
          return (
            <Button
              key={score}
              variant={isSelected ? 'contained' : 'outlined'}
              onClick={() => onChange(score)}
              sx={{
                width: 44,
                height: 44,
                minWidth: 44,
                borderRadius: '50%',
                fontWeight: 600,
                ...(isSelected && {
                  boxShadow: neonGlow.cyan,
                }),
                ...(!isSelected && {
                  borderColor: 'rgba(0, 0, 0, 0.12)',
                  color: 'text.primary',
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: 'rgba(0, 212, 255, 0.08)',
                  },
                }),
              }}
            >
              {score}
            </Button>
          );
        })}
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          mt: 1,
          px: 1,
        }}
      >
        <Typography variant="caption" color="text.secondary">
          低い
        </Typography>
        <Typography variant="caption" color="text.secondary">
          高い
        </Typography>
      </Box>
    </Box>
  );
}

/**
 * 評価画面 - 部署ごとの評価入力
 */
interface EvaluationScreenProps {
  department: Department;
  departmentIndex: number;
  totalDepartments: number;
  criteria: EvaluationCriteria[];
  scores: { [criteriaId: string]: number };
  onScoreChange: (criteriaId: string, score: number) => void;
  onBack: () => void;
  onNext: () => void;
  isFirstDepartment: boolean;
  isLastDepartment: boolean;
}

function EvaluationScreen({
  department,
  departmentIndex,
  totalDepartments,
  criteria,
  scores,
  onScoreChange,
  onBack,
  onNext,
  isFirstDepartment,
  isLastDepartment,
}: EvaluationScreenProps) {
  const progress = ((departmentIndex + 1) / totalDepartments) * 100;
  const allScoresEntered = criteria.every((c) => scores[c.id] !== undefined);

  return (
    <Box>
      {/* プログレス */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: 'center', mb: 1 }}
        >
          {departmentIndex + 1}/{totalDepartments}ページ
        </Typography>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: 'rgba(0, 0, 0, 0.08)',
            '& .MuiLinearProgress-bar': {
              background: gradients.neonPrimary,
              borderRadius: 4,
            },
          }}
        />
      </Box>

      {/* 部署カード */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Box
          sx={{
            width: '100%',
            height: 180,
            background: gradients.neonSubtle,
            borderRadius: 3,
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {department.imageUrl ? (
            <Box
              component="img"
              src={department.imageUrl}
              alt={department.name}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          ) : (
            <Typography variant="body2" color="text.disabled">
              部署画像
            </Typography>
          )}
        </Box>
        <Typography
          variant="h4"
          sx={{ fontWeight: 700, textAlign: 'center' }}
        >
          {department.name}
        </Typography>
      </Paper>

      {/* 評価項目 */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
        {criteria.map((item) => (
          <Paper key={item.id} elevation={2} sx={{ p: 2.5 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, whiteSpace: 'pre-line' }}>
              {item.name}
            </Typography>
            <ScoreSelector
              value={scores[item.id]}
              onChange={(score) => onScoreChange(item.id, score)}
            />
          </Paper>
        ))}
      </Box>

      {/* ボタン */}
      <Box sx={{ display: 'flex', gap: 1.5 }}>
        <Button
          variant="outlined"
          size="large"
          onClick={onBack}
          sx={{
            flex: 1,
            py: 1.5,
            borderColor: 'rgba(0, 0, 0, 0.12)',
            color: 'text.secondary',
          }}
        >
          {isFirstDepartment ? '戻る' : '前の部署'}
        </Button>
        <Button
          variant="contained"
          size="large"
          onClick={onNext}
          disabled={!allScoresEntered}
          sx={{ flex: 1, py: 1.5 }}
        >
          {isLastDepartment ? '確認へ' : '次の部署へ'}
        </Button>
      </Box>
    </Box>
  );
}

/**
 * 確認画面 - 全評価のサマリー
 */
interface ConfirmationScreenProps {
  departments: Department[];
  criteria: EvaluationCriteria[];
  evaluations: EvaluationState['evaluations'];
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

function ConfirmationScreen({
  departments,
  criteria,
  evaluations,
  onBack,
  onSubmit,
  isSubmitting,
}: ConfirmationScreenProps) {
  return (
    <Box>
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, textAlign: 'center', mb: 3 }}
        >
          評価内容の確認
        </Typography>

        {departments.map((dept, index) => (
          <Box
            key={dept.id}
            sx={{
              py: 2,
              borderBottom:
                index < departments.length - 1
                  ? '1px solid rgba(0, 0, 0, 0.08)'
                  : 'none',
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              {index + 1}. {dept.name}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              {criteria.map((c) => (
                <Box
                  key={c.id}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {c.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, color: 'primary.main' }}
                  >
                    {evaluations[dept.id]?.[c.id] ?? '-'}点
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        ))}
      </Paper>

      {/* ボタン */}
      <Box sx={{ display: 'flex', gap: 1.5 }}>
        <Button
          variant="outlined"
          size="large"
          onClick={onBack}
          disabled={isSubmitting}
          sx={{
            flex: 1,
            py: 1.5,
            borderColor: 'rgba(0, 0, 0, 0.12)',
            color: 'text.secondary',
          }}
        >
          戻って修正
        </Button>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          onClick={onSubmit}
          disabled={isSubmitting}
          sx={{
            flex: 1,
            py: 1.5,
            '&:hover': {
              boxShadow: neonGlow.magenta,
            },
          }}
        >
          {isSubmitting ? '送信中...' : '評価を送信'}
        </Button>
      </Box>
    </Box>
  );
}

/**
 * 完了画面
 */
function CompletedScreen() {
  return (
    <Paper elevation={2} sx={{ p: 6, textAlign: 'center' }}>
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          backgroundColor: 'success.main',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mx: 'auto',
          mb: 3,
        }}
      >
        <CheckCircleIcon sx={{ fontSize: 48, color: '#FFFFFF' }} />
      </Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
        投票完了
      </Typography>
      <Typography variant="body1" color="text.secondary">
        ご投票ありがとうございました。
        <br />
        結果は結果表示ページでご確認いただけます。
      </Typography>
    </Paper>
  );
}

// ============================================================
// メインコンポーネント
// ============================================================

/**
 * P-001: 評価ページ
 * 社員がスマホから全部署の発表を3つの評価項目で10段階評価する
 */
function EvaluationPage() {
  const { isLoading: isGuardLoading, hasVoted, fingerprint, markAsVoted } = useVoteGuard();

  // 評価状態
  const [state, setState] = useState<EvaluationState>(createInitialState);

  // 部署一覧を取得
  const {
    data: departments,
    isLoading: isDepartmentsLoading,
    error: departmentsError,
    refetch: refetchDepartments,
  } = useQuery({
    queryKey: ['departments'],
    queryFn: getDepartments,
    refetchInterval: false,
  });

  // 評価項目を取得
  const {
    data: criteria,
    isLoading: isCriteriaLoading,
    error: criteriaError,
    refetch: refetchCriteria,
  } = useQuery({
    queryKey: ['criteria'],
    queryFn: getCriteria,
    refetchInterval: false,
  });

  // 投票送信
  const voteMutation = useMutation({
    mutationFn: submitVote,
    onSuccess: () => {
      markAsVoted(new Date().getFullYear());
      setState((prev) => ({
        ...prev,
        currentStep: 'completed',
        isCompleted: true,
      }));
    },
  });

  // 部署一覧をソート
  const sortedDepartments = useMemo(
    () => [...(departments ?? [])].sort((a, b) => a.displayOrder - b.displayOrder),
    [departments]
  );

  // 現在の部署（ソート済みリストから取得）
  const currentDepartment = useMemo(
    () => sortedDepartments[state.currentDepartmentIndex],
    [sortedDepartments, state.currentDepartmentIndex]
  );

  // 現在の部署のスコア
  const currentScores = useMemo(
    () =>
      currentDepartment
        ? state.evaluations[currentDepartment.id] ?? {}
        : {},
    [currentDepartment, state.evaluations]
  );

  // イベントハンドラ
  const handleStart = useCallback(() => {
    setState((prev) => ({ ...prev, currentStep: 'evaluation' }));
  }, []);

  const handleScoreChange = useCallback(
    (criteriaId: string, score: number) => {
      if (!currentDepartment) return;
      setState((prev) => ({
        ...prev,
        evaluations: {
          ...prev.evaluations,
          [currentDepartment.id]: {
            ...prev.evaluations[currentDepartment.id],
            [criteriaId]: score,
          },
        },
      }));
    },
    [currentDepartment]
  );

  const handleBack = useCallback(() => {
    setState((prev) => {
      if (prev.currentStep === 'evaluation') {
        if (prev.currentDepartmentIndex === 0) {
          return { ...prev, currentStep: 'intro' };
        }
        return { ...prev, currentDepartmentIndex: prev.currentDepartmentIndex - 1 };
      }
      if (prev.currentStep === 'confirmation') {
        return {
          ...prev,
          currentStep: 'evaluation',
          currentDepartmentIndex: (departments?.length ?? 1) - 1,
        };
      }
      return prev;
    });
    window.scrollTo(0, 0);
  }, [departments?.length]);

  const handleNext = useCallback(() => {
    setState((prev) => {
      const totalDepartments = departments?.length ?? 0;
      if (prev.currentDepartmentIndex < totalDepartments - 1) {
        return { ...prev, currentDepartmentIndex: prev.currentDepartmentIndex + 1 };
      }
      return { ...prev, currentStep: 'confirmation' };
    });
    window.scrollTo(0, 0);
  }, [departments?.length]);

  const handleSubmit = useCallback(() => {
    if (!fingerprint || !departments || !criteria) return;

    const evaluations = departments.flatMap((dept) =>
      criteria.map((c) => ({
        departmentId: dept.id,
        criteriaId: c.id,
        score: state.evaluations[dept.id]?.[c.id] ?? 0,
      }))
    );

    const request: VoteRequest = {
      evaluations,
      fingerprint,
      eventYear: new Date().getFullYear(),
    };

    voteMutation.mutate(request);
  }, [fingerprint, departments, criteria, state.evaluations, voteMutation]);

  // ローディング状態
  const isLoading = isGuardLoading || isDepartmentsLoading || isCriteriaLoading;
  const hasError = departmentsError || criteriaError;

  // ローディング中
  if (isLoading) {
    return (
      <PublicLayout centerContent>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <CircularProgress size={48} sx={{ mb: 2 }} />
          <Typography variant="body1" color="text.secondary">
            読み込み中...
          </Typography>
        </Box>
      </PublicLayout>
    );
  }

  // 評価済みの場合
  if (hasVoted || state.isCompleted) {
    return (
      <PublicLayout centerContent>
        <CompletedScreen />
      </PublicLayout>
    );
  }

  // APIエラーの場合（バックエンド未接続を含む）
  if (hasError) {
    return (
      <PublicLayout>
        <Alert
          severity="info"
          sx={{ mb: 3 }}
          action={
            <Button
              color="inherit"
              size="small"
              startIcon={<RefreshIcon />}
              onClick={() => {
                refetchDepartments();
                refetchCriteria();
              }}
            >
              再試行
            </Button>
          }
        >
          <AlertTitle>バックエンド接続待ち</AlertTitle>
          <Typography variant="body2">
            バックエンドAPIに接続できません。バックエンド基盤構築が完了するまでお待ちください。
          </Typography>
        </Alert>

        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            評価ページ（P-001）
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            このページでは、各部署の発表を3項目×10段階で評価します。
          </Typography>
          <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary">
              デバイスフィンガープリント: {fingerprint?.slice(0, 16)}...
            </Typography>
          </Box>
        </Paper>
      </PublicLayout>
    );
  }

  // データ取得成功 - sortedDepartmentsは上部でuseMemo計算済み
  const sortedCriteria = [...(criteria ?? [])].sort(
    (a, b) => a.displayOrder - b.displayOrder
  );

  return (
    <PublicLayout title="投票">
      {/* イントロ画面 */}
      {state.currentStep === 'intro' && (
        <IntroScreen
          criteria={sortedCriteria}
          onStart={handleStart}
        />
      )}

      {/* 評価画面 */}
      {state.currentStep === 'evaluation' && currentDepartment && (
        <EvaluationScreen
          key={`dept-${state.currentDepartmentIndex}`}
          department={currentDepartment}
          departmentIndex={state.currentDepartmentIndex}
          totalDepartments={sortedDepartments.length}
          criteria={sortedCriteria}
          scores={currentScores}
          onScoreChange={handleScoreChange}
          onBack={handleBack}
          onNext={handleNext}
          isFirstDepartment={state.currentDepartmentIndex === 0}
          isLastDepartment={
            state.currentDepartmentIndex === sortedDepartments.length - 1
          }
        />
      )}

      {/* 確認画面 */}
      {state.currentStep === 'confirmation' && (
        <ConfirmationScreen
          departments={sortedDepartments}
          criteria={sortedCriteria}
          evaluations={state.evaluations}
          onBack={handleBack}
          onSubmit={handleSubmit}
          isSubmitting={voteMutation.isPending}
        />
      )}

      {/* 完了画面 */}
      {state.currentStep === 'completed' && <CompletedScreen />}
    </PublicLayout>
  );
}

export default EvaluationPage;
