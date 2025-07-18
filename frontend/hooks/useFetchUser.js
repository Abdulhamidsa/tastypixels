import { useEffect, useState } from "react";
import { fetchWithTokenRefresh } from "@/utils/auth";
import { getApiUrl } from "@/utils/api";

export const useFetch = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadList, setUploadList] = useState([]);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const res = await fetchWithTokenRefresh(getApiUrl("/users/profile"));
      if (!res.ok) throw new Error("Failed to fetch user data");
      const data = await res.json();
      setUser(data);
      setUploadList(data.uploads);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteUpload = async (selectedUploadId) => {
    try {
      const response = await fetchWithTokenRefresh(getApiUrl("/api/delete-post"), {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ selectedUploadId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      setUploadList(uploadList.filter((upload) => upload._id !== selectedUploadId));
    } catch (err) {
      throw new Error(err.message);
    }
  };

  return { user, loading, error, uploadList, fetchUserData, deleteUpload };
};
