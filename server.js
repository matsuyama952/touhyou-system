// Local development server
// Run with: node server.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: 'connected',
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
    });
  }
});

// GET /api/departments
app.get('/api/departments', async (req, res) => {
  try {
    const departments = await prisma.department.findMany({
      orderBy: { displayOrder: 'asc' },
    });
    res.json(departments);
  } catch (error) {
    console.error('Failed to fetch departments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/criteria
app.get('/api/criteria', async (req, res) => {
  try {
    const criteria = await prisma.evaluationCriteria.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    });
    res.json(criteria);
  } catch (error) {
    console.error('Failed to fetch criteria:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/vote
app.post('/api/vote', async (req, res) => {
  try {
    const { evaluations, fingerprint, eventYear } = req.body;

    if (!evaluations || !Array.isArray(evaluations) || evaluations.length === 0) {
      return res.status(400).json({ success: false, message: '評価データが必要です' });
    }
    if (!fingerprint) {
      return res.status(400).json({ success: false, message: '端末識別子が必要です' });
    }
    if (!eventYear) {
      return res.status(400).json({ success: false, message: '評価年度が必要です' });
    }

    // Check for duplicate vote
    const existingVote = await prisma.evaluation.findFirst({
      where: { fingerprint, eventYear },
    });

    if (existingVote) {
      return res.status(409).json({ success: false, message: '既に投票済みです' });
    }

    // Insert evaluations
    await prisma.evaluation.createMany({
      data: evaluations.map((e) => ({
        departmentId: e.departmentId,
        criteriaId: e.criteriaId,
        score: e.score,
        fingerprint,
        eventYear,
      })),
    });

    res.json({ success: true, message: '投票が完了しました' });
  } catch (error) {
    console.error('Failed to submit vote:', error);
    res.status(500).json({ success: false, message: 'サーバーエラーが発生しました' });
  }
});

// GET /api/results
app.get('/api/results', async (req, res) => {
  try {
    const eventYear = parseInt(req.query.year) || new Date().getFullYear();

    const departments = await prisma.department.findMany({
      orderBy: { displayOrder: 'asc' },
    });

    const results = await Promise.all(
      departments.map(async (dept) => {
        const aggregation = await prisma.evaluation.aggregate({
          where: { departmentId: dept.id, eventYear },
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

    const sortedResults = results
      .sort((a, b) => b.totalScore - a.totalScore)
      .map((r, index) => ({ ...r, rank: index + 1 }));

    const evaluatorCount = await prisma.evaluation.groupBy({
      by: ['fingerprint'],
      where: { eventYear },
    });

    const eventConfig = await prisma.eventConfig.findFirst({
      where: { year: eventYear, isActive: true },
    });

    res.json({
      results: sortedResults,
      totalEvaluators: evaluatorCount.length,
      targetEvaluators: eventConfig?.targetEvaluators || 100,
    });
  } catch (error) {
    console.error('Failed to fetch results:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/results/:departmentId
app.get('/api/results/:departmentId', async (req, res) => {
  try {
    const { departmentId } = req.params;
    const eventYear = parseInt(req.query.year) || new Date().getFullYear();

    const department = await prisma.department.findUnique({
      where: { id: departmentId },
    });

    if (!department) {
      return res.status(404).json({ error: 'Department not found' });
    }

    const criteria = await prisma.evaluationCriteria.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    });

    const criteriaResults = await Promise.all(
      criteria.map(async (crit) => {
        const aggregation = await prisma.evaluation.aggregate({
          where: { departmentId, criteriaId: crit.id, eventYear },
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

    const totalScore = criteriaResults.reduce((sum, cr) => sum + cr.totalPoints, 0);

    const evaluators = await prisma.evaluation.groupBy({
      by: ['fingerprint'],
      where: { departmentId, eventYear },
    });

    res.json({
      departmentId: department.id,
      departmentName: department.name,
      totalScore,
      criteriaResults,
      totalEvaluators: evaluators.length,
    });
  } catch (error) {
    console.error('Failed to fetch department detail:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`API Server running at http://localhost:${PORT}`);
  console.log('Endpoints:');
  console.log('  GET  /api/health');
  console.log('  GET  /api/departments');
  console.log('  GET  /api/criteria');
  console.log('  POST /api/vote');
  console.log('  GET  /api/results');
  console.log('  GET  /api/results/:departmentId');
});
