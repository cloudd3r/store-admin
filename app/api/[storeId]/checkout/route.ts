import { createPayment } from '@/lib/create-payment';
import prismadb from '@/lib/prismadb';
import { NextResponse } from 'next/server';

const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:3002', // Укажите ваш домен
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function middleware(req: Request) {
  if (req.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  const response = NextResponse.next();
  response.headers.append(
    'Access-Control-Allow-Origin',
    'http://localhost:3002'
  );
  return response;
}

// В POST методе добавляем те же заголовки
export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  const { items, totalPrice } = await req.json();
  const { storeId } = params;

  try {
    // Ваш основной код обработки
    const order = await prismadb.order.create({
      data: {
        storeId,
        isPaid: false,
        totalPrice,
        orderItems: {
          create: items.map((item: { id: string; quantity: number }) => ({
            product: { connect: { id: item.id } },
            quantity: item.quantity,
          })),
        },
      },
    });

    const paymentData = await createPayment({
      amount: order.totalPrice,
      orderId: order.id,
    });

    if (!paymentData) {
      throw new Error('Payment data not found');
    }

    await prismadb.order.update({
      where: { id: order.id },
      data: { paymentId: paymentData.id },
    });

    return NextResponse.json(
      { url: paymentData.confirmation.confirmation_url },
      { headers: corsHeaders }
    );
  } catch (err) {
    console.error('[CreateOrder] Server error', err);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
