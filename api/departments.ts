import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from './_lib/prisma';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const departments = await prisma.department.findMany({
      orderBy: { displayOrder: 'asc' },
      select: {
        id: true,
        name: true,
        imageUrl: true,
        displayOrder: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(200).json(departments);
  } catch (error) {
    console.error('Failed to fetch departments:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
