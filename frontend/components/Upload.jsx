import React, { useState, useRef, useEffect } from "react";
import {
  InputGroup,
  InputRightElement,
  IconButton,
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
  Box,
} from "@chakra-ui/react";
import { ArrowUpIcon } from "@chakra-ui/icons";
import useUpload from "@/hooks/useUpload";

const Upload = ({ imageUrl, isOpen, onClose, editedUpload, addNewUpload }) => {
  const [title, setTitle] = useState(editedUpload ? editedUpload.title : "");
  const [description, setDescription] = useState(editedUpload ? editedUpload.description : "");
  const [selectedTags, setSelectedTags] = useState(editedUpload ? editedUpload.tags : []);
  const [selectedCategory, setSelectedCategory] = useState(editedUpload ? editedUpload.category : "");
  const [tagInput, setTagInput] = useState("");
  const [tagError, setTagError] = useState("");
  const fileInputRef = useRef(undefined);
  const inputRef = useRef();

  const { isFileLoading, isUploading, uploadError, handleUpload, saveToDatabase } = useUpload(editedUpload, onClose);
  const [isImageUpdated, setIsImageUpdated] = useState(false);

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

  useEffect(() => {
    if (editedUpload) {
      setTitle(editedUpload.title);
      setDescription(editedUpload.description);
      setSelectedTags(editedUpload.tags);
      setSelectedCategory(editedUpload.category);
    }
  }, [editedUpload]);

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setIsImageUpdated(true);
    handleUpload(file);
  };

  const handleSave = async () => {
    const imageToSave = isImageUpdated ? imageUrl : editedUpload?.imageUrl;

    const newUpload = await saveToDatabase(
      {
        title,
        description,
        selectedTags,
        selectedCategory,
        imageUrl: imageToSave,
      },
      editedUpload
    );

    if (newUpload && !editedUpload) {
      addNewUpload(newUpload);
    }
  };

  return (
    <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bg="background.dark" color="text.dark" borderRadius="lg" p={6}>
        <ModalHeader fontSize="xl" fontWeight="bold" color="primary.500">
          {editedUpload ? "Edit Post" : "Upload Post"}
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <FormControl>
            <FormLabel color="text.dark">Title</FormLabel>
            <Input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter Dish Title" disabled={isUploading} />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel color="text.dark">Description</FormLabel>
            <Textarea value={description} onChange={handleDescriptionChange} placeholder="Enter description of your dish" disabled={isUploading} />
          </FormControl>

          <FormControl mt={4} isInvalid={tagError !== ""}>
            <FormLabel color="text.dark">Custom Tags</FormLabel>
            <Wrap>
              {selectedTags.map((tag) => (
                <Tag key={tag} size="md" borderRadius="full" variant="solid" colorScheme="primary" mr={1} mb={1}>
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
                <IconButton aria-label="Add tag" icon={<ArrowUpIcon />} onClick={handleAddTag} disabled={isUploading} />
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage>{tagError}</FormErrorMessage>
          </FormControl>

          <FormControl mt={4}>
            <FormLabel color="text.dark">Category</FormLabel>
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
            <Input p={1} type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} disabled={isUploading} />
            {isFileLoading && <Spinner position="absolute" top="55%" right="5%" transform="translate(-50%, -50%)" />}
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button onClick={handleSave} isLoading={isUploading} loadingText="Uploading" bg="primary.500" color="white" _hover={{ bg: "primary.600" }}>
            {editedUpload ? "SAVE CHANGES" : "UPLOAD"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default Upload;
