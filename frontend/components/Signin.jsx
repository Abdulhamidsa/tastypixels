import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import {
  FormControl,
  Text,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
  useToast,
  Box,
  VStack,
  Heading,
  Divider,
  Flex,
  Icon,
  Container,
} from '@chakra-ui/react';
import { FiLogIn } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Required'),
  password: Yup.string().required('Required'),
  loginError: Yup.string(),
});

const Signin = ({ onModalClose }) => {
  const { signin } = useAuth();
  const toast = useToast();

  const handleLogin = async (values, setErrors) => {
    try {
      const result = await signin(values);
      if (result.success) {
        onModalClose();
        toast({
          title: 'Signin Successful! Redirecting...',
          status: 'success',
          duration: 1000,
          isClosable: true,
          position: 'top',
        });
      }
    } catch (error) {
      setErrors({ loginError: error.message });
    }
  };

  return (
    <Flex align="center" justify="center" bg="transparent">
      <Container maxW="lg" bg="transparent" p={{ base: 6, md: 8 }} textAlign="center">
        <VStack spacing={4} align="center">
          <Icon as={FiLogIn} boxSize={10} color="primary.500" />
          <Heading fontSize={{ base: '2xl', md: '3xl' }} color="white">
            Welcome Back!
          </Heading>
          <Text fontSize="md" color="gray.600">
            Sign in to continue
          </Text>
        </VStack>

        <Divider my={6} />
        <Formik
          initialValues={{ email: '', password: '', loginError: '' }}
          validationSchema={validationSchema}
          validateOnBlur={true}
          validateOnChange={false}
          onSubmit={async (values, { setSubmitting, setErrors }) => {
            await handleLogin(values, setErrors);
            setSubmitting(false);
          }}
        >
          {({ errors, isSubmitting }) => (
            <Form>
              <Field name="email">
                {({ field, form }) => (
                  <FormControl isInvalid={errors.email && form.touched.email} mb={4}>
                    <FormLabel htmlFor="email" color="background.light">
                      Email Address
                    </FormLabel>
                    <Input
                      {...field}
                      id="email"
                      placeholder="Enter your email"
                      borderColor="gray.300"
                      _focus={{ borderColor: 'primary.500', boxShadow: '0 0 0 2px primary.100' }}
                      size="lg"
                      borderRadius="md"
                      w="100%"
                    />
                    <FormErrorMessage>{errors.email}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>

              <Field name="password">
                {({ field, form }) => (
                  <FormControl isInvalid={errors.password && form.touched.password} mb={4}>
                    <FormLabel htmlFor="password" color="background.light">
                      Password
                    </FormLabel>
                    <Input
                      {...field}
                      id="password"
                      placeholder="Enter your password"
                      type="password"
                      borderColor="gray.300"
                      _focus={{ borderColor: 'primary.500', boxShadow: '0 0 0 2px primary.100' }}
                      size="lg"
                      borderRadius="md"
                      w="100%"
                    />
                    <FormErrorMessage>{errors.password}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>

              {errors.loginError && (
                <Box color="red.500" mt={2} textAlign="center">
                  {errors.loginError}
                </Box>
              )}

              <Button
                mt={6}
                w="100%"
                bg="primary.500"
                color="white"
                _hover={{ bg: 'primary.600' }}
                _active={{ bg: 'primary.700' }}
                size="lg"
                type="submit"
                isLoading={isSubmitting}
              >
                Sign In
              </Button>
            </Form>
          )}
        </Formik>
      </Container>
    </Flex>
  );
};

export default Signin;
