import { useEffect, useState } from "react";
import { fetchWithTokenRefresh } from "@/utils/auth";

export const useFetch = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadList, setUploadList] = useState([]);
  console.log(user);
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const res = await fetchWithTokenRefresh("https://tastypixels-backend.up.railway.app/users/profile");
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

  const updateUpload = async (userId, editedUpload) => {
    try {
      const response = await fetch("/api/api-update-recipe", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, editedUpload }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      const updatedUploadList = uploadList.map((upload) => (upload._id === editedUpload._id ? { ...upload, ...editedUpload } : upload));
      setUploadList(updatedUploadList);
    } catch (err) {
      throw new Error(err.message);
    }
  };

  const deleteUpload = async (selectedUploadId) => {
    try {
      const response = await fetchWithTokenRefresh("https://tastypixels-backend.up.railway.app/api/delete-post", {
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

  return { user, loading, error, uploadList, fetchUserData, updateUpload, deleteUpload };
};
