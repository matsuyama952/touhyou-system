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
import type {
  EvaluationState,
  Department,
  EvaluationCriteria,
  VoteRequest,
} from '../types';

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
      <Typography
        variant="h5"
        sx={{
          fontFamily: '"Playfair Display", serif',
          fontWeight: 500,
          mb: 4,
          color: luxuryColors.text,
          letterSpacing: '0.05em',
        }}
      >
        各部署の発表を評価してください
      </Typography>

      {/* 投票の流れ */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          textAlign: 'left',
          bgcolor: luxuryColors.cream,
          border: `1px solid ${luxuryColors.border}`,
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            mb: 2,
            fontWeight: 600,
            color: luxuryColors.gold,
            letterSpacing: '0.1em',
            fontFamily: '"Playfair Display", serif',
          }}
        >
          PROCESS
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[
            '各カンパニー・事業部を順番に評価する',
            '入力内容を確認',
            '送信して完了',
          ].map((text, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  border: `2px solid ${luxuryColors.gold}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: luxuryColors.gold,
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  flexShrink: 0,
                  fontFamily: '"Playfair Display", serif',
                }}
              >
                {index + 1}
              </Box>
              <Typography
                variant="body1"
                sx={{
                  fontFamily: '"Playfair Display", serif',
                  color: luxuryColors.text,
                }}
              >
                {text}
              </Typography>
            </Box>
          ))}
        </Box>
      </Paper>

      {/* 評価項目の説明 */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          textAlign: 'left',
          bgcolor: luxuryColors.cream,
          border: `1px solid ${luxuryColors.border}`,
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            mb: 2,
            fontWeight: 600,
            color: luxuryColors.gold,
            letterSpacing: '0.1em',
            fontFamily: '"Playfair Display", serif',
          }}
        >
          {criteria.length} CRITERIA
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {criteria.map((item) => (
            <Card
              key={item.id}
              variant="outlined"
              sx={{
                bgcolor: luxuryColors.backgroundAlt,
                border: `1px solid ${luxuryColors.border}`,
              }}
            >
              <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                {(() => {
                  const parts = item.name.split('\n');
                  const title = parts[0];
                  const description = parts.slice(1).join('\n');
                  return (
                    <>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 600,
                          fontFamily: '"Playfair Display", serif',
                          color: luxuryColors.text,
                          letterSpacing: '0.03em',
                        }}
                      >
                        {title}
                      </Typography>
                      {description && (
                        <Typography
                          variant="body2"
                          sx={{
                            mt: 0.5,
                            whiteSpace: 'pre-line',
                            fontFamily: '"Playfair Display", serif',
                            color: luxuryColors.textSecondary,
                            lineHeight: 1.5,
                          }}
                        >
                          {description}
                        </Typography>
                      )}
                    </>
                  );
                })()}
              </CardContent>
            </Card>
          ))}
        </Box>
      </Paper>

      {/* 投票開始ボタン */}
      <Button
        variant="outlined"
        size="large"
        fullWidth
        onClick={onStart}
        sx={{
          py: 2,
          fontSize: '1.125rem',
          fontWeight: 500,
          fontFamily: '"Playfair Display", serif',
          color: luxuryColors.gold,
          borderColor: luxuryColors.gold,
          borderWidth: 2,
          letterSpacing: '0.1em',
          '&:hover': {
            borderColor: luxuryColors.gold,
            borderWidth: 2,
            bgcolor: 'rgba(212, 175, 55, 0.05)',
          },
        }}
      >
        START VOTING
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
                fontFamily: '"Playfair Display", serif',
                ...(isSelected && {
                  bgcolor: luxuryColors.gold,
                  color: '#FFFFFF',
                  '&:hover': {
                    bgcolor: luxuryColors.gold,
                  },
                }),
                ...(!isSelected && {
                  borderColor: luxuryColors.border,
                  color: luxuryColors.text,
                  '&:hover': {
                    borderColor: luxuryColors.gold,
                    backgroundColor: 'rgba(212, 175, 55, 0.05)',
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
        <Typography
          variant="caption"
          sx={{ color: luxuryColors.textSecondary, fontFamily: '"Playfair Display", serif' }}
        >
          Low
        </Typography>
        <Typography
          variant="caption"
          sx={{ color: luxuryColors.textSecondary, fontFamily: '"Playfair Display", serif' }}
        >
          High
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
          sx={{
            textAlign: 'center',
            mb: 1,
            color: luxuryColors.textSecondary,
            fontFamily: '"Playfair Display", serif',
            letterSpacing: '0.05em',
          }}
        >
          {departmentIndex + 1} / {totalDepartments}
        </Typography>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 4,
            borderRadius: 0,
            backgroundColor: luxuryColors.border,
            '& .MuiLinearProgress-bar': {
              backgroundColor: luxuryColors.gold,
            },
          }}
        />
      </Box>

      {/* 部署カード */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          bgcolor: luxuryColors.cream,
          border: `1px solid ${luxuryColors.border}`,
        }}
      >
        <Box
          sx={{
            width: '100%',
            height: 180,
            bgcolor: luxuryColors.backgroundAlt,
            borderRadius: 0,
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            border: `1px solid ${luxuryColors.border}`,
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
            <Typography
              variant="body2"
              sx={{ color: luxuryColors.textSecondary, fontFamily: '"Playfair Display", serif' }}
            >
              Department Image
            </Typography>
          )}
        </Box>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 500,
            textAlign: 'center',
            fontFamily: '"Playfair Display", serif',
            color: luxuryColors.text,
            letterSpacing: '0.03em',
          }}
        >
          {department.name}
        </Typography>
      </Paper>

      {/* 評価項目 */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
        {criteria.map((item) => (
          <Paper
            key={item.id}
            elevation={0}
            sx={{
              p: 2.5,
              bgcolor: luxuryColors.cream,
              border: `1px solid ${luxuryColors.border}`,
            }}
          >
            {(() => {
              const parts = item.name.split('\n');
              const title = parts[0];
              const description = parts.slice(1).join('\n');
              return (
                <>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      mb: 1,
                      fontFamily: '"Playfair Display", serif',
                      color: luxuryColors.text,
                      letterSpacing: '0.03em',
                    }}
                  >
                    {title}
                  </Typography>
                  {description && (
                    <Typography
                      variant="body2"
                      sx={{
                        mb: 2,
                        whiteSpace: 'pre-line',
                        fontFamily: '"Playfair Display", serif',
                        color: luxuryColors.textSecondary,
                        lineHeight: 1.6,
                      }}
                    >
                      {description}
                    </Typography>
                  )}
                </>
              );
            })()}
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
            borderColor: luxuryColors.border,
            color: luxuryColors.textSecondary,
            fontFamily: '"Playfair Display", serif',
            '&:hover': {
              borderColor: luxuryColors.gold,
              bgcolor: 'rgba(212, 175, 55, 0.05)',
            },
          }}
        >
          {isFirstDepartment ? 'Back' : 'Previous'}
        </Button>
        <Button
          variant="outlined"
          size="large"
          onClick={onNext}
          disabled={!allScoresEntered}
          sx={{
            flex: 1,
            py: 1.5,
            fontFamily: '"Playfair Display", serif',
            color: luxuryColors.gold,
            borderColor: luxuryColors.gold,
            borderWidth: 2,
            '&:hover': {
              borderColor: luxuryColors.gold,
              borderWidth: 2,
              bgcolor: 'rgba(212, 175, 55, 0.05)',
            },
            '&:disabled': {
              borderColor: luxuryColors.border,
              color: luxuryColors.border,
            },
          }}
        >
          {isLastDepartment ? 'Confirm' : 'Next'}
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
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          bgcolor: luxuryColors.cream,
          border: `1px solid ${luxuryColors.border}`,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 500,
            textAlign: 'center',
            mb: 3,
            fontFamily: '"Playfair Display", serif',
            color: luxuryColors.gold,
            letterSpacing: '0.1em',
          }}
        >
          CONFIRMATION
        </Typography>

        {departments.map((dept, index) => (
          <Box
            key={dept.id}
            sx={{
              py: 2,
              borderBottom:
                index < departments.length - 1
                  ? `1px solid ${luxuryColors.border}`
                  : 'none',
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 500,
                mb: 1,
                fontFamily: '"Playfair Display", serif',
                color: luxuryColors.text,
              }}
            >
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
                  <Typography
                    variant="body2"
                    sx={{
                      color: luxuryColors.textSecondary,
                      fontFamily: '"Playfair Display", serif',
                    }}
                  >
                    {c.name.split('\n')[0]}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: luxuryColors.gold,
                      fontFamily: '"Playfair Display", serif',
                    }}
                  >
                    {evaluations[dept.id]?.[c.id] ?? '-'}
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
            borderColor: luxuryColors.border,
            color: luxuryColors.textSecondary,
            fontFamily: '"Playfair Display", serif',
            '&:hover': {
              borderColor: luxuryColors.gold,
              bgcolor: 'rgba(212, 175, 55, 0.05)',
            },
          }}
        >
          Edit
        </Button>
        <Button
          variant="outlined"
          size="large"
          onClick={onSubmit}
          disabled={isSubmitting}
          sx={{
            flex: 1,
            py: 1.5,
            fontFamily: '"Playfair Display", serif',
            color: luxuryColors.gold,
            borderColor: luxuryColors.gold,
            borderWidth: 2,
            '&:hover': {
              borderColor: luxuryColors.gold,
              borderWidth: 2,
              bgcolor: 'rgba(212, 175, 55, 0.05)',
            },
          }}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
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
    <Paper
      elevation={0}
      sx={{
        p: 6,
        textAlign: 'center',
        bgcolor: luxuryColors.cream,
        border: `1px solid ${luxuryColors.border}`,
      }}
    >
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          border: `3px solid ${luxuryColors.gold}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mx: 'auto',
          mb: 3,
        }}
      >
        <CheckCircleIcon sx={{ fontSize: 48, color: luxuryColors.gold }} />
      </Box>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 500,
          mb: 2,
          fontFamily: '"Playfair Display", serif',
          color: luxuryColors.text,
          letterSpacing: '0.1em',
        }}
      >
        COMPLETED
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: luxuryColors.textSecondary,
          fontFamily: '"Playfair Display", serif',
        }}
      >
        Thank you for your vote.
        <br />
        Results will be displayed on the results page.
      </Typography>
    </Paper>
  );
}

// ============================================================
// メインコンポーネント
// ============================================================

/**
 * P-001: 評価ページ
 * 高級ファッション風デザイン
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
          <CircularProgress size={48} sx={{ mb: 2, color: luxuryColors.gold }} />
          <Typography
            variant="body1"
            sx={{
              color: luxuryColors.textSecondary,
              fontFamily: '"Playfair Display", serif',
              letterSpacing: '0.05em',
            }}
          >
            Loading...
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

  // APIエラーの場合
  if (hasError) {
    return (
      <PublicLayout>
        <Alert
          severity="info"
          sx={{
            mb: 3,
            bgcolor: luxuryColors.cream,
            border: `1px solid ${luxuryColors.border}`,
          }}
          action={
            <Button
              color="inherit"
              size="small"
              startIcon={<RefreshIcon />}
              onClick={() => {
                refetchDepartments();
                refetchCriteria();
              }}
              sx={{ color: luxuryColors.gold }}
            >
              Retry
            </Button>
          }
        >
          <AlertTitle sx={{ fontFamily: '"Playfair Display", serif' }}>
            Connection Required
          </AlertTitle>
          <Typography variant="body2">
            Unable to connect to the server. Please wait.
          </Typography>
        </Alert>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            bgcolor: luxuryColors.cream,
            border: `1px solid ${luxuryColors.border}`,
          }}
        >
          <Typography
            variant="h6"
            gutterBottom
            sx={{ fontFamily: '"Playfair Display", serif' }}
          >
            Evaluation Page
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mb: 2,
              color: luxuryColors.textSecondary,
              fontFamily: '"Playfair Display", serif',
            }}
          >
            Evaluate each department on 4 criteria with a 10-point scale.
          </Typography>
          <Box sx={{ bgcolor: luxuryColors.backgroundAlt, p: 2, borderRadius: 0 }}>
            <Typography
              variant="caption"
              sx={{
                color: luxuryColors.textSecondary,
                fontFamily: '"Playfair Display", serif',
              }}
            >
              Device Fingerprint: {fingerprint?.slice(0, 16)}...
            </Typography>
          </Box>
        </Paper>
      </PublicLayout>
    );
  }

  // データ取得成功
  const sortedCriteria = [...(criteria ?? [])].sort(
    (a, b) => a.displayOrder - b.displayOrder
  );

  return (
    <PublicLayout title="VOTING">
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
