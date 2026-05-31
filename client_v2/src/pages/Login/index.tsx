import { Box } from "@mui/material";
import LoginForm from "./components/LoginForm";
import { BlurredBackground, FormPanel } from "../../components/AuthPageLayout";

export default function LoginPage() {
  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <BlurredBackground />
      <FormPanel>
        <LoginForm />
      </FormPanel>
    </Box>
  );
}
