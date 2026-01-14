// prisma/seed.js
// 初期データ投入スクリプト
// 実行: npm run db:seed

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 部署データ（5件）
  const departments = [
    { name: 'コンシューマーカンパニー', displayOrder: 1, imageUrl: 'https://placehold.co/400x300/00d4ff/ffffff?text=Consumer' },
    { name: 'コーポレートセールスカンパニー', displayOrder: 2, imageUrl: 'https://placehold.co/400x300/00d4ff/ffffff?text=Corporate' },
    { name: 'SSDカンパニー', displayOrder: 3, imageUrl: 'https://placehold.co/400x300/00d4ff/ffffff?text=SSD' },
    { name: 'BBC', displayOrder: 4, imageUrl: 'https://placehold.co/400x300/00d4ff/ffffff?text=BBC' },
    { name: 'Unneon', displayOrder: 5, imageUrl: 'https://placehold.co/400x300/00d4ff/ffffff?text=Unneon' },
  ];

  for (const dept of departments) {
    await prisma.department.upsert({
      where: { id: dept.name.toLowerCase().replace(/\s+/g, '-') },
      update: dept,
      create: {
        id: dept.name.toLowerCase().replace(/\s+/g, '-'),
        ...dept,
      },
    });
  }
  console.log('Created 5 departments');

  // 評価項目データ（4件）
  const criteria = [
    {
      name: 'Philosophy（理念・目的）\nカンパニー・部署の存在意義、ビジョンへの共感度。',
      displayOrder: 1,
      isActive: true
    },
    {
      name: 'Profession（仕事・事業）\n事業内容や提供している商品・サービスの独自性や競争力。\n市場における成長性や将来性。\n具体的な仕事内容や、そこで得られるスキル・経験の魅力度。',
      displayOrder: 2,
      isActive: true
    },
    {
      name: 'People（人材・風土）\n一緒に働く人々の人柄やチームワーク。\nカンパニー・事業部の文化や風土が自分に合っているか。\n活躍している社員の具体的なイメージができるか。\n一緒に働きたいと感じるか。',
      displayOrder: 3,
      isActive: true
    },
    {
      name: 'Privilege（特権・待遇）\n昇格の機会や仕事の裁量権。\nここで働くことで得られる報酬や経験等の魅力度。',
      displayOrder: 4,
      isActive: true
    },
  ];

  for (const crit of criteria) {
    const id = `criteria-${crit.displayOrder}`;
    await prisma.evaluationCriteria.upsert({
      where: { id },
      update: crit,
      create: { id, ...crit },
    });
  }
  console.log('Created 4 evaluation criteria');

  // イベント設定（2026年）
  await prisma.eventConfig.upsert({
    where: { year: 2026 },
    update: { targetEvaluators: 100, isActive: true },
    create: {
      year: 2026,
      targetEvaluators: 100,
      isActive: true,
    },
  });
  console.log('Created event config for 2026');

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
