import { useState } from "react";
import { Formik, Form, Field } from "formik";
import { signupValidationSchema } from "@/utils/validationSchemas";
import { FormControl, Tooltip, FormHelperText, Text, FormLabel, Input, FormErrorMessage, Button, Box, useToast } from "@chakra-ui/react";
import { useAuth } from "@/context/AuthContext";
import { UsernameField, EmailField } from "@/components/FormFields";

const Signup = ({ onModalOpen, setFormType }) => {
  const {
    signup,
    state: { loading },
  } = useAuth();
  const toast = useToast();
  const [isCapsLockActive, setIsCapsLockActive] = useState(false);

  const handleSignInClick = () => {
    setFormType("signin");
    onModalOpen();
  };

  const handleKeyUp = (e) => {
    if (e.getModifierState("CapsLock")) {
      setIsCapsLockActive(true);
    } else {
      setIsCapsLockActive(false);
    }
  };

  return (
    <Box display="flex" flexDirection="row">
      <Box width="100%" p={0}>
        <Formik
          initialValues={{ username: "", email: "", password: "", repeatPassword: "" }}
          validationSchema={signupValidationSchema}
          onSubmit={async (values, { setSubmitting, setFieldError, validateForm }) => {
            const errors = await validateForm();
            if (Object.keys(errors).length > 0) {
              setSubmitting(false);
              return;
            }

            try {
              await signup(values);
              toast({
                title: "Signup Successful! Redirecting to signin form",
                status: "success",
                duration: 2000,
                isClosable: true,
                position: "middle",
                onCloseComplete: handleSignInClick,
              });
            } catch (error) {
              const errorMessage = error.message || "Error signing up";
              if (errorMessage.includes("Username already exists")) {
                setFieldError("username", errorMessage);
              } else if (errorMessage.includes("Email already exists")) {
                setFieldError("email", errorMessage);
              } else {
                toast({
                  title: "Error",
                  description: errorMessage,
                  status: "error",
                  duration: 3000,
                  isClosable: true,
                  position: "top",
                });
              }
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting, isValid }) => (
            <Form>
              <UsernameField />
              <EmailField />
              <Field name="password">
                {({ field, form }) => (
                  <FormControl isInvalid={form.errors.password && form.touched.password}>
                    <FormLabel htmlFor="password" color="white">
                      Password
                    </FormLabel>
                    <Tooltip label="Caps Lock is on" isOpen={isCapsLockActive} placement="left">
                      <Input {...field} id="password" placeholder="Password" type="password" onKeyUp={handleKeyUp} autoComplete="true" />
                    </Tooltip>
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
                    <Tooltip label="Caps Lock is on" isOpen={isCapsLockActive} placement="left">
                      <Input {...field} id="repeatPassword" placeholder="Repeat Password" type="password" onKeyUp={handleKeyUp} autoComplete="true" />
                    </Tooltip>
                    <FormErrorMessage>{form.errors.repeatPassword}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Button mt={4} colorScheme="yellow" isLoading={isSubmitting || loading} type="submit" disabled={!isValid || isSubmitting || loading}>
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
