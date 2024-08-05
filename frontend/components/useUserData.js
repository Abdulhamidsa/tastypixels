import { useState, useEffect } from "react";

const useUserData = (userId) => {
  const [data, setData] = useState({ user: null, uploads: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/getUserUploads`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        });

        if (response.ok) {
          const result = await response.json();
          setData({ user: result.user, uploads: result.user.uploads });
        } else {
          setError("Failed to fetch user data");
        }
      } catch (err) {
        setError("Error fetching user data");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  return { data, loading, error };
};

export default useUserData;
