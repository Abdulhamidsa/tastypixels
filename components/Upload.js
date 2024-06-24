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
  const [uploadError, setUploadError] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(editedUpload ? editedUpload.countryOfOrigin : null);
  const fileInputRef = useRef(null);
  const inputRef = useRef();
  const toast = useToast();
  const predefinedCategories = ["Vegetarian", "Vegan", "Gluten-Free", "Low-Carb", "High-Protein"];
  const options = countryList().getData();

  useEffect(() => {
    if (editedUpload) {
      setImageUrl(editedUpload.imageUrl);
      setTitle(editedUpload.title);
      setDescription(editedUpload.description);
      setSelectedTags(editedUpload.tags);
      setSelectedCategory(editedUpload.category);
      setSelectedCountry(editedUpload.countryOfOrigin);
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

  const saveToDatabase = () => {
    if (!editedUpload) {
      if (!imageUrl || !title || !description || !selectedCategory || selectedTags.length === 0 || !selectedCountry) {
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
      ...(selectedCountry && { countryOfOrigin: selectedCountry.label }),
    };

    let url = "/api/api-upload-img";
    let method = "POST";

    if (editedUpload) {
      uploadData.uploadId = editedUpload._id;
      url = "/api/api-update-recipe";
      method = "PUT";
    }

    try {
      fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(uploadData),
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
            description: editedUpload ? "Recipe updated successfully." : "Recipe uploaded successfully.",
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
      setUploadError("Failed to save photo to database");
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
        <ModalHeader>{editedUpload ? "Edit Recipe" : "Upload Recipe"}</ModalHeader>
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
            <FormLabel>Country Origin</FormLabel>
            <ChakraSelect value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)} placeholder="Select Country">
              {options.map((country) => (
                <option key={country.value} value={country.value}>
                  {country.label}
                </option>
              ))}
            </ChakraSelect>
          </FormControl>
          <FormControl>
            <FormLabel>Category</FormLabel>
            <ChakraSelect value={selectedCategory} onChange={handleCategorySelect}>
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
            <Input p={1} type="file" accept="image/*" ref={fileInputRef} onChange={handleUpload} />
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
            <Button onClick={saveToDatabase}>{editedUpload ? "SAVE CHANGES" : "UPLOAD"}</Button>
          </ModalFooter>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default Upload;
