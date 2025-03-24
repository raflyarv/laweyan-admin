'use client';

import React from 'react';
import { useAdmin } from '@/app/_hooks/provider/AdminProvider';
import dynamic from 'next/dynamic';

const NavBar = dynamic(() => import('@/app/_components/NavBar'), { ssr: false });

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { admin } = useAdmin();

  return (
    <>
      <NavBar
        name={admin?.fullName}
        imageUrl={admin?.profileImage}
        userType="admin"
      />
      <div
        style={{
          position: 'relative',
          marginTop: 100,
        }}
      >
        {children}
      </div>
    </>
  );
}
