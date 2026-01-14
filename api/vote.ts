import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from './_lib/prisma';
import type { EvaluationInput, VoteRequest } from '../backend/src/types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { evaluations, fingerprint, eventYear } = req.body as VoteRequest;

    // バリデーション
    if (!evaluations || !Array.isArray(evaluations) || evaluations.length === 0) {
      return res.status(400).json({
        success: false,
        message: '評価データが必要です',
      });
    }

    if (!fingerprint) {
      return res.status(400).json({
        success: false,
        message: '端末識別子が必要です',
      });
    }

    if (!eventYear) {
      return res.status(400).json({
        success: false,
        message: '評価年度が必要です',
      });
    }

    // スコアのバリデーション
    for (const evaluation of evaluations) {
      if (evaluation.score < 1 || evaluation.score > 10) {
        return res.status(400).json({
          success: false,
          message: 'スコアは1〜10の範囲で入力してください',
        });
      }
    }

    // 二重投票チェック
    const existingVote = await prisma.evaluation.findFirst({
      where: {
        fingerprint,
        eventYear,
      },
    });

    if (existingVote) {
      return res.status(409).json({
        success: false,
        message: '既に投票済みです',
      });
    }

    // 評価データを一括登録
    await prisma.evaluation.createMany({
      data: evaluations.map((e) => ({
        departmentId: e.departmentId,
        criteriaId: e.criteriaId,
        score: e.score,
        fingerprint,
        eventYear,
      })),
    });

    return res.status(200).json({
      success: true,
      message: '投票が完了しました',
    });
  } catch (error) {
    console.error('Failed to submit vote:', error);
    return res.status(500).json({
      success: false,
      message: 'サーバーエラーが発生しました',
    });
  }
}
