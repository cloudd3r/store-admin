import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    const body = await req.json();
    const { name } = body;

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!name) {
      return new NextResponse('Name is required', { status: 400 });
    }

    const store = await prismadb.store.create({
      data: {
        name,
        userId,
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    console.log('[STORES_POST]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}