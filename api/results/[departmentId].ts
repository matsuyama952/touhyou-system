import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../_lib/prisma';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { departmentId } = req.query;
    const eventYear = parseInt(req.query.year as string) || new Date().getFullYear();

    if (!departmentId || typeof departmentId !== 'string') {
      return res.status(400).json({ error: 'Department ID is required' });
    }

    // 部署情報取得
    const department = await prisma.department.findUnique({
      where: { id: departmentId },
    });

    if (!department) {
      return res.status(404).json({ error: 'Department not found' });
    }

    // 評価項目一覧取得
    const criteria = await prisma.evaluationCriteria.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    });

    // 各評価項目の集計
    const criteriaResults = await Promise.all(
      criteria.map(async (crit) => {
        const aggregation = await prisma.evaluation.aggregate({
          where: {
            departmentId,
            criteriaId: crit.id,
            eventYear,
          },
          _sum: { score: true },
          _avg: { score: true },
          _count: { score: true },
        });

        return {
          criteriaId: crit.id,
          criteriaName: crit.name,
          totalPoints: aggregation._sum.score || 0,
          averageScore: Math.round((aggregation._avg.score || 0) * 10) / 10,
          evaluatorCount: aggregation._count.score || 0,
        };
      })
    );

    // 総合得点を計算
    const totalScore = criteriaResults.reduce((sum, cr) => sum + cr.totalPoints, 0);

    // 評価者数（この部署に対する評価者のユニーク数）
    const evaluators = await prisma.evaluation.groupBy({
      by: ['fingerprint'],
      where: {
        departmentId,
        eventYear,
      },
    });

    return res.status(200).json({
      departmentId: department.id,
      departmentName: department.name,
      totalScore,
      criteriaResults,
      totalEvaluators: evaluators.length,
    });
  } catch (error) {
    console.error('Failed to fetch department detail:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
