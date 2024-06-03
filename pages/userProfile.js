import { Grid } from "@chakra-ui/react";
import { ObjectId } from "mongodb";
import connectToMongoDB from "@/database/db";
import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { IconButton, useToast } from "@chakra-ui/react";
import { useAuth } from "@/context/AuthContext";
import CryptoJS from "crypto-js";

export async function getServerSideProps(context) {
  const { userId } = context.query;
  let decryptedUserId = "";
  const bytes = CryptoJS.AES.decrypt(userId, "secret key");
  decryptedUserId = bytes.toString(CryptoJS.enc.Utf8);
  console.log(decryptedUserId);
  try {
    const db = await connectToMongoDB();
    const user = await db.collection("userdemos").findOne({ _id: new ObjectId(decryptedUserId) });
    console.log(user);

    const uploads = user ? user.uploads.map((upload) => ({ ...upload, _id: upload._id.toString() })) : [];
    console.log(uploads);

    return {
      props: { uploads },
    };
  } catch (error) {
    console.error("Error fetching uploads:", error);
    return {
      props: { uploads: [] },
    };
  }
}

function UserProfile({ uploads }) {
  const { userId } = useAuth();
  // console.log(uploads);
  console.log("uploads:", uploads);
  const [uploadList, setuploadList] = useState(uploads);
  const toast = useToast();

  const handleRemoveupload = async (uploadId) => {
    try {
      const response = await fetch("/api/api-delete-recipe", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, uploadId }),
      });
      if (response.ok) {
        console.log("uploads removed successfully");
        setuploadList(uploadList.filter((upload) => upload._id !== uploadId));
        console.log(uploadList.length);
      } else {
        console.error("Failed to remove uploads");
      }
    } catch (error) {
      console.error("Error removing uploads:", error);
    }
  };

  return (
    <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={4}>
      {uploadList.map((upload) => (
        <div key={upload._id} className="upload-card">
          <img src={upload.imageUrl} alt={upload.title} className="upload-img" />
          <div className="upload-details">
            <h3>{upload.title}</h3>
            <p>{upload.description}</p>
            <p> {upload._id} </p>
            <IconButton icon={<FaTrash />} aria-label="Delete upload" onClick={() => handleRemoveupload(upload._id)} colorScheme="red" />
          </div>
        </div>
      ))}
    </Grid>
  );
}

export default UserProfile;
