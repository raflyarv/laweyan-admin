'use client';
import React from 'react';
import { AdminProvider } from '../_hooks/provider/AdminProvider';

export default function ViewLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AdminProvider>{children}</AdminProvider>
    </>
  );
}
