/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import axios from 'axios';

const useFetchLogUsers = (startDate?: string, endDate?: string, activityName?: string) => {
  const [userLogs, setUserLogs] = useState<any[]>([]); // Adjust the type as needed
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllLogs = async () => {
      setLoading(true);
      setError(null);

      try {
        // Build the query string
        const params: Record<string, string> = {};
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
        if (activityName) params.activityName = activityName;

        const response = await axios.get('http://localhost:5000/api/logUser/logs', {
          params,
          withCredentials: true,
        });
        setUserLogs(response.data);
      } catch (error: any) {
        setError(error.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAllLogs();
  }, [startDate, endDate, activityName]); // Re-run when these dependencies change

  return { userLogs, loading, error };
};

export default useFetchLogUsers;
