import { UserButton } from '@clerk/nextjs';
import React from 'react';

import { MainNav } from './main-nav';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import prismadb from '@/lib/prismadb';
import StoreSwitcher from './store-switcher';

export const Navbar: React.FC = async () => {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const stores = await prismadb.store.findMany({
    where: {
      userId,
    },
  });
  console.log(stores);
  return (
    <header className='border-b'>
      <div className='flex h-16 items-center px-4'>
        <StoreSwitcher items={stores} />
        <MainNav />
        <div className='ml-auto flex items-center space-x-4'>
          <UserButton afterSignOutUrl='/' />
        </div>
      </div>
    </header>
  );
};
