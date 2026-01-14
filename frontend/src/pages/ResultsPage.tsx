import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  AlertTitle,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { ResultsLayout } from '../layouts/ResultsLayout';
import { getResults } from '../services/api';

// 高級デザイン用カラーパレット（スクリーン投影用・高コントラスト）
const luxuryColors = {
  background: '#F5F5F5',
  backgroundAlt: '#FAF9F7',
  text: '#000000',
  textSecondary: '#333333',
  gold: '#D4AF37',
  goldLight: '#E8D5A3',
  border: '#CCCCCC',
  cream: '#FFFEF9',
};

/**
 * カウントアップ用カスタムフック
 */
function useCountUp(targetValue: number, duration: number = 2000, startAnimation: boolean = true) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startAnimation || targetValue === 0) {
      setCount(targetValue);
      return;
    }

    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(eased * targetValue));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [targetValue, duration, startAnimation]);

  return count;
}

/**
 * カウントアップセル コンポーネント（スクリーン投影用・大きめ）
 */
function CountUpCell({
  value,
  isFirst,
  startAnimation
}: {
  value: number;
  isFirst: boolean;
  startAnimation: boolean;
}) {
  const displayValue = useCountUp(value, 2000, startAnimation);

  return (
    <TableCell
      align="center"
      sx={{
        fontFamily: '"Playfair Display", serif',
        fontWeight: 600,
        fontSize: '2.5rem',
        color: isFirst ? luxuryColors.gold : luxuryColors.text,
        bgcolor: isFirst ? 'rgba(212, 175, 55, 0.08)' : 'transparent',
        borderBottom: `2px solid ${luxuryColors.border}`,
        py: 3,
        px: 2,
      }}
    >
      {displayValue.toLocaleString()}
    </TableCell>
  );
}

/**
 * シールコンポーネント（スクリーン投影用・大きめ）
 */
function SealOverlay({
  isRevealed,
  onReveal,
  rank
}: {
  isRevealed: boolean;
  onReveal: () => void;
  rank: number;
}) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    if (!isRevealed && !isAnimating) {
      setIsAnimating(true);
      setTimeout(() => {
        onReveal();
        setIsAnimating(false);
      }, 600);
    }
  };

  if (isRevealed) {
    return null;
  }

  return (
    <Box
      onClick={handleClick}
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${luxuryColors.gold} 0%, ${luxuryColors.goldLight} 50%, ${luxuryColors.gold} 100%)`,
        cursor: 'pointer',
        borderRadius: 0,
        overflow: 'hidden',
        transition: 'all 0.6s ease-in-out',
        transform: isAnimating ? 'rotateY(90deg)' : 'rotateY(0deg)',
        transformStyle: 'preserve-3d',
        boxShadow: '0 4px 16px rgba(212, 175, 55, 0.4)',
        '&:hover': {
          boxShadow: '0 6px 24px rgba(212, 175, 55, 0.6)',
        },
      }}
    >
      <Typography
        sx={{
          fontFamily: '"Playfair Display", serif',
          color: '#FFFFFF',
          fontWeight: 600,
          letterSpacing: '0.15em',
          textShadow: '0 2px 4px rgba(0,0,0,0.3)',
          userSelect: 'none',
          fontSize: '2rem',
        }}
      >
        {rank}位 - CLICK TO REVEAL
      </Typography>
    </Box>
  );
}

/**
 * P-002: 結果表示ページ
 * スクリーン投影用・60m離れても見やすい大きなデザイン
 */
function ResultsPage() {
  const [revealedRanks, setRevealedRanks] = useState<Set<number>>(new Set());
  const [animationStarted, setAnimationStarted] = useState(false);

  const {
    data: resultsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['results'],
    queryFn: getResults,
    refetchInterval: 5000,
  });

  useEffect(() => {
    if (resultsData && !animationStarted) {
      setAnimationStarted(true);
    }
  }, [resultsData, animationStarted]);

  const revealRank = useCallback((rank: number) => {
    setRevealedRanks((prev) => new Set([...prev, rank]));
  }, []);

  const revealAll = useCallback(() => {
    if (resultsData?.results) {
      const allRanks = resultsData.results.map((r) => r.rank || 0);
      setRevealedRanks(new Set(allRanks));
    }
  }, [resultsData]);

  if (isLoading && !resultsData) {
    return (
      <ResultsLayout>
        <Box sx={{ textAlign: 'center', py: 12 }}>
          <CircularProgress
            size={80}
            sx={{ mb: 4, color: luxuryColors.gold }}
          />
          <Typography
            sx={{
              fontFamily: '"Playfair Display", serif',
              color: luxuryColors.textSecondary,
              letterSpacing: '0.1em',
              fontSize: '2rem',
            }}
          >
            Loading Results...
          </Typography>
        </Box>
      </ResultsLayout>
    );
  }

  if (error) {
    return (
      <ResultsLayout>
        <Alert
          severity="info"
          sx={{
            mb: 4,
            bgcolor: luxuryColors.cream,
            border: `2px solid ${luxuryColors.border}`,
            fontSize: '1.5rem',
          }}
          action={
            <Button
              color="inherit"
              size="large"
              startIcon={<RefreshIcon sx={{ fontSize: 32 }} />}
              onClick={() => refetch()}
              sx={{ color: luxuryColors.gold, fontSize: '1.5rem' }}
            >
              Retry
            </Button>
          }
        >
          <AlertTitle sx={{ fontFamily: '"Playfair Display", serif', fontSize: '2rem' }}>
            Connection Required
          </AlertTitle>
          <Typography sx={{ fontSize: '1.5rem' }}>
            Unable to connect to the server.
          </Typography>
        </Alert>
      </ResultsLayout>
    );
  }

  const { results, criteriaHeaders, totalEvaluators } = resultsData || {
    results: [],
    criteriaHeaders: [],
    totalEvaluators: 0,
  };

  return (
    <ResultsLayout
      totalEvaluators={totalEvaluators}
    >
      {results.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 8,
            textAlign: 'center',
            bgcolor: luxuryColors.cream,
            border: `2px solid ${luxuryColors.border}`,
          }}
        >
          <Typography
            sx={{
              fontFamily: '"Playfair Display", serif',
              color: luxuryColors.textSecondary,
              letterSpacing: '0.1em',
              fontSize: '2.5rem',
            }}
          >
            No evaluation data yet
          </Typography>
        </Paper>
      ) : (
        <Box>
          {/* 全て表示ボタン */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 5 }}>
            <Button
              variant="outlined"
              onClick={revealAll}
              sx={{
                fontFamily: '"Playfair Display", serif',
                color: luxuryColors.gold,
                borderColor: luxuryColors.gold,
                borderWidth: 2,
                letterSpacing: '0.15em',
                px: 6,
                py: 2,
                fontSize: '1.5rem',
                '&:hover': {
                  borderColor: luxuryColors.gold,
                  borderWidth: 2,
                  bgcolor: 'rgba(212, 175, 55, 0.08)',
                },
              }}
            >
              REVEAL ALL RESULTS
            </Button>
          </Box>

          {/* テーブル形式の結果表示 */}
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              bgcolor: luxuryColors.cream,
              border: `2px solid ${luxuryColors.border}`,
              borderRadius: 0,
            }}
          >
            <Table>
              {/* ヘッダー */}
              <TableHead>
                <TableRow>
                  <TableCell
                    align="center"
                    sx={{
                      fontFamily: '"Playfair Display", serif',
                      color: luxuryColors.textSecondary,
                      fontWeight: 600,
                      fontSize: '1.5rem',
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      width: 120,
                      borderBottom: `4px solid ${luxuryColors.gold}`,
                      py: 3,
                    }}
                  >
                    Rank
                  </TableCell>
                  <TableCell
                    sx={{
                      fontFamily: '"Playfair Display", serif',
                      color: luxuryColors.textSecondary,
                      fontWeight: 600,
                      fontSize: '1.5rem',
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      minWidth: 350,
                      borderBottom: `4px solid ${luxuryColors.gold}`,
                      py: 3,
                    }}
                  >
                    Department
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontFamily: '"Playfair Display", serif',
                      color: luxuryColors.textSecondary,
                      fontWeight: 600,
                      fontSize: '1.5rem',
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      width: 150,
                      borderBottom: `4px solid ${luxuryColors.gold}`,
                      py: 3,
                    }}
                  >
                    Total
                  </TableCell>
                  {criteriaHeaders?.map((header) => (
                    <TableCell
                      key={header.id}
                      align="center"
                      sx={{
                        fontFamily: '"Playfair Display", serif',
                        color: luxuryColors.textSecondary,
                        fontWeight: 600,
                        fontSize: '1.2rem',
                        letterSpacing: '0.1em',
                        width: 130,
                        borderBottom: `4px solid ${luxuryColors.border}`,
                        py: 3,
                      }}
                    >
                      {header.name}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              {/* ボディ */}
              <TableBody>
                {results.map((result) => {
                  const isFirst = result.rank === 1;
                  const isRevealed = revealedRanks.has(result.rank || 0);

                  return (
                    <TableRow
                      key={result.departmentId}
                      sx={{
                        bgcolor: isFirst ? 'rgba(212, 175, 55, 0.06)' : 'transparent',
                        '&:hover': {
                          bgcolor: isFirst
                            ? 'rgba(212, 175, 55, 0.1)'
                            : 'rgba(0, 0, 0, 0.03)',
                        },
                      }}
                    >
                      {/* 順位 */}
                      <TableCell
                        align="center"
                        sx={{
                          borderBottom: `2px solid ${luxuryColors.border}`,
                          py: 4,
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {isFirst && (
                            <Box
                              sx={{
                                width: 16,
                                height: 16,
                                bgcolor: luxuryColors.gold,
                                borderRadius: '50%',
                                mr: 1.5,
                              }}
                            />
                          )}
                          <Typography
                            sx={{
                              fontFamily: '"Playfair Display", serif',
                              fontWeight: isFirst ? 700 : 500,
                              fontSize: '3rem',
                              color: isFirst ? luxuryColors.gold : luxuryColors.text,
                            }}
                          >
                            {result.rank}
                          </Typography>
                        </Box>
                      </TableCell>

                      {/* 部署名（シール付き） */}
                      <TableCell
                        sx={{
                          position: 'relative',
                          borderBottom: `2px solid ${luxuryColors.border}`,
                          height: 120,
                          py: 4,
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: '"Playfair Display", serif',
                            fontWeight: isFirst ? 700 : 500,
                            fontSize: '2.5rem',
                            color: isFirst ? luxuryColors.gold : luxuryColors.text,
                            letterSpacing: '0.03em',
                            visibility: isRevealed ? 'visible' : 'hidden',
                          }}
                        >
                          {result.departmentName}
                        </Typography>
                        <SealOverlay
                          isRevealed={isRevealed}
                          onReveal={() => revealRank(result.rank || 0)}
                          rank={result.rank || 0}
                        />
                      </TableCell>

                      {/* 総合点 */}
                      <CountUpCell
                        value={result.totalScore}
                        isFirst={isFirst}
                        startAnimation={animationStarted}
                      />

                      {/* 項目別得点 */}
                      {result.criteriaResults?.map((cr) => (
                        <CountUpCell
                          key={cr.criteriaId}
                          value={cr.totalPoints}
                          isFirst={isFirst}
                          startAnimation={animationStarted}
                        />
                      ))}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          {/* 装飾ライン */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mt: 6,
            }}
          >
            <Box
              sx={{
                width: 150,
                height: 2,
                bgcolor: luxuryColors.gold,
              }}
            />
          </Box>
        </Box>
      )}
    </ResultsLayout>
  );
}

export default ResultsPage;
