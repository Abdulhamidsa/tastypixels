import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { FormControl, FormLabel, Input, FormErrorMessage, Button, Box } from "@chakra-ui/react";
import Image from "next/image";
const validationSchema = Yup.object({
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email address").required("Required"),
  password: Yup.string().min(8, "Password must be at least 8 characters").matches(/\d/, "Password must contain a number").required("Required"),
});

const Signup = () => {
  return (
    <>
      <Box display="flex" flexDirection="row">
        <Box width="70%" background="blue">
          <Image src="/next.svg" width={100} height={100} alt="Description of image" />
        </Box>
        <Box width="50%" background="red">
          <Formik
            initialValues={{ firstName: "", lastName: "", email: "", password: "" }}
            validationSchema={validationSchema}
            validateOnBlur={true}
            validateOnChange={false}
            onSubmit={(values, { setSubmitting }) => {
              setTimeout(() => {
                alert(JSON.stringify(values, null, 2));
                setSubmitting(false);
              }, 400);
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <Field name="firstName">
                  {({ field, form }) => (
                    <FormControl isInvalid={form.errors.firstName && form.touched.firstName}>
                      <FormLabel htmlFor="firstName">First Name</FormLabel>
                      <Input {...field} id="firstName" placeholder="First Name" />
                      <FormErrorMessage>{form.errors.firstName}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Field name="lastName">
                  {({ field, form }) => (
                    <FormControl isInvalid={form.errors.lastName && form.touched.lastName}>
                      <FormLabel htmlFor="lastName">Last Name</FormLabel>
                      <Input {...field} id="lastName" placeholder="Last Name" />
                      <FormErrorMessage>{form.errors.lastName}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Field name="email">
                  {({ field, form }) => (
                    <FormControl isInvalid={form.errors.email && form.touched.email}>
                      <FormLabel htmlFor="email">Email Address</FormLabel>
                      <Input {...field} id="email" placeholder="email" />
                      <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <Field name="password">
                  {({ field, form }) => (
                    <FormControl isInvalid={form.errors.password && form.touched.password}>
                      <FormLabel htmlFor="password">Password</FormLabel>
                      <Input {...field} id="password" placeholder="password" type="password" />
                      <FormErrorMessage>{form.errors.password}</FormErrorMessage>
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
    </>
  );
};

export default Signup;
