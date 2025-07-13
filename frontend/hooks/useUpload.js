import { useState } from "react";
import { useToast } from "@chakra-ui/react";
import { fetchWithTokenRefresh } from "@/utils/auth";
import { getApiUrlapi } from "@/utils/api";

const useUpload = (initialUploadData, onClose) => {
  const [imageUrl, setImageUrl] = useState(initialUploadData ? initialUploadData.imageUrl : "");
  const [isFileLoading, setIsFileLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const toast = useToast();

  const handleUpload = async (file) => {
    try {
      setIsFileLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME);

      const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      const transformedImageUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${data.public_id}.${data.format}`;
      setImageUrl(transformedImageUrl);
    } catch (error) {
      console.error(error);
      setUploadError("Failed to upload image");
    } finally {
      setIsFileLoading(false);
    }
  };

  const saveToDatabase = async (uploadData, editedUpload) => {
    if (!editedUpload) {
      if (!imageUrl || !uploadData.title || !uploadData.description || !uploadData.selectedCategory || uploadData.selectedTags.length === 0) {
        setUploadError("All fields are required");
        return;
      }
    }

    const dataToSave = {
      ...(imageUrl && { imageUrl }),
      ...(uploadData.title && { title: uploadData.title }),
      ...(uploadData.description && { description: uploadData.description }),
      ...(uploadData.selectedTags.length > 0 && { tags: uploadData.selectedTags }),
      ...(uploadData.selectedCategory && { category: uploadData.selectedCategory }),
    };

    let url = getApiUrlapi("/api/upload");
    let method = "POST";

    if (editedUpload) {
      dataToSave.uploadId = editedUpload._id;
      url = getApiUrlapi("/api/edit-post");
      method = "PUT";
    }
    try {
      setIsUploading(true);
      const response = await fetchWithTokenRefresh(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSave),
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.errors ? responseData.errors.join(", ") : "Failed to save post to database");
      }

      toast({
        title: "Success",
        description: editedUpload ? "Post updated successfully." : "Post uploaded successfully. Redirecting...",
        status: "success",
        duration: 2000,
        isClosable: true,
      });

      onClose();

      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error(error);
      setUploadError(error.message || "Failed to save post to database");
    } finally {
      setIsUploading(false);
    }
  };

  return {
    imageUrl,
    isFileLoading,
    isUploading,
    uploadError,
    handleUpload,
    saveToDatabase,
  };
};

export default useUpload;
