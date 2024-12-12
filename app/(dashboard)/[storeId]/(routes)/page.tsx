import prismadb from '@/lib/prismadb';
import React from 'react';

interface DashboardPageProps {
  params: { storeId: string };
}

export const DashboardPage: React.FC<DashboardPageProps> = async ({
  params,
}) => {
  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
    },
  });

  return (
    <div>
      Active store: <b>{store?.name}</b>
    </div>
  );
};

export default DashboardPage;
