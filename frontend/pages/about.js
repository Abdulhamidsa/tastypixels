// import React, { useEffect, useState } from "react";
// import { Box, Heading, Text, Spinner, Avatar, Image, Stack } from "@chakra-ui/react";
// import { fetchWithTokenRefresh } from "@/util/auth";

// export default function About() {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await fetchWithTokenRefresh("http://localhost:8000/users/profile");

//         if (!res.ok) {
//           throw new Error("Failed to fetch user data");
//         }

//         const userData = await res.json();
//         setUser(userData);
//       } catch (error) {
//         console.error("Error fetching user data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   if (loading) {
//     return (
//       <Box display="flex" alignItems="center" justifyContent="center" height="100vh">
//         <Spinner size="xl" />
//       </Box>
//     );
//   }

//   if (!user) {
//     return (
//       <Box display="flex" alignItems="center" justifyContent="center" height="100vh">
//         <Text>No user data available</Text>
//       </Box>
//     );
//   }

//   return (
//     <Box p={4}>
//       <Heading mb={4}>About</Heading>
//       <Box mb={6}>
//         <Avatar name={user.username} size="xl" />
//         <Text fontSize="xl" fontWeight="bold">
//           {user.username}
//         </Text>
//         <Text fontSize="md">{user.email}</Text>
//       </Box>

//       <Heading size="md" mb={4}>
//         Uploads
//       </Heading>
//       {user.uploads && user.uploads.length > 0 ? (
//         user.uploads.map((upload) => (
//           <Box key={upload._id} p={4} shadow="md" borderWidth="1px" borderRadius="md" mb={4}>
//             <Heading fontSize="lg">{upload.title}</Heading>
//             <Text>{upload.description}</Text>
//             <Box mt={2}>
//               {upload.tags.map((tag, index) => (
//                 <Text key={index} as="span" mr={2} color="teal.500">
//                   {tag}
//                 </Text>
//               ))}
//             </Box>
//             <Image src={upload.imageUrl} alt={upload.title} mt={2} />
//           </Box>
//         ))
//       ) : (
//         <Text>No uploads available</Text>
//       )}
//     </Box>
//   );
// }

import React from "react";

function about() {
  return <div>about</div>;
}

export default about;
