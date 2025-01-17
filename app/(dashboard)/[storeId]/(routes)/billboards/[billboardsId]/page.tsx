import prismadb from '@/lib/prismadb';
import { BillboardForm } from './components/billboards-form';

export default async function BillboardPage({
  params,
}: {
  params: { billboardsId: string };
}) {
  const billboard = await prismadb.billboard.findUnique({
    where: {
      id: params.billboardsId,
    },
  });

  return (
    <div className='flex-col'>
      <div className='flex-1 p-8 pt-6 space-y-4'>
        <BillboardForm initialData={billboard} />
      </div>
    </div>
  );
}
