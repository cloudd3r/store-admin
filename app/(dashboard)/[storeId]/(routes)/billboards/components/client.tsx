'use client';

import { Button } from '@/components/ui';
import { Heading } from '@/components/ui/heading';
import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

export const BillboardClient: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className='flex items-center justify-between'>
        <Heading
          title={`Billboard (0)`}
          description='Manage billboards for your store'
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/billboards/new`)}
        >
          <Plus className='w-4 h-4 mr-2' />
          Add New
        </Button>
      </div>
    </>
  );
};
