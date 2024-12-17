import prismadb from '@/lib/prismadb';
import React from 'react';

const DashboardPage = async ({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) => {
  const { storeId } = await params;
  const store = await prismadb.store.findFirst({
    where: { id: storeId },
  });

  return (
    <div>
      Active store: <b>{store?.name}</b>
    </div>
  );
};

export default DashboardPage;
