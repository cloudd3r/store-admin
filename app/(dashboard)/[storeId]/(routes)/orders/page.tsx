import { format } from 'date-fns';
import prismadb from '@/lib/prismadb';
import { OrderClient } from './components/client';
import { OrderColumn } from './components/columns';
import { formatter } from '@/lib/utils';

const OrdersPage = async ({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) => {
  const { storeId } = await params;
  const orders = await prismadb.order.findMany({
    where: {
      storeId: storeId,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  console.log('orders', orders);

  const formattedOrders: OrderColumn[] = orders.map((item) => ({
    id: item.id,
    products: item.orderItems
      .map((orderItem) => orderItem.product.name)
      .join(', '),
    totalPrice: formatter.format(item.totalPrice),
    isPaid: item.isPaid,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }));
  console.log(' formattedOrders', formattedOrders);

  return (
    <div className='flex-col'>
      <div className='flex-1 p-8 pt-6 space-y-4'>
        <OrderClient data={formattedOrders} />
      </div>
    </div>
  );
};

export default OrdersPage;
