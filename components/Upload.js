import { useState, useRef } from "react";
import { Box, Button, FormControl, Alert, AlertIcon, FormErrorMessage, FormLabel, Wrap, Input, Textarea, Select, Tag, TagLabel, TagCloseButton, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton } from "@chakra-ui/react";
import { useAuth } from "@/context/AuthContext";
import CardsTemplate from "@/components/CardsTemplate";

const UploadPopup = ({ isOpen, onClose, closeMenu }) => {
  const [imageUrl, setImageUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tagError, setTagError] = useState("");
  const { isLoggedIn, userId } = useAuth();
  const fileInputRef = useRef(null);
  const [uploadError, setUploadError] = useState(""); // State for upload error message

  const predefinedCategories = ["Vegetarian", "Vegan", "Gluten-Free", "Low-Carb", "High-Protein"];
  const handleUpload = async (e) => {
    try {
      const file = e.target.files[0];
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

      // Apply transformations to resize and crop the image
      const transformedImageUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${data.public_id}.${data.format}`;
      setImageUrl(transformedImageUrl); // Save the transformed image URL
    } catch (error) {
      console.error(error);
    }
  };

  const saveToDatabase = () => {
    try {
      fetch("/api/api-upload-img", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          imageUrl,
          title,
          description,
          tags: selectedTags,
          category: selectedCategory,
        }),
      })
        .then(async (response) => {
          const responseData = await response.json();
          if (!response.ok) {
            throw new Error(responseData.errors ? responseData.errors.join(", ") : "Failed to save photo to database");
          }
          console.log("Photo saved to database successfully");
          // setImageUrl("");
          // setTitle("");
          // setDescription("");
          // setSelectedTags([]);
          // setSelectedCategory("");
          // if (fileInputRef.current) {
          //   fileInputRef.current.value = "";
          // }
          // setUploadError(""); // Reset upload error if request is successful
        })
        .catch((error) => {
          console.error(error);
          setUploadError(error.message || "Failed to save photo to database");
        });
    } catch (error) {
      console.error(error);
    }
  };
  const handleAddTag = () => {
    if (selectedTags.length >= 5 || tagInput.trim() === "") {
      return;
    }

    if (tagInput.trim().length <= 5000) {
      const formattedTag = `#${tagInput.trim()}`;
      setSelectedTags([...selectedTags, formattedTag]);
      // setTagInput("");
      // setTagError("");
    } else {
      setTagError("Tag input cannot exceed 5000 characters");
    }
  };
  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };
  const handleTagInputChange = (e) => {
    if (e.target.value.length <= 10) {
      setTagInput(e.target.value);
      setTagError("");
    } else {
      setTagError("Tag input cannot exceed 5000 characters");
    }
  };

  const handleCategorySelect = (e) => {
    setSelectedCategory(e.target.value);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Upload Photo</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isLoggedIn ? (
            <Box>
              <FormControl>
                <FormLabel>Title</FormLabel>
                <Input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter title" />
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea value={description} onChange={handleDescriptionChange} placeholder="Enter description" />
              </FormControl>
              <FormControl isInvalid={tagError !== ""}>
                <FormLabel>Custom Tags</FormLabel>
                <Wrap>
                  {selectedTags.map((tag) => (
                    <Tag key={tag} size="md" borderRadius="full" variant="solid" colorScheme="blue" mr={1} mb={1}>
                      <TagLabel>{tag}</TagLabel>
                      <TagCloseButton onClick={() => handleRemoveTag(tag)} />
                    </Tag>
                  ))}
                </Wrap>
                <Input
                  type="text"
                  value={tagInput}
                  onChange={handleTagInputChange}
                  placeholder="Enter custom tags"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <FormErrorMessage>{tagError}</FormErrorMessage>
              </FormControl>
              <FormControl>
                <FormLabel>Category</FormLabel>
                <Select value={selectedCategory} onChange={handleCategorySelect}>
                  <option value="">Select Category</option>
                  {predefinedCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Image</FormLabel>
                <Input type="file" ref={fileInputRef} onChange={handleUpload} />
              </FormControl>
              {imageUrl && <img src={imageUrl} alt="Uploaded" />}
              {uploadError && !uploadError.includes("maximum limit of uploads") && (
                <Alert status="error" mb={4}>
                  <AlertIcon />
                  {uploadError}
                </Alert>
              )}
              {uploadError && uploadError.includes("maximum limit of uploads") && (
                <Alert status="error" mb={4}>
                  <AlertIcon />
                  User has reached the maximum limit of uploads
                </Alert>
              )}
              <Button onClick={saveToDatabase}>Save to Database</Button>
            </Box>
          ) : (
            <CardsTemplate />
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default UploadPopup;
