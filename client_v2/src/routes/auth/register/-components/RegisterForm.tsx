import { Link } from "@tanstack/react-router";
import { Box, Button, styled, TextField, Typography } from "@mui/material";
import { APPLICATION_NAME } from "../../../../constants";
import { apiClient } from "../../../../lib/apiClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useMutation } from "@tanstack/react-query";
import { useLogin } from "../../../../hooks/useLogin";

const UserSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  username: z.string().min(4).max(20),
  password: z.string().min(8).max(64),
  confirmPassword: z.string().min(8).max(64),
});

type NewUser = z.infer<typeof UserSchema>;

const FormWrapper = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: 16,
  width: "100%",
  maxWidth: 400,
});

export default function RegisterForm() {
  const loginMutation = useLogin();

  const addUserMutation = useMutation({
    mutationFn: (newUser: NewUser) =>
      apiClient.post("/users", {
        email: newUser.email,
        username: newUser.username,
        password: newUser.password,
      }),
    onSuccess: (response) => {
      console.log("User created successfully");
      console.log(response);
      loginMutation.mutate({
        email: response.email,
        password: getValues("password"),
      });
    },
    onError: () => {
      console.log("Failed to create user");
    },
  });

  const { register, handleSubmit, formState, getValues } = useForm<NewUser>({
    defaultValues: {
      email: "",
      username: "",
      password: "",
    },
    resolver: zodResolver(UserSchema),
  });

  const handleFormSubmit = (newUser: NewUser) => {
    addUserMutation.mutate(newUser);
  };

  return (
    <FormWrapper>
      <Typography component="h1" variant="h5">
        Sign Up
      </Typography>

      {formState.errors && (
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          {Object.entries(formState.errors).map(([key, error]) => (
            <Typography color="error" key={key} variant="body2">
              {error.message}
            </Typography>
          ))}
        </Box>
      )}

      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <TextField
          margin="normal"
          required
          fullWidth
          label="Email Address"
          autoFocus
          {...register("email")}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Username"
          {...register("username")}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Password"
          type="password"
          {...register("password")}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Confirm Password"
          type="password"
          {...register("confirmPassword")}
        />
        <Button
          loading={addUserMutation.isPending}
          disabled={addUserMutation.isPending}
          color="primary"
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 1 }}
          onClick={handleSubmit(handleFormSubmit, (error) =>
            console.log("ERROR = ", error),
          )}
        >
          Sign Up
        </Button>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          variant="body2"
          color="text.primary"
          sx={{ cursor: "pointer" }}
        >
          Forgot password?
        </Typography>
        <Link to="/auth/login" style={{ textDecoration: "none" }}>
          <Typography variant="body2" color="text.primary">
            Already have an account? Sign In
          </Typography>
        </Link>
      </Box>

      <Typography variant="body2" color="text.secondary" align="center">
        {`Copyright © ${APPLICATION_NAME} ${new Date().getFullYear()}.`}
      </Typography>
    </FormWrapper>
  );
}
