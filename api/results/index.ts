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

    // 各部署の総合得点を集計
    const results = await Promise.all(
      departments.map(async (dept) => {
        const aggregation = await prisma.evaluation.aggregate({
          where: {
            departmentId: dept.id,
            eventYear,
          },
          _sum: { score: true },
        });

        return {
          departmentId: dept.id,
          departmentName: dept.name,
          imageUrl: dept.imageUrl,
          totalScore: aggregation._sum.score || 0,
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

    return res.status(200).json({
      results: sortedResults,
      totalEvaluators: evaluatorCount.length,
      targetEvaluators: eventConfig?.targetEvaluators || 100,
    });
  } catch (error) {
    console.error('Failed to fetch results:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
