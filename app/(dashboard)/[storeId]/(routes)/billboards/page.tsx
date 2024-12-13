import { BillboardClient } from './components/client';

export default async function BillboardsPage({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) {
  const { storeId } = await params;
  return (
    <div className='flex-col'>
      <div className='flex-1 p-8 pt-6 space-y-4'>
        <BillboardClient />
      </div>
    </div>
  );
}
