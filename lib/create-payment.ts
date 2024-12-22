import { PaymentData } from '@/@types/yookassa'; // Типы для платежа
import axios from 'axios';
import prismadb from './prismadb';

interface Props {
  orderId: string;
  amount: number;
}

export async function createPayment(details: Props) {
  try {
    const { data } = await axios.post<PaymentData>(
      'https://api.yookassa.ru/v3/payments',
      {
        amount: {
          value: details.amount.toString(),
          currency: 'RUB', // Убедитесь, что валюта правильная
        },
        capture: true,
        metadata: {
          order_id: details.orderId,
        },
        confirmation: {
          type: 'redirect',
          return_url: `${process.env.YOOKASSA_CALLBACK_URL}/cart?success=1`,
        },
      },
      {
        auth: {
          username: process.env.YOOKASSA_STORE_ID as string,
          password: process.env.YOOKASSA_API_KEY as string,
        },
        headers: {
          'Content-Type': 'application/json',
          'Idempotence-Key': Math.random().toString(36).substring(7),
        },
      }
    );

    // После того как платеж был успешно создан, проверяем его статус
    if (data.status === 'succeeded') {
      // Обновляем статус заказа в базе данных
      await prismadb.order.update({
        where: { id: details.orderId },
        data: { isPaid: true },
      });

      console.log('Order payment status updated to paid.');
    }

    return data;
  } catch (error: any) {
    console.error(
      'Error creating payment:',
      error.response?.data || error.message
    );
    throw new Error('Payment creation failed');
  }
}
