import { NextResponse, NextRequest } from 'next/server';
import { clerkMiddleware } from '@clerk/nextjs/server';

export default async function customMiddleware(req: NextRequest, event: any) {
  // Обработка CORS
  const origin = req.headers.get('origin');
  const corsHeaders = {
    'Access-Control-Allow-Origin': 'http://localhost:3002', // Укажите ваш клиентский домен
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (req.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  // Вызов Clerk middleware
  const response = await clerkMiddleware({})(req, event);

  if (response) {
    // Добавление CORS заголовков к ответу
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  }

  // Если response отсутствует, возвращаем стандартный ответ
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
