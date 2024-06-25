import { Box, Avatar, AlertDialog, AlertDialogBody, AlertDialogFooter, Button, AlertDialogHeader, AlertDialogOverlay, AlertDialogContent, Image, Heading, IconButton, useToast, Skeleton, Center, Badge, Flex, Text } from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import CryptoJS from "crypto-js";
import { useRouter } from "next/router";
import Upload from "@/components/Upload";

function UserProfile() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUploadId, setSelectedUploadId] = useState(null);
  const [uploadList, setUploadList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const toast = useToast();
  const router = useRouter();
  const cancelRef = useRef();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const decryptedUserId = useRef(null);
  const onClose = () => {
    setIsDeleteOpen(false);
    setIsEditOpen(false);
  };
  const { userId, isLoggedIn } = useAuth();
  const { userId: encryptedUserId } = router.query;

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/");
    } else if (encryptedUserId && !decryptedUserId.current) {
      // Decrypt userId if it's not already decrypted
      try {
        const bytes = CryptoJS.AES.decrypt(decodeURIComponent(encryptedUserId), "secret key");
        decryptedUserId.current = bytes.toString(CryptoJS.enc.Utf8);
        fetchUserData(decryptedUserId.current);
      } catch (error) {
        console.error("Error decrypting userId:", error);
      }
    }
  }, [isLoggedIn, encryptedUserId]);

  const fetchUserData = async (userId) => {
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
        const data = await response.json();
        setUserData(data.user);
        setUploadList(data.user.uploads);
      } else {
        console.error("Failed to fetch uploads");
      }
    } catch (error) {
      console.error("Error fetching uploads:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdit = async (editedUpload) => {
    try {
      const response = await fetch("/api/api-update-recipe", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, editedUpload }),
      });

      if (response.ok) {
        const updatedUploadList = uploadList.map((upload) => (upload._id === editedUpload._id ? { ...upload, title: editedUpload.title, description: editedUpload.description, tags: editedUpload.tags, category: editedUpload.category } : upload));
        setUploadList(updatedUploadList);
        setIsOpen(false);
        toast({
          title: "Upload updated.",
          description: "The upload has been successfully updated.",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      } else {
        const errorData = await response.json();
        console.error("Failed to update upload:", errorData.error);
        toast({
          title: "Error",
          description: errorData.error,
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error updating upload:", error);
      toast({
        title: "Error",
        description: "An error occurred while updating the upload.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const handleEditUpload = (upload) => {
    setIsEditOpen(true);
    setSelectedUploadId(upload._id);
  };

  const handleCloseEdit = () => {
    setIsEditOpen(false);
    setSelectedUploadId(null);
  };

  const handleRemoveUpload = async (Id) => {
    try {
      const response = await fetch("/api/api-delete-recipe", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, Id }),
      });

      if (response.ok) {
        setUploadList(uploadList.filter((upload) => upload._id !== Id));

        toast({
          title: "Upload deleted.",
          description: "The upload has been successfully deleted.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        const errorData = await response.json();
        console.error("Failed to remove upload:", errorData.error);
        toast({
          title: "Error",
          description: errorData.error,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error removing upload:", error);
      toast({
        title: "Error",
        description: "An error occurred while deleting the upload.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    onClose();
  };

  return (
    <>
      {isLoggedIn ? (
        <Box p={5} m="auto" maxW="420px" display="grid" gap="10">
          {loading ? (
            <Center>
              <Skeleton height="20px" mb="3" startColor="gray.300" endColor="gray.800" />
              <Skeleton height="20px" mb="3" startColor="gray.300" endColor="gray.800" />
              <Skeleton height="20px" mb="3" startColor="gray.300" endColor="gray.800" />
            </Center>
          ) : userData ? (
            uploadList.map((upload) => (
              <Box key={upload._id} borderWidth="1px" borderRadius="lg" overflow="hidden" width="100%" maxW="600px" mx="auto" my="4" boxShadow="md" bg="gray.800">
                <Box bg="white" p="4" pb="2" display="flex" alignItems="center">
                  <Avatar w="45px" h="45px" name={userData.username} src={userData.userAvatar} mr="3" />
                  <Box color="black">
                    <Heading fontSize="lg" fontWeight="bold">
                      {userData.username}
                    </Heading>
                    <Text fontSize="sm"> Posted at: {new Date(upload.postedAt).toLocaleString()}</Text>
                  </Box>
                </Box>

                <Box p={3} bg="white" color="black">
                  <Heading fontSize="xl" mb={3}>
                    {upload.title}
                  </Heading>
                  <Text fontSize="md" mb={3}>
                    {upload.description}
                  </Text>
                  <Box position="relative" display="flex" gap={1}>
                    {upload.tags.map((tag, index) => (
                      <Text fontSize="sm" color="gray.600" pb="2" key={`${tag}-${index}`}>
                        {tag}
                      </Text>
                    ))}
                  </Box>
                </Box>

                <Box position="relative" overflow="hidden">
                  <Image src={upload.imageUrl} alt={upload.title} width={500} height={300} objectFit="cover" />
                </Box>

                <Badge width="100px" textAlign="center" position="" bottom="0" borderRadius="0" p="3" colorScheme="orange">
                  {upload.category}
                </Badge>
                <Flex p={4} gap={3}>
                  <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                    <IconButton
                      aria-label="Delete upload"
                      icon={<FaTrash />}
                      onClick={() => {
                        setIsDeleteOpen(true);
                        setSelectedUploadId(upload._id);
                      }}
                      colorScheme="black"
                      color="red.500"
                      bg="white"
                      position=""
                    />
                  </Box>
                  <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                    <IconButton aria-label="Edit upload" icon={<FaEdit />} onClick={() => handleEditUpload(upload)} colorScheme="black" color="blue.500" bg="white" />
                  </Box>
                </Flex>
              </Box>
            ))
          ) : (
            <Center>
              <Skeleton height="20px" mb="3" startColor="gray.300" endColor="gray.800" />
              <Skeleton height="20px" mb="3" startColor="gray.300" endColor="gray.800" />
              <Skeleton height="20px" mb="3" startColor="gray.300" endColor="gray.800" />
            </Center>
          )}

          <Upload isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} editedUpload={userData && userData.uploads.find((upload) => upload._id === selectedUploadId)} onSave={handleSaveEdit} onCancel={handleCloseEdit} />

          <AlertDialog isOpen={isDeleteOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
            <AlertDialogOverlay>
              <AlertDialogContent margin="auto">
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Delete Upload
                </AlertDialogHeader>
                <AlertDialogBody>Are you sure? You can't undo this action afterwards.</AlertDialogBody>
                <AlertDialogFooter>
                  <Button ref={cancelRef} onClick={onClose}>
                    Cancel
                  </Button>
                  <Button colorScheme="red" onClick={() => handleRemoveUpload(selectedUploadId)} ml={3}>
                    Delete
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        </Box>
      ) : (
        <Box p={5} m="auto" maxW="420px" display="grid" gap="10">
          <Heading size="lg">Please log in to view your uploads.</Heading>
        </Box>
      )}
    </>
  );
}

export default UserProfile;
