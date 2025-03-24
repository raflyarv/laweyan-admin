/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { SiteDetailsProps } from '@/app/_models/site.model';

// Define the shape of your admin data
interface AdminProps {
  _id: string;
  fullName: string;
  username: string;
  profileImage: string;
  email: string;
  siteNameTemp: string;
  addressTemp: string;
  role: string;
}

// Define the context value structure
interface AdminContextType {
  admin: AdminProps | null;
  sitesByOwner: SiteDetailsProps[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void; // Add a refetch function type
}

// Create the context with default values
const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Custom hook to use AdminContext easily
export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

// AdminProvider component to wrap the app
export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminProps | null>(null);
  const [sitesByOwner, setSitesByOwner] = useState<SiteDetailsProps[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchAdminData = useCallback(async () => {
    try {
      // Fetch admin data from your backend API
      const adminResponse = await axios.get('http://localhost:5000/api/admin', {
        withCredentials: true,
      });
      setAdmin(adminResponse.data);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error fetching admin data');
      // Redirect to login if unauthorized (401)
      if (error.response?.status === 401) {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  const fetchSitesByOwner = useCallback(async () => {
    try {
      // Fetch sites owned by the admin
      const sitesResponse = await axios.get('http://localhost:5000/api/site/sites', {
        withCredentials: true,
      });
      setSitesByOwner(sitesResponse.data);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error fetching site data');
    }
  }, []);

  const refetch = useCallback(async () => {
    setLoading(true); // Optionally set loading state while refetching
    await Promise.all([fetchAdminData(), fetchSitesByOwner()]);
  }, [fetchAdminData, fetchSitesByOwner]);

  useEffect(() => {
    refetch(); // Call refetch initially
  }, [refetch, router]);

  return (
    <AdminContext.Provider value={{ admin, sitesByOwner, loading, error, refetch }}>
      {children}
    </AdminContext.Provider>
  );
};
