import { Box } from "@mui/material";
import {
  BlurredBackground,
  FormPanel,
} from "../../../components/AuthPageLayout";
import RegisterForm from "./-components/RegisterForm";

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
