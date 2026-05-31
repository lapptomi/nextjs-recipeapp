import { Box } from "@mui/material";
import RegisterForm from "./components/RegisterForm";
import { BlurredBackground, FormPanel } from "../../components/AuthPageLayout";

export default function RegisterPage() {
  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <BlurredBackground />
      <FormPanel>
        <RegisterForm />
      </FormPanel>
    </Box>
  );
}
