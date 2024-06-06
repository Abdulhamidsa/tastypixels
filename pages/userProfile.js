import { Grid, Box, Image, Heading } from "@chakra-ui/react";
import { AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, Button } from "@chakra-ui/react";
import { useRef } from "react";
import { ObjectId } from "mongodb";
import connectToMongoDB from "@/database/db";
import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { IconButton, useToast } from "@chakra-ui/react";
import { useAuth } from "@/context/AuthContext";
// import Image from "next/image";
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
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUploadId, setSelectedUploadId] = useState(null);
  const { userId } = useAuth();
  const onClose = () => setIsOpen(false);
  console.log("uploads:", uploads);
  const [uploadList, setuploadList] = useState(uploads);
  const toast = useToast();
  const cancelRef = useRef();

  const handleRemoveupload = async (Id) => {
    try {
      const response = await fetch("/api/api-delete-recipe", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, Id }),
      });
      if (response.ok) {
        console.log("uploads removed successfully");
        setuploadList(uploadList.filter((upload) => upload._id !== Id));
        console.log(uploadList.length);
      } else {
        console.error("Failed to remove uploads");
      }
    } catch (error) {
      console.error("Error removing uploads:", error);
    }
    onClose();
  };

  return (
    <Box p={5} m="auto" maxW="420px" display="grid" gap="10">
      {uploadList.map((upload) => (
        <Box position="relative" key={upload._id} borderWidth="1px" borderRadius="lg" overflow="hidden" width="100%" maxW="600px" mx="auto" my="4" boxShadow="md" bg="gray.900">
          <Box position="relative" p={3} bg="white" color="black">
            <Image src={upload.imageUrl} alt={upload.title} layout="fill" objectFit="cover" />
          </Box>
          <Box display="flex" flexDirection="column" p="6">
            <Box d="flex" alignItems="baseline">
              <Heading size="xl">{upload.title}</Heading>
            </Box>
            <Box mt="1" mb="4" fontWeight="semibold" as="h4" lineHeight="tight">
              {upload.description}
            </Box>
            <IconButton
              width="10%"
              icon={<FaTrash />}
              aria-label="Delete upload"
              onClick={() => {
                setIsOpen(true);
                setSelectedUploadId(upload._id);
              }}
              colorScheme="black"
              color="red.500"
              bg="white"
            />
          </Box>
        </Box>
      ))}
      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Upload
            </AlertDialogHeader>
            <AlertDialogBody>Are you sure? You can't undo this action afterwards.</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={() => handleRemoveupload(selectedUploadId)} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}

export default UserProfile;
