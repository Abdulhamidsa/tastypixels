import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FormControl, Text, FormLabel, Input, FormErrorMessage, Button, Box, useToast } from "@chakra-ui/react";
import axios from "axios"; // Import axios for making HTTP requests

const validationSchema = Yup.object({
  username: Yup.string().required("Username is required"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
  password: Yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
  repeatPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Repeat password is required"), // Add required validation for the repeat password field
});

const Signup = ({ isModalOpen, onModalOpen, onModalClose, setFormType }) => {
  const handleSignInClick = () => {
    setFormType("signin");
    onModalOpen();
  };
  const toast = useToast(); // Chakra UI toast hook
  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      const response = await axios.post("/api/api-signup", {
        username: values.username,
        email: values.email,
        password: values.password,
      });

      console.log(response.data); // Logging the response from the API
      setSubmitting(false); // Reset the form submission state
      // Reset form values
      setFieldError("username", "");
      setFieldError("email", "");
      setFieldError("password", "");
      setFieldError("repeatPassword", "");
      // Show success toast in the middle of the screen
      toast({
        title: "Signup Successful!",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "middle",
        onCloseComplete: () => {
          handleSignInClick();
        },
      });
    } catch (error) {
      console.error("Error signing up:", error.response.data.message);
      if (error.response.data.message.includes("username")) {
        setFieldError("username", error.response.data.message);
      }
      if (error.response.data.message.includes("email")) {
        setFieldError("email", error.response.data.message);
      }
      if (error.response.data.message.includes("password")) {
        setFieldError("password", error.response.data.message);
      }
      if (error.response.data.message.includes("repeatPassword")) {
        setFieldError("repeatPassword", error.response.data.message);
      }
      setSubmitting(false); // Reset the form submission state
    }
  };

  return (
    <>
      <Box display="flex" flexDirection="row">
        <Box width="70%" background="black">
          {/* Your image component */}
        </Box>
        <Box width="50%" background="black">
          <Formik
            initialValues={{ username: "", email: "", password: "", repeatPassword: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit} // Adjusted to call our handleSubmit function
          >
            {({ isSubmitting }) => (
              <Form>
                <Field name="username">
                  {({ field, form }) => (
                    <FormControl isInvalid={form.errors.username && form.touched.username}>
                      <FormLabel htmlFor="username">Username</FormLabel>
                      <Input {...field} id="username" placeholder="Username" />
                      <FormErrorMessage>{form.errors.username}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Field name="email">
                  {({ field, form }) => (
                    <FormControl isInvalid={form.errors.email && form.touched.email}>
                      <FormLabel htmlFor="email">Email Address</FormLabel>
                      <Input {...field} id="email" placeholder="Email" />
                      <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <Field name="password">
                  {({ field, form }) => (
                    <FormControl isInvalid={form.errors.password && form.touched.password}>
                      <FormLabel htmlFor="password">Password</FormLabel>
                      <Input {...field} id="password" placeholder="Password" type="password" />
                      <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <Field name="repeatPassword">
                  {({ field, form }) => (
                    <FormControl isInvalid={form.errors.repeatPassword && form.touched.repeatPassword}>
                      <FormLabel htmlFor="repeatPassword">Repeat Password</FormLabel>
                      <Input {...field} id="repeatPassword" placeholder="Repeat Password" type="password" />
                      <FormErrorMessage>{form.errors.repeatPassword}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <Button mt={4} colorScheme="teal" isLoading={isSubmitting} type="submit">
                  Submit
                </Button>
              </Form>
            )}
          </Formik>
        </Box>
      </Box>
      <Text as="span" onClick={handleSignInClick} color="blue.500" mt={2} display="block" cursor="pointer">
        Have an account already? Sign in here
      </Text>
    </>
  );
};

export default Signup;
