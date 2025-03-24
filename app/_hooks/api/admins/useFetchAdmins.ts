/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import axios from 'axios';

const useFetchAdmins = () => {
  const [adminLists, setAdminLists] = useState<any[]>([]); // Adjust the type as needed
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllAdmins = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/list', {
          withCredentials: true,
        });
        setAdminLists(response.data);
      } catch (error: any) {
        setError(error.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAllAdmins();
  }, []);

  return { adminLists, loading, error };
};

export default useFetchAdmins;
