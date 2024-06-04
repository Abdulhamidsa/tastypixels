import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { FormControl, Link as ChakraLink, Text, FormLabel, Input, FormErrorMessage, Button, useToast, Box } from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email address").required("Required"),
  password: Yup.string().required("Required"),
});

const Signin = ({ onModalOpen, onModalClose, setFormType }) => {
  const router = useRouter();
  const { login } = useAuth();
  const { isLoggedIn } = useAuth();
  const [loginStatus, setLoginStatus] = useState("idle");
  const toast = useToast();
  const handleSignUpClick = () => {
    setFormType("signup");
    onModalOpen();
  };

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={validationSchema}
      validateOnBlur={true}
      validateOnChange={false}
      onSubmit={async (values, { setSubmitting, setErrors }) => {
        setLoginStatus("loading");

        try {
          const response = await fetch("/api/api-login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          });

          if (response.ok) {
            toast({
              title: "Signin Successful! Redirecting To Home Page",
              status: "success",
              duration: 2000,
              isClosable: true,
              position: "middle",
              onCloseComplete: () => {
                setLoginStatus("idle");
                onModalClose();
                location.reload();
                router.push("/");
                login();
                setLoginStatus("success");
              },
            });
          } else {
            setLoginStatus("error");
            const errorData = await response.json();
            setErrors({ loginError: errorData.message });
          }
        } catch (error) {
          console.error("Sign in error:", error);
          setLoginStatus("error");
        } finally {
          setSubmitting(false);
        }
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
