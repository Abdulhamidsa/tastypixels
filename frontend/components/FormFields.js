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
        <FormControl isInvalid={form.errors.username && form.touched.username}>
          <FormLabel htmlFor="username" color="white">
            Username
          </FormLabel>
          <Input
            {...field}
            id="username"
            placeholder="Username"
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
        <FormControl isInvalid={form.errors.email && form.touched.email}>
          <FormLabel htmlFor="email" color="white">
            Email Address
          </FormLabel>
          <Input
            {...field}
            id="email"
            placeholder="Email"
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
