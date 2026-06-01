import { Box } from "@mui/material";
import {
  BlurredBackground,
  FormPanel,
} from "../../../components/AuthPageLayout";
import LoginForm from "./-components/LoginForm";

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
