/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import axios from 'axios';

const useFetchUsers = () => {
  const [userLists, setUserLists] = useState<any[]>([]); // Adjust the type as needed
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/user/get-all', {
          withCredentials: true,
        });
        setUserLists(response.data);
      } catch (error: any) {
        setError(error.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAllUsers();
  }, []);

  return { userLists, loading, error };
};

export default useFetchUsers;
