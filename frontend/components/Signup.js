import { useState } from "react";
import { Formik, Form, Field } from "formik";
import { signupValidationSchema } from "@/utils/validationSchemas";
import { FormControl, Tooltip, Text, FormLabel, Input, FormErrorMessage, Button, Box, useToast, VStack, Heading, Divider, Flex, Icon, Container } from "@chakra-ui/react";
import { useAuth } from "@/context/AuthContext";
import { UsernameField, EmailField } from "@/components/FormFields";
import { FiUserPlus } from "react-icons/fi";

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
    setIsCapsLockActive(e.getModifierState("CapsLock"));
  };

  return (
    <Flex align="center" justify="center" bg="transparent">
      <Container maxW="lg" bg="white" p={{ base: 6, md: 8 }} textAlign="center">
        <VStack spacing={4} align="center">
          <Icon as={FiUserPlus} boxSize={10} color="primary.500" />
          <Heading fontSize={{ base: "2xl", md: "3xl" }} color="primary.700">
            Create an Account
          </Heading>
          <Text fontSize="md" color="gray.600">
            Join the Food Community
          </Text>
        </VStack>

        <Divider my={6} />

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
                title: "Signup Successful! Redirecting...",
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
                  <FormControl isInvalid={form.errors.password && form.touched.password} mb={4}>
                    <FormLabel htmlFor="password" color="secondary.700">
                      Password
                    </FormLabel>
                    <Tooltip label="Caps Lock is on" isOpen={isCapsLockActive} placement="left">
                      <Input {...field} id="password" placeholder="Enter your password" type="password" onKeyUp={handleKeyUp} autoComplete="true" borderColor="gray.300" _focus={{ borderColor: "primary.500", boxShadow: "0 0 0 2px primary.100" }} size="lg" borderRadius="md" />
                    </Tooltip>
                    <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>

              <Field name="repeatPassword">
                {({ field, form }) => (
                  <FormControl isInvalid={form.errors.repeatPassword && form.touched.repeatPassword} mb={6}>
                    <FormLabel htmlFor="repeatPassword" color="secondary.700">
                      Confirm Password
                    </FormLabel>
                    <Tooltip label="Caps Lock is on" isOpen={isCapsLockActive} placement="left">
                      <Input
                        {...field}
                        id="repeatPassword"
                        placeholder="Repeat your password"
                        type="password"
                        onKeyUp={handleKeyUp}
                        autoComplete="true"
                        borderColor="gray.300"
                        _focus={{ borderColor: "primary.500", boxShadow: "0 0 0 2px primary.100" }}
                        size="lg"
                        borderRadius="md"
                      />
                    </Tooltip>
                    <FormErrorMessage>{form.errors.repeatPassword}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>

              <Button mt={4} w="100%" bg="primary.500" color="white" _hover={{ bg: "primary.600" }} _active={{ bg: "primary.700" }} size="lg" type="submit" isLoading={isSubmitting || loading} disabled={!isValid || isSubmitting || loading}>
                Sign Up
              </Button>

              <Text mt={4} fontSize="sm">
                Already have an account?{" "}
                <Text as="span" color="primary.500" fontWeight="bold" cursor="pointer" onClick={handleSignInClick}>
                  Sign in here
                </Text>
              </Text>
            </Form>
          )}
        </Formik>
      </Container>
    </Flex>
  );
};

export default Signup;
