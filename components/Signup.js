import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { FormControl, FormHelperText, Text, FormLabel, Input, FormErrorMessage, Button, Box, useToast } from "@chakra-ui/react";

const passwordValidationRegex = /^(?=.*\d)[a-zA-Z\d]{8,}$/;
const validationSchema = Yup.object({
  username: Yup.string().required("Username is required"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
  password: Yup.string().matches(passwordValidationRegex, "Password must be at least 8 characters long and contain at least one number").required("Password is required"),
  repeatPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Repeat password is required"),
});

const Signup = ({ onModalOpen, setFormType }) => {
  const handleSignInClick = () => {
    setFormType("signin");
    onModalOpen();
  };
  const toast = useToast();

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      const response = await fetch("http://localhost:8000/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      setSubmitting(false);
      if (response.ok) {
        setFieldError("username", "");
        setFieldError("email", "");
        setFieldError("password", "");
        setFieldError("repeatPassword", "");
        toast({
          title: "Signup Successful! Redirecting to signin form",
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "middle",
          onCloseComplete: () => {
            handleSignInClick();
          },
        });
      } else {
        const errorMessage = data.message || "Error signing up";
        if (errorMessage.includes("username")) {
          setFieldError("username", errorMessage);
        }
        if (errorMessage.includes("email")) {
          setFieldError("email", errorMessage);
        }
        if (errorMessage.includes("password")) {
          setFieldError("password", errorMessage);
        }
        if (errorMessage.includes("repeatPassword")) {
          setFieldError("repeatPassword", errorMessage);
        }
      }
    } catch (error) {
      console.error("Signup error:", error);
      setSubmitting(false);
    }
  };

  return (
    <Box display="flex" flexDirection="row">
      <Box width="100%" p={0}>
        <Formik initialValues={{ username: "", email: "", password: "", repeatPassword: "" }} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ isSubmitting }) => (
            <Form>
              <Field name="username">
                {({ field, form }) => (
                  <FormControl isInvalid={form.errors.username && form.touched.username}>
                    <FormLabel htmlFor="username" color="white">
                      Username
                    </FormLabel>
                    <Input {...field} id="username" placeholder="Username" />
                    <FormErrorMessage>{form.errors.username}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="email">
                {({ field, form }) => (
                  <FormControl isInvalid={form.errors.email && form.touched.email}>
                    <FormLabel htmlFor="email" color="white">
                      Email Address
                    </FormLabel>
                    <Input {...field} id="email" placeholder="Email" />
                    <FormHelperText color="gray.300">You don't have to use your real email, anything as long as the format is correct.</FormHelperText>
                    <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="password">
                {({ field, form }) => (
                  <FormControl isInvalid={form.errors.password && form.touched.password}>
                    <FormLabel htmlFor="password" color="white">
                      Password
                    </FormLabel>
                    <Input {...field} id="password" placeholder="Password" type="password" />
                    <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="repeatPassword">
                {({ field, form }) => (
                  <FormControl isInvalid={form.errors.repeatPassword && form.touched.repeatPassword}>
                    <FormLabel htmlFor="repeatPassword" color="white">
                      Repeat Password
                    </FormLabel>
                    <Input {...field} id="repeatPassword" placeholder="Repeat Password" type="password" />
                    <FormErrorMessage>{form.errors.repeatPassword}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Button mt={4} colorScheme="yellow" isLoading={isSubmitting} type="submit">
                Sign Up
              </Button>
            </Form>
          )}
        </Formik>
        <Text as="span" onClick={handleSignInClick} color="blue.500" mt={2} display="block" cursor="pointer">
          Have an account already? Sign in here
        </Text>
      </Box>
    </Box>
  );
};

export default Signup;
