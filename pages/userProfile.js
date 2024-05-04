import { Grid } from "@chakra-ui/react";
import { ObjectId } from "mongodb";
import connectToMongoDB from "../database/db";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { IconButton, useToast } from "@chakra-ui/react";

const jwtSecret = "verysecretekey";

export async function getServerSideProps(context) {
  const cookies = cookie.parse(context.req.headers.cookie || "");
  const token = cookies.token;
  console.log(token);

  try {
    const decoded = jwt.verify(token, jwtSecret);
    const userId = decoded.userId;
    console.log(userId);

    const db = await connectToMongoDB();
    const data = await db
      .collection("gs")
      .find({ userId: new ObjectId(userId) })
      .toArray();
    const photos = JSON.parse(JSON.stringify(data));
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

function userProfile({ photos }) {
  const [photoList, setPhotoList] = useState(photos);
  console.log(photoList);
  const toast = useToast();

  const handleRemovePhoto = async (userId) => {
    try {
      const response = await fetch("/api/api-delete-recipe", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        // Photos removed successfully
        console.log("Photos removed successfully");
      } else {
        // Failed to remove photos
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
            <IconButton icon={<FaTrash />} aria-label="Delete photo" onClick={() => handleRemovePhoto(photo._id)} colorScheme="red" />
          </div>
        </div>
      ))}
    </Grid>
  );
}

export default userProfile;
