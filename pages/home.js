// import { useState, useRef } from "react";
// import { Box, Button, FormControl, FormErrorMessage, FormLabel, Wrap, Input, Textarea, Select, Tag, TagLabel, TagCloseButton } from "@chakra-ui/react";
// import { useAuth } from "@/context/AuthContext";
// import CardsTemplate from "@/components/CardsTemplate";
// export default function home({ photos }) {
//   const [imageUrl, setImageUrl] = useState("");
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [selectedTags, setSelectedTags] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [tagInput, setTagInput] = useState(""); // State to store the current tag input
//   const [tagError, setTagError] = useState(""); // State to store tag input error message
//   const { isLoggedIn } = useAuth();

//   const fileInputRef = useRef(null); // Create a ref for the file input element
//   const predefinedCategories = ["Vegetarian", "Vegan", "Gluten-Free", "Low-Carb", "High-Protein"];
//   // const predefinedTags = ["Healthy", "Quick", "Easy", "Vegetarian", "Vegan", "Low-Carb", "High-Protein", "Gluten-Free", "Dairy-Free", "Paleo", "Keto"];

//   const handleUpload = async (e) => {
//     try {
//       const file = e.target.files[0];
//       const formData = new FormData();
//       formData.append("file", file);
//       formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME);

//       const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`, {
//         method: "POST",
//         body: formData,
//       });

//       if (!response.ok) {
//         throw new Error("Failed to upload image");
//       }

//       const data = await response.json();
//       setImageUrl(data.secure_url); // Save the image URL
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const saveToDatabase = () => {
//     try {
//       fetch("/api/api-upload-img", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           imageUrl,
//           title,
//           description,
//           tags: selectedTags,
//           category: selectedCategory,
//         }),
//       })
//         .then((response) => {
//           if (!response.ok) {
//             throw new Error("Failed to save photo to database");
//           }
//           console.log("Photo saved to database successfully");
//           // Clear the input fields after successful save
//           setImageUrl("");
//           setTitle("");
//           setDescription("");
//           setSelectedTags([]);
//           setSelectedCategory(""); // Reset selected category
//           if (fileInputRef.current) {
//             fileInputRef.current.value = ""; // Reset the file input field
//           }
//         })
//         .catch((error) => {
//           console.error(error);
//         });
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleDescriptionChange = (e) => {
//     setDescription(e.target.value);
//   };
//   const handleTagInputChange = (e) => {
//     if (e.target.value.length <= 10) {
//       setTagInput(e.target.value);
//       setTagError(""); // Clear tag error if input length is valid
//     } else {
//       setTagError("Tag input cannot exceed 5000 characters");
//     }
//   };

//   const handleAddTag = () => {
//     if (selectedTags.length >= 5 || tagInput.trim() === "") {
//       return;
//     }

//     if (tagInput.trim().length <= 5000) {
//       const formattedTag = `#${tagInput.trim()}`;
//       setSelectedTags([...selectedTags, formattedTag]);
//       setTagInput("");
//       setTagError(""); // Clear tag error if tag input is valid
//     } else {
//       setTagError("Tag input cannot exceed 5000 characters");
//     }
//   };

//   const handleRemoveTag = (tagToRemove) => {
//     setSelectedTags(selectedTags.filter((tag) => tag !== tagToRemove));
//   };

//   const handleCategorySelect = (e) => {
//     setSelectedCategory(e.target.value); // Set selected category
//   };

//   return (
//     <>
//       {isLoggedIn ? (
//         <Box>
//           <FormControl>
//             <FormLabel>Title</FormLabel>
//             <Input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter title" />
//           </FormControl>
//           <FormControl>
//             <FormLabel>Description</FormLabel>
//             <Textarea value={description} onChange={handleDescriptionChange} placeholder="Enter description" />
//           </FormControl>
//           <FormControl isInvalid={tagError !== ""}>
//             <FormLabel>Custom Tags</FormLabel>
//             <Wrap>
//               {selectedTags.map((tag) => (
//                 <Tag key={tag} size="md" borderRadius="full" variant="solid" colorScheme="blue" mr={1} mb={1}>
//                   <TagLabel>{tag}</TagLabel>
//                   <TagCloseButton onClick={() => handleRemoveTag(tag)} />
//                 </Tag>
//               ))}
//             </Wrap>
//             <Input
//               type="text"
//               value={tagInput}
//               onChange={handleTagInputChange}
//               placeholder="Enter custom tags"
//               onKeyDown={(e) => {
//                 if (e.key === "Enter") {
//                   e.preventDefault();
//                   handleAddTag();
//                 }
//               }}
//             />
//             <FormErrorMessage>{tagError}</FormErrorMessage> {/* Display tag error message */}
//           </FormControl>
//           <FormControl>
//             <FormLabel>Category</FormLabel>
//             <Select value={selectedCategory} onChange={handleCategorySelect}>
//               <option value="">Select Category</option>
//               {predefinedCategories.map((category) => (
//                 <option key={category} value={category}>
//                   {category}
//                 </option>
//               ))}
//             </Select>
//           </FormControl>
//           <FormControl>
//             <FormLabel>Image</FormLabel>
//             <Input type="file" ref={fileInputRef} onChange={handleUpload} />
//           </FormControl>
//           {imageUrl && <img src={imageUrl} alt="Uploaded" />}
//           <Button onClick={saveToDatabase}>Save to Database</Button>
//         </Box>
//       ) : (
//         <CardsTemplate />
//       )}
//     </>
//   );
// }
import React from "react";

function home() {
  return <div>home</div>;
}

export default home;
