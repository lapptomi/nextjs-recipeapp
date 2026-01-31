import { Facebook, Instagram, LinkedIn } from "@mui/icons-material";
import { Box, Link, Typography } from "@mui/material";

import { APPLICATION_NAME } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="flex h-96 flex-col justify-between bg-gray-200 p-24">
      <Box className="flex w-full justify-evenly gap-5">
        <Box className="flex flex-col gap-2">
          <Typography variant="h4" fontWeight="medium">
            {APPLICATION_NAME}
          </Typography>
          <Typography variant="body1">Your favourite recipe app</Typography>
          <Box>
            <Instagram />
            <Facebook />
            <LinkedIn />
          </Box>
        </Box>

        <Box>
          <Typography variant="body1" fontWeight="medium">
            Some title
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Some field
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Some field
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Some field
          </Typography>
        </Box>
        <Box>
          <Typography variant="body1" fontWeight="medium">
            Some title
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Some field
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Some field
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Some field
          </Typography>
        </Box>
      </Box>
      <Typography variant="body2" color="text.secondary">
        © {new Date().getFullYear()} All Rights Reserved jne.
      </Typography>

      <Box className="flex flex-row gap-2">
        <Link href="/privacy" variant="body2" color="text.secondary">
          Privacy Policy
        </Link>
        <Link href="/terms" variant="body2" color="text.secondary">
          Terms of Service
        </Link>
      </Box>
    </footer>
  );
}
