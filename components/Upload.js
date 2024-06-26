import React, { useState, useRef, useEffect } from "react";
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
  Select as ChakraSelect,
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
  Spinner,
} from "@chakra-ui/react";
import { ArrowUpIcon } from "@chakra-ui/icons";
import { useAuth } from "@/context/AuthContext";
import countryList from "react-select-country-list";

const Upload = ({ isOpen, onClose, editedUpload }) => {
  const { isLoggedIn, userId } = useAuth();
  const [imageUrl, setImageUrl] = useState(editedUpload ? editedUpload.imageUrl : "");
  const [title, setTitle] = useState(editedUpload ? editedUpload.title : "");
  const [description, setDescription] = useState(editedUpload ? editedUpload.description : "");
  const [selectedTags, setSelectedTags] = useState(editedUpload ? editedUpload.tags : []);
  const [selectedCategory, setSelectedCategory] = useState(editedUpload ? editedUpload.category : "");
  const [tagInput, setTagInput] = useState("");
  const [tagError, setTagError] = useState("");
  const [isFileLoading, setIsFileLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(editedUpload ? editedUpload.countryOfOrigin : undefined);
  const fileInputRef = useRef(undefined);
  const inputRef = useRef();
  const toast = useToast();
  const predefinedCategories = [
    "Appetizers & Snacks",
    "Main Courses",
    "Desserts",
    "Salads",
    "Soups & Stews",
    "Beverages",
    "Breads & Baked Goods",
    "Pasta & Noodles",
    "Rice & Grains",
    "Vegetarian",
    "Vegan",
    "Gluten-Free",
    "Low-Carb",
    "High-Protein",
    "International Cuisine",
    "Holiday Specials",
    "Healthy Choices",
    "Quick & Easy",
    "Comfort Food",
    "Kids Favorites",
  ];
  const options = countryList().getData();

  useEffect(() => {
    if (editedUpload) {
      setImageUrl(editedUpload.imageUrl);
      setTitle(editedUpload.title);
      setDescription(editedUpload.description);
      setSelectedTags(editedUpload.tags);
      setSelectedCategory(editedUpload.category);
      // setSelectedCountry(editedUpload.countryOfOrigin);
    }
  }, [editedUpload]);

  const handleUpload = async (e) => {
    try {
      setIsFileLoading(true);
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
    } finally {
      setIsFileLoading(false);
    }
  };

  const saveToDatabase = async () => {
    if (!editedUpload) {
      if (!imageUrl || !title || !description || !selectedCategory || selectedTags.length === 0) {
        setUploadError("All fields are required");
        return;
      }
    }

    const uploadData = {
      userId,
      ...(imageUrl && { imageUrl }),
      ...(title && { title }),
      ...(description && { description }),
      ...(selectedTags.length > 0 && { tags: selectedTags }),
      ...(selectedCategory && { category: selectedCategory }),
      // ...(selectedCountry && { countryOfOrigin: selectedCountry.label }),
    };

    let url = "/api/api-upload-img";
    let method = "POST";

    if (editedUpload) {
      uploadData.uploadId = editedUpload._id;
      url = "/api/api-update-recipe";
      method = "PUT";
    }

    try {
      setIsUploading(true);
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(uploadData),
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.errors ? responseData.errors.join(", ") : "Failed to save photo to database");
      }

      toast({
        title: "Success",
        description: editedUpload ? "Post updated successfully." : "Post uploaded successfully. Redirecting...",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      onClose();

      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error) {
      console.error(error);
      setUploadError(error.message || "Failed to save photo to database");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setSelectedTags((prevTags) => prevTags.filter((tag) => tag !== tagToRemove));
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
        <ModalHeader>{editedUpload ? "Edit Post" : "Upload Post"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Title</FormLabel>
            <Input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter Dish Title" disabled={isUploading} />
          </FormControl>
          <FormControl>
            <FormLabel>Description</FormLabel>
            <Textarea value={description} onChange={handleDescriptionChange} placeholder="Enter description of your dish" disabled={isUploading} />
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
                disabled={isUploading}
              />
              <InputRightElement>
                <IconButton
                  aria-label="Add tag"
                  icon={<ArrowUpIcon />}
                  onClick={(e) => {
                    e.preventDefault();
                    handleAddTag();
                  }}
                  disabled={isUploading}
                />
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage>{tagError}</FormErrorMessage>
          </FormControl>
          {/* <FormControl>
            <FormLabel>Country Origin</FormLabel>
            <ChakraSelect value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)} placeholder="Select Country" disabled={isUploading}>
              {options.map((country) => (
                <option key={country.value} value={country.value}>
                  {country.label}
                </option>
              ))}
            </ChakraSelect>
          </FormControl> */}
          <FormControl>
            <FormLabel>Category</FormLabel>
            <ChakraSelect value={selectedCategory} onChange={handleCategorySelect} disabled={isUploading}>
              <option value="">Select Category</option>
              {predefinedCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </ChakraSelect>
          </FormControl>
          <FormControl position="relative">
            <FormLabel>Image</FormLabel>
            <Input p={1} type="file" accept="image/*" ref={fileInputRef} onChange={handleUpload} disabled={isUploading} />
            {isFileLoading && <Spinner position="absolute" top="55%" right="5%" transform="translate(-50%, -50%)" />}
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
            <Button onClick={saveToDatabase} isLoading={isUploading} loadingText="Uploading" disabled={isUploading}>
              {editedUpload ? "SAVE CHANGES" : "UPLOAD"}
            </Button>
          </ModalFooter>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default Upload;
