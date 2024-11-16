import { Facebook, Instagram, LinkedIn } from "@mui/icons-material";
import { Typography } from "@mui/material";

import { APPLICATION_NAME } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="flex h-96 flex-col justify-between bg-gray-200 p-24">
      <div className="flex w-full justify-evenly gap-5">
        <div className="flex flex-col gap-2">
          <Typography variant="h4" fontWeight="medium">
            {APPLICATION_NAME}
          </Typography>
          <Typography variant="body1">Your favourite recipe app</Typography>
          <div>
            <Instagram />
            <Facebook />
            <LinkedIn />
          </div>
        </div>

        <div>
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
        </div>
        <div>
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
        </div>
      </div>
      <Typography variant="body2" color="text.secondary">
        © {new Date().getFullYear()} All Rights Reserved jne.
      </Typography>
    </footer>
  );
}