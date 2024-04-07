import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { FormControl, Text, FormLabel, Input, FormErrorMessage, Button, useToast, Box } from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
// import { signIn, signOut, useSession } from "next-auth/react";
import { useAuth } from "@/context/AuthContext";

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email address").required("Required"),
  password: Yup.string().required("Required"),
});

const Signin = ({ closeModal }) => {
  const router = useRouter();
  const { login } = useAuth();
  const { isLoggedIn } = useAuth();
  // console.log("isLoggedIn", isLoggedIn);
  const [loginStatus, setLoginStatus] = useState("idle");
  const toast = useToast();

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
            const data = await response.json();
            // Store the token in sessionStorage
            // if (data.success === true) {
            // sessionStorage.setItem("token", data.success);
            login();
            // }
            // Update login status
            setLoginStatus("success");

            // Reset login status after a certain time
            setTimeout(() => {
              setLoginStatus("idle");
              closeModal();
              router.push("/");
            }, 3000); // Reset after 3 seconds
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
          <Button mt={4} colorScheme="yellow" isLoading={loginStatus === "loading"} type="submit">
            {loginStatus === "success" ? (
              <>
                <CheckCircleIcon color="green.700" />
              </>
            ) : (
              "Sign In"
            )}
          </Button>
          <Text color="green.300" mt={2}>
            {loginStatus === "success" ? "Log in successful, redirecting..." : null}{" "}
          </Text>
        </Form>
      )}
    </Formik>
  );
};

export default Signin;
