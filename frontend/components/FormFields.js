import { Field, useFormikContext } from "formik";
import { FormControl, FormLabel, Input, FormErrorMessage } from "@chakra-ui/react";
import { checkExistingUsername, checkExistingEmail } from "@/utils/authUtils";

export const UsernameField = () => {
  const { setFieldError } = useFormikContext();

  const validateUsername = async (value) => {
    if (value) {
      const exists = await checkExistingUsername(value);
      if (exists) {
        setFieldError("username", "Username already exists");
      }
    }
  };

  return (
    <Field name="username">
      {({ field, form }) => (
        <FormControl isInvalid={form.errors.username && form.touched.username} mb={4}>
          <FormLabel htmlFor="username" color="secondary.700">
            Username
          </FormLabel>
          <Input
            {...field}
            id="username"
            placeholder="Enter your username"
            borderColor="gray.300"
            _focus={{ borderColor: "primary.500", boxShadow: "0 0 0 2px primary.100" }}
            size="lg"
            borderRadius="md"
            onBlur={async (e) => {
              form.handleBlur(e);
              await validateUsername(e.target.value);
            }}
          />
          <FormErrorMessage>{form.errors.username}</FormErrorMessage>
        </FormControl>
      )}
    </Field>
  );
};

export const EmailField = () => {
  const { setFieldError } = useFormikContext();

  const validateEmail = async (value) => {
    if (value) {
      const exists = await checkExistingEmail(value);
      if (exists) {
        setFieldError("email", "Email already exists");
      }
    }
  };

  return (
    <Field name="email">
      {({ field, form }) => (
        <FormControl isInvalid={form.errors.email && form.touched.email} mb={4}>
          <FormLabel htmlFor="email" color="secondary.700">
            Email Address
          </FormLabel>
          <Input
            {...field}
            id="email"
            placeholder="Enter your email"
            borderColor="gray.300"
            _focus={{ borderColor: "primary.500", boxShadow: "0 0 0 2px primary.100" }}
            size="lg"
            borderRadius="md"
            onBlur={async (e) => {
              form.handleBlur(e);
              await validateEmail(e.target.value);
            }}
          />
          <FormErrorMessage>{form.errors.email}</FormErrorMessage>
        </FormControl>
      )}
    </Field>
  );
};
