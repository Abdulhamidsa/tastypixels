import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { FormControl, Link as ChakraLink, Text, FormLabel, Input, FormErrorMessage, Button, useToast, Box } from "@chakra-ui/react";
import { useAuth } from "@/context/AuthContext";

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email address").required("Required"),
  password: Yup.string().required("Required"),
});

const Signin = ({ onModalOpen, onModalClose, setFormType }) => {
  const { signin } = useAuth();
  const toast = useToast();

  const handleSignUpClick = () => {
    setFormType("signup");
    onModalOpen();
  };

  const handleLogin = async (values, setErrors) => {
    try {
      const result = await signin(values);
      if (result.success) {
        onModalClose();
        toast({
          title: "Signin Successful! Redirecting...",
          status: "success",
          duration: 1000,
          isClosable: true,
          position: "middle",
        });
      }
    } catch (error) {
      setErrors({ loginError: error.message });
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
      {({ errors }) => (
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
                <Input {...field} id="password" placeholder="password" type="password" autoComplete="true" />
                <FormErrorMessage>{errors.password}</FormErrorMessage>
              </FormControl>
            )}
          </Field>
          {errors.loginError && (
            <Box color="red.300" mt={2}>
              {errors.loginError}
            </Box>
          )}
          <Button mt={4} type="submit">
            Sign In
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
