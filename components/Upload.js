import { React, useState, useRef } from "react";
import {
  Box,
  InputGroup,
  InputRightElement,
  IconButton,
  useToast,
  Button,
  FormControl,
  Alert,
  AlertIcon,
  FormErrorMessage,
  FormLabel,
  Wrap,
  Input,
  Textarea,
  Select,
  Tag,
  TagLabel,
  TagCloseButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
} from "@chakra-ui/react";
import { ArrowUpIcon } from "@chakra-ui/icons";
import { useAuth } from "@/context/AuthContext";

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
  const toast = useToast();

  const [uploadError, setUploadError] = useState("");
  const inputRef = useRef();

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
      const transformedImageUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${data.public_id}.${data.format}`;
      setImageUrl(transformedImageUrl);
    } catch (error) {
      console.error(error);
    }
  };

  const saveToDatabase = () => {
    if (!imageUrl || !title || !description || !selectedCategory || selectedTags.length === 0) {
      setUploadError("All fields are required");
      return;
    }
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
          onClose();
          toast({
            title: "Success",
            description: "Photo uploaded successfully. Redirecting...",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        })
        .catch((error) => {
          console.error(error);
          setUploadError(error.message || "Failed to save photo to database");
        });
    } catch (error) {
      console.error(error);
    }
  };
  const handleRemoveTag = (tagToRemove) => {
    setSelectedTags((prevTags) => {
      const index = prevTags.indexOf(tagToRemove);
      if (index !== -1) {
        return [...prevTags.slice(0, index), ...prevTags.slice(index + 1)];
      }
      return prevTags;
    });
    // Set focus back to the input field
    inputRef.current.focus();
  };
  const handleAddTag = () => {
    if (tagInput.trim() === "") {
      setTagError("Tag input is empty");
      return;
    }

    if (selectedTags.length >= 4) {
      setTagError("Only 4 tags are allowed");
      return;
    }

    if (selectedTags.includes(`#${tagInput.trim()}`)) {
      setTagError("Tag already exists");
      return;
    }

    if (tagInput.trim().length <= 10) {
      const formattedTag = `#${tagInput.trim()}`;
      setSelectedTags([...selectedTags, formattedTag]);
      setTagInput("");
    } else {
      setTagError("Tag input cannot exceed 10 characters");
    }
    inputRef.current.focus();
  };

  const handleTagInputChange = (e) => {
    if (e.target.value.length <= 10) {
      setTagInput(e.target.value);
      setTagError("");
    } else {
      setTagError("Tag input cannot exceed 10 characters");
    }
  };
  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };
  const handleCategorySelect = (e) => {
    setSelectedCategory(e.target.value);
  };

  return (
    <Modal size="lg" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Upload Recipe</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Title</FormLabel>
            <Input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter Dish Title" />
          </FormControl>
          <FormControl>
            <FormLabel>Description</FormLabel>
            <Textarea value={description} onChange={handleDescriptionChange} placeholder="Enter description of your dish" />
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
            <InputGroup>
              <Input
                ref={inputRef}
                type="search"
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
              <InputRightElement>
                <IconButton
                  aria-label="Add tag"
                  icon={<ArrowUpIcon />}
                  onClick={(e) => {
                    e.preventDefault();
                    handleAddTag();
                  }}
                />
              </InputRightElement>
            </InputGroup>
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
            <Input p={1} type="file" ref={fileInputRef} onChange={handleUpload} />
          </FormControl>
          {uploadError && !uploadError.includes("maximum limit of uploads") && (
            <Alert status="error" mb={4}>
              <AlertIcon />
              {uploadError}
            </Alert>
          )}
          {uploadError && uploadError.includes("maximum limit of uploads") && (
            <Alert status="error" mb={4}>
              <AlertIcon />
              You have reached the maximum limit of uploads
            </Alert>
          )}
          <ModalFooter>
            <Button onClick={saveToDatabase}>UPLOAD</Button>
          </ModalFooter>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default UploadPopup;
