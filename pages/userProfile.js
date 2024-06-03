import { Grid } from "@chakra-ui/react";
import { ObjectId } from "mongodb";
import connectToMongoDB from "../database/db";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { IconButton, useToast } from "@chakra-ui/react";
import { useAuth } from "@/components/AuthContext";
import CryptoJS from "crypto-js";

export async function getServerSideProps(context) {
  const { userId } = context.query; // Retrieve userId from context
  let decryptedUserId = "";
  const bytes = CryptoJS.AES.decrypt(userId, "secret key");
  decryptedUserId = bytes.toString(CryptoJS.enc.Utf8);
  console.log(decryptedUserId);
  try {
    const db = await connectToMongoDB();
    const user = await db.collection("users").findOne({ _id: new ObjectId(decryptedUserId) });
    console.log(user);

    const photos = user ? user.uploads.map((photo) => ({ ...photo, _id: photo._id.toString() })) : [];
    console.log(photos);

    return {
      props: { photos },
    };
  } catch (error) {
    console.error("Error fetching photos:", error);
    return {
      props: { photos: [] },
    };
  }
}

function UserProfile({ photos, userId }) {
  console.log("Photos:", photos);
  const [photoList, setPhotoList] = useState(photos);
  const toast = useToast();

  const handleRemovePhoto = async (photoId) => {
    try {
      const response = await fetch("/api/api-delete-recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, photoId }),
      });

      if (response.ok) {
        console.log("Photos removed successfully");
        setPhotoList(photoList.filter((photo) => photo._id !== photoId));
        console.log(photoList.length);
      } else {
        console.error("Failed to remove photos");
      }
    } catch (error) {
      console.error("Error removing photos:", error);
    }
  };

  return (
    <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={4}>
      {photoList.map((photo) => (
        <div key={photo._id} className="photo-card">
          <img src={photo.imageUrl} alt={photo.title} className="photo-img" />
          <div className="photo-details">
            <h3>{photo.title}</h3>
            <p>{photo.description}</p>
            <p> {photo._id} </p>
            <IconButton icon={<FaTrash />} aria-label="Delete photo" onClick={() => handleRemovePhoto(photo._id)} colorScheme="red" />
          </div>
        </div>
      ))}
    </Grid>
  );
}

export default UserProfile;
