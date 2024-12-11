'use client';

import React from 'react';

import { StoreModal } from '@/components/modals/store-modal';

export const ModalProvider: React.FC = () => {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <StoreModal />;
};
