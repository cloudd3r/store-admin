import { format } from 'date-fns';

import prismadb from '@/lib/prismadb';
import { BillboardClient } from './components/client';

export default async function BillboardsPage({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) {
  const { storeId } = await params;

  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const formattedBillboards = billboards.map((billboard) => ({
    id: billboard.id,
    label: billboard.label,
    createdAt: format(billboard.createdAt, 'MMMM do, yyyy'),
  }));
  return (
    <div className='flex-col'>
      <div className='flex-1 p-8 pt-6 space-y-4'>
        <BillboardClient data={formattedBillboards} />
      </div>
    </div>
  );
}
