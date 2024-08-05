import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { FormControl, Link as ChakraLink, Text, FormLabel, Input, FormErrorMessage, Button, useToast, Box } from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import { useAuth } from "@/context/AuthContext";
import { setAccessToken } from "@/util/auth";

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email address").required("Required"),
  password: Yup.string().required("Required"),
});

const Signin = ({ onModalOpen, onModalClose, setFormType }) => {
  const { dispatch } = useAuth();

  // const { login } = useAuth();
  // const { isLoggedIn } = useAuth();
  const [loginStatus, setLoginStatus] = useState("idle");
  const toast = useToast();

  const handleSignUpClick = () => {
    setFormType("signup");
    onModalOpen();
  };

  const handleLogin = async (values, setErrors) => {
    setLoginStatus("loading");

    try {
      const response = await fetch("https://tastypixels-production.up.railway.app/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        // localStorage.setItem("accessToken", data.accessToken); // Store accessToken in localStorage
        toast({
          title: "Signin Successful! Redirecting To Home Page",
          status: "success",
          duration: 1000,
          isClosable: true,
          position: "middle",
          onCloseComplete: () => {
            setLoginStatus("idle");
            onModalClose();
            // login();
            setAccessToken(data.accessToken);
            dispatch({ type: "LOGIN", payload: { accessToken: data.accessToken } });
            // history.push("/home");
            setLoginStatus("success");
            console.log(data.message);
          },
        });
      } else {
        setLoginStatus("error");
        setErrors({ loginError: data.message }); // Use parsed response data
      }
    } catch (error) {
      console.error("Sign in error:", error);
      setLoginStatus("error");
    }
  };

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={validationSchema}
      validateOnBlur={true}
      validateOnChange={false}
      onSubmit={async (values, { setSubmitting, setErrors }) => {
        await handleLogin(values, setErrors);
        setSubmitting(false);
      }}
    >
      {({ isSubmitting, errors }) => (
        <Form>
          <Field name="email">
            {({ field, form }) => (
              <FormControl isInvalid={errors.email && form.touched.email}>
                <FormLabel htmlFor="email">Email Address</FormLabel>
                <Input {...field} id="email" placeholder="email" />
                <FormErrorMessage>{errors.email}</FormErrorMessage>
              </FormControl>
            )}
          </Field>
          <Field name="password">
            {({ field, form }) => (
              <FormControl isInvalid={errors.password && form.touched.password}>
                <FormLabel htmlFor="password">Password</FormLabel>
                <Input {...field} id="password" placeholder="password" type="password" />
                <FormErrorMessage>{errors.password}</FormErrorMessage>
              </FormControl>
            )}
          </Field>
          {errors.loginError && (
            <Box color="red.300" mt={2}>
              {errors.loginError}
            </Box>
          )}
          <Button mt={4} isLoading={loginStatus === "loading"} type="submit">
            {loginStatus === "success" ? (
              <>
                <CheckCircleIcon color="green.700" />
              </>
            ) : (
              "Sign In"
            )}
          </Button>
          <Text as="span" onClick={handleSignUpClick} color="blue.500" mt={2} display="block" cursor="pointer">
            Don't have an account yet? Sign up
          </Text>
        </Form>
      )}
    </Formik>
  );
};

export default Signin;
