import { useState } from "react";
import { Box, Button, Input, FormControl, FormLabel } from "@chakra-ui/react";
import { fetchWithTokenRefresh } from "@/utils/auth";

const EditUserInfo = ({ user, onClose, stateChanger, setUpdate }) => {
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const updatedUser = {
      username,
      email,
      password,
    };

    try {
      const response = await fetchWithTokenRefresh("https://api.norpus.com/api/edit-post", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      });

      const data = await response.json();
      if (response.ok) {
        console.log(data);
        stateChanger(data);
        setUpdate(false);
        // This should update the userData state in the parent component
        onClose();
      } else {
        console.error("Error updating user:", data.errors);
      }
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <FormControl id="username" mb={4}>
        <FormLabel>Username</FormLabel>
        <Input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
      </FormControl>
      <FormControl id="email" mb={4}>
        <FormLabel>Email</FormLabel>
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </FormControl>
      <FormControl id="password" mb={4}>
        <FormLabel>Password</FormLabel>
        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </FormControl>
      <Button type="submit" colorScheme="blue" isLoading={loading}>
        Save Changes
      </Button>
    </Box>
  );
};

export default EditUserInfo;
