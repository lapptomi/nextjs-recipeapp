import { Box } from "@mui/system";
import Footer from "@/components/Footer";

export default function MainLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <Box className="flex min-h-full flex-col">
      <Box className="flex-1">{children}</Box>
      <Footer />
    </Box>
  );
}
