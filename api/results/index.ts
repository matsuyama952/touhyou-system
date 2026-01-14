import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../_lib/prisma';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const eventYear = parseInt(req.query.year as string) || new Date().getFullYear();

    // 部署一覧取得
    const departments = await prisma.department.findMany({
      orderBy: { displayOrder: 'asc' },
    });

    // 評価項目一覧取得
    const criteria = await prisma.evaluationCriteria.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    });

    // 各部署の総合得点と項目別得点を集計
    const results = await Promise.all(
      departments.map(async (dept) => {
        // 項目別の集計
        const criteriaResults = await Promise.all(
          criteria.map(async (crit) => {
            const aggregation = await prisma.evaluation.aggregate({
              where: {
                departmentId: dept.id,
                criteriaId: crit.id,
                eventYear,
              },
              _sum: { score: true },
            });

            return {
              criteriaId: crit.id,
              criteriaName: crit.name,
              totalPoints: aggregation._sum.score || 0,
            };
          })
        );

        // 総合得点を計算
        const totalScore = criteriaResults.reduce((sum, cr) => sum + cr.totalPoints, 0);

        return {
          departmentId: dept.id,
          departmentName: dept.name,
          imageUrl: dept.imageUrl,
          totalScore,
          criteriaResults,
        };
      })
    );

    // スコア順にソートして順位を付与
    const sortedResults = results
      .sort((a, b) => b.totalScore - a.totalScore)
      .map((r, index) => ({
        ...r,
        rank: index + 1,
      }));

    // 評価者数を集計（ユニークなfingerprintの数）
    const evaluatorCount = await prisma.evaluation.groupBy({
      by: ['fingerprint'],
      where: { eventYear },
    });

    // イベント設定から対象者数を取得
    const eventConfig = await prisma.eventConfig.findFirst({
      where: { year: eventYear, isActive: true },
    });

    // 評価項目のヘッダー情報（短縮名）
    const criteriaHeaders = criteria.map((c) => ({
      id: c.id,
      name: c.name.split('（')[0].split('\n')[0], // 短縮名を取得
    }));

    return res.status(200).json({
      results: sortedResults,
      criteriaHeaders,
      totalEvaluators: evaluatorCount.length,
      targetEvaluators: eventConfig?.targetEvaluators || 100,
    });
  } catch (error) {
    console.error('Failed to fetch results:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
